// Dialogues du niveau 5 (le Kalt, rue la Fayette, la nuit, 2026). Validés automatiquement pour l'instant (prompt 06) :
// status 'ok', note « auto — à relire par Maxime ». La satire vise l'intrusion de BlingCo (tapis doré, liste, carré VIP),
// jamais le club, son public ni la techno. Dylagne ne parle pas (cris et bulles d'icônes) : SCN parle pour lui.
// Relecture : node tools/dialogues-export.mjs → docs/dialogues/kalt.md → dialogues-import.
export default [
  { id: "kalt.file.1", who: "L'ULTRA", txt: "Le Kalt. D'habitude, ici, tout le monde rentre. Ce soir : tapis doré, cordon rouge et physios BlingCo.", status: "ok", note: "auto — à relire par Maxime" },
  { id: "kalt.file.2", who: "TUTO", txt: "Le robot-cordon bloque l'allée : tire-le au gaffe-grappin ({throw}), ou mets-le hors service.", status: "ok", note: "auto — à relire par Maxime" },
  { id: "kalt.public", who: "PUBLIC TECHNO", txt: "Trois heures de file pour s'entendre dire « pas ce soir ». Ils mesurent nos baskets au mètre !", status: "ok", note: "auto — à relire par Maxime" },
  { id: "kalt.cour.1", who: "L'ULTRA", txt: "La cour. Le hangar rouge est au fond, et les physios gardent la porte.", status: "ok", note: "auto — à relire par Maxime" },
  { id: "kalt.salle.1", who: "L'ULTRA", txt: "Le hangar. Noir total. Les physios, je ne les vois qu'aux flashs du strobo.", status: "ok", note: "auto — à relire par Maxime" },
  { id: "kalt.salle.2", who: "TUTO", txt: "Les portiques laser s'éteignent sur les basses : passe au bon moment. Le portique VIP, lui, tient sur un projecteur... une flèche court-circuit ?", status: "ok", note: "auto — à relire par Maxime" },
  { id: "kalt.cave.1", who: "L'ULTRA", txt: "La cave. Quelqu'un tape sur une grosse caisse... derrière un cordon VIP ?", status: "ok", note: "auto — à relire par Maxime" },
  { id: "kalt.dylagne", who: "SCN", txt: "C'est Dylagne. Il tient le rythme de la tribune depuis toujours. BlingCo voulait le mettre en carré VIP : il a refusé.", status: "ok", note: "auto — à relire par Maxime" },
  { id: "kalt.dylagne.2", who: "TUTO", txt: "Dylagne te suit. Devant le rideau de la piste : {use}, grosse caisse ! Et quand tu es blessé, sa sacoche te soigne.", status: "ok", note: "auto — à relire par Maxime" },
  { id: "kalt.boss.1", who: "LE MAGNAT DU CARRÉ VIP", txt: "Bienvenue dans MON carré VIP ! Ici, on ne danse pas : on consomme. Et d'en haut, vous êtes tous tout petits.", status: "ok", note: "auto — à relire par Maxime" },
  { id: "kalt.boss.2", who: "TUTO", txt: "Son carré vole trop haut : coupe ses réacteurs à la flèche court-circuit. Au sol, {use} : grosse caisse de Dylagne !", status: "ok", note: "auto — à relire par Maxime" },
  { id: "kalt.boss.phase1", who: "LE MAGNAT DU CARRÉ VIP", txt: "Bouteille offerte ! Enfin... offerte à 900 BC.", status: "ok", note: "auto — à relire par Maxime" },
  { id: "kalt.boss.phase2", who: "LE MAGNAT DU CARRÉ VIP", txt: "Sécurité ! Videz-moi cette piste ! Je veux la boîte pour moi tout seul !", status: "ok", note: "auto — à relire par Maxime" },
  { id: "kalt.boss.end", who: "LE MAGNAT DU CARRÉ VIP", txt: "Mon carré... mes bouteilles... Je suis sur la liste... non ?", status: "ok", note: "auto — à relire par Maxime" },
  { id: "kalt.end.1", who: "PUBLIC TECHNO", txt: "Le Kalt rouvre à tout le monde, comme avant : pas de carré, pas de liste. Merci l'Ultra. Prochaine étape : Kléber.", status: "ok", note: "auto — à relire par Maxime" }
];
