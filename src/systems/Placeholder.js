// Placeholder gris étiqueté (aucun design inventé) : silhouette low poly neutre + étiquette flottante « PLACEHOLDER <nom> ».
// Sert aux personnages, sbires ou objets dont la fiche n'est pas encore dans docs/designs/. Compatible avec pose()
// (userData.J vide) et avec l'état de mort des ennemis (on rétrécit le groupe).
import * as THREE from 'three';

export function placeholder(game, label, height = 1.9, kind = 'perso') {
  const g = new THREE.Group(), grey = new THREE.MeshLambertMaterial({ color: 0x8a8d98, flatShading: true });
  const model = new THREE.Group(); g.add(model);
  if (kind === 'boite') {
    const b = new THREE.Mesh(new THREE.BoxGeometry(height, height * 0.7, height * 0.8), grey); b.position.y = height * 0.35; model.add(b);
  } else {
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.34, height * 0.62, 6), grey); body.position.y = height * 0.42; model.add(body);
    const head = new THREE.Mesh(new THREE.IcosahedronGeometry(0.22, 0), grey); head.position.y = height * 0.86; model.add(head);
  }
  g.add(placeholderLabel(game, label, height + 0.35));
  g.userData = { J: {}, model, placeholder: true };
  return g;
}

// étiquette « PLACEHOLDER <nom> » : texte en canvas sur un sprite (toujours face caméra), à la hauteur y
export function placeholderLabel(game, label, y) {
  const c = document.createElement('canvas'); c.width = 256; c.height = 40;
  const x = c.getContext('2d');
  x.fillStyle = 'rgba(20,20,30,0.75)'; x.fillRect(0, 0, 256, 40);
  x.fillStyle = '#ffd23f'; x.font = 'bold 18px monospace'; x.textAlign = 'center'; x.textBaseline = 'middle';
  x.fillText(`${game.texts.placeholder} ${label}`.slice(0, 24), 128, 21);
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(c), fog: false, depthTest: false }));
  s.scale.set(1.6, 0.25, 1); s.position.y = y;
  return s;
}
