// input.js — turns pointer and keyboard activity on the stage into game
// actions. Pointer positions are mapped from CSS pixels into panel
// coordinates (left panel at x 0, right panel after the gutter); a click in
// the gutter itself is ignored rather than counted as a miss.

import { PANEL_W, PANEL_H } from './scenes.js';
import { GUTTER } from './render.js';

export function panelPoint(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const cx = (event.clientX - rect.left) * scaleX;
  const cy = (event.clientY - rect.top) * scaleY;
  if (cy < 0 || cy > PANEL_H) return null;
  if (cx >= 0 && cx < PANEL_W) return { x: cx, y: cy, panel: 0 };
  if (cx >= PANEL_W + GUTTER && cx < PANEL_W * 2 + GUTTER) {
    return { x: cx - PANEL_W - GUTTER, y: cy, panel: 1 };
  }
  return null;
}

export function attachInput(canvas, handlers) {
  canvas.addEventListener('pointerdown', (event) => {
    const point = panelPoint(canvas, event);
    if (point) handlers.onPoint(point);
  });
  window.addEventListener('keydown', (event) => {
    if (event.repeat) return;
    const key = event.key.toLowerCase();
    if (key === 'h') handlers.onHint();
    else if (key === 'r') handlers.onRestart();
    else if (key === 'm') handlers.onSound();
    else if (key === 'n') handlers.onNext();
    else if (key >= '1' && key <= '3') handlers.onScene(Number(key) - 1);
  });
}
