// Effets visuels de gameplay : réticule de verrouillage, onde de choc, étoiles d'étourdissement,
// bulles de dialogue au-dessus des personnages.
import * as THREE from 'three';

export class Fx {
  constructor(game, bubbleLayer) {
    this.game = game; const S = game.renderer.scene;
    this.reticle = new THREE.Mesh(new THREE.ConeGeometry(0.35, 0.6, 3), new THREE.MeshBasicMaterial({ color: 0xffd23f, fog: false }));
    this.reticle.rotation.x = Math.PI; this.reticle.visible = false; S.add(this.reticle);
    this.starGroup = new THREE.Group();
    for (let i = 0; i < 4; i++) {
      const s = new THREE.Mesh(new THREE.OctahedronGeometry(0.22), new THREE.MeshBasicMaterial({ color: 0xffd23f, fog: false }));
      s.position.set(Math.cos(i * 1.57) * 1.1, 0, Math.sin(i * 1.57) * 1.1); this.starGroup.add(s);
    }
    this.starGroup.visible = false; S.add(this.starGroup);
    this.rings = []; this.bubbles = []; this.layer = bubbleLayer;
  }
  shockwave(x, z, r) {
    const m = new THREE.Mesh(new THREE.RingGeometry(0.8, 1, 24), new THREE.MeshBasicMaterial({ color: 0xffd23f, transparent: true, side: THREE.DoubleSide, fog: false }));
    m.rotation.x = -Math.PI / 2; m.position.set(x, 0.1, z); this.game.renderer.scene.add(m);
    this.rings.push({ m, r, t: 0 });
  }
  stars(target) {
    this.starGroup.visible = !!target;
    if (target) { this.starGroup.position.set(target.x, (target.lookY || 2) + 1.6, target.z); this.starGroup.rotation.y += 0.08; }
  }
  bubble(ent, text, dur = 2) {
    this.bubbles = this.bubbles.filter(b => { if (b.ent === ent) { b.el.remove(); return false; } return true; });
    const el = document.createElement('div'); el.className = 'bubble'; el.textContent = text; this.layer.appendChild(el);
    this.bubbles.push({ ent, el, t: dur });
  }
  update(dt, target) {
    this.reticle.visible = !!target;
    if (target) { this.reticle.position.set(target.x, (target.lookY || 1.6) + 1.9, target.z); this.reticle.rotation.y += dt * 5; }
    for (const r of this.rings) { r.t += dt; const s = 1 + r.t / 0.35 * r.r; r.m.scale.setScalar(s); r.m.material.opacity = 1 - r.t / 0.35; }
    this.rings = this.rings.filter(r => { if (r.t > 0.35) { this.game.renderer.scene.remove(r.m); return false; } return true; });
    // bulles : projetées au-dessus de la tête
    const cam = this.game.renderer.camera, v = new THREE.Vector3();
    this.bubbles = this.bubbles.filter(b => {
      b.t -= dt;
      if (b.t <= 0 || b.ent.removed) { b.el.remove(); return false; }
      v.set(b.ent.x, (b.ent.lookY || 1.6) + 1.6, b.ent.z).project(cam);
      b.el.style.display = v.z < 1 ? 'block' : 'none';
      b.el.style.left = ((v.x + 1) / 2 * 100) + '%'; b.el.style.top = ((1 - v.y) / 2 * 100) + '%';
      return true;
    });
  }
  clearBubbles() { this.bubbles.forEach(b => b.el.remove()); this.bubbles = []; }
}
