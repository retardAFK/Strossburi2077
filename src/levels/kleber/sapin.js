// Place Kléber, salle 3 : le sapin-écran (décor decor_kleber), qui verrouille l'estrade. Tout l'arsenal et les deux
// compagnons : trois verrous (proposition, à valider en jouant) :
//  - le cimier logo BlingCo, tout en haut : piqué de Stork ({use}) ;
//  - le socle payant, au pied du sapin : grosse caisse de Dylagne ({use}, à moins de 6 m) ;
//  - le générateur : flèche court-circuit (caisses près de l'énigme).
// Agents à bouclier et neigeur en garde. 3 verrous → l'estrade s'ouvre.
const PI = Math.PI, SAPIN = { x: 0, z: -71 };

export function sapin(game, { T, W, E, say, stork, dylagne }) {
  let started = false, locks = 0;
  const unlock = () => {
    locks++; game.hud.banner(...T.locks(locks)); game.camera.shake = 0.4;
    if (locks === 3) { W.setDoor('estrade', true); game.setCheckpoint(0, -84, PI / 2); }
  };
  const start = () => {
    if (started) return; started = true;
    game.setCheckpoint(0, -58.5, PI / 2);
    say(['kleber.sapin.1', 'kleber.sapin.2']);
    game.spawn('bouclier', -6, -66, 'sapin', { face: -PI / 2 }); game.spawn('bouclier', 6, -66, 'sapin', { face: -PI / 2 });
    game.spawn('neigeur', 0, -82, 'sapin', { face: -PI / 2 });
    // le cimier, à 11 m de haut : le bec de Stork l'atteint
    stork()?.offer({ ...SAPIN, y: 11, storkY: 0 }, () => {
      game.particles.burst(SAPIN.x, 10, SAPIN.z, 30, 0xffc040, 8); unlock();
    });
    dylagne()?.offer(SAPIN, () => { game.particles.burst(SAPIN.x, 0.6, SAPIN.z, 24, 0x38f2ff, 6); unlock(); }, 6);
  };
  const t = game.trigger([-3, 3, -57.5, -60], start);
  E.on('projo:off', id => { if (id === 'generateur') unlock(); });

  E.on('debug:warp', id => {
    if (id === 'peages' || id === 'chalets') return;
    if (id === 'sapin') return start();
    started = t.done = true; stork()?.cancelOffer(); dylagne()?.cancelOffer();
    for (const e of game.entities) if (e.group === 'sapin' && e.alive) e.takeHit(99, 0, 1, 5, null);
    W.setDoor('estrade', true);
  });
}
