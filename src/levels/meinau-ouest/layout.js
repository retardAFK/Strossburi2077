// Prototype : coursives de la tribune ouest, Meinau, 2067. DONNÉES UNIQUEMENT.
// Repère : x à droite, z négatif = vers le fond. Rectangles de zone : [x0, x1, zHaut, zBas].
import { TEXTS } from '../../data/texts.fr.js';

const PI = Math.PI;
const G = TEXTS.graffiti;
const CYAN = 0x38f2ff, PINK = 0xff2e88, GOLD = 0xffc040;

export default {
  id: 'meinau-ouest',
  bg: 0x0a0a1e, fog: [12, 36],
  playerStart: { x: 0, z: -1, face: PI / 2 },

  zones: [
    { id: 'entree', rect: [-8, 8, 6, -14] },
    { id: 'coursive', rect: [-5, 5, -14, -52.5], cam: [-5, 5, 6, -52.5] },
    { id: 'vip', rect: [-10, 10, -52.5, -75], boss: true },
    { id: 'sortie', rect: [-2.5, 2.5, -75, -80], cam: [-10, 10, -52.5, -80] }
  ],
  floors: [
    { rect: [-8, 8, 6, -14], tex: 'sol' },
    { rect: [-5, 5, -14, -52], tex: 'sol' },
    { rect: [-10, 10, -52, -75], tex: 'moquette' },
    { rect: [-2.5, 2.5, -75, -80], tex: 'sol' }
  ],
  // [x0, x1, z0, z1, texture]
  walls: [
    [-9, 9, 6, 7], [-9, -8, 6, -14], [8, 9, 6, -14], [-9, -5, -14, -15], [5, 9, -14, -15],
    [-6, -5, -15, -52], [5, 6, -15, -52],
    [-11, -2.5, -52, -53], [2.5, 11, -52, -53],
    [-11, -10, -53, -75], [10, 11, -53, -75], [-11, -2.5, -75, -76], [2.5, 11, -75, -76],
    [-3.5, -2.5, -76, -80], [2.5, 3.5, -76, -80]
  ],
  pillars: [{ x: -5.5, z: -59 }, { x: 5.5, z: -59 }, { x: -5.5, z: -69 }, { x: 5.5, z: -69 }],
  doors: [
    { id: 'entree', rect: [-5, 5, -14, -15], open: false },
    { id: 'vip', rect: [-2.5, 2.5, -52, -53], open: true },
    { id: 'sortie', rect: [-2.5, 2.5, -75, -76], open: false }
  ],
  lasers: [{ id: 'premium', x0: -5, x1: 5, z: -34 }],
  terminals: [{ x: -4.1, z: -30.5, rotY: 0, event: 'terminal:laser' }],

  neons: [
    { x: -7.9, y: 5.2, z: -4, len: 20, axis: 'z', color: CYAN }, { x: 7.9, y: 5.2, z: -4, len: 20, axis: 'z', color: PINK },
    { x: -4.9, y: 5.2, z: -33, len: 38, axis: 'z', color: CYAN }, { x: 4.9, y: 5.2, z: -33, len: 38, axis: 'z', color: PINK },
    { x: -4.9, y: 0.15, z: -33, len: 38, axis: 'z', color: PINK }, { x: 4.9, y: 0.15, z: -33, len: 38, axis: 'z', color: CYAN },
    { x: -9.9, y: 5.2, z: -64, len: 22, axis: 'z', color: GOLD }, { x: 9.9, y: 5.2, z: -64, len: 22, axis: 'z', color: GOLD },
    { x: 0, y: 5.2, z: -74.9, len: 20, axis: 'x', color: PINK }
  ],
  ads: [
    { x: -6.5, z: -13.9, idx: 0 }, { x: 6.5, z: -13.9, idx: 1 },
    { x: -4.9, z: -21, rotY: PI / 2, idx: 2 }, { x: 4.9, z: -27, rotY: -PI / 2, idx: 3 },
    { x: -4.9, z: -40, rotY: PI / 2, idx: 4 }, { x: 4.9, z: -45, rotY: -PI / 2, idx: 6 },
    { x: -6, z: -74.9, w: 4.5, y: 3.8, idx: 7 }, { x: 6, z: -74.9, w: 4.5, y: 3.8, idx: 5 }
  ],
  graffiti: [
    { text: G[0], color: '#38f2ff', x: -7.9, z: -6, rotY: PI / 2 },
    { text: G[1], color: '#f4f6ff', x: 4.9, z: -40, rotY: -PI / 2 },
    { text: G[2], color: '#1f8fff', x: -4.9, z: -31, rotY: PI / 2, y: 2.2 },
    { text: G[3], color: '#ffd23f', x: 7.9, z: -9, rotY: -PI / 2 }
  ],
  vomitoires: [{ x: -4.95, z: -17, rotY: PI / 2 }, { x: -4.95, z: -47, rotY: PI / 2 }, { x: 0, z: -79.9, rotY: 0 }],
  buvettes: [{ x: 3, z: -24, w: 3.2, signDz: 0.6 }],
  lights: [
    { x: 0, z: -7, color: CYAN }, { x: 0, z: -22, color: PINK }, { x: 0, z: -36, color: CYAN }, { x: 0, z: -48, color: PINK },
    { x: 0, z: -60, color: GOLD, i: 16, d: 18 }, { x: 0, z: -70, color: PINK, i: 16, d: 18 }
  ],
  props: [
    { model: 'portique', x: -2.6, z: -34, rotY: PI / 2 }, { model: 'portique', x: 2.6, z: -34, rotY: PI / 2 }
  ],
  drones: [
    { x: 0, z: -8, y: 4.4, r: 3, speed: 0.7, phase: 0 },
    { x: 0, z: -40, y: 4.4, r: 2, speed: 1.1, phase: 2 },
    { x: 0, z: -64, y: 4.8, r: 5, speed: 0.5, phase: 4 }
  ]
};
