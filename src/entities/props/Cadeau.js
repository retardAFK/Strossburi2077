// Cadeau piégé de Marco CeKlair (fiche docs/designs/marco-ceklair.md) : lancé en cloche vers un point, il s'écrase et
// laisse une zone dangereuse (Hazard) : « interdiction de stade » (rouge) ou « billet hors de prix » (doré).
// Modèles cadeau_interdiction / cadeau_billet. opts : { x, z, tx, tz, kind: 'interdiction' | 'billet', time, r, life, dmg }.
import { Entity } from '../Entity.js';
import { Hazard } from './Hazard.js';

const COLORS = { interdiction: 0xff1a3c, billet: 0xffc040 };

export class Cadeau extends Entity {
  constructor(game, { x, z, tx, tz, kind, time, r, life, dmg }) {
    super(game, { x, z, r: 0.3, hp: 1, model: 'cadeau_' + kind, scale: 1.6 });
    Object.assign(this, { x0: x, z0: z, tx, tz, kind, dur: time, hr: r, life, dmg, isGift: true });
    game.add(new Hazard(game, { x: tx, z: tz, r, warn: time, life, dmg, color: COLORS[kind] }));
  }
  takeHit() {}
  update(dt) {
    this.time += dt;
    const k = Math.min(1, this.time / this.dur);
    this.x = this.x0 + (this.tx - this.x0) * k; this.z = this.z0 + (this.tz - this.z0) * k;
    this.obj.position.set(this.x, 2.2 + Math.sin(k * Math.PI) * 3 - 2 * k, this.z);
    this.obj.rotation.set(this.time * 6, this.time * 4, 0);
    if (k >= 1) { this.game.particles.burst(this.x, 0.3, this.z, 12, COLORS[this.kind], 5); this.game.audio.play('hit'); this.remove(); }
  }
}
