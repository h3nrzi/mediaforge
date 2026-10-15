import { createServer as httpServer } from 'node:http';
import { createServer as httpsServer } from 'node:https';
import { readFileSync } from 'node:fs';
import { refuse, fields, text, actorId, revision, responsibilities, success, failure } from './contract.js';
import { descriptor } from './credentials.js';
import { publicActor, authorize } from './authority.js';
import { replaceCredential, revokeCredential } from './credential-actions.js';
import { inspect, directory, admitActor, editActor, removeActor, readmitActor } from './membership.js';

async function jsonBody(request, limit) {
  if (!/^application\/json(?:\s*;\s*charset=utf-8)?$/i.test(request.headers['content-type'] ?? '')) refuse(400, 'invalid_input', 'Control bodies require application/json.');
  let size = 0; const chunks = [];
  for await (const chunk of request.iterator({ destroyOnReturn: false })) { size += chunk.length; if (size > limit) { request.resume(); refuse(413, 'body_too_large', 'Control body exceeds the configured limit.'); } chunks.push(chunk); }
  try { return JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(Buffer.concat(chunks))); }
  catch { refuse(400, 'invalid_json', 'Supply well-formed UTF-8 JSON.'); }
}
function bearer(request) {
  const count = request.rawHeaders.filter((_, i) => i % 2 === 0 && request.rawHeaders[i].toLowerCase() === 'authorization').length;
  if (count !== 1) refuse(401, 'unauthenticated', 'Exactly one current bearer authorization header is required.');
  return request.headers.authorization;
}
function queryInput(url) {
  const query = {};
  for (const [key, value] of url.searchParams) {
    if (!['limit', 'actorId', 'membership', 'cursor'].includes(key) || Object.hasOwn(query, key)) refuse(400, 'invalid_input', 'Unknown or repeated directory filter.');
    if (!value) refuse(400, 'invalid_input', 'Directory filters and continuations cannot be empty.');
    query[key] = value;
  }
  if (query.limit !== undefined && !/^(?:[1-9][0-9]?|100)$/.test(query.limit)) refuse(400, 'invalid_input', 'Directory limit must be 1 through 100.');
  query.limit = Number(query.limit ?? 50);
  if (query.actorId) actorId(query.actorId);
  if (query.membership && !['admitted', 'removed'].includes(query.membership)) refuse(400, 'invalid_input', 'Membership filter must be admitted or removed.');
  if (query.cursor) text(query.cursor, 2048, 'Continuation');
  return query;
}
export function validateMutation(method, suffix, body) {
  if (method === 'PUT' && !suffix) {
    if (body === undefined) return admitActor;
    fields(body, ['label', 'responsibilities', 'registration']); text(body.label, 80, 'Label');
    body.responsibilities = responsibilities(body.responsibilities); descriptor(body.registration); return admitActor;
  }
  if (method === 'PATCH' && !suffix) {
    if (body === undefined) return editActor;
    fields(body, ['expectedMembershipVersion', 'label', 'responsibilities'], ['expectedMembershipVersion']); revision(body.expectedMembershipVersion);
    if (!Object.hasOwn(body, 'label') && !Object.hasOwn(body, 'responsibilities')) refuse(400, 'invalid_input', 'Supply a desired label or responsibility set.');
    if (Object.hasOwn(body, 'label')) text(body.label, 80, 'Label');
    if (Object.hasOwn(body, 'responsibilities')) body.responsibilities = responsibilities(body.responsibilities);
    return editActor;
  }
  if (method === 'POST' && suffix === '/credential') {
    if (body === undefined) return replaceCredential;
    fields(body, ['expectedCredentialRevision', 'registration']); revision(body.expectedCredentialRevision); descriptor(body.registration); return replaceCredential;
  }
  const revoke = /^\/credentials\/([^/]+)\/revoke$/.exec(suffix);
  if (method === 'POST' && revoke) {
    if (body === undefined) return revokeCredential;
    fields(body, [], []);
    try { body.credentialId = decodeURIComponent(revoke[1]); } catch { refuse(400, 'invalid_input', 'Malformed credential path.'); }
    text(body.credentialId, 128, 'Credential ID'); return revokeCredential;
  }
  if (method === 'POST' && suffix === '/remove') {
    if (body === undefined) return removeActor;
    fields(body, ['expectedMembershipVersion']); revision(body.expectedMembershipVersion); return removeActor;
  }
  if (method === 'POST' && suffix === '/readmit') {
    if (body === undefined) return readmitActor;
    fields(body, ['expectedMembershipVersion', 'expectedCredentialRevision', 'responsibilities', 'registration']);
    revision(body.expectedMembershipVersion); revision(body.expectedCredentialRevision);
    body.responsibilities = responsibilities(body.responsibilities); descriptor(body.registration); return readmitActor;
  }
  refuse(404, 'not_found', 'Route not found.');
}
export function createService(authority, { bodyLimit = 16384, tls, afterAction } = {}) {
  if (!Number.isSafeInteger(bodyLimit) || bodyLimit <= 0) refuse(400, 'invalid_input', 'Control-body limit must be a positive integer.');
  const listener = async (request, response) => {
    response.setHeader('cache-control', 'no-store'); response.setHeader('content-type', 'application/json; charset=utf-8');
    const action = !['GET', 'HEAD'].includes(request.method);
    try {
      const url = new URL(request.url, 'http://localhost');
      const proof = bearer(request);
      if (request.method === 'GET' && url.pathname === '/v1/me') {
        if (url.search) refuse(400, 'invalid_input', 'Self inspection has no query fields.');
        const result = authority.read(proof, (_, actor, now) => success(publicActor(actor, now)));
        response.end(JSON.stringify(result)); return;
      }
      if (request.method === 'GET' && url.pathname === '/v1/actors') {
        const query = queryInput(url);
        response.end(JSON.stringify(authority.read(proof, (scope, actor, now) => directory(scope, actor, query, now)))); return;
      }
      const match = /^\/v1\/actors\/([^/]+)(.*)$/.exec(url.pathname);
      if (!match) { authority.read(proof, () => refuse(404, 'not_found', 'Route not found.')); }
      if (url.search) refuse(400, 'invalid_input', 'This operation has no query fields.');
      let id;
      try { id = decodeURIComponent(match[1]); } catch { refuse(400, 'invalid_input', 'Malformed actor path.'); }
      actorId(id);
      const suffix = match[2];
      if (request.method === 'GET' && ['', '/credential'].includes(suffix)) {
        response.end(JSON.stringify(authority.read(proof, (scope, actor, now) => {
          const target = inspect(scope, actor, id, now);
          return success(suffix ? { actorId: target.actorId, credentialRevision: target.credentialRevision, credential: target.credential } : target);
        }))); return;
      }
      // Authenticate/authorize before parsing a target mutation; the durable gate repeats it.
      authority.read(proof, (_, actor) => {
        validateMutation(request.method, suffix);
        if (actor.actorId !== id || !(suffix === '/credential' || /^\/credentials\/[^/]+\/revoke$/.test(suffix))) authorize(actor, 'membership_manage');
      });
      const body = await jsonBody(request, bodyLimit);
      const operation = validateMutation(request.method, suffix, body);
      const result = await authority.mutate(proof, (scope, actor, now, gate) => operation(scope, actor, id, body, now, gate));
      afterAction?.(request, result);
      if (!response.destroyed) response.end(JSON.stringify(result));
    } catch (error) {
      const result = failure(error, action); response.statusCode = result.status;
      if (!response.destroyed) response.end(JSON.stringify(result.body));
    }
  };
  const server = tls ? httpsServer({ cert: readFileSync(tls.cert), key: readFileSync(tls.key) }, listener) : httpServer(listener);
  server.requestTimeout = 15000; server.headersTimeout = 10000;
  return server;
}
export async function serve(authority, { host = '127.0.0.1', port = 8080, tls, bodyLimit } = {}) {
  if (!['127.0.0.1', '::1', 'localhost'].includes(host) && !tls) refuse(400, 'insecure_transport', 'Nonlocal binding requires a configured HTTPS certificate and key.');
  const server = createService(authority, { tls, bodyLimit });
  await new Promise((resolve, reject) => { server.once('error', reject); server.listen(port, host, resolve); });
  return server;
}
