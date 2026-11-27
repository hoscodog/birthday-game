// DOM overlays: dialog box, modals (keypad, sequence puzzle, poem pages, journal), toast, fades.
import * as audio from './audio.js';

const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

let queue = [];
let onDone = null;
let typing = null;
let modalOpen = false;
let fading = false;
let keyHandler = null;

export function busy() {
  return !$('dialog').classList.contains('hidden') || modalOpen || fading;
}

/* ---------- Dialog ---------- */
export function say(lines, done) {
  queue = (Array.isArray(lines) ? lines : [lines]).slice();
  onDone = done || null;
  $('dialog').classList.remove('hidden');
  next();
}

function next() {
  if (!queue.length) {
    $('dialog').classList.add('hidden');
    const d = onDone;
    onDone = null;
    if (d) d();
    return;
  }
  type(queue.shift());
}

function type(text) {
  const el = $('dialog-text');
  el.textContent = '';
  el.dataset.full = text;
  let i = 0;
  clearInterval(typing);
  typing = setInterval(() => {
    i++;
    el.textContent = text.slice(0, i);
    if (i >= text.length) {
      clearInterval(typing);
      typing = null;
    }
  }, 22);
}

function advance() {
  if (typing) {
    clearInterval(typing);
    typing = null;
    $('dialog-text').textContent = $('dialog-text').dataset.full;
  } else {
    next();
  }
}

$('dialog').addEventListener('click', advance);
window.addEventListener('keydown', (e) => {
  if (keyHandler) {
    keyHandler(e);
    return;
  }
  if (!$('dialog').classList.contains('hidden') && (e.key === ' ' || e.key === 'Enter')) {
    e.preventDefault();
    advance();
  }
});

/* ---------- Modal plumbing ---------- */
function open(html) {
  modalOpen = true;
  $('modal-card').innerHTML = html;
  $('modal').classList.remove('hidden');
  return $('modal-card');
}

export function close() {
  modalOpen = false;
  keyHandler = null;
  $('modal').classList.add('hidden');
  $('modal-card').innerHTML = '';
}

function shakeCard() {
  const c = $('modal-card');
  c.classList.remove('shake');
  void c.offsetWidth;
  c.classList.add('shake');
}

/* ---------- Keypad ---------- */
export function keypad({ title, sub = '', code, onSuccess, onFail, onCancel }) {
  const len = code.length;
  const card = open(`
    <h2>${esc(title)}</h2>
    ${sub ? `<p class="sub">${esc(sub)}</p>` : ''}
    <div class="kp-display" id="kp-d"></div>
    <div class="kp-grid">
      ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 'C', 0, 'OK'].map((k) => `<button type="button" data-k="${k}">${k}</button>`).join('')}
    </div>
    <button type="button" class="ghost" id="kp-x">Step back</button>`);
  let entry = '';
  const show = () => { $('kp-d').textContent = entry.padEnd(len, '_').split('').join(' '); };
  show();
  const press = (k) => {
    audio.click();
    if (k === 'C') entry = '';
    else if (k === 'OK') {
      if (entry === code) {
        close();
        onSuccess && onSuccess();
        return;
      }
      audio.wrong();
      shakeCard();
      entry = '';
      onFail && onFail();
    } else if (entry.length < len) entry += k;
    show();
  };
  card.querySelectorAll('[data-k]').forEach((b) => { b.onclick = () => press(b.dataset.k); });
  $('kp-x').onclick = () => { close(); onCancel && onCancel(); };
  keyHandler = (e) => {
    if (/^[0-9]$/.test(e.key)) press(e.key);
    else if (e.key === 'Enter') press('OK');
    else if (e.key === 'Backspace') { entry = entry.slice(0, -1); show(); }
    else if (e.key === 'Escape') { close(); onCancel && onCancel(); }
  };
}

/* ---------- Ordered-steps puzzle ---------- */
export function sequence({ title, sub = '', steps, onSuccess, onFail, onCancel }) {
  const shuffled = steps.map((s, i) => ({ s, i })).sort(() => Math.random() - 0.5);
  const card = open(`
    <h2>${esc(title)}</h2>
    ${sub ? `<p class="sub">${esc(sub)}</p>` : ''}
    <div class="seq-progress" id="seq-p"></div>
    <div class="seq-buttons">
      ${shuffled.map(({ s, i }) => `<button type="button" data-i="${i}">${esc(s)}</button>`).join('')}
    </div>
    <button type="button" class="ghost" id="seq-x">Step back</button>`);
  let pos = 0;
  let fails = 0;
  const btns = card.querySelectorAll('[data-i]');
  const reset = () => {
    pos = 0;
    $('seq-p').innerHTML = '';
    btns.forEach((b) => { b.disabled = false; });
  };
  btns.forEach((b) => {
    b.onclick = () => {
      const i = Number(b.dataset.i);
      if (i === pos) {
        audio.click();
        b.disabled = true;
        $('seq-p').insertAdjacentHTML('beforeend', `<span>${pos + 1}. ${esc(steps[i])}</span>`);
        pos++;
        if (pos === steps.length) setTimeout(() => { close(); onSuccess && onSuccess(); }, 450);
      } else {
        fails++;
        shakeCard();
        // onFail can return true to close the puzzle instead of letting the player retry right away.
        if (onFail && onFail(fails) === true) { close(); return; }
        reset();
      }
    };
  });
  $('seq-x').onclick = () => { close(); onCancel && onCancel(); };
  keyHandler = (e) => { if (e.key === 'Escape') { close(); onCancel && onCancel(); } };
}

/* ---------- Poem pages ---------- */
function paperHtml(page) {
  return `<div class="paper"><h3>${esc(page.title)}</h3>${page.stanzas
    .map((st) => `<p>${st.map(esc).join('<br>')}</p>`)
    .join('')}</div>`;
}

export function poem(page, found, total, done) {
  open(`${paperHtml(page)}
    <div class="page-count">Page ${found} of ${total} found</div>
    <button type="button" id="pm-ok">Tuck it away</button>`);
  const finish = () => { close(); done && done(); };
  $('pm-ok').onclick = finish;
  keyHandler = (e) => { if (e.key === 'Escape' || e.key === 'Enter') finish(); };
}

export function journal(pages, foundIdx) {
  const list = () => {
    open(`<h2>Torn pages</h2>
      <p class="sub">Pages you have found tonight.</p>
      <div class="journal-list">
        ${pages.map((p, i) => (foundIdx.includes(i)
          ? `<button type="button" data-p="${i}">${esc(p.title)}</button>`
          : `<button type="button" class="missing" disabled>??? (not found yet)</button>`)).join('')}
      </div>
      <button type="button" class="ghost" id="jr-x">Close</button>`);
    $('modal-card').querySelectorAll('[data-p]').forEach((b) => {
      b.onclick = () => {
        audio.paper();
        open(`${paperHtml(pages[Number(b.dataset.p)])}<button type="button" id="jr-back">Back</button>`);
        $('jr-back').onclick = list;
        keyHandler = (e) => { if (e.key === 'Escape') list(); };
      };
    });
    $('jr-x').onclick = close;
    keyHandler = (e) => { if (e.key === 'Escape') close(); };
  };
  list();
}

/* ---------- Free-form modal (used by end screens) ---------- */
export function custom(html, wire) {
  const card = open(html);
  if (wire) wire(card, close);
}

/* ---------- Toast ---------- */
let toastTimer = null;
export function toast(text) {
  const t = $('toast');
  t.textContent = text;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2400);
}

/* ---------- Fade to black between rooms ---------- */
export function fade(text, mid, done) {
  fading = true;
  const f = $('fade');
  $('fade-text').textContent = text || '';
  f.classList.add('on');
  setTimeout(() => {
    if (mid) mid();
    setTimeout(() => {
      f.classList.remove('on');
      setTimeout(() => {
        fading = false;
        if (done) done();
      }, 1200);
    }, text ? 3600 : 300);
  }, 1300);
}
