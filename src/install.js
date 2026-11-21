// Écran d'accueil sur mobile : propose d'installer le jeu (PWA) avant de jouer dans le navigateur.
//  - Android / Chrome : vrai bouton INSTALLER (événement 'beforeinstallprompt').
//  - iPhone / iPad : pas d'API d'installation, donc un mini-tuto « Partager → Sur l'écran d'accueil ».
//  - Déjà installé (lancé depuis l'icône) : rien ne s'affiche.
import { TEXTS } from './data/texts.fr.js';

let deferred = null; // invite d'installation Android, gardée pour le bouton
addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferred = e; document.querySelector('#install .i-go')?.removeAttribute('hidden'); });

export const isStandalone = () =>
  matchMedia('(display-mode: fullscreen)').matches || matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
const isIOS = () => /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

const SHARE = '<svg viewBox="0 0 20 20" class="i-share" aria-label="Partager"><path d="M10 2v11M6 6l4-4 4 4" fill="none" stroke="currentColor" stroke-width="2"/><path d="M5 9H3v9h14V9h-2" fill="none" stroke="currentColor" stroke-width="2"/></svg>';

// Affiche l'écran si on est sur mobile, dans le navigateur, et qu'on ne l'a pas déjà écarté dans cette session.
export function showInstallScreen(onFirstInput) {
  if (isStandalone()) return;
  try { if (sessionStorage.getItem('s3k.browser') === '1') return; } catch (e) { /* pas de stockage */ }
  const T = TEXTS.touch.install, ios = isIOS();
  const steps = (ios ? T.ios : T.android).map(s => `<li>${s.replace('{share}', SHARE)}</li>`).join('');
  const el = document.createElement('div');
  el.id = 'install';
  el.innerHTML = `<div class="i-box">
      <img src="icon-192.png" alt="" class="i-icon">
      <h2>${T.title}</h2><p>${T.why}</p>
      <button class="i-go" ${ios || !deferred ? 'hidden' : ''}>${T.install}</button>
      <ol class="i-steps">${steps}</ol>
      <button class="i-browser">${T.browser}</button>
    </div>`;
  document.body.appendChild(el);
  const close = () => { el.remove(); try { sessionStorage.setItem('s3k.browser', '1'); } catch (e) { /* pas de stockage */ } };
  el.querySelector('.i-browser').addEventListener('click', () => { onFirstInput?.(); close(); });
  el.querySelector('.i-go').addEventListener('click', async () => {
    if (!deferred) return;
    deferred.prompt();
    const r = await deferred.userChoice.catch(() => null); deferred = null;
    if (r?.outcome === 'accepted') close();
  });
  addEventListener('appinstalled', close);
}
