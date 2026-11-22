// Agent de sécurité BlingCo de la place Kléber (2026, fiche docs/designs/agents-kleber.md) : sbire du kit Sbire.js,
// gilet fluo, casquette « SÉCURITÉ » (variantes « un peu des 3 » : Peagiste, AgentBouclier, Neigeur).
// Bouclier pub : bouclier-écran à pubs (pivot `bouclier`) ; de face, tout rebondit (à contourner, ou l'étourdir au
// gaffe-grappin, ou la grosse caisse de Dylagne : bouclier baissé).
import { Sbire } from './Sbire.js';

export class AgentBouclier extends Sbire {
  constructor(game, opts) { super(game, { ...opts, kind: 'bouclier', model: 'agent_kleber_bouclier', label: 'AGENT BOUCLIER' }); }
  // de face (le coup vient de devant lui), le bouclier pare ; étourdi ou en pleine charge, non
  takeHit(dmg, nx, nz, knock, from) {
    const front = -(nx * this.fx + nz * this.fz) > this.S.shieldCos;
    if (front && !from?.isDylagne && !['stunned', 'attack', 'die'].includes(this.stateName)) {
      this.game.audio.play('ting'); this.game.bubble(this, this.game.texts.shield, 0.5); return;
    }
    super.takeHit(dmg, nx, nz, knock, from);
  }
}
