// Faisceau visible au sol (lampe de vigile, scanner de chariot, caméra) : un éventail translucide, pour que le joueur
// voie où regarde le guetteur. Rendu seulement : la règle « vu / pas vu » est dans systems/Stealth.js.
// L'éventail pointe vers +X local : tourner le groupe (rotation.y = angle de visée) suffit.
import * as THREE from 'three';

export function beamMesh(range, cos, color, opacity = 0.22) {
  const half = Math.acos(cos), seg = 10, pos = [0, 0, 0];
  for (let i = 0; i <= seg; i++) { const a = -half + (2 * half * i) / seg; pos.push(Math.cos(a) * range, 0, -Math.sin(a) * range); }
  const idx = [];
  for (let i = 1; i <= seg; i++) idx.push(0, i, i + 1);
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx);
  const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color, transparent: true, opacity, depthWrite: false, side: THREE.DoubleSide, fog: false }));
  m.position.y = 0.06;
  return m;
}

// alerte : le faisceau passe au rouge (vu) ou reprend sa couleur
export function beamAlert(m, on, color) { m.material.color.setHex(on ? 0xff1a3c : color); m.material.opacity = on ? 0.35 : 0.22; }
