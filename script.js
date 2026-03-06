// ===============================
// SHK GROUP.IA — script.js
// ===============================

// ---- CURSOR PERSONALIZADO ----
const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursorFollower');
let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
});

function animateCursor() {
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;
  cursorFollower.style.left = followerX + 'px';
  cursorFollower.style.top = followerY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

document.querySelectorAll('a, button, .a-card, .stat-card, .agente-feature, .func-item, .dif-card, .faq-question').forEach(el => {
  el.addEventListener('mouseenter', () => { cursor.classList.add('active'); cursorFollower.classList.add('active'); });
  el.addEventListener('mouseleave', () => { cursor.classList.remove('active'); cursorFollower.classList.remove('active'); });
});


// ---- NAVBAR SCROLL ----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});


// ---- MENU MOBILE ----
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const spans = menuToggle.querySelectorAll('span');
  if (navLinks.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});


// ---- REVEAL ON SCROLL ----
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => { entry.target.classList.add('visible'); }, i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


// ---- COUNTER ANIMATION ----
function animateCounter(el, target, duration) {
  let start = 0;
  const increment = target / (duration / 16);
  const timer = setInterval(() => {
    start += increment;
    if (start >= target) { start = target; clearInterval(timer); }
    el.textContent = Math.floor(start);
  }, 16);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const numEl = entry.target.querySelector('.stat-number');
      const barEl = entry.target.querySelector('.stat-bar');
      if (numEl && !numEl.dataset.animated) {
        numEl.dataset.animated = 'true';
        const target = parseInt(numEl.dataset.target);
        animateCounter(numEl, target, 1800);
      }
      if (barEl && !barEl.dataset.animated) {
        barEl.dataset.animated = 'true';
        setTimeout(() => { barEl.style.width = barEl.dataset.width + '%'; }, 200);
      }
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

document.querySelectorAll('.stat-card').forEach(el => counterObserver.observe(el));


// ---- FAQ ACCORDION ----
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});


// ---- SMOOTH SCROLL ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});


// ---- BOTÃO FLUTUANTE PARALLAX LEVE ----
const waBtn = document.querySelector('.whatsapp-fixed');
window.addEventListener('scroll', () => {
  if (waBtn) {
    const scrolled = window.pageYOffset;
    waBtn.style.transform = scrolled > 300 ? 'scale(1)' : 'scale(1)';
  }
});


// ---- MICROINTERAÇÃO NOS CARDS ----
document.querySelectorAll('.a-card, .agente-feature, .dif-card, .step-card, .int-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * 4;
    const rotateY = ((x - centerX) / centerX) * -4;
    card.style.transform = `translateY(-5px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    card.style.transition = 'transform 0.1s ease';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'all 0.35s ease';
  });
});


// ---- ACTIVE NAV LINK NO SCROLL ----
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a:not(.nav-cta)');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 150) current = s.id;
  });
  navItems.forEach(a => {
    a.style.color = '';
    if (a.getAttribute('href') === '#' + current) a.style.color = '#a855f7';
  });
});


// ---- PARTÍCULAS LEVES NO HERO ----
(function createParticles() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  for (let i = 0; i < 18; i++) {
    const p = document.createElement('div');
    p.style.cssText = `
      position:absolute;
      width:${Math.random()*3+1}px;
      height:${Math.random()*3+1}px;
      background:rgba(168,85,247,${Math.random()*0.5+0.2});
      border-radius:50%;
      top:${Math.random()*100}%;
      left:${Math.random()*100}%;
      animation:floatParticle ${Math.random()*8+6}s ease-in-out ${Math.random()*4}s infinite;
      pointer-events:none;
      z-index:1;
    `;
    hero.appendChild(p);
  }
  const style = document.createElement('style');
  style.textContent = `
    @keyframes floatParticle {
      0%,100% { transform:translateY(0) translateX(0); opacity:0.4; }
      33% { transform:translateY(-${Math.random()*30+15}px) translateX(${Math.random()*20-10}px); opacity:0.8; }
      66% { transform:translateY(${Math.random()*20}px) translateX(${Math.random()*20-10}px); opacity:0.3; }
    }
  `;
  document.head.appendChild(style);
})();
