// Chargement des modèles Blender (.glb embarqués dans le build) et instanciation.
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class Assets {
  constructor() { this.protos = {}; this.loader = new GLTFLoader(); }

  // sources : { nom: Uint8Array }
  async load(sources) {
    await Promise.all(Object.entries(sources).map(([name, bytes]) => new Promise((ok, ko) => {
      const buf = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
      this.loader.parse(buf, '', g => {
        g.scene.traverse(o => {
          if (!o.isMesh) return;
          const old = o.material;
          if (old.map) { old.map.magFilter = old.map.minFilter = THREE.NearestFilter; }
          o.material = new THREE.MeshLambertMaterial({ color: old.color, map: old.map || null, flatShading: true });
        });
        this.protos[name] = g.scene; ok();
      }, ko);
    })));
  }

  // Clone indépendant + index des pivots nommés (hipN, shN, head...) dans userData.J
  instance(name) {
    const model = this.protos[name].clone(true);
    model.traverse(m => { if (m.isMesh) m.material = m.material.clone(); });
    const J = {};
    model.traverse(n => { const k = n.name.replace(/\d+$/, ''); if (!J[k]) J[k] = n; });
    const holder = new THREE.Group();
    holder.add(model);
    holder.userData = { J, model };
    return holder;
  }
}
