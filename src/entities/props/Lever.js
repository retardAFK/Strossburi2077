// Levier / vanne (générique) : E à portée → émet 'lever:used' (id) ; le script décide de l'effet.
// Animation selon les pivots du modèle : 'arm' (levier qui bascule), 'wheel' (volant qui tourne) + 'gate' (vanne).
import { Entity } from '../Entity.js';
import { TUNING } from '../../data/tuning.js';
import { interact, clearPrompt } from '../../systems/Interact.js';

const L = TUNING.lever;

export class Lever extends Entity {
  constructor(game, { id, model, x, z, rotY = 0, prompt = 'lever', solid = 0.4, fromBoat = false }) {
    super(game, { x, z, r: solid, hp: 1, model });
    this.id = id; this.face = rotY; this.isLever = true; this.prompt = prompt;
    this.fromBoat = fromBoat; // ne s'atteint que depuis la barque
    this.down = false; this.spin = 0; this.enabled = true;
    const J = this.obj.userData.J; this.arm = J.arm; this.wheel = J.wheel; this.gate = J.gate;
    if (this.arm) this.arm0 = this.arm.rotation.x;
    if (solid) game.collision.addCircle(x, z, solid, 'lever');
    game.events.on('lever:enable:' + id, on => { this.enabled = on; if (!on) clearPrompt(this); });
    this.sync();
  }
  use() {
    this.down = !this.down; this.spin = Math.PI * 2;
    this.game.audio.play('door'); this.game.camera.shake = 0.1;
    this.game.events.emit('lever:used', this.id, this.down);
  }
  update(dt) {
    this.time += dt;
    // animations : bras qui bascule, volant qui tourne
    if (this.arm) this.arm.rotation.x += ((this.down ? -L.armAngle : this.arm0) - this.arm.rotation.x) * Math.min(1, dt * 8);
    if (this.wheel && this.spin > 0) { const d = Math.min(this.spin, dt * 6); this.spin -= d; this.wheel.rotation.x += d; }
    if (this.gate) this.gate.position.y += ((this.down ? 1.2 : 0) - this.gate.position.y) * Math.min(1, dt * 2); // vanne levée
    const p = this.game.player, reachable = this.enabled && (!this.fromBoat || p.aboard);
    if (!reachable) { clearPrompt(this); return; }
    if (interact(this, this.game.texts.prompts[this.prompt], L.useRange)) this.use();
  }
}
