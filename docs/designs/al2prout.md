# Al2 Prout (boss niveau 5, Petite France 2067, après ASR-67 Premium+)
Statut : validé (21/11/2026, par Maxime, dans Cowork) · v2 « mi-chair mi-robot »
Type : boss

Modèle : `assets/models/al2prout.glb` (généré par `tools/blender/al2prout.py`, ne pas éditer à la main)
Planche : `docs/designs/al2prout.png`

**Personnage 100 % inventé** : caricature du TYPE « chef de la sécurité / l'autorité » qui surveille les
« consommateurs fidèles », d'aucune personne réelle. Visage générique, jamais de traits ou de phrases d'une vraie personne.
Ton validé : ridicule MAIS inquiétant (il incarne la sécurité, donc l'autorité).

## Apparence
- **Tourelle humanoïde** : socle blindé bleu nuit qui pivote (pas de jambes), roulement or ; torse d'uniforme de vigile,
  épaulettes énormes à galons or, ceinturon, matraque, gants blancs.
- **Transhumain** : visage coupé en deux, côté chair (œil humain, sourcil froncé, nez, rictus) / côté métal
  (œil-scanner rouge, grille-bouche, câbles qui sortent), suture rouge agrafée au milieu ; un avant-bras de chair,
  un avant-bras robot à vérins. Petite tête sous une casquette d'officier.
- **Inquiétant** : caméras de surveillance partout (épaules, torse, dos, casquette, couronne autour du socle) ;
  scanner rouge (pivot `scanner`, rayon qui « note » les gens).
- **Ridicule** : énorme badge VIP doré à bandeau rouge et gyrophare clignotant (pivot `badge`) ; deux réacteurs
  dorsaux qui lâchent des nuages verdâtres « prout » (pivot `prout`, à animer en particules + son).
- Taille : dépasse l'Ultra d'une bonne tête, très large.

## Pivots
`root` · `turret` (rotation sur le socle) · `head` · `scanner` · `badge` · `prout` · `shN/shF` · `elN/elF` · `cam` (×13).

## Citations de Maxime
« tourelle humanoïde style autorité sécuritaire » · « Bruits de pet, Badge VIP clignotant » · « Caméras partout,
Scanner rouge » · « ridicule mais inquiétant car il incarne la sécurité donc l'autorité » · « plus transhumain mi chair
mi robot » · « Parfait »
