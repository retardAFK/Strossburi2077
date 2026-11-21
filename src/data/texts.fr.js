// Tous les textes du jeu. Satire de types : aucune personne ni entreprise réelle.
// Les textes historiques (plaques...) sont exacts, sourcés et relus par Maxime avant publication.

// Année du futur : encore à trancher (2077 ou 2067). Ne JAMAIS l'écrire en dur ailleurs.
const YEAR = '2077';

export const TEXTS = {
  year: YEAR,
  title: 'STRASBOURG N\'EST PAS À VENDRE',
  subtitle: 'NIVEAU 1 : LA TRIBUNE OUEST',
  pressStart: 'APPUIE SUR ENTRÉE',
  controls: 'Clic : capturer la souris · Souris : caméra · Échap : libérer (pause)<br>ZQSD / flèches : bouger · J / clic : écharpe (3 coups) · Espace : roulade<br>Maj / L / clic droit : verrouiller · E : interagir / pirater · Entrée : dialogues · M : son',
  pauseHint: 'CLIC : REPRENDRE · P : REPRENDRE SANS SOURIS',
  skip: 'ENTRÉE : PASSER',
  prompts: {
    hack: 'E : pirater', activate: 'E : activer', restore: 'E : restaurer la plaque', talk: 'E : parler',
    lever: 'E : actionner le levier', valve: 'E : tourner la vanne', board: 'E : monter dans la barque', sail: 'E : larguer les amarres'
  },
  hero: "L'ULTRA",
  rooms: { entree: 'PORTE OUEST', coursive: 'COURSIVE DE LA TRIBUNE OUEST', vip: 'SALON « EXPÉRIENCE CLIENT » BLINGCO', sortie: 'VERS LA TRIBUNE' },

  // panneaux holographiques du décor
  ads: [
    ['BLINGCO ARENA', 'ex-stade de la Meinau'],
    ['ABONNEMENT', 'PREMIUM+ : 2 REINS'],
    ['BRETZEL NFT', '49 BLINGCOINS'],
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
    sommelier: ['Notes de fruits rouges et de frais de service.', "Le vin d'ici, avec notre marge d'ailleurs.", 'Bouchonné ? Non : facturé.', 'Je vous sers un fond ? Au prix de la bouteille.']
  },

  intro: [
    { who: "L'ULTRA", txt: `Meinau, ${YEAR}. Ils ont rebaptisé le stade « BlingCo Arena » et transformé la tribune ouest en « espace expérience client ».` },
    { who: "L'ULTRA", txt: "Le club est devenu une filiale. Demain ce sera la ville. Pas tant qu'il y aura une écharpe dans cette tribune." },
    { who: 'TUTO', txt: "J (ou clic) pour fouetter avec l'écharpe, trois fois pour le combo. Espace pour rouler. Maj pour verrouiller un costard." }
  ],
  entreeCleared: { who: "L'ULTRA", txt: "Trois costards de moins. La coursive est par là, je connais le chemin par cœur." },
  laser: { who: "L'ULTRA", txt: "Un portique laser « Accès Premium ». Le terminal qui clignote, là, doit le couper : je m'approche et E pour le pirater. Ou un bon coup d'écharpe." },
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
      "Ça a commencé au stade. Un consortium a racheté notre club : BlingCo Multi-Holdings. « Club satellite », qu'ils disaient.",
      "Puis ils ont racheté le reste. Les rues, les ponts, les winstubs. Le marché de Noël ouvert 365 jours par an.",
      "Ici, ils ont même réécrit l'histoire. La Petite France est devenue une « Expérience Authentique® ».",
      "Les gens d'ici paient pour rentrer chez eux. Moi, j'ai encore mon écharpe."
    ],
    // plaques historiques : mensonge de BlingCo -> vraie histoire (TEXTES À RELIRE PAR MAXIME)
    plaqueTitle: ['PLAQUE HISTORIQUE · BLINGCO®', 'LA VRAIE HISTOIRE'],
    plaques: {
      p1: { lie: 'Food Court Premium depuis toujours.', truth: "Cœur du quartier des tanneurs, au bord de l'Ill." },
      p2: { lie: 'Patrimoine sous licence BlingCo.', truth: "Quartier populaire de tanneurs, meuniers et pêcheurs. Patrimoine mondial de l'UNESCO depuis 1988." }
    },
    plaqueRestored: { who: "L'ULTRA", txt: "Voilà. Notre histoire, pas la leur." },
    rooms: {
      ruelle: 'PETITE FRANCE · RUELLE SOUS LICENCE', foodcourt: 'QUARTIER DES TANNEURS · « FOOD COURT PREMIUM »', terrasse: 'TERRASSE (ACCÈS PAYANT)',
      ecluse: "L'ÉCLUSE · « PASSAGE PREMIUM »", canal: 'CANAL · BARQUE AUTONOME (2 BC / MIN)', quaiHaut: 'QUAI HAUT'
    },
    ads: [
      ['FOOD COURT PREMIUM', 'EXPÉRIENCE AUTHENTIQUE®'],
      ['TARTE FLAMBÉE', '89 BC · FEU EN OPTION'],
      ['COLOMBAGES®', 'PROPRIÉTÉ BLINGCO'],
      ["VUE SUR L'ILL", '2 BC / MINUTE'],
      ['COMMANDEZ ICI', 'SOURIEZ, VOUS PAYEZ'],
      ['BRETZEL', "À L'UNITÉ OU PAR ABONNEMENT"],
      ['ÉCLUSE PREMIUM', 'PASSAGE : 12 BC'],
      ['BARQUE AUTONOME', '2 BC / MINUTE']
    ],
    intro: [
      { who: "L'ULTRA", txt: "La Petite France, de nuit. Avant, ça sentait le bois mouillé et la tarte flambée. Maintenant ça sent le terminal de paiement." },
      { who: "L'ULTRA", txt: "Tout est « sous licence BlingCo » : les colombages, les géraniums, même le reflet dans l'Ill. Et les gens d'ici se font sortir de chez eux." },
      { who: 'TUTO', txt: "Souris pour regarder, ZQSD pour avancer. Au Quartier des Tanneurs, BlingCo a ouvert un « Food Court Premium » : c'est au bout de la ruelle." }
    ],
    foodcourt: { who: 'ANDROÏDE SERVEUR', txt: "Bienvenue au Food Court Premium ! La table, c'est 40 BlingCoins. Ressortir, c'est plus cher." },
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
    quaiWelcome: { who: 'ANDROÏDE SERVEUR', txt: "Débarquement non réservé ! Supplément quai : 15 BlingCoins." },
    end: ['FIN DE LA DÉMO', 'Suite : les Ponts Couverts (en construction)']
  },
  shield: 'TING !'
};
