// audio.js — every sound in Twin Vista is synthesised with WebAudio: no
// audio files, nothing to load. A soft chime arpeggio rewards a find, a low
// buzz marks a miss, a shimmer trails a hint, and a small fanfare closes a
// scene. The context is created lazily on the first user gesture.

export class AudioFX {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  ensure() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') this.ctx.resume();
      return true;
    }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    this.ctx = new AC();
    return true;
  }

  tone(freq, at, dur, type = 'sine', gain = 0.16) {
    if (!this.ctx || this.muted) return;
    const t0 = this.ctx.currentTime + at;
    const osc = this.ctx.createOscillator();
    const amp = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    amp.gain.setValueAtTime(0.0001, t0);
    amp.gain.exponentialRampToValueAtTime(gain, t0 + 0.015);
    amp.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(amp).connect(this.ctx.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  }

  find() {
    if (!this.ensure()) return;
    this.tone(1318.5, 0, 0.16, 'sine', 0.18);
    this.tone(1760, 0.07, 0.22, 'sine', 0.16);
  }

  miss() {
    if (!this.ensure()) return;
    this.tone(160, 0, 0.18, 'square', 0.07);
    this.tone(120, 0.02, 0.2, 'square', 0.06);
  }

  hint() {
    if (!this.ensure()) return;
    this.tone(2093, 0, 0.3, 'sine', 0.07);
    this.tone(2637, 0.1, 0.34, 'sine', 0.06);
    this.tone(3136, 0.2, 0.4, 'sine', 0.05);
  }

  clear() {
    if (!this.ensure()) return;
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((f, i) => this.tone(f, i * 0.09, 0.3, 'triangle', 0.16));
    this.tone(1318.5, 0.38, 0.45, 'triangle', 0.14);
  }

  timeup() {
    if (!this.ensure()) return;
    this.tone(392, 0, 0.25, 'triangle', 0.14);
    this.tone(329.63, 0.16, 0.3, 'triangle', 0.14);
    this.tone(261.63, 0.32, 0.45, 'triangle', 0.14);
  }
}
