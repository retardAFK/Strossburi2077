// Construit le décor d'un niveau à partir de ses DONNÉES (levels/<id>/layout.js).
import * as THREE from 'three';
import { TEX, canvasTex, adTexture, graffitiTexture, silhouetteTexture } from './Textures.js';
import { TUNING } from '../data/tuning.js';

const WALL_H = 6;

export class World {
  constructor(game, layout) {
    this.game = game; this.layout = layout; this.scene = game.renderer.scene;
    this.doors = {}; this.lasers = {}; this.gates = {}; this.waters = {}; this.anim = []; this.props = {}; this.propCircles = {};
    this.texts = game.levelTexts || game.texts; // panneaux, enseignes : textes du niveau
  }
  build() {
    const L = this.layout, S = this.scene, col = this.game.collision;
    this.game.renderer.setAtmosphere(L.bg, L.fog[0], L.fog[1]);
    S.add(new THREE.HemisphereLight(0xc8d8ff, 0x201838, 0.9));
    const key = new THREE.DirectionalLight(0xffffff, 0.5); key.position.set(4, 12, 6); S.add(key);
    for (const f of L.floors) {
      const [x0, x1, z0, z1] = f.rect, w = x1 - x0, d = z0 - z1;
      const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), new THREE.MeshLambertMaterial({ map: TEX[f.tex](w / 4, d / 4) }));
      m.rotation.x = -Math.PI / 2; m.position.set((x0 + x1) / 2, 0, (z0 + z1) / 2); S.add(m);
      if (f.sky) continue; // extérieur : pas de plafond
      const c = new THREE.Mesh(new THREE.PlaneGeometry(w, d), new THREE.MeshLambertMaterial({ color: 0x24263a }));
      c.rotation.x = Math.PI / 2; c.position.set((x0 + x1) / 2, WALL_H, (z0 + z1) / 2); S.add(c);   // plafond bas des coursives
    }
    for (const [x0, x1, z0, z1, kind] of L.walls) {
      col.addBox(x0, x1, z0, z1, 'wall');
      const w = Math.abs(x1 - x0), d = Math.abs(z1 - z0);
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, WALL_H, d), new THREE.MeshLambertMaterial({ map: TEX[kind || 'mur'](Math.max(w, d) / 4, 1) }));
      m.position.set((x0 + x1) / 2, WALL_H / 2, (z0 + z1) / 2); S.add(m);
    }
    for (const [x0, x1, z0, z1] of L.blockers || []) col.addBox(x0, x1, z0, z1, 'blocker'); // murs invisibles (façades, rambardes)
    for (const p of L.pillars || []) {
      col.addCircle(p.x, p.z, 0.6, 'pillar');
      const m = new THREE.Mesh(new THREE.BoxGeometry(1.1, WALL_H, 1.1), new THREE.MeshLambertMaterial({ map: TEX.mur(1, 1) }));
      m.position.set(p.x, WALL_H / 2, p.z); S.add(m);
    }
    for (const n of L.neons) {
      const g = n.axis === 'x' ? new THREE.BoxGeometry(n.len, 0.08, 0.08) : new THREE.BoxGeometry(0.08, 0.08, n.len);
      const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color: n.color }));
      m.position.set(n.x, n.y, n.z); S.add(m);
    }
    L.ads.forEach((a, i) => {
      const ads = this.texts.ads, [l1, l2] = ads[a.idx % ads.length];
      const m = new THREE.Mesh(new THREE.PlaneGeometry(a.w || 3.2, (a.w || 3.2) / 2),
        new THREE.MeshBasicMaterial({ map: adTexture(l1, l2, i % 2 ? '#ff2e88' : '#38f2ff'), transparent: true, opacity: 0.92 }));
      m.position.set(a.x, a.y || 3.6, a.z); m.rotation.y = a.rotY || 0; S.add(m);
      this.anim.push(t => { m.material.opacity = 0.82 + 0.12 * Math.sin(t * 7 + i * 3) * (Math.random() < 0.02 ? 4 : 1); });
    });
    for (const gfx of L.graffiti || []) {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(3, 0.75), new THREE.MeshBasicMaterial({ map: graffitiTexture(gfx.text, gfx.color), transparent: true }));
      m.position.set(gfx.x, gfx.y || 1.6, gfx.z); m.rotation.y = gfx.rotY || 0; S.add(m);
    }
    // vomitoires : ouvertures lumineuses vers la tribune (on entend la foule)
    for (const v of L.vomitoires || []) {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 3.4), new THREE.MeshBasicMaterial({ color: 0xbfe8ff, fog: false }));
      m.position.set(v.x, 1.7, v.z); m.rotation.y = v.rotY; S.add(m);
      const l = new THREE.PointLight(0x9fd0ff, 10, 9, 1.5); l.position.set(v.x + Math.sin(v.rotY) * 1.2, 2.2, v.z + Math.cos(v.rotY) * 1.2); S.add(l);
    }
    for (const l of L.lights) { const p = new THREE.PointLight(l.color, l.i || 12, l.d || 14, 1.6); p.position.set(l.x, l.y || 4.5, l.z); S.add(p); }
    for (const b of L.buvettes || []) this.buildBuvette(b);
    for (const p of L.props || []) {
      const o = this.game.assets.instance(p.model); o.position.set(p.x, p.y || 0, p.z); o.rotation.y = p.rotY || 0;
      if (p.scale) o.scale.setScalar(p.scale);
      S.add(o); if (p.id) this.props[p.id] = o;
      if (p.solid) { const c = col.addCircle(p.x, p.z, p.solid, 'prop'); if (p.id) this.propCircles[p.id] = c; }
      if (p.box) col.addBox(...p.box, p.boxTag || 'prop'); // obstacle rectangulaire (vitre anti-écharpe : boxTag 'vitre')
      if (p.holo) this.makeHolo(o);
      if (p.hidden) o.visible = false;
    }
    for (const t of L.tables || []) this.buildTable(t);
    for (const b of L.blocks || []) this.buildBlock(b);
    for (const [x0, x1, z0, z1, tag] of L.glass || []) col.addBox(x0, x1, z0, z1, tag || 'vitre'); // vitres sans modèle
    for (const s of L.screens || []) this.buildScreen(s);
    for (const g of L.gates || []) this.buildGate(g);
    for (const w of L.waters || []) this.buildWater(w);
    for (const d of L.drones || []) {
      const o = this.game.assets.instance('drone'); S.add(o);
      this.anim.push(t => { const a = t * d.speed + d.phase; o.position.set(d.x + Math.cos(a) * d.r, d.y + Math.sin(t * 3) * 0.15, d.z + Math.sin(a) * d.r); o.rotation.y = -a; });
    }
    for (const d of L.doors || []) this.buildDoor(d);
    for (const l of L.lasers || []) this.buildLaser(l);
  }
  buildBuvette(b) {
    const S = this.scene;
    const counter = new THREE.Mesh(new THREE.BoxGeometry(b.w, 1.1, 1), new THREE.MeshLambertMaterial({ color: 0x2a2d40 }));
    counter.position.set(b.x, 0.55, b.z); S.add(counter);
    const top = new THREE.Mesh(new THREE.BoxGeometry(b.w + 0.1, 0.08, 1.1), new THREE.MeshBasicMaterial({ color: 0x38f2ff }));
    top.position.set(b.x, 1.12, b.z); S.add(top);
    const [l1, l2] = this.texts.buvette;
    const sign = new THREE.Mesh(new THREE.PlaneGeometry(b.w, b.w / 2), new THREE.MeshBasicMaterial({ map: adTexture(l1, l2, '#ffd23f') }));
    sign.position.set(b.x, 3.4, b.z + (b.signDz || -0.4)); sign.rotation.y = b.rotY || 0; S.add(sign);
    this.game.collision.addBox(b.x - b.w / 2, b.x + b.w / 2, b.z - 0.5, b.z + 0.5, 'buvette');
  }
  buildDoor(d) {  // rideau métallique qui monte / descend
    const [x0, x1, z0, z1] = d.rect;
    const box = this.game.collision.addBox(x0, x1, z0, z1, 'door');
    const m = new THREE.Mesh(new THREE.BoxGeometry(x1 - x0, WALL_H, Math.abs(z1 - z0)),
      new THREE.MeshLambertMaterial({ map: canvasTex(16, 16, g => { g.fillStyle = '#7a7f92'; g.fillRect(0, 0, 16, 16); g.fillStyle = '#5a5f72'; for (let y = 0; y < 16; y += 3) g.fillRect(0, y, 16, 1); }, (x1 - x0) / 2, 3) }));
    m.position.set((x0 + x1) / 2, WALL_H / 2, (z0 + z1) / 2); this.scene.add(m);
    const door = { box, m, open: !!d.open, t: d.open ? 1 : 0 };
    box.on = !door.open;
    this.doors[d.id] = door;
  }
  buildLaser(l) {
    const box = this.game.collision.addBox(l.x0, l.x1, l.z - 0.15, l.z + 0.15, 'laser');
    const beams = [];
    for (const y of [0.5, 1.0, 1.5]) {
      const m = new THREE.Mesh(new THREE.BoxGeometry(l.x1 - l.x0, 0.06, 0.06), new THREE.MeshBasicMaterial({ color: 0xff1a3c, fog: false }));
      m.position.set((l.x0 + l.x1) / 2, y, l.z); this.scene.add(m); beams.push(m);
    }
    this.lasers[l.id] = { box, beams, on: true };
  }
  // hologramme : matières translucides cyan qui grésillent (PNJ en message vidéo...)
  makeHolo(o) {
    const mats = [];
    o.traverse(m => { if (m.isMesh) { m.material = new THREE.MeshBasicMaterial({ color: m.material.color.clone().lerp(new THREE.Color(0x38f2ff), 0.55), transparent: true, opacity: 0.7, fog: false }); mats.push(m.material); } });
    this.anim.push(t => { const a = 0.55 + 0.15 * Math.sin(t * 20) + (Math.random() < 0.04 ? -0.3 : 0); for (const m of mats) m.opacity = a; });
  }
  // écran géant (silhouette du PDG...) : { id, x, y, z, w, rotY, hidden }
  buildScreen(s) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(s.w, s.w * 2 / 3), new THREE.MeshBasicMaterial({ map: silhouetteTexture(), fog: false }));
    m.position.set(s.x, s.y, s.z); m.rotation.y = s.rotY || 0; m.visible = !s.hidden; this.scene.add(m);
    this.props[s.id] = m;
    this.anim.push(t => { m.material.color.setScalar(0.85 + 0.15 * Math.sin(t * 13) + (Math.random() < 0.03 ? -0.4 : 0)); });
  }
  setPropVisible(id, on) { if (this.props[id]) this.props[id].visible = on; }
  // retire un décor (cage qui saute...) : invisible et plus d'obstacle
  removeProp(id) { this.setPropVisible(id, false); if (this.propCircles[id]) this.propCircles[id].on = false; }
  // bloc de décor simple (pile de pont, socle...) : { x, z, w, d, h, y?, tex?, solid? }
  buildBlock(b) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(b.w, b.h, b.d), new THREE.MeshLambertMaterial({ map: TEX[b.tex || 'gres'](Math.max(b.w, b.d) / 3, b.h / 3) }));
    m.position.set(b.x, (b.y || 0) + b.h / 2, b.z); this.scene.add(m);
    if (b.solid) this.game.collision.addBox(b.x - b.w / 2, b.x + b.w / 2, b.z - b.d / 2, b.z + b.d / 2, 'block');
  }
  // table de food court + 2 tabourets (obstacle rond)
  buildTable(t) {
    const S = this.scene, dark = new THREE.MeshLambertMaterial({ color: 0x2a2d40 });
    const top = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.75, 0.08, 8), new THREE.MeshLambertMaterial({ color: 0xf4f6ff }));
    top.position.set(t.x, 0.95, t.z); S.add(top);
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.2, 0.95, 6), dark); leg.position.set(t.x, 0.47, t.z); S.add(leg);
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.75, 0.03, 4, 12), new THREE.MeshBasicMaterial({ color: t.color || 0xff2e88 }));
    rim.rotation.x = Math.PI / 2; rim.position.set(t.x, 0.95, t.z); S.add(rim);
    for (const sg of [-1, 1]) {
      const st = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.6, 6), dark); st.position.set(t.x + sg * 1.1, 0.3, t.z); S.add(st);
    }
    this.game.collision.addCircle(t.x, t.z, 0.85, 'table');
  }
  // herse (modèle .glb) : bloque un passage ; ouverte = barreaux rouges éteints + passage libre
  buildGate(g) {
    const o = this.game.assets.instance(g.model); o.position.set(g.x, 0, g.z); o.rotation.y = g.rotY || 0; this.scene.add(o);
    const beams = [];
    o.traverse(m => { if (m.isMesh && m.material.color.r > 0.8 && m.material.color.g < 0.1) beams.push(m); }); // rouge laser
    const [x0, x1, z0, z1] = g.rect;
    this.gates[g.id] = { box: this.game.collision.addBox(x0, x1, z0, z1, 'gate'), beams, open: false };
  }
  // canal à niveau d'eau variable : plan d'eau + parois intérieures. levels = hauteurs (y), start = indice.
  // Le bassin est bloqué (collision) ; la barque le désactive quand l'Ultra est à bord.
  buildWater(w) {
    const [x0, x1, z0, z1] = w.rect, cx = (x0 + x1) / 2, cz = (z0 + z1) / 2, W = x1 - x0, D = z0 - z1, deep = 2.6;
    const tex = TEX.eau(W / 3, D / 3);
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(W, D), new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0.92 }));
    plane.rotation.x = -Math.PI / 2; this.scene.add(plane);
    const stone = new THREE.MeshLambertMaterial({ map: TEX.gres(Math.max(W, D) / 4, 1) });
    for (const [px, pz, sw, ry] of [[x0, cz, D, Math.PI / 2], [x1, cz, D, -Math.PI / 2], [cx, z0, W, Math.PI], [cx, z1, W, 0]]) {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(sw, deep), stone); m.position.set(px, -deep / 2, pz); m.rotation.y = ry; this.scene.add(m);
    }
    const water = { plane, levels: w.levels, level: w.start ?? 0, y: w.levels[w.start ?? 0], box: this.game.collision.addBox(x0, x1, z0, z1, 'water') };
    plane.position.set(cx, water.y, cz);
    this.anim.push(t => { tex.offset.set(Math.sin(t * 0.3) * 0.05, t * 0.02); });
    this.waters[w.id] = water;
  }
  setWaterLevel(id, level) {
    const w = this.waters[id]; if (!w || w.level === level) return;
    w.level = level; this.game.audio.play('door');
  }
  setGate(id, open) {
    const g = this.gates[id]; if (!g || g.open === open) return;
    g.open = open; g.box.on = !open; for (const b of g.beams) b.visible = !open;
    this.game.audio.play('laser');
  }
  setDoor(id, open) {
    const d = this.doors[id]; if (!d || d.open === open) return;
    d.open = open; d.box.on = !open; this.game.audio.play('door');
  }
  setLaser(id, on) {
    const l = this.lasers[id]; if (!l) return;
    l.on = on; l.box.on = on; for (const b of l.beams) b.visible = on;
    this.game.audio.play('laser');
  }
  update(dt, t) {
    for (const f of this.anim) f(t);
    for (const id in this.doors) {
      const d = this.doors[id];
      d.t = Math.max(0, Math.min(1, d.t + (d.open ? dt : -dt) * 1.2));
      // rideau qui s'enroule vers le haut (ne dépasse jamais du mur, même en extérieur)
      const h = Math.max(0.02, 1 - d.t * 0.94); d.m.scale.y = h; d.m.position.y = WALL_H - WALL_H * h / 2;
    }
    for (const id in this.waters) { // l'eau monte / descend doucement vers le niveau demandé
      const w = this.waters[id], target = w.levels[w.level];
      w.y += Math.sign(target - w.y) * Math.min(Math.abs(target - w.y), dt * TUNING.water.speed);
      w.plane.position.y = w.y;
    }
    for (const id in this.lasers) { const l = this.lasers[id]; if (l.on) l.beams.forEach((b, i) => (b.material.opacity = 1, b.scale.y = 1 + 0.5 * Math.sin(t * 30 + i))); }
  }
}
