// Room 1: the scrub room. Her locker (code 0120), the crocheted jellyfish, poem page I, the red yarn.
import { rr, tiles, stains, drips, text, cached, rng, jellyfish, HAND } from '../draw.js';

const LOCKERS = [0, 1, 2, 3, 4].map((i) => ({ x: 170 + i * 118, y: 210, w: 110, h: 420 }));
const MINE = LOCKERS[2];
const DOOR = { x: 1350, y: 250, w: 160, h: 410 };
const MIRROR = { x: 1000, y: 220, w: 240, h: 250 };
const SINK = { x: 1010, y: 505, w: 220, h: 110 };
const BENCH = { x: 200, y: 592, w: 560, h: 50 };
const HEART = { x: 610, y: 596, w: 70, h: 40 };
const CLIP = { x: 1262, y: 300, w: 66, h: 90 };
const CLOCK = { x: 650, y: 70, w: 100, h: 100 };

const OTHER_LOCKER_LINES = [
  ['Locked. Something inside is ticking, slow and steady.', 'You decide not to find out what.'],
  ['This one swings open on its own.', 'Empty, except for a single surgical glove. It is still warm.'],
  ['A note is taped inside the vent:', '"Nobody works the night shift alone. Not really."'],
  ['Locked. Someone has written "NAP POD - DO NOT DISTURB" on it in Sharpie.', 'Fair.'],
];

const background = cached((c) => {
  const r = rng(7);
  // wall tiles
  tiles(c, 0, 0, 1600, 560, 60, '#73837c', '#5c6964', r);
  tiles(c, 0, 560, 1600, 80, 40, '#4c5955', '#3c4744', r);
  stains(c, r, 0, 0, 1600, 560, 22, '60,50,30');
  drips(c, r, 0, 0, 1600, 26, '50,40,25');
  // ceiling shadow
  const top = c.createLinearGradient(0, 0, 0, 220);
  top.addColorStop(0, 'rgba(0,0,0,0.55)');
  top.addColorStop(1, 'rgba(0,0,0,0)');
  c.fillStyle = top;
  c.fillRect(0, 0, 1600, 220);
  // floor
  for (let i = 0; i < 20; i++) {
    for (let j = 0; j < 4; j++) {
      c.fillStyle = (i + j) % 2 ? '#3b3633' : '#2c2826';
      c.fillRect(i * 80, 640 + j * 65, 80, 65);
    }
  }
  stains(c, r, 0, 650, 1600, 250, 14, '20,15,10');
  c.fillStyle = '#1e1b19';
  c.fillRect(0, 636, 1600, 8);

  // lockers (all closed bodies; hers is redrawn live)
  LOCKERS.forEach((L, i) => {
    c.fillStyle = '#53616f';
    c.fillRect(L.x, L.y, L.w, L.h);
    c.strokeStyle = '#2f3740';
    c.lineWidth = 4;
    c.strokeRect(L.x, L.y, L.w, L.h);
    c.fillStyle = '#3b4650';
    for (let k = 0; k < 6; k++) c.fillRect(L.x + 22, L.y + 24 + k * 12, L.w - 44, 5);
    c.fillStyle = '#9aa6ae';
    rr(c, L.x + L.w - 26, L.y + 200, 10, 46, 4);
    c.fill();
    c.fillStyle = '#c8ccc6';
    c.fillRect(L.x + 34, L.y + 110, 42, 20);
    c.fillStyle = '#333';
    c.font = '14px "Courier New", monospace';
    c.textAlign = 'center';
    c.fillText(String(101 + i), L.x + 55, L.y + 125);
    stains(c, r, L.x, L.y, L.w, L.h, 3, '30,20,10');
  });
  c.fillStyle = '#3e4952';
  c.fillRect(160, 200, 600, 12);

  // bench
  c.fillStyle = '#2a211a';
  c.fillRect(230, 618, 18, 60);
  c.fillRect(712, 618, 18, 60);
  c.fillStyle = '#6e4c30';
  rr(c, BENCH.x, BENCH.y, BENCH.w, 28, 5);
  c.fill();
  c.strokeStyle = 'rgba(30,18,8,0.5)';
  c.lineWidth = 2;
  for (let k = 0; k < 6; k++) {
    c.beginPath();
    c.moveTo(BENCH.x + 10, BENCH.y + 6 + k * 3.5 + r() * 2);
    c.lineTo(BENCH.x + BENCH.w - 10, BENCH.y + 6 + k * 3.5 + r() * 2);
    c.stroke();
  }
  // carved heart
  c.strokeStyle = '#2e1c0e';
  c.lineWidth = 2.5;
  c.beginPath();
  const hx = HEART.x + 35;
  const hy = BENCH.y + 8;
  c.moveTo(hx, hy + 16);
  c.bezierCurveTo(hx - 26, hy, hx - 14, hy - 10, hx, hy - 1);
  c.bezierCurveTo(hx + 14, hy - 10, hx + 26, hy, hx, hy + 16);
  c.stroke();

  // mirror + sink
  c.fillStyle = '#8d979b';
  c.fillRect(MIRROR.x - 10, MIRROR.y - 10, MIRROR.w + 20, MIRROR.h + 20);
  const glass = c.createLinearGradient(MIRROR.x, MIRROR.y, MIRROR.x + MIRROR.w, MIRROR.y + MIRROR.h);
  glass.addColorStop(0, '#8aa0a6');
  glass.addColorStop(0.5, '#5f7177');
  glass.addColorStop(1, '#3e4c50');
  c.fillStyle = glass;
  c.fillRect(MIRROR.x, MIRROR.y, MIRROR.w, MIRROR.h);
  stains(c, r, MIRROR.x, MIRROR.y, MIRROR.w, MIRROR.h, 6, '200,210,210');
  c.fillStyle = '#c9cfd1';
  rr(c, SINK.x, SINK.y + 15, SINK.w, 60, 10);
  c.fill();
  c.fillStyle = '#7e878a';
  rr(c, SINK.x + 20, SINK.y + 22, SINK.w - 40, 30, 8);
  c.fill();
  c.fillStyle = '#a8b0b3';
  c.fillRect(SINK.x + SINK.w / 2 - 6, SINK.y - 10, 12, 30);
  c.fillRect(SINK.x + SINK.w / 2 - 6, SINK.y - 10, 40, 10);
  c.fillStyle = '#8d9497';
  c.fillRect(SINK.x + 40, SINK.y + 75, 20, 70);
  c.fillRect(SINK.x + SINK.w - 60, SINK.y + 75, 20, 70);

  // door
  c.fillStyle = '#2a2e33';
  c.fillRect(DOOR.x - 12, DOOR.y - 12, DOOR.w + 24, DOOR.h + 12);
  c.fillStyle = '#67737e';
  c.fillRect(DOOR.x, DOOR.y, DOOR.w, DOOR.h);
  stains(c, r, DOOR.x, DOOR.y, DOOR.w, DOOR.h, 5, '30,25,20');
  c.fillStyle = '#0b0d10';
  c.fillRect(DOOR.x + 40, DOOR.y + 50, 80, 110);
  c.strokeStyle = '#a4adb4';
  c.lineWidth = 3;
  c.strokeRect(DOOR.x + 40, DOOR.y + 50, 80, 110);
  c.fillStyle = '#aab3ba';
  rr(c, DOOR.x + 12, DOOR.y + 220, DOOR.w - 24, 16, 6);
  c.fill();
  // claw scratches (Dio was here)
  c.strokeStyle = 'rgba(220,220,215,0.55)';
  c.lineWidth = 2;
  for (let k = 0; k < 4; k++) {
    c.beginPath();
    c.moveTo(DOOR.x + 40 + k * 9, DOOR.y + 330);
    c.lineTo(DOOR.x + 58 + k * 9, DOOR.y + 395);
    c.stroke();
  }
  // exit sign box
  c.fillStyle = '#1a1a1a';
  c.fillRect(DOOR.x + 30, DOOR.y - 62, 100, 36);

  // clipboard
  c.fillStyle = '#7a5a36';
  rr(c, CLIP.x, CLIP.y, CLIP.w, CLIP.h, 4);
  c.fill();
  c.fillStyle = '#e6e0d0';
  c.fillRect(CLIP.x + 6, CLIP.y + 12, CLIP.w - 12, CLIP.h - 18);
  c.fillStyle = '#b8b8b8';
  c.fillRect(CLIP.x + 20, CLIP.y - 4, 26, 12);
  c.fillStyle = '#555';
  for (let k = 0; k < 6; k++) c.fillRect(CLIP.x + 12, CLIP.y + 24 + k * 9, 30 + r() * 12, 2);

  // wall clock
  c.fillStyle = '#ddd6c6';
  c.beginPath();
  c.arc(CLOCK.x + 50, CLOCK.y + 50, 44, 0, Math.PI * 2);
  c.fill();
  c.strokeStyle = '#222';
  c.lineWidth = 5;
  c.stroke();

  // paper towel dispenser + sanitizer
  c.fillStyle = '#b9bdb8';
  rr(c, 1268, 440, 60, 80, 6);
  c.fill();
  c.fillStyle = '#e8e4da';
  c.fillRect(1282, 512, 32, 16);
  c.fillStyle = '#cfd6d8';
  rr(c, 960, 300, 26, 60, 4);
  c.fill();

  // ceiling fixture
  c.fillStyle = '#2b2b2b';
  c.fillRect(640, 0, 320, 26);
});

function drawMyLocker(c, t, g) {
  const L = MINE;
  if (!g.flag('lockerOpen')) {
    c.fillStyle = '#e8e2cf';
    c.fillRect(L.x + 14, L.y + 140, L.w - 28, 22);
    text(c, 'D. DOMINGUEZ', L.x + L.w / 2, L.y + 151, { size: 10.5, color: '#2a2a2a', font: '"Courier New", monospace' });
    // keypad lock
    c.fillStyle = '#1b1e22';
    rr(c, L.x + L.w - 44, L.y + 260, 32, 48, 4);
    c.fill();
    const blink = Math.floor(t / 700) % 2 === 0;
    c.fillStyle = blink ? '#e03b2f' : '#5a1914';
    c.beginPath();
    c.arc(L.x + L.w - 28, L.y + 270, 4, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = '#4a5058';
    for (let k = 0; k < 6; k++) c.fillRect(L.x + L.w - 40 + (k % 3) * 9, L.y + 280 + Math.floor(k / 3) * 10, 6, 6);
    return;
  }
  // open: dark interior + swung door
  c.fillStyle = '#15191c';
  c.fillRect(L.x + 4, L.y + 4, L.w - 8, L.h - 8);
  c.fillStyle = '#20262b';
  c.fillRect(L.x + 4, L.y + 280, L.w - 8, 6);
  c.fillStyle = '#4a5560';
  c.beginPath();
  c.moveTo(L.x, L.y);
  c.lineTo(L.x - 46, L.y + 20);
  c.lineTo(L.x - 46, L.y + L.h - 20);
  c.lineTo(L.x, L.y + L.h);
  c.closePath();
  c.fill();
  c.fillStyle = '#e8e2cf';
  c.fillRect(L.x - 38, L.y + 150, 28, 14);
  // hook + scrubs
  c.fillStyle = '#9aa';
  c.fillRect(L.x + 50, L.y + 20, 10, 10);
  c.fillStyle = '#2f7f86';
  c.beginPath();
  c.moveTo(L.x + 18, L.y + 40);
  c.lineTo(L.x + 92, L.y + 40);
  c.lineTo(L.x + 98, L.y + 250);
  c.lineTo(L.x + 12, L.y + 250);
  c.closePath();
  c.fill();
  c.fillStyle = '#28707a';
  c.fillRect(L.x + 30, L.y + 70, 26, 22);
  if (!g.flag('gotJelly')) {
    c.strokeStyle = '#ddd';
    c.lineWidth = 1.5;
    c.beginPath();
    c.moveTo(L.x + 55, L.y + 30);
    c.lineTo(L.x + 55, L.y + 92);
    c.stroke();
    jellyfish(c, L.x + 55, L.y + 128, 0.62, t);
  }
  if (!g.hasPage(0)) {
    c.save();
    c.translate(L.x + 40, L.y + 330);
    c.rotate(-0.12);
    c.fillStyle = '#e6dcc2';
    c.fillRect(-28, -20, 56, 40);
    c.strokeStyle = 'rgba(40,60,120,0.5)';
    c.lineWidth = 1;
    for (let k = 0; k < 4; k++) {
      c.beginPath();
      c.moveTo(-22, -10 + k * 8);
      c.lineTo(22, -10 + k * 8);
      c.stroke();
    }
    c.restore();
  }
  if (!g.has('Red yarn')) {
    c.fillStyle = '#a3141c';
    c.beginPath();
    c.arc(L.x + 80, L.y + 380, 17, 0, Math.PI * 2);
    c.fill();
    c.strokeStyle = '#6d0b10';
    c.lineWidth = 2;
    for (let k = 0; k < 4; k++) {
      c.beginPath();
      c.arc(L.x + 80, L.y + 380, 14, k * 0.8, k * 0.8 + 2);
      c.stroke();
    }
  }
}

function drawYarnPath(c, t) {
  c.strokeStyle = '#b3121b';
  c.lineWidth = 4;
  c.lineCap = 'round';
  c.beginPath();
  c.moveTo(MINE.x + 80, MINE.y + MINE.h - 4);
  c.bezierCurveTo(700, 860, 1150, 700, DOOR.x + 60, DOOR.y + DOOR.h + 6);
  c.stroke();
  c.strokeStyle = 'rgba(255,120,120,0.25)';
  c.lineWidth = 1.5;
  c.stroke();
}

function lampLevel(t) {
  // Mostly dim, with stutters.
  const k = Math.floor(t / 90);
  const n = Math.sin(k * 12.9898) * 43758.5453;
  const r = n - Math.floor(n);
  if (r < 0.05) return 0;
  if (r < 0.1) return 0.55;
  return 0.22;
}

export default {
  name: 'Scrub Room',

  enter(g) {
    if (!g.flag('scrubIntro')) {
      g.set('scrubIntro');
      g.say([
        '3:04 AM. You made it in.',
        'The parking lot was empty. So was the front desk. Nobody answered when you called out.',
        'The page said OR 1, STAT. Find your locker and get changed.',
      ]);
    }
  },

  draw(c, t, g) {
    background(c);
    drawMyLocker(c, t, g);
    if (g.has('Red yarn')) drawYarnPath(c, t);
    // mirror writing in the fog
    text(c, "DON'T BE LATE,", MIRROR.x + MIRROR.w / 2, MIRROR.y + 95, { size: 40, color: 'rgba(235,240,240,0.22)', font: HAND, rot: -0.05 });
    text(c, 'DEBBIE', MIRROR.x + MIRROR.w / 2, MIRROR.y + 145, { size: 52, color: 'rgba(235,240,240,0.22)', font: HAND, rot: -0.03 });
    if (g.flag('mirror2')) {
      // the reflection that blinks late
      c.fillStyle = 'rgba(10,12,14,0.55)';
      c.beginPath();
      c.ellipse(MIRROR.x + 120, MIRROR.y + 200, 40, 52, 0, 0, Math.PI * 2);
      c.fill();
    }
    // exit sign
    const on = lampLevel(t + 400) > 0;
    text(c, 'EXIT', DOOR.x + 80, DOOR.y - 44, { size: 26, color: on ? '#ff3b30' : '#5a1310' });
    // clock reads the in-game time
    const cx = CLOCK.x + 50;
    const cy = CLOCK.y + 50;
    const mins = 4 + g.state.minutes;
    c.strokeStyle = '#222';
    c.lineWidth = 4;
    c.beginPath();
    c.moveTo(cx, cy);
    const ha = ((3 + mins / 60) / 12) * Math.PI * 2 - Math.PI / 2;
    c.lineTo(cx + Math.cos(ha) * 22, cy + Math.sin(ha) * 22);
    c.moveTo(cx, cy);
    const ma = (mins / 60) * Math.PI * 2 - Math.PI / 2;
    c.lineTo(cx + Math.cos(ma) * 34, cy + Math.sin(ma) * 34);
    c.stroke();
    // flickering tube
    const lv = lampLevel(t);
    c.fillStyle = lv > 0 ? `rgba(230,240,225,${0.4 + lv})` : '#333';
    c.fillRect(660, 22, 280, 8);
  },

  lights(t) {
    return [
      { x: 800, y: 30, r: 520, a: lampLevel(t) },
      { x: DOOR.x + 80, y: DOOR.y - 44, r: 140, a: lampLevel(t + 400) > 0 ? 0.45 : 0 },
    ];
  },

  hotspots(g) {
    const spots = [];
    LOCKERS.forEach((L, i) => {
      if (L === MINE) return;
      spots.push({
        ...L,
        label: `Locker ${101 + i}`,
        click: () => g.say(OTHER_LOCKER_LINES[i > 2 ? i - 1 : i]),
      });
    });
    spots.push({ ...BENCH, label: 'Bench', click: () => g.say(['An old wooden bench. Someone has carved something into the far end of it.']) });
    spots.push({
      ...HEART,
      label: 'Carving',
      click: () => g.say(['A heart, carved into the wood a long time ago.', 'Inside it, two numbers: 1 · 20', 'Some dates you just don’t forget.']),
    });
    spots.push({
      ...MINE,
      x: MINE.x - (g.flag('lockerOpen') ? 46 : 0),
      w: MINE.w + (g.flag('lockerOpen') ? 46 : 0),
      label: g.flag('lockerOpen') ? 'Your locker' : 'Locker 103 · D. DOMINGUEZ',
      click: () => clickMyLocker(g),
    });
    spots.push({
      ...MIRROR,
      label: 'Mirror',
      click: () => {
        if (!g.flag('mirror1')) {
          g.set('mirror1');
          g.audio.whisper();
          g.say(['The mirror is fogged over, though the room is cold.', 'Someone wrote in the fog with a fingertip: DON’T BE LATE, DEBBIE.']);
        } else if (!g.flag('mirror2')) {
          g.set('mirror2');
          g.shake(250);
          g.say(['You lean in close.', 'Your reflection blinks a half second after you do.', 'You step back. You definitely blinked first.']);
        } else {
          g.say(['You don’t look at the mirror again. You’re not falling for that twice.']);
        }
      },
    });
    spots.push({
      ...SINK,
      label: 'Scrub sink',
      click: () => {
        g.audio.drip();
        g.say(['The faucet coughs out rust-brown water, then runs clear.', 'Five-minute scrub, out of habit. Fingertips, nails, between the fingers, up to the elbow.', 'You still don’t know what case this is.']);
      },
    });
    spots.push({
      ...CLIP,
      label: 'OR schedule',
      click: () => g.say([
        'OR SCHEDULE: NIGHT',
        '03:00 · OR 1 · Patient: D. DOMINGUEZ · Procedure: [smudged] · Surgeon: none listed',
        '...That’s your name.',
      ]),
    });
    spots.push({ ...CLOCK, label: 'Clock', click: () => g.say(['The clock is ticking, but much too loudly for its size.']) });
    spots.push({ ...DOOR, label: 'Hallway door', click: () => clickDoor(g) });
    return spots;
  },
};

function clickMyLocker(g) {
  if (!g.flag('lockerOpen')) {
    g.ui.keypad({
      title: 'LOCKER 103',
      sub: 'D. DOMINGUEZ · 4-digit combination',
      code: '0120',
      onSuccess: () => {
        g.set('lockerOpen');
        g.audio.unlock();
        g.audio.door();
        g.say(['The lock clicks. The door creaks open on its own.']);
      },
      onFail: () => {
        g.set('lockerTries', (g.state.flags.lockerTries || 0) + 1);
        if (g.state.flags.lockerTries === 3) g.ui.toast('Something carved nearby might help.');
      },
    });
    return;
  }
  if (!g.flag('gotJelly')) {
    g.set('gotJelly');
    g.give('Crocheted jellyfish');
    g.say([
      'Hanging from the hook: your crocheted jellyfish.',
      'You made this one with your own two hands. It’s soft, a little lopsided, and it smiles at you.',
      'Holding it, the dark feels a little less heavy.',
    ]);
    return;
  }
  if (!g.hasPage(0)) {
    g.say(['On the shelf there is a folded page, torn from a notebook. The handwriting is familiar.'], () => g.findPage(0, () => {
      g.say(['Why would this be in your locker?', 'There’s more, you can feel it. More pages, somewhere in this place.']);
    }));
    return;
  }
  if (!g.has('Red yarn')) {
    g.give('Red yarn');
    g.say([
      'At the bottom of the locker, a ball of red yarn. One end is tied tight to the hook.',
      'The rest has already unspooled across the floor, under the door, out into the dark.',
      'Like it wants to show you the way.',
    ]);
    return;
  }
  g.say(['Just your scrubs, hung neatly. They smell like hospital laundry and, faintly, espresso.']);
}

function clickDoor(g) {
  if (!g.has('Red yarn') || !g.hasPage(0)) {
    g.say([
      'Through the little window: hallway, pitch black.',
      'Deep scratches run down the bottom of the door. Something small and very angry did that.',
      'You’d get lost out there. You need something to follow, and you have a feeling you’re missing something in here.',
    ]);
    return;
  }
  g.audio.door();
  g.goTo('break', 'You follow the red yarn into the dark hallway, one hand on the wall.\n\nBehind you, the scrub room lights go out one by one.\n\nThe yarn leads to a door that smells like burnt coffee.');
}
