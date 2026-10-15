import { consumerScope } from './consumer-scope.js';
import { userInfo } from 'node:os';
import { Store } from './store.js';
import { descriptor, parseProof, matchesProof } from './credentials.js';
import { refuse, success } from './contract.js';

export const LIFETIME = 30 * 24 * 60 * 60 * 1000;
export function publicActor(actor, now) {
  const { verifier, ...credential } = actor.credential;
  credential.status = credential.invalidated ? 'invalidated' : now >= credential.expiresMs ? 'expired' : 'active';
  return { ...actor, credential };
}
export function origin(actor, time) {
  return actor ? { origin: 'member', actorId: actor.actorId, label: actor.label, time: new Date(time).toISOString() } : { origin: 'host_operator', principal: String(userInfo().uid), time: new Date(time).toISOString() };
}
export function registration(input, now, attribution) {
  return { credentialId: input.credentialId, verifier: input.verifier, registrationRevision: input.registrationRevision, issuedMs: now, expiresMs: now + LIFETIME, issuedAt: new Date(now).toISOString(), expiresAt: new Date(now + LIFETIME).toISOString(), invalidated: false, latestChange: attribution };
}
export function initialActor(input, label, responsibilities, now, attribution) {
  return {
    actorId: input.actorId, label, responsibilities, membership: 'admitted',
    membershipVersion: '1', credentialRevision: '1',
    firstAdmission: { ...attribution, timeMs: now }, latestMembershipChange: attribution,
    credential: registration(input, now, attribution),
  };
}
export function authorize(actor, kind, subject = {}) {
  const roles = actor.responsibilities;
  const has = role => roles.includes(role);
  const allowed = kind === 'shared_read' ||
    (['source_submit', 'request_submit'].includes(kind) && has('Contributor')) ||
    (['request_retry', 'request_cancel'].includes(kind) && (has('Operations') || (has('Contributor') && subject.submittingActorId === actor.actorId))) ||
    (kind === 'selection' && has('Reviewer')) ||
    (['evidence_check', 'provisional_cleanup'].includes(kind) && has('Operations')) ||
    (['membership_manage', 'responsibilities_manage', 'accepted_media_delete', 'deletion_followup'].includes(kind) && has('Manager'));
  if (!allowed) refuse(403, 'forbidden', 'Current responsibilities do not permit this action.');
}
export class Authority {
  constructor(path, { clock = Date.now, ...storage } = {}) { this.store = new Store(path, storage); this.clock = clock; }
  authenticate(scope, proof, now) {
    if (!scope.workspace()) refuse(503, 'uninitialized', 'Workspace initialization is required.');
    const actor = scope.credential(proof.credentialId);
    if (!actor || actor.membership !== 'admitted' || actor.credential.invalidated || now >= actor.credential.expiresMs || !matchesProof(proof, actor.credential)) refuse(401, 'unauthenticated', 'A valid current bearer credential is required.');
    return actor;
  }
  // Subject facts and consumer work are loaded/executed within this owned scope.
  // Neither credentials nor an authorization boolean escape to the consumer.
  async admit(bearer, kind, loadSubject, apply) {
    const proof = parseProof(bearer);
    return this.store.write(scope => {
      const actor = this.authenticate(scope, proof, this.clock());
      const consumer = consumerScope(scope.sql);
      try {
        const subject = loadSubject(consumer.read, { actorId: actor.actorId });
        if (subject && typeof subject.then === 'function') throw new Error('Subject loading must be synchronous');
        const now = this.clock();
        this.authenticate(scope, proof, now); authorize(actor, kind, subject);
        const result = apply(consumer.write, { actorId: actor.actorId, label: actor.label, time: new Date(now).toISOString() }, subject);
        if (result && typeof result.then === 'function') throw new Error('Consumer admission must be synchronous');
        return result;
      } finally { consumer.close(); }
    });
  }
  read(bearer, operation) {
    const proof = parseProof(bearer);
    return this.store.read(scope => {
      const now = this.clock();
      const actor = this.authenticate(scope, proof, now);
      return operation(scope, actor, now);
    });
  }
  async mutate(bearer, operation) {
    const proof = parseProof(bearer);
    return this.store.write(scope => {
      const actor = this.authenticate(scope, proof, this.clock());
      const now = this.clock();
      this.authenticate(scope, proof, now);
      return operation(scope, actor, now, () => {
        this.store.faults.beforeGate?.();
        const applicationTime = this.clock();
        this.authenticate(scope, proof, applicationTime);
        return applicationTime;
      });
    });
  }
  async bootstrap(input, label) {
    descriptor(input);
    return this.store.write(scope => {
      if (scope.workspace()) refuse(409, 'already_initialized', 'Workspace is already initialized; bootstrap never changes it.');
      if (input.expectedCredentialRevision !== '0') refuse(400, 'invalid_binding', 'Bootstrap requires revision-one material.');
      const now = this.clock(); const attribution = origin(null, now);
      const actor = initialActor(input, label, ['Manager'], now, attribution);
      scope.saveActor(actor); scope.setWorkspace({ initialManagerActorId: actor.actorId, initializedAt: new Date(now).toISOString() });
      return success(publicActor(actor, now), true);
    });
  }
}
