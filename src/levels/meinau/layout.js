// Niveau 3 : la Meinau, intérieur du stade, 2026. MAQUETTE GRISE (docs/designs/brief-greybox-meinau.md, plan
// docs/designs/meinau-interieur-plan.svg, validés le 23/11) : blocs gris étiquetés. DONNÉES UNIQUEMENT.
// Plan : x = (x_plan − 340) × 0,12 ; z = (y_plan − 340) × 0,12 (nord en haut, z négatif = nord).
// Coursive en anneau autour des tribunes, pelouse au centre. Ouest : local du kop (Arc-Drapeau), tribune du kop (tifo),
// loges VIP (verrou Arc-Drapeau). Est : vestiaires, terminal, sous-sols techniques (verrou Arc-Drapeau).
// Accès pelouse par le tunnel sud : tifo déployé + terminal piraté. Arrivées : A sud, B est, C ouest (niveau 2).
import { TUNING } from '../../data/tuning.js';

const PI = Math.PI, HOOK = TUNING.tifo.colors;
const VIO = 0x8a5cff, WHITE = 0xffffff, BLUE = 0x1f5fd0;
const grey = (x, z, w, d, h, label, solid = true) => ({ x, z, w, d, h, tex: 'ph_gris', solid, label });

export default {
  id: 'meinau',
  bg: 0x9fb8d8, fog: [40, 120],
  playerStart: { x: 0, z: 28, face: PI / 2 }, // entrée A (le niveau 2 peut en choisir une autre : script, arrivee.js)
  opening: {
    shots: [
      { from: [-10, 3, 28], to: [10, 3, 28], look: [0, 2, 0], lookTo: [0, 3, 0], dur: 6 },
      { from: [-24, 4, -20], to: [-24, 5, -6], look: [0, 1, 0], lookTo: [0, 1, 0], dur: 6 },
      { from: [0, 22, 30], to: [0, 18, 20], look: [0, 0, 0], lookTo: [0, 0, -4], dur: 6 }
    ],
    captionAt: [0.4, 6, 12]
  },
  zones: [
    { id: 'local', rect: [-28.8, -18, -17, -24] },
    { id: 'kop', rect: [-28.8, -20.4, 16.8, -17] },
    { id: 'loges', rect: [-44, -36, 22, 4] },
    { id: 'vestiaires', rect: [36, 44, -4, -25] },
    { id: 'soussols', rect: [36, 44, 26, 9] },
    { id: 'acces', rect: [-2, 2, 24, 16.8] },
    { id: 'pelouse', rect: [-20.4, 20.4, 16.8, -16.8], boss: true },
    { id: 'coursive', rect: [-36, 36, 31, -31] }
  ],
  floors: [
    // la coursive (couverte), la pelouse et le kop (à ciel ouvert), le tunnel, les annexes
    { rect: [-36, 36, -24, -31], tex: 'ph_gris' }, { rect: [-36, 36, 31, 24], tex: 'ph_gris' },
    { rect: [-36, -28.8, 24, -24], tex: 'ph_gris' }, { rect: [28.8, 36, 24, -24], tex: 'ph_gris' },
    { rect: [-28.8, -18, -17, -24], tex: 'ph_gris' }, { rect: [-2, 2, 24, 16.8], tex: 'ph_gris' },
    { rect: [-28.8, -20.4, 16.8, -17], tex: 'ph_gris', sky: true }, { rect: [-20.4, 20.4, 16.8, -16.8], tex: 'ph_gris', sky: true },
    { rect: [-44, -36, 22, 4], tex: 'ph_gris' }, { rect: [36, 44, -4, -25], tex: 'ph_gris' }, { rect: [36, 44, 26, 9], tex: 'ph_gris' }
  ],
  walls: [
    // enceinte : portes des loges (ouest) et des vestiaires / sous-sols (est)
    [-37, 37, -31, -32, 'ph_gris'], [-37, 37, 32, 31, 'ph_gris'],
    [-37, -36, 31, 14, 'ph_gris'], [-37, -36, 12, -31, 'ph_gris'],
    [36, 37, 31, 18, 'ph_gris'], [36, 37, 16, -13, 'ph_gris'], [36, 37, -15, -31, 'ph_gris'],
    // annexes
    [-45, -44, 23, 3, 'ph_gris'], [-45, -36, 23, 22, 'ph_gris'], [-45, -36, 4, 3, 'ph_gris'],
    [44, 45, -3, -26, 'ph_gris'], [36, 45, -3, -4, 'ph_gris'], [36, 45, -25, -26, 'ph_gris'],
    [44, 45, 27, 8, 'ph_gris'], [36, 45, 27, 26, 'ph_gris'], [36, 45, 9, 8, 'ph_gris'],
    // local du kop (porte nord sur la coursive, porte sud vers le kop) et dos du kop
    [-29.4, -28.8, 16.8, -24, 'ph_gris'], [-28.8, -24, -23.4, -24, 'ph_gris'], [-22, -18, -23.4, -24, 'ph_gris'],
    [-18.6, -18, -17, -24, 'ph_gris'], [-28.8, -26, -16.6, -17, 'ph_gris'], [-24, -18, -16.6, -17, 'ph_gris']
  ],
  blocks: [
    // tribunes (volumes pleins) ; le tunnel sud traverse la tribune sud
    grey(5.4, -20.4, 46.8, 7.2, 7, 'TRIBUNE NORD'), grey(24.6, 0, 8.4, 33.6, 7, 'TRIBUNE EST'),
    grey(-15.4, 20.4, 26.8, 7.2, 7, 'TRIBUNE SUD'), grey(15.4, 20.4, 26.8, 7.2, 7),
    grey(-24.6, 20.4, 8.4, 7.2, 7, 'TRIBUNE OUEST'),
    grey(-20.4, 0, 0.4, 33.6, 1.1, 'BALUSTRADE DU KOP'),
    // buvettes (4) et escaliers vers les tribunes (4, non praticables en maquette)
    grey(-16.8, -30, 2.4, 1, 1.2, 'BUVETTE'), grey(7.2, -30, 2.4, 1, 1.2, 'BUVETTE'),
    grey(-21.6, 30, 2.4, 1, 1.2, 'BUVETTE'), grey(16.8, 30, 2.4, 1, 1.2, 'BUVETTE'),
    grey(-27.6, -25.2, 1.4, 1.4, 0.8, 'ESCALIER → TRIBUNE'), grey(27.6, -25.2, 1.4, 1.4, 0.8),
    grey(-27.6, 25.2, 1.4, 1.4, 0.8), grey(27.6, 25.2, 1.4, 1.4, 0.8, 'ESCALIER → TRIBUNE'),
    // loges VIP BlingCo, vestiaires (casiers : l'écharpe est derrière), sous-sols techniques
    grey(-41, 8, 3, 1.4, 1, 'LOGES VIP BLINGCO'), grey(-41, 15, 3, 1.4, 1), grey(-41, 20, 3, 1.4, 1),
    grey(42, -15, 1, 12, 2.2, 'CASIERS'), grey(38.5, -8, 1, 3, 0.5, 'BANC'), grey(38.5, -20, 1, 3, 0.5),
    grey(39, 12, 1.2, 1.2, 3, 'TUYAUX'), grey(42, 15, 3, 1, 2, 'TABLEAU ÉLECTRIQUE'), grey(39, 23, 2, 2, 1.6, 'CHAUDIÈRE')
  ],
  doors: [
    { id: 'local', rect: [-26, -24, -16.6, -17], open: false },
    { id: 'loges', rect: [-37, -36, 14, 12], open: false },
    { id: 'soussols', rect: [36, 37, 18, 16], open: false }
  ],
  gates: [{ id: 'pelouse', model: 'pf_herse_laser', x: 0, z: 17, rotY: PI / 2, rect: [-2, 2, 17.3, 16.7] }],
  labels: [
    { x: 0, z: -27.5, y: 4.5, text: 'COURSIVE NORD' }, { x: 0, z: 27.5, y: 4.5, text: 'COURSIVE SUD' },
    { x: -32.4, z: 0, y: 4.5, text: 'COURSIVE OUEST' }, { x: 32.4, z: 0, y: 4.5, text: 'COURSIVE EST' },
    { x: 0, z: 0, y: 1, text: 'PELOUSE' }, { x: 40, z: -24, y: 4, text: 'VESTIAIRES' }, { x: 40, z: 25, y: 4, text: 'SOUS-SOLS TECHNIQUES' },
    { x: -40, z: 5, y: 4, text: 'LOGES VIP BLINGCO' }, { x: -34, z: -4.8, y: 3, text: 'ISSUE DE SECOURS C' },
    { x: 34, z: -16.8, y: 3, text: 'GRILLE B' }, { x: 0, z: 30.5, y: 3, text: 'PORTIQUE A' }
  ],
  terminals: [{ x: 35.2, z: 1.2, rotY: PI, event: 'terminal:pelouse' }],
  objects: [
    // local du kop : l'ancien (placeholder) qui confie l'Arc-Drapeau, 3 cibles du tuto au mur ouest
    { type: 'figurant', id: 'local', label: 'ANCIEN DU KOP', x: -21, z: -20.5, rotY: PI, hidden: true, talk: true },
    { type: 'cible', group: 'tutoArc', key: 'rouge', x: -28.3, z: -18.6, rotY: 0 },
    { type: 'cible', group: 'tutoArc', key: 'or', x: -28.3, z: -20.6, rotY: 0 },
    { type: 'cible', group: 'tutoArc', key: 'cyan', x: -28.3, z: -22.6, rotY: 0 },
    // le kop (tribune ouest) : 5 crochets du tifo face à la pelouse, l'écran géant sur la tribune est, le tifo derrière
    { type: 'crochet', group: 'tifo', key: 0, color: HOOK[0], x: -21.2, z: -8, y: 2.4 }, { type: 'crochet', group: 'tifo', key: 1, color: HOOK[1], x: -21.2, z: -4, y: 2.4 },
    { type: 'crochet', group: 'tifo', key: 2, color: HOOK[2], x: -21.2, z: 0, y: 2.4 }, { type: 'crochet', group: 'tifo', key: 3, color: HOOK[3], x: -21.2, z: 4, y: 2.4 },
    { type: 'crochet', group: 'tifo', key: 4, color: HOOK[4], x: -21.2, z: 8, y: 2.4 },
    { type: 'caisse', arrow: 'banniere', x: -27, z: -14 }, { type: 'caisse', arrow: 'banniere', x: -17, z: 12 }, // kop, pelouse
    { type: 'ecran', x: 20.2, z: 0, y: 4.3, w: 5, rotY: -PI / 2 },
    { type: 'tifo', x: -28.4, z: 0, y: 3.4, w: 16, h: 5, rotY: PI / 2 },
    { type: 'figurant', id: 'kop', label: 'LE KOP', x: -26, z: -6, hidden: true, chant: ['ALLEZ !', 'PAS À VENDRE !', "ICI, C'EST CHEZ NOUS !"] },
    { type: 'figurant', id: 'kop', label: 'LE KOP', x: -26, z: 6, hidden: true, chant: ['PAS À VENDRE !', 'ALLEZ !'] },
    // verrous Arc-Drapeau : une cible BlingCo à côté de chaque porte (loges, sous-sols)
    { type: 'cible', group: 'verrouLoges', key: 'loges', x: -35.4, z: 15.6, rotY: 0 },
    { type: 'cible', group: 'verrouSoussols', key: 'soussols', x: 35.4, z: 19.6, rotY: PI },
    // buvettes : PNJ qui donnent des indices (placeholders)
    { type: 'figurant', id: 'buvette1', label: 'BUVETIER', x: -16.8, z: -29, rotY: -PI / 2, talk: true },
    { type: 'figurant', id: 'buvette2', label: 'BUVETIÈRE', x: 7.2, z: -29, rotY: -PI / 2, talk: true },
    { type: 'figurant', id: 'buvette3', label: 'BUVETIER', x: -21.6, z: 29, rotY: PI / 2, talk: true },
    { type: 'figurant', id: 'buvette4', label: 'BUVETIÈRE', x: 16.8, z: 29, rotY: PI / 2, talk: true },
    // écharpes (3) : marqueurs seulement
    { type: 'echarpe', id: 'interieur-pelouse', x: 13, z: -15.4, label: 'ÉCHARPE (PRINCIPALE)' },
    { type: 'echarpe', id: 'interieur-vestiaires', x: 43.3, z: -15, label: 'ÉCHARPE (SECRÈTE)' },
    { type: 'echarpe', id: 'interieur-soussols', x: 41.5, z: 21, label: 'ÉCHARPE (OBJET)' }
  ],
  // ordre du tifo montré sur l'écran (indices de couleur des crochets)
  tifoOrder: [2, 0, 4, 1, 3],
  ads: [{ x: 0, z: -30.9, w: 4, y: 3.6, idx: 0 }, { x: 35.9, z: -6, rotY: -PI / 2, w: 3, y: 3.4, idx: 1 }, { x: -35.9, z: -12, rotY: PI / 2, w: 3, y: 3.4, idx: 2 }],
  neons: [],
  lights: [
    // coursive : lumière violette (plan) ; pelouse : projecteurs blancs
    { x: 0, z: -27.5, y: 5, color: VIO, i: 10, d: 30 }, { x: 0, z: 27.5, y: 5, color: VIO, i: 10, d: 30 },
    { x: -32.4, z: 0, y: 5, color: VIO, i: 10, d: 30 }, { x: 32.4, z: 0, y: 5, color: VIO, i: 10, d: 30 },
    { x: 0, z: 0, y: 14, color: WHITE, i: 30, d: 50 }, { x: -24, z: 0, y: 8, color: BLUE, i: 12, d: 24 },
    { x: -23, z: -20.5, y: 4, color: WHITE, i: 8, d: 14 }
  ],
  warps: [
    { id: 'A', x: 0, z: 28, face: PI / 2 }, { id: 'local', x: -23, z: -21, face: -PI / 2 },
    { id: 'kop', x: -25, z: -12, face: 0 }, { id: 'terminal', x: 33, z: 1.2, face: PI }, { id: 'pelouse', x: 0, z: 15, face: PI / 2 }
  ],
  // arrivées depuis le niveau 2 (sauvegarde : entry)
  entries: { A: { x: 0, z: 28, face: PI / 2 }, B: { x: 32.4, z: -16.8, face: PI }, C: { x: -32.4, z: -4.8, face: 0 } }
};
