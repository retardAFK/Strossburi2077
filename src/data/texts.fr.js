// Tous les textes du jeu. Satire de types : aucune personne ni entreprise réelle.
// Les textes historiques (plaques...) sont exacts, sourcés et relus par Maxime avant publication.

// Année du futur. Ne JAMAIS l'écrire en dur ailleurs.
const YEAR = '2067';

export const TEXTS = {
  year: YEAR,
  title: 'STRASBOURG N\'EST PAS À VENDRE',
  subtitle: 'NIVEAU 1 : LA TRIBUNE OUEST',
  pressStart: 'APPUIE SUR {ok}',
  continueStart: '{ok} : CONTINUER · {back} : NOUVELLE PARTIE', // titre, partie sauvegardée
  doneStart: '{ok} : REJOUER LA PLACE KLÉBER · {back} : NOUVELLE PARTIE', // titre, partie 1 terminée
  // fin de la partie 1 (après la place Kléber) : écran de fin + crédits courts (validés par Maxime le 22/11/2026)
  partEnd: {
    title: 'PARTIE 1 TERMINÉE', sub: 'À SUIVRE…', back: '{ok} : RETOUR AU TITRE',
    credits: ['Idée, univers et niveaux : Maxime', 'Designs : Maxime, avec Cowork · Code et modèles : Claude Code',
      'Satire de types : marques, noms et personnages inventés', 'Merci aux Strasbourgeoises et aux Strasbourgeois.']
  },
  nextLevel: '{ok} : NIVEAU SUIVANT', // écran de fin de niveau (campagne)
  controls: '{move} bouger · {camera} caméra · {attack} écharpe (3 coups) · {roll} roulade · {lock} cible<br>{throw} objet · {use} interagir · {ok} valider · {pause} pause<br>{use} sur cet écran : toutes les commandes · au clavier, clic : capturer la souris',
  items: { boomerang: ['BRETZEL-BOOMERANG', '{throw}'], arc: ['ARC-DRAPEAU', '{throw} tirer · {aim} viser'], gaffe: ['GAFFE-GRAPPIN', '{throw} : grappin'] },
  itemSwitch: '{switch} changer',
  // types de flèches (data/arrows.js), affichés sous l'objet équipé
  arrows: { simple: 'FLÈCHES', banniere: 'BANNIÈRE', fumigene: 'FUMIGÈNE', enflammee: 'ENFLAMMÉE', court_circuit: 'COURT-CIRCUIT' },
  pauseHint: '{pause} : REPRENDRE · {use} : COMMANDES · {rumble} : VIBRATIONS ({state})',
  rumbleState: ['NON', 'OUI'],
  padUnknown: 'Manette non reconnue : utilise Steam Input ou une manette Xbox / PlayStation. Le clavier reste actif.',
  skip: '{ok} : PASSER',
  draftBadge: 'BROUILLON', // réplique non validée par Maxime (visible seulement avec ?debug=1)
  alertBubble: '!', // un sbire repère l'Ultra
  placeholder: 'PLACEHOLDER', // étiquette des éléments sans design validé
  crate: 'CAISSE', // caisse de flèches spéciales
  prompts: {
    hack: '{use} : pirater', activate: '{use} : activer', restore: '{use} : restaurer la plaque', talk: '{use} : parler', crate: '{use} : prendre des flèches', open: '{use} : ouvrir',
    lever: '{use} : actionner le levier', valve: '{use} : tourner la vanne', board: '{use} : monter dans la barque', sail: '{use} : larguer les amarres',
    storkDive: '{use} : STORK, PIQUÉ !', dylagneDrum: '{use} : DYLAGNE, GROSSE CAISSE !',
    tampon: '{use} : prendre le tampon', take: '{use} : prendre'
  },
  // ------------------------------------------------ indications de commandes (systems/Prompts.js)
  // Les textes écrivent des ACTIONS entre accolades ({use}, {attack}...), jamais des touches : l'icône affichée
  // suit le dernier appareil utilisé. Libellés génériques (pas de logos de marques).
  glyphs: {
    kb: { move: 'ZQSD', camera: 'SOURIS', attack: 'J', roll: 'ESPACE', lock: 'MAJ', use: 'E', throw: 'F', ok: 'ENTRÉE', back: 'RETOUR', pause: 'P', rumble: 'V',
      switch: 'TAB', aim: 'CLIC DROIT', arrow: 'MOLETTE' },
    xbox: { move: 'L', camera: 'R', attack: 'X', roll: 'A', lock: 'LT', use: 'Y', throw: 'RB', ok: 'A', back: 'B', pause: 'MENU', rumble: 'VUE',
      switch: 'CROIX ↕', aim: 'LB', arrow: 'CROIX ↔' },
    ps: { move: 'L', camera: 'R', attack: '□', roll: '✕', lock: 'L2', use: '△', throw: 'R1', ok: '✕', back: '○', pause: 'OPTIONS', rumble: 'SHARE',
      switch: 'CROIX ↕', aim: 'L1', arrow: 'CROIX ↔' }
  },
  commands: {
    title: 'COMMANDES', kb: 'CLAVIER / SOURIS', pad: 'MANETTE', close: '{back} : FERMER',
    rows: [['move', 'Bouger'], ['camera', 'Caméra'], ['attack', 'Écharpe (3 coups)'], ['roll', 'Roulade'], ['lock', 'Verrouiller une cible'],
      ['throw', 'Objet (bretzel, tir de l\'arc)'], ['switch', 'Changer d\'objet'], ['aim', 'Viser (arc)'], ['arrow', 'Type de flèche'],
      ['use', 'Interagir'], ['ok', 'Valider / dialogues'], ['back', 'Retour'], ['pause', 'Pause'], ['rumble', 'Vibrations oui / non']]
  },
  // ------------------------------------------------ tactile (téléphone / tablette)
  touch: {
    buttons: { attack: 'ÉCHARPE', roll: 'ROULADE', lock: 'CIBLE', throw: 'BRETZEL', use: 'AGIR', pause: '❚❚', switch: '⇄', aim: 'VISER' },
    itemButtons: { boomerang: 'BRETZEL', arc: 'ARC', gaffe: 'GRAPPIN' }, // libellé du bouton d'objet selon l'objet équipé
    rotate: 'Tourne ton téléphone en paysage 📱↻',
    // écran d'accueil sur mobile (src/install.js) : installer le jeu comme une appli (plein écran, sans barres)
    install: {
      title: 'INSTALLE LE JEU',
      why: 'Sur téléphone, le jeu est bien meilleur installé : plein écran, sans les barres du navigateur.',
      install: 'INSTALLER',
      browser: 'JOUER DANS LE NAVIGATEUR',
      ios: ['Touche {share} Partager, en bas (ou en haut) de Safari', 'Choisis « Sur l\'écran d\'accueil »', 'Lance le jeu depuis sa nouvelle icône'],
      android: ['Ouvre le menu ⋮ du navigateur', 'Choisis « Installer l\'application » (ou « Ajouter à l\'écran d\'accueil »)', 'Lance le jeu depuis sa nouvelle icône']
    },
    // textes remplacés quand on joue au doigt : [chemin dans TEXTS, nouveau texte]
    overrides: [
      ['controls', 'Pouce gauche : bouger · Glisser à droite : caméra<br>ÉCHARPE : 3 coups · ROULADE · CIBLE : verrouiller · BRETZEL : objet · AGIR : interagir<br>Toucher l\'écran : dialogues'],
      ['pressStart', "TOUCHE L'ÉCRAN"],
      ['continueStart', "TOUCHE L'ÉCRAN : CONTINUER"],
      ['doneStart', "TOUCHE L'ÉCRAN : REJOUER LA PLACE KLÉBER"],
      ['partEnd.back', "TOUCHE L'ÉCRAN : RETOUR AU TITRE"],
      ['pauseHint', 'TOUCHE L\'ÉCRAN POUR REPRENDRE'],
      ['skip', "TOUCHER L'ÉCRAN : PASSER"],
      ['items.boomerang.1', 'BOUTON BRETZEL'],
      ['items.arc.1', 'ARC : tirer · VISER : viser'],
      ['itemSwitch', '⇄ : changer'],
      ['intro.2.txt', "ÉCHARPE pour fouetter, trois fois pour le combo. ROULADE pour esquiver. CIBLE pour verrouiller un costard."],
      ['laser.txt', "Un portique laser « Accès Premium ». Le terminal qui clignote, là, doit le couper : je m'approche et AGIR pour le pirater. Ou un bon coup d'écharpe."],
      ['pf.boomerangGot.1', 'BOUTON BRETZEL : lancer'],
      ['pf.boomerangTuto.0.txt', "Le bouton BRETZEL lance le bretzel-boomerang. Il touche à distance : ennemis, bornes, cibles. Il revient tout seul."],
      ['pf.videur.intro.1.txt', "Il pare tout au plateau ! Envoie-lui le bretzel (bouton BRETZEL) pour l'assommer, puis tape pendant qu'il voit des étoiles."],
      ['pf.videur.hint.txt', "L'écharpe ne passe pas son plateau ! Le BRETZEL d'abord, l'ÉCHARPE ensuite !"]
    ]
  },
  hero: "L'ULTRA",
  rooms: { entree: 'PORTE OUEST', coursive: 'COURSIVE DE LA TRIBUNE OUEST', vip: 'SALON « EXPÉRIENCE CLIENT » BLINGCO', sortie: 'VERS LA TRIBUNE' },

  // panneaux holographiques du décor
  ads: [
    ['BLINGCO ARENA', 'ex-stade de la Meinau'],
    ['ABONNEMENT', 'PREMIUM+ : 2 REINS'],
    ['BRETZEL NFT', '49 BC'],
    ['LE FOOTBALL', 'MAIS RENTABLE'],
    ['CHANTEZ MOINS FORT', 'VOUS USEZ LA PELOUSE'],
    ['TRIBUNE OUEST', 'ESPACE EXPÉRIENCE CLIENT'],
    ['MERCATO PERMANENT', 'VOTRE JOUEUR PRÉFÉRÉ : 3 MOIS'],
    [YEAR, 'BLINGCO MULTI-HOLDINGS']
  ],
  buvette: ['BUVETTE 2.0', 'BIÈRE SANS ALCOOL SANS BIÈRE : 18 BC'],

  barks: {
    steward: ['Billet ?', 'Scan en cours…', 'Accès refusé : supporter détecté.', 'Ce pigeon n\'a pas payé sa place.'],
    vigile: ['x10 !', 'Ronde de nuit : tarif de nuit.', 'Produit étiqueté. Client aussi.', 'Après 22 h, tout est x10.'],
    peagiste: ['2 BC le mètre !', 'Vous respirez ? Péage.', 'Badge, carte, empreinte.', 'Le trottoir est une option.'],
    bouclier: ['PUB : vin chaud à 79 BC !', 'PUB : la neige, maintenant en abonnement !', 'Circulez, consommez.'],
    neigeur: ['Neige premium !', 'Gelé ? Payez pour dégeler.', 'Flocon facturé.'],
    physio: ['PAS CE SOIR.', 'Baskets : 3 cm de trop.', 'Tu es sur la liste ? Non.', 'Dress code : pas toi.', 'Même lui, pas ce soir.'],
    cordon: ['ACCÈS VIP.', 'Bip. Liste fermée.', 'Cordon déployé.'],
    chariot: ['x10 !', 'Article non scanné détecté.', 'Bip. Bip. Majoration.', 'Rayon fermé. Prix ouvert.'],
    agent: ['VENDU !', 'Vous aussi : VENDU !', 'Vue sur Rhin, 9 999 BC le m² !', 'Coup de cœur garanti !', "Frais d'agence inclus."],
    consultant: ['On va optimiser ta ferveur !', 'Ton chant n\'est pas monétisable.', 'Synergie !', 'Je te passe en freemium !', 'C\'est pas personnel, c\'est stratégique.'],
    juriste: ['Article 12 : interdiction de chanter !', 'Signe ici, ici, et là.', 'Clause de non-supportérisme !', 'Vous avez lu les CGU ? Non ? Parfait.'],
    serveur: ['Votre table est prête. Votre carte bancaire aussi ?', "Une carafe d'eau ? Option Premium.", 'Le menu « Authentique® » vous tend les bras !', 'Pourboire inclus. Et re-inclus.'],
    videur: ["Vous n'êtes pas sur la liste.", 'Tenue correcte exigée. Écharpe interdite.', 'Réservation obligatoire, même pour respirer.', "Je ne bouge pas. Je suis payé à l'heure."],
    // ASR-67 : répliques du GDD, gardées telles quelles (dont les « euros numériques »)
    asr: ["La tarte flambée, c'est 30 euros numériques.", 'Service non compris. Respiration non comprise.',
      'Gloire à l\'axe Londres – New Strasbourg.', 'La choucroute traditionnelle est un abonnement mensuel.'],
    sommelier: ['Notes de fruits rouges et de frais de service.', "Le vin d'ici, avec notre marge d'ailleurs.", 'Bouchonné ? Non : facturé.', 'Je vous sers un fond ? Au prix de la bouteille.']
  },

  intro: [
    { who: "L'ULTRA", txt: `Meinau, ${YEAR}. Ils ont rebaptisé le stade « BlingCo Arena » et transformé la tribune ouest en « espace expérience client ».` },
    { who: "L'ULTRA", txt: "Le club est devenu une filiale. Demain ce sera la ville. Pas tant qu'il y aura une écharpe dans cette tribune." },
    { who: 'TUTO', txt: "{attack} pour fouetter avec l'écharpe, trois fois pour le combo. {roll} pour rouler. {lock} pour verrouiller un costard." }
  ],
  entreeCleared: { who: "L'ULTRA", txt: "Trois costards de moins. La coursive est par là, je connais le chemin par cœur." },
  laser: { who: "L'ULTRA", txt: "Un portique laser « Accès Premium ». Le terminal qui clignote, là, doit le couper : je m'approche et {use} pour le pirater. Ou un bon coup d'écharpe." },
  laserOff: { who: 'TERMINAL', txt: "ERREUR 404 : MODÈLE ÉCONOMIQUE NON TROUVÉ. Portique désactivé." },
  bossIntro: [
    { who: 'LE DIRECTEUR DE LA VALORISATION', txt: "Mon cher, le football est un produit. Et toi, tu es un coût." },
    { who: 'LE DIRECTEUR DE LA VALORISATION', txt: "Ce club est à moi. Et à moi. Et encore à moi : c'est ça, la multipropriété." },
    { who: "L'ULTRA", txt: "Ta mallette, elle bloque tout de face. Faut le faire frapper dans le vide, puis lui tomber dessus." }
  ],
  bossName: 'LE DIRECTEUR DE LA VALORISATION',
  bossShield: 'CLAUSE DE NON-AGRESSION !',
  bossSummon: "Stagiaires ! Venez défendre mon EBITDA !",
  bossDefeat: [
    { who: 'LE DIRECTEUR DE LA VALORISATION', txt: "Mes... mes actionnaires vont m'entendre. Et le reste de la ville aussi !" },
    { who: "L'ULTRA", txt: "La tribune ouest est libérée. Prochaine étape : la Petite France. Allez, on chante !" }
  ],
  banners: { entree: ['PASSAGE OUVERT', 'direction la coursive'], sortie: ['LA TRIBUNE VOUS ATTEND'] },
  graffiti: ['TRIBUNE OUEST', 'PAS À VENDRE', 'RCS', "ICI C'EST LA MEINAU"],
  victory: ['TRIBUNE OUEST LIBÉRÉE !', 'Les anciens du kop rejoignent la résistance. Fin du niveau 1 (prototype).'],
  gameOver: "Tu t'es fait licencier... Retour au dernier point de contrôle.",

  // ------------------------------------------------ Niveau 1 : Petite France (futur)
  pf: {
    subtitle: `NIVEAU 1 : PETITE FRANCE ${YEAR}`,
    // ouverture : voix off (survol de la Petite France), un sous-titre par plan
    opening: [
      `Strasbourg, ${YEAR}.`,
      "Ça a commencé en 2023, au stade. Un consortium a racheté notre club : BlingCo Multi-Holdings. « Club satellite », qu'ils disaient.",
      "En 2026, ils ont commencé à racheter le reste. Les rues, les ponts, les winstubs. Le marché de Noël ouvert 365 jours par an.",
      "Ici, ils ont même réécrit l'histoire. La Petite France est devenue une « Expérience Authentique® ».",
      "Les gens d'ici paient pour rentrer chez eux. Moi, j'ai encore mon écharpe."
    ],
    // plaques historiques : mensonge de BlingCo -> vraie histoire (TEXTES À RELIRE PAR MAXIME)
    plaqueTitle: ['PLAQUE HISTORIQUE · BLINGCO®', 'LA VRAIE HISTOIRE'],
    plaques: {
      p1: { lie: 'Food Court Premium depuis toujours.', truth: "Cœur du quartier des tanneurs, au bord de l'Ill." },
      p3: { lie: 'Construits par BlingCo en 2061.', truth: 'Commencés en 1230, ouverts en 1250. Leurs toitures en bois ont disparu en 1784, le nom est resté.' },
      p4: { lie: 'Rooftop Premium, accès VIP.', truth: "Bâti par Vauban à partir de 1686 pour barrer l'accès par l'eau. Promenade panoramique depuis 1966." },
      p2: { lie: 'Patrimoine sous licence BlingCo.', truth: "Quartier populaire de tanneurs, meuniers et pêcheurs. Patrimoine mondial de l'UNESCO depuis 1988." }
    },
    plaqueRestored: { who: "L'ULTRA", txt: "Voilà. Notre histoire, pas la leur." },
    rooms: {
      ruelle: 'PETITE FRANCE · RUELLE SOUS LICENCE', foodcourt: 'QUARTIER DES TANNEURS · « FOOD COURT PREMIUM »', terrasse: 'TERRASSE (ACCÈS PAYANT)',
      ecluse: "L'ÉCLUSE · « PASSAGE PREMIUM »", canal: 'CANAL · BARQUE AUTONOME (2 BC / MIN)', quaiHaut: 'QUAI HAUT',
      peage: 'PONTS COUVERTS · « PÉAGE PATRIMOINE »', ponts: 'PONTS COUVERTS · ARÈNE DU PÉAGE', sortie3: 'VERS LE BARRAGE VAUBAN',
      barrage: 'BARRAGE VAUBAN · « ROOFTOP PREMIUM »', cuisine: 'SOUS LE BARRAGE · CUISINE AUTOMATISÉE', meinau: ''
    },
    ads: [
      ['FOOD COURT PREMIUM', 'EXPÉRIENCE AUTHENTIQUE®'],
      ['TARTE FLAMBÉE', '89 BC · FEU EN OPTION'],
      ['COLOMBAGES®', 'PROPRIÉTÉ BLINGCO'],
      ["VUE SUR L'ILL", '2 BC / MINUTE'],
      ['COMMANDEZ ICI', 'SOURIEZ, VOUS PAYEZ'],
      ['BRETZEL', "À L'UNITÉ OU PAR ABONNEMENT"],
      ['ÉCLUSE PREMIUM', 'PASSAGE : 12 BC'],
      ['BARQUE AUTONOME', '2 BC / MINUTE'],
      ['PÉAGE PATRIMOINE', 'TRAVERSÉE : 25 BC'],
      ['PONTS COUVERTS®', 'MARQUE DÉPOSÉE'],
      ['ROOFTOP PREMIUM', 'ACCÈS VIP : 120 BC'],
      ['PAIEMENT SANS CONTACT', 'SUIVEZ LES NÉONS'],
      ['SERVEUR CENTRAL', 'BLINGCO · ACCÈS RACINE'],
      ['CUISINE AUTOMATISÉE', '0 HUMAIN · 100 % MARGE'],
      ['STADE DE LA MEINAU', 'STRASBOURG']
    ],
    intro: [
      { who: "L'ULTRA", txt: "La Petite France, de nuit. Avant, ça sentait le bois mouillé et la tarte flambée. Maintenant ça sent le terminal de paiement." },
      { who: "L'ULTRA", txt: "Tout est « sous licence BlingCo » : les colombages, les géraniums, même le reflet dans l'Ill. Et les gens d'ici se font sortir de chez eux." },
      { who: 'TUTO', txt: "Souris pour regarder, ZQSD pour avancer. Au Quartier des Tanneurs, BlingCo a ouvert un « Food Court Premium » : c'est au bout de la ruelle." }
    ],
    foodcourt: { who: 'ANDROÏDE SERVEUR', txt: "Bienvenue au Food Court Premium ! La table, c'est 40 BC. Ressortir, c'est plus cher." },
    wave2: { who: 'ANDROÏDE SOMMELIER', txt: "Monsieur n'a pas consommé. Monsieur va être servi." },
    herse: [
      { who: "L'ULTRA", txt: "La sortie vers la terrasse est bloquée par une herse laser. Trois bornes « sans contact »... il faut les allumer presque en même temps." },
      { who: 'TUTO', txt: "Active les 3 bornes (E ou écharpe) en moins de {t} secondes." }
    ],
    puzzleFail: ['PAIEMENT EXPIRÉ', 'veuillez recommencer'],
    herseOpen: ['HERSE OUVERTE', 'paiement refusé : vous êtes libre'],
    celle: [
      { who: 'CELLE DU STADE', txt: "Eh, l'écharpe bleue et blanche ! T'inquiète, c'est Celle du stade. J'ai emprunté leur écran deux minutes." },
      { who: 'CELLE DU STADE', txt: "On t'attendait, tu sais. Toi précisément. Je t'expliquerai... pas sur leur réseau." },
      { who: 'CELLE DU STADE', txt: "Nous, c'est SCN : Stras c'est nous. Des gens d'ici. Winstubs, mariniers, anciens du kop, mamies du quartier. On ne lâche rien." },
      { who: 'CELLE DU STADE', txt: "Ils ont bloqué l'écluse pour faire payer le passage. File là-bas, on t'y attend. Et méfie-toi des sommeliers : ils visent bien." },
      { who: "L'ULTRA", txt: "Reçu. Direction l'écluse." }
    ],
    // salle 2 : l'Écluse. La winstubière, enfermée, souffle les indices.
    winstubIntro: [
      { who: 'LA WINSTUBIÈRE', txt: "Psst ! Toi, avec l'écharpe ! Ils m'ont mise dans une cage « Tradition Certifiée® ». Pour les photos, qu'ils disent." },
      { who: 'LA WINSTUBIÈRE', txt: "Trente ans que je sers des baeckeoffe au bord de l'Ill. Ma winstub, ils en ont fait un « Bretzel-Bar Expérience »." },
      { who: "L'ULTRA", txt: "Je vais vous sortir de là. Promis." },
      { who: 'LA WINSTUBIÈRE', txt: "Occupe-toi d'abord de passer. Je connais cette écluse par cœur : viens me parler, je te guide." }
    ],
    // indice selon le niveau d'eau (0 = bas, 1 = moyen, 2 = haut)
    winstubHints: [
      "Voilà, l'eau est basse. Monte dans la barque et file sous le pont. De l'autre côté, la vanne fait remonter l'eau jusqu'au quai haut.",
      "Tu vois le pont bas ? La barque ne passe dessous que si l'eau est au plus bas. Le levier, près du ponton, fait baisser l'eau.",
      "L'eau est haute : parfait pour le quai d'en face. Mais pour repasser sous le pont, il faudra la rebaisser."
    ],
    boat: {
      bridge: { who: "L'ULTRA", txt: "Trop d'eau : on ne passe pas sous le pont. Demi-tour." },
      quaiHigh: { who: "L'ULTRA", txt: "Le quai est trop haut d'ici. Il faut plus d'eau. Demi-tour." },
      endOk: { who: "L'ULTRA", txt: "Le canal s'arrête là. Je descends côté quai." }
    },
    quaiWelcome: { who: 'ANDROÏDE SERVEUR', txt: "Débarquement non réservé ! Supplément quai : 15 BC." },
    winstubFreed: [
      { who: 'LA WINSTUBIÈRE', txt: "L'eau est montée et ma cage a sauté ! Merci, l'écharpe." },
      { who: 'LA WINSTUBIÈRE', txt: "Je file par les quais prévenir les commerçants. On se retrouve aux Ponts Couverts." }
    ],
    // salle 3 : les Ponts Couverts, « Péage Patrimoine »
    peage: [
      { who: 'BORNE DE PÉAGE', txt: "Bienvenue aux Ponts Couverts®. Traversée : 25 BC. Sortie : 50 BC. Rester : sur devis." },
      { who: "L'ULTRA", txt: "Ils font payer les ponts, maintenant. Des ponts qui ne sont même pas à eux." }
    ],
    videur: {
      name: "LE VIDEUR-MAÎTRE D'HÔTEL", shield: 'NON RÉSERVÉ !', stunned: 'MON PLATEAU !',
      intro: [
        { who: "LE VIDEUR-MAÎTRE D'HÔTEL", txt: "Vous n'êtes pas sur la liste. Personne n'est sur la liste. C'est ça, l'exclusivité." },
        { who: 'LA WINSTUBIÈRE', txt: "Il pare tout au plateau ! Envoie-lui le bretzel ({throw}) pour l'assommer, puis tape pendant qu'il voit des étoiles." }
      ],
      hint: { who: 'LA WINSTUBIÈRE', txt: "L'écharpe ne passe pas son plateau ! Le BRETZEL ({throw}) d'abord, l'écharpe ensuite !" }
    },
    // après la vague 2 : la winstubière arrive avec la clé du coffre, avant le Videur
    coffre: [
      { who: 'LA WINSTUBIÈRE', txt: "Tiens bon ! Les commerçants sont enfermés dans les tours, et leur Videur-Maître d'hôtel arrive." },
      { who: 'UN COMMERÇANT', txt: "(depuis la tour) On t'a gardé quelque chose dans le coffre du péage. Un bretzel... pas tout à fait comme les autres." },
      { who: 'LA WINSTUBIÈRE', txt: "Ouvre-le vite. Et lance-le fort : il revient toujours vers celui qui l'a lancé." }
    ],
    freed: [
      { who: 'LA WINSTUBIÈRE', txt: "Il est sorti de la liste ! Les commerçants du pont sont libres." },
      { who: 'LA WINSTUBIÈRE', txt: "La herse de sortie s'ouvre avec la borne, là-bas, sur la pile du pont. Personne ne peut l'atteindre... sauf ton bretzel." }
    ],
    boomerangGot: ['BRETZEL-BOOMERANG', "{throw} : lancer (ou clic droit si rien n'est verrouillé)"],
    boomerangTuto: [
      { who: 'TUTO', txt: "{throw} pour lancer le bretzel-boomerang. Il touche à distance : ennemis, bornes, cibles. Il revient tout seul." },
      { who: "LE VIDEUR-MAÎTRE D'HÔTEL", txt: "(au loin) Qui a ouvert le coffre ? Ce n'est pas sur la liste, ça !" }
    ],
    winstubHintVideur: "Le bretzel dans son plateau, puis l'écharpe pendant qu'il est sonné !",
    winstubHint3: "La borne sur la pile du pont ! Vise-la avec le bretzel.",
    // salle 4 : le Barrage Vauban, « Rooftop Premium »
    rooftop: [
      { who: 'ANDROÏDE SERVEUR', txt: "Bienvenue au Rooftop Premium. Coupe de champagne obligatoire : 60 BC. La vue est en option." },
      { who: "L'ULTRA", txt: "La terrasse du barrage... Elle était à tout le monde." }
    ],
    cibles: [
      { who: "L'ULTRA", txt: "Trois terminaux derrière des vitres anti-écharpe. Et les néons au-dessus des arches : rouge, or, cyan." },
      { who: 'TUTO', txt: "Touche les 3 cibles avec le bretzel dans l'ordre des néons, en moins de {t} secondes." }
    ],
    antiEcharpe: 'ANTI-ÉCHARPE !',
    ciblesFail: ['PAIEMENT REFUSÉ', "mauvais ordre, ou trop lent"],
    // indices après chaque échec (le 1er au 1er échec, etc.) ; au dernier, la prochaine cible clignote
    ciblesHints: [
      { who: 'CELLE DU STADE', txt: "Regarde les néons au-dessus des arches : rouge, puis or, puis cyan. C'est l'ordre à suivre." },
      { who: 'CELLE DU STADE', txt: "Les terminaux sont rangés dans le désordre : cyan à gauche, rouge au milieu, or à droite." },
      { who: 'CELLE DU STADE', txt: "Le chrono part à la première cible. Mets-toi entre le rouge et l'or avant de lancer. Je te fais clignoter la prochaine." }
    ],
    pdg: [
      { who: 'LE PDG DE BLINGCO', txt: "L'histoire appartient à ceux qui la possèdent." },
      { who: "L'ULTRA", txt: "Alors on va la reprendre." }
    ],
    // salle 5 : l'ASR-67, dans la cuisine automatisée sous le barrage
    asr: {
      name: 'ASR-67 · ANDROÏDE DE SERVICE RESTAURATION', shield: 'SERVICE EN COURS !',
      intro: [
        { who: 'ASR-67', txt: 'Bienvenue dans votre Expérience Gastronomique Authentique®. Votre satisfaction est obligatoire.' },
        { who: 'CELLE DU STADE', txt: "Sa toque bloque tout de face. Son terminal de paiement est dans son dos : vise-le avec le bretzel !" }
      ],
      refused: 'PAIEMENT REFUSÉ. PAIEMENT REFUSÉ.',
      phase2: "Client non solvable détecté. Procédure d'évacuation.",
      phase3: 'Coup de feu. Coup de feu. COUP DE FEU.',
      phase2hint: { who: 'CELLE DU STADE', txt: "Il charge avec son chariot ! Mets un fourneau entre vous deux." },
      playerDeath: 'Merci de votre visite. Laissez un avis cinq étoiles.',
      defeat: [{ who: 'ASR-67', txt: "Erreur... recette originale... introuvable... Gloire à l'axe..." }]
    },
    // cliffhanger : SCN révèle tout et envoie l'Ultra en 2026
    cliff: [
      { who: 'CELLE DU STADE', txt: "Tu l'as eu ! Écoute-moi bien, on n'a pas beaucoup de temps." },
      { who: 'CELUI DU STADE', txt: "Le club, ils l'ont racheté en 2023. Mais c'est en 2026 que tout a basculé : ils ont commencé à racheter la ville. C'est là qu'il faut les arrêter." },
      { who: 'CELLE DU STADE', txt: "On a trouvé une faille dans le Serveur central. Une seule personne peut y passer : toi. C'est pour ça qu'on t'attendait." },
      { who: "L'ULTRA", txt: 'Attends... passer où ?' },
      { who: 'CELUI DU STADE', txt: "En 2026. Désolé, l'écharpe : pas le temps de demander poliment." }
    ],
    cliffGlitch: ['CONNEXION FORCÉE...', 'TRANSFERT EN COURS...'],
    arrival: ['Strasbourg, 2026.', "Le jour où tout a basculé. Ou presque."],
    finale: [
      'À suivre...',
      'Prochainement : la Meinau, 2026 · Le Port du Rhin · La place Kléber',
      "STRASBOURG N'EST PAS À VENDRE"
    ],
    end: ["STRASBOURG N'EST PAS À VENDRE", "Fin de la démo du niveau 1. Merci d'avoir joué !"]
  },
  // bac à sable de test (?level=bac-a-sable&debug=1) : pas un vrai niveau, textes de service
  // ------------------------------------------------ niveau 2 : la Meinau (2026). Répliques : data/dialogues/meinau.fr.js
  meinau: {
    subtitle: "NIVEAU 3 : LA MEINAU, L'INTÉRIEUR DU STADE (2026)",
    rooms: { coursive: 'LA COURSIVE', local: 'LE LOCAL DU KOP', kop: 'LA TRIBUNE OUEST · LE KOP', loges: 'LES LOGES VIP BLINGCO',
      vestiaires: 'LES VESTIAIRES', soussols: 'LES SOUS-SOLS TECHNIQUES', acces: 'LE TUNNEL DE LA PELOUSE', pelouse: 'LA PELOUSE' },
    ads: [['BLINGCO FOOTBALL', 'MULTI-CLUB · 5 CLUBS, 1 PROPRIÉTAIRE'], ['ABONNEMENT', 'PREMIUM+ : 89 BC / MATCH'],
      ['CLUB SATELLITE', 'VOTRE CLUB, NOTRE ACTIF'], ['BUVETTE', 'BIÈRE TOKENISÉE : 14 BC']],
    tifo: 'PAS À VENDRE',
    boss: 'EGBOEHLY · LE MULTIPROPRIÉTAIRE',
    headDown: 'TÊTE KO', planted: 'DRAPEAU PLANTÉ !', antiEcharpe: 'ANTI-ÉCHARPE !',
    tutoDone: ['TUTO RÉUSSI', 'LE KOP VOUS ATTEND'], gateOpen: ['PORTIQUE COUPÉ', 'LES ANCIENS SONT LIBRES'], tifoDone: ['TIFO DÉPLOYÉ', 'LE KOP CHANTE'],
    accesStep: ['ACCÈS PELOUSE : 1 / 2', 'LE TIFO ET LE TERMINAL OUVRENT LE TUNNEL'], accesOpen: ['ACCÈS PELOUSE OUVERT', 'LE TUNNEL SUD EST LIBRE'],
    verrouLoges: ['VERROU TOUCHÉ', 'LES LOGES VIP SONT OUVERTES'], verrouSoussols: ['VERROU TOUCHÉ', 'LES SOUS-SOLS SONT OUVERTS'],
    opening: [`Strasbourg, 2026. La Meinau.`, "Le jour où BlingCo rachète le club. Le jour où tout commence.", "Cette fois, l'Ultra arrive avant eux."],
    end: ['MEINAU LIBÉRÉE', 'Les anciens du kop rejoignent la résistance. Suite : le Port du Rhin.']
  },
  // niveau 2 : la Meinau, abords du stade (maquette grise, brief docs/designs/brief-greybox-meinau.md)
  meinauAbords: {
    subtitle: 'NIVEAU 2 : LA MEINAU, LES ABORDS DU STADE (2026)',
    rooms: { tram: 'ARRIVÉE TRAM KRIMMERI', parking: 'LE PARKING OUEST', parvis: 'LE PARVIS SUD · FILE DES PORTIQUES',
      berge: 'LA BERGE DU RHIN TORTU', parc: "LE PARC DE L'EXTENWOERTHFELD", terrain: 'LE TERRAIN VAGUE · CHANTIER BLINGCO',
      centre: "LE CENTRE D'ENTRAÎNEMENT", nord: 'LES ABORDS DU STADE' },
    ads: [['BLINGCO ARENA', 'PORTIQUES : PRÉSENTEZ VOTRE SCORE DE CRÉDIT'], ['ABONNEMENT', 'PREMIUM+ : 89 BC / MATCH'],
      ['PROJET BLINGCO', 'ICI, VOTRE FUTUR PARKING VIP']],
    portiqueOpen: ['PORTIQUE A COUPÉ', "L'ENTRÉE DU PARVIS EST LIBRE"], raccourci: ['RACCOURCI OUVERT', 'ISSUE DE SECOURS C'],
    grilleB: 'GRILLE FERMÉE : IL FAUT UNE ACCRÉDITATION', accreditation: ['ACCRÉDITATION BLINGCO', 'ELLE OUVRE LA GRILLE CÔTÉ RHIN'],
    grilleOpen: ['GRILLE B OUVERTE', 'ACCRÉDITATION ACCEPTÉE'],
    endB: ['ENTRÉE DANS LE STADE', "Par la grille côté Rhin (B). Suite : l'intérieur du stade."],
    opening: ['Strasbourg, 2026. La Meinau.', "Le jour où BlingCo rachète le club. Le jour où tout commence.", "Cette fois, l'Ultra arrive avant eux."],
    endA: ['ENTRÉE DANS LE STADE', "Par le portique A. Suite : l'intérieur du stade."],
    endC: ['ENTRÉE DANS LE STADE', "Par l'issue de secours C. Suite : l'intérieur du stade."]
  },
  portRhin: {
    subtitle: 'NIVEAU 4 : LE PORT DU RHIN, 2026',
    rooms: { quai: 'LE QUAI · PALISSADE « BLINGCO LOFTS »', moulin: 'LE VIEUX MOULIN', conteneurs: 'CONTENEURS ET PÉNICHES',
      chantier: 'LE QUAI DU CHANTIER' },
    ads: [['BLINGCO LOFTS', 'VUE SUR RHIN · DÈS 9 999 BC / M²'], ['BIENTÔT ICI', 'VOTRE LOFT DE CARACTÈRE'],
      ['ANCIEN MOULIN', 'BIENTÔT ROOFTOP PREMIUM'], ['PÉNICHE-LOFT', 'LE CHARME DU PORT, SANS LE PORT']],
    boss: 'LE PROMOTEUR · BLINGCO IMMOBILIER',
    antiEcharpe: 'ANTI-ÉCHARPE !',
    palissade: ['PALISSADE TOMBÉE', 'LE MOULIN EST OUVERT'], gaffeGot: ['GAFFE-GRAPPIN', '{throw} : lancer le grappin'],
    gateOpen: ['QUAI LIBÉRÉ', 'LE CHANTIER EST OUVERT'],
    opening: [`Strasbourg, 2026. Le Port du Rhin.`, "Les quais, les péniches, le vieux moulin. BlingCo y voit des « lofts de caractère ».",
      "Les dockers et les mariniers tiennent bon. Pour l'instant."],
    end: ['PORT DU RHIN LIBÉRÉ', 'Les dockers et les mariniers rejoignent la résistance. Suite : le Marché 2000.']
  },
  marche2000: {
    subtitle: 'NIVEAU 5 : MARCHÉ 2000, 2026 (LA NUIT)',
    rooms: { arriere: "L'ARRIÈRE · RUE DE LA FARINE", marchenoir: 'LE MARCHÉ NOIR · PORTE VIOLETTE', rayons: 'LES RAYONS', reserve: 'LA RÉSERVE', toit: "LE TOIT · L'ENSEIGNE",
      magasin: 'LE MAGASIN · CÔTÉ TRAM' },
    ads: [['BLINGCO NUIT', 'OUVERT 24 H / 24 · PRIX x10 APRÈS 22 H'], ['TRADITION CERTIFIÉE', 'LE BRETZEL « AUTHENTIQUE® » : 12 BC'],
      ['ÉPICERIE PREMIUM', "L'EAU DU ROBINET, EN BOUTEILLE"], ['CARTE FIDÉLITÉ', 'PLUS VOUS ACHETEZ, PLUS ÇA COÛTE'],
      ['MARCHÉ NOIR BLINGCO', 'ÉCHARPES CONFISQUÉES · REVENDUES x10'], ['DÉSTOCKAGE DE NUIT', 'BRETZELS DU QUARTIER · PRIX SUR DEMANDE']],
    boss: 'LE GÉRANT DE NUIT · BLINGCO NUIT',
    gerantOpen: 'x10 ENCAISSÉ !',
    labelSlow: 'ÉTIQUETÉ x10 : RALENTI !',
    marcheNoir: ['LE MARCHÉ NOIR', 'CE QUE BLINGCO A CONFISQUÉ AU QUARTIER'],
    caught: ['REPÉRÉ !', 'RETOUR AU DÉBUT DE LA SALLE'],
    neonsOff: ['COUR DANS LE NOIR', 'LA PORTE DE SERVICE EST LIBRE'],
    reserveOpen: ['RÉSERVE LIBÉRÉE', "L'ESCALIER DU TOIT EST OUVERT"],
    enseigne: 'MARCHÉ 2000', enseigneDone: ['ENSEIGNE RALLUMÉE', 'STORK REJOINT LA RÉSISTANCE'],
    opening: [`Strasbourg, 2026. Porte de l'Hôpital, la nuit.`, "Le Marché 2000, l'épicerie du quartier. BlingCo l'a « optimisée » : rideau baissé, prix x10 après 22 h.",
      "Derrière la porte violette, un marché noir. Et quelque part, SCN se cache."],
    end: ['MARCHÉ 2000 LIBÉRÉ', 'Les clients, les employés et Stork rejoignent la résistance. Suite : le Kalt.']
  },
  kalt: {
    subtitle: 'NIVEAU 6 : LE KALT, 2026 (LA NUIT)',
    rooms: { file: 'LA FILE · RUE LA FAYETTE', cour: "L'ALLÉE ET LA COUR", salle: 'LA SALLE · LE HANGAR ROUGE', cave: 'LA CAVE',
      piste: 'LA PISTE · LE CARRÉ VIP' },
    ads: [['BLINGCO NIGHT', 'CARRÉ VIP · LA BOUTEILLE À 900 BC'], ['DRESS CODE', 'BASKETS : 30 BC LE CENTIMÈTRE'],
      ['LISTE VIP', "VOUS N'Y ÊTES PAS"], ['OPEN BAR', 'OUVERT AU BAR, PAS À VOUS']],
    boss: 'LE MAGNAT DU CARRÉ VIP · BLINGCO NIGHT',
    stamp: 'REFOULÉ !', vipOnly: 'VIP ONLY !', landed: 'RÉACTEURS COUPÉS !',
    fileOpen: ['LE CORDON EST TOMBÉ', "L'ALLÉE EST LIBRE"],
    courOpen: ['LA COUR EST LIBRE', 'LE HANGAR ROUGE EST OUVERT'],
    vipOff: ['PORTIQUE VIP COUPÉ', 'LA CAVE EST OUVERTE'],
    dylagne: ['DYLAGNE REJOINT LA RÉSISTANCE', 'SA GROSSE CAISSE TIENT LE RYTHME'],
    pisteOpen: ['BOUM !', 'LE RIDEAU DE LA PISTE TOMBE'],
    opening: ['Strasbourg, 2026. Rue la Fayette, la nuit.', 'Le Kalt, la boîte techno du quartier. BlingCo y a posé un tapis doré, un cordon rouge... et un carré VIP.',
      'Ce soir, le peuple techno reste dehors. Pas pour longtemps.'],
    end: ['LE KALT LIBÉRÉ', 'Le peuple techno et Dylagne rejoignent la résistance. Suite : la place Kléber.']
  },
  kleber: {
    subtitle: 'NIVEAU 7 : PLACE KLÉBER, 2026 (FIN DE LA PARTIE 1)',
    rooms: { peages: 'LES PORTIQUES-PÉAGES', chalets: 'LE LABYRINTHE DE CHALETS', sapin: 'LE SAPIN-ÉCRAN', estrade: "L'ESTRADE · LA SIGNATURE" },
    ads: [['MARCHÉ DE NOËL PERMANENT', '365 JOURS PAR AN · ENTRÉE 15 BC'], ['VIN CHAUD', '79 BC LE GOBELET MINUSCULE'],
      ['NEIGE PAYANTE', '5 BC LE FLOCON'], ['STRASBOURG', 'VENDUE CE SOIR · SIGNATURE SUR L\'ESTRADE']],
    boss: 'MARCO CEKLAIR · BLINGCO',
    // slogan, répété en boucle (validé par Maxime le 22/11/2026, docs/designs/marco-ceklair.md)
    slogan: ['VOTRE PASSION, NOTRE PRODUIT !', 'LE CLUB DE DEMAIN AVEC LES CONSOMMATEURS DE DEMAIN !', 'VOTRE PASSION, NOTRE PRODUIT !',
      'LE MARCHÉ DE DEMAIN, PAYÉ AUJOURD\'HUI !'],
    pay: '2 BC LE MÈTRE !', frozen: 'GELÉ !', melted: 'LA NEIGE PAYANTE FOND',
    peagesOpen: ['PÉAGE PIRATÉ', 'ENTRÉE GRATUITE'],
    tampon: n => [`TAMPON OFFICIEL ${n} / 3`, n < 3 ? 'AVANT LA SIGNATURE !' : 'LE CHEMIN DU SAPIN EST OUVERT'],
    signature: ['LA SIGNATURE APPROCHE', 'BLINGCO ENVOIE DES RENFORTS'],
    locks: n => [`VERROU DU SAPIN ${n} / 3`, n < 3 ? "IL EN RESTE ENCORE" : "L'ESTRADE EST OUVERTE"],
    crash: 'ENCASTRÉ !',
    opening: ['Strasbourg, 2026. Place Kléber, la nuit.', 'Le siège du marché de Noël permanent. Ce soir, BlingCo signe la vente de la ville.',
      'Il faut trois tampons officiels pour signer. Il ne les aura pas.'],
    fakeEnd: ['STRASBOURG LIBÉRÉE !', 'LA VENTE EST ANNULÉE'],
    glitch: ['ERREUR TEMPORELLE', `${YEAR}... RECALCULÉ`],
    end: ['À SUIVRE', 'Fin de la partie 1.']
  },
  bac: {
    subtitle: 'BAC À SABLE · TESTS (DEBUG)',
    rooms: { bac: 'BAC À SABLE · SALLE DE TEST' },
    antiEcharpe: 'ANTI-ÉCHARPE !',
    hello: [{ who: 'BAC À SABLE', txt: "Salle de test : cibles, mannequins, fossé, grille, mur haut. Tu as le bretzel et l'Arc-Drapeau ({switch} pour changer)." }],
    mannequin: 'PLACEHOLDER mannequin'
  },
  shield: 'TING !'
};
