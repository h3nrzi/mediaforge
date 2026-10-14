import { Authority } from '../src/authority.js';
import { readDescriptor } from '../src/credentials.js';
import { setup } from '../src/store.js';
import { replaceCredential } from '../src/credential-actions.js';
import { failure } from '../src/contract.js';
const [mode, db, descriptorPath, id] = process.argv.slice(2);
const faults = mode.endsWith('kill') ? { afterCommit() { process.kill(process.pid, 'SIGKILL'); } } : { beforeCommit() { throw new Error('Controlled interrupted bootstrap'); } };
try {
  await setup(db);
  const authority = new Authority(db, { faults });
  const registration = readDescriptor(descriptorPath);
  if (mode.startsWith('bootstrap')) await authority.bootstrap(registration, 'Recovered initial Manager');
  else await authority.store.write(scope => replaceCredential(scope, null, id, { expectedCredentialRevision: registration.expectedCredentialRevision, registration }, Date.now(), Date.now, true));
} catch (error) { console.log(JSON.stringify(failure(error).body)); process.exitCode = 1; }
