// Dialogues du bac à sable : 3 répliques de TEST pour vérifier le circuit des brouillons (aucune vraie réplique).
// Format : { id, who, txt, status: 'draft' | 'ok', note? }. Maxime annote docs/dialogues/bac-a-sable.md,
// puis `node tools/dialogues-import.mjs` réécrit ce fichier (ne garder que ce commentaire au-dessus du tableau).
export default [
  { id: "bas.test.1", who: "TUTO", txt: "Réplique de test n° 1 : {attack} pour fouetter un mannequin.", status: "draft" },
  { id: "bas.test.2", who: "TUTO", txt: "Réplique de test n° 2 : le badge BROUILLON s'affiche avec ?debug=1.", status: "draft" },
  { id: "bas.test.3", who: "L'ULTRA", txt: "Réplique de test n° 3 : rien de tout ça n'est un vrai dialogue.", status: "draft" }
];
