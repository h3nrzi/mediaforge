import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import assert from 'node:assert/strict';
import { Authority } from '../src/authority.js';
import { createService } from '../src/http.js';

export function command(...args) {
  const result = spawnSync(process.execPath, ['src/cli.js', ...args], { encoding: 'utf8' });
  return { code: result.status, data: JSON.parse(result.stdout), stderr: result.stderr };
}

export async function fixture(t, options = {}) {
  const dir = mkdtempSync(join(tmpdir(), 'mf-'));
  const db = join(dir, 'workspace.sqlite');
  let count = 0;

  function candidate(actor, revision = '0') {
    const out = join(dir, `${++count}.owner.json`);
    const args = ['prepare', '--out', out];
    if (actor) args.push('--actor', actor, '--revision', revision);
    const result = command(...args);
    assert.equal(result.code, 0);
    const owner = JSON.parse(readFileSync(out, 'utf8'));
    return {
      out,
      descriptorPath: `${out}.registration.json`,
      config: `${out}.curl.conf`,
      descriptor: JSON.parse(readFileSync(`${out}.registration.json`, 'utf8')),
      bearer: `Bearer ${owner.credentialId}~${owner.secret}`,
      actorId: owner.actorId,
    };
  }

  // Bootstrap through supported commands so feature tests start from real authority facts.
  const manager = candidate();
  assert.equal(
    command('bootstrap', '--db', db, '--descriptor', manager.descriptorPath, '--label', 'Manager')
      .code,
    0,
  );
  const authority = new Authority(db, options);
  const server = createService(authority, options.service);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const url = `http://127.0.0.1:${server.address().port}`;
  t.after(async () => {
    await new Promise((resolve) => server.close(resolve));
    rmSync(dir, { recursive: true, force: true });
  });

  async function request(path, who = manager, method = 'GET', body, extra = {}) {
    // Send proof only in the Authorization header and require private control responses.
    const response = await fetch(url + path, {
      method,
      headers: {
        ...(who ? { authorization: who.bearer } : {}),
        ...(body === undefined ? {} : { 'content-type': 'application/json' }),
        ...extra,
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    assert.equal(response.headers.get('cache-control'), 'no-store');
    return { status: response.status, body: await response.json() };
  }

  async function admit(roles = [], label = 'Member') {
    const person = candidate();
    const response = await request(`/v1/actors/${person.actorId}`, manager, 'PUT', {
      label,
      responsibilities: roles,
      registration: person.descriptor,
    });
    assert.equal(response.status, 200);
    return person;
  }
  return { dir, db, authority, manager, candidate, server, url, request, admit };
}
