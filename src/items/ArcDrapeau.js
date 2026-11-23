// Arc-Drapeau (objet du niveau 2, Meinau 2026). Règles tranchées par Maxime le 21/11/2026 (docs/decisions.md) :
//  - tir simple (une flèche par appui, cadence TUNING.arc.cooldown) ;
//  - cible verrouillée → la flèche part vers elle ; sinon, viser (clic droit maintenu / LB maintenu / bouton VISER
//    à bascule au tactile) = vue par-dessus l'épaule, la flèche part vers ce qui est AU CENTRE DE L'ÉCRAN (rayon tiré
//    depuis la caméra : premier mur, sol ou cible rencontré ; la caméra est décalée, viser un point fixe au loin faisait
//    passer la flèche à côté du réticule) ; sinon, droit devant ;
//  - en visée : marche lente, la roulade annule ; le clic gauche tire au lieu de fouetter ;
//  - flèches simples illimitées, flèches spéciales comptées (data/arrows.js, désactivées tant que non codées).
// Modèle : arc sur le dos (pivot torso) quand on ne vise pas, en main pendant la visée ; drapeau roulé / déployé.
import * as THREE from 'three';
import { Weapon } from './Weapon.js';
import { Arrow, PASS, arrowCanHit } from '../entities/props/Arrow.js';
import { ARROWS } from '../data/arrows.js';
import { TUNING } from '../data/tuning.js';

const A = TUNING.arc, D2R = Math.PI / 180;
// repère Blender (Z en haut) → repère glTF / Three (Y en haut)
const B2G = new THREE.Matrix4().set(1, 0, 0, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, 0, 0, 1);

export class ArcDrapeau extends Weapon {
  constructor(game) {
    super(game, 'arc');
    this.aimOnAlt = true; this.locksProps = true;
    this.types = ARROWS.map(t => ({ ...t })); // copie : un niveau (ou un test) peut en activer
    this.arrow = 'simple'; this.ammo = {}; this.cd = 0; this.shot = 0; this.equipped = false; this.latched = false;
    this.model = game.assets.protos.arc_drapeau ? game.assets.instance('arc_drapeau') : null;
    this.place(false);
  }
  get type() { return this.types.find(t => t.id === this.arrow); }
  // flèches qu'on peut choisir : activées, et illimitées ou avec des munitions
  get choices() { return this.types.filter(t => t.enabled && (t.infinite || this.ammo[t.id] > 0)); }
  give(id, n) { this.ammo[id] = Math.min(A.ammoMax, (this.ammo[id] || 0) + n); this.game.inventory.refresh(); }
  select(id) { if (id !== this.arrow) { this.arrow = id; this.game.inventory.refresh(); } }
  cycleArrow(dir) {
    const c = this.choices; if (c.length < 2) return;
    const i = Math.max(0, c.findIndex(t => t.id === this.arrow));
    this.select(c[(i + dir + c.length) % c.length].id);
  }
  equip() { this.equipped = true; }
  unequip() { this.equipped = false; this.latched = false; this.setAim(false); }

  setAim(on) {
    const p = this.game.player; if (!p || p.aiming === on) return;
    p.aiming = on; this.game.events.emit('hud:aim', on);
    if (on) this.game.camera.startAim(); else this.game.camera.endAim(p.face);
  }
  update(dt) {
    this.cd = Math.max(0, this.cd - dt); this.shot = Math.max(0, this.shot - dt);
    this.ready = this.cd <= 0;
    const I = this.game.input, p = this.game.player;
    if (this.equipped && p) {
      if (I.arrowPick) { const t = this.choices[I.arrowPick - 1]; if (t) this.select(t.id); }
      if (I.pressed.arrowNext) this.cycleArrow(1);
      if (I.pressed.arrowPrev) this.cycleArrow(-1);
      // tactile : VISER bascule ; ailleurs : on vise tant que le bouton est maintenu
      if (I.device === 'touch' && I.pressed.aim) this.latched = !this.latched;
      if (I.pressed.roll || p.target) this.latched = false;
      const want = (I.held.alt || I.held.aim || this.latched) && !p.target && !I.pressed.roll &&
        p.alive && (p.stateName === 'idle' || p.stateName === 'run');
      this.setAim(want);
      if (p.aiming && I.pressed.attack && this.ready) this.game.inventory.use(); // clic gauche en visée = tir
    } else if (p?.aiming) this.setAim(false);
    this.place(this.equipped && p && (p.aiming || this.shot > 0));
  }
  use() {
    const g = this.game, p = g.player, t = p.target, type = this.type;
    const from = { x: p.x + p.fx * 0.4, y: p.y + A.height, z: p.z + p.fz * 0.4 };
    let to;
    if (t) to = { x: t.x, y: (t.hitY ?? 1.2) + (t.y || 0), z: t.z };
    else if (p.aiming) to = this.aimTarget();
    else to = { x: from.x + p.fx * A.range, y: from.y, z: from.z + p.fz * A.range };
    const v = new THREE.Vector3(to.x - from.x, to.y - from.y, to.z - from.z).normalize();
    if (!p.aiming) p.faceTo(from.x + v.x, from.z + v.z);
    g.add(new Arrow(g, from, { x: v.x, y: v.y, z: v.z }, type));
    g.audio.play('whip');
    this.cd = A.cooldown; this.ready = false; this.shot = A.shotPose;
    if (!type.infinite && --this.ammo[type.id] <= 0) this.arrow = 'simple';
    if (!type.infinite) g.inventory.refresh();
  }
  // point visé : on avance le long du rayon caméra → réticule (à partir de la hauteur de l'Ultra, la caméra pouvant
  // frôler un mur derrière lui) jusqu'au premier sol, mur ou cible ; rien → au bout de la portée
  aimTarget() {
    const g = this.game, c = g.camera, o = c.cam.position, d = c.aimDir(), p = g.player;
    const t0 = Math.max(0, (p.x - o.x) * d.x + (p.y + A.height - o.y) * d.y + (p.z - o.z) * d.z);
    const at = t => ({ x: o.x + d.x * t, y: o.y + d.y * t, z: o.z + d.z * t });
    for (let t = t0 + 0.5; t < t0 + A.range; t += 0.15) {
      const q = at(t);
      if (q.y <= 0.05) return q;
      for (const b of g.collision.boxes) if (b.on && !PASS.has(b.tag) && q.x > b.x0 && q.x < b.x1 && q.z > b.z0 && q.z < b.z1) return q;
      for (const e of g.entities) {
        if (e === p || !e.alive || e.isArrow || !arrowCanHit(e)) continue;
        if (Math.hypot(e.x - q.x, e.z - q.z) < e.r && q.y < (e.hitH || 2.6)) return q;
      }
    }
    return at(t0 + A.range);
  }
  hudLine() {
    const T = this.game.texts, t = this.type;
    return `${T.arrows[t.id]} ${t.infinite ? '∞' : this.ammo[t.id] || 0}` + (this.choices.length > 1 ? ' · {arrow}' : '');
  }
  // dans le dos (accroché au torse) ou en main (accroché à l'Ultra) ; drapeau déployé seulement en main
  place(inHand) {
    const m = this.model, p = this.game.player; if (!m || !p) return;
    if (this.inHand === inHand && m.parent) return;
    this.inHand = inHand;
    const J = m.userData.J;
    if (J.flagRolled) J.flagRolled.visible = !inHand;
    if (J.flagOpen) J.flagOpen.visible = inHand;
    if (inHand) {
      p.obj.add(m); m.position.set(...A.hand.pos); m.rotation.set(0, 0, 0);
    } else {
      p.obj.userData.J.torso.add(m);
      const [x, y, z] = A.back.pos, [rx, ry, rz] = A.back.rot.map(v => v * D2R);
      // ordre ZXY de Blender = Y·X·Z appliqué au vecteur = ordre 'YXZ' de Three ; puis changement de repère
      const rb = new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(rx, ry, rz, 'YXZ'));
      const r = B2G.clone().multiply(rb).multiply(B2G.clone().transpose());
      m.quaternion.setFromRotationMatrix(r);
      m.position.set(x, z - A.back.torsoZ, -y);
    }
  }
}
