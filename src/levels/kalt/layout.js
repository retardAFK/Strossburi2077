// Niveau 5 : le Kalt, rue la Fayette, la nuit, 2026 (fiches docs/designs/niveau-kalt.md, kalt.md, plan kalt-plan.png).
// DONNÉES UNIQUEMENT. Maquette grise à valider en jouant. Repère : x à droite, z négatif = vers le fond.
// Décors (tools/blender/decors_nuit.py) : l'entrée (decor_kalt_ext) en toile de fond à l'ouest de la file ; la scène DJ
// du hangar (decor_kalt, avec le carré VIP doré posé sur la piste) au fond de la piste.
// 1 la file dehors (z 8 → -22) · 2 l'allée et la cour (→ -52) · 3 la salle, hangar rouge all black (→ -90) ·
// 4 la cave, à l'ouest de la salle · B la piste et le carré VIP (→ -124).
const PI = Math.PI;
const PINK = 0xff4fa3, RED = 0xff1a3c, CYAN = 0x38f2ff, GOLD = 0xffc040, VIO = 0x6a5acd;

export default {
  id: 'kalt',
  bg: 0x07070b, fog: [14, 52],
  playerStart: { x: 0, z: 5, face: PI / 2 },
  opening: {
    shots: [
      { from: [7, 4, 10], to: [5, 3.5, 6], look: [-14, 3, -8], lookTo: [-12, 3, -14], dur: 6 },
      { from: [0, 3, -25], to: [0, 2.6, -34], look: [0, 1.5, -52], lookTo: [0, 1.8, -52], dur: 6 },
      { from: [6, 6, -94], to: [3, 5, -97], look: [5.8, 1.5, -113.4], lookTo: [5.8, 2.2, -113.4], dur: 6 }
    ],
    captionAt: [0.4, 6, 12]
  },
  zones: [
    { id: 'file', rect: [-9, 9, 8, -22] },
    { id: 'cour', rect: [-9, 9, -22, -52] },
    { id: 'salle', rect: [-14, 14, -52, -90] },
    { id: 'cave', rect: [-30, -14, -72, -92] },
    { id: 'piste', rect: [-14, 14, -90, -124], boss: true }
  ],
  floors: [
    { rect: [-9, 9, 8, -22], tex: 'paves', sky: true },
    { rect: [-3, 3, -22, -36], tex: 'beton', sky: true }, { rect: [-9, 9, -36, -52], tex: 'beton', sky: true },
    { rect: [-14, 14, -52, -90], tex: 'beton' }, { rect: [-30, -14, -72, -92], tex: 'beton' },
    { rect: [-14, 14, -90, -124], tex: 'beton' }
  ],
  walls: [
    // la file : trottoir rue la Fayette, l'allée s'ouvre au fond (x -2.5 → 2.5)
    [-10, -9, 8, -23, 'mur'], [9, 10, 8, -23, 'mur'], [-10, -2.5, -22, -23, 'mur'], [2.5, 10, -22, -23, 'mur'],
    // l'allée entre le bâtiment blanc et le hangar, puis la cour
    [-3.5, -2.5, -23, -36, 'mur'], [2.5, 3.5, -23, -36, 'mur'],
    [-10, -9, -36, -53, 'mur'], [9, 10, -36, -53, 'mur'], [-10, -2.5, -35, -36, 'mur'], [2.5, 10, -35, -36, 'mur'],
    // le hangar : façade (porte au milieu), salle, passage vers la cave (ouest, z -80 → -84), rideau de la piste
    [-15, -2, -52, -53, 'beton'], [2, 15, -52, -53, 'beton'],
    [-15, -14, -53, -80, 'beton'], [-15, -14, -84, -125, 'beton'], [14, 15, -53, -125, 'beton'],
    [-15, -4, -90, -91, 'beton'], [4, 15, -90, -91, 'beton'], [-15, 15, -124, -125, 'beton'],
    // la cave
    [-31, -30, -71, -93, 'beton'], [-31, -15, -71, -72, 'beton'], [-31, -15, -92, -93, 'beton']
  ],
  blockers: [[-10, 10, 8, 9], [3, 11, -117.5, -124]], // la scène DJ (décor) au fond de la piste, côté est
  blocks: [
    // la cour : poubelle jaune, vélos
    { x: 7.5, z: -39, w: 1, d: 1, h: 1.1, tex: 'sol', solid: true }, { x: -7.5, z: -46, w: 1, d: 3, h: 0.9, tex: 'mur', solid: true },
    // la salle : piliers IPN (on s'y cache des physios)
    { x: -7, z: -70, w: 0.6, d: 0.6, h: 6, tex: 'beton', solid: true }, { x: 7, z: -70, w: 0.6, d: 0.6, h: 6, tex: 'beton', solid: true },
    { x: -7, z: -82, w: 0.6, d: 0.6, h: 6, tex: 'beton', solid: true }, { x: 7, z: -82, w: 0.6, d: 0.6, h: 6, tex: 'beton', solid: true },
    // la cave : fûts
    { x: -28.5, z: -74, w: 1, d: 1, h: 1.2, tex: 'mur', solid: true }, { x: -28.5, z: -90, w: 1, d: 1, h: 1.2, tex: 'mur', solid: true }
  ],
  // les basses ouvrent les portiques (props/Sono.js)
  lasers: [{ id: 'basse1', x0: -14, x1: 14, z: -64 }, { id: 'basse2', x0: -14, x1: 14, z: -76 }],
  doors: [
    { id: 'hangar', rect: [-2, 2, -52.2, -52.8], open: false },
    { id: 'vip', rect: [-15, -14, -80, -84], open: false },
    { id: 'piste', rect: [-4, 4, -90.2, -90.8], open: false }
  ],
  props: [
    { model: 'decor_kalt_ext', x: -25, y: 0, z: -8, scale: 1.3 },
    { id: 'dj', model: 'decor_kalt', x: 7, y: -0.02, z: -114, scale: 1.2, rotY: -PI / 2 } // carré VIP du décor en (5.8, -113.4)
  ],
  objects: [
    // le peuple techno refoulé (placeholders : designs attendus de Cowork)
    ...[2, -1.5, -5, -8.5, -12].map((z, i) => ({ type: 'figurant', id: i ? null : 'public', label: 'PUBLIC TECHNO', x: 7, z,
      rotY: PI, talk: !i })),
    { type: 'sono', rect: [-14, 14, -52, -90], gates: ['basse1', 'basse2'], light: { x: 0, y: 7, z: -72 } },
    { type: 'caisse', x: 12.5, z: -56, arrow: 'court_circuit' },
    { type: 'projo', id: 'vip', x: -12.6, z: -87.5, label: 'PROJECTEUR VIP' },
    { type: 'dylagne', x: -26.5, z: -86, rotY: 0 },
    { type: 'caisse', x: 12.5, z: -93, arrow: 'court_circuit' }, { type: 'caisse', x: -12.5, z: -93, arrow: 'court_circuit' }
  ],
  ads: [
    { x: 9.9, z: -6, rotY: -PI / 2, w: 3, y: 3, idx: 0 }, { x: -9.9, z: -44, rotY: PI / 2, w: 3, y: 3, idx: 1 },
    { x: 13.9, z: -58, rotY: -PI / 2, w: 3, y: 3.4, idx: 2 }, { x: -13.9, z: -100, rotY: PI / 2, w: 3.4, y: 3.6, idx: 3 }
  ],
  neons: [
    { x: 0, y: 3.4, z: -21.8, len: 5, axis: 'x', color: PINK }, { x: 0, y: 3.6, z: -52.9, len: 4, axis: 'x', color: CYAN },
    { x: -13.9, y: 4.5, z: -71, len: 34, axis: 'z', color: RED }, { x: 13.9, y: 4.5, z: -71, len: 34, axis: 'z', color: RED },
    { x: -29.9, y: 3, z: -82, len: 18, axis: 'z', color: VIO }, { x: 0, y: 5.5, z: -123.8, len: 22, axis: 'x', color: PINK }
  ],
  lights: [
    { x: 0, z: -2, y: 7, color: VIO, i: 8, d: 24 }, { x: 0, z: -18, y: 5, color: PINK, i: 6, d: 14 },
    { x: 0, z: -44, y: 7, color: VIO, i: 8, d: 22 }, { x: 0, z: -72, y: 6, color: 0x3a1020, i: 4, d: 30 },
    { x: -22, z: -82, y: 4, color: 0x9a4dff, i: 9, d: 18 },
    { x: 0, z: -100, y: 7, color: GOLD, i: 10, d: 28 }, { x: 0, z: -112, y: 6, color: PINK, i: 10, d: 24 }
  ],
  warps: [
    { id: 'file', x: 0, z: 5, face: PI / 2 }, { id: 'cour', x: 0, z: -37, face: PI / 2 },
    { id: 'salle', x: 0, z: -55, face: PI / 2 }, { id: 'cave', x: -17, z: -82, face: PI },
    { id: 'piste', x: 0, z: -93, face: PI / 2 }
  ]
};
