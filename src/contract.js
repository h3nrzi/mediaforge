export const MAX_REVISION = 9223372036854775807n;
export const RESPONSIBILITIES = ['Contributor', 'Reviewer', 'Operations', 'Manager'];
export class Refusal extends Error {
  constructor(status, category, message, currentState, actionStatus = 'refused_without_effect') {
    super(message);
    Object.assign(this, { status, category, currentState, actionStatus });
  }
}
export function refuse(status, category, message, currentState) {
  throw new Refusal(status, category, message, currentState);
}
export function failure(error, action = true) {
  const known = error instanceof Refusal;
  return {
    status: known ? error.status : 503,
    body: {
      result: 'refused', ...(action ? { actionStatus: known ? error.actionStatus : 'indeterminate' } : {}),
      reasonCategory: known ? error.category : 'unavailable',
      message: known ? error.message : 'Storage is unavailable. Inspect permitted current facts before another action.',
      ...(known && error.currentState ? { currentState: error.currentState } : {}),
    },
  };
}
export function success(data, action = false, changed = true) {
  return { result: changed ? 'ok' : 'already_satisfied', ...(action ? { actionStatus: 'accepted', effect: changed ? 'applied' : 'none' } : {}), reasonCategory: changed ? 'ok' : 'no_change', message: changed ? 'Operation completed.' : 'Current state matches; no new effect or historical outcome is asserted.', data };
}
export function fields(value, allowed, required = allowed) {
  if (!value || typeof value !== 'object' || Array.isArray(value) || Object.keys(value).some(key => !allowed.includes(key)) || required.some(key => !Object.hasOwn(value, key))) refuse(400, 'invalid_input', 'Supply only recognized fields and all required preconditions.');
}
export function text(value, limit, name) {
  if (typeof value !== 'string' || !value.isWellFormed() || !value.length || [...value].length > limit || /[\p{Cc}\p{Cf}]/u.test(value)) refuse(400, 'invalid_input', `${name} must be nonempty well-formed text within ${limit} code points, without controls.`);
  return value;
}
export function actorId(value) {
  text(value, 128, 'Actor ID');
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(value)) refuse(400, 'invalid_input', 'Actor ID must be a canonical UUID v4.');
  return value;
}
export function revision(value) {
  if (typeof value !== 'string' || !/^[1-9][0-9]{0,18}$/.test(value) || BigInt(value) > MAX_REVISION) refuse(400, 'invalid_input', 'Revision must be a bounded positive decimal string.');
  return value;
}
export function nextRevision(value) {
  revision(value);
  if (BigInt(value) === MAX_REVISION) refuse(409, 'revision_exhausted', 'Revision space exhausted; no change was applied.');
  return String(BigInt(value) + 1n);
}
export function responsibilities(value) {
  if (!Array.isArray(value) || value.some(role => !RESPONSIBILITIES.includes(role)) || new Set(value).size !== value.length) refuse(400, 'invalid_input', 'Responsibilities must be a set of Contributor, Reviewer, Operations and Manager.');
  return [...value].sort();
}
