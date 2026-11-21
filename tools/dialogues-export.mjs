// Exporte les dialogues de src/data/dialogues/<niveau>.fr.js vers docs/dialogues/<niveau>.md : un tableau
// id | qui | réplique | statut | remarque de Maxime, que Maxime annote directement (puis dialogues-import.mjs).
//   node tools/dialogues-export.mjs           → réécrit les .md (garde les remarques déjà saisies dans les .md)
//   node tools/dialogues-export.mjs --check   → code 1 si un .md n'est plus à jour (utilisé par les tests)
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

const check = process.argv.includes('--check');
let stale = 0;
mkdirSync('docs/dialogues', { recursive: true });
for (const [level, lines] of Object.entries(DIALOGUES)) {
  const file = `docs/dialogues/${level}.md`;
  const cur = existsSync(file) ? readFileSync(file, 'utf8').replace(/\r\n/g, '\n') : '';
  const notes = Object.fromEntries(readTable(cur).map(r => [r.id, r.note])); // on ne perd jamais une remarque
  const md = render(level, lines, notes);
  if (check) { if (cur !== md) { console.log(`${file} n'est plus à jour : lancer node tools/dialogues-export.mjs`); stale++; } }
  else { writeFileSync(file, md); console.log(`${file} écrit (${lines.length} répliques)`); }
}
if (check) { if (!stale) console.log('docs/dialogues à jour'); process.exit(stale ? 1 : 0); }
