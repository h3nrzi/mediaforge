import { DatabaseSync } from 'node:sqlite';
import { existsSync, lstatSync, openSync, closeSync } from 'node:fs';
import { performance } from 'node:perf_hooks';
import { setTimeout as delay } from 'node:timers/promises';
import { privateDirectory } from './credentials.js';
import { Refusal, refuse } from './contract.js';

const SCHEMA = `
CREATE TABLE workspace (singleton INTEGER PRIMARY KEY CHECK(singleton=1), initial_manager TEXT NOT NULL REFERENCES actors(id) ON DELETE RESTRICT, data TEXT NOT NULL) STRICT;
CREATE TABLE actors (id TEXT PRIMARY KEY, first_time INTEGER NOT NULL, status TEXT NOT NULL CHECK(status IN ('admitted','removed')), first_by TEXT REFERENCES actors(id) ON DELETE RESTRICT, credential_id TEXT NOT NULL UNIQUE, data TEXT NOT NULL) STRICT;
CREATE INDEX actors_directory ON actors(first_time DESC, id DESC);
PRAGMA user_version=1;
`;
function protect(path) {
  privateDirectory(path);
  for (const candidate of [path, `${path}-wal`, `${path}-shm`]) {
    if (!existsSync(candidate)) continue;
    const stat = lstatSync(candidate);
    if (!stat.isFile() || stat.isSymbolicLink() || stat.uid !== process.getuid() || stat.mode & 0o077) refuse(503, 'unsafe_storage', 'Storage files must be owner-only regular files.');
  }
}
function connection(path, readOnly = false) {
  protect(path);
  if (!existsSync(path)) refuse(503, 'unavailable', 'Configured storage is absent; use explicit host setup.');
  const db = new DatabaseSync(path, { readOnly, allowExtension: false, timeout: 0, enableForeignKeyConstraints: true });
  try {
    db.exec('PRAGMA foreign_keys=ON; PRAGMA synchronous=FULL; PRAGMA busy_timeout=0;');
    if (db.prepare('PRAGMA journal_mode').get().journal_mode !== 'wal' || db.prepare('PRAGMA synchronous').get().synchronous !== 2 || db.prepare('PRAGMA foreign_keys').get().foreign_keys !== 1) throw new Error('Unsafe pragmas');
    if (typeof db.isTransaction !== 'boolean') throw new Error('Unsupported SQLite transaction API');
    return db;
  } catch (error) { db.close(); throw error; }
}
export async function setup(path) {
  privateDirectory(path);
  if (!existsSync(path)) { const fd = openSync(path, 'wx', 0o600); closeSync(fd); }
  protect(path);
  const db = new DatabaseSync(path, { allowExtension: false, timeout: 0 });
  let commitAttempted = false;
  try {
    if (db.prepare('PRAGMA journal_mode').get().journal_mode !== 'wal') db.exec('PRAGMA journal_mode=WAL');
    db.exec('PRAGMA synchronous=FULL; PRAGMA foreign_keys=ON;');
    await acquire(db, 1000);
    const version = db.prepare('PRAGMA user_version').get().user_version;
    if (version === 0) {
      if (db.prepare("SELECT count(*) AS n FROM sqlite_master WHERE type='table'").get().n !== 0) refuse(503, 'unsupported_schema', 'Unrecognized store cannot be initialized.');
      db.exec(SCHEMA);
    } else if (version !== 1) refuse(503, 'unsupported_schema', 'Unsupported schema; no destructive migration is available.');
    commitAttempted = true; db.exec('COMMIT');
  } catch (error) {
    let rollback = false;
    if (db.isTransaction) { db.exec('ROLLBACK'); rollback = true; }
    if (error instanceof Refusal) throw error;
    throw new Refusal(503, 'unavailable', 'Setup could not establish storage. Inspect host status before proceeding.', undefined, commitAttempted && !rollback ? 'indeterminate' : 'refused_without_effect');
  } finally { db.close(); }
}
async function acquire(db, budget, onBusy) {
  const deadline = performance.now() + budget;
  for (;;) {
    try { db.exec('BEGIN IMMEDIATE'); return; }
    catch (error) {
      if (error.errcode !== 5 && error.errcode !== 6) throw error;
      onBusy?.();
      const remaining = deadline - performance.now();
      if (remaining <= 0) refuse(503, 'contention', 'Writer admission budget exhausted; no action body ran. Inspect current facts before reconsidering.');
      await delay(Math.min(10, remaining));
      if (performance.now() >= deadline) refuse(503, 'contention', 'Writer admission budget exhausted; no action body ran.');
    }
  }
}
function scope(db) {
  const read = row => row ? JSON.parse(row.data) : null;
  return {
    sql: db,
    workspace: () => read(db.prepare('SELECT data FROM workspace WHERE singleton=1').get()),
    setWorkspace: value => db.prepare('INSERT INTO workspace VALUES (1, ?, ?)').run(value.initialManagerActorId, JSON.stringify(value)),
    actor: id => read(db.prepare('SELECT data FROM actors WHERE id=?').get(id)),
    credential: id => read(db.prepare('SELECT data FROM actors WHERE credential_id=?').get(id)),
    actors: () => db.prepare('SELECT data FROM actors').all().map(read),
    saveActor: actor => db.prepare('INSERT INTO actors VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET status=excluded.status, credential_id=excluded.credential_id, data=excluded.data').run(actor.actorId, actor.firstAdmission.timeMs, actor.membership, actor.firstAdmission.actorId ?? null, actor.credential.credentialId, JSON.stringify(actor)),
    directory: (filter, boundary, limit) => db.prepare(`SELECT data FROM actors WHERE (? IS NULL OR id=?) AND (? IS NULL OR status=?) AND (? IS NULL OR first_time < ? OR (first_time=? AND id < ?)) ORDER BY first_time DESC, id DESC LIMIT ?`).all(filter.actorId ?? null, filter.actorId ?? null, filter.membership ?? null, filter.membership ?? null, boundary?.time ?? null, boundary?.time ?? null, boundary?.time ?? null, boundary?.id ?? null, limit).map(read),
  };
}
export class Store {
  constructor(path, { budget = 1000, faults = {} } = {}) {
    if (!Number.isFinite(budget) || budget < 0) refuse(400, 'invalid_input', 'Writer budget must be a finite nonnegative number of milliseconds.');
    this.path = path; this.budget = budget; this.faults = faults; this.untrusted = false;
    try { this.read(s => {
      if (s.sql.prepare('PRAGMA user_version').get().user_version !== 1) refuse(503, 'unsupported_schema', 'Explicit setup is required before service startup.');
      s.sql.prepare('SELECT id, first_time, status, first_by, credential_id FROM actors LIMIT 1').get();
      s.sql.prepare('SELECT singleton, initial_manager FROM workspace LIMIT 1').get();
      if (s.sql.prepare('PRAGMA quick_check').get().quick_check !== 'ok' || s.sql.prepare('PRAGMA foreign_key_check').all().length) refuse(503, 'unavailable', 'Storage integrity could not be established.');
    }); } catch (error) {
      if (error instanceof Refusal) throw error;
      refuse(503, 'unavailable', 'Existing storage could not be verified; no authority operation was admitted.');
    }
  }
  read(body) {
    const db = connection(this.path, true);
    try { db.exec('BEGIN'); const result = body(scope(db)); db.exec('COMMIT'); return result; }
    finally { if (db.isTransaction) db.exec('ROLLBACK'); db.close(); }
  }
  async write(body) {
    if (this.untrusted) refuse(503, 'unavailable', 'Mutation storage is quarantined. Inspect established current facts and restart only after storage trust is restored.');
    let db; let admitted = false; let commitAttempted = false;
    try {
      db = connection(this.path);
      await acquire(db, this.budget, this.faults.onBusy); admitted = true;
      this.faults.beforeBody?.(db);
      const result = body(scope(db));
      if (result && typeof result.then === 'function') throw new Error('Admission body must be synchronous');
      this.faults.beforeCommit?.(db);
      commitAttempted = true;
      if (this.faults.commit) this.faults.commit(db); else db.exec('COMMIT');
      if (db.isTransaction) throw new Error('Commit did not close the owned transaction');
      this.faults.afterCommit?.(db);
      return result;
    } catch (error) {
      let rollback = false;
      if (db?.isTransaction) {
        try { db.exec('ROLLBACK'); rollback = true; } catch { this.untrusted = true; }
      }
      if (commitAttempted && !rollback) {
        this.untrusted = true;
        throw new Refusal(503, 'commit_unknown', 'Commit outcome is indeterminate. Inspect permitted current facts; do not blindly replay.', undefined, 'indeterminate');
      }
      if (error instanceof Refusal) throw error;
      if (!admitted || rollback) throw new Refusal(503, 'unavailable', 'Storage refused the operation without effect; inspect before reconsidering.');
      this.untrusted = true;
      throw new Refusal(503, 'storage_unknown', 'Storage outcome is indeterminate. Inspect permitted current facts.', undefined, 'indeterminate');
    } finally { try { db?.close(); } catch { this.untrusted = true; } }
  }
}
export function initializationStatus(path) {
  if (!existsSync(path)) return { state: 'absent' };
  try { return new Store(path).read(s => { const workspace = s.workspace(); return workspace ? { state: 'initialized', ...workspace } : { state: 'uninitialized' }; }); }
  catch { return { state: 'unavailable' }; }
}
