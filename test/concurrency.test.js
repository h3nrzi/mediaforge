import test from 'node:test';
import assert from 'node:assert/strict';
import { fork, spawn } from 'node:child_process';
import { once } from 'node:events';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { performance } from 'node:perf_hooks';
import { fixture } from './helpers.js';

async function hold(t, db) {
  const child = fork('test/writer-process.js', ['hold', db], { execPath: process.execPath, stdio: ['ignore', 'ignore', 'ignore', 'ipc'] });
  t.after(() => child.kill()); await once(child, 'message'); return child;
}
async function blockedChange(t, f, who, target, mode, version = '1', descriptorPath = '') {
  const release = join(f.dir, `release-${target}-${mode}`);
  const child = spawn(process.execPath, ['test/writer-process.js', mode, f.db, who.out, target, release, version, descriptorPath], { stdio: ['ignore', 'pipe', 'pipe'] });
  t.after(() => child.kill());
  await once(child.stdout, 'data');
  return { child, release: async () => { const exit = once(child, 'exit'); writeFileSync(release, 'release', { mode: 0o600 }); assert.equal((await exit)[0], 0); } };
}

test('M01-V12: independent writer yields bounded known refusal with a responsive HTTP read', async t => {
  let executions = 0;
  const f = await fixture(t, { budget: 70, faults: { beforeBody: () => { executions++; } } });
  const child = await hold(t, f.db);
  const started = performance.now();
  const pending = f.request(`/v1/actors/${f.manager.actorId}`, f.manager, 'PATCH', { expectedMembershipVersion: '1', label: 'Contended' });
  assert.equal((await f.request('/v1/me')).status, 200);
  const response = await pending;
  assert.equal(response.status, 503); assert.equal(response.body.actionStatus, 'refused_without_effect');
  assert.equal(response.body.reasonCategory, 'contention'); assert.equal(executions, 0);
  assert.ok(performance.now() - started < 600);
  const exited = once(child, 'exit'); child.send('release'); await exited;
  assert.equal((await f.request('/v1/me')).body.data.label, 'Manager');
});

test('M01-V09/V12: expiry during writer wait wins at the final gate', async t => {
  let now = Date.now(); let busy;
  const waiting = new Promise(resolve => { busy = resolve; });
  const f = await fixture(t, { clock: () => now, faults: { onBusy: () => busy() } });
  const me = (await f.request('/v1/me')).body.data;
  const child = await hold(t, f.db);
  const pending = f.request(`/v1/actors/${f.manager.actorId}`, f.manager, 'PATCH', { expectedMembershipVersion: '1', label: 'Too late' });
  await waiting; now = me.credential.expiresMs;
  const exit = once(child, 'exit'); child.send('release'); await exit;
  assert.equal((await pending).status, 401);
  now--;
  assert.equal((await f.request('/v1/me')).body.data.label, 'Manager');
});

test('M01-V05/V09: independent self-demotions serialize; waiting caller loses Manager power', async t => {
  let busy;
  const f = await fixture(t, { faults: { onBusy: () => busy?.() } });
  const other = await f.admit(['Manager']);
  const first = await blockedChange(t, f, f.manager, f.manager.actorId, 'demote');
  const waiting = new Promise(resolve => { busy = resolve; });
  const pending = f.request(`/v1/actors/${other.actorId}`, other, 'PATCH', { expectedMembershipVersion: '1', responsibilities: [] });
  await waiting; await first.release();
  assert.equal((await pending).status, 409);
  const directory = (await f.request('/v1/actors', other)).body.data.items;
  assert.equal(directory.filter(a => a.responsibilities.includes('Manager')).length, 1);
  assert.equal((await f.request('/v1/actors')).status, 403);
});

test('M01-V05/V09: removal while waiting denies the caller and leaves target unchanged', async t => {
  let busy;
  const f = await fixture(t, { faults: { onBusy: () => busy?.() } });
  const other = await f.admit(['Manager']);
  const first = await blockedChange(t, f, f.manager, other.actorId, 'remove');
  const waiting = new Promise(resolve => { busy = resolve; });
  const pending = f.request(`/v1/actors/${f.manager.actorId}`, other, 'PATCH', { expectedMembershipVersion: '1', label: 'Unauthorized' });
  await waiting; await first.release();
  assert.equal((await pending).status, 401);
  assert.equal((await f.request('/v1/me')).body.data.label, 'Manager');
});

test('M01-V08/V09: operator recovery wins ordering; waiting Manager replacement cannot overwrite its revision', async t => {
  let busy;
  const f = await fixture(t, { faults: { onBusy: () => busy?.() } });
  const other = await f.admit(['Manager']);
  const recovery = f.candidate(other.actorId, '1');
  const competing = f.candidate(other.actorId, '1');
  const first = await blockedChange(t, f, f.manager, other.actorId, 'recover', '1', recovery.descriptorPath);
  const waiting = new Promise(resolve => { busy = resolve; });
  const pending = f.request(`/v1/actors/${other.actorId}/credential`, f.manager, 'POST', { expectedCredentialRevision: '1', registration: competing.descriptor });
  await waiting; await first.release();
  assert.equal((await pending).status, 409);
  const current = (await f.request('/v1/me', recovery)).body.data;
  assert.equal(current.credentialRevision, '2'); assert.equal(current.credential.latestChange.origin, 'host_operator');
  assert.equal((await f.request('/v1/me', competing)).status, 401);
});

test('M01-V08/V09: replacement while waiting invalidates authenticating proof at the gate', async t => {
  let busy;
  const f = await fixture(t, { faults: { onBusy: () => busy?.() } });
  const fresh = f.candidate(f.manager.actorId, '1');
  const first = await blockedChange(t, f, f.manager, f.manager.actorId, 'replace', '1', fresh.descriptorPath);
  const waiting = new Promise(resolve => { busy = resolve; });
  const pending = f.request(`/v1/actors/${f.manager.actorId}`, f.manager, 'PATCH', { expectedMembershipVersion: '1', label: 'Stale proof' });
  await waiting; await first.release();
  assert.equal((await pending).status, 401);
  assert.equal((await f.request('/v1/me', fresh)).body.data.label, 'Manager');
});

test('M01-V06/V12: two queued edits execute once each; current version prevents lost updates', async t => {
  let attempts = 0; let bodies = 0; let busy;
  const f = await fixture(t, { faults: { onBusy() { attempts++; if (attempts >= 4) busy?.(); }, beforeBody() { bodies++; } } });
  const member = await f.admit(); bodies = 0;
  const writer = await hold(t, f.db);
  const waiting = new Promise(resolve => { busy = resolve; });
  const path = `/v1/actors/${member.actorId}`;
  const pending = ['One', 'Two'].map(label => f.request(path, f.manager, 'PATCH', { expectedMembershipVersion: '1', label }));
  await waiting;
  const exit = once(writer, 'exit'); writer.send('release'); await exit;
  const results = await Promise.all(pending);
  assert.deepEqual(results.map(r => r.status).sort(), [200, 409]); assert.equal(bodies, 2);
  assert.equal((await f.request(path)).body.data.membershipVersion, '2');
  assert.ok(attempts >= 4);
});

test('M01-V09: demotion while waiting denies an earlier Manager permission snapshot', async t => {
  let busy;
  const f = await fixture(t, { faults: { onBusy: () => busy?.() } });
  const other = await f.admit(['Manager']);
  const first = await blockedChange(t, f, f.manager, other.actorId, 'demote');
  const waiting = new Promise(resolve => { busy = resolve; });
  const pending = f.request(`/v1/actors/${f.manager.actorId}`, other, 'PATCH', { expectedMembershipVersion: '1', label: 'Old permission' });
  await waiting; await first.release();
  assert.equal((await pending).status, 403);
  assert.equal((await f.request('/v1/me')).body.data.label, 'Manager');
});
