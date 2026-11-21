// Boss du niveau 1 : l'ASR-67, Androïde de Service Restauration. Sa toque bloque tout de face ;
// son TPE dans le dos, touché au bretzel → « PAIEMENT REFUSÉ », étourdi : il prend alors l'écharpe.
// Phase 1 : tickets d'addition en éventail + plats brûlants au sol.
// Phase 2 : charges avec son chariot (étourdi s'il percute un pilier-fourneau) + 2 serveurs en renfort.
// Phase 3 : le four souffle des flammes tournantes (gérées par le script), il continue de charger.
import { PhasedBoss } from './PhasedBoss.js';
import { Projectile } from '../props/Projectile.js';
import { Hazard } from '../props/Hazard.js';
import { pose, walkPose, walkBob } from '../../systems/Animator.js';
import { TUNING } from '../../data/tuning.js';
import { rng } from '../../core/Random.js';

const A = TUNING.asr;

export class Asr67 extends PhasedBoss {
  constructor(game, opts) {
    const T = game.levelTexts.asr;
    super(game, { ...opts, r: A.radius, hp: A.hp, model: 'asr' }, { thresholds: A.phases, shieldText: T.shield });
    this.baseScale = 1; this.lookY = 2.6; this.cd = A.attackEvery; this.T = T;
    this.tpe = this.obj.userData.J.tpe; this.whisk = this.obj.userData.J.whisk;
    this.states = {
      intro: { update() {} },
      walk: { update: this.walkUpdate },
      tickets: {
        enter() { this.shots = 0; },
        update(dt) {
          this.telegraph = this.t < A.ticketWindup; this.faceTo(this.player.x, this.player.z, dt * 3);
          if (this.t > A.ticketWindup && !this.shots) { this.fan(); this.shots = 1; }
          if (this.t > A.ticketWindup + 0.6) this.setState('walk');
        }
      },
      plates: { // il pose ses plats brûlants sans bouger : c'est le moment de le contourner
        enter() { this.platesLeft = A.plates; this.gap = 0; },
        update(dt) {
          this.telegraph = true; this.gap -= dt;
          if (this.gap <= 0 && this.platesLeft > 0) { this.dropPlate(); this.platesLeft--; this.gap = A.plateGap; }
          if (this.t > A.plates * A.plateGap + 0.8) this.setState('walk');
        }
      },
      chargeWindup: { update(dt) { this.telegraph = true; this.faceTo(this.player.x, this.player.z, dt * 6); if (this.t > A.chargeWindup) this.setState('charge'); } },
      charge: {
        update(dt) {
          if (this.t > 0.1 && this.hitWall) return this.setState(this.nearPillar() ? 'stunned' : 'recover');
          this.x += this.fx * A.chargeSpeed * dt; this.z += this.fz * A.chargeSpeed * dt;
          if (this.dist(this.player) < this.r + this.player.r + 0.3) this.player.takeHit(A.dmg, this.fx, this.fz, 14, this);
          if (this.t > A.chargeTime) this.setState('recover');
        }
      },
      recover: { update() { if (this.t > A.recover) this.setState('walk'); } },
      stunned: {
        enter() { this.game.audio.play('slam'); this.game.camera.shake = 0.4; },
        update() { if (this.t > A.stunned) this.setState('walk'); }
      },
      hurt: { update() { if (this.t > 0.25) this.setState('walk'); } },
      die: {
        enter() { this.inv = 99; this.game.audio.play('heavy'); this.game.bubble(this, this.T.defeat[0].txt, 4); },
        update() {
          this.obj.userData.model.rotation.z = -Math.min(1, this.t) * 1.4;
          if (Math.random() < 0.25) this.game.particles.burst(this.x + (Math.random() - 0.5) * 2, 1.5, this.z + (Math.random() - 0.5) * 2, 4, 0xff5a1a, 6);
        }
      }
    };
    this.setState('intro');
  }
  // toque devant, TPE derrière : seul le bretzel dans le dos l'étourdit ; étourdi, il encaisse tout
  react(side, from) {
    if (this.stateName === 'stunned') return 'hit';
    if (side === 'back' && from?.isPlayerShot) return 'weak';
    return 'block';
  }
  onWeak() {
    this.game.bubble(this, this.T.refused, 1.6); this.game.audio.play('hurt');
    this.game.particles.burst(this.x - this.fx * 0.8, 2, this.z - this.fz * 0.8, 14, 0xff2e88, 5);
    this.setState('stunned');
  }
  onPhase(n) {
    this.game.bubble(this, n === 1 ? this.T.phase2 : this.T.phase3, 3);
    this.setState('walk');
  }
  nearPillar() {
    return (this.game.level.layout.pillars || []).some(p => Math.hypot(p.x - this.x, p.z - this.z) < this.r + A.pillarReach);
  }
  walkUpdate(dt) {
    const p = this.player, d = this.dist(p);
    this.faceTo(p.x, p.z, dt * A.turn);
    if (d > 3) { this.x += this.fx * A.speed * dt; this.z += this.fz * A.speed * dt; this.walkT += dt * 6; }
    this.bark('asr');
    this.cd -= dt;
    if (this.cd > 0 || this.t < 0.6) return;
    this.cd = A.attackEvery;
    // choix de l'attaque selon la phase
    const r = rng();
    if (this.phase === 0) return this.setState(r < 0.5 ? 'tickets' : 'plates');
    if (r < 0.5) return this.setState('chargeWindup');
    return this.setState(this.phase === 1 ? 'tickets' : (r < 0.75 ? 'plates' : 'tickets'));
  }
  fan() {
    this.game.audio.play('throw');
    for (let i = 0; i < A.tickets; i++) {
      const spread = (i - (A.tickets - 1) / 2) * A.ticketSpread;
      this.game.add(new Projectile(this.game, { x: this.x + this.fx * 1.2, z: this.z + this.fz * 1.2, face: this.face + spread,
        speed: A.ticketSpeed, dmg: A.dmg, shape: 'ticket', y: 1.4, spin: 20 }));
    }
  }
  dropPlate() {
    const p = this.player, j = A.plateJitter;
    const x = p.x + (rng() - 0.5) * j, z = p.z + (rng() - 0.5) * j;
    this.game.add(new Hazard(this.game, { x, z, r: A.plateRadius, warn: A.plateWarn, life: A.plateLife, dmg: A.dmg }));
  }
  update(dt) {
    super.update(dt);
    const s = this.stateName, o = this.obj;
    if (this.whisk) this.whisk.rotation.x += dt * (s === 'walk' ? 8 : 2);
    if (this.tpe) this.tpe.scale.setScalar(s === 'stunned' ? 1 + 0.15 * Math.sin(this.time * 20) : 1);
    if (s === 'walk') pose(o, walkPose(this.walkT, { shN: 40, elN: 60, shF: 30, elF: 50 }, 20), walkBob(this.walkT));
    else if (s === 'tickets') pose(o, { shN: 150 - Math.min(1, this.t * 2) * 70, elN: 10, shF: 30, torso: 8 });
    else if (s === 'plates') pose(o, { shN: 90, elN: 30, shF: 90, elF: 30, torso: 15, head: 10 });
    else if (s === 'chargeWindup') pose(o, { shN: 60, shF: 60, elN: 70, elF: 70, torso: 25, hipN: 30, kneeN: -40 });
    else if (s === 'charge') pose(o, { shN: 80, shF: 80, torso: 35, hipN: 40, hipF: -30, kneeF: -30 });
    else if (s === 'stunned') pose(o, { shF: 30, shN: -20, torso: 35, head: 35 + Math.sin(this.time * 8) * 10, kneeN: -25, kneeF: -25 }, -0.12);
    else if (s === 'hurt') pose(o, { torso: -20, head: -20, shN: -20 });
    else if (s !== 'die') pose(o, { shN: 40, elN: 60, head: Math.sin(this.time) * 6 });
    this.game.stars(s === 'stunned' ? this : null);
  }
}
