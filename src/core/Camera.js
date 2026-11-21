// Caméra 3e personne : suit l'Ultra, se recentre, cadre la cible verrouillée ou le boss.
import * as THREE from 'three';
import { TUNING } from '../data/tuning.js';

const angDiff = (a, b) => { let d = b - a; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; return d; };

export class Camera {
  constructor(cam) {
    this.cam = cam; this.yaw = 0; this.shake = 0;
    this.pos = new THREE.Vector3(0, 5, 5); this.look = new THREE.Vector3();
    this.bounds = null; // [x0,x1,zTop,zBottom] de la zone courante
    this.boss = false;
  }
  // vecteurs horizontaux avant / droite (utilisés pour les déplacements relatifs à la caméra)
  forward() { return { x: -Math.sin(this.yaw), z: -Math.cos(this.yaw) }; }
  right() { return { x: Math.cos(this.yaw), z: -Math.sin(this.yaw) }; }
  snapBehind(face) { this.yaw = Math.atan2(-Math.cos(face), Math.sin(face)); }

  update(dt, player, focus, moving) {
    const C = TUNING.camera;
    if (focus) {
      const want = Math.atan2(-(focus.x - player.x), -(focus.z - player.z));
      this.yaw += angDiff(this.yaw, want) * Math.min(1, dt * C.lockRate);
    } else if (moving) {
      const want = Math.atan2(-Math.cos(player.face), Math.sin(player.face));
      const d = angDiff(this.yaw, want);
      if (Math.abs(d) < 2.3) this.yaw += d * Math.min(1, dt * C.followRate);
    }
    const f = this.forward();
    const dist = this.boss ? C.bossDist : C.dist, h = this.boss ? C.bossHeight : C.height;
    const want = new THREE.Vector3(player.x - f.x * dist, h, player.z - f.z * dist);
    if (this.bounds) {
      const [x0, x1, z0, z1] = this.bounds;
      const wx = Math.max(x0 + 0.7, Math.min(x1 - 0.7, want.x)), wz = Math.max(z1 + 0.7, Math.min(z0 - 0.7, want.z));
      want.y += Math.min(Math.hypot(want.x - wx, want.z - wz) * 0.6, 3);
      want.x = wx; want.z = wz;
    }
    this.pos.lerp(want, Math.min(1, dt * 6));
    this.cam.position.copy(this.pos);
    if (this.shake > 0) {
      this.shake = Math.max(0, this.shake - dt);
      this.cam.position.x += (Math.random() - 0.5) * this.shake; this.cam.position.y += (Math.random() - 0.5) * this.shake;
    }
    const look = new THREE.Vector3(player.x, 1.6, player.z);
    if (focus) look.lerp(new THREE.Vector3(focus.x, focus.lookY || 1.6, focus.z), 0.4);
    this.look.lerp(look, Math.min(1, dt * 10));
    this.cam.lookAt(this.look);
  }
}
