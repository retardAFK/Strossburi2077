// Flèche de l'Arc-Drapeau en vol : ligne droite en 3D (direction donnée au tir), touche une fois la première
// entité sur sa route (ennemi, cible, borne, terminal), se plante dans les murs, disparaît au bout de sa portée.
// Survole l'eau et les obstacles bas comme le bretzel. Sans modèle : placeholder gris (fût + pointe).
import * as THREE from 'three';
import { Entity } from '../Entity.js';
import { TUNING } from '../../data/tuning.js';

const A = TUNING.arc;
const PASS = new Set(['water', 'vitre', 'gate', 'switch', 'terminal', 'plaque', 'target']);
const STEPS = 4; // sous-pas par tick : pas de flèche qui traverse une cible fine

function placeholder() {
  const g = new THREE.Group(), grey = new THREE.MeshLambertMaterial({ color: 0x9a9aa6 });
  const shaft = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.03, 0.03), grey); shaft.position.x = -0.4; g.add(shaft);
  const tip = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.12, 4), grey); tip.rotation.z = -Math.PI / 2; tip.position.x = 0.04; g.add(tip);
  return g;
}

export class Arrow extends Entity {
  // from : point de départ {x, y, z}, dir : direction 3D normée {x, y, z}, type : entrée de data/arrows.js
  constructor(game, from, dir, type) {
    super(game, { x: from.x, z: from.z, r: A.radius, hp: 1 });
    this.y = from.y; this.dir = dir; this.type = type; this.d = 0; this.isPlayerShot = true; this.isArrow = true;
    this.state = 'fly';
    const hasModel = type.model && game.assets.protos[type.model];
    this.obj = new THREE.Group();
    this.obj.add(hasModel ? game.assets.instance(type.model) : placeholder());
    game.renderer.scene.add(this.obj);
    // orientation : +X du modèle le long de la direction
    this.obj.quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), new THREE.Vector3(dir.x, dir.y, dir.z));
    this.obj.position.set(this.x, this.y, this.z);
  }
  wall(x, z) {
    for (const w of this.game.collision.boxes) if (w.on && !PASS.has(w.tag) && x > w.x0 && x < w.x1 && z > w.z0 && z < w.z1) return true;
    return false;
  }
  update(dt) {
    this.time += dt;
    if (this.state === 'stuck') { if (this.time > A.stuck) this.remove(); return; }
    const step = A.speed * dt / STEPS;
    for (let i = 0; i < STEPS; i++) {
      const nx = this.x + this.dir.x * step, ny = this.y + this.dir.y * step, nz = this.z + this.dir.z * step;
      if (this.wall(nx, nz) || ny < 0.05) return this.plant();
      this.x = nx; this.y = ny; this.z = nz; this.d += step;
      if (this.touch()) return this.remove();
      if (this.d >= A.range) return this.remove();
    }
    this.obj.position.set(this.x, this.y, this.z);
  }
  plant() { this.state = 'stuck'; this.time = 0; this.obj.position.set(this.x, this.y, this.z); this.game.audio.play('ting'); }
  touch() {
    for (const e of this.game.entities) {
      if (e === this || !e.alive || e.isArrow) continue;
      if (!(e.isEnemy || e.isSwitch || e.isTerminal || e.isTarget)) continue;
      const dx = e.x - this.x, dz = e.z - this.z, d = Math.hypot(dx, dz) || 0.01;
      if (d > e.r + this.r || this.y > (e.hitH || 2.6)) continue;
      e.takeHit(A.dmg, this.dir.x, this.dir.z, A.knock, this);
      this.game.particles.burst(this.x, this.y, this.z, 8, 0xf4f6ff, 3);
      this.game.events.emit('arrow:hit', e, this);
      return true;
    }
    return false;
  }
}
