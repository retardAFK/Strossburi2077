// Niveau 3 : le Port du Rhin, 2026 (fiche docs/designs/niveau-port-rhin.md, validée par délégation). DONNÉES UNIQUEMENT.
// Maquette grise à valider en jouant. Repère : x à droite, z négatif = vers le fond. Décor du port
// (tools/blender/decor_port_rhin.py → decor_port_rhin.glb) en toile de fond, de l'autre côté du bassin.
// 1 quai + palissade (z 8 → -26) · 2 vieux moulin (→ -50) · 3 conteneurs et péniches (→ -94) · 4 quai du chantier (→ -122).
const PI = Math.PI;
const BLUE = 0x1f5fd0, GOLD = 0xffc040, CYAN = 0x38f2ff;
const W = -0.8; // niveau de l'eau

export default {
  id: 'port-rhin',
  bg: 0x7a8aa0, fog: [30, 100],
  playerStart: { x: 0, z: 5, face: PI / 2 },
  opening: {
    shots: [
      { from: [12, 6, 10], to: [8, 5, -6], look: [26, 6, -12], lookTo: [24, 5, -14], dur: 6 },
      { from: [0, 3, 4], to: [-1, 2.6, -12], look: [0, 2, -26], lookTo: [0, 2, -26], dur: 6 },
      { from: [10, 14, -60], to: [6, 12, -80], look: [0, 0, -78], lookTo: [0, 0, -110], dur: 6 }
    ],
    captionAt: [0.4, 6, 12]
  },
  zones: [
    { id: 'quai', rect: [-6, 15, 8, -26] },
    { id: 'moulin', rect: [-6, 4, -26, -54] },
    { id: 'conteneurs', rect: [-12, 12, -54, -94] },
    { id: 'chantier', rect: [-14, 14, -94, -122], boss: true }
  ],
  floors: [
    { rect: [-6, 4, 8, -26], tex: 'beton', sky: true },
    { rect: [-6, 4, -26, -36], tex: 'sol' }, { rect: [-6, 4, -39, -50], tex: 'sol' }, { rect: [-2, 0, -50, -54], tex: 'sol' },
    { rect: [-12, 12, -54, -64], tex: 'beton', sky: true }, { rect: [-12, 12, -84, -94], tex: 'beton', sky: true },
    { rect: [-14, 14, -94, -122], tex: 'beton', sky: true }
  ],
  walls: [
    [-7, -6, 8, -26, 'beton'], [-7, -6, -26, -50, 'gres'], [4, 5, -26, -50, 'gres'],
    [-7, -2, -50, -51, 'gres'], [0, 5, -50, -51, 'gres'], [-3, -2, -51, -54, 'gres'], [0, 1, -51, -54, 'gres'],
    [-13, -2, -53, -54, 'beton'], [0, 13, -53, -54, 'beton'], [-13, -12, -54, -94, 'beton'], [12, 13, -54, -94, 'beton'],
    [-13, -3, -94, -95, 'beton'], [3, 13, -94, -95, 'beton'], [-15, -14, -95, -122, 'beton'], [14, 15, -95, -122, 'beton']
  ],
  blockers: [[-8, 16, 8, 9], [15, 16, -26, 8], [-15, 15, -122, -123]],
  // bassin, bief du moulin, canal entre les péniches : de l'eau (le crochet passe au-dessus, pas l'Ultra)
  waters: [
    { id: 'bassin', rect: [4, 15, 8, -26], levels: [W] }, { id: 'bief', rect: [-6, 4, -36, -39], levels: [W] },
    { id: 'c1', rect: [-12, 12, -64, -67], levels: [W] }, { id: 'c2', rect: [-12, -9, -67, -73], levels: [W] },
    { id: 'c3', rect: [-3, 12, -67, -73], levels: [W] }, { id: 'c4', rect: [-12, 12, -73, -75], levels: [W] },
    { id: 'c5', rect: [-12, -3, -75, -81], levels: [W] }, { id: 'c6', rect: [3, 12, -75, -81], levels: [W] },
    { id: 'c7', rect: [-12, 12, -81, -84], levels: [W] }
  ],
  // péniches (pont à fleur de quai) et barrière de préfabriqués empilés sur le quai des conteneurs
  blocks: [
    { x: -6, z: -70, w: 6, d: 6, h: 0.5, y: -0.4, tex: 'sol' }, { x: 0, z: -78, w: 6, d: 6, h: 0.5, y: -0.4, tex: 'sol' },
    { x: -10, z: -60, w: 4, d: 2.4, h: 2.6, tex: 'beton', solid: true }, { x: 4, z: -60, w: 16, d: 2.4, h: 2.6, tex: 'beton', solid: true }
  ],
  doors: [{ id: 'palissade', rect: [-6, 4, -25.5, -26.5], open: false }],
  gates: [{ id: 'chantier', model: 'pf_herse_laser', x: 0, z: -94.5, rotY: PI / 2, rect: [-3, 3, -94.2, -94.8] }],
  props: [
    { model: 'decor_port_rhin', x: 26, y: -0.45, z: -12, rotY: -PI / 2 },
    { model: 'decor_port_rhin', x: 0, y: -0.45, z: -136 },
    { model: 'prefab_loft', x: -10, y: 2.6, z: -60, scale: 2.4, rotY: 0.3 }, { model: 'prefab_boite', x: 6, y: 2.6, z: -60, scale: 2.4 },
    { model: 'prefab_bureau', x: 9, y: 0, z: -90, scale: 2.4, solid: 1.4 }, { model: 'prefab_boite', x: -9, y: 0, z: -88, scale: 2.4, solid: 1.4 }
  ],
  objects: [
    { type: 'figurant', id: 'mouette', label: 'MOUETTE', x: 3, z: -4 }, { type: 'pancarte', x: 3.2, z: -5 },
    // dockers et mariniers retranchés dans le moulin (placeholders : pas encore de design)
    { type: 'figurant', id: 'dockers', label: 'DOCKER', x: -3.5, z: -31, rotY: PI / 2, talk: true },
    { type: 'figurant', id: 'dockers2', label: 'MARINIÈRE', x: 2, z: -31.5, rotY: PI / 2 },
    // tuto du grappin : anneau de l'autre côté du bief, caisse qui bouche la sortie
    { type: 'anneau', id: 'bief', x: -1, z: -41.5, y: 2.4, land: { x: -1, z: -40.6 } },
    { type: 'tractable', id: 'caisse', label: 'CAISSE DE MARINIER', x: -1, z: -52, w: 2, d: 2, h: 1.8, axis: 'z', min: -52, max: -48, color: 0x8a6a4a },
    // conteneur qui bouche la barrière, anneaux des grues au-dessus des péniches, bollard du quai d'en face
    { type: 'tractable', id: 'conteneur', label: 'CONTENEUR', x: -6, z: -60, w: 4, d: 2.4, h: 2.6, axis: 'z', min: -60, max: -56, color: 0x2a6aa0 },
    { type: 'anneau', id: 'grue1', x: -6, z: -70.5, y: 3.4, post: false, land: { x: -6, z: -69 } },
    { type: 'anneau', id: 'grue2', x: 0, z: -78.5, y: 3.4, post: false, land: { x: 0, z: -77.5 } },
    { type: 'anneau', id: 'bollard', x: 0, z: -86.6, y: 1.8, land: { x: 0, z: -85.4 } }
  ],
  ads: [
    { x: -5.9, z: -8, rotY: PI / 2, w: 3.2, y: 3, idx: 0 }, { x: -1, z: -25.4, w: 4, y: 3.8, idx: 1 },
    { x: 3.9, z: -44, rotY: -PI / 2, w: 2.6, y: 3.4, idx: 2 }, { x: 4, z: -53.9, w: 4, y: 3.6, idx: 3 }, { x: 0, z: -121.5, w: 5, y: 4.5, idx: 0 }
  ],
  neons: [{ x: -5.8, y: 5.2, z: -38, len: 22, axis: 'z', color: GOLD }, { x: 0, y: 4.4, z: -94.6, len: 6, axis: 'x', color: CYAN }],
  lights: [
    { x: 0, z: -2, y: 7, color: 0xffffff, i: 14, d: 26 }, { x: 0, z: -18, y: 7, color: 0xffffff, i: 14, d: 26 },
    { x: -1, z: -32, color: GOLD, i: 12 }, { x: -1, z: -45, color: GOLD, i: 12 },
    { x: 0, z: -60, y: 8, color: 0xffffff, i: 22, d: 30 }, { x: 0, z: -78, y: 8, color: BLUE, i: 18, d: 30 },
    { x: 0, z: -90, y: 8, color: 0xffffff, i: 18, d: 26 }, { x: 0, z: -106, y: 9, color: 0xffffff, i: 30, d: 40 }
  ],
  warps: [
    { id: 'quai', x: 0, z: 5, face: PI / 2 }, { id: 'moulin', x: -1, z: -28, face: PI / 2 },
    { id: 'conteneurs', x: -1, z: -55, face: PI / 2 }, { id: 'peniches', x: -6, z: -63, face: PI / 2 },
    { id: 'chantier', x: 0, z: -97, face: PI / 2 }
  ]
};
