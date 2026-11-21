// game.js — the rules of a Twin Vista hunt: which scene is in play, which
// differences are found, the countdown, mistakes, hints and the score.
// Pure state and rules; drawing lives in render.js, sounds in audio.js.

import { SCENES } from './scenes.js';

export const FIND_POINTS = 100;
export const HINT_COST = 50;
export const HINTS_PER_SCENE = 3;
export const MISTAKE_SECONDS = 5;

export class Game {
  constructor() {
    this.sceneIndex = 0;
    this.clearedScenes = new Set();
    this.start(0);
  }

  get scene() {
    return SCENES[this.sceneIndex];
  }

  start(sceneIndex) {
    this.sceneIndex = sceneIndex;
    this.found = new Set();
    this.mistakes = 0;
    this.hintsLeft = HINTS_PER_SCENE;
    this.hintsUsed = 0;
    this.score = 0;
    this.timeLeft = this.scene.time;
    this.status = 'playing'; // 'playing' | 'clear' | 'timeup'
    this.foundOrder = [];
  }

  get remaining() {
    return this.scene.diffs.length - this.found.size;
  }

  // A click in panel coordinates. Returns {result:'found', diff} on a hit,
  // {result:'already'} on an already-ringed difference, {result:'miss'} else.
  click(x, y) {
    if (this.status !== 'playing') return { result: 'idle' };
    for (const diff of this.scene.diffs) {
      const dx = x - diff.x;
      const dy = y - diff.y;
      if (dx * dx + dy * dy <= diff.r * diff.r) {
        if (this.found.has(diff.id)) return { result: 'already', diff };
        this.found.add(diff.id);
        this.foundOrder.push(diff);
        this.score += FIND_POINTS;
        if (this.remaining === 0) {
          this.status = 'clear';
          this.score += Math.round(this.timeLeft) * 2; // time bonus
          this.clearedScenes.add(this.sceneIndex);
        }
        return { result: 'found', diff };
      }
    }
    this.mistakes += 1;
    this.timeLeft = Math.max(0, this.timeLeft - MISTAKE_SECONDS);
    if (this.timeLeft === 0) this.status = 'timeup';
    return { result: 'miss' };
  }

  // A hint picks a random difference still hiding, if any hint is left.
  hint() {
    if (this.status !== 'playing' || this.hintsLeft <= 0) return null;
    const hiding = this.scene.diffs.filter((d) => !this.found.has(d.id));
    if (hiding.length === 0) return null;
    this.hintsLeft -= 1;
    this.hintsUsed += 1;
    this.score = Math.max(0, this.score - HINT_COST);
    return hiding[Math.floor(Math.random() * hiding.length)];
  }

  tick(seconds) {
    if (this.status !== 'playing') return;
    this.timeLeft = Math.max(0, this.timeLeft - seconds);
    if (this.timeLeft === 0) this.status = 'timeup';
  }

  stars() {
    if (this.status !== 'clear') return 0;
    if (this.hintsUsed === 0 && this.mistakes <= 1) return 3;
    if (this.hintsUsed <= 1 && this.mistakes <= 3) return 2;
    return 1;
  }
}
