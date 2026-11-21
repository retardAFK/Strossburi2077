// Recense les événements du bus (emit / on) dans src/ et écrit docs/EVENTS.md : nom, émetteurs, écouteurs, arguments.
// Les noms construits (« 'switch:reset:' + groupe ») deviennent des motifs « switch:reset:<id> ».
//   node tools/list-events.mjs           → réécrit docs/EVENTS.md
//   node tools/list-events.mjs --check   → code 1 si docs/EVENTS.md n'est plus à jour (utilisé par les tests)
import { readFileSync, readdirSync, statSync, writeFileSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const walk = d => readdirSync(d).flatMap(f => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
const files = walk('src').filter(f => f.endsWith('.js')).sort();
const CALL = /\.(emit|on)\((['`])([^'`]+)\2\s*(\+\s*[^,)]+)?\s*(,([^;\n]*))?/g;

const ev = new Map(); // nom → { emit: Set, on: Set, args: Set }
for (const f of files) {
  const rel = relative('src', f).replace(/\\/g, '/');
  for (const [, kind, , raw, plus, , rest] of readFileSync(f, 'utf8').matchAll(CALL)) {
    let name = raw;
    if (plus || raw.endsWith(':') || raw.includes('${')) name = raw.replace(/\$\{[^}]+\}/g, '').replace(/:?$/, ':') + '<id>';
    if (!name.includes(':') && !['hit'].includes(name)) continue; // les événements du jeu ont tous un « : » (sauf 'hit')
    const e = ev.get(name) || { emit: new Set(), on: new Set(), args: new Set() };
    e[kind].add(rel);
    if (kind === 'emit' && rest) e.args.add(rest.replace(/\)\s*;?\s*$/, '').replace(/\)[^)]*$/, '').trim().slice(0, 60));
    ev.set(name, e);
  }
}
// un nom précis (« switch:enable:bornes ») rejoint son motif (« switch:enable:<id> ») s'il existe
for (const name of [...ev.keys()]) {
  const pattern = [...ev.keys()].find(p => p.endsWith('<id>') && p !== name && name.startsWith(p.slice(0, -4)));
  if (!pattern) continue;
  const a = ev.get(name), b = ev.get(pattern);
  for (const k of ['emit', 'on', 'args']) for (const v of a[k]) b[k].add(v);
  ev.delete(name);
}

const cell = s => [...s].sort().map(x => '`' + x + '`').join('<br>') || '—';
const rows = [...ev.keys()].sort().map(n => { const e = ev.get(n); return `| \`${n}\` | ${cell(e.emit)} | ${cell(e.on)} | ${[...e.args].sort().map(a => '`' + a.replace(/\|/g, '\\|') + '`').join('<br>') || '—'} |`; });
const md = `# Événements du bus (généré)

Fichier généré par \`node tools/list-events.mjs\` à partir des appels \`emit(\` / \`on(\` de \`src/\`.
**Ne pas éditer à la main** : relancer l'outil après avoir ajouté ou renommé un événement (le test \`conventions\` vérifie qu'il est à jour).
\`<id>\` = partie variable du nom (groupe d'énigme, identifiant de PNJ, de coffre, de levier…).
Certains noms viennent des **données** et n'apparaissent pas comme émis ici : le terminal émet le champ \`event\` de son layout (ex. \`terminal:laser\`).

| Événement | Émis par | Écouté par | Arguments (extrait de l'appel) |
|---|---|---|---|
${rows.join('\n')}
`;

if (process.argv.includes('--check')) {
  const cur = existsSync('docs/EVENTS.md') ? readFileSync('docs/EVENTS.md', 'utf8').replace(/\r\n/g, '\n') : '';
  if (cur !== md) { console.log('docs/EVENTS.md n\'est plus à jour : lancer node tools/list-events.mjs'); process.exit(1); }
  console.log(`docs/EVENTS.md à jour (${ev.size} événements)`);
} else {
  writeFileSync('docs/EVENTS.md', md);
  console.log(`docs/EVENTS.md écrit (${ev.size} événements)`);
}
