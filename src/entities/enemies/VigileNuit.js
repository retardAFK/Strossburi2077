// Robot-vigile à lampe (Marché 2000, 2026, fiche docs/designs/vigiles-nuit.md) : sbire guetteur (Guetteur.js), robot
// (la flèche court-circuit l'étourdit). Sa tête-projecteur (pivot `lampe`) éclaire un faisceau : dehors, rester hors
// du faisceau. Gag validé : il colle des étiquettes « x10 » (bulle quand il touche l'Ultra).
import { Guetteur } from './Guetteur.js';
import { pose } from '../../systems/Animator.js';

export class VigileNuit extends Guetteur {
  constructor(game, opts) {
    super(game, { ...opts, kind: 'vigile', model: 'vigile_nuit', label: 'VIGILE NUIT', beamColor: 0xfff0b0 });
    const l = this.obj.userData.J.lampe;
    if (l) this.beam.position.set(l.position.x, 0.06, l.position.z);
  }
  update(dt) {
    super.update(dt);
    // la tête-projecteur balaie doucement pendant la ronde
    if (!this.removed && this.stateName === 'patrol') pose(this.obj, { head: Math.sin(this.time * 1.5) * 8 });
  }
}
