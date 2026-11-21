# src/core — le moteur

Ne connaît **rien** du contenu du jeu (aucun niveau, ennemi ni texte). Ne dépend que de Three.js et de `data/tuning.js`.

| Fichier | Rôle |
|---|---|
| `Renderer.js` | Rendu Three.js en 480×270, agrandi en pixels nets. `scene`, `camera`, `render()`, `setAtmosphere(bg, near, far)` |
| `Input.js` | Clavier / souris / manette / tactile → actions abstraites. `held[a]`, `pressed[a]` (un tick), `axis()`, `look`, `stick`, `device`, `rumble()` |
| `Touch.js` | Commandes tactiles → mêmes actions que `Input` (joystick virtuel, caméra au doigt, boutons) |
| `Camera.js` | Caméra 3e personne : `yaw`/`pitch` (souris, stick), verrouillage, cadrage boss, `bounds` de zone, `shake` |
| `Collision.js` | Collisions 2D au sol : `addBox`, `addCircle` (renvoient un objet avec `on`), `resolve(o, r)`, `Collision.inRect` |
| `Events.js` | Bus d'événements : `on(nom, fn)` (renvoie une fonction de désabonnement), `off`, `emit(nom, ...args)` |
| `Assets.js` | Charge les `.glb` embarqués ; `instance(nom)` → clone + `userData.J` (pivots nommés : `head`, `shN`, `tray`…) |
| `Audio.js` | WebAudio : `play(sfx)`, `music(nom | null)`, bruitages et musiques décrits en données |
| `Random.js` | Aléatoire à graine (`seed(n)`, `rng()`) pour la **logique** de jeu ; graine `?seed=<n>` |

Actions abstraites : `up down left right attack roll lock use throw ok back pause rumble mute`, plus `alt` (clic droit),
`capture` (clic qui capture la souris), `release` (souris libérée), `padLost` (manette débranchée).

Événements : `core/` n'en émet aucun lui-même (il fournit le bus) ; voir `docs/EVENTS.md`.

## Ajouter une action de commande
1. Choisir un nom abstrait (ex. `switch`) ; ne jamais coder une touche dans le jeu.
2. `Input.js` : l'ajouter à `KEYS` (clavier) et à `PAD` (boutons de la disposition standard) ; vérifier les touches libres.
3. `Touch.js` / `touch.js` : bouton tactile si l'action doit exister sur mobile.
4. `data/texts.fr.js` : libellés dans `glyphs.kb`, `glyphs.xbox`, `glyphs.ps` (le test `contenu` vérifie qu'ils sont complets).
5. L'utiliser via `game.input.pressed.<action>` et dans les textes avec le jeton `{<action>}`.
