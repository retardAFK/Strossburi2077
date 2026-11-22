// Chariot-robot de rayon (Marché 2000, 2026, fiche docs/designs/vigiles-nuit.md) : sbire guetteur (Guetteur.js) sur
// roulettes, robot (la flèche court-circuit l'étourdit). Son scanner rouge (pivot `scanner`) balaie l'allée devant lui :
// pas de jambes, il glisse ; son gyrophare tourne. Gag : étiquettes « x10 ».
import { Guetteur } from './Guetteur.js';

export class ChariotRobot extends Guetteur {
  constructor(game, opts) {
    super(game, { ...opts, kind: 'chariot', model: 'chariot_robot', label: 'CHARIOT-ROBOT', beamColor: 0xff4060 });
    const s = this.obj.userData.J.scanner;
    if (s) this.beam.position.set(s.position.x, 0.06, s.position.z);
  }
  update(dt) {
    super.update(dt);
    if (this.removed) return;
    const J = this.obj.userData.J, s = this.stateName;
    if (J.bras) J.bras.rotation.z = s === 'windup' || s === 'attack' ? -0.9 : Math.sin(this.time * 3) * 0.15; // l'étiqueteuse
    if (J.panier) J.panier.position.y = 0.5 + Math.abs(Math.sin(this.walkT)) * 0.03; // cahots
  }
}
