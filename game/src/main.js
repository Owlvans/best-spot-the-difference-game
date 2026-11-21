// main.js — boots Twin Vista: wires the HUD, the game rules (game.js), the
// renderer (render.js), pointer/keyboard input (input.js) and the synth
// sounds (audio.js), then runs the frame loop. It also implements the
// screenshot modes (?shot=play&scene=0&found=3, ?shot=clear&scene=1) that
// freeze a deterministic mid-game or clear state for the maker's screenshots
// in shots.json — the same states a player reaches by playing.

import { Game } from './game.js';
import { Renderer } from './render.js';
import { AudioFX } from './audio.js';
import { attachInput } from './input.js';
import { SCENES } from './scenes.js';

const $ = (id) => document.getElementById(id);
const canvas = $('game');
const game = new Game();
const renderer = new Renderer(canvas);
const audio = new AudioFX();

const fx = {
  misses: [],       // {x, y, panel, age} — fading red crosses
  hint: null,       // {diff, until} — the pulsing hint ring
  frozen: false,    // screenshot mode: pin every animation phase
};
let lastStatus = game.status;
let lastTime = performance.now();

/* ---------------- HUD ---------------- */

function fmtClock(seconds) {
  const s = Math.max(0, Math.ceil(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

function syncHud() {
  const total = game.scene.diffs.length;
  $('counter').textContent = `${game.found.size} / ${total}`;
  $('togo').textContent = game.status === 'clear' ? 'all found!' : `${game.remaining} to go`;
  $('clock').textContent = fmtClock(game.timeLeft);
  const bar = $('timebar');
  bar.style.width = `${(game.timeLeft / game.scene.time) * 100}%`;
  bar.classList.toggle('low', game.timeLeft < 60);
  $('score').textContent = game.score;
  $('mistakes').textContent = game.mistakes;
  $('hintsLeft').textContent = game.hintsLeft;
  $('hintBtn').disabled = game.status !== 'playing' || game.hintsLeft <= 0;

  const chips = $('chips');
  chips.innerHTML = '';
  if (game.foundOrder.length === 0) {
    const span = document.createElement('span');
    span.className = 'none';
    span.textContent = 'nothing yet — click a difference in either picture';
    chips.appendChild(span);
  } else {
    for (const diff of game.foundOrder) {
      const chip = document.createElement('span');
      chip.className = 'chip';
      chip.textContent = `✓ ${diff.name}`;
      chips.appendChild(chip);
    }
  }

  document.querySelectorAll('#sceneTabs .tab').forEach((tab, i) => {
    tab.classList.toggle('active', i === game.sceneIndex);
    tab.classList.toggle('done', game.clearedScenes.has(i));
  });

  const overlay = $('overlay');
  if (game.status === 'playing') {
    overlay.hidden = true;
  } else {
    overlay.hidden = false;
    const clear = game.status === 'clear';
    $('overlayTitle').textContent = clear ? 'Scene clear!' : "Time's up!";
    const stars = game.stars();
    $('overlayStars').innerHTML = [1, 2, 3]
      .map((i) => (i <= stars ? '★' : '<span class="dim">★</span>'))
      .join('');
    $('overlayStars').style.display = clear ? 'block' : 'none';
    $('overlayText').textContent = clear
      ? `${game.scene.name} solved with ${fmtClock(game.timeLeft)} to spare. ` +
        `Score ${game.score} — ${game.mistakes} mistake${game.mistakes === 1 ? '' : 's'}, ${game.hintsUsed} hint${game.hintsUsed === 1 ? '' : 's'} used.`
      : `The clock ran out on ${game.scene.name} with ${game.remaining} difference${game.remaining === 1 ? '' : 's'} still hiding. Have another hunt!`;
    $('overlayNext').style.display = clear && game.sceneIndex < SCENES.length - 1 ? '' : 'none';
    $('overlayRetry').textContent = clear ? 'Play again' : 'Try again';
  }
}

/* ---------------- actions ---------------- */

function startScene(index) {
  game.start(index);
  fx.misses = [];
  fx.hint = null;
  lastStatus = game.status;
  syncHud();
}

function doHint() {
  const diff = game.hint();
  if (!diff) return;
  audio.hint();
  fx.hint = { diff, until: performance.now() + 1600 };
  syncHud();
}

const handlers = {
  onPoint(point) {
    const result = game.click(point.x, point.y);
    if (result.result === 'found') audio.find();
    else if (result.result === 'miss') {
      audio.miss();
      fx.misses.push({ x: point.x, y: point.y, panel: point.panel, age: 0 });
    }
    syncHud();
  },
  onHint: doHint,
  onRestart: () => startScene(game.sceneIndex),
  onSound() {
    audio.muted = !audio.muted;
    $('soundBtn').textContent = audio.muted ? 'Sound: off' : 'Sound: on';
    if (!audio.muted) audio.find();
  },
  onNext() {
    if (game.status === 'clear' && game.sceneIndex < SCENES.length - 1) {
      startScene(game.sceneIndex + 1);
    }
  },
  onScene: (index) => startScene(index),
};

attachInput(canvas, handlers);
$('hintBtn').addEventListener('click', doHint);
$('restartBtn').addEventListener('click', () => startScene(game.sceneIndex));
$('soundBtn').addEventListener('click', handlers.onSound);
$('overlayNext').addEventListener('click', handlers.onNext);
$('overlayRetry').addEventListener('click', () => startScene(game.sceneIndex));
document.querySelectorAll('#sceneTabs .tab').forEach((tab, i) => {
  tab.addEventListener('click', () => startScene(i));
});

/* ---------------- screenshot modes ---------------- */

const params = new URLSearchParams(location.search);
const shot = params.get('shot');
if (shot) {
  fx.frozen = true;
  const sceneIndex = Math.min(SCENES.length - 1, Math.max(0, Number(params.get('scene') || 0)));
  game.start(sceneIndex);
  if (shot === 'clear') {
    for (const diff of game.scene.diffs) {
      game.found.add(diff.id);
      game.foundOrder.push(diff);
    }
    game.timeLeft = 74;
    game.score = game.scene.diffs.length * 100 + game.timeLeft * 2;
    game.mistakes = 2;
    game.status = 'clear';
    game.clearedScenes.add(sceneIndex);
  } else {
    const foundCount = Math.min(game.scene.diffs.length, Math.max(0, Number(params.get('found') || 0)));
    for (const diff of game.scene.diffs.slice(0, foundCount)) {
      game.found.add(diff.id);
      game.foundOrder.push(diff);
    }
    game.score = foundCount * 100;
    game.mistakes = 1;
    game.timeLeft = Math.round(game.scene.time * 0.62);
    if (params.get('hint') === '1') {
      const next = game.scene.diffs[foundCount];
      if (next) fx.hint = { diff: next, until: Infinity };
    }
  }
  lastStatus = game.status;
}

/* ---------------- frame loop ---------------- */

function frame(nowMs) {
  const dt = Math.min(0.05, (nowMs - lastTime) / 1000);
  lastTime = nowMs;

  if (!fx.frozen) {
    game.tick(dt);
    for (const miss of fx.misses) miss.age += dt;
    fx.misses = fx.misses.filter((m) => m.age < 0.9);
    if (fx.hint && nowMs > fx.hint.until) fx.hint = null;
    if (game.status !== lastStatus) {
      if (game.status === 'clear') audio.clear();
      if (game.status === 'timeup') audio.timeup();
      lastStatus = game.status;
    }
    syncHud();
  }

  const now = fx.frozen ? 0.4 : nowMs / 1000;
  renderer.draw(
    game,
    {
      found: game.found,
      hint: fx.hint ? { ...fx.hint.diff, frozen: fx.frozen } : null,
      misses: fx.misses,
      frozen: fx.frozen,
    },
    now,
  );
  requestAnimationFrame(frame);
}

syncHud();
requestAnimationFrame(frame);
window.__twinvista = { game, fx };
