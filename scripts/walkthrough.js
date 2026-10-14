import { spawn, execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { checkRuntime } from '../src/runtime.js';

const execute = promisify(execFile);
export async function walkthrough() {
  checkRuntime();
  const dir = mkdtempSync(join(tmpdir(), 'mediaforge-walkthrough-'));
  const db = join(dir, 'workspace.sqlite'); let service; let index = 0;
  const evidence = []; const forbidden = [];
  async function command(...args) {
    const { stdout } = await execute(process.execPath, ['src/cli.js', ...args]);
    return JSON.parse(stdout);
  }
  async function candidate(label, actor, revision = '0') {
    const out = join(dir, `${++index}.owner.json`);
    const args = ['prepare', '--out', out]; if (actor) args.push('--actor', actor, '--revision', revision);
    const result = await command(...args);
    const owner = JSON.parse(readFileSync(result.data.ownerFile, 'utf8'));
    forbidden.push(owner.secret, owner.verifier);
    assert.equal(result.data.secret, undefined);
    return { label, ...result.data, descriptor: JSON.parse(readFileSync(result.data.descriptorFile, 'utf8')) };
  }
  function record(operation, status, body) {
    evidence.push({ operation, httpStatus: status, result: body.result, actionStatus: body.actionStatus, reasonCategory: body.reasonCategory, actorId: body.data?.actorId, membershipVersion: body.data?.membershipVersion, credentialRevision: body.data?.credentialRevision, responsibilities: body.data?.responsibilities, credentialStatus: body.data?.credential?.status, issuedAt: body.data?.credential?.issuedAt, expiresAt: body.data?.credential?.expiresAt });
  }
  try {
    const version = (await execute('curl', ['--disable', '--version'])).stdout;
    assert.match(version, /^curl 8\./);
    let manager = await candidate('Initial Manager');
    const boot = await command('bootstrap', '--db', db, '--descriptor', manager.descriptorFile, '--label', manager.label);
    record('operator bootstrap', undefined, boot);
    service = spawn(process.execPath, ['src/cli.js', 'serve', '--db', db, '--port', '0'], { stdio: ['ignore', 'pipe', 'pipe'] });
    let startup = '';
    for await (const chunk of service.stdout.iterator({ destroyOnReturn: false })) { startup += chunk; if (startup.includes('\n')) break; }
    const address = JSON.parse(startup.split('\n')[0]).data.listening;
    const base = `http://127.0.0.1:${address.port}`;
    async function curl(operation, who, path, method = 'GET', body, expected = 200) {
      const responseFile = join(dir, `response-${++index}.json`);
      const headerFile = join(dir, `headers-${index}.txt`);
      const args = ['--disable', '--config', who.curlConfig, '--silent', '--show-error', '--fail-with-body', '--output', responseFile, '--dump-header', headerFile, '--write-out', '%{http_code}', '--request', method];
      if (body !== undefined) { const file = join(dir, `body-${index}.json`); writeFileSync(file, JSON.stringify(body), { mode: 0o600 }); args.push('--json', `@${file}`); }
      args.push(base + path);
      let status;
      try { status = Number((await execute('curl', args)).stdout); }
      catch (error) { assert.equal(error.code, 22); status = Number(error.stdout); }
      assert.equal(status, expected, operation);
      assert.match(readFileSync(headerFile, 'utf8'), /cache-control: no-store/i);
      const response = JSON.parse(readFileSync(responseFile, 'utf8')); record(operation, status, response); return response;
    }
    await curl('Manager self', manager, '/v1/me');
    const roles = [[], ['Contributor'], ['Reviewer'], ['Operations'], ['Manager'], ['Contributor', 'Reviewer'], ['Contributor', 'Reviewer', 'Operations', 'Manager']];
    const actors = [];
    for (const assignments of roles) {
      const member = await candidate(assignments.join('+') || 'Zero responsibilities');
      await curl('admit ' + member.label, manager, `/v1/actors/${member.actorId}`, 'PUT', { label: member.label, responsibilities: assignments, registration: member.descriptor });
      await curl('self ' + member.label, member, '/v1/me'); actors.push(member);
    }
    const zero = actors[0]; const path = `/v1/actors/${zero.actorId}`;
    await curl('zero-role management denied', zero, '/v1/actors', 'GET', undefined, 403);
    await curl('label edit', manager, path, 'PATCH', { expectedMembershipVersion: '1', label: 'Renamed member' });
    await curl('stale edit refused', manager, path, 'PATCH', { expectedMembershipVersion: '1', label: 'Stale' }, 409);
    await curl('current facts after stale edit', manager, path);
    await curl('remove member', manager, `${path}/remove`, 'POST', { expectedMembershipVersion: '2' });
    await curl('removed credential denied', zero, '/v1/me', 'GET', undefined, 401);
    const returned = await candidate('Returned member', zero.actorId, '2');
    await curl('exact-ID readmission', manager, `${path}/readmit`, 'POST', { expectedMembershipVersion: '3', expectedCredentialRevision: '2', responsibilities: [], registration: returned.descriptor });
    await curl('readmitted self', returned, '/v1/me');
    const replacement = await candidate('Self replacement', zero.actorId, '3');
    await curl('zero-role self replacement', returned, `${path}/credential`, 'POST', { expectedCredentialRevision: '3', registration: replacement.descriptor });
    await curl('replaced credential denied', returned, '/v1/me', 'GET', undefined, 401);
    await curl('saved replacement candidate inspection', replacement, '/v1/me');
    const managed = await candidate('Manager replacement', zero.actorId, '4');
    await curl('Manager replaces member credential', manager, `${path}/credential`, 'POST', { expectedCredentialRevision: '4', registration: managed.descriptor });
    await curl('exact credential revoke', manager, `${path}/credentials/${managed.credentialId}/revoke`, 'POST', {});
    await curl('repeated exact revoke adds no effect', manager, `${path}/credentials/${managed.credentialId}/revoke`, 'POST', {});
    const restore = await candidate('Member restoration', zero.actorId, '6');
    await curl('restore admitted member', manager, `${path}/credential`, 'POST', { expectedCredentialRevision: '6', registration: restore.descriptor });
    await curl('old revoke cannot redirect', manager, `${path}/credentials/${managed.credentialId}/revoke`, 'POST', {}, 409);
    // Remove Manager credentials, preserving the memberships counted by the invariant.
    for (const admin of [actors[4], actors[6], manager]) {
      await curl('Manager exact self revoke', admin, `/v1/actors/${admin.actorId}/credentials/${admin.credentialId}/revoke`, 'POST', {});
    }
    record('operator recovery status', undefined, await command('recovery-status', '--db', db, '--actor', manager.actorId));
    const recovery = await candidate('Recovered Manager', manager.actorId, '2');
    const recovered = await command('recover', '--db', db, '--actor', manager.actorId, '--revision', '2', '--descriptor', recovery.descriptorFile);
    record('operator recovers total Manager credential loss', undefined, recovered);
    manager = recovery;
    await curl('recovered Manager self', manager, '/v1/me');
    await curl('directory after recovery', manager, '/v1/actors?limit=2');
    const serialized = JSON.stringify(evidence);
    for (const value of forbidden) assert.equal(serialized.includes(value), false);
    return { runtime: process.versions.node, curl: version.split('\n')[0], scope: 'Module 01 HTTP/operator workflow; later capability acceptance remains outstanding', observations: evidence };
  } finally {
    if (service && service.exitCode === null) { const exited = once(service, 'exit'); service.kill(); await exited; }
    rmSync(dir, { recursive: true, force: true });
  }
}
if (process.argv[1]?.endsWith('/walkthrough.js')) {
  try { console.log(JSON.stringify(await walkthrough(), null, 2)); }
  catch { console.error('Walkthrough failed; inspect the isolated workflow. Credential material is omitted.'); process.exitCode = 1; }
}
