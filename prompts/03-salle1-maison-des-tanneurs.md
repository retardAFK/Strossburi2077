# Tâche : niveau Petite France 2077, salle 1 jouable (Maison des Tanneurs)

Lis d'abord `CLAUDE.md`. Le design de référence est le GDD « Niveau 1 : Petite France 2077 »
(résumé ci-dessous, ne réinvente pas l'histoire). Les modèles existent déjà dans `assets/models/`
(générés par `tools/blender/*.py`) : ne modifie aucun .glb ni script Blender.

## 0. Règle de contenu à ajouter dans CLAUDE.md (section 3, Règles de contenu)
> - La culture alsacienne est toujours montrée avec respect. La satire vise uniquement ce que le consortium
>   en fait (androïdes, « Expériences Authentiques® », péages, cages « Tradition Certifiée »). Les gens
>   (winstubière, commerçants, supporters) et les traditions sont ce qu'on défend, jamais une cible.
Mets aussi à jour la section 2 (tableau des niveaux) : niveau 1 = Petite France 2077, boss = Androïde de
Service Restauration ASR-67, fin = l'Ultra est envoyé de force dans le passé par SCN (« Stras c'est nous »).

## 1. Socle : plusieurs niveaux (architecture)
- `src/levels/index.js` : registre `{ 'meinau-ouest': {...}, 'petite-france': {...} }`, chaque entrée
  donnant `layout`, `script`, et la liste des modèles et types d'entités qu'elle utilise.
- `main.js` choisit le niveau via `?level=<id>` ; par défaut on garde `meinau-ouest` tant que la
  Petite France n'est pas complète (on basculera le défaut plus tard).
- Seuls les modèles du niveau choisi sont chargés.

## 2. Nouveaux ennemis (machines à états, chiffres dans tuning.js, répliques dans texts.fr.js)
- `entities/enemies/Serveur.js` (modèle `serveur.glb`) : corps à corps, comme le Consultant ; en plus,
  lance son assiette (projectile) quand le joueur est entre 4 et 8 m. Pivot `tray`.
- `entities/enemies/Sommelier.js` (modèle `sommelier.glb`) : distance, garde ses distances comme le Juriste,
  tire des bouchons (projectiles rapides, en rafale de 2). Pivot `bottle`.
- Répliques d'ambiance (« barks ») dans le ton du GDD, ex. Serveur : « Votre table est prête. Votre carte
  bancaire aussi ? » ; Sommelier : « Notes de fruits rouges et de frais de service. » Propose-en 4 chacun.

## 3. Salle 1 : `src/levels/petite-france/` (layout.js = DONNÉES, script.js = événements)
Lieu : la Maison des Tanneurs transformée en « Food Court Premium », de nuit, en bord d'Ill.
- Départ dans une ruelle pavée entre des maisons à colombages (`pf_maison_a`, `pf_maison_b`,
  `pf_maison_b_licence`, `pf_maison_c`), quai (`pf_quai`), lampadaires (`pf_lampadaire`),
  compteurs (`pf_compteur`). Palette néon cyan / rose / or + grès rose et bois.
- Ajoute à `World.js` les textures de sol/mur nécessaires (pavés, grès rose, carrelage de food court)
  et le support des props `.glb` déjà prévu (`props: [{ model, x, z, rotY }]`).
- Intérieur : grande salle de food court (écrans de commande holo = `ads`, cordons néon, tables).
- Déroulé :
  1. Intro (dialogue, texts.fr.js) : l'Ultra arrive à la Petite France, tout est sous licence BlingCo.
  2. Vague 1 : 3 Serveurs. Vague 2 : 2 Serveurs + 1 Sommelier.
  3. La sortie vers la terrasse est fermée par une herse (`pf_herse_laser`). Énigme de prise en main :
     3 bornes « sans contact » (`pf_borne`) à activer (écharpe ou E) en moins de 6 s (chiffre dans tuning) ;
     la borne activée s'allume, toutes se rééteignent si le temps expire. Brique générique dans
     `systems/Puzzle.js` (TimedSwitchGroup), réutilisable pour les autres salles.
  4. Herse ouverte → bannière, checkpoint, et un message holo de **Celle du stade** (`pnj_celle_du_stade`,
     réseau SCN) qui apparaît sur un écran : elle présente SCN et dit d'aller vers l'écluse.
     Elle est une alliée, ton complice et populaire, pas de jargon geek.
  5. Fin provisoire de la démo à la sortie de la salle : écran « Suite : l'Écluse (en construction) ».
- Debug : `?level=petite-france&debug=1` → F2 téléporte devant les bornes, F3 tue tous les ennemis.

## Livraison
1. Branche `feat/petite-france-salle1`.
2. `npm run build`, joue la salle de bout en bout. Si tu ne peux pas jouer toi-même, dis-moi exactement quoi tester.
3. Résumé : fichiers touchés, ce qui marche, ce qui reste approximatif. Attends mon OK.
4. Commit, push, PR, CI. Demande-moi avant de merger.
Ne touche pas à `deploy/`, `.github/`, ni au serveur. Réponds en français, court.
