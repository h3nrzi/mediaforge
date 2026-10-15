import { consumerScope } from './consumer-scope.js';
import { userInfo } from 'node:os';
import { Store } from './store.js';
import { descriptor, parseProof, matchesProof } from './credentials.js';
import { refuse, success } from './contract.js';

export const LIFETIME = 30 * 24 * 60 * 60 * 1000;

/**
 * Build public actor facts without exposing the stored credential verifier.
 *
 * @param {object} actor - Current or retained actor facts.
 * @param {number} now - Current server time in epoch milliseconds.
 * @returns {object} Public actor and non-secret credential facts.
 */
export function publicActor(actor, now) {
  // Remove private verifier material before building client-visible facts.
  const { verifier, ...credential } = actor.credential;
  credential.status = credential.invalidated
    ? 'invalidated'
    : now >= credential.expiresMs
      ? 'expired'
      : 'active';
  return { ...actor, credential };
}

/**
 * Capture member attribution or the local operator identity at the application time.
 *
 * @param {object|null} actor - Authenticated actor, or null for host-operator attribution.
 * @param {number} time - Application time in epoch milliseconds.
 * @returns {object} Member or host-operator attribution.
 */
export function origin(actor, time) {
  return actor
    ? {
        origin: 'member',
        actorId: actor.actorId,
        label: actor.label,
        time: new Date(time).toISOString(),
      }
    : {
        origin: 'host_operator',
        principal: String(userInfo().uid),
        time: new Date(time).toISOString(),
      };
}

/**
 * Create credential metadata with the fixed thirty-day lifetime.
 *
 * @param {object} input - Validated registration descriptor.
 * @param {number} now - Current server time in epoch milliseconds.
 * @param {object} attribution - Stable action-time actor or operator attribution.
 * @returns {object} New registration metadata with its original expiry.
 */
export function registration(input, now, attribution) {
  return {
    credentialId: input.credentialId,
    verifier: input.verifier,
    registrationRevision: input.registrationRevision,
    issuedMs: now,
    expiresMs: now + LIFETIME,
    issuedAt: new Date(now).toISOString(),
    expiresAt: new Date(now + LIFETIME).toISOString(),
    invalidated: false,
    latestChange: attribution,
  };
}

/**
 * Build the shared initial membership, revision and attribution state.
 *
 * @param {object} input - Validated registration descriptor.
 * @param {string} label - Exact current display label.
 * @param {string[]} responsibilities - Complete independent responsibility set.
 * @param {number} now - Current server time in epoch milliseconds.
 * @param {object} attribution - Stable action-time actor or operator attribution.
 * @returns {object} Initial admitted actor state.
 */
export function initialActor(input, label, responsibilities, now, attribution) {
  return {
    actorId: input.actorId,
    label,
    responsibilities,
    membership: 'admitted',
    membershipVersion: '1',
    credentialRevision: '1',
    firstAdmission: { ...attribution, timeMs: now },
    latestMembershipChange: attribution,
    credential: registration(input, now, attribution),
  };
}

/**
 * Require the current responsibility set and authoritative request ownership for an action.
 *
 * @param {object} actor - Current or retained actor facts.
 * @param {string} kind - Requested policy action kind.
 * @param {object} [subject] - Authoritative consumer subject facts.
 * @returns {void} Returns only when current policy permits the action.
 */
export function authorize(actor, kind, subject = {}) {
  const roles = actor.responsibilities;

  /**
   * Check whether the actor holds one independently assigned responsibility.
   */
  const has = (role) => roles.includes(role);

  // Union independent responsibilities; request ownership grants only Contributor own-request actions.
  const allowed =
    kind === 'shared_read' ||
    (['source_submit', 'request_submit'].includes(kind) && has('Contributor')) ||
    (['request_retry', 'request_cancel'].includes(kind) &&
      (has('Operations') || (has('Contributor') && subject.submittingActorId === actor.actorId))) ||
    (kind === 'selection' && has('Reviewer')) ||
    (['evidence_check', 'provisional_cleanup'].includes(kind) && has('Operations')) ||
    ([
      'membership_manage',
      'responsibilities_manage',
      'accepted_media_delete',
      'deletion_followup',
    ].includes(kind) &&
      has('Manager'));
  if (!allowed) refuse(403, 'forbidden', 'Current responsibilities do not permit this action.');
}

export class Authority {
  /**
   * Open authority storage with the configured clock and transaction controls.
   *
   * @param {string} path - Explicit filesystem or HTTP target path.
   * @param {object} [options] - Optional construction or transport settings.
   */
  constructor(path, { clock = Date.now, ...storage } = {}) {
    this.store = new Store(path, storage);
    this.clock = clock;
  }

  /**
   * Resolve a current admitted actor from an exact, unexpired credential proof.
   *
   * @param {object} scope - Persistence operations in the owned transaction.
   * @param {object} proof - Parsed credential locator and hashed secret proof.
   * @param {number} now - Current server time in epoch milliseconds.
   * @returns {object} The currently authenticated admitted actor.
   */
  authenticate(scope, proof, now) {
    // Uninitialized, removed, invalidated and expired identities never authorize new calls.
    if (!scope.workspace()) refuse(503, 'uninitialized', 'Workspace initialization is required.');
    const actor = scope.credential(proof.credentialId);
    if (
      !actor ||
      actor.membership !== 'admitted' ||
      actor.credential.invalidated ||
      now >= actor.credential.expiresMs ||
      !matchesProof(proof, actor.credential)
    )
      refuse(401, 'unauthenticated', 'A valid current bearer credential is required.');
    return actor;
  }
  // Subject facts and consumer work are loaded/executed within this owned scope.
  // Neither credentials nor an authorization boolean escape to the consumer.

  /**
   * Authorize and persist consumer work inside the same owned transaction.
   *
   * @param {string} bearer - Presented Authorization bearer value.
   * @param {string} kind - Requested policy action kind.
   * @param {Function} loadSubject - Synchronous loader for authoritative consumer records.
   * @param {Function} apply - Synchronous consumer eligibility and persistence callback.
   * @returns {Promise<*>} Consumer result after the owned transaction commits.
   */
  async admit(bearer, kind, loadSubject, apply) {
    const proof = parseProof(bearer);
    return this.store.write(
      /**
       * Load consumer subjects, check current authority and persist their effect together.
       */
      (scope) => {
        const actor = this.authenticate(scope, proof, this.clock());
        const consumer = consumerScope(scope.sql);
        try {
          // Load authoritative consumer facts while the writer is owned; external I/O stays outside.
          const subject = loadSubject(consumer.read, { actorId: actor.actorId });
          if (subject && typeof subject.then === 'function')
            throw new Error('Subject loading must be synchronous');

          // Use fresh application time after subject loading so expiry cannot pass on an earlier check.
          const now = this.clock();
          this.authenticate(scope, proof, now);
          authorize(actor, kind, subject);
          const result = apply(
            consumer.write,
            { actorId: actor.actorId, label: actor.label, time: new Date(now).toISOString() },
            subject,
          );
          if (result && typeof result.then === 'function')
            throw new Error('Consumer admission must be synchronous');
          return result;
        } finally {
          // Prevent a consumer from retaining usable SQL access after the transaction callback returns.
          consumer.close();
        }
      },
    );
  }

  /**
   * Read permitted current facts in a fresh authenticated snapshot.
   *
   * @param {string} bearer - Presented Authorization bearer value.
   * @param {Function} operation - Operation executed inside the authenticated scope.
   * @returns {*} Result of the authenticated read callback.
   */
  read(bearer, operation) {
    const proof = parseProof(bearer);
    return this.store.read(
      /**
       * Read the permitted current facts from the authenticated transaction snapshot.
       */
      (scope) => {
        const now = this.clock();
        const actor = this.authenticate(scope, proof, now);
        return operation(scope, actor, now);
      },
    );
  }

  /**
   * Run an administrative mutation with a fresh final credential gate.
   *
   * @param {string} bearer - Presented Authorization bearer value.
   * @param {Function} operation - Operation executed inside the authenticated scope.
   * @returns {Promise<*>} Administrative result after durable commit.
   */
  async mutate(bearer, operation) {
    const proof = parseProof(bearer);
    return this.store.write(
      /**
       * Evaluate the administrative change with current credentials and a fresh final gate.
       */
      (scope) => {
        const actor = this.authenticate(scope, proof, this.clock());
        const now = this.clock();
        this.authenticate(scope, proof, now);
        return operation(
          scope,
          actor,
          now,
          /**
           * Recheck the credential at fresh application time immediately before applying effects.
           */
          () => {
            // Recheck expiry immediately before effects; fault checkpoints are construction-only.
            this.store.faults.beforeGate?.();
            const applicationTime = this.clock();
            this.authenticate(scope, proof, applicationTime);
            return applicationTime;
          },
        );
      },
    );
  }

  /**
   * Initialize the singleton workspace and its first Manager atomically.
   *
   * @param {object} input - Validated registration descriptor.
   * @param {string} label - Exact current display label.
   * @returns {Promise<object>} Accepted initial Manager facts.
   */
  async bootstrap(input, label) {
    descriptor(input);
    return this.store.write(
      /**
       * Persist the singleton marker and initial Manager within the same owned transaction.
       */
      (scope) => {
        // A committed singleton marker makes every later bootstrap refuse without changing authority.
        if (scope.workspace())
          refuse(
            409,
            'already_initialized',
            'Workspace is already initialized; bootstrap never changes it.',
          );
        if (input.expectedCredentialRevision !== '0')
          refuse(400, 'invalid_binding', 'Bootstrap requires revision-one material.');
        const now = this.clock();
        const attribution = origin(null, now);
        const actor = initialActor(input, label, ['Manager'], now, attribution);
        scope.saveActor(actor);
        scope.setWorkspace({
          initialManagerActorId: actor.actorId,
          initializedAt: new Date(now).toISOString(),
        });
        return success(publicActor(actor, now), true);
      },
    );
  }
}
