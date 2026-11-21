# Sbires du Marché 2000 : robot-vigile à lampe + chariot-robot (niveau 4 · 2026, la nuit)
Statut : validé (21/11/2026, par Maxime, dans Cowork)
Type : ennemis de base
Modèles : `assets/models/vigile_nuit.glb`, `chariot_robot.glb`, `etiquette_x10.glb` (générés par `tools/blender/vigiles_nuit.py`)
Planche : `docs/designs/vigiles-nuit.png` · Couleurs « BlingCo Nuit » (violet / noir), comme le Gérant de nuit.

## Robot-vigile à lampe (dehors : l'arrière, côté rue de la Farine)
Robot violet, tête-projecteur allumée (pivot `lampe` = origine du faisceau, à utiliser pour l'infiltration : rester hors
du faisceau), badge doré « SÉCURITÉ NUIT », ceinturon avec rouleau d'étiquettes, étiqueteuse orange au poing (main N).
Pivots standards `CLAUDE.md` §6 + `lampe`.

## Chariot-robot de rayon (dans les rayons)
Caddie motorisé (moteur violet dans le panier), gyrophare violet, scanner rouge à l'avant (pivot `scanner`), bras articulé
+ étiqueteuse (pivot `bras`), 4 roues.

## Gag
Ils collent des **étiquettes « x10 »** sur tout ce qu'ils voient (prop `etiquette_x10.glb`).

## Citations de Maxime
« Les deux » · « Étiquettes de prix » · « top »
