// Room 5: the nursery. Unsettling at first (a mobile turning on its own, a rocking chair, a baby monitor),
// but it turns sweet: a tiny onesie for Alex's baby boy, with poem page V ("Tia") and a hospital wristband
// tucked inside. The wristband's DOB (11/29) is the OR door code 1129. Kana's barking leads to a tennis ball.
import { rr, tiles, stains, text, cached, rng, jellyfish, HAND } from '../draw.js';

const CRIB = { x: 560, y: 400, w: 380, h: 250 };
const MOBILE = { x: 680, y: 120, w: 140, h: 170 };
const CHAIR = { x: 120, y: 360, w: 240, h: 300 };
const MONITOR = { x: 1030, y: 250, w: 90, h: 80 };
const BASSINETS = [{ x: 1000, y: 470, w: 150, h: 150 }, { x: 1180, y: 470, w: 150, h: 150 }];
const WALL_ART = { x: 140, y: 110, w: 260, h: 180 };
const DOOR = { x: 1400, y: 250, w: 160, h: 410 };
const KEYPAD = { x: 1345, y: 410, w: 44, h: 64 };
const CODE = '1129';

const background = cached((c) => {
  const r = rng(5);
  // soft blue wall, old and water-stained
  c.fillStyle = '#56687a';
  c.fillRect(0, 0, 1600, 640);
  // wallpaper dots
  c.fillStyle = 'rgba(230,240,250,0.08)';
  for (let x = 20; x < 1600; x += 60) for (let y = 20; y < 560; y += 60) { c.beginPath(); c.arc(x + ((y / 60) % 2) * 30, y, 6, 0, Math.PI * 2); c.fill(); }
  stains(c, r, 0, 0, 1600, 640, 28, '30,35,30');
  c.fillStyle = '#e6e0d0';
  c.fillRect(0, 540, 1600, 14);
  c.fillStyle = '#4d5d6d';
  c.fillRect(0, 554, 1600, 86);
  const top = c.createLinearGradient(0, 0, 0, 220);
  top.addColorStop(0, 'rgba(0,0,0,0.6)');
  top.addColorStop(1, 'rgba(0,0,0,0)');
  c.fillStyle = top;
  c.fillRect(0, 0, 1600, 220);
  tiles(c, 0, 640, 1600, 260, 80, '#6a6660', '#4f4c47', r);
  c.fillStyle = '#26221c';
  c.fillRect(0, 634, 1600, 10);
  // round rug
  c.fillStyle = 'rgba(230,163,201,0.25)';
  c.beginPath(); c.ellipse(760, 760, 360, 90, 0, 0, Math.PI * 2); c.fill();

  // wall art: moon and stars
  c.fillStyle = '#2f3f52';
  c.fillRect(WALL_ART.x, WALL_ART.y, WALL_ART.w, WALL_ART.h);
  c.strokeStyle = '#d9c9a0';
  c.lineWidth = 6;
  c.strokeRect(WALL_ART.x, WALL_ART.y, WALL_ART.w, WALL_ART.h);
  c.fillStyle = '#efe2a8';
  c.beginPath(); c.arc(WALL_ART.x + 90, WALL_ART.y + 90, 46, 0, Math.PI * 2); c.fill();
  c.fillStyle = '#2f3f52';
  c.beginPath(); c.arc(WALL_ART.x + 110, WALL_ART.y + 78, 42, 0, Math.PI * 2); c.fill();
  c.fillStyle = '#efe2a8';
  [[180, 50], [210, 120], [160, 150], [60, 160]].forEach(([sx, sy]) => { c.beginPath(); c.arc(WALL_ART.x + sx, WALL_ART.y + sy, 5, 0, Math.PI * 2); c.fill(); });

  // crib
  c.fillStyle = '#e8e1d3';
  c.fillRect(CRIB.x, CRIB.y + 40, 16, CRIB.h);
  c.fillRect(CRIB.x + CRIB.w - 16, CRIB.y + 40, 16, CRIB.h);
  c.fillRect(CRIB.x, CRIB.y + 40, CRIB.w, 16);
  c.fillStyle = '#cfe0ef';
  c.fillRect(CRIB.x + 16, CRIB.y + 150, CRIB.w - 32, 40);
  c.fillStyle = '#e8e1d3';
  for (let k = 1; k < 13; k++) c.fillRect(CRIB.x + 16 + k * 27, CRIB.y + 56, 8, 150);
  c.fillRect(CRIB.x, CRIB.y + 200, CRIB.w, 16);
  stains(c, r, CRIB.x, CRIB.y, CRIB.w, CRIB.h, 5, '90,80,50');

  // mobile arm
  c.strokeStyle = '#d0c8b8';
  c.lineWidth = 5;
  c.beginPath(); c.moveTo(CRIB.x + CRIB.w - 30, CRIB.y + 40); c.lineTo(CRIB.x + CRIB.w - 30, 100); c.lineTo(MOBILE.x + MOBILE.w / 2, 100); c.stroke();

  // bassinets
  BASSINETS.forEach((b) => {
    c.fillStyle = '#9aa0a4';
    c.fillRect(b.x + 30, b.y + 70, 10, 80);
    c.fillRect(b.x + b.w - 40, b.y + 70, 10, 80);
    c.fillStyle = 'rgba(200,220,230,0.35)';
    rr(c, b.x, b.y, b.w, 80, 10);
    c.fill();
    c.strokeStyle = 'rgba(220,235,240,0.5)';
    c.lineWidth = 3;
    rr(c, b.x, b.y, b.w, 80, 10);
    c.stroke();
    c.fillStyle = '#e8e1c8';
    c.fillRect(b.x + 40, b.y - 26, 70, 22);
  });

  // shelf with baby monitor
  c.fillStyle = '#6a5a46';
  c.fillRect(MONITOR.x - 30, MONITOR.y + MONITOR.h, MONITOR.w + 60, 12);
  c.fillStyle = '#e8e8e0';
  rr(c, MONITOR.x + 10, MONITOR.y + 10, MONITOR.w - 20, MONITOR.h - 10, 10);
  c.fill();
  c.fillStyle = '#9aa0a4';
  c.fillRect(MONITOR.x + MONITOR.w / 2 - 3, MONITOR.y - 14, 6, 26);
  c.fillStyle = '#2a2a2a';
  for (let k = 0; k < 4; k++) c.fillRect(MONITOR.x + 26, MONITOR.y + 24 + k * 8, 38, 3);

  // door
  c.fillStyle = '#2b2620';
  c.fillRect(DOOR.x - 12, DOOR.y - 12, DOOR.w + 24, DOOR.h + 12);
  c.fillStyle = '#5c6a78';
  c.fillRect(DOOR.x, DOOR.y, DOOR.w, DOOR.h);
  c.fillStyle = '#0b0d10';
  c.fillRect(DOOR.x + 35, DOOR.y + 50, 90, 90);
  c.fillStyle = '#9aa3aa';
  rr(c, DOOR.x + 12, DOOR.y + 210, DOOR.w - 24, 16, 6);
  c.fill();
  c.fillStyle = '#1e1e1e';
  rr(c, KEYPAD.x, KEYPAD.y, KEYPAD.w, KEYPAD.h, 4);
  c.fill();
  c.fillStyle = '#555';
  for (let i = 0; i < 3; i++) for (let j = 0; j < 4; j++) c.fillRect(KEYPAD.x + 8 + i * 11, KEYPAD.y + 14 + j * 11, 7, 7);
  c.fillStyle = '#b3241f';
  c.fillRect(DOOR.x + 10, DOOR.y - 70, DOOR.w - 20, 44);
  // paw scratches low on the door
  c.strokeStyle = 'rgba(230,225,215,0.45)';
  c.lineWidth = 2;
  for (let k = 0; k < 4; k++) {
    c.beginPath(); c.moveTo(DOOR.x + 96 + k * 9, DOOR.y + DOOR.h - 80); c.lineTo(DOOR.x + 108 + k * 9, DOOR.y + DOOR.h - 16); c.stroke();
  }
});

function drawChair(c, t, g) {
  // rocking chair, rocking by itself (faster when you aren't looking at it)
  const far = Math.hypot(g.mouse.x - (CHAIR.x + CHAIR.w / 2), g.mouse.y - (CHAIR.y + CHAIR.h / 2)) > 400;
  const amp = far ? 0.07 : 0.025;
  const a = Math.sin(t / 700) * amp;
  c.save();
  c.translate(CHAIR.x + CHAIR.w / 2, CHAIR.y + CHAIR.h - 10);
  c.rotate(a);
  c.strokeStyle = '#5a4430';
  c.lineWidth = 10;
  c.lineCap = 'round';
  c.beginPath(); c.arc(0, -420, 430, Math.PI * 0.42, Math.PI * 0.58); c.stroke(); // rocker
  c.beginPath(); c.moveTo(-80, -10); c.lineTo(-70, -130); c.moveTo(80, -10); c.lineTo(70, -130); c.stroke();
  c.fillStyle = '#6a5038';
  rr(c, -90, -150, 180, 26, 6);
  c.fill();
  c.beginPath(); c.moveTo(-80, -140); c.lineTo(-90, -290); c.moveTo(80, -140); c.lineTo(90, -290); c.stroke();
  for (let k = -2; k <= 2; k++) { c.beginPath(); c.moveTo(k * 30, -150); c.lineTo(k * 33, -280); c.stroke(); }
  c.beginPath(); c.moveTo(-95, -290); c.lineTo(95, -290); c.stroke();
  // a crocheted blanket over the arm
  c.fillStyle = '#c9a6ef';
  rr(c, 40, -200, 60, 110, 8);
  c.fill();
  c.strokeStyle = 'rgba(80,40,120,0.35)';
  c.lineWidth = 2;
  for (let k = 0; k < 6; k++) { c.beginPath(); c.moveTo(42, -190 + k * 18); c.lineTo(98, -190 + k * 18); c.stroke(); }
  c.restore();
}

function drawMobile(c, t) {
  const cx = MOBILE.x + MOBILE.w / 2;
  const spin = t / 1800;
  c.strokeStyle = '#d0c8b8';
  c.lineWidth = 2;
  c.beginPath(); c.moveTo(cx, 100); c.lineTo(cx, 140); c.stroke();
  c.beginPath(); c.ellipse(cx, 140, 70, 12, 0, 0, Math.PI * 2); c.stroke();
  const shapes = ['#efe2a8', '#e6a3c9', '#9ec9ef', '#c9a6ef'];
  for (let k = 0; k < 4; k++) {
    const a = spin + (k * Math.PI) / 2;
    const px = cx + Math.cos(a) * 70;
    const py = 140 + Math.sin(a) * 12;
    const depth = (Math.sin(a) + 1.4) / 2.4;
    c.beginPath(); c.moveTo(px, py); c.lineTo(px, py + 60 + k * 8); c.stroke();
    c.save();
    c.globalAlpha = 0.5 + depth * 0.5;
    if (k === 1) {
      jellyfish(c, px, py + 78 + k * 8, 0.35, t);
    } else {
      c.fillStyle = shapes[k];
      c.beginPath();
      if (k === 0) { c.arc(px, py + 76, 14, 0.3 * Math.PI, 1.7 * Math.PI); c.arc(px + 7, py + 76, 11, 1.6 * Math.PI, 0.4 * Math.PI, true); } // moon
      else if (k === 2) { for (let j = 0; j < 10; j++) { const rr2 = j % 2 ? 6 : 14; const aa = -Math.PI / 2 + (j * Math.PI) / 5; c.lineTo(px + Math.cos(aa) * rr2, py + 92 + Math.sin(aa) * rr2); } } // star
      else { c.ellipse(px, py + 102, 12, 16, 0, 0, Math.PI * 2); } // cloud-ish
      c.closePath();
      c.fill();
    }
    c.restore();
  }
}

let nextBark = 0;
let nextBox = 0;

export default {
  name: 'Nursery',

  enter(g) {
    if (!g.flag('nurseryIntro')) {
      g.set('nurseryIntro');
      g.audio.musicBox();
      nextBox = performance.now() + 20000;
      g.say([
        'The nursery. Rows of empty bassinets.',
        'Above the crib, a mobile is turning slowly. There’s no motor on it.',
        'In the corner, a rocking chair is rocking. Nobody is in it.',
      ]);
    }
  },

  update(t, g) {
    if (t > nextBox && !g.ui.busy()) {
      g.audio.musicBox();
      nextBox = t + 26000 + Math.random() * 10000;
    }
    if (g.has('Tennis ball')) return;
    const dx = g.mouse.x - (CHAIR.x + CHAIR.w / 2);
    const dy = g.mouse.y - (CHAIR.y + CHAIR.h);
    if (dx * dx + dy * dy < 260 * 260 && t > nextBark && !g.ui.busy()) {
      g.audio.distantBark();
      nextBark = t + 3500;
    }
  },

  draw(c, t, g) {
    background(c);
    drawChair(c, t, g);
    drawMobile(c, t);
    // what's in the crib
    if (!g.has('Wristband')) {
      c.fillStyle = '#9ec9ef';
      rr(c, CRIB.x + 150, CRIB.y + 128, 90, 30, 8);
      c.fill();
      text(c, 'TIA ♥', CRIB.x + 195, CRIB.y + 143, { size: 12, color: '#2a3a5a' });
    }
    // crocheted beanie
    const bx = CRIB.x + 290, by = CRIB.y + 144;
    c.fillStyle = '#e8c77a';
    c.beginPath(); c.arc(bx, by, 20, Math.PI, 0); c.fill();
    c.strokeStyle = 'rgba(110,70,20,0.45)'; c.lineWidth = 1.2;
    for (const r of [8, 14]) { c.beginPath(); c.arc(bx, by, r, Math.PI * 1.08, Math.PI * 1.92); c.stroke(); }
    c.fillStyle = '#d2a955';
    rr(c, bx - 22, by - 3, 44, 10, 3); c.fill();
    c.fillStyle = 'rgba(110,70,20,0.35)';
    for (let k = 0; k < 9; k++) c.fillRect(bx - 19 + k * 4.6, by - 2, 1.2, 8);
    c.fillStyle = '#f3e3b8';
    c.beginPath(); c.arc(bx, by - 22 + Math.sin(t / 600), 6, 0, Math.PI * 2); c.fill();
    // bassinet cards
    text(c, 'BABY BOY', BASSINETS[0].x + 75, BASSINETS[0].y - 15, { size: 11, color: '#2a3a5a' });
    text(c, '— — —', BASSINETS[1].x + 75, BASSINETS[1].y - 15, { size: 11, color: '#555' });
    text(c, 'OR 1', DOOR.x + DOOR.w / 2, DOOR.y - 56, { size: 18, color: '#f0e6d0' });
    text(c, 'SURGERY IN PROGRESS', DOOR.x + DOOR.w / 2, DOOR.y - 37, { size: 10, color: '#f0e6d0' });
    // monitor led
    const on = Math.floor(t / 900) % 3 === 0;
    c.fillStyle = on ? '#3fdc6a' : '#1b4a26';
    c.beginPath(); c.arc(MONITOR.x + 45, MONITOR.y + 62, 4, 0, Math.PI * 2); c.fill();
    c.fillStyle = g.flag('nurseryOpen') ? '#3fdc6a' : '#e03b2f';
    c.beginPath(); c.arc(KEYPAD.x + 22, KEYPAD.y + 7, 3, 0, Math.PI * 2); c.fill();
    // nightlight
    c.fillStyle = '#efe2a8';
    c.beginPath(); c.arc(470, 600, 9, 0, Math.PI * 2); c.fill();
  },

  lights(t) {
    return [
      { x: 470, y: 600, r: 180, a: 0.45 + Math.sin(t / 2000) * 0.05 },
      { x: DOOR.x + DOOR.w / 2, y: DOOR.y - 48, r: 160, a: 0.4 },
      { x: KEYPAD.x + 22, y: KEYPAD.y + 7, r: 40, a: 0.5 },
    ];
  },

  hotspots(g) {
    return [
      { ...WALL_ART, label: 'Picture', click: () => g.say(['A painted moon and stars. Someone wrote along the bottom of the frame in pencil: “sweet dreams, little one.”']) },
      { ...CHAIR, label: 'Rocking chair', click: () => clickChair(g) },
      { ...MOBILE, label: 'Mobile', click: () => { g.audio.musicBox(); g.say(['The mobile turns, slow and steady. A moon, a star, a cloud.', 'And a tiny crocheted jellyfish. That one looks a lot like your stitches.']); } },
      { ...MONITOR, label: 'Baby monitor', click: () => { g.audio.monitor(); g.say(['The baby monitor crackles. Under the static: breathing. Slow, peaceful breathing.', 'A baby, sound asleep, somewhere very far away. Or not born yet.']); } },
      { ...BASSINETS[0], label: 'Bassinet', click: () => g.say(['The card on this bassinet says BABY BOY. Under it, someone has added in tiny handwriting: “due in April.”']) },
      { ...BASSINETS[1], label: 'Bassinet', click: () => g.say(['An empty bassinet. The blanket is folded into a perfect square. Night shift has standards.']) },
      { ...CRIB, label: 'Crib', click: () => clickCrib(g) },
      { ...DOOR, label: 'OR 1', click: () => clickDoor(g) },
      { ...KEYPAD, x: KEYPAD.x - 10, w: KEYPAD.w + 20, label: 'Keypad', click: () => clickDoor(g) },
    ];
  },
};

function clickChair(g) {
  if (g.has('Tennis ball')) {
    g.say(['The chair keeps rocking. You decide it’s just being friendly.']);
    return;
  }
  g.audio.bark();
  g.give('Tennis ball');
  g.say([
    'You put a hand on the chair to stop it. It stops. Then, from under it, something rolls out against your shoe.',
    'A tennis ball. Slobbery. Chewed. A bark echoes down the hall, happy and impatient.',
    'Kana’s. Who let the dogs into the hospital?',
  ]);
}

function clickCrib(g) {
  if (!g.flag('onesie')) {
    g.set('onesie');
    g.say([
      'In the crib, folded small, is a tiny blue onesie. Across the front, in white letters: MY TIA LOVES ME.',
      'Beside it is a tiny crocheted beanie, barely bigger than your hand. You know those stitches. Those are yours.',
      'This is for Alex’s baby boy. Your nephew. The one who doesn’t know your name yet.',
      'Something is tucked inside the onesie.',
    ], () => g.findPage(4, () => g.say(['You have to wipe your eyes before you can keep going.'])));
    return;
  }
  if (!g.hasPage(4)) {
    g.findPage(4, () => g.say(['You have to wipe your eyes before you can keep going.']));
    return;
  }
  if (!g.has('Wristband')) {
    g.give('Wristband');
    g.say([
      'Under the page there’s one more thing: a hospital wristband.',
      'D. DOMINGUEZ · DOB 11/29/1997 · OR 1.',
      'That’s you. That’s your birthday. Why is your wristband in a crib?',
    ]);
    return;
  }
  g.say(['The little beanie sits in the crib, waiting for him. He’ll love it. He’s going to love you.']);
}

function clickDoor(g) {
  if (g.flag('nurseryOpen')) {
    leave(g);
    return;
  }
  g.ui.keypad({
    title: 'OR 1 · SURGERY IN PROGRESS',
    sub: 'Enter the patient’s date of birth · MMDD',
    code: CODE,
    onSuccess: () => {
      g.set('nurseryOpen');
      g.audio.unlock();
      leave(g);
    },
    onFail: () => {
      g.set('nurseryTries', (g.state.flags.nurseryTries || 0) + 1);
      if (g.state.flags.nurseryTries === 2) g.ui.toast(g.has('Wristband') ? 'Month and day. You know this one.' : 'Who is the patient tonight? Something in the crib might say.');
    },
  });
}

function leave(g) {
  if (!g.hasPage(4) || !g.has('Wristband')) {
    g.say(['You can’t leave yet. You haven’t looked properly in the crib.']);
    return;
  }
  g.audio.door();
  g.audio.heartbeat();
  g.goTo('or', 'The doors to OR 1 swing open by themselves.\n\nThe surgical light is on. The table is empty. The board on the wall has your name on it.\n\nThe doors close behind you.');
}
