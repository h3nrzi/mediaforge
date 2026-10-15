import test from 'node:test';
import assert from 'node:assert/strict';
import { fixture } from './helpers.js';

test('M01-V16: directory bounds, immutable ordering, filter-bound cursors and each-page Manager authority', async (t) => {
  let now = Date.now() + 10000;
  const f = await fixture(t, {
    clock: () => now,
  });
  const secondManager = await f.admit(['Manager']);
  const people = [];
  for (let i = 0; i < 102; i++) people.push(await f.admit([], `Member ${i}`));
  const defaultPage = await f.request('/v1/actors');
  assert.equal(defaultPage.body.data.items.length, 50);
  const page = (await f.request('/v1/actors?limit=100&membership=admitted')).body.data;
  assert.equal(page.items.length, 100);
  const ids = [secondManager.actorId, ...people.map((p) => p.actorId)].sort().reverse();
  assert.deepEqual(
    page.items.map((a) => a.actorId),
    ids.slice(0, 100),
  );
  assert.equal(
    (await f.request(`/v1/actors?cursor=${page.nextCursor}&membership=removed`)).status,
    400,
  );
  const remainder = (
    await f.request(`/v1/actors?limit=100&membership=admitted&cursor=${page.nextCursor}`)
  ).body.data;
  assert.equal(remainder.items.length, 4); // Three tied actors, then the original Manager.
  assert.equal(remainder.nextCursor, null);
  for (const query of [
    'limit=0',
    'limit=101',
    'limit=01',
    'limit=1&limit=2',
    'membership=unknown',
    'actorId=',
    'membership=',
    'cursor=',
  ]) {
    assert.equal((await f.request('/v1/actors?' + query)).status, 400);
  }
  const person = people[0];
  const first = (await f.request(`/v1/actors/${person.actorId}`)).body.data.firstAdmission;
  await f.request(`/v1/actors/${person.actorId}/remove`, f.manager, 'POST', {
    expectedMembershipVersion: '1',
  });
  assert.equal(
    (await f.request(`/v1/actors?actorId=${person.actorId}&membership=removed`)).body.data.items[0]
      .membership,
    'removed',
  );
  now += 10000;
  const fresh = f.candidate(person.actorId, '2');
  await f.request(`/v1/actors/${person.actorId}/readmit`, f.manager, 'POST', {
    expectedMembershipVersion: '2',
    expectedCredentialRevision: '2',
    responsibilities: [],
    registration: fresh.descriptor,
  });
  assert.deepEqual(
    (await f.request(`/v1/actors/${person.actorId}`)).body.data.firstAdmission,
    first,
  );
  await f.request(`/v1/actors/${f.manager.actorId}`, secondManager, 'PATCH', {
    expectedMembershipVersion: '1',
    responsibilities: [],
  });
  assert.equal(
    (await f.request(`/v1/actors?cursor=${defaultPage.body.data.nextCursor}`)).status,
    403,
  );
  assert.equal((await f.request('/v1/me')).status, 200);
});
