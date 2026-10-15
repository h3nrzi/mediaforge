import { authorize, publicActor, registration, origin } from './authority.js';
import { target, conflict, sameRegistration } from './membership.js';
import { nextRevision, success, refuse } from './contract.js';

/**
 * Resolve an admitted target under the self, Manager or trusted-operator guard.
 *
 * @param {object} scope - Persistence operations in the owned transaction.
 * @param {object|null} caller - Authenticated member, or null for trusted host recovery.
 * @param {string} id - Exact actor identifier.
 * @param {number} now - Current server time in epoch milliseconds.
 * @param {boolean} operator - Whether the trusted host operator guard applies.
 * @returns {object} Admitted target after the applicable authority checks.
 */
function credentialTarget(scope, caller, id, now, operator) {
  // Self service uses the authenticated owner; third-party changes require Manager or host authority.
  if (operator || caller.actorId !== id) {
    if (!operator) authorize(caller, 'membership_manage');
  }
  const actor = target(scope, id);
  if (operator && (actor.membership !== 'admitted' || !actor.responsibilities.includes('Manager')))
    refuse(403, 'ineligible_recovery', 'Operator recovery requires an existing admitted Manager.');
  if (actor.membership !== 'admitted')
    conflict(actor, now, 'Credential administration requires admitted membership.');
  return actor;
}

/**
 * Register a revision-bound candidate or confirm the exact current registration.
 *
 * @param {object} scope - Persistence operations in the owned transaction.
 * @param {object|null} caller - Authenticated member, or null for trusted host recovery.
 * @param {string} id - Exact actor identifier.
 * @param {object} body - Validated control request fields.
 * @param {number} now - Current server time in epoch milliseconds.
 * @param {Function} [gate] - Final authority check returning the application time.
 * @param {boolean} [operator] - Whether the trusted host operator guard applies.
 * @returns {object} Applied replacement or unchanged current confirmation.
 */
export function replaceCredential(
  scope,
  caller,
  id,
  body,
  now,
  /**
   * Reuse the supplied action time when no custom final gate is provided.
   */
  gate = () => now,
  operator = false,
) {
  const actor = credentialTarget(scope, caller, id, now, operator);
  const input = body.registration;
  if (input.actorId !== id || input.expectedCredentialRevision !== body.expectedCredentialRevision)
    conflict(actor, now, 'Descriptor actor and observed revision must match the exact target.');

  // Confirming the exact live candidate preserves its original issuance, expiry and attribution.
  if (sameRegistration(actor, input)) return success(publicActor(actor, now), true, false);
  if (body.expectedCredentialRevision !== actor.credentialRevision) conflict(actor, now);

  // Take final application time only after binding and stale-revision checks have passed.
  now = gate();
  actor.credentialRevision = nextRevision(actor.credentialRevision);
  actor.credential = registration(input, now, origin(operator ? null : caller, now));
  scope.saveActor(actor);
  return success(publicActor(actor, now), true);
}

/**
 * Invalidate only the exact targeted credential without affecting its replacement.
 *
 * @param {object} scope - Persistence operations in the owned transaction.
 * @param {object|null} caller - Authenticated member, or null for trusted host recovery.
 * @param {string} id - Exact actor identifier.
 * @param {object} body - Validated control request fields.
 * @param {number} now - Current server time in epoch milliseconds.
 * @param {Function} [gate] - Final authority check returning the application time.
 * @returns {object} Applied exact invalidation or unchanged confirmation.
 */
export function revokeCredential(
  scope,
  caller,
  id,
  body,
  now,
  /**
   * Reuse the supplied action time when no custom final gate is provided.
   */
  gate = () => now,
) {
  const actor = credentialTarget(scope, caller, id, now, false);

  // An old revocation locator must never redirect to the replacement credential.
  if (actor.credential.credentialId !== body.credentialId)
    conflict(
      actor,
      now,
      'Exact credential is superseded; revocation cannot target its replacement.',
    );
  if (actor.credential.invalidated) return success(publicActor(actor, now), true, false);
  now = gate();
  actor.credentialRevision = nextRevision(actor.credentialRevision);
  actor.credential.invalidated = true;
  actor.credential.latestChange = origin(caller, now);
  scope.saveActor(actor);
  return success(publicActor(actor, now), true);
}

/**
 * Return permitted current facts for an existing admitted Manager.
 *
 * @param {object} scope - Persistence operations in the owned transaction.
 * @param {string} id - Exact actor identifier.
 * @param {number} now - Current server time in epoch milliseconds.
 * @returns {object} Non-secret current facts for the admitted Manager.
 */
export function recoveryStatus(scope, id, now) {
  return publicActor(credentialTarget(scope, null, id, now, true), now);
}
