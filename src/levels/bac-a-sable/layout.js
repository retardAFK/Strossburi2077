// Bac à sable de test (?level=bac-a-sable&debug=1) : une salle grise pour régler armes et compagnons sans toucher
// aux vrais niveaux. DONNÉES UNIQUEMENT. Repère : x à droite, z négatif = vers le fond ; zones [x0, x1, zHaut, zBas].
//  - 3 cibles-TPE (rouge, or, cyan) au fond, 3 mannequins (dont un à 30 m), un fossé (eau), une grille (herse fermée)
//    qui ferme une alcôve, un mur haut au milieu (pour Stork plus tard).
const PI = Math.PI;
const CYAN = 0x38f2ff, PINK = 0xff2e88, GOLD = 0xffc040;

export default {
  id: 'bac-a-sable',
  bg: 0x16161e, fog: [30, 70],
  playerStart: { x: 0, z: 0, face: PI / 2 },
  zones: [{ id: 'bac', rect: [-15, 15, 12, -49] }],
  floors: [ // pas de sol au-dessus du fossé (x -15 → -5, z -28 → -32)
    { rect: [-15, 15, 12, -28], tex: 'beton', sky: true }, { rect: [-5, 15, -28, -32], tex: 'beton', sky: true },
    { rect: [-15, 15, -32, -41], tex: 'beton', sky: true }, { rect: [-3, 3, -41, -49], tex: 'beton', sky: true }
  ],
  walls: [
    [-16, 16, 12, 13, 'beton'], [-16, -15, 12, -41, 'beton'], [15, 16, 12, -41, 'beton'],
    [-16, -2.5, -40, -41, 'beton'], [2.5, 16, -40, -41, 'beton'],                 // fond, ouverture fermée par la grille
    [-4, -3, -41, -49, 'beton'], [3, 4, -41, -49, 'beton'], [-4, 4, -49, -50, 'beton'], // alcôve derrière la grille
    [-14, -8, -16, -17, 'beton']                                                     // mur haut (6 m)
  ],
  waters: [{ id: 'fosse', rect: [-15, -5, -28, -32], levels: [-1.2] }],             // fossé : bloque à pied, pas les tirs
  gates: [{ id: 'grille', model: 'pf_herse_laser', x: 0, z: -40.5, rotY: PI / 2, rect: [-2.5, 2.5, -40, -41] }],
  objects: [
    { type: 'cible', group: 'bac', key: 'rouge', x: -6, z: -24, rotY: -PI / 2 },
    { type: 'cible', group: 'bac', key: 'or', x: 0, z: -24, rotY: -PI / 2 },
    { type: 'cible', group: 'bac', key: 'cyan', x: 6, z: -24, rotY: -PI / 2 },
    { type: 'mannequin', id: 'proche', x: -6, z: -10, face: -PI / 2 },
    { type: 'mannequin', id: 'fosse', x: -10, z: -36, face: -PI / 2 },
    { type: 'mannequin', id: 'loin', x: 9, z: -30, face: -PI / 2 }
  ],
  // F2 (debug) : points de passage pour les tests
  warps: [
    { id: 'tir', x: -6, z: -2, face: PI / 2 }, { id: 'cibles', x: 0, z: -14, face: PI / 2 },
    { id: 'fosse', x: -10, z: -24, face: PI / 2 }, { id: 'grille', x: 0, z: -36, face: PI / 2 }
  ],
  neons: [
    { x: -14.9, y: 5.2, z: -18, len: 44, axis: 'z', color: CYAN }, { x: 14.9, y: 5.2, z: -18, len: 44, axis: 'z', color: PINK },
    { x: -6, y: 3.2, z: -39.9, len: 4, axis: 'x', color: 0xff1a3c }, { x: 0, y: 3.2, z: -39.9, len: 4, axis: 'x', color: GOLD },
    { x: 6, y: 3.2, z: -39.9, len: 4, axis: 'x', color: CYAN }
  ],
  ads: [],
  lights: [
    { x: 0, z: -4, color: 0xffffff, i: 18, d: 30 }, { x: 0, z: -22, color: 0xffffff, i: 18, d: 30 }, { x: 0, z: -40, color: PINK }
  ]
};
