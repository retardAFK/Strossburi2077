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

export function setupTouch(game, dom) {
  const T = TEXTS.touch;
  const touch = new Touch(game.input, {
    labels: T.buttons, rotateText: T.rotate,
    onFirstInput: () => game.audio.unlock(),
    // toucher l'écran (sans glisser) : valider le titre et les dialogues, passer les cinématiques, reprendre la pause
    tapAction: () => {
      if (game.mode === 'title') return 'ok';
      // cinématique : pas dans la première seconde (un toucher qui finissait un dialogue ne la saute pas)
      if (game.mode === 'cutscene') return game.cutscene?.t > 1 ? 'ok' : null;
      if (game.mode === 'paused') return 'pause';
      if (game.dialog.active) return 'ok';
      return null;
    }
  });
  // AGIR : visible seulement quand quelque chose est à portée, avec l'action en clair (« pirater »...)
  const holders = new Set();
  game.events.on('hud:prompt', (src, text) => {
    if (text) { holders.add(src); touch.setLabel('use', String(text).replace(/^E\s*:\s*/i, '').toUpperCase()); }
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
