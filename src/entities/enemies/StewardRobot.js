// Robot-Steward BlingCo (Meinau 2026, fiche docs/designs/steward-robot.md) : sbire du kit générique, robot
// (la flèche court-circuit l'étourdit). Gag validé : il scanne tout, même les pigeons ; pendant un scan il ne voit
// plus rien (ouverture pour le frapper) et son rayon rouge balaie. Pivots en plus : scanner_gun, scanner.
import { Sbire } from './Sbire.js';
import { pose } from '../../systems/Animator.js';
import { rng } from '../../core/Random.js';

export class StewardRobot extends Sbire {
  constructor(game, opts) {
    super(game, { ...opts, kind: 'steward', model: 'steward_robot', label: 'STEWARD' });
    this.scanCd = this.S.scanEvery * (0.5 + rng());
    this.gun = this.obj.userData.J.scanner_gun;
    this.states.scan = {
      enter() { this.game.bubble(this, this.game.texts.barks.steward[1], 1.2); },
      update(dt) { this.blind(0.1); if (this.t > this.S.scanTime) this.setState('patrol'); }
    };
  }
  patrolUpdate(dt) {
    if ((this.scanCd -= dt) <= 0 && !this.sees()) { this.scanCd = this.S.scanEvery * (0.7 + rng() * 0.6); return this.setState('scan'); }
    super.patrolUpdate(dt);
  }
  update(dt) {
    super.update(dt);
    if (this.removed) return;
    if (this.stateName === 'scan') {
      pose(this.obj, { shN: 70 + Math.sin(this.time * 6) * 25, elN: 30, head: Math.sin(this.time * 4) * 15 });
      if (this.gun) this.gun.rotation.y = Math.sin(this.time * 6) * 0.6; // le rayon balaie
    }
  }
}
