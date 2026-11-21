// Le Consultant : fonce sur l'Ultra, prépare une gifle à la holo-tablette, puis se fend.
import { Enemy } from './Enemy.js';
import { pose, walkPose, walkBob } from '../../systems/Animator.js';
import { TUNING } from '../../data/tuning.js';

const C = TUNING.consultant;

export class Consultant extends Enemy {
  constructor(game, opts) {
    super(game, { ...opts, r: C.radius, hp: C.hp, model: 'consultant', scale: 1.05 });
    this.baseScale = 1.05;
    this.states = {
      wait: { update() { if (this.t > 0.5 + Math.random() * 0.5) this.setState('chase'); } },
      chase: { update: this.chaseUpdate },
      windup: { update(dt) { this.telegraph = true; this.faceTo(this.player.x, this.player.z, dt * 8); if (this.t > C.windup) this.setState('lunge'); } },
      lunge: {
        enter() { this.hitDone = false; },
        update(dt) {
          this.x += this.fx * C.lunge * dt; this.z += this.fz * C.lunge * dt;
          if (!this.hitDone && this.dist(this.player) < this.r + this.player.r + 0.5) {
            this.hitDone = true; this.player.takeHit(C.dmg, this.fx, this.fz, 9, this);
          }
          if (this.t > C.lungeTime) this.setState('recover');
        }
      },
      recover: { update() { if (this.t > C.recover) this.setState('chase'); } },
      hurt: { update() { if (this.t > 0.35) this.setState('chase'); } },
      die: Enemy.dieState(0x38f2ff)
    };
    this.setState('wait');
  }
  chaseUpdate(dt) {
    const p = this.player, d = this.dist(p);
    this.faceTo(p.x, p.z, dt * 6);
    if (d > C.reach) { this.x += this.fx * C.speed * dt; this.z += this.fz * C.speed * dt; this.walkT += dt * 11; }
    else if (this.t > 0.4) this.setState('windup');
    this.separate(dt);
    this.bark('consultant');
  }
  update(dt) {
    super.update(dt);
    if (this.removed) return;
    const s = this.stateName, o = this.obj;
    if (s === 'chase') pose(o, walkPose(this.walkT, { shN: 50, elN: 70 }), walkBob(this.walkT));
    else if (s === 'windup') pose(o, { shN: 170, elN: 30, shF: -30, torso: -12, hipF: -15 });
    else if (s === 'lunge') pose(o, { shN: 80, elN: 0, torso: 30, hipN: 40, hipF: -40, kneeF: -20 });
    else if (s === 'hurt') pose(o, { torso: -30, head: -25, shN: -40, shF: -40 });
    else if (s !== 'die') pose(o, { shN: 50, elN: 70, head: Math.sin(this.time * 2) * 10 }); // consulte sa tablette
  }
}
