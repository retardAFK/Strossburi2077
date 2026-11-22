// Marché 2000, salle B : le magasin côté tram. Boss le Gérant de nuit BlingCo derrière son comptoir-caisse.
// Première utilisation de Stork : quand il « encaisse », son tiroir s'ouvre → {use} : piqué de Stork (gros dégâts) ;
// flèche, bretzel ou écharpe y font 1 (sans Stork, on n'est jamais bloqué). Phases : chariots-robots en renfort.
const PI = Math.PI, BOSS = { x: 0, z: -127.5 };

export function magasin(game, { T, E, say }) {
  const boss = game.spawn('gerant', BOSS.x, BOSS.z, null, { face: -PI / 2 });
  const stork = () => game.entities.find(e => e.isStork && e.stateName !== 'nest');
  let started = false;
  const start = game.trigger([-12, 12, -106, -108.5], () => {
    started = true;
    game.setCheckpoint(0, -108, PI / 2);
    game.audio.music('boss');
    game.hud.showBoss(T.boss); game.hud.setBoss(1);
    say(['m2k.boss.1', 'm2k.boss.2'], () => boss.start());
  });
  E.on('gerant:open', b => stork()?.offer(b, () => b.takeStork()));
  E.on('gerant:close', () => stork()?.cancelOffer());
  E.on('boss:phase', n => {
    say([n === 1 ? 'm2k.boss.phase1' : 'm2k.boss.phase2']);
    game.spawn('chariot', -10, -110, 'renforts' + n, { face: 0 });
    game.spawn('chariot', 10, -110, 'renforts' + n, { face: PI });
  });
  // mort de l'Ultra : le Gérant revient au milieu de son comptoir et recommence
  E.on('player:respawn', () => {
    if (!started || !boss.alive) return;
    Object.assign(boss, { x: BOSS.x, z: BOSS.z }); if (boss.stateName !== 'die') boss.start();
  });
  E.on('boss:defeated', b => {
    if (b !== boss) return;
    stork()?.cancelOffer();
    for (const e of [...game.entities]) if (e.isEnemy && e.alive && e !== boss) e.takeHit(99, 0, 1, 5, null);
    game.hud.showBoss(null); game.audio.music(null);
    say(['m2k.boss.end', 'm2k.end.1'], () => game.completeLevel(T.end));
  });
  E.on('debug:warp', id => { if (id === 'magasin') start.done = false; });
}
