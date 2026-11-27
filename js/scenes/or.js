// Room 6: OR 1, the finale. Her actual job is the puzzle: the surgical count is off by one Kelly clamp.
// Once she calls it, the clamp gets pushed in under the doors (by paws), and it's the only thing that can grip
// the snapped-off breaker handle. Throwing the breaker = blackout. A pale hand reaches out of the dark and she has
// to finish the handshake (dap, finger bump, finger guns, blow the smoke). Then the lights come on: party.
import { rr, tiles, stains, text, cached, rng, dog, partyHat, paleHand, candle, HAND } from '../draw.js';
import { POEM_PAGES, FINAL_VERSE } from '../poems.js';

// Swap this for a direct Spotify / YouTube link to the song if you like.
const SONG_URL = 'https://www.youtube.com/results?search_query=Alex+Lahey+Wes+Anderson';

const DOORS = { x: 40, y: 240, w: 240, h: 420 };
const UNDER_DOOR = { x: 90, y: 660, w: 150, h: 60 };
const PANEL = { x: 310, y: 300, w: 110, h: 150 };
const TABLE = { x: 470, y: 500, w: 400, h: 90 };
const LIGHT = { x: 560, y: 60, w: 220, h: 200 };
const BOARD = { x: 960, y: 80, w: 580, h: 270 };
const BACK = { x: 900, y: 470, w: 660, h: 220 };
const HAND_AT = { x: 820, y: 470 };

// The count: what the sheet says went onto the field vs. what's on the back table now.
const COUNT = [
  ['Raytec sponges', 10, 10],
  ['Lap sponges', 5, 5],
  ['Kelly clamps', 6, 5],
  ['Mosquito clamps', 4, 4],
  ['Needle drivers', 2, 2],
  ['Metzenbaum scissors', 1, 1],
  ['Mayo scissors', 1, 1],
  ['Adson forceps', 2, 2],
  ['#10 blade', 1, 1],
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

function drawBackTable(c) {
  const { x, y, w, h } = BACK;
  c.fillStyle = '#2c4f6e';
  rr(c, x, y, w, h, 6);
  c.fill();
  c.fillStyle = '#244560';
  c.fillRect(x, y + h - 10, w, 60);
  c.fillStyle = '#8c9296';
  c.fillRect(x + 30, y + h + 50, 12, 110);
  c.fillRect(x + w - 42, y + h + 50, 12, 110);
  // row 1: Kelly clamps (5 of them) + mosquitos (4)
  for (let k = 0; k < 5; k++) ringed(c, x + 40 + k * 34, y + 30, 58, 'clamp');
  for (let k = 0; k < 4; k++) ringed(c, x + 250 + k * 28, y + 34, 48, 'mosquito');
  // needle drivers, scissors, forceps, blade
  ringed(c, x + 400, y + 30, 60, 'driver');
  ringed(c, x + 436, y + 30, 60, 'driver');
  ringed(c, x + 486, y + 30, 54, 'scissors'); // Metz (long, fine)
  ringed(c, x + 526, y + 36, 42, 'scissors'); // Mayo (shorter)
  forceps(c, x + 572, y + 30);
  forceps(c, x + 594, y + 30);
  blade(c, x + 628, y + 40);
  // row 2: raytecs (10) + laps (5)
  for (let k = 0; k < 10; k++) {
    c.fillStyle = '#ecebe4';
    c.fillRect(x + 30 + k * 30, y + 130, 24, 30);
    c.fillStyle = '#3b6fa8';
    c.fillRect(x + 30 + k * 30, y + 141, 24, 4);
  }
  for (let k = 0; k < 5; k++) {
    c.fillStyle = '#ecebe4';
    c.fillRect(x + 350 + k * 58, y + 120, 50, 54);
    c.fillStyle = '#3b6fa8';
    c.fillRect(x + 350 + k * 58, y + 124, 50, 6);
    c.fillStyle = '#4f8f4a';
    c.fillRect(x + 386 + k * 58, y + 162, 10, 8);
  }
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

  drawBackTable(c);
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
  text(c, g.flag('orCounted') || party ? 'final: ✓' : 'final: ???', R + 160, BOARD.y + 26, { size: 18, color: '#7a1010', align: 'left', font: HAND });
  COUNT.forEach(([name, n], i) => {
    text(c, name, R, BOARD.y + 54 + i * 23, { size: 18, color: ink, align: 'left', font: HAND });
    text(c, String(n), R + 240, BOARD.y + 54 + i * 23, { size: 18, color: ink, align: 'right', font: HAND });
  });
}

function drawClamp(c, x, y) {
  c.save();
  c.translate(x, y);
  c.rotate(-1.2);
  ringed(c, 0, 0, 52, 'clamp');
  c.restore();
}

function sittingCat(c, x, y, s) {
  c.save();
  c.translate(x, y);
  c.scale(s, s);
  c.fillStyle = '#0a0a0a';
  c.beginPath(); c.ellipse(0, 30, 34, 40, 0, 0, Math.PI * 2); c.fill();
  c.beginPath(); c.arc(0, -16, 26, 0, Math.PI * 2); c.fill();
  c.beginPath(); c.moveTo(-24, -26); c.lineTo(-18, -54); c.lineTo(-4, -38); c.closePath(); c.fill();
  c.beginPath(); c.moveTo(24, -26); c.lineTo(18, -54); c.lineTo(4, -38); c.closePath(); c.fill();
  c.strokeStyle = '#0a0a0a';
  c.lineWidth = 9;
  c.lineCap = 'round';
  c.beginPath(); c.moveTo(28, 56); c.quadraticCurveTo(70, 50, 56, 10); c.stroke();
  c.fillStyle = '#c8e83a';
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
  // the card
  c.save();
  c.translate(cx + 120, cy - 14);
  c.rotate(0.12);
  c.fillStyle = '#efe6c0';
  c.fillRect(-26, -40, 52, 40);
  text(c, 'Debbie', 0, -20, { size: 16, color: '#5a1010', font: HAND });
  c.restore();
  // Dio on the breaker panel, in a hat he hates
  sittingCat(c, 365, 250, 0.9);
  // the dogs, very proud of themselves
  const hop = (n) => Math.max(0, Math.sin(t / 260 + n)) * 10;
  dog(c, 520, 690 - hop(0), 1.15, t, { coat: '#d8b47a', ear: '#8a6034', belly: '#f2e4c8', hat: ['#e04a8a', '#f3d36b'], wag: 2 });
  dog(c, 820, 690 - hop(1.6), 1.05, t, { coat: '#3a302a', ear: '#1e1814', belly: '#c9b49a', hat: ['#3fb0dc', '#ffffff'], wag: 2 });
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

  safe: (g) => g.flag('blackout'),
  flashlight: (g) => !g.flag('blackout'),
  darkness: (g) => (g.flag('party') ? 0 : g.flag('blackout') ? 1 : 0.97),

  enter(g) {
    if (g.flag('blackout')) {
      g.audio.stopEvents();
      g.audio.ambientLevel(0, 0.5);
    }
    if (g.flag('party')) {
      g.ui.toast('The party’s still going. Click the card on the cake.');
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
    if (g.flag('blackout') && !g.flag('party') && t > nextScratch && !g.ui.busy()) {
      g.audio.scratch();
      if (Math.random() < 0.5) g.audio.pant();
      nextScratch = t + 4000 + Math.random() * 3000;
    }
  },

  draw(c, t, g) {
    background(c);
    drawBoard(c, g);
    if (g.flag('clampUnderDoor') && !g.has('Kelly clamp')) drawClamp(c, UNDER_DOOR.x + 60, UNDER_DOOR.y + 30);
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
      { ...BACK, label: 'Back table', click: () => openCount(g) },
    ];
    if (g.flag('clampUnderDoor') && !g.has('Kelly clamp')) spots.push({ ...UNDER_DOOR, label: 'Kelly clamp', click: () => takeClamp(g) });
    return spots;
  },
};

function clickBoard(g) {
  if (!g.flag('orCounted')) {
    g.say(['PATIENT: D. DOMINGUEZ. DOB 11/29/1997. PROCEDURE: smudged out.', 'The count sheet is filled in, but nobody signed off on the final count.', 'Check it against the back table.']);
    return;
  }
  g.say(['The count’s written up. Six Kelly clamps went on the field. Now they’re all accounted for.']);
}

function openCount(g) {
  if (g.flag('orCounted')) {
    g.say(['Everything on the back table is where it should be. Lined up neat, just how you like it.']);
    return;
  }
  const html = `
    <h2>FINAL COUNT · OR 1</h2>
    <p class="sub">Count what’s on the back table against the sheet.<br>Which count is off?</p>
    <div class="seq-buttons count-list">
      ${COUNT.map(([name, n], i) => `<button type="button" data-i="${i}"><span>${name}</span><b>${n}</b></button>`).join('')}
    </div>
    <button type="button" class="ghost" id="ct-x">Go look at the table again</button>`;
  g.ui.custom(html, (card, close) => {
    card.querySelector('#ct-x').onclick = close;
    card.querySelectorAll('[data-i]').forEach((b) => {
      b.onclick = () => {
        const i = Number(b.dataset.i);
        if (COUNT[i][1] === COUNT[i][2]) {
          g.audio.wrong();
          b.disabled = true;
          g.ui.toast(`${COUNT[i][0]}: ${COUNT[i][2]} on the table. That one’s right.`);
          return;
        }
        close();
        countFound(g);
      };
    });
  });
}

function countFound(g) {
  g.set('orCounted');
  g.audio.beep(2, 0.08);
  g.say([
    'Kelly clamps. The sheet says six. There are five on the table.',
    'One clamp is missing. You say it out loud, like you would on any case: “Count is off. We’re missing a Kelly.”',
    'The room goes very still.',
  ], () => {
    g.audio.scratch();
    setTimeout(() => g.audio.pant(), 600);
    g.set('clampUnderDoor');
    g.shake(200);
    g.say([
      'Then: scratching. Right at the doors, down low. Something breathing hard on the other side.',
      'With a metal clink, something slides in under the doors and spins to a stop on the tile.',
      'A Kelly clamp.',
    ]);
  });
}

function takeClamp(g) {
  g.give('Kelly clamp');
  g.say(['You pick up the clamp. Six of six. The count is right.', 'Whatever is behind those doors gave it back. Politely, almost.']);
}

function clickPanel(g) {
  if (!g.has('Kelly clamp')) {
    g.say(['The main breaker for OR 1. The handle has been snapped off. Only a little metal stub is left, too small to grip with your fingers.', g.flag('orCounted') ? 'You need something that can clamp onto it.' : 'You can’t do anything about it now anyway. The count comes first.']);
    return;
  }
  g.say(['You lock the Kelly clamp onto the broken stub. Ratchet, ratchet, click. It holds.', 'Then you pull.'], () => {
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
      setTimeout(() => g.audio.happyBirthday(), 900);
      g.recharge();
      g.say([
        'Dap. Bump. Finger guns. You blow the smoke off your fingertip, and somewhere in the dark, someone laughs.',
        'The lights SLAM on.',
        'Balloons. A banner. A cake sitting right on the OR table. Confetti coming down from nowhere.',
        'And charging through the doors, tails going a mile a minute, in tiny party hats: Kagura and Kana.',
        'The monster scratching at the doors all night. It was them the whole time.',
        'Dio is sitting on top of the breaker panel in a party hat. He hates it. He’s not taking it off.',
        'The board on the wall has changed. PROCEDURE: BIRTHDAY.',
        'Whoever’s hand that was, they’re gone. But there’s a card on the cake with your name on it.',
      ]);
    },
  });
}

/* ---------- after the lights come on ---------- */
function partySpots(g) {
  const cx = TABLE.x + TABLE.w / 2;
  return [
    { x: cx + 80, y: TABLE.y - 60, w: 90, h: 70, label: 'Card', click: () => openCard(g) },
    { x: cx - 100, y: TABLE.y - 150, w: 180, h: 170, label: 'Cake', click: () => clickCake(g) },
    { x: 440, y: 580, w: 170, h: 230, label: 'Kagura', click: () => clickDog(g, 'Kagura', 'Squeaky bone') },
    { x: 740, y: 580, w: 170, h: 230, label: 'Kana', click: () => clickDog(g, 'Kana', 'Tennis ball') },
    { x: 315, y: 180, w: 110, h: 130, label: 'Dio', click: () => { g.audio.hiss(); g.say(['Dio stares down at you from on top of the breaker panel.', 'He blinks slowly, once. From Dio, that is basically a hug. Happy birthday.']); } },
    { ...BOARD, label: 'Whiteboard', click: () => g.say(['PROCEDURE: BIRTHDAY!', 'STATUS: very, very loved.', 'Final count: one Debbie, perfectly accounted for.']) },
    { ...DOORS, label: 'Doors', click: () => g.say(['The doors are propped open now. The hallway lights are on, all the way down. It’s just a hospital again.', 'Your shift is over.']) },
  ];
}

function clickCake(g) {
  g.audio.candle();
  g.say(['A two-tier cake, pink on pink, with DEBBIE piped across it. Two candles: a 2 and a 9.', 'You make a wish. You don’t say it out loud. You don’t have to.'], () => {
    if (!g.hasPage(5)) openCard(g);
  });
}

function openCard(g) {
  if (!g.hasPage(5)) {
    g.say(['You open the card. Folded inside is the last torn page.'], () => g.findPage(5, () => finalScreen(g)));
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
      <a class="btn" href="${SONG_URL}" target="_blank" rel="noopener">♪ Play our song</a>
      <button type="button" id="fn-pages">Read all the pages</button>
      <button type="button" class="ghost" id="fn-x">Stay at the party</button>
    </div>`;
  g.ui.custom(html, (card, close) => {
    card.querySelector('#fn-x').onclick = close;
    card.querySelector('#fn-pages').onclick = () => {
      close();
      g.audio.paper();
      g.ui.journal(POEM_PAGES, g.state.pages);
    };
  });
}
