import { checkRuntime } from './runtime.js';
import { prepare, readDescriptor } from './credentials.js';
import { setup, initializationStatus } from './store.js';
import { serve } from './http.js';
import { Authority } from './authority.js';
import { replaceCredential, recoveryStatus } from './credential-actions.js';
import { success, failure, text, refuse, actorId, revision } from './contract.js';

async function main() {
  checkRuntime();
  const [command, ...args] = process.argv.slice(2);
  const options = {};
  for (let i = 0; i < args.length; i += 2) {
    if (!args[i].startsWith('--') || !args[i + 1] || Object.hasOwn(options, args[i].slice(2))) refuse(400, 'invalid_input', 'Use unique --option value pairs.');
    options[args[i].slice(2)] = args[i + 1];
  }
  const allowed = {
    prepare: ['out', 'actor', 'revision'], status: ['db'], setup: ['db'],
    bootstrap: ['db', 'descriptor', 'label'], 'recovery-status': ['db', 'actor'],
    recover: ['db', 'actor', 'revision', 'descriptor'], serve: ['db', 'host', 'port', 'cert', 'key', 'budget', 'body-limit'],
  };
  if (!allowed[command] || Object.keys(options).some(key => !allowed[command].includes(key))) refuse(400, 'invalid_input', 'Unknown command or option.');
  const required = { prepare: ['out'], status: ['db'], setup: ['db'], bootstrap: ['db', 'descriptor', 'label'], 'recovery-status': ['db', 'actor'], recover: ['db', 'actor', 'revision', 'descriptor'], serve: ['db'] };
  if (required[command].some(key => !options[key])) refuse(400, 'invalid_input', 'Required command options are missing.');
  if (command === 'serve') {
    if (!!options.cert !== !!options.key || (options.port && (!/^[0-9]+$/.test(options.port) || Number(options.port) > 65535))) refuse(400, 'invalid_input', 'Supply a valid port and both certificate and key for HTTPS.');
    const server = await serve(new Authority(options.db, { budget: options.budget === undefined ? 1000 : Number(options.budget) }), { bodyLimit: options['body-limit'] === undefined ? 16384 : Number(options['body-limit']), host: options.host, port: options.port ? Number(options.port) : undefined, tls: options.cert && options.key ? { cert: options.cert, key: options.key } : undefined });
    return success({ listening: server.address() });
  }
  if (command === 'prepare') return success(prepare(options.out, options.actor, options.revision));
  if (command === 'status') return success(initializationStatus(options.db));
  if (command === 'setup') { await setup(options.db); return success(initializationStatus(options.db), true); }
  if (command === 'recovery-status' || command === 'recover') {
    const id = actorId(options.actor); const authority = new Authority(options.db);
    if (command === 'recovery-status') return success(authority.store.read(scope => recoveryStatus(scope, id, authority.clock())));
    revision(options.revision); const registration = readDescriptor(options.descriptor);
    return authority.store.write(scope => replaceCredential(scope, null, id, { expectedCredentialRevision: options.revision, registration }, authority.clock(), () => authority.clock(), true));
  }
  if (command === 'bootstrap') {
    const input = readDescriptor(options.descriptor); const label = text(options.label, 80, 'Label');
    await setup(options.db); return new Authority(options.db).bootstrap(input, label);
  }
  refuse(400, 'invalid_command', 'Supported commands: prepare, setup, status, bootstrap, serve, recovery-status, recover.');
}
try { console.log(JSON.stringify(await main())); }
catch (error) { console.log(JSON.stringify(failure(error).body)); process.exitCode = 1; }
