// Tous les réglages chiffrés du jeu (vitesses en unités/s, temps en s).
export const TUNING = {
  render: { width: 480, height: 270, fov: 55, fogNear: 14, fogFar: 40 },
  player: {
    hp: 6, speed: 8, lockSpeed: 6, radius: 0.55, invulnAfterHit: 1.0,
    roll: { speed: 15, duration: 0.38, invuln: 0.4 },
    // combo d'écharpe : 3 coups, le dernier repousse fort
    combo: [
      { dmg: 1, range: 2.7, arc: 0.3, active: [0.07, 0.18], duration: 0.28, knock: 7 },
      { dmg: 1, range: 2.7, arc: 0.3, active: [0.07, 0.18], duration: 0.28, knock: 7 },
      { dmg: 2, range: 3.0, arc: 0.0, active: [0.10, 0.24], duration: 0.42, knock: 16 }
    ],
    comboWindow: 0.35, lockRange: 18
  },
  consultant: { hp: 3, speed: 4.4, radius: 0.6, reach: 1.9, windup: 0.5, lunge: 11, lungeTime: 0.22, recover: 0.7, dmg: 1 },
  juriste: { hp: 3, speed: 3.6, radius: 0.65, keepDist: 8, throwEvery: 2.3, throwWindup: 0.5, projSpeed: 11, dmg: 1 },
  directeur: {
    hp: 12, speed: 3.0, radius: 1.3, slamWindup: 0.9, slamRange: 4.2, stunned: 1.8, dmg: 2,
    volleyEvery: 4, volleyCount: 3, summonAt: 0.5
  },
  pickup: { heal: 2, dropChance: 0.35 },
  camera: {
    dist: 7.5, height: 4.4, bossDist: 9.5, bossHeight: 5.2, followRate: 1.6, lockRate: 6, posRate: 6, minHeight: 0.6,
    // souris : sens en rad/pixel ; pitch = angle au-dessus de l'horizontale (rad) ; recenterDelay en s (0 = jamais)
    mouse: { sens: 0.0025, invertY: false, pitchMin: -0.1, pitchMax: 1.1, recenterDelay: 2.5, posRate: 18 },
    pad: { speed: 2.6, deadzone: 0.2 } // stick droit : rad/s à fond
  },
  // terminaux piratables (tous niveaux) : portée de la touche E, marqueur néon au-dessus
  terminal: {
    useRange: 2.2,
    marker: { y: 3.1, size: 0.32, bob: 0.18, bobSpeed: 3, spin: 2.2, color: 0x38f2ff },
    debugDist: 1.6 // F2 (?debug=1) : distance devant le terminal
  }
};
