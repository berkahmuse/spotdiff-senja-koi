// Senja di Taman Koi — game state and rules.
// One job: the state machine (title → playing → levelDone → gameDone /
// gameOver), clicks, scoring, timer, hints and level flow. Drawing lives in
// render.js, scenes in scenes.js, sounds in audio.js.
import { PANEL, SCORING, TIMER } from './config.js';
import { LEVELS, levelById } from './differences.js';
import { drawScene } from './scenes.js';
import { SoundBank } from './audio.js';
import { Renderer } from './render.js';

export class Game {
  constructor(canvas, input) {
    this.canvas = canvas;
    this.input = input;
    this.sounds = new SoundBank();
    this.renderer = new Renderer(canvas, this);
    this.state = 'title';
    this.levelIndex = 0;
    this.level = LEVELS[0];
    this.found = new Set();
    this.score = 0;
    this.combo = 0;
    this.timeLeft = 0;
    this.hintsLeft = SCORING.hintMaxPerLevel;
    this.particles = [];
    this.wrongFlash = null;
    this.hintPulse = null;
    this.panelLeft = null;
    this.panelRight = null;
    this.titleScene = null;
    this.lastLevelScore = 0;
    this.lastTimeBonus = 0;
    this.lastTickSecond = -1;
    this.startedAt = null;
    this.buildTitleScene();
    this.prepareLevel(0, false);
  }

  buildTitleScene() {
    const off = document.createElement('canvas');
    off.width = PANEL.w;
    off.height = PANEL.h;
    drawScene(off.getContext('2d'), 1, new Set(), PANEL.w, PANEL.h);
    this.titleScene = off;
  }

  // Render both panels for a level into offscreen canvases: the left one
  // plain, the right one with every difference applied.
  prepareLevel(index, resetScore) {
    this.levelIndex = index;
    this.level = LEVELS[index];
    this.found = new Set();
    this.combo = 0;
    this.timeLeft = this.level.timeLimitSec;
    this.hintsLeft = SCORING.hintMaxPerLevel;
    this.particles = [];
    this.wrongFlash = null;
    this.hintPulse = null;
    this.lastTickSecond = -1;
    if (resetScore) this.score = 0;
    const left = document.createElement('canvas');
    left.width = PANEL.w;
    left.height = PANEL.h;
    drawScene(left.getContext('2d'), this.level.id, new Set(), PANEL.w, PANEL.h);
    const right = document.createElement('canvas');
    right.width = PANEL.w;
    right.height = PANEL.h;
    drawScene(
      right.getContext('2d'),
      this.level.id,
      new Set(this.level.diffs.map((d) => d.id)),
      PANEL.w,
      PANEL.h,
    );
    this.panelLeft = left;
    this.panelRight = right;
  }

  startGame(levelIndex = 0) {
    this.score = 0;
    this.prepareLevel(levelIndex, false);
    this.state = 'playing';
    this.startedAt = Date.now();
    this.sounds.ensure();
    this.sounds.click();
  }

  selectLevel(id) {
    if (this.state !== 'title') return;
    this.startGame(id - 1);
  }

  restartLevel() {
    if (this.state === 'title') return;
    const keep = this.score - this.levelScoreSoFar();
    this.score = Math.max(0, keep);
    this.prepareLevel(this.levelIndex, false);
    this.state = 'playing';
    this.sounds.click();
  }

  levelScoreSoFar() {
    return this.found.size * SCORING.findBase;
  }

  togglePause() {
    if (this.state === 'playing') {
      this.state = 'paused';
    } else if (this.state === 'paused') {
      this.state = 'playing';
    }
  }

  toggleMute() {
    this.sounds.ensure();
    this.sounds.toggleMute();
  }

  // A click anywhere: buttons first, then the panels, in every state.
  clickAt(point) {
    const boxes = this.renderer.buttons();
    for (const [name, box] of Object.entries(boxes)) {
      if (point.x >= box.x && point.x <= box.x + box.w && point.y >= box.y && point.y <= box.y + box.h) {
        this.pressButton(name);
        return;
      }
    }
    if (this.state !== 'playing') return;
    const panel = this.panelAt(point);
    if (!panel) return;
    this.markAt(point, panel);
  }

  pressButton(name) {
    this.sounds.ensure();
    if (name === 'play') return this.startGame(0);
    if (name === 'level1' || name === 'level2' || name === 'level3') {
      return this.startGame(Number(name.slice(-1)) - 1);
    }
    if (name === 'hint') return this.useHint();
    if (name === 'restart') return this.restartLevel();
    if (name === 'mute') return this.toggleMute();
    if (name === 'next') return this.nextLevel();
    if (name === 'again') return this.startGame(0);
  }

  panelAt(point) {
    if (point.y < PANEL.y || point.y > PANEL.y + PANEL.h) return null;
    if (point.x >= PANEL.leftX && point.x <= PANEL.leftX + PANEL.w) {
      return { x: point.x - PANEL.leftX, y: point.y - PANEL.y };
    }
    if (point.x >= PANEL.rightX && point.x <= PANEL.rightX + PANEL.w) {
      return { x: point.x - PANEL.rightX, y: point.y - PANEL.y };
    }
    return null;
  }

  // `point` is whole-canvas pixels; `local` is panel-local pixels.
  markAt(point, local) {
    const hit = this.level.diffs.find((d) => {
      if (this.found.has(d.id)) return false;
      const dx = local.x - d.x;
      const dy = local.y - d.y;
      return dx * dx + dy * dy <= d.r * d.r;
    });
    if (hit) {
      this.found.add(hit.id);
      this.combo = Math.min(this.combo + 1, SCORING.comboMax);
      const gained = SCORING.findBase + (this.combo - 1) * SCORING.comboStep;
      this.score += gained;
      this.sounds.find();
      this.spawnSparkles(point.x, point.y);
      if (this.found.size === this.level.diffs.length) this.completeLevel();
    } else {
      this.combo = 0;
      this.score = Math.max(0, this.score - SCORING.wrongPenalty);
      this.timeLeft = Math.max(0, this.timeLeft - SCORING.wrongTimePenaltySec);
      this.sounds.wrong();
      this.wrongFlash = { x: point.x, y: point.y, until: performance.now() + 700 };
    }
  }

  spawnSparkles(canvasX, canvasY) {
    const now = performance.now();
    const colours = ['#ffd166', '#ff9ecf', '#7bd88a', '#ffffff'];
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      const speed = 30 + (i % 4) * 14;
      this.particles.push({
        x: canvasX,
        y: canvasY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 12,
        size: 3 + (i % 3),
        color: colours[i % colours.length],
        born: now,
        life: 650,
      });
    }
  }

  useHint() {
    if (this.state !== 'playing' || this.hintsLeft <= 0) return;
    const remaining = this.level.diffs.filter((d) => !this.found.has(d.id));
    if (remaining.length === 0) return;
    this.hintsLeft -= 1;
    this.score = Math.max(0, this.score - SCORING.hintCost);
    const diff = remaining[Math.floor(Math.random() * remaining.length)];
    this.hintPulse = { diff, until: performance.now() + 2600 };
    this.sounds.hint();
  }

  completeLevel() {
    this.lastTimeBonus = Math.round(this.timeLeft) * SCORING.timeBonusPerSec;
    this.lastLevelScore = this.levelScoreSoFar() + this.lastTimeBonus;
    this.score += this.lastTimeBonus;
    this.sounds.win();
    this.state = 'levelDone';
  }

  nextLevel() {
    if (this.levelIndex + 1 < LEVELS.length) {
      this.prepareLevel(this.levelIndex + 1, false);
      this.state = 'playing';
    } else {
      this.state = 'gameDone';
    }
    this.sounds.click();
  }

  // Called every animation frame with the frame time in milliseconds.
  update(now) {
    // Drop finished particles.
    if (this.particles.length > 0) {
      this.particles = this.particles.filter((p) => now - p.born < p.life);
    }
    if (this.state !== 'playing') {
      this.lastFrameAt = now;
      return;
    }
    const dt = this.lastFrameAt == null ? 0 : Math.min(0.1, (now - this.lastFrameAt) / 1000);
    this.lastFrameAt = now;
    const prev = this.timeLeft;
    this.timeLeft = Math.max(0, this.timeLeft - dt);
    const whole = Math.ceil(this.timeLeft);
    if (whole <= TIMER.dangerAtSec && whole !== this.lastTickSecond && whole > 0) {
      this.lastTickSecond = whole;
      this.sounds.tick();
    }
    if (prev > 0 && this.timeLeft === 0) {
      this.state = 'gameOver';
      this.sounds.wrong();
    }
  }

  render(now) {
    this.renderer.render(now);
  }
}
