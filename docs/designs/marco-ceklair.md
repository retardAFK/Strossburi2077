# Marco CeKlair (boss niveau 4, Place Kléber 2026)
Statut : validé (21/11/2026, par Maxime, dans Cowork)
Type : boss (+ 2 projectiles)

Modèles : `assets/models/marco_ceklair.glb`, `cadeau_interdiction.glb`, `cadeau_billet.glb`
(générés par `tools/blender/marco_ceklair.py`, ne pas éditer à la main) · Planche : `docs/designs/marco-ceklair.png`

Nom parodique autorisé par Maxime (`CLAUDE.md` §3). Visage, physique, caractère et actions **100 % inventés** ;
aucune citation, aucun fait ni accusation attribués à une vraie personne.

## Apparence
- **Père Noël corporate cyborg, en NOIR** : costume et bonnet noirs, fourrure blanche, logo doré, barbe ;
  visage mi-chair mi-métal (œil-scanner cyan, sourire forcé) ; bras humain ganté qui distribue, bras robot
  avec la télécommande ; hotte-réacteur (sac de cadeaux sur deux tuyères).
- **Traîneau** noir laqué sur patins dorés, rambarde, fauteuil cuir, **écran holo du slogan** à l'avant.
- **Attelage : 4 agents de sécurité en gilet fluo** à bandes réfléchissantes, casquette noire « SÉCURITÉ » à bande
  fluo, cheveux courts, barbe de 3 jours, lunettes noires, oreillette et son fil, col montant ; ils tirent à la corde.
- **Cadeaux piégés** : interdiction de stade (paquet blanc, panneau sens interdit) · billet hors de prix (paquet doré, $ vert).

## Déplacement (doit rester cohérent)
Tout l'attelage avance vers +X **au sol** : traîneau sur patins, agents qui courent devant (foulées alternées,
pivots `hipN/hipF`, bras tendus vers l'arrière sur la corde), cordes tendues. Le traîneau suit les agents,
jamais l'inverse. La hotte-réacteur ne sert qu'à des à-coups de vitesse, pas à voler.

## Slogan (texte dans `texts.fr.js`, statut brouillon jusqu'à relecture)
Répété « de manière débile, en mode lavage de cerveau » sur l'écran `slogan` et dans ses bulles. Phrase source de Maxime,
mot pour mot : « il repère guy ouvre la porte et le club de demain avec les consommateurs d'aujourd'hui ».
Formulation finale à écrire ensemble (protocole dialogues).

## Pivots
`root` · `traineau` · `santa` · `head` · `hotte` · `slogan` · `agent` ×4 (`lean`, `head`, `hipN/hipF`, `shN/shF`, `rope`) · `gift_*`.

## Encore ouvert
Le faux final (durée avant le glitch) et le lien avec le PDG final : questions boss.

## Citations de Maxime
« slogan et phrase répétée de manière débile en mode brain wash » · « Père Noël corporate cyborg » · « Traîneau-loge VIP »
→ « faisons plutôt un traîneau d'agent de sécu en gilet fluo » · « remplace le rouge par le noir » ·
« il faut que les déplacements soient cohérents également » · « parfait si tu peux juste habiller un peu plus la tête des agents »
