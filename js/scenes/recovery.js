// Room 3: recovery room 13, the tattoo cipher. The patient chart has a tattoo flash sheet (each design = a digit),
// the X-ray light box shows a forearm with four tattoos on it, and those spell the door code 1997.
// Poem page III is in the bedside drawer. Kagura's barking leads to a squeaky bone under the bed.
import { rr, tiles, stains, drips, text, cached, rng, HAND } from '../draw.js';

const BED = { x: 330, y: 470, w: 560, h: 170 };
const UNDER = { x: 360, y: 650, w: 500, h: 90 };
const CHART = { x: 880, y: 500, w: 70, h: 92 };
const LIGHTBOX = { x: 470, y: 120, w: 340, h: 210 };
const SWITCH = { x: 830, y: 220, w: 30, h: 46 };
const DRAWER = { x: 990, y: 520, w: 150, h: 120 };
const SHELF = { x: 1000, y: 210, w: 200, h: 120 };
const CURTAIN = { x: 70, y: 100, w: 230, h: 560 };
const IV = { x: 925, y: 180, w: 70, h: 300 };
const DOOR = { x: 1380, y: 250, w: 160, h: 410 };
const KEYPAD = { x: 1312, y: 410, w: 44, h: 64 };

export const CODE = '1997';

/* ---------- the ten flash-sheet designs, index = digit ---------- */
function star(c) {
  c.beginPath();
  for (let k = 0; k < 10; k++) {
    const r = k % 2 ? 9 : 22;
    const a = -Math.PI / 2 + (k * Math.PI) / 5;
    c.lineTo(Math.cos(a) * r, Math.sin(a) * r);
  }
  c.closePath();
  c.stroke();
}
function rose(c) {
  c.beginPath();
  for (let a = 0; a < Math.PI * 5; a += 0.2) c.lineTo(Math.cos(a) * a * 1.4, Math.sin(a) * a * 1.4 - 4);
  c.stroke();
  c.beginPath(); c.arc(0, -4, 22, 0, Math.PI * 2); c.stroke();
  c.beginPath(); c.ellipse(-20, 20, 12, 5, -0.6, 0, Math.PI * 2); c.stroke();
  c.beginPath(); c.ellipse(20, 20, 12, 5, 0.6, 0, Math.PI * 2); c.stroke();
}
function anchor(c) {
  c.beginPath(); c.arc(0, -20, 6, 0, Math.PI * 2); c.stroke();
  c.beginPath(); c.moveTo(0, -14); c.lineTo(0, 24); c.moveTo(-14, -6); c.lineTo(14, -6); c.stroke();
  c.beginPath(); c.arc(0, 4, 20, 0.15 * Math.PI, 0.85 * Math.PI); c.stroke();
  c.beginPath(); c.moveTo(-23, 4); c.lineTo(-18, 12); c.lineTo(-12, 6); c.moveTo(23, 4); c.lineTo(18, 12); c.lineTo(12, 6); c.stroke();
}
function swallow(c) {
  c.beginPath();
  c.moveTo(-24, -6); c.quadraticCurveTo(-8, -20, 6, -6); c.lineTo(24, -16); c.lineTo(14, 0);
  c.lineTo(26, 18); c.lineTo(8, 8); c.quadraticCurveTo(-6, 14, -14, 4); c.lineTo(-24, -6);
  c.stroke();
  c.beginPath(); c.moveTo(-6, -2); c.quadraticCurveTo(0, -26, 12, -28); c.stroke();
}
function dagger(c) {
  c.beginPath(); c.moveTo(0, -26); c.lineTo(6, 6); c.lineTo(-6, 6); c.closePath(); c.stroke();
  c.beginPath(); c.moveTo(-14, 8); c.lineTo(14, 8); c.moveTo(0, 8); c.lineTo(0, 22); c.stroke();
  c.beginPath(); c.arc(0, 25, 4, 0, Math.PI * 2); c.stroke();
}
function heart(c) {
  c.beginPath();
  c.moveTo(0, 20);
  c.bezierCurveTo(-30, -2, -18, -26, 0, -10);
  c.bezierCurveTo(18, -26, 30, -2, 0, 20);
  c.stroke();
}
function snake(c) {
  c.beginPath();
  for (let k = 0; k <= 30; k++) c.lineTo(-24 + k * 1.5, Math.sin(k / 3.2) * 12 + 6);
  c.stroke();
  c.beginPath(); c.ellipse(22, Math.sin(30 / 3.2) * 12 + 6, 7, 5, 0, 0, Math.PI * 2); c.stroke();
  c.beginPath(); c.moveTo(29, 0); c.lineTo(34, -3); c.moveTo(29, 0); c.lineTo(34, 2); c.stroke();
}
function moon(c) {
  c.beginPath();
  c.arc(0, 0, 22, 0.35 * Math.PI, 1.65 * Math.PI);
  c.arc(10, 0, 18, 1.55 * Math.PI, 0.45 * Math.PI, true);
  c.closePath();
  c.stroke();
}
function skull(c) {
  c.beginPath(); c.arc(0, -4, 20, Math.PI * 0.85, Math.PI * 2.15); c.lineTo(10, 22); c.lineTo(-10, 22); c.closePath(); c.stroke();
  c.beginPath(); c.arc(-8, -2, 5, 0, Math.PI * 2); c.moveTo(13, -2); c.arc(8, -2, 5, 0, Math.PI * 2); c.stroke();
  c.beginPath(); c.moveTo(-4, 22); c.lineTo(-4, 16); c.moveTo(4, 22); c.lineTo(4, 16); c.stroke();
}
function jelly(c) {
  c.beginPath(); c.arc(0, -4, 20, Math.PI, 0); c.closePath(); c.stroke();
  for (let i = 0; i < 4; i++) {
    c.beginPath();
    const tx = -14 + i * 9.3;
    c.moveTo(tx, -4);
    for (let k = 1; k <= 6; k++) c.lineTo(tx + Math.sin(k * 1.4 + i) * 3, -4 + k * 5);
    c.stroke();
  }
}
const SYMBOLS = [star, rose, anchor, swallow, dagger, heart, snake, moon, skull, jelly];
const NAMES = ['star', 'rose', 'anchor', 'swallow', 'dagger', 'heart', 'snake', 'crescent moon', 'skull', 'jellyfish'];

function symbol(c, d, x, y, s, color, w = 3) {
  c.save();
  c.translate(x, y);
  c.scale(s, s);
  c.strokeStyle = color;
  c.lineWidth = w / s;
  c.lineCap = 'round';
  c.lineJoin = 'round';
  SYMBOLS[d](c);
  c.restore();
}

/* ---------- static room ---------- */
const background = cached((c) => {
  const r = rng(13);
  // pale green wall
  c.fillStyle = '#5f6e62';
  c.fillRect(0, 0, 1600, 640);
  stains(c, r, 0, 0, 1600, 640, 34, '40,45,25');
  drips(c, r, 0, 0, 1600, 34, '35,40,20');
  c.fillStyle = '#4a564c';
  c.fillRect(0, 560, 1600, 80);
  const top = c.createLinearGradient(0, 0, 0, 220);
  top.addColorStop(0, 'rgba(0,0,0,0.6)');
  top.addColorStop(1, 'rgba(0,0,0,0)');
  c.fillStyle = top;
  c.fillRect(0, 0, 1600, 220);
  // floor
  tiles(c, 0, 640, 1600, 260, 70, '#57544c', '#403d37', r);
  stains(c, r, 0, 650, 1600, 250, 16, '20,15,8');
  c.fillStyle = '#26221c';
  c.fillRect(0, 634, 1600, 10);

  // curtain rail + half-drawn curtain
  c.fillStyle = '#9aa0a4';
  c.fillRect(40, 84, 900, 8);
  c.fillStyle = '#7d9aa6';
  for (let k = 0; k < 8; k++) {
    c.fillStyle = k % 2 ? '#6f8c98' : '#82a0ac';
    c.fillRect(CURTAIN.x + k * 29, CURTAIN.y, 30, CURTAIN.h);
  }
  stains(c, r, CURTAIN.x, CURTAIN.y, CURTAIN.w, CURTAIN.h, 8, '60,40,30');

  // bed
  c.fillStyle = '#2b2d2f';
  c.fillRect(BED.x + 30, BED.y + 110, 12, 110);
  c.fillRect(BED.x + BED.w - 42, BED.y + 110, 12, 110);
  c.fillStyle = '#121212';
  [BED.x + 36, BED.x + BED.w - 36].forEach((wx) => { c.beginPath(); c.arc(wx, BED.y + 226, 12, 0, Math.PI * 2); c.fill(); });
  c.fillStyle = '#8c9296';
  c.fillRect(BED.x, BED.y + 90, BED.w, 26);
  c.fillStyle = '#d9d6cc';
  rr(c, BED.x + 10, BED.y + 30, BED.w - 20, 66, 12);
  c.fill();
  c.fillStyle = '#c7c2b4';
  rr(c, BED.x + 26, BED.y + 10, 130, 44, 18);
  c.fill();
  c.fillStyle = 'rgba(0,0,0,0.12)';
  c.beginPath(); c.ellipse(BED.x + 92, BED.y + 30, 40, 12, 0, 0, Math.PI * 2); c.fill(); // dent in the pillow
  c.fillStyle = '#7c8a99';
  rr(c, BED.x + 160, BED.y + 34, BED.w - 180, 58, 10);
  c.fill();
  // rails
  c.strokeStyle = '#9aa0a4';
  c.lineWidth = 5;
  c.strokeRect(BED.x + 30, BED.y - 10, 120, 40);
  c.strokeRect(BED.x + BED.w - 150, BED.y - 10, 120, 40);
  // footboard + chart clip
  c.fillStyle = '#6c7378';
  c.fillRect(BED.x + BED.w - 4, BED.y - 10, 16, 130);

  // IV pole
  c.strokeStyle = '#9aa0a4';
  c.lineWidth = 5;
  c.beginPath(); c.moveTo(IV.x + 35, IV.y + 20); c.lineTo(IV.x + 35, 640); c.moveTo(IV.x + 5, IV.y + 20); c.lineTo(IV.x + 65, IV.y + 20); c.stroke();
  c.fillStyle = 'rgba(200,220,215,0.45)';
  rr(c, IV.x + 14, IV.y + 26, 42, 70, 8);
  c.fill();
  c.strokeStyle = 'rgba(200,220,215,0.4)';
  c.lineWidth = 2;
  c.beginPath(); c.moveTo(IV.x + 35, IV.y + 96); c.quadraticCurveTo(IV.x - 10, IV.y + 220, BED.x + BED.w - 120, BED.y + 20); c.stroke();

  // bedside table
  c.fillStyle = '#6a5a46';
  c.fillRect(DRAWER.x, DRAWER.y - 20, DRAWER.w, 140);
  c.fillStyle = '#7d6b54';
  c.fillRect(DRAWER.x - 6, DRAWER.y - 26, DRAWER.w + 12, 12);
  c.strokeStyle = '#3a2e22';
  c.lineWidth = 3;
  c.strokeRect(DRAWER.x + 10, DRAWER.y + 4, DRAWER.w - 20, 46);
  c.fillStyle = '#b5a98f';
  c.fillRect(DRAWER.x + DRAWER.w / 2 - 14, DRAWER.y + 24, 28, 6);
  // water cup
  c.fillStyle = 'rgba(210,220,225,0.5)';
  c.fillRect(DRAWER.x + 100, DRAWER.y - 58, 22, 32);

  // shelf + specimen jar
  c.fillStyle = '#4b4136';
  c.fillRect(SHELF.x - 10, SHELF.y + SHELF.h - 8, SHELF.w + 20, 12);
  c.fillStyle = 'rgba(190,210,170,0.25)';
  rr(c, SHELF.x + 70, SHELF.y + 30, 60, 82, 8);
  c.fill();
  c.fillStyle = '#5a5246';
  c.fillRect(SHELF.x + 66, SHELF.y + 22, 68, 12);
  c.fillStyle = '#e8e1c8';
  c.fillRect(SHELF.x + 76, SHELF.y + 70, 48, 20);
  c.fillStyle = '#6a4a2e';
  c.fillRect(SHELF.x + 10, SHELF.y + 70, 40, 42);
  c.fillStyle = '#2c3d52';
  c.fillRect(SHELF.x + 150, SHELF.y + 60, 30, 52);

  // light box frame
  c.fillStyle = '#25282a';
  rr(c, LIGHTBOX.x - 12, LIGHTBOX.y - 12, LIGHTBOX.w + 24, LIGHTBOX.h + 24, 6);
  c.fill();
  c.fillStyle = '#3c4144';
  c.fillRect(SWITCH.x, SWITCH.y, SWITCH.w, SWITCH.h);

  // door
  c.fillStyle = '#2b2620';
  c.fillRect(DOOR.x - 12, DOOR.y - 12, DOOR.w + 24, DOOR.h + 12);
  c.fillStyle = '#6a5c4a';
  c.fillRect(DOOR.x, DOOR.y, DOOR.w, DOOR.h);
  c.fillStyle = '#0b0d10';
  c.fillRect(DOOR.x + 40, DOOR.y + 50, 80, 110);
  c.fillStyle = '#9aa3aa';
  rr(c, DOOR.x + 12, DOOR.y + 210, DOOR.w - 24, 16, 6);
  c.fill();
  c.fillStyle = '#1e1e1e';
  rr(c, KEYPAD.x, KEYPAD.y, KEYPAD.w, KEYPAD.h, 4);
  c.fill();
  c.fillStyle = '#555';
  for (let i = 0; i < 3; i++) for (let j = 0; j < 4; j++) c.fillRect(KEYPAD.x + 8 + i * 11, KEYPAD.y + 14 + j * 11, 7, 7);
  c.fillStyle = '#d8d3c4';
  c.fillRect(DOOR.x + 10, DOOR.y - 70, DOOR.w - 20, 44);
  // scratches on the door
  c.strokeStyle = 'rgba(230,225,215,0.4)';
  c.lineWidth = 2;
  for (let k = 0; k < 4; k++) {
    c.beginPath();
    c.moveTo(DOOR.x + 30 + k * 9, DOOR.y + DOOR.h - 90);
    c.lineTo(DOOR.x + 44 + k * 9, DOOR.y + DOOR.h - 20);
    c.stroke();
  }
  // scrawl next to the keypad
  text(c, 'READ THE INK', KEYPAD.x - 6, KEYPAD.y + 100, { size: 18, color: 'rgba(120,20,20,0.75)', font: HAND, rot: -0.08 });
});

function drawLightbox(c, t, on) {
  const { x, y, w, h } = LIGHTBOX;
  if (!on) {
    c.fillStyle = '#15191b';
    c.fillRect(x, y, w, h);
    c.fillStyle = 'rgba(255,255,255,0.04)';
    c.fillRect(x + 20, y + 30, w - 40, h - 60);
    return;
  }
  const buzz = 0.92 + Math.random() * 0.08;
  c.fillStyle = `rgb(${Math.floor(190 * buzz)},${Math.floor(214 * buzz)},${Math.floor(228 * buzz)})`;
  c.fillRect(x, y, w, h);
  // the film: dark, with a forearm X-ray (elbow on the left, wrist on the right)
  c.fillStyle = '#0d1418';
  c.fillRect(x + 14, y + 14, w - 28, h - 28);
  const cy = y + h / 2;
  c.fillStyle = 'rgba(120,150,160,0.28)';
  c.beginPath(); c.ellipse(x + w / 2, cy, w / 2 - 22, 52, 0, 0, Math.PI * 2); c.fill(); // soft tissue
  c.strokeStyle = 'rgba(225,236,240,0.85)';
  c.lineCap = 'round';
  c.lineWidth = 12;
  c.beginPath(); c.moveTo(x + 36, cy - 14); c.lineTo(x + w - 60, cy - 18); c.stroke(); // radius
  c.lineWidth = 10;
  c.beginPath(); c.moveTo(x + 30, cy + 14); c.lineTo(x + w - 60, cy + 16); c.stroke(); // ulna
  c.fillStyle = 'rgba(225,236,240,0.8)';
  for (let k = 0; k < 6; k++) { c.beginPath(); c.arc(x + w - 46 + (k % 2) * 12, cy - 20 + Math.floor(k / 2) * 18, 6, 0, Math.PI * 2); c.fill(); }
  // the tattoos, glowing ink in the skin, read left to right
  CODE.split('').forEach((d, i) => {
    symbol(c, Number(d), x + 70 + i * 62, cy + (i % 2 ? 4 : -4), 0.9, 'rgba(30,240,200,0.9)', 3);
  });
  text(c, 'L', x + 26, y + 30, { size: 16, color: 'rgba(230,240,240,0.8)' });
  text(c, 'RM 13 · NO NAME', x + w - 80, y + h - 26, { size: 11, color: 'rgba(230,240,240,0.6)' });
}

function lampLevel(t) {
  const k = Math.floor(t / 140);
  const n = Math.sin(k * 12.9898 + 3) * 43758.5453;
  const r = n - Math.floor(n);
  if (r < 0.12) return 0;
  return 0.13;
}

let nextBark = 0;

export default {
  name: 'Recovery Room 13',

  enter(g) {
    if (!g.flag('recoveryIntro')) {
      g.set('recoveryIntro');
      g.audio.gurney();
      g.say([
        'Out in the hall, a gurney rolls past you on its own. Nobody is pushing it.',
        'Its wheels squeak all the way down the corridor until you can’t hear them anymore.',
        'You duck into the nearest room. RECOVERY 13. The bed is made, but the pillow is still dented.',
      ]);
    }
  },

  update(t, g) {
    if (g.has('Squeaky bone')) return;
    const m = g.mouse;
    const dx = m.x - (UNDER.x + UNDER.w / 2);
    const dy = m.y - (UNDER.y + UNDER.h / 2);
    if (dx * dx + dy * dy < 280 * 280 && t > nextBark && !g.ui.busy()) {
      g.audio.distantBark();
      nextBark = t + 3500;
    }
  },

  draw(c, t, g) {
    background(c);
    drawLightbox(c, t, g.flag('lightbox'));
    // switch lever
    c.fillStyle = g.flag('lightbox') ? '#d9c27a' : '#888';
    c.fillRect(SWITCH.x + 10, SWITCH.y + (g.flag('lightbox') ? 6 : 24), 10, 16);
    // chart on the footboard
    c.save();
    c.translate(CHART.x, CHART.y);
    c.rotate(0.04);
    c.fillStyle = '#6b4a2b';
    rr(c, 0, 0, CHART.w, CHART.h, 4);
    c.fill();
    c.fillStyle = '#e6e0cc';
    c.fillRect(6, 12, CHART.w - 12, CHART.h - 18);
    c.fillStyle = '#999';
    c.fillRect(22, 4, 26, 10);
    for (let k = 0; k < 4; k++) symbol(c, [1, 3, 6, 9][k], 20 + (k % 2) * 30, 36 + Math.floor(k / 2) * 32, 0.38, '#2a2a2a', 1.5);
    c.restore();
    // curtain sways
    const sway = Math.sin(t / 1300) * 4 + (g.flag('curtain') ? Math.sin(t / 240) * 3 : 0);
    c.fillStyle = 'rgba(0,0,0,0.18)';
    c.fillRect(CURTAIN.x + CURTAIN.w + sway, CURTAIN.y, 14, CURTAIN.h);
    text(c, 'RECOVERY 13', DOOR.x + DOOR.w / 2, DOOR.y - 48, { size: 16, color: '#222' });
    // drawer open?
    if (g.flag('drawer')) {
      c.fillStyle = '#4a3c2e';
      c.fillRect(DRAWER.x + 4, DRAWER.y + 46, DRAWER.w - 8, 22);
    }
    // keypad led
    c.fillStyle = g.flag('recoveryOpen') ? '#3fdc6a' : '#e03b2f';
    c.beginPath(); c.arc(KEYPAD.x + 22, KEYPAD.y + 7, 3, 0, Math.PI * 2); c.fill();
    // ceiling panel
    const lv = lampLevel(t);
    c.fillStyle = lv > 0 ? 'rgba(225,235,215,0.5)' : '#2a2a2a';
    c.fillRect(560, 14, 300, 8);
  },

  lights(t, g) {
    const L = [
      { x: 710, y: 20, r: 440, a: lampLevel(t) },
      { x: KEYPAD.x + 22, y: KEYPAD.y + 7, r: 40, a: 0.5 },
    ];
    if (g.flag('lightbox')) L.push({ x: LIGHTBOX.x + LIGHTBOX.w / 2, y: LIGHTBOX.y + LIGHTBOX.h / 2, r: 330, a: 0.8 });
    return L;
  },

  hotspots(g) {
    return [
      { ...CURTAIN, label: 'Curtain', click: () => clickCurtain(g) },
      { ...BED, label: 'Bed', click: () => g.say(['The sheets are tucked tight, hospital corners.', 'The pillow is still warm. Someone was lying here a minute ago.', 'Or something.']) },
      { ...UNDER, label: 'Under the bed', click: () => clickUnder(g) },
      { ...IV, label: 'IV pole', click: () => g.say(['The IV bag is labeled in marker: “ESPRESSO · 1 SHOT · IV PUSH.”', 'Honestly? Tempting.']) },
      { ...LIGHTBOX, label: g.flag('lightbox') ? 'X-ray' : 'Light box', click: () => clickLightbox(g) },
      { ...SWITCH, x: SWITCH.x - 8, w: SWITCH.w + 16, label: 'Switch', click: () => toggleLightbox(g) },
      { ...SHELF, label: 'Specimen jar', click: () => clickJar(g) },
      { ...CHART, label: 'Patient chart', click: () => openChart(g) },
      { ...DRAWER, label: 'Bedside drawer', click: () => clickDrawer(g) },
      { ...DOOR, label: 'Door', click: () => clickDoor(g) },
      { ...KEYPAD, x: KEYPAD.x - 10, w: KEYPAD.w + 20, label: 'Keypad', click: () => clickDoor(g) },
    ];
  },
};

function clickCurtain(g) {
  if (!g.flag('curtain')) {
    g.set('curtain');
    g.audio.whisper();
    g.say(['The curtain shivers, like someone just brushed past it.', 'You pull it back. Nobody.', 'Just the wall, and a faint smell of rubbing alcohol and lavender.']);
  } else {
    g.say(['You leave the curtain alone. It doesn’t leave you alone, but you leave it alone.']);
  }
}

function clickUnder(g) {
  if (g.has('Squeaky bone')) {
    g.say(['Just dust bunnies now. Big ones.']);
    return;
  }
  g.audio.bark();
  g.give('Squeaky bone');
  g.audio.squeak();
  g.say([
    'You crouch down and shine your light under the bed. A bark echoes from the hallway, then fast little paws, running away.',
    'Under the bed: a squeaky toy bone. It’s been very thoroughly loved.',
    'Kagura’s. You’d know that slobber anywhere.',
  ]);
}

function toggleLightbox(g) {
  g.set('lightbox', !g.flag('lightbox'));
  g.audio.click();
  if (g.flag('lightbox') && !g.flag('xraySeen')) {
    g.set('xraySeen');
    g.shake(150);
    g.say([
      'The light box buzzes on. There’s a film clipped to it: an X-ray of somebody’s forearm.',
      'Four small shapes glow on the skin, right over the bones. Tattoos. Ink shouldn’t show up on an X-ray.',
      'These do.',
    ]);
  }
}

function clickLightbox(g) {
  if (!g.flag('lightbox')) {
    g.say(['A wall-mounted X-ray light box. It’s off. The switch is right beside it.']);
    return;
  }
  g.say(['Four tattoos, in a row, elbow to wrist: a rose, a jellyfish, another jellyfish, a crescent moon.', 'Somebody wanted these to be read in order.']);
}

function clickJar(g) {
  g.say([
    'A specimen jar, sealed with wax. The label says “SHARD · DO NOT OPEN.”',
    'Floating inside is a tiny piece of a pink jewel. It hums, very faintly.',
    'You get the strange feeling you’re supposed to go find the rest of it. Not tonight, though.',
  ]);
}

function openChart(g) {
  g.audio.paper();
  const html = `
    <h2>PATIENT CHART · RM 13</h2>
    <p class="sub">Patient: <i>name scratched out</i> · Allergies: none · Diet: espresso<br>
    Identifying marks: tattoos, see sketch. Patient says the designs “add up.”</p>
    <canvas id="flash" width="620" height="300" style="width:min(620px,84vw);background:#e9dfc6;border:1px solid #6b5a40"></canvas>
    <p class="sub">Scribbled under the sketch: <i>“every design has its number.”</i></p>
    <button type="button" id="fl-x">Put the chart back</button>`;
  g.ui.custom(html, (card, close) => {
    const cv = card.querySelector('#flash');
    const c = cv.getContext('2d');
    text(c, 'FLASH SHEET', 310, 24, { size: 20, color: '#5a1010' });
    for (let i = 0; i < 10; i++) {
      const d = (i + 1) % 10; // 1..9 then 0
      const col = i % 5;
      const row = Math.floor(i / 5);
      const x = 70 + col * 120;
      const y = 95 + row * 125;
      symbol(c, d, x, y, 1.1, '#2a2118', 3);
      text(c, String(d), x, y + 48, { size: 26, color: '#5a1010', font: HAND });
    }
    card.querySelector('#fl-x').onclick = close;
  });
}

function clickDrawer(g) {
  if (!g.flag('drawer')) {
    g.set('drawer');
    g.audio.door();
    g.say(['The drawer sticks, then jerks open.', 'Inside: a rosary, a TV remote with no batteries, and a folded page.'], () => g.findPage(2, () => {
      g.say(['Whoever is leaving these knows exactly where you’ll look.']);
    }));
    return;
  }
  if (!g.hasPage(2)) {
    g.findPage(2);
    return;
  }
  g.say(['A rosary and a dead TV remote. You leave the rosary where it is. It feels like it’s keeping watch.']);
}

function clickDoor(g) {
  if (g.flag('recoveryOpen')) {
    leave(g);
    return;
  }
  g.ui.keypad({
    title: 'RECOVERY 13 · EXIT',
    sub: 'Someone has scrawled beside the keypad: READ THE INK.',
    code: CODE,
    onSuccess: () => {
      g.audio.unlock();
      if (!g.hasPage(2)) {
        g.set('recoveryOpen');
        g.say(['The lock clicks open.', 'But you hesitate in the doorway. The bedside drawer is still closed, and you have a feeling about it.']);
        return;
      }
      g.set('recoveryOpen');
      leave(g);
    },
    onFail: () => {
      g.set('recoveryTries', (g.state.flags.recoveryTries || 0) + 1);
      if (g.state.flags.recoveryTries === 3) g.ui.toast('The chart says what each design means. Something else shows the designs.');
    },
  });
}

function leave(g) {
  if (!g.hasPage(2)) {
    g.say(['You have a feeling about that bedside drawer.']);
    return;
  }
  g.audio.door();
  g.goTo('chapel', 'The door opens onto another long hallway. The footsteps are back, closer now, matching yours.\n\nAt the end of the hall, a soft gold light leaks under a wooden door.\n\nYou run for it.');
}
