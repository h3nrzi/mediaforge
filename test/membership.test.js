import test from 'node:test';
import assert from 'node:assert/strict';
import { fixture } from './helpers.js';

test('M01-V03/V06: Manager admits a zero-role actor; edits have guarded no-effect replay', async t => {
  const f = await fixture(t);
  const member = await f.admit([], '同名');
  assert.deepEqual((await f.request('/v1/me', member)).body.data.responsibilities, []);
  assert.equal((await f.request('/v1/actors', member)).status, 403);
  assert.equal((await f.request(`/v1/actors/${f.manager.actorId}`, member)).status, 403);
  const path = `/v1/actors/${member.actorId}`;
  const edit = { expectedMembershipVersion: '1', label: 'Changed' };
  const changed = await f.request(path, f.manager, 'PATCH', edit);
  assert.equal(changed.body.data.membershipVersion, '2');
  const repeated = await f.request(path, f.manager, 'PATCH', edit);
  assert.equal(repeated.body.effect, 'none');
  assert.deepEqual(repeated.body.data, changed.body.data);
  const stale = await f.request(path, f.manager, 'PATCH', { ...edit, label: 'Stale' });
  assert.equal(stale.status, 409);
  assert.equal(stale.body.currentState.label, 'Changed');
  assert.equal((await f.request(`/v1/actors/${f.manager.actorId}`, f.manager, 'PATCH', { expectedMembershipVersion: '1', responsibilities: [] })).status, 409);
});

test('M01-V05/V07: removal invalidates access; readmission preserves identity with fresh explicit assignments', async t => {
  const f = await fixture(t);
  const member = await f.admit(['Contributor'], 'Same label');
  const path = `/v1/actors/${member.actorId}`;
  const before = (await f.request(path)).body.data;
  const removed = await f.request(`${path}/remove`, f.manager, 'POST', { expectedMembershipVersion: '1' });
  assert.equal(removed.status, 200);
  assert.equal(removed.body.data.membershipVersion, '2');
  assert.equal(removed.body.data.credentialRevision, '2');
  assert.deepEqual(removed.body.data.responsibilities, []);
  assert.equal((await f.request('/v1/me', member)).status, 401);
  assert.equal((await f.request(`${path}/remove`, f.manager, 'POST', { expectedMembershipVersion: '1' })).body.effect, 'none');
  const fresh = f.candidate(member.actorId, '2');
  const readmission = await f.request(`${path}/readmit`, f.manager, 'POST', { expectedMembershipVersion: '2', expectedCredentialRevision: '2', responsibilities: [], registration: fresh.descriptor });
  assert.equal(readmission.status, 200);
  assert.deepEqual(readmission.body.data.firstAdmission, before.firstAdmission);
  assert.equal(readmission.body.data.membershipVersion, '3');
  assert.equal((await f.request('/v1/me', fresh)).status, 200);
  assert.equal((await f.request('/v1/me', member)).status, 401);
  assert.equal((await f.request(`${path}/remove`, f.manager, 'POST', { expectedMembershipVersion: '1' })).status, 409);
  assert.equal((await f.request(`/v1/actors/${f.manager.actorId}/remove`, f.manager, 'POST', { expectedMembershipVersion: '1' })).status, 409);
  const other = await f.admit([], 'Same label');
  assert.notEqual(other.actorId, member.actorId);
});

test('M01-V06/V07: first-admission attribution survives the admitting Manager relabel/removal', async t => {
  const f = await fixture(t);
  const other = await f.admit(['Manager'], 'Other Manager');
  const member = await f.admit([], 'Member');
  const first = (await f.request(`/v1/actors/${member.actorId}`)).body.data.firstAdmission;
  assert.equal(first.actorId, f.manager.actorId); assert.equal(first.label, 'Manager');
  await f.request(`/v1/actors/${f.manager.actorId}`, f.manager, 'PATCH', { expectedMembershipVersion: '1', label: 'Relabeled' });
  await f.request(`/v1/actors/${f.manager.actorId}/remove`, other, 'POST', { expectedMembershipVersion: '2' });
  assert.deepEqual((await f.request(`/v1/actors/${member.actorId}`, other)).body.data.firstAdmission, first);
  const current = (await f.request(`/v1/actors/${f.manager.actorId}`, other)).body.data;
  assert.equal(current.membershipVersion, '3'); assert.equal(current.latestMembershipChange.actorId, other.actorId);
});

test('M01-V06/V10: removal of an already-revoked credential adds no credential revision', async t => {
  const f = await fixture(t); const member = await f.admit(['Reviewer']); const path = `/v1/actors/${member.actorId}`;
  const revoked = await f.request(`${path}/credentials/${member.descriptor.credentialId}/revoke`, f.manager, 'POST', {});
  const removed = await f.request(`${path}/remove`, f.manager, 'POST', { expectedMembershipVersion: '1' });
  assert.equal(removed.body.data.credentialRevision, revoked.body.data.credentialRevision);
  assert.deepEqual(removed.body.data.credential.latestChange, revoked.body.data.credential.latestChange);
  assert.equal(removed.body.data.membershipVersion, '2');
});
