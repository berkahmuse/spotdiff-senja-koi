// Senja di Taman Koi — sound effects, synthesised with WebAudio.
// One job: every sound the game makes, from oscillators only. No audio files,
// so the game stays fully offline and the gate's reference check is trivial.
export class SoundBank {
  constructor() {
    this.context = null;
    this.muted = false;
  }

  ensure() {
    if (!this.context) {
      const AudioContext = window.AudioContext ?? window.webkitAudioContext;
      if (AudioContext) this.context = new AudioContext();
    }
    if (this.context && this.context.state === 'suspended') void this.context.resume();
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  tone(freq, durSec, type, gain, whenSec = 0) {
    if (this.muted || !this.context) return;
    const start = this.context.currentTime + whenSec;
    const osc = this.context.createOscillator();
    const amp = this.context.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);
    amp.gain.setValueAtTime(0.0001, start);
    amp.gain.exponentialRampToValueAtTime(gain, start + 0.02);
    amp.gain.exponentialRampToValueAtTime(0.0001, start + durSec);
    osc.connect(amp);
    amp.connect(this.context.destination);
    osc.start(start);
    osc.stop(start + durSec + 0.05);
  }

  // A bright two-note chime when a difference is found.
  find() {
    this.tone(880, 0.16, 'sine', 0.22);
    this.tone(1318.5, 0.24, 'sine', 0.2, 0.09);
  }

  // A low buzz for a wrong click.
  wrong() {
    this.tone(160, 0.22, 'sawtooth', 0.12);
    this.tone(110, 0.26, 'sawtooth', 0.1, 0.06);
  }

  // A soft shimmer for a hint.
  hint() {
    this.tone(1046.5, 0.12, 'triangle', 0.14);
    this.tone(1568, 0.18, 'triangle', 0.12, 0.08);
  }

  // A rising arpeggio when a level is cleared.
  win() {
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
      this.tone(freq, 0.3, 'triangle', 0.18, i * 0.11);
    });
  }

  // A short tick when the timer drops under ten seconds.
  tick() {
    this.tone(1200, 0.05, 'square', 0.05);
  }

  // A click for buttons.
  click() {
    this.tone(660, 0.06, 'sine', 0.1);
  }
}
