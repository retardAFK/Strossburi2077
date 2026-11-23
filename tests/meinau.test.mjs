// Parcours du niveau 3 (la Meinau, intérieur du stade, maquette grise) avec de vraies flèches et les vraies touches :
// entrée A (coursive sud), stewards en ronde, buvetier (indice), local du kop (Arc-Drapeau, 3 cibles), kop (tifo :
// une erreur, puis le bon ordre), accès pelouse 1/2 puis terminal (E) → tunnel ouvert, verrous Arc-Drapeau des loges
// et des sous-sols, écharpe des vestiaires (derrière les casiers), pelouse et boss, fin du niveau. Puis F2 partout.
import { launch, checker } from './helpers.mjs';

const T = checker('meinau');
const { browser, page, h } = await launch(T, { query: 'debug=1&level=meinau&seed=1' });
const tp = (x, z, face = Math.PI / 2) => h.run(([x, z, face]) => { const p = window.S3K.player; Object.assign(p, { x, z, face, vx: 0, vz: 0, target: null }); p.sync(); }, [x, z, face]);
const door = id => h.run(id => !window.S3K.world.doors[id].box.on, id);
const shoot = async (filter, arrow = 'simple') => {
  await h.run(([f, arrow]) => { const g = window.S3K, t = g.entities.find(e => e.alive !== false && new Function('e', 'return ' + f)(e));
    const a = g.inventory.items.arc; if (arrow !== 'simple') a.give(arrow, 1); a.arrow = arrow; g.inventory.equip('arc'); g.player.target = t; }, [filter, arrow]);
  await h.until(() => window.S3K.inventory.items.arc.ready, 3000);
  await h.key('KeyF'); await h.wait(300);
  await h.until(() => !window.S3K.entities.some(e => e.isArrow && !e.removed && e.state !== 'stuck'), 3000); await h.wait(200);
};

await h.start(); await h.god(); await h.skipDialogs();
const p0 = await h.state();
T.check('départ : entrée A, coursive sud', p0.room.includes('COURSIVE') && Math.abs(p0.z - 28) < 1, `${p0.x}, ${p0.z}`);
T.check('4 stewards-robots en ronde dans la coursive', await h.run(() => window.S3K.entities.filter(e => e.group === 'coursive' && e.alive).length) === 4);
await h.key('F3'); await h.wait(1200);
await tp(-21.6, 27.6, Math.PI / 2); await h.wait(200); await h.key('KeyE'); await h.wait(300);
T.check('buvetier (E) : un indice', await h.run(() => window.S3K.dialog.active)); await h.skipDialogs();

// le local du kop
await tp(-23, -26, -Math.PI / 2); await h.wait(200); await tp(-23, -21, -Math.PI / 2); await h.wait(400); await h.skipDialogs();
T.check('local du kop : Arc-Drapeau et flèches-bannières confiés', await h.run(() => window.S3K.inventory.items.arc?.ammo.banniere > 0));
T.check('porte du kop fermée avant le tuto', !(await door('local')));
await tp(-22, -20.6, Math.PI);
for (const k of ['rouge', 'or', 'cyan']) await shoot(`e.group === 'tutoArc' && e.key === '${k}'`);
T.check('3 cibles touchées par de vraies flèches → porte du kop ouverte', await door('local'));

// le kop : tifo
await tp(-25, -15.5, 0); await h.wait(400); await h.skipDialogs();
T.check('kop (tribune ouest) : l\'écran géant montre la séquence', (await h.state()).room.includes('KOP') &&
  await h.run(() => window.S3K.entities.some(e => e.constructor.name === 'EcranGeant' && e.seq?.length === 5)));
await tp(-24, 0, 0);
const order = await h.run(() => window.S3K.level.layout.tifoOrder);
await shoot(`e.group === 'tifo' && e.key === ${order[1]}`, 'banniere'); await h.skipDialogs();
T.check('mauvais ordre : les bannières retombent', await h.run(() => !window.S3K.entities.some(e => e.group === 'tifo' && e.banner)));
for (const k of order) await shoot(`e.group === 'tifo' && e.key === ${k}`, 'banniere');
await h.wait(400); await h.skipDialogs();
T.check('tifo dans l\'ordre → « PAS À VENDRE » déployé', await h.run(() => window.S3K.entities.some(e => e.constructor.name === 'TifoGeant' && e.open)));
T.check('accès pelouse : le tifo seul ne suffit pas', await h.run(() => !window.S3K.world.gates.pelouse.open));

// verrous Arc-Drapeau (loges, sous-sols) et écharpe des vestiaires
await tp(-33, 15.6, Math.PI);
await shoot("e.group === 'verrouLoges'");
T.check('verrou des loges VIP (flèche) → porte ouverte', await door('loges'));
await tp(33, 19.6, 0);
await shoot("e.group === 'verrouSoussols'");
T.check('verrou des sous-sols (flèche) → porte ouverte', await door('soussols'));
await h.run(() => { window.__ech = []; window.S3K.events.on('echarpe:trouvee', id => window.__ech.push(id)); });
await tp(39, -14, 0); await h.wait(200); await tp(43.3, -5, Math.PI / 2); await h.wait(200); await tp(43.3, -14.5, Math.PI / 2); await h.wait(300);
T.check('vestiaires : écharpe derrière les casiers (marqueur)', await h.run(() => window.__ech.includes('interieur-vestiaires')));

// le terminal de la coursive est (vraie touche E) → tunnel de la pelouse ouvert
await tp(33.6, 1.2, 0); await h.wait(200); await h.key('KeyE'); await h.wait(400);
T.check('terminal (E) + tifo → herse du tunnel levée', await h.run(() => window.S3K.world.gates.pelouse.open));

// la pelouse
await tp(0, 20); await h.wait(300); await tp(0, 14.5); await h.wait(500); await h.skipDialogs();
T.check('pelouse : combat contre Egboehly lancé', await h.until(() => window.S3K.entities.find(e => e.isBoss)?.stateName === 'fight', 3000));
await h.run(() => { const g = window.S3K, b = g.entities.find(e => e.isBoss); for (const x of b.heads) { x.go('idle'); x.hp = 1; x.takeHit(1); x.hook(); } });
await h.skipDialogs();
await h.run(() => { const g = window.S3K, b = g.entities.find(e => e.isBoss); while (b.alive) b.takeHit(1, 0, 1, 5, g.player); });
await h.wait(400); await h.skipDialogs();
T.check('fin du niveau atteinte', await h.until(() => window.S3K.mode === 'end', 5000));
await h.run(() => localStorage.removeItem('s3k.save'));

// points de passage F2 d'un bout à l'autre
await page.reload(); await page.waitForFunction(() => window.S3K?.player, null, { timeout: 30000 });
await h.start();
const rooms = [];
for (let i = 0; i < 5; i++) { await h.warp(); await h.wait(300); rooms.push((await h.state()).room); }
T.check('F2 : coursive, local, kop, pelouse', ['COURSIVE', 'LOCAL', 'KOP', 'PELOUSE'].every(r => rooms.some(x => x.includes(r))), rooms.join(' | '));
await T.finish(browser);
