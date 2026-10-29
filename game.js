'use strict';
const canvas = document.querySelector('canvas'), ctx = canvas.getContext('2d');
const scoreEl = document.querySelector('#score'), bestEl = document.querySelector('#best');
const overlay = document.querySelector('#overlay'), start = document.querySelector('#start'), pause = document.querySelector('#pause');
let best = 0;
try { best = Number(localStorage.getItem('star-drift-best')) || 0; } catch {}
bestEl.textContent = best;
let state = 'ready', x = 300, items = [], elapsed = 0, score = 0, spawn = 0, last = 0;
const keys = new Set();
const stars = Array.from({length:70}, () => ({x:Math.random()*600,y:Math.random()*640,r:Math.random()*1.5+.4}));
function begin() {
  state = 'playing'; x = 300; items = []; elapsed = 0; score = 0; spawn = 0;
  scoreEl.textContent = '0'; overlay.hidden = true; pause.disabled = false; pause.textContent = 'Pause'; keys.clear();
}
function show(title, message, label) {
  document.querySelector('#title').textContent = title;
  document.querySelector('#message').textContent = message;
  start.textContent = label; overlay.hidden = false;
}
function togglePause() {
  if (state === 'playing') { state = 'paused'; keys.clear(); pause.textContent = 'Resume'; show('Take a breath.', 'Your orbit will be right here.', 'Resume flight ↗'); }
  else if (state === 'paused') { state = 'playing'; overlay.hidden = true; pause.textContent = 'Pause'; }
}
function finish() {
  state = 'over'; pause.disabled = true;
  if (score > best) { best = score; bestEl.textContent = best; try { localStorage.setItem('star-drift-best', String(best)); } catch {} }
  show('One more orbit?', `You collected ${score} points. Ready for another flight?`, 'Fly again ↗');
}
start.addEventListener('click', () => state === 'paused' ? togglePause() : begin());
pause.addEventListener('click', togglePause);
addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (['arrowleft','arrowright','a','d','p'].includes(k)) { e.preventDefault(); keys.add(k); }
  if (k === 'p' && !e.repeat) togglePause();
});
addEventListener('keyup', e => keys.delete(e.key.toLowerCase()));
addEventListener('blur', () => { keys.clear(); if (state === 'playing') togglePause(); });
document.addEventListener('visibilitychange', () => { if (document.hidden && state === 'playing') togglePause(); });
function steer(e) { if (state !== 'playing') return; const r = canvas.getBoundingClientRect(); x = Math.max(20,Math.min(580,(e.clientX-r.left)*600/r.width)); }
canvas.addEventListener('pointerdown', e => { canvas.setPointerCapture(e.pointerId); steer(e); });
canvas.addEventListener('pointermove', e => { if (e.buttons) steer(e); });
function update(dt) {
  if (state !== 'playing') return;
  elapsed += dt; spawn -= dt;
  x += ((keys.has('arrowright') || keys.has('d') ? 1 : 0) - (keys.has('arrowleft') || keys.has('a') ? 1 : 0))*380*dt;
  x = Math.max(20,Math.min(580,x));
  if (spawn <= 0) { items.push({x:24+Math.random()*552,y:-24,star:Math.random()<.35}); spawn = Math.max(.23,.65-elapsed*.004); }
  for (const item of items) {
    item.y += (160+Math.min(200,elapsed*3))*dt;
    if (Math.hypot(item.x-x,item.y-565) < (item.star ? 28 : 30)) {
      if (!item.star) { finish(); return; }
      score += 10; scoreEl.textContent = score; item.y = 700;
    }
  }
  items = items.filter(item => item.y < 680);
}
function draw() {
  ctx.clearRect(0,0,600,640);
  for (const s of stars) { ctx.fillStyle = '#a5c7ec66'; ctx.beginPath(); ctx.arc(s.x,(s.y+elapsed*15)%640,s.r,0,Math.PI*2); ctx.fill(); }
  for (const item of items) {
    ctx.save(); ctx.translate(item.x,item.y); ctx.rotate(elapsed*.8); ctx.fillStyle = item.star ? '#ffe29a' : '#f07d9c'; ctx.shadowColor = ctx.fillStyle; ctx.shadowBlur = 15; ctx.beginPath();
    if(item.star) { for(let i=0;i<10;i++){const a=i*Math.PI/5-Math.PI/2,r=i%2?6:14; ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r);} }
    else { for(let i=0;i<7;i++){const a=i*Math.PI*2/7,r=i%2?17:21; ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r);} }
    ctx.closePath(); ctx.fill(); ctx.restore();
  }
  ctx.save(); ctx.translate(x,565); ctx.shadowColor='#8af1d5'; ctx.shadowBlur=20; ctx.fillStyle='#8af1d5'; ctx.beginPath(); ctx.moveTo(0,-21); ctx.lineTo(16,15); ctx.lineTo(0,8); ctx.lineTo(-16,15); ctx.closePath(); ctx.fill(); ctx.fillStyle='#defbf3'; ctx.fillRect(-3,17,6,8+Math.sin(elapsed*30)*4); ctx.restore();
}
function frame(t) { const dt = Math.min((t-last)/1000,.04); last=t; update(dt); draw(); requestAnimationFrame(frame); }
requestAnimationFrame(frame);
