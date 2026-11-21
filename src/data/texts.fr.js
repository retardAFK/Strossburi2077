// Tous les textes du jeu. Satire de types : aucune personne ni entreprise réelle.
// Les textes historiques (plaques...) sont exacts, sourcés et relus par Maxime avant publication.

// Année du futur. Ne JAMAIS l'écrire en dur ailleurs.
const YEAR = '2067';

export const TEXTS = {
  year: YEAR,
  title: 'STRASBOURG N\'EST PAS À VENDRE',
  subtitle: 'NIVEAU 1 : LA TRIBUNE OUEST',
  pressStart: 'APPUIE SUR {ok}',
  controls: '{move} bouger · {camera} caméra · {attack} écharpe (3 coups) · {roll} roulade · {lock} cible<br>{throw} objet · {use} interagir · {ok} valider · {pause} pause<br>{use} sur cet écran : toutes les commandes · au clavier, clic : capturer la souris',
  items: { boomerang: ['BRETZEL-BOOMERANG', '{throw}'] },
  pauseHint: '{pause} : REPRENDRE · {use} : COMMANDES · {rumble} : VIBRATIONS ({state})',
  rumbleState: ['NON', 'OUI'],
  padUnknown: 'Manette non reconnue : utilise Steam Input ou une manette Xbox / PlayStation. Le clavier reste actif.',
  skip: '{ok} : PASSER',
  prompts: {
    hack: '{use} : pirater', activate: '{use} : activer', restore: '{use} : restaurer la plaque', talk: '{use} : parler', open: '{use} : ouvrir',
    lever: '{use} : actionner le levier', valve: '{use} : tourner la vanne', board: '{use} : monter dans la barque', sail: '{use} : larguer les amarres'
  },
  // ------------------------------------------------ indications de commandes (systems/Prompts.js)
  // Les textes écrivent des ACTIONS entre accolades ({use}, {attack}...), jamais des touches : l'icône affichée
  // suit le dernier appareil utilisé. Libellés génériques (pas de logos de marques).
  glyphs: {
    kb: { move: 'ZQSD', camera: 'SOURIS', attack: 'J', roll: 'ESPACE', lock: 'MAJ', use: 'E', throw: 'F', ok: 'ENTRÉE', back: 'RETOUR', pause: 'P', rumble: 'V' },
    xbox: { move: 'L', camera: 'R', attack: 'X', roll: 'A', lock: 'LT', use: 'Y', throw: 'RB', ok: 'A', back: 'B', pause: 'MENU', rumble: 'VUE' },
    ps: { move: 'L', camera: 'R', attack: '□', roll: '✕', lock: 'L2', use: '△', throw: 'R1', ok: '✕', back: '○', pause: 'OPTIONS', rumble: 'SHARE' }
  },
  commands: {
    title: 'COMMANDES', kb: 'CLAVIER / SOURIS', pad: 'MANETTE', close: '{back} : FERMER',
    rows: [['move', 'Bouger'], ['camera', 'Caméra'], ['attack', 'Écharpe (3 coups)'], ['roll', 'Roulade'], ['lock', 'Verrouiller une cible'],
      ['throw', 'Objet (bretzel)'], ['use', 'Interagir'], ['ok', 'Valider / dialogues'], ['back', 'Retour'], ['pause', 'Pause'], ['rumble', 'Vibrations oui / non']]
  },
  // ------------------------------------------------ tactile (téléphone / tablette)
  touch: {
    buttons: { attack: 'ÉCHARPE', roll: 'ROULADE', lock: 'CIBLE', throw: 'BRETZEL', use: 'AGIR', pause: '❚❚' },
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
      ['pauseHint', 'TOUCHE L\'ÉCRAN POUR REPRENDRE'],
      ['skip', "TOUCHER L'ÉCRAN : PASSER"],
      ['items.boomerang.1', 'BOUTON BRETZEL'],
      ['intro.2.txt', "ÉCHARPE pour fouetter, trois fois pour le combo. ROULADE pour esquiver. CIBLE pour verrouiller un costard."],
      ['laser.txt', "Un portique laser « Accès Premium ». Le terminal qui clignote, là, doit le couper : je m'approche et AGIR pour le pirater. Ou un bon coup d'écharpe."],
      ['pf.boomerangGot.1', 'BOUTON BRETZEL : lancer'],
      ['pf.boomerangTuto.0.txt', "Le bouton BRETZEL lance le bretzel-boomerang. Il touche à distance : ennemis, bornes, cibles. Il revient tout seul."]
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
  bossShield: 'CLAUSE DE NON-AGRESSION !',
  bossSummon: "Stagiaires ! Venez défendre mon EBITDA !",
  bossDefeat: [
    { who: 'LE DIRECTEUR DE LA VALORISATION', txt: "Mes... mes actionnaires vont m'entendre. Et le reste de la ville aussi !" },
    { who: "L'ULTRA", txt: "La tribune ouest est libérée. Prochaine étape : la Petite France. Allez, on chante !" }
  ],
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
      name: "LE VIDEUR-MAÎTRE D'HÔTEL", shield: 'NON RÉSERVÉ !',
      intro: [
        { who: "LE VIDEUR-MAÎTRE D'HÔTEL", txt: "Vous n'êtes pas sur la liste. Personne n'est sur la liste. C'est ça, l'exclusivité." },
        { who: 'LA WINSTUBIÈRE', txt: "De face, il bloque tout ! Fais-le charger dans le vide, ou prends-le de dos." }
      ]
    },
    freed: [
      { who: 'LA WINSTUBIÈRE', txt: "Bien joué ! Les commerçants du pont étaient enfermés dans les tours de péage. Ils sont libres." },
      { who: 'UN COMMERÇANT', txt: "On t'a gardé quelque chose dans le coffre du péage. Un bretzel... pas tout à fait comme les autres." },
      { who: 'LA WINSTUBIÈRE', txt: "Ouvre-le. Et lance-le fort : il revient toujours vers celui qui l'a lancé." }
    ],
    boomerangGot: ['BRETZEL-BOOMERANG', "{throw} : lancer (ou clic droit si rien n'est verrouillé)"],
    boomerangTuto: [
      { who: 'TUTO', txt: "{throw} pour lancer le bretzel-boomerang. Il touche à distance : ennemis, bornes, cibles. Il revient tout seul." },
      { who: 'LA WINSTUBIÈRE', txt: "La herse de sortie s'ouvre avec la borne, là-bas, sur la pile du pont. Personne ne peut l'atteindre... sauf toi, maintenant." }
    ],
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
  shield: 'TING !'
};
