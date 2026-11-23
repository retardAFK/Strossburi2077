// Niveau 6 : la place Kléber, la nuit, 2026, fin de la partie 1 (fiche docs/designs/niveau-kleber.md, validée par
// délégation : Maxime valide en jouant cette maquette grise). Ambiance très sombre, brouillard violacé, seuls les néons
// BlingCo brillent. Décor (tools/blender/decor_kleber.py → decor_kleber.glb, sapin-écran au centre) autour du sapin.
// Repère : x à droite, z négatif = vers le fond.
// 1 les portiques-péages (z 8 → -16) · 2 le labyrinthe de chalets (→ -56) · 3 le sapin-écran (→ -86) · B l'estrade (→ -120).
const PI = Math.PI;
const PINK = 0xff4fa3, GOLD = 0xffc040, CYAN = 0x38f2ff, FLUO = 0xd8ff2a, VIO = 0x5a2a9a;
// chalet du labyrinthe : bloc plein aux couleurs des chalets de la planche (planches prune, liseré néon rose)
const chalet = (x0, x1, z) => ({ x: (x0 + x1) / 2, z, w: x1 - x0, d: 3, h: 2.8, tex: 'kl_chalet', solid: true });

export default {
  id: 'kleber',
  bg: 0x0a0714, fog: [10, 44],
  playerStart: { x: 0, z: 5, face: PI / 2 },
  opening: {
    shots: [
      { from: [0, 5, 12], to: [0, 4, 6], look: [0, 2, -12], lookTo: [0, 2, -14], dur: 6 },
      { from: [-10, 7, -20], to: [8, 7, -30], look: [0, 1, -38], lookTo: [0, 1, -44], dur: 6 },
      { from: [0, 4, -60], to: [0, 6, -64], look: [0, 9, -71], lookTo: [0, 3, -112], dur: 6 }
    ],
    captionAt: [0.4, 6, 12]
  },
  zones: [
    { id: 'peages', rect: [-12, 12, 8, -16] },
    { id: 'chalets', rect: [-16, 16, -16, -56] },
    { id: 'sapin', rect: [-16, 16, -56, -86] },
    { id: 'estrade', rect: [-16, 16, -86, -120], boss: true }
  ],
  floors: [
    { rect: [-12, 12, 8, -16], tex: 'kl_dalle', sky: true }, { rect: [-16, 16, -16, -56], tex: 'kl_dalle', sky: true },
    { rect: [-16, 16, -56, -86], tex: 'kl_dalle', sky: true }, { rect: [-16, 16, -86, -120], tex: 'kl_dalle', sky: true }
  ],
  walls: [
    // les péages : la place s'ouvre au fond (x -2 → 2)
    [-13, -12, 8, -17, 'kl_facade'], [12, 13, 8, -17, 'kl_facade'], [-16, -2, -16, -17, 'kl_facade'], [2, 16, -16, -17, 'kl_facade'],
    // le labyrinthe, le sapin, l'estrade
    [-17, -16, -16, -121, 'kl_facade'], [16, 17, -16, -121, 'kl_facade'],
    [-17, -2, -56, -57, 'kl_facade'], [2, 17, -56, -57, 'kl_facade'],
    [-17, -3, -86, -87, 'kl_facade'], [3, 17, -86, -87, 'kl_facade'], [-17, 17, -120, -121, 'kl_facade']
  ],
  blockers: [[-12, 12, 8, 9], [-1.6, 1.6, -69.4, -72.6]], // le pied du sapin-écran (décor)
  blocks: [
    // péages : barrières Vauban du peuple parqué (à droite), tapis de la file VIP (à gauche)
    { x: 8, z: -4, w: 0.3, d: 10, h: 1.1, tex: 'beton', solid: true },
    // le labyrinthe : trois rangées de chalets, un passage par rangée
    chalet(-16, -5, -24), chalet(-1, 16, -24),
    chalet(-16, 2, -34), chalet(6, 16, -34),
    chalet(-16, -9, -44), chalet(-5, 11, -44),
    // la niche de l'étal à roulettes (tampon 3)
    { x: 14, z: -46.8, w: 4, d: 0.6, h: 2.8, tex: 'kl_chalet', solid: true }, { x: 14, z: -55.2, w: 4, d: 0.6, h: 2.8, tex: 'kl_chalet', solid: true }
  ],
  lasers: [{ id: 'peage', x0: -12, x1: 12, z: -12 }],
  doors: [
    { id: 'sapin', rect: [-2, 2, -56.2, -56.8], open: false },
    { id: 'estrade', rect: [-3, 3, -86.2, -86.8], open: false }
  ],
  props: [
    { model: 'decor_kleber', x: 0, y: -0.03, z: -71, scale: 1 }
  ],
  objects: [
    { type: 'terminal', x: 9.5, z: -10.5, rotY: PI, event: 'peage:hack' },
    ...[-1, -3.5, -6].map((z, i) => ({ type: 'figurant', label: 'PEUPLE PARQUÉ', x: 10, z, rotY: PI, talk: false, id: i ? null : 'parque' })),
    // compagnons (version événement) : ils rejoignent l'Ultra dès le départ
    { type: 'stork', x: -11, z: 7, y: 3 }, { type: 'dylagne', x: 1.5, z: 6.5, rotY: PI / 2 },
    // le labyrinthe : tampons, caisse de flèches enflammées, neige payante, étal à roulettes
    { type: 'tampon', id: 't1', x: 14.5, z: -29 },
    { type: 'tampon', id: 't2', x: -14, z: -39 },
    { type: 'tampon', id: 't3', x: 14.5, z: -51 },
    { type: 'caisse', x: -3, z: -28.5, arrow: 'enflammee' },
    { type: 'neige', id: 'n1', x: -11, z: -39, w: 1, d: 7 },
    { type: 'tractable', id: 'etal', label: 'ÉTAL À ROULETTES', x: 11, z: -51, w: 2, d: 7.6, h: 2.2, axis: 'x', min: 5, max: 11, color: 0x6a4a3a },
    // le sapin-écran : générateur, caisses près de l'énigme (on n'est jamais bloqué)
    { type: 'projo', id: 'generateur', x: 6, z: -78, label: 'GÉNÉRATEUR DU SAPIN', color: CYAN },
    { type: 'caisse', x: -12, z: -60, arrow: 'court_circuit' }, { type: 'caisse', x: 12, z: -60, arrow: 'enflammee' },
    // le faux final : tout le monde revient (placeholders, cachés jusque-là)
    ...[['WINSTUBIÈRE', -6], ['ANCIEN DU KOP', -3], ['DOCKER', 3], ['PUBLIC TECHNO', 6]].map(([label, x], i) =>
      ({ type: 'figurant', id: 'foule' + i, label, x, z: -92, rotY: -PI / 2, hidden: true }))
  ],
  ads: [
    { x: -11.9, z: -4, rotY: PI / 2, w: 3, y: 3, idx: 0 }, { x: 15.9, z: -40, rotY: -PI / 2, w: 3, y: 3, idx: 1 },
    { x: -15.9, z: -64, rotY: PI / 2, w: 3.4, y: 3.4, idx: 2 }, { x: 0, z: -119.9, w: 6, y: 4.2, idx: 3 }
  ],
  neons: [
    { x: 0, y: 3.4, z: -11.6, len: 24, axis: 'x', color: PINK }, { x: -15.9, y: 3.2, z: -36, len: 40, axis: 'z', color: VIO },
    { x: 15.9, y: 3.2, z: -36, len: 40, axis: 'z', color: VIO }, { x: 0, y: 4, z: -86.6, len: 6, axis: 'x', color: GOLD },
    { x: 0, y: 5, z: -119.8, len: 30, axis: 'x', color: FLUO }
  ],
  lights: [
    { x: 0, z: -2, y: 7, color: PINK, i: 6, d: 20 }, { x: 0, z: -30, y: 8, color: VIO, i: 7, d: 26 },
    { x: 0, z: -48, y: 8, color: VIO, i: 7, d: 24 }, { x: 0, z: -71, y: 12, color: CYAN, i: 12, d: 30 },
    { x: 0, z: -100, y: 8, color: GOLD, i: 10, d: 28 }, { x: 0, z: -114, y: 7, color: FLUO, i: 8, d: 22 }
  ],
  warps: [
    { id: 'peages', x: 0, z: 5, face: PI / 2 }, { id: 'chalets', x: 0, z: -18, face: PI / 2 },
    { id: 'sapin', x: 0, z: -58.5, face: PI / 2 }, { id: 'estrade', x: 0, z: -89, face: PI / 2 }
  ]
};
