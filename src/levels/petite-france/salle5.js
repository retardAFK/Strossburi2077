// Petite France, salle 5 : l'ASR-67 dans la cuisine automatisée sous le barrage, puis le cliffhanger :
// SCN révèle que tout commence en 2026, l'Ultra est branché de force sur le Serveur central,
// arrivée « Strasbourg, 2026 » devant la Meinau, « À suivre », teaser, titre.
import { Flames } from '../../entities/props/Flames.js';
import { TUNING } from '../../data/tuning.js';

const PI = Math.PI;
const OVEN = { x: 52, z: -163 }, BOSS = { x: 52, z: -169 }, START = { x: 52, z: -153 };

export function salle5(game, { T, W, E }) {
  let boss = null, flames = null;
  const A = T.asr;

  // descente dans la cuisine : fondu, téléportation, entrée du boss
  const start = () => {
    E.emit('hud:fade', 1);
    const p = game.player;
    Object.assign(p, { x: START.x, z: START.z, face: PI / 2, vx: 0, vz: 0, target: null });
    game.camera.snapBehind(p.face);
    game.setCheckpoint(START.x, START.z, PI / 2);
    boss = game.spawn('asr', BOSS.x, BOSS.z, null, { face: -PI / 2 });
    game.audio.music('boss');
    game.hud.showBoss(A.name); game.hud.setBoss(1);
    setTimeout(() => E.emit('hud:fade', 0), 400);
    game.say(A.intro, () => boss.setState('walk'));
  };
  E.on('pf:boss', start);

  E.on('boss:phase', n => {
    if (n === 1) {
      game.say(A.phase2hint);
      for (const dx of [-6, 6]) game.spawn('serveur', BOSS.x + dx, BOSS.z + 2, 'renforts', { face: -PI / 2 });
    }
    if (n === 2 && !flames) {
      const F = TUNING.asr.flames;
      flames = game.add(new Flames(game, { ...OVEN, ...F, dmg: TUNING.asr.dmg }));
    }
  });

  // mort de l'Ultra pendant le combat : la réplique du boss, il retourne à son poste
  E.on('player:respawn', () => {
    if (!boss || !boss.alive) return;
    game.bubble(boss, A.playerDeath, 3);
    Object.assign(boss, { x: BOSS.x, z: BOSS.z }); boss.setState('walk');
  });

  // défaite : SCN apparaît en hologramme, puis le cliffhanger
  E.on('boss:defeated', b => {
    if (b !== boss) return;
    flames?.remove(); flames = null;
    for (const e of [...game.entities]) if (e.isEnemy && e.alive && e !== boss) e.takeHit(99, 0, 1, 5, null);
    game.hud.showBoss(null); game.audio.music(null);
    game.say(A.defeat, () => {
      W.setPropVisible('celle5', true); W.setPropVisible('celui5', true);
      game.say(T.cliff, cliffhanger);
    });
  });

  // l'Ultra est branché de force sur le Serveur central → 2026 → « À suivre »
  const cliffhanger = () => {
    boss?.remove(); // l'épave de l'ASR-67 quitte la scène
    const p = game.player; // branché de force : l'Ultra est collé au Serveur central
    Object.assign(p, { x: 52, z: -173.4, face: -PI / 2, vx: 0, vz: 0, target: null }); p.sync();
    E.emit('hud:glitch', true); game.audio.play('laser'); game.camera.shake = 0.6;
    game.playCutscene([
      { from: [52, 3, -160], to: [52, 2.2, -168], look: [52, 2, -175], dur: 3.5 },
      { from: [52, 2.2, -168], to: [52, 2, -172.5], look: [52, 3, -175], dur: 2.5 }
    ], T.cliffGlitch.map((txt, i) => ({ at: i * 3, txt })), () => {
      E.emit('hud:glitch', false);
      game.playCutscene([{ from: [120, 1.8, -164], to: [120, 2.6, -169], look: [120, 6.5, -182], dur: 9 }],
        T.arrival.map((txt, i) => ({ at: 0.8 + i * 4, txt })), finale);
    });
  };
  const finale = () => {
    E.emit('hud:fade', 1);
    game.playCutscene([{ from: [120, 2.6, -169], look: [120, 6.5, -182], dur: 13 }],
      T.finale.map((txt, i) => ({ at: 0.6 + i * 4, txt })), () => game.win(T.end));
  };

  // debug F2 'salle5' : directement dans la cuisine
  E.on('debug:warp', id => { if (id === 'salle5') start(); });
}
