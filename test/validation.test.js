import test from 'node:test';
import assert from 'node:assert/strict';
import { request as rawRequest } from 'node:http';
import { readFileSync, symlinkSync, writeFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fixture, command } from './helpers.js';

async function raw(url, headers, body, method = 'GET') {
  return new Promise((resolve, reject) => {
    const request = rawRequest(url, { method, headers }, (response) => {
      let text = '';
      response.on('data', (chunk) => {
        text += chunk;
      });
      response.on('end', () =>
        resolve({
          status: response.statusCode,
          body: JSON.parse(text),
          headers: response.headers,
        }),
      );
    });
    request.on('error', reject);
    request.end(body);
  });
}

test('M01-V03/V15: strict authentication and HTTP validation return bounded private feedback', async (t) => {
  const f = await fixture(t);
  const member = await f.admit();
  const owner = JSON.parse(readFileSync(member.out, 'utf8'));
  for (const bearer of [
    null,
    'Bearer ' + owner.credentialId,
    `Bearer ${owner.credentialId}~${owner.verifier}`,
    `Bearer ${owner.credentialId}~${'A'.repeat(43)}`,
    member.bearer + '=',
    member.bearer.replace('~', '~ '),
    'Basic ' + member.bearer,
  ]) {
    const who = bearer ? { bearer } : null;
    assert.equal((await f.request('/v1/me', who)).status, 401);
  }
  const duplicate = await raw(f.url + '/v1/me', [
    'Host',
    new URL(f.url).host,
    'Authorization',
    member.bearer,
    'Authorization',
    member.bearer,
  ]);
  assert.equal(duplicate.status, 401);
  assert.equal((await f.request('/v1/me?token=ignored', null)).status, 401);
  assert.equal(
    (
      await f.request('/v1/me', null, 'GET', undefined, {
        cookie: `authorization=${member.bearer}`,
      })
    ).status,
    401,
  );
  const path = `/v1/actors/${member.actorId}`;
  const invalid = [
    { expectedMembershipVersion: 1, label: 'x' },
    { label: 'x' },
    { expectedMembershipVersion: '1', label: '' },
    { expectedMembershipVersion: '1', label: '\ud800' },
    { expectedMembershipVersion: '1', label: 'a\n' },
    { expectedMembershipVersion: '1', label: '😀'.repeat(81) },
    { expectedMembershipVersion: '1', responsibilities: ['Manager', 'Manager'] },
    { expectedMembershipVersion: '1', responsibilities: ['Unknown'] },
    { expectedMembershipVersion: '1', actorId: member.actorId },
    { expectedMembershipVersion: '1', secret: 'never accepted' },
  ];
  for (const body of invalid)
    assert.equal((await f.request(path, f.manager, 'PATCH', body)).status, 400);
  const accepted = await f.request(path, f.manager, 'PATCH', {
    expectedMembershipVersion: '1',
    label: '😀'.repeat(80),
  });
  assert.equal(accepted.status, 200);
  assert.equal(accepted.body.data.label, '😀'.repeat(80));
  assert.equal(
    (
      await raw(
        f.url + path,
        { Authorization: f.manager.bearer, 'content-type': 'application/json' },
        '{',
        'PATCH',
      )
    ).status,
    400,
  );
  assert.equal(
    (
      await raw(
        f.url + path,
        { Authorization: f.manager.bearer, 'content-type': 'text/plain' },
        '{}',
        'PATCH',
      )
    ).status,
    400,
  );
  assert.equal(
    (
      await f.request(path, f.manager, 'PATCH', {
        expectedMembershipVersion: '2',
        label: 'x'.repeat(17000),
      })
    ).status,
    413,
  );
  assert.equal((await f.request('/unsupported')).status, 404);
  assert.equal((await f.request(path + '/unsupported')).status, 404);
  assert.equal((await f.request(path + '/remove')).status, 404);
  assert.equal((await f.request(`/v1/actors/${'f'.repeat(129)}`)).status, 400);
  const unknown = f.candidate();
  assert.equal((await f.request(`/v1/actors/${unknown.actorId}`, member)).status, 403);
  assert.equal((await f.request(`/v1/actors/${unknown.actorId}`)).status, 404);
  assert.equal(
    JSON.stringify((await f.request('/v1/actors')).body).includes(owner.verifier),
    false,
  );
});

test('M01-V01: helper refuses symlink/existing artifacts and insecure parent directories', async (t) => {
  const f = await fixture(t);
  const target = join(f.dir, 'sentinel');
  writeFileSync(target, 'unchanged', { mode: 0o600 });
  const link = join(f.dir, 'link.owner.json');
  symlinkSync(target, link);
  assert.equal(command('prepare', '--out', link).code, 1);
  assert.equal(readFileSync(target, 'utf8'), 'unchanged');
  const out = join(f.dir, 'collision.owner.json');
  writeFileSync(`${out}.curl.conf`, 'existing', { mode: 0o600 });
  assert.equal(command('prepare', '--out', out).data.reasonCategory, 'preparation_incomplete');
  assert.equal(readFileSync(`${out}.curl.conf`, 'utf8'), 'existing');
  assert.equal(statSync(f.manager.config).mode & 0o777, 0o600);
  assert.equal(command('prepare', '--out', 'relative.owner.json').code, 1);
});

test('M01-V15: supported host commands reject unknown options and insecure external service transport', async (t) => {
  const f = await fixture(t);
  assert.equal(
    command('prepare', '--out', join(f.dir, 'bad.owner.json'), '--secret', 'unsupported').data
      .reasonCategory,
    'invalid_input',
  );
  assert.equal(
    command('serve', '--db', f.db, '--host', '0.0.0.0').data.reasonCategory,
    'insecure_transport',
  );
  assert.equal(
    command('serve', '--db', f.db, '--cert', 'missing-key').data.reasonCategory,
    'invalid_input',
  );
  assert.equal(
    command('serve', '--db', f.db, '--budget', '-1').data.reasonCategory,
    'invalid_input',
  );
});

test('M01-V15: revision exhaustion refuses complete operations without partial invalidation', async (t) => {
  const f = await fixture(t);
  const member = await f.admit();
  const path = `/v1/actors/${member.actorId}`;
  // Exhaustion-only construction fixture; no accepted outcome or history is invented.
  await f.authority.store.write((scope) => {
    const actor = scope.actor(member.actorId);
    actor.membershipVersion = '9223372036854775807';
    scope.saveActor(actor);
  });
  const before = (await f.request(path)).body.data;
  const response = await f.request(path, f.manager, 'PATCH', {
    expectedMembershipVersion: '9223372036854775807',
    label: 'Cannot apply',
  });
  assert.equal(response.status, 409);
  assert.equal(response.body.reasonCategory, 'revision_exhausted');
  assert.ok([...response.body.message].length <= 512);
  assert.deepEqual((await f.request(path)).body.data, before);
  await f.authority.store.write((scope) => {
    const actor = scope.actor(member.actorId);
    actor.membershipVersion = '1';
    actor.credentialRevision = '9223372036854775807';
    scope.saveActor(actor);
  });
  const state = (await f.request(path)).body.data;
  const removal = await f.request(`${path}/remove`, f.manager, 'POST', {
    expectedMembershipVersion: '1',
  });
  assert.equal(removal.status, 409);
  assert.deepEqual((await f.request(path)).body.data, state);
  const revoke = await f.request(
    `${path}/credentials/${member.descriptor.credentialId}/revoke`,
    f.manager,
    'POST',
    {},
  );
  assert.equal(revoke.status, 409);
  assert.deepEqual((await f.request(path)).body.data, state);
  assert.equal((await f.request('/v1/me', member)).status, 200);
  assert.equal(
    (
      await f.request(path, f.manager, 'PATCH', {
        expectedMembershipVersion: '9223372036854775808',
        label: 'Too large',
      })
    ).status,
    400,
  );
  assert.equal(
    command(
      'prepare',
      '--out',
      join(f.dir, 'exhausted.owner.json'),
      '--actor',
      member.actorId,
      '--revision',
      '9223372036854775807',
    ).data.reasonCategory,
    'revision_exhausted',
  );
});
