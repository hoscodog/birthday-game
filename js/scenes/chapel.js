// Room 4: the chapel, the one safe room. The flashlight doesn't drain here and the creepy sounds fade out.
// Matches from the lost-and-found light five candles; when they're all lit, Psalm 23:4 shows on the wall
// and gives the nursery door code 234. Poem page IV is in the Bible on the lectern.
import { rr, stains, text, cached, rng, candle, HAND } from '../draw.js';

const WINDOW = { x: 640, y: 50, w: 320, h: 300 };
const ALTAR = { x: 560, y: 440, w: 480, h: 120 };
const CANDLES = [600, 680, 800, 920, 1000].map((x, i) => ({ x, y: 440, h: [60, 80, 100, 80, 60][i] }));
const LECTERN = { x: 1120, y: 400, w: 120, h: 240 };
const LOST = { x: 110, y: 560, w: 170, h: 100 };
const PEWS = { x: 300, y: 640, w: 1000, h: 200 };
const DOOR = { x: 1400, y: 250, w: 160, h: 410 };
const KEYPAD = { x: 1340, y: 410, w: 44, h: 64 };
const CODE = '234';

const background = cached((c) => {
  const r = rng(77);
  // wood-panelled walls
  c.fillStyle = '#3a2a1e';
  c.fillRect(0, 0, 1600, 640);
  c.strokeStyle = 'rgba(0,0,0,0.3)';
  c.lineWidth = 3;
  for (let x = 0; x < 1600; x += 80) { c.beginPath(); c.moveTo(x, 300); c.lineTo(x, 640); c.stroke(); }
  c.fillStyle = '#2d2017';
  c.fillRect(0, 290, 1600, 14);
  c.fillStyle = '#4a3828';
  c.fillRect(0, 0, 1600, 290);
  stains(c, r, 0, 0, 1600, 640, 20, '20,12,6');
  // carpet + aisle
  c.fillStyle = '#3d1416';
  c.fillRect(0, 640, 1600, 260);
  c.fillStyle = '#511b1e';
  c.beginPath(); c.moveTo(700, 640); c.lineTo(900, 640); c.lineTo(1050, 900); c.lineTo(550, 900); c.closePath(); c.fill();
  stains(c, r, 0, 650, 1600, 250, 12, '15,5,5');

  // stained glass window: arch, leaded panes
  c.save();
  c.beginPath();
  c.moveTo(WINDOW.x, WINDOW.y + WINDOW.h);
  c.lineTo(WINDOW.x, WINDOW.y + 140);
  c.arc(WINDOW.x + WINDOW.w / 2, WINDOW.y + 140, WINDOW.w / 2, Math.PI, 0);
  c.lineTo(WINDOW.x + WINDOW.w, WINDOW.y + WINDOW.h);
  c.closePath();
  c.clip();
  const cols = ['#2a4f8a', '#8a2a3a', '#c99a2a', '#2a7a5a', '#5a2a8a', '#2a6a8a'];
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      c.fillStyle = cols[Math.floor(r() * cols.length)];
      c.fillRect(WINDOW.x + i * 36, WINDOW.y + j * 36, 36, 36);
    }
  }
  // a simple cross in the middle
  c.fillStyle = '#e8d9a8';
  c.fillRect(WINDOW.x + WINDOW.w / 2 - 12, WINDOW.y + 60, 24, 200);
  c.fillRect(WINDOW.x + WINDOW.w / 2 - 70, WINDOW.y + 120, 140, 24);
  c.strokeStyle = '#111';
  c.lineWidth = 4;
  for (let i = 0; i <= 9; i++) {
    c.beginPath(); c.moveTo(WINDOW.x + i * 36, WINDOW.y); c.lineTo(WINDOW.x + i * 36, WINDOW.y + WINDOW.h); c.stroke();
    c.beginPath(); c.moveTo(WINDOW.x, WINDOW.y + i * 36); c.lineTo(WINDOW.x + WINDOW.w, WINDOW.y + i * 36); c.stroke();
  }
  c.restore();
  c.strokeStyle = '#1a120c';
  c.lineWidth = 10;
  c.beginPath();
  c.moveTo(WINDOW.x, WINDOW.y + WINDOW.h);
  c.lineTo(WINDOW.x, WINDOW.y + 140);
  c.arc(WINDOW.x + WINDOW.w / 2, WINDOW.y + 140, WINDOW.w / 2, Math.PI, 0);
  c.lineTo(WINDOW.x + WINDOW.w, WINDOW.y + WINDOW.h);
  c.stroke();

  // altar
  c.fillStyle = '#5c4430';
  c.fillRect(ALTAR.x, ALTAR.y, ALTAR.w, ALTAR.h + 80);
  c.fillStyle = '#e9e1cc';
  c.fillRect(ALTAR.x - 10, ALTAR.y, ALTAR.w + 20, 18);
  c.fillStyle = '#8a2a3a';
  c.fillRect(ALTAR.x + ALTAR.w / 2 - 40, ALTAR.y + 18, 80, 140);

  // lectern
  c.fillStyle = '#5c4430';
  c.fillRect(LECTERN.x + 45, LECTERN.y + 60, 30, 180);
  c.fillRect(LECTERN.x + 10, LECTERN.y + 220, 100, 20);
  c.beginPath();
  c.moveTo(LECTERN.x, LECTERN.y + 40); c.lineTo(LECTERN.x + LECTERN.w, LECTERN.y + 20);
  c.lineTo(LECTERN.x + LECTERN.w, LECTERN.y + 70); c.lineTo(LECTERN.x, LECTERN.y + 76);
  c.closePath(); c.fill();
  c.fillStyle = '#1d1712';
  c.beginPath();
  c.moveTo(LECTERN.x + 10, LECTERN.y + 34); c.lineTo(LECTERN.x + LECTERN.w - 10, LECTERN.y + 18);
  c.lineTo(LECTERN.x + LECTERN.w - 10, LECTERN.y + 30); c.lineTo(LECTERN.x + 10, LECTERN.y + 44);
  c.closePath(); c.fill();
  c.fillStyle = '#c62a2a';
  c.fillRect(LECTERN.x + 58, LECTERN.y + 36, 4, 40); // ribbon bookmark

  // lost and found box
  c.fillStyle = '#7a6040';
  c.fillRect(LOST.x, LOST.y, LOST.w, LOST.h);
  c.fillStyle = '#5c4430';
  c.fillRect(LOST.x - 6, LOST.y - 10, LOST.w + 12, 14);
  c.fillStyle = '#e8e1c8';
  c.fillRect(LOST.x + 25, LOST.y + 30, LOST.w - 50, 30);

  // pews (backs, seen from behind)
  for (let k = 0; k < 2; k++) {
    const py = PEWS.y + k * 100;
    [[PEWS.x - k * 60, 580 + k * 60], [870 + k * 0, 580 + k * 60]].forEach(([px, pw]) => {
      c.fillStyle = '#4a3020';
      c.fillRect(px, py, Math.min(pw, 430 + k * 60), 70);
      c.fillStyle = '#2d1c12';
      c.fillRect(px, py, Math.min(pw, 430 + k * 60), 10);
    });
  }

  // door
  c.fillStyle = '#1e160f';
  c.fillRect(DOOR.x - 12, DOOR.y - 12, DOOR.w + 24, DOOR.h + 12);
  c.fillStyle = '#d8d0c0';
  c.fillRect(DOOR.x, DOOR.y, DOOR.w, DOOR.h);
  c.fillStyle = '#b9b0a0';
  c.fillRect(DOOR.x + 16, DOOR.y + 20, DOOR.w - 32, 160);
  c.fillRect(DOOR.x + 16, DOOR.y + 210, DOOR.w - 32, 180);
  c.fillStyle = '#9aa3aa';
  rr(c, DOOR.x + 12, DOOR.y + 196, DOOR.w - 24, 14, 6);
  c.fill();
  // a stork sticker on the door
  c.fillStyle = '#e6a3c9';
  c.beginPath(); c.arc(DOOR.x + DOOR.w / 2, DOOR.y + 100, 34, 0, Math.PI * 2); c.fill();
  c.fillStyle = '#9ec9ef';
  c.beginPath(); c.arc(DOOR.x + DOOR.w / 2, DOOR.y + 100, 22, 0, Math.PI * 2); c.fill();
  c.fillStyle = '#1e1e1e';
  rr(c, KEYPAD.x, KEYPAD.y, KEYPAD.w, KEYPAD.h, 4);
  c.fill();
  c.fillStyle = '#555';
  for (let i = 0; i < 3; i++) for (let j = 0; j < 4; j++) c.fillRect(KEYPAD.x + 8 + i * 11, KEYPAD.y + 14 + j * 11, 7, 7);
  c.fillStyle = '#d8d3c4';
  c.fillRect(DOOR.x + 10, DOOR.y - 70, DOOR.w - 20, 44);
});

let verseAt = -1e9; // not saved: performance.now() restarts on reload

const litCount = (g) => CANDLES.filter((_, i) => g.flag(`candle${i}`)).length;
const allLit = (g) => litCount(g) === CANDLES.length;

export default {
  name: 'Chapel',
  safe: true,

  darkness(g) { return 0.9 - litCount(g) * 0.06; },

  enter(g) {
    g.audio.ambientLevel(0.15, 3);
    g.recharge();
    if (!g.flag('chapelIntro')) {
      g.set('chapelIntro');
      g.say([
        'You shut the door behind you and lean on it, breathing hard.',
        'The footsteps stop right outside. They wait. Then they walk away.',
        'It’s quiet in here. Actually quiet. Whatever is following you can’t come in.',
        '(Your flashlight holds its charge in here.)',
      ]);
    }
  },

  draw(c, t, g) {
    background(c);
    CANDLES.forEach((cd, i) => candle(c, cd.x, cd.y, cd.h, g.flag(`candle${i}`), t, i));
    if (allLit(g)) {
      const a = Math.min(1, Math.max(0, (t - verseAt) / 2500));
      c.save();
      c.globalAlpha = a;
      c.fillStyle = 'rgba(20,12,6,0.55)';
      c.fillRect(ALTAR.x + 10, ALTAR.y + 34, ALTAR.w - 20, 110);
      text(c, '“Even though I walk through the valley', 800, 62 + ALTAR.y, { size: 24, color: '#f3dca0', font: HAND });
      text(c, 'of the shadow of death, I will fear no evil,', 800, 92 + ALTAR.y, { size: 24, color: '#f3dca0', font: HAND });
      text(c, 'for You are with me.”  · PSALM 23:4', 800, 122 + ALTAR.y, { size: 24, color: '#f3dca0', font: HAND });
      c.restore();
    }
    text(c, 'NURSERY', DOOR.x + DOOR.w / 2, DOOR.y - 56, { size: 15, color: '#222' });
    text(c, 'MATERNITY WING', DOOR.x + DOOR.w / 2, DOOR.y - 38, { size: 11, color: '#555' });
    text(c, 'LOST & FOUND', LOST.x + LOST.w / 2, LOST.y + 45, { size: 13, color: '#3b2a1a' });
    c.fillStyle = g.flag('chapelOpen') ? '#3fdc6a' : '#e03b2f';
    c.beginPath(); c.arc(KEYPAD.x + 22, KEYPAD.y + 7, 3, 0, Math.PI * 2); c.fill();
  },

  lights(t, g) {
    const L = [
      { x: WINDOW.x + WINDOW.w / 2, y: WINDOW.y + 150, r: 320, a: 0.35 + Math.sin(t / 3000) * 0.05 },
      { x: KEYPAD.x + 22, y: KEYPAD.y + 7, r: 40, a: 0.5 },
    ];
    CANDLES.forEach((cd, i) => {
      if (g.flag(`candle${i}`)) L.push({ x: cd.x, y: cd.y - cd.h - 14, r: 230 + Math.sin(t / 90 + i) * 8, a: 0.55 });
    });
    return L;
  },

  hotspots(g) {
    const spots = [
      { ...WINDOW, label: 'Stained glass', click: () => g.say(['Even in the dark, the colors glow a little, like there’s a light behind the glass that’s never been switched off.']) },
      { ...ALTAR, y: ALTAR.y + 10, label: 'Altar', click: () => g.say([litCount(g) ? 'The altar cloth is old and mended in a dozen places. Someone has taken good care of this room.' : 'Five unlit candles stand on the altar. You’ll need something to light them with.']) },
      { ...PEWS, label: 'Pews', click: () => g.say(['You sit for a second. Just a second.', 'Your heart slows down. You say a quick prayer for whoever is on that OR table tonight.']) },
      { ...LOST, label: 'Lost & found', click: () => clickLost(g) },
      { ...LECTERN, label: 'Lectern', click: () => clickBible(g) },
      { ...DOOR, label: 'Nursery door', click: () => clickDoor(g) },
      { ...KEYPAD, x: KEYPAD.x - 10, w: KEYPAD.w + 20, label: 'Keypad', click: () => clickDoor(g) },
    ];
    CANDLES.forEach((cd, i) => spots.push({ x: cd.x - 22, y: cd.y - cd.h - 40, w: 44, h: cd.h + 40, label: g.flag(`candle${i}`) ? 'Candle' : 'Unlit candle', click: () => clickCandle(g, i) }));
    return spots;
  },
};

function clickLost(g) {
  if (!g.has('Matches')) {
    g.give('Matches');
    g.say([
      'A cardboard box of things people left behind: reading glasses, one earring, a baby sock.',
      'A little gold brooch shaped like a crescent moon, with a pink gem in the middle. It looks like it could transform somebody.',
      'And a book of matches from the hospital cafeteria. You take those.',
    ]);
    return;
  }
  g.say(['The crescent-moon brooch winks at you from the box. You leave it for its owner. In the name of the moon and all that.']);
}

function clickCandle(g, i) {
  if (g.flag(`candle${i}`)) {
    g.say(['The flame stands perfectly straight. No draft in here at all.']);
    return;
  }
  if (!g.has('Matches')) {
    g.say(['An unlit candle. You need something to light it with. Someone must have left matches around here.']);
    return;
  }
  g.set(`candle${i}`);
  g.audio.candle();
  if (allLit(g)) {
    verseAt = performance.now();
    g.audio.unlock();
    g.say([
      'The last wick catches. The whole room goes warm and gold.',
      'Words appear on the wall above the altar, like they were always there and just needed the light.',
      '“Even though I walk through the valley of the shadow of death, I will fear no evil, for You are with me.”',
      'Psalm 23:4.',
    ]);
  }
}

function clickBible(g) {
  if (!allLit(g)) {
    g.say(['A big old Bible lies open on the lectern, a red ribbon marking a page. It’s too dark to read.']);
    return;
  }
  if (!g.hasPage(3)) {
    g.say(['In the candlelight you can read the Bible now. The ribbon marks Psalm 23.', 'Tucked between the pages is another torn sheet of notebook paper.'], () => g.findPage(3, () => {
      g.say(['You read it twice. Then you hold it against your chest for a moment before you put it away.']);
    }));
    return;
  }
  g.say(['Psalm 23, verse 4, underlined in pencil a long time ago.']);
}

function clickDoor(g) {
  if (g.flag('chapelOpen')) {
    leave(g);
    return;
  }
  g.ui.keypad({
    title: 'NURSERY · MATERNITY WING',
    sub: '3-digit code',
    code: CODE,
    onSuccess: () => {
      g.set('chapelOpen');
      g.audio.unlock();
      leave(g);
    },
    onFail: () => {
      g.set('chapelTries', (g.state.flags.chapelTries || 0) + 1);
      if (g.state.flags.chapelTries === 2) g.ui.toast(allLit(g) ? 'Chapter and verse.' : 'This room is too dark to find the answer. Light it up.');
    },
  });
}

function leave(g) {
  if (!g.hasPage(3)) {
    g.say(['You’re not ready to leave yet. The Bible on the lectern keeps catching your eye.']);
    return;
  }
  g.audio.door();
  g.audio.ambientLevel(1, 4);
  g.goTo('nursery', 'You take one last breath of the quiet, and open the door.\n\nThe hallway beyond is painted pastel blue. Somewhere ahead, very softly, a music box is playing.');
}
