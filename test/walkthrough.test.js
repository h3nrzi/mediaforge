import test from 'node:test';
import assert from 'node:assert/strict';
import { walkthrough } from '../scripts/walkthrough.js';

test('M01-V17: documented curl/command walkthrough executes real actor workflows with secret-free evidence', async () => {
  const evidence = await walkthrough();
  const statuses = evidence.observations.map(row => row.httpStatus);
  for (const status of [200, 401, 403, 409]) assert.ok(statuses.includes(status));
  assert.ok(evidence.observations.some(row => row.operation === 'operator recovers total Manager credential loss'));
  assert.equal(JSON.stringify(evidence).includes('verifier'), false);
  assert.equal(JSON.stringify(evidence).includes('Bearer'), false);
});
