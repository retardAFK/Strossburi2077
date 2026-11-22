// Le Kalt, salle B : la piste. Le carré VIP doré posé au milieu décolle : boss le Magnat du Carré VIP. En vol, rien ne
// le touche ; flèche court-circuit (caisses à l'entrée de la piste) → chute → au sol : {use}, grosse caisse de Dylagne
// (gros dégâts) ; flèche, bretzel ou écharpe y font 1 (sans Dylagne, on n'est jamais bloqué). Phases : physios en renfort.
const PI = Math.PI, HOME = { x: 0, z: -105 };

export function piste(game, { T, W, E, say, dylagne, sono }) {
  const boss = game.spawn('magnat', 5.8, -113.4, null, { face: -PI / 2 }); // posé sur le carré VIP du décor
  boss.home = { ...HOME };
  let started = false;
  const start = game.trigger([-14, 14, -91.5, -94], () => {
    started = true;
    game.setCheckpoint(0, -93, PI / 2); W.setDoor('piste', false);
    dylagne()?.cancelOffer(); sono()?.stop();
    // le carré VIP du décor, c'est le sien : il décolle
    W.props.dj?.traverse(o => { if (/^carre_vip_decor/.test(o.name)) o.visible = false; });
    game.audio.music('boss');
    game.hud.showBoss(T.boss); game.hud.setBoss(1);
    say(['kalt.boss.1', 'kalt.boss.2'], () => boss.start());
  });
  E.on('magnat:landed', b => dylagne()?.offer(b, () => b.takeDrum()));
  E.on('magnat:rise', () => dylagne()?.cancelOffer());
  E.on('boss:phase', n => {
    say([n === 1 ? 'kalt.boss.phase1' : 'kalt.boss.phase2']);
    game.spawn('physio', -10, -97, 'renforts' + n, { face: 0 });
    game.spawn('physio', 10, -97, 'renforts' + n, { face: PI });
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
