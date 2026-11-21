// Exporte les dialogues de src/data/dialogues/<niveau>.fr.js vers docs/dialogues/<niveau>.md : un tableau
// id | qui | réplique | statut | remarque de Maxime, que Maxime annote directement (puis dialogues-import.mjs).
//   node tools/dialogues-export.mjs           → réécrit les .md (garde les remarques déjà saisies dans les .md)
//   node tools/dialogues-export.mjs --check   → code 1 si un .md n'est plus à jour (utilisé par les tests)
// Écrit aussi docs/dialogues/AUTO.md : toutes les répliques validées automatiquement (remarque « auto… »),
// la liste de relecture de Maxime, niveau par niveau.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { DIALOGUES } from '../src/data/dialogues/index.js';
import { readTable } from './dialogues-table.mjs';

const esc = s => String(s ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ');
export function render(level, lines, notes = {}) {
  const rows = lines.map(l => `| ${l.id} | ${esc(l.who)} | ${esc(l.txt)} | ${l.status} | ${esc(notes[l.id] ?? l.note ?? '')} |`);
  return `# Dialogues : ${level}

Relecture par Maxime. Colonne **statut** : \`draft\` (brouillon) ou \`ok\` (validé). Colonne **remarque** : libre.
On peut aussi corriger la réplique directement. Puis : \`node tools/dialogues-import.mjs\` (applique au jeu).
Jetons de touches : \`{use}\`, \`{attack}\`… (remplacés en jeu par la touche de l'appareil utilisé).

| id | qui | réplique | statut | remarque de Maxime |
|---|---|---|---|---|
${rows.join('\n')}
`;
}

// liste des répliques « auto » (validées sans relecture), à relire par Maxime
export function renderAuto(dialogues) {
  const auto = Object.entries(dialogues).flatMap(([level, lines]) => lines.filter(l => /^auto/.test(l.note || '')).map(l => ({ level, ...l })));
  return { count: auto.length, md: `# Répliques validées automatiquement (à relire par Maxime)

Générée par \`node tools/dialogues-export.mjs\` : les répliques dont la remarque commence par « auto ».
Pour corriger : le fichier docs/dialogues/<niveau>.md, puis \`node tools/dialogues-import.mjs\`.
Total : ${auto.length} réplique(s).

| niveau | id | qui | réplique |
|---|---|---|---|
${auto.map(l => `| ${l.level} | ${l.id} | ${esc(l.who)} | ${esc(l.txt)} |`).join('\n')}
` };
}

const check = process.argv.includes('--check');
let stale = 0;
const read = file => existsSync(file) ? readFileSync(file, 'utf8').replace(/\r\n/g, '\n') : '';
const out = (file, cur, md, info) => {
  if (check) { if (cur !== md) { console.log(`${file} n'est plus à jour : lancer node tools/dialogues-export.mjs`); stale++; } }
  else { writeFileSync(file, md); console.log(`${file} écrit (${info})`); }
};
mkdirSync('docs/dialogues', { recursive: true });
for (const [level, lines] of Object.entries(DIALOGUES)) {
  const file = `docs/dialogues/${level}.md`, cur = read(file);
  const notes = Object.fromEntries(readTable(cur).map(r => [r.id, r.note])); // on ne perd jamais une remarque
  out(file, cur, render(level, lines, notes), `${lines.length} répliques`);
}
const auto = renderAuto(DIALOGUES);
out('docs/dialogues/AUTO.md', read('docs/dialogues/AUTO.md'), auto.md, `${auto.count} répliques « auto »`);
if (check) { if (!stale) console.log('docs/dialogues à jour'); process.exit(stale ? 1 : 0); }
