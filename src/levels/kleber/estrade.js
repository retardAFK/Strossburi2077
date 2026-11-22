// Place Kléber, salle B : l'estrade de la signature. Boss Marco CeKlair : son attelage fonce, s'encastre dans les murs
// (esquiver) ; sonné → {use} : piqué de Stork ou grosse caisse de Dylagne ; flèche, bretzel, écharpe : 1.
// Puis la fin de la partie 1 (décision : PARADOXE, docs/designs/niveau-kleber.md) : faux final (tout le monde revient,
// « Strasbourg libérée ») → glitch → SCN : en battant Marco en 2026, l'Ultra a changé le passé, le futur s'est
// recalculé en pire → « 2067… recalculé » → « À suivre ».
import { TUNING } from '../../data/tuning.js';

const PI = Math.PI, HOME = { x: 0, z: -112 };

export function estrade(game, { T, W, E, say, stork, dylagne }) {
  const boss = game.spawn('marco', HOME.x, HOME.z, null, { face: -PI / 2 });
  const both = f => { const s = stork(), d = dylagne(); if (s) f(s, 'takeStork'); if (d) f(d, 'takeDrum'); };
  let started = false;
  const start = game.trigger([-16, 16, -88, -90.5], () => {
    started = true;
    game.setCheckpoint(0, -89, PI / 2); W.setDoor('estrade', false);
    both(c => c.cancelOffer());
    game.audio.music('boss');
    game.hud.showBoss(T.boss); game.hud.setBoss(1);
    say(['kleber.boss.1', 'kleber.boss.2'], () => boss.start());
  });
  // sonné : les deux compagnons proposent leur coup
  E.on('marco:dazed', b => both((c, hit) => c.offer(b, () => b[hit]())));
  E.on('marco:recover', () => both(c => c.cancelOffer()));
  E.on('boss:phase', n => {
    say([n === 1 ? 'kleber.boss.phase1' : 'kleber.boss.phase2']);
    game.spawn('peagiste', -12, -95, 'renforts' + n, { face: 0 });
    game.spawn(n === 1 ? 'neigeur' : 'bouclier', 12, -95, 'renforts' + n, { face: PI });
  });
  E.on('player:respawn', () => { if (started && boss.alive && boss.stateName !== 'intro') boss.reset(HOME.x, HOME.z); });
  E.on('boss:defeated', b => {
    if (b !== boss) return;
    both(c => c.cancelOffer());
    for (const e of [...game.entities]) if (e.isEnemy && e.alive && e !== boss) e.takeHit(99, 0, 1, 5, null);
    game.hud.showBoss(null); game.audio.music(null);
    say(['kleber.boss.end'], fakeEnd);
  });
  // faux final : tout le monde revient sur la place
  const fakeEnd = () => {
    for (let i = 0; i < 4; i++) E.emit('pnj:show:foule' + i);
    game.audio.play('win'); game.hud.banner(...T.fakeEnd);
    say(['kleber.fin.1'], () => game.playCutscene(
      [{ from: [0, 3, -86], to: [0, 4, -90], look: [0, 1.5, -100], dur: TUNING.kleber.fakeEnd }], [], glitch));
  };
  // le paradoxe : glitch, SCN rappelle l'Ultra, « 2067… recalculé », « À suivre »
  const glitch = () => {
    E.emit('hud:glitch', true); game.audio.play('laser'); game.camera.shake = 0.8;
    say(['kleber.fin.2', 'kleber.fin.3'], () => game.playCutscene(
      [{ from: [0, 4, -90], to: [0, 12, -96], look: [0, 6, -112], dur: 6 }],
      T.glitch.map((txt, i) => ({ at: 0.5 + i * 2.5, txt })),
      () => { E.emit('hud:glitch', false); E.emit('hud:fade', 1); game.completeLevel(T.end); }));
  };
  E.on('debug:warp', id => { if (id === 'estrade') { start.done = false; W.setDoor('estrade', true); } });
}
