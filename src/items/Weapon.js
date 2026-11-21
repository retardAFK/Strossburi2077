// Interface commune des objets du sélecteur (bretzel-boomerang, Arc-Drapeau, gaffe-grappin...).
// Inventory appelle : equip() / unequip() quand on change d'objet, use() (si ready) pour l'action principale,
// update(dt) à chaque tick tant que l'objet est possédé, hudLine() pour une ligne de plus dans le HUD (munitions...).
// aimOnAlt = true : le clic droit sert à viser (maintenu) au lieu d'utiliser l'objet.
// locksProps = true : le verrouillage accroche aussi les cibles et crochets (entités `lockable`), pas seulement les ennemis.
export class Weapon {
  constructor(game, id) { this.game = game; this.id = id; this.ready = true; this.aimOnAlt = false; this.locksProps = false; }
  equip() {}
  unequip() {}
  use() {}
  update(dt) {}
  hudLine() { return ''; }
}
