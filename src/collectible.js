class Fruit {
  constructor(x, y, points = 5) {
    this.x = x;
    this.y = y;
    this.radius = 12;
    this.points = points;

    this.collected = false;
    this.time = 0;
    this.effectTime = 0;
    this.effectDuration = 0.6;
  }

  update(dt) {
    this.time += dt;
    if (this.collected) this.effectTime += dt;
  }

  touches(player) {
    if (this.collected) return false;

    const nearestX = Math.max(player.x, Math.min(this.x, player.x + player.w));
    const nearestY = Math.max(player.y, Math.min(this.y, player.y + player.h));
    const dx = this.x - nearestX;
    const dy = this.y - nearestY;
    return dx * dx + dy * dy <= this.radius * this.radius;
  }

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
  }

  drawFruit(ctx) {
    const bob = Math.sin(this.time * 4) * 3;
    const cx = this.x;
    const cy = this.y + bob;
    const r = this.radius;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.beginPath();
    ctx.ellipse(cx, this.y + r + 3, r * 0.8, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#d63a2f';
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.beginPath();
    ctx.arc(cx - r * 0.35, cy - r * 0.35, r * 0.28, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#5a3a1e';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy - r);
    ctx.lineTo(cx + 2, cy - r - 6);
    ctx.stroke();

    ctx.fillStyle = '#4f9a3c';
    ctx.beginPath();
    ctx.ellipse(cx + 7, cy - r - 4, 6, 3, -0.5, 0, Math.PI * 2);
    ctx.fill();
  }

  drawPopEffect(ctx) {
    const t = this.effectTime / this.effectDuration;
    const fade = 1 - t;

    ctx.strokeStyle = `rgba(255, 240, 150, ${fade})`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius + t * 26, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = `rgba(214, 58, 47, ${fade})`;
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const dist = t * 30;
      ctx.beginPath();
      ctx.arc(this.x + Math.cos(angle) * dist, this.y + Math.sin(angle) * dist, 3 * fade + 1, 0, Math.PI * 2);
      ctx.fill();
    }

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
