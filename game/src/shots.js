// Senja di Taman Koi — deterministic screenshot presets.
// One job: put the game into a fixed, readable state for each screenshot the
// maker takes, from the URL query (?shot=cover&seed=1 and friends). The
// presets never change the game; they only choose a level, a set of already
// found differences and a frozen timer, so the screenshots are real renders
// of the game's own code in a browser.
import { PANEL } from './config.js';

// Apply one preset to a fresh game. Returns false for an unknown shot.
export function applyShot(game, params) {
  const shot = params.get('shot') ?? 'cover';
  const foundCount = Number(params.get('found') ?? NaN);
  if (shot === 'start') {
    game.state = 'title';
    return true;
  }
  if (shot === 'cover' || shot === 'play' || shot === 'win') {
    const levelId = Number(params.get('level') ?? (shot === 'cover' ? 1 : 2));
    game.startGame(levelId - 1);
    // Freeze the timer where the shot wants it.
    const seconds = Number(params.get('seconds') ?? (shot === 'cover' ? 132 : 97));
    game.timeLeft = seconds;
    if (shot === 'win') {
      // Every difference found: the level-complete overlay shows.
      for (const diff of game.level.diffs) game.found.add(diff.id);
      const n = game.level.diffs.length;
      const findScore = n * 100 + 25 * ((n * (n - 1)) / 2);
      game.lastTimeBonus = Math.round(game.timeLeft) * 10;
      game.lastLevelScore = findScore + game.lastTimeBonus;
      game.score = game.lastLevelScore;
      game.combo = n;
      game.state = 'levelDone';
      return true;
    }
    const count = Number.isFinite(foundCount) ? foundCount : shot === 'cover' ? 3 : 2;
    const diffs = game.level.diffs.slice(0, count);
    for (const diff of diffs) game.found.add(diff.id);
    // Score as the game would award it: 100 per find, +25 per combo step.
    game.score = count * 100 + 25 * ((count * (count - 1)) / 2);
    game.combo = count;
    // Hint one more difference, so the shot shows the hint behaving too.
    if (shot === 'cover') {
      const next = game.level.diffs[count];
      game.hintPulse = { diff: next, until: performance.now() + 60_000 };
      game.hintsLeft = 2;
    }
    // Keep the mouse cursor out of the frame for clean shots.
    game.input.cursor.visible = false;
    return true;
  }
  return false;
}

// The shot presets the maker uses, in the order the screenshots are named.
export const SHOTS = [
  { name: '1-cover.jpg', query: '?shot=cover&level=1&found=3&seconds=132' },
  { name: '2-start.jpg', query: '?shot=start' },
  { name: '3-market.jpg', query: '?shot=play&level=2&found=2&seconds=97' },
  { name: '4-win.jpg', query: '?shot=win&level=1' },
];

export { PANEL };
