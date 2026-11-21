// Mécaniques des salles du niveau 1, avec les chemins d'échec : bornes (trop lent / à temps), écluse (pont bloqué,
// levier, barque, vanne, cage qui saute, accostage), borne sur pile au bretzel, garde du Videur,
// cibles-TPE (mauvais ordre / bon ordre), les 4 plaques restaurées.
import { launch, checker } from './helpers.mjs';

const T = checker('enigmes-niveau1');
const { browser, h } = await launch(T, { query: 'debug=1&seed=1' });
const G = fn => h.run(fn);
const goto = (x, z) => h.run(([x, z]) => Object.assign(window.S3K.player, { x, z, vx: 0, vz: 0 }), [x, z]);
const press = async (code = 'KeyE') => { await h.key(code); await h.skipDialogs(); };

await h.start(); await h.god();

// ---------------------------------------------------------------- salle 1 : 3 bornes en 6 s
await h.warp();
const borne = i => G(new Function(`const b = window.S3K.entities.filter(e => e.isSwitch && e.group === 'bornes')[${i}];
  Object.assign(window.S3K.player, { x: b.x + b.fx * 1.6, z: b.z + b.fz * 1.6 }); return b.on;`));
await borne(0); await h.wait(150); await press();
T.check('bornes : une allumée', await G(() => window.S3K.entities.filter(e => e.group === 'bornes' && e.on).length) === 1);
await h.wait(6800);
T.check('bornes : trop lent → tout se rééteint', await G(() => window.S3K.entities.filter(e => e.group === 'bornes' && e.on).length) === 0);
for (let i = 0; i < 3; i++) { await borne(i); await h.wait(150); await press(); }
T.check('bornes : les 3 à temps → herse ouverte', await G(() => window.S3K.world.gates.herse.open));
await h.skipDialogs();

// ---------------------------------------------------------------- salle 2 : l'écluse
await h.warp();
const boat = () => G(() => { const b = window.S3K.entities.find(e => e.isBoat); return { stop: b.here.id, moving: b.target !== null, x: b.x, aboard: !!window.S3K.player.aboard }; });
const waitBoat = async () => { for (let i = 0; i < 80 && (await boat()).moving; i++) await h.wait(100); await h.skipDialogs(); };
const level = () => G(() => window.S3K.world.waters.eau.level);
// eau moyenne : la barque ne passe pas sous le pont, demi-tour
await goto(1.3, -60); await h.wait(150); await press();
T.check('écluse : à bord de la barque', (await boat()).aboard);
await press(); await waitBoat();
T.check('écluse : arrêt devant le pont', (await boat()).stop === 'pont');
await press(); await waitBoat();
T.check('écluse : eau trop haute → demi-tour au ponton', (await boat()).stop === 'ponton');
// descendre côté quai, baisser l'eau au levier
await G(() => { window.S3K.input.held.left = true; }); await h.wait(400); await G(() => { window.S3K.input.held.left = false; });
T.check('écluse : débarqué en marchant côté quai', !(await boat()).aboard);
await goto(0.8, -58.2); await h.wait(150); await press();
T.check('écluse : levier → eau basse', await level() === 0);
await h.wait(1500);
// passer sous le pont, tourner la vanne depuis la barque
await goto(1.3, -60); await h.wait(150); await press(); await press(); await waitBoat(); await press(); await waitBoat();
T.check('écluse : passée sous le pont (arrêt vanne)', (await boat()).stop === 'vanne');
await G(() => { const b = window.S3K.entities.find(e => e.isBoat); window.S3K.player.x = b.x + 0.6; }); await h.wait(150); await press();
T.check('écluse : vanne → eau haute', await level() === 2);
T.check('écluse : la cage de la winstubière saute', !(await G(() => window.S3K.world.props.cageWinstub.visible)));
await h.wait(2500);
await G(() => { const b = window.S3K.entities.find(e => e.isBoat); window.S3K.player.x = b.x - 0.4; }); await h.wait(150); await press(); await waitBoat();
T.check('écluse : arrivée au quai haut', (await boat()).stop === 'quai');
await G(() => { window.S3K.input.held.right = true; }); await h.wait(400); await G(() => { window.S3K.input.held.right = false; });
await h.wait(200); await h.skipDialogs();
T.check('écluse : débarqué au quai haut, comité d\'accueil', !(await boat()).aboard && await G(() => window.S3K.entities.filter(e => e.isEnemy && e.alive).length) === 2);
await G(() => { for (const e of [...window.S3K.entities]) if (e.isEnemy && e.alive) e.takeHit(99, 0, 1, 5, null); });

// ---------------------------------------------------------------- salle 3 : coffre, Videur, borne sur pile
await h.warp(); await h.warp(); // salle3 puis salle3-coffre
await G(() => { const g = window.S3K, c = g.entities.find(e => e.isChest); Object.assign(g.player, { x: c.x + c.fx * 1.5, z: c.z + c.fz * 1.5 }); });
await h.wait(200); await press(); await h.wait(300); await h.skipDialogs();
T.check('ponts : le Videur entre après le tuto', await h.until(() => window.S3K.entities.some(e => e.isMiniBoss && e.alive), 4000));
// combat-tuto du bretzel (#16) : il pare toute l'écharpe ; le bretzel le sonne ; sonné, il prend l'écharpe
const hitV = (side, src) => G(new Function(`const g = window.S3K, v = g.entities.find(e => e.isMiniBoss);
  const s = ${side === 'front' ? -1 : 1}, hp = v.hp, from = ${src === 'bretzel' ? '{ isPlayerShot: true }' : 'g.player'};
  v.takeHit(1, v.fx * s, v.fz * s, 5, from); return { dmg: hp - v.hp, stunned: !!v.stunned };`));
await G(() => window.S3K.entities.find(e => e.isMiniBoss).setState('wait'));
T.check('Videur : pare l\'écharpe de face', (await hitV('front', 'whip')).dmg === 0);
T.check('Videur : pare l\'écharpe de dos', (await hitV('back', 'whip')).dmg === 0);
const sb = await hitV('front', 'bretzel');
T.check('Videur : le bretzel le sonne', sb.stunned && sb.dmg > 0);
T.check('Videur : sonné, il prend l\'écharpe', (await hitV('front', 'whip')).dmg > 0);
await G(() => { for (const e of [...window.S3K.entities]) if (e.isEnemy && e.alive) e.takeHit(99, 0, 1, 5, null); });
await h.wait(300); await h.skipDialogs();
await G(() => { const b = window.S3K.entities.find(e => e.isSwitch && e.group === 'peage3'), p = window.S3K.player;
  Object.assign(p, { x: 21, z: b.z, target: null }); p.faceTo(b.x, b.z); });
await h.wait(100); await h.key('KeyF');
T.check('ponts : bretzel sur la borne de la pile → herse', await h.until(() => window.S3K.world.gates.herse3.open, 4000));
await h.skipDialogs();

// ---------------------------------------------------------------- salle 4 : cibles dans l'ordre des néons
await h.warp();
await G(() => { for (const e of [...window.S3K.entities]) if (e.isEnemy && e.alive) e.takeHit(99, 0, 1, 5, null); });
const throwAt = key => G(new Function(`const g = window.S3K, t = g.entities.find(e => e.isTarget && e.key === '${key}'), p = g.player;
  Object.assign(p, { x: t.x, z: -162.4, target: null }); p.faceTo(t.x, t.z);`)).then(async () => {
  await h.wait(80); await h.key('KeyF'); await h.until(() => !window.S3K.entities.some(e => e.isPlayerShot), 4000); await h.skipDialogs(); });
await throwAt('cyan');
T.check('cibles : mauvais ordre → tout s\'éteint', await G(() => window.S3K.entities.filter(e => e.isTarget && e.lit).length) === 0 && !(await G(() => window.S3K.world.gates.herse4.open)));
for (const k of ['rouge', 'or', 'cyan']) await throwAt(k);
T.check('cibles : rouge, or, cyan → herse', await G(() => window.S3K.world.gates.herse4.open));

// ---------------------------------------------------------------- les 4 plaques
for (const id of ['p1', 'p2', 'p3', 'p4']) {
  await G(new Function(`const g = window.S3K, pl = g.entities.find(e => e.isPlaque && e.id === '${id}');
    Object.assign(g.player, { x: pl.x, z: pl.z + 1.3 });`));
  await h.wait(200); await h.skipDialogs(); // une zone a pu se déclencher en arrivant
  await h.key('KeyE'); await h.wait(1600); await h.skipDialogs();
}
const truths = await G(() => window.S3K.entities.filter(e => e.isPlaque && e.state === 'truth').map(e => e.id));
T.check('les 4 plaques restaurées', truths.length === 4, truths.join(','));

await T.finish(browser);
