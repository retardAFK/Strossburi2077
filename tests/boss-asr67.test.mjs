// Boss ASR-67 (graine fixe ?seed=1) : garde de face, TPE dans le dos → étourdi, dégâts pendant l'étourdissement,
// phases aux seuils de TUNING.asr.phases, renforts, charge contre un pilier-fourneau, flammes, défaite → cliffhanger.
// Instantané des réglages : tests/snapshots/asr67.json (mise à jour volontaire : npm run test:update-snapshots).
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { launch, checker } from './helpers.mjs';
import { TUNING } from '../src/data/tuning.js';

const T = checker('boss-asr67');
const SNAP = 'tests/snapshots/asr67.json', current = JSON.stringify(TUNING.asr, null, 2) + '\n';
if (process.argv.includes('--update-snapshots') || process.env.UPDATE_SNAPSHOTS) {
  mkdirSync('tests/snapshots', { recursive: true }); writeFileSync(SNAP, current); console.log('instantané mis à jour :', SNAP);
}
const same = existsSync(SNAP) && JSON.stringify(JSON.parse(readFileSync(SNAP, 'utf8'))) === JSON.stringify(TUNING.asr); // indépendant des fins de ligne
T.check('réglages TUNING.asr = instantané', same,
  same ? '' : existsSync(SNAP) ? 'différent : lancer npm run test:update-snapshots si c\'est voulu' : 'instantané absent');

const { browser, h } = await launch(T, { query: 'debug=1&seed=1' });
await h.start();
for (let i = 0; i < 6; i++) await h.warp(); // jusqu'à la cuisine (salle 5)
await h.skipDialogs(); await h.god();
await h.run(() => { const g = window.S3K; window.__phases = []; window.__defeated = 0;
  g.events.on('boss:phase', n => window.__phases.push(n)); g.events.on('boss:defeated', () => window.__defeated++); });
T.check('ASR-67 en jeu', await h.run(() => window.S3K.entities.some(e => e.isBoss && e.constructor.name === 'Asr67')));

// phase 1 : tickets d'addition en éventail, puis plats brûlants (avertissement → brûlure)
const attack = st => h.run(async st => {
  const g = window.S3K, b = g.entities.find(e => e.isBoss), seen = new Set(g.entities); let n = 0;
  b.setState(st);
  for (let i = 0; i < 40; i++) { for (const e of g.entities) if (!seen.has(e)) { seen.add(e); if (st === 'tickets' ? e.isProjectile : e.isHazard) n++; } await new Promise(r => setTimeout(r, 50)); }
  return n;
}, st);
const tickets = await attack('tickets');
T.check('phase 1 : tickets en éventail', tickets === TUNING.asr.tickets, `${tickets} tickets`);
T.check('phase 1 : plats brûlants au sol', await attack('plates') >= 3);
T.check('phase 1 : il alterne seul tickets / plats', await h.run(async () => {
  const b = window.S3K.entities.find(e => e.isBoss), st = new Set(); b.setState('walk'); b.cd = 0;
  for (let i = 0; i < 240; i++) { st.add(b.stateName); await new Promise(r => setTimeout(r, 50)); }
  return st.has('tickets') || st.has('plates');
}));
await h.run(() => { for (const e of [...window.S3K.entities]) if (e.isHazard || e.isProjectile) e.remove(); });

// hp, état ; coup venant d'un côté donné (n = direction attaquant → boss) ; « src » : 'whip' (l'Ultra) ou 'bretzel'
const hit = (side, src, prep) => h.run(([side, src, prep]) => {
  const g = window.S3K, b = g.entities.find(e => e.isBoss);
  b.x = 50; b.z = -160; b.face = Math.PI / 2; // regarde vers -z
  if (prep) b.setState(prep);
  const n = side === 'front' ? { x: -b.fx, z: -b.fz } : { x: b.fx, z: b.fz };
  const from = src === 'bretzel' ? { isPlayerShot: true } : g.player;
  const hp = b.hp; b.takeHit(1, n.x, n.z, 5, from);
  return { before: hp, after: b.hp, st: b.stateName };
}, [side, src, prep]);

let r = await hit('front', 'whip', 'walk');
T.check('écharpe de face → bloquée (toque)', r.after === r.before && r.st === 'walk');
r = await hit('front', 'bretzel', 'walk');
T.check('bretzel de face → bloqué', r.after === r.before && r.st !== 'stunned');
r = await hit('back', 'bretzel', 'walk');
T.check('bretzel dans le dos (TPE) → étourdi', r.st === 'stunned' && r.after === r.before);
r = await hit('front', 'whip', null);
T.check('écharpe pendant l\'étourdissement → dégâts', r.after < r.before, `${r.before} → ${r.after}`);

// phases aux seuils
const toRatio = ratio => h.run(ratio => { const b = window.S3K.entities.find(e => e.isBoss); b.hp = b.maxHp * ratio + 0.5; b.setState('stunned');
  b.takeHit(1, 0, -1, 1, window.S3K.player); return b.phase; }, ratio);
const [p1, p2] = await h.run(() => window.S3K.entities.find(e => e.isBoss).thresholds);
T.check('phase 2 au seuil', await toRatio(p1) === 1);
await h.wait(300); await h.skipDialogs();
T.check('phase 2 : 2 serveurs en renfort', await h.run(() => window.S3K.entities.filter(e => e.isEnemy && e.alive && !e.isBoss).length) === 2);
await h.run(() => { for (const e of [...window.S3K.entities]) if (e.isEnemy && e.alive && !e.isBoss) e.takeHit(99, 0, 1, 5, null); });

// charge contre un pilier-fourneau → étourdi
const charged = await h.run(async () => {
  const g = window.S3K, b = g.entities.find(e => e.isBoss), pil = g.level.layout.pillars[2];
  Object.assign(g.player, { x: 40.8, z: pil.z }); Object.assign(b, { x: pil.x + 6, z: pil.z });
  b.faceTo(pil.x, pil.z); b.setState('charge');
  for (let i = 0; i < 40 && b.stateName === 'charge'; i++) await new Promise(r => setTimeout(r, 50));
  return b.stateName;
});
T.check('charge contre un pilier-fourneau → étourdi', charged === 'stunned', charged);

T.check('phase 3 au seuil', await toRatio(p2) === 2);
await h.wait(200);
T.check('phase 3 : flammes du four', await h.run(() => window.S3K.entities.some(e => e.constructor.name === 'Flames')));
T.check('événements boss:phase 1 puis 2', JSON.stringify(await h.run(() => window.__phases)) === '[1,2]');

// défaite → cinématique SCN → « Strasbourg, 2026 »
await h.run(() => { const b = window.S3K.entities.find(e => e.isBoss); b.hp = 0.5; b.setState('stunned'); b.takeHit(1, 0, -1, 1, window.S3K.player); });
T.check('défaite → boss:defeated', await h.run(() => window.__defeated) === 1);
T.check('flammes éteintes', !(await h.run(() => window.S3K.entities.some(e => e.constructor.name === 'Flames' && !e.removed))));
await h.wait(300); await h.skipDialogs(); await h.wait(300); await h.skipDialogs();
T.check('« Strasbourg, 2026 »', await h.until(() => document.querySelector('#caption').textContent.startsWith('Strasbourg, 2026'), 20000));

await T.finish(browser);
