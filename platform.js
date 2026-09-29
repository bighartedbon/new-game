/**
 * platform.js
 * A solid rectangular platform. The player can land on top of it,
 * and is blocked by its sides and underside.
 */
class Platform {
  /**
   * @param {number} x      left edge
   * @param {number} y      top edge (the surface the player stands on)
   * @param {number} w      width
   * @param {number} h      height
   * @param {string} [label] optional small label drawn on the platform (e.g. "1")
   */
  constructor(x, y, w, h, label = '') {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.label = label;
  }

  draw(ctx) {
    // Earth body
    ctx.fillStyle = '#7a5230';
    ctx.fillRect(this.x, this.y, this.w, this.h);

    // Grass strip on top
    ctx.fillStyle = '#4f9a3c';
    ctx.fillRect(this.x, this.y, this.w, 6);

    // Darker underside for a bit of depth
    ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
    ctx.fillRect(this.x, this.y + this.h - 4, this.w, 4);

    // Optional label (handy for checking the step order)
    if (this.label) {
      ctx.fillStyle = '#e9e2cf';
      ctx.font = 'bold 12px "Courier New", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.label, this.x + this.w / 2, this.y + this.h / 2 + 3);
    }
  }
}
