# src/items — les objets de l'Ultra

Un fichier par objet. Un objet est une petite classe `{ id, ready, use() }` que le niveau donne avec
`game.inventory.give(new Objet(game))` ; `systems/Inventory.js` appelle `use()` (clic droit si rien n'est verrouillé, F, RB/R1).

| Fichier | Objet |
|---|---|
| `BretzelBoomerang.js` | Bretzel-boomerang (niveau 1) : courbe aller-retour, touche à distance ennemis, bornes, terminaux et cibles ; survole l'eau et les vitres anti-écharpe. Un seul en vol. |

Événements : `inventory:changed` (émis par l'inventaire, écouté par le HUD et le tactile).
Ce qui est touché est ce qui porte `isEnemy`, `isSwitch`, `isTerminal` ou `isTarget` ; le projectile porte `isPlayerShot`
(les boss s'en servent pour reconnaître un coup de bretzel).

## Ajouter un objet
1. Fiche validée dans `docs/designs/` (sinon placeholder gris) ; modèle dans `levels/index.js` (`models`).
2. `items/<Nom>.js` : la classe `{ id, ready, use() }` ; son projectile ou effet comme une entité interne.
3. Réglages dans `TUNING.<objet>`, nom et touches dans `TEXTS.items.<id>` (jetons `{throw}`…).
4. Le donner depuis un script de salle (`game.inventory.give(...)`) et l'ajouter à `debug:warp` si F2 doit le fournir.
5. Test : obtention + une utilisation (voir `tests/enigmes-niveau1.test.mjs`, borne sur pile).
