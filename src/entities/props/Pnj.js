// PNJ allié (générique) : respire, regarde l'Ultra quand il approche ; E à portée → émet 'pnj:talk' (id).
// Le script choisit quoi dire selon l'état de la salle (indices de la winstubière...).
import { Entity } from '../Entity.js';
import { TUNING } from '../../data/tuning.js';
import { interact, clearPrompt } from '../../systems/Interact.js';
import { pose } from '../../systems/Animator.js';

export class Pnj extends Entity {
  constructor(game, { id, model, x, z, rotY = 0, hidden = false }) {
    super(game, { x, z, r: 0.5, hp: 1, model });
    this.id = id; this.face = rotY; this.isPnj = true; this.face0 = rotY;
    // caché jusqu'à son entrée en scène ('pnj:show:<id>'), ou parti ('pnj:hide:<id>')
    this.shown = !hidden; this.obj.visible = this.shown;
    game.events.on('pnj:show:' + id, () => { this.shown = true; this.obj.visible = true; });
    game.events.on('pnj:hide:' + id, () => { this.shown = false; this.obj.visible = false; clearPrompt(this); });
    this.sync();
  }
  update(dt) {
    this.time += dt;
    if (!this.shown) return;
    const p = this.game.player, near = p.dist(this) < TUNING.pnj.useRange * 2;
    if (near) this.faceTo(p.x, p.z, dt * 3); else this.face += (this.face0 - this.face) * Math.min(1, dt * 2);
    pose(this.obj, { head: Math.sin(this.time * 1.3) * 6, shN: 10 + Math.sin(this.time * 1.1) * 4, shF: 10 }, Math.sin(this.time * 2) * 0.01);
    this.sync();
    if (interact(this, this.game.texts.prompts.talk, TUNING.pnj.useRange)) this.game.events.emit('pnj:talk', this.id);
  }
}
