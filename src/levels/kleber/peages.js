// Place Kléber, salle 1 : les portiques-péages. La file VIP passe sur le tapis doré, le peuple est parqué derrière les
// barrières ; un rideau laser ferme la place. Entrer sans payer : pirater la borne du péage (terminal, {use} ou un coup
// d'écharpe). Agents péagistes en patrouille. Stork et Dylagne (versions événement) rejoignent l'Ultra au départ.
import { ITEMS } from '../../items/index.js';

const PI = Math.PI, IN = -PI / 2;

// niveau lancé seul (?level=kleber, sans sauvegarde) : l'Ultra a les objets des niveaux 1 à 3
function giveEarlierItems(game) {
  for (const id of ['boomerang', 'arc', 'gaffe']) if (!game.inventory.has(id)) game.inventory.give(new ITEMS[id](game));
}

export function peages(game, { T, W, E, say, stork, dylagne }) {
  E.on('game:start', () => {
    game.audio.music('coursive');
    giveEarlierItems(game); game.inventory.equip('arc');
    game.setCheckpoint(0, 5, PI / 2);
    stork()?.join(); dylagne()?.join();
    for (const [x, z] of [[-6, -6], [3, -8], [-2, -10]]) game.spawn('peagiste', x, z, 'peages', { face: IN });
    say(['kleber.peages.1', 'kleber.peages.2']);
  });
  E.on('peage:hack', () => { W.setLaser('peage', false); game.hud.banner(...T.peagesOpen); });

  E.on('debug:warp', id => {
    if (id === 'peages') return;
    W.setLaser('peage', false, true);
    game.entities.find(e => e.isTerminal && e.alive)?.activate();
    for (const e of game.entities) if (e.group === 'peages' && e.alive) e.takeHit(99, 0, 1, 5, null);
  });
}
