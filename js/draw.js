// Small canvas drawing helpers shared by the rooms. Everything is drawn in a 1600x900 virtual space.

export const VW = 1600;
export const VH = 900;

export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function rr(c, x, y, w, h, r) {
  c.beginPath();
  c.moveTo(x + r, y);
  c.arcTo(x + w, y, x + w, y + h, r);
  c.arcTo(x + w, y + h, x, y + h, r);
  c.arcTo(x, y + h, x, y, r);
  c.arcTo(x, y, x + w, y, r);
  c.closePath();
}

export function tiles(c, x, y, w, h, s, base, grout, rand) {
  c.fillStyle = base;
  c.fillRect(x, y, w, h);
  if (rand) {
    for (let i = x; i < x + w; i += s) {
      for (let j = y; j < y + h; j += s) {
        const v = rand();
        if (v < 0.3) {
          c.fillStyle = `rgba(0,0,0,${0.03 + v * 0.2})`;
          c.fillRect(i, j, s, s);
        } else if (v > 0.93) {
          c.fillStyle = 'rgba(255,255,255,0.05)';
          c.fillRect(i, j, s, s);
        }
      }
    }
  }
  c.strokeStyle = grout;
  c.lineWidth = 2;
  c.beginPath();
  for (let i = x; i <= x + w; i += s) { c.moveTo(i + 0.5, y); c.lineTo(i + 0.5, y + h); }
  for (let j = y; j <= y + h; j += s) { c.moveTo(x, j + 0.5); c.lineTo(x + w, j + 0.5); }
  c.stroke();
}

export function stains(c, rand, x, y, w, h, n, rgb) {
  for (let k = 0; k < n; k++) {
    const cx = x + rand() * w;
    const cy = y + rand() * h;
    const r = 20 + rand() * 90;
    const g = c.createRadialGradient(cx, cy, 0, cx, cy, r);
    g.addColorStop(0, `rgba(${rgb},${0.08 + rand() * 0.14})`);
    g.addColorStop(1, `rgba(${rgb},0)`);
    c.fillStyle = g;
    c.fillRect(cx - r, cy - r, r * 2, r * 2);
  }
}

export function drips(c, rand, x, y, w, n, rgb) {
  for (let k = 0; k < n; k++) {
    const dx = x + rand() * w;
    const len = 30 + rand() * 140;
    const g = c.createLinearGradient(dx, y, dx, y + len);
    g.addColorStop(0, `rgba(${rgb},0.25)`);
    g.addColorStop(1, `rgba(${rgb},0)`);
    c.fillStyle = g;
    c.fillRect(dx, y, 2 + rand() * 4, len);
  }
}

export function text(c, s, x, y, { size = 24, color = '#ddd', align = 'center', font = '"Special Elite", "Courier New", monospace', base = 'middle', rot = 0 } = {}) {
  c.save();
  c.translate(x, y);
  c.rotate(rot);
  c.font = `${size}px ${font}`;
  c.fillStyle = color;
  c.textAlign = align;
  c.textBaseline = base;
  c.fillText(s, 0, 0);
  c.restore();
}

export const HAND = '"Caveat", "Segoe Print", cursive';

// Draw a static layer once, then reuse it every frame.
export function cached(fn) {
  let cv = null;
  return (c) => {
    if (!cv) {
      cv = document.createElement('canvas');
      cv.width = VW;
      cv.height = VH;
      fn(cv.getContext('2d'));
    }
    c.drawImage(cv, 0, 0);
  };
}

export function inRect(p, r) {
  return p.x >= r.x && p.x <= r.x + r.w && p.y >= r.y && p.y <= r.y + r.h;
}

// A little crocheted jellyfish: stitched dome, button eyes, curly tentacles.
export function jellyfish(c, x, y, s, t) {
  c.save();
  c.translate(x, y);
  c.scale(s, s);
  const sway = Math.sin(t / 900) * 4;
  // tentacles
  const cols = ['#e6a3c9', '#c9a6ef', '#f0c2dc', '#b993e6', '#e6a3c9', '#c9a6ef'];
  for (let i = 0; i < 6; i++) {
    const tx = -34 + i * 13.6;
    c.strokeStyle = cols[i];
    c.lineWidth = 5;
    c.lineCap = 'round';
    c.beginPath();
    c.moveTo(tx, 4);
    for (let k = 1; k <= 10; k++) {
      c.lineTo(tx + Math.sin(k * 1.3 + i + t / 600) * 6 + sway * (k / 10), 4 + k * 7);
    }
    c.stroke();
  }
  // dome
  c.fillStyle = '#b48cdc';
  c.beginPath();
  c.ellipse(0, 4, 42, 40, 0, Math.PI, 0);
  c.closePath();
  c.fill();
  // stitch rows
  c.strokeStyle = 'rgba(80,40,120,0.45)';
  c.lineWidth = 1.5;
  for (let row = 0; row < 5; row++) {
    const ry = 2 - row * 8;
    const half = Math.sqrt(Math.max(0, 1 - ((ry - 4) / 40) ** 2)) * 40;
    for (let sx = -half + 4; sx < half - 2; sx += 7) {
      c.beginPath();
      c.ellipse(sx, ry, 3, 2.5, 0, 0, Math.PI * 2);
      c.stroke();
    }
  }
  // brim
  c.fillStyle = '#9d74cc';
  rr(c, -44, 0, 88, 9, 4);
  c.fill();
  // face
  c.fillStyle = '#1a1020';
  c.beginPath(); c.arc(-13, -12, 4, 0, Math.PI * 2); c.fill();
  c.beginPath(); c.arc(13, -12, 4, 0, Math.PI * 2); c.fill();
  c.fillStyle = 'rgba(255,140,180,0.6)';
  c.beginPath(); c.ellipse(-22, -5, 5, 3, 0, 0, Math.PI * 2); c.fill();
  c.beginPath(); c.ellipse(22, -5, 5, 3, 0, 0, Math.PI * 2); c.fill();
  c.strokeStyle = '#1a1020';
  c.lineWidth = 2;
  c.beginPath(); c.arc(0, -8, 5, 0.2 * Math.PI, 0.8 * Math.PI); c.stroke();
  c.restore();
}

// Dio, mid-pounce: grey and white cat, ears back, glowing eyes, mouth open.
export function angryCat(c, x, y, s) {
  c.save();
  c.translate(x, y);
  c.scale(s, s);
  c.fillStyle = '#7d838a';
  // body + legs
  c.beginPath(); c.ellipse(0, 70, 120, 70, 0, 0, Math.PI * 2); c.fill();
  c.lineWidth = 26; c.lineCap = 'round'; c.strokeStyle = '#7d838a';
  [[-90, 90, -150, 170], [90, 90, 150, 170], [-50, 110, -70, 190], [50, 110, 70, 190]].forEach(([a, b, cx, d]) => {
    c.beginPath(); c.moveTo(a, b); c.lineTo(cx, d); c.stroke();
  });
  // white chest and white paws
  c.fillStyle = '#eeeeea';
  c.beginPath(); c.ellipse(0, 80, 60, 52, 0, 0, Math.PI * 2); c.fill();
  [[-150, 170], [150, 170], [-70, 190], [70, 190]].forEach(([px, py]) => { c.beginPath(); c.arc(px, py, 15, 0, Math.PI * 2); c.fill(); });
  // claws
  c.strokeStyle = '#e8e2d6'; c.lineWidth = 3;
  [[-150, 170], [150, 170]].forEach(([px, py]) => {
    for (let k = -1; k <= 1; k++) {
      c.beginPath(); c.moveTo(px + k * 8, py); c.lineTo(px + k * 11, py + 16); c.stroke();
    }
  });
  // tail, puffed
  c.strokeStyle = '#7d838a'; c.lineWidth = 30;
  c.beginPath(); c.moveTo(100, 40); c.quadraticCurveTo(200, -40, 160, -120); c.stroke();
  // head
  c.fillStyle = '#7d838a';
  c.beginPath(); c.arc(0, -40, 85, 0, Math.PI * 2); c.fill();
  // ears pinned back
  c.beginPath(); c.moveTo(-80, -60); c.lineTo(-140, -110); c.lineTo(-40, -110); c.closePath(); c.fill();
  c.beginPath(); c.moveTo(80, -60); c.lineTo(140, -110); c.lineTo(40, -110); c.closePath(); c.fill();
  // darker tabby stripes on the forehead, white muzzle and inner ears
  c.strokeStyle = '#5a6066'; c.lineWidth = 7; c.lineCap = 'round';
  [-22, 0, 22].forEach((sx) => { c.beginPath(); c.moveTo(sx, -120); c.lineTo(sx * 0.8, -92); c.stroke(); });
  c.fillStyle = '#eeeeea';
  c.beginPath(); c.ellipse(0, -2, 58, 46, 0, 0, Math.PI * 2); c.fill();
  c.fillStyle = '#d99aa0';
  c.beginPath(); c.moveTo(-82, -70); c.lineTo(-122, -104); c.lineTo(-56, -104); c.closePath(); c.fill();
  c.beginPath(); c.moveTo(82, -70); c.lineTo(122, -104); c.lineTo(56, -104); c.closePath(); c.fill();
  // eyes
  const eye = (ex) => {
    const g = c.createRadialGradient(ex, -55, 2, ex, -55, 30);
    g.addColorStop(0, '#fbff9a'); g.addColorStop(0.6, '#c8e83a'); g.addColorStop(1, 'rgba(200,232,58,0)');
    c.fillStyle = g;
    c.beginPath(); c.arc(ex, -55, 30, 0, Math.PI * 2); c.fill();
    c.fillStyle = '#d7f04a';
    c.beginPath(); c.ellipse(ex, -55, 17, 13, ex < 0 ? 0.35 : -0.35, 0, Math.PI * 2); c.fill();
    c.fillStyle = '#000';
    c.beginPath(); c.ellipse(ex, -55, 3, 12, 0, 0, Math.PI * 2); c.fill();
  };
  eye(-34); eye(34);
  // mouth
  c.fillStyle = '#7a1424';
  c.beginPath(); c.ellipse(0, 0, 34, 26, 0, 0, Math.PI * 2); c.fill();
  c.fillStyle = '#f4efe4';
  [[-20, -16, -14, 6, -8, -16], [20, -16, 14, 6, 8, -16], [-16, 18, -11, 4, -6, 18], [16, 18, 11, 4, 6, 18]].forEach(([a, b, cx, d, e, f]) => {
    c.beginPath(); c.moveTo(a, b); c.lineTo(cx, d); c.lineTo(e, f); c.closePath(); c.fill();
  });
  // whiskers
  c.strokeStyle = 'rgba(60,60,60,0.7)'; c.lineWidth = 2;
  [-1, 1].forEach((side) => {
    for (let k = -1; k <= 1; k++) {
      c.beginPath(); c.moveTo(side * 40, -14 + k * 8); c.lineTo(side * 130, -24 + k * 18); c.stroke();
    }
  });
  c.restore();
}

// A chihuahua sitting and facing you: apple head, huge upright ears, big eyes, skinny legs.
// Colors are options so Kagura (tan) and Kana (white) look like themselves.
export function dog(c, x, y, s, t, { coat = '#d9a865', shade = '#b9843f', belly = '#f0d9b0', hat = null, wag = 1 } = {}) {
  c.save();
  c.translate(x, y);
  c.scale(s, s);
  // thin tail, curled up and wagging
  const tw = Math.sin(t / (110 / wag)) * 0.6;
  c.strokeStyle = coat;
  c.lineWidth = 6;
  c.lineCap = 'round';
  c.beginPath();
  c.moveTo(24, 58);
  c.quadraticCurveTo(52 + tw * 16, 40, 46 + tw * 24, 12);
  c.stroke();
  // little body
  c.fillStyle = shade;
  c.beginPath(); c.ellipse(0, 52, 32, 44, 0, 0, Math.PI * 2); c.fill();
  c.fillStyle = coat;
  c.beginPath(); c.ellipse(-2, 50, 29, 42, 0, 0, Math.PI * 2); c.fill();
  c.fillStyle = belly;
  c.beginPath(); c.ellipse(0, 58, 15, 30, 0, 0, Math.PI * 2); c.fill();
  // skinny front legs + tiny paws
  c.fillStyle = coat;
  rr(c, -17, 62, 10, 38, 5); c.fill();
  rr(c, 7, 62, 10, 38, 5); c.fill();
  c.fillStyle = belly;
  c.beginPath(); c.ellipse(-12, 99, 8, 5, 0, 0, Math.PI * 2); c.ellipse(12, 99, 8, 5, 0, 0, Math.PI * 2); c.fill();
  // big upright ears, angled out
  const ear = (side) => {
    c.save();
    c.scale(side, 1);
    c.fillStyle = shade;
    c.beginPath(); c.moveTo(12, -44); c.lineTo(58, -92); c.lineTo(36, -24); c.closePath(); c.fill();
    c.fillStyle = '#e8a7a7';
    c.beginPath(); c.moveTo(19, -42); c.lineTo(52, -80); c.lineTo(34, -30); c.closePath(); c.fill();
    c.restore();
  };
  ear(-1);
  ear(1);
  // apple-dome head
  c.fillStyle = coat;
  c.beginPath(); c.ellipse(0, -26, 36, 33, 0, 0, Math.PI * 2); c.fill();
  c.fillStyle = 'rgba(0,0,0,0.06)';
  c.beginPath(); c.ellipse(0, -44, 26, 12, 0, 0, Math.PI * 2); c.fill();
  // short snout
  c.fillStyle = belly;
  c.beginPath(); c.ellipse(0, -10, 15, 11, 0, 0, Math.PI * 2); c.fill();
  c.fillStyle = '#1a1210';
  c.beginPath(); c.ellipse(0, -15, 5, 3.6, 0, 0, Math.PI * 2); c.fill();
  // big shiny eyes
  [-15, 15].forEach((ex) => {
    c.fillStyle = '#1a1210';
    c.beginPath(); c.arc(ex, -30, 8, 0, Math.PI * 2); c.fill();
    c.fillStyle = '#fff';
    c.beginPath(); c.arc(ex + 3, -33, 2.6, 0, Math.PI * 2); c.arc(ex - 2, -27, 1.2, 0, Math.PI * 2); c.fill();
  });
  // tiny tongue
  c.fillStyle = '#e0707f';
  rr(c, -4, -5, 8, 8 + Math.abs(Math.sin(t / 180)) * 3, 4); c.fill();
  if (hat) partyHat(c, 2, -56, 0.85, hat[0], hat[1]);
  c.restore();
}

export function partyHat(c, x, y, s, a = '#e04a8a', b = '#f3d36b') {
  c.save();
  c.translate(x, y);
  c.scale(s, s);
  c.rotate(0.15);
  c.beginPath(); c.moveTo(-20, 0); c.lineTo(0, -52); c.lineTo(20, 0); c.closePath();
  c.fillStyle = a;
  c.fill();
  c.save();
  c.clip();
  c.strokeStyle = b;
  c.lineWidth = 6;
  for (let k = -60; k < 40; k += 16) { c.beginPath(); c.moveTo(-30, k + 30); c.lineTo(30, k); c.stroke(); }
  c.restore();
  c.fillStyle = b;
  c.beginPath(); c.arc(0, -54, 7, 0, Math.PI * 2); c.fill();
  c.restore();
}

// A church candle. h is the wax height. Returns nothing; flame flickers with t.
export function candle(c, x, y, h, lit, t, seed = 0) {
  c.fillStyle = '#e9e1cc';
  c.fillRect(x - 9, y - h, 18, h);
  c.fillStyle = 'rgba(0,0,0,0.18)';
  c.fillRect(x + 3, y - h, 6, h);
  c.strokeStyle = '#222';
  c.lineWidth = 2;
  c.beginPath(); c.moveTo(x, y - h); c.lineTo(x, y - h - 8); c.stroke();
  if (!lit) return;
  const f = 1 + Math.sin(t / 70 + seed * 3) * 0.08 + Math.sin(t / 23 + seed) * 0.05;
  const fx = x + Math.sin(t / 130 + seed) * 1.5;
  const glow = c.createRadialGradient(fx, y - h - 14, 0, fx, y - h - 14, 50);
  glow.addColorStop(0, 'rgba(255,200,110,0.35)');
  glow.addColorStop(1, 'rgba(255,200,110,0)');
  c.fillStyle = glow;
  c.fillRect(fx - 50, y - h - 64, 100, 100);
  c.fillStyle = '#ffcf6a';
  c.beginPath(); c.ellipse(fx, y - h - 14, 6 * f, 13 * f, 0, 0, Math.PI * 2); c.fill();
  c.fillStyle = '#fff4d6';
  c.beginPath(); c.ellipse(fx, y - h - 11, 2.5, 6, 0, 0, Math.PI * 2); c.fill();
}

// A pale hand reaching out of the dark, index finger out. reach 0..1 slides it in from below.
export function paleHand(c, x, y, s, t, reach = 1) {
  c.save();
  c.translate(x + Math.sin(t / 400) * 3, y + (1 - reach) * 420 + Math.sin(t / 300) * 2);
  c.scale(s, s);
  c.rotate(-0.25);
  const skin = '#d8d3c9';
  const shade = '#a8a196';
  // forearm, fading into the dark
  const arm = c.createLinearGradient(0, 60, 0, 520);
  arm.addColorStop(0, skin);
  arm.addColorStop(1, 'rgba(216,211,201,0)');
  c.fillStyle = arm;
  c.beginPath();
  c.moveTo(-34, 50); c.lineTo(-48, 520); c.lineTo(52, 520); c.lineTo(36, 50); c.closePath();
  c.fill();
  // palm
  c.fillStyle = skin;
  rr(c, -42, -40, 84, 100, 30);
  c.fill();
  // curled fingers
  c.fillStyle = shade;
  [[-2, -30], [18, -26], [34, -16]].forEach(([fx, fy]) => { rr(c, fx - 4, fy - 14, 22, 30, 10); c.fill(); });
  // index finger, out
  c.fillStyle = skin;
  rr(c, -36, -128, 24, 104, 12);
  c.fill();
  c.strokeStyle = shade;
  c.lineWidth = 2;
  [-96, -66].forEach((ky) => { c.beginPath(); c.moveTo(-32, ky); c.lineTo(-16, ky); c.stroke(); });
  // thumb
  c.fillStyle = skin;
  c.save();
  c.translate(-40, 10);
  c.rotate(-0.9);
  rr(c, -12, -46, 24, 56, 12);
  c.fill();
  c.restore();
  c.restore();
}
