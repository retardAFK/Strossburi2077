// Écharpe perdue du kop : MARQUEUR de maquette grise (3 par niveau, brief docs/designs/brief-greybox-meinau.md).
// Le système d'écharpes à collectionner viendra plus tard : pour l'instant, l'Ultra la ramasse en passant dessus
// (événement 'echarpe:trouvee' (id)), sans effet de jeu. Sans design : petit bloc bleu et blanc + étiquette.
// opts : { id, x, z, label }.
import * as THREE from 'three';
import { Entity } from '../Entity.js';
import { placeholderLabel } from '../../systems/Placeholder.js';

export class EcharpeMarqueur extends Entity {
  constructor(game, { id, x, z, label = 'ÉCHARPE' }) {
    super(game, { x, z, r: 0.6, hp: 1 });
    this.id = id; this.isEcharpe = true;
    this.obj = new THREE.Group(); this.obj.position.set(x, 0, z);
    this.item = new THREE.Group();
    const a = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.18, 0.22), new THREE.MeshBasicMaterial({ color: 0x1f5fd0, fog: false }));
    const b = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.19, 0.23), new THREE.MeshBasicMaterial({ color: 0xf4f6ff, fog: false }));
    this.item.add(a, b); this.item.position.y = 0.9; this.obj.add(this.item);
    this.obj.add(placeholderLabel(game, label, 1.6));
    game.renderer.scene.add(this.obj);
  }
  takeHit() {}
  update(dt) {
    this.time += dt; this.item.rotation.y = this.time * 2;
    const p = this.game.player;
    if (p.alive && this.dist(p) < this.r + p.r) {
      this.alive = false; this.game.audio.play('pickup');
      this.game.particles.burst(this.x, 1, this.z, 12, 0x1f5fd0, 4);
      this.game.events.emit('echarpe:trouvee', this.id, this); this.remove();
    }
  }
}
