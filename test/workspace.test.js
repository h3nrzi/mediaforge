import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, statSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const cli = (...args) => {
  const run = spawnSync(process.execPath, ['src/cli.js', ...args], { encoding: 'utf8' });
  assert.equal(run.stderr.includes('secret'), false);
  return { code: run.status, data: JSON.parse(run.stdout) };
};

test('M01-V01/V02: owner prepares privately and operator bootstraps exactly once', () => {
  const dir = mkdtempSync(join(tmpdir(), 'mf-'));
  try {
    const owner = join(dir, 'manager.owner.json');
    const prepared = cli('prepare', '--out', owner);
    assert.equal(prepared.code, 0);
    assert.equal(statSync(owner).mode & 0o777, 0o600);
    const descriptor = `${owner}.registration.json`;
    assert.equal(readFileSync(descriptor, 'utf8').includes('secret'), false);
    const db = join(dir, 'workspace.sqlite');
    assert.equal(cli('status', '--db', db).data.data.state, 'absent');
    assert.equal(
      cli('bootstrap', '--db', db, '--descriptor', descriptor, '--label', 'Initial Manager').code,
      0,
    );
    const status = cli('status', '--db', db).data;
    assert.equal(status.data.state, 'initialized');
    assert.equal(
      cli('bootstrap', '--db', db, '--descriptor', descriptor, '--label', 'Other').data
        .reasonCategory,
      'already_initialized',
    );
    assert.deepEqual(cli('status', '--db', db).data, status);
    assert.notEqual(cli('prepare', '--out', owner).code, 0);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
