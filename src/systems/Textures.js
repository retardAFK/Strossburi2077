// Textures procédurales en pixels (canvas) : sols, murs, panneaux holo, graffitis.
// Une entrée de TEX = une matière utilisable par les layouts (floors[].tex, walls[][4]).
import * as THREE from 'three';

export function canvasTex(w, h, draw, rx = 1, ry = 1) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  t.magFilter = t.minFilter = THREE.NearestFilter;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(rx, ry);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
export const TEX = {
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
  // Petite France : pavés de grès, grès rose des Vosges, carrelage de food court
  paves: (rx, ry) => canvasTex(32, 32, g => {
    g.fillStyle = '#2c2630'; g.fillRect(0, 0, 32, 32);
    for (let y = 0; y < 32; y += 4) for (let x = (y / 4) % 2 * 2; x < 34; x += 4) {
      g.fillStyle = ['#6a5a5e', '#5e5054', '#73636a'][(x * 7 + y * 3) % 3]; g.fillRect(x, y, 3, 3);
      g.fillStyle = '#8a787c'; g.fillRect(x, y, 3, 1);
    }
  }, rx, ry),
  gres: (rx, ry) => canvasTex(32, 32, g => {
    g.fillStyle = '#b4646a'; g.fillRect(0, 0, 32, 32);
    for (let i = 0; i < 40; i++) { g.fillStyle = Math.random() < 0.5 ? '#a8585e' : '#c0727a'; g.fillRect(Math.random() * 32 | 0, Math.random() * 32 | 0, 2, 2); }
    g.fillStyle = '#7a3c42'; for (let y = 0; y < 32; y += 8) { g.fillRect(0, y, 32, 1); g.fillRect((y / 8) % 2 * 16, y, 1, 8); }
  }, rx, ry),
  carrelage: (rx, ry) => canvasTex(16, 16, g => {   // dalles de 1 m (4 par motif), une rose sur huit
    g.fillStyle = '#d6d0e0'; g.fillRect(0, 0, 16, 16);
    g.fillStyle = '#b8b0c8'; for (let i = 0; i < 16; i += 4) for (let j = (i / 4) % 2 * 4; j < 16; j += 8) g.fillRect(j, i, 4, 4);
    g.fillStyle = '#e05a9c'; g.fillRect(4, 4, 4, 4);
    g.fillStyle = '#8a8298'; for (let i = 0; i < 16; i += 4) { g.fillRect(0, i, 16, 1); g.fillRect(i, 0, 1, 16); }
  }, rx, ry),
  moquette: (rx, ry) => canvasTex(16, 16, g => {
    g.fillStyle = '#5a1840'; g.fillRect(0, 0, 16, 16);
    g.fillStyle = '#d8a830'; for (let i = 0; i < 16; i += 4) { g.fillRect(i, i, 2, 2); g.fillRect(15 - i, i, 2, 2); }
  }, rx, ry)
};

export function adTexture(l1, l2, hue) {
  return canvasTex(128, 64, (g, w, h) => {
    g.fillStyle = '#0a0c24'; g.fillRect(0, 0, w, h);
    for (let y = 0; y < h; y += 2) { g.fillStyle = 'rgba(255,255,255,0.04)'; g.fillRect(0, y, w, 1); }
    g.strokeStyle = hue; g.lineWidth = 3; g.strokeRect(2, 2, w - 4, h - 4);
    g.textAlign = 'center'; g.fillStyle = hue; g.font = 'bold 15px monospace'; g.fillText(l1, w / 2, 27, w - 10);
    g.fillStyle = '#ffffff'; g.font = 'bold 10px monospace'; g.fillText(l2, w / 2, 47, w - 10);
  });
}
export function graffitiTexture(text, color) {
  return canvasTex(128, 32, (g, w, h) => {
    g.clearRect(0, 0, w, h); g.textAlign = 'center'; g.font = 'bold italic 22px sans-serif';
    g.fillStyle = '#0a0a14'; g.fillText(text, w / 2 + 2, 25); g.fillStyle = color; g.fillText(text, w / 2, 23);
  });
}
