// Objet de quête (générique) : E à portée → l'Ultra le prend, événement 'objet:pris' (id). Le niveau décide de l'effet
// (ex. l'accréditation BlingCo qui ouvre la grille B de la Meinau). Sans design validé : petite carte jaune + étiquette.
// opts : { id, x, z, label }.
import * as THREE from 'three';
import { Entity } from '../Entity.js';
import { interact, clearPrompt } from '../../systems/Interact.js';
import { placeholderLabel } from '../../systems/Placeholder.js';

export class ObjetQuete extends Entity {
  constructor(game, { id, x, z, label }) {
    super(game, { x, z, r: 0.4, hp: 1 });
    this.id = id; this.isQuestItem = true;
    this.obj = new THREE.Group(); this.obj.position.set(x, 0, z);
    this.item = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.32, 0.04), new THREE.MeshBasicMaterial({ color: 0xffd23f, fog: false }));
    this.item.position.y = 1; this.obj.add(this.item);
    this.obj.add(placeholderLabel(game, label, 1.7));
    game.renderer.scene.add(this.obj);
  }
  takeHit() {}
  take() {
    clearPrompt(this); this.alive = false;
    this.game.audio.play('pickup'); this.game.particles.burst(this.x, 1, this.z, 14, 0xffd23f, 4);
    this.game.events.emit('objet:pris', this.id, this);
    this.remove();
  }
  update(dt) {
    this.time += dt;
    this.item.rotation.y = this.time * 2; this.item.position.y = 1 + Math.sin(this.time * 3) * 0.08;
    if (interact(this, this.game.texts.prompts.take, 2.2)) this.take();
  }
}
