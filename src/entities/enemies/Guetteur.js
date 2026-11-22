// Sbire guetteur (générique) : un sbire du kit avec un faisceau visible (lampe, scanner). Deux modes :
//  - infiltration (opts.stealth) : il voit selon systems/Stealth.js (faisceau, obstacles, fumée, lumières) ; s'il voit
//    l'Ultra, il émet 'stealth:caught' (lui-même) et reprend sa ronde (le niveau décide : retour au départ de la salle) ;
//  - combat (par défaut) : sbire normal, le faisceau n'est qu'un décor.
// Réglages : TUNING.sbires[kind] (+ litView : portée sous une lumière allumée). Répliques : TEXTS.barks[kind].
import { Sbire } from './Sbire.js';
import { spots } from '../../systems/Stealth.js';
import { beamMesh, beamAlert } from '../../systems/Beam.js';

export class Guetteur extends Sbire {
  // opts : ceux de Sbire + { stealth, beamColor }
  constructor(game, opts) {
    super(game, opts);
    this.stealth = !!opts.stealth; this.beamColor = opts.beamColor ?? 0xfff0b0;
    this.start = { x: this.x, z: this.z, face: this.face };
    this.beam = beamMesh(this.S.view, this.S.fov, this.beamColor); this.obj.add(this.beam);
    if (this.stealth) this.states.alert = {
      enter() { beamAlert(this.beam, true); this.game.bubble(this, this.game.texts.alertBubble, 0.8); this.game.events.emit('stealth:caught', this); },
      update(dt) { if (this.t > this.S.alertTime) { beamAlert(this.beam, false, this.beamColor); this.setState('patrol'); } }
    };
    this.onHitPlayer = (e, from) => { if (from === this && e === game.player) game.bubble(e, game.texts.barks[this.kind]?.[0] || '', 1); };
    game.events.on('hit', this.onHitPlayer);
  }
  sees() {
    if (!this.stealth) return super.sees();
    const S = this.S;
    return this.blinded <= 0 && spots(this.game, this, this.face, { range: S.view, cos: S.fov, litRange: S.litView });
  }
  // retour au début de la ronde (après un « repéré ! »)
  resetPatrol() {
    if (!this.alive) return;
    Object.assign(this, { x: this.start.x, z: this.start.z, face: this.start.face, wp: 0, goal: null, vx: 0, vz: 0 });
    beamAlert(this.beam, false, this.beamColor); this.setState('patrol'); this.sync();
  }
  update(dt) {
    super.update(dt);
    if (!this.removed) this.beam.visible = this.alive && this.stateName !== 'stunned' && this.blinded <= 0;
  }
}
