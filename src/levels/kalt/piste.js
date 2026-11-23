// Le Kalt intérieur : le Carré VIP BlingCo (à l'est du Main). Le carré VIP doré décolle : boss le Magnat du Carré
// VIP. En vol, rien ne le touche ; flèche court-circuit (caisses du Carré) → chute → au sol : {use}, grosse caisse de
// Dylagne (gros dégâts) ; flèche, bretzel ou écharpe y font 1 (sans Dylagne, on n'est jamais bloqué). Phases : physios.
const PI = Math.PI, HOME = { x: 24, z: -30 };

export function piste(game, { T, W, E, say, dylagne, sono }) {
  const boss = game.spawn('magnat', HOME.x, HOME.z, null, { face: PI });
  boss.home = { ...HOME };
  let started = false;
  const start = game.trigger([17.2, 19.5, -26, -34], () => {
    started = true;
    game.setCheckpoint(18.5, -30, 0); W.setDoor('piste', false);
    dylagne()?.cancelOffer(); sono()?.stop();
    game.audio.music('boss');
    game.hud.showBoss(T.boss); game.hud.setBoss(1);
    say(['kalt.boss.1', 'kalt.boss.2'], () => boss.start());
  });
  E.on('magnat:landed', b => dylagne()?.offer(b, () => b.takeDrum()));
  E.on('magnat:rise', () => dylagne()?.cancelOffer());
  E.on('boss:phase', n => {
    say([n === 1 ? 'kalt.boss.phase1' : 'kalt.boss.phase2']);
    game.spawn('physio', 20, -14, 'renforts' + n, { face: -PI / 2 });
    game.spawn('physio', 20, -46, 'renforts' + n, { face: PI / 2 });
  });
  // mort de l'Ultra : le Magnat reprend sa ronde
  E.on('player:respawn', () => { if (started && boss.alive && boss.stateName !== 'intro') boss.reset(); });
  E.on('boss:defeated', b => {
    if (b !== boss) return;
    dylagne()?.cancelOffer();
    for (const e of [...game.entities]) if (e.isEnemy && e.alive && e !== boss) e.takeHit(99, 0, 1, 5, null);
    game.hud.showBoss(null); game.audio.music(null);
    say(['kalt.boss.end', 'kalt.end.1'], () => game.completeLevel(T.end));
  });
  E.on('debug:warp', id => { if (id === 'piste') { start.done = false; W.setDoor('piste', true); } });
}
