// Parcours du niveau 1 (Petite France), de l'ouverture au cliffhanger, via les points de passage (F2 en debug) :
// chaque salle se charge, aucune erreur de page, 4 plaques, une plaque se restaure, le coffre donne le
// bretzel-boomerang, l'ASR-67 apparaît, la fin affiche « À suivre ».
import { launch, checker } from './helpers.mjs';

const T = checker('niveau1');
const { browser, h } = await launch(T, { query: 'debug=1&seed=1' });

// ouverture (cinématique) → titre → jeu
const s0 = await h.state();
T.check('ouverture : cinématique au lancement', s0.mode === 'cutscene');
T.check('ouverture : premier sous-titre', await h.until(() => document.querySelector('#caption').textContent.length > 0, 5000));
await h.start();
T.check('salle 1 : partie lancée', (await h.state()).mode === 'play');
T.check('salle 1 : nom de la zone affiché', (await h.state()).room.length > 0, (await h.state()).room);
T.check('4 plaques historiques', await h.run(() => window.S3K.entities.filter(e => e.isPlaque).length) === 4);

// plaque 1 : E → glitch → vraie histoire
await h.run(() => { const g = window.S3K, pl = g.entities.find(e => e.isPlaque); Object.assign(g.player, { x: pl.x + 1.2, z: pl.z }); });
await h.wait(200); await h.key('KeyE');
T.check('plaque 1 restaurée', await h.until(() => window.S3K.entities.find(e => e.isPlaque).state === 'truth', 4000));
await h.skipDialogs();

// salles suivantes, une par une
const warps = await h.run(() => window.S3K.level.layout.warps.map(w => w.id));
for (const id of warps) {
  await h.warp();
  const s = await h.state(), at = await h.run(() => window.S3K.level.layout.warps[window.S3K.debugWarp]?.id);
  T.check(`F2 → ${id}`, at === id && s.mode === 'play' && s.room.length > 0, `${s.room} (${s.x.toFixed(0)}, ${s.z.toFixed(0)})`);
  if (id === 'salle3-coffre') { // le coffre du péage donne le bretzel-boomerang
    await h.run(() => { const g = window.S3K, c = g.entities.find(e => e.isChest); Object.assign(g.player, { x: c.x + c.fx * 1.5, z: c.z + c.fz * 1.5 }); });
    await h.wait(250); await h.key('KeyE'); await h.wait(300);
    T.check('coffre → bretzel-boomerang', await h.run(() => window.S3K.inventory.has('boomerang')));
    await h.skipDialogs();
  }
}

// salle 5 : l'ASR-67 est là ; on le termine pour voir le cliffhanger
T.check('salle 5 : ASR-67 présent', await h.run(() => window.S3K.entities.some(e => e.isBoss && e.constructor.name === 'Asr67')));
await h.god();
await h.run(() => { const b = window.S3K.entities.find(e => e.isBoss); b.hp = 0.5; b.setState('stunned'); b.takeHit(1, 0, -1, 1, window.S3K.player); });
await h.wait(300); await h.skipDialogs(); await h.wait(300); await h.skipDialogs();
T.check('cliffhanger : cinématique lancée', (await h.state()).mode === 'cutscene');
T.check('fin : « À suivre »', await h.until(() => document.querySelector('#caption').textContent.startsWith('À suivre'), 40000));
T.check('fin : écran de fin', await h.until(() => window.S3K.mode === 'end', 30000));

await T.finish(browser);
