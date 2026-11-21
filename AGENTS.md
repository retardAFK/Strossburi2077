# AGENTS.md — pour les IA autres que Claude

Projet : **Stras 2067 / « Strasbourg n'est pas à vendre »**, aventure-action 3D satirique (Three.js, ES modules, esbuild).
La référence complète est **`CLAUDE.md`** : lis-la en entier avant de toucher au code.

Commandes :
- `npm ci` puis `npm run build` → `dist/index.html` (s'ouvre d'un double-clic, hors ligne).
- `npm test` → build + tous les tests (`tests/*.test.mjs`, Chrome installé piloté par `playwright-core`).
- Jeu : `dist/index.html?debug=1` (F2 salle suivante, F3 tue les ennemis), `?level=meinau-ouest`, `?seed=1`, `?fakepad=xbox|ps`.

Où trouver quoi : un `README.md` par dossier de `src/` ; événements du bus dans `docs/EVENTS.md`
(régénérer : `node tools/list-events.mjs`) ; décisions dans `docs/decisions.md` ; designs validés dans `docs/designs/`.

Les 5 règles (elles priment sur tout le reste) :
1. **Zéro régression** : `npm test` reste vert ; une PR qui touche `entities/bosses/` met à jour le test du boss.
2. **Aucun design inventé** : designs validés dans `docs/designs/`, sinon placeholder gris étiqueté.
3. **Dialogues en brouillon** : seul Maxime valide une réplique.
4. **Lisible** : architecture de `CLAUDE.md` §5, fichiers < 250 lignes, commentaire de rôle en tête de chaque fichier.
5. **Une chose à la fois** : si une décision manque, s'arrêter et poser la question (2-3 options « proposition »).

Contenu : textes en français dans `src/data/texts.fr.js`, chiffres dans `src/data/tuning.js`, satire de types
(`CLAUDE.md` §3). Ne touche ni au serveur, ni aux secrets, ni à `deploy/`.
