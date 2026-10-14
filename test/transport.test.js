import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { fixture } from './helpers.js';
const execute = promisify(execFile);

for (const operation of ['admission', 'edit', 'removal', 'readmission', 'replacement', 'revocation']) {
  test(`M01-V13: dropped HTTP ${operation} acknowledgement recovers current facts without a duplicate effect`, async t => {
    let drop = false;
    const f = await fixture(t, { service: { afterAction(request) { if (drop) { drop = false; request.socket.destroy(); } } } });
    const member = operation === 'admission' ? f.candidate() : await f.admit();
    const path = `/v1/actors/${member.actorId}`; let who = f.manager; let endpoint = path; let method = 'POST'; let body;
    if (operation === 'admission') { method = 'PUT'; body = { label: 'Member', responsibilities: [], registration: member.descriptor }; }
    if (operation === 'edit') { method = 'PATCH'; body = { expectedMembershipVersion: '1', label: 'Edited' }; }
    if (operation === 'removal') { endpoint += '/remove'; body = { expectedMembershipVersion: '1' }; }
    if (operation === 'readmission') {
      await f.request(`${path}/remove`, f.manager, 'POST', { expectedMembershipVersion: '1' });
      const candidate = f.candidate(member.actorId, '2'); endpoint += '/readmit';
      body = { expectedMembershipVersion: '2', expectedCredentialRevision: '2', responsibilities: [], registration: candidate.descriptor };
    }
    if (operation === 'replacement') { const candidate = f.candidate(member.actorId, '1'); who = member; endpoint += '/credential'; body = { expectedCredentialRevision: '1', registration: candidate.descriptor }; }
    if (operation === 'revocation') { endpoint += `/credentials/${member.descriptor.credentialId}/revoke`; body = {}; }
    drop = true; await assert.rejects(f.request(endpoint, who, method, body));
    const current = (await f.request(path)).body;
    assert.equal(Object.hasOwn(current, 'actionStatus'), false);
    assert.equal(current.data.actorId, member.actorId);
    const versions = { admission: ['1','1'], edit: ['2','1'], removal: ['2','2'], readmission: ['3','3'], replacement: ['1','2'], revocation: ['1','2'] };
    assert.deepEqual([current.data.membershipVersion, current.data.credentialRevision], versions[operation]);
    assert.deepEqual((await f.request(path)).body, current);
    if (operation === 'replacement') assert.equal((await f.request('/v1/me', member)).status, 401);
  });
}

test('M01-V17: --disable ignores ambient curl settings and no credential reaches a redirect destination', async t => {
  const f = await fixture(t);
  let reached = 0;
  const destination = createServer((_, response) => { reached++; response.end('unexpected'); });
  await new Promise(resolve => destination.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise(resolve => destination.close(resolve)));
  const redirect = createServer((_, response) => { response.writeHead(302, { location: `http://127.0.0.1:${destination.address().port}/` }); response.end(); });
  await new Promise(resolve => redirect.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise(resolve => redirect.close(resolve)));
  const ambient = join(f.dir, 'ambient'); mkdirSync(ambient, { mode: 0o700 });
  writeFileSync(join(ambient, '.curlrc'), 'location\nheader = "X-Ambient: enabled"\n', { mode: 0o600 });
  const result = await execute('curl', ['--disable', '--config', f.manager.config, '--silent', '--show-error', '--fail-with-body', '--write-out', '%{http_code}', `http://127.0.0.1:${redirect.address().port}/`], { env: { ...process.env, CURL_HOME: ambient } });
  assert.equal(result.stdout, '302'); assert.equal(reached, 0);
});
