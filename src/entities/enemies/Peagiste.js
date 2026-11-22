// Agent de sécurité BlingCo de la place Kléber (2026, fiche docs/designs/agents-kleber.md) : sbire du kit Sbire.js,
// gilet fluo, casquette « SÉCURITÉ » (variantes « un peu des 3 » : Peagiste, AgentBouclier, Neigeur).
// Péagiste : TPE-matraque (pivot `tpe`) ; quand son coup porte, il fait payer le pas (bulle levelTexts.pay).
import { Sbire } from './Sbire.js';

export class Peagiste extends Sbire {
  constructor(game, opts) { super(game, { ...opts, kind: 'peagiste', model: 'agent_kleber_peagiste', label: 'PÉAGISTE' }); }
  update(dt) {
    const before = this.hitDone;
    super.update(dt);
    if (!this.removed && this.stateName === 'attack' && this.hitDone && !before) this.game.bubble(this.player, this.game.levelTexts.pay || '', 1);
  }
}
