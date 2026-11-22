// Boss du niveau 6 : Marco CeKlair (fiche docs/designs/marco-ceklair.md ; nom parodique autorisé, tout le reste inventé),
// Père Noël corporate cyborg en noir sur son traîneau tiré par 4 agents de sécurité en gilet fluo. Déplacement AU SOL et
// cohérent : l'attelage fonce vers +X du modèle, les agents courent devant, le traîneau suit.
//  - charge : il vise l'Ultra (télégraphe), puis fonce tout droit ; l'attelage blesse au contact. S'il s'encastre dans un
//    mur, il est sonné (« ENCASTRÉ ! ») : point faible. Esquiver = le faire s'encastrer.
//  - cadeaux piégés : interdiction de stade (rouge) et billet hors de prix (doré), lancés en cloche (props/Cadeau.js).
//  - sonné : piqué de Stork (storkDmg), grosse caisse de Dylagne (drumDmg) ; flèche, bretzel, écharpe : 1.
//  - slogan en boucle dans ses bulles (texte provisoire, levelTexts.slogan).
// États : intro, idle, aim, charge, brake, gifts, crash, stunned, die.
// Événements : 'marco:dazed', 'marco:recover', 'boss:phase' (n), 'boss:defeated'.
import { Enemy } from '../enemies/Enemy.js';
import { Cadeau } from '../props/Cadeau.js';
import { rng } from '../../core/Random.js';
import { TUNING } from '../../data/tuning.js';

const P = TUNING.marco;
const FRONT = 3.4; // l'attelage court devant le traîneau (m, à l'échelle P.scale)

export class MarcoCeKlair extends Enemy {
  constructor(game, opts) {
    super(game, { ...opts, r: 1.4, hp: P.hp, model: 'marco_ceklair', scale: P.scale });
    Object.assign(this, { isBoss: true, baseScale: P.scale, lookY: 2.4, hitY: 1.4, storkY: 2.2, phase: 0, cd: P.attackEvery,
      next: 'aim', sloganT: 1, sloganI: 0 });
    // les jambes des 4 agents de l'attelage (foulées alternées)
    this.legs = []; this.obj.traverse(n => { if (/^hip[NF]\d*$/.test(n.name)) this.legs.push(n); });
    this.states = {
      intro: { update() {} },
      // retour à la normale (après encastré / sonné) : 'marco:recover' (le niveau retire les coups des compagnons)
      idle: { enter() { this.game.events.emit('marco:recover', this); }, update: this.idleUpdate },
      aim: { enter() { this.game.audio.play('laser'); }, update(dt) {
        this.telegraph = true; this.faceTo(this.player.x, this.player.z, dt * 6);
        if (this.t > P.chargeAim) this.setState('charge');
      } },
      charge: { enter() { this.game.audio.play('whip'); }, update: this.chargeUpdate },
      brake: { update(dt) { this.move(P.chargeSpeed[this.phase] * Math.max(0, 1 - this.t * 2), dt); if (this.t > 0.6) this.setState('idle'); } },
      gifts: { enter() { this.shots = 0; }, update: this.giftsUpdate },
      crash: { enter() {
        this.game.bubble(this, this.game.levelTexts.crash || '', 1.2); this.game.audio.play('slam'); this.game.camera.shake = 0.7;
        this.game.particles.burst(this.x + this.fx * FRONT, 1, this.z + this.fz * FRONT, 20, 0xd8ff2a, 6);
        this.game.events.emit('marco:dazed', this);
      }, update() { if (this.t > P.dazeTime) this.setState('idle'); } },
      stunned: { enter() { this.game.audio.play('heavy'); }, update() { if (this.t > P.stun) this.setState('idle'); } },
      die: { enter() { this.inv = 99; this.game.audio.play('heavy'); this.game.events.emit('boss:defeated', this); },
        update() { this.obj.rotation.z = Math.min(1, this.t) * 0.25; if (Math.random() < 0.25) this.game.particles.burst(this.x, 1.5, this.z, 4, 0xd8ff2a, 6); } }
    };
    this.setState('intro');
  }
  get weak() { return this.stateName === 'crash' || this.stateName === 'stunned'; }
  start() { this.setState('idle'); }
  move(v, dt) { this.x += this.fx * v * dt; this.z += this.fz * v * dt; }
  // tête de l'attelage (pour le contact et les murs)
  front() { return { x: this.x + this.fx * FRONT, z: this.z + this.fz * FRONT }; }
  // il se replace doucement face à l'Ultra ; charges et cadeaux en alternance (plus de charges)
  idleUpdate(dt) {
    const p = this.player;
    this.faceTo(p.x, p.z, dt * 2);
    if (this.dist(p) > 9) this.move(P.speed, dt);
    if ((this.cd -= dt) <= 0) {
      this.cd = P.attackEvery * (0.85 + rng() * 0.3);
      this.setState(this.next); this.next = this.next === 'gifts' || rng() < 0.5 ? 'aim' : 'gifts';
    }
  }
  chargeUpdate(dt) {
    this.move(P.chargeSpeed[this.phase], dt);
    const p = this.player, f = this.front(), probe = { x: f.x, z: f.z };
    for (const c of [f, this]) {
      if (p.alive && p.inv <= 0 && Math.hypot(p.x - c.x, p.z - c.z) < 1.3 + p.r) p.takeHit(P.dmg, this.fx, this.fz, 12, this);
    }
    if (this.game.collision.resolve(probe, 0.7) || this.hitWall) return this.setState('crash');
    if (this.t > P.chargeMax) this.setState('brake');
  }
  // cadeaux piégés : le premier sur l'Ultra, les autres autour ; interdiction et billet en alternance
  giftsUpdate(dt) {
    const p = this.player, n = P.gifts[this.phase];
    this.faceTo(p.x, p.z, dt * 3);
    if (this.shots < n && this.t > 0.3 + this.shots * P.giftGap) {
      const a = rng() * Math.PI * 2, r = this.shots ? P.giftSpread * (0.3 + rng() * 0.7) : 0;
      this.game.add(new Cadeau(this.game, { x: this.x, z: this.z, tx: p.x + Math.cos(a) * r, tz: p.z + Math.sin(a) * r,
        kind: this.shots % 2 ? 'billet' : 'interdiction', time: P.giftTime, r: P.giftR, life: P.giftLife, dmg: P.dmg }));
      this.shots++; this.game.audio.play('throw');
    }
    if (this.shots >= n && this.t > 0.3 + n * P.giftGap + 0.5) this.setState('idle');
  }
  // compagnons, quand il est sonné
  takeStork() { this.bigHit(P.storkDmg, 0xf4f6ff); }
  takeDrum() { this.bigHit(P.drumDmg, 0xffc040); }
  bigHit(dmg, color) {
    if (!this.alive || !this.weak) return;
    this.hp -= dmg; this.flash = 0.2; this.game.hitstop = 0.08; this.game.camera.shake = 0.5;
    this.game.particles.burst(this.x, 1.5, this.z, 24, color, 7);
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
  // l'Ultra est mort : il recule au fond de l'estrade et reprend
  reset(x, z) { Object.assign(this, { x, z, cd: P.attackEvery }); this.setState('idle'); }
  onHurt() {}
  onDeath() { this.setState('die'); }
  update(dt) {
    super.update(dt);
    const st = this.stateName, run = st === 'charge' ? 16 : st === 'idle' || st === 'brake' ? 7 : 0;
    this.legs.forEach((l, i) => { l.rotation.z = run ? Math.sin(this.time * run + (i % 2) * Math.PI + (i >> 1)) * 0.6 : 0; });
    this.game.stars(this.weak ? this : null);
    const J = this.obj.userData.J;
    if (J.santa) J.santa.rotation.z = st === 'gifts' ? Math.sin(this.time * 12) * 0.15 : 0;
    // le slogan en boucle (« lavage de cerveau »)
    if (this.alive && st !== 'intro' && (this.sloganT -= dt) <= 0) {
      const s = this.game.levelTexts.slogan || [];
      this.sloganT = P.sloganEvery; if (s.length) this.game.bubble(this, s[this.sloganI++ % s.length], 1.6);
    }
  }
}
