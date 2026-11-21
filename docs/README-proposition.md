# Stras 2067 — Strasbourg n'est pas à vendre

> **Proposition** de nouveau `README.md` racine (étape B du prompt 05). L'actuel décrit l'ancien prototype 2D
> « Strasbourg 3000 ». À remplacer seulement après l'accord de Maxime.

Aventure-action 3D façon N64 / GameCube, satirique et 100 % strasbourgeoise. En 2067, le consortium BlingCo a racheté
la ville ; un ultra de la Meinau, écharpe bleue et blanche au poing, se bat pour la rendre aux Strasbourgeois.

**Jouer en ligne** : https://stras2067.duckdns.org (ordinateur, manette, téléphone ; installable sur mobile).

## Jouer en local
```
npm ci
npm run build          # ou npm run dev : reconstruit à chaque modification
```
Puis ouvrir `dist/index.html` d'un double-clic (hors ligne, modèles et Three.js embarqués).

Commandes : clavier / souris, manette Xbox ou PlayStation, ou tactile. L'écran « Commandes » (titre ou pause) les
montre toutes ; les indications à l'écran suivent l'appareil utilisé.

## Tester
```
npm test               # build + tests (Chrome installé, piloté sans fenêtre par playwright-core)
```
Tests : parcours du niveau 1, énigmes salle par salle, boss ASR-67 (avec instantané des réglages), Meinau,
manette simulée, contenu et conventions. La mise en ligne ne se fait que si tous les tests passent.

Options de l'URL : `?debug=1` (F2 salle suivante, F3 tue les ennemis), `?level=meinau-ouest`, `?seed=1`,
`?fakepad=xbox|ps` (manette virtuelle au pavé numérique), `?touch=1` (commandes tactiles sur ordinateur).

## Pour contribuer (humains et IA)
- **`CLAUDE.md`** : la référence (histoire, règles de contenu, architecture, méthode). `AGENTS.md` pour les autres IA.
- Un `README.md` par dossier de `src/`, les événements du bus dans `docs/EVENTS.md`, les décisions dans
  `docs/decisions.md`, les designs validés (faits dans Cowork) dans `docs/designs/`.
- Satire de **types**, jamais de vraies personnes ; culture alsacienne montrée avec respect ; faits historiques exacts.

## Historique
Les anciens prototypes restent comme référence : `game/` (beat'em up 2D « Strasbourg 3000 ») et `proto3d/`
(donjon de la cathédrale).
