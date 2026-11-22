// Parcours du niveau 5 (le Kalt, la nuit, 2026), avec les vraies touches : la file (robot-cordon qui barre l'allée,
// gaffe-grappin → cordon tombé), la cour (physios, porte du hangar), la salle (portiques ouverts seulement sur les
// basses, physios visibles seulement aux flashs, projecteur VIP coupé à la flèche court-circuit), la cave (Dylagne
// libéré, il tient le rythme), le rideau de la piste (grosse caisse, touche E), le boss (court-circuit → au sol → grosse
// caisse), fin du niveau. Puis F2 partout.
import { launch, checker } from './helpers.mjs';

const T = checker('kalt');
const { browser, page, h } = await launch(T, { query: 'debug=1&level=kalt&seed=1' });
const tp = (x, z, face = Math.PI / 2) => h.run(([x, z, face]) => { const p = window.S3K.player; Object.assign(p, { x, z, face, vx: 0, vz: 0 }); p.sync(); }, [x, z, face]);
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
const blocked = (x, z) => h.run(([x, z]) => window.S3K.collision.resolve({ x, z }, 0.4), [x, z]);

await h.start(); await h.god(); await h.skipDialogs();
T.check('départ : la file', (await h.state()).room.includes('FILE'));
T.check('objets des niveaux 1 à 3 donnés (niveau lancé seul)', await h.run(() => ['boomerang', 'arc', 'gaffe'].every(i => window.S3K.inventory.has(i))));
T.check('2 physios, 2 robots-cordons', await count('Physio', 'file') === 2 && await count('RobotCordon', 'cordons') === 2);
await h.run(() => { for (const e of window.S3K.entities) if (e.group === 'file') e.takeHit(99, 0, 1, 5, null); }); // les physios : pas le sujet ici
T.check('le cordon barre l\'allée', await blocked(-0.8, -21.4) === true);

// gaffe-grappin (vraie touche F) sur le robot de gauche : étourdi, cordon tombé, l'allée est libre
await tp(-1.5, -17);
await aim("e.constructor.name === 'RobotCordon' && e.x < -1", 'gaffe');
await h.key('KeyF');
T.check('gaffe-grappin : robot-cordon étourdi', await h.until(() => window.S3K.entities.some(e => e.isCordon && e.stateName === 'stunned'), 3000));
T.check('cordon tombé : on passe', await blocked(-0.8, -21.4) === false);
await tp(0, -24.5); await h.wait(300); await h.skipDialogs();
T.check('l\'allée → la cour : 3 physios', (await h.state()).room.includes('COUR') && await count('Physio', 'cour') === 3);
T.check('le cordon revient à sa place', await h.until(() => window.S3K.entities.filter(e => e.isCordon && e.group === 'cordons').every(e => e.stateName === 'guard'), 8000));
await h.key('F3'); await h.wait(1200);
T.check('cour vidée → porte du hangar ouverte', await h.run(() => window.S3K.world.doors.hangar.open));

// la salle : basses → portiques ; strobo → physios visibles aux flashs seulement
await tp(0, -54.5); await h.wait(300); await h.skipDialogs();
T.check('la salle : 3 physios dans le noir', (await h.state()).room.includes('SALLE') && await count('Physio', 'salle') === 3 &&
  await h.run(() => window.S3K.entities.filter(e => e.group === 'salle').every(e => e.dark)));
const seen = await h.run(() => new Promise(res => {
  const g = window.S3K, ph = g.entities.find(e => e.group === 'salle' && e.alive), r = { open: 0, closed: 0, vis: 0, hid: 0, beats: 0 };
  g.events.on('sono:beat', () => r.beats++);
  const t = setInterval(() => { g.world.lasers.basse1.on ? r.closed++ : r.open++; ph.obj.visible ? r.vis++ : r.hid++; }, 30);
  setTimeout(() => { clearInterval(t); res(r); }, 4500);
}));
T.check('portiques : ouverts sur les basses, fermés sinon', seen.open > 5 && seen.closed > 5, JSON.stringify(seen));
T.check('physio : visible aux flashs, invisible entre deux', seen.vis > 0 && seen.hid > seen.vis);
T.check('la sono bat la mesure (sono:beat)', seen.beats >= 7);
// projecteur VIP : une flèche simple rebondit, la flèche court-circuit le coupe → la cave
await h.run(() => { for (const e of window.S3K.entities) if (e.group === 'salle') e.takeHit(99, 0, 1, 5, null); });
await tp(-9, -84, Math.PI);
await shoot("e.constructor.name === 'Projecteur'");
T.check('flèche simple : le projecteur tient', await h.run(() => !window.S3K.world.doors.vip.open));
await shoot("e.constructor.name === 'Projecteur'", 'court_circuit');
T.check('flèche court-circuit : portique VIP coupé', await h.run(() => window.S3K.world.doors.vip.open));

// la cave : Dylagne libéré
await tp(-16.5, -82, Math.PI); await h.wait(300); await h.skipDialogs(); await h.wait(300);
T.check('la cave : physios et robots-cordons', (await h.state()).room.includes('CAVE') && await count('Physio', 'cave') === 2 && await count('RobotCordon', 'cave') === 2);
await h.key('F3'); await h.wait(1200); await h.skipDialogs();
T.check('cave libérée : Dylagne suit l\'Ultra', await h.run(() => window.S3K.entities.find(e => e.isDylagne).stateName === 'follow'));
T.check('Dylagne tient le rythme : portiques ouverts', await h.run(() => !window.S3K.world.lasers.basse1.on && !window.S3K.world.lasers.basse2.on));
await h.wait(1000);
T.check('… et le restent', await h.run(() => !window.S3K.world.lasers.basse1.on));
// soin de Dylagne (sans le god mode le temps de vérifier)
await h.run(() => { clearInterval(window.__god); const g = window.S3K, p = g.player, d = g.entities.find(e => e.isDylagne); p.hp = p.maxHp - 1; d.healT = 99; });
T.check('Dylagne soigne l\'Ultra blessé', await h.until(() => window.S3K.player.hp === window.S3K.player.maxHp, 2000));
await h.god();

// le rideau de la piste : loin, pas d'indication ; tout près, E → grosse caisse
await tp(0, -80);
await h.key('KeyE');
T.check('loin du rideau : rien', await h.run(() => !window.S3K.world.doors.piste.open));
await tp(0, -87); await h.wait(400); await h.key('KeyE'); await h.wait(300);
T.check('grosse caisse de Dylagne (E) : le rideau tombe', await h.run(() => window.S3K.world.doors.piste.open));

// la piste : le Magnat
await tp(0, -92.5); await h.wait(300); await h.skipDialogs();
T.check('la piste : combat contre le Magnat lancé', await h.until(() => ['takeoff', 'hover'].includes(window.S3K.entities.find(e => e.isBoss).stateName), 3000));
await h.until(() => window.S3K.entities.find(e => e.isBoss).stateName === 'hover', 4000);
await shoot('e.isBoss', 'court_circuit');
T.check('flèche court-circuit : il tombe', await h.until(() => ['fall', 'landed'].includes(window.S3K.entities.find(e => e.isBoss).stateName), 3000));
T.check('au sol', await h.until(() => window.S3K.entities.find(e => e.isBoss).stateName === 'landed', 3000));
const hp = await h.run(() => window.S3K.entities.find(e => e.isBoss).hp);
await h.key('KeyE');
T.check('grosse caisse (E) : sonné, gros dégâts', await h.until(() => window.S3K.entities.find(e => e.isBoss).stateName === 'stunned', 3000) &&
  await h.run(hp => window.S3K.entities.find(e => e.isBoss).hp < hp - 1, hp));
await h.run(() => { const g = window.S3K, b = g.entities.find(e => e.isBoss); while (b.alive) { b.setState('stunned'); b.takeHit(1, 0, 1, 5, g.player); } });
await h.wait(400); await h.skipDialogs(); await h.wait(300); await h.skipDialogs();
T.check('fin du niveau atteinte', await h.until(() => window.S3K.mode === 'end', 5000));

await page.reload(); await page.waitForFunction(() => window.S3K?.player, null, { timeout: 30000 });
await h.start();
const rooms = [];
for (let i = 0; i < 5; i++) { await h.warp(); await h.wait(300); rooms.push((await h.state()).room); }
T.check('F2 : toutes les salles', ['FILE', 'COUR', 'SALLE', 'CAVE', 'PISTE'].every(r => rooms.some(x => x.includes(r))), rooms.join(' | '));
await T.finish(browser);
