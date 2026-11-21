// Construit le décor d'un niveau à partir de ses DONNÉES (levels/<id>/layout.js).
import * as THREE from 'three';

const WALL_H = 6;

function canvasTex(w, h, draw, rx = 1, ry = 1) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  t.magFilter = t.minFilter = THREE.NearestFilter;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(rx, ry);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
const TEX = {
  beton: (rx, ry) => canvasTex(32, 32, g => {
    g.fillStyle = '#5a5f72'; g.fillRect(0, 0, 32, 32);
    for (let i = 0; i < 40; i++) { g.fillStyle = Math.random() < 0.5 ? '#525769' : '#62677b'; g.fillRect(Math.random() * 32 | 0, Math.random() * 32 | 0, 2, 2); }
    g.fillStyle = '#4a4e60'; g.fillRect(0, 31, 32, 1); g.fillRect(31, 0, 1, 32);
  }, rx, ry),
  // mur de coursive : béton + bandeau bleu et blanc peint par les supporters
  mur: (rx, ry) => canvasTex(32, 64, g => {
    g.fillStyle = '#6a6f82'; g.fillRect(0, 0, 32, 64);
    for (let i = 0; i < 50; i++) { g.fillStyle = Math.random() < 0.5 ? '#62677a' : '#72778a'; g.fillRect(Math.random() * 32 | 0, Math.random() * 64 | 0, 2, 2); }
    g.fillStyle = '#1f5fd0'; g.fillRect(0, 40, 32, 6); g.fillStyle = '#f4f6ff'; g.fillRect(0, 46, 32, 3); g.fillStyle = '#1f5fd0'; g.fillRect(0, 49, 32, 3);
    g.fillStyle = '#3a3e50'; g.fillRect(0, 60, 32, 4);
  }, rx, ry),
  sol: (rx, ry) => canvasTex(32, 32, g => {
    g.fillStyle = '#3c4052'; g.fillRect(0, 0, 32, 32);
    for (let i = 0; i < 30; i++) { g.fillStyle = Math.random() < 0.5 ? '#373b4c' : '#424659'; g.fillRect(Math.random() * 32 | 0, Math.random() * 32 | 0, 2, 2); }
    g.fillStyle = '#ffd23f'; g.fillRect(0, 0, 2, 32);
  }, rx, ry),
  moquette: (rx, ry) => canvasTex(16, 16, g => {
    g.fillStyle = '#5a1840'; g.fillRect(0, 0, 16, 16);
    g.fillStyle = '#d8a830'; for (let i = 0; i < 16; i += 4) { g.fillRect(i, i, 2, 2); g.fillRect(15 - i, i, 2, 2); }
  }, rx, ry)
};

function adTexture(l1, l2, hue) {
  return canvasTex(128, 64, (g, w, h) => {
    g.fillStyle = '#0a0c24'; g.fillRect(0, 0, w, h);
    for (let y = 0; y < h; y += 2) { g.fillStyle = 'rgba(255,255,255,0.04)'; g.fillRect(0, y, w, 1); }
    g.strokeStyle = hue; g.lineWidth = 3; g.strokeRect(2, 2, w - 4, h - 4);
    g.textAlign = 'center'; g.fillStyle = hue; g.font = 'bold 15px monospace'; g.fillText(l1, w / 2, 27, w - 10);
    g.fillStyle = '#ffffff'; g.font = 'bold 10px monospace'; g.fillText(l2, w / 2, 47, w - 10);
  });
}
function graffitiTexture(text, color) {
  return canvasTex(128, 32, (g, w, h) => {
    g.clearRect(0, 0, w, h); g.textAlign = 'center'; g.font = 'bold italic 22px sans-serif';
    g.fillStyle = '#0a0a14'; g.fillText(text, w / 2 + 2, 25); g.fillStyle = color; g.fillText(text, w / 2, 23);
  });
}

export class World {
  constructor(game, layout) {
    this.game = game; this.layout = layout; this.scene = game.renderer.scene;
    this.doors = {}; this.lasers = {}; this.anim = []; this.props = {};
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
      const c = new THREE.Mesh(new THREE.PlaneGeometry(w, d), new THREE.MeshLambertMaterial({ color: 0x24263a }));
      c.rotation.x = Math.PI / 2; c.position.set((x0 + x1) / 2, WALL_H, (z0 + z1) / 2); S.add(c);   // plafond bas des coursives
    }
    for (const [x0, x1, z0, z1, kind] of L.walls) {
      col.addBox(x0, x1, z0, z1, 'wall');
      const w = Math.abs(x1 - x0), d = Math.abs(z1 - z0);
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, WALL_H, d), new THREE.MeshLambertMaterial({ map: TEX[kind || 'mur'](Math.max(w, d) / 4, 1) }));
      m.position.set((x0 + x1) / 2, WALL_H / 2, (z0 + z1) / 2); S.add(m);
    }
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
      const [l1, l2] = this.game.texts.ads[a.idx % this.game.texts.ads.length];
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
      if (p.solid) col.addCircle(p.x, p.z, p.solid, 'prop');
    }
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
    const [l1, l2] = this.game.texts.buvette;
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
      d.m.position.y = WALL_H / 2 + d.t * (WALL_H - 0.4);
    }
    for (const id in this.lasers) { const l = this.lasers[id]; if (l.on) l.beams.forEach((b, i) => (b.material.opacity = 1, b.scale.y = 1 + 0.5 * Math.sin(t * 30 + i))); }
  }
}
