import { randomUUID, randomBytes, createHash, timingSafeEqual } from 'node:crypto';
import { openSync, writeFileSync, fsyncSync, closeSync, lstatSync, readFileSync } from 'node:fs';
import { dirname, isAbsolute } from 'node:path';
import { actorId, revision, nextRevision, fields, text, refuse } from './contract.js';

export function privateDirectory(path) {
  if (!isAbsolute(path)) refuse(400, 'unsafe_path', 'Use an absolute private artifact path.');
  const stat = lstatSync(dirname(path));
  if (!stat.isDirectory() || stat.isSymbolicLink() || stat.uid !== process.getuid() || (stat.mode & 0o077)) refuse(400, 'unsafe_path', 'Parent directory must be owner-controlled and owner-only.');
}
export function privateFile(path, contents) {
  privateDirectory(path);
  const fd = openSync(path, 'wx', 0o600);
  try { writeFileSync(fd, contents); fsyncSync(fd); } finally { closeSync(fd); }
  const parent = openSync(dirname(path), 'r');
  try { fsyncSync(parent); } finally { closeSync(parent); }
}
export function canonicalBytes(value, length) {
  if (typeof value !== 'string' || !/^[A-Za-z0-9_-]+$/.test(value)) return null;
  const bytes = Buffer.from(value, 'base64url');
  return bytes.length === length && bytes.toString('base64url') === value ? bytes : null;
}
export function descriptor(input) {
  fields(input, ['actorId', 'credentialId', 'expectedCredentialRevision', 'registrationRevision', 'verifier']);
  actorId(input.actorId); revision(input.registrationRevision);
  if (input.expectedCredentialRevision !== '0') revision(input.expectedCredentialRevision);
  const expected = input.expectedCredentialRevision === '0' ? '1' : nextRevision(input.expectedCredentialRevision);
  text(input.credentialId, 128, 'Credential ID');
  const prefix = `${input.actorId}.${input.registrationRevision}.`;
  if (input.registrationRevision !== expected || !input.credentialId.startsWith(prefix) || !canonicalBytes(input.credentialId.slice(prefix.length), 16) || !canonicalBytes(input.verifier, 32)) refuse(400, 'invalid_binding', 'Descriptor must bind the actor, next revision, fresh locator and SHA-256 verifier.');
  return input;
}
export function prepare(path, id = randomUUID(), expected = '0') {
  actorId(id);
  if (expected !== '0') revision(expected);
  const registrationRevision = expected === '0' ? '1' : nextRevision(expected);
  const secret = randomBytes(32);
  const registration = descriptor({ actorId: id, credentialId: `${id}.${registrationRevision}.${randomBytes(16).toString('base64url')}`, expectedCredentialRevision: expected, registrationRevision, verifier: createHash('sha256').update(secret).digest('base64url') });
  // Reserve every destination before writing. A crash leaves explicitly incomplete artifacts,
  // never a shareable registration descriptor for an unflushed private secret.
  privateDirectory(path);
  const paths = [path, `${path}.curl.conf`, `${path}.registration.json`];
  const fds = [];
  try {
    for (const destination of paths) fds.push(openSync(destination, 'wx', 0o600));
    const owner = { ...registration, secret: secret.toString('base64url'), complete: true };
    writeFileSync(fds[0], JSON.stringify(owner)); fsyncSync(fds[0]);
    writeFileSync(fds[1], `header = "Authorization: Bearer ${registration.credentialId}~${owner.secret}"\n`); fsyncSync(fds[1]);
    const parent = openSync(dirname(path), 'r');
    try {
      fsyncSync(parent);
      writeFileSync(fds[2], JSON.stringify(registration)); fsyncSync(fds[2]); fsyncSync(parent);
    } finally { closeSync(parent); }
  } catch {
    refuse(400, 'preparation_incomplete', 'Preparation refused or incomplete. Inspect artifacts; do not share an incomplete descriptor or overwrite existing files.');
  } finally { for (const fd of fds) closeSync(fd); }
  return { actorId: id, credentialId: registration.credentialId, ownerFile: path, curlConfig: paths[1], descriptorFile: paths[2] };
}
export function readDescriptor(path) { return descriptor(JSON.parse(readFileSync(path, 'utf8'))); }
export function parseProof(value) {
  if (typeof value !== 'string' || value.length > 200 || !value.startsWith('Bearer ')) refuse(401, 'unauthenticated', 'A valid current bearer credential is required.');
  const parts = value.slice(7).split('~');
  const secret = canonicalBytes(parts[1], 32);
  if (parts.length !== 2 || !secret || !/^[A-Za-z0-9._-]{1,128}$/.test(parts[0])) refuse(401, 'unauthenticated', 'A valid current bearer credential is required.');
  return { credentialId: parts[0], digest: createHash('sha256').update(secret).digest() };
}
export function matchesProof(proof, credential) {
  return credential && proof.credentialId === credential.credentialId && timingSafeEqual(proof.digest, Buffer.from(credential.verifier, 'base64url'));
}
