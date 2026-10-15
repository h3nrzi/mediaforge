import { authorize, publicActor, origin, registration, initialActor } from './authority.js';
import { refuse, success, nextRevision, actorId } from './contract.js';

/**
 * Load the exact actor or refuse an authorized lookup of an unknown target.
 *
 * @param {object} scope - Persistence operations in the owned transaction.
 * @param {string} id - Exact actor identifier.
 * @returns {object} Exact retained actor.
 */
export function target(scope, id) {
  const actor = scope.actor(id);
  if (!actor) refuse(404, 'not_found', 'Actor not found.');
  return actor;
}

/**
 * Return self or Manager-permitted actor facts without credential verifier material.
 *
 * @param {object} scope - Persistence operations in the owned transaction.
 * @param {object|null} caller - Authenticated member, or null for trusted host recovery.
 * @param {string} id - Exact actor identifier.
 * @param {number} now - Current server time in epoch milliseconds.
 * @returns {object} Permitted public actor facts.
 */
export function inspect(scope, caller, id, now) {
  if (caller.actorId !== id) authorize(caller, 'membership_manage');
  return publicActor(target(scope, id), now);
}

/**
 * Refuse a stale or incompatible change with permitted current actor facts.
 *
 * @param {object} actor - Current or retained actor facts.
 * @param {number} now - Current server time in epoch milliseconds.
 * @param {string} [message] - Bounded, safe client-facing explanation.
 */
export function conflict(
  actor,
  now,
  message = 'Observed state is stale; inspect current facts and reconsider.',
) {
  refuse(409, 'state_conflict', message, publicActor(actor, now));
}

/**
 * Prevent a membership change from removing the last admitted Manager.
 *
 * @param {object} scope - Persistence operations in the owned transaction.
 * @param {object} actor - Current or retained actor facts.
 * @param {string[]} desiredRoles - Complete desired responsibility set.
 * @param {string} membership - Desired admitted or removed state.
 * @param {number} now - Current server time in epoch milliseconds.
 * @returns {void} Returns when an admitted Manager will remain.
 */
export function managerInvariant(scope, actor, desiredRoles, membership, now) {
  // Count admitted Managers by membership, even when their credentials are expired or revoked.
  if (
    actor.membership === 'admitted' &&
    actor.responsibilities.includes('Manager') &&
    (membership !== 'admitted' || !desiredRoles.includes('Manager')) &&
    !scope.actors().some(
      /**
       * Check for another admitted Manager before allowing the membership change.
       */
      (other) =>
        other.actorId !== actor.actorId &&
        other.membership === 'admitted' &&
        other.responsibilities.includes('Manager'),
    )
  )
    conflict(actor, now, 'At least one admitted Manager must remain.');
}

/**
 * Recognize only the exact current, non-invalidated registration binding.
 *
 * @param {object} actor - Current or retained actor facts.
 * @param {object} input - Validated registration descriptor.
 * @returns {boolean} Whether the current non-invalidated binding is identical.
 */
export function sameRegistration(actor, input) {
  return (
    actor.actorId === input.actorId &&
    actor.credential.credentialId === input.credentialId &&
    actor.credential.verifier === input.verifier &&
    actor.credential.registrationRevision === input.registrationRevision &&
    !actor.credential.invalidated
  );
}

/**
 * Admit a new actor once or confirm matching current admission facts.
 *
 * @param {object} scope - Persistence operations in the owned transaction.
 * @param {object|null} caller - Authenticated member, or null for trusted host recovery.
 * @param {string} id - Exact actor identifier.
 * @param {object} body - Validated control request fields.
 * @param {number} now - Current server time in epoch milliseconds.
 * @param {Function} [gate] - Final authority check returning the application time.
 * @returns {object} Accepted admission or unchanged matching facts.
 */
export function admitActor(
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
  authorize(caller, 'membership_manage');
  const input = body.registration;
  if (input.actorId !== id || input.expectedCredentialRevision !== '0')
    refuse(
      409,
      'binding_conflict',
      'New admission requires revision-one material bound to this actor.',
    );

  // Admission replay may confirm matching current facts but must never overwrite or readmit an actor.
  const existing = scope.actor(id);
  if (existing) {
    if (
      existing.membership === 'admitted' &&
      existing.label === body.label &&
      JSON.stringify(existing.responsibilities) === JSON.stringify(body.responsibilities) &&
      sameRegistration(existing, input)
    )
      return success(publicActor(existing, now), true, false);
    conflict(
      existing,
      now,
      'Existing actor cannot be overwritten or readmitted by admission replay.',
    );
  }
  now = gate();
  const attribution = origin(caller, now);
  const actor = initialActor(input, body.label, body.responsibilities, now, attribution);
  scope.saveActor(actor);
  return success(publicActor(actor, now), true);
}

/**
 * Apply an observed-version label or responsibility replacement without lost updates.
 *
 * @param {object} scope - Persistence operations in the owned transaction.
 * @param {object|null} caller - Authenticated member, or null for trusted host recovery.
 * @param {string} id - Exact actor identifier.
 * @param {object} body - Validated control request fields.
 * @param {number} now - Current server time in epoch milliseconds.
 * @param {Function} [gate] - Final authority check returning the application time.
 * @returns {object} Applied edit or unchanged matching facts.
 */
export function editActor(
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
  authorize(caller, 'membership_manage');
  const actor = target(scope, id);
  if (actor.membership !== 'admitted')
    conflict(actor, now, 'Use explicit readmission for a removed actor.');
  const label = body.label ?? actor.label;
  const roles = body.responsibilities ?? actor.responsibilities;

  // A satisfied absolute state adds no version, timestamp or attribution.
  if (label === actor.label && JSON.stringify(roles) === JSON.stringify(actor.responsibilities))
    return success(publicActor(actor, now), true, false);
  if (body.expectedMembershipVersion !== actor.membershipVersion) conflict(actor, now);

  // Validate the observed version and last-Manager invariant before applying the replacement set.
  managerInvariant(scope, actor, roles, 'admitted', now);
  now = gate();
  const attribution = origin(caller, now);
  actor.membershipVersion = nextRevision(actor.membershipVersion);
  actor.label = label;
  actor.responsibilities = roles;
  actor.latestMembershipChange = attribution;
  scope.saveActor(actor);
  return success(publicActor(actor, now), true);
}

/**
 * Return a bounded, currently authorized page in immutable first-admission order.
 *
 * @param {object} scope - Persistence operations in the owned transaction.
 * @param {object|null} caller - Authenticated member, or null for trusted host recovery.
 * @param {object} query - Validated directory filters, limit and continuation.
 * @param {number} now - Current server time in epoch milliseconds.
 * @returns {object} Public actors and an optional filter-bound continuation.
 */
export function directory(scope, caller, query, now) {
  authorize(caller, 'membership_manage');
  let boundary;
  const filter = {
    ...(query.actorId ? { actorId: query.actorId } : {}),
    ...(query.membership ? { membership: query.membership } : {}),
  };

  // Validate the order boundary against the exact filters on every freshly authorized page.
  if (query.cursor) {
    try {
      if (
        !/^[A-Za-z0-9_-]+$/.test(query.cursor) ||
        Buffer.from(query.cursor, 'base64url').toString('base64url') !== query.cursor
      )
        throw new Error();
      const parsed = JSON.parse(Buffer.from(query.cursor, 'base64url').toString());
      actorId(parsed.id);
      if (
        Object.keys(parsed).sort().join() !== 'filter,id,time' ||
        JSON.stringify(parsed.filter) !== JSON.stringify(filter) ||
        !Number.isSafeInteger(parsed.time) ||
        parsed.time < 0 ||
        typeof parsed.id !== 'string'
      )
        throw new Error();
      boundary = parsed;
    } catch {
      refuse(
        400,
        'invalid_cursor',
        'Continuation must match the requested filters and order boundary.',
      );
    }
  }

  // Read one extra row to determine continuation without returning an unbounded directory.
  const actors = scope.directory(filter, boundary, query.limit + 1);
  const more = actors.length > query.limit;
  const items = actors.slice(0, query.limit);
  const last = items.at(-1);
  return success({
    items: items.map(
      /**
       * Strip private credential material from each returned directory actor.
       */
      (actor) => publicActor(actor, now),
    ),
    nextCursor: more
      ? Buffer.from(
          JSON.stringify({ filter, time: last.firstAdmission.timeMs, id: last.actorId }),
        ).toString('base64url')
      : null,
  });
}

/**
 * Remove membership and invalidate credentials without erasing stable identity.
 *
 * @param {object} scope - Persistence operations in the owned transaction.
 * @param {object|null} caller - Authenticated member, or null for trusted host recovery.
 * @param {string} id - Exact actor identifier.
 * @param {object} body - Validated control request fields.
 * @param {number} now - Current server time in epoch milliseconds.
 * @param {Function} [gate] - Final authority check returning the application time.
 * @returns {object} Applied removal or unchanged removed state.
 */
export function removeActor(
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
  authorize(caller, 'membership_manage');
  const actor = target(scope, id);
  if (actor.membership === 'removed') return success(publicActor(actor, now), true, false);
  if (body.expectedMembershipVersion !== actor.membershipVersion) conflict(actor, now);
  managerInvariant(scope, actor, [], 'removed', now);
  now = gate();
  const attribution = origin(caller, now);
  actor.membershipVersion = nextRevision(actor.membershipVersion);

  // Only a real credential-state transition advances its revision during removal.
  if (!actor.credential.invalidated) {
    actor.credentialRevision = nextRevision(actor.credentialRevision);
    actor.credential.invalidated = true;
    actor.credential.latestChange = attribution;
  }

  // Retain stable identity and historical facts while closing all future membership authority.
  actor.membership = 'removed';
  actor.responsibilities = [];
  actor.latestMembershipChange = attribution;
  scope.saveActor(actor);
  return success(publicActor(actor, now), true);
}

/**
 * Restore an exact removed actor with explicit assignments and fresh credentials.
 *
 * @param {object} scope - Persistence operations in the owned transaction.
 * @param {object|null} caller - Authenticated member, or null for trusted host recovery.
 * @param {string} id - Exact actor identifier.
 * @param {object} body - Validated control request fields.
 * @param {number} now - Current server time in epoch milliseconds.
 * @param {Function} [gate] - Final authority check returning the application time.
 * @returns {object} Accepted membership with fresh credential material.
 */
export function readmitActor(
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
  authorize(caller, 'membership_manage');
  const actor = target(scope, id);
  if (
    actor.membership !== 'removed' ||
    body.expectedMembershipVersion !== actor.membershipVersion ||
    body.expectedCredentialRevision !== actor.credentialRevision
  )
    conflict(actor, now);
  if (
    body.registration.actorId !== id ||
    body.registration.expectedCredentialRevision !== actor.credentialRevision
  )
    conflict(actor, now, 'Fresh material must bind the exact actor and next credential revision.');
  now = gate();
  const attribution = origin(caller, now);
  actor.membershipVersion = nextRevision(actor.membershipVersion);
  actor.credentialRevision = nextRevision(actor.credentialRevision);
  actor.membership = 'admitted';
  actor.responsibilities = body.responsibilities;

  // Readmission registers fresh material and explicit assignments without restoring previous access.
  actor.credential = registration(body.registration, now, attribution);
  actor.latestMembershipChange = attribution;
  scope.saveActor(actor);
  return success(publicActor(actor, now), true);
}
