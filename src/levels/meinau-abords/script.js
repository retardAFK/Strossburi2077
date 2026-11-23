// Niveau 2 : la Meinau, abords du stade (2026, maquette grise). Zones ouvertes, trois façons d'entrer dans le stade
// (niveau 3), transmises au niveau suivant par la sauvegarde (completeLevel(texte, { entry })) :
//  - A : le portique du parvis, coupé une fois les stewards-robots du parvis éliminés (entrée normale) ;
//  - B : la grille côté Rhin tortu, fermée (objet requis : point ouvert du brief) ;
//  - C : l'issue de secours ouest (secret), derrière le raccourci du parking qu'ouvre la borne cachée entre les voitures.
// Répliques : data/dialogues/meinau-abords.fr.js (+ celles des stewards, meinau.fr.js).
import { BretzelBoomerang } from '../../items/BretzelBoomerang.js';

const PI = Math.PI;

export default function script(game) {
  const T = game.levelTexts, W = game.world, E = game.events, say = (ids, cb) => game.dialog.sayIds(ids, cb);

  E.on('game:start', () => {
    game.audio.music('coursive');
    // niveau lancé seul (?level=meinau-abords, sans sauvegarde) : l'Ultra a quand même le bretzel du niveau 1
    if (!game.inventory.has('boomerang')) game.inventory.give(new BretzelBoomerang(game));
    game.setCheckpoint(-38, -45, 0);
    say(['abords.arrivee.1', 'abords.arrivee.2']);
    // stewards-robots en ronde sur le parvis, devant la file des portiques
    game.spawn('steward', -12, 4, 'parvis', { face: 0, patrol: [[8, 4], [-12, 4]] });
    game.spawn('steward', 6, 7, 'parvis', { face: PI, patrol: [[-16, 7], [6, 7]] });
    game.spawn('steward', -3, -6, 'parvis', { face: 0, patrol: [[10, -6], [-14, -6]] });
  });
  // entrée A : parvis vidé → le portique est coupé
  game.onGroupCleared('parvis', () => { W.setLaser('portique', false); game.hud.banner(...T.portiqueOpen); game.setCheckpoint(-3, -4, PI / 2); });
  game.trigger([-5, -0.7, -9.2, -10.4], () => game.completeLevel(T.endA, { entry: 'A' }));
  // entrée B : la grille côté Rhin, fermée
  game.trigger([22.2, 24.4, -29, -32.6], () => { game.bubble(game.player, T.grilleB, 1.6); say(['abords.grilleB']); });
  // entrée C : la borne du parking ouvre le raccourci de l'issue de secours
  E.on('terminal:parking', () => { W.setDoor('raccourci', true); game.hud.banner(...T.raccourci); say(['abords.raccourci']); });
  game.trigger([-26, -23.8, -26.4, -31.2], () => game.completeLevel(T.endC, { entry: 'C' }));
  // PNJ du quartier
  E.on('pnj:talk', id => { if (['supporter', 'habitante', 'jardinier'].includes(id)) say([`abords.${id}`]); });

  E.on('debug:warp', id => {
    if (id === 'tram') return;
    for (const e of game.entities) if (e.group === 'parvis' && e.alive) e.takeHit(99, 0, 1, 5, null);
  });
}
