// The Night Shift: entry point. Game state, rendering loop, flashlight, input and room switching.
import * as audio from './audio.js';
import * as ui from './ui.js';
import { POEM_PAGES } from './poems.js';
import { VW, VH, inRect, angryCat } from './draw.js';
import scrub from './scenes/scrub.js';
import breakroom from './scenes/breakroom.js';
import recovery from './scenes/recovery.js';
import chapel from './scenes/chapel.js';
import nursery from './scenes/nursery.js';
import orRoom from './scenes/or.js';

const scenes = { scrub, break: breakroom, recovery, chapel, nursery, or: orRoom };
const SAVE_KEY = 'nightshift-save-v1';
const $ = (id) => document.getElementById(id);

const fresh = () => ({ room: 'scrub', items: [], flags: {}, pages: [], battery: 100, minutes: 0 });

function loadSave() {
  try {
    const s = JSON.parse(localStorage.getItem(SAVE_KEY));
    if (s && s.room === 'wing') s.room = 'recovery'; // old placeholder room from the preview build
    return s && scenes[s.room] ? s : null;
  } catch (e) {
    return null;
  }
}
function persist() {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); } catch (e) { /* storage unavailable */ }
}

const params = new URLSearchParams(location.search);
if (params.has('reset')) { try { localStorage.removeItem(SAVE_KEY); } catch (e) { /* ignore */ } }

let state = fresh();
const saved = loadSave();

/* ---------- canvas setup ---------- */
const canvas = $('game');
const ctx = canvas.getContext('2d');
const mask = document.createElement('canvas');
mask.width = VW / 2;
mask.height = VH / 2;
const mctx = mask.getContext('2d');
let dpr = 1;
const view = { scale: 1, ox: 0, oy: 0 };

function resize() {
  dpr = window.devicePixelRatio || 1;
  canvas.width = Math.floor(innerWidth * dpr);
  canvas.height = Math.floor(innerHeight * dpr);
  view.scale = Math.min(innerWidth / VW, innerHeight / VH);
  view.ox = (innerWidth - VW * view.scale) / 2;
  view.oy = (innerHeight - VH * view.scale) / 2;
}
window.addEventListener('resize', resize);
resize();

/* ---------- game API handed to the rooms ---------- */
const mouse = { x: VW / 2, y: VH / 2, inside: false };
let running = false;
let shakeUntil = 0;
let scare = null;
let flickerUntil = 0;
let hover = null;

const game = {
  get state() { return state; },
  mouse,
  audio,
  ui,
  say: (lines, done) => ui.say(lines, done),
  has: (item) => state.items.includes(item),
  give(item) {
    if (state.items.includes(item)) return;
    state.items.push(item);
    audio.pickup();
    ui.toast(`Picked up: ${item}`);
    renderHud();
    persist();
  },
  flag: (k) => !!state.flags[k],
  set(k, v = true) { state.flags[k] = v; persist(); },
  hasPage: (n) => state.pages.includes(n),
  findPage(n, done) {
    if (!state.pages.includes(n)) state.pages.push(n);
    persist();
    renderHud();
    audio.paper();
    ui.poem(POEM_PAGES[n], state.pages.length, POEM_PAGES.length, done);
  },
  recharge() { state.battery = 100; renderHud(); persist(); },
  shake(ms = 300) { shakeUntil = performance.now() + ms; },
  goTo(room, textLine) {
    ui.fade(textLine, () => {
      state.room = room;
      persist();
      renderHud();
    }, () => scenes[room].enter && scenes[room].enter(game));
  },
  jumpScare(kind, done) {
    audio.sting();
    audio.hiss();
    scare = { kind, start: performance.now(), dur: 1500, done };
    shakeUntil = performance.now() + 700;
  },
};

/* ---------- HUD ---------- */
function renderHud() {
  $('room-name').textContent = scenes[state.room].name;
  $('inventory').innerHTML = state.items.map((i) => `<span class="chip">${i}</span>`).join('');
  $('journal-btn').textContent = `Pages ${state.pages.length}/${POEM_PAGES.length}`;
  updateBattery();
  updateClock();
}
function updateBattery() {
  $('battery-fill').style.width = `${state.battery}%`;
  $('battery').classList.toggle('low', state.battery < 35);
}
function updateClock() {
  const total = 4 + Math.floor(state.minutes);
  const h = 3 + Math.floor(total / 60);
  const m = total % 60;
  $('clock').textContent = `${h}:${String(m).padStart(2, '0')} AM`;
}
$('journal-btn').addEventListener('click', () => {
  if (ui.busy()) return;
  audio.paper();
  ui.journal(POEM_PAGES, state.pages);
});

/* ---------- input ---------- */
function toVirtual(e) {
  return { x: (e.clientX - view.ox) / view.scale, y: (e.clientY - view.oy) / view.scale };
}
function findHover() {
  if (!running) return null;
  const spots = scenes[state.room].hotspots(game);
  for (let i = spots.length - 1; i >= 0; i--) if (inRect(mouse, spots[i])) return spots[i];
  return null;
}
canvas.addEventListener('mousemove', (e) => {
  const p = toVirtual(e);
  mouse.x = p.x;
  mouse.y = p.y;
  mouse.inside = true;
});
canvas.addEventListener('mouseleave', () => { mouse.inside = false; });
canvas.addEventListener('click', (e) => {
  if (!running || ui.busy() || scare) return;
  const p = toVirtual(e);
  mouse.x = p.x;
  mouse.y = p.y;
  const h = findHover();
  if (h) {
    audio.click();
    h.click(game);
  }
});

/* ---------- rendering ---------- */
function flashlightRadius(t) {
  const b = Math.max(20, state.battery);
  let r = 120 + 200 * ((b - 20) / 80);
  if (t < flickerUntil) r *= 0.5;
  else if (Math.random() < (state.battery < 35 ? 0.03 : 0.006)) flickerUntil = t + 60 + Math.random() * 120;
  return r;
}

function cutLight(x, y, r, a) {
  if (a <= 0) return;
  const g = mctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, `rgba(0,0,0,${a})`);
  g.addColorStop(0.55, `rgba(0,0,0,${a * 0.8})`);
  g.addColorStop(1, 'rgba(0,0,0,0)');
  mctx.fillStyle = g;
  mctx.fillRect(x - r, y - r, r * 2, r * 2);
}

// Rooms can override: darkness(game) -> 0..1 how dark the room is, flashlight(game) -> false while it's dead.
const flashlightOn = (scene) => mouse.inside && (!scene.flashlight || scene.flashlight(game));

function drawMask(scene, t) {
  const dark = scene.darkness ? scene.darkness(game) : 0.97;
  mctx.setTransform(0.5, 0, 0, 0.5, 0, 0);
  mctx.globalCompositeOperation = 'copy';
  mctx.fillStyle = `rgba(2,2,4,${dark})`;
  mctx.fillRect(0, 0, VW, VH);
  if (dark <= 0) return;
  mctx.globalCompositeOperation = 'destination-out';
  if (flashlightOn(scene)) cutLight(mouse.x, mouse.y, flashlightRadius(t), 1);
  (scene.lights ? scene.lights(t, game) : []).forEach((l) => cutLight(l.x, l.y, l.r, l.a));
  mctx.globalCompositeOperation = 'source-over';
}

function drawCursor() {
  if (!mouse.inside || ui.busy()) return;
  const active = !!hover;
  ctx.strokeStyle = active ? 'rgba(255,236,190,0.9)' : 'rgba(255,255,255,0.35)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(mouse.x, mouse.y, active ? 13 : 8, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = ctx.strokeStyle;
  ctx.beginPath();
  ctx.arc(mouse.x, mouse.y, 2, 0, Math.PI * 2);
  ctx.fill();
  if (active) {
    ctx.font = '22px "Special Elite", "Courier New", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillStyle = 'rgba(0,0,0,0.75)';
    const w = ctx.measureText(hover.label).width + 20;
    ctx.fillRect(mouse.x - w / 2, mouse.y + 22, w, 32);
    ctx.fillStyle = '#efe4cc';
    ctx.fillText(hover.label, mouse.x, mouse.y + 27);
  }
}

function drawScare(t) {
  const k = (t - scare.start) / scare.dur;
  if (k >= 1) {
    const done = scare.done;
    scare = null;
    if (done) done();
    return;
  }
  if (k < 0.05) {
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.fillRect(0, 0, VW, VH);
  }
  const grow = Math.min(1, k / 0.18);
  const s = 0.4 + grow * 1.6;
  const alpha = k > 0.75 ? 1 - (k - 0.75) / 0.25 : 1;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = 'rgba(60,0,0,0.35)';
  ctx.fillRect(0, 0, VW, VH);
  const x = 125 + (800 - 125) * grow;
  const y = 715 + (430 - 715) * grow;
  angryCat(ctx, x + (Math.random() - 0.5) * 10, y + (Math.random() - 0.5) * 10, s);
  ctx.restore();
}

let last = performance.now();
let hudTick = 0;
function frame(t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  if (running) {
    const dt = Math.min(0.1, (t - last) / 1000);
    const scene = scenes[state.room];
    const safe = typeof scene.safe === 'function' ? scene.safe(game) : scene.safe;
    if (!ui.busy() && !scare && !safe) {
      state.battery = Math.max(20, state.battery - dt * 0.3);
      state.minutes += dt / 12;
    }
    hudTick += dt;
    if (hudTick > 0.5) {
      hudTick = 0;
      updateBattery();
      updateClock();
      persist();
    }
    if (scene.update) scene.update(t, game);
    hover = ui.busy() ? null : findHover();

    let sx = 0;
    let sy = 0;
    if (t < shakeUntil) {
      sx = (Math.random() - 0.5) * 26;
      sy = (Math.random() - 0.5) * 26;
    }
    ctx.setTransform(dpr * view.scale, 0, 0, dpr * view.scale, dpr * (view.ox + sx * view.scale), dpr * (view.oy + sy * view.scale));
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, VW, VH);
    ctx.clip();
    scene.draw(ctx, t, game);
    drawMask(scene, t);
    ctx.drawImage(mask, 0, 0, VW, VH);
    if (flashlightOn(scene)) {
      const warm = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 220);
      warm.addColorStop(0, 'rgba(255,220,160,0.07)');
      warm.addColorStop(1, 'rgba(255,220,160,0)');
      ctx.fillStyle = warm;
      ctx.fillRect(mouse.x - 220, mouse.y - 220, 440, 440);
    }
    if (scare) drawScare(t);
    drawCursor();
    ctx.restore();
  }
  last = t;
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

/* ---------- intro ---------- */
const PAGE_LINES = [
  '03:00 AM',
  'PAGE: ST. NANI MAMI HOSPITAL',
  'EMERGENCY CASE · OR 1',
  'SURGICAL TECH NEEDED STAT',
  'NO REPLY NEEDED.',
  'WE KNOW YOU’RE COMING.',
];

function typeLines(lines, el, done) {
  let li = 0;
  let ci = 0;
  el.textContent = '';
  const tick = () => {
    if (li >= lines.length) { done(); return; }
    ci++;
    const shown = lines.slice(0, li).join('\n') + (li ? '\n' : '') + lines[li].slice(0, ci);
    el.textContent = shown;
    if (ci >= lines[li].length) {
      li++;
      ci = 0;
      if (li < lines.length) audio.beep(1, 0.04);
      setTimeout(tick, 550);
    } else {
      setTimeout(tick, 38);
    }
  };
  tick();
}

$('intro').addEventListener('click', () => {
  if ($('intro-stage-1').classList.contains('hidden')) return;
  audio.init();
  audio.beep(3);
  $('intro-stage-1').classList.add('hidden');
  $('intro-stage-2').classList.remove('hidden');
  typeLines(PAGE_LINES, $('page-lines'), () => {
    $('intro-buttons').classList.remove('hidden');
    if (saved) {
      $('btn-continue').classList.remove('hidden');
      $('btn-start').textContent = 'Start over';
    }
  });
});

function begin(useSave) {
  state = useSave && saved ? saved : fresh();
  if (!useSave) {
    const room = params.get('room');
    if (room && scenes[room]) state.room = room;
  }
  persist();
  audio.init();
  audio.startAmbient();
  $('intro').classList.add('gone');
  setTimeout(() => $('intro').classList.add('hidden'), 1600);
  $('hud').classList.remove('hidden');
  renderHud();
  running = true;
  const scene = scenes[state.room];
  setTimeout(() => scene.enter && scene.enter(game), 1200);
}
$('btn-start').addEventListener('click', () => begin(false));
$('btn-continue').addEventListener('click', () => begin(true));
