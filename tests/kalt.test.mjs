// Parcours du niveau 7 (le Kalt, l'intérieur, la nuit, maquette grise), avec les vraies touches : le Main (portiques
// ouverts seulement sur les basses, physios visibles aux flashs), l'escalier vers l'étage (Mezza : écharpe derrière la
// cabine DJ, régie lumière coupée à la flèche court-circuit → porte de la cave ; artspace : l'artiste), l'escalier du
// retour, la cave (Dylagne libéré, il tient le rythme ; écharpe derrière les fûts tirés au grappin), le rideau du
// Carré VIP (grosse caisse, E), le boss (court-circuit → au sol → grosse caisse), fin du niveau. Puis F2 partout.
import { launch, checker } from './helpers.mjs';

const T = checker('kalt');
const { browser, page, h } = await launch(T, { query: 'debug=1&level=kalt&seed=1' });
const tp = (x, z, face = Math.PI / 2) => h.run(([x, z, face]) => { const p = window.S3K.player; Object.assign(p, { x, z, face, vx: 0, vz: 0, target: null }); p.sync(); }, [x, z, face]);
const aim = (filter, item, arrow) => h.run(([f, item, arrow]) => { const g = window.S3K, t = g.entities.find(e => e.alive !== false && new Function('e', 'return ' + f)(e));
  g.inventory.equip(item);
  if (arrow) { const a = g.inventory.items.arc; if (arrow !== 'simple' && !a.ammo[arrow]) a.give(arrow, 1); a.arrow = arrow; }
  g.player.target = t; return !!t; }, [filter, item, arrow]);
const shoot = async (filter, arrow = 'simple') => {
  await aim(filter, 'arc', arrow);
  await h.until(() => window.S3K.inventory.items.arc.ready, 3000);
  await h.key('KeyF'); await h.wait(300);
  await h.until(() => !window.S3K.entities.some(e => e.isArrow && !e.removed && e.state !== 'stuck'), 3000); await h.wait(200);
};
const count = (name, group) => h.run(([n, g]) => window.S3K.entities.filter(e => e.constructor.name === n && e.alive && (!g || e.group === g)).length, [name, group]);

await h.start(); await h.god(); await h.skipDialogs();
await h.run(() => { window.__ech = []; window.S3K.events.on('echarpe:trouvee', id => window.__ech.push(id)); });
T.check('départ : le Main (entrée par la cour)', (await h.state()).room.includes('MAIN'));
T.check('le Main : 3 physios dans le noir', await count('Physio', 'salle') === 3 && await h.run(() => window.S3K.entities.filter(e => e.group === 'salle').every(e => e.dark)));
const seen = await h.run(() => new Promise(res => {
  const g = window.S3K, ph = g.entities.find(e => e.group === 'salle' && e.alive), r = { open: 0, closed: 0, vis: 0, hid: 0 };
  const t = setInterval(() => { g.world.lasers.basse1.on ? r.closed++ : r.open++; ph.obj.visible ? r.vis++ : r.hid++; }, 30);
  setTimeout(() => { clearInterval(t); res(r); }, 4500);
}));
T.check('portiques : ouverts sur les basses, fermés sinon', seen.open > 5 && seen.closed > 5, JSON.stringify(seen));
T.check('physio : visible aux flashs, invisible entre deux', seen.vis > 0 && seen.hid > 0);
await h.run(() => { for (const e of window.S3K.entities) if (e.group === 'salle') e.takeHit(99, 0, 1, 5, null); });
T.check('porte de la cave fermée', await h.run(() => window.S3K.world.doors.cave.box.on));

// l'escalier → l'étage
await tp(-14, -48); await h.wait(300); await h.skipDialogs();
T.check('escalier : l\'étage, la Mezza', (await h.state()).room.includes('MEZZA'));
await tp(1.2, -91.4); await h.wait(100); await tp(1.2, -94.6); await h.wait(100); await tp(-4, -93.6); await h.wait(300);
T.check('Mezza : écharpe derrière la cabine DJ (marqueur)', await h.run(() => window.__ech.includes('kalt-mezza')));
await tp(3, -86, Math.PI / 2);
await shoot("e.id === 'regie'", 'court_circuit'); await h.skipDialogs();
T.check('régie lumière court-circuitée → porte de la cave ouverte', await h.run(() => !window.S3K.world.doors.cave.box.on));
await tp(16, -86, 0); await h.wait(300); await h.key('KeyE'); await h.wait(300);
T.check('artspace : l\'artiste (E) donne un indice', (await h.state()).room.includes('ARTSPACE') && await h.run(() => window.S3K.dialog.active));
await h.skipDialogs();
await tp(-14, -70); await h.wait(300);
T.check('escalier : retour au rez-de-chaussée', (await h.state()).room.includes('MAIN'));

// la cave : Dylagne
await tp(-18, -30, Math.PI); await h.wait(300); await h.skipDialogs(); await h.wait(300);
T.check('la cave : physios et robots-cordons', (await h.state()).room.includes('CAVE') && await count('Physio', 'cave') === 2 && await count('RobotCordon', 'cave') === 2);
await h.key('F3'); await h.wait(1200); await h.skipDialogs();
T.check('cave libérée : Dylagne suit l\'Ultra, il tient le rythme', await h.run(() => window.S3K.entities.find(e => e.isDylagne).stateName === 'follow' && !window.S3K.world.lasers.basse1.on));
await tp(-33, -42.6, Math.PI);
for (let i = 0; i < 4 && await h.run(() => window.S3K.entities.find(e => e.id === 'futs').x < -35); i++) {
  await aim("e.id === 'futs'", 'gaffe'); await h.key('KeyF'); await h.wait(1500); await h.skipDialogs();
}
await tp(-37.6, -42.6, Math.PI); await h.wait(100); await tp(-38.6, -42.6, Math.PI); await h.wait(300);
T.check('cave : écharpe derrière les fûts tirés au grappin', await h.run(() => window.__ech.includes('kalt-cave')));

// le rideau du Carré VIP : grosse caisse (E)
await tp(13.5, -30, 0); await h.wait(400); await h.key('KeyE'); await h.wait(300);
T.check('grosse caisse de Dylagne (E) : le rideau du Carré VIP tombe', await h.run(() => !window.S3K.world.doors.piste.box.on));

// le Carré VIP : le Magnat
await tp(18.5, -30, 0); await h.wait(300); await h.skipDialogs();
T.check('Carré VIP : combat contre le Magnat lancé', await h.until(() => window.S3K.entities.find(e => e.isBoss).stateName === 'hover', 5000));
await tp(19, -40, 0);
// (on le remet au point de sa ronde le plus proche, sans tirage au sort, pour un tir stable)
await h.run(() => { const b = window.S3K.entities.find(e => e.isBoss); b.ang = Math.PI / 2; Object.assign(b, { x: b.home.x, z: b.home.z + 6, cd: 99 }); });
await shoot('e.isBoss', 'court_circuit');
T.check('flèche court-circuit : il tombe, au sol', await h.until(() => window.S3K.entities.find(e => e.isBoss).stateName === 'landed', 4000));
await h.run(() => { window.__hp = window.S3K.entities.find(e => e.isBoss).hp; });
await h.key('KeyE');
T.check('grosse caisse (E) : sonné, gros dégâts', await h.until(() => window.S3K.entities.find(e => e.isBoss).hp < window.__hp - 1, 3000));
await h.run(() => { const g = window.S3K, b = g.entities.find(e => e.isBoss); while (b.alive) { b.setState('stunned'); b.takeHit(1, 0, 1, 5, g.player); } });
await h.wait(400); await h.skipDialogs(); await h.wait(300); await h.skipDialogs();
T.check('fin du niveau atteinte', await h.until(() => window.S3K.mode === 'end', 5000));
await h.run(() => localStorage.removeItem('s3k.save'));

await page.reload(); await page.waitForFunction(() => window.S3K?.player, null, { timeout: 30000 });
await h.start();
const rooms = [];
for (let i = 0; i < 5; i++) { await h.warp(); await h.wait(300); rooms.push((await h.state()).room); }
T.check('F2 : Main, Mezza, artspace, cave, Carré VIP', ['MAIN', 'MEZZA', 'ARTSPACE', 'CAVE', 'CARRÉ VIP'].every(r => rooms.some(x => x.includes(r))), rooms.join(' | '));
await T.finish(browser);
