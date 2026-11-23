// Monument (générique) : socle de pierre + statue. Sans design validé de la statue, la figure est un placeholder gris
// étiqueté (aucun design inventé) posé sur un socle simple. Obstacle (cercle). Sert à la statue du général Kléber.
// opts : { x, z, label, socle: hauteur (m), w: largeur (m) }.
import * as THREE from 'three';
import { Entity } from '../Entity.js';
import { placeholder } from '../../systems/Placeholder.js';

export class Monument extends Entity {
  constructor(game, { x, z, label, socle = 2.6, w = 2.4 }) {
    super(game, { x, z, r: w * 0.6, hp: 1 });
    this.obj = new THREE.Group(); this.obj.position.set(x, 0, z);
    const stone = new THREE.MeshLambertMaterial({ color: 0xb8a888, flatShading: true });
    const base = new THREE.Mesh(new THREE.BoxGeometry(w * 1.3, 0.5, w * 1.3), stone); base.position.y = 0.25;
    const body = new THREE.Mesh(new THREE.BoxGeometry(w, socle - 0.7, w), stone); body.position.y = 0.5 + (socle - 0.7) / 2;
    const top = new THREE.Mesh(new THREE.BoxGeometry(w * 1.15, 0.2, w * 1.15), stone); top.position.y = socle - 0.1;
    this.obj.add(base, body, top);
    const fig = placeholder(game, label, 2.4); fig.position.y = socle; this.obj.add(fig);
    game.renderer.scene.add(this.obj);
    game.collision.addCircle(x, z, w * 0.75, 'prop');
  }
  takeHit() {}
  update() {}
}
