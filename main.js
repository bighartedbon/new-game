/**
 * main.js
 * Sets up the canvas, builds Level 1, reads the keyboard, and runs
 * the game loop (fixed-step update + render every frame).
 */

// ------------------------------------------------------------------
// 1. Setup
// ------------------------------------------------------------------
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const WORLD = { w: canvas.width, h: canvas.height };   // 720 x 720

const hudScore = document.getElementById('hud-score');
const hudLevel = document.getElementById('hud-level');

const SHOW_STEP_LABELS = true;   // set to false to hide the 1–5 numbers on the steps

let score = 0;
const level = 1;
hudLevel.textContent = level;

// ------------------------------------------------------------------
// 2. Level 1 layout
//    (x, y) is the top-left corner of each platform; y grows downward.
//
//    Right side, ascending:   Step 1 → Step 2 → Step 3 (highest)
//    Left side, descending:   Step 4 → Step 5 (lowest)
// ------------------------------------------------------------------
const FLOOR_H = 40;
const THICK = 20;   // thickness of every step

// Returns the step number text, or '' when labels are switched off
const label = (n) => (SHOW_STEP_LABELS ? n : '');

const platforms = [
  // Floor: spans the whole width so the player can't fall off the screen
  new Platform(0, WORLD.h - FLOOR_H, WORLD.w, FLOOR_H),

  // Ascending steps on the right
  new Platform(400, 590, 110, THICK, label('1')),
  new Platform(490, 500, 110, THICK, label('2')),
  new Platform(580, 410, 130, THICK, label('3')),

  // Descending steps on the left
  new Platform(360, 470, 110, THICK, label('4')),
  new Platform(220, 530, 110, THICK, label('5')),
];

// Fruit sitting on top of Step 3 (the 3rd platform after the floor)
const step3 = platforms[3];
const fruit = new Fruit(
  step3.x + step3.w / 2,   // centred on the step
  step3.y - 12 - 6,        // just above the surface (radius 12 + a little gap)
  5                        // +5 points
);

// Player starts on the floor at the far left
const player = new Player(60, WORLD.h - FLOOR_H - 42);

// ------------------------------------------------------------------
// 3. Keyboard input
//    We keep a Set of the key codes that are currently held down.
// ------------------------------------------------------------------
const keys = new Set();
const GAME_KEYS = new Set([
  'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
  'KeyA', 'KeyD', 'KeyW', 'Space',
]);

window.addEventListener('keydown', (e) => {
  if (GAME_KEYS.has(e.code)) {
    e.preventDefault();            // stop arrows/space from scrolling the page
    keys.add(e.code);
  }
});

window.addEventListener('keyup', (e) => {
  keys.delete(e.code);
});

// If the tab loses focus we'd miss the keyup events, so release everything
window.addEventListener('blur', () => keys.clear());

// ------------------------------------------------------------------
// 4. Update + render
// ------------------------------------------------------------------
function update(dt) {
  player.update(keys, platforms, WORLD);
  fruit.update(dt);

  // Pickup check
  if (fruit.touches(player)) {
    score += fruit.collect();
    hudScore.textContent = score;
  }
}

function drawBackground() {
  // Simple vertical sky gradient
  const sky = ctx.createLinearGradient(0, 0, 0, WORLD.h);
  sky.addColorStop(0, '#8fcbe3');
  sky.addColorStop(1, '#dff1e6');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, WORLD.w, WORLD.h);
}

function render() {
  drawBackground();

  for (const p of platforms) {
    p.draw(ctx);
  }

  fruit.draw(ctx);
  player.draw(ctx);
}

// ------------------------------------------------------------------
// 5. Game loop
//    Physics runs at a fixed 60 steps per second so the game feels the
//    same on 60 Hz, 120 Hz and 144 Hz monitors. Rendering happens once
//    per animation frame.
// ------------------------------------------------------------------
const STEP = 1 / 60;
let lastTime = performance.now();
let accumulator = 0;

function frame(now) {
  // Time since last frame in seconds (capped so a tab switch doesn't cause a huge jump)
  const delta = Math.min((now - lastTime) / 1000, 0.1);
  lastTime = now;
  accumulator += delta;

  while (accumulator >= STEP) {
    update(STEP);
    accumulator -= STEP;
  }

  render();
  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
