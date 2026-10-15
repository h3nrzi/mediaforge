import { randomUUID, randomBytes, createHash, timingSafeEqual } from 'node:crypto';
import { openSync, writeFileSync, fsyncSync, closeSync, lstatSync, readFileSync } from 'node:fs';
import { dirname, isAbsolute } from 'node:path';
import { actorId, revision, nextRevision, fields, text, refuse } from './contract.js';

/**
 * Require an absolute artifact path in an owner-only, owner-controlled directory.
 *
 * @param {string} path - Explicit filesystem or HTTP target path.
 * @returns {void} Returns when the destination directory is safe.
 */
export function privateDirectory(path) {
  if (!isAbsolute(path)) refuse(400, 'unsafe_path', 'Use an absolute private artifact path.');

  // Inspect the directory itself so symlinks and shared permissions cannot pass unnoticed.
  const stat = lstatSync(dirname(path));
  if (
    !stat.isDirectory() ||
    stat.isSymbolicLink() ||
    stat.uid !== process.getuid() ||
    stat.mode & 0o077
  )
    refuse(400, 'unsafe_path', 'Parent directory must be owner-controlled and owner-only.');
}

/**
 * Exclusively create and flush an owner-only file and its directory entry.
 *
 * @param {string} path - Explicit filesystem or HTTP target path.
 * @param {string|Buffer} contents - Private file contents to flush.
 * @returns {void} Returns after flushing the file and directory.
 */
export function privateFile(path, contents) {
  privateDirectory(path);

  // Exclusive creation preserves existing owner files and applies private permissions immediately.
  const fd = openSync(path, 'wx', 0o600);
  try {
    writeFileSync(fd, contents);
    fsyncSync(fd);
  } finally {
    closeSync(fd);
  }

  // Flush the parent directory so the new private file entry is durable before readiness.
  const parent = openSync(dirname(path), 'r');
  try {
    fsyncSync(parent);
  } finally {
    closeSync(parent);
  }
}

/**
 * Decode only canonical base64url material of the expected byte length.
 *
 * @param {*} value - Supplied value to validate or persist.
 * @param {number} length - Required decoded byte count.
 * @returns {Buffer|null} Decoded canonical bytes, or null for invalid material.
 */
export function canonicalBytes(value, length) {
  if (typeof value !== 'string' || !/^[A-Za-z0-9_-]+$/.test(value)) return null;

  // Round-trip the encoding to reject alternative representations of the same bytes.
  const bytes = Buffer.from(value, 'base64url');
  return bytes.length === length && bytes.toString('base64url') === value ? bytes : null;
}

/**
 * Validate the immutable actor, locator, revision and verifier binding.
 *
 * @param {object} input - Validated registration descriptor.
 * @returns {object} The same validated registration descriptor.
 */
export function descriptor(input) {
  fields(input, [
    'actorId',
    'credentialId',
    'expectedCredentialRevision',
    'registrationRevision',
    'verifier',
  ]);
  actorId(input.actorId);
  revision(input.registrationRevision);
  if (input.expectedCredentialRevision !== '0') revision(input.expectedCredentialRevision);

  // The locator must bind the exact actor and the next intended registration revision.
  const expected =
    input.expectedCredentialRevision === '0' ? '1' : nextRevision(input.expectedCredentialRevision);
  text(input.credentialId, 128, 'Credential ID');
  const prefix = `${input.actorId}.${input.registrationRevision}.`;
  if (
    input.registrationRevision !== expected ||
    !input.credentialId.startsWith(prefix) ||
    !canonicalBytes(input.credentialId.slice(prefix.length), 16) ||
    !canonicalBytes(input.verifier, 32)
  )
    refuse(
      400,
      'invalid_binding',
      'Descriptor must bind the actor, next revision, fresh locator and SHA-256 verifier.',
    );
  return input;
}

/**
 * Persist owner-held secret material before publishing its separate registration descriptor.
 *
 * @param {string} path - Explicit filesystem or HTTP target path.
 * @param {string} [id] - Exact actor identifier.
 * @param {string} [expected] - Observed credential revision, or zero for initial material.
 * @returns {object} Non-secret identifiers and private artifact locations.
 */
export function prepare(path, id = randomUUID(), expected = '0') {
  actorId(id);
  if (expected !== '0') revision(expected);
  const registrationRevision = expected === '0' ? '1' : nextRevision(expected);

  // Generate the bearer secret independently from the public locator randomness.
  const secret = randomBytes(32);
  const registration = descriptor({
    actorId: id,
    credentialId: `${id}.${registrationRevision}.${randomBytes(16).toString('base64url')}`,
    expectedCredentialRevision: expected,
    registrationRevision,
    verifier: createHash('sha256').update(secret).digest('base64url'),
  });
  // Reserve every destination before writing. A crash leaves explicitly incomplete artifacts,
  // never a shareable registration descriptor for an unflushed private secret.
  privateDirectory(path);
  const paths = [path, `${path}.curl.conf`, `${path}.registration.json`];
  const fds = [];
  try {
    for (const destination of paths) fds.push(openSync(destination, 'wx', 0o600));
    const owner = { ...registration, secret: secret.toString('base64url'), complete: true };

    // Flush the owner-held secret before publishing shareable registration material.
    writeFileSync(fds[0], JSON.stringify(owner));
    fsyncSync(fds[0]);
    writeFileSync(
      fds[1],
      `header = "Authorization: Bearer ${registration.credentialId}~${owner.secret}"\n`,
    );
    fsyncSync(fds[1]);
    const parent = openSync(dirname(path), 'r');
    try {
      fsyncSync(parent);

      // Publish only the descriptor after the private secret and its directory entry are established.
      writeFileSync(fds[2], JSON.stringify(registration));
      fsyncSync(fds[2]);
      fsyncSync(parent);
    } finally {
      closeSync(parent);
    }
  } catch {
    refuse(
      400,
      'preparation_incomplete',
      'Preparation refused or incomplete. Inspect artifacts; do not share an incomplete descriptor or overwrite existing files.',
    );
  } finally {
    for (const fd of fds) closeSync(fd);
  }
  return {
    actorId: id,
    credentialId: registration.credentialId,
    ownerFile: path,
    curlConfig: paths[1],
    descriptorFile: paths[2],
  };
}

/**
 * Load a shareable registration descriptor and validate its fields and binding.
 *
 * @param {string} path - Explicit filesystem or HTTP target path.
 * @returns {object} Validated shareable registration descriptor.
 */
export function readDescriptor(path) {
  return descriptor(JSON.parse(readFileSync(path, 'utf8')));
}

/**
 * Parse a strict bearer credential and hash its owner-held secret for comparison.
 *
 * @param {*} value - Supplied value to validate or persist.
 * @returns {object} Exact credential locator and SHA-256 secret digest.
 */
export function parseProof(value) {
  if (typeof value !== 'string' || value.length > 200 || !value.startsWith('Bearer '))
    refuse(401, 'unauthenticated', 'A valid current bearer credential is required.');

  // Hash only a canonical owner secret; a stored verifier supplied as the secret will not match.
  const parts = value.slice(7).split('~');
  const secret = canonicalBytes(parts[1], 32);
  if (parts.length !== 2 || !secret || !/^[A-Za-z0-9._-]{1,128}$/.test(parts[0]))
    refuse(401, 'unauthenticated', 'A valid current bearer credential is required.');
  return { credentialId: parts[0], digest: createHash('sha256').update(secret).digest() };
}

/**
 * Compare the exact locator and verifier using constant-time digest comparison.
 *
 * @param {object} proof - Parsed credential locator and hashed secret proof.
 * @param {object} credential - Latest stored credential metadata including its verifier.
 * @returns {boolean|null|undefined} Whether the supplied proof matches an available registration.
 */
export function matchesProof(proof, credential) {
  return (
    credential &&
    proof.credentialId === credential.credentialId &&
    timingSafeEqual(proof.digest, Buffer.from(credential.verifier, 'base64url'))
  );
}
