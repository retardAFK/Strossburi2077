// Écran géant de stade (générique) : alterne des pubs (textes du niveau) et, quand on lui demande ('screen:sequence'
// avec une liste de couleurs), une séquence de couleurs « piratée » (glitch) — l'indice visuel d'une énigme.
// 'screen:replay' rejoue la dernière séquence. Réglages : show / pause (s) passés à la création.
import * as THREE from 'three';
import { Entity } from '../Entity.js';

export class EcranGeant extends Entity {
  constructor(game, { x, z, y = 4, w = 6, rotY = 0, show = 0.9, pause = 2.2 }) {
    super(game, { x, z, r: 0.1, hp: 1 });
    Object.assign(this, { show, pause, seq: null, i: -1, clock: 0, ad: 0 });
    this.canvas = document.createElement('canvas'); this.canvas.width = 192; this.canvas.height = 108;
    this.tex = new THREE.CanvasTexture(this.canvas); this.tex.magFilter = this.tex.minFilter = THREE.NearestFilter;
    this.obj = new THREE.Mesh(new THREE.PlaneGeometry(w, w * 0.5625), new THREE.MeshBasicMaterial({ map: this.tex, fog: false }));
    this.obj.position.set(x, y, z); this.obj.rotation.y = rotY; game.renderer.scene.add(this.obj);
    game.events.on('screen:sequence', colors => { this.seq = colors; this.start(); });
    game.events.on('screen:replay', () => this.start());
    this.drawAd();
  }
  start() { if (this.seq) { this.i = 0; this.clock = 0; this.drawColor(); } }
  drawAd() {
    const g = this.canvas.getContext('2d'), ads = this.game.levelTexts.ads || [['BLINGCO', '']], [l1, l2] = ads[this.ad % ads.length];
    g.fillStyle = '#0c1028'; g.fillRect(0, 0, 192, 108); g.strokeStyle = '#ffc040'; g.lineWidth = 4; g.strokeRect(2, 2, 188, 104);
    g.textAlign = 'center'; g.fillStyle = '#ffc040'; g.font = 'bold 18px monospace'; g.fillText(l1, 96, 48, 180);
    g.fillStyle = '#ffffff'; g.font = '11px monospace'; g.fillText(l2, 96, 74, 180);
    this.tex.needsUpdate = true;
  }
  drawColor() {
    const g = this.canvas.getContext('2d'), c = '#' + this.seq[this.i].toString(16).padStart(6, '0');
    g.fillStyle = '#05050a'; g.fillRect(0, 0, 192, 108);
    g.fillStyle = c; g.fillRect(36, 14, 120, 80);
    for (let k = 0; k < 6; k++) { g.fillStyle = k % 2 ? '#ff2e88' : '#38f2ff'; g.fillRect(0, Math.random() * 108 | 0, 192, 2); } // glitch SCN
    g.fillStyle = '#ffffff'; g.font = 'bold 12px monospace'; g.textAlign = 'center'; g.fillText(`${this.i + 1} / ${this.seq.length}`, 96, 104);
    this.tex.needsUpdate = true;
  }
  update(dt) {
    this.clock += dt;
    if (this.i >= 0) { // séquence en cours : une couleur toutes les « show » secondes
      if (this.clock > this.show) { this.clock = 0; this.i++; if (this.i >= this.seq.length) { this.i = -1; this.drawAd(); } else this.drawColor(); }
    } else if (this.clock > this.pause) { // entre deux pubs, la séquence repasse
      this.clock = 0; this.ad++; if (this.seq) this.start(); else this.drawAd();
    }
  }
}
