// Niveau 7 : le Kalt, l'intérieur, la nuit, 2026. MAQUETTE GRISE (docs/designs/brief-greybox-kalt.md, plan
// docs/designs/kalt-plan.svg v2) : blocs gris étiquetés, design standard de club industriel (le vrai club interdit les
// photos). DONNÉES UNIQUEMENT. Les étages sont posés côte à côte dans le monde, reliés par des escaliers (script).
// Rez-de-chaussée : le MAIN (grand hangar, rythme + lumières, props/Sono.js) et le CARRÉ VIP BlingCo (boss, à l'est).
// Étage (z -68 → -96) : la MEZZA (petite salle, régie lumière) et l'ARTSPACE (expo, indices).
// Cave (à l'ouest du Main) : Dylagne ; accès par le Main (porte coupée depuis la régie) ou par le soupirail (niveau 6).
// Parcours : cour → Main → Mezza → cave → Carré VIP → boss.
const PI = Math.PI;
const PINK = 0xff4fa3, RED = 0xff1a3c, CYAN = 0x38f2ff, GOLD = 0xffc040, VIO = 0x8a5cff;
const grey = (x, z, w, d, h, label, solid = true) => ({ x, z, w, d, h, tex: 'ph_gris', solid, label });

export default {
  id: 'kalt',
  bg: 0x07070b, fog: [16, 60],
  playerStart: { x: 0, z: -12, face: PI / 2 }, // entrée « cour » (le niveau 6 peut choisir la cave : script)
  opening: {
    shots: [
      { from: [0, 4, -11], to: [0, 4, -16], look: [0, 2, -40], lookTo: [0, 2, -44], dur: 6 },
      { from: [-10, 3, -72], to: [-2, 3, -74], look: [0, 1.5, -90], lookTo: [0, 1.5, -90], dur: 6 },
      { from: [17, 5, -14], to: [17, 5, -20], look: [24, 2, -30], lookTo: [24, 3, -30], dur: 6 }
    ],
    captionAt: [0.4, 6, 12]
  },
  zones: [
    { id: 'main', rect: [-16, 16, -10, -50] },
    { id: 'piste', rect: [16, 32, -12, -48], boss: true },
    { id: 'cave', rect: [-40, -16, -20, -44] },
    { id: 'mezza', rect: [-16, 7, -68, -96] },
    { id: 'artspace', rect: [7, 30, -68, -96] }
  ],
  floors: [
    { rect: [-16, 16, -10, -50], tex: 'ph_gris' }, { rect: [16, 32, -12, -48], tex: 'ph_gris' },
    { rect: [-40, -16, -20, -44], tex: 'ph_gris' }, { rect: [-16, 30, -68, -96], tex: 'ph_gris' }
  ],
  walls: [
    // le Main : porte de la cave (ouest), rideau du Carré VIP (est)
    [-17, 17, -9, -10, 'ph_gris'], [-17, 17, -50, -51, 'ph_gris'],
    [-17, -16, -10, -28, 'ph_gris'], [-17, -16, -32, -50, 'ph_gris'], [16, 17, -10, -28, 'ph_gris'], [16, 17, -32, -50, 'ph_gris'],
    // le Carré VIP
    [17, 33, -11, -12, 'ph_gris'], [17, 33, -48, -49, 'ph_gris'], [32, 33, -12, -48, 'ph_gris'],
    // la cave
    [-41, -40, -19, -45, 'ph_gris'], [-41, -16, -19, -20, 'ph_gris'], [-41, -16, -44, -45, 'ph_gris'],
    // l'étage : la Mezza et l'artspace, une porte entre les deux
    [-17, 31, -67, -68, 'ph_gris'], [-17, 31, -96, -97, 'ph_gris'], [-17, -16, -68, -96, 'ph_gris'], [30, 31, -68, -96, 'ph_gris'],
    [6, 8, -68, -80, 'ph_gris'], [6, 8, -84, -96, 'ph_gris']
  ],
  labels: [
    { x: 0, z: -11, y: 5, text: 'MAIN · REZ-DE-CHAUSSÉE' }, { x: 24, z: -13, y: 5, text: 'CARRÉ VIP BLINGCO' },
    { x: -28, z: -21, y: 4.5, text: 'CAVE · SOUS-SOL' }, { x: -5, z: -69, y: 4.5, text: 'ÉTAGE · LA MEZZA' },
    { x: 19, z: -69, y: 4.5, text: "ÉTAGE · L'ARTSPACE" }, { x: 0, z: -9.6, y: 2.6, text: 'PORTE DE LA COUR' }
  ],
  blocks: [
    // le Main : piliers IPN, scène DJ, bar, escalier vers l'étage
    grey(-7, -26, 0.6, 0.6, 6, 'PILIER IPN'), grey(7, -26, 0.6, 0.6, 6), grey(-7, -40, 0.6, 0.6, 6), grey(7, -40, 0.6, 0.6, 6),
    grey(0, -48.6, 10, 2, 1.2, 'SCÈNE DJ'), grey(-13.5, -14, 3, 1.2, 1.1, 'BAR'),
    { ...grey(-14, -48, 3, 3, 0.5, 'ESCALIER → ÉTAGE', false), tex: 'ph_blanc' },
    // le Carré VIP : estrade du Magnat (posée, elle décolle au combat)
    grey(27, -45, 6, 2, 0.6, 'CANAPÉS VIP'),
    // la cave : fûts, et l'écharpe derrière des fûts qu'on tire au grappin
    grey(-38.5, -24, 1, 1, 1.2, 'FÛTS'), grey(-30, -43, 6, 1, 1.2, 'FÛTS'), grey(-38.7, -41.2, 2.6, 0.6, 1.2), // la niche de l'écharpe
    grey(-38.5, -22, 1.5, 1, 0.5, 'SOUPIRAIL (VERS LES ARRIÈRE-COURS)', false),
    // l'étage : escalier, cabine DJ de la Mezza (l'écharpe derrière), cimaises de l'artspace
    { ...grey(-14, -70, 3, 3, 0.5, 'ESCALIER → REZ-DE-CHAUSSÉE', false), tex: 'ph_blanc' },
    grey(-4, -90, 8, 1.4, 1.2, 'CABINE DJ DE LA MEZZA'), grey(-8.6, -92.5, 0.4, 4, 1.2), grey(0.6, -92.2, 0.4, 2.4, 1.2), // on passe derrière par la droite
    grey(12, -88, 0.4, 6, 2.6, 'ŒUVRE'), grey(20, -76, 6, 0.4, 2.6, 'ŒUVRE'), grey(26, -90, 0.4, 6, 2.6, 'ŒUVRE')
  ],
  doors: [
    { id: 'cave', rect: [-17, -16, -28, -32], open: false },
    { id: 'piste', rect: [16, 17, -28, -32], open: false }
  ],
  // les basses ouvrent les portiques du Main (props/Sono.js)
  lasers: [{ id: 'basse1', x0: -16, x1: 16, z: -22 }, { id: 'basse2', x0: -16, x1: 16, z: -34 }],
  objects: [
    { type: 'sono', rect: [-16, 16, -10, -50], gates: ['basse1', 'basse2'], light: { x: 0, y: 6, z: -30 } },
    { type: 'caisse', x: 13.5, z: -13, arrow: 'court_circuit' },
    // la régie lumière de la Mezza commande la porte de la cave (flèche court-circuit, proposition Cowork)
    { type: 'projo', id: 'regie', x: 3, z: -94, label: 'RÉGIE LUMIÈRE (MEZZA)' },
    { type: 'caisse', x: -13, z: -93, arrow: 'court_circuit' },
    // la cave : Dylagne, l'écharpe derrière les fûts (les tirer au gaffe-grappin)
    { type: 'dylagne', x: -33, z: -26, rotY: 0 },
    { type: 'tractable', id: 'futs', label: 'FÛTS ROULANTS', x: -36.6, z: -42.6, w: 1.6, d: 1.4, h: 1.2, axis: 'x', min: -36.6, max: -31, color: 0x8a8d98 },
    // l'artspace : une artiste (placeholder) donne des indices
    { type: 'figurant', id: 'artiste', label: 'ARTISTE', x: 18, z: -86, rotY: PI / 2, talk: true },
    { type: 'figurant', label: 'PUBLIC TECHNO', x: 22, z: -80, rotY: 0 },
    // écharpes : Mezza (secrète, derrière la cabine DJ), cave (objet, derrière les fûts)
    { type: 'echarpe', id: 'kalt-mezza', x: -4, z: -93.5, label: 'ÉCHARPE (SECRÈTE)' },
    { type: 'echarpe', id: 'kalt-cave', x: -38.6, z: -42.6, label: 'ÉCHARPE (OBJET)' },
    { type: 'caisse', x: 30, z: -14, arrow: 'court_circuit' }, { type: 'caisse', x: 30, z: -46, arrow: 'court_circuit' }
  ],
  ads: [{ x: 15.9, z: -40, rotY: -PI / 2, w: 3, y: 3.4, idx: 0 }, { x: 31.9, z: -30, rotY: -PI / 2, w: 3.4, y: 3.6, idx: 2 }],
  neons: [
    { x: -15.9, y: 4.5, z: -30, len: 36, axis: 'z', color: RED }, { x: 15.9, y: 4.5, z: -20, len: 14, axis: 'z', color: RED },
    { x: -39.9, y: 3, z: -32, len: 22, axis: 'z', color: VIO }, { x: 24, y: 5.5, z: -47.9, len: 14, axis: 'x', color: PINK },
    { x: -5, y: 4, z: -95.9, len: 20, axis: 'x', color: CYAN }
  ],
  lights: [
    { x: 0, z: -30, y: 6, color: 0x3a1020, i: 4, d: 30 }, { x: 24, z: -30, y: 6, color: GOLD, i: 12, d: 26 },
    { x: -28, z: -32, y: 4, color: 0x9a4dff, i: 9, d: 22 }, { x: -5, z: -82, y: 5, color: 0x9a4dff, i: 8, d: 24 },
    { x: 19, z: -82, y: 5, color: 0xffffff, i: 8, d: 24 }
  ],
  warps: [
    { id: 'cour', x: 0, z: -12, face: PI / 2 }, { id: 'mezza', x: -10, z: -76, face: PI / 2 },
    { id: 'artspace', x: 20, z: -72, face: PI / 2 }, { id: 'cave', x: -24, z: -30, face: PI }, { id: 'piste', x: 18.5, z: -30, face: 0 }
  ],
  // arrivées depuis le niveau 6 (sauvegarde : entry) et escaliers entre le rez-de-chaussée et l'étage
  entries: { cour: { x: 0, z: -12, face: PI / 2 }, cave: { x: -37, z: -24, face: 0 } },
  stairs: { up: { rect: [-15.5, -12.5, -46.5, -49.5], to: { x: -11, z: -72, face: PI / 2 } },
    down: { rect: [-15.5, -12.5, -68.5, -71.5], to: { x: -11, z: -45, face: -PI / 2 } } }
};
