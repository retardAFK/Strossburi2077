// Boss Marco CeKlair (niveau 6, graine ?seed=1) : hors point faible tout rebondit ; charge de l'attelage (blesse au
// contact) ; encastré dans un mur → sonné (point faible) : une flèche y fait 1, piqué de Stork et grosse caisse de
// Dylagne (vraie touche E) font leurs dégâts ; cadeaux piégés (zones au sol) ; phases (plus de cadeaux, renforts) ;
// défaite → faux final → glitch → fin de la partie 1.
// Instantané des réglages : tests/snapshots/marco.json (mise à jour volontaire : npm run test:update-snapshots).
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { launch, checker } from './helpers.mjs';
import { TUNING } from '../src/data/tuning.js';

const T = checker('boss-marco'), P = TUNING.marco;
const SNAP = 'tests/snapshots/marco.json', current = JSON.stringify(P, null, 2) + '\n';
if (process.argv.includes('--update-snapshots') || process.env.UPDATE_SNAPSHOTS) {
  mkdirSync('tests/snapshots', { recursive: true }); writeFileSync(SNAP, current); console.log('instantané mis à jour :', SNAP);
}
const same = existsSync(SNAP) && JSON.stringify(JSON.parse(readFileSync(SNAP, 'utf8'))) === JSON.stringify(P);
T.check('réglages TUNING.marco = instantané', same,
  same ? '' : existsSync(SNAP) ? 'différent : lancer npm run test:update-snapshots si c\'est voulu' : 'instantané absent');

const { browser, h } = await launch(T, { query: 'debug=1&level=kleber&seed=1' });
await h.start(); await h.skipDialogs();
for (let i = 0; i < 4; i++) await h.warp(); // jusqu'à l'estrade
await h.skipDialogs();
await h.run(() => { const g = window.S3K; window.__ev = []; for (const n of ['boss:phase', 'boss:defeated', 'marco:dazed', 'stork:dive', 'dylagne:drum'])
  g.events.on(n, () => window.__ev.push(n)); });
const ev = n => h.run(n => window.__ev.filter(e => e === n).length, n);
const boss = () => h.run(() => { const b = window.S3K.entities.find(e => e.isBoss); return { st: b.stateName, hp: b.hp, phase: b.phase }; });
// place Marco au fond de l'estrade, tourné vers l'entrée (+z), dans l'état voulu
const force = (s, face = -Math.PI / 2, z = -110) => h.run(([s, face, z]) => { const b = window.S3K.entities.find(e => e.isBoss);
  Object.assign(b, { x: 0, z, face, cd: 99 }); b.setState(s); }, [s, face, z]);
const place = (x, z) => h.run(([x, z]) => { const g = window.S3K, p = g.player; for (const e of g.entities) if (e.isHazard || e.isGift) e.remove();
  Object.assign(p, { x, z, inv: 0, hp: p.maxHp, vx: 0, vz: 0 }); p.sync(); }, [x, z]);
T.check('combat lancé : il attend, slogan en boucle', await h.until(() => window.S3K.entities.find(e => e.isBoss).stateName !== 'intro', 3000));

// hors point faible : ça rebondit
let hp = (await boss()).hp;
await force('idle');
await h.run(() => { const g = window.S3K; g.entities.find(e => e.isBoss).takeHit(1, 0, 1, 5, g.player); });
T.check('hors point faible : ça rebondit', (await boss()).hp === hp);

// charge : l'attelage blesse au contact
await place(0, -100);
await force('charge');
T.check('charge : l\'attelage blesse l\'Ultra', await h.until(() => window.S3K.player.hp < window.S3K.player.maxHp, 3000));
await h.god();
// la charge finit dans le mur du fond : encastré
await force('charge', Math.PI / 2, -108);
T.check('il s\'encastre : sonné (marco:dazed)', await h.until(() => window.S3K.entities.find(e => e.isBoss).stateName === 'crash', 3000) && await ev('marco:dazed') >= 1);
// sonné : une vraie flèche fait 1
hp = (await boss()).hp;
await place(0, -100);
await h.run(() => { const g = window.S3K, a = g.inventory.items.arc; a.arrow = 'simple'; g.inventory.equip('arc'); g.player.target = g.entities.find(e => e.isBoss); });
await h.until(() => window.S3K.inventory.items.arc.ready, 3000); await h.key('KeyF');
await h.wait(800);
T.check('sonné : la flèche le touche', await h.run(hp => window.S3K.entities.find(e => e.isBoss).hp === hp - 1, hp));
// compagnons (vraie touche E) : le plus proche agit, puis l'autre
await h.run(() => { const b = window.S3K.entities.find(e => e.isBoss); b.setState('crash'); });
hp = (await boss()).hp;
await h.key('KeyE');
T.check('{use} : un compagnon frappe, Marco sonné', await h.until(() => window.S3K.entities.find(e => e.isBoss).stateName === 'stunned', 4000));
const one = await ev('stork:dive') ? P.storkDmg : P.drumDmg;
T.check('dégâts du compagnon', (await boss()).hp === hp - one, `${hp} → ${(await boss()).hp}`);
await h.skipDialogs();
hp = (await boss()).hp;
await h.wait(300); await h.key('KeyE');
await h.until(() => window.__ev.includes('stork:dive') && window.__ev.includes('dylagne:drum'), 3000);
await h.wait(1500); await h.skipDialogs();
const both = { ev: await h.run(() => window.__ev), boss: await boss() };
T.check('{use} encore : l\'autre compagnon frappe aussi', await ev('stork:dive') === 1 && await ev('dylagne:drum') === 1 && both.boss.hp < hp,
  JSON.stringify({ hp0: hp, ...both }));

// cadeaux piégés : P.gifts[phase] zones
await h.run(() => { const g = window.S3K, add = g.add.bind(g); window.__z = 0; g.add = e => { if (e.isHazard) window.__z++; return add(e); }; });
await place(0, -98);
const ph = (await boss()).phase;
await force('gifts');
await h.until(() => window.S3K.entities.find(e => e.isBoss).stateName === 'idle', 5000);
T.check('cadeaux piégés : une zone par cadeau', await h.run(() => window.__z) === P.gifts[ph], `${await h.run(() => window.__z)} zones (phase ${ph})`);

// phases : seuils de PV → 'boss:phase', renforts, plus de cadeaux
await h.run(t => { const g = window.S3K, b = g.entities.find(e => e.isBoss); b.setState('stunned'); while (b.hp / b.maxHp > t) b.takeHit(1, 0, 1, 5, g.player); }, P.phases[1]);
await h.skipDialogs(); await h.wait(300); await h.skipDialogs();
T.check('phase : événement + renforts', await ev('boss:phase') >= 1 &&
  await h.run(() => window.S3K.entities.filter(e => /^renforts/.test(e.group || '') && e.alive).length >= 2));
await place(0, -98); await h.run(() => { window.__z = 0; });
const ph2 = (await boss()).phase;
await force('gifts');
await h.until(() => window.S3K.entities.find(e => e.isBoss).stateName === 'idle', 5000);
const n = await h.run(() => window.__z);
T.check('phase : plus de cadeaux', n === P.gifts[ph2] && n > P.gifts[0], `${n} (phase ${ph2})`);

// défaite → faux final → glitch → fin
await h.run(() => { const g = window.S3K, b = g.entities.find(e => e.isBoss); while (b.alive) { b.setState('stunned'); b.takeHit(1, 0, 1, 5, g.player); } });
T.check('défaite : boss:defeated', await ev('boss:defeated') === 1);
for (let i = 0; i < 14 && !(await h.run(() => window.S3K.mode === 'end')); i++) { await h.wait(1000); await h.skipDialogs(); }
T.check('fin de la partie 1 (écran de fin)', await h.run(() => window.S3K.mode === 'end'));
await T.finish(browser);
