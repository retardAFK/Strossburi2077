// Niveau 1 : Petite France (futur). DONNÉES UNIQUEMENT.
// Salle 1 : ruelle en bord d'Ill puis Quartier des Tanneurs devenu « Food Court Premium » (z 6 → -52).
// Salle 2 : l'Écluse, canal à 3 niveaux d'eau, barque, pont bas, quai haut (z -52 → -104).
// Salle 3 : les Ponts Couverts « Péage Patrimoine », arène entre les tours, coffre, borne sur pile (z -104 → -150).
// Salle 4 : le Barrage Vauban « Rooftop Premium », cibles-TPE derrière vitres, écran du PDG (z -150 → -175). Repère : x à droite, z négatif = vers le fond.
// Rectangles : [x0, x1, zHaut, zBas]. Les modèles pf_* regardent vers +x (rotY 0).
const PI = Math.PI;
const CYAN = 0x38f2ff, PINK = 0xff2e88, GOLD = 0xffc040;

export default {
  id: 'petite-france',
  bg: 0x0a0a20, fog: [14, 44],
  playerStart: { x: 0, z: -1, face: PI / 2 },

  // ouverture (~45 s) : survol de nuit, de l'Ill jusqu'au food court. Un sous-titre par plan (TEXTS.pf.opening).
  opening: {
    shots: [
      { from: [26, 16, 18], to: [18, 12, 4], look: [4, 1, -6], lookTo: [2, 1, -12], dur: 9 },
      { from: [12, 3, 6], to: [9, 2.6, -14], look: [-3, 3, -2], lookTo: [-3, 3, -18], dur: 9 },
      { from: [0, 2.2, 5], to: [0, 3, -14], look: [0, 2.5, -10], lookTo: [0, 3.5, -30], dur: 9 },
      { from: [0, 8, -14], to: [0, 20, -30], look: [0, 3, -22], lookTo: [0, 0, -36], dur: 9 },
      { from: [-16, 14, -46], to: [16, 18, -6], look: [0, 1, -22], lookTo: [0, 1, -18], dur: 9 }
    ],
    captionAt: [0.5, 9, 18, 27, 36]
  },

  // debug F2 (?debug=1) : points de passage, dans l'ordre du niveau (le script remet chaque salle en état)
  warps: [
    { id: 'salle1-enigme', x: 0, z: -30, face: PI / 2 }, { id: 'salle2', x: 0, z: -55, face: PI / 2 },
    { id: 'salle3', x: 12, z: -105, face: PI / 2 }, { id: 'salle3-coffre', x: 12, z: -124, face: PI / 2 },
    { id: 'salle4', x: 12, z: -146, face: PI / 2 }
  ],

  // plaque historique holo (textes : TEXTS.pf.plaques)
  plaques: [{ id: 'p1', x: -2.6, z: -15.6, rotY: 0 }, { id: 'p2', x: 14, z: -89, rotY: -PI / 2 },
    { id: 'p3', x: 7.5, z: -133, rotY: 0 }, { id: 'p4', x: 2.2, z: -153, rotY: 0 }],

  zones: [
    { id: 'ruelle', rect: [-3.5, 7, 6, -18.5] },
    { id: 'foodcourt', rect: [-9, 9, -18.5, -42.5] },
    { id: 'terrasse', rect: [-2.5, 2.5, -42.5, -52], cam: [-9, 9, -19, -52] },
    { id: 'ecluse', rect: [-8, 2, -52, -68], cam: [-8, 8.5, -50, -70] },
    { id: 'canal', rect: [2, 8, -52, -100], cam: [-1.5, 12, -52, -100] },
    { id: 'quaiHaut', rect: [8, 16, -85, -104], cam: [2, 16, -80, -104] },
    { id: 'peage', rect: [9, 15, -104, -112], cam: [2, 22, -100, -136] },
    { id: 'ponts', rect: [2, 22, -112, -136.5] },
    { id: 'sortie3', rect: [9, 15, -136.5, -150], cam: [2, 22, -112, -150] },
    { id: 'barrage', rect: [0, 24, -150, -171], cam: [0, 24, -146, -171] }
  ],
  floors: [
    { rect: [-3.5, 3, 6, -18], tex: 'paves', sky: true },          // ruelle (le quai a son propre pavage)
    { rect: [-2.5, 2.5, -18, -19], tex: 'paves', sky: true },      // seuil
    { rect: [-9, 9, -19, -42], tex: 'carrelage' },                 // food court
    { rect: [-2.5, 2.5, -42, -43], tex: 'carrelage' },
    { rect: [-2.5, 2.5, -43, -52], tex: 'paves', sky: true },      // terrasse
    { rect: [-8, 2, -52, -68], tex: 'paves', sky: true },          // écluse : quai A (ponton)
    { rect: [-1.5, 2, -68, -100], tex: 'paves', sky: true },       // berge ouest (décor)
    { rect: [8, 12, -52, -85], tex: 'paves', sky: true },          // berge est (décor)
    { rect: [8, 16, -85, -100], tex: 'paves', sky: true },         // quai haut B
    { rect: [10, 14, -100, -112], tex: 'paves', sky: true },       // vers les Ponts Couverts
    { rect: [2, 22, -112, -136], tex: 'paves', sky: true },        // arène du péage
    { rect: [10, 14, -136, -150], tex: 'paves', sky: true },       // sortie vers le barrage
    { rect: [0, 24, -150, -171], tex: 'paves', sky: true }         // toit-terrasse du barrage
  ],
  // [x0, x1, z0, z1, texture]
  walls: [
    [-4, 7, 6, 7, 'gres'], [-9, -3.5, -15.5, -18, 'gres'],
    [-10, -2.5, -18, -19, 'gres'], [2.5, 10, -18, -19, 'gres'],
    [-10, -9, -19, -42, 'gres'], [9, 10, -19, -42, 'gres'],
    [-10, -2.5, -42, -43, 'gres'], [2.5, 10, -42, -43, 'gres'],
    [-3.5, -2.5, -43, -52, 'gres'], [2.5, 3.5, -43, -52, 'gres'],
    // écluse
    [-9, -3.5, -51, -52, 'gres'], [3.5, 13, -51, -52, 'gres'], [-9, -8, -52, -68, 'gres'], [-9, -1.5, -68, -69, 'gres'],
    [1.5, 8, -100, -101, 'gres'], [12, 17, -84, -85, 'gres'], [16, 17, -85, -100, 'gres'],
    [8, 10, -100, -101, 'gres'], [14, 17, -100, -101, 'gres'],
    [9, 10, -100, -108, 'gres'], [14, 15, -100, -108, 'gres'],
    // ponts couverts : sortie
    [9, 10, -137.5, -150, 'gres'], [14, 15, -137.5, -150, 'gres']
  ],
  // collisions seules : façades des maisons (gauche), rambarde du quai (droite)
  blockers: [[-10, -3.5, 7, -15.5], [6.75, 10, 7, -18], [-9, 2, -68, -100], [8, 20, -52, -85],
    // tours de péage (entrée et sortie de l'arène) et bords de l'arène
    [3.4, 9.6, -107.9, -114.1], [14.4, 20.6, -107.9, -114.1], [3.4, 9.75, -133.9, -140.1], [14.25, 20.6, -133.9, -140.1],
    [1, 3.4, -111, -114], [20.6, 23, -111, -114], [1, 3.4, -136, -139], [20.6, 23, -136, -139],
    // barrage : bords nord, garde-corps est / ouest, arches au sud
    [-1, 10, -149, -150], [14, 25, -149, -150], [-1, 0, -150, -172], [24, 25, -150, -172], [-1, 25, -168.3, -176]],
  // mur vitré « anti-écharpe » devant les cibles (le bretzel passe au-dessus), ouverture fermée par la herse 4
  glass: [[0, 18.25, -163.5, -163.7], [22.75, 24, -163.5, -163.7]],
  // canal de l'écluse : 3 niveaux d'eau (y), départ au niveau moyen
  waters: [
    { id: 'eau', rect: [2, 8, -52, -100], levels: [-1.7, -1.0, -0.3], start: 1 },
    { id: 'ill-ouest', rect: [-8, 2, -104, -142], levels: [-1.2] }, { id: 'ill-est', rect: [22, 32, -104, -142], levels: [-1.2] },
    { id: 'ill-barrage-o', rect: [-10, -1, -146, -176], levels: [-3] }, { id: 'ill-barrage-e', rect: [25, 34, -146, -176], levels: [-3] }
  ],
  // pile de pont (décor) qui porte la borne hors de portée de l'écharpe
  blocks: [{ x: 27, z: -130, w: 1.8, d: 1.8, h: 1.25, y: -1.25 }],
  // objets génériques (types du registre) : barque, levier, vanne, PNJ
  objects: [
    { type: 'barque', water: 'eau', x: 5, start: 0, stops: [
      { id: 'ponton', z: -60, dock: { x: 2, side: -1, levels: [0, 1] } },
      { id: 'pont', z: -65, pass: 0 },                                   // pont bas : eau au plus bas pour passer
      { id: 'vanne', z: -80 },
      { id: 'quai', z: -92, dock: { x: 8, side: 1, levels: [2] } }       // quai haut : eau au plus haut
    ] },
    { type: 'lever', id: 'levier', model: 'pf_levier', x: 0.8, z: -56.5, rotY: 0, prompt: 'lever' },
    { type: 'lever', id: 'vanne', model: 'pf_vanne', x: 7.4, z: -80, rotY: PI, prompt: 'valve', fromBoat: true, solid: 0 },
    { type: 'pnj', id: 'winstubiere', model: 'pnj_winstubiere', x: -5, z: -62, rotY: 0 },
    // ponts couverts : la winstubière revient avec les commerçants, le coffre du péage
    { type: 'pnj', id: 'winstubiere3', model: 'pnj_winstubiere', x: 14.6, z: -128.6, rotY: -PI / 2, hidden: true },
    { type: 'coffre', id: 'peage', x: 12, z: -129, rotY: -PI / 2 },
    // barrage : 3 cibles-TPE derrière les vitres (ordre des néons : rouge, or, cyan ; placées dans un autre ordre)
    { type: 'cible', group: 'cibles', key: 'cyan', x: 4, z: -166, rotY: -PI / 2 },
    { type: 'cible', group: 'cibles', key: 'rouge', x: 9.5, z: -166, rotY: -PI / 2 },
    { type: 'cible', group: 'cibles', key: 'or', x: 15, z: -166, rotY: -PI / 2 }
  ],
  // écran géant du PDG au-dessus des arches (caché jusqu'à son apparition)
  screens: [{ id: 'pdg', x: 12, y: 10.2, z: -170, w: 9, hidden: true }],
  doors: [{ id: 'entree', rect: [-2.5, 2.5, -18, -19], open: true }, { id: 'peage', rect: [9.6, 14.4, -111, -112], open: true }],
  gates: [
    { id: 'herse', model: 'pf_herse_laser', x: 0, z: -42.5, rotY: PI / 2, rect: [-2.5, 2.5, -42, -43] },
    { id: 'herse3', model: 'pf_herse_laser', x: 12, z: -137, rotY: PI / 2, rect: [9.75, 14.25, -136.6, -137.4] },
    { id: 'herse4', model: 'pf_herse_laser', x: 20.5, z: -163.6, rotY: PI / 2, rect: [18.25, 22.75, -163.4, -163.8] }
  ],
  // 3 bornes « sans contact » (verrouillées jusqu'à la fin des vagues), face à l'entrée (+z)
  switches: [
    { group: 'peage3', x: 27, z: -130, rotY: PI },          // borne sur la pile : seul le bretzel l'atteint
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
    { id: 'celle', model: 'pnj_celle_du_stade', x: -4.5, z: -40.6, rotY: -PI / 2, holo: true, hidden: true },
    // écluse : cage « Tradition Certifiée » de la winstubière, pont bas, maisons des berges
    { id: 'cageWinstub', model: 'pf_cage', x: -5, z: -62, solid: 1.1 },
    { model: 'pf_pont', x: 5, z: -70 },
    { model: 'pf_maison_c', x: -2.4, z: -74 }, { model: 'pf_maison_a', x: -2.4, z: -79.6 }, { model: 'pf_maison_b', x: -2.4, z: -85 },
    { model: 'pf_maison_b_licence', x: -2.4, z: -90.4 }, { model: 'pf_maison_c', x: -2.4, z: -95.8 },
    { model: 'pf_maison_a', x: 13, z: -55.5, rotY: PI }, { model: 'pf_maison_b_licence', x: 13, z: -61, rotY: PI },
    { model: 'pf_maison_c', x: 13, z: -66.5, rotY: PI }, { model: 'pf_maison_b', x: 13, z: -75.5, rotY: PI }, { model: 'pf_maison_a', x: 13, z: -81, rotY: PI },
    { model: 'pf_lampadaire', x: -0.6, z: -64, rotY: 0, solid: 0.2 }, { model: 'pf_lampadaire', x: 9, z: -96, rotY: PI, solid: 0.2 },
    // ponts couverts : tours de péage (entrée, sortie, et deux dans l'Ill)
    { model: 'pf_tour_peage', x: 6.5, z: -111 }, { model: 'pf_tour_peage', x: 17.5, z: -111 },
    { model: 'pf_tour_peage', x: 6.5, z: -137 }, { model: 'pf_tour_peage', x: 17.5, z: -137 },
    { model: 'pf_tour_peage', x: -3, z: -124 }, { model: 'pf_tour_peage', x: 28, z: -118 },
    // barrage : arches (façade vers la terrasse), vitres anti-écharpe
    { model: 'pf_arche_barrage', x: 3.7, z: -171.5, rotY: -PI / 2 }, { model: 'pf_arche_barrage', x: 9.3, z: -171.5, rotY: -PI / 2 },
    { model: 'pf_arche_barrage', x: 14.9, z: -171.5, rotY: -PI / 2 }, { model: 'pf_arche_barrage', x: 20.5, z: -171.5, rotY: -PI / 2 },
    { model: 'pf_vitre', x: 1.1, z: -163.6, rotY: -PI / 2 }, { model: 'pf_vitre', x: 3.2, z: -163.6, rotY: -PI / 2 },
    { model: 'pf_vitre', x: 5.3, z: -163.6, rotY: -PI / 2 }, { model: 'pf_vitre', x: 7.4, z: -163.6, rotY: -PI / 2 },
    { model: 'pf_vitre', x: 9.5, z: -163.6, rotY: -PI / 2 }, { model: 'pf_vitre', x: 11.6, z: -163.6, rotY: -PI / 2 },
    { model: 'pf_vitre', x: 13.7, z: -163.6, rotY: -PI / 2 }, { model: 'pf_vitre', x: 15.8, z: -163.6, rotY: -PI / 2 },
    { model: 'pf_vitre', x: 17.2, z: -163.6, rotY: -PI / 2 }, { model: 'pf_vitre', x: 23.4, z: -163.6, rotY: -PI / 2 }
  ],
  drones: [
    { x: 5, z: -62, y: 5, r: 3, speed: 0.6, phase: 0 }, { x: 5, z: -86, y: 5.5, r: 4, speed: 0.45, phase: 2 }
  ],

  // écrans de commande holo (textes : TEXTS.pf.ads)
  ads: [
    { x: 0, z: -17.9, w: 4.5, y: 4.3, idx: 0 },
    { x: 6.6, z: -4.7, rotY: -PI / 2, w: 1.6, y: 2.6, idx: 3 },
    { x: -3.4, z: -10.4, rotY: PI / 2, w: 1.8, y: 2.8, idx: 2 },
    { x: -8.9, z: -25, rotY: PI / 2, idx: 1 }, { x: -8.9, z: -35, rotY: PI / 2, idx: 5 },
    { x: 8.9, z: -25, rotY: -PI / 2, idx: 4 }, { x: 8.9, z: -35, rotY: -PI / 2, idx: 1 },
    { x: -4.5, z: -41.9, w: 3, y: 4.3, idx: 4 }, { x: 5.5, z: -41.9, w: 3, y: 4.3, idx: 0 },
    { x: -7.9, z: -60, rotY: PI / 2, idx: 6 }, { x: 11.9, z: -71, rotY: -PI / 2, w: 2.4, y: 2.6, idx: 7 },
    { x: 15.9, z: -93, rotY: -PI / 2, idx: 2 },
    { x: 12, z: -107.8, w: 4, y: 5.2, idx: 8 }, { x: 12, z: -133.8, w: 4, y: 5.2, idx: 9 },
    { x: 4, z: -149.9, rotY: PI, w: 3, y: 3.4, idx: 10 }, { x: 9.5, z: -163.5, w: 2.4, y: 3.4, idx: 11 }
  ],
  neons: [
    { x: -3.45, y: 0.12, z: -5, len: 22, axis: 'z', color: PINK },
    { x: -8.9, y: 5.2, z: -30.5, len: 23, axis: 'z', color: CYAN }, { x: 8.9, y: 5.2, z: -30.5, len: 23, axis: 'z', color: PINK },
    { x: 0, y: 5.2, z: -18.9, len: 18, axis: 'x', color: GOLD },
    // cordons de file d'attente
    { x: -6.6, y: 0.9, z: -27, len: 8, axis: 'z', color: GOLD }, { x: 6.6, y: 0.9, z: -27, len: 8, axis: 'z', color: GOLD },
    { x: 0, y: 4.6, z: -41.9, len: 5, axis: 'x', color: PINK },
    { x: 2.05, y: 0.06, z: -76, len: 48, axis: 'z', color: CYAN }, { x: 7.95, y: 0.06, z: -76, len: 48, axis: 'z', color: PINK },
    { x: 2.05, y: 0.9, z: -124, len: 22, axis: 'z', color: CYAN }, { x: 21.95, y: 0.9, z: -124, len: 22, axis: 'z', color: PINK },
    // barrage : garde-corps, et les 3 néons d'ordre au-dessus des arches (de gauche à droite : rouge, or, cyan)
    { x: 0.05, y: 1, z: -160, len: 20, axis: 'z', color: CYAN }, { x: 23.95, y: 1, z: -160, len: 20, axis: 'z', color: PINK },
    { x: 8, y: 7.6, z: -168.2, len: 2.2, axis: 'x', color: 0xff1a3c }, { x: 12, y: 7.6, z: -168.2, len: 2.2, axis: 'x', color: GOLD },
    { x: 16, y: 7.6, z: -168.2, len: 2.2, axis: 'x', color: CYAN }
  ],
  lights: [
    { x: 5.4, z: 1, y: 3, color: CYAN, i: 10 }, { x: 5.4, z: -9, y: 3, color: CYAN, i: 10 },
    { x: -1.5, z: -3, color: PINK, i: 8 }, { x: 0, z: -15, color: GOLD, i: 10 },
    { x: 0, z: -24, color: PINK, i: 16, d: 18 }, { x: 0, z: -36, color: CYAN, i: 16, d: 18 },
    { x: 0, z: -46, color: GOLD, i: 10 },
    { x: -3, z: -58, color: GOLD, i: 10 }, { x: 5, z: -64, y: 3, color: CYAN, i: 12 }, { x: 5, z: -82, y: 3, color: PINK, i: 12 },
    { x: 12, z: -92, color: GOLD, i: 12 }, { x: 12, z: -102, color: CYAN, i: 8 },
    { x: 7, z: -120, color: PINK, i: 16, d: 18 }, { x: 17, z: -130, color: CYAN, i: 16, d: 18 }, { x: 26, z: -130, y: 3, color: GOLD, i: 10 },
    { x: 12, z: -142, color: GOLD, i: 8 },
    { x: 6, z: -156, color: PINK, i: 14, d: 18 }, { x: 18, z: -156, color: CYAN, i: 14, d: 18 }, { x: 12, z: -166, y: 6, color: GOLD, i: 14, d: 16 }
  ]
};
