# Niveau Le Kalt · 2026 (+ boss le Magnat du Carré VIP)
Statut : validé (21/11/2026, par Maxime, dans Cowork) · plan et décors validés (« top »)
Boss : `docs/designs/magnat-vip.png`, `assets/models/magnat_vip.glb` (généré par `tools/blender/magnat_vip.py`)

Placement proposé : Partie 1 (2026), après le Marché 2000, avant Kléber (à confirmer).

## Géographie (d'après la vue satellite et la photo Street View de Maxime)
Rue la Fayette, face au parking Plaine des Bouchers, rue Job à l'est. Sur rue : bâtiment blanc à 2 niveaux, volets
roulants, bandes de bardage rouge, petit balcon ; allée avec portail grillagé et poubelle jaune vers une cour ; au fond,
**hangar en bardage rouge** = la salle. Plan : `docs/designs/kalt-plan.png` · entrée : `docs/designs/kalt-exterieur.png` ·
intérieur : `docs/designs/decors-nuit.png` (script `tools/blender/decors_nuit.py`). Aucun autre commerce réel en jeu.
Ajouts BlingCo à l'entrée : tapis doré, potelets + cordon rouge, néon rose « VIP », physio en noir à brassard doré.

## Direction artistique
Le Kalt est une **boîte techno style industriel, all black** (béton noir, poutres d'acier, stroboscopes, lasers).
« De base il ne doit pas y avoir de carré VIP au Kalt, c'est ça qui doit choquer » : BlingCo y installe un
**carré VIP doré** qui jure violemment avec le lieu. La satire vise cette intrusion, jamais le club ni son public.

## Déroulé
1. **La file dehors** (trottoir rue la Fayette, départ côté rue Job) : le peuple techno refoulé.
2b. **L'allée et la cour** : entre le bâtiment blanc et le hangar, physios BlingCo.
2. **La salle principale** : mécanique **rythme + lumières** — les basses ouvrent les passages, les ennemis ne se voient
   qu'aux flashs du stroboscope.
3. **La cave** : **Dylagne** y joue de la grosse caisse et rejoint l'Ultra ; son battement devient la clé du rythme.
4. **Boss** : le Magnat du Carré VIP, au-dessus de la piste.

## Le Magnat du Carré VIP (personnage inventé, caricature du flambeur de carré VIP)
- Costume satin blanc, chemise ouverte, cheveux plaqués, lunettes de soleil la nuit, bracelets VIP dorés, mocassins dorés,
  une **bouteille à étincelles** dans chaque main (pivots `bouteilleN/F` → projectiles).
- **Carré VIP volant** : estrade dorée sur 4 réacteurs, potelets et cordons de velours rouge, canapé capitonné doré,
  seau à champagne, néon rose « VIP ».
Pivots : `root` · `carre_vip` · `magnat` · `head` · `shN/shF` · `bouteilleN/bouteilleF`.

## Citations de Maxime
« le Kalt est une boîte techno style industriel all black » · « Rythme + lumières » · « Oui » (Dylagne) ·
« Le magnat du carré vip mais de base il ne doit pas y avoir de carré vip au kalt c'est ça qui doit choquer ;) » · « parfait »
« voici les inspis pour le kalt » · « hésite pas à me montrer les décors aussi » · « top »
