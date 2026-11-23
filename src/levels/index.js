// Registre des niveaux : pour chacun, ses données (layout), son script, ses textes,
// les modèles .glb à charger et les types d'entités que layout/script peuvent faire apparaître.
// Ajouter un niveau = un dossier levels/<id>/ + une entrée ici. Choix : ?level=<id> dans l'URL.
// debugOnly : accessible seulement avec ?debug=1 (bac à sable de test).
import { TEXTS } from '../data/texts.fr.js';
import { Consultant } from '../entities/enemies/Consultant.js';
import { Juriste } from '../entities/enemies/Juriste.js';
import { Directeur } from '../entities/bosses/Directeur.js';
import { Serveur } from '../entities/enemies/Serveur.js';
import { Sommelier } from '../entities/enemies/Sommelier.js';
import { Terminal } from '../entities/props/Terminal.js';
import { Borne } from '../entities/props/Borne.js';
import { Plaque } from '../entities/props/Plaque.js';
import { Barque } from '../entities/props/Barque.js';
import { Lever } from '../entities/props/Lever.js';
import { Pnj } from '../entities/props/Pnj.js';
import { Coffre } from '../entities/props/Coffre.js';
import { Cible } from '../entities/props/Cible.js';
import { Asr67 } from '../entities/bosses/Asr67.js';
import { VideurMaitreHotel } from '../entities/enemies/VideurMaitreHotel.js';
import meinauLayout from './meinau-ouest/layout.js';
import meinauScript from './meinau-ouest/script.js';
import pfLayout from './petite-france/layout.js';
import pfScript from './petite-france/script.js';
import bacLayout from './bac-a-sable/layout.js';
import bacScript from './bac-a-sable/script.js';
import { Mannequin } from '../entities/props/Mannequin.js';
import { Sbire } from '../entities/enemies/Sbire.js';
import { CaisseFleches } from '../entities/props/CaisseFleches.js';
import { StewardRobot } from '../entities/enemies/StewardRobot.js';
import { Egboehly } from '../entities/bosses/Egboehly.js';
import { Figurant } from '../entities/props/Figurant.js';
import { Crochet } from '../entities/props/Crochet.js';
import { EcranGeant } from '../entities/props/EcranGeant.js';
import { TifoGeant } from '../entities/props/TifoGeant.js';
import { AgentImmo } from '../entities/enemies/AgentImmo.js';
import { Promoteur } from '../entities/bosses/Promoteur.js';
import { Anneau } from '../entities/props/Anneau.js';
import { Tractable } from '../entities/props/Tractable.js';
import { Pancarte } from '../entities/props/Pancarte.js';
import { VigileNuit } from '../entities/enemies/VigileNuit.js';
import { ChariotRobot } from '../entities/enemies/ChariotRobot.js';
import { GerantNuit } from '../entities/bosses/GerantNuit.js';
import { NeonCour } from '../entities/props/NeonCour.js';
import { CameraScanner } from '../entities/props/CameraScanner.js';
import { LettreNeon } from '../entities/props/LettreNeon.js';
import { StorkAllie } from '../entities/props/StorkAllie.js';
import m2kLayout from './marche2000/layout.js';
import m2kScript from './marche2000/script.js';
import { Physio } from '../entities/enemies/Physio.js';
import { RobotCordon } from '../entities/enemies/RobotCordon.js';
import { MagnatVip } from '../entities/bosses/MagnatVip.js';
import { Sono } from '../entities/props/Sono.js';
import { Projecteur } from '../entities/props/Projecteur.js';
import { DylagneAllie } from '../entities/props/DylagneAllie.js';
import kaltLayout from './kalt/layout.js';
import kaltScript from './kalt/script.js';
import { Peagiste } from '../entities/enemies/Peagiste.js';
import { AgentBouclier } from '../entities/enemies/AgentBouclier.js';
import { Neigeur } from '../entities/enemies/Neigeur.js';
import { MarcoCeKlair } from '../entities/bosses/MarcoCeKlair.js';
import { NeigePayante } from '../entities/props/NeigePayante.js';
import { TamponOfficiel } from '../entities/props/TamponOfficiel.js';
import { Monument } from '../entities/props/Monument.js';
import { BoulesSapin } from '../entities/props/BoulesSapin.js';
import kleberLayout from './kleber/layout.js';
import kleberScript from './kleber/script.js';
import prhLayout from './port-rhin/layout.js';
import prhScript from './port-rhin/script.js';
import mei2Layout from './meinau/layout.js';
import mei2Script from './meinau/script.js';

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
import pnj_winstubiere from '../../assets/models/pnj_winstubiere.glb';
import pf_pont from '../../assets/models/pf_pont.glb';
import pf_barque from '../../assets/models/pf_barque.glb';
import pf_vanne from '../../assets/models/pf_vanne.glb';
import pf_levier from '../../assets/models/pf_levier.glb';
import pf_cage from '../../assets/models/pf_cage.glb';
import pf_tour_peage from '../../assets/models/pf_tour_peage.glb';
import pf_coffre from '../../assets/models/pf_coffre.glb';
import bretzel_boomerang from '../../assets/models/bretzel_boomerang.glb';
import pf_cible_tpe from '../../assets/models/pf_cible_tpe.glb';
import pf_vitre from '../../assets/models/pf_vitre.glb';
import pf_arche_barrage from '../../assets/models/pf_arche_barrage.glb';
import asr from '../../assets/models/asr.glb';
import pnj_celui_du_stade from '../../assets/models/pnj_celui_du_stade.glb';
import arc_drapeau from '../../assets/models/arc_drapeau.glb';
import steward_robot from '../../assets/models/steward_robot.glb';
import egboehly from '../../assets/models/egboehly.glb';
import decor_meinau_ext from '../../assets/models/decor_meinau_ext.glb';
import decor_meinau_bol from '../../assets/models/decor_meinau_bol.glb';
import decor_port_rhin from '../../assets/models/decor_port_rhin.glb';
import agent_immo from '../../assets/models/agent_immo.glb';
import pancarte_vendu from '../../assets/models/pancarte_vendu.glb';
import promoteur from '../../assets/models/promoteur.glb';
import prefab_boite from '../../assets/models/prefab_boite.glb';
import prefab_bureau from '../../assets/models/prefab_bureau.glb';
import prefab_loft from '../../assets/models/prefab_loft.glb';
import gaffe_grappin from '../../assets/models/gaffe_grappin.glb';
import vigile_nuit from '../../assets/models/vigile_nuit.glb';
import chariot_robot from '../../assets/models/chariot_robot.glb';
import gerant_nuit from '../../assets/models/gerant_nuit.glb';
import stork from '../../assets/models/stork.glb';
import decor_marche2000 from '../../assets/models/decor_marche2000.glb';
import physio_kalt from '../../assets/models/physio_kalt.glb';
import robot_cordon from '../../assets/models/robot_cordon.glb';
import magnat_vip from '../../assets/models/magnat_vip.glb';
import dylagne from '../../assets/models/dylagne.glb';
import decor_kalt from '../../assets/models/decor_kalt.glb';
import decor_kalt_ext from '../../assets/models/decor_kalt_ext.glb';
import agent_kleber_peagiste from '../../assets/models/agent_kleber_peagiste.glb';
import agent_kleber_bouclier from '../../assets/models/agent_kleber_bouclier.glb';
import agent_kleber_neigeur from '../../assets/models/agent_kleber_neigeur.glb';
import marco_ceklair from '../../assets/models/marco_ceklair.glb';
import cadeau_interdiction from '../../assets/models/cadeau_interdiction.glb';
import cadeau_billet from '../../assets/models/cadeau_billet.glb';
import decor_kleber from '../../assets/models/decor_kleber.glb';

export const DEFAULT_LEVEL = 'petite-france'; // l'ancien prototype reste accessible avec ?level=meinau-ouest
// Partie 1, dans l'ordre (docs/decisions.md). Seuls les niveaux déjà inscrits dans LEVELS sont joués ;
// la fin d'un niveau lance le suivant (systems/Progress.js). La partie 2 (2067) viendra plus tard.
export const CAMPAIGN_ORDER = ['petite-france', 'meinau', 'port-rhin', 'marche2000', 'kalt', 'kleber'];

export const LEVELS = {
  'meinau-ouest': {
    layout: meinauLayout, script: meinauScript, texts: TEXTS, subtitle: TEXTS.subtitle,
    models: { ultra, consultant, juriste, directeur, drone, terminal, portique },
    types: { consultant: Consultant, juriste: Juriste, directeur: Directeur, terminal: Terminal }
  },
  'petite-france': {
    layout: pfLayout, script: pfScript, texts: TEXTS.pf, subtitle: TEXTS.pf.subtitle,
    models: { ultra, serveur, sommelier, terminal, pf_maison_a, pf_maison_b, pf_maison_b_licence, pf_maison_c,
      pf_quai, pf_lampadaire, pf_compteur, pf_borne, pf_herse_laser, pnj_celle_du_stade,
      pnj_winstubiere, pf_pont, pf_barque, pf_vanne, pf_levier, pf_cage, drone, pf_tour_peage, pf_coffre, bretzel_boomerang,
      pf_cible_tpe, pf_vitre, pf_arche_barrage, asr, pnj_celui_du_stade },
    types: { serveur: Serveur, sommelier: Sommelier, terminal: Terminal, borne: Borne, plaque: Plaque,
      barque: Barque, lever: Lever, pnj: Pnj, coffre: Coffre, videur: VideurMaitreHotel, cible: Cible, asr: Asr67 }
  },
  meinau: {
    layout: mei2Layout, script: mei2Script, texts: TEXTS.meinau, subtitle: TEXTS.meinau.subtitle,
    models: { ultra, steward_robot, egboehly, arc_drapeau, bretzel_boomerang, pf_cible_tpe, pf_herse_laser, terminal,
      decor_meinau_ext, decor_meinau_bol },
    types: { steward: StewardRobot, egboehly: Egboehly, figurant: Figurant, crochet: Crochet, ecran: EcranGeant,
      tifo: TifoGeant, caisse: CaisseFleches, cible: Cible, terminal: Terminal }
  },
  'port-rhin': {
    layout: prhLayout, script: prhScript, texts: TEXTS.portRhin, subtitle: TEXTS.portRhin.subtitle,
    models: { ultra, agent_immo, pancarte_vendu, promoteur, prefab_boite, prefab_bureau, prefab_loft, gaffe_grappin,
      arc_drapeau, bretzel_boomerang, pf_herse_laser, decor_port_rhin },
    types: { agent: AgentImmo, promoteur: Promoteur, anneau: Anneau, tractable: Tractable, pancarte: Pancarte, figurant: Figurant }
  },
  marche2000: {
    layout: m2kLayout, script: m2kScript, texts: TEXTS.marche2000, subtitle: TEXTS.marche2000.subtitle,
    models: { ultra, vigile_nuit, chariot_robot, gerant_nuit, stork, arc_drapeau, bretzel_boomerang, gaffe_grappin, decor_marche2000 },
    types: { vigile: VigileNuit, chariot: ChariotRobot, gerant: GerantNuit, neon: NeonCour, camera: CameraScanner,
      lettre: LettreNeon, stork: StorkAllie, figurant: Figurant, caisse: CaisseFleches }
  },
  kalt: {
    layout: kaltLayout, script: kaltScript, texts: TEXTS.kalt, subtitle: TEXTS.kalt.subtitle,
    models: { ultra, physio_kalt, robot_cordon, magnat_vip, dylagne, arc_drapeau, bretzel_boomerang, gaffe_grappin,
      decor_kalt, decor_kalt_ext },
    types: { physio: Physio, cordon: RobotCordon, magnat: MagnatVip, sono: Sono, projo: Projecteur, dylagne: DylagneAllie,
      figurant: Figurant, caisse: CaisseFleches }
  },
  kleber: {
    layout: kleberLayout, script: kleberScript, texts: TEXTS.kleber, subtitle: TEXTS.kleber.subtitle,
    models: { ultra, agent_kleber_peagiste, agent_kleber_bouclier, agent_kleber_neigeur, marco_ceklair, cadeau_interdiction,
      cadeau_billet, stork, dylagne, terminal, arc_drapeau, bretzel_boomerang, gaffe_grappin, decor_kleber },
    types: { peagiste: Peagiste, bouclier: AgentBouclier, neigeur: Neigeur, marco: MarcoCeKlair, neige: NeigePayante,
      tampon: TamponOfficiel, tractable: Tractable, projo: Projecteur, stork: StorkAllie, dylagne: DylagneAllie,
      terminal: Terminal, figurant: Figurant, caisse: CaisseFleches, monument: Monument, boules: BoulesSapin }
  },
  'bac-a-sable': {
    debugOnly: true, layout: bacLayout, script: bacScript, texts: TEXTS.bac, subtitle: TEXTS.bac.subtitle,
    models: { ultra, arc_drapeau, bretzel_boomerang, pf_cible_tpe, pf_herse_laser },
    types: { cible: Cible, mannequin: Mannequin, sbire: Sbire, caisse: CaisseFleches } // sbire / caisse : tests du socle
  }
};
export const CAMPAIGN = CAMPAIGN_ORDER.filter(id => LEVELS[id]);
