# src/items — les objets de l'Ultra

Un fichier par objet. Tous implémentent **`Weapon.js`** : `{ id, ready, equip(), unequip(), use(), update(dt), hudLine() }`
(+ `aimOnAlt` : le clic droit vise au lieu d'utiliser ; `locksProps` : le verrouillage accroche aussi cibles et crochets).
Le niveau les donne avec `game.inventory.give(new Objet(game))` ; `systems/Inventory.js` appelle `use()` (clic droit si rien
n'est verrouillé, F, RB/R1) et change d'objet (Tab, croix haut / bas, bouton ⇄).

| Fichier | Objet |
|---|---|
| `Weapon.js` | Interface commune des objets du sélecteur |
| `index.js` | Registre `ITEMS` (id → classe) : la sauvegarde rend les objets d'un niveau à l'autre |
| `BretzelBoomerang.js` | Bretzel-boomerang (niveau 1) : courbe aller-retour, touche à distance ennemis, bornes, terminaux et cibles ; survole l'eau et les vitres anti-écharpe. Un seul en vol. |
| `ArcDrapeau.js` | Arc-Drapeau (niveau 2) : tir simple vers la cible verrouillée, ou en visée (clic droit / LB maintenu), ou droit devant ; flèches simples illimitées, flèches spéciales en données (`data/arrows.js`, désactivées tant que non codées). Projectile : `entities/props/Arrow.js`. |

Événements : `inventory:changed` (objet équipé, nombre d'objets), `hud:aim` (visée de l'arc), `arrow:hit` ; voir `docs/EVENTS.md`.
Ce qui est touché est ce qui porte `isEnemy`, `isSwitch`, `isTerminal` ou `isTarget` ; le projectile porte `isPlayerShot`
(les boss s'en servent pour reconnaître un coup de bretzel).

## Ajouter un objet
1. Fiche validée dans `docs/designs/` (sinon placeholder gris) ; modèle dans `levels/index.js` (`models`).
2. `items/<Nom>.js` : la classe `{ id, ready, use() }` ; son projectile ou effet comme une entité interne.
3. Réglages dans `TUNING.<objet>`, nom et touches dans `TEXTS.items.<id>` (jetons `{throw}`…).
4. Le donner depuis un script de salle (`game.inventory.give(...)`) et l'ajouter à `debug:warp` si F2 doit le fournir.
5. Le régler dans le bac à sable (`?level=bac-a-sable&debug=1`) ; test d'obtention et d'utilisation (modèle : `tests/arc-drapeau.test.mjs`).
