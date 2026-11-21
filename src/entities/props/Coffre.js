// Coffre (générique) : verrouillé jusqu'à 'chest:unlock:<id>', puis E à portée → le couvercle s'ouvre
// (pivot 'lid') et le coffre émet 'chest:opened' (id). Le script décide de ce qu'il contient.
import { Entity } from '../Entity.js';
import { TUNING } from '../../data/tuning.js';
import { interact, clearPrompt } from '../../systems/Interact.js';

export class Coffre extends Entity {
  constructor(game, { id, x, z, rotY = 0, model = 'pf_coffre', locked = true }) {
    super(game, { x, z, r: 0.7, hp: 1, model });
    this.id = id; this.face = rotY; this.isChest = true; this.locked = locked; this.open = false;
    this.lid = this.obj.userData.J.lid;
    game.collision.addCircle(x, z, 0.7, 'chest');
    game.events.on('chest:unlock:' + id, () => { this.locked = false; });
    this.sync();
  }
  update(dt) {
    this.time += dt;
    if (this.lid) this.lid.rotation.z += ((this.open ? TUNING.chest.lidAngle : 0) - this.lid.rotation.z) * Math.min(1, dt * 4);
    if (this.open || this.locked) { clearPrompt(this); return; }
    if (interact(this, this.game.texts.prompts.open, TUNING.chest.useRange)) {
      this.open = true; clearPrompt(this);
      this.game.audio.play('pickup'); this.game.particles.burst(this.x, 1.2, this.z, 16, 0xffc040, 4);
      this.game.events.emit('chest:opened', this.id);
    }
  }
}
