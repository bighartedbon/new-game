/**
 * player.js
 * The player character: input-driven movement, gravity, jumping and
 * solid collision against platforms.
 *
 * All physics values are "per fixed step" (the game runs a 60 Hz
 * simulation step, see main.js), so tweak the constants below to
 * change how the character feels.
 */

// ---- Tuning constants ----
const ACCEL        = 0.9;    // horizontal acceleration while a direction is held
const MAX_SPEED    = 5;      // top horizontal speed
const FRICTION_GND = 0.78;   // speed multiplier per step when no input, on ground
const FRICTION_AIR = 0.94;   // same, in the air (floatier)
const GRAVITY      = 0.6;    // downward acceleration
const MAX_FALL     = 15;     // terminal fall speed
const JUMP_SPEED   = 15;     // initial upward speed of a jump
const JUMP_CUT     = 2.2;    // extra gravity multiplier when jump is released early
const COYOTE_STEPS = 6;      // grace steps to still jump just after leaving a ledge
const BUFFER_STEPS = 6;      // remember a jump press for a few steps before landing

class Player {
  constructor(x, y) {
    this.w = 30;
    this.h = 42;
    this.x = x;
    this.y = y;

    this.vx = 0;
    this.vy = 0;

    this.onGround = false;
    this.facing = 1;          // 1 = right, -1 = left (for drawing the eyes)

    this.coyote = 0;          // steps left in the coyote-time window
    this.jumpBuffer = 0;      // steps left in the jump-buffer window
    this.jumpWasHeld = false; // used to detect a fresh jump press
  }

  /**
   * Run one fixed simulation step.
   * @param {Set<string>} keys       currently pressed key codes
   * @param {Platform[]}  platforms  everything solid
   * @param {{w:number,h:number}} bounds  the game world size
   */
  update(keys, platforms, bounds) {
    // ---------- 1. Read input ----------
    const left  = keys.has('ArrowLeft')  || keys.has('KeyA');
    const right = keys.has('ArrowRight') || keys.has('KeyD');
    const jumpHeld = keys.has('ArrowUp') || keys.has('KeyW') || keys.has('Space');

    // ---------- 2. Horizontal movement (smooth accel + friction) ----------
    const dir = (right ? 1 : 0) - (left ? 1 : 0);
    if (dir !== 0) {
      this.vx += dir * ACCEL;
      this.vx = Math.max(-MAX_SPEED, Math.min(MAX_SPEED, this.vx));
      this.facing = dir;
    } else {
      this.vx *= this.onGround ? FRICTION_GND : FRICTION_AIR;
      if (Math.abs(this.vx) < 0.1) this.vx = 0;
    }

    // ---------- 3. Jumping ----------
    // A fresh press (not a held key) fills the jump buffer
    if (jumpHeld && !this.jumpWasHeld) this.jumpBuffer = BUFFER_STEPS;
    this.jumpWasHeld = jumpHeld;

    // Coyote time: stay "grounded" for a few steps after walking off a ledge
    this.coyote = this.onGround ? COYOTE_STEPS : Math.max(0, this.coyote - 1);

    if (this.jumpBuffer > 0 && this.coyote > 0) {
      this.vy = -JUMP_SPEED;
      this.jumpBuffer = 0;
      this.coyote = 0;
      this.onGround = false;
    }
    this.jumpBuffer = Math.max(0, this.jumpBuffer - 1);

    // ---------- 4. Gravity ----------
    // Releasing the key while rising cuts the jump short (variable jump height)
    const gravityScale = (this.vy < 0 && !jumpHeld) ? JUMP_CUT : 1;
    this.vy = Math.min(this.vy + GRAVITY * gravityScale, MAX_FALL);

    // ---------- 5. Move + collide, one axis at a time ----------
    // Doing X then Y separately makes it easy to know which side we hit.

    // --- X axis ---
    this.x += this.vx;
    for (const p of platforms) {
      if (this.overlaps(p)) {
        if (this.vx > 0) this.x = p.x - this.w;        // hit the platform's left side
        else if (this.vx < 0) this.x = p.x + p.w;      // hit the platform's right side
        this.vx = 0;
      }
    }
    // Keep inside the screen horizontally
    if (this.x < 0) { this.x = 0; this.vx = 0; }
    if (this.x + this.w > bounds.w) { this.x = bounds.w - this.w; this.vx = 0; }

    // --- Y axis ---
    this.y += this.vy;
    this.onGround = false;
    for (const p of platforms) {
      if (this.overlaps(p)) {
        if (this.vy > 0) {                             // falling: land on top
          this.y = p.y - this.h;
          this.onGround = true;
        } else if (this.vy < 0) {                      // rising: bump head
          this.y = p.y + p.h;
        }
        this.vy = 0;
      }
    }
    // Safety net: never fall out of the world (the floor should catch us first)
    if (this.y + this.h > bounds.h) {
      this.y = bounds.h - this.h;
      this.vy = 0;
      this.onGround = true;
    }
  }

  /** AABB overlap test against a platform. */
  overlaps(p) {
    return (
      this.x < p.x + p.w &&
      this.x + this.w > p.x &&
      this.y < p.y + p.h &&
      this.y + this.h > p.y
    );
  }

  draw(ctx) {
    const x = Math.round(this.x);
    const y = Math.round(this.y);

    // Body
    ctx.fillStyle = '#f2b632';
    ctx.fillRect(x, y, this.w, this.h);

    // Feet
    ctx.fillStyle = '#b5791a';
    ctx.fillRect(x, y + this.h - 8, this.w, 8);

    // Eyes (shift toward the facing direction)
    const eyeShift = this.facing * 3;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + 6 + eyeShift, y + 9, 7, 8);
    ctx.fillRect(x + 17 + eyeShift, y + 9, 7, 8);

    ctx.fillStyle = '#10222a';
    ctx.fillRect(x + 9 + eyeShift + (this.facing > 0 ? 2 : 0), y + 12, 3, 4);
    ctx.fillRect(x + 20 + eyeShift + (this.facing > 0 ? 2 : 0), y + 12, 3, 4);
  }
}
