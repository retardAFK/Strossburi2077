// Caméra-scanner de codes-barres (générique, Marché 2000) : fixée au plafond d'un rayon, elle pivote entre deux angles
// et son rayon rouge balaie le sol. Elle voit selon systems/Stealth.js (palettes et étagères cachent, la fumée aussi) ;
// si l'Ultra est dans le rayon : 'stealth:caught' (elle-même). La flèche court-circuit la coupe (TUNING.camScan.short s).
// Sans design validé : placeholder gris étiqueté. opts : { x, z, from, to (angles en radians), range? }.
import * as THREE from 'three';
import { Entity } from '../Entity.js';
import { spots } from '../../systems/Stealth.js';
import { beamMesh, beamAlert } from '../../systems/Beam.js';
import { placeholderLabel } from '../../systems/Placeholder.js';
import { TUNING } from '../../data/tuning.js';

const C = TUNING.camScan;

export class CameraScanner extends Entity {
  constructor(game, { x, z, from, to, range = C.range }) {
    super(game, { x, z, r: 0.4, hp: 1 });
    Object.assign(this, { from, to, range, look: from, off: 0, seen: 0, isTarget: true, lockable: true, hitY: 2.6, hitH: 3.4 });
    this.obj = new THREE.Group(); this.obj.position.set(x, 0, z);
    const cam = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.3, 0.3), new THREE.MeshLambertMaterial({ color: 0x8a8d98 }));
    cam.position.y = 2.8; this.obj.add(cam); this.cam = cam;
    this.obj.add(placeholderLabel(game, 'CAMÉRA-SCANNER', 3.3));
    this.beam = beamMesh(range, C.fov, 0xff1a3c); this.obj.add(this.beam);
    game.renderer.scene.add(this.obj);
  }
  takeHit() {} // une flèche simple rebondit ; le court-circuit la coupe (onShort)
  onShort() { this.off = C.short; this.game.particles.burst(this.x, 2.8, this.z, 10, 0x38f2ff, 4); }
  update(dt) {
    this.time += dt;
    this.off = Math.max(0, this.off - dt); this.seen = Math.max(0, this.seen - dt);
    this.beam.visible = this.off <= 0;
    if (this.off > 0) return;
    this.look = this.from + (this.to - this.from) * (0.5 - 0.5 * Math.cos(this.time * C.speed));
    this.beam.rotation.y = this.look; this.cam.rotation.y = this.look;
    const vu = this.seen <= 0 && spots(this.game, this, this.look, { range: this.range, cos: C.fov });
    beamAlert(this.beam, this.seen > 0, 0xff1a3c);
    if (vu) { this.seen = C.cooldown; this.game.audio.play('laser'); this.game.events.emit('stealth:caught', this); }
  }
}
