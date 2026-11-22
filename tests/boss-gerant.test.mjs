// Boss le Gérant de nuit BlingCo (niveau 4, graine ?seed=1) : garde (ça rebondit hors tiroir ouvert), rafale
// d'étiquettes x10 (une étiquette reçue ralentit l'Ultra), scanner qui blesse à découvert mais pas derrière une palette, « encaisse » → tiroir ouvert :
// une vraie flèche y fait 1, le piqué de Stork (vraie touche E) fait TUNING.gerant.storkDmg et l'étourdit ; phases
// (rafales plus fournies, renforts de chariots) ; défaite → fin du niveau.
// Instantané des réglages : tests/snapshots/gerant.json (mise à jour volontaire : npm run test:update-snapshots).
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { launch, checker } from './helpers.mjs';
import { TUNING } from '../src/data/tuning.js';

const T = checker('boss-gerant'), P = TUNING.gerant;
const SNAP = 'tests/snapshots/gerant.json', current = JSON.stringify(P, null, 2) + '\n';
if (process.argv.includes('--update-snapshots') || process.env.UPDATE_SNAPSHOTS) {
  mkdirSync('tests/snapshots', { recursive: true }); writeFileSync(SNAP, current); console.log('instantané mis à jour :', SNAP);
}
const same = existsSync(SNAP) && JSON.stringify(JSON.parse(readFileSync(SNAP, 'utf8'))) === JSON.stringify(P);
T.check('réglages TUNING.gerant = instantané', same,
  same ? '' : existsSync(SNAP) ? 'différent : lancer npm run test:update-snapshots si c\'est voulu' : 'instantané absent');

const { browser, h } = await launch(T, { query: 'debug=1&level=marche2000&seed=1' });
await h.start();
for (let i = 0; i < 5; i++) await h.warp(); // jusqu'au magasin
await h.skipDialogs();
await h.run(() => { const g = window.S3K; window.__ev = []; g.events.on('boss:phase', n => window.__ev.push('phase' + n)); g.events.on('boss:defeated', () => window.__ev.push('defeated')); });
const boss = () => h.run(() => { const b = window.S3K.entities.find(e => e.isBoss); return { st: b.stateName, hp: b.hp, phase: b.phase }; });
// remet le Gérant au milieu de son comptoir dans l'état voulu (sans attendre son tirage au sort)
const force = st => h.run(st => { const b = window.S3K.entities.find(e => e.isBoss); Object.assign(b, { x: 0, cd: 99 }); b.face = -Math.PI / 2; b.setState(st); }, st);
T.check('le Gérant glisse derrière son comptoir (combat lancé)', (await boss()).st === 'glide');
T.check('Stork suit l\'Ultra', await h.run(() => window.S3K.entities.find(e => e.isStork).stateName === 'follow'));

// compte les étiquettes tirées (elles peuvent déjà avoir touché un mur quand on regarde)
await h.run(() => { const g = window.S3K, add = g.add.bind(g); window.__n = 0; g.add = e => { if (e.isProjectile) window.__n++; return add(e); }; });
// garde
let hp = (await boss()).hp;
await h.run(() => { const g = window.S3K; g.entities.find(e => e.isBoss).takeHit(1, 0, 1, 5, g.player); });
T.check('tiroir fermé : ça rebondit', (await boss()).hp === hp);

// étiqueteuse : rafale de P.labels[0] étiquettes
await h.run(() => { const p = window.S3K.player; Object.assign(p, { x: 6, z: -110 }); p.sync(); });
await force('label');
await h.until(() => window.S3K.entities.find(e => e.isBoss).stateName === 'glide', 4000);
const labels = await h.run(() => window.S3K.entities.filter(e => e.isProjectile && !e.removed).length);
T.check('rafale d\'étiquettes x10', labels > 0 && labels <= P.labels[0], `${labels} étiquettes`);
// une étiquette reçue ralentit l'Ultra
await h.run(() => { const g = window.S3K, p = g.player; for (const e of g.entities) if (e.isProjectile) e.remove();
  Object.assign(p, { x: 3, z: -112, inv: 0, hp: p.maxHp, slowT: 0 }); p.sync(); });
await force('label');
T.check('étiquette reçue : l\'Ultra est ralenti', await h.until(() => window.S3K.player.slowT > 0, 4000) &&
  await h.run(k => window.S3K.player.slowK === k, P.labelSlow));
await h.until(() => window.S3K.entities.find(e => e.isBoss).stateName === 'glide', 4000);

// scanner : blesse à découvert, pas derrière une palette
const scan = async (x, z) => {
  await h.run(([x, z]) => { const g = window.S3K, p = g.player; for (const e of g.entities) if (e.isProjectile) e.remove();
    Object.assign(p, { x, z, inv: 0, hp: p.maxHp }); p.sync(); window.__hp0 = p.hp; }, [x, z]);
  await force('scan');
  await h.until(() => window.S3K.entities.find(e => e.isBoss).stateName !== 'scan', 6000);
  return h.run(() => window.S3K.player.hp < window.__hp0);
};
T.check('scanner : derrière une palette, rien', await scan(0, -116) === false);
T.check('scanner : à découvert, touché', await scan(3, -112) === true);
await h.god();
T.check('après le scan, il encaisse : tiroir ouvert', (await boss()).st === 'open');

// tiroir ouvert : une vraie flèche fait 1
hp = (await boss()).hp;
await h.run(() => { const g = window.S3K; Object.assign(g.player, { x: 2, z: -112 }); g.inventory.equip('arc'); g.inventory.items.arc.arrow = 'simple'; g.player.target = g.entities.find(e => e.isBoss); });
await h.until(() => window.S3K.inventory.items.arc.ready, 3000); await h.key('KeyF');
await h.wait(800);
T.check('tiroir ouvert : la flèche le touche', await h.run(hp => window.S3K.entities.find(e => e.isBoss).hp === hp - 1, hp));

// piqué de Stork (vraie touche E)
await force('open'); hp = (await boss()).hp;
await h.key('KeyE');
T.check('piqué de Stork → Gérant sonné', await h.until(() => window.S3K.entities.find(e => e.isBoss).stateName === 'stunned', 4000));
T.check('piqué de Stork → gros dégâts', (await boss()).hp === hp - P.storkDmg);
await h.skipDialogs(); // seuil de phase franchi : réplique du Gérant
T.check('il se relève et reprend', await h.until(() => window.S3K.entities.find(e => e.isBoss).stateName === 'glide', (P.stun + 2) * 1000));

// phases : seuils de PV → 'boss:phase', renforts, rafales plus fournies
await h.run(t => { const g = window.S3K, b = g.entities.find(e => e.isBoss); b.setState('stunned'); while (b.hp / b.maxHp > t) b.takeHit(1, 0, 1, 5, g.player); }, P.phases[0]);
await h.skipDialogs();
T.check('phase : événement + renforts de chariots', (await h.run(() => window.__ev)).some(e => e.startsWith('phase')) &&
  await h.run(() => window.S3K.entities.filter(e => e.constructor.name === 'ChariotRobot' && e.alive).length) >= 2);
const ph = (await boss()).phase;
await h.run(() => { for (const e of window.S3K.entities) if (e.isProjectile) e.remove(); window.__n = 0; });
await force('label');
await h.until(() => window.S3K.entities.find(e => e.isBoss).stateName === 'glide', 4000);
const n = await h.run(() => window.__n);
T.check('phase : rafale plus fournie', n === P.labels[ph] && n > P.labels[0], `${n} étiquettes (phase ${ph})`);

// défaite → répliques → fin du niveau
await h.run(() => { const g = window.S3K, b = g.entities.find(e => e.isBoss); while (b.alive) { b.setState('stunned'); b.takeHit(1, 0, 1, 5, g.player); } });
await h.skipDialogs();
T.check('défaite : boss:defeated', (await h.run(() => window.__ev)).includes('defeated'));
await h.wait(400); await h.skipDialogs(); await h.wait(300); await h.skipDialogs();
T.check('fin du niveau 4 (écran de fin)', await h.until(() => window.S3K.mode === 'end', 5000));
await T.finish(browser);
