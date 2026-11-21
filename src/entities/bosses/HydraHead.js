// Tête de l'hydre d'Egboehly (pilotée par Egboehly.js) : suit le pivot head_club de son cou. États : idle (balance),
// aim (télégraphe, vise l'Ultra), bite (le cou plonge vers l'Ultra), recover, down (assommée au sol : repousse après
// TUNING.egboehly.regrow s, sauf si une flèche-bannière y est plantée → planted, définitif). Verrouillable (ennemi).
import * as THREE from 'three';
import { Entity } from '../Entity.js';
import { TUNING } from '../../data/tuning.js';

const E = TUNING.egboehly, V = new THREE.Vector3();

export class HydraHead extends Entity {
  constructor(game, { boss, neck, head, index }) {
    super(game, { x: boss.x, z: boss.z, r: E.headRadius, hp: E.headHp });
    Object.assign(this, { boss, neck, head, index, isEnemy: true, isHydraHead: true, hitY: 0, hitH: 5, lean: 0, z0: neck.rotation.z });
    this.flag = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 1), new THREE.MeshLambertMaterial({ color: 0x1f5fd0, side: THREE.DoubleSide }));
    this.flag.position.set(0, 0.8, 0); this.flag.visible = false; head.add(this.flag);
    this.state = 'idle'; this.st = 0;
  }
  get active() { return this.state !== 'down' && this.state !== 'planted'; }
  get hookable() { return this.state === 'down'; } // on plante une bannière dans une tête à terre
  go(s) { this.state = s; this.st = 0; }
  bite() { if (this.state === 'idle') this.go('aim'); }
  takeHit(dmg) {
    if (!this.active || !this.boss.alive) return;
    this.hp -= dmg; this.flash = 0.15; this.game.audio.play('hit');
    if (this.hp <= 0) { this.go('down'); this.game.bubble(this, this.game.levelTexts.headDown, 1.2); this.game.events.emit('egboehly:head', this.index, 'down'); }
  }
  hook() {
    if (this.state !== 'down') return;
    this.go('planted'); this.flag.visible = true; this.game.audio.play('win');
    this.game.bubble(this, this.game.levelTexts.planted, 1.5);
    this.game.events.emit('egboehly:head', this.index, 'planted');
  }
  update(dt) {
    this.time += dt; this.st += dt; this.flash = Math.max(0, this.flash - dt);
    const p = this.game.player;
    let want = Math.sin(this.time * 1.3 + this.index) * 0.08; // balance au repos
    if (this.state === 'aim') { want = -0.25; this.telegraph = true; if (this.st > E.aimTime) this.go('bite'); }
    else this.telegraph = false;
    if (this.state === 'bite') {
      want = 0.55;
      if (this.st > E.biteTime * 0.5 && !this.hitDone && Math.hypot(p.x - this.x, p.z - this.z) < 1.4 + p.r) {
        this.hitDone = true; p.takeHit(E.dmg, Math.sign(p.x - this.x) || 1, Math.sign(p.z - this.z), 10, this);
      }
      if (this.st > E.biteTime) { this.go('recover'); this.hitDone = false; }
    }
    if (this.state === 'recover') { want = 0.3; if (this.st > E.recover) this.go('idle'); }
    if (this.state === 'down') { want = 0.75; if (this.st > E.regrow) { this.hp = E.headHp; this.go('idle'); this.game.events.emit('egboehly:head', this.index, 'up'); } }
    if (this.state === 'planted') want = 0.8;
    this.lean += (want - this.lean) * Math.min(1, dt * (this.state === 'bite' ? 14 : 4));
    this.neck.rotation.z = this.z0 - this.lean;
    this.head.getWorldPosition(V); this.x = V.x; this.z = V.z; this.y = V.y - 0.6;
    this.head.traverse(m => { if (m.isMesh && m.material.emissive && m !== this.flag) { m.material.emissive.setHex(this.flash > 0 ? 0xffffff : this.telegraph ? 0xff2040 : 0); m.material.emissiveIntensity = this.flash > 0 ? 0.9 : 0.5; } });
  }
}
