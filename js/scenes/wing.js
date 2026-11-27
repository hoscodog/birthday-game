// Placeholder for the next part of the game (tattoo room, chapel, nursery, OR).
import { text, cached, rng, stains } from '../draw.js';

const background = cached((c) => {
  const r = rng(99);
  // a long corridor in one-point perspective
  c.fillStyle = '#1d2226';
  c.fillRect(0, 0, 1600, 900);
  const vx = 800;
  const vy = 420;
  c.fillStyle = '#2b3238';
  c.beginPath(); c.moveTo(0, 0); c.lineTo(vx - 80, vy - 60); c.lineTo(vx - 80, vy + 60); c.lineTo(0, 900); c.closePath(); c.fill();
  c.beginPath(); c.moveTo(1600, 0); c.lineTo(vx + 80, vy - 60); c.lineTo(vx + 80, vy + 60); c.lineTo(1600, 900); c.closePath(); c.fill();
  c.fillStyle = '#3a3631';
  c.beginPath(); c.moveTo(0, 900); c.lineTo(vx - 80, vy + 60); c.lineTo(vx + 80, vy + 60); c.lineTo(1600, 900); c.closePath(); c.fill();
  c.fillStyle = '#0a0b0c';
  c.fillRect(vx - 80, vy - 60, 160, 120);
  c.strokeStyle = 'rgba(0,0,0,0.5)';
  c.lineWidth = 3;
  for (let k = 1; k < 8; k++) {
    const f = k / 8;
    c.beginPath();
    c.moveTo(f * (vx - 80), 900 - f * (900 - vy - 60));
    c.lineTo(1600 - f * (1600 - vx - 80), 900 - f * (900 - vy - 60));
    c.stroke();
  }
  stains(c, r, 0, 0, 1600, 900, 20, '10,10,10');
});

export default {
  name: 'Surgical Wing',

  enter(g) {
    if (!g.flag('wingIntro')) {
      g.set('wingIntro');
      g.say([
        'The corridor stretches on further than it should.',
        'Somewhere at the end of it: the chapel, the nursery, and OR 1.',
        '(This is where the preview ends for now. The rest of the hospital is still being built.)',
      ]);
    }
  },

  draw(c, t) {
    background(c);
    text(c, 'TO BE CONTINUED…', 800, 300, { size: 34, color: 'rgba(200,40,40,0.75)' });
  },

  lights() {
    return [{ x: 800, y: 420, r: 160, a: 0.25 }];
  },

  hotspots(g) {
    return [
      {
        x: 700, y: 340, w: 200, h: 160,
        label: 'End of the hall',
        click: () => g.say(['Not yet. The rest of the night shift is still being built.', 'To play again from the beginning, reload the page and choose “Start over.”']),
      },
    ];
  },
};
