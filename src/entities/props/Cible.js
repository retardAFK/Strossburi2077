// Cible-TPE (générique) : ne réagit qu'au bretzel-boomerang (« anti-écharpe »). Son anneau prend la couleur
// de sa clé ; touchée, son écran s'allume et elle émet 'target:hit' (elle-même). Une énigme (OrderedSequence)
// décide si c'était la bonne ; 'target:reset:<g>' l'éteint, 'target:lock:<g>' la laisse allumée.
import { Entity } from '../Entity.js';
import { TUNING } from '../../data/tuning.js';

const C = TUNING.targets;

export class Cible extends Entity {
  constructor(game, { group, key, x, z, rotY = 0, model = 'pf_cible_tpe' }) {
    super(game, { x, z, r: 0.5, hp: 1, model });
    this.group = group; this.key = key; this.face = rotY; this.isTarget = true; this.lit = false; this.done = false;
    this.color = C.colors[key];
    const J = this.obj.userData.J; this.head = J.target; this.spin = 0;
    // anneau rouge du modèle → couleur de la cible ; écran → témoin
    this.obj.traverse(m => {
      if (!m.isMesh) return;
      if (m.name.startsWith('screen')) this.screen = m;
      else if (m.material.color.r > 0.8 && m.material.color.g < 0.1) m.material.color.setHex(this.color);
    });
    game.collision.addCircle(x, z, 0.45, 'target');
    game.events.on('target:reset:' + group, () => this.setLit(false));
    game.events.on('target:lock:' + group, () => { this.done = true; this.hinted = false; this.setLit(true); });
    // indice : la prochaine cible à toucher clignote (clé, ou null pour arrêter)
    game.events.on('target:hint:' + group, key => { this.hinted = key === this.key && !this.done; if (!this.hinted && !this.lit) this.setLit(false); });
    this.sync(); this.setLit(false);
  }
  setLit(on) {
    this.lit = on;
    const m = this.screen?.material; if (!m) return;
    m.color.setHex(on ? this.color : 0x301020); m.emissive.setHex(on ? this.color : 0x000000); m.emissiveIntensity = on ? 1 : 0;
  }
  takeHit(dmg, nx, nz, knock, from) {
    if (!from?.isPlayerShot) { // l'écharpe rebondit
      this.game.audio.play('ting'); this.game.bubble(this, this.game.levelTexts.antiEcharpe, 0.8); return;
    }
    if (this.done) return;
    this.setLit(true); this.spin = Math.PI * 2;
    this.game.audio.play('hit'); this.game.particles.burst(this.x, 1.6, this.z, 12, this.color, 4);
    this.game.events.emit('target:hit', this);
  }
  update(dt) {
    this.time += dt;
    if (this.head && this.spin > 0) { const d = Math.min(this.spin, dt * 10); this.spin -= d; this.head.rotation.y += d; }
    if (this.hinted && !this.lit) { // clignotement de l'indice, sans compter comme « allumée »
      const m = this.screen?.material, on = Math.sin(this.time * 10) > 0;
      if (m) { m.emissive.setHex(on ? this.color : 0x000000); m.emissiveIntensity = on ? 0.8 : 0; }
    }
  }
}
