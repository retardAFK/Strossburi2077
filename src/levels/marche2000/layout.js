// Niveau 4 : Marché 2000, Porte de l'Hôpital, la nuit, 2026 (fiches docs/designs/niveau-marche2000.md, marche2000.md).
// DONNÉES UNIQUEMENT. Maquette grise à valider en jouant. Repère : x à droite, z négatif = vers le fond.
// Décor de la rue (tools/blender/decors_nuit.py → decor_marche2000.glb) en toile de fond, à l'ouest de la cour.
// 1 l'arrière, cour rue de la Farine (z 8 → -30) · 2 les rayons (→ -62) · 3 la réserve (→ -84) · 4 le toit et
// l'enseigne (→ -104) · B le magasin côté tram (→ -132), le Gérant derrière son comptoir.
const PI = Math.PI;
const VIO = 0xa98bff, PINK = 0xff4fa3, CYAN = 0x38f2ff, ORANGE = 0xff7a1a;
// enseigne « MARCHÉ 2000 » au bord du toit, lue depuis la rue : vue du toit, de derrière, elle se lit de droite à gauche
const WORD = ['M', 'A', 'R', 'C', 'H', 'É', '2', '0', '0', '0'], OFF = [2, 5, 7]; // lettres éteintes (vignette decors-nuit)

export default {
  id: 'marche2000',
  bg: 0x0b0a18, fog: [16, 58],
  playerStart: { x: 0, z: 5, face: PI / 2 },
  opening: {
    shots: [
      { from: [-10, 7, 14], to: [-8, 6, 4], look: [-26, 5, -10], lookTo: [-26, 5, -14], dur: 6 },
      { from: [0, 3, 6], to: [0, 2.6, -6], look: [0, 1.5, -26], lookTo: [0, 1.5, -28], dur: 6 },
      { from: [0, 6, -88], to: [-3, 5, -94], look: [0, 2.5, -103.5], lookTo: [-7, 3, -103.5], dur: 6 }
    ],
    captionAt: [0.4, 6, 12]
  },
  zones: [
    { id: 'arriere', rect: [-10, 10, 8, -30] },
    { id: 'rayons', rect: [-10, 10, -30, -62] },
    { id: 'reserve', rect: [-10, 10, -62, -84] },
    { id: 'toit', rect: [-10, 10, -84, -104] },
    { id: 'magasin', rect: [-12, 12, -104, -132], boss: true }
  ],
  floors: [
    { rect: [-10, 10, 8, -30], tex: 'paves', sky: true },
    { rect: [-10, 10, -30, -62], tex: 'carrelage' },
    { rect: [-10, 10, -62, -84], tex: 'beton' },
    { rect: [-10, 10, -84, -104], tex: 'beton', sky: true },
    { rect: [-12, 12, -104, -132], tex: 'carrelage' }
  ],
  walls: [
    [-11, -10, 8, -84, 'mur'], [10, 11, 8, -84, 'mur'],
    [-11, -1.5, -30, -31, 'mur'], [1.5, 11, -30, -31, 'mur'],
    [-11, -1.5, -62, -63, 'mur'], [1.5, 11, -62, -63, 'mur'],
    [-11, -1.5, -84, -85, 'beton'], [1.5, 11, -84, -85, 'beton'],
    [-11, -10, -85, -104, 'beton'], [10, 11, -85, -104, 'beton'],
    [-13, -12, -105, -132, 'mur'], [12, 13, -105, -132, 'mur'], [-13, 13, -132, -133, 'mur'], [-13, 7.5, -104, -105, 'mur'], [10, 13, -104, -105, 'mur']
  ],
  blockers: [[-11, 11, 8, 9]],
  blocks: [
    // l'arrière : caisses et poubelles qui cachent des lampes
    { x: -5, z: -8, w: 3, d: 2, h: 1.4, tex: 'beton', solid: true }, { x: 4.5, z: -14, w: 2, d: 3, h: 1.4, tex: 'beton', solid: true },
    { x: -3.5, z: -21, w: 3, d: 2, h: 1.4, tex: 'beton', solid: true }, { x: 6.5, z: -22, w: 2, d: 2, h: 1.4, tex: 'beton', solid: true },
    // les rayons : 3 étagères, et des palettes « Tradition Certifiée » pour se cacher des scanners
    { x: -5, z: -44, w: 1.2, d: 14, h: 2.4, tex: 'mur', solid: true }, { x: 0, z: -44, w: 1.2, d: 14, h: 2.4, tex: 'mur', solid: true },
    { x: 5, z: -44, w: 1.2, d: 14, h: 2.4, tex: 'mur', solid: true },
    { x: 2.5, z: -40, w: 1.2, d: 1.2, h: 1.2, tex: 'sol', solid: true }, { x: -7.5, z: -46, w: 1.2, d: 1.2, h: 1.2, tex: 'sol', solid: true },
    { x: -2.5, z: -56.5, w: 1.2, d: 1.2, h: 1.2, tex: 'sol', solid: true }, { x: 7.5, z: -33.5, w: 1.2, d: 1.2, h: 1.2, tex: 'sol', solid: true },
    // le magasin : palettes contre le scanner du Gérant, et son comptoir-caisse (visuel ; obstacle = vitre plus bas)
    { x: -5, z: -114, w: 1.4, d: 1.4, h: 1.3, tex: 'sol', solid: true }, { x: 5, z: -114, w: 1.4, d: 1.4, h: 1.3, tex: 'sol', solid: true },
    { x: 0, z: -118.5, w: 1.4, d: 1.4, h: 1.3, tex: 'sol', solid: true },
    { x: 0, z: -124.5, w: 18, d: 0.6, h: 1.1, tex: 'beton' }
  ],
  // le comptoir arrête l'Ultra mais pas les flèches, le bretzel ni les étiquettes renvoyées
  glass: [[-9, 9, -124.2, -124.8]],
  doors: [
    { id: 'escalier', rect: [-1.5, 1.5, -83.5, -84.5], open: false },
    { id: 'magasin', rect: [7.5, 10, -103.6, -104.6], open: false }
  ],
  props: [
    { model: 'decor_marche2000', x: -26, y: 0, z: -10, scale: 1.6 },
    { model: 'decor_marche2000', x: 0, y: 0, z: -150, scale: 1.6, rotY: -PI / 2 }
  ],
  objects: [
    { type: 'caisse', x: -8, z: 4, arrow: 'fumigene' },
    { type: 'neon', id: 'n1', x: 2.5, z: -5, color: PINK }, { type: 'neon', id: 'n2', x: -7.5, z: -15, color: VIO },
    { type: 'neon', id: 'n3', x: 2.6, z: -28.5, color: CYAN },
    { type: 'camera', x: -9.3, z: -32, from: 0.1, to: 0.9 }, { type: 'camera', x: 9.3, z: -60.5, from: -2.9, to: -2.2 },
    { type: 'figurant', id: 'cliente', label: 'CLIENTE', x: -8.5, z: -36.5, rotY: 0, talk: true },
    { type: 'figurant', id: 'employe', label: 'EMPLOYÉ DE NUIT', x: 8.5, z: -50, rotY: PI, talk: true },
    { type: 'figurant', id: 'scn', label: 'SCN', x: -7.5, z: -80, rotY: PI / 2, talk: true, hidden: true },
    { type: 'figurant', id: 'scn2', label: 'SCN', x: -5.5, z: -81, rotY: PI / 2, hidden: true },
    { type: 'caisse', x: 8.8, z: -53.5, arrow: 'court_circuit' },
    ...WORD.map((char, i) => ({ type: 'lettre', x: 6.3 - i * 1.4, z: -103.6, y: 2.4, rotY: PI, char, lit: !OFF.includes(i),
      group: 'enseigne', key: OFF.indexOf(i) })),
    { type: 'stork', x: -8.6, z: -103.4, y: 2.2 }
  ],
  ads: [
    { x: -9.9, z: -24, rotY: PI / 2, w: 3, y: 3, idx: 0 }, { x: 0, z: -61.4, w: 4, y: 3.2, idx: 1 },
    { x: 9.9, z: -72, rotY: -PI / 2, w: 3, y: 3, idx: 2 }, { x: -11.9, z: -116, rotY: PI / 2, w: 3.4, y: 3.4, idx: 3 },
    { x: 0, z: -131.9, w: 5, y: 4, idx: 0 }
  ],
  neons: [
    { x: -9.8, y: 3.6, z: -46, len: 28, axis: 'z', color: VIO }, { x: 9.8, y: 3.6, z: -46, len: 28, axis: 'z', color: VIO },
    { x: 0, y: 3.4, z: -84.4, len: 3, axis: 'x', color: ORANGE }, { x: 0, y: 4.2, z: -131.8, len: 16, axis: 'x', color: PINK }
  ],
  lights: [
    { x: 0, z: -8, y: 7, color: 0x6a5acd, i: 8, d: 24 }, { x: 0, z: -22, y: 7, color: 0x6a5acd, i: 8, d: 24 },
    { x: 0, z: -38, y: 4, color: 0xc8d8ff, i: 9, d: 18 }, { x: 0, z: -54, y: 4, color: 0xc8d8ff, i: 9, d: 18 },
    { x: 0, z: -73, y: 4, color: 0xffc040, i: 12, d: 22 }, { x: 0, z: -94, y: 7, color: ORANGE, i: 10, d: 26 },
    { x: 0, z: -112, y: 5, color: 0xffffff, i: 16, d: 26 }, { x: 0, z: -126, y: 5, color: VIO, i: 16, d: 22 }
  ],
  warps: [
    { id: 'arriere', x: 0, z: 5, face: PI / 2 }, { id: 'rayons', x: 0, z: -32, face: PI / 2 },
    { id: 'reserve', x: 0, z: -64, face: PI / 2 }, { id: 'toit', x: 0, z: -86, face: PI / 2 },
    { id: 'magasin', x: 0, z: -107, face: PI / 2 }
  ]
};
