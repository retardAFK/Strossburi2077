// Le Kalt, salle 1 : la file dehors (trottoir rue la Fayette, départ côté rue Job). Le peuple techno est refoulé ;
// deux physios BlingCo et deux robots-cordons barrent l'allée. Pour passer : tirer un robot au gaffe-grappin (ou le
// court-circuiter, ou le casser) : étourdi, son cordon tombe le temps de se faufiler. L'allée → la cour.
import { ITEMS } from '../../items/index.js';

const PI = Math.PI, IN = -PI / 2; // tournés vers la rue (+z)

// niveau lancé seul (?level=kalt, sans sauvegarde) : l'Ultra a les objets des niveaux 1 à 3
function giveEarlierItems(game) {
  for (const id of ['boomerang', 'arc', 'gaffe']) if (!game.inventory.has(id)) game.inventory.give(new ITEMS[id](game));
}

export function file(game, { E, say }) {
  E.on('game:start', () => {
    game.audio.music('coursive');
    giveEarlierItems(game); game.inventory.equip('gaffe');
    game.setCheckpoint(0, 5, PI / 2);
    game.spawn('physio', -5, -14, 'file', { face: IN }); game.spawn('physio', 5, -15, 'file', { face: IN });
    // le cordon part sur la gauche du robot : tournés vers la rue, ils barrent l'allée de x -2.4 à 2.6
    game.spawn('cordon', -2.4, -21.4, 'cordons', { face: IN }); game.spawn('cordon', 0.05, -21.4, 'cordons', { face: IN });
    say(['kalt.file.1', 'kalt.file.2']);
  });
  E.on('pnj:talk', id => { if (id === 'public') say(['kalt.public']); });

  E.on('debug:warp', id => {
    if (id === 'file') return;
    for (const e of game.entities) if ((e.group === 'file' || e.group === 'cordons') && e.alive) e.takeHit(99, 0, 1, 5, null);
  });
}
