// Marché 2000, salle 1 : l'arrière (cour côté rue de la Farine, départ rue d'Or). Infiltration : deux robots-vigiles
// à lampe font leur ronde ; trois néons éclairent la cour (sous un néon, on est vu de loin) : les casser à l'arc.
// Première flèche fumigène trouvée ici (caisse au départ : proposition Cowork, à valider en jouant).
// Atteindre la porte de service sans être repéré → les rayons.
import { ITEMS } from '../../items/index.js';

const PI = Math.PI;

// niveau lancé seul (?level=marche2000, sans sauvegarde) : l'Ultra a les objets des niveaux 1 à 3
export function giveEarlierItems(game) {
  for (const id of ['boomerang', 'arc', 'gaffe']) if (!game.inventory.has(id)) game.inventory.give(new ITEMS[id](game));
}

export function arriere(game, { T, W, E, say }) {
  E.on('game:start', () => {
    game.audio.music('coursive');
    giveEarlierItems(game); game.inventory.equip('arc');
    game.setCheckpoint(0, 5, PI / 2);
    // vigiles en mode infiltration : leurs rondes passent devant les caisses et devant la porte de service
    game.spawn('vigile', -7, -11.5, 'cour', { face: 0, stealth: true, patrol: [[7, -11.5], [-7, -11.5]] });
    game.spawn('vigile', 6, -26, 'cour', { face: PI, stealth: true, patrol: [[-6, -26], [6, -26]] });
    say(['m2k.arriere.1', 'm2k.arriere.2']);
  });
  let smokeTuto = false;
  E.on('crate:opened', type => { if (type === 'fumigene' && !smokeTuto) { smokeTuto = true; say(['m2k.arriere.3']); } });
  let dark = false;
  E.on('neon:off', () => {
    if (dark || game.entities.some(e => e.isLight && e.on)) return;
    dark = true; game.hud.banner(...T.neonsOff);
  });
  const out = game.trigger([-1.5, 1.5, -30, -31.5], () => E.emit('m2k:rayons'));

  E.on('debug:warp', id => {
    if (id === 'arriere') return;
    out.done = true; smokeTuto = true;
    for (const e of game.entities) { if (e.isLight) e.off(); if (e.group === 'cour' && e.alive) e.takeHit(99, 0, 1, 5, null); }
  });
}
