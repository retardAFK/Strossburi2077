// Terminal BlingCo : un coup d'écharpe le fait planter et déclenche son événement.
import { Entity } from '../Entity.js';

export class Terminal extends Entity {
  constructor(game, { x, z, rotY = 0, event }) {
    super(game, { x, z, r: 0.6, hp: 1, model: 'terminal' });
    this.obj.rotation.y = rotY; this.face = rotY; this.event = event; this.isTerminal = true;
    game.collision.addCircle(x, z, 0.55, 'terminal');
    this.screen = this.obj.userData.J.screen;
  }
  takeHit() {
    if (!this.alive) return;
    this.alive = false;
    this.game.audio.play('hit'); this.game.camera.shake = 0.2;
    this.game.particles.burst(this.x, 1.5, this.z, 14, 0x38f2ff, 5);
    if (this.screen) this.screen.material.color.setHex(0x223355);
    this.game.events.emit(this.event, this);
  }
  update(dt) {
    this.time += dt;
    if (this.alive && this.screen) this.screen.material.emissive?.setHex(Math.sin(this.time * 6) > 0 ? 0x601030 : 0x200010);
  }
}
