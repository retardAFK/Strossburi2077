// Niveau 6 : le Kalt, les abords (2026, la nuit, maquette grise). De l'arrêt de tram à la cour ; le Kalt n'apparaît
// qu'en entrant dans la cour. Entrées vers l'intérieur (niveau 7), transmises par la sauvegarde (completeLevel, entry) :
//  - cour : les deux robots-cordons du portique BlingCo barrent la porte (gaffe-grappin : le cordon tombe) ;
//  - cave (secret) : les palettes de la ruelle (gaffe-grappin) → arrière-cours → soupirail de la cave ;
//  - toit du hangar : placeholder fermé (Stork ? point ouvert du plan).
// Répliques : data/dialogues/kalt-abords.fr.js.
import { ITEMS } from '../../items/index.js';

const PI = Math.PI, IN = PI / 2; // tournés vers le nord (la rue)

export default function script(game) {
  const T = game.levelTexts, W = game.world, E = game.events, say = (ids, cb) => game.dialog.sayIds(ids, cb);

  E.on('game:start', () => {
    game.audio.music('coursive');
    // niveau lancé seul (?level=kalt-abords, sans sauvegarde) : l'Ultra a les objets des niveaux précédents
    for (const id of ['boomerang', 'arc', 'gaffe']) if (!game.inventory.has(id)) game.inventory.give(new ITEMS[id](game));
    game.inventory.equip('gaffe');
    game.setCheckpoint(-6, -48, -IN);
    say(['kaltab.arrivee.1', 'kaltab.arrivee.2']);
    // les videurs de la cour et le portique BlingCo (deux robots-cordons devant la porte, cordons vers l'ouest)
    game.spawn('physio', 26, 4, 'videurs', { face: IN }); game.spawn('physio', 31, 2, 'videurs', { face: IN });
    game.spawn('cordon', 29, 12, 'portique', { face: IN }); game.spawn('cordon', 25.8, 12, 'portique', { face: IN });
  });
  // le Kalt, invisible depuis la rue, apparaît en entrant dans la cour
  game.trigger([-6, 35, 10, -14], () => { W.setPropVisible('kalt', true); game.hud.banner(...T.reveal); say(['kaltab.cour']); });
  // entrée normale : la porte du Kalt, derrière le portique
  game.trigger([23.4, 28.8, 13.4, 12.5], () => game.completeLevel(T.endCour, { entry: 'cour' }));
  // entrée secrète : la ruelle (palettes tirées au grappin) → arrière-cours → soupirail
  game.trigger([33, 35, 30, 20], () => { game.hud.banner(...T.ruelle); });
  game.trigger([-10, -6, 35.8, 33.6], () => game.completeLevel(T.endCave, { entry: 'cave' }));
  // le toit du hangar : fermé (placeholder)
  game.trigger([-20, -17, 14, 10.5], () => { game.bubble(game.player, T.toit, 1.6); say(['kaltab.toit']); });
  E.on('pnj:talk', id => { if (id === 'public') say(['kaltab.public']); });

  E.on('debug:warp', id => {
    if (id === 'tram' || id === 'rue') return;
    W.setPropVisible('kalt', true);
    for (const e of game.entities) if (e.group === 'videurs' && e.alive) e.takeHit(99, 0, 1, 5, null);
  });
}
