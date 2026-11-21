// Kit de sbire générique + flèches spéciales, dans le bac à sable (graine ?seed=1) :
// patrouille → alerte → poursuite → attaque télégraphiée qui touche ; étourdi ; aveuglé par la fumée ; tireur ; mort.
// Caisses de flèches (E, réapparition) ; effets bannière / fumigène / court-circuit / enflammée.
import { launch, checker } from './helpers.mjs';

const T = checker('sbire');
const { browser, h } = await launch(T, { query: 'level=bac-a-sable&debug=1&seed=1' });
await h.start();
const G = (fn, arg) => h.run(fn, arg);
const st = () => G(() => window.__s.stateName);

// un sbire (placeholder) loin de l'Ultra, dos tourné : il patrouille
await G(() => { const g = window.S3K, p = g.player; window.__alerts = 0; g.events.on('sbire:alert', () => window.__alerts++);
  window.__s = g.spawn('sbire', p.x + 9, p.z, 'socle', { kind: 'test', face: 0 }); window.__st0 = window.__s.stateName; });
T.check('patrouille au départ', await G(() => window.__st0) === 'patrol');
T.check('placeholder gris étiqueté (pas de design)', await G(() => !!window.__s.obj.userData.placeholder));

// il voit l'Ultra → alerte (« ! ») → poursuite → attaque télégraphiée qui touche
await G(() => { const s = window.__s, p = window.S3K.player; s.faceTo(p.x, p.z); window.__hp0 = p.hp; });
T.check('alerte quand il voit l\'Ultra', await h.until(() => window.__alerts > 0, 3000));
T.check('télégraphie avant d\'attaquer', await h.until(() => window.__s.stateName === 'windup', 6000));
T.check('l\'attaque touche l\'Ultra', await h.until(() => window.S3K.player.hp < window.__hp0, 3000));
await h.god();

// étourdi, puis il reprend
await G(() => window.__s.stun(1));
T.check('étourdi (stun)', await st() === 'stunned');
T.check('reprend après l\'étourdissement', await h.until(() => window.__s.stateName !== 'stunned', 3000));

// flèches spéciales : l'arc est donné par le bac à sable ; caisse de fumigènes → munitions
await G(() => { const g = window.S3K, p = g.player; window.__c = g.add(new (g.types.caisse)(g, { x: p.x - 1.5, z: p.z, arrow: 'fumigene' })); });
await h.wait(200); await h.key('KeyE'); await h.wait(200);
T.check('caisse : 3 flèches fumigènes', await G(() => window.S3K.inventory.items.arc.ammo.fumigene) === 3);
T.check('caisse vide puis réapparaît', await G(() => !window.__c.obj.visible) && await h.until(() => window.__c.obj.visible, 12000));

// fumigène sur le sbire : nuage, il est aveuglé et perd l'Ultra de vue
await G(() => { const g = window.S3K, arc = g.inventory.items.arc, s = window.__s, p = g.player;
  arc.select('fumigene'); p.target = s; });
await G(() => { window.__fx = []; window.S3K.events.on('arrow:effect', id => window.__fx.push(id)); });
await G(() => { const g = window.S3K; g.inventory.items.arc.cd = 0; g.inventory.items.arc.use(); });
T.check('fumigène : nuage de fumée', await h.until(() => window.S3K.entities.some(e => e.isSmoke), 3000));
T.check('fumigène : sbire aveuglé', await h.until(() => window.__s.blinded > 0, 3000));
T.check('aveuglé : il perd l\'Ultra et repatrouille', await h.until(() => window.__s.stateName === 'patrol', 6000));

// court-circuit : appareil proche coupé, sbire robot étourdi ; enflammée : brûle ; bannière : accroche
await G(() => { const g = window.S3K, s = window.__s;
  window.__dev = { x: s.x + 1, z: s.z, r: 0.4, alive: true, removed: false, shorted: 0, burnt: 0, hooked: 0, hookable: true,
    onShort() { this.shorted++; }, onFire() { this.burnt++; }, hook() { this.hooked++; }, update() {}, takeHit() {} };
  g.entities.push(window.__dev); });
const fire = type => G(type => { const g = window.S3K, arc = g.inventory.items.arc, s = window.__s, p = g.player;
  arc.give(type, 1); arc.select(type); arc.cd = 0; p.target = type === 'banniere' ? window.__dev : s; arc.use(); }, type);
await fire('court_circuit');
T.check('court-circuit : appareil coupé', await h.until(() => window.__dev.shorted > 0, 3000));
T.check('court-circuit : sbire robot étourdi', await h.until(() => window.__s.stateName === 'stunned', 3000));
await fire('enflammee');
T.check('enflammée : brûle ce qui est proche', await h.until(() => window.__dev.burnt > 0, 3000));
await fire('banniere');
T.check('bannière : accroche sur un crochet', await h.until(() => window.__dev.hooked > 0, 3000));
T.check('événements arrow:effect', JSON.stringify(await G(() => [...new Set(window.__fx)].sort())) === JSON.stringify(['banniere', 'court_circuit', 'enflammee', 'fumigene']));

// tireur : il tire à distance ; puis mort
// (on dissipe la fumée des étapes précédentes : sinon l'Ultra, caché dedans, n'est pas vu ; CI plus lente)
await G(() => { const g = window.S3K; for (const e of [...g.entities]) if (e.isSmoke) e.remove();
  window.__s.takeHit(99, 0, 1, 5, null); Object.assign(g.player, { x: g.player.x - 6 }); });
await h.wait(300);
await G(() => { const g = window.S3K, p = g.player; window.__t = g.spawn('sbire', p.x + 7, p.z, 'socle2', { kind: 'testTireur' }); window.__t.faceTo(p.x, p.z); window.__nproj = g.entities.filter(e => e.isProjectile && !e.isPlayerShot).length; });
T.check('tireur : tire un projectile', await h.until(() => window.S3K.entities.filter(e => e.isProjectile && !e.isPlayerShot).length > window.__nproj, 8000));
await G(() => { for (const s of [window.__s, window.__t]) if (s.alive) s.takeHit(99, 0, 1, 5, null); });
T.check('mort : retiré du monde', await h.until(() => window.__s.removed && window.__t.removed, 3000));

await T.finish(browser);
