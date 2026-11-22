// Robot-cordon BlingCo (le Kalt, 2026, fiche docs/designs/physio-kalt.md) : potelet doré motorisé sur chenilles, yeux
// LED cyan ; son cordon de velours rouge (pivot `cordon_fin`, sur sa gauche) BARRE le passage (boîte de collision).
// Il n'attaque pas : il refoule (répliques TEXTS.barks.cordon). Pour passer : le tirer au gaffe-grappin ou le court-
// circuiter (il est étourdi, le cordon tombe, puis il revient à sa place), ou le casser (TUNING.cordon.hp).
// États : guard, stunned, back, die.
import * as THREE from 'three';
import { Enemy } from './Enemy.js';
import { placeholder } from '../../systems/Placeholder.js';
import { TUNING } from '../../data/tuning.js';

const C = TUNING.cordon;

export class RobotCordon extends Enemy {
  constructor(game, opts) {
    const model = game.assets.protos.robot_cordon ? 'robot_cordon' : null;
    super(game, { ...opts, r: 0.45, hp: C.hp, model, scale: C.scale });
    if (!this.obj) { this.obj = placeholder(game, 'ROBOT-CORDON', 1.2); game.renderer.scene.add(this.obj); }
    Object.assign(this, { baseScale: C.scale, isCordon: true, stunT: 0, home: { x: this.x, z: this.z }, homeFace: this.face });
    this.box = game.collision.addBox(0, 0, 0, 0, 'cordon');
    // pièces du cordon (tout ce qui dépasse loin sur la gauche du potelet) : masquées quand il tombe
    this.obj.updateMatrixWorld(true); this.cordon = [];
    this.obj.traverse(m => { if (m.isMesh && new THREE.Box3().setFromObject(m).min.z < -0.8 * C.scale) this.cordon.push(m); });
    this.states = {
      guard: { update() { this.face = this.homeFace; if (this.game.texts.barks?.cordon) this.bark('cordon'); } },
      stunned: { update() { if (this.t > this.stunT) this.setState('back'); } },
      back: { update(dt) {
        const dx = this.home.x - this.x, dz = this.home.z - this.z, d = Math.hypot(dx, dz);
        if (d < 0.1) { Object.assign(this, this.home); this.setState('guard'); return; }
        const v = Math.min(d, C.speed * dt); this.x += dx / d * v; this.z += dz / d * v;
      } },
      die: Enemy.dieState(0xffc040)
    };
    this.setState('guard');
    this.place();
  }
  get blocking() { return this.alive && this.stateName === 'guard'; }
  // gaffe-grappin (yank) et flèche court-circuit
  stun(sec) { if (!this.alive) return; this.stunT = sec; this.setState('stunned'); this.game.audio.play('ting'); }
  onShort() { this.stun(TUNING.arrowFx.short.stun); }
  onHurt() {}
  onDeath() { super.onDeath(); this.box.on = false; }
  // le cordon part sur la gauche du robot (le modèle regarde +X, le cordon va vers -Z local)
  place() {
    const lx = -Math.sin(this.face), lz = -Math.cos(this.face), L = C.len;
    const pad = 0.2, o = this.r + pad + 0.05; // la boîte commence après le potelet (sinon elle le repousserait lui-même)
    const x1 = this.x + lx * o, z1 = this.z + lz * o, x2 = this.x + lx * L, z2 = this.z + lz * L;
    Object.assign(this.box, { x0: Math.min(x1, x2) - pad, x1: Math.max(x1, x2) + pad, z0: Math.min(z1, z2) - pad, z1: Math.max(z1, z2) + pad });
    this.box.on = this.blocking;
  }
  update(dt) {
    super.update(dt);
    if (this.removed) return;
    this.place();
    for (const m of this.cordon) m.visible = this.blocking; // cordon décroché quand il est étourdi
    if (this.stateName === 'stunned') this.obj.rotation.z = Math.sin(this.time * 20) * 0.05;
  }
}
