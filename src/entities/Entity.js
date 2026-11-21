// Base des entités : position, orientation, vie, recul, machine à états explicite.
// Une sous-classe déclare `this.states = { nom: { enter(), update(dt), exit() } }`.
import { tint } from '../systems/Animator.js';

export const faceOf = (dx, dz) => Math.atan2(-dz, dx);
export const angDiff = (a, b) => { let d = b - a; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; return d; };

export class Entity {
  constructor(game, { x = 0, z = 0, face = 0, r = 0.6, hp = 1, model = null, scale = 1 } = {}) {
    this.game = game; this.x = x; this.z = z; this.face = face; this.r = r;
    this.hp = hp; this.maxHp = hp; this.alive = true; this.removed = false;
    this.vx = 0; this.vz = 0; this.inv = 0; this.flash = 0; this.t = 0; this.time = 0;
    this.states = {}; this.stateName = null; this.telegraph = false;
    if (model) { this.obj = game.assets.instance(model); this.obj.scale.setScalar(scale); game.renderer.scene.add(this.obj); }
  }
  get fx() { return Math.cos(this.face); }
  get fz() { return -Math.sin(this.face); }
  setState(name) {
    this.states[this.stateName]?.exit?.call(this);
    this.stateName = name; this.t = 0;
    this.states[name]?.enter?.call(this);
  }
  faceTo(x, z, rate = 0) {
    const want = faceOf(x - this.x, z - this.z);
    this.face = rate ? this.face + angDiff(this.face, want) * Math.min(1, rate) : want;
  }
  dist(o) { return Math.hypot(o.x - this.x, o.z - this.z); }

  // appelé par Combat ; les sous-classes peuvent bloquer (bouclier) en surchargeant
  takeHit(dmg, nx, nz, knock, from) {
    this.hp -= dmg; this.flash = 0.15;
    this.vx = nx * knock; this.vz = nz * knock;
    this.game.events.emit('hit', this, from);
    if (this.hp <= 0) { this.alive = false; this.onDeath(); }
    else this.onHurt?.();
  }
  onDeath() {}

  update(dt) {
    this.t += dt; this.time += dt;
    this.inv = Math.max(0, this.inv - dt); this.flash = Math.max(0, this.flash - dt);
    this.telegraph = false;
    this.states[this.stateName]?.update?.call(this, dt);
    // recul amorti
    this.x += this.vx * dt; this.z += this.vz * dt;
    const k = Math.pow(0.002, dt); this.vx *= k; this.vz *= k;
    this.hitWall = this.game.collision.resolve(this, this.r);
    this.sync();
  }
  sync() {
    if (!this.obj) return;
    this.obj.position.set(this.x, 0, this.z); this.obj.rotation.y = this.face;
    const flashOn = this.flash > 0, tele = this.telegraph;
    if (flashOn || tele || this._tinted) {
      tint(this.obj, flashOn ? 0xffffff : 0xff2040, flashOn ? 0.9 : (tele ? 0.45 + 0.35 * Math.sin(this.time * 30) : 0));
      this._tinted = flashOn || tele;
    }
  }
  remove() { this.removed = true; if (this.obj) this.game.renderer.scene.remove(this.obj); }
}
