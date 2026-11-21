// Dialogues en brouillon (protocole du prompt 05, section 2) :
// registre valide (ids uniques, statut draft / ok, jetons connus), tout id utilisé par un script existe,
// docs/dialogues à jour, aller-retour export → import sans perte, badge BROUILLON en jeu seulement avec ?debug=1.
// Les brouillons restants sont listés (information, pas un échec).
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { checker, launch } from './helpers.mjs';
import { DIALOGUES, allLines, drafts } from '../src/data/dialogues/index.js';
import { TEXTS } from '../src/data/texts.fr.js';
import { readTable } from '../tools/dialogues-table.mjs';

const T = checker('dialogues');
const lines = allLines(), ids = lines.map(l => l.id);

T.check('ids uniques', new Set(ids).size === ids.length);
const badStatus = lines.filter(l => !['draft', 'ok'].includes(l.status)).map(l => l.id);
T.check('statut draft ou ok', badStatus.length === 0, badStatus.join(', '));
const empty = lines.filter(l => !l.who || !l.txt).map(l => l.id);
T.check('qui et réplique renseignés', empty.length === 0, empty.join(', '));
const actions = new Set(Object.keys(TEXTS.glyphs.kb));
const badTok = lines.flatMap(l => [...l.txt.matchAll(/\{(\w+)\}/g)].map(m => m[1]).filter(k => !actions.has(k)).map(k => `${l.id}:{${k}}`));
T.check('jetons de touches connus', badTok.length === 0, badTok.join(', '));

// ids utilisés dans le code : sayIds([...]) et line('...')
const walk = d => readdirSync(d).flatMap(f => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
const used = walk('src').filter(f => f.endsWith('.js') && !f.includes(join('data', 'dialogues'))).flatMap(f => {
  const s = readFileSync(f, 'utf8');
  return [...s.matchAll(/sayIds\(\[([^\]]*)\]/g)].flatMap(m => [...m[1].matchAll(/['"]([^'"]+)['"]/g)].map(x => x[1]))
    .concat([...s.matchAll(/\bline\(['"]([^'"]+)['"]\)/g)].map(m => m[1]));
});
const missing = used.filter(id => !ids.includes(id));
T.check('tout id utilisé par un script existe', missing.length === 0, missing.join(', '));

// docs/dialogues à jour, et l'export relu donne exactement les mêmes répliques
const ex = spawnSync(process.execPath, ['tools/dialogues-export.mjs', '--check'], { encoding: 'utf8' });
T.check('docs/dialogues à jour', ex.status === 0, ex.stdout.trim());
for (const level of Object.keys(DIALOGUES)) {
  const rows = readTable(readFileSync(`docs/dialogues/${level}.md`, 'utf8'));
  const same = rows.length === DIALOGUES[level].length && rows.every((r, i) => {
    const l = DIALOGUES[level][i]; return r.id === l.id && r.who === l.who && r.txt === l.txt && r.status === l.status;
  });
  T.check(`aller-retour export / relecture sans perte (${level})`, same);
}
console.log(`(info) ${drafts().length} réplique(s) en brouillon : ${drafts().map(l => l.id).join(', ') || 'aucune'}`);

// en jeu : badge BROUILLON seulement en debug
for (const debug of [true, false]) {
  const { browser, h } = await launch(T, { query: `level=bac-a-sable&seed=1${debug ? '&debug=1' : ''}` });
  await h.start();
  await h.run(() => window.S3K.dialog.sayIds(['bas.test.1'])); await h.wait(250);
  const r = await h.run(() => ({ badge: getComputedStyle(document.querySelector('#dialog .badge')).display !== 'none',
    txt: document.querySelector('#dialog .txt').textContent, who: document.querySelector('#dialog .who').textContent }));
  T.check(`badge BROUILLON ${debug ? 'visible avec' : 'masqué sans'} ?debug=1`, r.badge === debug);
  if (debug) T.check('jeton {attack} remplacé par la touche', !r.txt.includes('{') && r.who === 'TUTO', r.txt.slice(0, 40));
  await browser.close();
}

await T.finish();
