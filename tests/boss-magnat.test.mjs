// Boss le Magnat du Carré VIP (niveau 5, graine ?seed=1) : il décolle ; en vol, tout rebondit (« VIP ONLY ») ; rafale
// de bouteilles à étincelles ; pluie de bouchons (zones au sol) ; flèche court-circuit (vraie touche F) → chute → au sol :
// une flèche y fait 1, la grosse caisse de Dylagne (vraie touche E) fait TUNING.magnat.drumDmg et l'étourdit, puis il
// redécolle ; phases (rafales plus fournies, physios en renfort) ; défaite → fin du niveau.
// Instantané des réglages : tests/snapshots/magnat.json (mise à jour volontaire : npm run test:update-snapshots).
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { launch, checker } from './helpers.mjs';
import { TUNING } from '../src/data/tuning.js';

const T = checker('boss-magnat'), P = TUNING.magnat;
const SNAP = 'tests/snapshots/magnat.json', current = JSON.stringify(P, null, 2) + '\n';
if (process.argv.includes('--update-snapshots') || process.env.UPDATE_SNAPSHOTS) {
  mkdirSync('tests/snapshots', { recursive: true }); writeFileSync(SNAP, current); console.log('instantané mis à jour :', SNAP);
}
const same = existsSync(SNAP) && JSON.stringify(JSON.parse(readFileSync(SNAP, 'utf8'))) === JSON.stringify(P);
T.check('réglages TUNING.magnat = instantané', same,
  same ? '' : existsSync(SNAP) ? 'différent : lancer npm run test:update-snapshots si c\'est voulu' : 'instantané absent');

const { browser, h } = await launch(T, { query: 'debug=1&level=kalt&seed=1' });
await h.start(); await h.skipDialogs();
for (let i = 0; i < 5; i++) await h.warp(); // jusqu'à la piste
await h.skipDialogs();
await h.run(() => { const g = window.S3K; window.__ev = []; g.events.on('boss:phase', n => window.__ev.push('phase' + n)); g.events.on('boss:defeated', () => window.__ev.push('defeated')); });
const boss = () => h.run(() => { const b = window.S3K.entities.find(e => e.isBoss); return { st: b.stateName, hp: b.hp, phase: b.phase, y: b.y }; });
const st = () => window.S3K.entities.find(e => e.isBoss).stateName;
// remet le Magnat en vol sur sa ronde, au plus près de l'entrée de la piste, dans l'état voulu (sans tirage au sort)
const force = s => h.run(([s, P]) => { const b = window.S3K.entities.find(e => e.isBoss); b.ang = Math.PI / 2;
  Object.assign(b, { x: b.home.x, z: b.home.z + P.orbit, y: P.hoverY, cd: 99 }); b.setState(s); }, [s, P]);
const place = (x, z) => h.run(([x, z]) => { const g = window.S3K, p = g.player; for (const e of g.entities) if (e.isProjectile || e.isHazard) e.remove();
  Object.assign(p, { x, z, inv: 0, hp: p.maxHp, vx: 0, vz: 0 }); p.sync(); }, [x, z]);
T.check('il décolle (combat lancé)', await h.until(() => window.S3K.entities.find(e => e.isBoss).stateName === 'hover', 4000));
T.check('en vol, au-dessus de la piste', (await boss()).y > 3);
T.check('Dylagne suit l\'Ultra', await h.run(() => window.S3K.entities.find(e => e.isDylagne).stateName === 'follow'));
await h.god();

// compte les tirs (une étincelle peut déjà avoir touché quand on regarde)
await h.run(() => { const g = window.S3K, add = g.add.bind(g); window.__n = 0; window.__z = 0;
  g.add = e => { if (e.isProjectile) window.__n++; if (e.isHazard) window.__z++; return add(e); }; });
// en vol : ça rebondit
let hp = (await boss()).hp;
await h.run(() => { const g = window.S3K; g.entities.find(e => e.isBoss).takeHit(1, 0, 1, 5, g.player); });
T.check('en vol : VIP ONLY, ça rebondit', (await boss()).hp === hp);

// bouteilles à étincelles : rafale de P.sparks[0]
await place(18, -38);
await force('sparks');
await h.until(() => window.S3K.entities.find(e => e.isBoss).stateName === 'hover', 4000);
T.check('rafale d\'étincelles', await h.run(() => window.__n) === P.sparks[0], `${await h.run(() => window.__n)} étincelles`);
// pluie de bouchons : P.rain[0] zones, dont une sur l'Ultra
await place(18, -38);
await force('rain');
T.check('pluie de bouchons : zones au sol', await h.run(() => window.__z) === P.rain[0]);
T.check('une zone sur l\'Ultra', await h.run(() => window.S3K.entities.some(e => e.isHazard && !e.removed && Math.hypot(e.x - 18, e.z + 38) < 0.1)));
await h.until(() => window.S3K.entities.find(e => e.isBoss).stateName === 'hover', 4000);

// flèche court-circuit (vraie touche F) → chute → au sol
await place(18, -38);
await force('hover');
await h.run(() => { const g = window.S3K, a = g.inventory.items.arc; a.give('court_circuit', 2); a.arrow = 'court_circuit'; g.inventory.equip('arc'); g.player.target = g.entities.find(e => e.isBoss); });
await h.until(() => window.S3K.inventory.items.arc.ready, 3000); await h.key('KeyF');
T.check('court-circuit : réacteurs coupés, il tombe', await h.until(() => ['fall', 'landed'].includes(window.S3K.entities.find(e => e.isBoss).stateName), 3000));
T.check('au sol : point faible', await h.until(() => window.S3K.entities.find(e => e.isBoss).stateName === 'landed', 3000) && (await boss()).y < 1);
// au sol : une vraie flèche fait 1
hp = (await boss()).hp;
await h.run(() => { const g = window.S3K; g.inventory.items.arc.arrow = 'simple'; Object.assign(g.player, { x: 20, z: -33 }); g.player.target = g.entities.find(e => e.isBoss); });
await h.until(() => window.S3K.inventory.items.arc.ready, 3000); await h.key('KeyF');
await h.wait(800);
T.check('au sol : la flèche le touche', await h.run(hp => window.S3K.entities.find(e => e.isBoss).hp === hp - 1, hp));
// grosse caisse de Dylagne (vraie touche E)
await h.run(() => { const b = window.S3K.entities.find(e => e.isBoss); b.setState('landed'); });
hp = (await boss()).hp;
await h.key('KeyE');
T.check('grosse caisse → Magnat sonné', await h.until(() => window.S3K.entities.find(e => e.isBoss).stateName === 'stunned', 3000));
T.check('grosse caisse → gros dégâts', (await boss()).hp === hp - P.drumDmg);
await h.skipDialogs(); // seuil de phase franchi : réplique du Magnat
T.check('il redécolle', await h.until(() => window.S3K.entities.find(e => e.isBoss).stateName === 'hover', (P.stun + P.riseTime + 3) * 1000));

// phases : seuils de PV → 'boss:phase', renforts, rafales plus fournies
await h.run(t => { const g = window.S3K, b = g.entities.find(e => e.isBoss); b.setState('stunned'); while (b.hp / b.maxHp > t) b.takeHit(1, 0, 1, 5, g.player); }, P.phases[1]);
await h.skipDialogs(); await h.wait(300); await h.skipDialogs();
T.check('phase : événement + physios en renfort', (await h.run(() => window.__ev)).some(e => e.startsWith('phase')) &&
  await h.run(() => window.S3K.entities.filter(e => e.constructor.name === 'Physio' && e.alive && /^renforts/.test(e.group)).length) >= 2);
const ph = (await boss()).phase;
await place(18, -38);
await h.run(() => { window.__n = 0; });
await force('sparks');
await h.until(() => window.S3K.entities.find(e => e.isBoss).stateName === 'hover', 4000);
const n = await h.run(() => window.__n);
T.check('phase : rafale plus fournie', n === P.sparks[ph] && n > P.sparks[0], `${n} étincelles (phase ${ph})`);

// défaite → répliques → fin du niveau
await h.run(() => { const g = window.S3K, b = g.entities.find(e => e.isBoss); while (b.alive) { b.setState('stunned'); b.takeHit(1, 0, 1, 5, g.player); } });
await h.skipDialogs();
T.check('défaite : boss:defeated', (await h.run(() => window.__ev)).includes('defeated'));
await h.wait(400); await h.skipDialogs(); await h.wait(300); await h.skipDialogs();
T.check('fin du niveau 5 (écran de fin)', await h.until(() => window.S3K.mode === 'end', 5000));
await T.finish(browser);
