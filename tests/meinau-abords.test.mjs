// Parcours du niveau 2 (la Meinau, abords du stade, maquette grise) : arrivée au tram Krimmeri, stewards du parvis →
// portique A coupé → entrée A (fin du niveau, la sauvegarde retient l'entrée) ; borne cachée du parking → raccourci →
// issue de secours C (entrée secrète) ; grille B fermée (objet requis) ; écharpe-marqueur ramassée ; bords fermés ;
// le niveau 3 commence à l'entrée choisie (sauvegarde). Puis F2 partout.
import { launch, checker } from './helpers.mjs';

const T = checker('meinau-abords');
const { browser, page, h } = await launch(T, { query: 'debug=1&level=meinau-abords&seed=1' });
const tp = (x, z, face = 0) => h.run(([x, z, face]) => { const p = window.S3K.player; Object.assign(p, { x, z, face, vx: 0, vz: 0 }); p.sync(); }, [x, z, face]);
const blocked = (x, z) => h.run(([x, z]) => window.S3K.collision.resolve({ x, z }, 0.4), [x, z]);
const save = () => h.run(() => JSON.parse(localStorage.getItem('s3k.save') || 'null'));

await h.start(); await h.god(); await h.skipDialogs();
T.check('départ : arrivée du tram Krimmeri', (await h.state()).room.includes('TRAM'));
T.check('bretzel donné (niveau lancé seul)', await h.run(() => window.S3K.inventory.has('boomerang')));
T.check('3 stewards-robots en ronde sur le parvis', await h.run(() => window.S3K.entities.filter(e => e.group === 'parvis' && e.alive).length) === 3);
T.check('maquette grise : étiquettes des zones', await h.run(() => window.S3K.renderer.scene.children.filter(o => o.isSprite).length) >= 12);
T.check('bords fermés (voie ferrée, maisons, avenue, grillage)', await blocked(0, -52.8) && await blocked(0, 52.8) && await blocked(-55, 0) && await blocked(62.5, 0));
T.check('tribune sud : gros volume, on ne la traverse pas', await blocked(-0.8, -12));

// écharpe du parking (marqueur)
await h.run(() => { window.__ech = []; window.S3K.events.on('echarpe:trouvee', id => window.__ech.push(id)); });
await tp(-39.5, -18.2); await h.wait(300);
T.check('écharpe du parking ramassée (marqueur)', await h.run(() => window.__ech.includes('abords-parking')));

// grille B : fermée sans accréditation
await tp(23.3, -28.5, Math.PI / 2); await h.wait(300); await h.skipDialogs();
T.check('berge : la grille B reste fermée sans accréditation', await h.run(() => window.S3K.world.doors.grilleB.box.on) && (await h.state()).mode === 'play');
// la passerelle enjambe le Rhin tortu ; à côté, l'eau arrête l'Ultra
T.check('passerelle : on traverse le Rhin tortu', await blocked(25.5, -21.4) === false && await blocked(25.5, -24) && await blocked(25.5, -18.5));
await tp(30, -21.4); await h.wait(300);
T.check('terrain vague : le chantier BlingCo, gardé', (await h.state()).room.includes('CHANTIER BLINGCO') &&
  await h.run(() => window.S3K.entities.filter(e => e.group === 'chantier' && e.alive).length) === 2);

// entrée C : la borne cachée du parking ouvre le raccourci
T.check('issue de secours C : raccourci fermé', await blocked(-26.4, -28.8));
await tp(-46.2, -27, Math.PI); await h.wait(200); await h.key('KeyE'); await h.wait(300); await h.skipDialogs();
T.check('borne du parking (E) : raccourci ouvert', await blocked(-26.4, -28.8) === false);

// entrée A : parvis vidé → portique coupé → dans le stade
T.check('portique A fermé tant que le parvis est gardé', await h.run(() => window.S3K.world.lasers.portique.on));
await h.key('F3'); await h.wait(1200);
T.check('parvis vidé → portique A coupé', await h.run(() => !window.S3K.world.lasers.portique.on));
await tp(-2.9, -7.5, Math.PI / 2); await h.wait(200); await tp(-2.9, -9.6, Math.PI / 2);
T.check('entrée A → fin du niveau 2', await h.until(() => window.S3K.mode === 'end', 3000));
T.check('sauvegarde : niveau 3, entrée A', (await save())?.level === 'meinau' && (await save())?.entry === 'A', JSON.stringify(await save()));

// entrée C (on recommence le niveau)
await page.reload(); await page.waitForFunction(() => window.S3K?.player, null, { timeout: 30000 });
await h.start(); await h.god(); await h.skipDialogs();
await tp(-46.2, -27, Math.PI); await h.wait(200); await h.key('KeyE'); await h.wait(300); await h.skipDialogs();
await tp(-27.5, -28.8); await h.wait(200); await tp(-25, -28.8);
T.check('issue de secours C → fin du niveau 2', await h.until(() => window.S3K.mode === 'end', 3000));
T.check('sauvegarde : entrée C', (await save())?.entry === 'C');

// entrée B : l'accréditation du chantier (E) ouvre la grille côté Rhin
await page.reload(); await page.waitForFunction(() => window.S3K?.player, null, { timeout: 30000 });
await h.start(); await h.god(); await h.skipDialogs();
await tp(48, -31.8, -Math.PI / 2); await h.wait(200); await h.key('KeyE'); await h.wait(300); await h.skipDialogs();
T.check('accréditation BlingCo prise (E)', await h.run(() => !window.S3K.entities.some(e => e.isQuestItem && e.alive)));
await tp(23.3, -27, Math.PI / 2); await h.wait(200); await tp(23.3, -30, Math.PI / 2); await h.wait(300); await h.skipDialogs();
T.check('accréditation : la grille B s\'ouvre', await h.run(() => !window.S3K.world.doors.grilleB.box.on));
await tp(23.3, -34.2, Math.PI / 2);
T.check('grille B → fin du niveau 2, entrée B', await h.until(() => window.S3K.mode === 'end', 3000) && (await save())?.entry === 'B');

// le niveau 3 reprend la sauvegarde : l'Ultra entre par la grille B (coursive est)
await page.goto(page.url().split('?')[0] + '?debug=1&seed=1');
await page.waitForFunction(() => window.S3K?.player, null, { timeout: 30000 });
await h.start(); await h.skipDialogs();
const pb = await h.state();
T.check('niveau 3 : arrivée par la grille B (coursive est)', Math.hypot(pb.x - 32.4, pb.z + 16.8) < 1, `${pb.x.toFixed(1)}, ${pb.z.toFixed(1)}`);
await h.run(() => localStorage.setItem('s3k.save', JSON.stringify({ level: 'meinau', items: ['boomerang'], ammo: {}, companions: [], entry: 'C' })));

// le niveau 3 reprend la sauvegarde : l'Ultra entre par l'issue de secours C (coursive ouest)
await page.goto(page.url().split('?')[0] + '?debug=1&seed=1');
await page.waitForFunction(() => window.S3K?.player, null, { timeout: 30000 });
await h.start(); await h.skipDialogs();
const p = await h.state();
T.check('niveau 3 : arrivée par l\'issue C (coursive ouest)', Math.hypot(p.x + 32.4, p.z + 4.8) < 1 && p.room.includes('COURSIVE'), `${p.x.toFixed(1)}, ${p.z.toFixed(1)} ${p.room}`);
await h.run(() => localStorage.removeItem('s3k.save'));

// F2 partout
await page.goto(page.url().split('?')[0] + '?debug=1&seed=1&level=meinau-abords');
await page.waitForFunction(() => window.S3K?.player, null, { timeout: 30000 });
await h.start();
const rooms = [];
for (let i = 0; i < 6; i++) { await h.warp(); await h.wait(300); rooms.push((await h.state()).room); }
T.check('F2 : tram, parking, parvis, berge, parc, terrain vague', ['TRAM', 'PARKING', 'PARVIS', 'BERGE', 'PARC', 'TERRAIN'].every(r => rooms.some(x => x.includes(r))), rooms.join(' | '));
await T.finish(browser);
