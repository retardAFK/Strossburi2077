// Dialogues du niveau 2 (la Meinau, 2026). Validés automatiquement pour l'instant (prompt 06) : status 'ok',
// note « auto — à relire par Maxime ». Satire de BlingCo, jamais du club, de ses supporters ni de ses joueurs.
// Relecture : node tools/dialogues-export.mjs → docs/dialogues/meinau.md → node tools/dialogues-import.mjs.
export default [
  { id: "mei.parvis.1", who: "L'ULTRA", txt: "2026... La Meinau, avant tout ça. Enfin, pas tout à fait avant : ils sont déjà là.", status: "ok", note: "auto — à relire par Maxime" },
  { id: "mei.parvis.2", who: "ROBOT-STEWARD", txt: "Bienvenue à la BlingCo Arena. Merci de présenter votre billet, votre abonnement et votre score de crédit.", status: "ok", note: "auto — à relire par Maxime" },
  { id: "mei.parvis.3", who: "TUTO", txt: "{attack} pour l'écharpe, {lock} pour verrouiller. Les stewards scannent tout, même les pigeons : profite du scan pour frapper.", status: "ok", note: "auto — à relire par Maxime" },
  { id: "mei.coursive.0", who: "L'ULTRA", txt: "La coursive. Elle fait tout le tour du stade. Le local du kop doit être au nord-ouest, côté tribune ouest.", status: "ok", note: "auto — à relire par Maxime" },
  { id: "mei.buvette1", who: "BUVETIER", txt: "Le local du kop ? Au nord-ouest, la porte à côté de ma buvette. Les anciens y gardent quelque chose de précieux.", status: "ok", note: "auto — à relire par Maxime" },
  { id: "mei.buvette2", who: "BUVETIÈRE", txt: "Pour aller sur la pelouse, il faut le tunnel sud. Mais BlingCo l'a fermé : il faudrait le tifo du kop et leur terminal, côté est.", status: "ok", note: "auto — à relire par Maxime" },
  { id: "mei.buvette3", who: "BUVETIER", txt: "Les loges VIP et les sous-sols ont des verrous BlingCo : une cible à côté de la porte. Avec un arc, ça se règle.", status: "ok", note: "auto — à relire par Maxime" },
  { id: "mei.buvette4", who: "BUVETIÈRE", txt: "Dans les vestiaires, les gamins cachent toujours leurs affaires derrière les casiers.", status: "ok", note: "auto — à relire par Maxime" },
  { id: "mei.coursive.1", who: "L'ULTRA", txt: "Les anciens du kop, parqués derrière un portique « zone supporters premium »... Le terminal doit le couper.", status: "ok", note: "auto — à relire par Maxime" },
  { id: "mei.coursive.2", who: "UN ANCIEN DU KOP", txt: "Toi, avec l'écharpe ! Ils nous ont « relogés » ici pour libérer des places en loge. Viens au local, on a quelque chose pour toi.", status: "ok", note: "auto — à relire par Maxime" },
  { id: "mei.local.1", who: "UN ANCIEN DU KOP", txt: "La hampe du grand drapeau, et une écharpe pour corde. On l'appelle l'Arc-Drapeau. Il a vu plus de matchs que leurs actionnaires.", status: "ok", note: "auto — à relire par Maxime" },
  { id: "mei.local.2", who: "UNE ANCIENNE DU KOP", txt: "Et voilà des flèches-bannières. Le tifo, c'est nous qui le montons. Pas eux.", status: "ok", note: "auto — à relire par Maxime" },
  { id: "mei.local.3", who: "TUTO", txt: "{throw} pour tirer (vers la cible verrouillée, sinon droit devant). Maintiens {aim} pour viser librement. Touche les 3 cibles BlingCo.", status: "ok", note: "auto — à relire par Maxime" },
  { id: "mei.kop.1", who: "UN ANCIEN DU KOP", txt: "Cinq crochets, cinq bannières. L'écran géant passe l'ordre entre deux pubs : quelqu'un de chez nous l'a piraté.", status: "ok", note: "auto — à relire par Maxime" },
  { id: "mei.kop.2", who: "TUTO", txt: "Tire les flèches-bannières sur les crochets dans l'ordre des couleurs de l'écran. Une caisse de bannières se recharge à côté.", status: "ok", note: "auto — à relire par Maxime" },
  { id: "mei.kop.fail", who: "UN ANCIEN DU KOP", txt: "Mauvais ordre, tout retombe ! Regarde l'écran, il repasse la séquence.", status: "ok", note: "auto — à relire par Maxime" },
  { id: "mei.kop.ok", who: "LE KOP", txt: "PAS À VENDRE ! PAS À VENDRE !", status: "ok", note: "auto — à relire par Maxime" },
  { id: "mei.boss.1", who: "EGBOEHLY", txt: "Charmant, ce petit tifo. Je l'achète. J'achète tout : le club, la pelouse, et vos chants en abonnement.", status: "ok", note: "auto — à relire par Maxime" },
  { id: "mei.boss.2", who: "EGBOEHLY", txt: "Cinq clubs, une seule loge. C'est ça, la multipropriété : vous perdez partout, je gagne partout.", status: "ok", note: "auto — à relire par Maxime" },
  { id: "mei.boss.3", who: "UN ANCIEN DU KOP", txt: "Ses têtes repoussent ! Assomme-en une, puis plante-lui une bannière dedans : elle ne se relèvera plus.", status: "ok", note: "auto — à relire par Maxime" },
  { id: "mei.boss.pilot", who: "EGBOEHLY", txt: "Mes actifs ! Mes cinq actifs ! Bon... je vends. Non, attendez, j'achète !", status: "ok", note: "auto — à relire par Maxime" },
  { id: "mei.boss.end", who: "EGBOEHLY", txt: "Une hydre se revend toujours. On se reverra, au port.", status: "ok", note: "auto — à relire par Maxime" },
  { id: "mei.end.1", who: "UN ANCIEN DU KOP", txt: "Le kop est avec toi. Et pas seulement le kop : au Port du Rhin, ils rasent les quais pour des lofts. File.", status: "ok", note: "auto — à relire par Maxime" }
];
