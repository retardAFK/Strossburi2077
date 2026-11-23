# Brief Claude Code — maquette grise Meinau (niveaux 2 et 3)

Validé par Maxime le 23/11/2026 dans Cowork.
Plans joints : `meinau-abords-plan.svg` (niveau 2, v1) et `meinau-interieur-plan.svg` (niveau 3, v1), à placer dans `docs/designs/`.

## Règles
- Maquette **grise** uniquement : blocs gris étiquetés, pas de textures finales, pas de nouveaux sprites. Sprites du héros (l'Ultra) inchangés.
- Une PR pour les deux niveaux Meinau, avec captures avant/après. Validation de Maxime en jouant avant matières et repères.
- Ne rien inventer hors plan : tout élément sans design = placeholder gris étiqueté.
- Contrôles clavier-souris + manette standard, indications d'actions comme ailleurs.

## Décisions de référence (23/11)
- Chaque lieu 2026 se découpe en abords + intérieur (Meinau en pilote).
- Tribune : la vraie tribune sud 2026 (façade en fuselages d'A340).
- Bords fermés selon le lieu (ici : voie ferrée, grillage, maisons, berge).
- 2026 = réaliste : « Les niveaux 2026 montrent les lieux réels tels qu'ils sont : matières, repères et éclairage fidèles. Le cyberpunk est réservé à 2067 et à BlingCo. »
- Vestiaires, loges, sous-sols : design standard de stade.
- Kop en tribune **ouest**.
- 3 écharpes par niveau (ici seulement des marqueurs placeholder).

## Niveau 2 — Meinau abords (jour)
Nord en haut. Zones ouvertes reliées, pas une file de salles.
1. Arrivée tram Krimmeri (ouest, av. de Colmar) — spawn.
2. Parvis sud — file portiques BlingCo, stewards-robots en patrouille, PNJ supporters/habitants.
3. Tribune sud — gros volume blanc (placeholder façade fuselages), visible depuis toutes les zones.
4. Parking ouest — raccourci (à ouvrir) vers l'issue de secours C.
5. Parc de l'Extenwoerthfeld + jardins familiaux (sud).
6. Terrain vague (est, au-delà du Rhin tortu) — placeholder « passerelle ? ».
7. Racing Soprema Parc (est) — grillage = bord.
Entrées vers niveau 3 : A portique (parvis, normale) · B grille côté Rhin tortu (objet requis, placeholder) · C issue de secours ouest (secret).
Bords : voie ferrée NE, grillage E, maisons S/O, berge du Rhin tortu. Aucun vide visible ; ciel urbain.
Écharpes (3) : parking (principal), jardins (secret), terrain vague après passerelle (objet).

## Niveau 3 — Meinau intérieur
Coursive en anneau autour des tribunes, pelouse au centre.
- Ouest : tribune du **kop** + local du kop (énigme tifo existante), loges VIP BlingCo (verrou Arc-Drapeau).
- Est : vestiaires, terminal (énigme existante), sous-sols techniques (verrou Arc-Drapeau).
- 4 buvettes (PNJ, indices), 4 escaliers vers les tribunes.
- Pelouse : boss Egboehly (existant).
- Arrivées : A → coursive sud, B → coursive est, C → coursive ouest.
Écharpes (3) : bord de pelouse (principal), vestiaires (secret), sous-sols (objet).
Boucle : tour de coursive → local du kop → terminal → accès pelouse → boss.

## Hors périmètre de cette PR
Matières finales, éclairage, système d'écharpes complet, sauvegarde/sélection de niveau.

## Points ouverts (placeholder en attendant)
Passerelle sur le Rhin tortu · objet qui ouvre B · terrain vague = zone BlingCo ? · emplacement exact du terminal.
