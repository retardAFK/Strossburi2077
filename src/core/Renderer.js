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
    // zone réellement visible (visualViewport : barres de Safari) moins les encoches / coins arrondis
    // (env(safe-area-inset-*), lus via un élément témoin) ; le cadre (#wrap) est calé dessus
    const probe = document.createElement('div');
    probe.style.cssText = 'position:fixed;left:0;top:0;visibility:hidden;pointer-events:none;' +
      'padding:env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)';
    document.body.appendChild(probe);
    const wrap = stage.parentElement;
    const fit = () => {
      const vv = window.visualViewport, cs = getComputedStyle(probe), px = v => parseFloat(v) || 0;
      const l = px(cs.paddingLeft), r = px(cs.paddingRight), t = px(cs.paddingTop), b = px(cs.paddingBottom);
      const W = (vv ? vv.width : innerWidth) - l - r, H = (vv ? vv.height : innerHeight) - t - b;
      Object.assign(wrap.style, { left: (vv ? vv.offsetLeft : 0) + l + 'px', top: (vv ? vv.offsetTop : 0) + t + 'px',
        width: W + 'px', height: H + 'px', right: 'auto', bottom: 'auto' });
      const s = Math.min(W / this.w, H / this.h);
      stage.style.width = Math.floor(this.w * s) + 'px';
      stage.style.height = Math.floor(this.h * s) + 'px';
      window.scrollTo(0, 0); // iOS : annule un éventuel décalage de la page après rotation
      window.dispatchEvent(new CustomEvent('s3k:viewport', { detail: { vv } })); // la couche tactile suit
    };
    addEventListener('resize', fit); addEventListener('orientationchange', () => setTimeout(fit, 250));
    window.visualViewport?.addEventListener('resize', fit);
    window.visualViewport?.addEventListener('scroll', fit);
    fit();
  }
  setAtmosphere(bg, fogNear, fogFar) {
    this.scene.background = new THREE.Color(bg);
    this.scene.fog = new THREE.Fog(bg, fogNear, fogFar);
  }
  render() { this.gl.render(this.scene, this.camera); }
}
