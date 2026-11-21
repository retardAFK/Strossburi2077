// Plaque historique holo (générique, tous niveaux) : BlingCo y affiche un mensonge.
// E à portée → glitch → la vraie histoire s'affiche (panneau + dialogue). Émet 'plaque:restored' (id).
// Textes : levelTexts.plaques[id] = { lie, truth } ; les textes historiques sont relus par Maxime.
import * as THREE from 'three';
import { Entity } from '../Entity.js';
import { TUNING } from '../../data/tuning.js';
import { interact, clearPrompt } from '../../systems/Interact.js';

const P = TUNING.plaque;
const GLYPHS = '#%&@$!?<>/\\|=+*01ÆØ§¤';

// texte sur plusieurs lignes, coupé à la largeur
function wrap(g, text, x, y, w, lh) {
  let line = '';
  for (const word of text.split(' ')) {
    const t = line ? line + ' ' + word : word;
    if (g.measureText(t).width > w && line) { g.fillText(line, x, y); y += lh; line = word; } else line = t;
  }
  if (line) g.fillText(line, x, y);
}

export class Plaque extends Entity {
  constructor(game, { id, x, z, rotY = 0 }) {
    super(game, { x, z, r: 0.4, hp: 1 });
    this.id = id; this.isPlaque = true; this.state = 'lie'; this.glitchT = 0;
    this.text = game.levelTexts.plaques[id];
    const S = game.renderer.scene;
    this.obj = new THREE.Group(); this.obj.position.set(x, 0, z); this.obj.rotation.y = rotY; S.add(this.obj);
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.16, 1.2, 0.16), new THREE.MeshLambertMaterial({ color: 0x2a2d40 }));
    post.position.y = 0.6; this.obj.add(post);
    this.canvas = document.createElement('canvas'); this.canvas.width = 160; this.canvas.height = 100;
    this.tex = new THREE.CanvasTexture(this.canvas); this.tex.magFilter = this.tex.minFilter = THREE.NearestFilter;
    this.tex.colorSpace = THREE.SRGBColorSpace;
    this.panel = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 1), new THREE.MeshBasicMaterial({ map: this.tex, transparent: true, side: THREE.DoubleSide, fog: false }));
    this.panel.position.y = 1.75; this.obj.add(this.panel);
    game.collision.addCircle(x, z, 0.3, 'plaque');
    this.draw();
  }
  draw(glitch = false) {
    const g = this.canvas.getContext('2d'), w = 160, h = 100, truth = this.state === 'truth';
    const col = truth ? '#ffd23f' : '#ff2e88';
    g.clearRect(0, 0, w, h); g.fillStyle = 'rgba(8,8,36,0.85)'; g.fillRect(0, 0, w, h);
    g.strokeStyle = glitch ? (Math.random() < 0.5 ? '#38f2ff' : '#ff2e88') : col; g.lineWidth = 3; g.strokeRect(2, 2, w - 4, h - 4);
    g.textAlign = 'center'; g.fillStyle = col; g.font = 'bold 10px monospace';
    g.fillText(this.game.levelTexts.plaqueTitle[truth ? 1 : 0], w / 2, 16);
    g.fillStyle = '#ffffff'; g.font = '9px monospace';
    const body = glitch ? [...this.text.lie].map(c => (c === ' ' || Math.random() < 0.3 ? c : GLYPHS[Math.random() * GLYPHS.length | 0])).join('')
      : (truth ? this.text.truth : this.text.lie);
    wrap(g, body, w / 2, 34, w - 16, 12);
    this.tex.needsUpdate = true;
  }
  restore() {
    this.state = 'glitch'; this.glitchT = P.glitchTime; clearPrompt(this);
    this.game.audio.play('laser'); this.game.camera.shake = 0.15;
  }
  update(dt) {
    this.time += dt;
    this.panel.position.y = 1.75 + Math.sin(this.time * 2) * 0.04;
    if (this.state === 'lie') {
      this.panel.material.opacity = 0.85 + 0.1 * Math.sin(this.time * 9);
      if (interact(this, this.game.texts.prompts.restore, P.useRange)) this.restore();
    } else if (this.state === 'glitch') {
      this.glitchT -= dt; this.panel.position.x = (Math.random() - 0.5) * 0.08;
      if (Math.floor(this.time * 20) !== Math.floor((this.time - dt) * 20)) this.draw(true);
      if (this.glitchT <= 0) {
        this.state = 'truth'; this.panel.position.x = 0; this.panel.material.opacity = 1; this.draw();
        this.game.audio.play('pickup');
        this.game.particles.burst(this.x, 1.8, this.z, 12, 0xffd23f, 3);
        this.game.say({ who: this.game.levelTexts.plaqueTitle[1], txt: this.text.truth });
        this.game.events.emit('plaque:restored', this.id);
      }
    }
  }
}
