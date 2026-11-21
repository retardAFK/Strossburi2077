// Boss à phases (générique) : la phase dépend des PV restants (seuils décroissants, ex. [0.66, 0.33]).
// Chaque coup passe par react(côté, source) → 'block' (protégé), 'weak' (point faible) ou 'hit' (dégâts).
// Émet 'boss:phase' (n, boss) et 'boss:defeated' (boss). Les sous-classes déclarent leurs états
// (dont 'stunned' et 'hurt') et peuvent surcharger onPhase(n), onWeak(source), onBlock(source).
import { Enemy } from '../enemies/Enemy.js';

export class PhasedBoss extends Enemy {
  constructor(game, opts, { thresholds, guard = 0.35, shieldText = '' }) {
    super(game, opts);
    this.isBoss = true; this.thresholds = thresholds; this.guard = guard; this.shieldText = shieldText; this.phase = 0;
  }
  get ratio() { return Math.max(0, this.hp / this.maxHp); }
  // d'où vient le coup, vu du boss : 'front', 'back' ou 'side'
  sideOf(nx, nz) { const d = -(nx * this.fx + nz * this.fz); return d > this.guard ? 'front' : (d < -this.guard ? 'back' : 'side'); }
  react() { return 'hit'; }
  onBlock(from) {
    this.game.audio.play('ting');
    if (this.shieldText) this.game.bubble(this, this.shieldText, 0.8);
    this.game.particles.burst(this.x + this.fx * 1.2, 2, this.z + this.fz * 1.2, 6, 0xffffff, 4);
    if (from === this.player) { from.vx = this.fx * 8; from.vz = this.fz * 8; } // repousse l'Ultra devant lui
  }
  takeHit(dmg, nx, nz, knock, from) {
    if (this.stateName === 'die' || this.stateName === 'intro') return;
    const r = this.react(this.sideOf(nx, nz), from);
    if (r === 'block') return this.onBlock(from);
    if (r === 'weak') return this.onWeak?.(from);
    super.takeHit(dmg, nx, nz, knock * 0.15, from);
    this.game.hud.setBoss(this.ratio);
    let ph = 0; for (const t of this.thresholds) if (this.ratio <= t) ph++;
    if (ph > this.phase && this.alive) { this.phase = ph; this.onPhase?.(ph); this.game.events.emit('boss:phase', ph, this); }
  }
  onHurt() { if (this.stateName !== 'stunned' && this.states.hurt) this.setState('hurt'); }
  onDeath() { this.setState('die'); this.game.events.emit('enemy:killed', this); this.game.events.emit('boss:defeated', this); }
}
