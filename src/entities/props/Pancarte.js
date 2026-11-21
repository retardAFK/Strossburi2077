// Pancarte « VENDU » (gag des agents immobiliers-clones, fiche docs/designs/agent-immo.md) : plantée dans le décor
// (elle tombe d'un coup d'écharpe), ou sur l'Ultra (`onPlayer`) : purement comique, elle tombe d'une roulade ou
// au bout de TUNING.agentImmo.onPlayer s. Pas de collision.
import { Entity } from '../Entity.js';
import { TUNING } from '../../data/tuning.js';

export class Pancarte extends Entity {
  constructor(game, { x, z, onPlayer = false }) {
    super(game, { x, z, r: 0.4, hp: 1, model: 'pancarte_vendu' });
    this.onPlayer = onPlayer; this.face = Math.random() * Math.PI * 2; this.isPancarte = true;
    if (onPlayer) { // dans le dos de l'Ultra, de travers
      const t = game.player.obj.userData.J.torso || game.player.obj;
      t.add(this.obj); this.obj.position.set(-0.25, 0.1, 0); this.obj.rotation.set(0.3, Math.PI / 2, 0.2);
    } else this.sync();
    this.fall = 0;
  }
  takeHit() { if (!this.onPlayer && !this.fall) { this.fall = 0.01; this.game.audio.play('hit'); } }
  update(dt) {
    this.time += dt;
    if (this.onPlayer) {
      const p = this.game.player;
      if (p.stateName === 'roll' || p.stateName === 'dead' || this.time > TUNING.agentImmo.onPlayer) this.remove();
      return;
    }
    if (this.fall) { this.fall += dt * 3; this.obj.rotation.z = -Math.min(1.5, this.fall); if (this.fall > 2.5) this.remove(); }
  }
  remove() { this.obj.removeFromParent(); super.remove(); }
}
