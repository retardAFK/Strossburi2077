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
  // Petite France : androïdes de BlingCo Restauration
  serveur: {
    hp: 3, speed: 4.6, radius: 0.6, reach: 1.9, windup: 0.45, lunge: 10, lungeTime: 0.22, recover: 0.7, dmg: 1,
    throwMin: 4, throwMax: 8, throwEvery: 3.2, throwWindup: 0.5, plateSpeed: 9, trayBack: 1.4
  },
  sommelier: { hp: 3, speed: 3.4, radius: 0.6, keepDist: 8, fireRange: 15, fireEvery: 2.8, windup: 0.45, burst: 2, burstGap: 0.2, corkSpeed: 16, dmg: 1 },
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
  },
  // interrupteurs d'énigme (bornes...) : portée de E, couleurs du voyant, clignotement (Hz x 2π)
  switches: { useRange: 2.2, onColor: 0x38f2ff, offColor: 0xffc040, blinkSpeed: 6 },
  puzzle: { pfBornesTime: 6, pfCiblesTime: 9 }, // Petite France : 3 bornes en 6 s (salle 1), 3 cibles en 9 s (salle 4)
  plaque: { useRange: 2.2, glitchTime: 1.2 }, // plaques historiques : portée de E, durée du glitch (s)
  water: { speed: 0.6 }, // montée / descente de l'eau (m/s)
  // barque-plateforme : vitesse (m/s), demi-longueur / demi-largeur du pont, hauteur du pont au-dessus de l'eau
  boat: { speed: 3.2, halfLen: 1.5, halfWid: 0.65, deck: 0.3, useRange: 2.4, helmBias: 2 }, // helmBias : priorité basse de « larguer »
  lever: { useRange: 2.2, armAngle: 0.55 }, // leviers / vannes : portée de E, débattement du levier (rad)
  pnj: { useRange: 2.6 },
  chest: { useRange: 2.2, lidAngle: 1.8 },
  // bretzel-boomerang : portée (m), vitesse (m/s), courbe latérale (m), rayon de touche, retour (m), durée max (s)
  // cibles-TPE : couleurs des clés (ordre des néons)
  targets: { colors: { rouge: 0xff1a3c, or: 0xffc040, cyan: 0x38f2ff } },
  boomerang: { range: 11, speed: 15, curve: 1.6, radius: 0.55, catch: 0.9, maxTime: 4, height: 1.2, spin: 18, scale: 0.6, dmg: 1, knock: 6 },
  // Videur-Maître d'hôtel : garde de face (cos de l'angle), recul subi réduit, repousse l'Ultra quand il bloque
  videur: { hp: 10, radius: 0.85, scale: 1.4, guard: 0.35, knockTaken: 0.3, pushBack: 7 }
};
