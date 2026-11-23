// Arc-Drapeau et changement d'objet, dans le bac à sable (?level=bac-a-sable&debug=1) :
// objets donnés, Tab / croix pour changer, tir droit devant, tir sur cible verrouillée, visée (LB) + tir (RB),
// cadence, roulade qui annule la visée, munitions des flèches spéciales, HUD et boutons tactiles.
import { launch, checker } from './helpers.mjs';

const T = checker('arc-drapeau');

// 1. hors debug, le bac à sable n'est pas accessible
{
  const { browser, h } = await launch(T, { query: 'level=bac-a-sable' });
  T.check('sans debug : niveau par défaut', await h.run(() => window.S3K.level.layout.id) === 'petite-france');
  await browser.close();
}

const { browser, page, h } = await launch(T, { query: 'level=bac-a-sable&debug=1&seed=1', pad: 'xbox' });
const S = () => h.run(() => { const g = window.S3K, a = g.inventory.items.arc;
  return { eq: g.inventory.equipped?.id, order: g.inventory.order.join(','), aiming: g.player.aiming, arrows: g.entities.filter(e => e.isArrow).length,
    item: document.querySelector('#item').innerText, cd: a.cd, arrow: a.arrow, target: g.player.target?.constructor.name || null }; });
const hits = id => h.run(id => window.S3K.entities.find(e => e.id === id).hits, id);
const place = (x, z, face) => h.run(([x, z, face]) => { const g = window.S3K, p = g.player;
  Object.assign(p, { x, z, face, vx: 0, vz: 0, target: null }); g.camera.snapBehind(face); }, [x, z, face]);
const towards = (x, z, tx, tz) => place(x, z, Math.atan2(-(tz - z), tx - x));
const pad = (i, on) => h.run(([i, on]) => { const b = window.__pad.buttons[i]; b.pressed = on; b.value = on ? 1 : 0; }, [i, on]);

T.check('bac à sable chargé', await h.run(() => window.S3K.level.layout.id) === 'bac-a-sable');
await h.start();
let s = await S();
T.check('bretzel et arc donnés, arc équipé', s.order === 'boomerang,arc' && s.eq === 'arc', s.order + ' / ' + s.eq);
T.check('HUD : arc, flèches illimitées', /ARC-DRAPEAU/.test(s.item) && /∞/.test(s.item), s.item.replace(/\n/g, ' | '));

// 2. changer d'objet : Tab (clavier), croix haut / bas (manette)
await h.key('Tab'); s = await S(); T.check('Tab : bretzel équipé', s.eq === 'boomerang' && /BRETZEL/.test(s.item), s.eq);
await h.key('Tab'); s = await S(); T.check('Tab : retour à l\'arc', s.eq === 'arc', s.eq);
await h.btn(12); s = await S(); T.check('croix haut : objet suivant', s.eq === 'boomerang', s.eq);
await h.btn(13); s = await S(); T.check('croix bas : objet précédent', s.eq === 'arc', s.eq);

// 3. tir droit devant (F) sur le mannequin proche, puis cadence
await towards(-6, -2, -6, -10);
await h.key('KeyF', 40);
T.check('F : une flèche part', (await S()).arrows === 1);
await h.key('KeyF', 40);
T.check('cadence : pas de 2e flèche avant 0,6 s', (await S()).arrows <= 1);
T.check('la flèche touche le mannequin', await h.until(() => window.S3K.entities.find(e => e.id === 'proche').hits > 0, 3000));
T.check('touché par une flèche', await h.run(() => window.S3K.entities.find(e => e.id === 'proche').lastFrom) === 'arrow');

// 4. verrouillage d'une cible (accrochée seulement avec l'arc) puis tir
await towards(0, -19, 0, -24); await h.wait(100);
await h.key('KeyL'); s = await S();
T.check('arc : la cible-TPE se verrouille', s.target === 'Cible', String(s.target));
await h.wait(700); await h.key('KeyF', 40);
T.check('flèche sur cible verrouillée : elle s\'allume', await h.until(() => window.S3K.entities.some(e => e.isTarget && e.lit), 3000));
await h.key('KeyL');
await h.key('Tab'); await h.key('KeyL'); s = await S();
T.check('bretzel : la cible ne se verrouille pas', s.target !== 'Cible', String(s.target));
await h.key('Tab');

// 5. visée à la manette : LB maintenu, la caméra passe à l'épaule, on vise le mannequin lointain, RB tire
await towards(9, -6, 9, -30); await h.wait(150);
await pad(4, true); await h.wait(300);
s = await S(); T.check('LB : visée', s.aiming === true);
T.check('réticule affiché', await h.run(() => document.querySelector('#hud').classList.contains('aim')));
const before = await hits('loin');
// la caméra d'épaule est décalée : on oriente la visée (comme le ferait la souris) vers le mannequin
for (let i = 0; i < 3; i++) {
  await h.run(() => { const c = window.S3K.camera, m = window.S3K.entities.find(e => e.id === 'loin');
    const dx = m.x - c.pos.x, dy = 1.2 - c.pos.y, dz = m.z - c.pos.z;
    c.yaw = Math.atan2(-dx, -dz); c.aimPitch = Math.atan2(dy, Math.hypot(dx, dz)); });
  await h.wait(250);
}
await h.btn(5, 60);
T.check('RB en visée : touche le mannequin à 24 m', await h.until(() => window.S3K.entities.find(e => e.id === 'loin').hits > 0, 3000), `avant ${before}`);
// visée à courte distance : la flèche part vers ce qui est sous le réticule, malgré le décalage de la caméra d'épaule
// (avant, elle visait un point fixe à 25 m dans l'axe de la caméra et passait à côté des cibles proches)
const nearBefore = await hits('proche'); await h.run(n => { window.__nb = n; }, nearBefore);
await h.run(() => { const p = window.S3K.player; Object.assign(p, { x: -6, z: -2, face: Math.PI / 2 }); p.sync(); });
await h.wait(400);
for (let i = 0; i < 3; i++) {
  await h.run(() => { const c = window.S3K.camera, m = window.S3K.entities.find(e => e.id === 'proche');
    const dx = m.x - c.pos.x, dy = 1.2 - c.pos.y, dz = m.z - c.pos.z;
    c.yaw = Math.atan2(-dx, -dz); c.aimPitch = Math.atan2(dy, Math.hypot(dx, dz)); });
  await h.wait(250);
}
await h.until(() => window.S3K.inventory.items.arc.ready, 3000);
await h.btn(5, 60);
T.check('RB en visée : touche le mannequin proche (8 m) visé au réticule', await h.until(() => window.S3K.entities.find(e => e.id === 'proche').hits > window.__nb, 3000), `avant ${nearBefore}`);
// marche lente en visée
const z0 = (await h.state()).z;
await h.run(() => { window.__pad.axes[1] = -1; }); await h.wait(500); await h.run(() => { window.__pad.axes[1] = 0; });
const slow = z0 - (await h.state()).z;
await h.btn(0, 60); s = await S();
T.check('A (roulade) annule la visée', s.aiming === false);
await pad(4, false); await h.wait(300);
const z1 = (await h.state()).z;
await h.run(() => { window.__pad.axes[1] = -1; }); await h.wait(500); await h.run(() => { window.__pad.axes[1] = 0; });
const fast = z1 - (await h.state()).z;
T.check('en visée, l\'Ultra marche moins vite', slow > 0.3 && slow < fast * 0.7, `${slow.toFixed(2)} m contre ${fast.toFixed(2)} m`);
T.check('réticule masqué', !(await h.run(() => document.querySelector('#hud').classList.contains('aim'))));

// 6. munitions : flèches spéciales désactivées par défaut ; activées pour le test, elles se comptent
s = await S(); T.check('croix droite sans flèche spéciale : reste en flèches simples', (await h.btn(15), (await S()).arrow) === 'simple');
await h.run(() => { const a = window.S3K.inventory.items.arc; a.types.find(t => t.id === 'banniere').enabled = true; a.give('banniere', 2); });
await h.btn(15); s = await S();
T.check('croix droite : flèche bannière choisie, HUD « BANNIÈRE 2 »', s.arrow === 'banniere' && /BANNI.RE 2/.test(s.item), s.item.replace(/\n/g, ' | '));
await h.key('KeyF', 40); await h.wait(700); await h.key('KeyF', 40); await h.wait(200); s = await S();
T.check('2 tirs : plus de bannières, retour aux flèches simples', s.arrow === 'simple' && /FLÈCHES ∞/.test(s.item), s.item.replace(/\n/g, ' | '));
await h.run(() => window.S3K.inventory.items.arc.give('banniere', 50));
T.check('munitions plafonnées à 10', await h.run(() => window.S3K.inventory.items.arc.ammo.banniere) === 10);
await h.key('Digit2'); T.check('touche 2 : 2e flèche', (await S()).arrow === 'banniere');
await h.key('Digit1'); T.check('touche 1 : flèches simples', (await S()).arrow === 'simple');

// 7. l'écharpe frappe toujours hors visée ; arc rangé dans le dos
await towards(-6, -8.6, -6, -10); const e0 = await hits('proche');
await h.key('KeyJ', 40); await h.wait(300);
T.check('J hors visée : coup d\'écharpe', await hits('proche') > e0);
T.check('arc dans le dos hors visée', await h.run(() => window.S3K.inventory.items.arc.model.parent?.name.startsWith('torso')));
await browser.close();

// 8. tactile : boutons ⇄, VISER (à bascule) et ARC
{
  const { browser, h } = await launch(T, { query: 'level=bac-a-sable&debug=1&seed=1&touch=1&install=0' });
  await h.start();
  const vis = a => h.run(a => getComputedStyle(document.querySelector('#touch .t-' + a)).display !== 'none', a);
  T.check('tactile : boutons ⇄ et VISER visibles', await vis('switch') && await vis('aim'));
  T.check('tactile : bouton d\'objet « ARC »', await h.run(() => document.querySelector('#touch .t-throw').innerText) === 'ARC');
  await h.run(() => { const t = window.S3K.touch; t.press('aim'); t.release('aim'); }); await h.wait(200);
  T.check('tactile : VISER bascule la visée', await h.run(() => window.S3K.player.aiming));
  await h.run(() => { const t = window.S3K.touch; t.press('aim'); t.release('aim'); }); await h.wait(200);
  T.check('tactile : VISER à nouveau la coupe', !(await h.run(() => window.S3K.player.aiming)));
  await h.run(() => { const t = window.S3K.touch; t.press('switch'); t.release('switch'); }); await h.wait(200);
  T.check('tactile : ⇄ → BRETZEL, VISER masqué', await h.run(() => document.querySelector('#touch .t-throw').innerText) === 'BRETZEL' && !(await vis('aim')));
  await T.finish(browser);
}
