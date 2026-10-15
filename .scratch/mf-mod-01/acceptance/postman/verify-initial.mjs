import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import assert from 'node:assert/strict';
// Read-only readiness check: run before the user starts mutations.
const dir=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(dir,'../../../..'),priv=root+'/.private/mf-mod-01-postman';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const collection=read(dir+'/module-01.postman_collection.json'), env=read(priv+'/local.postman_environment.json'), sequence=read(dir+'/sequence.json'), evidence=read(dir+'/preflight-evidence.json');
const values=Object.fromEntries(env.values.map(x=>[x.key,x.value]));
let requests=0;
const guide=fs.readFileSync(dir+'/guide.md','utf8');
for(const folder of collection.item){
 assert.match(folder.name,/^(GET|PUT|PATCH|POST) \/v1\//);
 assert.ok(!/[\u0600-\u06ff]/u.test(folder.name));
 for(const item of folder.item){
  requests++;
  const req=item.request;
  const step=sequence.find(s=>s.name===item.name);
  assert.ok(step);assert.equal(step.family,folder.name);assert.equal(step.method,req.method);assert.equal(req.url,'{{baseUrl}}'+step.path);
  assert.ok(guide.includes('**'+folder.name+' / '+item.name+'**'));
  assert.equal(req.auth.type,step.actor?'bearer':'noauth');
  if(step.actor)assert.equal(req.auth.bearer[0].value,'{{'+step.actor+'_token}}');
  assert.equal(item.protocolProfileBehavior.followRedirects,false);
  for(const x of JSON.stringify(item).matchAll(/\{\{(\w+)\}\}/g))assert.ok(Object.hasOwn(values,x[1]),x[1]);
  for(const event of item.event){new vm.Script(event.script.exec.join('\n'));assert.ok(!/[\u0600-\u06ff]/u.test(event.script.exec.join('\n')));}
  assert.ok(!/[\u0600-\u06ff]/u.test(item.name+req.description));
  assert.ok(evidence.results.find(x=>x.id===step.id)?.checks.every(x=>x.pass));
 }
}
for(const match of guide.matchAll(/\]\(([^)]+)\)/g)){
 if(match[1].startsWith('https://'))continue;
 assert.ok(fs.existsSync(path.resolve(dir,match[1])),'Broken guide link: '+match[1]);
}
assert.equal(requests,75);assert.equal(sequence.length,77);
assert.equal(new Set(sequence.map(x=>x.id)).size,77);
for(const file of fs.readdirSync(priv))assert.equal(fs.statSync(priv+'/'+file).mode&0o777,0o600);
assert.equal(fs.statSync(priv).mode&0o777,0o700);
const shareable=fs.readdirSync(dir).filter(x=>x!== 'prepare.mjs').map(x=>fs.readFileSync(dir+'/'+x,'utf8')).join('\n');
for(const file of fs.readdirSync(priv).filter(x=>x.endsWith('.owner.json'))){const owner=read(priv+'/'+file);for(const forbidden of [owner.secret,owner.verifier])assert.ok(!shareable.includes(forbidden));}
const r=await fetch(values.baseUrl+'/v1/me',{headers:{Authorization:'Bearer '+values.manager_token},redirect:'manual'});const b=await r.json();
assert.equal(r.status,200);assert.equal(b.data.actorId,values.manager_id);assert.deepEqual(b.data.responsibilities,['Manager']);assert.equal(b.data.membershipVersion,'1');assert.equal(b.data.credentialRevision,'1');
const status=await fetch(values.baseUrl+'/v1/actors',{headers:{Authorization:'Bearer '+values.manager_token}});const roster=await status.json();assert.equal(roster.data.items.length,1);
const ready={build:evidence.revision,baseUrl:values.baseUrl,setup:'observed: absent -> bootstrap -> initialized; repeated bootstrap refused; reloaded verified owner artifacts after declaring missing checkpoint variable',readiness:{httpStatus:r.status,managerActorId:b.data.actorId,membershipVersion:b.data.membershipVersion,credentialRevision:b.data.credentialRevision,actorCount:roster.data.items.length},exportChecks:{json:true,scriptSyntax:true,variableReferences:true,endpointGrouping:true,guidePaths:true,guideLinks:true,postmanTextEnglish:true,privateModes:true,knownSecretsAndVerifiersAbsent:true,formalSchemaValidation:'not_run'},initialSandboxRestriction:'listen EPERM; authorized loopback execution passed',humanAcceptance:'not_run',actualPostmanExecution:'not_run'};
fs.writeFileSync(dir+'/readiness-evidence.json',JSON.stringify(ready,null,2)+'\n');
console.log(JSON.stringify({requests,guideLinks:'pass',privatePermissions:'pass',secretScan:'pass',liveInitialState:'one Manager, versions 1/1',result:'pass'}));
