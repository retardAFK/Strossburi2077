// Applique au jeu la relecture de Maxime : lit docs/dialogues/<niveau>.md et réécrit src/data/dialogues/<niveau>.fr.js
// (statut, remarque, et texte / personnage s'ils ont été corrigés). Garde le commentaire d'en-tête du fichier .js.
// Refuse un statut autre que 'draft' ou 'ok', un id inconnu ou un id en double.
//   node tools/dialogues-import.mjs
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { DIALOGUES } from '../src/data/dialogues/index.js';
import { readTable } from './dialogues-table.mjs';

let errors = 0, changes = 0;
for (const level of Object.keys(DIALOGUES)) {
  const md = `docs/dialogues/${level}.md`, js = `src/data/dialogues/${level}.fr.js`;
  if (!existsSync(md)) { console.log(`${md} absent : lancer d'abord node tools/dialogues-export.mjs`); continue; }
  const lines = (await import(pathToFileURL(resolve(js)).href + '?t=' + Date.now())).default.map(l => ({ ...l }));
  const byId = new Map(lines.map(l => [l.id, l])), seen = new Set();
  for (const r of readTable(readFileSync(md, 'utf8'))) {
    if (seen.has(r.id)) { console.log(`${md} : id en double ${r.id}`); errors++; continue; }
    seen.add(r.id);
    const l = byId.get(r.id);
    if (!l) { console.log(`${md} : id inconnu ${r.id} (ajouter la réplique dans ${js})`); errors++; continue; }
    if (!['draft', 'ok'].includes(r.status)) { console.log(`${md} : statut « ${r.status} » invalide pour ${r.id} (draft ou ok)`); errors++; continue; }
    for (const [k, v] of [['who', r.who], ['txt', r.txt], ['status', r.status]]) if (l[k] !== v) { l[k] = v; changes++; }
    if ((l.note ?? '') !== r.note) { if (r.note) l.note = r.note; else delete l.note; changes++; }
  }
  if (errors) continue;
  const header = readFileSync(js, 'utf8').replace(/\r\n/g, '\n').split('\n').filter(s => s.startsWith('//')).join('\n');
  const body = lines.map(l => '  { ' + Object.entries(l).map(([k, v]) => `${k}: ${JSON.stringify(v)}`).join(', ') + ' }').join(',\n');
  writeFileSync(js, `${header}\nexport default [\n${body}\n];\n`);
  console.log(`${js} mis à jour`);
}
console.log(errors ? `${errors} erreur(s) : rien n'a été écrit pour les niveaux concernés` : `${changes} modification(s) appliquée(s)`);
process.exit(errors ? 1 : 0);
