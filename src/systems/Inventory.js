// Inventaire : objets obtenus et objet équipé. Émet 'inventory:changed' (objet équipé) pour le HUD.
// Commandes : clic droit = objet si rien n'est verrouillé (sinon verrouillage, comme avant), F / gâchette = objet.
// Les objets sont des classes { id, constructor(game), use(), ready } fournies par le niveau (items/*.js).
export class Inventory {
  constructor(game) {
    this.game = game; this.items = {}; this.equipped = null;
  }
  give(item) {
    this.items[item.id] = item; this.equipped = item;
    this.game.events.emit('inventory:changed', item);
  }
  has(id) { return !!this.items[id]; }
  // appelé par Game à chaque tick, avant les entités
  update() {
    const I = this.game.input, p = this.game.player, it = this.equipped;
    if (I.pressed.alt) { if (it && !p.target) this.use(); else I.pressed.lock = true; }
    if (I.pressed.throw && it) this.use();
  }
  use() {
    const it = this.equipped, p = this.game.player;
    if (!it || !p.alive || !it.ready || p.stateName === 'dead') return;
    it.use();
  }
}
