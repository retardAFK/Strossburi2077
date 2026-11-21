// Registre des niveaux : pour chacun, ses données (layout), son script, ses textes,
// les modèles .glb à charger et les types d'entités que layout/script peuvent faire apparaître.
// Ajouter un niveau = un dossier levels/<id>/ + une entrée ici. Choix : ?level=<id> dans l'URL.
import { TEXTS } from '../data/texts.fr.js';
import { Consultant } from '../entities/enemies/Consultant.js';
import { Juriste } from '../entities/enemies/Juriste.js';
import { Directeur } from '../entities/bosses/Directeur.js';
import { Serveur } from '../entities/enemies/Serveur.js';
import { Sommelier } from '../entities/enemies/Sommelier.js';
import { Terminal } from '../entities/props/Terminal.js';
import { Borne } from '../entities/props/Borne.js';
import meinauLayout from './meinau-ouest/layout.js';
import meinauScript from './meinau-ouest/script.js';
import pfLayout from './petite-france/layout.js';
import pfScript from './petite-france/script.js';

// modèles exportés par tools/blender/*.py (embarqués dans le build par esbuild, chargés à la demande)
import ultra from '../../assets/models/ultra.glb';
import consultant from '../../assets/models/consultant.glb';
import juriste from '../../assets/models/juriste.glb';
import directeur from '../../assets/models/directeur.glb';
import drone from '../../assets/models/drone.glb';
import terminal from '../../assets/models/terminal.glb';
import portique from '../../assets/models/portique.glb';
import serveur from '../../assets/models/serveur.glb';
import sommelier from '../../assets/models/sommelier.glb';
import pf_maison_a from '../../assets/models/pf_maison_a.glb';
import pf_maison_b from '../../assets/models/pf_maison_b.glb';
import pf_maison_b_licence from '../../assets/models/pf_maison_b_licence.glb';
import pf_maison_c from '../../assets/models/pf_maison_c.glb';
import pf_quai from '../../assets/models/pf_quai.glb';
import pf_lampadaire from '../../assets/models/pf_lampadaire.glb';
import pf_compteur from '../../assets/models/pf_compteur.glb';
import pf_borne from '../../assets/models/pf_borne.glb';
import pf_herse_laser from '../../assets/models/pf_herse_laser.glb';
import pnj_celle_du_stade from '../../assets/models/pnj_celle_du_stade.glb';

export const DEFAULT_LEVEL = 'meinau-ouest'; // on basculera sur 'petite-france' quand le niveau sera complet

export const LEVELS = {
  'meinau-ouest': {
    layout: meinauLayout, script: meinauScript, texts: TEXTS, subtitle: TEXTS.subtitle,
    models: { ultra, consultant, juriste, directeur, drone, terminal, portique },
    types: { consultant: Consultant, juriste: Juriste, directeur: Directeur, terminal: Terminal }
  },
  'petite-france': {
    layout: pfLayout, script: pfScript, texts: TEXTS.pf, subtitle: TEXTS.pf.subtitle,
    models: { ultra, serveur, sommelier, terminal, pf_maison_a, pf_maison_b, pf_maison_b_licence, pf_maison_c,
      pf_quai, pf_lampadaire, pf_compteur, pf_borne, pf_herse_laser, pnj_celle_du_stade },
    types: { serveur: Serveur, sommelier: Sommelier, terminal: Terminal, borne: Borne }
  }
};
