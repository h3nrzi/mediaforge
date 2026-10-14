import test from 'node:test';
import assert from 'node:assert/strict';
import { fixture } from './helpers.js';
import { replaceCredential } from '../src/credential-actions.js';
import { Authority } from '../src/authority.js';

for (const phase of ['beforeBody', 'beforeCommit', 'commitUnknown']) {
  test(`M01-V13: ${phase} preserves honest effect knowledge without replay`, async t => {
    let enabled = false; let bodyCount = 0;
    const faults = {
      beforeBody() { bodyCount++; if (enabled && phase === 'beforeBody') throw new Error('controlled pre-body failure'); },
      beforeCommit() { if (enabled && phase === 'beforeCommit') throw new Error('controlled pre-commit failure'); },
      commit(db) { db.exec('COMMIT'); if (enabled && phase === 'commitUnknown') throw new Error('controlled commit acknowledgement loss'); },
    };
    const f = await fixture(t, { faults });
    const member = await f.admit();
    const path = `/v1/actors/${member.actorId}`;
    const before = (await f.request(path)).body.data;
    enabled = true; bodyCount = 0;
    const response = await f.request(path, f.manager, 'PATCH', { expectedMembershipVersion: '1', label: 'After' });
    assert.equal(response.status, 503); assert.equal(bodyCount, 1);
    assert.equal(response.body.actionStatus, phase === 'commitUnknown' ? 'indeterminate' : 'refused_without_effect');
    const current = (await f.request(path)).body;
    assert.equal(Object.hasOwn(current, 'actionStatus'), false);
    if (phase === 'commitUnknown') {
      assert.equal(current.data.label, 'After'); assert.equal(current.data.membershipVersion, '2');
      assert.equal((await f.request(path, f.manager, 'PATCH', { expectedMembershipVersion: '2', label: 'Again' })).status, 503);
      assert.equal(bodyCount, 1); // Quarantined mutation does not enter another body.
      const restarted = new Authority(f.db);
      assert.equal(restarted.read(f.manager.bearer, scope => scope.actor(member.actorId).membershipVersion), '2');
    } else assert.deepEqual(current.data, before);
  });
}

test('M01-V13: commit-interface error with confirmed active rollback is refused without effect', async t => {
  let enabled = false;
  const f = await fixture(t, { faults: { commit(db) { if (enabled) throw new Error('commit not issued'); db.exec('COMMIT'); } } });
  enabled = true;
  const response = await f.request(`/v1/actors/${f.manager.actorId}`, f.manager, 'PATCH', { expectedMembershipVersion: '1', label: 'Rolled back' });
  assert.equal(response.body.actionStatus, 'refused_without_effect');
  assert.equal((await f.request('/v1/me')).body.data.label, 'Manager');
});

test('M01-V13: after-commit acknowledgement fault preserves replacement candidate and original metadata', async t => {
  let enabled = false;
  const f = await fixture(t, { faults: { afterCommit() { if (enabled) throw new Error('acknowledgement unavailable'); } } });
  const member = await f.admit(); const candidate = f.candidate(member.actorId, '1');
  enabled = true;
  const response = await f.request(`/v1/actors/${member.actorId}/credential`, member, 'POST', { expectedCredentialRevision: '1', registration: candidate.descriptor });
  assert.equal(response.body.actionStatus, 'indeterminate');
  assert.equal((await f.request('/v1/me', member)).status, 401);
  const current = (await f.request('/v1/me', candidate)).body.data;
  assert.equal(current.credentialRevision, '2');
  const restarted = new Authority(f.db);
  await assert.rejects(restarted.mutate(f.manager.bearer, async () => {}));
  const repeated = await restarted.mutate(f.manager.bearer, (scope, caller, now) => replaceCredential(scope, caller, member.actorId, { expectedCredentialRevision: '1', registration: candidate.descriptor }, now));
  assert.equal(repeated.effect, 'none');
  assert.deepEqual(repeated.data, current);
});

for (const operation of ['admission', 'removal', 'readmission', 'replacement', 'revocation']) {
  test(`M01-V13: ${operation} rolls back atomically on pre-commit storage refusal`, async t => {
    let enabled = false;
    const f = await fixture(t, { faults: { beforeCommit() { if (enabled) throw new Error('controlled rollback'); } } });
    const member = operation === 'admission' ? f.candidate() : await f.admit();
    const path = `/v1/actors/${member.actorId}`; let endpoint = path; let method = 'POST'; let body;
    if (operation === 'admission') { method = 'PUT'; body = { label: 'Member', responsibilities: [], registration: member.descriptor }; }
    if (operation === 'removal') { endpoint += '/remove'; body = { expectedMembershipVersion: '1' }; }
    if (operation === 'readmission') {
      await f.request(`${path}/remove`, f.manager, 'POST', { expectedMembershipVersion: '1' });
      const fresh = f.candidate(member.actorId, '2'); endpoint += '/readmit';
      body = { expectedMembershipVersion: '2', expectedCredentialRevision: '2', responsibilities: ['Contributor'], registration: fresh.descriptor };
    }
    if (operation === 'replacement') { const fresh = f.candidate(member.actorId, '1'); endpoint += '/credential'; body = { expectedCredentialRevision: '1', registration: fresh.descriptor }; }
    if (operation === 'revocation') { endpoint += `/credentials/${member.descriptor.credentialId}/revoke`; body = {}; }
    const before = await f.request(path);
    enabled = true;
    const failed = await f.request(endpoint, f.manager, method, body);
    assert.equal(failed.status, 503); assert.equal(failed.body.actionStatus, 'refused_without_effect');
    assert.deepEqual(await f.request(path), before);
  });
}

test('M01-V13: autocommit alone does not establish outcome after a storage-interface failure', async t => {
  let enabled = false;
  const f = await fixture(t, { faults: { beforeCommit(db) { if (enabled) { db.exec('ROLLBACK'); throw new Error('state knowledge lost'); } } } });
  enabled = true;
  const result = await f.request(`/v1/actors/${f.manager.actorId}`, f.manager, 'PATCH', { expectedMembershipVersion: '1', label: 'Unestablished' });
  assert.equal(result.body.actionStatus, 'indeterminate');
  assert.equal((await f.request('/v1/me')).body.data.label, 'Manager');
});
