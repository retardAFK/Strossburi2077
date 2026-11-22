// Marché 2000 : règle d'infiltration commune à l'arrière et aux rayons. Un guetteur (vigile, chariot, caméra) émet
// 'stealth:caught' : « REPÉRÉ ! », l'Ultra revient au début de la salle (son point de reprise), les rondes reprennent
// depuis le début. Pas de dégâts : c'est une énigme de placement (proposition, à valider en jouant).
import { TUNING } from '../../data/tuning.js';

export function infiltration(game, { T, E }) {
  let last = -99;
  E.on('stealth:caught', () => {
    const p = game.player, c = p.checkpoint;
    if (!p.alive || game.time - last < TUNING.stealth.caughtCd || !c) return;
    last = game.time;
    game.audio.play('hurt'); game.hud.banner(...T.caught, 1.6); game.camera.shake = 0.3;
    Object.assign(p, { x: c.x, z: c.z, face: c.face, vx: 0, vz: 0, target: null }); p.inv = Math.max(p.inv, 1); p.sync();
    for (const e of game.entities) e.resetPatrol?.();
    game.events.emit('stealth:reset');
  });
}
