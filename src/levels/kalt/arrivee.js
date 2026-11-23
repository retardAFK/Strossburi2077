// Le Kalt intérieur : l'arrivée et les escaliers. L'Ultra entre par la cour (porte du Main) ou par le soupirail de la
// cave, selon la sauvegarde du niveau 6 (entry ; « cour » par défaut, ex. ?level=kalt). Les étages sont posés côte à
// côte dans le monde : les escaliers téléportent entre le rez-de-chaussée et l'étage (layout.stairs).
import { ITEMS } from '../../items/index.js';

export function arrivee(game, { E, L, say }) {
  const place = at => { const p = game.player; Object.assign(p, { x: at.x, z: at.z, face: at.face, vx: 0, vz: 0, target: null }); p.sync(); };
  E.on('game:start', () => {
    // niveau lancé seul : l'Ultra a les objets des niveaux précédents
    for (const id of ['boomerang', 'arc', 'gaffe']) if (!game.inventory.has(id)) game.inventory.give(new ITEMS[id](game));
    game.inventory.equip('arc');
    const id = game.progress?.fromSave?.entry, at = L.entries[id] || L.entries.cour;
    place(at); game.setCheckpoint(at.x, at.z, at.face);
    E.emit(id === 'cave' ? 'kalt:cave' : 'kalt:main');
  });
  // escaliers (déclencheurs permanents : on arrive hors de la zone de l'escalier d'en face)
  game.trigger(L.stairs.up.rect, () => { place(L.stairs.up.to); E.emit('kalt:etage'); }, false);
  game.trigger(L.stairs.down.rect, () => place(L.stairs.down.to), false);
  E.on('pnj:talk', id => { if (id === 'artiste') say(['kalt.artiste']); });
}
