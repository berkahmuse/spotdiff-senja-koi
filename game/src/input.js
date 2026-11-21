// Senja di Taman Koi — mouse and keyboard input.
// One job: translate browser events into game actions. The mouse clicks on a
// panel; the keyboard moves a crosshair (arrows/WASD, Shift for a big step)
// and marks with Enter/Space, asks for a hint with H, restarts with R,
// mutes with M, and pauses with Esc/P.
import { CURSOR_STEP, CURSOR_STEP_FAST, PANEL } from './config.js';

export class Input {
  constructor(canvas, game) {
    this.canvas = canvas;
    this.game = game;
    // Keyboard cursor, in whole-canvas pixels. Starts in the middle of the
    // left panel so keyboard play works without touching the mouse.
    this.cursor = { x: PANEL.leftX + PANEL.w / 2, y: PANEL.y + PANEL.h / 2, visible: false };
    this.attach();
  }

  attach() {
    this.canvas.addEventListener('mousemove', (event) => {
      const point = this.toCanvas(event);
      this.cursor.x = point.x;
      this.cursor.y = point.y;
      this.cursor.visible = true;
    });
    this.canvas.addEventListener('mouseleave', () => {
      this.cursor.visible = false;
    });
    this.canvas.addEventListener('click', (event) => {
      this.game.sounds.ensure();
      this.game.clickAt(this.toCanvas(event));
    });
    window.addEventListener('keydown', (event) => {
      if (event.repeat) return;
      const step = event.shiftKey ? CURSOR_STEP_FAST : CURSOR_STEP;
      const key = event.key;
      if (key === 'ArrowLeft' || key === 'a' || key === 'A') {
        this.cursor.x = Math.max(0, this.cursor.x - step);
        this.cursor.visible = true;
        event.preventDefault();
      } else if (key === 'ArrowRight' || key === 'd' || key === 'D') {
        this.cursor.x = Math.min(this.canvas.width, this.cursor.x + step);
        this.cursor.visible = true;
        event.preventDefault();
      } else if (key === 'ArrowUp' || key === 'w' || key === 'W') {
        this.cursor.y = Math.max(0, this.cursor.y - step);
        this.cursor.visible = true;
        event.preventDefault();
      } else if (key === 'ArrowDown' || key === 's' || key === 'S') {
        this.cursor.y = Math.min(this.canvas.height, this.cursor.y + step);
        this.cursor.visible = true;
        event.preventDefault();
      } else if (key === 'Enter' || key === ' ') {
        this.game.sounds.ensure();
        this.game.clickAt({ x: this.cursor.x, y: this.cursor.y });
        event.preventDefault();
      } else if (key === 'h' || key === 'H') {
        this.game.useHint();
      } else if (key === 'r' || key === 'R') {
        this.game.restartLevel();
      } else if (key === 'm' || key === 'M') {
        this.game.toggleMute();
      } else if (key === 'Escape' || key === 'p' || key === 'P') {
        this.game.togglePause();
      } else if (key >= '1' && key <= '3') {
        this.game.selectLevel(Number(key));
      }
    });
  }

  toCanvas(event) {
    const box = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / box.width;
    const scaleY = this.canvas.height / box.height;
    return {
      x: (event.clientX - box.left) * scaleX,
      y: (event.clientY - box.top) * scaleY,
    };
  }
}
