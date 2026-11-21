# TODO

Points connus, à traiter dans des tâches séparées.

## Caméra
- **Caméra contre le rideau** (Petite France, salle 1) : quand le rideau du food court se ferme, l'Ultra
  est collé contre et la caméra, bloquée par les limites de zone, passe presque à la verticale le temps
  d'avancer de quelques mètres. Même comportement près des murs dans la Meinau.
- La caméra traverse les objets du décor (ex. la buvette de la Meinau) : elle ne respecte que les
  limites de zone (`bounds`).
- Sensibilité de la souris et inversion verticale à proposer dans un menu d'options.

## Debug
- **F2 avant les vagues** (`?debug=1`) : F2 téléporte devant les bornes même si les vagues n'ont pas
  été déclenchées ; elles restent alors verrouillées. Pour tester l'énigme : entrer dans le food court,
  F3, F3, puis F2. À améliorer (ex. F2 déclenche et vide les vagues, ou déverrouille les bornes).

## Build
- **Build web plus léger** : `game.js` embarque tous les modèles de tous les niveaux (4,8 Mo avec la
  Petite France). Pistes : un fichier par niveau, ou modèles servis à part pour la version en ligne,
  tout en gardant le build hors-ligne en un seul fichier.
