import test from 'node:test';
import assert from 'node:assert/strict';
import { fixture, command } from './helpers.js';

test('M01-V08/V10: zero-role self replacement and exact revocation never revive or redirect old material', async (t) => {
  const f = await fixture(t);
  const member = await f.admit();
  const path = `/v1/actors/${member.actorId}`;
  const fresh = f.candidate(member.actorId, '1');
  assert.equal(
    (
      await f.request(`/v1/actors/${f.manager.actorId}/credential`, member, 'POST', {
        expectedCredentialRevision: '1',
        registration: fresh.descriptor,
      })
    ).status,
    403,
  );
  const replaced = await f.request(`${path}/credential`, member, 'POST', {
    expectedCredentialRevision: '1',
    registration: fresh.descriptor,
  });
  assert.equal(replaced.status, 200);
  assert.equal(replaced.body.data.membershipVersion, '1');
  assert.equal(replaced.body.data.credentialRevision, '2');
  assert.equal((await f.request('/v1/me', member)).status, 401);
  assert.equal((await f.request('/v1/me', fresh)).status, 200);
  const repeat = await f.request(`${path}/credential`, f.manager, 'POST', {
    expectedCredentialRevision: '1',
    registration: fresh.descriptor,
  });
  assert.equal(repeat.body.effect, 'none');
  assert.deepEqual(repeat.body.data, replaced.body.data);
  const oldRevoke = `${path}/credentials/${member.descriptor.credentialId}/revoke`;
  assert.equal((await f.request(oldRevoke, f.manager, 'POST', {})).status, 409);
  const revoke = `${path}/credentials/${fresh.descriptor.credentialId}/revoke`;
  const revoked = await f.request(revoke, f.manager, 'POST', {});
  assert.equal(revoked.status, 200);
  assert.equal(revoked.body.data.credentialRevision, '3');
  assert.equal((await f.request(revoke, f.manager, 'POST', {})).body.effect, 'none');
  assert.equal((await f.request('/v1/me', fresh)).status, 401);
  assert.equal(
    (
      await f.request(`${path}/credential`, f.manager, 'POST', {
        expectedCredentialRevision: '1',
        registration: fresh.descriptor,
      })
    ).status,
    409,
  );
  const newer = f.candidate(member.actorId, '3');
  assert.equal(
    (
      await f.request(`${path}/credential`, f.manager, 'POST', {
        expectedCredentialRevision: '3',
        registration: newer.descriptor,
      })
    ).status,
    200,
  );
  assert.equal((await f.request(revoke, f.manager, 'POST', {})).status, 409);
  assert.equal((await f.request('/v1/me', newer)).status, 200);
});

test('M01-V11: trusted operator recovers an admitted Manager, never a member or removed actor', async (t) => {
  const f = await fixture(t);
  const before = (await f.request('/v1/me')).body.data;
  const id = f.manager.actorId;
  const revoke = `/v1/actors/${id}/credentials/${f.manager.descriptor.credentialId}/revoke`;
  assert.equal((await f.request(revoke, f.manager, 'POST', {})).status, 200);
  assert.equal((await f.request('/v1/me')).status, 401);
  const observed = command('recovery-status', '--db', f.db, '--actor', id);
  assert.equal(observed.code, 0);
  assert.equal(observed.data.data.credentialRevision, '2');
  const candidate = f.candidate(id, '2');
  const args = [
    'recover',
    '--db',
    f.db,
    '--actor',
    id,
    '--revision',
    '2',
    '--descriptor',
    candidate.descriptorPath,
  ];
  const recovered = command(...args);
  assert.equal(recovered.code, 0);
  assert.equal(recovered.data.data.actorId, before.actorId);
  assert.equal(recovered.data.data.membershipVersion, before.membershipVersion);
  assert.deepEqual(recovered.data.data.firstAdmission, before.firstAdmission);
  assert.equal(recovered.data.data.credential.latestChange.origin, 'host_operator');
  assert.deepEqual(command(...args).data.data, recovered.data.data);
  assert.equal((await f.request('/v1/me', candidate)).status, 200);
  f.manager.bearer = candidate.bearer;
  const member = await f.admit();
  assert.equal(
    command('recovery-status', '--db', f.db, '--actor', member.actorId).data.reasonCategory,
    'ineligible_recovery',
  );
});

test('M01-V11: operator recovery refuses removed, unknown, stale and misbound targets without changes', async (t) => {
  const f = await fixture(t);
  const other = await f.admit(['Manager']);
  const candidate = f.candidate(other.actorId, '1');
  assert.equal(
    command(
      'recover',
      '--db',
      f.db,
      '--actor',
      other.actorId,
      '--revision',
      '1',
      '--descriptor',
      candidate.descriptorPath,
    ).code,
    0,
  );
  const state = (await f.request(`/v1/actors/${other.actorId}`)).body.data;
  const stale = f.candidate(other.actorId, '1');
  assert.equal(
    command(
      'recover',
      '--db',
      f.db,
      '--actor',
      other.actorId,
      '--revision',
      '1',
      '--descriptor',
      stale.descriptorPath,
    ).data.reasonCategory,
    'state_conflict',
  );
  const wrong = f.candidate(f.manager.actorId, '2');
  assert.equal(
    command(
      'recover',
      '--db',
      f.db,
      '--actor',
      other.actorId,
      '--revision',
      '2',
      '--descriptor',
      wrong.descriptorPath,
    ).data.reasonCategory,
    'state_conflict',
  );
  assert.deepEqual((await f.request(`/v1/actors/${other.actorId}`)).body.data, state);
  const unknown = f.candidate();
  assert.equal(
    command('recovery-status', '--db', f.db, '--actor', unknown.actorId).data.reasonCategory,
    'not_found',
  );
  await f.request(`/v1/actors/${other.actorId}/remove`, f.manager, 'POST', {
    expectedMembershipVersion: '1',
  });
  assert.equal(
    command('recovery-status', '--db', f.db, '--actor', other.actorId).data.reasonCategory,
    'ineligible_recovery',
  );
  const removedCandidate = f.candidate(other.actorId, '3');
  assert.equal(
    command(
      'recover',
      '--db',
      f.db,
      '--actor',
      other.actorId,
      '--revision',
      '3',
      '--descriptor',
      removedCandidate.descriptorPath,
    ).data.reasonCategory,
    'ineligible_recovery',
  );
  assert.equal((await f.request(`/v1/actors/${other.actorId}`)).body.data.membership, 'removed');
});
