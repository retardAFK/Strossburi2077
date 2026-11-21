// L'Androïde Sommelier : garde ses distances comme le Juriste et tire des bouchons en rafale.
// Pivot 'bottle' = la bouteille-canon.
import { Enemy } from './Enemy.js';
import { Projectile } from '../props/Projectile.js';
import { pose, walkPose, walkBob } from '../../systems/Animator.js';
import { TUNING } from '../../data/tuning.js';
import { rng } from '../../core/Random.js';

const S = TUNING.sommelier;

export class Sommelier extends Enemy {
  constructor(game, opts) {
    super(game, { ...opts, r: S.radius, hp: S.hp, model: 'sommelier' });
    this.baseScale = 1; this.cd = 1 + rng(); this.strafe = rng() < 0.5 ? 1 : -1;
    this.states = {
      wait: { update() { if (this.t > 0.6) this.setState('keep'); } },
      keep: { update: this.keepUpdate },
      windup: { update(dt) { this.telegraph = true; this.faceTo(this.player.x, this.player.z, dt * 8); if (this.t > S.windup) this.setState('fire'); } },
      fire: {
        enter() { this.shots = 0; this.gap = 0; },
        update(dt) {
          this.faceTo(this.player.x, this.player.z, dt * 6);
          this.gap -= dt;
          if (this.gap <= 0 && this.shots < S.burst) { this.shoot(); this.shots++; this.gap = S.burstGap; }
          if (this.shots >= S.burst && this.gap <= 0) this.setState('keep');
        }
      },
      hurt: { update() { if (this.t > 0.35) this.setState('keep'); } },
      die: Enemy.dieState(0x6a1030)
    };
    this.setState('wait');
  }
  keepUpdate(dt) {
    const p = this.player, d = this.dist(p);
    this.faceTo(p.x, p.z, dt * 6);
    // recule si trop près, avance si trop loin, tourne autour sinon
    const want = d < S.keepDist - 1.5 ? -1 : (d > S.keepDist + 2 ? 1 : 0);
    const sx = -this.fz * this.strafe, sz = this.fx * this.strafe;
    this.x += (this.fx * want * S.speed + sx * S.speed * 0.5) * dt;
    this.z += (this.fz * want * S.speed + sz * S.speed * 0.5) * dt;
    this.walkT += dt * 8;
    if (this.hitWall) this.strafe *= -1;
    this.separate(dt);
    this.cd -= dt;
    if (this.cd <= 0 && d < S.fireRange) { this.cd = S.fireEvery + rng(); this.setState('windup'); }
    this.bark('sommelier');
  }
  shoot() {
    this.game.audio.play('throw');
    this.game.add(new Projectile(this.game, { x: this.x + this.fx * 0.8, z: this.z + this.fz * 0.8, face: this.face,
      speed: S.corkSpeed, dmg: S.dmg, shape: 'bouchon', y: 1.0, spin: 30, r: 0.25 }));
  }
  update(dt) {
    super.update(dt);
    if (this.removed) return;
    const s = this.stateName, o = this.obj;
    if (s === 'keep') pose(o, walkPose(this.walkT, { shN: 40, elN: 70 }, 25), walkBob(this.walkT));
    else if (s === 'windup' || s === 'fire') pose(o, { shN: 90, elN: 5, torso: -8, head: -5 }); // bouteille pointée
    else if (s === 'hurt') pose(o, { torso: -30, head: -25, shN: -40, shF: -40 });
    else if (s !== 'die') pose(o, { shN: 40, elN: 70 });
  }
}
