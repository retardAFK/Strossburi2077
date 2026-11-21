// Chef d'orchestre : boucle fixe 60 Hz, scènes (titre / jeu / fin), liste d'entités,
// petites API utilisées par les scripts de niveau (spawn, déclencheurs, groupes, dialogues).
import { Renderer } from './core/Renderer.js';
import { Input } from './core/Input.js';
import { Audio } from './core/Audio.js';
import { Assets } from './core/Assets.js';
import { Events } from './core/Events.js';
import { Collision } from './core/Collision.js';
import { Camera } from './core/Camera.js';
import { Combat } from './systems/Combat.js';
import { Dialog } from './systems/Dialog.js';
import { Hud } from './systems/Hud.js';
import { Particles } from './systems/Particles.js';
import { World } from './systems/World.js';
import { Fx } from './systems/Fx.js';
import { Cutscene } from './systems/Cutscene.js';
import { Inventory } from './systems/Inventory.js';
import { Prompts } from './systems/Prompts.js';
import { Menus } from './systems/Menus.js';
import { Ultra } from './entities/player/Ultra.js';
import { Pickup } from './entities/props/Pickup.js';
import { TEXTS } from './data/texts.fr.js';
import { TUNING } from './data/tuning.js';
import { rng } from './core/Random.js';

const STEP = 1 / 60;

export class Game {
  constructor(dom, entityTypes) {
    this.dom = dom; this.types = entityTypes; this.texts = TEXTS;
    this.renderer = new Renderer(dom.canvas, dom.stage);
    this.audio = new Audio();
    this.input = new Input(dom.stage, () => this.audio.unlock());
    this.assets = new Assets();
    this.events = new Events();
    this.collision = new Collision();
    this.camera = new Camera(this.renderer.camera);
    this.combat = new Combat(this);
    this.dialog = new Dialog(this, dom.dialog);
    this.prompts = new Prompts(this, TEXTS.glyphs); // indications qui suivent l'appareil (clavier / Xbox / PlayStation)
    this.hud = new Hud(dom.hud, this.events, TEXTS, t => this.prompts.format(t));
    this.particles = new Particles(this.renderer.scene);
    this.fx = new Fx(this, dom.bubbles);
    this.inventory = new Inventory(this);
    this.menus = new Menus(this, dom); // textes des menus avec icônes + écran « Commandes »
    this.lastShake = 0;
    this.entities = []; this.triggers = []; this.groups = {};
    this.mode = 'title'; this.time = 0; this.dt = STEP; this.hitstop = 0; this.zone = null;
  }

  async start(models, level) {
    await this.assets.load(models);
    this.level = level;
    this.levelTexts = level.texts || TEXTS; // salles, panneaux : textes propres au niveau
    this.world = new World(this, level.layout);
    this.world.build();
    const s = level.layout.playerStart;
    this.player = new Ultra(this, s);
    this.entities.push(this.player);
    this.camera.snapBehind(s.face);
    for (const p of level.layout.terminals || []) this.add(new this.types.terminal(this, p));
    for (const p of level.layout.switches || []) this.add(new this.types[p.type || 'borne'](this, p));
    for (const p of level.layout.plaques || []) this.add(new this.types.plaque(this, p));
    for (const o of level.layout.objects || []) this.add(new this.types[o.type](this, o)); // barque, leviers, PNJ...
    this.events.on('enemy:killed', e => this.onEnemyKilled(e));
    level.script(this);
    this.startOpening(level.layout.opening);
    let last = performance.now(), acc = 0;
    const frame = now => {
      acc += Math.min(0.1, (now - last) / 1000); last = now;
      this.input.pollGamepad();
      while (acc >= STEP) { this.tick(STEP); this.input.endTick(); acc -= STEP; }
      this.renderer.render();
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }

  // ---------------------------------------------------------------- API pour les niveaux
  add(e) { this.entities.push(e); return e; }
  spawn(type, x, z, group, extra = {}) {
    const e = this.add(new this.types[type](this, { x, z, face: extra.face ?? Math.PI / 2, group, ...extra }));
    if (group) this.groups[group] = (this.groups[group] || 0) + 1;
    this.particles.burst(x, 1, z, 10, 0xff2e88, 4);
    return e;
  }
  onGroupCleared(group, fn) { this.events.on('group:cleared:' + group, fn); }
  trigger(rect, fn, once = true) { const t = { rect, fn, once, done: false }; this.triggers.push(t); return t; }
  say(lines, cb) { this.dialog.say(lines, cb); }
  bubble(ent, text, dur) { this.fx.bubble(ent, text, dur); }
  shockwave(x, z, r) { this.fx.shockwave(x, z, r); }
  stars(target) { this.fx.stars(target); }
  setCheckpoint(x, z, face) { this.player.checkpoint = { x, z, face }; }
  hittables() { return this.entities.filter(e => e !== this.player && e.alive && (e.isEnemy || e.isProjectile || e.isTerminal || e.isSwitch)); }

  onEnemyKilled(e) {
    if (e.group && this.groups[e.group] && --this.groups[e.group] === 0) this.events.emit('group:cleared:' + e.group);
    if (!e.isBoss && rng() < TUNING.pickup.dropChance) this.add(new Pickup(this, { x: e.x, z: e.z }));
  }

  // ouverture du niveau (cinématique avant l'écran titre), passable avec Entrée
  startOpening(o) {
    const lines = this.levelTexts.opening;
    if (!o || !lines) return;
    this.dom.title.style.display = 'none';
    this.playCutscene(o.shots, lines.map((txt, i) => ({ at: o.captionAt[i] ?? 0, txt })), () => {
      this.mode = 'title'; this.dom.title.style.display = 'flex';
    });
  }
  // cinématique : plans de caméra + sous-titres, passable avec Entrée. À la fin, retour au jeu
  // (sauf si onDone enchaîne autre chose : une autre cinématique, l'écran de fin...).
  playCutscene(shots, captions, onDone) {
    this.mode = 'cutscene'; this.cutsceneDone = onDone;
    this.fx.clearBubbles(); this.events.emit('hud:cinema', true);
    this.dom.skip.innerHTML = this.prompts.format(this.texts.skip); this.dom.skip.style.display = 'block';
    this.cutscene = new Cutscene(this, { shots, captions });
  }
  endCutscene() {
    this.cutscene.end(); this.cutscene = null; this.dom.skip.style.display = 'none';
    const f = this.cutsceneDone; this.cutsceneDone = null; this.mode = 'play';
    this.events.emit('hud:cinema', false);
    f?.();
  }

  // ---------------------------------------------------------------- boucle
  tick(dt) {
    this.time += dt; this.dt = dt;
    const I = this.input;
    if (I.pressed.mute) this.audio.toggleMute();
    this.prompts.update(); // appareil courant (émet 'input:device', 'input:notice')
    if (I.pressed.rumble) { I.toggleRumble(); this.menus.render(); }
    this.rumbleOnShake();
    if (this.menus.update()) return; // écran « Commandes » ouvert (titre / pause)
    // manette débranchée en pleine partie : pause automatique
    if (I.pressed.padLost && this.mode === 'play') { this.mode = 'paused'; this.dom.pause.style.display = 'flex'; return; }
    if (this.mode === 'cutscene') {
      this.world.update(dt, this.time); this.particles.update(dt); this.cutscene.update(dt);
      if (this.cutscene.done || I.pressed.ok) this.endCutscene();
      return;
    }
    if (this.mode === 'title') {
      this.renderer.camera.position.set(Math.sin(this.time * 0.25) * 3, 3, -4 + Math.cos(this.time * 0.25) * 2);
      this.renderer.camera.lookAt(0, 2, -14);
      this.world.update(dt, this.time);
      if (I.pressed.ok || I.pressed.attack || I.pressed.capture) { this.mode = 'play'; this.dom.title.style.display = 'none'; this.events.emit('game:start'); }
      return;
    }
    // pause : P / Échap, ou souris libérée par le navigateur ; reprise : P / Échap ou clic (qui recapture la souris)
    if (this.mode === 'paused') { if (I.pressed.pause || I.pressed.capture || I.pressed.back) { this.mode = 'play'; this.dom.pause.style.display = 'none'; } return; }
    if ((I.pressed.pause || I.pressed.release) && this.mode === 'play' && !this.dialog.active) {
      this.mode = 'paused'; this.dom.pause.style.display = 'flex'; I.releasePointer(); return;
    }

    const talking = this.dialog.update(dt, I);
    this.world.update(dt, this.time);
    this.particles.update(dt);
    if (this.hitstop > 0) { this.hitstop -= dt; this.updateCamera(dt); return; }
    if (!talking && this.mode === 'play') {
      this.inventory.update();
      for (const e of this.entities) if (!e.removed) e.update(dt);
      this.entities = this.entities.filter(e => !e.removed);
      this.checkTriggers();
      this.checkZone();
    }
    this.fx.update(dt, this.player.target);
    this.updateCamera(dt);
    this.hud.setHealth(Math.max(0, this.player.hp), this.player.maxHp);
  }
  // vibration de la manette quand la caméra tremble fort (coup reçu, impacts de boss)
  rumbleOnShake() {
    const s = this.camera.shake, P = TUNING.pad;
    if (s >= P.rumbleFrom && s > this.lastShake + 0.05) this.input.rumble(Math.min(1, s), P.rumbleMs);
    this.lastShake = s;
  }
  updateCamera(dt) {
    const boss = this.entities.find(e => e.isBoss && e.alive);
    const focus = this.player.target || (boss && this.zone?.boss ? boss : null);
    this.camera.update(dt, this.player, focus, this.player.stateName === 'run', this.input.look, this.input.stick);
  }
  checkTriggers() {
    const p = this.player;
    for (const t of this.triggers) {
      if (t.done) continue;
      if (Collision.inRect(p.x, p.z, t.rect)) { t.fn(); if (t.once) t.done = true; }
    }
  }
  checkZone() {
    const p = this.player;
    const z = this.level.layout.zones.find(z => Collision.inRect(p.x, p.z, z.rect));
    if (z && z !== this.zone) {
      this.zone = z; this.hud.setRoom((this.levelTexts.rooms || this.texts.rooms)[z.id] || '');
      this.camera.bounds = z.cam || z.rect; this.camera.boss = !!z.boss;
      this.events.emit('zone:' + z.id);
    }
  }
  // fin de niveau (ou de démo) : [titre, sous-titre]
  win(text = this.texts.victory) {
    this.mode = 'end'; this.input.releasePointer(); this.audio.music(null); this.audio.play('win');
    const [t, sub] = text;
    this.dom.end.querySelector('h1').textContent = t; this.dom.end.querySelector('p').textContent = sub;
    this.dom.end.style.display = 'flex';
  }
}
