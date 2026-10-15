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

/**
 * Require owner-controlled database files and sidecars before opening storage.
 *
 * @param {string} path - Explicit filesystem or HTTP target path.
 * @returns {void} Returns when existing database artifacts are private.
 */
function protect(path) {
  privateDirectory(path);

  // Check the database and existing sidecars under the same private ownership rules.
  for (const candidate of [path, `${path}-wal`, `${path}-shm`]) {
    if (!existsSync(candidate)) continue;
    const stat = lstatSync(candidate);
    if (
      !stat.isFile() ||
      stat.isSymbolicLink() ||
      stat.uid !== process.getuid() ||
      stat.mode & 0o077
    )
      refuse(503, 'unsafe_storage', 'Storage files must be owner-only regular files.');
  }
}

/**
 * Open an existing store and verify the required SQLite connection settings.
 *
 * @param {string} path - Explicit filesystem or HTTP target path.
 * @param {boolean} [readOnly] - Whether the connection is restricted to reads.
 * @returns {import('node:sqlite').DatabaseSync} An existing database connection with verified settings.
 */
function connection(path, readOnly = false) {
  protect(path);
  if (!existsSync(path))
    refuse(503, 'unavailable', 'Configured storage is absent; use explicit host setup.');
  const db = new DatabaseSync(path, {
    readOnly,
    allowExtension: false,
    timeout: 0,
    enableForeignKeyConstraints: true,
  });
  try {
    // Verify durability, foreign keys and the selected API surface on every opened connection.
    db.exec('PRAGMA foreign_keys=ON; PRAGMA synchronous=FULL; PRAGMA busy_timeout=0;');
    if (
      db.prepare('PRAGMA journal_mode').get().journal_mode !== 'wal' ||
      db.prepare('PRAGMA synchronous').get().synchronous !== 2 ||
      db.prepare('PRAGMA foreign_keys').get().foreign_keys !== 1
    )
      throw new Error('Unsafe pragmas');
    if (typeof db.isTransaction !== 'boolean')
      throw new Error('Unsupported SQLite transaction API');
    return db;
  } catch (error) {
    db.close();
    throw error;
  }
}

/**
 * Explicitly create or verify the schema without destructive migrations.
 *
 * @param {string} path - Explicit filesystem or HTTP target path.
 * @returns {Promise<void>} Resolves after the explicit schema transaction commits.
 */
export async function setup(path) {
  privateDirectory(path);
  if (!existsSync(path)) {
    const fd = openSync(path, 'wx', 0o600);
    closeSync(fd);
  }
  protect(path);
  const db = new DatabaseSync(path, { allowExtension: false, timeout: 0 });
  let commitAttempted = false;
  try {
    if (db.prepare('PRAGMA journal_mode').get().journal_mode !== 'wal')
      db.exec('PRAGMA journal_mode=WAL');
    db.exec('PRAGMA synchronous=FULL; PRAGMA foreign_keys=ON;');
    await acquire(db, 1000);
    const version = db.prepare('PRAGMA user_version').get().user_version;

    // Only an empty, explicitly prepared store may receive the initial schema.
    if (version === 0) {
      if (db.prepare("SELECT count(*) AS n FROM sqlite_master WHERE type='table'").get().n !== 0)
        refuse(503, 'unsupported_schema', 'Unrecognized store cannot be initialized.');
      db.exec(SCHEMA);
    } else if (version !== 1)
      refuse(
        503,
        'unsupported_schema',
        'Unsupported schema; no destructive migration is available.',
      );
    commitAttempted = true;
    db.exec('COMMIT');
  } catch (error) {
    // Classify failure from confirmed transaction knowledge rather than from the exception alone.
    let rollback = false;
    if (db.isTransaction) {
      db.exec('ROLLBACK');
      rollback = true;
    }
    if (error instanceof Refusal) throw error;
    throw new Refusal(
      503,
      'unavailable',
      'Setup could not establish storage. Inspect host status before proceeding.',
      undefined,
      commitAttempted && !rollback ? 'indeterminate' : 'refused_without_effect',
    );
  } finally {
    db.close();
  }
}

/**
 * Acquire the writer using immediate attempts within one cumulative monotonic budget.
 *
 * @param {object} db - Owned SQLite database connection.
 * @param {number} budget - Cumulative writer acquisition budget in milliseconds.
 * @param {Function} onBusy - Optional construction-only contention checkpoint.
 * @returns {Promise<void>} Resolves after acquiring the owned immediate transaction.
 */
async function acquire(db, budget, onBusy) {
  // Keep one monotonic deadline across acquisition retries instead of resetting the wait budget.
  const deadline = performance.now() + budget;
  for (;;) {
    try {
      db.exec('BEGIN IMMEDIATE');
      return;
    } catch (error) {
      // Retry only busy writer acquisition; no admitted operation body is ever replayed.
      if (error.errcode !== 5 && error.errcode !== 6) throw error;
      onBusy?.();
      const remaining = deadline - performance.now();
      if (remaining <= 0)
        refuse(
          503,
          'contention',
          'Writer admission budget exhausted; no action body ran. Inspect current facts before reconsidering.',
        );
      await delay(Math.min(10, remaining));
      if (performance.now() >= deadline)
        refuse(503, 'contention', 'Writer admission budget exhausted; no action body ran.');
    }
  }
}

/**
 * Build parameterized persistence operations bound to one SQLite connection.
 *
 * @param {object} db - Owned SQLite database connection.
 * @returns {object} Transaction-bound persistence operations.
 */
function scope(db) {
  /**
   * Decode a stored resource row from its JSON payload.
   */
  const read = (row) => (row ? JSON.parse(row.data) : null);
  return {
    sql: db,

    /**
     * Read the singleton initialization facts from the current transaction.
     */
    workspace: () => read(db.prepare('SELECT data FROM workspace WHERE singleton=1').get()),

    /**
     * Persist the singleton workspace marker and initial Manager dependency.
     */
    setWorkspace: (value) =>
      db
        .prepare('INSERT INTO workspace VALUES (1, ?, ?)')
        .run(value.initialManagerActorId, JSON.stringify(value)),

    /**
     * Read an actor by exact stable identity.
     */
    actor: (id) => read(db.prepare('SELECT data FROM actors WHERE id=?').get(id)),

    /**
     * Locate the actor owning the exact latest credential registration.
     */
    credential: (id) => read(db.prepare('SELECT data FROM actors WHERE credential_id=?').get(id)),

    /**
     * Read retained actors for current membership invariant checks.
     */
    actors: () => db.prepare('SELECT data FROM actors').all().map(read),

    /**
     * Persist current actor state while retaining immutable first-admission columns.
     */
    saveActor: (actor) =>
      db
        .prepare(
          'INSERT INTO actors VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET status=excluded.status, credential_id=excluded.credential_id, data=excluded.data',
        )
        .run(
          actor.actorId,
          actor.firstAdmission.timeMs,
          actor.membership,
          actor.firstAdmission.actorId ?? null,
          actor.credential.credentialId,
          JSON.stringify(actor),
        ),

    /**
     * Read a bounded directory page after its immutable ordering boundary.
     */
    directory: (filter, boundary, limit) =>
      db
        .prepare(
          `SELECT data FROM actors WHERE (? IS NULL OR id=?) AND (? IS NULL OR status=?) AND (? IS NULL OR first_time < ? OR (first_time=? AND id < ?)) ORDER BY first_time DESC, id DESC LIMIT ?`,
        )
        .all(
          filter.actorId ?? null,
          filter.actorId ?? null,
          filter.membership ?? null,
          filter.membership ?? null,
          boundary?.time ?? null,
          boundary?.time ?? null,
          boundary?.time ?? null,
          boundary?.id ?? null,
          limit,
        )
        .map(read),
  };
}

export class Store {
  /**
   * Verify the existing schema and storage integrity before exposing authority operations.
   *
   * @param {string} path - Explicit filesystem or HTTP target path.
   * @param {object} [options] - Optional construction or transport settings.
   */
  constructor(path, { budget = 1000, faults = {} } = {}) {
    if (!Number.isFinite(budget) || budget < 0)
      refuse(
        400,
        'invalid_input',
        'Writer budget must be a finite nonnegative number of milliseconds.',
      );
    this.path = path;
    this.budget = budget;
    this.faults = faults;
    this.untrusted = false;
    try {
      this.read(
        /**
         * Verify the existing schema, required columns and storage integrity.
         */
        (s) => {
          if (s.sql.prepare('PRAGMA user_version').get().user_version !== 1)
            refuse(503, 'unsupported_schema', 'Explicit setup is required before service startup.');
          s.sql
            .prepare('SELECT id, first_time, status, first_by, credential_id FROM actors LIMIT 1')
            .get();
          s.sql.prepare('SELECT singleton, initial_manager FROM workspace LIMIT 1').get();
          if (
            s.sql.prepare('PRAGMA quick_check').get().quick_check !== 'ok' ||
            s.sql.prepare('PRAGMA foreign_key_check').all().length
          )
            refuse(503, 'unavailable', 'Storage integrity could not be established.');
        },
      );
    } catch (error) {
      if (error instanceof Refusal) throw error;
      refuse(
        503,
        'unavailable',
        'Existing storage could not be verified; no authority operation was admitted.',
      );
    }
  }

  /**
   * Read current facts inside a short-lived, read-only SQLite transaction.
   *
   * @param {Function} body - Synchronous callback for the current read transaction.
   * @returns {*} Synchronous result from the read transaction callback.
   */
  read(body) {
    const db = connection(this.path, true);
    try {
      db.exec('BEGIN');

      // Keep the read snapshot short and close it before returning the observed facts.
      const result = body(scope(db));
      db.exec('COMMIT');
      return result;
    } finally {
      if (db.isTransaction) db.exec('ROLLBACK');
      db.close();
    }
  }

  /**
   * Own writer admission, one synchronous body and conservative commit or rollback outcomes.
   *
   * @param {Function} body - Synchronous mutation body executed at most once.
   * @returns {Promise<*>} Single-body result after durable commit.
   */
  async write(body) {
    // Quarantine further mutations when a previous connection outcome could not be established.
    if (this.untrusted)
      refuse(
        503,
        'unavailable',
        'Mutation storage is quarantined. Inspect established current facts and restart only after storage trust is restored.',
      );
    let db;
    let admitted = false;
    let commitAttempted = false;
    try {
      db = connection(this.path);

      // Own the immediate transaction before reading any state used to decide the mutation.
      await acquire(db, this.budget, this.faults.onBusy);
      admitted = true;
      this.faults.beforeBody?.(db);

      // Execute the mutation body once; only a durable commit permits an accepted response.
      const result = body(scope(db));
      if (result && typeof result.then === 'function')
        throw new Error('Admission body must be synchronous');
      this.faults.beforeCommit?.(db);
      commitAttempted = true;
      if (this.faults.commit) this.faults.commit(db);
      else db.exec('COMMIT');
      if (db.isTransaction) throw new Error('Commit did not close the owned transaction');
      this.faults.afterCommit?.(db);
      return result;
    } catch (error) {
      let rollback = false;
      if (db?.isTransaction) {
        try {
          if (this.faults.rollback) this.faults.rollback(db);
          else db.exec('ROLLBACK');
          rollback = !db.isTransaction;
          if (!rollback) this.untrusted = true;
        } catch {
          this.untrusted = true;
        }
      }

      // An unconfirmed commit outcome is indeterminate even when the original error looked familiar.
      if (commitAttempted && !rollback) {
        this.untrusted = true;
        throw new Refusal(
          503,
          'commit_unknown',
          'Commit outcome is indeterminate. Inspect permitted current facts; do not blindly replay.',
          undefined,
          'indeterminate',
        );
      }

      // Preserve a domain refusal only when non-admission or rollback is established.
      if (error instanceof Refusal && (!admitted || rollback)) throw error;
      if (!admitted || rollback)
        throw new Refusal(
          503,
          'unavailable',
          'Storage refused the operation without effect; inspect before reconsidering.',
        );
      this.untrusted = true;
      throw new Refusal(
        503,
        'storage_unknown',
        'Storage outcome is indeterminate. Inspect permitted current facts.',
        undefined,
        'indeterminate',
      );
    } finally {
      try {
        db?.close();
      } catch {
        this.untrusted = true;
      }
    }
  }
}

/**
 * Inspect setup state without creating or resetting the configured database.
 *
 * @param {string} path - Explicit filesystem or HTTP target path.
 * @returns {object} Absent, uninitialized, initialized or unavailable state.
 */
export function initializationStatus(path) {
  if (!existsSync(path)) return { state: 'absent' };
  try {
    return new Store(path).read(
      /**
       * Inspect the singleton initialization facts without changing storage.
       */
      (s) => {
        const workspace = s.workspace();
        return workspace ? { state: 'initialized', ...workspace } : { state: 'uninitialized' };
      },
    );
  } catch {
    return { state: 'unavailable' };
  }
}
