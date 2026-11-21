// Boss le Promoteur (niveau 3, graine ?seed=1) : garde (l'écharpe rebondit), largage de préfabriqués télégraphié
// (cercle rouge → chute → dégâts dans le rayon), préfabriqué renvoyé par un vrai lancer de gaffe-grappin → dégâts
// et étourdissement, coups pendant l'étourdissement, phases (plus de préfabriqués, renforts), défaite → fin du niveau.
// Instantané des réglages : tests/snapshots/promoteur.json (mise à jour volontaire : npm run test:update-snapshots).
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { launch, checker } from './helpers.mjs';
import { TUNING } from '../src/data/tuning.js';

const T = checker('boss-promoteur'), P = TUNING.promoteur;
const SNAP = 'tests/snapshots/promoteur.json', current = JSON.stringify(P, null, 2) + '\n';
if (process.argv.includes('--update-snapshots') || process.env.UPDATE_SNAPSHOTS) {
  mkdirSync('tests/snapshots', { recursive: true }); writeFileSync(SNAP, current); console.log('instantané mis à jour :', SNAP);
}
const same = existsSync(SNAP) && JSON.stringify(JSON.parse(readFileSync(SNAP, 'utf8'))) === JSON.stringify(P);
T.check('réglages TUNING.promoteur = instantané', same,
  same ? '' : existsSync(SNAP) ? 'différent : lancer npm run test:update-snapshots si c\'est voulu' : 'instantané absent');

const { browser, h } = await launch(T, { query: 'debug=1&level=port-rhin&seed=1' });
await h.start();
for (let i = 0; i < 5; i++) await h.warp(); // jusqu'au chantier
await h.skipDialogs();
await h.run(() => { const g = window.S3K; window.__ev = []; g.events.on('boss:phase', n => window.__ev.push('phase' + n)); g.events.on('boss:defeated', () => window.__ev.push('defeated')); });
const boss = () => h.run(() => { const b = window.S3K.entities.find(e => e.isBoss); return { st: b.stateName, hp: b.hp, phase: b.phase }; });
T.check('le Promoteur marche (combat lancé)', (await boss()).st === 'walk');

// garde : l'écharpe rebondit hors étourdissement
let hp = (await boss()).hp;
await h.run(() => { const g = window.S3K; g.entities.find(e => e.isBoss).takeHit(1, 0, 1, 5, g.player); });
T.check('hors étourdissement : l\'écharpe rebondit', (await boss()).hp === hp);

// largage : cercle d'alerte, puis chute, puis dégâts si l'Ultra reste dessous
T.check('cercle d\'alerte avant la chute', await h.until(() => window.S3K.entities.some(e => e.isPrefab && e.state === 'warn'), 8000));
const hit = await h.run(async () => { const g = window.S3K, p = g.player, f = g.entities.find(e => e.isPrefab && e.state === 'warn');
  p.inv = 0; const hp0 = p.hp; Object.assign(p, { x: f.x, z: f.z }); for (let i = 0; i < 60 && f.state !== 'ground'; i++) await new Promise(r => setTimeout(r, 50));
  return { landed: f.state === 'ground', hurt: p.hp < hp0 }; });
T.check('le préfabriqué tombe et blesse l\'Ultra resté dessous', hit.landed && hit.hurt, JSON.stringify(hit));
await h.god();

// vrai lancer de gaffe-grappin sur un préfabriqué au sol → renvoyé au Promoteur
// (le Promoteur ne relargue pas pendant ce lancer ; le préfabriqué visé repart pour une durée de vie complète)
await h.run(() => { const g = window.S3K, p = g.player, b = g.entities.find(e => e.isBoss), f = g.entities.find(e => e.isPrefab && e.state === 'ground');
  for (const e of g.entities) if (e.isPrefab && e !== f) e.remove();
  b.setState('walk'); b.cd = 99; f.st = 0;
  Object.assign(p, { x: f.x + 3, z: f.z + 3 }); p.sync(); g.inventory.equip('gaffe'); p.target = f; });
await h.until(() => window.S3K.inventory.items.gaffe.ready, 3000); await h.key('KeyF');
T.check('préfabriqué renvoyé → Promoteur sonné', await h.until(() => window.S3K.entities.find(e => e.isBoss).stateName === 'stunned', 4000));
let b = await boss();
T.check('préfabriqué renvoyé → gros dégâts', b.hp === P.hp - P.returnDmg, JSON.stringify(b));
await h.run(() => { const g = window.S3K; g.entities.find(e => e.isBoss).takeHit(1, 0, 1, 5, g.player); });
T.check('sonné : l\'écharpe le touche', (await boss()).hp === P.hp - P.returnDmg - 1);
T.check('il se relève et reprend', await h.until(() => window.S3K.entities.find(e => e.isBoss).stateName === 'walk', (P.stun + 2) * 1000));

// phases : seuils de PV → 'boss:phase', renforts d'agents, volées plus fournies
await h.run(t => { const g = window.S3K, b = g.entities.find(e => e.isBoss); b.setState('stunned'); while (b.hp / b.maxHp > t) b.takeHit(1, 0, 1, 5, g.player); }, P.phases[0]);
await h.skipDialogs();
T.check('phase 1 : événement + renforts', (await h.run(() => window.__ev)).includes('phase1') &&
  await h.run(() => window.S3K.entities.filter(e => e.constructor.name === 'AgentImmo' && e.alive).length) >= 2);
await h.run(() => { for (const e of window.S3K.entities) if (e.isPrefab) e.remove(); const b = window.S3K.entities.find(e => e.isBoss); b.setState('walk'); b.cd = 0; });
await h.until(() => window.S3K.entities.find(e => e.isBoss).stateName === 'drop', 6000);
const n = await h.run(() => window.S3K.entities.filter(e => e.isPrefab).length);
T.check('phase 1 : volée plus fournie', n === P.phaseDrops[1], `${n} préfabriqués`);

// défaite → répliques → fin du niveau
await h.run(() => { const g = window.S3K, b = g.entities.find(e => e.isBoss); while (b.alive) { b.setState('stunned'); b.takeHit(1, 0, 1, 5, g.player); } });
await h.skipDialogs();
T.check('défaite : boss:defeated', (await h.run(() => window.__ev)).includes('defeated'));
await h.wait(400); await h.skipDialogs(); await h.wait(300); await h.skipDialogs();
T.check('fin du niveau 3 (écran de fin)', await h.until(() => window.S3K.mode === 'end', 5000));
await T.finish(browser);
