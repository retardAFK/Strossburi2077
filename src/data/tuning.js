// Tous les réglages chiffrés du jeu (vitesses en unités/s, temps en s).
export const TUNING = {
  // manette (disposition standard) : zone morte radiale, courbe de réponse (>1 = plus doux au centre),
  // vibrations : activées par défaut, déclenchées quand la secousse caméra dépasse rumbleFrom
  pad: { deadzone: 0.18, curve: 1.6, rumble: true, rumbleFrom: 0.25, rumbleMs: 160 },
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
    pad: { speed: 2.6 }, // stick droit : rad/s à fond (sensibilité séparée de la souris)
    // visée de l'arc (vue par-dessus l'épaule) : recul (m), hauteur au-dessus des pieds, décalage à droite,
    // sensibilité (x souris / stick), angle vertical min / max / de départ (rad, + = vers le haut), lissage
    aim: { dist: 3.4, height: 2.4, side: 1.1, sens: 0.7, pitchMin: -0.45, pitchMax: 0.6, pitch0: -0.08, posRate: 14 }
  },
  // tactile (core/Touch.js) : rayon du joystick (px CSS), zone morte (0..1), sensibilité caméra (multiplie
  // les pixels glissés avant camera.mouse.sens), toucher = glisser de moins de tapMove px en moins de tapTime ms
  touch: { stickRadius: 56, deadzone: 0.15, lookSens: 1.8, tapMove: 14, tapTime: 300 },
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
  boomerang: { range: 11, speed: 15, curve: 0.7, radius: 0.55, catch: 0.9, maxTime: 4, height: 1.2, spin: 18, scale: 0.6, dmg: 1, knock: 6 },
  // Arc-Drapeau (docs/decisions.md, 21/11/2026 : valeurs de départ à régler dans le bac à sable)
  // cadence (s), portée (m), vitesse des flèches (m/s), rayon de touche, dégâts, recul, vitesse en visée (x vitesse
  // normale), flèche plantée visible (s), munitions max par flèche spéciale, hauteur de départ des flèches.
  // back : arc sur le dos (repère Blender, pieds à l'origine, rotation en degrés ordre ZXY, cf. docs/designs/arc-drapeau.md),
  // hand : arc en main pendant la visée (repère du modèle de l'Ultra, Y en haut, +X devant).
  arc: {
    cooldown: 0.6, range: 25, speed: 40, radius: 0.12, dmg: 1, knock: 3, aimSpeed: 0.5, stuck: 1.5, ammoMax: 10, height: 1.5,
    shotPose: 0.35, // s : l'arc reste en main après un tir sans visée
    back: { pos: [-0.42, 0.12, 1.6], rot: [32, 0, 90], torsoZ: 1.02 },
    hand: { pos: [0.55, 1.4, 0.22] }
  },
  // ASR-67 (boss du niveau 1) : PV, seuils de phase, cadence, tickets, plats brûlants, charge, flammes du four
  asr: {
    hp: 24, phases: [0.66, 0.33], radius: 0.9, speed: 2.6, turn: 2.2, attackEvery: 2.6, dmg: 1, stunned: 2.2, recover: 0.7,
    tickets: 5, ticketSpread: 0.22, ticketSpeed: 10, ticketWindup: 0.6,
    plates: 3, plateGap: 0.45, plateRadius: 1.4, plateWarn: 0.9, plateLife: 2.6, plateJitter: 3,
    chargeWindup: 0.8, chargeSpeed: 13, chargeTime: 1.3, pillarReach: 1.3,
    flames: { arms: 3, length: 9, speed: 0.7, width: 0.45 }
  },
  // Videur-Maître d'hôtel : pare tout sauf le bretzel, qui l'assomme stun (s) ; recul subi réduit,
  // repousse l'Ultra quand il pare ; rappel de la winstubière au bout de hintAfter parades
  videur: { hp: 10, radius: 0.85, scale: 1.4, stun: 2.6, knockTaken: 0.3, pushBack: 7, hintAfter: 3 },
  // ---------------------------------------------------------------- partie 1 (socle) : sbires, flèches spéciales, caisses
  // sbires (kit générique entities/enemies/Sbire.js) : vision (portée, cône en cos, ouïe), vitesses, attaque
  sbires: {
    // Robot-Steward (Meinau 2026) : robot (court-circuit l'étourdit) ; s'arrête parfois pour scanner un pigeon
    steward: { hp: 3, radius: 0.5, height: 2.2, speed: 2, runSpeed: 4.2, wander: 4, view: 10, fov: 0.55, hear: 2.5,
      alertTime: 0.7, lose: 2.5, reach: 1.9, windup: 0.6, attack: 'lunge', lunge: 9, attackTime: 0.22, recover: 0.8, dmg: 1,
      robot: true, scanEvery: 7, scanTime: 2 },
    // agent immobilier-clone (Port du Rhin 2026) : plante des pancartes VENDU (TUNING.agentImmo)
    agent: { hp: 3, radius: 0.45, height: 1.9, speed: 2.3, runSpeed: 4.6, wander: 4, view: 10, fov: 0.5, hear: 2.5,
      alertTime: 0.6, lose: 2.5, reach: 1.8, windup: 0.5, attack: 'lunge', lunge: 10, attackTime: 0.22, recover: 0.8, dmg: 1 },
    // robot-vigile à lampe (Marché 2000) : guetteur (litView : portée quand l'Ultra est sous un néon allumé)
    vigile: { hp: 3, radius: 0.5, height: 2, speed: 1.8, runSpeed: 4.2, wander: 3, view: 7, fov: 0.82, hear: 1.2, litView: 13,
      alertTime: 1, lose: 2.5, reach: 1.9, windup: 0.6, attack: 'lunge', lunge: 9, attackTime: 0.22, recover: 0.8, dmg: 1, robot: true },
    // chariot-robot de rayon (Marché 2000) : guetteur à scanner court, rapide
    chariot: { hp: 2, radius: 0.55, height: 1.2, speed: 2.4, runSpeed: 5, wander: 3, view: 5.5, fov: 0.85, hear: 1, litView: 0,
      alertTime: 1, lose: 2, reach: 1.7, windup: 0.5, attack: 'lunge', lunge: 11, attackTime: 0.2, recover: 0.9, dmg: 1, robot: true },
    test: { hp: 3, radius: 0.55, height: 1.9, speed: 2.2, runSpeed: 4.4, wander: 4, view: 11, fov: 0.5, hear: 2.5,
      alertTime: 0.6, lose: 2.5, reach: 1.9, windup: 0.5, attack: 'lunge', lunge: 10, attackTime: 0.22, recover: 0.7, dmg: 1, robot: true },
    testTireur: { hp: 3, radius: 0.55, height: 1.9, speed: 2, runSpeed: 3.6, wander: 3, view: 13, fov: 0.45, hear: 2.5,
      alertTime: 0.6, lose: 2.5, attack: 'shoot', shootRange: 9, windup: 0.6, attackTime: 0.3, recover: 1.2, projSpeed: 11, dmg: 1 }
  },
  // effets des flèches spéciales (entities/props/arrowEffects.js)
  arrowFx: {
    smoke: { radius: 3.2, life: 6, blind: 0.5 },   // fumigène : rayon (m), durée (s), aveuglement entretenu (s)
    short: { radius: 2.5, stun: 3 },               // court-circuit : rayon, étourdissement des robots (s)
    fire: { radius: 1.8, dmg: 1 }                  // enflammée : rayon, dégâts aux sbires
  },
  crates: { amount: 3, respawn: 8, useRange: 2.2 }, // caisses de flèches : quantité, réapparition (s), portée de E
  // ---------------------------------------------------------------- niveau 2 : la Meinau (2026)
  // tifo : couleurs des 5 crochets (ordre de la séquence montrée sur l'écran géant), durée d'une couleur à l'écran
  tifo: { colors: [0x1f5fd0, 0xf4f6ff, 0xd01a2a, 0xffd23f, 0x2ab04a], show: 0.9, pause: 2.2, arrowsAtLocal: 5, time: 600 },
  // Egboehly : 5 têtes (PV, morsure télégraphiée, repousse sauf bannière plantée), puis le pilote exposé
  egboehly: {
    headHp: 3, headRadius: 0.9, biteEvery: 2.6, aimTime: 0.8, biteTime: 0.45, biteReach: 6, recover: 1.1, dmg: 1,
    regrow: 7, spitEvery: 5, spitSpeed: 9, pilotHp: 6, pilotStun: 2.5, scale: 1.25
  },
  // ---------------------------------------------------------------- niveau 3 : Port du Rhin (2026)
  // gaffe-grappin : portée, vitesses (aller, retour, Ultra tiré vers un anneau), recharge, étourdissement des sbires tirés
  gaffe: { range: 13, speed: 28, back: 34, zip: 15, cooldown: 0.3, height: 1.3, hitR: 0.7, enemyPull: 5, stun: 1.6,
    hand: { pos: [0.15, 1.05, 0.35] }, scale: 1 },
  // objets qu'on tire au grappin (conteneurs, caisses) : pas par traction (m), vitesse de glissement
  pull: { step: 4, speed: 7 },
  // agent immobilier-clone : pancartes VENDU plantées (toutes les n s, max par agent), pancarte sur l'Ultra (s)
  agentImmo: { plantEvery: 6, plantMax: 2, onPlayer: 6 },
  // le Promoteur : PV, marche, largage de préfabriqués (télégraphe au sol, chute, durée au sol), renvoi au grappin
  promoteur: {
    hp: 9, scale: 1.4, speed: 1.6, dropEvery: 3.2, aimTime: 1.1, fallTime: 0.7, prefabLife: 7, prefabScale: 2.4,
    prefabR: 1.6, dropDmg: 1, returnDmg: 2, returnSpeed: 18, stun: 3, phases: [0.66, 0.33], phaseDrops: [1, 2, 3],
    agentsAt: [1, 2], contact: 1
  },
  // ---------------------------------------------------------------- niveau 4 : Marché 2000 (2026, la nuit)
  // néons de la cour : rayon du disque éclairé (m) · caméras-scanners : portée, demi-cône (cos), vitesse du balayage,
  // délai entre deux « repéré ! », coupure par la flèche court-circuit (s)
  neonCour: { radius: 3.2 },
  camScan: { range: 7, fov: 0.93, speed: 0.6, cooldown: 2, short: 8 },
  // infiltration : délai minimal entre deux « repéré ! » (s)
  stealth: { caughtCd: 1.5 },
  // Stork (version événement du Marché 2000) : taille, vitesses (envol, suivi, piqué)
  stork: { scale: 0.85, fly: 9, follow: 7, dive: 18 },
  // le Gérant de nuit : PV, glisse derrière le comptoir, étiquettes x10 (visée, écart, rafale par phase, vitesse,
  // distance de départ devant le comptoir), scanner (portée, demi-cône en cos, arc de balayage, durée par phase),
  // tiroir ouvert (s), piqué de Stork, étourdissement
  gerant: {
    hp: 9, scale: 1.6, speed: 2.2, glideRange: 6, attackEvery: 2.4, dmg: 1, phases: [0.66, 0.33],
    labelAim: 0.6, labelGap: 0.12, labelSpread: 0.22, labels: [3, 5, 7], labelSpeed: 10, labelFrom: 3.8,
    scanRange: 22, scanCos: 0.995, scanArc: 1.1, scanTime: [2.6, 2.2, 1.8],
    openTime: 3.5, storkDmg: 3, stun: 2.5
  }
};
