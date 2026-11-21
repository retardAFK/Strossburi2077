// Niveau 1 : Petite France 2077, salle 1 — ruelle en bord d'Ill puis Quartier des Tanneurs devenu
// « Food Court Premium ». DONNÉES UNIQUEMENT. Repère : x à droite, z négatif = vers le fond.
// Rectangles : [x0, x1, zHaut, zBas]. Les modèles pf_* regardent vers +x (rotY 0).
const PI = Math.PI;
const CYAN = 0x38f2ff, PINK = 0xff2e88, GOLD = 0xffc040;

export default {
  id: 'petite-france',
  bg: 0x0a0a20, fog: [14, 44],
  playerStart: { x: 0, z: -1, face: PI / 2 },

  zones: [
    { id: 'ruelle', rect: [-3.5, 7, 6, -18.5] },
    { id: 'foodcourt', rect: [-9, 9, -18.5, -42.5] },
    { id: 'terrasse', rect: [-2.5, 2.5, -42.5, -49], cam: [-9, 9, -19, -49] }
  ],
  floors: [
    { rect: [-3.5, 3, 6, -18], tex: 'paves', sky: true },          // ruelle (le quai a son propre pavage)
    { rect: [-2.5, 2.5, -18, -19], tex: 'paves', sky: true },      // seuil
    { rect: [-9, 9, -19, -42], tex: 'carrelage' },                 // food court
    { rect: [-2.5, 2.5, -42, -43], tex: 'carrelage' },
    { rect: [-2.5, 2.5, -43, -49], tex: 'paves', sky: true }       // terrasse
  ],
  // [x0, x1, z0, z1, texture]
  walls: [
    [-4, 7, 6, 7, 'gres'], [-9, -3.5, -15.5, -18, 'gres'],
    [-10, -2.5, -18, -19, 'gres'], [2.5, 10, -18, -19, 'gres'],
    [-10, -9, -19, -42, 'gres'], [9, 10, -19, -42, 'gres'],
    [-10, -2.5, -42, -43, 'gres'], [2.5, 10, -42, -43, 'gres'],
    [-3.5, -2.5, -43, -49, 'gres'], [2.5, 3.5, -43, -49, 'gres'], [-3.5, 3.5, -49, -50, 'gres']
  ],
  // collisions seules : façades des maisons (gauche), rambarde du quai (droite)
  blockers: [[-10, -3.5, 7, -15.5], [6.75, 10, 7, -18]],
  doors: [{ id: 'entree', rect: [-2.5, 2.5, -18, -19], open: true }],
  gates: [{ id: 'herse', model: 'pf_herse_laser', x: 0, z: -42.5, rotY: PI / 2, rect: [-2.5, 2.5, -42, -43] }],
  // 3 bornes « sans contact » (verrouillées jusqu'à la fin des vagues), face à l'entrée (+z)
  switches: [
    { group: 'bornes', x: -7, z: -38.5, rotY: -PI / 2, locked: true },
    { group: 'bornes', x: 0, z: -33, rotY: -PI / 2, locked: true },
    { group: 'bornes', x: 7, z: -38.5, rotY: -PI / 2, locked: true }
  ],
  tables: [{ x: -5, z: -24 }, { x: 5, z: -24, color: CYAN }, { x: -4, z: -29, color: CYAN }, { x: 4, z: -29 }],

  props: [
    // maisons à colombages, façades vers la ruelle
    { model: 'pf_maison_a', x: -4.4, z: 3.2 }, { model: 'pf_maison_b_licence', x: -4.4, z: -2.3 },
    { model: 'pf_maison_c', x: -4.4, z: -7.7 }, { model: 'pf_maison_b', x: -4.4, z: -13 },
    // quai de l'Ill (chaussée de x=3 à 7, rambarde à 6.9, l'eau au-delà)
    { model: 'pf_quai', x: 3, z: 0 }, { model: 'pf_quai', x: 3, z: -12 },
    { model: 'pf_lampadaire', x: 6.2, z: 1, rotY: PI, solid: 0.2 }, { model: 'pf_lampadaire', x: 6.2, z: -9, rotY: PI, solid: 0.2 },
    { model: 'pf_compteur', x: 6.3, z: -4.2, solid: 0.25 }, { model: 'pf_compteur', x: 6.3, z: -5.2, solid: 0.25 },
    // message holo de Celle du stade (réseau SCN), affiché quand la herse s'ouvre
    { id: 'celle', model: 'pnj_celle_du_stade', x: -4.5, z: -40.6, rotY: -PI / 2, holo: true, hidden: true }
  ],

  // écrans de commande holo (textes : TEXTS.pf.ads)
  ads: [
    { x: 0, z: -17.9, w: 4.5, y: 4.3, idx: 0 },
    { x: 6.6, z: -4.7, rotY: -PI / 2, w: 1.6, y: 2.6, idx: 3 },
    { x: -3.4, z: -10.4, rotY: PI / 2, w: 1.8, y: 2.8, idx: 2 },
    { x: -8.9, z: -25, rotY: PI / 2, idx: 1 }, { x: -8.9, z: -35, rotY: PI / 2, idx: 5 },
    { x: 8.9, z: -25, rotY: -PI / 2, idx: 4 }, { x: 8.9, z: -35, rotY: -PI / 2, idx: 1 },
    { x: -4.5, z: -41.9, w: 3, y: 4.3, idx: 4 }, { x: 5.5, z: -41.9, w: 3, y: 4.3, idx: 0 }
  ],
  neons: [
    { x: -3.45, y: 0.12, z: -5, len: 22, axis: 'z', color: PINK },
    { x: -8.9, y: 5.2, z: -30.5, len: 23, axis: 'z', color: CYAN }, { x: 8.9, y: 5.2, z: -30.5, len: 23, axis: 'z', color: PINK },
    { x: 0, y: 5.2, z: -18.9, len: 18, axis: 'x', color: GOLD },
    // cordons de file d'attente
    { x: -6.6, y: 0.9, z: -27, len: 8, axis: 'z', color: GOLD }, { x: 6.6, y: 0.9, z: -27, len: 8, axis: 'z', color: GOLD },
    { x: 0, y: 4.6, z: -41.9, len: 5, axis: 'x', color: PINK }
  ],
  lights: [
    { x: 5.4, z: 1, y: 3, color: CYAN, i: 10 }, { x: 5.4, z: -9, y: 3, color: CYAN, i: 10 },
    { x: -1.5, z: -3, color: PINK, i: 8 }, { x: 0, z: -15, color: GOLD, i: 10 },
    { x: 0, z: -24, color: PINK, i: 16, d: 18 }, { x: 0, z: -36, color: CYAN, i: 16, d: 18 },
    { x: 0, z: -46, color: GOLD, i: 10 }
  ]
};
