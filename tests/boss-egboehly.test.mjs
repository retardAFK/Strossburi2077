// Boss Egboehly (niveau 2, graine ?seed=1) : 5 têtes d'hydre qui mordent et crachent des contrats, pilote
// intouchable tant que la loge est fermée, tête assommée qui repousse, flèche-bannière (vraie flèche tirée) plantée
// dans une tête à terre → définitive, 5 têtes plantées → pilote exposé (phase 1), étourdi à chaque coup, défaite.
// Instantané des réglages : tests/snapshots/egboehly.json (mise à jour volontaire : npm run test:update-snapshots).
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { launch, checker } from './helpers.mjs';
import { TUNING } from '../src/data/tuning.js';

const T = checker('boss-egboehly'), E = TUNING.egboehly;
const SNAP = 'tests/snapshots/egboehly.json', current = JSON.stringify(E, null, 2) + '\n';
if (process.argv.includes('--update-snapshots') || process.env.UPDATE_SNAPSHOTS) {
  mkdirSync('tests/snapshots', { recursive: true }); writeFileSync(SNAP, current); console.log('instantané mis à jour :', SNAP);
}
const same = existsSync(SNAP) && JSON.stringify(JSON.parse(readFileSync(SNAP, 'utf8'))) === JSON.stringify(E);
T.check('réglages TUNING.egboehly = instantané', same,
  same ? '' : existsSync(SNAP) ? 'différent : lancer npm run test:update-snapshots si c\'est voulu' : 'instantané absent');

const { browser, h } = await launch(T, { query: 'debug=1&level=meinau&seed=1' });
await h.start();
for (let i = 0; i < 5; i++) await h.warp(); // jusqu'à la pelouse
await h.skipDialogs(); await h.god();
await h.run(() => { const g = window.S3K; window.__ev = []; window.__heads = [];
  g.events.on('boss:phase', n => window.__ev.push('phase' + n)); g.events.on('boss:defeated', () => window.__ev.push('defeated'));
  g.events.on('egboehly:head', (i, s) => window.__heads.push(i + s)); });
const boss = () => h.run(() => { const b = window.S3K.entities.find(e => e.isBoss); return { st: b.stateName, hp: b.hp, exposed: b.exposed,
  heads: b.heads.map(x => x.state).join(','), planted: b.planted }; });

let b = await boss();
T.check('Egboehly en jeu avec 5 têtes', b.heads.split(',').length === 5, b.heads);
T.check('après les répliques : combat lancé', b.st === 'fight', b.st);
T.check('une tête télégraphie puis mord', await h.until(() => window.S3K.entities.find(e => e.isBoss).heads.some(x => x.state === 'aim' || x.state === 'bite'), 8000));
T.check('les têtes crachent des contrats', await h.until(() => window.S3K.entities.some(e => e.isProjectile && e.alive), 8000));

// loge fermée : le pilote est intouchable
const hp0 = b.hp;
await h.run(() => { const g = window.S3K, b = g.entities.find(e => e.isBoss); b.takeHit(3, 0, 1, 5, g.player); });
T.check('loge fermée : pilote intouchable', (await boss()).hp === hp0);

// une tête assommée repousse si on n'y plante rien
await h.run(() => { const b = window.S3K.entities.find(e => e.isBoss), x = b.heads[0]; x.go('idle'); for (let i = 0; i < 5; i++) x.takeHit(1); });
T.check('tête assommée : à terre', (await boss()).heads.split(',')[0] === 'down');
await h.run(() => { window.S3K.entities.find(e => e.isBoss).heads[0].st = 99; });
T.check('tête non plantée : elle repousse', await h.until(() => window.S3K.entities.find(e => e.isBoss).heads[0].state === 'idle', 3000));

// vraie flèche-bannière tirée sur une tête à terre → plantée
await h.run(() => { const g = window.S3K, b = g.entities.find(e => e.isBoss), x = b.heads[2]; b.setState('intro'); x.go('idle'); x.hp = 1; x.takeHit(1);
  const p = g.player; const a = g.inventory.items.arc; a.give('banniere', 1); a.arrow = 'banniere'; g.inventory.equip('arc');
  Object.assign(p, { x: x.x + 3, z: x.z + 3, face: Math.atan2(-(x.z - p.z), x.x - p.x) }); p.sync(); p.target = x; });
await h.key('KeyF');
T.check('flèche-bannière tirée → tête plantée', await h.until(() => window.S3K.entities.find(e => e.isBoss).heads[2].state === 'planted', 3000), (await boss()).heads);
await h.run(() => { window.S3K.entities.find(e => e.isBoss).heads[2].st = 99; });
await h.wait(300);
T.check('tête plantée : ne repousse plus', (await boss()).heads.split(',')[2] === 'planted');

// les 4 autres : assommées puis plantées → loge ouverte
await h.run(() => { const b = window.S3K.entities.find(e => e.isBoss);
  for (const x of b.heads) if (x.state !== 'planted') { x.go('idle'); x.hp = 1; x.takeHit(1); x.hook(); } b.setState('fight'); });
b = await boss();
T.check('5 têtes plantées → pilote exposé (phase 1)', b.exposed && (await h.run(() => window.__ev)).includes('phase1'), JSON.stringify(b));
T.check('événements des têtes', (await h.run(() => window.__heads)).filter(s => /planted/.test(s)).length === 5);

await h.skipDialogs(); // réplique du pilote exposé
// pilote exposé : prend les coups, étourdi à chaque coup
await h.run(() => { const g = window.S3K, b = g.entities.find(e => e.isBoss); b.takeHit(1, 0, 1, 5, g.player); });
b = await boss();
T.check('pilote touché : dégâts + étourdi', b.hp === hp0 - 1 && b.st === 'stunned', JSON.stringify(b));
T.check('étourdi : il reprend le combat', await h.until(() => window.S3K.entities.find(e => e.isBoss).stateName === 'fight', (E.pilotStun + 2) * 1000));

// défaite → répliques → fin du niveau
await h.run(() => { const g = window.S3K, b = g.entities.find(e => e.isBoss); while (b.alive) b.takeHit(1, 0, 1, 5, g.player); });
T.check('défaite : boss:defeated', (await h.run(() => window.__ev)).includes('defeated'));
await h.wait(500); await h.skipDialogs();
T.check('fin du niveau 2 (écran de fin)', await h.until(() => window.S3K.mode === 'end', 5000));

await T.finish(browser);
