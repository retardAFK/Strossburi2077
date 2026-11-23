# Journal des décisions

Décisions de gameplay et de structure prises par Maxime. Claude Code s'y réfère avant de coder ;
une décision « tranché » ne se rediscute pas sans Maxime. Les valeurs chiffrées sont des **valeurs de départ**,
à mettre dans `tuning.js` et à ajuster en jeu dans le bac à sable (`?level=bac-a-sable&debug=1`).

Contrainte transversale : tout doit être jouable **au clavier/souris, à la manette (Xbox / PlayStation) et au tactile**.
Le niveau 1 (Petite France) et le bretzel-boomerang ne changent pas de comportement.

---

## 21/11/2026 — Arc-Drapeau, flèches, compagnons, niveaux (tranché par Maxime)

### Arc-Drapeau (étape E)
| Sujet | Décision |
|---|---|
| Visée | **Les deux.** Cible verrouillée → la flèche part vers elle. Sinon, **maintenir « viser »** = vue par-dessus l'épaule, visée à la souris / stick droit / glisser du doigt. Crochets du tifo, cibles et interrupteurs sont **verrouillables** : tout se fait aussi au verrouillage (indispensable au tactile). |
| Tir | **Tir simple**, pas de tir chargé : appui = une flèche. Cadence 0,6 s, portée 25 m. |
| Munitions | **Flèches simples illimitées.** Flèches spéciales comptées (départ : 10 max par type), trouvées dans les caisses et lâchées par les sbires. Des caisses qui réapparaissent sont posées à côté de chaque énigme qui demande une flèche spéciale : **on ne peut jamais être bloqué**. Compteur dans le HUD. |
| Mouvement | Hors visée, on tire en courant. En visée, **marche lente** (50 % de la vitesse). La roulade annule la visée. |

### Flèches
**4 flèches jouables** : bannière, fumigène, enflammée, court-circuit. La flèche **tag est retirée** du gameplay
(aucun usage prévu dans les niveaux) ; son modèle et sa fiche restent dans le repo pour un éventuel bonus.
Seule la flèche simple est jouable à l'étape E ; les 4 autres arrivent avec les niveaux qui en ont besoin.

### Changer d'arme, de flèche, viser (actions abstraites `switch`, `arrow`, `aim`)
| | Objet suivant / précédent | Type de flèche | Viser (maintenir) |
|---|---|---|---|
| Clavier / souris | Tab | molette ou 1 à 4 | clic droit maintenu quand l'arc est équipé |
| Manette | croix haut / bas | croix gauche / droite | **LB** (LT reste le verrouillage) |
| Tactile | toucher l'icône d'objet | toucher l'icône de flèche | bouton « viser » maintenu |

Le clic droit garde son comportement actuel avec le bretzel (objet si rien n'est verrouillé, sinon verrouillage).
Mapping exact à vérifier dans `core/Input.js` au moment de coder (touches libres constatées le 21/11 :
Tab, R, T, C, X, G, chiffres ; manette : LB, RT, B en jeu, croix).

### Mégaphone
**Capacité spéciale du final**, pas une arme du sélecteur : obtenu à Kléber 2067 (« Mégaphone oui »), il sert à
rallier les foules. L'objet du niveau 2 (Meinau 2026) est l'**Arc-Drapeau**. Tableau de `CLAUDE.md` §2 mis à jour.

### Compagnons Stork et Dylagne (étape F)
| Sujet | Décision |
|---|---|
| Obtention | Selon les fiches : **Stork** sort de son nid sur le toit du **Marché 2000** ; **Dylagne** rejoint l'Ultra dans la cave du **Kalt**. |
| Invocation | **Recharge, utilisable partout.** Stork : présente 10 s (piqués sur les ennemis), recharge 20 s. Dylagne : présent 8 s (soin + onde de choc de grosse caisse), recharge 35 s. En plus, des **endroits spéciaux** (perchoir, plaque de tribune) où le compagnon débloque une énigme, sans attendre la recharge. |
| Nombre | **Un seul à la fois** : invoquer l'autre renvoie le premier. |
| Commandes | **Un bouton par compagnon** (actions `summonStork`, `summonDylagne`). Clavier : R = Stork, T = Dylagne. Manette : RT = Stork, B = Dylagne (B ne sert qu'aux menus en jeu). Tactile : deux icônes rondes avec recharge en camembert. |
| Expression | Selon la fiche : cris + bulles d'icônes, aucun texte. |

### Niveaux : 13, dans cet ordre (la Meinau et le Kalt en deux niveaux depuis le 23/11)
| # | Niveau | Époque | Objet / compagnon gagné | Boss |
|---|---|---|---|---|
| 1 | Petite France | 2067 | bretzel-boomerang | ASR-67 (fait) |
| 2 | La Meinau : abords du stade | 2026 | — (3 entrées vers le niveau 3) | — |
| 3 | La Meinau : intérieur du stade | 2026 | Arc-Drapeau | Egboehly |
| 4 | Port du Rhin | 2026 | gaffe-grappin | Le Promoteur |
| 5 | Marché 2000 (nuit) | 2026 | Stork | Le Gérant de nuit BlingCo |
| 6 | Le Kalt : abords (rue La Fayette, cour) | 2026 | — (entrées cour, cave, toit) | — |
| 7 | Le Kalt : intérieur (Main, Mezza, cave, Carré VIP) | 2026 | Dylagne | Le Magnat du Carré VIP |
| 8 | Place Kléber | 2026 | — (faux final, tout l'arsenal) | Marco CeKlair |
| 9 | Petite France v2 | 2067 | — | ASR-67 Premium+, puis Al2 Prout |
| 10 | Port du Rhin | 2067 | tambour | La Tour |
| 11 | La Cathédrale | 2067 | — | Le Coq de l'horloge BlingCo |
| 12 | Place Kléber | 2067 | mégaphone | Le Conseil d'administration |
| 13 | La Meinau (final) | 2067 | — | Le PDG de BlingCo |

Partie 1 (2026) = niveaux 2 à 8 ; partie 2 (2067) = niveaux 9 à 13. Les autres lieux 2026 seront aussi découpés en abords
+ intérieur (décision du 23/11 ci-dessous). À venir (`docs/designs/decisions-chapitre1.md`, décisions 11 à 13) : le
Marché 2000 devient le Baggersee, placé avant le Kalt ; ce tableau sera refait à ce moment-là.

### Décisions du 23/11/2026 (brief `docs/designs/brief-greybox-meinau.md`, validé par Maxime dans Cowork)
- Chaque lieu 2026 se découpe en **abords + intérieur** ; la Meinau en pilote (maquette grise d'abord, validée en jouant).
- **2026 = réaliste** : « Les niveaux 2026 montrent les lieux réels tels qu'ils sont : matières, repères et éclairage fidèles.
  Le cyberpunk est réservé à 2067 et à BlingCo. »
- Tribune de la Meinau : la **vraie tribune sud 2026** (façade en fuselages d'A340). Kop en tribune **ouest**.
- Bords fermés selon le lieu (Meinau : voie ferrée, grillage, maisons, berge du Rhin tortu).
- Vestiaires, loges, sous-sols : design standard de stade. **3 écharpes par niveau** (marqueurs en attendant le système).
- Points ouverts du brief, tranchés par Maxime le 23/11 : le centre d'entraînement s'appelle « centre d'entraînement »
  (pas de nom d'entreprise) ; la **passerelle** sur le Rhin tortu existe ; la grille B s'ouvre avec une **accréditation
  BlingCo** ; le terrain vague est un **chantier BlingCo** (gardé, l'accréditation s'y trouve). Les deux compagnons sont acquis juste avant
le faux final de Kléber 2026.

### Ancien niveau `meinau-ouest`
**Recyclé dans le final** : la tribune ouest devient la première salle de la Meinau 2067 (niveau 11), le boss
« Directeur de la Valorisation » devient un mini-boss. D'ici là, il reste jouable via `?level=meinau-ouest`
et son test fumée reste en place.

---

## Intégrations

| Date | Élément | Fiche / décision utilisée | Notes |
|---|---|---|---|
| 21/11/2026 | Bac à sable `?level=bac-a-sable&debug=1` | prompt 05, étape D | cibles-TPE, 3 mannequins gris (placeholders), fossé, grille, mur haut |
| 21/11/2026 | Sélecteur d'objets + Arc-Drapeau (flèche simple) | `docs/designs/arc-drapeau.md`, décisions ci-dessus | modèle `arc_drapeau.glb` sur le dos / en main, drapeau roulé / déployé ; flèche simple en **placeholder gris** (pas de design validé) ; corde non animée (les tronçons de corde du modèle ne sont pas attachés au pivot `nock`) ; flèches spéciales en données, désactivées |

---

## Encore ouvert
- Retour vers le futur : A (BlingCo arrache l'Ultra via le Serveur), B (paradoxe + rappel par SCN), ou A+B.
- Les questions boss restantes du fichier `docs/Stras2067_reponses_niveaux.xlsx` (onglet « Questions boss ») :
  arènes et phases, durée du faux final, PDG de 2026 = PDG final ?, revanche ASR-67, Coq, 5 boss ensemble,
  les deux kops qui chantent.
- Énigmes de la Meinau 2026 (tifo aux flèches-bannières : détail à écrire dans la fiche du niveau).

---

## Décisions antérieures (journal)
| Date | Sujet | Décision |
|---|---|---|
| 21/11/2026 | Chronologie | 2023 rachat du club · 2026 BlingCo rachète la ville, l'Ultra y est envoyé · 2067 le futur (`YEAR`) |
| 21/11/2026 | Niveau 1 | Petite France (2067), boss ASR-67, fin : SCN envoie l'Ultra en 2026 |
| 21/11/2026 | Niveau par défaut | `petite-france` ; `meinau-ouest` accessible avec `?level=meinau-ouest` |
| 22/11/2026 | Slogan de Marco CeKlair | « Votre passion, notre produit ! » + « Le club de demain avec les consommateurs de demain ! » + « Le marché de demain, payé aujourd'hui ! » (`docs/designs/marco-ceklair.md`) |
| 22/11/2026 | Partie 1 : crédits et répliques | Crédits de fin de partie 1 validés ; répliques du Kalt et de Kléber validées (modifiables plus tard) |
| 21/11/2026 | Noms parodiques | « Egboehly », « Marco CeKlair » autorisés (exception `CLAUDE.md` §3), le reste inventé |
| 21/11/2026 | Salle 1 | « Quartier des Tanneurs » (le bâtiment réel abrite un restaurant) |
| 21/11/2026 | Prix | En BlingCoins (BC), sauf « 30 euros numériques » (réplique de l'ASR-67) |
| 21/11/2026 | Bretzel-boomerang | Obtenu aux Ponts Couverts avant le Videur-Maître d'hôtel (combat-tuto) |
| 21/11/2026 | Manette | Disposition standard (Xbox / PlayStation), indications qui suivent l'appareil |
| 21/11/2026 | Tests | `npm test` obligatoire ; la CI ne déploie pas si un test échoue |
| 21/11/2026 | Designs | Faits dans Cowork, déposés dans `docs/designs/` ; Claude Code n'invente aucun design |

## Intégrations
Ce qui a été branché dans `src/` à partir d'une fiche de `docs/designs/` (date, élément, fiche utilisée).

| Date | Élément | Fiche utilisée |
|---|---|---|
| — | (rien encore : les designs de `docs/designs/` ne sont pas branchés dans `src/`) | — |
