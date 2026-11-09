'use strict';
// prevent browser from restoring scroll position on reload
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
/* =========================================================
   Aman & Raksha — wedding invitation
   EDIT THE VALUES BELOW to update the site (no other code changes needed)
   ========================================================= */
const CONFIG = {
  weddingTime:      'To be announced',
  weddingAddress:   'Kurson, Nadiyami, Bihar',
  receptionTime:    'To be announced',
  receptionAddress: 'PJ Farm and Party Plot, Samarvarni, Silvassa, Dadra and Nagar Haveli and Daman and Diu 396230',
  // Google Maps links for the two GET DIRECTIONS buttons (paste your own share links here)
  mapsWedding:   'https://www.google.com/maps/search/?api=1&query=Kurson%2C+Nadiyami%2C+Bihar',
  mapsReception: 'https://maps.app.goo.gl/e9CffvL5Bjyxxt7p7',
  parking: 'Parking and location details will be shared here soon.',
  contactName:  'The family',
  contactPhone: '+91 9725932585',           // e.g. '+91 98765 43210' — shows a call link in "Need help?"
  countdownTarget: '2026-11-25T00:00:00+05:30',   // 25 Nov 2026, India Standard Time
  calYear: 2026, calMonth: 10,                    // November (0-based month)
  calHighlight: 25, calEventDays: [23, 24]
};

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- fill configurable content ---------- */
$$('[data-cfg]').forEach(el => { el.textContent = CONFIG[el.dataset.cfg] || ''; });
$$('[data-map]').forEach(a => { a.href = CONFIG[a.dataset.map] || '#'; });
(() => {
  const c = $('#contact');
  if (CONFIG.contactPhone) {
    const a = document.createElement('a');
    a.href = 'tel:' + CONFIG.contactPhone.replace(/[^\d+]/g, '');
    a.textContent = CONFIG.contactName + ' · ' + CONFIG.contactPhone;
    c.appendChild(a);
  } else c.remove();
})();

/* ---------- split text: characters + words ---------- */
$$('[data-chars]').forEach(el => {
  const t = el.textContent.trim(), words = t.split(' ');
  el.setAttribute('aria-label', t); el.textContent = '';
  let i = 0;
  words.forEach((w, wi) => {
    const ws = document.createElement('span'); ws.className = 'w'; ws.setAttribute('aria-hidden', 'true');
    [...w].forEach(c => { const s = document.createElement('span'); s.className = 'ch'; s.style.setProperty('--i', i++); s.textContent = c; ws.appendChild(s); });
    el.appendChild(ws);
    if (wi < words.length - 1) el.appendChild(document.createTextNode(' '));
  });
});
$$('[data-words]').forEach(el => {
  const t = el.textContent.trim(); el.setAttribute('aria-label', t); el.textContent = '';
  t.split(' ').forEach((w, i, a) => {
    const o = document.createElement('span'); o.className = 'wd'; o.setAttribute('aria-hidden', 'true');
    const n = document.createElement('i'); n.style.setProperty('--i', i); n.textContent = w; o.appendChild(n);
    el.appendChild(o); if (i < a.length - 1) el.appendChild(document.createTextNode(' '));
  });
});

/* ---------- reveal observer (starts after the welcome screen) ---------- */
function startReveals() {
  const sel = '.rv,.rv-s,.rv-ph,.names,.rh,.arch-w,.c-ph,.sec,.wish,.dv';
  const targets = $$(sel).filter(el => !el.closest('.intro'));
  if (reduce || !('IntersectionObserver' in window)) { targets.forEach(el => el.classList.add('in')); return; }
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: .08, rootMargin: '0px 0px -4% 0px' });
  targets.forEach(el => io.observe(el));
}

/* ---------- welcome screen ---------- */
const intro = $('#intro');
$('#enter').addEventListener('click', () => {
  // instantly snap to top before anything renders
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  history.scrollRestoration = 'manual';

  intro.classList.add('out');
  document.body.classList.remove('locked');
  document.body.classList.add('ready');

  // delay startReveals so the IntersectionObserver fires after main is visible
  setTimeout(() => {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    startReveals();
  }, 120);

  setTimeout(() => intro.remove(), 1500);
});

/* ---------- navigation ---------- */
const nav = $('#nav'), burger = $('#burger'), menu = $('#menu'), prog = $('#prog');
if (burger) burger.addEventListener('click', () => {
  const o = burger.getAttribute('aria-expanded') !== 'true';
  burger.setAttribute('aria-expanded', o); burger.setAttribute('aria-label', o ? 'Close menu' : 'Open menu');
  menu && menu.classList.toggle('open', o);
});
if (menu) $$('a', menu).forEach(a => a.addEventListener('click', () => {
  burger && burger.setAttribute('aria-expanded', 'false'); menu.classList.remove('open');
}));
addEventListener('keydown', e => { if (e.key === 'Escape' && burger && menu) { burger.setAttribute('aria-expanded', 'false'); menu.classList.remove('open'); } });
let tick = false;
function onScroll() {
  tick = false;
  const y = scrollY, max = document.documentElement.scrollHeight - innerHeight;
  if (nav) nav.classList.toggle('solid', y > 40);
  if (prog) prog.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, y / max) : 0) + ')';
  // scroll-to-top button
  const stb = $('#scrollTop');
  if (stb) {
    stb.hidden = false;
    stb.classList.toggle('visible', y > 400);
  }
  // hide scroll-down hint once user scrolls
  document.body.classList.toggle('scrolled', y > 80);
}
addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(onScroll); } }, { passive: true });
onScroll();

/* ---------- scroll to top ---------- */
(() => {
  const stb = $('#scrollTop');
  if (!stb) return;
  stb.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  });
})();
const links = menu ? $$('a', menu) : [];
const secIO = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) links.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id));
}), { rootMargin: '-45% 0px -50% 0px' });
['hero', 'invitation', 'story', 'wedding', 'reception', 'wishes'].forEach(id => { const el = $('#' + id); if (el) secIO.observe(el); });

/* ---------- calendar (generated) ---------- */
(() => {
  const cal = $('#cal'), { calYear: Y, calMonth: M, calHighlight: H, calEventDays: ev } = CONFIG;
  if (!cal) return;
  const first = new Date(Y, M, 1).getDay(), days = new Date(Y, M + 1, 0).getDate();
  let html = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
    .map(d => `<span class="inv-cal-h" role="columnheader">${d}</span>`).join('');
  for (let i = 0; i < first; i++) html += `<span class="inv-cal-e"></span>`;
  for (let d = 1; d <= days; d++) {
    const isWed = d === H, isEv = ev.includes(d);
    const cls = isWed ? ' inv-cal-on' : isEv ? ' inv-cal-ev' : '';
    html += `<span class="inv-cal-d${cls}" role="gridcell"${isWed ? ' aria-label="25 November, the wedding"' : ''}><b>${d}</b></span>`;
  }
  cal.innerHTML = html;
})();

/* ---------- envelope ---------- */
(() => {
  const env = $('#env'), wrap = $('#envWrap'), card = $('#card');
  if (!env || !wrap || !card) return;
  let busy = false;
  const wait = ms => new Promise(r => setTimeout(r, reduce ? 0 : ms));

  env.addEventListener('click', async () => {
    if (busy) return; busy = true;
    env.setAttribute('aria-disabled', 'true');

    // 0. triangles disappear immediately on tap — no transition
    env.classList.add('inv-notriangle');

    // 1. seal fades
    env.classList.add('inv-seal-off');
    await wait(380);

    // 2. flap opens
    env.classList.add('inv-open');
    await wait(600);

    // 3. card rises out
    env.classList.add('inv-rise');
    await wait(900);

    // 4. envelope slides away, card appears in same spot
    wrap.classList.add('inv-away');
    await wait(600);

    wrap.hidden = true;
    card.hidden = false;
    // NO scrollIntoView — card appears exactly where envelope was
  });
})();

/* ---------- countdown (Asia/Kolkata via fixed +05:30 target) ---------- */
(() => {
  const T = new Date(CONFIG.countdownTarget).getTime();
  const el = { d: $('#cd-d'), h: $('#cd-h'), m: $('#cd-m'), s: $('#cd-s') }, note = $('#cd-note');
  const pad = n => String(n).padStart(2, '0');
  function update() {
    const s = Math.max(0, Math.floor((T - Date.now()) / 1000));
    const v = { d: Math.floor(s / 86400), h: Math.floor(s % 86400 / 3600), m: Math.floor(s % 3600 / 60), s: s % 60 };
    for (const k in v) {
      const t = pad(v[k]);
      if (el[k].textContent !== t) {
        el[k].textContent = t;
        if (!reduce) { el[k].classList.remove('tick'); void el[k].offsetWidth; el[k].classList.add('tick'); }
      }
    }
    if (s === 0) { note.textContent = 'Today is the day — we’re celebrating!'; clearInterval(timer); }
  }
  const timer = setInterval(update, 1000); update();
})();

/* ---------- falling petals (site-wide canvas) ---------- */
(() => {
  const canvas = document.getElementById('petals');
  if (!canvas || reduce) return;
  const ctx = canvas.getContext('2d');
  let W, H, petals = [];

  const COLORS = ['#C58A91','#e8b9b6','#842F43','#d4a0a8','#f0d0d4','#b56a76'];
  const COUNT  = 28;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  function randPetal() {
    return {
      x:     Math.random() * W,
      y:     Math.random() * -H,
      size:  2.5 + Math.random() * 3.5,          // slightly larger — more visible at slower speed
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      speed: 0.55 + Math.random() * 0.7,         // slow: 0.55–1.25 px/frame (was 1.8–4.2)
      drift: (Math.random() - 0.5) * 0.15,       // very gentle horizontal drift (was 0.6)
      spin:  (Math.random() - 0.5) * 0.016,      // slow, natural rotation (was 0.06)
      angle: Math.random() * Math.PI * 2,
      sway:  Math.random() * Math.PI * 2,
      swayS: 0.003 + Math.random() * 0.004,      // slow sway oscillation (was 0.012–0.028)
      swayA: 0.25 + Math.random() * 0.45         // sway amplitude — gentle side float
    };
  }

  for (let i = 0; i < COUNT; i++) {
    const p = randPetal();
    p.y = Math.random() * H;   // spread across full screen on load
    petals.push(p);
  }

  function drawPetal(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.angle);
    ctx.globalAlpha = 0.26;    // softer, more delicate (was 0.35)
    ctx.fillStyle = p.color;

    const s = p.size;
    ctx.beginPath();
    // teardrop petal — smoother bezier curves
    ctx.moveTo(0, -s * 2);
    ctx.bezierCurveTo( s * 1.05, -s * 1.1,  s * 1.05,  s * 0.9, 0,  s * 2);
    ctx.bezierCurveTo(-s * 1.05,  s * 0.9, -s * 1.05, -s * 1.1, 0, -s * 2);
    ctx.fill();
    ctx.restore();
  }

  function tick() {
    if (document.body.classList.contains('locked')) {
      ctx.clearRect(0, 0, W, H);
      requestAnimationFrame(tick);
      return;
    }
    ctx.clearRect(0, 0, W, H);
    for (const p of petals) {
      p.sway  += p.swayS;
      p.x     += Math.sin(p.sway) * p.swayA + p.drift;
      p.y     += p.speed;
      p.angle += p.spin;
      if (p.y > H + 20) {
        Object.assign(p, randPetal());
        p.y = -20;
      }
      drawPetal(p);
    }
    requestAnimationFrame(tick);
  }
  tick();
})();
(() => {
  const box = $('#parts'); if (!box || reduce) return;
  for (let i = 0; i < 22; i++) {
    const p = document.createElement('i'), s = 3 + Math.random() * 7;
    p.className = 'pt';
    p.style.cssText = `left:${Math.random() * 100}%;width:${s}px;height:${s}px;--t:${9 + Math.random() * 10}s;--dl:${-Math.random() * 14}s;--x:${(Math.random() - .5) * 80}px`;
    box.appendChild(p);
  }
})();

/* ---------- GSAP: parallax + timeline (graceful fallback) ---------- */
(() => {
  const fill = $('#tlFill');
  if (reduce || !window.gsap || !window.ScrollTrigger) { if(fill) fill.style.transform = 'scaleY(1)'; return; }
  gsap.registerPlugin(ScrollTrigger);
  $$('.px').forEach(box => {
    gsap.fromTo($('img', box), { yPercent: -6 }, { yPercent: 6, ease: 'none',
      scrollTrigger: { trigger: box, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
  if(fill) gsap.to(fill, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '#tl', start: 'top 65%', end: 'bottom 70%', scrub: .6 } });
  gsap.to('.hero-ph', { yPercent: -6, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true } });

  /* Wedding photo parallax */
  const wedImg = $('.wed-photo-frame img');
  if (wedImg) {
    gsap.fromTo(wedImg,
      { yPercent: -5 },
      { yPercent: 5, ease: 'none',
        scrollTrigger: { trigger: '#wedding', start: 'top bottom', end: 'bottom top', scrub: true }
      }
    );
  }

  /* Reception background photo subtle parallax */
  const recBgImg = $('.rec-bg-photo img');
  if (recBgImg) {
    gsap.fromTo(recBgImg,
      { yPercent: -4 },
      { yPercent: 4, ease: 'none',
        scrollTrigger: { trigger: '#reception', start: 'top bottom', end: 'bottom top', scrub: true }
      }
    );
  }

  /* Reception portrait photo gentle parallax */
  const recPhImg = $('.rec-photo-frame img');
  if (recPhImg) {
    gsap.fromTo(recPhImg,
      { yPercent: -3 },
      { yPercent: 3, ease: 'none',
        scrollTrigger: { trigger: '#reception', start: 'top bottom', end: 'bottom top', scrub: true }
      }
    );
  }
})();

/* ---------- guest wishes (real submission) ---------- */
(() => {
  const form = $('#wishForm'), btn = $('#send'), msg = $('#formMsg'), pop = $('#popup'), cnt = $('#cnt');
  let sending = false, hideT = null;
  form.message.addEventListener('input', () => { cnt.textContent = form.message.value.length; });

  function showPopup() {
    clearTimeout(hideT);
    pop.hidden = false;
    requestAnimationFrame(() => requestAnimationFrame(() => pop.classList.add('show')));
    hideT = setTimeout(hidePopup, 5000);                 // auto-dismiss after five seconds
  }
  function hidePopup() {
    clearTimeout(hideT); pop.classList.remove('show');
    setTimeout(() => { pop.hidden = true; }, 520);
  }
  pop.addEventListener('click', hidePopup);

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (sending) return;
    msg.textContent = '';
    const name = form.guest_name.value.trim(), text = form.message.value.trim();
    if (name.length < 2) { msg.textContent = 'Please add your name.'; form.guest_name.focus(); return; }
    if (text.length < 5) { msg.textContent = 'Please write at least a few words in your message.'; form.message.focus(); return; }
    sending = true; btn.disabled = true; btn.classList.add('load');
    try {
      const res = await fetch(form.getAttribute('action'), {
        method: 'POST', body: new FormData(form),
        headers: { 'X-Requested-With': 'fetch', 'Accept': 'application/json' }
      });
      let data = null; try { data = await res.json(); } catch (_) {}
      if (res.ok && data && data.success === true) {      // success only when the server confirms the DB insert
        form.reset(); cnt.textContent = '0'; showPopup();
      } else {
        msg.textContent = (data && data.message) || 'Your letter could not be sent. Please try again in a moment.';
      }
    } catch (_) {
      msg.textContent = 'We couldn’t reach the server. Check your connection and try again.';
    } finally {
      sending = false; btn.disabled = false; btn.classList.remove('load');
    }
  });
})();

const wishForm = document.getElementById("wishForm");
const sendBtn = document.getElementById("send");
const formMsg = document.getElementById("formMsg");
const wishSuccess = document.getElementById("wishSuccess");

wishForm.addEventListener("submit", async function (e) {

    e.preventDefault();

    if (sendBtn.disabled) return;

    formMsg.textContent = "";

    const name = wishForm.guest_name.value.trim();
    const message = wishForm.message.value.trim();

    if (name.length < 2 || message.length < 5) {
        formMsg.textContent = "Please fill in your name and wishes.";
        return;
    }

    sendBtn.disabled = true;

    try {

        const response = await fetch(wishForm.action, {
            method: "POST",
            body: new FormData(wishForm)
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || "Please try again.");
        }

        // Start folding animation only after successful saving
        wishForm.classList.add("letter-folding");

        setTimeout(() => {
            wishForm.classList.add("letter-inside");
        }, 900);

        setTimeout(() => {
            wishForm.style.display = "none";
            wishSuccess.classList.add("show");
        }, 1800);

        // Refresh after 3 seconds
        setTimeout(() => {
            window.location.reload();
        }, 3000);

    } catch (error) {

        formMsg.textContent = error.message;
        sendBtn.disabled = false;

    }

});