// Comportements communs aux ennemis : agro, recul, mort, petites phrases.
import { Entity } from '../Entity.js';

export class Enemy extends Entity {
  constructor(game, opts) {
    super(game, opts);
    this.isEnemy = true; this.group = opts.group || null; this.walkT = Math.random() * 6;
    this.barkCd = 2 + Math.random() * 4;
  }
  get player() { return this.game.player; }
  onHurt() { if (this.states.hurt) this.setState('hurt'); }
  onDeath() { this.setState('die'); this.game.events.emit('enemy:killed', this); }
  // écarte les ennemis les uns des autres pour éviter les paquets
  separate(dt) {
    for (const o of this.game.entities) {
      if (o === this || !o.isEnemy || !o.alive) continue;
      const dx = this.x - o.x, dz = this.z - o.z, d = Math.hypot(dx, dz), m = this.r + o.r + 0.3;
      if (d < m && d > 0.01) { this.x += dx / d * dt * 3; this.z += dz / d * dt * 3; }
    }
  }
  bark(kind) {
    this.barkCd -= this.game.dt;
    if (this.barkCd > 0) return;
    this.barkCd = 6 + Math.random() * 6;
    const lines = this.game.texts.barks[kind];
    this.game.bubble(this, lines[Math.floor(Math.random() * lines.length)]);
  }
  // état de mort commun : tourne sur lui-même, rapetisse, confettis bleus et blancs
  static dieState(color = 0x1f5fd0) {
    return {
      enter() { this.inv = 99; this.game.audio.play('heavy'); },
      update(dt) {
        this.obj.rotation.y += dt * 18; this.obj.scale.setScalar(Math.max(0.01, this.baseScale * (1 - this.t / 0.45)));
        if (this.t > 0.45) {
          this.game.particles.burst(this.x, 1, this.z, 10, color, 5);
          this.game.particles.burst(this.x, 1, this.z, 8, 0xf4f6ff, 5);
          this.game.events.emit('enemy:removed', this);
          this.remove();
        }
      }
    };
  }
}
