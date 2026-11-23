// Meinau intérieur : la pelouse, au centre du stade. Boss Egboehly (hydre à 5 têtes pilotée depuis sa loge VIP) :
// assommer une tête, y planter une flèche-bannière ; 5 têtes plantées → le pilote est exposé. Défaite → fin du niveau.
const PI = Math.PI, BOSS = { x: 0, z: -4 };

export function pelouse(game, { T, W, E, say }) {
  const boss = game.spawn('egboehly', BOSS.x, BOSS.z, null, { face: -PI / 2 });
  let started = false;
  const start = game.trigger([-6, 6, 15.5, 13.5], () => {
    started = true;
    W.setGate('pelouse', false);
    game.setCheckpoint(0, 14.5, PI / 2);
    game.audio.music('boss');
    game.hud.showBoss(T.boss); game.hud.setBoss(1);
    say(['mei.boss.1', 'mei.boss.2', 'mei.boss.3'], () => boss.start());
  });
  E.on('egboehly:head', (i, state) => { if (state === 'down') game.hud.banner(T.headDown, '', 0.8); });
  E.on('boss:phase', n => { if (n === 1) say(['mei.boss.pilot']); });
  E.on('player:respawn', () => { if (started && boss.alive && boss.stateName === 'intro') boss.start(); });
  E.on('boss:defeated', b => {
    if (b !== boss) return;
    game.hud.showBoss(null); game.audio.music(null);
    say(['mei.boss.end', 'mei.end.1'], () => game.completeLevel(T.end));
  });

  E.on('debug:warp', id => { if (id === 'pelouse') start.done = false; });
}
