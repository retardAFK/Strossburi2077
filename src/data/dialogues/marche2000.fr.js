// Dialogues du niveau 4 (Marché 2000, Porte de l'Hôpital, la nuit, 2026). Validés automatiquement pour l'instant
// (prompt 06) : status 'ok', note « auto — à relire par Maxime ». Satire de BlingCo Nuit (prix x10), jamais des clients,
// des employés ni du quartier. Stork ne parle pas (cris et bulles d'icônes) : SCN parle pour elle.
// Relecture : node tools/dialogues-export.mjs → docs/dialogues/marche2000.md → dialogues-import.
export default [
  { id: "m2k.arriere.1", who: "L'ULTRA", txt: "Le Marché 2000. Rideau baissé, mais ça bouge derrière : des robots-vigiles font leur ronde dans la cour.", status: "ok", note: "auto — à relire par Maxime" },
  { id: "m2k.arriere.2", who: "TUTO", txt: "Reste hors des faisceaux. Sous un néon allumé, on te voit de loin : casse-les à l'arc ({throw}). Repéré ? Retour au début de la cour.", status: "ok", note: "auto — à relire par Maxime" },
  { id: "m2k.arriere.3", who: "TUTO", txt: "Des flèches fumigènes ! Dans la fumée, les vigiles ne te voient plus. {arrow} : changer de flèche.", status: "ok", note: "auto — à relire par Maxime" },
  { id: "m2k.rayons.1", who: "L'ULTRA", txt: "Les rayons. Des chariots qui roulent tout seuls, des caméras qui scannent tout... même les clients.", status: "ok", note: "auto — à relire par Maxime" },
  { id: "m2k.cliente", who: "CLIENTE", txt: "Je venais pour du lait : 14 BC le litre après 22 h. Psst : derrière les palettes, les scanners ne te voient pas.", status: "ok", note: "auto — à relire par Maxime" },
  { id: "m2k.employe", who: "EMPLOYÉ DE NUIT", txt: "Vingt ans que je travaille ici. Maintenant, j'étiquette les étiquettes. Les caméras ? Une flèche court-circuit et elles dorment.", status: "ok", note: "auto — à relire par Maxime" },
  { id: "m2k.reserve.1", who: "SCN", txt: "L'Ultra ! On tient la réserve depuis trois nuits. Attention, ils descendent !", status: "ok", note: "auto — à relire par Maxime" },
  { id: "m2k.reserve.2", who: "SCN", txt: "La réserve est à nous. Monte sur le toit : l'enseigne est éteinte, et là-haut, quelqu'un attend qu'on la rallume.", status: "ok", note: "auto — à relire par Maxime" },
  { id: "m2k.toit.1", who: "L'ULTRA", txt: "L'enseigne, vue de derrière. Trois lettres éteintes... et un nid, sur le coin.", status: "ok", note: "auto — à relire par Maxime" },
  { id: "m2k.toit.2", who: "TUTO", txt: "Rallume les lettres éteintes à l'arc, dans l'ordre du mot. De derrière, tout se lit à l'envers.", status: "ok", note: "auto — à relire par Maxime" },
  { id: "m2k.toit.fail", who: "L'ULTRA", txt: "Tout s'éteint. Une enseigne, ça s'allume dans l'ordre où ça se lit.", status: "ok", note: "auto — à relire par Maxime" },
  { id: "m2k.toit.ok", who: "L'ULTRA", txt: "MARCHÉ 2000 ! Et sur le coin, la cigogne se réveille.", status: "ok", note: "auto — à relire par Maxime" },
  { id: "m2k.stork", who: "SCN", txt: "C'est Stork. Elle veille sur le quartier depuis le toit. Elle a choisi son camp : le tien.", status: "ok", note: "auto — à relire par Maxime" },
  { id: "m2k.boss.1", who: "LE GÉRANT DE NUIT", txt: "Bienvenue au Marché 2000, version Nuit ! Après 22 h, tout est x10. Votre présence aussi : x10.", status: "ok", note: "auto — à relire par Maxime" },
  { id: "m2k.boss.2", who: "TUTO", txt: "Quand il scanne, cache-toi derrière une palette. Quand il encaisse, son tiroir s'ouvre : {use}, et Stork pique dessus !", status: "ok", note: "auto — à relire par Maxime" },
  { id: "m2k.boss.phase1", who: "LE GÉRANT DE NUIT", txt: "Promotion spéciale : deux étiquettes achetées, cinq offertes !", status: "ok", note: "auto — à relire par Maxime" },
  { id: "m2k.boss.phase2", who: "LE GÉRANT DE NUIT", txt: "Fermeture exceptionnelle ! Les clients restent, les prix montent !", status: "ok", note: "auto — à relire par Maxime" },
  { id: "m2k.boss.end", who: "LE GÉRANT DE NUIT", txt: "Erreur de caisse... Rendu monnaie... impossible...", status: "ok", note: "auto — à relire par Maxime" },
  { id: "m2k.end.1", who: "EMPLOYÉ DE NUIT", txt: "Le Marché 2000 rouvre aux prix du quartier. Merci, l'Ultra. Et toi aussi, la cigogne. Au Kalt, on dit que la cave résiste encore.", status: "ok", note: "auto — à relire par Maxime" }
];
