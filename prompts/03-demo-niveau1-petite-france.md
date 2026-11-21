# Tâche : la démo jouable « Niveau 1 : Petite France 2077 », de bout en bout

Lis d'abord `CLAUDE.md`. Tout ce qui suit vient du GDD validé par Maxime : ne réinvente pas l'histoire.
On vise une démo complète et jouable (~12-15 min), qu'on peaufinera APRÈS les tests de Maxime.
Priorité : que tout s'enchaîne et soit jouable ; le réglage fin viendra ensuite.

Les modèles existent dans `assets/models/` (générés par `tools/blender/*.py`). Ne modifie aucun .glb ni script
Blender. Ennemis : `serveur.glb`, `sommelier.glb`. Boss : `asr.glb` (pivots `toque`, `tpe`, `printer`, `whisk`).
Décor : `pf_maison_a/b/b_licence/c`, `pf_quai`, `pf_lampadaire`, `pf_compteur`, `pf_tour_peage`, `pf_herse_laser`,
`pf_pont`, `pf_vanne` (pivots `gate`, `wheel`), `pf_levier` (pivot `arm`), `pf_barque`, `pf_arche_barrage`,
`pf_cible_tpe` (pivot `target`), `pf_vitre`, `pf_borne`, `pf_cage`, `pf_coffre` (pivot `lid`).
Objet : `bretzel_boomerang.glb`. PNJ : `pnj_winstubiere`, `pnj_celui_du_stade`, `pnj_celle_du_stade`.
Héros : l'Ultra actuel, NE PAS le modifier.

## Règles de contenu à ajouter dans CLAUDE.md (section 3)
- La culture alsacienne est toujours montrée avec respect. La satire vise uniquement ce que le consortium en fait
  (androïdes, « Expériences Authentiques® », péages, cages « Tradition Certifiée »). Les gens (winstubière,
  commerçants, supporters) et les traditions sont ce qu'on défend, jamais une cible.
- Les faits historiques affichés en jeu sont exacts et sourcés ; chaque texte historique est relu par Maxime.
Et section 2 : niveau 1 = Petite France (futur), boss = Androïde de Service Restauration ASR-67 ; à la fin,
SCN (« Stras c'est nous ») envoie l'Ultra de force en 2026 (notre époque, quand tout a basculé) ; niveau 2 = la
Meinau en 2026 ; plus tard retour brutal vers le futur (partie 2), final à la Meinau du futur.
L'année du futur est encore à trancher (2077 ou 2067) : mets-la dans UNE constante (`texts.fr.js` → `year`),
jamais en dur.

## Histoire du niveau (à mettre en scène, textes dans texts.fr.js)
BlingCo a privatisé la Petite France et RÉÉCRIT l'histoire : les plaques historiques mentent.
Dans chaque salle, l'Ultra restaure la vraie plaque (interaction E sur une plaque holo → animation glitch →
vrai texte). Plaques (mensonge → vérité), à garder exactement, Maxime relira :
1. Maison des Tanneurs : « Food Court Premium depuis toujours » → cœur du quartier des tanneurs, au bord de l'Ill.
2. Écluse / quartier : « Patrimoine sous licence BlingCo » → quartier populaire de tanneurs, meuniers et pêcheurs ;
   patrimoine mondial de l'UNESCO depuis 1988.
3. Ponts Couverts : « Construits par BlingCo en 2061 » → commencés en 1230, ouverts en 1250 ; leurs toitures en bois
   ont disparu en 1784, le nom est resté.
4. Barrage Vauban : « Rooftop Premium, accès VIP » → bâti par Vauban à partir de 1686 pour barrer l'accès par l'eau ;
   terrasse panoramique ouverte à tous depuis 1966.
SCN = réseau underground et populaire (de la rue et des tribunes), personnages génériques « Celui du stade »,
« Celle du stade ». La winstubière est une ALLIÉE (enfermée, elle souffle les indices), digne et chaleureuse.

## Socle technique
- `src/levels/index.js` : registre des niveaux ; `main.js` choisit via `?level=<id>`.
  Le niveau PAR DÉFAUT devient `petite-france` à la fin de cette tâche (la Meinau reste accessible par `?level=meinau-ouest`).
- Seuls les modèles du niveau choisi sont chargés.
- `systems/Puzzle.js` : briques génériques (interrupteurs à minuterie, séquence ordonnée, état multi-niveaux).
- `systems/Inventory.js` + `items/BretzelBoomerang.js` : lancer (clic droit si rien n'est verrouillé, sinon touche F),
  trajectoire courbe aller-retour, touche ennemis, interrupteurs et cibles à distance.
- Nouveaux ennemis (machines à états, chiffres dans tuning.js) : `Serveur` (corps à corps + lance son assiette à 4-8 m),
  `Sommelier` (distance, bouchons en rafale de 2), `VideurMaitreHotel` (mini-boss : variante large du Serveur, bloque de face).
- Debug `?debug=1` : F2 = salle suivante, F3 = tue tous les ennemis, F4 = donne le boomerang.

## Déroulé (une salle = un checkpoint)
0. **Ouverture (~45 s, caméra scriptée)** : survol de la Petite France futuriste, néons, pubs BlingCo ; voix off en
   texte : la vente du club, puis de la ville. Titre. Passable avec Entrée.
1. **Maison des Tanneurs « Food Court Premium »** : ruelle à colombages + quai, puis food court. Vague 1 : 3 Serveurs ;
   vague 2 : 2 Serveurs + 1 Sommelier. Herse fermée : 3 bornes sans contact à activer en < 6 s. Plaque 1.
   Message holo de Celle du stade : présente SCN, « On t'attendait » (sème le mystère de l'élu).
2. **L'Écluse** : 2 vannes/leviers, 3 niveaux d'eau ; la barque-plateforme ne passe le pont bas qu'au niveau 1 et
   n'atteint le quai haut qu'au niveau 3 ; il faut changer le niveau en route avec la 2e vanne accessible depuis l'eau.
   Drones au-dessus du canal. Winstubière en cage qui donne les indices. Plaque 2.
3. **Ponts Couverts « Péage Patrimoine »** : tours-péages, arène fermée, 3 vagues mixtes + le Videur-Maître d'hôtel.
   Les commerçants libérés ouvrent le coffre : bretzel-boomerang + tuto immédiat (interrupteur hors de portée). Plaque 3.
4. **Barrage Vauban « Rooftop Premium »** : 3 cibles-TPE derrière des vitres anti-écharpe ; le boomerang doit les
   toucher dans l'ordre des néons (rouge, or, cyan) dans un temps limité. Plaque 4.
   Avant la porte du boss : le PDG de BlingCo sur écran géant (silhouette, pas de visage) :
   « L'histoire appartient à ceux qui la possèdent. »
5. **Boss : ASR-67** (cuisine automatisée sous le barrage, Serveur central au fond). Toque = bouclier frontal ;
   point faible = TPE dans le dos (boomerang dessus → « PAIEMENT REFUSÉ », étourdi 2 s, prend l'écharpe).
   Phase 1 (100→66 %) : tickets d'addition en éventail + plats brûlants au sol.
   Phase 2 (66→33 %) : charge avec chariot, appelle 2 Serveurs ; le faire charger dans un pilier-fourneau.
   Phase 3 (33→0 %) : le four souffle des flammes en rotation ; le boomerang traverse les flammes.
   Base de code : `Directeur.js` + un `PhasedBoss.js` générique. Répliques (texts.fr.js) :
   entrée « Bienvenue dans votre Expérience Gastronomique Authentique®. Votre satisfaction est obligatoire. » ;
   « La tarte flambée, c'est 30 euros numériques. » ; « Service non compris. Respiration non comprise. » ;
   « Gloire à l'axe Londres – New Strasbourg. » ; « Client non solvable détecté. Procédure d'évacuation. » ;
   « Coup de feu. Coup de feu. COUP DE FEU. » ; « La choucroute traditionnelle est un abonnement mensuel. » ;
   touché dans le dos « PAIEMENT REFUSÉ. PAIEMENT REFUSÉ. » ; mort du joueur « Merci de votre visite. Laissez un
   avis cinq étoiles. » ; défaite « Erreur... recette originale... introuvable... Gloire à l'axe... »
6. **Cliffhanger** : SCN révèle que l'emprise de BlingCo commence en 2026 ; l'Ultra (l'élu) est branché DE FORCE sur le
   Serveur ; pluie de caractères, glitch ; arrivée « Strasbourg, 2026 » devant la Meinau d'aujourd'hui (plan fixe simple) ;
   écran noir « À suivre » ; teaser texte des niveaux à venir ; « Strasbourg n'est pas à vendre ».

## Livraison : une PR par étape, déployée à chaque fois
Ordre : (A) socle + salle 1 + ouverture, (B) salle 2, (C) salle 3 + boomerang, (D) salle 4, (E) boss + cliffhanger.
Pour chaque étape : branche, build, joue l'étape (ou dis-moi précisément quoi tester), résumé court, commit, PR, CI verte,
puis demande-moi « merge ? ». Après chaque merge, vérifie le déploiement sur https://stras2067.duckdns.org.
Si quelque chose du GDD est irréalisable simplement, propose une version simplifiée et continue : on peaufine après.
Ne touche pas à `deploy/`, `.github/`, ni au serveur. Réponds en français, court.
