// Room 2: the break room. Espresso puzzle (flashlight recharge), the "Wes Anderson" cassette (poem page II),
// the TV cartoon, the kettle, the dog bowls, and Dio in the vent (jump scare #1, drops the badge).
import { rr, tiles, stains, drips, text, cached, rng, HAND } from '../draw.js';

const COUNTER = { x: 100, y: 470, w: 820, h: 90 };
const ESPRESSO = { x: 200, y: 318, w: 170, h: 152 };
const RADIO = { x: 520, y: 392, w: 170, h: 78 };
const KETTLE = { x: 760, y: 388, w: 110, h: 82 };
const FRIDGE = { x: 950, y: 240, w: 150, h: 380 };
const TABLE = { x: 1120, y: 560, w: 240, h: 40 };
const BOWLS = { x: 1150, y: 720, w: 180, h: 50 };
const TV = { x: 1150, y: 120, w: 220, h: 150 };
const VENT = { x: 50, y: 670, w: 150, h: 90 };
const DOOR = { x: 1415, y: 270, w: 150, h: 400 };

const background = cached((c) => {
  const r = rng(21);
  // wall: tired yellow paint over block
  c.fillStyle = '#6f6750';
  c.fillRect(0, 0, 1600, 640);
  c.strokeStyle = 'rgba(40,34,20,0.35)';
  c.lineWidth = 2;
  for (let y = 0; y < 640; y += 48) {
    const off = (y / 48) % 2 ? 0 : 60;
    c.beginPath();
    c.moveTo(0, y);
    c.lineTo(1600, y);
    c.stroke();
    for (let x = off; x < 1600; x += 120) {
      c.beginPath();
      c.moveTo(x, y);
      c.lineTo(x, y + 48);
      c.stroke();
    }
  }
  stains(c, r, 0, 0, 1600, 640, 30, '50,38,15');
  drips(c, r, 0, 0, 1600, 30, '45,35,15');
  const top = c.createLinearGradient(0, 0, 0, 200);
  top.addColorStop(0, 'rgba(0,0,0,0.6)');
  top.addColorStop(1, 'rgba(0,0,0,0)');
  c.fillStyle = top;
  c.fillRect(0, 0, 1600, 200);
  // floor linoleum
  tiles(c, 0, 640, 1600, 260, 90, '#4a443b', '#36312a', r);
  stains(c, r, 0, 650, 1600, 250, 18, '20,15,8');
  c.fillStyle = '#26221c';
  c.fillRect(0, 634, 1600, 10);

  // counter + cabinets
  c.fillStyle = '#5b4632';
  c.fillRect(COUNTER.x, COUNTER.y + 20, COUNTER.w, 150);
  c.strokeStyle = '#3a2b1d';
  c.lineWidth = 3;
  for (let k = 0; k < 4; k++) {
    c.strokeRect(COUNTER.x + 10 + k * 202, COUNTER.y + 32, 190, 128);
    c.fillStyle = '#b5a98f';
    c.fillRect(COUNTER.x + 180 + k * 202, COUNTER.y + 80, 6, 28);
  }
  c.fillStyle = '#c2b69a';
  c.fillRect(COUNTER.x - 10, COUNTER.y, COUNTER.w + 20, 22);
  stains(c, r, COUNTER.x, COUNTER.y, COUNTER.w, 22, 5, '80,50,20');
  // upper cabinets
  c.fillStyle = '#5b4632';
  c.fillRect(120, 90, 760, 150);
  c.strokeStyle = '#3a2b1d';
  for (let k = 0; k < 4; k++) c.strokeRect(128 + k * 188, 98, 178, 134);

  // espresso machine body
  c.fillStyle = '#9ea4a8';
  rr(c, ESPRESSO.x, ESPRESSO.y, ESPRESSO.w, ESPRESSO.h, 8);
  c.fill();
  c.fillStyle = '#c9ced1';
  c.fillRect(ESPRESSO.x + 8, ESPRESSO.y + 8, ESPRESSO.w - 16, 40);
  c.fillStyle = '#2c2f31';
  c.fillRect(ESPRESSO.x + 50, ESPRESSO.y + 60, 70, 18);
  c.fillRect(ESPRESSO.x + 30, ESPRESSO.y + 70, 110, 10);
  c.fillStyle = '#6e7477';
  c.fillRect(ESPRESSO.x + 20, ESPRESSO.y + 132, ESPRESSO.w - 40, 12);
  c.fillStyle = '#e9e4da';
  rr(c, ESPRESSO.x + 66, ESPRESSO.y + 104, 34, 28, 4);
  c.fill();
  c.strokeStyle = '#7a7f82';
  c.lineWidth = 4;
  c.beginPath();
  c.moveTo(ESPRESSO.x + 150, ESPRESSO.y + 60);
  c.lineTo(ESPRESSO.x + 160, ESPRESSO.y + 120);
  c.stroke();
  // grinder
  c.fillStyle = '#2a2a2a';
  c.fillRect(380, 360, 54, 110);
  c.fillStyle = 'rgba(120,80,40,0.8)';
  c.beginPath();
  c.moveTo(384, 300);
  c.lineTo(430, 300);
  c.lineTo(418, 360);
  c.lineTo(396, 360);
  c.closePath();
  c.fill();

  // boombox
  c.fillStyle = '#26282b';
  rr(c, RADIO.x, RADIO.y, RADIO.w, RADIO.h, 8);
  c.fill();
  c.fillStyle = '#0f1011';
  c.beginPath();
  c.arc(RADIO.x + 32, RADIO.y + 42, 24, 0, Math.PI * 2);
  c.arc(RADIO.x + RADIO.w - 32, RADIO.y + 42, 24, 0, Math.PI * 2);
  c.fill();
  c.fillStyle = '#3c3f43';
  c.fillRect(RADIO.x + 62, RADIO.y + 24, 46, 32);
  c.strokeStyle = '#555';
  c.lineWidth = 3;
  c.beginPath();
  c.moveTo(RADIO.x + 20, RADIO.y);
  c.lineTo(RADIO.x + 40, RADIO.y - 28);
  c.lineTo(RADIO.x + RADIO.w - 40, RADIO.y - 28);
  c.lineTo(RADIO.x + RADIO.w - 20, RADIO.y);
  c.stroke();

  // stove + kettle
  c.fillStyle = '#3a3a3a';
  c.fillRect(KETTLE.x - 12, 462, KETTLE.w + 24, 10);
  c.fillStyle = '#b84a2a';
  c.beginPath();
  c.ellipse(KETTLE.x + 55, 438, 46, 38, 0, Math.PI, 0);
  c.lineTo(KETTLE.x + 101, 462);
  c.lineTo(KETTLE.x + 9, 462);
  c.closePath();
  c.fill();
  c.strokeStyle = '#222';
  c.lineWidth = 5;
  c.beginPath();
  c.arc(KETTLE.x + 55, 410, 24, Math.PI, 0);
  c.stroke();
  c.fillStyle = '#b84a2a';
  c.beginPath();
  c.moveTo(KETTLE.x + 92, 440);
  c.lineTo(KETTLE.x + 122, 420);
  c.lineTo(KETTLE.x + 120, 430);
  c.lineTo(KETTLE.x + 96, 452);
  c.closePath();
  c.fill();
  c.fillStyle = '#efe7c8';
  c.fillRect(KETTLE.x + 26, 436, 60, 18);

  // fridge
  c.fillStyle = '#cfcbbf';
  rr(c, FRIDGE.x, FRIDGE.y, FRIDGE.w, FRIDGE.h, 8);
  c.fill();
  c.strokeStyle = '#8f8a7e';
  c.lineWidth = 3;
  c.beginPath();
  c.moveTo(FRIDGE.x, FRIDGE.y + 130);
  c.lineTo(FRIDGE.x + FRIDGE.w, FRIDGE.y + 130);
  c.stroke();
  c.fillStyle = '#8f8a7e';
  c.fillRect(FRIDGE.x + FRIDGE.w - 22, FRIDGE.y + 40, 8, 60);
  c.fillRect(FRIDGE.x + FRIDGE.w - 22, FRIDGE.y + 160, 8, 90);
  stains(c, r, FRIDGE.x, FRIDGE.y, FRIDGE.w, FRIDGE.h, 6, '80,70,40');
  // magnet + notes
  c.fillStyle = '#efe6c0';
  c.save();
  c.translate(FRIDGE.x + 60, FRIDGE.y + 200);
  c.rotate(0.05);
  c.fillRect(-42, -30, 84, 60);
  c.restore();
  c.fillStyle = '#a33';
  c.beginPath();
  c.arc(FRIDGE.x + 60, FRIDGE.y + 172, 6, 0, Math.PI * 2);
  c.fill();
  c.fillStyle = '#f3d36b';
  c.fillRect(FRIDGE.x + 24, FRIDGE.y + 40, 50, 46);

  // table + chairs
  c.fillStyle = '#2a241d';
  c.fillRect(TABLE.x + 20, TABLE.y + 30, 14, 110);
  c.fillRect(TABLE.x + TABLE.w - 34, TABLE.y + 30, 14, 110);
  c.fillStyle = '#7d6a50';
  rr(c, TABLE.x, TABLE.y, TABLE.w, 34, 4);
  c.fill();
  c.fillStyle = '#3b4a5a';
  c.fillRect(TABLE.x - 60, TABLE.y - 60, 46, 70);
  c.fillRect(TABLE.x - 70, TABLE.y + 10, 66, 16);
  c.fillRect(TABLE.x - 66, TABLE.y + 26, 8, 100);
  c.fillRect(TABLE.x - 20, TABLE.y + 26, 8, 100);
  // mug on table
  c.fillStyle = '#e8e1d3';
  c.fillRect(TABLE.x + 150, TABLE.y - 30, 30, 32);
  c.strokeStyle = '#e8e1d3';
  c.lineWidth = 4;
  c.beginPath();
  c.arc(TABLE.x + 184, TABLE.y - 14, 9, -1.4, 1.4);
  c.stroke();

  // dog bowls
  [[BOWLS.x + 40, '#8a2c3e'], [BOWLS.x + 140, '#2c5a8a']].forEach(([bx, col]) => {
    c.fillStyle = col;
    c.beginPath();
    c.ellipse(bx, BOWLS.y + 30, 38, 14, 0, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = 'rgba(0,0,0,0.4)';
    c.beginPath();
    c.ellipse(bx, BOWLS.y + 25, 28, 7, 0, 0, Math.PI * 2);
    c.fill();
  });

  // TV bracket + frame
  c.fillStyle = '#1a1a1a';
  c.fillRect(TV.x + 95, TV.y - 40, 30, 44);
  c.fillStyle = '#26221e';
  rr(c, TV.x - 14, TV.y - 12, TV.w + 28, TV.h + 24, 10);
  c.fill();

  // vent
  c.fillStyle = '#1b1d1f';
  c.fillRect(VENT.x, VENT.y, VENT.w, VENT.h);
  c.strokeStyle = '#6a7075';
  c.lineWidth = 4;
  c.strokeRect(VENT.x, VENT.y, VENT.w, VENT.h);
  for (let k = 1; k < 7; k++) {
    c.beginPath();
    c.moveTo(VENT.x + 6, VENT.y + k * 12.5);
    c.lineTo(VENT.x + VENT.w - 6, VENT.y + k * 12.5);
    c.stroke();
  }
  // scratch marks around the vent
  c.strokeStyle = 'rgba(230,225,215,0.45)';
  c.lineWidth = 2;
  for (let k = 0; k < 4; k++) {
    c.beginPath();
    c.moveTo(VENT.x + VENT.w + 10 + k * 8, VENT.y - 30);
    c.lineTo(VENT.x + VENT.w + 24 + k * 8, VENT.y + 20);
    c.stroke();
  }

  // door to the surgical wing
  c.fillStyle = '#2b2620';
  c.fillRect(DOOR.x - 12, DOOR.y - 12, DOOR.w + 24, DOOR.h + 12);
  c.fillStyle = '#5c6a78';
  c.fillRect(DOOR.x, DOOR.y, DOOR.w, DOOR.h);
  c.fillStyle = '#0b0d10';
  c.fillRect(DOOR.x + 35, DOOR.y + 50, 80, 100);
  c.fillStyle = '#9aa3aa';
  rr(c, DOOR.x + 12, DOOR.y + 210, DOOR.w - 24, 16, 6);
  c.fill();
  c.fillStyle = '#1e1e1e';
  rr(c, DOOR.x - 50, DOOR.y + 170, 30, 50, 4);
  c.fill();
  c.fillStyle = '#d8d3c4';
  c.fillRect(DOOR.x + 10, DOOR.y - 70, DOOR.w - 20, 44);
});

function drawTV(c, t) {
  const { x, y, w, h } = TV;
  // grainy black and white picture
  const flick = 0.75 + Math.random() * 0.25;
  c.fillStyle = `rgb(${Math.floor(150 * flick)},${Math.floor(150 * flick)},${Math.floor(145 * flick)})`;
  c.fillRect(x, y, w, h);
  // 1930s-style rubber-hose flower doing a little bounce
  const b = Math.abs(Math.sin(t / 260)) * 14;
  const sx = x + w / 2 + Math.sin(t / 900) * 40;
  c.strokeStyle = '#111';
  c.lineWidth = 4;
  c.beginPath();
  c.moveTo(sx, y + h - 12);
  c.quadraticCurveTo(sx + Math.sin(t / 260) * 18, y + h - 45, sx, y + 70 - b);
  c.stroke();
  c.fillStyle = '#111';
  for (let k = 0; k < 6; k++) {
    const a = (k / 6) * Math.PI * 2 + t / 1500;
    c.beginPath();
    c.ellipse(sx + Math.cos(a) * 18, y + 58 - b + Math.sin(a) * 18, 10, 7, a, 0, Math.PI * 2);
    c.fill();
  }
  c.fillStyle = '#eee';
  c.beginPath();
  c.arc(sx, y + 58 - b, 12, 0, Math.PI * 2);
  c.fill();
  c.fillStyle = '#111';
  c.beginPath();
  c.arc(sx - 4, y + 55 - b, 2.5, 0, Math.PI * 2);
  c.arc(sx + 4, y + 55 - b, 2.5, 0, Math.PI * 2);
  c.fill();
  // grain, scratches, vignette
  for (let i = 0; i < 160; i++) {
    c.fillStyle = Math.random() < 0.5 ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.3)';
    c.fillRect(x + Math.random() * w, y + Math.random() * h, 2, 2);
  }
  if (Math.random() < 0.3) {
    c.fillStyle = 'rgba(0,0,0,0.4)';
    c.fillRect(x + Math.random() * w, y, 1.5, h);
  }
  const v = c.createRadialGradient(x + w / 2, y + h / 2, 30, x + w / 2, y + h / 2, w * 0.7);
  v.addColorStop(0, 'rgba(0,0,0,0)');
  v.addColorStop(1, 'rgba(0,0,0,0.65)');
  c.fillStyle = v;
  c.fillRect(x, y, w, h);
}

function lampLevel(t) {
  const k = Math.floor(t / 110);
  const n = Math.sin(k * 78.233) * 43758.5453;
  const r = n - Math.floor(n);
  if (r < 0.08) return 0;
  if (r < 0.12) return 0.45;
  return 0.16;
}

let nextScratch = 0;

export default {
  name: 'Break Room',

  enter(g) {
    if (!g.flag('breakIntro')) {
      g.set('breakIntro');
      g.say([
        'The staff break room. The yarn ends here, tied to a chair leg.',
        'Someone left the TV on. Something in the walls is moving.',
        g.state.battery < 60 ? 'Your flashlight is getting weak. You could really use a coffee.' : 'You could really use a coffee.',
      ]);
    }
  },

  update(t, g) {
    if (g.flag('dio')) return;
    const m = g.mouse;
    const dx = m.x - (VENT.x + VENT.w / 2);
    const dy = m.y - (VENT.y + VENT.h / 2);
    if (dx * dx + dy * dy < 260 * 260 && t > nextScratch && !g.ui.busy()) {
      g.audio.scratch();
      nextScratch = t + 2200;
    }
  },

  draw(c, t, g) {
    background(c);
    drawTV(c, t);
    // espresso ready light
    const ready = g.flag('espresso');
    c.fillStyle = ready ? '#3fdc6a' : (Math.floor(t / 600) % 2 ? '#e03b2f' : '#4a1410');
    c.beginPath();
    c.arc(ESPRESSO.x + 24, ESPRESSO.y + 28, 6, 0, Math.PI * 2);
    c.fill();
    // cassette in the boombox window
    text(c, 'WES', RADIO.x + 85, RADIO.y + 34, { size: 11, color: '#d6c79a' });
    text(c, 'ANDERSON', RADIO.x + 85, RADIO.y + 46, { size: 9, color: '#d6c79a' });
    // labels
    text(c, 'DO NOT SPLASH', KETTLE.x + 56, 445, { size: 10, color: '#7a1010' });
    text(c, 'KAGURA', BOWLS.x + 40, BOWLS.y + 56, { size: 13, color: '#c9bfa8' });
    text(c, 'NANI MAMI', BOWLS.x + 140, BOWLS.y + 56, { size: 13, color: '#c9bfa8' });
    text(c, 'Fear not.', FRIDGE.x + 60, FRIDGE.y + 192, { size: 20, color: '#3b2a1a', font: HAND });
    text(c, 'Isaiah 41:10', FRIDGE.x + 60, FRIDGE.y + 214, { size: 16, color: '#3b2a1a', font: HAND });
    text(c, 'SURGICAL WING', DOOR.x + DOOR.w / 2, DOOR.y - 56, { size: 15, color: '#222' });
    text(c, 'AUTHORIZED STAFF', DOOR.x + DOOR.w / 2, DOOR.y - 38, { size: 12, color: '#7a1010' });
    // badge reader light
    const unlocked = g.flag('wingOpen');
    c.fillStyle = unlocked ? '#3fdc6a' : '#e03b2f';
    c.beginPath();
    c.arc(DOOR.x - 35, DOOR.y + 185, 5, 0, Math.PI * 2);
    c.fill();
    // vent grate knocked loose after Dio
    if (g.flag('dio')) {
      c.fillStyle = '#050505';
      c.fillRect(VENT.x + 4, VENT.y + 4, VENT.w - 8, VENT.h - 8);
      c.save();
      c.translate(VENT.x + 150, VENT.y + 110);
      c.rotate(0.25);
      c.strokeStyle = '#6a7075';
      c.lineWidth = 4;
      c.strokeRect(0, 0, VENT.w, 22);
      c.restore();
    }
    // steam curl over a fresh shot
    if (ready) {
      c.strokeStyle = 'rgba(240,240,240,0.18)';
      c.lineWidth = 3;
      c.beginPath();
      for (let k = 0; k < 20; k++) {
        const px = ESPRESSO.x + 83 + Math.sin(k / 2 + t / 300) * 6;
        const py = ESPRESSO.y + 100 - k * 3;
        if (k === 0) c.moveTo(px, py);
        else c.lineTo(px, py);
      }
      c.stroke();
    }
    // fluorescent tube
    const lv = lampLevel(t);
    c.fillStyle = lv > 0 ? `rgba(230,235,210,${0.35 + lv})` : '#333';
    c.fillRect(480, 14, 360, 8);
  },

  lights(t, g) {
    const tvFlick = 0.45 + Math.random() * 0.15;
    return [
      { x: 660, y: 20, r: 520, a: lampLevel(t) },
      { x: TV.x + TV.w / 2, y: TV.y + TV.h / 2, r: 300, a: tvFlick },
      { x: ESPRESSO.x + 24, y: ESPRESSO.y + 28, r: 60, a: 0.5 },
      { x: DOOR.x - 35, y: DOOR.y + 185, r: 50, a: 0.5 },
    ];
  },

  hotspots(g) {
    return [
      { ...COUNTER, label: 'Counter', click: () => g.say(['Sticky. Someone spilled sugar here and never cleaned it up. Classic night shift.']) },
      { ...ESPRESSO, label: 'Espresso machine', click: () => clickEspresso(g) },
      { ...RADIO, label: 'Boombox', click: () => clickRadio(g) },
      {
        ...KETTLE,
        label: 'Kettle',
        click: () => g.say([
          'A kettle of hot water, still warm. A note is taped to the side: DO NOT SPLASH.',
          'Underlined three times.',
          'Somebody here has a story about cold water and you kind of want to hear it.',
        ]),
      },
      {
        ...FRIDGE,
        label: 'Fridge',
        click: () => g.say([
          'A sticky note: "WHOEVER KEEPS EATING MY YOGURT, GOD IS WATCHING."',
          'Under a magnet, in neat handwriting: "Fear not, for I am with you." Isaiah 41:10.',
          'It’s the first thing in this building that doesn’t feel cold.',
        ]),
      },
      {
        ...TABLE,
        y: TABLE.y - 40,
        h: TABLE.h + 40,
        label: 'Table',
        click: () => g.say(['A mug sits on the table, still half full. Across the side, in rubber-hose cartoon letters: “boop.”']),
      },
      {
        ...BOWLS,
        label: 'Dog bowls',
        click: () => {
          g.audio.bark();
          g.say([
            'Two little dog bowls. One says KAGURA. The other says NANI MAMI.',
            'Somewhere far down the hall, you hear barking.',
            'They’re not supposed to be here. But you know those barks anywhere.',
          ]);
        },
      },
      { ...TV, label: 'Television', click: () => clickTV(g) },
      { ...VENT, label: g.flag('dio') ? 'Empty vent' : 'Vent', click: () => clickVent(g) },
      { ...DOOR, x: DOOR.x - 60, w: DOOR.w + 60, label: 'Surgical wing door', click: () => clickDoor(g) },
    ];
  },
};

function clickEspresso(g) {
  if (g.flag('espresso')) {
    g.audio.steam();
    g.recharge();
    g.say(['You pull another perfect shot. The warmth goes straight to your chest.', '(Flashlight recharged.)']);
    return;
  }
  g.say(['An old espresso machine, the good kind. The red light blinks like it’s waiting for someone who knows what they’re doing.'], () => {
    g.ui.sequence({
      title: 'PULL A SHOT',
      sub: 'Do it right, in order.',
      steps: ['Grind the beans', 'Tamp the grounds', 'Pull the shot', 'Steam the milk'],
      onFail: (n) => {
        g.audio.sputter();
        if (n === 2) g.ui.toast('That’s not how you make espresso. Start from the beans.');
      },
      onSuccess: () => {
        g.audio.grind();
        setTimeout(() => g.audio.steam(), 900);
        g.set('espresso');
        g.recharge();
        g.say([
          'The machine hisses to life. A perfect shot, thick golden crema on top.',
          'Someone has drawn a tiny heart in the foam. You didn’t do that.',
          'You drink it anyway. You feel brave again.',
          '(Flashlight recharged. You can come back for more.)',
        ]);
      },
    });
  });
}

function clickRadio(g) {
  if (!g.flag('radio')) {
    g.set('radio');
    g.audio.staticBurst();
    g.say([
      'You press play. Static.',
      'Then, for half a second, a few notes of a song you’d know anywhere.',
      'Then static again. The cassette label is handwritten: “WES ANDERSON · Alex Lahey.”',
    ]);
    return;
  }
  if (!g.hasPage(1)) {
    g.say(['You pop the cassette out. There’s something folded into the case.'], () => g.findPage(1, () => {
      g.say(['Okay. Someone is leaving these for you. Someone who knows you very, very well.']);
    }));
    return;
  }
  g.audio.staticBurst(1.2);
  g.say(['Just static now. You’ll hear it properly later. You’re sure of it.']);
}

function clickTV(g) {
  g.audio.boop();
  if (!g.flag('tv')) {
    g.set('tv');
    g.say([
      'An old black-and-white cartoon flickers on the screen. A little flower bounces to music you can’t hear.',
      'Every few seconds, the speaker crackles out one tiny word: “boop.”',
    ]);
  } else {
    g.say(['“boop.”', 'It’s honestly kind of cute. In a deeply unsettling way.']);
  }
}

function clickVent(g) {
  if (g.flag('dio')) {
    g.say(['The vent is empty now. Little scratch marks lead away down the hall.', 'He’ll be back. He always comes back to scratch you.']);
    return;
  }
  if (!g.flag('ventPeek')) {
    g.set('ventPeek');
    g.audio.scratch();
    g.say(['Something is scratching inside the vent. Scratch. Scratch. Then it stops.', 'The grate is loose. You could pull it off.']);
    return;
  }
  g.set('dio');
  g.jumpScare('cat', () => {
    g.give('Staff badge');
    g.say([
      'DIO?!',
      'Of course it’s you.',
      'He glares at you like this was your fault, swats you once for good measure, and drops something at your feet.',
      'Then he stalks off into the dark like he owns the place.',
      'It’s a staff badge. The name on it has been scratched off by tiny, angry claws.',
    ]);
  });
}

function clickDoor(g) {
  if (!g.has('Staff badge')) {
    g.audio.wrong();
    g.say(['The badge reader blinks red. SURGICAL WING: AUTHORIZED STAFF ONLY.', 'You’ll need a badge.']);
    return;
  }
  if (!g.hasPage(1)) {
    g.say(['You hold the badge up to the reader, then stop.', 'You can’t shake the feeling you missed something in this room. Something with a song in it.']);
    return;
  }
  g.set('wingOpen');
  g.audio.unlock();
  g.audio.door();
  g.goTo('wing', 'The reader blinks green.\n\nThe surgical wing is colder than the rest of the hospital, and much, much quieter.\n\nYou hear footsteps up ahead. They stop when you stop.');
}
