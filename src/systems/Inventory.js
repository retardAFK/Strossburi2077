// Inventaire : objets obtenus (dans l'ordre d'obtention) et objet équipé. Émet 'inventory:changed' (objet équipé,
// nombre d'objets) pour le HUD et le tactile ; un objet appelle refresh() quand sa ligne de HUD change (munitions).
// Commandes : clic droit = objet si rien n'est verrouillé (sinon verrouillage, comme avant ; viser pour l'arc),
// F / RB / bouton tactile = objet, Tab / croix haut-bas / bouton ⇄ = changer d'objet.
// Les objets implémentent items/Weapon.js : { id, ready, equip(), unequip(), use(), update(dt), hudLine() }.
export class Inventory {
  constructor(game) {
    this.game = game; this.items = {}; this.order = []; this.equipped = null;
  }
  give(item) {
    if (!this.items[item.id]) this.order.push(item.id);
    this.items[item.id] = item; this.equip(item.id);
  }
  has(id) { return !!this.items[id]; }
  equip(id) {
    const it = this.items[id]; if (!it) return;
    if (this.equipped && this.equipped !== it) this.equipped.unequip();
    this.equipped = it; it.equip();
    this.refresh();
  }
  // objet suivant (dir = 1) ou précédent (dir = -1) ; rien à faire avec un seul objet
  cycle(dir) {
    if (this.order.length < 2) return;
    const i = this.order.indexOf(this.equipped.id), n = this.order.length;
    this.equip(this.order[(i + dir + n) % n]);
    this.game.audio.play('ting');
  }
  refresh() { this.game.events.emit('inventory:changed', this.equipped, this.order.length); }
  // appelé par Game à chaque tick, avant les entités
  update() {
    const I = this.game.input, p = this.game.player, it = this.equipped;
    if (I.pressed.switch) this.cycle(1);
    if (I.pressed.switchPrev) this.cycle(-1);
    if (I.pressed.alt) { if (it && !p.target) { if (!it.aimOnAlt) this.use(); } else I.pressed.lock = true; }
    if (I.pressed.throw && it) this.use();
    for (const id of this.order) this.items[id].update(this.game.dt);
  }
  use() {
    const it = this.equipped, p = this.game.player;
    if (!it || !p.alive || !it.ready || p.stateName === 'dead') return;
    it.use();
  }
}
