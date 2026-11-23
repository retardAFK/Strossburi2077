// Niveau 6 : le Kalt, les abords, la nuit, 2026. MAQUETTE GRISE (docs/designs/brief-greybox-kalt.md, plan
// docs/designs/kalt-plan.svg v2, validés le 23/11) : blocs gris étiquetés, aucune matière finale. DONNÉES UNIQUEMENT.
// Plan : x = (x_plan − 174) × 0,25 ; z = (y_plan − 331) × 0,25 (nord en haut, z négatif = nord).
// 1 arrêt tram Lycée Couffignal (départ) · 2 rue La Fayette (lampadaires chauds, grand parking arboré en face : bord nord)
// · 3 grille grise coulissante entre deux entrepôts → l'avant-cour · 4 la cour (file, videurs, portique BlingCo) ·
// 5 le Kalt au fond de la cour (invisible depuis la rue, révélé en entrant dans la cour) · 6 arrière-cours d'entrepôts
// (secret : la ruelle derrière les palettes) → porte de la cave. Entrées vers l'intérieur : cour (normale) · toit du
// hangar (Stork ?, placeholder fermé) · arrière-cours → cave (secret).
const grey = (x, z, w, d, h, label, solid = true) => ({ x, z, w, d, h, tex: 'ph_gris', solid, label });
const car = (x, z) => ({ x, z, w: 2, d: 4.4, h: 1.5, tex: 'ph_gris', solid: true });
const tree = (x, z) => ({ x, z, w: 1.2, d: 1.2, h: 4.5, tex: 'ph_gris', solid: true });
const lamp = (x, z) => ({ x, z, w: 0.3, d: 0.3, h: 5, tex: 'ph_gris', solid: true });
const PI = Math.PI, WARM = 0xffc070, PINK = 0xff4fa3;

export default {
  id: 'kalt-abords',
  bg: 0x1e1838, fog: [24, 80], // nuit urbaine, pas de noir
  playerStart: { x: -6, z: -48, face: -PI / 2 },
  opening: {
    shots: [
      { from: [-14, 4, -52], to: [-8, 4, -46], look: [10, 3, -32], lookTo: [20, 3, -32], dur: 6 },
      { from: [-3, 3, -30], to: [-3, 3, -22], look: [-3, 2, -10], lookTo: [10, 3, 0], dur: 6 },
      { from: [16, 6, -6], to: [22, 6, 0], look: [26, 4, 14], lookTo: [26, 6, 14], dur: 6 }
    ],
    captionAt: [0.4, 6, 12]
  },
  zones: [
    { id: 'tram', rect: [-20, 9, -40, -56] },
    { id: 'rue', rect: [-20, 35, -24, -40] },
    { id: 'avantcour', rect: [-6, 13, 10, -24] },
    { id: 'cour', rect: [13, 35, 13.5, -24] },
    { id: 'ruelle', rect: [33, 35, 37.5, 13.5] },
    { id: 'arriere', rect: [-20, 35, 56, 33.5] }
  ],
  floors: [{ rect: [-35, 35, 56, -56], tex: 'ph_gris', sky: true }],
  // bords : façades d'entrepôts (est, sud), le tram (ouest), le parking (nord)
  walls: [
    [-36, 36, -56, -57, 'ph_gris'], [-36, 36, 57, 56, 'ph_gris'], [-36, -35, 57, -57, 'ph_gris'], [35, 36, 57, -57, 'ph_gris'],
    // façade sud de la rue La Fayette : l'ouverture de la grille (x -6 → 0)
    [-20, -6, -24, -25, 'ph_gris'], [0, 35, -24, -25, 'ph_gris']
  ],
  blockers: [[-35, -20, 56, -56]],
  labels: [
    { x: -27, z: 0, y: 5, text: 'TRAM A/E · AV. DE COLMAR' }, { x: -6, z: -45, text: '1 · ARRÊT LYCÉE COUFFIGNAL' },
    { x: 8, z: -33, text: '2 · RUE LA FAYETTE' }, { x: 22, z: -48, y: 4, text: 'GRAND PARKING ARBORÉ (BORD)' },
    { x: -3, z: -20, y: 3.5, text: '3 · GRILLE GRISE (OUVERTE)' }, { x: 3, z: -2, text: "L'AVANT-COUR" },
    { x: 24, z: -12, text: '4 · LA COUR · FILE, VIDEURS' }, { x: 8, z: 46, text: '6 · ARRIÈRE-COURS · VERS RUE MAL LEFEBVRE' },
    { x: 0, z: 56.5, y: 7, text: "FAÇADES D'ENTREPÔTS (BORD)" }, { x: 35.5, z: 0, y: 7, text: "FAÇADES D'ENTREPÔTS (BORD)" }
  ],
  blocks: [
    // le tram à l'arrêt, l'abri
    grey(-27, -48, 3, 14, 3.2, 'TRAM A/E'), grey(-10, -52, 5, 1.4, 2.6, 'ABRI DU TRAM'),
    // le grand parking arboré en face (bord nord, clôturé)
    grey(22, -40.5, 26, 0.3, 1.2, 'CLÔTURE DU PARKING'), grey(9, -48, 0.3, 16, 1.2),
    car(13, -46), car(16, -46), car(22, -46), car(28, -46), car(13, -53), car(19, -53), car(25, -53), car(31, -53),
    tree(18, -50), tree(26, -50), tree(32, -46),
    // lampadaires de la rue La Fayette (lumière chaude)
    lamp(-14, -26), lamp(4, -26), lamp(20, -26), lamp(32, -38),
    // les deux entrepôts de part et d'autre de la grille, et l'entrepôt de l'avant-cour
    grey(-13, -7, 14, 34, 9, 'ENTREPÔT (BLANC, BANDES DE BRIQUE)'), grey(6.5, -19, 13, 10, 9, 'ENTREPÔT'),
    // la grille coulissante (ouverte, rangée contre le mur)
    grey(-7.2, -25.8, 2.4, 0.2, 2.6, 'GRILLE COULISSANTE'),
    // la cour : barrières de la file d'attente, barrières du portique (de chaque côté des robots-cordons)
    grey(18, -8, 0.3, 14, 1.1, "FILE D'ATTENTE"), grey(21, -8, 0.3, 14, 1.1), grey(24, -8, 0.3, 14, 1.1),
    grey(22.8, 12.8, 0.4, 1.6, 1.1, 'PORTIQUE BLINGCO'), grey(29.7, 12.8, 0.4, 1.6, 1.1),
    // le Kalt, au fond de la cour : révélé en entrant dans la cour (script)
    { id: 'kalt', x: 6.5, z: 23.5, w: 53, d: 20, h: 11, tex: 'ph_blanc', solid: true, hidden: true,
      label: '5 · LE KALT (HANGAR) · BLANC + BANDES DE BRIQUE ROUGE', labelSize: 1.6 },
    grey(-19, 12.6, 1.2, 1.2, 4, 'ÉCHELLE DU TOIT (STORK ?)'),
    // les arrière-cours : entrepôts, bennes ; la porte de la cave (soupirail)
    grey(-12, 50, 10, 6, 6, 'ENTREPÔT'), grey(24, 52, 14, 6, 6, 'ENTREPÔT'), grey(10, 42, 3, 2, 1.6, 'BENNE'),
    grey(-8, 36.5, 3, 1, 0.6, 'PORTE DE LA CAVE (SOUPIRAIL)')
  ],
  objects: [
    // la ruelle secrète vers les arrière-cours, bouchée par des palettes (gaffe-grappin)
    { type: 'tractable', id: 'palettes', label: 'PALETTES', x: 34, z: 15.5, w: 2, d: 2.6, h: 2.2, axis: 'z', min: 8, max: 15.5, color: 0x8a8d98 },
    // le public techno qui attend (placeholders)
    ...[-20, -16, -12, -8, -4].map((z, i) => ({ type: 'figurant', id: i ? null : 'public', label: 'PUBLIC TECHNO', x: 19.5, z, rotY: -PI / 2, talk: !i })),
    { type: 'figurant', label: 'PUBLIC TECHNO', x: 22.5, z: -14, rotY: -PI / 2 },
    // écharpe de la cour (principale) : marqueur
    { type: 'echarpe', id: 'kalt-cour', x: 8, z: 6, label: 'ÉCHARPE (PRINCIPALE)' }
  ],
  ads: [{ x: 31, z: 13.3, w: 4, y: 4.2, idx: 0 }],
  neons: [{ x: 26, y: 3.6, z: 13.35, len: 6, axis: 'x', color: PINK }],
  lights: [
    { x: -14, z: -27, y: 5, color: WARM, i: 10, d: 22 }, { x: 4, z: -27, y: 5, color: WARM, i: 10, d: 22 },
    { x: 20, z: -27, y: 5, color: WARM, i: 10, d: 22 }, { x: 32, z: -38, y: 5, color: WARM, i: 8, d: 20 },
    { x: -6, z: -48, y: 6, color: 0xdfe8ff, i: 8, d: 24 }, { x: 24, z: 0, y: 7, color: PINK, i: 10, d: 26 },
    { x: 4, z: 0, y: 6, color: WARM, i: 8, d: 22 }, { x: 8, z: 46, y: 6, color: WARM, i: 8, d: 26 }
  ],
  warps: [
    { id: 'tram', x: -6, z: -48, face: -PI / 2 }, { id: 'rue', x: -3, z: -30, face: -PI / 2 },
    { id: 'cour', x: 26, z: 0, face: -PI / 2 }, { id: 'arriere', x: 8, z: 40, face: PI / 2 }
  ]
};
