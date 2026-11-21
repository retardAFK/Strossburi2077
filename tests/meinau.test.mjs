// Parcours du niveau 2 (la Meinau, 2026) sans raccourci de salle : stewards du parvis, terminal du portique,
// local du kop (Arc-Drapeau + flèches-bannières, 3 cibles touchées par de vraies flèches), énigme du tifo
// (vraies flèches-bannières dans l'ordre de l'écran, une erreur d'abord), pelouse et boss, fin du niveau.
// Puis les points de passage F2 (debug) d'un bout à l'autre, sans erreur.
import { launch, checker } from './helpers.mjs';

const T = checker('meinau');
const { browser, page, h } = await launch(T, { query: 'debug=1&level=meinau&seed=1' });
const tp = (x, z, face = Math.PI / 2) => h.run(([x, z, face]) => { const p = window.S3K.player; Object.assign(p, { x, z, face, vx: 0, vz: 0 }); p.sync(); }, [x, z, face]);
const door = id => h.run(id => !window.S3K.world.doors[id].box.on, id);
const shoot = async (filter, arrow = 'simple') => {
  await h.run(([f, arrow]) => { const g = window.S3K, t = g.entities.find(e => e.alive !== false && new Function('e', 'return ' + f)(e));
    const a = g.inventory.items.arc; if (arrow !== 'simple') a.give(arrow, 1); a.arrow = arrow; g.inventory.equip('arc'); g.player.target = t; }, [filter, arrow]);
  await h.until(() => window.S3K.inventory.items.arc.ready, 3000); // recharge de l'arc (en pause pendant les dialogues)
  await h.key('KeyF'); await h.wait(300);
  await h.until(() => !window.S3K.entities.some(e => e.isPlayerShot && !e.removed && e.constructor.name === 'Arrow' && e.state !== 'stuck'), 3000); await h.wait(200);
};

await h.start(); await h.god();
T.check('départ : le parvis', (await h.state()).room.includes('PARVIS'));
T.check('bretzel donné (niveau lancé seul)', await h.run(() => window.S3K.inventory.has('boomerang')));
T.check('2 stewards-robots sur le parvis', await h.run(() => window.S3K.entities.filter(e => e.constructor.name === 'StewardRobot' && e.alive).length) === 2);
T.check('porte de la coursive fermée', !(await door('parvis')));
await h.key('F3'); await h.wait(1200);
T.check('parvis vidé → porte ouverte', await door('parvis'));

await tp(4.5, -10); await h.wait(400); await h.skipDialogs();
T.check('coursive : 2 stewards de plus', await h.run(() => window.S3K.entities.filter(e => e.constructor.name === 'StewardRobot' && e.alive).length) === 2);
await h.key('F3'); await h.wait(800);
await h.run(() => window.S3K.entities.find(e => e.isTerminal).activate()); await h.wait(300); await h.skipDialogs();
T.check('terminal → portique coupé, porte du local ouverte', await h.run(() => window.S3K.world.gates.portique.open === true) && await door('localIn'));

await tp(3, -32.5); await h.wait(400); await h.skipDialogs();
const arc = await h.run(() => { const a = window.S3K.inventory.items.arc; return a && a.ammo.banniere; });
T.check('local : Arc-Drapeau et flèches-bannières confiés', arc > 0, 'bannières : ' + arc);
await tp(2, -36.5, Math.PI);
for (const k of ['rouge', 'or', 'cyan']) await shoot(`e.group === 'tutoArc' && e.key === '${k}'`);
T.check('3 cibles touchées par de vraies flèches → tunnel ouvert', await door('local'));

await tp(7, -50); await h.wait(300); await tp(7, -58, -Math.PI / 2); await h.wait(400); await h.skipDialogs();
T.check('kop : l\'écran géant montre la séquence', await h.run(() => window.S3K.entities.some(e => e.constructor.name === 'EcranGeant' && e.seq?.length === 5)));
await tp(-1, -58.5, -Math.PI / 2);
const order = await h.run(() => window.S3K.level.layout.tifoOrder);
await shoot(`e.group === 'tifo' && e.key === ${order[1]}`, 'banniere'); await h.skipDialogs();
T.check('mauvais ordre : les bannières retombent', await h.run(() => !window.S3K.entities.some(e => e.group === 'tifo' && e.banner)));
for (const k of order) await shoot(`e.group === 'tifo' && e.key === ${k}`, 'banniere');
await h.wait(400); await h.skipDialogs();
T.check('tifo dans l\'ordre → « PAS À VENDRE » déployé', await h.run(() => window.S3K.entities.some(e => e.constructor.name === 'TifoGeant' && e.open)));
T.check('grille de la pelouse ouverte', await h.run(() => !window.S3K.collision.boxes.some(b => b.tag === 'gate' && b.on && b.z0 < -59 && b.z1 > -61)));

await tp(0, -61); await h.wait(300); await tp(0, -63); await h.wait(500); await h.skipDialogs();
T.check('pelouse : combat contre Egboehly lancé', await h.run(() => window.S3K.entities.find(e => e.isBoss)?.stateName === 'fight'));
await h.run(() => { const g = window.S3K, b = g.entities.find(e => e.isBoss); for (const x of b.heads) { x.go('idle'); x.hp = 1; x.takeHit(1); x.hook(); } });
await h.skipDialogs();
await h.run(() => { const g = window.S3K, b = g.entities.find(e => e.isBoss); while (b.alive) b.takeHit(1, 0, 1, 5, g.player); });
await h.wait(400); await h.skipDialogs();
T.check('fin du niveau atteinte', await h.until(() => window.S3K.mode === 'end', 5000));

// points de passage F2 d'un bout à l'autre
await page.reload(); await page.waitForFunction(() => window.S3K?.player, null, { timeout: 30000 });
await h.start();
const rooms = [];
for (let i = 0; i < 5; i++) { await h.warp(); await h.wait(300); rooms.push((await h.state()).room); }
T.check('F2 : toutes les salles', ['COURSIVE', 'LOCAL', 'KOP', 'PELOUSE'].every(r => rooms.some(x => x.includes(r))), rooms.join(' | '));
await T.finish(browser);
