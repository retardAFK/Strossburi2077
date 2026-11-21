// Parcours du niveau 3 (Port du Rhin, 2026) sans raccourci de salle, avec de vrais lancers de gaffe-grappin :
// agents du quai (pancartes VENDU), palissade, moulin (gaffe confié, anneau au-dessus du bief, caisse tirée),
// conteneur tiré, traversée du canal par les grues, quai d'en face, chantier et boss, fin du niveau.
// Puis les points de passage F2 (debug) d'un bout à l'autre.
import { launch, checker } from './helpers.mjs';

const T = checker('port-rhin');
const { browser, page, h } = await launch(T, { query: 'debug=1&level=port-rhin&seed=1' });
const tp = (x, z, face = Math.PI / 2) => h.run(([x, z, face]) => { const p = window.S3K.player; Object.assign(p, { x, z, face, vx: 0, vz: 0 }); p.sync(); }, [x, z, face]);
const pos = () => h.run(() => { const p = window.S3K.player; return { x: +p.x.toFixed(1), z: +p.z.toFixed(1), st: p.stateName }; });
// vrai lancer de grappin vers l'entité choisie (verrouillée), puis attente du retour du crochet
const grapple = async filter => {
  await h.run(f => { const g = window.S3K; g.inventory.equip('gaffe'); g.player.target = g.entities.find(e => new Function('e', 'return ' + f)(e)); }, filter);
  await h.until(() => window.S3K.inventory.items.gaffe.ready, 3000);
  await h.key('KeyF');
  await h.until(() => !window.S3K.inventory.items.gaffe.hook, 4000); await h.wait(200);
};

await h.start(); await h.god();
T.check('départ : le quai', (await h.state()).room.includes('QUAI'));
T.check('objets des niveaux 1 et 2 donnés (niveau lancé seul)', await h.run(() => window.S3K.inventory.has('boomerang') && window.S3K.inventory.has('arc')));
await tp(-1, -2); await h.wait(300); await h.skipDialogs();
T.check('2 agents immobiliers', await h.run(() => window.S3K.entities.filter(e => e.constructor.name === 'AgentImmo' && e.alive).length) === 2);
T.check('pancarte VENDU plantée sur l\'Ultra quand un agent le touche', await h.run(() => {
  const g = window.S3K, a = g.entities.find(e => e.constructor.name === 'AgentImmo'), p = g.player; p.inv = 0;
  p.takeHit(0, 0, 1, 0, a); return g.entities.some(e => e.isPancarte && e.onPlayer);
}));
await h.key('F3'); await h.wait(1500);
T.check('vague 2 du quai', await h.run(() => window.S3K.entities.filter(e => e.constructor.name === 'AgentImmo' && e.alive).length) === 3);
await h.key('F3'); await h.wait(1200); await h.skipDialogs();
T.check('quai vidé → la palissade tombe', await h.run(() => window.S3K.world.doors.palissade.open));

await tp(-1, -28); await h.wait(400); await h.skipDialogs(); await h.wait(300); await h.skipDialogs();
T.check('moulin : gaffe-grappin confié', await h.run(() => window.S3K.inventory.equipped?.id === 'gaffe'));
await tp(-1, -34.5);
await grapple("e.isAnchor && e.id === 'bief'"); await h.skipDialogs();
let p = await pos();
T.check('anneau du bief : l\'Ultra est tiré de l\'autre côté', p.z < -40 && p.st === 'idle', JSON.stringify(p));
await tp(-1, -45);
await grapple("e.id === 'caisse'"); await h.wait(600);
T.check('caisse tirée au grappin : la sortie est libre', await h.run(() => window.S3K.entities.find(e => e.id === 'caisse').z > -48.5));

await tp(-1, -55.5); await h.wait(300); await h.skipDialogs();
await tp(-6, -57);
await grapple("e.id === 'conteneur'"); await h.wait(600);
T.check('conteneur tiré : la barrière s\'ouvre', await h.run(() => window.S3K.entities.find(e => e.id === 'conteneur').z > -57));
await tp(-6, -63); await h.wait(300); await h.skipDialogs();
for (const id of ['grue1', 'grue2', 'bollard']) { await grapple(`e.isAnchor && e.id === '${id}'`); await h.skipDialogs(); }
p = await pos();
T.check('canal traversé par les grues (péniche, péniche, quai d\'en face)', p.z < -84, JSON.stringify(p));
T.check('quai d\'en face : agents', await h.run(() => window.S3K.entities.filter(e => e.constructor.name === 'AgentImmo' && e.alive).length) === 2);
await h.key('F3'); await h.wait(1200);
T.check('quai vidé → herse du chantier ouverte', await h.run(() => window.S3K.world.gates.chantier.open === true));

await tp(0, -97.5); await h.wait(500); await h.skipDialogs();
T.check('chantier : combat contre le Promoteur lancé', await h.run(() => window.S3K.entities.find(e => e.isBoss)?.stateName === 'walk'));
T.check('il largue un préfabriqué', await h.until(() => window.S3K.entities.some(e => e.isPrefab && e.state === 'ground'), 8000));
await grapple("e.isPrefab && e.state === 'ground'");
T.check('préfabriqué renvoyé au grappin → Promoteur sonné', await h.until(() => window.S3K.entities.find(e => e.isBoss).stateName === 'stunned', 3000));
await h.run(() => { const g = window.S3K, b = g.entities.find(e => e.isBoss); while (b.alive) { b.setState('stunned'); b.takeHit(1, 0, 1, 5, g.player); } });
await h.wait(400); await h.skipDialogs(); await h.wait(300); await h.skipDialogs();
T.check('fin du niveau atteinte', await h.until(() => window.S3K.mode === 'end', 5000));

await page.reload(); await page.waitForFunction(() => window.S3K?.player, null, { timeout: 30000 });
await h.start();
const rooms = [];
for (let i = 0; i < 5; i++) { await h.warp(); await h.wait(300); rooms.push((await h.state()).room); }
T.check('F2 : toutes les salles', ['MOULIN', 'CONTENEURS', 'CHANTIER'].every(r => rooms.some(x => x.includes(r))), rooms.join(' | '));
await T.finish(browser);
