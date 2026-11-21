# Le Promoteur (boss niveau 3, Port du Rhin 2026)
Statut : validé (21/11/2026, par Maxime, dans Cowork) · v2
Type : boss (+ 3 projectiles)

Modèles : `assets/models/promoteur.glb`, `prefab_boite.glb`, `prefab_bureau.glb`, `prefab_loft.glb`
(générés par `tools/blender/promoteur.py`, ne pas éditer à la main) · Planche : `docs/designs/promoteur.png`

**Personnage 100 % inventé** : caricature du TYPE « promoteur / agent immobilier start-up », d'aucune personne réelle.
Ton validé : grotesque ET inquiétant.

## Apparence
- **Start-up boy business man foireux** : rasé de près, côtés rasés + houppe gominée, lunettes rondes, écouteur sans fil
  blanc, doudoune sans manches à logo par-dessus un costume bleu brillant, cravate rouge, badge doré. Sourire XXL.
- **Agent immobilier** : pancarte « VENDU » et trousseau de clés dans la main gauche.
- **Exosquelette-grue** : jambes jaunes de chantier à vérins, contrepoids en béton dans le dos, gyrophare orange ;
  le bras droit EST une flèche de grue en treillis avec câble et crochet.
- **Préfabriqués, à l'échelle** (≈ un studio, ≈ taille de l'Ultra) — les 3 satires :
  boîte « LUXE » + pastille « ÉCO » à fenêtre minuscule · bureau vide vitres noires « À LOUER » · bobo-loft brique,
  verrière, vélo, plante en plastique. Un petit stock sur son dos.

## Pivots
`root` · `hipN/hipF` · `kneeN/kneeF` · `torso` · `head` · `shF` (bras pancarte) · `jib` (flèche de grue) · `hook`
(crochet, d'où partent les préfabriqués) · `prefab_*`. Constante `PREFAB_SCALE = 2.4` dans le script.

## Rappel gameplay (backlog)
Il largue ses préfabriqués ; on les lui renvoie au gaffe-grappin.

## Citations de Maxime
« Exosquelette-grue » · « les 3 » · « Agent immobilier » · « Les deux » · « pense à ce que les boîtes soient à
l'échelle, le côté moustachu fait plus une tête de start-up boy business man foireux » · « parfait »
