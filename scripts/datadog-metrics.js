#!/usr/bin/env node
/*
 * Collect JUnit XML metrics and push to Datadog metrics intake.
 */
const fs = require('fs');
const path = require('path');
const RESULTS_DIR = path.join(process.cwd(), 'cypress', 'results');
function listXML(dir) { if (!fs.existsSync(dir)) return []; return fs.readdirSync(dir).filter(f=>f.endsWith('.xml')).map(f=>path.join(dir,f)); }
const files = listXML(RESULTS_DIR);
if (!files.length) { console.log('No JUnit XML files found; skipping Datadog metrics.'); process.exit(0); }
let suites=0,cases=0,failures=0,skipped=0; for(const file of files){ const c=fs.readFileSync(file,'utf8'); suites += (c.match(/<testsuite\b/g)||[]).length; cases += (c.match(/<testcase\b/g)||[]).length; failures += (c.match(/<failure\b/g)||[]).length; skipped += (c.match(/<skipped\b/g)||[]).length; }
const passed = Math.max(cases - failures - skipped, 0);
const apiKey = process.env.DATADOG_API_KEY; const site = process.env.DATADOG_SITE || 'datadoghq.com'; if(!apiKey){ console.error('DATADOG_API_KEY missing; cannot send metrics.'); process.exit(0);} const ts=Math.floor(Date.now()/1000);
const tags=[ `service:${process.env.DD_SERVICE||'cypress-e2e'}`, `env:${process.env.DD_ENV||'ci'}`, process.env.GITHUB_REF_NAME?`branch:${process.env.GITHUB_REF_NAME}`:null, process.env.GITHUB_WORKFLOW?`workflow:${process.env.GITHUB_WORKFLOW}`:null, process.env.GITHUB_SHA?`commit:${process.env.GITHUB_SHA}`:null ].filter(Boolean);
const payload={ series:[ {metric:'cypress.tests.suites',points:[[ts,suites]],type:'count',tags}, {metric:'cypress.tests.cases',points:[[ts,cases]],type:'count',tags}, {metric:'cypress.tests.failures',points:[[ts,failures]],type:'count',tags}, {metric:'cypress.tests.skipped',points:[[ts,skipped]],type:'count',tags}, {metric:'cypress.tests.passed',points:[[ts,passed]],type:'count',tags} ] };
if (typeof fetch === 'undefined') { global.fetch = (...args)=>import('node-fetch').then(({default:fetch})=>fetch(...args)); }
async function send(){ const url=`https://api.${site}/api/v1/series`; try{ const res=await fetch(url,{ method:'POST', headers:{ 'Content-Type':'application/json','DD-API-KEY':apiKey }, body:JSON.stringify(payload)}); const text=await res.text(); if(!res.ok){ console.error('Datadog metrics POST failed', res.status, text); } else { console.log('Datadog metrics sent OK. Response:', text || '(empty)'); console.log('Payload:', JSON.stringify(payload,null,2)); } }catch(e){ console.error('Error sending metrics:', e.stack||e.message);} }
send();
