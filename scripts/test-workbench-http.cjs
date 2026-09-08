const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const base=process.argv[2] || 'http://127.0.0.1:18941';
const root=path.resolve(__dirname,'..');
let token,checks=0;
const check=(condition,label)=>{assert.ok(condition,label);checks++;console.log('PASS '+label);};
async function req(url,method='GET',body,headers={}) {
  const r=await fetch(base+url,{method,headers:{...(token?{'X-Tracewright-Session':token}:{}),...(body && !(body instanceof FormData)?{'Content-Type':'application/json'}:{}),...headers},body:body instanceof FormData?body:body?JSON.stringify(body):undefined});
  return {status:r.status,value:r.headers.get('content-type')?.includes('json')?await r.json():Buffer.from(await r.arrayBuffer())};
}
function blank(s) { if(s.type==='object')return Object.fromEntries(Object.entries(s.properties).map(([k,v])=>[k,blank(v)]));if(s.type==='array')return [];if(s.type==='boolean')return true;return s.enum?.[0] || 'Fictional QA only'; }
(async()=>{
  check((await req('/api/projects')).status===401,'Session token required');
  check((await req('/api/health','GET',null,{Origin:'https://untrusted.example'})).status===403,'Cross-origin health blocked');
  const health=await req('/api/health');check(health.value.version==='0.5.0-beta','Correct release version');token=health.value.sessionToken;
  const p=(await req('/api/projects','POST',{title:'FICTIONAL QA / support automation'})).value;
  const url='/api/projects/'+p.id;
  check((await req(url+'/intake','PUT',{title:p.title,reviewQuestion:'Check whether the exception is actually reviewed before closure.',privacyConfirmed:true})).status===200,'Brief saved');
  const text='Entirely fictional test data.\nPolicy: every safety exception needs an assigned human reviewer before closure.\nEvent T001: safety exception closed after 48 hours with no reviewer assigned.\nKnown limit: no other event log or explanation was supplied.\nCafé / 日本語.';
  const form=new FormData();form.append('files',new Blob([text],{type:'text/plain'}),'fictional-qa.txt');form.append('contextStatus','Analysis target');form.append('authorRole','Fictional scenario author');
  check((await req(url+'/materials','POST',form)).status===200,'Local material upload');
  check((await req(url+'/prepare','POST',{sourceIds:['S001']})).status===400,'Unconfirmed text rejected');
  check((await req(url+'/text/S001')).value.text===text,'UTF-8 source readback');
  check((await req(url+'/text/S001','PUT',{text})).status===200,'Confirmed text stored');
  let plan=(await req(url+'/prepare','POST',{sourceIds:['S001']})).value;
  const approve=()=>({planId:plan.id,fingerprint:plan.fingerprint,dataTermsChecked:true,authorityConfirmed:true,contentConfirmed:true,environmentLabel:'Developer-approved fictional integration test only'});
  check((await req(url+'/bundle','POST',{...approve(),dataTermsChecked:false})).status===400,'Missing data terms blocked');
  check((await req(url+'/bundle','POST',approve())).status===200,'Bounded manual bundle prepared');
  check((await req(url+'/bundle','POST',approve())).status===400,'Duplicate dispatch blocked');
  const schema=JSON.parse(fs.readFileSync(path.join(root,'workbench/schemas/review-output.schema.json'),'utf8'));
  const result=blank(schema),source=blank(schema.properties.sources.items),e=blank(schema.properties.evidence.items);
  Object.assign(source,{source_id:'S001',target_status:'Analysis target',summary:'A fictional policy and one event record.'});result.sources=[source];
  Object.assign(e,{evidence_id:'E001',title:'Closure without assigned receipt',source_id:'S001',source_excerpt:text.split('\n')[2],reasoning_chain:['The supplied event lacks assigned receipt before closure.'],alternative_explanations:['An omitted separate log may contain receipt.'],next_action:'Ask for the full event trace; do not infer misconduct.'});result.evidence=[e];
  result.orientation.overview='Fictional demonstration: policy and actual receipt require comparison.';
  result.workflow_review={overview:'Check who acts before closure.',steps:[{id:'IN',title:'Receive report',actor:'AI',owner:'Unconfirmed',description:'Fictional intake.',source_ids:['S001']},{id:'END',title:'Close report',actor:'System',owner:'Unconfirmed',description:'The selected event closed after 48 hours.',source_ids:['S001']}],transitions:[{from:'IN',to:'END',condition:'48 hours',basis:'Selected fictional event only',source_ids:['S001']}],controls:[{title:'Assigned human receipt',state:'documented_mismatch',observation:'The supplied event lacks assigned receipt.',alternatives:['Another log may contain receipt.'],next_check:'Request the complete event trace.',source_ids:['S001']}],unknowns:['Actual reviewer capacity and separate logs.']};
  const upload=async value=>{const f=new FormData();f.append('file',new Blob([JSON.stringify(value)]),'result.json');return req(url+'/review-import','POST',f);};
  check((await upload({...result,evidence:'wrong type'})).status===400,'Malformed result blocked');
  check((await upload({...result,evidence:[{...e,source_excerpt:'Invented quote'}]})).status===400,'Invented quote blocked');
  check((await upload(result)).status===200,'Valid result imported');
  check((await req(url)).value.review.evidence[0].source_excerpt===e.source_excerpt,'Result readback matches');
  check((await req(url+'/cancel','POST')).value.cancelled===false,'No-run stop is explicit');
  console.log('QA_PROJECT='+p.id);
  if(process.argv.includes('--live')) {
    check(health.value.codex.available,'ChatGPT sign-in available for synthetic test');
    plan=(await req(url+'/prepare','POST',{sourceIds:['S001']})).value;
    const start=await req(url+'/run/codex','POST',approve());check(start.status===202,'Live synthetic request accepted');
    let status;
    for(let i=0;i<160;i++){await new Promise(r=>setTimeout(r,5000));status=(await req(url+'/run-status')).value;if(!['queued','running'].includes(status.state))break;}
    console.log('LIVE_STATUS='+JSON.stringify(status));check(status.state==='completed','Live synthetic result validated and applied');
  }
  console.log(checks+' HTTP checks passed. No private sources used.');
})().catch(e=>{console.error(e);process.exitCode=1;});
