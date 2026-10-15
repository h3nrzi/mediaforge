import test from 'node:test';
import assert from 'node:assert/strict';
import { fixture, command } from './helpers.js';

test('M01-V09: exact 30-day boundary, no renewal from reads/confirmation and host recovery after downtime', async (t) => {
  let now = Date.now();
  const f = await fixture(t, {
    clock: () => now,
  });
  const member = await f.admit();
  const original = (await f.request('/v1/me', member)).body.data;
  assert.equal(original.credential.expiresMs - original.credential.issuedMs, 2592000000);
  now = original.credential.expiresMs - 1;
  assert.equal((await f.request('/v1/me', member)).status, 200);
  const confirm = await f.request(`/v1/actors/${member.actorId}`, f.manager, 'PUT', {
    label: 'Member',
    responsibilities: [],
    registration: member.descriptor,
  });
  assert.equal(confirm.body.effect, 'none');
  assert.equal(confirm.body.data.credential.issuedAt, original.credential.issuedAt);
  now = original.credential.expiresMs;
  assert.equal((await f.request('/v1/me', member)).status, 401);
  now++;
  assert.equal((await f.request('/v1/me', member)).status, 401);
  const fresh = f.candidate(member.actorId, '1');
  assert.equal(
    (
      await f.request(`/v1/actors/${member.actorId}/credential`, member, 'POST', {
        expectedCredentialRevision: '1',
        registration: fresh.descriptor,
      })
    ).status,
    401,
  );
  // Advance beyond the original Manager's expiry, recover through the actual host command.
  now += 2592000000;
  assert.equal((await f.request('/v1/me')).status, 401);
  const candidate = f.candidate(f.manager.actorId, '1');
  assert.equal(
    command(
      'recover',
      '--db',
      f.db,
      '--actor',
      f.manager.actorId,
      '--revision',
      '1',
      '--descriptor',
      candidate.descriptorPath,
    ).code,
    0,
  );
  const current = command('recovery-status', '--db', f.db, '--actor', f.manager.actorId).data.data;
  now = current.credential.issuedMs;
  assert.equal((await f.request('/v1/me', candidate)).status, 200);
  assert.equal((await f.request('/v1/me')).status, 401);
});

test('M01-V09: fresh application-gate time refuses expiry after target/precondition checks', async (t) => {
  let now = Date.now();
  let armed = false;
  let expires;
  const f = await fixture(t, {
    clock: () => now,
    faults: {
      beforeGate() {
        if (armed) now = expires;
      },
    },
  });
  expires = (await f.request('/v1/me')).body.data.credential.expiresMs;
  armed = true;
  const response = await f.request(`/v1/actors/${f.manager.actorId}`, f.manager, 'PATCH', {
    expectedMembershipVersion: '1',
    label: 'Expired at gate',
  });
  assert.equal(response.status, 401);
  armed = false;
  now = expires - 1;
  assert.equal((await f.request('/v1/me')).body.data.label, 'Manager');
});
