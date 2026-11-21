// Senja di Taman Koi — bootstrap.
// One job: wire the canvas, the game, the input and the animation loop
// together, and apply a ?shot= preset when one is given. Exposes the game
// as window.__game so a play-test script can drive it.
import { GAME_WIDTH, GAME_HEIGHT } from './config.js';
import { Game } from './game.js';
import { Input } from './input.js';
import { applyShot } from './shots.js';

const canvas = document.getElementById('game');
canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;

const game = new Game(canvas, null);
const input = new Input(canvas, game);
game.input = input;
window.__game = game;

const params = new URLSearchParams(window.location.search);
if (params.has('shot')) applyShot(game, params);

function frame(now) {
  game.update(now);
  game.render(now);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
