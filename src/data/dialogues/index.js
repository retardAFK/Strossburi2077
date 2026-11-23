// Registre des NOUVEAUX dialogues, un fichier par niveau (<niveau>.fr.js), réplique = { id, who, txt, status, note? }.
// status 'draft' = brouillon écrit par une IA, 'ok' = validé par Maxime (lui seul passe une réplique en 'ok').
// Les textes déjà validés pendant la démo restent dans texts.fr.js (ne pas les migrer).
// Usage dans un script : game.dialog.sayIds(['niveau.scene.1', ...], suite) ; ou line(id) pour une réplique seule.
// Circuit de relecture : tools/dialogues-export.mjs → docs/dialogues/<niveau>.md → tools/dialogues-import.mjs.
import basASable from './bac-a-sable.fr.js';
import meinau from './meinau.fr.js';
import meinauAbords from './meinau-abords.fr.js';
import portRhin from './port-rhin.fr.js';
import marche2000 from './marche2000.fr.js';
import kalt from './kalt.fr.js';
import kaltAbords from './kalt-abords.fr.js';
import kleber from './kleber.fr.js';

export const DIALOGUES = { 'bac-a-sable': basASable, 'meinau-abords': meinauAbords, meinau, 'port-rhin': portRhin, marche2000, 'kalt-abords': kaltAbords, kalt, kleber };

const BY_ID = new Map();
for (const lines of Object.values(DIALOGUES)) for (const l of lines) BY_ID.set(l.id, l);

// réplique par identifiant (erreur explicite si l'id n'existe pas : le test dialogues le vérifie aussi)
export function line(id) {
  const l = BY_ID.get(id);
  if (!l) throw new Error(`Réplique inconnue : ${id} (voir src/data/dialogues/)`);
  return l;
}
export const allLines = () => [...BY_ID.values()];
export const drafts = () => allLines().filter(l => l.status !== 'ok');
