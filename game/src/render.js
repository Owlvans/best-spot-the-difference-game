// render.js — paints the two panels and everything on top of them: the
// found markers, the hint pulse, the fading miss marks and the low-time
// warning frame. The left panel is the scene plain; the right panel is the
// scene with every difference applied (see scenes.js).

import { PANEL_W, PANEL_H } from './scenes.js';

export const GUTTER = 28;
export const CANVAS_W = PANEL_W * 2 + GUTTER;
export const CANVAS_H = PANEL_H;

const ALL = (scene) => new Set(scene.diffs.map((d) => d.id));
const NONE = new Set();

export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    // Offscreen panels: each scene side is painted once per state change of
    // the found set is unnecessary — painting is cheap and deterministic, so
    // both panels are repainted each frame and the markers stay in sync.
    this.leftPanel = document.createElement('canvas');
    this.rightPanel = document.createElement('canvas');
    for (const p of [this.leftPanel, this.rightPanel]) {
      p.width = PANEL_W;
      p.height = PANEL_H;
    }
    this.cachedScene = -1;
  }

  paintPanels(scene, sceneIndex) {
    if (this.cachedScene === sceneIndex) return;
    this.cachedScene = sceneIndex;
    scene.paint(this.leftPanel.getContext('2d'), NONE);
    scene.paint(this.rightPanel.getContext('2d'), ALL(scene));
  }

  // fx: { found:Set, hint:{x,y,phase}|null, misses:[{x,y,panel,age}],
  //       timeLeft, status, frozen } — phase/age in seconds, frozen pins the
  //       animation phase for screenshots.
  draw(game, fx, now) {
    const { ctx } = this;
    this.paintPanels(game.scene, game.sceneIndex);
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
    ctx.fillStyle = '#0d0f14';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    ctx.drawImage(this.leftPanel, 0, 0);
    ctx.drawImage(this.rightPanel, PANEL_W + GUTTER, 0);

    // Panel frames and the centre spine.
    ctx.strokeStyle = 'rgba(255,255,255,0.14)';
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, PANEL_W - 2, PANEL_H - 2);
    ctx.strokeRect(PANEL_W + GUTTER + 1, 1, PANEL_W - 2, PANEL_H - 2);
    ctx.fillStyle = '#ffd98a';
    ctx.font = '700 15px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('· ✦ ·', PANEL_W + GUTTER / 2, CANVAS_H / 2);

    for (const diff of game.scene.diffs) {
      if (!fx.found.has(diff.id)) continue;
      this.marker(0, diff, now);
      this.marker(PANEL_W + GUTTER, diff, now);
    }

    if (fx.hint) {
      this.hintRing(0, fx.hint, now);
      this.hintRing(PANEL_W + GUTTER, fx.hint, now);
    }

    for (const miss of fx.misses) this.missMark(miss);

    // Time pressure you can feel: under 30 seconds the frame breathes red.
    if (game.status === 'playing' && game.timeLeft < 30) {
      const pulse = fx.frozen ? 0.55 : 0.35 + 0.25 * Math.sin(now * 6);
      ctx.strokeStyle = `rgba(224, 64, 40, ${pulse})`;
      ctx.lineWidth = 6;
      ctx.strokeRect(3, 3, CANVAS_W - 6, CANVAS_H - 6);
    }
  }

  marker(offsetX, diff, now) {
    const { ctx } = this;
    const pop = 1 + 0.06 * Math.sin(now * 3 + diff.x);
    const r = Math.max(diff.r + 7, 17) * pop;
    ctx.save();
    ctx.strokeStyle = '#37d67a';
    ctx.lineWidth = 4;
    ctx.shadowColor = 'rgba(0,0,0,0.45)';
    ctx.shadowBlur = 5;
    ctx.beginPath();
    ctx.arc(offsetX + diff.x, diff.y, r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = '#eafff2';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(offsetX + diff.x, diff.y, r - 4, 0, Math.PI * 2);
    ctx.stroke();
    // A small check at the ring's top-right.
    const cx = offsetX + diff.x + r * 0.72;
    const cy = diff.y - r * 0.72;
    ctx.fillStyle = '#37d67a';
    ctx.beginPath();
    ctx.arc(cx, cy, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#08351a';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(cx - 4, cy);
    ctx.lineTo(cx - 1, cy + 3.4);
    ctx.lineTo(cx + 4.4, cy - 3.4);
    ctx.stroke();
    ctx.restore();
  }

  hintRing(offsetX, hint, now) {
    const { ctx } = this;
    const phase = hint.frozen ? 0.5 : (now * 1.6) % 1;
    const r = hint.r + 6 + phase * 26;
    ctx.save();
    ctx.strokeStyle = `rgba(255, 210, 60, ${0.85 * (1 - phase)})`;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(offsetX + hint.x, hint.y, r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(255, 210, 60, 0.9)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(offsetX + hint.x, hint.y, hint.r + 5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  missMark(miss) {
    const { ctx } = this;
    const alpha = Math.max(0, 1 - miss.age / 0.9);
    if (alpha <= 0) return;
    const offsetX = miss.panel === 0 ? 0 : PANEL_W + GUTTER;
    const s = 10;
    ctx.save();
    ctx.strokeStyle = `rgba(224, 64, 40, ${alpha})`;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(offsetX + miss.x - s, miss.y - s);
    ctx.lineTo(offsetX + miss.x + s, miss.y + s);
    ctx.moveTo(offsetX + miss.x + s, miss.y - s);
    ctx.lineTo(offsetX + miss.x - s, miss.y + s);
    ctx.stroke();
    ctx.restore();
  }
}
