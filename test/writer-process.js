import { DatabaseSync } from 'node:sqlite';
import { readFileSync, existsSync, writeSync } from 'node:fs';
import { Authority } from '../src/authority.js';
import { replaceCredential } from '../src/credential-actions.js';
import { readDescriptor } from '../src/credentials.js';
import { editActor, removeActor } from '../src/membership.js';
const [mode, dbPath, ownerPath, id, releasePath, value, descriptorPath] = process.argv.slice(2);
if (mode === 'hold') {
  const db = new DatabaseSync(dbPath, { timeout: 0 });
  db.exec('BEGIN IMMEDIATE'); process.send('held');
  process.on('message', message => { if (message === 'release') { db.exec('COMMIT'); db.close(); process.exit(0); } });
} else {
  const owner = mode === 'recover' ? null : JSON.parse(readFileSync(ownerPath, 'utf8'));
  const bearer = owner ? `Bearer ${owner.credentialId}~${owner.secret}` : null;
  const authority = new Authority(dbPath, { faults: { beforeCommit() {
    writeSync(1, 'ready\n');
    const until = Date.now() + 10000;
    while (!existsSync(releasePath)) {
      if (Date.now() >= until) throw new Error('Test barrier timeout');
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 10);
    }
  } } });
  if (mode === 'recover' || mode === 'replace') {
    const registration = readDescriptor(descriptorPath);
    const body = { expectedCredentialRevision: value, registration };
    if (mode === 'recover') await authority.store.write(scope => replaceCredential(scope, null, id, body, Date.now(), Date.now, true));
    else await authority.mutate(bearer, (scope, caller, now, gate) => replaceCredential(scope, caller, id, body, now, gate));
    process.exit(0);
  }
  const op = mode === 'remove' ? removeActor : editActor;
  const body = mode === 'remove' ? { expectedMembershipVersion: value } : { expectedMembershipVersion: value, responsibilities: [] };
  await authority.mutate(bearer, (scope, caller, now) => op(scope, caller, id, body, now));
  process.exit(0);
}
