# Niveau Marché 2000 · Porte de l'Hôpital · 2026, la nuit (+ boss le Gérant de nuit BlingCo)
Statut : validé (21/11/2026, par Maxime, dans Cowork)
Plan : `docs/designs/marche2000-plan.png` · Boss : `docs/designs/gerant-nuit.png`, `assets/models/gerant_nuit.glb`
(généré par `tools/blender/gerant_nuit.py`)

Placement : Partie 1 (2026). Satire : ce que BlingCo fait de l'épicerie la nuit ; le quartier, les clients et les
employés ne sont jamais la cible (alliés, indices). Seul « Marché 2000 » est nommé ; aucun autre commerce réel en jeu.

## Décor
Vignette de nuit : `docs/designs/decors-nuit.png` (rideau baissé, porte violette du marché noir, enseigne aux lettres
éteintes + logo BlingCo « Nuit », nid de Stork, palettes « Tradition Certifiée », vigile-robot, abri de tram).
Script : `tools/blender/decors_nuit.py`.

## Géographie (d'après la capture de Maxime)
Bloc de l'épicerie entre la rue de la 1ère Armée (tram, station Porte de l'Hôpital), la rue des Bouchers et la rue de
la Farine ; rue d'Or à l'ouest.

## Déroulé (mix infiltration puis combat)
1. **L'arrière** (cour côté rue de la Farine, départ rue d'Or) : rondes de vigiles-robots, flèches pour éteindre les néons.
2. **Les rayons** : infiltration, caméras-scanners de codes-barres, se cacher derrière les palettes ; clients et employés = indices.
3. **La réserve** : planque de SCN, descente des sbires de BlingCo, combat en vagues.
4. **Le toit / l'enseigne** (angle rue des Bouchers) : énigme, rallumer les lettres « MARCHÉ 2000 » dans le bon ordre
   → **Stork** sort de son nid et rejoint l'Ultra.
B. **Boss** dans le magasin côté tram, derrière la caisse. Première utilisation de Stork.

## Le Gérant de nuit BlingCo (robot inventé, caricature du gérant qui facture tout x10 la nuit)
- Tête-écran au sourire de pub figé (yeux-pixels cyan), casquette violette de gérant + gyrophare « fermeture ».
- Ventre = caisse enregistreuse : afficheur rouge « x10 », touches, **tiroir à billets** (pivot `tiroir`, piste de point faible).
- Blouse d'épicier BlingCo violette, badge doré « GÉRANT ».
- Bras : **étiqueteuse** orange géante (tire des étiquettes de prix, pivot `etiqueteuse`) / **scanner** à rayon rouge (pivot `scanner`).
- Base à roulettes (glisse derrière son comptoir) ; comptoir-caisse = arène (pivot `comptoir`).
Pivots : `root` · `body` · `head` · `tiroir` · `shN/shF` · `etiqueteuse` · `scanner` · `comptoir`.

## Citations de Maxime
« Les deux » (marché noir BlingCo + planque SCN) · « Mix des deux » · « Stork » · « Le Gérant de nuit BlingCo » ·
« yes pour la map voici de quoi t'inspirer pour la géographie » · « pour le look du boss je te suis tu as bien saisi la DA » · « parfait »
