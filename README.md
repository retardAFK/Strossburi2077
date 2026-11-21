# Strasbourg 3000 — La Revanche du Marché de Noël Éternel (POC)

Beat'em up 2D pixel art. 2077 : le maire Konrad von Lebkuchen a instauré le marché de Noël éternel.
Marcel Bretzel remonte en 2026, place Kléber, pour empêcher la cuisson du Grand Kougelhopf maudit.

## Jouer
Double-cliquer sur `game/index.html` (Chrome / Edge / Firefox). Aucune installation.

- Flèches ou ZQSD : se déplacer
- J ou X : frapper (enchaîner = combo poing, poing, poing, coup de pied)
- K, C ou Espace : sauter (frapper en l'air = coup de pied sauté)
- L ou V : Tornade de Bretzel (attaque tournante, coûte 6 PV)
- Entrée : valider · P : pause · M : couper le son · manette compatible

## Contenu du niveau
- 3 zones de combat + mini-boss, place Kléber (statue de Kléber, grand sapin, chalets, tram, écran holographique du maire)
- Ennemis : lutin syndiqué (rapide), vendeur de vin chaud zombifié (lance des chopes brûlantes), cigogne-drone 3000 (bec long, attaque en piqué)
- Mini-boss : le Grand Kougelhopf (écrasement, roulade sucrée, appelle des renforts)
- Soins : bretzel (+20), flammekueche (+50)

## Assets (Blender)
Tous les sprites et le décor sont modélisés et rendus dans Blender (moteur Workbench, sans anti-aliasing,
caméra orthographique à 24 px/unité), puis assemblés en planches PNG.

Pour régénérer, dans la console Python de Blender :
```python
exec(open(r"C:\Users\mbarbe\Desktop\Stras3000\tools\build_characters.py").read())
exec(open(r"C:\Users\mbarbe\Desktop\Stras3000\tools\build_background.py").read())
```
Les scripts créent leurs propres scènes (`S3K_Sprites`, `S3K_Kleber`) et ne touchent pas à la scène ouverte.
`tools/stras3000_assets.blend` contient une copie des scènes. Les poses sont décrites en Python
(`HERO_ANIMS`, `LUTIN_ANIMS`…), `S3K_ONLY = ['hero']` permet de ne régénérer qu'un perso.

Musique et bruitages : chiptune original généré en direct (WebAudio).

---

# Prototype 3D : Donjon I, la Cathédrale (`proto3d/`)
Aventure 3D façon N64/GameCube (rendu basse résolution, low poly). Double-cliquer sur `proto3d/index.html`
(connexion internet nécessaire pour charger Three.js depuis le CDN).

- ZQSD / flèches : bouger · J / clic gauche : bâton-bretzel · Espace : roulade
- Maj / L / clic droit : verrouiller une cible (et recentrer la caméra) · E : ouvrir · Entrée : dialogues · M : son

Déroulé : la nef (lutins aérobic, pots de choucroute, coffre et clé), l'horloge astronomique (sonner les
cloches dans l'ordre des lampes), le chœur (boss : le Coq de l'horloge, qu'il faut faire charger dans un mur
pour l'étourdir avant de le frapper).

Modèles : `tools/build3d.py` dans Blender (exporte les .glb dans `proto3d/models/` et les embarque dans
`proto3d/models.js`). Les membres sont animés en code via les pivots nommés (hipN, shN, head…).
