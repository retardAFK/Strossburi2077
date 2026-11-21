// Niveau 1 : événements scénarisés (vagues, portes, laser, boss).
export default function script(game) {
  const T = game.texts, W = game.world;

  game.events.on('game:start', () => {
    game.audio.music('coursive');
    game.say(T.intro);
    game.spawn('consultant', -4, -10, 'entree');
    game.spawn('consultant', 4, -11, 'entree');
    game.spawn('consultant', 0, -12.5, 'entree');
  });

  game.onGroupCleared('entree', () => {
    W.setDoor('entree', true);
    game.hud.banner('PASSAGE OUVERT', 'direction la coursive');
    game.say(T.entreeCleared);
    game.setCheckpoint(0, -12, Math.PI / 2);
  });

  game.trigger([-5, 5, -15.5, -20], () => {
    game.spawn('consultant', -2.5, -27, 'coursiveA');
    game.spawn('consultant', 2, -29, 'coursiveA');
    game.spawn('juriste', 0, -31.5, 'coursiveA');
  });

  game.trigger([-5, 5, -27, -33], () => game.say(T.laser));

  game.events.on('terminal:laser', () => {
    W.setLaser('premium', false);
    game.say(T.laserOff);
    game.setCheckpoint(0, -31, Math.PI / 2);
    game.spawn('juriste', -3, -44, 'coursiveB');
    game.spawn('juriste', 3, -46, 'coursiveB');
    game.spawn('consultant', 0, -41, 'coursiveB');
  });

  // salon VIP : le rideau tombe derrière l'Ultra, le Directeur entre en scène
  let boss = null;
  game.trigger([-10, 10, -55, -60], () => {
    W.setDoor('vip', false);
    game.setCheckpoint(0, -56, Math.PI / 2);
    boss = game.spawn('directeur', 0, -70, null, { face: -Math.PI / 2 });
    game.audio.music('boss');
    game.hud.showBoss('LE DIRECTEUR DE LA VALORISATION');
    game.hud.setBoss(1);
    game.say(T.bossIntro, () => boss.setState('walk'));
  });

  game.events.on('player:respawn', () => {
    if (boss && boss.alive) { boss.hp = boss.maxHp; boss.x = 0; boss.z = -70; boss.setState('walk'); game.hud.setBoss(1); }
  });

  game.events.on('boss:defeated', () => {
    game.audio.music(null);
    game.hud.showBoss(null);
    game.player.target = null;
    for (const e of game.entities) if (e.isEnemy && e.alive && !e.isBoss) e.takeHit(99, 0, 1, 5, null);
    game.say(T.bossDefeat, () => { W.setDoor('sortie', true); game.hud.banner('LA TRIBUNE VOUS ATTEND'); });
  });

  game.trigger([-2.5, 2.5, -77, -80], () => game.win());
}
