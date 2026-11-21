// Tifo géant (générique) : grande bâche cachée qui se déroule de haut en bas sur 'tifo:reveal' et affiche le texte
// du niveau (ex. « PAS À VENDRE »), bandes bleues et blanches. Décor : aucune collision.
import * as THREE from 'three';
import { Entity } from '../Entity.js';

export class TifoGeant extends Entity {
  constructor(game, { x, z, y = 5, w = 14, h = 5, rotY = 0, text = game.levelTexts.tifo }) {
    super(game, { x, z, r: 0.1, hp: 1 });
    const c = document.createElement('canvas'); c.width = 280; c.height = 100;
    const g = c.getContext('2d');
    for (let i = 0; i < 7; i++) { g.fillStyle = i % 2 ? '#f4f6ff' : '#1f5fd0'; g.fillRect(i * 40, 0, 40, 100); }
    g.fillStyle = 'rgba(8,10,40,0.85)'; g.fillRect(0, 30, 280, 42);
    g.fillStyle = '#ffffff'; g.font = 'bold 30px monospace'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(text, 140, 52, 270);
    const tex = new THREE.CanvasTexture(c);
    this.obj = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide, fog: false }));
    this.obj.geometry.translate(0, -h / 2, 0); // se déroule depuis le haut
    this.obj.position.set(x, y + h / 2, z); this.obj.rotation.y = rotY; this.obj.scale.y = 0.01; this.obj.visible = false;
    game.renderer.scene.add(this.obj);
    this.open = false;
    game.events.on('tifo:reveal', () => { this.open = true; this.obj.visible = true; this.game.audio.play('win'); });
  }
  update(dt) { if (this.open && this.obj.scale.y < 1) this.obj.scale.y = Math.min(1, this.obj.scale.y + dt * 0.8); }
}
