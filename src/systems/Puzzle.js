// Briques d'énigmes génériques, réutilisables dans toutes les salles.
// Elles se branchent sur le bus d'événements ; on les ajoute au jeu avec game.add() pour qu'elles soient mises à jour.

// TimedSwitchGroup : tous les interrupteurs d'un groupe doivent être allumés avant la fin du chrono,
// qui démarre au premier allumé. Sinon tout se rééteint.
// Événements émis (<g> = groupe) :
//   'puzzle:progress:<g>' (allumés, total, temps restant)   'puzzle:failed:<g>'   'puzzle:solved:<g>'
//   'switch:reset:<g>' (les interrupteurs s'éteignent)      'switch:lock:<g>' (ils restent allumés)
export class TimedSwitchGroup {
  constructor(game, { group, time }) {
    this.game = game; this.group = group; this.time = time;
    this.removed = false; this.solved = false; this.left = 0; this.lit = new Set();
    this.total = game.entities.filter(e => e.isSwitch && e.group === group).length;
    game.events.on('switch:on', s => this.onSwitch(s));
  }
  onSwitch(s) {
    if (this.solved || s.group !== this.group) return;
    if (!this.lit.size) this.left = this.time;
    this.lit.add(s);
    const E = this.game.events, g = this.group;
    E.emit('puzzle:progress:' + g, this.lit.size, this.total, this.left);
    if (this.lit.size >= this.total) { this.solved = true; E.emit('switch:lock:' + g); E.emit('puzzle:solved:' + g); }
  }
  update(dt) {
    if (this.solved || !this.lit.size) return;
    this.left -= dt;
    if (this.left > 0) return;
    this.lit.clear();
    this.game.events.emit('switch:reset:' + this.group);
    this.game.events.emit('puzzle:failed:' + this.group);
  }
}

// MultiState : un état partagé à plusieurs niveaux (ex. le niveau d'eau d'une écluse).
// set(v) émet 'state:<id>' (v, ancien) ; les entités et le script s'y abonnent.
export class MultiState {
  constructor(game, { id, count, start = 0 }) {
    this.game = game; this.id = id; this.count = count; this.value = start; this.removed = false;
  }
  set(v) {
    v = Math.max(0, Math.min(this.count - 1, v));
    if (v === this.value) return;
    const old = this.value; this.value = v;
    this.game.events.emit('state:' + this.id, v, old);
  }
  update() {}
}
