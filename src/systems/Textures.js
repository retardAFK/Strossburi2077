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
  // eau de l'Ill la nuit : bleu sombre, reflets de néons
  eau: (rx, ry) => canvasTex(32, 32, g => {
    g.fillStyle = '#0c1c3a'; g.fillRect(0, 0, 32, 32);
    for (let i = 0; i < 18; i++) { g.fillStyle = ['#16305a', '#1f5fd0', '#38f2ff', '#ff2e88'][i % 7 === 0 ? 2 + (i % 2) : i % 2]; g.fillRect(Math.random() * 30 | 0, Math.random() * 32 | 0, 3 + (Math.random() * 4 | 0), 1); }
  }, rx, ry),
  moquette: (rx, ry) => canvasTex(16, 16, g => {
    g.fillStyle = '#5a1840'; g.fillRect(0, 0, 16, 16);
    g.fillStyle = '#d8a830'; for (let i = 0; i < 16; i += 4) { g.fillRect(i, i, 2, 2); g.fillRect(15 - i, i, 2, 2); }
  }, rx, ry),
  // Place Kléber (couleurs de la planche validée decors-kleber / decor_kleber.py) : façades alsaciennes encrassées et
  // quasi noires, colombages, fenêtres presque toutes éteintes (motif 4 m × 6 m = un mur)
  kl_facade: (rx, ry) => canvasTex(64, 96, g => {
    g.fillStyle = '#2b2622'; g.fillRect(0, 0, 64, 96);
    for (let i = 0; i < 90; i++) { g.fillStyle = Math.random() < 0.5 ? '#25201d' : '#322c27'; g.fillRect(Math.random() * 64 | 0, Math.random() * 96 | 0, 2, 2); }
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
      g.fillStyle = (r + c) % 3 ? '#0c1020' : '#7a5a2a'; g.fillRect(4 + c * 16, 10 + r * 20, 8, 11);   // fenêtres (une sur trois allumée)
    }
    g.fillStyle = '#1e120a';                                                                              // colombages
    for (let c = 0; c <= 4; c++) g.fillRect(c * 16 - 1, 0, 2, 82);
    for (let r = 0; r < 4; r++) g.fillRect(0, 6 + r * 20, 64, 2);
    g.fillStyle = '#1a1414'; g.fillRect(0, 82, 64, 14);                                                  // soubassement
  }, rx, ry),
  // chalet du marché de Noël permanent : planches prune, liseré néon rose en haut
  kl_chalet: (rx, ry) => canvasTex(32, 32, g => {
    g.fillStyle = '#2a1e30'; g.fillRect(0, 0, 32, 32);
    g.fillStyle = '#22182a'; for (let x = 0; x < 32; x += 4) g.fillRect(x, 0, 1, 32);
    g.fillStyle = '#ff2e88'; g.fillRect(0, 0, 32, 2);
  }, rx, ry),
  // l'Aubette (côté nord de la place, néoclassique, Blondel 1765-1772), illuminée pour le Grand Sapin : pierre claire,
  // arcades au rez-de-chaussée, hautes fenêtres éclairées, pilastres, corniche et guirlande lumineuse (motif 4 m × 6 m)
  kl_aubette: (rx, ry) => canvasTex(64, 96, g => {
    g.fillStyle = '#b9a687'; g.fillRect(0, 0, 64, 96);
    for (let i = 0; i < 70; i++) { g.fillStyle = Math.random() < 0.5 ? '#ad9a7c' : '#c4b193'; g.fillRect(Math.random() * 64 | 0, Math.random() * 96 | 0, 2, 1); }
    g.fillStyle = '#d6c6a6'; g.fillRect(0, 0, 3, 96); g.fillRect(31, 0, 3, 60);                        // pilastres
    g.fillStyle = '#9c8a6c'; g.fillRect(0, 8, 64, 4); g.fillRect(0, 58, 64, 3);                         // corniche, bandeau
    for (const x of [8, 40]) { g.fillStyle = '#ffd890'; g.fillRect(x, 20, 14, 28); g.fillStyle = '#9c8a6c'; g.fillRect(x + 6, 20, 2, 28); } // fenêtres
    g.fillStyle = '#2a2430';                                                                            // arcades
    for (const x of [6, 38]) { g.fillRect(x, 70, 20, 26); g.beginPath(); g.arc(x + 10, 70, 10, Math.PI, 0); g.fill(); }
    g.fillStyle = '#ffe9a8'; for (let x = 2; x < 64; x += 6) g.fillRect(x, 5, 2, 2);                   // guirlande
  }, rx, ry),
  // parterre de fleurs (réaménagement de 2007) : vert sombre, fleurs claires
  kl_parterre: (rx, ry) => canvasTex(16, 16, g => {
    g.fillStyle = '#1f3a22'; g.fillRect(0, 0, 16, 16);
    for (let i = 0; i < 14; i++) { g.fillStyle = ['#2c5230', '#e8e0d0', '#d81e2c'][i % 3]; g.fillRect((i * 7) % 16, (i * 5) % 16, 2, 2); }
  }, rx, ry),
  // dalle mouillée qui reflète (motif dalle_mouillee de la planche)
  kl_dalle: (rx, ry) => canvasTex(16, 16, g => {
    for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) {
      g.fillStyle = x % 8 === 0 || y % 8 === 0 ? '#141020' : (x + y) % 11 === 0 ? '#1e1a30' : '#0c0a16'; g.fillRect(x, y, 1, 1);
    }
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
// écran géant : silhouette sans visage (tête, épaules, costard) sur fond rouge sombre à lignes de balayage
export function silhouetteTexture() {
  return canvasTex(96, 64, (g, w, h) => {
    g.fillStyle = '#2a0610'; g.fillRect(0, 0, w, h);
    for (let y = 0; y < h; y += 2) { g.fillStyle = 'rgba(255,46,136,0.10)'; g.fillRect(0, y, w, 1); }
    g.fillStyle = '#050208';
    g.beginPath(); g.arc(w / 2, 24, 10, 0, Math.PI * 2); g.fill();                    // tête
    g.beginPath(); g.moveTo(w / 2 - 26, h); g.quadraticCurveTo(w / 2 - 24, 36, w / 2, 36);
    g.quadraticCurveTo(w / 2 + 24, 36, w / 2 + 26, h); g.fill();                          // épaules
    g.fillStyle = '#ffc040'; g.fillRect(w / 2 - 1, 40, 2, h - 40);                       // cravate dorée
    g.strokeStyle = '#ff2e88'; g.lineWidth = 2; g.strokeRect(1, 1, w - 2, h - 2);
  });
}
export function graffitiTexture(text, color) {
  return canvasTex(128, 32, (g, w, h) => {
    g.clearRect(0, 0, w, h); g.textAlign = 'center'; g.font = 'bold italic 22px sans-serif';
    g.fillStyle = '#0a0a14'; g.fillText(text, w / 2 + 2, 25); g.fillStyle = color; g.fillText(text, w / 2, 23);
  });
}
