// Entry point: sets up the canvas, input, and game loop.
// The current scene is a placeholder dark room with a flashlight.

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const overlay = document.getElementById('overlay');

const state = {
  started: false,
  mouse: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
};

function resize() {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
window.addEventListener('resize', resize);
resize();

function setPointer(x, y) {
  state.mouse.x = x;
  state.mouse.y = y;
}
window.addEventListener('mousemove', (e) => setPointer(e.clientX, e.clientY));
window.addEventListener('touchmove', (e) => {
  const t = e.touches[0];
  setPointer(t.clientX, t.clientY);
}, { passive: true });

overlay.addEventListener('click', () => {
  state.started = true;
  overlay.classList.add('hidden');
});

function drawRoom(w, h) {
  // Placeholder room: floor, back wall, and a door.
  ctx.fillStyle = '#2a2420';
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#1a1512';
  ctx.fillRect(0, h * 0.7, w, h * 0.3);
  ctx.fillStyle = '#3b2a1e';
  ctx.fillRect(w * 0.45, h * 0.3, w * 0.1, h * 0.4);
  ctx.fillStyle = '#c9a227';
  ctx.beginPath();
  ctx.arc(w * 0.53, h * 0.5, 4, 0, Math.PI * 2);
  ctx.fill();
}

function drawFlashlight(w, h) {
  const { x, y } = state.mouse;
  const flicker = Math.random() < 0.02 ? 0.6 : 1;
  const radius = Math.min(w, h) * 0.22 * flicker;
  const g = ctx.createRadialGradient(x, y, radius * 0.2, x, y, radius);
  g.addColorStop(0, 'rgba(0,0,0,0)');
  g.addColorStop(1, 'rgba(0,0,0,0.97)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
}

function loop() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  ctx.clearRect(0, 0, w, h);
  if (state.started) {
    drawRoom(w, h);
    drawFlashlight(w, h);
  }
  requestAnimationFrame(loop);
}
loop();
