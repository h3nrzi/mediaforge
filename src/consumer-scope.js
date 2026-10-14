// A consumer can use only the active owned transaction, never close it or retain it.
export function consumerScope(db) {
  let active = true;
  function statement(sql, writable) {
    if (!active) throw new Error('Transaction scope has closed');
    const pattern = writable ? /^\s*(?:SELECT|INSERT|UPDATE|DELETE)\b/i : /^\s*SELECT\b/i;
    if (typeof sql !== 'string' || !pattern.test(sql)) throw new Error('Consumer statements cannot control transactions or schema');
    return db.prepare(sql);
  }
  const read = Object.freeze({
    get: (sql, ...parameters) => statement(sql, false).get(...parameters),
    all: (sql, ...parameters) => statement(sql, false).all(...parameters),
  });
  const write = Object.freeze({ ...read, run: (sql, ...parameters) => statement(sql, true).run(...parameters) });
  return { read, write, close: () => { active = false; } };
}
