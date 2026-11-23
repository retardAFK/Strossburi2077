// Le Kalt intérieur : l'étage (nouveau). La MEZZA, petite salle à explorer : sa régie lumière commande la porte de la
// cave (flèche court-circuit, proposition Cowork ; caisse de flèches à côté) ; l'écharpe est derrière la cabine DJ.
// L'ARTSPACE : expo et une artiste qui donne des indices.
export function etage(game, { T, W, E, say }) {
  let seen = false;
  E.on('kalt:etage', () => { if (!seen) { seen = true; say(['kalt.mezza']); } });
  E.on('projo:off', id => { if (id === 'regie') { W.setDoor('cave', true); game.hud.banner(...T.regieOff); } });

  E.on('debug:warp', id => {
    if (id === 'cour' || id === 'mezza' || id === 'artspace') return;
    seen = true;
    game.entities.find(e => e.id === 'regie' && e.onShort)?.onShort();
  });
}
