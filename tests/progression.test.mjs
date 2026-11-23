// Progression de la campagne (partie 1) : sauvegarde locale, reprise (« Continuer »), objets et flèches rendus,
// nouvelle partie, et ?level=<id> (debug) qui ne touche jamais à la sauvegarde. Ordre de la campagne vérifié.
import { launch, checker } from './helpers.mjs';
import { Progress } from '../src/systems/Progress.js';

const T = checker('progression');

// ordre : le niveau suivant d'un id, et la fin de campagne
const P = new Progress({}, { id: 'petite-france', campaign: ['petite-france', 'meinau', 'port-rhin'], items: {} });
T.check('campagne : niveau suivant', P.next === 'meinau');
T.check('campagne : dernier niveau → pas de suivant', new Progress({}, { id: 'port-rhin', campaign: ['meinau', 'port-rhin'], items: {} }).next === null);

const { browser, page, h } = await launch(T, { query: 'debug=1&seed=1' });
const goTitle = () => page.waitForFunction(() => window.S3K?.world && (window.S3K.mode === 'title' || window.S3K.mode === 'cutscene'), null, { timeout: 30000 });
const goText = () => h.run(() => document.querySelector('#title .go').textContent + '|' + [...document.querySelectorAll('#title .go img')].map(i => i.alt).join(','));

// 1) première partie : pas de sauvegarde, titre « JOUER »
T.check('sans sauvegarde : pas de reprise', await h.run(() => !window.S3K.progress.fromSave));
await h.start(); for (let i = 0; i < 5; i++) await h.warp(); // jusqu'au barrage : le bretzel est en main
T.check('bretzel en main avant la fin du niveau', await h.run(() => window.S3K.inventory.has('boomerang')));

// 2) fin du niveau 1 : sauvegarde (objets compris)
await h.run(() => window.S3K.completeLevel(['FIN', 'test']));
const save = await h.run(() => JSON.parse(localStorage.getItem('s3k.save')));
T.check('fin de niveau : sauvegarde écrite', save && save.level && Array.isArray(save.items), JSON.stringify(save));
T.check('sauvegarde : objets emportés', save.items.includes('boomerang'));
T.check('sauvegarde : niveau suivant = la Meinau (abords du stade)', save.level === 'meinau-abords', save.level);
T.check('fin de niveau : écran de fin', (await h.state()).mode === 'end');

// 3) rechargement sans ?level : on reprend la sauvegarde, titre « CONTINUER », bretzel rendu
await h.run(() => { const s = JSON.parse(localStorage.getItem('s3k.save')); s.items.push('arc'); s.ammo = { fumigene: 5 }; localStorage.setItem('s3k.save', JSON.stringify(s)); });
await page.goto(page.url().replace(/[?&]level=[^&]*/, '')); await goTitle();
await h.key('Enter'); await h.wait(300); // passe l'ouverture
T.check('reprise : titre « Continuer »', /CONTINUER/.test(await goText()), await goText());
await h.key('Enter'); await h.skipDialogs();
const inv = await h.run(() => { const i = window.S3K.inventory; return { b: i.has('boomerang'), a: i.has('arc'), fum: i.items.arc?.ammo.fumigene }; });
T.check('reprise : bretzel rendu', inv.b);
T.check('reprise : Arc-Drapeau et flèches fumigènes rendus', inv.a && inv.fum === 5, JSON.stringify(inv));

// 4) ?level=<id> en debug : la sauvegarde n'est ni lue ni écrite
await page.goto(page.url().split('?')[0] + '?level=bac-a-sable&debug=1&seed=1'); await goTitle();
T.check('?level= : la sauvegarde est ignorée', await h.run(() => !window.S3K.progress.fromSave));
await h.start(); await h.run(() => window.S3K.completeLevel(['FIN', 'bac']));
T.check('?level= hors campagne : sauvegarde inchangée', await h.run(() => JSON.parse(localStorage.getItem('s3k.save')).level) === save.level);

// 5) nouvelle partie depuis le titre : sauvegarde effacée
await page.goto(page.url().split('?')[0] + '?debug=1&seed=1'); await goTitle();
await h.key('Enter'); await h.wait(300);
await h.key('Backspace'); await page.waitForLoadState('load'); await goTitle(); await h.wait(300);
T.check('nouvelle partie : sauvegarde effacée', await h.run(() => localStorage.getItem('s3k.save') === null));
T.check('nouvelle partie : titre « Jouer »', !/CONTINUER/.test(await goText()));

await T.finish(browser);
