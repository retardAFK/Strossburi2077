// Niveau 2 : la Meinau, abords du stade, 2026, de jour. MAQUETTE GRISE (docs/designs/brief-greybox-meinau.md, plan
// docs/designs/meinau-abords-plan.svg, validés le 23/11) : blocs gris étiquetés, aucune matière finale.
// DONNÉES UNIQUEMENT. Plan calé sur la vue satellite, nord en haut : x = (x_plan − 344) × 0,2 ; z = (y_plan − 344) × 0,2
// (z négatif = nord). Zones ouvertes reliées : 1 arrivée tram (ouest) · 2 parvis sud · 3 tribune sud (repère) ·
// 4 parking ouest · 5 parc et jardins (sud) · 6 terrain vague, chantier BlingCo (par la passerelle) · 7 centre d'entraînement
// (est, au-delà du Rhin tortu, grillagé).
// Entrées du stade (→ niveau 3) : A portique (parvis) · B grille côté Rhin (accréditation BlingCo, trouvée sur le chantier)
// · C issue de secours (secret). Décisions de Maxime du 23/11 : passerelle, accréditation, terrain vague = BlingCo.
const PI = Math.PI;
const grey = (x, z, w, d, h, label, solid = true) => ({ x, z, w, d, h, tex: 'ph_gris', solid, label });
const car = (x, z) => ({ x, z, w: 2, d: 4.4, h: 1.5, tex: 'ph_gris', solid: true });
const tree = (x, z) => ({ x, z, w: 1.2, d: 1.2, h: 4.5, tex: 'ph_gris', solid: true });

export default {
  id: 'meinau-abords',
  bg: 0x9fb8d8, fog: [45, 150], // ciel de jour urbain
  playerStart: { x: -38, z: -45, face: 0 },
  opening: {
    shots: [
      { from: [-44, 6, -40], to: [-36, 5, -38], look: [0, 6, -30], lookTo: [0, 8, -14], dur: 6 },
      { from: [-10, 5, 12], to: [2, 5, 10], look: [-2, 8, -12], lookTo: [-2, 10, -12], dur: 6 },
      { from: [10, 14, 40], to: [-10, 14, 36], look: [0, 0, 20], lookTo: [0, 2, 0], dur: 6 }
    ],
    captionAt: [0.4, 6, 12]
  },
  zones: [
    { id: 'tram', rect: [-50, -26.8, -38.8, -52.4] },
    { id: 'parking', rect: [-50, -23.8, -6.8, -38.8] },
    { id: 'parvis', rect: [-23.8, 17, 12, -10.4] },
    { id: 'berge', rect: [17, 26, 12, -52.4] },
    { id: 'parc', rect: [-50, 20, 52.4, 12] },
    { id: 'terrain', rect: [26, 62, 0, -52.4] },
    { id: 'centre', rect: [26, 62, 52.4, 0] },
    { id: 'nord', rect: [-50, 26, -6.8, -52.4] }
  ],
  floors: [
    { rect: [-62, 62, 52.4, -52.4], tex: 'ph_gris', sky: true },
    { rect: [-48.8, -26.8, -6.8, -36.8], tex: 'sol', sky: true } // marquages du parking
  ],
  // bords réels, fermés (aucun vide visible) : voie ferrée (N-NE), grillage du centre d'entraînement (E), maisons (S), av. de Colmar (O)
  walls: [
    [-63, 63, -52.4, -53.4, 'ph_gris'], [-63, 63, 53.4, 52.4, 'ph_gris'],
    [-63, -62, 53.4, -53.4, 'ph_gris'], [62, 63, 53.4, -53.4, 'ph_gris']
  ],
  blockers: [[-62, -50, 52.4, -52.4]], // le tram et l'avenue : on ne quitte pas le quartier par là
  labels: [
    { x: 0, z: -53, y: 7.5, text: 'VOIE FERRÉE (BORD)' }, { x: 62.5, z: 10, y: 7.5, text: 'GRILLAGE (BORD)' },
    { x: -10, z: 53, y: 7.5, text: 'MAISONS RUE DES CIRIERS / STOEDEL' }, { x: -56, z: 0, y: 5, text: 'AV. DE COLMAR · TRAM A/E' },
    { x: -38, z: -48, text: '1 · ARRIVÉE TRAM KRIMMERI' }, { x: -38, z: -34, text: '4 · PARKING OUEST' },
    { x: -4, z: 9, text: '2 · PARVIS SUD' }, { x: -20, z: 30, text: '5 · PARC DE L\'EXTENWOERTHFELD' },
    { x: 2, z: 27, text: 'JARDINS FAMILIAUX' }, { x: 45, z: -26, text: '6 · TERRAIN VAGUE · CHANTIER BLINGCO' },
    { x: 45, z: 4, text: "7 · CENTRE D'ENTRAÎNEMENT" }, { x: 24, z: 30, y: 1.5, text: 'RHIN TORTU' }
  ],
  blocks: [
    // le stade (niveau 3) et sa tribune sud, gros volume blanc visible de partout (façade en fuselages d'A340, à dessiner)
    grey(-0.8, -32.2, 46, 37.2, 14, 'STADE DE LA MEINAU (NIVEAU 3)'),
    { x: -0.8, z: -12, w: 46, d: 3.2, h: 17, tex: 'ph_blanc', solid: true, label: '3 · TRIBUNE SUD · FAÇADE FUSELAGES A340', labelSize: 1.6 },
    // le tram à l'arrêt Krimmeri
    grey(-55, -45, 3, 16, 3.2, 'TRAM A/E (KRIMMERI)'),
    // la file des portiques BlingCo (entrée A) : barrières de file sur le parvis, poteaux du portique
    grey(-8, -1, 0.3, 7, 1.1, 'FILE DES PORTIQUES BLINGCO'), grey(-5, -1, 0.3, 7, 1.1), grey(-2, -1, 0.3, 7, 1.1),
    grey(-5.6, -9.4, 1, 2.2, 2.6, 'PORTIQUE A'), grey(-0.2, -9.4, 1, 2.2, 2.6), // les poteaux ferment les côtés
    // le parking : voitures, et l'alcôve de l'issue de secours C (raccourci fermé côté parking)
    car(-45, -32), car(-42, -32), car(-36, -32), car(-33, -32), car(-45, -22), car(-39, -22), car(-36, -22), car(-30, -22),
    car(-45, -12), car(-42, -12), car(-33, -12),
    grey(-25.3, -25.6, 3, 0.4, 2.2, 'ISSUE DE SECOURS C'), grey(-25.3, -32, 3, 0.4, 2.2),
    // la berge du Rhin tortu (l'eau arrête l'Ultra) et la passerelle supposée, fermée
    { x: 26, z: -41, w: 2, d: 23, h: 0.1, tex: 'eau', solid: true },
    { x: 25.5, z: -26.05, w: 2, d: 6.9, h: 0.1, tex: 'eau', solid: true }, { x: 25.5, z: -12.35, w: 2, d: 15.7, h: 0.1, tex: 'eau', solid: true },
    { x: 22.5, z: 8, w: 2, d: 25, h: 0.1, tex: 'eau', solid: true }, { x: 19.5, z: 36, w: 2, d: 33, h: 0.1, tex: 'eau', solid: true },
    // la berge longe la façade est du stade jusqu'à la grille B ; la passerelle enjambe le Rhin tortu vers le terrain vague
    { x: 26.8, z: -21.4, w: 5.2, d: 2.4, h: 0.3, tex: 'ph_gris', label: 'PASSERELLE' },
    grey(26.9, -22.7, 4.6, 0.2, 1.1), grey(26.9, -20.1, 4.6, 0.2, 1.1), // garde-corps
    // le terrain vague, chantier BlingCo (palissades, engins, bungalow où traîne l'accréditation) ; grillage du centre
    grey(40, -40, 10, 0.3, 2.4, 'PALISSADE « BLINGCO PARKING VIP »'), grey(56, -20, 0.3, 14, 2.4, 'PALISSADE'),
    grey(36, -8, 6, 4, 3, 'ENGINS DE CHANTIER'), grey(48, -36, 6, 4, 3, 'BUNGALOW DE CHANTIER BLINGCO'),
    grey(45.6, 0.2, 32.8, 0.3, 3, 'GRILLAGE DU CENTRE'),
    // le centre d'entraînement (terrains grillagés, inaccessible)
    grey(29.2, 15, 0.3, 30, 3, 'GRILLAGE'), { x: 46, z: 16, w: 26, d: 24, h: 0.15, tex: 'ph_gris', label: "TERRAINS D'ENTRAÎNEMENT" },
    // le parc (chemins sous les arbres) et les jardins familiaux (clôtures, cabanes)
    tree(-44, 18), tree(-38, 24), tree(-30, 18), tree(-24, 26), tree(-44, 34), tree(-34, 40), tree(-26, 46), tree(-16, 18),
    tree(-14, 38), tree(-40, 48), tree(14, 18), tree(-4, 18),
    grey(2.2, 25.4, 22, 0.3, 1.2, 'CLÔTURES'), grey(-8.6, 37, 0.3, 23, 1.2), grey(13, 41, 0.3, 16, 1.2), grey(2.2, 49, 22, 0.3, 1.2),
    grey(-4, 31, 3, 3, 2.4, 'CABANE'), grey(6, 33, 3, 3, 2.4, 'CABANE'), grey(-3, 44, 3, 3, 2.4, 'CABANE'), grey(9.5, 42, 3, 3, 2.4, 'CABANE')
  ],
  doors: [
    { id: 'raccourci', rect: [-26.8, -26, -25.4, -32.2], open: false }, // côté parking de l'alcôve C
    { id: 'grilleB', rect: [22.2, 24.6, -32.6, -33.4], open: false } // grille côté Rhin : l'accréditation BlingCo l'ouvre
  ],
  lasers: [{ id: 'portique', x0: -5.1, x1: -0.7, z: -8.5 }],
  objects: [
    // borne du parking (cachée entre les voitures) : ouvre le raccourci vers l'issue de secours C
    { type: 'terminal', x: -47.5, z: -27, rotY: 0, event: 'terminal:parking' },
    // supporters et habitants (placeholders, designs attendus de Cowork)
    { type: 'figurant', id: 'supporter', label: 'SUPPORTER', x: -14, z: 6, rotY: PI / 2, talk: true },
    { type: 'figurant', label: 'SUPPORTRICE', x: -12.5, z: 7, rotY: PI / 2 },
    { type: 'figurant', id: 'habitante', label: 'HABITANTE', x: -30, z: 30, rotY: 0, talk: true },
    { type: 'figurant', id: 'jardinier', label: 'JARDINIER', x: 0, z: 36, rotY: PI, talk: true },
    { type: 'figurant', label: 'SUPPORTER', x: -40, z: -44, rotY: 0 },
    // l'accréditation BlingCo, devant le bungalow du chantier : elle ouvre la grille B
    { type: 'objet', id: 'accreditation', x: 48, z: -33, label: 'ACCRÉDITATION BLINGCO' },
    // écharpes (3) : marqueurs seulement (le système d'écharpes viendra plus tard)
    { type: 'echarpe', id: 'abords-parking', x: -38.4, z: -18.2, label: 'ÉCHARPE (PRINCIPALE)' },
    { type: 'echarpe', id: 'abords-jardins', x: 7.6, z: 39.8, label: 'ÉCHARPE (SECRÈTE)' },
    { type: 'echarpe', id: 'abords-terrain', x: 45.6, z: -12.2, label: 'ÉCHARPE (OBJET)' }
  ],
  ads: [{ x: -3, z: -10.3, w: 6, y: 4.5, idx: 0 }, { x: -24, z: 5, rotY: PI / 2, w: 3, y: 3, idx: 1 }, { x: 40, z: -39.7, w: 5, y: 3.6, idx: 2 }],
  neons: [],
  lights: [
    { x: -38, z: -40, y: 10, color: 0xffffff, i: 10, d: 40 }, { x: -2, z: 0, y: 10, color: 0xffffff, i: 12, d: 40 },
    { x: -20, z: 32, y: 10, color: 0xfff4e0, i: 10, d: 44 }, { x: 40, z: -10, y: 10, color: 0xffffff, i: 8, d: 44 }
  ],
  warps: [
    { id: 'tram', x: -38, z: -45, face: 0 }, { id: 'parking', x: -30, z: -28, face: 0 },
    { id: 'parvis', x: -4, z: 5, face: PI / 2 }, { id: 'berge', x: 20, z: -6, face: PI / 2 }, { id: 'parc', x: -20, z: 20, face: -PI / 2 },
    { id: 'terrain', x: 32, z: -21.4, face: 0 }
  ]
};
