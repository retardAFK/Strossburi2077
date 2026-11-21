// Branchement des commandes tactiles sur le jeu : quand les afficher, et ce que font les boutons
// contextuels (AGIR suit les indications 'hud:prompt', BRETZEL apparaît quand on a un objet).
import { Touch } from './core/Touch.js';
import { TEXTS } from './data/texts.fr.js';

// tactile si l'écran principal est tactile (téléphone, tablette) ; ?touch=1 / ?touch=0 pour forcer
export function touchWanted(params) {
  const p = params.get('touch');
  if (p !== null) return p !== '0';
  return matchMedia('(pointer: coarse)').matches || (navigator.maxTouchPoints > 0 && !matchMedia('(pointer: fine)').matches);
}

// Safari iOS ignore « user-scalable=no » : on bloque nous-mêmes le pincement, le double-tap et le défilement
function blockZoom() {
  const stop = e => e.preventDefault();
  for (const ev of ['gesturestart', 'gesturechange', 'gestureend', 'dblclick']) document.addEventListener(ev, stop, { passive: false });
  // la page ne défile ni ne zoome jamais (sauf l'écran d'installation, qui peut défiler sur petit écran)
  const inInstall = e => !!e.target.closest?.('#install');
  document.addEventListener('touchmove', e => { if (e.touches.length > 1 || !inInstall(e)) e.preventDefault(); }, { passive: false });
  document.addEventListener('touchstart', e => { if (e.touches.length > 1) e.preventDefault(); }, { passive: false });
  let lastEnd = 0; // double-tap rapide : pas de zoom (les boutons de l'écran d'installation restent cliquables)
  document.addEventListener('touchend', e => { const now = Date.now(); if (now - lastEnd < 350 && !inInstall(e)) e.preventDefault(); lastEnd = now; }, { passive: false });
}

export function setupTouch(game, dom) {
  const T = TEXTS.touch;
  blockZoom();
  const touch = new Touch(game.input, {
    labels: T.buttons, rotateText: T.rotate,
    onFirstInput: () => game.audio.unlock(),
    // toucher l'écran (sans glisser) : valider le titre et les dialogues, passer les cinématiques, reprendre la pause
    tapAction: () => {
      if (game.mode === 'title' || game.mode === 'cutscene') return 'ok';
      if (game.mode === 'paused') return 'pause';
      if (game.dialog.active) return 'ok';
      return null;
    }
  });
  // AGIR : visible seulement quand quelque chose est à portée, avec l'action en clair (« pirater »...)
  const holders = new Set();
  game.events.on('hud:prompt', (src, text) => {
    if (text) { holders.add(src); touch.setLabel('use', String(text).replace(/^(\{use\}|E)\s*:\s*/i, '').toUpperCase()); }
    else holders.delete(src);
    touch.setVisible('use', holders.size > 0);
  });
  game.events.on('inventory:changed', item => touch.setVisible('throw', !!item));
  // hors du jeu (titre, cinématique, pause, fin) : on ne garde que le bouton pause et le toucher
  // (et pendant un dialogue, pour ne pas cacher la boîte de texte : on touche l'écran pour avancer)
  setInterval(() => touch.root.classList.toggle('idle', game.mode !== 'play' || game.dialog.active), 100);
  game.touch = touch;
  return touch;
}
