class Platform {
  constructor(x, y, w, h, label = '') {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.label = label;
  }

  draw(ctx) {
    ctx.fillStyle = '#7a5230';
    ctx.fillRect(this.x, this.y, this.w, this.h);

    ctx.fillStyle = '#4f9a3c';
    ctx.fillRect(this.x, this.y, this.w, 6);

    ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
    ctx.fillRect(this.x, this.y + this.h - 4, this.w, 4);

    if (this.label) {
      ctx.fillStyle = '#e9e2cf';
      ctx.font = 'bold 12px "Courier New", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.label, this.x + this.w / 2, this.y + this.h / 2 + 3);
    }
  }
}
