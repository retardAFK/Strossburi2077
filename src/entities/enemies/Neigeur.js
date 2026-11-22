// Agent de sécurité BlingCo de la place Kléber (2026, fiche docs/designs/agents-kleber.md) : sbire du kit Sbire.js,
// gilet fluo, casquette « SÉCURITÉ » (variantes « un peu des 3 » : Peagiste, AgentBouclier, Neigeur).
// Neigeur : canon à neige (pivot `canon_neige`, il vise l'Ultra) ; ses boules de neige ralentissent (« GELÉ ! »).
import { Sbire } from './Sbire.js';
import { Projectile } from '../props/Projectile.js';

export class Neigeur extends Sbire {
  constructor(game, opts) { super(game, { ...opts, kind: 'neigeur', model: 'agent_kleber_neigeur', label: 'NEIGEUR' }); }
  shoot() {
    const S = this.S; this.game.audio.play('throw');
    this.game.add(new Projectile(this.game, { x: this.x + this.fx * 1.1, z: this.z + this.fz * 1.1, face: this.face,
      speed: S.projSpeed, dmg: S.dmg, shape: S.shape, y: 1.1, spin: 6, r: 0.3,
      slow: { k: S.slow, t: S.slowTime, text: this.game.levelTexts.frozen } }));
  }
  update(dt) {
    super.update(dt);
    // le canon est modélisé pointé vers le ciel : on le baisse vers l'Ultra (fiche : « le canon vise l'Ultra »)
    const c = this.obj?.userData.J.canon_neige;
    if (c && !this.removed) c.rotation.z = ['windup', 'attack', 'chase'].includes(this.stateName) ? -0.9 : -0.4;
  }
}
