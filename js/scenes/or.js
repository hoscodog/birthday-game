// Room 6: OR 1, the finale. Her actual job is the puzzle: the surgical count is off by one Kelly clamp.
// Once she calls it, the clamp gets pushed in under the doors (by paws), and it's the only thing that can grip
// the snapped-off breaker handle. Throwing the breaker = blackout. A pale hand reaches out of the dark and she has
// to finish the handshake (dap, finger bump, finger guns, blow the smoke). Then the lights come on: party.
import { rr, tiles, stains, text, cached, rng, dog, partyHat, paleHand, candle, HAND } from '../draw.js';
import { POEM_PAGES, FINAL_VERSE } from '../poems.js';

// "Wes Anderson" by Alex Lahey. It plays in a Spotify embed the moment the lights come on.
const SONG_URL = 'https://open.spotify.com/track/1Nlk3KvJVeqakRGI0pdbXS';
const SONG_URI = 'spotify:track:1Nlk3KvJVeqakRGI0pdbXS';

/* ---------- the song ---------- */
// The Spotify player is loaded (hidden) as soon as she reaches the OR, so it's ready to start the instant the
// handshake lands. That click counts as the user gesture browsers want before they allow sound.
let spotify = null;
let wantPlay = false;
let playerBox = null;

function loadSpotify() {
  if (playerBox) return;
  playerBox = document.createElement('div');
  playerBox.id = 'spotify';
  const slot = document.createElement('div');
  playerBox.appendChild(slot);
  document.body.insertBefore(playerBox, document.getElementById('toast'));
  window.onSpotifyIframeApiReady = (api) => {
    api.createController(slot, { uri: SONG_URI, width: 320, height: 80 }, (ctl) => {
      spotify = ctl;
      if (wantPlay) ctl.play();
    });
  };
  const sc = document.createElement('script');
  sc.src = 'https://open.spotify.com/embed/iframe-api/v1';
  sc.async = true;
  document.head.appendChild(sc);
}

function showPlayer() {
  loadSpotify();
  playerBox.classList.add('show');
}

// Returns false if the player never loaded (offline, blocked), so the caller can fall back.
function playSong() {
  showPlayer();
  wantPlay = true;
  if (spotify) { spotify.play(); return true; }
  return false;
}

const DOORS = { x: 40, y: 240, w: 240, h: 420 };
const UNDER_DOOR = { x: 90, y: 660, w: 150, h: 60 };
const PANEL = { x: 310, y: 300, w: 110, h: 150 };
const TABLE = { x: 470, y: 500, w: 400, h: 90 };
const LIGHT = { x: 560, y: 60, w: 220, h: 200 };
const BOARD = { x: 960, y: 80, w: 580, h: 270 };
const BACK = { x: 900, y: 470, w: 660, h: 220 };
const HAND_AT = { x: 820, y: 470 };

// The count sheet: what went onto the field. Note what isn't on it.
const COUNT = [
  ['Raytec sponges', 10],
  ['Lap sponges', 5],
  ['Kelly clamps', 6],
  ['Mosquito clamps', 4],
  ['Needle drivers', 2],
  ['Metzenbaum scissors', 1],
  ['Mayo scissors', 1],
  ['Adson forceps', 2],
  ['#10 blade', 1],
];

/* ---------- instruments, top-down on the back table ---------- */
function ringed(c, x, y, len, kind) {
  c.save();
  c.translate(x, y);
  c.strokeStyle = '#c9d0d4';
  c.fillStyle = '#c9d0d4';
  c.lineWidth = kind === 'mosquito' ? 2.5 : 3.5;
  const ring = kind === 'mosquito' ? 6 : 8;
  c.beginPath(); c.arc(-6, len, ring, 0, Math.PI * 2); c.stroke();
  c.beginPath(); c.arc(8, len, ring, 0, Math.PI * 2); c.stroke();
  c.beginPath(); c.moveTo(-4, len - ring); c.lineTo(0, 10); c.moveTo(6, len - ring); c.lineTo(1, 10); c.stroke();
  c.beginPath(); c.arc(0.5, 14, 3, 0, Math.PI * 2); c.fill(); // box lock
  if (kind === 'scissors') {
    c.beginPath(); c.moveTo(0, 12); c.quadraticCurveTo(-8, -14, -3, -30); c.moveTo(1, 12); c.quadraticCurveTo(8, -14, 3, -30); c.stroke();
  } else if (kind === 'driver') {
    c.lineWidth = 6;
    c.beginPath(); c.moveTo(0.5, 12); c.lineTo(0.5, -10); c.stroke();
  } else {
    c.lineWidth = kind === 'mosquito' ? 2 : 3;
    c.beginPath(); c.moveTo(0, 12); c.lineTo(-1, -26); c.moveTo(1, 12); c.lineTo(2, -26); c.stroke();
  }
  c.restore();
}
function forceps(c, x, y) {
  c.strokeStyle = '#c9d0d4';
  c.lineWidth = 3;
  c.beginPath(); c.moveTo(x, y + 50); c.lineTo(x - 4, y - 10); c.lineTo(x - 1, y - 26); c.moveTo(x, y + 50); c.lineTo(x + 4, y - 10); c.lineTo(x + 1, y - 26); c.stroke();
}
function blade(c, x, y) {
  c.fillStyle = '#c9d0d4';
  c.fillRect(x - 3, y - 4, 6, 56);
  c.fillStyle = '#e8eef0';
  c.beginPath(); c.moveTo(x - 3, y - 4); c.quadraticCurveTo(x - 8, y - 22, x + 1, y - 30); c.lineTo(x + 3, y - 4); c.closePath(); c.fill();
}

/* ---------- things that have no business on a sterile field ---------- */
function knifePath(c) {
  c.beginPath();
  c.moveTo(78, -11);
  c.lineTo(250, -4);
  c.quadraticCurveTo(226, 14, 78, 15);
  c.closePath();
}
// A big kitchen knife, top-down, butt of the handle at (x, y), pointing along rot.
function kitchenKnife(c, x, y, rot = 0, s = 1) {
  c.save();
  c.translate(x, y);
  c.rotate(rot);
  c.scale(s, s);
  c.fillStyle = '#1e1a17';
  rr(c, 0, -9, 72, 18, 7);
  c.fill();
  c.fillStyle = '#c9d0d4';
  [16, 36, 56].forEach((rx) => { c.beginPath(); c.arc(rx, 0, 2.6, 0, Math.PI * 2); c.fill(); });
  c.fillStyle = '#9aa0a4';
  c.fillRect(70, -11, 9, 26);
  c.fillStyle = '#dfe5e8';
  knifePath(c);
  c.fill();
  c.strokeStyle = 'rgba(255,255,255,0.7)';
  c.lineWidth = 1.5;
  c.beginPath(); c.moveTo(84, -8); c.lineTo(238, -4); c.stroke();
  c.restore();
}
// Where the knife was: a dent in the drape, and a faint outline.
function knifeGhost(c, x, y) {
  c.save();
  c.translate(x, y);
  c.fillStyle = 'rgba(10,20,30,0.28)';
  rr(c, 0, -9, 72, 18, 7);
  c.fill();
  knifePath(c);
  c.fill();
  c.setLineDash([6, 5]);
  c.strokeStyle = 'rgba(200,215,225,0.35)';
  c.lineWidth = 2;
  c.stroke();
  c.restore();
}
function hatchet(c, x, y, rot) {
  c.save();
  c.translate(x, y);
  c.rotate(rot);
  c.fillStyle = '#7a5230';
  rr(c, 0, -6, 172, 12, 5);
  c.fill();
  c.strokeStyle = '#5c3c22';
  c.lineWidth = 1.5;
  c.beginPath(); c.moveTo(10, -2); c.lineTo(150, -1); c.stroke();
  c.fillStyle = '#6f777c';
  c.fillRect(140, -11, 38, 22);
  c.fillStyle = '#9ea7ac';
  c.beginPath(); c.moveTo(144, 10); c.lineTo(174, 10); c.lineTo(192, 54); c.quadraticCurveTo(160, 68, 126, 54); c.closePath(); c.fill();
  c.strokeStyle = '#e3e9ec';
  c.lineWidth = 2.5;
  c.beginPath(); c.moveTo(192, 54); c.quadraticCurveTo(160, 68, 126, 54); c.stroke();
  c.fillStyle = 'rgba(120,8,8,0.85)';
  c.beginPath(); c.ellipse(170, 56, 12, 5, 0.2, 0, Math.PI * 2); c.fill();
  c.restore();
}
function bullets(c, x, y) {
  for (let k = 0; k < 6; k++) {
    const bx = x + k * 16;
    c.fillStyle = '#c9a23f';
    c.fillRect(bx - 3.5, y + 6, 7, 14);
    c.fillStyle = '#e3c76a';
    c.fillRect(bx - 3.5, y + 6, 2, 14);
    c.fillStyle = '#b8663a';
    c.beginPath(); c.ellipse(bx, y + 6, 3.5, 6, 0, Math.PI, 0); c.fill();
  }
}
function boneSaw(c, x, y) {
  c.save();
  c.translate(x, y);
  c.fillStyle = '#5a3b24';
  rr(c, -13, 52, 26, 40, 8);
  c.fill();
  c.fillStyle = '#2c4f6e';
  rr(c, -6, 60, 12, 22, 5);
  c.fill();
  c.fillStyle = '#b9c1c5';
  c.fillRect(-10, -6, 18, 60);
  c.fillStyle = '#8e979c';
  c.fillRect(-12, -6, 5, 60); // spine
  c.fillStyle = '#b9c1c5';
  c.beginPath();
  for (let k = 0; k < 10; k++) { c.moveTo(8, -6 + k * 6); c.lineTo(13, -3 + k * 6); c.lineTo(8, k * 6); }
  c.fill();
  c.fillStyle = 'rgba(120,8,8,0.8)';
  c.fillRect(8, 30, 5, 14);
  c.restore();
}
function cleaver(c, x, y) {
  c.save();
  c.translate(x, y);
  c.fillStyle = '#1e1a17';
  rr(c, -5, 56, 10, 40, 4);
  c.fill();
  c.fillStyle = '#aab3b7';
  rr(c, -18, -6, 36, 64, 3);
  c.fill();
  c.fillStyle = '#e3e9ec';
  c.fillRect(14, -6, 4, 64); // edge
  c.fillStyle = '#2c4f6e';
  c.beginPath(); c.arc(-9, 4, 4, 0, Math.PI * 2); c.fill();
  c.fillStyle = 'rgba(120,8,8,0.75)';
  c.beginPath(); c.ellipse(12, 40, 5, 10, 0, 0, Math.PI * 2); c.fill();
  c.restore();
}
function meatHook(c, x, y) {
  c.save();
  c.translate(x, y);
  c.strokeStyle = '#8e979c';
  c.lineWidth = 5;
  c.lineCap = 'round';
  c.beginPath();
  c.arc(0, 14, 14, Math.PI, 0);
  c.lineTo(14, 74);
  c.arc(0, 74, 14, 0, Math.PI * 0.95);
  c.lineTo(-15, 62);
  c.stroke();
  c.fillStyle = '#b9c1c5';
  c.beginPath(); c.moveTo(-18, 64); c.lineTo(-14, 52); c.lineTo(-11, 64); c.closePath(); c.fill(); // the point
  c.fillStyle = 'rgba(120,8,8,0.85)';
  c.beginPath(); c.ellipse(4, 92, 4, 7, 0, 0, Math.PI * 2); c.fill();
  c.beginPath(); c.ellipse(5, 104, 2.5, 4, 0, 0, Math.PI * 2); c.fill();
  c.restore();
}
function handprint(c, x, y) {
  c.save();
  c.translate(x, y);
  c.rotate(-0.25);
  c.fillStyle = 'rgba(128,10,10,0.85)';
  c.beginPath(); c.ellipse(0, 6, 15, 13, 0, 0, Math.PI * 2); c.fill();
  [[-13, -6, -0.6, 10], [-6, -14, -0.15, 14], [2, -16, 0, 15], [9, -13, 0.15, 13]].forEach(([fx, fy, r, l]) => {
    c.save(); c.translate(fx, fy); c.rotate(r);
    c.beginPath(); c.ellipse(0, -l / 2 + 6, 3.6, l / 2 + 2, 0, 0, Math.PI * 2); c.fill();
    c.restore();
  });
  c.beginPath(); c.ellipse(15, 8, 3.6, 9, 1.0, 0, Math.PI * 2); c.fill(); // thumb
  c.restore();
}

// The back table top, in its own coordinates (0..660 by 0..220). `diff` holds whatever has changed.
const KNIFE_AT = [36, 197];
function drawBackTable(c, diff = {}) {
  const w = BACK.w;
  const h = BACK.h;
  c.fillStyle = '#2c4f6e';
  rr(c, 0, 0, w, h, 6);
  c.fill();
  c.fillStyle = '#284a68';
  c.fillRect(0, h - 10, w, 10);
  // row 1: Kelly clamps (6) + mosquitos (4)
  for (let k = 0; k < 6; k++) ringed(c, 40 + k * 34, 30, 58, 'clamp');
  for (let k = 0; k < 4; k++) ringed(c, 250 + k * 28, 34, 48, 'mosquito');
  if (diff.bullets) bullets(c, 252, 96);
  // needle drivers, scissors, forceps, blade
  ringed(c, 400, 30, 60, 'driver');
  if (diff.cleaver) cleaver(c, 436, 30); else ringed(c, 436, 30, 60, 'driver');
  if (diff.saw) boneSaw(c, 486, 30); else ringed(c, 486, 30, 54, 'scissors'); // Metz (long, fine)
  if (diff.mayo) {
    c.save(); c.translate(526, 57); c.rotate(Math.PI); c.translate(-526, -57);
    ringed(c, 526, 36, 42, 'scissors');
    c.restore();
  } else ringed(c, 526, 36, 42, 'scissors'); // Mayo (shorter)
  forceps(c, 572, 30);
  forceps(c, 594, 30);
  blade(c, diff.blade ? 366 : 628, 40);
  // row 2: raytecs (10) + laps (5)
  for (let k = 0; k < 10; k++) {
    const bloody = diff.raytec && k === 6;
    c.fillStyle = bloody ? '#8a1414' : '#ecebe4';
    c.fillRect(30 + k * 30, 130, 24, 30);
    c.fillStyle = bloody ? '#5e0b0b' : '#3b6fa8';
    c.fillRect(30 + k * 30, 141, 24, 4);
  }
  for (let k = 0; k < 5; k++) {
    c.fillStyle = '#ecebe4';
    c.fillRect(350 + k * 58, 120, 50, 54);
    c.fillStyle = '#3b6fa8';
    c.fillRect(350 + k * 58, 124, 50, 6);
    c.fillStyle = '#4f8f4a';
    c.fillRect(386 + k * 58, 162, 10, 8);
  }
  // row 3: the kitchen knife. It isn't on the count sheet. It shouldn't be here at all.
  if (diff.knife) knifeGhost(c, ...KNIFE_AT); else kitchenKnife(c, ...KNIFE_AT);
  if (diff.hand) handprint(c, 612, 192);
  if (diff.hatchet) hatchet(c, 380, 168, -0.25);
  if (diff.hook) meatHook(c, 662, 50);
}

// What can change, and where to click for it (table coordinates). The knife always goes missing.
const DIFFS = {
  knife: { rects: [{ x: 26, y: 180, w: 270, h: 36 }], line: 'The kitchen knife is gone.' },
  raytec: { rects: [{ x: 206, y: 124, w: 36, h: 42 }], line: 'A raytec soaked through red.' },
  mayo: { rects: [{ x: 508, y: 0, w: 36, h: 112 }], line: 'The Mayos are flipped.' },
  blade: { rects: [{ x: 352, y: 0, w: 28, h: 98 }, { x: 614, y: 0, w: 28, h: 98 }], line: 'The #10 blade moved.' },
  hand: { rects: [{ x: 592, y: 160, w: 56, h: 58 }], line: 'A bloody handprint on the drape.' },
  hatchet: { rects: [{ x: 508, y: 112, w: 82, h: 84 }, { x: 370, y: 128, w: 138, h: 56 }], line: 'A hatchet. On your back table.' },
  bullets: { rects: [{ x: 240, y: 94, w: 110, h: 30 }], line: 'Six bullets, lined up like instruments.' },
  saw: { rects: [{ x: 468, y: 0, w: 38, h: 126 }], line: 'A bone saw where the Metz should be.' },
  hook: { rects: [{ x: 640, y: 30, w: 54, h: 130 }], line: 'A meat hook, hanging off the edge.' },
  cleaver: { rects: [{ x: 416, y: 0, w: 40, h: 128 }], line: 'A cleaver where a needle driver was.' },
};
const SURGICAL = ['raytec', 'mayo', 'blade', 'hand'];
const HORROR = ['hatchet', 'bullets', 'saw', 'hook', 'cleaver'];
const pick = (a) => a[Math.floor(Math.random() * a.length)];

/* ---------- the close-up count ---------- */
// The back table blown up to fill the screen.
const ZS = 2.2;
const ZX = (1600 - BACK.w * ZS) / 2 - 20;
const ZY = 200;
const toView = (r) => ({ x: ZX + r.x * ZS, y: ZY + r.y * ZS, w: r.w * ZS, h: r.h * ZS });
const STEP_BACK = { x: 60, y: 760, w: 240, h: 64 };
const GOT_IT = { x: 1300, y: 760, w: 240, h: 64 };
const LOOK_MS = 9000;
const DARK_MS = 1700;

// phase: off | look | dark | find | done. Kept out of the save; a reload just puts the table back.
let view = { phase: 'off', diffs: [], found: [], t0: 0, flashUntil: 0 };
const counting = () => view.phase !== 'off';

function button(c, r, label) {
  c.fillStyle = 'rgba(20,24,28,0.85)';
  rr(c, r.x, r.y, r.w, r.h, 10);
  c.fill();
  c.strokeStyle = 'rgba(239,228,204,0.5)';
  c.lineWidth = 2;
  c.stroke();
  text(c, label, r.x + r.w / 2, r.y + r.h / 2, { size: 24, color: '#efe4cc' });
}

function drawCloseUp(c, t) {
  c.fillStyle = '#0d1114';
  c.fillRect(0, 0, 1600, 900);
  if (view.phase === 'dark') return;
  const shown = {};
  if (view.phase === 'find') view.diffs.forEach((k) => { shown[k] = true; });
  if (view.phase === 'done') shown.knife = true;
  c.save();
  c.translate(ZX, ZY);
  c.scale(ZS, ZS);
  drawBackTable(c, shown);
  c.restore();
  // red marker circles round what she's found
  c.strokeStyle = '#d41c22';
  c.lineWidth = 5;
  view.found.forEach((k) => {
    const r = toView(DIFFS[k].rects[0]);
    c.beginPath();
    c.ellipse(r.x + r.w / 2, r.y + r.h / 2, r.w / 2 + 14, r.h / 2 + 14, -0.04, 0, Math.PI * 2);
    c.stroke();
  });
  text(c, 'FINAL COUNT · BACK TABLE', 160, 84, { size: 30, color: '#efe4cc', align: 'left' });
  if (view.phase === 'look') {
    text(c, 'Take a good look. Everything’s where it should be… for now.', 160, 134, { size: 30, color: '#d9c27a', align: 'left', font: HAND });
    const left = Math.max(0, 1 - (t - view.t0) / LOOK_MS);
    c.fillStyle = 'rgba(217,194,122,0.6)';
    c.fillRect(160, 164, 500 * left, 4);
    button(c, GOT_IT, 'I’ve got it');
  } else if (view.phase === 'find') {
    text(c, 'Something changed. Find what’s different.', 160, 134, { size: 30, color: '#e07a6a', align: 'left', font: HAND });
    text(c, `${view.found.length} / ${view.diffs.length}`, 1540, 100, { size: 34, color: '#e07a6a', align: 'right' });
  } else if (view.phase === 'done') {
    text(c, 'Everything’s back. Except the knife.', 160, 134, { size: 30, color: '#e07a6a', align: 'left', font: HAND });
  }
  if (view.phase === 'look' || view.phase === 'find') button(c, STEP_BACK, 'Step back');
  // the flicker after a wrong call
  if (t < view.flashUntil && Math.random() < 0.6) {
    c.fillStyle = 'rgba(0,0,0,0.92)';
    c.fillRect(0, 0, 1600, 900);
  }
}

function startCount(g) {
  if (g.flag('orCounted')) {
    g.say(['Everything on the back table is where it should be. Lined up neat, just how you like it. Minus one kitchen knife.']);
    return;
  }
  view = { phase: 'look', diffs: [], found: [], t0: performance.now(), flashUntil: 0 };
  if (!g.flag('countHowTo')) {
    g.set('countHowTo');
    g.ui.toast('Memorize the table. When the lights come back, find what changed.');
  }
}

function goDark(g) {
  view.phase = 'dark';
  view.t0 = performance.now();
  view.diffs = ['knife', pick(SURGICAL), pick(HORROR)];
  view.found = [];
  g.audio.breaker();
  g.audio.whisper();
  setTimeout(() => g.audio.heartbeat(), 500);
}

function missed(g) {
  g.audio.wrong();
  g.audio.whisper();
  g.shake(160);
  g.ui.toast('“From the top.”');
  view = { phase: 'look', diffs: [], found: [], t0: performance.now(), flashUntil: performance.now() + 450 };
}

function foundDiff(g, k) {
  view.found.push(k);
  g.audio.beep(1, 0.08);
  g.ui.toast(DIFFS[k].line);
  if (view.found.length < view.diffs.length) return;
  view.phase = 'done';
  view.t0 = performance.now();
  setTimeout(() => {
    view.phase = 'off';
    countFound(g);
  }, 1400);
}

function closeUpSpots(g) {
  if (view.phase === 'dark' || view.phase === 'done') return [];
  // Hidden labels so the hover tooltip doesn't give away the answers.
  const spots = [{ x: 0, y: 0, w: 1600, h: 900, label: '', click: () => { if (view.phase === 'find') missed(g); } }];
  if (view.phase === 'find') {
    view.diffs.filter((k) => !view.found.includes(k)).forEach((k) => {
      DIFFS[k].rects.forEach((r) => spots.push({ ...toView(r), label: '', click: () => foundDiff(g, k) }));
    });
  }
  if (view.phase === 'look') spots.push({ ...GOT_IT, label: 'I’ve got it', click: () => goDark(g) });
  spots.push({ ...STEP_BACK, label: 'Step back', click: () => { view.phase = 'off'; } });
  return spots;
}

const background = cached((c) => {
  const r = rng(1129);
  tiles(c, 0, 0, 1600, 640, 64, '#5e7a78', '#4a615f', r);
  stains(c, r, 0, 0, 1600, 640, 26, '40,40,30');
  const top = c.createLinearGradient(0, 0, 0, 200);
  top.addColorStop(0, 'rgba(0,0,0,0.55)');
  top.addColorStop(1, 'rgba(0,0,0,0)');
  c.fillStyle = top;
  c.fillRect(0, 0, 1600, 200);
  tiles(c, 0, 640, 1600, 260, 100, '#606a68', '#4b5352', r);
  c.fillStyle = '#26221c';
  c.fillRect(0, 634, 1600, 10);

  // double doors with round windows
  c.fillStyle = '#2b2620';
  c.fillRect(DOORS.x - 12, DOORS.y - 12, DOORS.w + 24, DOORS.h + 12);
  c.fillStyle = '#8c9aa0';
  c.fillRect(DOORS.x, DOORS.y, DOORS.w / 2 - 3, DOORS.h);
  c.fillRect(DOORS.x + DOORS.w / 2 + 3, DOORS.y, DOORS.w / 2 - 3, DOORS.h);
  c.fillStyle = '#0b0d10';
  [DOORS.x + 60, DOORS.x + DOORS.w - 60].forEach((wx) => { c.beginPath(); c.arc(wx, DOORS.y + 110, 34, 0, Math.PI * 2); c.fill(); });
  c.fillStyle = '#6c787e';
  c.fillRect(DOORS.x, DOORS.y + 320, DOORS.w, 26);
  // scratches all over the bottom of the doors
  c.strokeStyle = 'rgba(230,225,215,0.45)';
  c.lineWidth = 2;
  for (let k = 0; k < 14; k++) {
    const sx = DOORS.x + 20 + k * 15;
    c.beginPath(); c.moveTo(sx, DOORS.y + DOORS.h - 70 - (k % 3) * 10); c.lineTo(sx + 10, DOORS.y + DOORS.h - 8); c.stroke();
  }

  // breaker panel
  c.fillStyle = '#4a5156';
  c.fillRect(PANEL.x, PANEL.y, PANEL.w, PANEL.h);
  c.strokeStyle = '#2a2f33';
  c.lineWidth = 3;
  c.strokeRect(PANEL.x + 8, PANEL.y + 8, PANEL.w - 16, PANEL.h - 16);
  c.fillStyle = '#f3d36b';
  c.beginPath(); c.moveTo(PANEL.x + 55, PANEL.y + 24); c.lineTo(PANEL.x + 75, PANEL.y + 58); c.lineTo(PANEL.x + 35, PANEL.y + 58); c.closePath(); c.fill();
  c.fillStyle = '#222';
  c.fillRect(PANEL.x + 52, PANEL.y + 32, 6, 16);
  c.fillStyle = '#1a1c1e';
  c.fillRect(PANEL.x + 40, PANEL.y + 80, 30, 48);
  c.fillStyle = '#9aa0a4';
  c.fillRect(PANEL.x + 50, PANEL.y + 84, 10, 10); // the snapped-off stub

  // surgical light: ceiling arm + big round head
  c.strokeStyle = '#8c9296';
  c.lineWidth = 14;
  c.beginPath(); c.moveTo(670, 0); c.lineTo(670, 50); c.lineTo(650, 110); c.stroke();
  c.fillStyle = '#c9ced1';
  c.beginPath(); c.ellipse(670, 150, 110, 48, 0, 0, Math.PI * 2); c.fill();
  c.fillStyle = '#8c9296';
  c.beginPath(); c.ellipse(670, 160, 96, 34, 0, 0, Math.PI * 2); c.fill();

  // OR table
  c.fillStyle = '#3a3f44';
  c.fillRect(TABLE.x + 170, TABLE.y + 80, 60, 140);
  c.fillRect(TABLE.x + 110, TABLE.y + 210, 180, 20);
  c.fillStyle = '#25282b';
  rr(c, TABLE.x, TABLE.y + 30, TABLE.w, 50, 8);
  c.fill();
  c.fillStyle = '#4f6f8c';
  rr(c, TABLE.x + 6, TABLE.y + 10, TABLE.w - 12, 34, 10);
  c.fill();

  // whiteboard frame
  c.fillStyle = '#9aa0a4';
  c.fillRect(BOARD.x - 8, BOARD.y - 8, BOARD.w + 16, BOARD.h + 16);
  c.fillStyle = '#e8ebe8';
  c.fillRect(BOARD.x, BOARD.y, BOARD.w, BOARD.h);
  stains(c, r, BOARD.x, BOARD.y, BOARD.w, BOARD.h, 6, '90,90,80');
  c.strokeStyle = '#9aa0a4';
  c.lineWidth = 3;
  c.beginPath(); c.moveTo(BOARD.x + 290, BOARD.y + 10); c.lineTo(BOARD.x + 290, BOARD.y + BOARD.h - 10); c.stroke();

  // back table legs and the drape hanging off the front (the top is drawn per frame)
  c.fillStyle = '#8c9296';
  c.fillRect(BACK.x + 30, BACK.y + BACK.h + 50, 12, 110);
  c.fillRect(BACK.x + BACK.w - 42, BACK.y + BACK.h + 50, 12, 110);
  c.fillStyle = '#244560';
  c.fillRect(BACK.x, BACK.y + BACK.h - 4, BACK.w, 54);
});

function drawBoard(c, g) {
  const L = BOARD.x + 18;
  const ink = '#1d3d7a';
  const party = g.flag('party');
  text(c, 'OR 1 · TONIGHT', L, BOARD.y + 28, { size: 22, color: '#7a1010', align: 'left', font: HAND });
  text(c, 'Patient: D. Dominguez', L, BOARD.y + 70, { size: 24, color: ink, align: 'left', font: HAND });
  text(c, 'DOB: 11/29/1997', L, BOARD.y + 104, { size: 24, color: ink, align: 'left', font: HAND });
  if (party) {
    text(c, 'Procedure: BIRTHDAY!', L, BOARD.y + 146, { size: 26, color: '#b3241f', align: 'left', font: HAND });
    text(c, 'Status: very, very loved', L, BOARD.y + 182, { size: 24, color: ink, align: 'left', font: HAND });
  } else {
    text(c, 'Procedure:', L, BOARD.y + 146, { size: 24, color: ink, align: 'left', font: HAND });
    c.fillStyle = 'rgba(40,60,110,0.35)';
    c.fillRect(L + 106, BOARD.y + 134, 150, 24);
    text(c, 'Surgeon: none listed', L, BOARD.y + 182, { size: 24, color: ink, align: 'left', font: HAND });
  }
  text(c, 'Surg tech: you', L, BOARD.y + 218, { size: 24, color: ink, align: 'left', font: HAND });
  // count sheet
  const R = BOARD.x + 308;
  text(c, 'COUNT', R, BOARD.y + 26, { size: 22, color: '#7a1010', align: 'left', font: HAND });
  text(c, g.has('Kitchen knife') || party ? 'final: ✓' : 'final: ???', R + 160, BOARD.y + 26, { size: 18, color: '#7a1010', align: 'left', font: HAND });
  COUNT.forEach(([name, n], i) => {
    text(c, name, R, BOARD.y + 50 + i * 22, { size: 18, color: ink, align: 'left', font: HAND });
    text(c, String(n), R + 240, BOARD.y + 50 + i * 22, { size: 18, color: ink, align: 'right', font: HAND });
  });
  // added in red, in handwriting that isn't yours, once she's called it
  if (g.flag('orCounted')) {
    const y = BOARD.y + 50 + COUNT.length * 22;
    text(c, 'Kitchen knife', R, y, { size: 19, color: '#b3241f', align: 'left', font: HAND, rot: -0.03 });
    text(c, '1', R + 240, y, { size: 19, color: '#b3241f', align: 'right', font: HAND });
  }
}

function drawFloorKnife(c, x, y) {
  kitchenKnife(c, x - 80, y + 14, -0.12, 0.62);
}

function sittingCat(c, x, y, s) {
  // Dio: grey and white, sitting, deeply unimpressed
  const grey = '#7d838a';
  const white = '#eeeeea';
  c.save();
  c.translate(x, y);
  c.scale(s, s);
  c.strokeStyle = grey;
  c.lineWidth = 9;
  c.lineCap = 'round';
  c.beginPath(); c.moveTo(28, 56); c.quadraticCurveTo(70, 50, 56, 10); c.stroke();
  c.fillStyle = grey;
  c.beginPath(); c.ellipse(0, 30, 34, 40, 0, 0, Math.PI * 2); c.fill();
  c.fillStyle = white;
  c.beginPath(); c.ellipse(0, 40, 20, 30, 0, 0, Math.PI * 2); c.fill();
  c.beginPath(); c.ellipse(-12, 68, 9, 5, 0, 0, Math.PI * 2); c.ellipse(12, 68, 9, 5, 0, 0, Math.PI * 2); c.fill();
  c.fillStyle = grey;
  c.beginPath(); c.moveTo(-24, -26); c.lineTo(-18, -54); c.lineTo(-4, -38); c.closePath(); c.fill();
  c.beginPath(); c.moveTo(24, -26); c.lineTo(18, -54); c.lineTo(4, -38); c.closePath(); c.fill();
  c.beginPath(); c.arc(0, -16, 26, 0, Math.PI * 2); c.fill();
  c.fillStyle = '#d99aa0';
  c.beginPath(); c.moveTo(-20, -30); c.lineTo(-17, -47); c.lineTo(-9, -37); c.closePath(); c.fill();
  c.beginPath(); c.moveTo(20, -30); c.lineTo(17, -47); c.lineTo(9, -37); c.closePath(); c.fill();
  c.strokeStyle = '#5a6066';
  c.lineWidth = 3;
  [-8, 0, 8].forEach((sx) => { c.beginPath(); c.moveTo(sx, -40); c.lineTo(sx * 0.8, -30); c.stroke(); });
  c.fillStyle = white;
  c.beginPath(); c.ellipse(0, -6, 17, 13, 0, 0, Math.PI * 2); c.fill();
  c.fillStyle = '#d99aa0';
  c.beginPath(); c.moveTo(-3, -11); c.lineTo(3, -11); c.lineTo(0, -7); c.closePath(); c.fill();
  c.fillStyle = '#9fc23a';
  c.beginPath(); c.ellipse(-10, -18, 6, 3, 0.2, 0, Math.PI * 2); c.ellipse(10, -18, 6, 3, -0.2, 0, Math.PI * 2); c.fill(); // unimpressed squint
  partyHat(c, 6, -40, 0.7, '#3b6fa8', '#f3d36b');
  c.restore();
}

/* ---------- photos (optional) ---------- */
// Drop photos into assets/ as photo1.jpg, photo2.jpg ... (or .png). Any that exist show up in the finale.
const photos = [];
(function loadPhotos() {
  for (let i = 1; i <= 8; i++) {
    const img = new Image();
    img.onload = () => { photos[i - 1] = img; };
    img.onerror = () => {
      if (img.src.endsWith('.jpg')) img.src = `assets/photo${i}.png`;
    };
    img.src = `assets/photo${i}.jpg`;
  }
})();
const loadedPhotos = () => photos.filter(Boolean);

function polaroid(c, img, x, y, rot) {
  c.save();
  c.translate(x, y);
  c.rotate(rot);
  c.fillStyle = '#f4f1ea';
  c.fillRect(-58, -6, 116, 136);
  const sw = 100;
  const sh = 100;
  const k = Math.max(sw / img.width, sh / img.height);
  c.save();
  c.beginPath();
  c.rect(-50, 2, sw, sh);
  c.clip();
  c.drawImage(img, -img.width * k / 2, 2 + sh / 2 - img.height * k / 2, img.width * k, img.height * k);
  c.restore();
  c.fillStyle = '#d33';
  c.beginPath(); c.arc(0, -4, 5, 0, Math.PI * 2); c.fill();
  c.restore();
}

/* ---------- party ---------- */
const confetti = Array.from({ length: 140 }, (_, i) => ({
  x: Math.random() * 1600,
  y: Math.random() * -900,
  v: 40 + Math.random() * 70,
  s: 5 + Math.random() * 6,
  col: ['#e04a8a', '#f3d36b', '#3fb0dc', '#7fe08a', '#c9a6ef', '#ff8a4a'][i % 6],
  w: Math.random() * Math.PI * 2,
}));
const BALLOONS = [[470, 170, '#e04a8a'], [530, 140, '#f3d36b'], [1500, 400, '#3fb0dc'], [1440, 440, '#c9a6ef'], [870, 230, '#ff8a4a']];

function drawParty(c, t, g) {
  const since = t - partyAt;
  // banner bunting
  c.strokeStyle = '#ddd';
  c.lineWidth = 2;
  c.beginPath(); c.moveTo(250, 14); c.quadraticCurveTo(790, 50, 1330, 14); c.stroke();
  const letters = 'HAPPY BIRTHDAY DEBBIE';
  const cols = ['#e04a8a', '#f3d36b', '#3fb0dc', '#7fe08a', '#c9a6ef'];
  for (let i = 0; i < letters.length; i++) {
    const u = (i + 0.5) / letters.length;
    const bx = 270 + u * 1040;
    const by = 14 + 18 * 4 * (u - u * u);
    c.fillStyle = cols[i % cols.length];
    c.beginPath(); c.moveTo(bx - 23, by); c.lineTo(bx + 23, by); c.lineTo(bx, by + 50); c.closePath(); c.fill();
    if (letters[i] !== ' ') text(c, letters[i], bx, by + 16, { size: 21, color: '#1a1a1a' });
  }
  // balloons
  BALLOONS.forEach(([bx, by, col], i) => {
    const yy = by + Math.sin(t / 900 + i) * 8;
    c.strokeStyle = 'rgba(230,230,230,0.6)';
    c.lineWidth = 1.5;
    c.beginPath(); c.moveTo(bx, yy + 50); c.quadraticCurveTo(bx + 14, yy + 120, bx, yy + 200); c.stroke();
    c.fillStyle = col;
    c.beginPath(); c.ellipse(bx, yy, 38, 48, 0, 0, Math.PI * 2); c.fill();
    c.fillStyle = 'rgba(255,255,255,0.35)';
    c.beginPath(); c.ellipse(bx - 12, yy - 16, 8, 14, -0.4, 0, Math.PI * 2); c.fill();
  });
  // polaroids hanging by the doors
  const ph = loadedPhotos().slice(0, 3);
  if (ph.length) {
    c.strokeStyle = '#ddd';
    c.lineWidth = 2;
    c.beginPath(); c.moveTo(20, 110); c.quadraticCurveTo(200, 140, 460, 110); c.stroke();
    ph.forEach((img, i) => polaroid(c, img, 90 + i * 150, 122 + (i === 1 ? 6 : 0), (i - 1) * 0.08));
  }
  // cake on the OR table
  const cx = TABLE.x + TABLE.w / 2;
  const cy = TABLE.y + 12;
  c.fillStyle = '#f4f1ea';
  c.beginPath(); c.ellipse(cx, cy, 120, 16, 0, 0, Math.PI * 2); c.fill();
  c.fillStyle = '#f3c6d8';
  rr(c, cx - 90, cy - 70, 180, 66, 10); c.fill();
  c.fillStyle = '#e04a8a';
  rr(c, cx - 64, cy - 122, 128, 56, 10); c.fill();
  c.fillStyle = '#fff';
  for (let k = 0; k < 8; k++) { c.beginPath(); c.arc(cx - 80 + k * 23, cy - 68, 8, 0, Math.PI); c.fill(); }
  text(c, 'DEBBIE', cx, cy - 36, { size: 24, color: '#8a1d4a', font: HAND });
  candle(c, cx - 22, cy - 120, 34, true, t, 1);
  candle(c, cx + 22, cy - 120, 34, true, t, 2);
  text(c, '2', cx - 22, cy - 138, { size: 18, color: '#3b6fa8' });
  text(c, '9', cx + 22, cy - 138, { size: 18, color: '#3b6fa8' });
  if (g.flag('cakeCut')) {
    // a slice out of the front, the card that was baked inside, the slice on a plate and the knife
    c.fillStyle = '#f6e2b8';
    c.fillRect(cx + 34, cy - 70, 40, 66);
    c.fillStyle = '#c23a5a';
    c.fillRect(cx + 34, cy - 42, 40, 6);
    c.save();
    c.translate(cx + 54, cy - 70);
    c.rotate(0.1);
    c.fillStyle = '#efe6c0';
    c.fillRect(-20, -34, 40, 36);
    text(c, 'Debbie', 0, -16, { size: 14, color: '#5a1010', font: HAND });
    c.restore();
    c.fillStyle = '#f4f1ea';
    c.beginPath(); c.ellipse(cx + 160, cy + 2, 40, 9, 0, 0, Math.PI * 2); c.fill();
    c.fillStyle = '#f3c6d8';
    c.beginPath(); c.moveTo(cx + 134, cy - 2); c.lineTo(cx + 186, cy - 2); c.lineTo(cx + 186, cy - 34); c.closePath(); c.fill();
    c.fillStyle = '#c23a5a';
    c.fillRect(cx + 160, cy - 18, 26, 4);
    kitchenKnife(c, cx - 230, cy + 4, 0.02, 0.6);
  }
  // Dio on the breaker panel, in a hat he hates
  sittingCat(c, 365, 250, 0.9);
  // the dogs, very proud of themselves
  const hop = (n) => Math.max(0, Math.sin(t / 260 + n)) * 10;
  dog(c, 520, 690 - hop(0), 1.15, t, { coat: '#d9a865', shade: '#b9843f', belly: '#f0d9b0', hat: ['#e04a8a', '#f3d36b'], wag: 2 });
  dog(c, 820, 690 - hop(1.6), 1.15, t, { coat: '#f4f1ea', shade: '#d8d2c6', belly: '#ffffff', hat: ['#3fb0dc', '#f3d36b'], wag: 2 });
  text(c, 'KAGURA', 520, 822, { size: 16, color: '#efe4cc' });
  text(c, 'KANA', 820, 822, { size: 16, color: '#efe4cc' });
  // confetti
  confetti.forEach((p) => {
    const y = ((p.y + (since / 1000) * p.v) % 1000 + 1000) % 1000 - 60;
    const x = p.x + Math.sin(t / 700 + p.w) * 20;
    c.save();
    c.translate(x, y);
    c.rotate(t / 400 + p.w);
    c.fillStyle = p.col;
    c.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2);
    c.restore();
  });
  // the white flash as the lights slam on
  if (since < 900 && since >= 0) {
    c.fillStyle = `rgba(255,255,250,${1 - since / 900})`;
    c.fillRect(0, 0, 1600, 900);
  }
}

/* ---------- scene ---------- */
let nextScratch = 0;
// Animation start times. Kept out of the save on purpose: performance.now() restarts on reload.
let handAt = 0;
let partyAt = -1e9;

export default {
  name: 'OR 1',

  safe: (g) => g.flag('blackout') || counting(),
  flashlight: (g) => !g.flag('blackout') && view.phase !== 'dark',
  darkness: (g) => {
    if (counting()) return view.phase === 'dark' ? 1 : 0;
    return g.flag('party') ? 0 : g.flag('blackout') ? 1 : 0.97;
  },

  enter(g) {
    view.phase = 'off';
    loadSpotify();
    if (g.flag('party')) showPlayer();
    if (g.flag('blackout')) {
      g.audio.stopEvents();
      g.audio.ambientLevel(0, 0.5);
    }
    if (g.flag('party')) {
      g.ui.toast(g.flag('cakeCut') ? 'The party’s still going. Click the card in the cake.' : 'The party’s still going. Cut the cake.');
      return;
    }
    if (!g.flag('orIntro')) {
      g.set('orIntro');
      g.say([
        'OR 1. Freezing cold, like every OR.',
        'The board has your name on it as the patient. Your birthday. And the procedure is smudged out.',
        'Habit takes over before fear does. Before anything happens in this room, the count has to be right.',
      ]);
    }
  },

  update(t, g) {
    if (view.phase === 'look' && t - view.t0 > LOOK_MS && !g.ui.busy()) goDark(g);
    if (view.phase === 'dark' && t - view.t0 > DARK_MS) {
      view.phase = 'find';
      g.audio.lightsOn();
    }
    if (g.flag('blackout') && !g.flag('party') && t > nextScratch && !g.ui.busy()) {
      g.audio.scratch();
      if (Math.random() < 0.5) g.audio.pant();
      nextScratch = t + 4000 + Math.random() * 3000;
    }
  },

  draw(c, t, g) {
    if (counting()) {
      drawCloseUp(c, t);
      return;
    }
    background(c);
    drawBoard(c, g);
    c.save();
    c.translate(BACK.x, BACK.y);
    drawBackTable(c, { knife: g.flag('orCounted') });
    c.restore();
    if (g.flag('knifeUnderDoor') && !g.has('Kitchen knife')) drawFloorKnife(c, UNDER_DOOR.x + 60, UNDER_DOOR.y + 30);
    if (g.flag('party')) {
      drawParty(c, t, g);
      return;
    }
    // surgical light glow, flickering
    if (!g.flag('blackout')) {
      const f = Math.random() < 0.04 ? 0.3 : 1;
      c.fillStyle = `rgba(255,250,235,${0.85 * f})`;
      c.beginPath(); c.ellipse(670, 160, 90, 30, 0, 0, Math.PI * 2); c.fill();
      // breaker LED
      c.fillStyle = '#3fdc6a';
      c.beginPath(); c.arc(PANEL.x + 90, PANEL.y + 100, 4, 0, Math.PI * 2); c.fill();
    }
    if (g.flag('blackout')) {
      const since = t - handAt;
      const reach = since < 0 ? 0 : Math.min(1, since / 4000);
      paleHand(c, HAND_AT.x, HAND_AT.y, 1, t, 1 - (1 - reach) ** 3);
    }
  },

  lights(t, g) {
    if (counting()) return view.phase === 'dark' ? [] : [{ x: 800, y: 440, r: 900, a: 0.9 }];
    if (g.flag('party')) return [];
    if (g.flag('blackout')) {
      // only the hand is visible
      return [{ x: HAND_AT.x - 20, y: HAND_AT.y - 40, r: 230, a: 0.75 + Math.sin(t / 500) * 0.05 }];
    }
    const f = Math.random() < 0.04 ? 0.15 : 0.6;
    return [
      { x: 670, y: 420, r: 360, a: f },
      { x: 670, y: 160, r: 160, a: f },
      { x: PANEL.x + 90, y: PANEL.y + 100, r: 40, a: 0.5 },
    ];
  },

  hotspots(g) {
    if (counting()) return closeUpSpots(g);
    if (g.flag('party')) return partySpots(g);
    if (g.flag('blackout')) {
      return [{ x: HAND_AT.x - 140, y: HAND_AT.y - 160, w: 260, h: 320, label: 'The hand', click: () => handshake(g) }];
    }
    const spots = [
      { ...DOORS, label: 'Doors', click: () => g.say([g.flag('orCounted') ? 'Something is scratching at the other side of the doors. Low down. Fast.' : 'The doors won’t open from this side. Nobody leaves until the count is right.']) },
      { ...PANEL, label: 'Breaker panel', click: () => clickPanel(g) },
      { ...LIGHT, label: 'Surgical light', click: () => g.say(['The big light hums and flickers, aimed at an empty table.']) },
      { ...TABLE, label: 'OR table', click: () => g.say(['The table is made up and ready. No patient.', 'Unless the patient is you.']) },
      { ...BOARD, label: 'Whiteboard', click: () => clickBoard(g) },
      { ...BACK, label: 'Back table', click: () => startCount(g) },
    ];
    if (g.flag('knifeUnderDoor') && !g.has('Kitchen knife')) spots.push({ ...UNDER_DOOR, label: 'Kitchen knife', click: () => takeKnife(g) });
    return spots;
  },
};

function clickBoard(g) {
  if (!g.flag('orCounted')) {
    g.say(['PATIENT: D. DOMINGUEZ. DOB 11/29/1997. PROCEDURE: smudged out.', 'The count sheet is filled in, but nobody signed off on the final count.', 'Check it against the back table.']);
    return;
  }
  g.say(['Someone has added a line to the bottom of the count, in red, in handwriting that isn’t yours.', 'KITCHEN KNIFE · 1.']);
}

function countFound(g) {
  g.set('orCounted');
  g.audio.beep(2, 0.08);
  g.say([
    'You run the count again. Sponges, sharps, instruments. Everything is back where it was.',
    'Everything except the knife.',
    'You say it out loud, like you would on any case: “Count is off. We’re missing… a kitchen knife?”',
    'It was never on the sheet. It was never supposed to be on the field. But it was there, and now it isn’t.',
    'Behind you, the marker on the whiteboard squeaks.',
  ], () => {
    g.audio.scratch();
    setTimeout(() => g.audio.pant(), 600);
    g.set('knifeUnderDoor');
    g.shake(200);
    g.say([
      'Then: scratching. Right at the doors, down low. Something breathing hard on the other side.',
      'With a clatter, something slides in under the doors and spins to a stop on the tile.',
      'The kitchen knife.',
    ]);
  });
}

function takeKnife(g) {
  g.give('Kitchen knife');
  g.say(['You pick up the knife. It’s heavy, and very, very sharp. The count is right.', 'Whatever is behind those doors gave it back. Politely, almost. Like it wants you to have it.']);
}

function clickPanel(g) {
  if (!g.has('Kitchen knife')) {
    g.say(['The main breaker for OR 1. The handle has been snapped off. Only a little metal stub is left, too small to grip with your fingers.', g.flag('orCounted') ? 'Not until the count is right. Find that knife.' : 'You can’t do anything about it now anyway. The count comes first.']);
    return;
  }
  g.say(['You grab a Kelly clamp off the back table and lock it onto the broken stub. Ratchet, ratchet, click. It holds.', 'Then you pull.'], () => {
    g.audio.breaker();
    g.audio.stopEvents();
    g.audio.ambientLevel(0, 1.2);
    g.set('blackout');
    handAt = performance.now() + 2500;
    g.shake(300);
    setTimeout(() => g.audio.heartbeat(), 1200);
    g.say([
      'Everything goes black. The surgical light. The hum. Your flashlight too.',
      'The scratching at the doors gets louder. Something is panting out there, fast and excited.',
      'And then, in the dark right in front of you, a pale hand reaches out.',
      'It’s not grabbing. It’s waiting. Like it’s offering a handshake.',
      'A very specific handshake.',
    ]);
  });
}

function handshake(g) {
  g.ui.sequence({
    title: 'THE HANDSHAKE',
    sub: 'The hand waits in the dark. You know how this goes.',
    steps: ['Dap index fingers', 'Finger bump', 'Finger guns', 'Blow the smoke'],
    onFail: () => {
      g.audio.wrong();
      g.audio.whisper();
      g.shake(150);
      handAt = performance.now() + 1500;
      g.say(['Wrong move. The hand slowly pulls back into the dark.', '…Then it reaches out again. It’s patient. It’ll wait for you to get it right.']);
      return true;
    },
    onSuccess: () => {
      g.set('party');
      partyAt = performance.now();
      g.audio.lightsOn();
      g.audio.bark();
      // Our song, straight away. If Spotify couldn't load, a music-box Happy Birthday plays instead.
      if (!playSong()) setTimeout(() => { if (!spotify) g.audio.happyBirthday(); }, 900);
      g.recharge();
      g.say([
        'Dap. Bump. Finger guns. You blow the smoke off your fingertip, and somewhere in the dark, someone laughs.',
        'The lights SLAM on.',
        'Balloons. A banner. A cake sitting right on the OR table. Confetti coming down from nowhere.',
        'And charging through the doors, tails going a mile a minute, in tiny party hats: Kagura and Kana.',
        'The monster scratching at the doors all night. It was them the whole time.',
        'Dio is sitting on top of the breaker panel in a party hat. He hates it. He’s not taking it off.',
        'The board on the wall has changed. PROCEDURE: BIRTHDAY.',
        'Whoever’s hand that was, they’re gone. But there’s a cake with your name on it, and you are holding a very big knife.',
      ]);
    },
  });
}

/* ---------- after the lights come on ---------- */
function partySpots(g) {
  const cx = TABLE.x + TABLE.w / 2;
  return [
    { x: cx - 100, y: TABLE.y - 150, w: 200, h: 170, label: g.flag('cakeCut') ? 'Card' : 'Cake', click: () => clickCake(g) },
    { x: 440, y: 580, w: 170, h: 230, label: 'Kagura', click: () => clickDog(g, 'Kagura', 'Squeaky bone') },
    { x: 740, y: 580, w: 170, h: 230, label: 'Kana', click: () => clickDog(g, 'Kana', 'Tennis ball') },
    { x: 315, y: 180, w: 110, h: 130, label: 'Dio', click: () => { g.audio.hiss(); g.say(['Dio stares down at you from on top of the breaker panel.', 'He blinks slowly, once. From Dio, that is basically a hug. Happy birthday.']); } },
    { ...BOARD, label: 'Whiteboard', click: () => g.say(['PROCEDURE: BIRTHDAY!', 'STATUS: very, very loved.', 'Final count: one Debbie, perfectly accounted for.']) },
    { ...DOORS, label: 'Doors', click: () => g.say(['The doors are propped open now. The hallway lights are on, all the way down. It’s just a hospital again.', 'Your shift is over.']) },
  ];
}

function clickCake(g) {
  if (g.flag('cakeCut')) { openCard(g); return; }
  if (!g.has('Kitchen knife')) {
    g.say(['A two-tier cake, pink on pink, with DEBBIE piped across it.', 'You’ll need something to cut it with.']);
    return;
  }
  g.audio.candle();
  g.say([
    'A two-tier cake, pink on pink, with DEBBIE piped across it. Two candles: a 2 and a 9.',
    'You make a wish. You don’t say it out loud. You don’t have to.',
    'Then you do what the knife was for all along. You cut the first slice.',
    'The knife hits something that isn’t cake. Folded up inside, there’s a card with your name on it.',
  ], () => {
    g.set('cakeCut');
    openCard(g);
  });
}

function openCard(g) {
  if (!g.hasPage(5)) {
    g.say(['You pull out the card and wipe the frosting off. Folded inside is the last torn page.'], () => g.findPage(5, () => finalScreen(g)));
    return;
  }
  finalScreen(g);
}

function clickDog(g, name, toy) {
  g.audio.bark();
  const key = `gave${name}`;
  if (g.has(toy) && !g.flag(key)) {
    g.set(key);
    g.audio.squeak();
    g.say([`You hold out the ${toy.toLowerCase()}. ${name} snatches it out of your hand and runs a lap around the OR table with it.`, 'Best night shift ever, apparently.']);
    return;
  }
  g.say([`${name} spins in a circle, then leans their whole body against your legs.`, 'Big night. They scared you on purpose and they would do it again.']);
}

function finalScreen(g) {
  const esc = (s) => String(s).replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
  const pics = loadedPhotos();
  const html = `
    <div class="paper final">
      ${FINAL_VERSE.stanzas.map((st) => `<p>${st.map(esc).join('<br>')}</p>`).join('')}
      <p class="closing">${FINAL_VERSE.closing.map(esc).join('<br>')}</p>
    </div>
    ${pics.length ? `<div class="photo-row">${pics.map((p) => `<img src="${p.src}" alt="">`).join('')}</div>` : ''}
    <div class="final-buttons">
      <button type="button" class="btn" id="fn-song">♪ Play our song</button>
      <a class="ghost-link" href="${SONG_URL}" target="_blank" rel="noopener">Open in Spotify</a>
      <button type="button" id="fn-pages">Read all the pages</button>
      <button type="button" class="ghost" id="fn-x">Stay at the party</button>
    </div>`;
  g.ui.custom(html, (card, close) => {
    card.querySelector('#fn-x').onclick = close;
    card.querySelector('#fn-song').onclick = () => {
      if (spotify) spotify.play(); else window.open(SONG_URL, '_blank', 'noopener');
    };
    card.querySelector('#fn-pages').onclick = () => {
      close();
      g.audio.paper();
      g.ui.journal(POEM_PAGES, g.state.pages);
    };
  });
}
