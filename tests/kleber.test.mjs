// Parcours du niveau 6 (place Kléber, la nuit, 2026, fin de la partie 1), avec les vraies touches : Stork et Dylagne
// rejoignent l'Ultra ; la borne du péage piratée (E) ; le labyrinthe (agent à bouclier : de face ça rebondit ; tampon 1 ;
// flèche enflammée → la neige payante fond → tampon 2 ; gaffe-grappin sur l'étal → tampon 3 ; horloge de la signature →
// renforts) ; le sapin-écran (piqué de Stork, grosse caisse de Dylagne, court-circuit du générateur) ; le boss (il
// s'encastre, sonné → E) ; faux final → glitch → fin. Puis F2 partout.
import { launch, checker } from './helpers.mjs';

const T = checker('kleber');
const { browser, page, h } = await launch(T, { query: 'debug=1&level=kleber&seed=1' });
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
const blocked = (x, z) => h.run(([x, z]) => window.S3K.collision.resolve({ x, z }, 0.4), [x, z]);
const kill = group => h.run(g => { for (const e of window.S3K.entities) if (e.group === g && e.alive) e.takeHit(99, 0, 1, 5, null); }, group);

await h.start(); await h.god(); await h.skipDialogs();
await h.run(() => { const g = window.S3K; window.__ev = []; for (const n of ['tampon:pris', 'stork:dive', 'dylagne:drum', 'marco:dazed', 'hud:glitch'])
  g.events.on(n, a => window.__ev.push(n + (n === 'hud:glitch' ? ':' + a : ''))); });
const ev = n => h.run(n => window.__ev.filter(e => e === n).length, n);
T.check('départ : les péages', (await h.state()).room.includes('PÉAGES'));
T.check('Stork et Dylagne rejoignent l\'Ultra', await h.until(() => window.S3K.entities.find(e => e.isStork).stateName === 'follow' &&
  window.S3K.entities.find(e => e.isDylagne).stateName === 'follow', 5000));
T.check('3 péagistes, le rideau laser ferme la place', await h.run(() => window.S3K.entities.filter(e => e.group === 'peages' && e.alive).length === 3) &&
  await h.run(() => window.S3K.world.lasers.peage.on));
await kill('peages');
await tp(9.5, -9.2, -Math.PI / 2); await h.wait(200); await h.key('KeyE'); await h.wait(300);
T.check('borne du péage piratée (E) : entrée gratuite', await h.run(() => !window.S3K.world.lasers.peage.on));

// le labyrinthe
await tp(0, -18.5); await h.wait(300); await h.skipDialogs();
T.check('le labyrinthe : bouclier, neigeurs, péagiste', (await h.state()).room.includes('CHALETS') &&
  await h.run(() => window.S3K.entities.filter(e => e.group === 'chalets' && e.alive).length === 4));
const shield = await h.run(() => { const g = window.S3K, b = g.entities.find(e => e.constructor.name === 'AgentBouclier'), hp = b.hp;
  b.setState('patrol'); b.takeHit(1, -b.fx, -b.fz, 0, g.player); const front = b.hp; b.setState('patrol'); b.takeHit(1, b.fx, b.fz, 0, g.player);
  return { hp, front, back: b.hp }; });
T.check('agent à bouclier : de face ça rebondit, de dos non', shield.front === shield.hp && shield.back === shield.hp - 1, JSON.stringify(shield));
await kill('chalets');
await tp(13.2, -29, 0); await h.wait(200); await h.key('KeyE'); await h.wait(300);
T.check('tampon 1 (impasse)', await ev('tampon:pris') === 1);
// horloge de la signature : à l'échéance, des renforts
await h.run(() => { const c = window.S3K.entities.find(e => e.constructor.name === 'Horloge' && !e.removed); c.acc = c.every - 0.05; });
await h.wait(300);
T.check('la signature approche : renforts', await h.run(() => window.S3K.entities.filter(e => e.group === 'renfortsSignature' && e.alive).length === 2));
await kill('renfortsSignature');
// flèche enflammée → la neige payante fond
T.check('la neige payante bouche l\'alcôve', await blocked(-11, -39) === true);
await tp(-3, -27.2, -Math.PI / 2); await h.wait(200); await h.key('KeyE'); await h.wait(300); await h.skipDialogs();
T.check('caisse : flèches enflammées', await h.run(() => window.S3K.inventory.items.arc.ammo.enflammee > 0));
await tp(-6, -39, Math.PI);
await shoot("e.constructor.name === 'NeigePayante'", 'enflammee');
T.check('flèche enflammée : la neige fond', await h.until(() => !window.S3K.entities.some(e => e.constructor.name === 'NeigePayante' && !e.removed), 3000) &&
  await blocked(-11, -39) === false);
await tp(-12.8, -39, Math.PI); await h.wait(200); await h.key('KeyE'); await h.wait(300);
T.check('tampon 2 (sous la neige)', await ev('tampon:pris') === 2);
// gaffe-grappin sur l'étal à roulettes
await tp(4, -51, 0); await h.skipDialogs();
for (let i = 0; i < 3 && await h.run(() => window.S3K.entities.find(e => e.id === 'etal').x > 8); i++) {
  await aim("e.id === 'etal'", 'gaffe'); await h.key('KeyF'); await h.wait(1500); await h.skipDialogs();
}
T.check('gaffe-grappin : l\'étal glisse', await h.run(() => window.S3K.entities.find(e => e.id === 'etal').x <= 8));
await tp(13.2, -51, 0); await h.wait(200); await h.key('KeyE'); await h.wait(300);
T.check('tampon 3 (derrière l\'étal) → porte du sapin ouverte', await ev('tampon:pris') === 3 && await h.run(() => window.S3K.world.doors.sapin.open));

// le sapin-écran : trois verrous
await tp(0, -58.8); await h.wait(300); await h.skipDialogs();
T.check('le sapin : gardes', (await h.state()).room.includes('SAPIN') && await h.run(() => window.S3K.entities.filter(e => e.group === 'sapin' && e.alive).length === 3));
await kill('sapin');
await tp(0, -66.5); await h.wait(400);
await h.key('KeyE'); await h.wait(300);
T.check('premier {use} : un compagnon agit', await ev('stork:dive') + await ev('dylagne:drum') === 1);
await h.wait(2500); await h.key('KeyE'); await h.wait(300);
T.check('second {use} : l\'autre compagnon', await h.until(() => window.__ev.includes('stork:dive') && window.__ev.includes('dylagne:drum'), 3000));
await h.wait(2500);
T.check('l\'estrade encore fermée', await h.run(() => !window.S3K.world.doors.estrade.open));
await tp(2, -74, 0);
await shoot("e.id === 'generateur'", 'court_circuit');
T.check('générateur court-circuité : l\'estrade s\'ouvre', await h.until(() => window.S3K.world.doors.estrade.open, 2000));

// le boss
await tp(0, -89.5); await h.wait(300); await h.skipDialogs();
T.check('l\'estrade : combat contre Marco CeKlair lancé', await h.until(() => window.S3K.entities.find(e => e.isBoss).stateName !== 'intro', 3000));
await h.run(() => { const b = window.S3K.entities.find(e => e.isBoss); Object.assign(b, { x: 0, z: -110, face: Math.PI / 2, cd: 99 }); b.setState('charge'); });
T.check('l\'attelage fonce dans le mur : encastré', await h.until(() => window.S3K.entities.find(e => e.isBoss).stateName === 'crash', 3000));
await h.run(() => { window.__hp = window.S3K.entities.find(e => e.isBoss).hp; });
await tp(0, -100); await h.wait(200); await h.key('KeyE');
T.check('sonné : {use}, un compagnon frappe', await h.until(() => window.S3K.entities.find(e => e.isBoss).hp < window.__hp - 1, 4000));
await h.run(() => { const g = window.S3K, b = g.entities.find(e => e.isBoss); while (b.alive) { b.setState('stunned'); b.takeHit(1, 0, 1, 5, g.player); } });
await h.wait(400); await h.skipDialogs();
T.check('faux final : tout le monde revient', await h.until(() => window.S3K.entities.filter(e => /^foule/.test(e.id || '') && e.shown).length === 4, 3000));
for (let i = 0; i < 12 && !(await h.run(() => window.S3K.mode === 'end')); i++) { await h.wait(1000); await h.skipDialogs(); }
T.check('glitch : le futur se recalcule', await ev('hud:glitch:true') >= 1);
T.check('fin de la partie 1 (écran de fin)', await h.run(() => window.S3K.mode === 'end'));

await page.reload(); await page.waitForFunction(() => window.S3K?.player, null, { timeout: 30000 });
await h.start();
const rooms = [];
for (let i = 0; i < 4; i++) { await h.warp(); await h.wait(300); rooms.push((await h.state()).room); }
T.check('F2 : toutes les salles', ['PÉAGES', 'CHALETS', 'SAPIN', 'ESTRADE'].every(r => rooms.some(x => x.includes(r))), rooms.join(' | '));
await T.finish(browser);
