// Dialogues du niveau 6 (place Kléber, la nuit, 2026, fin de la partie 1). Validés automatiquement pour l'instant
// (prompt 06) : status 'ok', note « auto — à relire par Maxime ». La satire vise le marché de Noël permanent de BlingCo
// (péages, prix, neige payante, vente de la ville), jamais les Strasbourgeois ni la tradition. Marco CeKlair : nom
// parodique autorisé, tout le reste est inventé ; son slogan est une proposition provisoire (à écrire avec Maxime).
// Cliffhanger = PARADOXE (docs/designs/niveau-kleber.md). Relecture : node tools/dialogues-export.mjs.
export default [
  { id: "kleber.peages.1", who: "L'ULTRA", txt: "Place Kléber. Des portiques-péages partout : la file VIP passe, le peuple est parqué derrière des barrières.", status: "ok", note: "auto — à relire par Maxime" },
  { id: "kleber.peages.2", who: "SCN", txt: "La borne du péage est un terminal BlingCo comme les autres. Pirate-la ({use}) : entrée gratuite pour tout le monde.", status: "ok", note: "auto — à relire par Maxime" },
  { id: "kleber.chalets.1", who: "SCN", txt: "La vente de la ville se signe ce soir sur l'estrade. Il leur faut trois tampons officiels : ils sont cachés dans les chalets. Trouve-les avant eux !", status: "ok", note: "auto — à relire par Maxime" },
  { id: "kleber.chalets.2", who: "TUTO", txt: "Des flèches enflammées, en souvenir des torches de la tribune ! La neige payante fond, les bâches brûlent. {arrow} : changer de flèche.", status: "ok", note: "auto — à relire par Maxime" },
  { id: "kleber.chalets.3", who: "L'ULTRA", txt: "Un étal à roulettes devant ce chalet... un coup de gaffe-grappin et on verra ce qu'il cache.", status: "ok", note: "auto — à relire par Maxime" },
  { id: "kleber.sapin.1", who: "SCN", txt: "Le sapin-écran verrouille l'estrade : son cimier, son socle payant et son générateur. Stork, Dylagne : c'est le moment.", status: "ok", note: "auto — à relire par Maxime" },
  { id: "kleber.sapin.2", who: "TUTO", txt: "{use} : piqué de Stork sur le cimier, puis grosse caisse de Dylagne au pied du sapin. Le générateur ? Une flèche court-circuit.", status: "ok", note: "auto — à relire par Maxime" },
  { id: "kleber.boss.1", who: "MARCO CEKLAIR", txt: "Ho, ho, ho ! Votre passion, notre produit ! Ce soir, je signe, et toute la ville passe en abonnement premium.", status: "ok", note: "auto — à relire par Maxime" },
  { id: "kleber.boss.2", who: "TUTO", txt: "Son attelage fonce tout droit : esquive ({roll}) et laisse-le s'encastrer. Sonné, il est à toi : {use} pour Stork ou Dylagne !", status: "ok", note: "auto — à relire par Maxime" },
  { id: "kleber.boss.phase1", who: "MARCO CEKLAIR", txt: "Cadeaux pour tout le monde ! Interdiction de stade pour toi, billet à 900 BC pour toi !", status: "ok", note: "auto — à relire par Maxime" },
  { id: "kleber.boss.phase2", who: "MARCO CEKLAIR", txt: "Plus vite, l'attelage ! Votre passion... notre produit... votre passion...", status: "ok", note: "auto — à relire par Maxime" },
  { id: "kleber.boss.end", who: "MARCO CEKLAIR", txt: "Le contrat... n'est pas... signé...", status: "ok", note: "auto — à relire par Maxime" },
  { id: "kleber.fin.1", who: "SCN", txt: "On a gagné ! La vente est annulée, Strasbourg n'est pas à vendre ! Tout le monde est là : les winstubs, le kop, les dockers, le peuple techno...", status: "ok", note: "auto — à relire par Maxime" },
  { id: "kleber.fin.2", who: "SCN", txt: "L'Ultra... ça ne va pas. En battant Marco ici, en 2026, tu as changé le passé. Le futur s'est recalculé. Et il est pire.", status: "ok", note: "auto — à relire par Maxime" },
  { id: "kleber.fin.3", who: "SCN", txt: "On te rappelle. Accroche-toi à ton écharpe.", status: "ok", note: "auto — à relire par Maxime" }
];
