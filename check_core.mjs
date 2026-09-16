import fs from 'node:fs';
const src = fs.readFileSync('src/i18n/core.ts','utf8');
function block(name){
  const i = src.indexOf(name+': {');
  let d=0, s=src.indexOf('{', i);
  let j=s;
  for(;j<src.length;j++){ if(src[j]==='{')d++; else if(src[j]==='}'){d--; if(d===0)break;} }
  return src.slice(s,j+1);
}
const A=[...block('  ar').matchAll(/'([^']+)':/g)].map(m=>m[1]);
const E=[...block('  en').matchAll(/'([^']+)':/g)].map(m=>m[1]);
const sa=new Set(A), se=new Set(E);
console.log('ar',A.length,'uniq',sa.size,'en',E.length,'uniq',se.size);
console.log('missing in en:', [...sa].filter(k=>!se.has(k)));
console.log('missing in ar:', [...se].filter(k=>!sa.has(k)));
const dup = a => a.filter((k,i)=>a.indexOf(k)!==i);
console.log('dup ar:', dup(A), 'dup en:', dup(E));
