// Parcours du niveau 6 (le Kalt, les abords, la nuit, maquette grise) : arrêt de tram, rue La Fayette, grille → cour
// (le Kalt n'apparaît qu'en entrant dans la cour), videurs et robots-cordons du portique (gaffe-grappin : cordon tombé)
// → entrée « cour » ; palettes de la ruelle (gaffe-grappin) → arrière-cours → soupirail → entrée « cave » (secret) ;
// toit du hangar fermé ; bords fermés ; écharpe ; le niveau 7 démarre à l'entrée choisie. Puis F2 partout.
import { launch, checker } from './helpers.mjs';

const T = checker('kalt-abords');
const { browser, page, h } = await launch(T, { query: 'debug=1&level=kalt-abords&seed=1' });
const tp = (x, z, face = -Math.PI / 2) => h.run(([x, z, face]) => { const p = window.S3K.player; Object.assign(p, { x, z, face, vx: 0, vz: 0, target: null }); p.sync(); }, [x, z, face]);
const blocked = (x, z) => h.run(([x, z]) => window.S3K.collision.resolve({ x, z }, 0.4), [x, z]);
const save = () => h.run(() => JSON.parse(localStorage.getItem('s3k.save') || 'null'));
const aim = (filter, item) => h.run(([f, item]) => { const g = window.S3K; g.inventory.equip(item);
  g.player.target = g.entities.find(e => e.alive !== false && new Function('e', 'return ' + f)(e)); }, [filter, item]);

await h.start(); await h.god(); await h.skipDialogs();
T.check('départ : arrêt Lycée Couffignal', (await h.state()).room.includes('COUFFIGNAL'));
T.check('objets des niveaux précédents donnés', await h.run(() => ['boomerang', 'arc', 'gaffe'].every(i => window.S3K.inventory.has(i))));
T.check('bords fermés (parking, tram, entrepôts)', await blocked(20, -41) && await blocked(-27, 0) && await blocked(35.5, 0) && await blocked(0, 56.5));
T.check('le Kalt invisible depuis la rue', await h.run(() => !window.S3K.world.props.kalt.visible));

// la grille → l'avant-cour : le Kalt apparaît
await tp(-3, -27); await h.wait(200); await tp(-3, -12); await h.wait(400); await h.skipDialogs();
T.check('entrée dans la cour : le Kalt apparaît', await h.run(() => window.S3K.world.props.kalt.visible));
await h.run(() => { window.__ech = []; window.S3K.events.on('echarpe:trouvee', id => window.__ech.push(id)); });
await tp(8, 5.8); await h.wait(300);
T.check('écharpe de la cour (marqueur)', await h.run(() => window.__ech.includes('kalt-cour')));
// le toit : fermé
await tp(-18.5, 11.5); await h.wait(300); await h.skipDialogs();
T.check('toit du hangar : fermé (placeholder)', (await h.state()).mode === 'play');

// la cour : videurs, et le portique (robots-cordons) ; gaffe-grappin → cordon tombé → entrée « cour »
T.check('cour : 2 videurs, 2 robots-cordons', await h.run(() => window.S3K.entities.filter(e => (e.group === 'videurs' || e.group === 'portique') && e.alive).length) === 4);
await h.run(() => { for (const e of window.S3K.entities) if (e.group === 'videurs') e.takeHit(99, 0, 1, 5, null); });
T.check('portique : le cordon barre la porte', await blocked(24.4, 12));
await tp(24.5, 6);
await aim("e.isCordon && e.x < 27", 'gaffe'); await h.key('KeyF');
const stunned = await h.until(() => window.S3K.entities.some(e => e.isCordon && e.stateName === 'stunned'), 3000); await h.wait(200);
T.check('gaffe-grappin : robot-cordon étourdi, cordon tombé', stunned && await blocked(24.4, 12) === false,
  JSON.stringify(await h.run(() => window.S3K.entities.filter(e => e.isCordon).map(e => [e.x.toFixed(1), e.z.toFixed(1), e.stateName, e.box.on]))));
await tp(24.4, 11); await h.wait(100); await tp(24.4, 12.9);
T.check('porte du Kalt → fin du niveau 6, entrée « cour »', await h.until(() => window.S3K.mode === 'end', 3000) && (await save())?.entry === 'cour');

// entrée secrète : palettes de la ruelle → arrière-cours → soupirail de la cave
await page.reload(); await page.waitForFunction(() => window.S3K?.player, null, { timeout: 30000 });
await h.start(); await h.god(); await h.skipDialogs();
await tp(-3, -12); await h.wait(300); await h.skipDialogs();
T.check('ruelle bouchée par les palettes', await blocked(34, 16));
await tp(34, 8);
for (let i = 0; i < 4 && await h.run(() => window.S3K.entities.find(e => e.id === 'palettes').z > 9.5); i++) {
  await aim("e.id === 'palettes'", 'gaffe'); await h.key('KeyF'); await h.wait(1500); await h.skipDialogs();
}
await tp(34, 18); await h.wait(200);
T.check('palettes tirées au grappin : la ruelle est libre', await blocked(34, 18) === false && (await h.state()).room.includes('RUELLE'));
await tp(34, 30); await h.wait(200); await tp(20, 40); await h.wait(300);
T.check('les arrière-cours', (await h.state()).room.includes('ARRIÈRE'));
await tp(-8, 35);
T.check('soupirail → fin du niveau 6, entrée « cave »', await h.until(() => window.S3K.mode === 'end', 3000) && (await save())?.entry === 'cave');

// le niveau 7 démarre dans la cave
await page.goto(page.url().split('?')[0] + '?debug=1&seed=1');
await page.waitForFunction(() => window.S3K?.player, null, { timeout: 30000 });
await h.start(); await h.skipDialogs();
T.check('niveau 7 : arrivée dans la cave', (await h.state()).room.includes('CAVE'));
await h.run(() => localStorage.removeItem('s3k.save'));

// F2 partout
await page.goto(page.url().split('?')[0] + '?debug=1&seed=1&level=kalt-abords');
await page.waitForFunction(() => window.S3K?.player, null, { timeout: 30000 });
await h.start();
const rooms = [];
for (let i = 0; i < 4; i++) { await h.warp(); await h.wait(300); rooms.push((await h.state()).room); }
T.check('F2 : tram, rue, cour, arrière-cours', ['COUFFIGNAL', 'LA FAYETTE', 'COUR', 'ARRIÈRE'].every(r => rooms.some(x => x.includes(r))), rooms.join(' | '));
await T.finish(browser);
