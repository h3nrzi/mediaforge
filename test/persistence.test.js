import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawn, spawnSync } from 'node:child_process';
import { once } from 'node:events';
import { fixture, command } from './helpers.js';
import { Authority } from '../src/authority.js';

function temp(t) { const dir = mkdtempSync(join(tmpdir(), 'mf-')); t.after(() => rmSync(dir, { recursive: true, force: true })); return dir; }

test('M01-V02/V14: interrupted bootstrap rolls back; actual post-commit process kill recovers the saved candidate', async t => {
  const dir = temp(t); const db = join(dir, 'authority.sqlite'); const out = join(dir, 'initial.owner.json');
  assert.equal(command('prepare', '--out', out).code, 0);
  const descriptor = `${out}.registration.json`;
  const failed = spawnSync(process.execPath, ['test/lifecycle-process.js', 'bootstrap-fail', db, descriptor], { encoding: 'utf8' });
  assert.equal(JSON.parse(failed.stdout).actionStatus, 'refused_without_effect');
  assert.equal(command('status', '--db', db).data.data.state, 'uninitialized');
  const killed = spawnSync(process.execPath, ['test/lifecycle-process.js', 'bootstrap-kill', db, descriptor]);
  assert.equal(killed.signal, 'SIGKILL');
  const owner = JSON.parse(readFileSync(out, 'utf8'));
  const proof = `Bearer ${owner.credentialId}~${owner.secret}`;
  const restored = new Authority(db).read(proof, (_, actor) => actor);
  assert.equal(restored.actorId, owner.actorId); assert.deepEqual(restored.responsibilities, ['Manager']);
  assert.equal(command('bootstrap', '--db', db, '--descriptor', descriptor, '--label', 'New').code, 1);
  assert.equal(command('status', '--db', db).data.data.initialManagerActorId, owner.actorId);
});

test('M01-V02: competing independent bootstrap commands initialize one candidate only', async t => {
  const dir = temp(t); const db = join(dir, 'workspace.sqlite');
  command('setup', '--db', db);
  const descriptors = ['A', 'B'].map(name => { const out = join(dir, `${name}.owner.json`); command('prepare', '--out', out); return `${out}.registration.json`; });
  const children = descriptors.map(path => spawn(process.execPath, ['src/cli.js', 'bootstrap', '--db', db, '--descriptor', path, '--label', 'Competing'], { stdio: ['ignore', 'pipe', 'ignore'] }));
  const results = await Promise.all(children.map(async child => { let output = ''; child.stdout.on('data', data => { output += data; }); const [code] = await once(child, 'exit'); return { code, body: JSON.parse(output) }; }));
  assert.deepEqual(results.map(r => r.code).sort(), [0, 1]);
  const loser = results.find(r => r.code === 1).body;
  assert.ok(['already_initialized', 'unavailable'].includes(loser.reasonCategory));
  assert.equal(loser.actionStatus, 'refused_without_effect');
  for (const path of descriptors) assert.equal(command('bootstrap', '--db', db, '--descriptor', path, '--label', 'Repeat').data.reasonCategory, 'already_initialized');
  assert.equal(command('status', '--db', db).data.data.state, 'initialized');
});

test('M01-V14: ordinary startup fails closed for absent/corrupt stores; explicit setup is non-destructive', async t => {
  const f = await fixture(t);
  const absent = join(f.dir, 'absent.sqlite');
  assert.equal(command('serve', '--db', absent).code, 1); assert.equal(existsSync(absent), false);
  const corrupt = join(f.dir, 'corrupt.sqlite'); writeFileSync(corrupt, 'not a database', { mode: 0o600 });
  assert.equal(command('status', '--db', corrupt).data.data.state, 'unavailable');
  assert.equal(command('serve', '--db', corrupt).code, 1);
  assert.equal(command('bootstrap', '--db', corrupt, '--descriptor', f.manager.descriptorPath, '--label', 'Wrong').code, 1);
  assert.equal(readFileSync(corrupt, 'utf8'), 'not a database');
  const before = (await f.request('/v1/me')).body.data;
  assert.equal(command('setup', '--db', f.db).code, 0);
  assert.deepEqual((await f.request('/v1/me')).body.data, before);
  assert.equal(new Authority(f.db).read(f.manager.bearer, scope => scope.sql.prepare('PRAGMA journal_mode').get().journal_mode), 'wal');
});

test('M01-V14: actual recovery-process termination preserves new credential and historical facts', async t => {
  const f = await fixture(t); const before = (await f.request('/v1/me')).body.data;
  const candidate = f.candidate(f.manager.actorId, '1');
  const killed = spawnSync(process.execPath, ['test/lifecycle-process.js', 'recover-kill', f.db, candidate.descriptorPath, f.manager.actorId]);
  assert.equal(killed.signal, 'SIGKILL');
  const recovered = new Authority(f.db).read(candidate.bearer, (_, actor) => actor);
  assert.equal(recovered.membershipVersion, before.membershipVersion);
  assert.deepEqual(recovered.firstAdmission, before.firstAdmission);
  assert.equal(recovered.credential.latestChange.origin, 'host_operator');
  assert.throws(() => new Authority(f.db).read(f.manager.bearer, () => {}), error => error.status === 401);
});

test('M01-V13: operator recovery pre-commit failure preserves previous credential and membership facts', async t => {
  const f = await fixture(t); const before = (await f.request('/v1/me')).body.data;
  const candidate = f.candidate(f.manager.actorId, '1');
  const result = spawnSync(process.execPath, ['test/lifecycle-process.js', 'recover-fail', f.db, candidate.descriptorPath, f.manager.actorId], { encoding: 'utf8' });
  assert.equal(JSON.parse(result.stdout).actionStatus, 'refused_without_effect');
  assert.deepEqual((await f.request('/v1/me')).body.data, before);
  assert.equal((await f.request('/v1/me', candidate)).status, 401);
});
