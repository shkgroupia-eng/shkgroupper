/* ================================================
   SHK GROUP.IA  —  script.js  VERSÃO FINAL
   ================================================ */
'use strict';

const isMobile = () => window.innerWidth <= 768 || ('ontouchstart' in window);

/* ---- CURSOR (desktop only) ---- */
(function () {
  if (isMobile()) return;
  const cur  = document.getElementById('cur');
  const ring = document.getElementById('curR');
  if (!cur || !ring) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cur.style.left = mx + 'px';
    cur.style.top  = my + 'px';
  });

  (function loop() {
    rx += (mx - rx) * 0.13;
    ry += (my - ry) * 0.13;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(loop);
  })();

  const sel = 'a,button,.gc,.sc,.fc,.fn,.dc,.fqb,.chip,.srb,.bp,.bs,.stp,.ic';
  document.addEventListener('mouseover', e => {
    const over = !!e.target.closest(sel);
    cur.classList.toggle('on', over);
    ring.classList.toggle('on', over);
  });
})();


/* ---- NAVBAR SCROLL ---- */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('stuck', window.scrollY > 40);
}, { passive: true });


/* ---- HAMBURGER / DRAWER ---- */
const hbg = document.getElementById('hbg');
const drw = document.getElementById('drw');

hbg.addEventListener('click', () => {
  const open = drw.classList.toggle('open');
  hbg.classList.toggle('open', open);
  hbg.setAttribute('aria-expanded', String(open));
});

drw.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    drw.classList.remove('open');
    hbg.classList.remove('open');
    hbg.setAttribute('aria-expanded', 'false');
  });
});

document.addEventListener('click', e => {
  if (!nav.contains(e.target)) {
    drw.classList.remove('open');
    hbg.classList.remove('open');
    hbg.setAttribute('aria-expanded', 'false');
  }
});


/* ---- SCROLL REVEAL ---- */
const revIO = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (!entry.isIntersecting) return;
    setTimeout(() => entry.target.classList.add('vis'), i * 55);
    revIO.unobserve(entry.target);
  });
}, { threshold: 0.09, rootMargin: '0px 0px -20px 0px' });

document.querySelectorAll('.fu').forEach(el => revIO.observe(el));


/* ---- COUNTER ANIMATION ---- */
function countUp(el, target) {
  let v = 0;
  const duration = 1800;
  const step = target / (duration / 16);
  const t = setInterval(() => {
    v += step;
    if (v >= target) { v = target; clearInterval(t); }
    el.textContent = Math.floor(v);
  }, 16);
}

const cntIO = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const num = entry.target.querySelector('.scn');
    const bar = entry.target.querySelector('.sb');
    if (num && !num.dataset.counted) {
      num.dataset.counted = '1';
      countUp(num, parseInt(num.dataset.to, 10));
    }
    if (bar && !bar.dataset.counted) {
      bar.dataset.counted = '1';
      setTimeout(() => { bar.style.width = bar.dataset.w + '%'; }, 300);
    }
    cntIO.unobserve(entry.target);
  });
}, { threshold: 0.35 });

document.querySelectorAll('.sc').forEach(el => cntIO.observe(el));


/* ---- FAQ ACCORDION (altura real, sem quebra) ---- */
document.querySelectorAll('.fqb').forEach(btn => {
  btn.addEventListener('click', () => {
    const item   = btn.closest('.fqi');
    const ans    = item.querySelector('.fqa');
    const p      = ans.querySelector('p');
    const isOpen = item.classList.contains('open');

    // fecha todos
    document.querySelectorAll('.fqi').forEach(it => {
      it.classList.remove('open');
      it.querySelector('.fqa').style.height = '0px';
    });

    if (!isOpen) {
      item.classList.add('open');
      // força recalculo de layout
      ans.style.height = 'auto';
      const h = ans.scrollHeight;
      ans.style.height = '0px';
      requestAnimationFrame(() => {
        ans.style.height = h + 'px';
      });
    }
  });
});


/* ---- SMOOTH SCROLL ---- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const y = target.getBoundingClientRect().top + window.pageYOffset - 82;
    window.scrollTo({ top: y, behavior: 'smooth' });
  });
});


/* ---- ACTIVE NAV LINKS ---- */
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('#nlist a:not(.nbtn)');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 170) current = s.id;
  });
  navLinks.forEach(a => {
    a.classList.toggle('act', a.getAttribute('href') === '#' + current);
  });
}, { passive: true });


/* ---- TILT 3D DOS CARDS (desktop only) ---- */
if (!isMobile()) {
  const tiltEls = document.querySelectorAll('.gc,.fc,.dc,.stp,.ic,.sc');
  tiltEls.forEach(card => {
    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const x  = (e.clientX - r.left  - r.width  / 2) / (r.width  / 2);
      const y  = (e.clientY - r.top   - r.height / 2) / (r.height / 2);
      card.style.transform = `translateY(-5px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
      card.style.transition = 'transform .06s linear';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'border-color .3s, transform .45s ease, box-shadow .3s';
    });
  });
}


/* ---- PARTÍCULAS HERO ---- */
(function () {
  const bg = document.querySelector('.hbg');
  if (!bg) return;

  const ks = document.createElement('style');
  ks.textContent = '@keyframes ptcl{0%,100%{opacity:.2;transform:translateY(0)}50%{opacity:.7;transform:translateY(-18px)}}';
  document.head.appendChild(ks);

  for (let i = 0; i < 16; i++) {
    const d  = document.createElement('div');
    const sz = Math.random() * 2.5 + 1;
    d.style.cssText = [
      'position:absolute', 'border-radius:50%', 'pointer-events:none', 'z-index:0',
      `width:${sz}px`, `height:${sz}px`,
      `background:rgba(168,85,247,${(Math.random() * .45 + .18).toFixed(2)})`,
      `top:${(Math.random() * 90).toFixed(1)}%`,
      `left:${(Math.random() * 95).toFixed(1)}%`,
      `animation:ptcl ${(Math.random() * 7 + 4.5).toFixed(1)}s ease-in-out ${(Math.random() * 4).toFixed(1)}s infinite`
    ].join(';');
    bg.appendChild(d);
  }
})();
