// All sound is generated live with the Web Audio API, so there are no audio files to load.

let ac = null;
let master = null;
let noiseBuf = null;
let ambientTimer = null;

export function init() {
  if (ac) {
    if (ac.state === 'suspended') ac.resume();
    return;
  }
  try {
    ac = new (window.AudioContext || window.webkitAudioContext)();
    master = ac.createGain();
    master.gain.value = 0.8;
    master.connect(ac.destination);
    noiseBuf = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  } catch (e) {
    ac = null;
  }
}

function ok() { return !!ac; }

function noise({ dur = 0.3, type = 'bandpass', freq = 1000, q = 1, gain = 0.3, attack = 0.01, release = 0.15, when = 0, sweepTo = null } = {}) {
  if (!ok()) return;
  const t = ac.currentTime + when;
  const src = ac.createBufferSource();
  src.buffer = noiseBuf;
  src.loop = true;
  const f = ac.createBiquadFilter();
  f.type = type;
  f.frequency.setValueAtTime(freq, t);
  if (sweepTo) f.frequency.exponentialRampToValueAtTime(sweepTo, t + dur);
  f.Q.value = q;
  const g = ac.createGain();
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(gain, t + attack);
  g.gain.setValueAtTime(gain, t + Math.max(attack, dur - release));
  g.gain.linearRampToValueAtTime(0, t + dur);
  src.connect(f).connect(g).connect(master);
  src.start(t, Math.random());
  src.stop(t + dur + 0.05);
}

function tone({ freq = 440, type = 'sine', dur = 0.2, gain = 0.2, attack = 0.005, when = 0, to = null } = {}) {
  if (!ok()) return;
  const t = ac.currentTime + when;
  const o = ac.createOscillator();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  if (to) o.frequency.exponentialRampToValueAtTime(to, t + dur);
  const g = ac.createGain();
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(gain, t + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(master);
  o.start(t);
  o.stop(t + dur + 0.05);
}

export function startAmbient() {
  if (!ok() || ambientTimer) return;
  // Low drone with a slowly wandering filter.
  const g = ac.createGain();
  g.gain.value = 0.05;
  const f = ac.createBiquadFilter();
  f.type = 'lowpass';
  f.frequency.value = 220;
  const lfo = ac.createOscillator();
  const lfoGain = ac.createGain();
  lfo.frequency.value = 0.07;
  lfoGain.gain.value = 90;
  lfo.connect(lfoGain).connect(f.frequency);
  [55, 55.6, 82.4].forEach((fr, i) => {
    const o = ac.createOscillator();
    o.type = i === 2 ? 'sine' : 'sawtooth';
    o.frequency.value = fr;
    o.connect(f);
    o.start();
  });
  f.connect(g).connect(master);
  lfo.start();
  // Fluorescent-light hum.
  const hum = ac.createOscillator();
  const hg = ac.createGain();
  hum.frequency.value = 120;
  hg.gain.value = 0.006;
  hum.connect(hg).connect(master);
  hum.start();

  const events = [footsteps, whisper, distantBark, distantPager, drip];
  const schedule = () => {
    ambientTimer = setTimeout(() => {
      events[Math.floor(Math.random() * events.length)]();
      schedule();
    }, 14000 + Math.random() * 16000);
  };
  schedule();
}

export function click() { noise({ dur: 0.04, type: 'highpass', freq: 2500, gain: 0.12, attack: 0.002, release: 0.03 }); }

export function beep(times = 3, gain = 0.12) {
  for (let i = 0; i < times; i++) tone({ freq: 2350, type: 'square', dur: 0.12, gain, when: i * 0.22 });
}

export function boop() { tone({ freq: 720, to: 260, type: 'sine', dur: 0.25, gain: 0.25 }); }

export function unlock() {
  noise({ dur: 0.06, type: 'bandpass', freq: 1800, q: 4, gain: 0.3 });
  tone({ freq: 523, dur: 0.3, gain: 0.12, when: 0.08 });
  tone({ freq: 784, dur: 0.5, gain: 0.12, when: 0.2 });
}

export function wrong() {
  tone({ freq: 140, type: 'square', dur: 0.3, gain: 0.1 });
  tone({ freq: 132, type: 'square', dur: 0.3, gain: 0.1 });
}

export function pickup() {
  tone({ freq: 660, dur: 0.18, gain: 0.08 });
  tone({ freq: 990, dur: 0.3, gain: 0.06, when: 0.08 });
}

export function paper() {
  for (let i = 0; i < 4; i++) noise({ dur: 0.08, type: 'highpass', freq: 3000 + Math.random() * 2000, gain: 0.12, when: i * 0.07 });
}

export function staticBurst(dur = 2.2) {
  noise({ dur, type: 'bandpass', freq: 2200, q: 0.6, gain: 0.22, attack: 0.05, release: 0.6 });
  // A warped, half-heard melody under the static.
  [392, 440, 494, 440, 392, 330].forEach((fr, i) => tone({ freq: fr * 0.97, type: 'triangle', dur: 0.32, gain: 0.035, when: 0.5 + i * 0.18 }));
}

export function steam() { noise({ dur: 1.4, type: 'highpass', freq: 2500, gain: 0.18, attack: 0.3, release: 0.6 }); }

export function sputter() {
  for (let i = 0; i < 5; i++) noise({ dur: 0.08, type: 'lowpass', freq: 400, gain: 0.35, when: i * 0.11 + Math.random() * 0.05 });
}

export function grind() { noise({ dur: 0.9, type: 'bandpass', freq: 600, q: 2, gain: 0.25, attack: 0.05, release: 0.2 }); }

export function scratch() {
  for (let i = 0; i < 4; i++) noise({ dur: 0.12, type: 'bandpass', freq: 3200, q: 3, gain: 0.16, when: i * 0.16, sweepTo: 1800 });
}

export function sting() {
  // Jump scare: hard noise hit plus a dissonant cluster.
  noise({ dur: 0.9, type: 'lowpass', freq: 5000, gain: 0.55, attack: 0.005, release: 0.7 });
  [233, 247, 349, 370].forEach((fr) => tone({ freq: fr, type: 'sawtooth', dur: 1.4, gain: 0.09, attack: 0.003 }));
}

export function hiss() { noise({ dur: 1.1, type: 'highpass', freq: 3500, gain: 0.35, attack: 0.02, release: 0.5 }); }

export function footsteps() {
  for (let i = 0; i < 4; i++) {
    noise({ dur: 0.09, type: 'lowpass', freq: 180, gain: 0.35 - i * 0.05, when: i * 0.6 });
    tone({ freq: 70, to: 45, dur: 0.12, gain: 0.08, when: i * 0.6 });
  }
}

export function whisper() { noise({ dur: 2.6, type: 'bandpass', freq: 1400, q: 5, gain: 0.08, attack: 1.0, release: 1.2, sweepTo: 900 }); }

export function distantBark() {
  [0, 0.28].forEach((w) => {
    tone({ freq: 520, to: 300, type: 'square', dur: 0.12, gain: 0.025, when: w });
    noise({ dur: 0.12, type: 'bandpass', freq: 700, q: 2, gain: 0.04, when: w });
  });
}

export function bark() {
  [0, 0.3, 0.55].forEach((w) => {
    tone({ freq: 560, to: 320, type: 'square', dur: 0.13, gain: 0.06, when: w });
    noise({ dur: 0.13, type: 'bandpass', freq: 800, q: 2, gain: 0.08, when: w });
  });
}

export function distantPager() { beep(3, 0.025); }

export function drip() { tone({ freq: 1400, to: 600, dur: 0.15, gain: 0.05 }); }

export function door() {
  noise({ dur: 0.8, type: 'bandpass', freq: 300, q: 1, gain: 0.25, attack: 0.1, release: 0.4 });
  tone({ freq: 90, to: 60, dur: 0.6, gain: 0.12, when: 0.5 });
}
