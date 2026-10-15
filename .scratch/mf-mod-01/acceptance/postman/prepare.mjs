// Evaluation artifacts only. No application or storage internals are modified.
import { readFileSync, writeFileSync, mkdirSync, mkdtempSync, rmSync, statSync, existsSync } from 'node:fs';
import { resolve, join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn, execFileSync } from 'node:child_process';
import { once } from 'node:events';
import { tmpdir } from 'node:os';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '../../../..');
process.chdir(root);
const revision = execFileSync('git', ['rev-parse', 'HEAD'], {encoding:'utf8'}).trim();
const json = p => JSON.parse(readFileSync(p, 'utf8'));
const save = (p, data, exclusive=false) => writeFileSync(p, JSON.stringify(data,null,2)+'\n', {mode:0o600,flag:exclusive?'wx':'w'});
function cli(...args) {
  const run = spawnSyncSafe(args);
  return JSON.parse(run.stdout);
}
function spawnSyncSafe(args) {
  try { return {stdout:execFileSync(process.execPath,['src/cli.js',...args],{encoding:'utf8',stdio:['ignore','pipe','pipe']})}; }
  catch(e) { if(e.stdout) return {stdout:e.stdout}; throw new Error('Host command could not execute. Private output omitted.'); }
}
function initialValues() { return {baseUrl:'',member_mv:'',member_cr:'',stale_mv:'',removed_mv:'',before:'',first_admission:'',cursor:'',page_ids:'',final_snapshot:'',manager_before_recovery:''}; }
async function setup(dir) {
  mkdirSync(dir,{mode:0o700}); // Exclusive: never overwrite an established evaluation.
  assert.equal(statSync(dir).mode & 0o777,0o700);
  const values=initialValues();
  const candidates={};
  function candidate(key,actor,rev) {
    const out=join(dir,key+'.owner.json');
    const args=['prepare','--out',out];
    if(actor) args.push('--actor',actor,'--revision',rev);
    const result=cli(...args); assert.equal(result.result,'ok');
    const owner=json(out), descriptor=json(out+'.registration.json');
    candidates[key]={out,owner,descriptor};
    values[key+'_id']=owner.actorId;
    values[key+'_credential']=owner.credentialId;
    values[key+'_token']=owner.credentialId+'~'+owner.secret;
    values[key+'_registration']=JSON.stringify(descriptor);
  }
  candidate('manager'); candidate('member');
  for(const k of ['contributor','reviewer','operations','backup','combined','allroles']) candidate(k);
  // Fixed candidate revisions belong only to the documented isolated sequence.
  for(const [k,r] of [['returned','2'],['selfnext','3'],['managed','4'],['restored','6']]) candidate(k,values.member_id,r);
  candidate('recovered',values.manager_id,'2');
  const db=join(dir,'workspace.sqlite');
  assert.equal(cli('status','--db',db).data.state,'absent');
  assert.equal(cli('bootstrap','--db',db,'--descriptor',candidates.manager.out+'.registration.json','--label','Initial Manager').result,'ok');
  const repeated=cli('bootstrap','--db',db,'--descriptor',candidates.manager.out+'.registration.json','--label','Initial Manager');
  assert.equal(repeated.reasonCategory,'already_initialized');
  save(join(dir,'state.json'),{db,revision,actors:Object.fromEntries(Object.entries(candidates).map(([k,v])=>[k,{actorId:v.owner.actorId,out:v.out}]))},true);
  return {dir,db,values,candidates,host:[{operation:'status before bootstrap',result:'absent'},{operation:'bootstrap',result:'ok'},{operation:'repeat bootstrap',reasonCategory:repeated.reasonCategory}]};
}
async function start(state) {
  const child=spawn(process.execPath,['src/cli.js','serve','--db',state.db,'--host','127.0.0.1','--port','0'],{stdio:['ignore','pipe','pipe']});
  let output='';
  const timer=setTimeout(()=>child.kill(),10000);
  try {
    for await(const chunk of child.stdout.iterator({destroyOnReturn:false})) {
      output+=chunk;
      if(output.includes('\n')) break;
    }
    const body=JSON.parse(output.split('\n')[0]); assert.equal(body.result,'ok');
    state.values.baseUrl='http://127.0.0.1:'+body.data.listening.port;
    return child;
  } finally {clearTimeout(timer);}
}
async function stop(child) {if(child && child.exitCode===null){const done=once(child,'exit');child.kill();await done;}}
function environment(values) {
  return {name:'Mediaforge Module 01 - Local Acceptance',_postman_variable_scope:'environment',values:Object.entries(values).map(([key,value])=>({key,value,enabled:true,type:/_token$|_registration$/.test(key)?'secret':'default',description:/_token$/.test(key)?'Disposable evaluation owner credential; keep local and never share.':/_registration$/.test(key)?'Prepared descriptor; not yet registered unless its ordered step has completed.':'Local evaluation state; preserve on resume.'}))};
}
const steps=[]; const groups=new Map();
const ref=k=>'{{'+k+'}}';
const parseBody=b=>JSON.stringify(b).replace(/"\{\{(\w+_registration)\}\}"/g,'{{$1}}');
function request(id,title,method,path,actor='manager',body,opts={}) {
  const family=path.startsWith('/v1/me')?'GET /v1/me':path.startsWith('/v1/actors?')||path==='/v1/actors'?'GET /v1/actors':path.includes('/credentials/')?'POST /v1/actors/{actorId}/credentials/{credentialId}/revoke':path.endsWith('/credential')?method+' /v1/actors/{actorId}/credential':path.endsWith('/readmit')?'POST /v1/actors/{actorId}/readmit':path.endsWith('/remove')?'POST /v1/actors/{actorId}/remove':method+' /v1/actors/{actorId}';
  const status=opts.status??200, mutation=method!=='GET';
  const tests=[`const body = pm.response.json();`,`pm.test('HTTP ${status}', () => pm.expect(pm.response.code).to.eql(${status}));`,`pm.test('Private JSON feedback', () => { pm.expect(pm.response.headers.get('cache-control')).to.eql('no-store'); pm.expect(typeof body.message).to.eql('string'); pm.expect(body.reasonCategory).to.eql('${opts.reason??(status===200?(opts.noop?'no_change':'ok'):({400:'invalid_input',401:'unauthenticated',403:'forbidden',404:'not_found',409:'state_conflict',413:'body_too_large'}[status]))}'); });`,
  `pm.test('No secret or verifier fields', () => { const walk = value => { if (value && typeof value === 'object') Object.keys(value).forEach(key => { pm.expect(['secret','verifier','authorization'].includes(key.toLowerCase())).to.eql(false); walk(value[key]); }); }; walk(body); });`,
  `pm.test('Result and effect contract', () => { pm.expect(body.result).to.eql('${status===200?(opts.noop?'already_satisfied':'ok'):'refused'}'); ${mutation?`pm.expect(body.actionStatus).to.eql('${status===200?'accepted':'refused_without_effect'}'); ${status===200?`pm.expect(body.effect).to.eql('${opts.noop?'none':'applied'}');`:''}`:`pm.expect(body.actionStatus).to.eql(undefined);`} });`];
  if(status===401||status===403) tests.push(`pm.test('Unauthorized target facts concealed', () => { pm.expect(body.data).to.eql(undefined); pm.expect(body.currentState).to.eql(undefined); });`);
  if(opts.target) tests.push(`pm.test('Exact actor identity', () => pm.expect(body.data.actorId).to.eql(pm.environment.get('${opts.target}_id')));`);
  if(opts.roles) tests.push(`pm.test('Complete independent responsibility set', () => pm.expect(body.data.responsibilities.slice().sort()).to.eql(${JSON.stringify(opts.roles.slice().sort())}));`);
  if(opts.capture) tests.push(`if (pm.response.code === 200 && body.data && body.data.actorId === pm.environment.get('member_id')) { pm.environment.set('member_mv', body.data.membershipVersion); pm.environment.set('member_cr', body.data.credentialRevision); }`);
  if(opts.extra) tests.push(`if (pm.response.code === 200 && body.data && typeof body.data === 'object'${opts.target?` && body.data.actorId === pm.environment.get('${opts.target}_id')`:''}) {`,...opts.extra,'}');
  const name=id+' - '+title;
  const item={name,request:{method,url:ref('baseUrl')+path,auth:actor?{type:'bearer',bearer:[{key:'token',value:ref(actor+'_token'),type:'string'}]}:{type:'noauth'},header:body===undefined?[]:[{key:'Content-Type',value:opts.contentType??'application/json'}],description:`Actor: ${actor??'anonymous'}. Execute only at step ${id} in guide.md; all earlier ordered steps must pass. Expected HTTP ${status}${opts.noop?'; matching current state, no new effect':''}. ${opts.note??''} Stop after an unexpected response or acknowledgement loss; inspect exact saved identity before any dependent mutation.`},protocolProfileBehavior:{followRedirects:false},event:[{listen:'test',script:{type:'text/javascript',exec:tests}}]};
  if(body!==undefined) item.request.body={mode:'raw',raw:opts.raw??parseBody(body),options:{raw:{language:'json'}}};
  if(!groups.has(family)) groups.set(family,[]); groups.get(family).push(item);
  const step={id,name,family,method,path,actor,status,item}; steps.push(step); return step;
}
function host(id,action,narrative){steps.push({id,host:action,narrative});}
const m='/v1/actors/{{member_id}}';
const a='/v1/actors/{{manager_id}}';
const same=`pm.test('Unchanged complete actor snapshot', () => pm.expect(body.data).to.eql(JSON.parse(pm.environment.get('before'))));`;
const snap=`pm.environment.set('before', JSON.stringify(body.data));`;
request('S01.01','Inspect initial Manager','GET','/v1/me','manager',undefined,{target:'manager',roles:['Manager'],extra:[`pm.test('Initial versions and lifetime', () => { pm.expect(body.data.membershipVersion).to.eql('1'); pm.expect(body.data.credentialRevision).to.eql('1'); pm.expect(Date.parse(body.data.credential.expiresAt)-Date.parse(body.data.credential.issuedAt)).to.eql(2592000000); });`]});
request('S01.02','Reject anonymous caller','GET','/v1/me',null,undefined,{status:401});
request('S01.03','Protect last Manager from demotion','PATCH',a,'manager',{expectedMembershipVersion:'1',responsibilities:[]},{status:409});
request('S01.04','Protect last Manager from removal','POST',a+'/remove','manager',{expectedMembershipVersion:'1'},{status:409});
const roleCases=[['member',[]],['contributor',['Contributor']],['reviewer',['Reviewer']],['operations',['Operations']],['backup',['Manager']],['combined',['Contributor','Reviewer']],['allroles',['Contributor','Reviewer','Operations','Manager']]];
for(const [i,[k,roles]] of roleCases.entries()) {
  const opts={target:k,roles,...(k==='member'?{capture:true,extra:[`pm.environment.set('stale_mv',body.data.membershipVersion); pm.environment.set('first_admission',JSON.stringify(body.data.firstAdmission));`,snap]}:{})};
  request(`S02.${i+1}a`,'Admit '+k,'PUT','/v1/actors/'+ref(k+'_id'),'manager',{label:k==='member'?'عضو آزمایشی':'Evaluation '+k,responsibilities:roles,registration:ref(k+'_registration')},opts);
  request(`S02.${i+1}b`,'Inspect '+k+' self','GET','/v1/me',k,undefined,{target:k,roles});
}
request('S02.08','Confirm identical admission','PUT',m,'manager',{label:'عضو آزمایشی',responsibilities:[],registration:ref('member_registration')},{target:'member',roles:[],noop:true,extra:[same]});
request('S02.09','Reject zero-role directory access','GET','/v1/actors','member',undefined,{status:403});
request('S02.10','Conceal other actor','GET',a,'member',undefined,{status:403});
request('S02.11','Reject zero-role membership edit','PATCH',a,'member',{expectedMembershipVersion:'1',label:'Denied'},{status:403});
request('S02.12','Conceal other credential metadata','GET',a+'/credential','member',undefined,{status:403});
request('S03.01','Read first directory page','GET','/v1/actors?limit=2&membership=admitted','manager',undefined,{extra:[`pm.test('Page size and continuation', () => { pm.expect(body.data.items.length).to.eql(2); pm.expect(typeof body.data.nextCursor).to.eql('string'); }); pm.environment.set('cursor',encodeURIComponent(body.data.nextCursor)); pm.environment.set('page_ids',JSON.stringify(body.data.items.map(x=>x.actorId)));`]});
request('S03.02','Read distinct next page','GET','/v1/actors?limit=2&membership=admitted&cursor={{cursor}}','manager',undefined,{extra:[`pm.test('Distinct admitted page', () => { const ids=JSON.parse(pm.environment.get('page_ids')); pm.expect(body.data.items.length).to.eql(2); pm.expect(body.data.items.every(x=>x.membership==='admitted'&&!ids.includes(x.actorId))).to.eql(true); });`]});
request('S03.03','Reject changed cursor filters','GET','/v1/actors?limit=2&membership=removed&cursor={{cursor}}','manager',undefined,{status:400,reason:'invalid_cursor'});
request('S03.04','Reject excessive page size','GET','/v1/actors?limit=101','manager',undefined,{status:400});
request('S03.05','Inspect exact actor filter','GET','/v1/actors?actorId={{member_id}}&membership=admitted','manager',undefined,{extra:[`pm.test('Exact filter', () => { pm.expect(body.data.items.map(x=>x.actorId)).to.eql([pm.environment.get('member_id')]); pm.expect(body.data.nextCursor).to.eql(null); });`]});
request('S04.01','Reject unknown responsibility','PATCH',m,'manager',{expectedMembershipVersion:ref('member_mv'),responsibilities:['Unknown']},{status:400});
request('S04.02','Reject duplicate responsibility','PATCH',m,'manager',{expectedMembershipVersion:ref('member_mv'),responsibilities:['Reviewer','Reviewer']},{status:400});
request('S04.03','Reject empty label','PATCH',m,'manager',{expectedMembershipVersion:ref('member_mv'),label:''},{status:400});
request('S04.04','Reject long Unicode label','PATCH',m,'manager',{expectedMembershipVersion:ref('member_mv'),label:'آ'.repeat(81)},{status:400});
request('S04.05','Reject immutable identity field','PATCH',m,'manager',{expectedMembershipVersion:ref('member_mv'),actorId:ref('member_id'),label:'Denied'},{status:400});
request('S04.06','Reject missing precondition','PATCH',m,'manager',{label:'Denied'},{status:400});
request('S04.07','Reject malformed JSON','PATCH',m,'manager',{}, {status:400,reason:'invalid_json',raw:'{"label":'});
request('S04.08','Reject wrong content type','PATCH',m,'manager',{}, {status:400,contentType:'text/plain'});
request('S04.09','Reject oversized body','PATCH',m,'manager',{label:'x'.repeat(17000)},{status:413});
request('S04.10','Confirm validation has no effect','GET',m,'manager',undefined,{extra:[same]});
request('S04.11','Reject unknown actor','GET','/v1/actors/00000000-0000-4000-8000-000000000001','manager',undefined,{status:404});
request('S05.01','Rename and assign complete role set','PATCH',m,'manager',{expectedMembershipVersion:ref('member_mv'),label:'عضو ویرایش شده',responsibilities:['Contributor','Reviewer']},{target:'member',roles:['Contributor','Reviewer'],capture:true,extra:[`pm.test('Membership change only', () => { const old=JSON.parse(pm.environment.get('before')); pm.expect(body.data.membershipVersion).to.eql(String(BigInt(old.membershipVersion)+1n)); pm.expect(body.data.credential).to.eql(old.credential); pm.expect(body.data.firstAdmission).to.eql(old.firstAdmission); });`,snap]});
request('S05.02','Refuse stale incompatible edit','PATCH',m,'manager',{expectedMembershipVersion:ref('stale_mv'),label:'Stale attempt'},{status:409});
request('S05.03','Confirm stale edit has no effect','GET',m,'manager',undefined,{extra:[same]});
request('S05.04','Confirm matching edit without new effect','PATCH',m,'manager',{expectedMembershipVersion:ref('member_mv'),label:'عضو ویرایش شده',responsibilities:['Reviewer','Contributor']},{noop:true,extra:[same]});
request('S05.05','Observe current roles using same credential','GET','/v1/me','member',undefined,{target:'member',roles:['Contributor','Reviewer']});
request('S06.01','Remove member','POST',m+'/remove','manager',{expectedMembershipVersion:ref('member_mv')},{target:'member',roles:[],capture:true,extra:[`pm.test('Removal invalidates and retains identity', () => { pm.expect(body.data.membership).to.eql('removed'); pm.expect(body.data.credential.status).to.eql('invalidated'); pm.expect(body.data.firstAdmission).to.eql(JSON.parse(pm.environment.get('first_admission'))); });`,snap,`pm.environment.set('removed_mv',body.data.membershipVersion);`]});
request('S06.02','Deny removed credential','GET','/v1/me','member',undefined,{status:401});
request('S06.03','Confirm repeated removal','POST',m+'/remove','manager',{expectedMembershipVersion:ref('member_mv')},{noop:true,extra:[same]});
request('S06.04','Refuse admission replay for removed actor','PUT',m,'manager',{label:'عضو آزمایشی',responsibilities:[],registration:ref('member_registration')},{status:409});
request('S06.05','Readmit exact actor with fresh credential','POST',m+'/readmit','manager',{expectedMembershipVersion:ref('member_mv'),expectedCredentialRevision:ref('member_cr'),responsibilities:[],registration:ref('returned_registration')},{target:'member',roles:[],capture:true,extra:[`pm.test('First admission retained', () => pm.expect(body.data.firstAdmission).to.eql(JSON.parse(pm.environment.get('first_admission'))));`,snap]});
request('S06.06','Inspect readmitted self','GET','/v1/me','returned',undefined,{target:'member',roles:[]});
request('S06.07','Refuse stale removal of readmission','POST',m+'/remove','manager',{expectedMembershipVersion:ref('removed_mv')},{status:409});
request('S06.08','Confirm readmission survives stale removal','GET',m,'manager',undefined,{extra:[same]});
request('S07.01','Inspect own credential metadata','GET',m+'/credential','returned',undefined,{target:'member',extra:[`pm.test('Observed credential revision', () => pm.expect(body.data.credentialRevision).to.eql(pm.environment.get('member_cr')));`]});
request('S07.02','Replace own zero-role credential','POST',m+'/credential','returned',{expectedCredentialRevision:ref('member_cr'),registration:ref('selfnext_registration')},{target:'member',capture:true,extra:[`pm.test('Credential-only transition', () => { const old=JSON.parse(pm.environment.get('before')); pm.expect(body.data.membershipVersion).to.eql(old.membershipVersion); pm.expect(body.data.firstAdmission).to.eql(old.firstAdmission); pm.expect(body.data.credential.credentialId).to.eql(pm.environment.get('selfnext_credential')); });`,snap]});
request('S07.03','Deny superseded owner credential','GET','/v1/me','returned',undefined,{status:401});
request('S07.04','Inspect saved replacement candidate','GET','/v1/me','selfnext',undefined,{target:'member',extra:[same]});
request('S07.05','Confirm exact current registration','POST',m+'/credential','manager',{expectedCredentialRevision:'3',registration:ref('selfnext_registration')},{noop:true,extra:[same]});
request('S07.06','Deny another actor replacement','POST',a+'/credential','selfnext',{expectedCredentialRevision:'1',registration:ref('manager_registration')},{status:403});
request('S07.07','Manager replaces member credential','POST',m+'/credential','manager',{expectedCredentialRevision:ref('member_cr'),registration:ref('managed_registration')},{target:'member',capture:true,extra:[`pm.test('Membership remains unchanged', () => pm.expect(body.data.membershipVersion).to.eql(JSON.parse(pm.environment.get('before')).membershipVersion));`,snap]});
request('S07.08','Refuse superseded candidate replay','POST',m+'/credential','manager',{expectedCredentialRevision:'3',registration:ref('selfnext_registration')},{status:409});
request('S07.09','Confirm stale replacement has no effect','GET',m,'manager',undefined,{extra:[same]});
request('S07.10','Revoke exact current credential','POST',m+'/credentials/{{managed_credential}}/revoke','manager',{}, {capture:true,extra:[`pm.test('Invalidation recorded', () => pm.expect(body.data.credential.status).to.eql('invalidated'));`,snap]});
request('S07.11','Deny revoked credential','GET','/v1/me','managed',undefined,{status:401});
request('S07.12','Confirm repeated exact revocation','POST',m+'/credentials/{{managed_credential}}/revoke','manager',{}, {noop:true,extra:[same]});
request('S07.13','Restore admitted member credential','POST',m+'/credential','manager',{expectedCredentialRevision:ref('member_cr'),registration:ref('restored_registration')},{target:'member',capture:true,extra:[snap]});
request('S07.14','Old revocation cannot redirect','POST',m+'/credentials/{{managed_credential}}/revoke','manager',{}, {status:409});
request('S07.15','Inspect restored owner after old revocation','GET','/v1/me','restored',undefined,{target:'member',extra:[same]});
request('S08.01','Demote backup Manager','PATCH','/v1/actors/{{backup_id}}','manager',{expectedMembershipVersion:'1',responsibilities:[]},{target:'backup',roles:[]});
request('S08.02','Deny next page after demotion','GET','/v1/actors?limit=2&membership=admitted&cursor={{cursor}}','backup',undefined,{status:403});
request('S08.03','Revoke all-roles Manager credential','POST','/v1/actors/{{allroles_id}}/credentials/{{allroles_credential}}/revoke','allroles',{});
request('S08.04','Revoke initial Manager credential','POST',a+'/credentials/{{manager_credential}}/revoke','manager',{}, {extra:[`pm.environment.set('manager_before_recovery',JSON.stringify(body.data));`]});
request('S08.05','Deny revoked Manager','GET','/v1/me','manager',undefined,{status:401});
host('S08.H','recover','بازیابی میزبان پس از ازبین‌رفتن همهٔ credentialهای Manager؛ تنها manager و allroles هنوز نقش Manager دارند و هر دو credential باطل شده‌اند.');
request('S08.06','Inspect recovered Manager candidate','GET','/v1/me','recovered',undefined,{target:'manager',roles:['Manager'],extra:[`pm.test('Recovery changes only credential', () => { const old=JSON.parse(pm.environment.get('manager_before_recovery')); for (const key of ['actorId','label','membership','membershipVersion','responsibilities','firstAdmission','latestMembershipChange']) pm.expect(body.data[key]).to.eql(old[key]); pm.expect(body.data.credentialRevision).to.eql('3'); pm.expect(body.data.credential.latestChange.origin).to.eql('host_operator'); pm.expect(typeof body.data.credential.latestChange.principal).to.eql('string'); });`, `pm.environment.set('final_snapshot',JSON.stringify(body.data));`]});
host('S09.H','restart','سرویس همین پایگاه داده را متوقف و دوباره راه‌اندازی کنید؛ Environment را دوباره Import نکنید و فقط baseUrl را در صورت تغییر پورت ویرایش کنید.');
request('S09.01','Inspect persisted recovered Manager','GET','/v1/me','recovered',undefined,{target:'manager',extra:[`pm.test('Complete persisted actor snapshot', () => pm.expect(body.data).to.eql(JSON.parse(pm.environment.get('final_snapshot'))));`]});
request('S09.02','Inspect persisted restored member','GET',m,'recovered',undefined,{target:'member',extra:[same]});
const collection={info:{name:'Mediaforge Module 01 - API Acceptance',schema:'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',description:'Endpoint-organized requests. Follow guide.md in explicit scenario order, using Send individually. Host recovery/restart pauses are mandatory. Folder traversal is not execution order. Local disposable credentials only; do not upload private environments.'},item:[...groups].map(([name,item])=>({name,item}))};
function substitute(s,values){return s.replace(/\{\{(\w+)\}\}/g,(_,key)=>{assert.ok(Object.hasOwn(values,key),'Undeclared variable: '+key);return values[key];});}
async function recover(state) {
  const actor=state.actors?.manager?.actorId??state.values.manager_id;
  const out=state.actors?.recovered?.out??state.candidates.recovered.out;
  const before=cli('recovery-status','--db',state.db,'--actor',actor);
  assert.equal(before.data.credentialRevision,'2'); assert.equal(before.data.credential.status,'invalidated');
  const descriptor=json(out+'.registration.json'); assert.equal(descriptor.expectedCredentialRevision,before.data.credentialRevision);
  const result=cli('recover','--db',state.db,'--actor',actor,'--revision',before.data.credentialRevision,'--descriptor',out+'.registration.json');
  assert.equal(result.result,'ok');assert.equal(result.data.credentialRevision,'3');
  const confirmation=cli('recover','--db',state.db,'--actor',actor,'--revision','2','--descriptor',out+'.registration.json');
  assert.equal(confirmation.result,'already_satisfied');assert.deepEqual(confirmation.data,result.data);
  for(const key of ['actorId','label','membership','membershipVersion','responsibilities','firstAdmission','latestMembershipChange'])assert.deepEqual(result.data[key],before.data[key]);
  return {operation:'host recovery and exact confirmation',result:result.result,credentialRevision:result.data.credentialRevision,noOpSnapshotEqual:true};
}
async function preflight() {
  const parent=mkdtempSync(join(tmpdir(),'mf-postman-')); let child;
  let state; const results=[];
  try {
    state=await setup(join(parent,'instance'));
    child=await start(state);
    for(const step of steps) {
      if(step.host==='recover'){results.push({id:step.id,...await recover(state)});continue;}
      if(step.host==='restart'){await stop(child);child=await start(state);results.push({id:step.id,operation:'restart same database',result:'ok'});continue;}
      const exported=json(join(here,'module-01.postman_collection.json'));
      const item=exported.item.find(x=>x.name===step.family)?.item.find(x=>x.name===step.name);
      assert.deepEqual(item,step.item,'Export differs from its documented builder/sequence.');
      const r=item.request;
      const url=substitute(r.url,state.values);
      const headers={}; if(step.actor)headers.Authorization='Bearer '+state.values[step.actor+'_token'];
      for(const h of r.header)headers[h.key]=h.value;
      const raw=r.body?substitute(r.body.raw,state.values):undefined;
      if(raw&&step.id!=='S04.07')JSON.parse(raw);
      const response=await fetch(url,{method:r.method,headers,body:raw,redirect:'manual'});
      const body=await response.json(); const checks=[];
      // Minimal adapter: only the pm methods emitted by this builder are implemented.
      const pm={response:{code:response.status,json:()=>body,headers:{get:k=>response.headers.get(k)}},environment:{get:k=>state.values[k],set:(k,v)=>{state.values[k]=v;}},expect:value=>({to:{eql:expected=>assert.deepEqual(value === undefined ? undefined : JSON.parse(JSON.stringify(value)),expected === undefined ? undefined : JSON.parse(JSON.stringify(expected)))}}),test:(name,fn)=>{try{fn();checks.push({name,pass:true});}catch{checks.push({name,pass:false});}}};
      vm.runInNewContext(item.event[0].script.exec.join('\n'),{pm},{timeout:1000});
      results.push({id:step.id,request:step.name,method:r.method,status:response.status,result:body.result,reasonCategory:body.reasonCategory,actorId:body.data?.actorId,membershipVersion:body.data?.membershipVersion,credentialRevision:body.data?.credentialRevision,checks});
      if(checks.some(x=>!x.pass))throw new Error('Export assertion failed at '+step.id+' HTTP '+response.status+' '+body.reasonCategory+' '+body.message+': '+checks.filter(x=>!x.pass).map(x=>x.name).join(', '));
    }
    const evidence={revision,runtime:process.versions.node,date:'2026-10-15',scope:'HTTP/export preflight using real CLI, service process, on-disk SQLite and fetch; minimal pm adapter implements test, expect.to.eql, response code/json/headers.get and environment get/set. Not actual Postman import or sandbox execution.',actualPostmanExecution:'not_run',humanAcceptance:'not_run',hostSetup:state.host,results};
    const safe=JSON.stringify({collection,evidence});
    for(const v of Object.values(state.candidates)){assert.ok(!safe.includes(v.owner.secret));assert.ok(!safe.includes(v.owner.verifier));}
    save(join(here,'preflight-evidence.json'),evidence);
    console.log(JSON.stringify({httpRequests:results.filter(x=>x.status).length,assertions:results.flatMap(x=>x.checks??[]).length,hostCheckpoints:results.filter(x=>!x.status).length,result:'pass'}));
  } finally {await stop(child);rmSync(parent,{recursive:true,force:true});}
}
function validate(values){
  assert.equal(collection.info.schema,'https://schema.getpostman.com/json/collection/v2.1.0/collection.json');
  for(const step of steps.filter(x=>x.item)){
    new vm.Script(step.item.event[0].script.exec.join('\n'));
    assert.ok(groups.get(step.family).includes(step.item));
    substitute(JSON.stringify(step.item),values);
  }
  assert.equal(new Set(steps.map(x=>x.id)).size,steps.length);
}
const mode=process.argv[2];
if(mode==='preflight') await preflight();
else if(mode==='collection'){
  // Explicitly overwrite only shareable exports; never rewrite an imported Environment.
  save(join(here,'module-01.postman_collection.json'),collection);
  save(join(here,'sequence.json'),steps.map(({item,...s})=>s));
  console.log('Shareable Collection and sequence rebuilt; private Environment preserved.');
}
else if(mode==='prepare'||mode==='export'){
  const dir=resolve(process.argv[3]??'.private/mf-mod-01-postman');
  mkdirSync(dirname(dir),{recursive:true,mode:0o700});
  let state;
  if(mode==='prepare') state=await setup(dir);
  else {
    const stored=json(join(dir,'state.json')); const values=initialValues(),candidates={};
    assert.equal(cli('status','--db',stored.db).data.state,'initialized');
    for(const [key,entry] of Object.entries(stored.actors)){
      const owner=json(entry.out),descriptor=json(entry.out+'.registration.json');
      assert.equal(owner.complete,true); assert.equal(owner.actorId,entry.actorId);
      assert.equal(statSync(entry.out).mode & 0o777,0o600);
      const {secret,complete,...binding}=owner;assert.deepEqual(binding,descriptor);
      candidates[key]={out:entry.out,owner,descriptor};
      values[key+'_id']=owner.actorId;values[key+'_credential']=owner.credentialId;values[key+'_token']=owner.credentialId+'~'+secret;values[key+'_registration']=JSON.stringify(descriptor);
    }
    state={dir,db:stored.db,values,candidates,host:[{operation:'reuse verified evaluation-owned prepared artifacts',result:'ok'}]};
  }
  // Select a free port using real service startup, then stop; user's first start reuses it.
  const child=await start(state);await stop(child);
  validate(state.values);
  save(join(here,'module-01.postman_collection.json'),collection);
  save(join(dir,'local.postman_environment.json'),environment(state.values),true);
  const port=new URL(state.values.baseUrl).port;
  save(join(dir,'launch.json'),{node:process.execPath,port,baseUrl:state.values.baseUrl},true);
  save(join(here,'sequence.json'),steps.map(({item,...s})=>s));
  console.log(JSON.stringify({dir,baseUrl:state.values.baseUrl,collection:join(here,'module-01.postman_collection.json'),environment:join(dir,'local.postman_environment.json'),setup:state.host}));
} else if(mode==='recover')console.log(JSON.stringify(await recover(json(join(resolve(process.argv[3]),'state.json')))));
else if(mode==='serve'){
  const dir=resolve(process.argv[3]); const s=json(join(dir,'state.json')),launch=json(join(dir,'launch.json'));
  assert.ok(!existsSync(join(dir,'service.json')),'Service marker already exists; inspect or stop the existing evaluation service first.');
  const child=spawn(launch.node,['src/cli.js','serve','--db',s.db,'--host','127.0.0.1','--port',launch.port],{stdio:'inherit'});
  const pidFile=join(dir,'service.json');save(pidFile,{pid:child.pid,db:s.db},true);
  for(const signal of ['SIGTERM','SIGINT'])process.on(signal,()=>child.kill(signal));
  await once(child,'exit');rmSync(pidFile);
} else if(mode==='stop'){
  const dir=resolve(process.argv[3]),service=json(join(dir,'service.json'));
  const command=execFileSync('ps',['-p',String(service.pid),'-o','command='],{encoding:'utf8'});
  assert.ok(command.includes('src/cli.js serve --db '+service.db+' --host 127.0.0.1 --port '),'Process identity differs; inspect locally before stopping.');
  process.kill(service.pid,'SIGTERM');console.log('Evaluation service stop requested.');
} else throw new Error('Use prepare [fresh-directory], export [prepared-directory], preflight, serve directory, stop directory, or recover directory.');
