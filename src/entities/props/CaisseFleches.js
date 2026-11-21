// Caisse de flèches spéciales (générique) : posée près des énigmes qui en demandent, pour qu'on ne soit jamais bloqué.
// E à portée (ou un coup) → donne TUNING.crates.amount flèches du type à l'Arc-Drapeau, puis réapparaît après
// TUNING.crates.respawn secondes. Sans design validé : placeholder gris étiqueté (« CAISSE <TYPE> »).
import { Entity } from '../Entity.js';
import { placeholder } from '../../systems/Placeholder.js';
import { interact, clearPrompt } from '../../systems/Interact.js';
import { TUNING } from '../../data/tuning.js';

export class CaisseFleches extends Entity {
  constructor(game, { x, z, arrow }) {
    super(game, { x, z, r: 0.5, hp: 1 });
    this.arrow = arrow; this.isCrate = true; this.wait = 0;
    this.obj = placeholder(game, `${game.texts.crate} ${game.texts.arrows[arrow] || arrow}`, 0.7, 'boite');
    game.renderer.scene.add(this.obj); this.sync();
    game.collision.addCircle(x, z, 0.45, 'crate');
  }
  get full() { return this.wait <= 0; }
  takeHit() { this.open(); }
  open() {
    const arc = this.game.inventory.items?.arc;
    if (!this.full || !arc) return;
    arc.give(this.arrow, TUNING.crates.amount);
    this.wait = TUNING.crates.respawn; this.obj.visible = false; clearPrompt(this);
    this.game.audio.play('pickup'); this.game.particles.burst(this.x, 0.6, this.z, 10, 0xffc040, 3);
    this.game.events.emit('crate:opened', this.arrow, this);
  }
  update(dt) {
    this.time += dt;
    if (!this.full) { this.wait -= dt; if (this.full) this.obj.visible = true; return; }
    if (!this.game.inventory.items?.arc) return clearPrompt(this); // il faut l'arc pour s'en servir
    if (interact(this, this.game.texts.prompts.crate, TUNING.crates.useRange)) this.open();
  }
}
