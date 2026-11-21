// Senja di Taman Koi — configuration: canvas size, panel geometry, timing and scoring.
// One job: constants only. No drawing, no state.
export const GAME_WIDTH = 1280;
export const GAME_HEIGHT = 800;

// Two play panels, side by side, with a centre divider.
export const PANEL = {
  w: 600,
  h: 500,
  y: 150,
  leftX: 20,
  rightX: 660,
  gap: 40,
};

export const HUD = {
  top: 0,
  height: 140,
  footerY: 668,
};

export const SCORING = {
  findBase: 100,
  comboStep: 25,
  comboMax: 5,
  wrongPenalty: 25,
  wrongTimePenaltySec: 5,
  hintCost: 50,
  hintMaxPerLevel: 3,
  timeBonusPerSec: 10,
};

export const TIMER = {
  warnAtSec: 30,
  dangerAtSec: 10,
};

// Keyboard cursor step, in panel pixels.
export const CURSOR_STEP = 18;
export const CURSOR_STEP_FAST = 48;
