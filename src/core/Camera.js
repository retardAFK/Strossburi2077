// Caméra 3e personne : orbite autour de l'Ultra (yaw horizontal, pitch vertical) pilotée par la souris
// ou le stick droit ; se recentre seule derrière le joueur après un délai sans souris ;
// cadre la cible verrouillée ou le boss (prioritaire sur la souris pour le yaw).
import * as THREE from 'three';
import { TUNING } from '../data/tuning.js';

const angDiff = (a, b) => { let d = b - a; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; return d; };
const LOOK_Y = 1.6; // hauteur visée sur le joueur

export class Camera {
  constructor(cam) {
    this.cam = cam; this.yaw = 0; this.shake = 0;
    this.pitch = this.defaultPitch(false);
    this.idle = Infinity; // temps depuis le dernier mouvement de souris / stick
    this.pos = new THREE.Vector3(0, 5, 5); this.look = new THREE.Vector3();
    this.bounds = null; // [x0,x1,zTop,zBottom] de la zone courante
    this.boss = false;
  }
  // vecteurs horizontaux avant / droite (utilisés pour les déplacements relatifs à la caméra)
  forward() { return { x: -Math.sin(this.yaw), z: -Math.cos(this.yaw) }; }
  right() { return { x: Math.cos(this.yaw), z: -Math.sin(this.yaw) }; }
  snapBehind(face) { this.yaw = Math.atan2(-Math.cos(face), Math.sin(face)); }

  // distance / hauteur de réglage -> angle par défaut et rayon de l'orbite
  defaultPitch(boss) { const C = TUNING.camera; return Math.atan2((boss ? C.bossHeight : C.height) - LOOK_Y, boss ? C.bossDist : C.dist); }
  radius(boss) { const C = TUNING.camera; return Math.hypot((boss ? C.bossHeight : C.height) - LOOK_Y, boss ? C.bossDist : C.dist); }

  // look = { dx, dy } en pixels, stick = { x, y } (-1..1)
  steer(dt, look, stick, locked) {
    const M = TUNING.camera.mouse, P = TUNING.camera.pad;
    const dz = v => (Math.abs(v) < P.deadzone ? 0 : v);
    const sx = dz(stick?.x || 0), sy = dz(stick?.y || 0);
    const yawIn = (look?.dx || 0) * M.sens + sx * P.speed * dt;
    const pitchIn = ((look?.dy || 0) * M.sens + sy * P.speed * dt) * (M.invertY ? -1 : 1);
    if (!yawIn && !pitchIn) { this.idle += dt; return; }
    this.idle = 0;
    if (!locked) this.yaw -= yawIn; // verrouillage prioritaire : la souris ne tourne plus l'horizontale
    this.pitch = Math.max(M.pitchMin, Math.min(M.pitchMax, this.pitch + pitchIn));
  }

  update(dt, player, focus, moving, look, stick) {
    const C = TUNING.camera, M = C.mouse;
    this.steer(dt, look, stick, !!focus);
    const recenter = M.recenterDelay > 0 && this.idle >= M.recenterDelay;
    if (focus) {
      const want = Math.atan2(-(focus.x - player.x), -(focus.z - player.z));
      this.yaw += angDiff(this.yaw, want) * Math.min(1, dt * C.lockRate);
    } else if (moving && recenter) {
      const want = Math.atan2(-Math.cos(player.face), Math.sin(player.face));
      const d = angDiff(this.yaw, want);
      if (Math.abs(d) < 2.3) this.yaw += d * Math.min(1, dt * C.followRate);
    }
    if (recenter) this.pitch += (this.defaultPitch(this.boss) - this.pitch) * Math.min(1, dt * C.followRate);

    const f = this.forward(), R = this.radius(this.boss);
    const dist = R * Math.cos(this.pitch), h = LOOK_Y + R * Math.sin(this.pitch);
    const want = new THREE.Vector3(player.x - f.x * dist, h, player.z - f.z * dist);
    if (this.bounds) {
      const [x0, x1, z0, z1] = this.bounds;
      const wx = Math.max(x0 + 0.7, Math.min(x1 - 0.7, want.x)), wz = Math.max(z1 + 0.7, Math.min(z0 - 0.7, want.z));
      want.y += Math.min(Math.hypot(want.x - wx, want.z - wz) * 0.6, 3);
      want.x = wx; want.z = wz;
    }
    want.y = Math.max(C.minHeight, want.y);
    // souris en main : suivi plus nerveux ; sinon lissage d'origine
    const mouseDriven = !recenter && this.idle !== Infinity;
    this.pos.lerp(want, Math.min(1, dt * (mouseDriven ? M.posRate : C.posRate)));
    this.cam.position.copy(this.pos);
    if (this.shake > 0) {
      this.shake = Math.max(0, this.shake - dt);
      this.cam.position.x += (Math.random() - 0.5) * this.shake; this.cam.position.y += (Math.random() - 0.5) * this.shake;
    }
    const lookAt = new THREE.Vector3(player.x, LOOK_Y, player.z);
    if (focus) lookAt.lerp(new THREE.Vector3(focus.x, focus.lookY || LOOK_Y, focus.z), 0.4);
    this.look.lerp(lookAt, Math.min(1, dt * 10));
    this.cam.lookAt(this.look);
  }
}
