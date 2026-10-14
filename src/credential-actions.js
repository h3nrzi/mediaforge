import { authorize, publicActor, registration, origin } from './authority.js';
import { target, conflict, sameRegistration } from './membership.js';
import { nextRevision, success, refuse } from './contract.js';

function credentialTarget(scope, caller, id, now, operator) {
  if (operator || caller.actorId !== id) {
    if (!operator) authorize(caller, 'membership_manage');
  }
  const actor = target(scope, id);
  if (operator && (actor.membership !== 'admitted' || !actor.responsibilities.includes('Manager'))) refuse(403, 'ineligible_recovery', 'Operator recovery requires an existing admitted Manager.');
  if (actor.membership !== 'admitted') conflict(actor, now, 'Credential administration requires admitted membership.');
  return actor;
}
export function replaceCredential(scope, caller, id, body, now, gate = () => now, operator = false) {
  const actor = credentialTarget(scope, caller, id, now, operator);
  const input = body.registration;
  if (input.actorId !== id || input.expectedCredentialRevision !== body.expectedCredentialRevision) conflict(actor, now, 'Descriptor actor and observed revision must match the exact target.');
  if (sameRegistration(actor, input)) return success(publicActor(actor, now), true, false);
  if (body.expectedCredentialRevision !== actor.credentialRevision) conflict(actor, now);
  now = gate();
  actor.credentialRevision = nextRevision(actor.credentialRevision);
  actor.credential = registration(input, now, origin(operator ? null : caller, now));
  scope.saveActor(actor); return success(publicActor(actor, now), true);
}
export function revokeCredential(scope, caller, id, body, now, gate = () => now) {
  const actor = credentialTarget(scope, caller, id, now, false);
  if (actor.credential.credentialId !== body.credentialId) conflict(actor, now, 'Exact credential is superseded; revocation cannot target its replacement.');
  if (actor.credential.invalidated) return success(publicActor(actor, now), true, false);
  now = gate();
  actor.credentialRevision = nextRevision(actor.credentialRevision);
  actor.credential.invalidated = true; actor.credential.latestChange = origin(caller, now);
  scope.saveActor(actor); return success(publicActor(actor, now), true);
}
export function recoveryStatus(scope, id, now) {
  return publicActor(credentialTarget(scope, null, id, now, true), now);
}
