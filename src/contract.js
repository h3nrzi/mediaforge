export const MAX_REVISION = 9223372036854775807n;
export const RESPONSIBILITIES = ['Contributor', 'Reviewer', 'Operations', 'Manager'];
export class Refusal extends Error {
  /**
   * Represent a bounded refusal with its permitted facts and effect certainty.
   *
   * @param {number} status - HTTP status associated with the result.
   * @param {string} category - Stable feedback reason category.
   * @param {string} message - Bounded, safe client-facing explanation.
   * @param {object} currentState - Permitted current facts for recovery.
   * @param {string} [actionStatus] - Established or indeterminate effect status.
   */
  constructor(status, category, message, currentState, actionStatus = 'refused_without_effect') {
    super(message);
    Object.assign(this, { status, category, currentState, actionStatus });
  }
}

/**
 * Stop the operation with a structured refusal that the adapters can serialize.
 *
 * @param {number} status - HTTP status associated with the result.
 * @param {string} category - Stable feedback reason category.
 * @param {string} message - Bounded, safe client-facing explanation.
 * @param {object} currentState - Permitted current facts for recovery.
 */
export function refuse(status, category, message, currentState) {
  throw new Refusal(status, category, message, currentState);
}

/**
 * Map known refusals and unexpected failures to safe control responses.
 *
 * @param {Error} error - Operation failure to serialize safely.
 * @param {boolean} [action] - Whether the response describes a mutation.
 * @returns {object} Safe HTTP status and response body.
 */
export function failure(error, action = true) {
  // Preserve established refusal knowledge and hide unexpected internal diagnostics.
  const known = error instanceof Refusal;
  return {
    status: known ? error.status : 503,
    body: {
      result: 'refused',
      ...(action ? { actionStatus: known ? error.actionStatus : 'indeterminate' } : {}),
      reasonCategory: known ? error.category : 'unavailable',
      message: known
        ? error.message
        : 'Storage is unavailable. Inspect permitted current facts before another action.',
      ...(known && error.currentState ? { currentState: error.currentState } : {}),
    },
  };
}

/**
 * Describe an applied effect, a read result or a matching no-effect confirmation.
 *
 * @param {*} data - Permitted response data.
 * @param {boolean} [action] - Whether the response describes a mutation.
 * @param {boolean} [changed] - Whether this operation applied a new effect.
 * @returns {object} Read, accepted-effect or no-effect response.
 */
export function success(data, action = false, changed = true) {
  // No-effect confirmation describes current state without asserting an earlier historical outcome.
  return {
    result: changed ? 'ok' : 'already_satisfied',
    ...(action ? { actionStatus: 'accepted', effect: changed ? 'applied' : 'none' } : {}),
    reasonCategory: changed ? 'ok' : 'no_change',
    message: changed
      ? 'Operation completed.'
      : 'Current state matches; no new effect or historical outcome is asserted.',
    data,
  };
}

/**
 * Reject unknown fields and missing required preconditions before a mutation.
 *
 * @param {*} value - Supplied value to validate or persist.
 * @param {string[]} allowed - Recognized input field names.
 * @param {string[]} [required] - Fields required by the operation.
 * @returns {void} Returns when required and recognized fields match.
 */
export function fields(value, allowed, required = allowed) {
  // Validate the complete field set before storage admission.
  if (
    !value ||
    typeof value !== 'object' ||
    Array.isArray(value) ||
    Object.keys(value).some(
      /**
       * Detect an invalid field, responsibility or missing required workflow observation.
       */
      (key) => !allowed.includes(key),
    ) ||
    required.some(
      /**
       * Detect an invalid field, responsibility or missing required workflow observation.
       */
      (key) => !Object.hasOwn(value, key),
    )
  )
    refuse(400, 'invalid_input', 'Supply only recognized fields and all required preconditions.');
}

/**
 * Validate exact Unicode text without normalizing or truncating identity data.
 *
 * @param {*} value - Supplied value to validate or persist.
 * @param {number} limit - Maximum allowed length or page size.
 * @param {string} name - Safe field name used in validation feedback.
 * @returns {string} The exact validated input text.
 */
export function text(value, limit, name) {
  // Count Unicode code points and reject malformed/control text without modifying the supplied label.
  if (
    typeof value !== 'string' ||
    !value.isWellFormed() ||
    !value.length ||
    [...value].length > limit ||
    /[\p{Cc}\p{Cf}]/u.test(value)
  )
    refuse(
      400,
      'invalid_input',
      `${name} must be nonempty well-formed text within ${limit} code points, without controls.`,
    );
  return value;
}

/**
 * Require a canonical UUID v4 within the public identifier bound.
 *
 * @param {*} value - Supplied value to validate or persist.
 * @returns {string} The canonical actor identifier.
 */
export function actorId(value) {
  text(value, 128, 'Actor ID');
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(value))
    refuse(400, 'invalid_input', 'Actor ID must be a canonical UUID v4.');
  return value;
}

/**
 * Require a positive decimal revision within the supported integer range.
 *
 * @param {*} value - Supplied value to validate or persist.
 * @returns {string} The exact bounded decimal revision.
 */
export function revision(value) {
  if (
    typeof value !== 'string' ||
    !/^[1-9][0-9]{0,18}$/.test(value) ||
    BigInt(value) > MAX_REVISION
  )
    refuse(400, 'invalid_input', 'Revision must be a bounded positive decimal string.');
  return value;
}

/**
 * Advance a revision once and refuse exhaustion without wrapping.
 *
 * @param {*} value - Supplied value to validate or persist.
 * @returns {string} The next bounded decimal revision.
 */
export function nextRevision(value) {
  // Check exhaustion before incrementing so an operation cannot wrap a persisted revision.
  revision(value);
  if (BigInt(value) === MAX_REVISION)
    refuse(409, 'revision_exhausted', 'Revision space exhausted; no change was applied.');
  return String(BigInt(value) + 1n);
}

/**
 * Validate independent assignments and return their stable set ordering.
 *
 * @param {*} value - Supplied value to validate or persist.
 * @returns {string[]} Validated responsibilities in stable ordering.
 */
export function responsibilities(value) {
  // Duplicate or unknown assignments refuse; sorting gives stable set comparisons.
  if (
    !Array.isArray(value) ||
    value.some(
      /**
       * Detect an invalid field, responsibility or missing required workflow observation.
       */
      (role) => !RESPONSIBILITIES.includes(role),
    ) ||
    new Set(value).size !== value.length
  )
    refuse(
      400,
      'invalid_input',
      'Responsibilities must be a set of Contributor, Reviewer, Operations and Manager.',
    );
  return [...value].sort();
}
