// Test fumée du prototype meinau-ouest : le niveau se charge, se lance, le terminal se pirate, le Directeur arrive.
import { launch, checker } from './helpers.mjs';

const T = checker('meinau-ouest');
const { browser, h } = await launch(T, { query: 'level=meinau-ouest&debug=1&seed=1' });

T.check('niveau chargé', await h.run(() => window.S3K.level.layout.id) === 'meinau-ouest');
T.check('pas d\'ouverture : écran titre', (await h.state()).mode === 'title');
await h.key('Enter'); await h.skipDialogs();
T.check('partie lancée', (await h.state()).mode === 'play');

await h.key('F2'); await h.wait(200); await h.skipDialogs(); await h.key('KeyE'); await h.wait(200);
T.check('terminal piraté', await h.run(() => !window.S3K.entities.find(e => e.isTerminal).alive));
await h.skipDialogs();

// entrée du salon VIP : le Directeur de la Valorisation
await h.god();
await h.run(() => Object.assign(window.S3K.player, { x: 0, z: -57 }));
T.check('boss Directeur présent', await h.until(() => window.S3K.entities.some(e => e.isBoss && e.constructor.name === 'Directeur'), 5000));

await T.finish(browser);
