# Agent immobilier-clone (sbire, niveau 3 · Port du Rhin 2026)
Statut : validé (21/11/2026, par Maxime, dans Cowork)
Type : ennemi de base
Modèles : `assets/models/agent_immo.glb`, `assets/models/pancarte_vendu.glb` (générés par `tools/blender/agent_immo.py`)
Planche : `docs/designs/agent-immo.png`

## Apparence
Mini-copie du Promoteur (start-up boy) : undercut + houppe, lunettes rondes, écouteur, sourire de vendeur, costume bleu,
doudoune sans manches à logo, cravate rouge, baskets blanches. Pancarte « VENDU » en main gauche, tablette « offre de prêt »
en main droite, 3 pancartes de rechange dans le dos.

## Gag
Il **plante des pancartes VENDU partout** (props `pancarte_vendu.glb`) : sur les mouettes, le décor… et sur l'Ultra.
Piste gameplay (à valider) : une pancarte plantée sur l'Ultra = malus temporaire (ralenti, « en vente ») qu'il faut
secouer / rouler pour enlever.

## Pivots
Standards `CLAUDE.md` §6 (`root, pelvis, torso, head, hipN/F, kneeN/F, shN/F, elN/F, handN/F`, regarde vers +X) + `pancarte`.

## Citations de Maxime
« Agents immobiliers-clones » · « Ils posent des pancartes VENDU partout » · « parfait »
