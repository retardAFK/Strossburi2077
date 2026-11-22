// Boss du niveau 4 : le Gérant de nuit BlingCo (fiche docs/designs/marche2000.md, robot inventé) derrière sa caisse.
// Il glisse le long de son comptoir, mitraille d'étiquettes « x10 » (étiqueteuse), balaie la boutique de son scanner
// rouge (se cacher derrière une palette, ou dans la fumée), puis « encaisse » : son tiroir-caisse s'ouvre, c'est le
// point faible. Le piqué de Stork (StorkAllie) y fait TUNING.gerant.storkDmg et l'étourdit ; une flèche, le bretzel ou
// l'écharpe y font 1. Ailleurs, ça rebondit (« ting »). Phases aux seuils de PV : plus d'étiquettes, scanner plus rapide.
// États : intro, glide, label, scan, open, stunned, die. Événements : 'gerant:open', 'gerant:close', 'boss:phase' (n),
// 'boss:defeated'.
import { Enemy } from '../enemies/Enemy.js';
import { Projectile } from '../props/Projectile.js';
import { spots } from '../../systems/Stealth.js';
import { beamMesh } from '../../systems/Beam.js';
import { rng } from '../../core/Random.js';
import { TUNING } from '../../data/tuning.js';

const P = TUNING.gerant;

export class GerantNuit extends Enemy {
  constructor(game, opts) {
    super(game, { ...opts, r: 1.4, hp: P.hp, model: 'gerant_nuit', scale: P.scale });
    Object.assign(this, { isBoss: true, baseScale: P.scale, lookY: 2.6, hitY: 0.6, storkY: 0.6, phase: 0, cd: P.attackEvery, next: 'label' });
    this.home = { x: this.x, z: this.z };
    const J = this.obj.userData.J;
    this.tiroir0 = J.tiroir ? J.tiroir.position.x : 0;
    this.beam = beamMesh(P.scanRange / P.scale, P.scanCos, 0xff1a3c, 0.3); this.beam.visible = false; this.obj.add(this.beam);
    this.states = {
      intro: { update() {} },
      glide: { update: this.glideUpdate },
      label: { enter() { this.telegraph = true; this.shots = 0; this.game.audio.play('laser'); }, update: this.labelUpdate },
      scan: { enter() { this.beam.visible = true; this.scanFace = this.face; this.game.audio.play('laser'); }, update: this.scanUpdate,
        exit() { this.beam.visible = false; } },
      open: {
        enter() { this.game.bubble(this, this.game.levelTexts.gerantOpen, 1.2); this.game.audio.play('pickup'); this.game.events.emit('gerant:open', this); },
        update() { if (this.t > P.openTime) this.setState('glide'); },
        exit() { this.game.events.emit('gerant:close', this); }
      },
      stunned: { enter() { this.game.audio.play('heavy'); }, update() { if (this.t > P.stun) this.setState('glide'); },
        exit() { this.game.events.emit('gerant:close', this); } },
      die: { enter() { this.inv = 99; this.beam.visible = false; this.game.audio.play('heavy'); this.game.events.emit('boss:defeated', this); },
        update() { this.obj.rotation.z = -Math.min(1, this.t) * 0.4; if (rng() < 0.2) this.game.particles.burst(this.x, 2, this.z, 4, 0xa98bff, 6); } }
    };
    this.setState('intro');
  }
  get weak() { return this.stateName === 'open' || this.stateName === 'stunned'; }
  start() { this.setState('glide'); }
  // il glisse derrière son comptoir, face à l'Ultra ; label et scan en alternance (un scan finit toujours par « encaisser »)
  glideUpdate(dt) {
    const p = this.player;
    this.faceTo(p.x, p.z, dt * 3);
    const want = this.home.x + Math.max(-P.glideRange, Math.min(P.glideRange, p.x - this.home.x));
    this.x += Math.sign(want - this.x) * Math.min(Math.abs(want - this.x), P.speed * dt); this.z = this.home.z;
    if ((this.cd -= dt) <= 0) {
      this.cd = P.attackEvery * (0.85 + rng() * 0.3);
      this.setState(this.next); this.next = this.next === 'label' ? 'scan' : 'label';
    }
  }
  // étiqueteuse : rafale d'étiquettes « x10 » en éventail
  labelUpdate(dt) {
    const p = this.player, n = P.labels[this.phase];
    this.faceTo(p.x, p.z, dt * 4);
    if (this.t < P.labelAim) { this.telegraph = true; return; }
    if (this.shots < n && this.t > P.labelAim + this.shots * P.labelGap) {
      const a = this.face + (this.shots - (n - 1) / 2) * P.labelSpread;
      this.game.add(new Projectile(this.game, { x: this.x + Math.cos(a) * P.labelFrom, z: this.z - Math.sin(a) * P.labelFrom, face: a,
        speed: P.labelSpeed, dmg: P.dmg, shape: 'etiquette', y: 1.4, spin: 0, r: 0.35 }));
      this.shots++; this.game.audio.play('throw');
    }
    if (this.shots >= n && this.t > P.labelAim + n * P.labelGap + 0.4) this.setState('glide');
  }
  // scanner : le rayon rouge balaie d'un bord à l'autre ; les palettes et la fumée protègent
  scanUpdate(dt) {
    const dur = P.scanTime[this.phase], k = Math.min(1, this.t / dur), off = -P.scanArc + 2 * P.scanArc * k;
    this.face = this.scanFace; this.beam.rotation.y = off;
    if (this.t > 0.3 && spots(this.game, this, this.face + off, { range: P.scanRange, cos: P.scanCos })) {
      const p = this.player;
      if (p.inv <= 0) { p.takeHit(P.dmg, p.x - this.x, p.z - this.z, 6, this); this.game.bubble(p, this.game.texts.barks.vigile?.[0] || '', 1); }
    }
    if (k >= 1) this.setState('open');
  }
  // piqué de Stork sur le tiroir ouvert
  takeStork() {
    if (!this.alive || !this.weak) return;
    this.hp -= P.storkDmg; this.flash = 0.2; this.game.hitstop = 0.08; this.game.camera.shake = 0.5;
    this.game.particles.burst(this.x, 1, this.z, 24, 0xffc040, 7); // billets
    this.afterHit();
    if (this.alive) this.setState('stunned');
  }
  takeHit(dmg, nx, nz, knock, from) {
    if (!this.weak) { this.game.audio.play('ting'); this.game.bubble(this, this.game.texts.shield, 0.6); return; }
    super.takeHit(Math.min(dmg, 1), nx, nz, 0, from);
    this.afterHit();
  }
  afterHit() {
    const r = Math.max(0, this.hp) / this.maxHp;
    this.game.hud.setBoss(r);
    if (this.hp <= 0 && this.alive) { this.alive = false; return this.setState('die'); }
    const ph = P.phases.filter(t => r <= t).length;
    if (ph > this.phase) { this.phase = ph; this.game.events.emit('boss:phase', ph, this); }
  }
  onHurt() {}
  onDeath() { this.setState('die'); }
  update(dt) {
    super.update(dt);
    const st = this.stateName, J = this.obj.userData.J;
    this.game.stars(st === 'stunned' ? this : null);
    if (J.tiroir) J.tiroir.position.x += ((this.weak ? this.tiroir0 + 0.45 : this.tiroir0) - J.tiroir.position.x) * Math.min(1, dt * 10);
    if (J.etiqueteuse) J.etiqueteuse.rotation.z = st === 'label' ? -0.4 + Math.sin(this.time * 20) * 0.1 : Math.sin(this.time * 2) * 0.1;
    if (J.scanner) J.scanner.rotation.y = st === 'scan' ? this.beam.rotation.y : 0;
    if (J.head) J.head.rotation.z = st === 'stunned' ? Math.sin(this.time * 8) * 0.2 : 0;
  }
}
