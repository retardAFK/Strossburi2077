// Port du Rhin, salle 1 : le quai et la palissade « BlingCo LOFTS ». 2 vagues d'agents immobiliers-clones (ils
// plantent des pancartes VENDU partout, même sur l'Ultra) ; quai vidé → la palissade tombe, le moulin est ouvert.
import { ITEMS } from '../../items/index.js';

const PI = Math.PI, IN = -PI / 2; // ennemis tournés vers l'entrée (+z)

// niveau lancé seul (?level=port-rhin, sans sauvegarde) : l'Ultra a les objets des niveaux 1 et 2
export function giveEarlierItems(game) {
  for (const id of ['boomerang', 'arc']) if (!game.inventory.has(id)) game.inventory.give(new ITEMS[id](game));
}

export function quai(game, { T, W, E, say }) {
  E.on('game:start', () => {
    game.audio.music('coursive');
    giveEarlierItems(game); game.inventory.equip('boomerang');
    say(['prh.quai.1']);
  });
  const enter = game.trigger([-6, 4, -1, -3], () => {
    say(['prh.quai.2', 'prh.quai.3']);
    game.spawn('agent', -3, -13, 'quai1', { face: IN });
    game.spawn('agent', 2, -15, 'quai1', { face: IN });
  });
  game.onGroupCleared('quai1', () => {
    game.setCheckpoint(-1, -8, PI / 2);
    for (const [x, z] of [[-4, -21], [0, -22], [3, -20]]) game.spawn('agent', x, z, 'quai2', { face: IN });
  });
  game.onGroupCleared('quai2', () => {
    W.setDoor('palissade', true); game.hud.banner(...T.palissade);
    game.setCheckpoint(-1, -22, PI / 2);
    say(['prh.palissade']);
  });

  E.on('debug:warp', id => {
    if (id === 'quai') return;
    enter.done = true;
    for (const e of game.entities) if (e.isEnemy && e.alive && !e.isBoss) e.takeHit(99, 0, 1, 5, null);
    W.setDoor('palissade', true);
  });
}
