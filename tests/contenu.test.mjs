// Vérifications de contenu et de conventions, sans navigateur :
// jetons {action} des textes, année du futur jamais en dur, aléatoire à graine dans la logique de jeu,
// générateur reproductible, en-tête de rôle et taille des fichiers (signalée, sans échec).
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { checker } from './helpers.mjs';
import { TEXTS } from '../src/data/texts.fr.js';
import { seed, rng } from '../src/core/Random.js';

const T = checker('contenu');
const walk = d => readdirSync(d).flatMap(f => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
const src = walk('src').filter(f => f.endsWith('.js'));

// 1. jetons : tout {mot} des textes est une action connue (glyphes) ou un paramètre prévu
const actions = new Set(Object.keys(TEXTS.glyphs.kb));
const params = new Set(['t', 'state', 'share']); // paramètres remplacés ailleurs : chrono, vibrations, icône Partager (install.js)
const unknown = new Set();
const scan = v => { if (typeof v === 'string') for (const [, k] of v.matchAll(/\{(\w+)\}/g)) { if (!actions.has(k) && !params.has(k)) unknown.add(k); }
  else if (v && typeof v === 'object') Object.values(v).forEach(scan); };
scan(TEXTS);
T.check('textes : tous les jetons {…} sont connus', unknown.size === 0, [...unknown].join(', '));
for (const dev of ['xbox', 'ps']) {
  const miss = [...actions].filter(a => !(a in TEXTS.glyphs[dev]));
  T.check(`glyphes ${dev} : toutes les actions`, miss.length === 0, miss.join(', '));
}

// 2. année du futur : uniquement dans la constante YEAR
const texts = readFileSync('src/data/texts.fr.js', 'utf8');
const years = texts.split('\n').filter(l => /20(67|77)/.test(l) && !/const YEAR/.test(l) && !/^\s*\/\//.test(l));
T.check('textes : année du futur jamais écrite en dur', years.length === 0, years.join(' | '));
T.check('année du futur = TEXTS.year', TEXTS.year === '2067', TEXTS.year);

// 3. aléatoire : la logique de jeu passe par core/Random.js (les effets visuels gardent Math.random)
const logic = src.filter(f => /entities[\\/](enemies|bosses)|[\\/]Game\.js$/.test(f));
const bad = logic.flatMap(f => readFileSync(f, 'utf8').split('\n').map((l, i) => [f, i + 1, l]))
  .filter(([, , l]) => l.includes('Math.random') && !l.includes('particles')).map(([f, i]) => `${f}:${i}`);
T.check('logique de jeu : pas de Math.random()', bad.length === 0, bad.join(', '));

// 4. générateur à graine : même graine → même suite, graines différentes → suites différentes
seed(1); const a = Array.from({ length: 8 }, rng);
seed(1); const b = Array.from({ length: 8 }, rng);
seed(2); const c = Array.from({ length: 8 }, rng);
T.check('Random : reproductible', JSON.stringify(a) === JSON.stringify(b));
T.check('Random : dépend de la graine', JSON.stringify(a) !== JSON.stringify(c));
T.check('Random : dans [0, 1[', a.concat(c).every(x => x >= 0 && x < 1));

// 5. conventions : en-tête de rôle (commentaire en 1re ligne) ; taille signalée au-delà de 250 lignes
const noHeader = src.filter(f => !readFileSync(f, 'utf8').trimStart().startsWith('//'));
T.check('chaque fichier de src/ commence par un commentaire de rôle', noHeader.length === 0, noHeader.join(', '));
const long = src.map(f => [f, readFileSync(f, 'utf8').split('\n').length]).filter(([, n]) => n > 250);
console.log(long.length ? `(info) fichiers > 250 lignes : ${long.map(([f, n]) => `${f} (${n})`).join(', ')}` : '(info) aucun fichier > 250 lignes');

await T.finish();
