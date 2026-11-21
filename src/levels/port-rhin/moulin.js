// Port du Rhin, salle 2 : le vieux moulin. Dockers et mariniers retranchés confient le gaffe-grappin ; tuto :
// s'accrocher à l'anneau pour franchir le bief, puis tirer la caisse qui bouche la sortie.
import { GaffeGrappin } from '../../items/GaffeGrappin.js';

const PI = Math.PI;

export function giveGaffe(game) {
  if (!game.inventory.has('gaffe')) game.inventory.give(new GaffeGrappin(game));
  game.inventory.equip('gaffe');
}

export function moulin(game, { T, E, say }) {
  const enter = game.trigger([-6, 4, -27, -29], () => {
    game.setCheckpoint(-1, -28, PI / 2);
    say(['prh.moulin.1', 'prh.moulin.2'], () => {
      giveGaffe(game); game.hud.banner(T.gaffeGot[0], game.prompts.format(T.gaffeGot[1]), 3.5);
      say(['prh.moulin.3']);
    });
  });
  E.on('pnj:talk', id => { if (id === 'dockers') say([game.inventory.has('gaffe') ? 'prh.moulin.3' : 'prh.moulin.1']); });
  let bief = false;
  E.on('gaffe:land', a => {
    if (a.id !== 'bief' || bief) return;
    bief = true;
    game.setCheckpoint(-1, -41, PI / 2);
    say(['prh.moulin.4']);
  });

  E.on('debug:warp', id => {
    if (id === 'quai' || id === 'moulin') return;
    enter.done = true; bief = true; giveGaffe(game);
    const c = game.entities.find(e => e.id === 'caisse' && e.pull);
    if (c && c.z < -50) { c.z = -48; c.goal = -48; } // caisse déjà tirée
  });
}
