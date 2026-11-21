// Outils communs aux tests : lancement du Chrome installé (playwright-core, sans téléchargement de navigateur),
// manette simulée, lecture de l'état du jeu (window.S3K), passage des dialogues, salles suivantes (F2 en debug).
// Chaque test est un script autonome : `node tests/<nom>.test.mjs` (ou tous : `npm test`).
import { chromium } from 'playwright-core';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

export const PADS = {
  xbox: 'Xbox Wireless Controller (STANDARD GAMEPAD Vendor: 045e Product: 0b13)',
  ps: 'DualSense Wireless Controller (STANDARD GAMEPAD Vendor: 054c Product: 0ce6)'
};

// petit compteur de vérifications ; finish() ferme Chrome et rend le code de sortie
export function checker(name) {
  let failures = 0; const t0 = Date.now();
  return {
    check(label, ok, info = '') { console.log(`${ok ? 'OK   ' : 'ÉCHEC'} ${label}${info ? ' — ' + info : ''}`); if (!ok) failures++; },
    fail(label) { console.log('ÉCHEC ' + label); failures++; },
    async finish(browser) {
      await browser?.close();
      console.log(`${name} : ${failures ? failures + ' échec(s)' : 'tout passe'} (${((Date.now() - t0) / 1000).toFixed(1)} s)`);
      process.exit(failures ? 1 : 0);
    }
  };
}

// ouvre dist/index.html avec les paramètres donnés ; pad = 'xbox' | 'ps' installe une manette simulée (window.__pad)
export async function launch(T, { query = 'debug=1', pad = null } = {}) {
  const browser = await chromium.launch({ channel: process.env.CHROME_CHANNEL || 'chrome', headless: true });
  const page = await browser.newPage();
  page.on('pageerror', e => T.fail('erreur de page : ' + e.message));
  if (pad) await page.addInitScript(id => {
    window.__pad = { id, index: 0, connected: true, mapping: 'standard', timestamp: 0,
      buttons: Array.from({ length: 17 }, () => ({ pressed: false, value: 0 })), axes: [0, 0, 0, 0] };
    navigator.getGamepads = () => [window.__pad.connected ? window.__pad : null];
  }, PADS[pad]);
  await page.goto(pathToFileURL(resolve('dist/index.html')).href + '?' + query);
  await page.waitForFunction(() => window.S3K?.world && window.S3K.player, null, { timeout: 30000 });
  return { browser, page, h: helpers(page) };
}

export function helpers(page) {
  const wait = ms => page.waitForTimeout(ms);
  const h = {
    wait,
    // état résumé du jeu
    state: () => page.evaluate(() => { const g = window.S3K, p = g.player; return {
      mode: g.mode, x: p.x, z: p.z, st: p.stateName, dialog: g.dialog.active, hp: p.hp,
      room: document.querySelector('#room')?.textContent || '', caption: document.querySelector('#caption')?.textContent || '' }; }),
    run: (fn, arg) => page.evaluate(fn, arg), // exécuter du code dans la page (accès à window.S3K)
    key: async (code, ms = 80) => { await page.keyboard.down(code); await wait(ms); await page.keyboard.up(code); await wait(80); },
    // bouton de la manette simulée (indice de la disposition standard)
    btn: async (i, ms = 120) => {
      await page.evaluate(i => { const b = window.__pad.buttons[i]; b.pressed = true; b.value = 1; }, i); await wait(ms);
      await page.evaluate(i => { const b = window.__pad.buttons[i]; b.pressed = false; b.value = 0; }, i); await wait(120);
    },
    // passe les dialogues ouverts (Entrée, ou A si une manette simulée est branchée)
    skipDialogs: async (viaPad = false) => {
      for (let i = 0; i < 60 && (await h.state()).dialog; i++) viaPad ? await h.btn(0) : await h.key('Enter');
    },
    // ouverture → titre → jeu
    start: async (viaPad = false) => {
      for (let i = 0; i < 2; i++) viaPad ? await h.btn(0) : await h.key('Enter');
      await h.skipDialogs(viaPad);
    },
    // debug F2 : salle suivante (points de passage du layout)
    warp: async () => { await h.key('F2'); await wait(250); await h.skipDialogs(); },
    // attend une condition évaluée dans la page (fonction sans argument), jusqu'à ms
    until: (fn, ms = 20000) => page.waitForFunction(fn, null, { timeout: ms, polling: 100 }).then(() => true, () => false),
    // l'Ultra ne perd plus de vie (les tests de boss ne testent pas la survie)
    god: () => page.evaluate(() => { clearInterval(window.__god); window.__god = setInterval(() => { const p = window.S3K.player; p.hp = p.maxHp; }, 50); })
  };
  return h;
}
