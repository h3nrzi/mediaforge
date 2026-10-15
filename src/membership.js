import { authorize, publicActor, origin, registration, initialActor } from './authority.js';
import { refuse, success, nextRevision, actorId } from './contract.js';

export function target(scope, id) {
  const actor = scope.actor(id);
  if (!actor) refuse(404, 'not_found', 'Actor not found.');
  return actor;
}
export function inspect(scope, caller, id, now) {
  if (caller.actorId !== id) authorize(caller, 'membership_manage');
  return publicActor(target(scope, id), now);
}
export function conflict(actor, now, message = 'Observed state is stale; inspect current facts and reconsider.') {
  refuse(409, 'state_conflict', message, publicActor(actor, now));
}
export function managerInvariant(scope, actor, desiredRoles, membership, now) {
  if (actor.membership === 'admitted' && actor.responsibilities.includes('Manager') && (membership !== 'admitted' || !desiredRoles.includes('Manager')) && !scope.actors().some(other => other.actorId !== actor.actorId && other.membership === 'admitted' && other.responsibilities.includes('Manager'))) conflict(actor, now, 'At least one admitted Manager must remain.');
}
export function sameRegistration(actor, input) {
  return actor.actorId === input.actorId && actor.credential.credentialId === input.credentialId && actor.credential.verifier === input.verifier && actor.credential.registrationRevision === input.registrationRevision && !actor.credential.invalidated;
}
export function admitActor(scope, caller, id, body, now, gate = () => now) {
  authorize(caller, 'membership_manage');
  const input = body.registration;
  if (input.actorId !== id || input.expectedCredentialRevision !== '0') refuse(409, 'binding_conflict', 'New admission requires revision-one material bound to this actor.');
  const existing = scope.actor(id);
  if (existing) {
    if (existing.membership === 'admitted' && existing.label === body.label && JSON.stringify(existing.responsibilities) === JSON.stringify(body.responsibilities) && sameRegistration(existing, input)) return success(publicActor(existing, now), true, false);
    conflict(existing, now, 'Existing actor cannot be overwritten or readmitted by admission replay.');
  }
  now = gate();
  const attribution = origin(caller, now);
  const actor = initialActor(input, body.label, body.responsibilities, now, attribution);
  scope.saveActor(actor); return success(publicActor(actor, now), true);
}
export function editActor(scope, caller, id, body, now, gate = () => now) {
  authorize(caller, 'membership_manage');
  const actor = target(scope, id);
  if (actor.membership !== 'admitted') conflict(actor, now, 'Use explicit readmission for a removed actor.');
  const label = body.label ?? actor.label;
  const roles = body.responsibilities ?? actor.responsibilities;
  if (label === actor.label && JSON.stringify(roles) === JSON.stringify(actor.responsibilities)) return success(publicActor(actor, now), true, false);
  if (body.expectedMembershipVersion !== actor.membershipVersion) conflict(actor, now);
  managerInvariant(scope, actor, roles, 'admitted', now);
  now = gate();
  const attribution = origin(caller, now);
  actor.membershipVersion = nextRevision(actor.membershipVersion);
  actor.label = label; actor.responsibilities = roles; actor.latestMembershipChange = attribution;
  scope.saveActor(actor); return success(publicActor(actor, now), true);
}
export function directory(scope, caller, query, now) {
  authorize(caller, 'membership_manage');
  let boundary;
  const filter = { ...(query.actorId ? { actorId: query.actorId } : {}), ...(query.membership ? { membership: query.membership } : {}) };
  if (query.cursor) {
    try {
      if (!/^[A-Za-z0-9_-]+$/.test(query.cursor) || Buffer.from(query.cursor, 'base64url').toString('base64url') !== query.cursor) throw new Error();
      const parsed = JSON.parse(Buffer.from(query.cursor, 'base64url').toString());
      actorId(parsed.id);
      if (Object.keys(parsed).sort().join() !== 'filter,id,time' || JSON.stringify(parsed.filter) !== JSON.stringify(filter) || (!Number.isSafeInteger(parsed.time) || parsed.time < 0) || typeof parsed.id !== 'string') throw new Error();
      boundary = parsed;
    } catch { refuse(400, 'invalid_cursor', 'Continuation must match the requested filters and order boundary.'); }
  }
  const actors = scope.directory(filter, boundary, query.limit + 1);
  const more = actors.length > query.limit; const items = actors.slice(0, query.limit);
  const last = items.at(-1);
  return success({ items: items.map(actor => publicActor(actor, now)), nextCursor: more ? Buffer.from(JSON.stringify({ filter, time: last.firstAdmission.timeMs, id: last.actorId })).toString('base64url') : null });
}
export function removeActor(scope, caller, id, body, now, gate = () => now) {
  authorize(caller, 'membership_manage'); const actor = target(scope, id);
  if (actor.membership === 'removed') return success(publicActor(actor, now), true, false);
  if (body.expectedMembershipVersion !== actor.membershipVersion) conflict(actor, now);
  managerInvariant(scope, actor, [], 'removed', now);
  now = gate();
  const attribution = origin(caller, now);
  actor.membershipVersion = nextRevision(actor.membershipVersion);
  if (!actor.credential.invalidated) {
    actor.credentialRevision = nextRevision(actor.credentialRevision);
    actor.credential.invalidated = true; actor.credential.latestChange = attribution;
  }
  actor.membership = 'removed'; actor.responsibilities = []; actor.latestMembershipChange = attribution;
  scope.saveActor(actor); return success(publicActor(actor, now), true);
}
export function readmitActor(scope, caller, id, body, now, gate = () => now) {
  authorize(caller, 'membership_manage'); const actor = target(scope, id);
  if (actor.membership !== 'removed' || body.expectedMembershipVersion !== actor.membershipVersion || body.expectedCredentialRevision !== actor.credentialRevision) conflict(actor, now);
  if (body.registration.actorId !== id || body.registration.expectedCredentialRevision !== actor.credentialRevision) conflict(actor, now, 'Fresh material must bind the exact actor and next credential revision.');
  now = gate();
  const attribution = origin(caller, now);
  actor.membershipVersion = nextRevision(actor.membershipVersion);
  actor.credentialRevision = nextRevision(actor.credentialRevision);
  actor.membership = 'admitted'; actor.responsibilities = body.responsibilities;
  actor.credential = registration(body.registration, now, attribution); actor.latestMembershipChange = attribution;
  scope.saveActor(actor); return success(publicActor(actor, now), true);
}
