// Rendu Three.js en basse résolution, agrandi en pixels nets (look N64).
import * as THREE from 'three';
import { TUNING } from '../data/tuning.js';

export class Renderer {
  constructor(canvas, stage) {
    const R = TUNING.render;
    this.w = R.width; this.h = R.height;
    this.gl = new THREE.WebGLRenderer({ canvas, antialias: false });
    this.gl.setPixelRatio(1);
    this.gl.setSize(this.w, this.h, false);
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(R.fov, this.w / this.h, 0.1, 150);
    this.stage = stage;
    const fit = () => {
      const s = Math.min(innerWidth / this.w, innerHeight / this.h);
      stage.style.width = Math.floor(this.w * s) + 'px';
      stage.style.height = Math.floor(this.h * s) + 'px';
    };
    addEventListener('resize', fit); fit();
  }
  setAtmosphere(bg, fogNear, fogFar) {
    this.scene.background = new THREE.Color(bg);
    this.scene.fog = new THREE.Fog(bg, fogNear, fogFar);
  }
  render() { this.gl.render(this.scene, this.camera); }
}
