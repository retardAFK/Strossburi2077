# Tâche : construire la PARTIE 1 du jeu (niveaux 2 à 6, jusqu'au cliffhanger de Kléber 2026)

Lis d'abord, en entier : `CLAUDE.md`, `AGENTS.md`, `docs/decisions.md`, `prompts/05-suite-post-demo.md` (ses règles
restent valables sauf ce qui est modifié ici) et **toutes** les fiches de `docs/designs/`.
Ce prompt est long : **une étape = une branche = une PR**, dans l'ordre. Tu merges toi-même en squash quand la CI est
verte et que tu as posté le résumé (règle déjà convenue avec Maxime), puis tu enchaînes. Maxime suit depuis son téléphone.

---

## 0. Ce qui change par rapport au prompt 05 (décisions de Maxime du 21/11/2026)

1. **Sortie en deux parties.** La partie 1 (niveaux 1 à 6) sort d'abord comme un jeu complet. La partie 2 (2067,
   niveaux 7 à 11) viendra plus tard. Ne code rien de la partie 2, mais garde l'architecture prête (niveaux en données,
   progression sauvegardée, objets et compagnons conservés d'un niveau à l'autre).
2. **Dialogues validés automatiquement pour l'instant.** Tu écris les répliques nécessaires avec le statut `ok` et le
   champ `note: "auto — à relire par Maxime"`. Ton : satire de BlingCo, jamais de l'Alsace ni des gens ; personnages
   parodiques sans citation ni fait attribué à une vraie personne (`CLAUDE.md` §3) ; jetons `{use}`, `{attack}`…
   `tools/dialogues-export.mjs` doit produire la liste des répliques « auto » pour la relecture future.
3. **Fiches de niveau** : `docs/designs/niveau-{meinau,port-rhin,marche2000,kalt,kleber}.md` existent.
   Celles marquées « validé par délégation » (Port du Rhin, Kléber) et les lignes « Proposition Cowork » (flèches
   fumigène / court-circuit / enflammée) sont **autorisées** : Maxime validera en jouant. Tu les implémentes.
4. **Retour vers le futur = PARADOXE** (scène finale de Kléber, voir `niveau-kleber.md`).
5. **Designs** : tout ce qui est visuel vient de `docs/designs/` et `assets/models/`. Si un élément manque (PNJ
   d'ambiance, anciens du kop, dockers, clients, public techno…), **placeholder** : silhouette low poly simple aux couleurs
   neutres, étiquetée, listée dans le résumé de PR (« designs attendus de Cowork »). N'invente pas d'apparence détaillée.

## 1. Règles qui ne bougent pas
- **Zéro régression** : `npm test` vert à chaque PR ; niveau 1, ASR-67, bretzel-boomerang, `meinau-ouest` inchangés.
- Chaque boss = machine à états + **test de boss** (`tests/boss-<nom>.test.mjs`, modèle ASR-67, `?seed=1`, instantané
  des réglages) ; chaque niveau = **test de parcours** (warps F2, aucune erreur de page, fin de niveau atteinte).
- Tout jouable **clavier/souris, manette standard et tactile** (`decisions.md`) ; indications par jetons.
- Chiffres dans `tuning.js`, textes dans les fichiers de textes/dialogues, fichiers < 250 lignes, commentaire de rôle.
- Ne touche ni à `deploy/`, ni à `.github/`, ni au serveur sans accord. **Coordination** : l'autre session fait l'étape F
  (compagnons) ; si tu dois modifier un fichier qu'elle touche (`Input.js`, `Hud.js`, `texts.fr.js`…), attends son merge
  ou signale-le dans la PR. Une seule session par branche.

## 2. Socle commun (une PR : `feat/socle-partie1`)
- **Progression** : enchaînement des niveaux 1 → 6 (fin du niveau N lance le N+1), sauvegarde locale de la progression
  (niveau atteint, objets, compagnons, flèches spéciales) avec try/catch, écran « Continuer / Nouvelle partie ».
- **Sélection de niveau** en debug (`?level=<id>`), garder `?debug=1`, F2/F3.
- **Kit de sbire générique** (`entities/enemies/`) : patrouille, alerte, attaque télégraphiée, étourdissement, mort, à partir
  des pivots standards — réutilisé par tous les sbires (Steward, Agent immo, Vigile, Chariot, Physio, Robot-cordon, Agents Kléber).
- **Flèches spéciales** (bannière, fumigène, court-circuit, enflammée) : effets génériques (accrocher/dérouler, fumée qui
  aveugle, couper un appareil, brûler/faire fondre), caisses qui réapparaissent près des énigmes. Tag : hors gameplay.
- **Intégration des modèles validés** (`assets/models/*.glb`) dans le registre des niveaux, pivots selon les fiches.
- Tests : progression + sauvegarde, kit de sbire dans le bac à sable.

## 3. Les niveaux (une PR par niveau, dans l'ordre)
Pour chacun : (a) maquette grise jouable à partir de la fiche `niveau-<id>.md` (salles, warps, objectifs) → (b) décor
d'après la vignette et le script Blender de la fiche (kit de pièces exportées en `.glb` si besoin, sans changer le
design) → (c) sbires, objet ou compagnon gagné → (d) énigmes → (e) boss + son test → (f) répliques « auto » →
(g) test de parcours → PR, merge, déploiement. Poste à chaque fin de niveau un résumé court + l'URL
`stras2067.duckdns.org/?level=<id>` pour que Maxime teste au téléphone.

1. `feat/niveau-meinau` — Meinau 2026 : parvis, coursive, local du kop (**Arc-Drapeau**), énigme du **tifo** (indice visuel
   sur l'écran géant, « PAS À VENDRE »), boss **Egboehly**.
2. `feat/niveau-port-rhin` — Port du Rhin 2026 : palissade, moulin (**gaffe-grappin**), conteneurs/péniches/grues, boss **le Promoteur**.
3. `feat/niveau-marche2000` — Marché 2000 de nuit : infiltration (fumigène), rayons, réserve, enseigne (**Stork**), boss **le Gérant de nuit**.
4. `feat/niveau-kalt` — Le Kalt : file, cour, salle rythme + lumières (court-circuit), cave (**Dylagne**), boss **le Magnat du Carré VIP**.
5. `feat/niveau-kleber` — Kléber 2026 (ambiance très sombre, brouillard violacé, seuls les néons brillent) : péages,
   labyrinthe de chalets (3 tampons, flèche enflammée), sapin-écran, boss **Marco CeKlair** (traîneau tiré par les agents,
   déplacement au sol), **faux final → glitch → SCN → « 2067… recalculé » → « À suivre »**.

## 4. Fin de partie 1 (PR `feat/fin-partie1`)
Écran de fin « Partie 1 terminée — À suivre », crédits courts, retour au titre ; page d'accueil du site inchangée sauf
accord. Vérifie le poids du build web (TODO) et propose une optimisation si un niveau le fait exploser.

## 5. Quand t'arrêter et demander
Seulement si : un test ne peut pas passer sans changer un comportement du niveau 1 ; une décision de `decisions.md`
« encore ouvert » bloque vraiment (sinon prends l'option la plus simple et note-la « proposition, à valider en jouant ») ;
un changement de `deploy/`, `.github/` ou du serveur est nécessaire. Sinon, avance.

## Livraison (chaque PR)
Branche dédiée, `npm test` vert, résumé court en français : ce qui change, comment tester (URL + `?debug=1`), placeholders
restants (« designs attendus de Cowork »), répliques « auto » ajoutées, propositions à valider en jouant. Merge squash,
déploiement, vérification stras2067 et echo404 (200), puis étape suivante.
