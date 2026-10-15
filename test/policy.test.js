import test from 'node:test';
import assert from 'node:assert/strict';
import { fixture } from './helpers.js';

const kinds = [
  'shared_read',
  'source_submit',
  'request_submit',
  'request_retry',
  'request_cancel',
  'selection',
  'evidence_check',
  'provisional_cleanup',
  'membership_manage',
  'responsibilities_manage',
  'accepted_media_delete',
  'deletion_followup',
  'unknown',
];
const alone = {
  Contributor: [
    'shared_read',
    'source_submit',
    'request_submit',
    'request_retry',
    'request_cancel',
  ],
  Reviewer: ['shared_read', 'selection'],
  Operations: [
    'shared_read',
    'request_retry',
    'request_cancel',
    'evidence_check',
    'provisional_cleanup',
  ],
  Manager: [
    'shared_read',
    'membership_manage',
    'responsibilities_manage',
    'accepted_media_delete',
    'deletion_followup',
  ],
};

test('M01-V04: local policy-contract matrix covers zero, each alone and all sixteen responsibility combinations', async (t) => {
  const f = await fixture(t);
  const roles = Object.keys(alone);
  // Enumerate every independent role combination without assuming Manager inheritance.
  for (let mask = 0; mask < 16; mask++) {
    const assignments = roles.filter((_, i) => mask & (1 << i));
    const actor = await f.admit(assignments);
    const allowed = new Set(['shared_read', ...assignments.flatMap((role) => alone[role])]);
    for (const kind of kinds) {
      const call = f.authority.admit(
        actor.bearer,
        kind,
        () => ({ submittingActorId: actor.actorId, uploaderActorId: f.manager.actorId }),
        (_, attribution) => attribution,
      );
      if (allowed.has(kind)) assert.equal((await call).actorId, actor.actorId);
      else await assert.rejects(call, (error) => error.status === 403);
    }
    // Swap submitter and uploader to prove that source ownership does not grant request authority.
    for (const kind of ['request_retry', 'request_cancel']) {
      const call = f.authority.admit(
        actor.bearer,
        kind,
        () => ({ submittingActorId: f.manager.actorId, uploaderActorId: actor.actorId }),
        () => 'admitted',
      );
      if (assignments.includes('Operations')) assert.equal(await call, 'admitted');
      else await assert.rejects(call, (error) => error.status === 403);
    }
  }
});

test('M01-V07: local consumer effects retain attribution, roll back on refusal and cannot commit separately', async (t) => {
  const f = await fixture(t);
  const member = await f.admit(['Contributor'], 'Original label');
  await f.authority.store.write((scope) =>
    scope.sql.exec(
      'CREATE TABLE test_effects (id TEXT PRIMARY KEY, actor_id TEXT REFERENCES actors(id), label TEXT, action_time TEXT) STRICT',
    ),
  );
  let escaped;
  await f.authority.admit(
    member.bearer,
    'request_submit',
    () => ({}),
    (tx, attribution) => {
      escaped = tx;
      tx.run(
        'INSERT INTO test_effects VALUES (?, ?, ?, ?)',
        'retained',
        attribution.actorId,
        attribution.label,
        attribution.time,
      );
    },
  );
  // A retained consumer facade must be unusable after its owning transaction has ended.
  assert.throws(() => escaped.run('DELETE FROM test_effects'));
  await assert.rejects(
    f.authority.admit(
      member.bearer,
      'request_submit',
      () => ({}),
      (tx) => tx.run('COMMIT'),
    ),
  );
  await assert.rejects(
    f.authority.admit(
      member.bearer,
      'request_submit',
      () => ({}),
      (tx, attribution) => {
        tx.run(
          'INSERT INTO test_effects VALUES (?, ?, ?, ?)',
          'refused',
          attribution.actorId,
          attribution.label,
          attribution.time,
        );
        throw new Error('Consumer eligibility refused');
      },
    ),
  );
  const path = `/v1/actors/${member.actorId}`;
  await f.request(path, f.manager, 'PATCH', {
    expectedMembershipVersion: '1',
    label: 'Current label',
  });
  await f.request(`${path}/remove`, f.manager, 'POST', { expectedMembershipVersion: '2' });
  const facts = await f.authority.admit(
    f.manager.bearer,
    'shared_read',
    () => ({}),
    (tx) => tx.all('SELECT actor_id, label FROM test_effects'),
  );
  assert.deepEqual(
    facts.map((row) => ({ ...row })),
    [{ actor_id: member.actorId, label: 'Original label' }],
  );
});
