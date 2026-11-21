// Dialogues du niveau 3 (Port du Rhin, 2026). Validés automatiquement pour l'instant (prompt 06) : status 'ok',
// note « auto — à relire par Maxime ». Satire de la promotion immobilière (BlingCo LOFTS), jamais des dockers,
// des mariniers ni du port. Relecture : node tools/dialogues-export.mjs → docs/dialogues/port-rhin.md → dialogues-import.
export default [
  { id: "prh.quai.1", who: "L'ULTRA", txt: "Le Port du Rhin. Une palissade « BlingCo LOFTS » de cent mètres... Ils emballent le port comme un cadeau.", status: "ok", note: "auto — à relire par Maxime" },
  { id: "prh.quai.2", who: "AGENT IMMO", txt: "Bonjour ! Ce quai est VENDU. Ce bassin est VENDU. Cette mouette... VENDUE. Et vous, vous cherchez quelle surface ?", status: "ok", note: "auto — à relire par Maxime" },
  { id: "prh.quai.3", who: "TUTO", txt: "Les agents immobiliers plantent des pancartes VENDU partout, même sur toi : une roulade ({roll}) et elle tombe.", status: "ok", note: "auto — à relire par Maxime" },
  { id: "prh.palissade", who: "L'ULTRA", txt: "La palissade est tombée. Derrière, le vieux moulin : il y a encore de la lumière.", status: "ok", note: "auto — à relire par Maxime" },
  { id: "prh.moulin.1", who: "UN DOCKER", txt: "Doucement, l'écharpe ! On est retranchés ici depuis qu'ils ont « requalifié » le quai. Toi, t'es pas un agent, t'as pas de doudoune.", status: "ok", note: "auto — à relire par Maxime" },
  { id: "prh.moulin.2", who: "UNE MARINIÈRE", txt: "Prends ça : une gaffe de marinier, avec un treuil bricolé par SCN. Ça accroche tout : les anneaux, les caisses... et les promoteurs.", status: "ok", note: "auto — à relire par Maxime" },
  { id: "prh.moulin.3", who: "TUTO", txt: "{throw} lance le grappin (vers la cible verrouillée avec {lock}). Sur un anneau, il te tire de l'autre côté du bief.", status: "ok", note: "auto — à relire par Maxime" },
  { id: "prh.moulin.4", who: "TUTO", txt: "Une caisse bouche la sortie : accroche-la au grappin pour la tirer vers toi.", status: "ok", note: "auto — à relire par Maxime" },
  { id: "prh.conteneurs.1", who: "UN DOCKER", txt: "Les conteneurs, c'est notre métier. Celui-là bouche le passage : tire-le, il viendra.", status: "ok", note: "auto — à relire par Maxime" },
  { id: "prh.peniches.1", who: "UNE MARINIÈRE", txt: "Pour traverser le canal, accroche-toi aux grues, de péniche en péniche. Ils voulaient en faire des « péniches-lofts ».", status: "ok", note: "auto — à relire par Maxime" },
  { id: "prh.quai2.1", who: "AGENT IMMO", txt: "Monsieur ! Vous traversez une zone de valorisation. Signez ici, ici, et là.", status: "ok", note: "auto — à relire par Maxime" },
  { id: "prh.boss.1", who: "LE PROMOTEUR", txt: "Ah, un client ! J'ai exactement ce qu'il vous faut : 9 mètres carrés, vue sur un autre loft, 2 000 BC par mois. Coup de cœur !", status: "ok", note: "auto — à relire par Maxime" },
  { id: "prh.boss.2", who: "UN DOCKER", txt: "Il largue ses préfabriqués sur nos quais ! Accroche-les au grappin et renvoie-les-lui. Après, tape tant qu'il est sonné !", status: "ok", note: "auto — à relire par Maxime" },
  { id: "prh.boss.phase1", who: "LE PROMOTEUR", txt: "Vous faites baisser la valeur du quartier. Agents ! Plantez-moi des pancartes !", status: "ok", note: "auto — à relire par Maxime" },
  { id: "prh.boss.phase2", who: "LE PROMOTEUR", txt: "Phase deux du projet : on densifie ! Tout doit partir !", status: "ok", note: "auto — à relire par Maxime" },
  { id: "prh.boss.end", who: "LE PROMOTEUR", txt: "Mon exosquelette... il n'était même pas à moi. Il était en leasing.", status: "ok", note: "auto — à relire par Maxime" },
  { id: "prh.end.1", who: "UNE MARINIÈRE", txt: "Le port reste au port. Les dockers et les mariniers sont avec toi. Au Marché 2000, on dit qu'ils ferment la nuit... mais pas pour tout le monde.", status: "ok", note: "auto — à relire par Maxime" }
];
