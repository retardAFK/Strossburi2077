# Arc-Drapeau
Statut : validé (21/11/2026, par Maxime, dans Cowork)
Type : arme
Rôle en jeu : arme à distance gagnée à la Meinau 2026 (niveau 2). Se range sur le dos.

Modèle : `assets/models/arc_drapeau.glb` (généré par `tools/blender/arc_drapeau.py`, ne pas éditer à la main)
Planche : `docs/designs/arc-drapeau.png`

## Apparence (variante A « Tribune »)
- Arc recourbé en alu noir mat (low poly, segments alternés noir / gris foncé), embouts acier.
- Poignée en satin bleu et blanc (motif `satin_bw`), petit repose-flèche acier.
- Corde = écharpe torsadée : tronçons alternés bleu / blanc.
- Drapeau du kop bleu-blanc-bleu : **roulé** le long de la branche haute au repos, **déployé** au tir
  (il claque vers l'arrière). Taille réduite validée.
- Hauteur ≈ 1,25 (l'Ultra ≈ 1,95).

## Pivots du .glb
`root` (poignée, origine) · `tipTop` · `tipBot` · `nock` (milieu de corde, à reculer pour bander) ·
`flagRolled` (visible au repos) · `flagOpen` (visible pendant la visée / le tir). Le jeu affiche l'un OU l'autre.
Orientation : arc vertical (Z), dos de l'arc vers +X, corde côté tireur (-X).

## Porté sur le dos (idée de Maxime : « plus Zelda like »)
- Accroché au pivot `torso` de l'Ultra, en diagonale, quand il n'est pas équipé.
- Valeurs de départ dans le script : `BACK_POS = (-0.42, 0.12, 1.6)`, `BACK_ROT = (32, 0, 90)` ordre ZXY
  (repère Blender, pieds à l'origine). **À ajuster en jeu** : l'arc doit être centré sur le dos, sans
  traverser la veste ni dépasser de l'épaule. Mettre les valeurs finales dans `tuning.js`.

## Animation attendue
Sortir l'arc du dos → viser (corde reculée via `nock`, drapeau qui passe de roulé à déployé) → tir → retour.

## Citations de Maxime
« A » · « l'arc sur le dos ça serait pas mal et plus zelda like non ? » · « ok tes suggestions »

## Flèches (fiche à venir, pas encore validée)
Un look par type. Notes de Maxime : enflammée « en mode torche de stade », fumigène « couleur bleu ».
Rangées dans une banane à la taille.
