# Flèches de l'Arc-Drapeau + banane
Statut : validé (21/11/2026, par Maxime, dans Cowork)
Type : objets (munitions) + accessoire

Modèles : `assets/models/fleche_{banniere,fumigene,enflammee,tag,court_circuit}.glb`, `assets/models/banane.glb`
(générés par `tools/blender/fleches.py`, ne pas éditer à la main) · Planche : `docs/designs/fleches.png`

## Les 5 flèches (fût commun, un look de tête par type)
| Type | Look | Pivots en plus |
|---|---|---|
| Bannière | mini drapeau bleu-blanc-bleu à l'arrière, pointe acier | — |
| Fumigène | cartouche grise cerclée de bleu, bouffées **bleues** | `smoke` (sortie de fumée) |
| Enflammée | **torche de stade** : bâton rouge, flamme rouge vif cœur orange/blanc, étincelles jaunes | `flame` |
| Tag | mini bombe de peinture **bleue**, capuchon blanc (bleu et blanc) | — |
| Court-circuit | prise électrique jaune, éclair cyan | — |
Pivots communs : `root` (encoche, arrière), `tip` (pointe). La flèche pointe vers +X. Longueur ≈ 0,82.
Fumée, flammes et étincelles du modèle sont la pose de référence : en jeu, les animer par particules (`Particles.js`).

## Banane
Banane de supporter noire, fermeture bleue, sangle ; les flèches dépassent avec la couleur de leur type.
Portée **devant, à la taille** (pivot `pelvis` de l'Ultra). Au besoin, afficher seulement les flèches possédées.

## Rappel
La liste finale des flèches jouables reste une décision ouverte (voir `docs/decisions.md`) : le design est validé
pour les 5, le gameplay non.

## Citations de Maxime
« Pour la torche enflammée fais-la en mode torche de stade, et fumigène couleur bleu » · « top » · « juste le tag couleur bleu et blanc, et c'est parfait »
