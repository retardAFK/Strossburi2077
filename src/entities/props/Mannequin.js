// Mannequin d'entraînement (bac à sable) : PLACEHOLDER gris (aucun design), immobile, ne riposte pas, ne meurt pas.
// Compte les coups reçus (hits, lastFrom) pour les tests, flashe et recule un peu. Verrouillable comme un ennemi
// (isEnemy), mais n'entre dans aucun groupe et n'émet jamais 'enemy:killed'.
import * as THREE from 'three';
import { Entity } from '../Entity.js';

export class Mannequin extends Entity {
  constructor(game, { x, z, face = 0, id = null }) {
    super(game, { x, z, face, r: 0.55, hp: 99 });
    this.id = id; this.isEnemy = true; this.hits = 0; this.lastFrom = null; this.x0 = x; this.z0 = z; this.hitH = 2.1;
    const grey = new THREE.MeshLambertMaterial({ color: 0x8a8a94 });
    const g = new THREE.Group(), body = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.5, 1.5, 8), grey);
    body.position.y = 0.95; g.add(body);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.32, 8, 6), grey.clone()); head.position.y = 1.95; g.add(head);
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.3, 6), grey.clone()); post.position.y = 0.1; g.add(post);
    this.obj = new THREE.Group(); this.obj.add(g); this.obj.userData = { J: {}, model: g };
    game.renderer.scene.add(this.obj);
    game.collision.addCircle(x, z, 0.5, 'prop');
    this.sync();
  }
  takeHit(dmg, nx, nz, knock, from) {
    this.hits++; this.lastFrom = from?.isArrow ? 'arrow' : from?.isPlayerShot ? 'boomerang' : 'echarpe'; this.flash = 0.15;
    this.game.audio.play('hit'); this.game.events.emit('hit', this, from);
  }
  update(dt) {
    this.t += dt; this.time += dt; this.flash = Math.max(0, this.flash - dt);
    this.x = this.x0; this.z = this.z0; // ne bouge jamais
    this.sync();
  }
}
