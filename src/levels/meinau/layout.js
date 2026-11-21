// Niveau 2 : la Meinau, 2026 (fiche docs/designs/niveau-meinau.md). DONNÉES UNIQUEMENT.
// Repère : x à droite, z négatif = vers le fond. Décor : pièces exportées de decor_meinau.py (tools/blender/decor_kit.py).
// 1 parvis (z 7 → -7) · 2 coursive + anciens parqués (→ -30) · 3 local du kop (→ -42) · tunnel · 4 kop · 5 pelouse.
import { TUNING } from '../../data/tuning.js';

const PI = Math.PI, HOOK = TUNING.tifo.colors;
const BLUE = 0x1f5fd0, GOLD = 0xffc040, PINK = 0xff2e88;

export default {
  id: 'meinau',
  bg: 0x5a6f98, fog: [28, 90],
  playerStart: { x: 8, z: 4.5, face: PI / 2 },
  opening: {
    shots: [
      { from: [20, 9, 12], to: [16, 7, 2], look: [0, 4, 0], lookTo: [0, 3, -4], dur: 6 },
      { from: [9, 2, 5], to: [6, 2.5, -6], look: [0, 5, -2], lookTo: [4, 2, -14], dur: 6 },
      { from: [16, 22, -55], to: [10, 18, -70], look: [0, 0, -70], lookTo: [0, 0, -72], dur: 6 }
    ],
    captionAt: [0.4, 6, 12]
  },
  zones: [
    { id: 'parvis', rect: [1.5, 10.5, 7, -7] },
    { id: 'coursive', rect: [2, 12, -7, -30] },
    { id: 'local', rect: [-3, 8, -30, -42.5] },
    { id: 'kop', rect: [-9, 9, -42.5, -60], cam: [-9, 9, -40, -60] },
    { id: 'pelouse', rect: [-9, 9, -60, -83], boss: true }
  ],
  floors: [
    { rect: [2, 7, -7, -30], tex: 'beton' }, { rect: [7, 12, -14, -22], tex: 'beton' },
    { rect: [-3, 8, -30, -42], tex: 'beton' }, { rect: [6, 8, -42, -55.2], tex: 'beton' }
  ],
  walls: [
    [1, 2, -7, -30, 'beton'], [7, 8, -7, -15.75, 'beton'], [7, 8, -20.25, -30, 'beton'],
    [8, 12, -13, -14, 'beton'], [8, 12, -22, -23, 'beton'], [12, 13, -13, -23, 'beton'],
    [-4, 2, -29.5, -30.5, 'mur'], [7, 9, -29.5, -30.5, 'mur'], [-4, -3, -30, -42, 'mur'], [8, 9, -30, -42, 'mur'],
    [-4, 6, -42, -43, 'mur'], [8, 9, -42, -43, 'mur'], [5, 6, -43, -55.2, 'beton'], [8, 9, -43, -55.2, 'beton']
  ],
  blockers: [
    [-12, 1.4, 8, -7], [10.5, 13, 8, -7], [-12, 13, 7, 8], [1.4, 2, -6.5, -7.5], [7, 13, -6.5, -7.5],
    // bol (tourné : le kop au nord) : piste x ±9, z -57 → -83
    [-20, -9, -56, -90], [9, 20, -56, -90], [-20, 20, -83, -90], [-20, 5, -55.2, -56], [9, 20, -55.2, -56],
    [-9, -2.25, -59.7, -60.3], [2.25, 9, -59.7, -60.3]
  ],
  doors: [
    { id: 'parvis', rect: [2, 7, -6.5, -7.5], open: false },
    { id: 'localIn', rect: [2, 7, -29.5, -30.5], open: false },
    { id: 'local', rect: [6, 8, -42, -43], open: false }
  ],
  gates: [
    { id: 'portique', model: 'pf_herse_laser', x: 7.5, z: -18, rotY: 0, rect: [7.3, 7.7, -15.75, -20.25] },
    { id: 'pelouse', model: 'pf_herse_laser', x: 0, z: -60, rotY: PI / 2, rect: [-2.25, 2.25, -59.7, -60.3] }
  ],
  terminals: [{ x: 2.7, z: -18, rotY: 0, event: 'terminal:portique' }],
  props: [
    { model: 'decor_meinau_ext', x: 0, z: 0 },
    { model: 'decor_meinau_bol', x: 0, z: -70, rotY: PI / 2 }
  ],
  objects: [
    // anciens du kop (placeholders : pas encore de design) parqués dans l'alcôve, puis au local, puis au kop
    { type: 'figurant', id: 'anciens', label: 'ANCIEN DU KOP', x: 10, z: -16.5, rotY: PI },
    { type: 'figurant', id: 'anciens', label: 'ANCIENNE DU KOP', x: 10.5, z: -19.5, rotY: PI },
    { type: 'figurant', id: 'local', label: 'ANCIEN DU KOP', x: 5, z: -33, rotY: PI, hidden: true, talk: true },
    { type: 'figurant', id: 'pigeon', label: 'PIGEON', x: 5.5, z: 1.5 },
    // tuto de tir : 3 cibles BlingCo au mur du local
    { type: 'cible', group: 'tutoArc', key: 'rouge', x: -2.4, z: -33, rotY: 0 },
    { type: 'cible', group: 'tutoArc', key: 'or', x: -2.4, z: -36.5, rotY: 0 },
    { type: 'cible', group: 'tutoArc', key: 'cyan', x: -2.4, z: -40, rotY: 0 },
    // tifo : 5 crochets devant le kop (couleur = indice dans TUNING.tifo.colors), caisse de bannières, écran, tifo
    { type: 'crochet', group: 'tifo', key: 0, color: HOOK[0], x: -6, z: -56.3, y: 2.4 }, { type: 'crochet', group: 'tifo', key: 1, color: HOOK[1], x: -3.5, z: -56.3, y: 2.4 },
    { type: 'crochet', group: 'tifo', key: 2, color: HOOK[2], x: -1, z: -56.3, y: 2.4 }, { type: 'crochet', group: 'tifo', key: 3, color: HOOK[3], x: 1.5, z: -56.3, y: 2.4 },
    { type: 'crochet', group: 'tifo', key: 4, color: HOOK[4], x: 4, z: -56.3, y: 2.4 },
    { type: 'caisse', arrow: 'banniere', x: -8, z: -58.5 }, { type: 'caisse', arrow: 'banniere', x: -5.5, z: -63 }, // kop, pelouse
    { type: 'ecran', x: -13.6, z: -70, y: 4.3, w: 5, rotY: PI / 2 },
    { type: 'tifo', x: 0, z: -55.8, y: 3.4, w: 16, h: 5, rotY: Math.PI },
    { type: 'figurant', id: 'kop', label: 'LE KOP', x: -4, z: -54.8, hidden: true, chant: ['ALLEZ !', 'PAS À VENDRE !', 'ICI, C\'EST CHEZ NOUS !'] },
    { type: 'figurant', id: 'kop', label: 'LE KOP', x: 3, z: -54.8, hidden: true, chant: ['PAS À VENDRE !', 'ALLEZ !'] }
  ],
  // ordre du tifo montré sur l'écran (indices de couleur des crochets)
  tifoOrder: [2, 0, 4, 1, 3],
  ads: [
    { x: 5.9, z: -10, rotY: -PI / 2, w: 2.4, y: 3, idx: 1 }, { x: 2.1, z: -24, rotY: PI / 2, w: 2.4, y: 3, idx: 2 },
    { x: 2.5, z: -29.4, w: 3, y: 3.6, idx: 0 }, { x: 8.9, z: -36, rotY: -PI / 2, idx: 3 }
  ],
  neons: [
    { x: 2.15, y: 5.2, z: -18, len: 22, axis: 'z', color: GOLD }, { x: 2.5, y: 5.2, z: -36, len: 10, axis: 'x', color: BLUE },
    { x: 7, y: 4.6, z: -50, len: 14, axis: 'z', color: PINK }
  ],
  lights: [
    { x: 4.5, z: -12, color: GOLD, i: 10 }, { x: 4.5, z: -25, color: 0xffffff, i: 10 }, { x: 10, z: -18, color: PINK, i: 8 },
    { x: 2, z: -36, color: BLUE, i: 12, d: 16 }, { x: 7, z: -50, color: 0xffffff, i: 8 },
    { x: 0, z: -66, y: 9, color: 0xffffff, i: 30, d: 40 }, { x: 0, z: -58, y: 6, color: BLUE, i: 14, d: 20 }
  ],
  warps: [
    { id: 'parvis', x: 8, z: 4.5, face: PI / 2 }, { id: 'coursive', x: 4.5, z: -9, face: PI / 2 },
    { id: 'local', x: 3, z: -32, face: PI / 2 }, { id: 'kop', x: 0, z: -58.5, face: -PI / 2 }, { id: 'pelouse', x: 0, z: -63, face: PI / 2 }
  ]
};
