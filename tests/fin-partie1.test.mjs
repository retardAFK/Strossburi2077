// Fin de la partie 1 : la campagne va de la Petite France à la place Kléber ; finir Kléber (dernier niveau) affiche
// « Partie 1 terminée — À suivre » et les crédits ; {ok} → retour au titre, qui propose de rejouer Kléber ou une nouvelle
// partie ; la sauvegarde note la partie terminée.
import { launch, checker } from './helpers.mjs';
import { readFileSync } from 'node:fs';
import { TEXTS } from '../src/data/texts.fr.js';

const T = checker('fin-partie1');
// (levels/index.js importe des .glb : on lit l'ordre de la campagne dans le texte)
const CAMPAIGN_ORDER = JSON.parse(readFileSync('src/levels/index.js', 'utf8').match(/CAMPAIGN_ORDER = (\[.*?\])/)[1].replace(/'/g, '"'));
T.check('campagne de la partie 1 : 7 niveaux (Meinau en abords + intérieur), Kléber en dernier', CAMPAIGN_ORDER.length === 7 && CAMPAIGN_ORDER.at(-1) === 'kleber', CAMPAIGN_ORDER.join(' → '));

const { browser, page, h } = await launch(T, { query: 'debug=1&seed=1' });
const goTitle = () => page.waitForFunction(() => window.S3K?.world && (window.S3K.mode === 'title' || window.S3K.mode === 'cutscene'), null, { timeout: 30000 });
const goText = () => h.run(() => document.querySelector('#title .go').textContent);

// une partie sauvegardée arrivée à la place Kléber
await h.run(() => localStorage.setItem('s3k.save', JSON.stringify({ level: 'kleber', items: ['boomerang', 'arc', 'gaffe'], ammo: {}, companions: [] })));
await page.goto(page.url()); await goTitle();
await h.key('Enter'); await h.wait(300); // passe l'ouverture
T.check('titre : « Continuer » (Kléber)', /CONTINUER/.test(await goText()) && await h.run(() => window.S3K.level.layout.id === 'kleber'));
await h.key('Enter'); await h.skipDialogs();

// fin du dernier niveau → écran de fin de partie
await h.run(t => window.S3K.completeLevel(t), TEXTS.kleber.end);
const end = await h.run(() => { const e = document.querySelector('#end'); return { shown: e.style.display, h1: e.querySelector('h1').textContent,
  sub: e.querySelector('p').textContent, credits: e.querySelector('.credits')?.textContent || '', next: e.querySelector('.next')?.textContent || '' }; });
T.check('écran « Partie 1 terminée — À suivre »', end.shown === 'flex' && end.h1 === TEXTS.partEnd.title && end.sub === TEXTS.partEnd.sub, JSON.stringify(end));
T.check('crédits courts', TEXTS.partEnd.credits.every(c => end.credits.includes(c)) && end.credits.includes(TEXTS.title));
T.check('indication : retour au titre', /RETOUR AU TITRE/.test(end.next), end.next);
T.check('sauvegarde : partie 1 terminée', await h.run(() => JSON.parse(localStorage.getItem('s3k.save')).done === true));

// {ok} → titre : rejouer Kléber ou nouvelle partie
await h.key('Enter'); await page.waitForLoadState('load'); await goTitle();
await h.key('Enter'); await h.wait(300);
T.check('retour au titre : rejouer la place Kléber', /REJOUER/.test(await goText()), await goText());
await h.key('Backspace'); await page.waitForLoadState('load'); await goTitle(); await h.wait(300);
T.check('nouvelle partie : sauvegarde effacée', await h.run(() => localStorage.getItem('s3k.save') === null));
await T.finish(browser);
