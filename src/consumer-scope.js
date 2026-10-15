// A consumer can use only the active owned transaction, never close it or retain it.

/**
 * Expose SQL operations only while the owned consumer transaction is active.
 *
 * @param {object} db - Owned SQLite database connection.
 * @returns {object} Read/write facades and their scope-expiry callback.
 */
export function consumerScope(db) {
  let active = true;

  /**
   * Prepare an allowed statement without exposing transaction or schema control.
   *
   * @param {string} sql - SQL statement with bound parameter placeholders.
   * @param {boolean} writable - Whether data-changing statements are allowed.
   * @returns {import('node:sqlite').StatementSync} An allowed statement on the active connection.
   */
  function statement(sql, writable) {
    // A captured scope becomes unusable as soon as its owning callback completes.
    if (!active) throw new Error('Transaction scope has closed');

    // Allow only data statements and keep schema and transaction control with the owner.
    const pattern = writable ? /^\s*(?:SELECT|INSERT|UPDATE|DELETE)\b/i : /^\s*SELECT\b/i;
    if (typeof sql !== 'string' || !pattern.test(sql))
      throw new Error('Consumer statements cannot control transactions or schema');
    return db.prepare(sql);
  }
  const read = Object.freeze({
    /**
     * Read one row through the active read-only consumer scope.
     */
    get: (sql, ...parameters) => statement(sql, false).get(...parameters),

    /**
     * Read matching rows through the active read-only consumer scope.
     */
    all: (sql, ...parameters) => statement(sql, false).all(...parameters),
  });
  const write = Object.freeze({
    ...read,
    /**
     * Execute a parameterized statement inside the active owned transaction.
     */
    run: (sql, ...parameters) => statement(sql, true).run(...parameters),
  });
  return {
    read,
    write,
    /**
     * Expire both consumer scopes when the synchronous callback finishes.
     */
    close: () => {
      active = false;
    },
  };
}
