const ACCEL = 0.9;
const MAX_SPEED = 5;
const FRICTION_GND = 0.78;
const FRICTION_AIR = 0.94;
const GRAVITY = 0.6;
const MAX_FALL = 15;
const JUMP_SPEED = 15;
const JUMP_CUT = 2.2;
const COYOTE_STEPS = 6;
const BUFFER_STEPS = 6;

class Player {
  constructor(x, y) {
    this.w = 30;
    this.h = 42;
    this.x = x;
    this.y = y;

    this.vx = 0;
    this.vy = 0;

    this.onGround = false;
    this.facing = 1;

    this.coyote = 0;
    this.jumpBuffer = 0;
    this.jumpWasHeld = false;
  }

  update(keys, platforms, bounds) {
    const left = keys.has('ArrowLeft') || keys.has('KeyA');
    const right = keys.has('ArrowRight') || keys.has('KeyD');
    const jumpHeld = keys.has('ArrowUp') || keys.has('KeyW') || keys.has('Space');

    const dir = (right ? 1 : 0) - (left ? 1 : 0);
    if (dir !== 0) {
      this.vx += dir * ACCEL;
      this.vx = Math.max(-MAX_SPEED, Math.min(MAX_SPEED, this.vx));
      this.facing = dir;
    } else {
      this.vx *= this.onGround ? FRICTION_GND : FRICTION_AIR;
      if (Math.abs(this.vx) < 0.1) this.vx = 0;
    }

    if (jumpHeld && !this.jumpWasHeld) this.jumpBuffer = BUFFER_STEPS;
    this.jumpWasHeld = jumpHeld;

    this.coyote = this.onGround ? COYOTE_STEPS : Math.max(0, this.coyote - 1);

    if (this.jumpBuffer > 0 && this.coyote > 0) {
      this.vy = -JUMP_SPEED;
      this.jumpBuffer = 0;
      this.coyote = 0;
      this.onGround = false;
    }
    this.jumpBuffer = Math.max(0, this.jumpBuffer - 1);

    const gravityScale = (this.vy < 0 && !jumpHeld) ? JUMP_CUT : 1;
    this.vy = Math.min(this.vy + GRAVITY * gravityScale, MAX_FALL);

    this.x += this.vx;
    for (const p of platforms) {
      if (this.overlaps(p)) {
        if (this.vx > 0) this.x = p.x - this.w;
        else if (this.vx < 0) this.x = p.x + p.w;
        this.vx = 0;
      }
    }
    if (this.x < 0) { this.x = 0; this.vx = 0; }
    if (this.x + this.w > bounds.w) { this.x = bounds.w - this.w; this.vx = 0; }

    this.y += this.vy;
    this.onGround = false;
    for (const p of platforms) {
      if (this.overlaps(p)) {
        if (this.vy > 0) {
          this.y = p.y - this.h;
          this.onGround = true;
        } else if (this.vy < 0) {
          this.y = p.y + p.h;
        }
        this.vy = 0;
      }
    }
    if (this.y + this.h > bounds.h) {
      this.y = bounds.h - this.h;
      this.vy = 0;
      this.onGround = true;
    }
  }

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

    ctx.fillStyle = '#f2b632';
    ctx.fillRect(x, y, this.w, this.h);

    ctx.fillStyle = '#b5791a';
    ctx.fillRect(x, y + this.h - 8, this.w, 8);

    const eyeShift = this.facing * 3;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + 6 + eyeShift, y + 9, 7, 8);
    ctx.fillRect(x + 17 + eyeShift, y + 9, 7, 8);

    ctx.fillStyle = '#10222a';
    ctx.fillRect(x + 9 + eyeShift + (this.facing > 0 ? 2 : 0), y + 12, 3, 4);
    ctx.fillRect(x + 20 + eyeShift + (this.facing > 0 ? 2 : 0), y + 12, 3, 4);
  }
}
