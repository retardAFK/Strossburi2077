// Parcours du niveau 4 (Marché 2000, la nuit, 2026), avec de vraies flèches : l'arrière (vigiles, « repéré ! » → retour
// au départ, néon cassé, porte violette → marché noir → rayons, caisse de fumigènes, fumée qui aveugle), les rayons (étagères et palettes qui cachent, caméra
// coupée au court-circuit), la réserve (2 vagues, escalier), le toit (lettres de l'enseigne : mauvais ordre puis bon
// ordre → Stork rejoint l'Ultra), le magasin (piqué de Stork sur le tiroir ouvert), fin du niveau. Puis F2 partout.
import { launch, checker } from './helpers.mjs';

const T = checker('marche2000');
const { browser, page, h } = await launch(T, { query: 'debug=1&level=marche2000&seed=1' });
const tp = (x, z, face = Math.PI / 2) => h.run(([x, z, face]) => { const p = window.S3K.player; Object.assign(p, { x, z, face, vx: 0, vz: 0 }); p.sync(); }, [x, z, face]);
const shoot = async (filter, arrow = 'simple') => {
  await h.run(([f, arrow]) => { const g = window.S3K, t = g.entities.find(e => e.alive !== false && new Function('e', 'return ' + f)(e));
    const a = g.inventory.items.arc; if (arrow !== 'simple' && !a.ammo[arrow]) a.give(arrow, 1); a.arrow = arrow; g.inventory.equip('arc'); g.player.target = t; }, [filter, arrow]);
  await h.until(() => window.S3K.inventory.items.arc.ready, 3000);
  await h.key('KeyF'); await h.wait(300);
  await h.until(() => !window.S3K.entities.some(e => e.isPlayerShot && !e.removed && e.constructor.name === 'Arrow' && e.state !== 'stuck'), 3000); await h.wait(200);
};
const count = name => h.run(n => window.S3K.entities.filter(e => e.constructor.name === n && e.alive).length, name);

await h.start(); await h.god();
await h.run(() => { window.__caught = 0; window.S3K.events.on('stealth:caught', () => window.__caught++); });
T.check('départ : l\'arrière', (await h.state()).room.includes('ARRIÈRE'));
T.check('objets des niveaux 1 à 3 donnés (niveau lancé seul)', await h.run(() => ['boomerang', 'arc', 'gaffe'].every(i => window.S3K.inventory.has(i))));
T.check('3 robots-vigiles en ronde (cour + marché noir), 3 néons allumés', await count('VigileNuit') === 3 && await h.run(() => window.S3K.entities.filter(e => e.isLight && e.on).length === 3));

// repéré : dans le faisceau d'un vigile → retour au départ de la cour
await h.run(() => { const g = window.S3K, v = g.entities.find(e => e.constructor.name === 'VigileNuit'), p = g.player;
  Object.assign(p, { x: v.x + v.fx * 3, z: v.z + v.fz * 3 }); p.sync(); });
T.check('dans le faisceau : « repéré ! »', await h.until(() => window.__caught > 0, 3000));
let p = await h.state();
T.check('repéré → retour au départ de la cour', Math.hypot(p.x, p.z - 5) < 0.5, `${p.x.toFixed(1)}, ${p.z.toFixed(1)}`);

// néon cassé à l'arc
await tp(1, -1);
await shoot("e.isLight && e.id === 'n1'");
T.check('flèche sur un néon : il s\'éteint', await h.run(() => !window.S3K.entities.find(e => e.id === 'n1').on));

// caisse de fumigènes (vraie touche E)
await tp(-7, 3.2); await h.wait(200); await h.key('KeyE'); await h.wait(200); await h.skipDialogs();
T.check('caisse : flèches fumigènes', await h.run(() => window.S3K.inventory.items.arc.ammo.fumigene > 0));
// fumigène tiré contre le mur, à côté du vigile ; l'Ultra dans la fumée, sous ses yeux
const V = "window.S3K.entities.find(e => e.constructor.name === 'VigileNuit' && e.start.z > -15)";
// (les deux vigiles sont figés pendant ce test : aucune ronde ne renvoie l'Ultra au départ entre deux étapes)
const freeze = () => h.run(() => { for (const w of window.S3K.entities) if (w.constructor.name === 'VigileNuit') { w.setState('stunned'); w.stunT = 99; } });
const place = () => h.run(() => { const p = window.S3K.player; Object.assign(p, { x: -8.5, z: -13, face: Math.PI, vx: 0, vz: 0, target: null }); p.sync(); });
const facing = () => h.run(v => { const g = window.S3K, w = eval(v), p = g.player;
  Object.assign(p, { x: -8.5, z: -13 }); Object.assign(w, { x: -6.5, z: -11.5 }); w.faceTo(p.x, p.z); w.blinded = 0; return w.sees(); }, V);
await h.skipDialogs(); await freeze(); await place();
T.check('à découvert, face au vigile : vu', await facing() === true);
await h.run(() => { window.S3K.inventory.items.arc.arrow = 'fumigene'; window.__caught = 0; });
await h.until(() => window.S3K.inventory.items.arc.ready, 3000); await place(); await h.key('KeyF');
T.check('flèche fumigène contre le mur : nuage', await h.until(() => window.S3K.entities.some(e => e.isSmoke && !e.removed), 3000));
T.check("dans la fumée : le vigile ne voit plus l'Ultra", await facing() === false);
await h.run(v => { eval(v).resetPatrol(); }, V);

// la porte violette → le marché noir, qui ressort dans les rayons
await tp(8.8, -18, 0); await h.wait(300); await h.skipDialogs();
T.check('porte violette : elle s\'ouvre', await h.run(() => window.S3K.world.doors.violette.open));
await tp(14, -25, -Math.PI / 2); await h.wait(200);
T.check('le marché noir : une salle, un vigile', (await h.state()).room.includes('MARCHÉ NOIR') &&
  await h.run(() => window.S3K.entities.filter(e => e.group === 'noir' && e.alive).length === 1));
await tp(9.7, -41, Math.PI); await h.wait(300); await h.skipDialogs();
T.check('sortie du marché noir → les rayons commencent', await count('ChariotRobot') === 3);

// porte de service → les rayons
await tp(0, -30.8); await h.wait(300); await h.skipDialogs();
T.check('les rayons : 3 chariots-robots', (await h.state()).room.includes('RAYONS') && await count('ChariotRobot') === 3);
const view = await h.run(() => { const g = window.S3K, c = g.entities.find(e => e.constructor.name === 'ChariotRobot'), p = g.player;
  Object.assign(c, { x: -5, z: -56.5, face: 0 }); c.setState('stunned'); c.stunT = 99;
  const at = (x, z) => { Object.assign(p, { x, z }); return c.stealth && (c.stunT = 0, c.blinded = 0, c.sees()); };
  const r = { open: at(0, -54.5), palette: at(0, -56.5) }; c.stunT = 99; Object.assign(p, { x: 0, z: -32.5 }); p.sync(); return r; });
T.check('chariot : vu à découvert, caché derrière une palette', view.open === true && view.palette === false, JSON.stringify(view));
await tp(4, -36);
await shoot("e.constructor.name === 'CameraScanner'", 'court_circuit');
T.check('flèche court-circuit : caméra coupée', await h.run(() => window.S3K.entities.some(e => e.constructor.name === 'CameraScanner' && e.off > 0)));

// la réserve : 2 vagues, puis l'escalier du toit
await tp(0, -62.8); await h.wait(300); await h.skipDialogs(); await h.wait(300);
T.check('réserve : vague 1 (vigiles + chariot)', await h.until(() => window.S3K.entities.filter(e => e.group === 'reserve1' && e.alive).length === 3, 3000));
await h.key('F3'); await h.wait(1500);
T.check('réserve : vague 2', await h.run(() => window.S3K.entities.filter(e => e.group === 'reserve2' && e.alive).length === 4));
await h.key('F3'); await h.wait(1200); await h.skipDialogs();
T.check('réserve vidée → escalier ouvert', await h.run(() => window.S3K.world.doors.escalier.open));

// le toit : lettres de l'enseigne à l'arc (mauvais ordre → tout s'éteint ; bon ordre → Stork)
await tp(0, -86); await h.wait(300); await h.skipDialogs();
await tp(0, -96);
await shoot("e.constructor.name === 'LettreNeon' && e.key === 1");
await h.skipDialogs();
T.check('mauvais ordre : la lettre se rééteint', await h.run(() => !window.S3K.entities.find(e => e.constructor.name === 'LettreNeon' && e.key === 1).lit));
for (const k of [0, 1, 2]) { await shoot(`e.constructor.name === 'LettreNeon' && e.key === ${k}`); await h.skipDialogs(); }
T.check('bon ordre : « MARCHÉ 2000 » rallumée', await h.run(() => window.S3K.entities.filter(e => e.constructor.name === 'LettreNeon').every(e => e.lit)));
T.check('Stork sort de son nid et rejoint l\'Ultra', await h.until(() => window.S3K.entities.find(e => e.isStork).stateName === 'follow', 6000));
T.check('escalier du magasin ouvert', await h.run(() => window.S3K.world.doors.magasin.open));

// le magasin : le Gérant encaisse, tiroir ouvert → {use} : piqué de Stork
await tp(0, -107); await h.wait(500); await h.skipDialogs();
T.check('magasin : combat contre le Gérant lancé', await h.run(() => window.S3K.entities.find(e => e.isBoss)?.stateName === 'glide'));
T.check('il encaisse : tiroir ouvert', await h.until(() => window.S3K.entities.find(e => e.isBoss).stateName === 'open', 15000));
await h.key('KeyE');
T.check('piqué de Stork sur le tiroir → Gérant sonné', await h.until(() => window.S3K.entities.find(e => e.isBoss).stateName === 'stunned', 4000));
await h.run(() => { const g = window.S3K, b = g.entities.find(e => e.isBoss); while (b.alive) { b.setState('stunned'); b.takeHit(1, 0, 1, 5, g.player); } });
await h.wait(400); await h.skipDialogs(); await h.wait(300); await h.skipDialogs();
T.check('fin du niveau atteinte', await h.until(() => window.S3K.mode === 'end', 5000));

await page.reload(); await page.waitForFunction(() => window.S3K?.player, null, { timeout: 30000 });
await h.start();
const rooms = [];
for (let i = 0; i < 5; i++) { await h.warp(); await h.wait(300); rooms.push((await h.state()).room); }
T.check('F2 : toutes les salles', ['RAYONS', 'RÉSERVE', 'TOIT', 'MAGASIN'].every(r => rooms.some(x => x.includes(r))), rooms.join(' | '));
await T.finish(browser);
