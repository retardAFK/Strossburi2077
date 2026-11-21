# Gaffe-grappin (objet du niveau 3 · Port du Rhin 2026)
Statut : validé (21/11/2026, par Maxime, dans Cowork)
Type : objet / outil
Modèle : `assets/models/gaffe_grappin.glb` (généré par `tools/blender/gaffe_grappin.py`) · Planche : `docs/designs/gaffe-grappin.png`

## Apparence (« les deux » : perche de marinier + treuil SCN bricolé)
- Perche de marinier en bois, bagues d'acier, prise en ruban satin bleu-blanc, embout acier.
- Treuil SCN bricolé : tambour acier, corde bleu-blanc enroulée, manivelle à poignée rouge, colliers de serrage, scotch.
- Crochet de marinier en acier (pointe + croc recourbé), **détachable** : au tir il part, relié par la corde bleu-blanc.
- Longueur ≈ 1,8 (l'Ultra ≈ 1,95).

## Pivots
`root` (prise main, à accrocher à `handN` de l'Ultra) · `hook` (crochet, se détache au tir) · `rope_start` (sortie de corde)
· `crank` (manivelle, tourne pendant l'enroulement). Perche le long de +X, crochet vers l'avant.
Corde en jeu : à générer entre `rope_start` et `hook` (segments alternés bleu/blanc).

## Rappel gameplay (backlog, non tranché ici)
Se hisser entre péniches et grues, déplacer des conteneurs, renvoyer au Promoteur ses préfabriqués.

## Citations de Maxime
« Les deux » · « Bois + acier + corde bleu-blanc » · « top »
