// Figurant (générique) : personnage d'ambiance SANS design validé (anciens du kop, dockers, clients…) → placeholder gris
// étiqueté. Optionnel : on peut lui parler (E → 'pnj:talk' id), il chante (bulles), il est caché jusqu'à 'pnj:show:<id>'.
// Les vrais designs viendront de Cowork (listés dans les PR : « designs attendus »).
import { Entity } from '../Entity.js';
import { placeholder } from '../../systems/Placeholder.js';
import { interact, clearPrompt } from '../../systems/Interact.js';
import { rng } from '../../core/Random.js';

export class Figurant extends Entity {
  // opts : { id, label, x, z, rotY, talk: bool, chant: [textes], hidden }
  constructor(game, { id, label, x, z, rotY = 0, talk = false, chant = null, hidden = false }) {
    super(game, { x, z, r: 0.45, hp: 1 });
    Object.assign(this, { id, talk, chant, isPnj: true, shown: !hidden, chantCd: 1 + rng() * 4 });
    this.face = rotY;
    this.obj = placeholder(game, label, 1.85); game.renderer.scene.add(this.obj);
    this.obj.visible = this.shown;
    if (id) {
      game.events.on('pnj:show:' + id, () => { this.shown = true; this.obj.visible = true; });
      game.events.on('pnj:hide:' + id, () => { this.shown = false; this.obj.visible = false; clearPrompt(this); });
    }
    this.sync();
  }
  update(dt) {
    this.time += dt;
    if (!this.shown) return;
    this.obj.userData.model.position.y = Math.abs(Math.sin(this.time * (this.chant ? 6 : 1.5))) * (this.chant ? 0.15 : 0.03);
    if (this.chant && (this.chantCd -= dt) <= 0) { this.chantCd = 3 + rng() * 4; this.game.bubble(this, this.chant[Math.floor(rng() * this.chant.length)], 1.5); }
    if (this.talk && interact(this, this.game.texts.prompts.talk, 2.6)) this.game.events.emit('pnj:talk', this.id);
  }
}
