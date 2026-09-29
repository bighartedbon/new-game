/**
 * collectible.js
 * A fruit that sits still (with a gentle bob) until the player touches it.
 * On pickup it plays a short pop effect and then disappears for good.
 */
class Fruit {
  /**
   * @param {number} x       centre x
   * @param {number} y       centre y (resting position)
   * @param {number} points  score awarded on pickup
   */
  constructor(x, y, points = 5) {
    this.x = x;
    this.y = y;
    this.radius = 12;
    this.points = points;

    this.collected = false;   // true once picked up
    this.time = 0;            // drives the bobbing animation
    this.effectTime = 0;      // seconds since pickup (drives the pop effect)
    this.effectDuration = 0.6;
  }

  /** Advance animations. dt is in seconds. */
  update(dt) {
    this.time += dt;
    if (this.collected) this.effectTime += dt;
  }

  /** Circle-vs-rectangle overlap test against the player's box. */
  touches(player) {
    if (this.collected) return false;

    // Find the point on the player's box closest to the fruit centre
    const nearestX = Math.max(player.x, Math.min(this.x, player.x + player.w));
    const nearestY = Math.max(player.y, Math.min(this.y, player.y + player.h));
    const dx = this.x - nearestX;
    const dy = this.y - nearestY;
    return dx * dx + dy * dy <= this.radius * this.radius;
  }

  /** Mark as collected and return the points to add to the score. */
  collect() {
    if (this.collected) return 0;
    this.collected = true;
    this.effectTime = 0;
    return this.points;
  }

  draw(ctx) {
    if (!this.collected) {
      this.drawFruit(ctx);
    } else if (this.effectTime < this.effectDuration) {
      this.drawPopEffect(ctx);
    }
    // After the effect finishes nothing is drawn: the fruit is gone.
  }

  drawFruit(ctx) {
    const bob = Math.sin(this.time * 4) * 3;   // up/down wobble
    const cx = this.x;
    const cy = this.y + bob;
    const r = this.radius;

    // Soft shadow on the platform beneath
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.beginPath();
    ctx.ellipse(cx, this.y + r + 3, r * 0.8, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Apple body
    ctx.fillStyle = '#d63a2f';
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();

    // Highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.beginPath();
    ctx.arc(cx - r * 0.35, cy - r * 0.35, r * 0.28, 0, Math.PI * 2);
    ctx.fill();

    // Stem
    ctx.strokeStyle = '#5a3a1e';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy - r);
    ctx.lineTo(cx + 2, cy - r - 6);
    ctx.stroke();

    // Leaf
    ctx.fillStyle = '#4f9a3c';
    ctx.beginPath();
    ctx.ellipse(cx + 7, cy - r - 4, 6, 3, -0.5, 0, Math.PI * 2);
    ctx.fill();
  }

  /** Expanding ring + burst of dots + floating "+5" text. */
  drawPopEffect(ctx) {
    const t = this.effectTime / this.effectDuration;   // 0 → 1
    const fade = 1 - t;

    // Expanding ring
    ctx.strokeStyle = `rgba(255, 240, 150, ${fade})`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius + t * 26, 0, Math.PI * 2);
    ctx.stroke();

    // Little burst of dots
    ctx.fillStyle = `rgba(214, 58, 47, ${fade})`;
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const dist = t * 30;
      ctx.beginPath();
      ctx.arc(this.x + Math.cos(angle) * dist, this.y + Math.sin(angle) * dist, 3 * fade + 1, 0, Math.PI * 2);
      ctx.fill();
    }

    // Floating score text
    ctx.fillStyle = `rgba(255, 255, 255, ${fade})`;
    ctx.strokeStyle = `rgba(16, 34, 42, ${fade})`;
    ctx.lineWidth = 3;
    ctx.font = 'bold 20px "Courier New", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const text = '+' + this.points;
    const ty = this.y - 20 - t * 30;
    ctx.strokeText(text, this.x, ty);
    ctx.fillText(text, this.x, ty);
  }
}
