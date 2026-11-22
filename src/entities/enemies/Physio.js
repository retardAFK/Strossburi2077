// Physio cyborg BlingCo (le Kalt, 2026, fiche docs/designs/physio-kalt.md) : sbire de combat (kit Sbire.js), humain
// inventé, caricature du « physio ». Gags validés (« un peu des 3 ») : il refoule tout le monde (« PAS CE SOIR »),
// mesure les baskets (répliques TEXTS.barks.physio) et tamponne le front de l'Ultra quand son coup porte (bulle
// levelTexts.stamp). Correctif de la fiche : le panneau « PAS CE SOIR » est accroché à la main gauche (handF).
// opts.dark : dans la salle noire, il n'est visible qu'aux flashs du stroboscope (props/Sono.js).
import { Sbire } from './Sbire.js';

export class Physio extends Sbire {
  constructor(game, opts) {
    super(game, { ...opts, kind: 'physio', model: 'physio_kalt', label: 'PHYSIO' });
    this.dark = !!opts.dark;
    const J = this.obj.userData.J;
    if (J.panneau && J.handF) J.handF.attach(J.panneau);
  }
  update(dt) {
    const before = this.hitDone;
    super.update(dt);
    if (this.removed) return;
    if (this.stateName === 'attack' && this.hitDone && !before) this.game.bubble(this.player, this.game.levelTexts.stamp || '', 1);
    // le bras-tampon se lève à l'élan
    const J = this.obj.userData.J;
    if (J.tampon) J.tampon.rotation.z = this.stateName === 'windup' ? 0.6 : 0;
  }
}
