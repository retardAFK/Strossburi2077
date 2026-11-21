# Tâche : support manette standard + indications clavier/souris ET manette

À faire APRÈS l'étape E de la démo (tout le niveau 1 jouable). Lis `CLAUDE.md` et `TODO.md`.
Maxime n'a pas de manette : tout doit être testable sans matériel (manette simulée), et le plus standard possible.

## 1. Manette (API Gamepad, disposition « standard » = Xbox)
- Ne gérer que `gamepad.mapping === 'standard'` comme référence (Xbox, PlayStation et la plupart des manettes
  y sont ramenées par le navigateur). Pour une manette non standard : message discret « Manette non reconnue :
  utilisez Steam Input ou une manette Xbox/PlayStation », et le clavier reste actif.
- Mapping (indices de la disposition standard) :
  | Action | Bouton standard | Xbox | PlayStation |
  |---|---|---|---|
  | Bouger | axes 0/1 | stick gauche | stick gauche |
  | Caméra | axes 2/3 | stick droit | stick droit |
  | Écharpe | 2 | X | Carré |
  | Roulade | 0 | A | Croix |
  | Interagir | 3 | Y | Triangle |
  | Bretzel-boomerang | 5 | RB | R1 |
  | Verrouiller | 6 | LT | L2 |
  | Valider / dialogues | 0 | A | Croix |
  | Retour | 1 | B | Rond |
  | Pause | 9 | Start / Menu | Options |
- Zone morte radiale sur les sticks (0.18 par défaut), courbe de réponse douce ; sensibilité caméra manette
  séparée de la souris. Tous ces chiffres dans `tuning.js`.
- Branchement/débranchement à chaud ; si la manette en cours d'usage se déconnecte en jeu → pause automatique.
- Vibrations (`vibrationActuator.playEffect`) sur coup reçu et impacts de boss, si disponible, désactivables.
- Menus (titre, pause, dialogues, fin de démo) entièrement utilisables à la manette.

## 2. Indications à l'écran qui suivent l'appareil utilisé
- `systems/Prompts.js` : retient le DERNIER appareil utilisé (clavier/souris, manette Xbox, manette PlayStation,
  détectée via `gamepad.id` contenant « 054c » / « DualShock » / « DualSense » → PlayStation, sinon Xbox).
- Toute indication passe par une action abstraite, jamais une touche en dur : `prompt('use')` affiche
  « E » au clavier, « Y » sur Xbox, « △ » sur PlayStation. Textes dans `texts.fr.js` avec un jeton,
  ex. « {use} : pirater ».
- Icônes de boutons dessinées en canvas (pas d'images officielles de marques) : rond coloré + lettre pour Xbox,
  symboles △ ○ ✕ □ pour PlayStation, touche-clavier stylisée pour le clavier.
- Changement instantané quand on touche l'autre appareil.
- Écran « Commandes » (titre + pause) avec deux colonnes : Clavier/souris et Manette.

## 3. Tester sans manette
- Ajoute un mode `?debug=1&fakepad=xbox|ps` : une manette virtuelle pilotée par le clavier pavé numérique,
  pour vérifier mapping et indications.
- Un test Playwright qui simule `navigator.getGamepads()` (Xbox puis PlayStation) et vérifie :
  déplacement, attaque, interaction avec une borne, indications qui changent, pause à la déconnexion.

## Livraison
Branche `feat/manette`, build, tests, résumé court (+ ce que Maxime ou un testeur avec une vraie manette doit vérifier),
commit, PR, CI verte, puis demande « merge ? ». Ne touche pas à `deploy/`, `.github/`, ni au serveur.
