import fs from 'node:fs';
import path from 'node:path';
const files = ['src/i18n/core.ts', ...fs.readdirSync('src/i18n/ns').map(f=>'src/i18n/ns/'+f)];
// crude: extract object literals named *Ar / *En
for (const f of files) {
  const src = fs.readFileSync(f,'utf8');
  const objs = {};
  const re = /export const (\w+(?:Ar|En))\s*=\s*\{/g;
  let m;
  while ((m = re.exec(src))) {
    const start = re.lastIndex - 1;
    let depth = 0, i = start;
    for (; i < src.length; i++) {
      if (src[i] === '{') depth++;
      else if (src[i] === '}') { depth--; if (depth === 0) break; }
    }
    const body = src.slice(start, i+1);
    const keys = [...body.matchAll(/(?:^|[\{,]\s*)['"]([^'"]+)['"]\s*:/gm)].map(x=>x[1]);
    objs[m[1]] = keys;
  }
  const names = Object.keys(objs);
  const arName = names.find(n=>n.endsWith('Ar'));
  const enName = names.find(n=>n.endsWith('En'));
  if (!arName||!enName) { console.log(f, 'SKIP', names); continue; }
  const A = new Set(objs[arName]), E = new Set(objs[enName]);
  const missEn = [...A].filter(k=>!E.has(k));
  const missAr = [...E].filter(k=>!A.has(k));
  const dupA = objs[arName].length - A.size, dupE = objs[enName].length - E.size;
  console.log(`${f}: ar=${A.size} en=${E.size} missingInEn=${JSON.stringify(missEn)} missingInAr=${JSON.stringify(missAr)} dupAr=${dupA} dupEn=${dupE}`);
}
