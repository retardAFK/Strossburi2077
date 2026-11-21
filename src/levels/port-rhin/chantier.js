// Port du Rhin, salle 4 : le quai du chantier. Boss le Promoteur (exosquelette-grue) : il largue ses préfabriqués,
// on les lui renvoie au gaffe-grappin, puis on tape tant qu'il est sonné. Phases : ses agents arrivent en renfort.
const PI = Math.PI, BOSS = { x: 0, z: -114 };

export function chantier(game, { T, W, E, say }) {
  const boss = game.spawn('promoteur', BOSS.x, BOSS.z, null, { face: -PI / 2 });
  let started = false;
  const start = game.trigger([-14, 14, -96, -99], () => {
    started = true;
    W.setGate('chantier', false);
    game.setCheckpoint(0, -98, PI / 2);
    game.audio.music('boss');
    game.hud.showBoss(T.boss); game.hud.setBoss(1);
    say(['prh.boss.1', 'prh.boss.2'], () => boss.start());
  });
  E.on('boss:phase', n => {
    say([n === 1 ? 'prh.boss.phase1' : 'prh.boss.phase2']);
    game.spawn('agent', -10, -104, 'renforts' + n, { face: 0 });
    game.spawn('agent', 10, -104, 'renforts' + n, { face: PI });
  });
  // mort de l'Ultra : le Promoteur retourne sur son quai et recommence à larguer
  E.on('player:respawn', () => {
    if (!started || !boss.alive) return;
    for (const e of [...game.entities]) if (e.isPrefab) e.remove();
    Object.assign(boss, { x: BOSS.x, z: BOSS.z }); if (boss.stateName !== 'die') boss.start();
  });
  E.on('boss:defeated', b => {
    if (b !== boss) return;
    for (const e of [...game.entities]) { if (e.isEnemy && e.alive && e !== boss) e.takeHit(99, 0, 1, 5, null); if (e.isPrefab) e.remove(); }
    game.hud.showBoss(null); game.audio.music(null);
    say(['prh.boss.end', 'prh.end.1'], () => game.completeLevel(T.end));
  });
  E.on('debug:warp', id => { if (id === 'chantier') start.done = false; });
}
