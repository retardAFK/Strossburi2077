// Meinau, salles 1-2 : le parvis (2 stewards-robots, tuto du scan) puis la coursive (2 stewards, terminal qui coupe
// le portique des anciens du kop parqués « zone supporters premium »).
import { BretzelBoomerang } from '../../items/BretzelBoomerang.js';

const PI = Math.PI, IN = PI / 2; // ennemis tournés vers l'entrée

export function parvis(game, { T, W, E, say }) {
  E.on('game:start', () => {
    game.audio.music('coursive');
    // niveau lancé seul (?level=meinau, sans sauvegarde) : l'Ultra a quand même le bretzel du niveau 1
    if (!game.inventory.has('boomerang')) game.inventory.give(new BretzelBoomerang(game));
    say(['mei.parvis.1', 'mei.parvis.2', 'mei.parvis.3']);
    game.spawn('steward', 4, -2, 'parvis', { face: -IN });
    game.spawn('steward', 6.5, -4.5, 'parvis', { face: -IN });
  });
  game.onGroupCleared('parvis', () => { W.setDoor('parvis', true); game.setCheckpoint(4.5, -8, IN); });

  const coursive = game.trigger([2, 7, -9, -11], () => {
    say(['mei.coursive.1']);
    game.spawn('steward', 4.5, -24, 'coursive', { face: -IN });
    game.spawn('steward', 3, -27, 'coursive', { face: -IN });
  });

  E.on('terminal:portique', () => {
    W.setGate('portique', true); W.setDoor('localIn', true);
    game.hud.banner(...T.gateOpen);
    game.setCheckpoint(4.5, -18, IN);
    say(['mei.coursive.2'], () => E.emit('pnj:hide:anciens'));
  });

  E.on('debug:warp', id => {
    if (id === 'parvis') return;
    for (const e of game.entities) if (e.isEnemy && e.alive && !e.isBoss && !e.isHydraHead) e.takeHit(99, 0, 1, 5, null);
    W.setDoor('parvis', true); coursive.done = true;
    if (id !== 'coursive') { W.setGate('portique', true); W.setDoor('localIn', true); E.emit('pnj:hide:anciens'); }
  });
}
