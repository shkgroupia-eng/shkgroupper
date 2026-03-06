/* ================================
   SHK GROUP.IA — script.js FINAL
   ================================ */
'use strict';

const mobile = () => window.innerWidth <= 768 || ('ontouchstart' in window);

/* ---- CURSOR ---- */
(function(){
  if(mobile()) return;
  const cur = document.getElementById('cur');
  const ring = document.getElementById('curRing');
  if(!cur || !ring) return;
  let mx=0,my=0,rx=0,ry=0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cur.style.left = mx+'px'; cur.style.top = my+'px';
  });
  (function loop(){
    rx += (mx-rx)*.12; ry += (my-ry)*.12;
    ring.style.left = rx+'px'; ring.style.top = ry+'px';
    requestAnimationFrame(loop);
  })();
  document.addEventListener('mouseover', e => {
    const el = e.target.closest('a,button,.card4,.scard,.fcard,.fnc,.dcard,.faq-q,.chip,.sr-btn,.btn-p,.btn-s');
    if(el){ cur.classList.add('on'); ring.classList.add('on'); }
    else { cur.classList.remove('on'); ring.classList.remove('on'); }
  });
})();


/* ---- NAVBAR SCROLL ---- */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('stuck', window.scrollY > 40);
}, {passive:true});


/* ---- HAMBURGER / DRAWER ---- */
const ham = document.getElementById('hamburger');
const drawer = document.getElementById('drawer');

ham.addEventListener('click', () => {
  const open = drawer.classList.toggle('open');
  ham.classList.toggle('open', open);
  ham.setAttribute('aria-expanded', String(open));
});

drawer.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    drawer.classList.remove('open');
    ham.classList.remove('open');
    ham.setAttribute('aria-expanded','false');
  });
});

document.addEventListener('click', e => {
  if(!nav.contains(e.target)){
    drawer.classList.remove('open');
    ham.classList.remove('open');
    ham.setAttribute('aria-expanded','false');
  }
});


/* ---- FADE UP ON SCROLL ---- */
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if(!entry.isIntersecting) return;
    const delay = Number(entry.target.dataset.delay || i * 60);
    setTimeout(() => entry.target.classList.add('vis'), delay);
    io.unobserve(entry.target);
  });
}, {threshold: 0.1, rootMargin: '0px 0px -24px 0px'});

document.querySelectorAll('.fade-up').forEach(el => io.observe(el));


/* ---- COUNTER ANIMATION ---- */
function countUp(el, target, ms){
  let v = 0;
  const step = target / (ms / 16);
  const t = setInterval(() => {
    v += step;
    if(v >= target){ v = target; clearInterval(t); }
    el.textContent = Math.floor(v);
  }, 16);
}

const cio = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(!entry.isIntersecting) return;
    const num = entry.target.querySelector('.sc-n');
    const bar = entry.target.querySelector('.sc-bar');
    if(num && !num.dataset.done){
      num.dataset.done = '1';
      countUp(num, parseInt(num.dataset.to), 1800);
    }
    if(bar && !bar.dataset.done){
      bar.dataset.done = '1';
      setTimeout(() => { bar.style.width = bar.dataset.w + '%'; }, 250);
    }
    cio.unobserve(entry.target);
  });
}, {threshold: 0.4});

document.querySelectorAll('.scard').forEach(el => cio.observe(el));


/* ---- FAQ ACCORDION (altura real) ---- */
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-it');
    const ans  = item.querySelector('.faq-a');
    const p    = ans.querySelector('p');
    const isOpen = item.classList.contains('open');

    // fecha todos
    document.querySelectorAll('.faq-it').forEach(it => {
      it.classList.remove('open');
      it.querySelector('.faq-a').style.height = '0';
    });

    if(!isOpen){
      item.classList.add('open');
      ans.style.height = p.offsetHeight + 18 + 'px';
    }
  });
});


/* ---- SMOOTH SCROLL ---- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if(id === '#') return;
    const target = document.querySelector(id);
    if(!target) return;
    e.preventDefault();
    const y = target.getBoundingClientRect().top + window.pageYOffset - 80;
    window.scrollTo({top: y, behavior: 'smooth'});
  });
});


/* ---- ACTIVE NAV ---- */
const sections = document.querySelectorAll('section[id], footer');
const navLinks = document.querySelectorAll('#navList a:not(.nav-btn)');
window.addEventListener('scroll', () => {
  let cur = '';
  sections.forEach(s => {
    if(window.scrollY >= s.offsetTop - 160) cur = s.id;
  });
  navLinks.forEach(a => {
    a.classList.toggle('act', a.getAttribute('href') === '#'+cur);
  });
}, {passive:true});


/* ---- TILT 3D (desktop only) ---- */
if(!mobile()){
  const tiltSel = '.card4,.fcard,.dcard,.step,.icard';
  document.querySelectorAll(tiltSel).forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width/2) / (r.width/2);
      const y = (e.clientY - r.top - r.height/2) / (r.height/2);
      card.style.transform = `translateY(-5px) rotateX(${-y*4}deg) rotateY(${x*4}deg)`;
      card.style.transition = 'transform .08s linear';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'border-color .3s, transform .4s ease, box-shadow .3s';
    });
  });
}


/* ---- PARTICLES ---- */
(function(){
  const bg = document.querySelector('.hero-bg');
  if(!bg) return;
  const style = document.createElement('style');
  style.textContent = '@keyframes fp{0%,100%{opacity:.25;transform:translateY(0)}50%{opacity:.65;transform:translateY(-20px)}}';
  document.head.appendChild(style);
  for(let i = 0; i < 14; i++){
    const d = document.createElement('div');
    const sz = Math.random()*2.5+1;
    d.style.cssText = [
      'position:absolute',
      `width:${sz}px`,`height:${sz}px`,
      `background:rgba(168,85,247,${(Math.random()*.4+.2).toFixed(2)})`,
      'border-radius:50%',
      `top:${(Math.random()*90).toFixed(1)}%`,
      `left:${(Math.random()*95).toFixed(1)}%`,
      `animation:fp ${(Math.random()*7+5).toFixed(1)}s ease-in-out ${(Math.random()*4).toFixed(1)}s infinite`,
      'pointer-events:none','z-index:0'
    ].join(';');
    bg.appendChild(d);
  }
})();
