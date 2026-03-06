// ========================
// SHK GROUP.IA — script.js
// ========================

// ---- DEVICE DETECTION ----
const isMobile = () => window.innerWidth <= 768 || ('ontouchstart' in window);

// ---- CUSTOM CURSOR ----
(function initCursor(){
  if(isMobile()) return;
  const cur = document.getElementById('cursor');
  const fol = document.getElementById('cursorFollower');
  if(!cur||!fol) return;

  let mx=0,my=0,fx=0,fy=0,raf;

  document.addEventListener('mousemove',e=>{
    mx=e.clientX; my=e.clientY;
    cur.style.left=mx+'px'; cur.style.top=my+'px';
  });

  function loop(){
    fx+=(mx-fx)*.13; fy+=(my-fy)*.13;
    fol.style.left=fx+'px'; fol.style.top=fy+'px';
    raf=requestAnimationFrame(loop);
  }
  loop();

  const hoverEls = 'a,button,.a-card,.stat-card,.af-card,.func-item,.dif-card,.faq-q,.tag,.pr-cta,.btn-primary,.btn-secondary,.nav-cta';
  document.querySelectorAll(hoverEls).forEach(el=>{
    el.addEventListener('mouseenter',()=>{cur.classList.add('hovered');fol.classList.add('hovered')});
    el.addEventListener('mouseleave',()=>{cur.classList.remove('hovered');fol.classList.remove('hovered')});
  });
})();


// ---- NAVBAR SCROLL ----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll',()=>{
  navbar.classList.toggle('scrolled', window.scrollY>50);
},{ passive:true });


// ---- MOBILE MENU ----
const menuToggle = document.getElementById('menuToggle');
const mobileDrawer = document.getElementById('mobileDrawer');

menuToggle.addEventListener('click',()=>{
  const open = mobileDrawer.classList.toggle('open');
  menuToggle.classList.toggle('open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
});

mobileDrawer.querySelectorAll('a').forEach(a=>{
  a.addEventListener('click',()=>{
    mobileDrawer.classList.remove('open');
    menuToggle.classList.remove('open');
    menuToggle.setAttribute('aria-expanded','false');
  });
});

document.addEventListener('click',e=>{
  if(!navbar.contains(e.target)){
    mobileDrawer.classList.remove('open');
    menuToggle.classList.remove('open');
    menuToggle.setAttribute('aria-expanded','false');
  }
});


// ---- REVEAL ON SCROLL ----
const revealObs = new IntersectionObserver((entries)=>{
  entries.forEach((entry,i)=>{
    if(entry.isIntersecting){
      const delay = entry.target.dataset.delay || i*70;
      setTimeout(()=> entry.target.classList.add('visible'), Number(delay));
      revealObs.unobserve(entry.target);
    }
  });
},{threshold:0.1, rootMargin:'0px 0px -30px 0px'});

document.querySelectorAll('.reveal').forEach(el=> revealObs.observe(el));


// ---- COUNTER ANIMATION ----
function animCount(el, target, duration){
  let start=0, inc=target/(duration/16);
  const t=setInterval(()=>{
    start+=inc;
    if(start>=target){start=target;clearInterval(t);}
    el.textContent=Math.floor(start);
  },16);
}

const counterObs = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(!entry.isIntersecting) return;
    const numEl = entry.target.querySelector('.stat-number');
    const barEl = entry.target.querySelector('.stat-bar');
    if(numEl && !numEl.dataset.done){
      numEl.dataset.done='1';
      animCount(numEl, parseInt(numEl.dataset.target), 1800);
    }
    if(barEl && !barEl.dataset.done){
      barEl.dataset.done='1';
      setTimeout(()=>{ barEl.style.width=barEl.dataset.width+'%'; },200);
    }
    counterObs.unobserve(entry.target);
  });
},{threshold:0.35});

document.querySelectorAll('.stat-card').forEach(el=> counterObs.observe(el));


// ---- FAQ ACCORDION ----
document.querySelectorAll('.faq-q').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const item = btn.closest('.faq-item');
    const answerEl = item.querySelector('.faq-a');
    const isOpen = item.classList.contains('open');
    // close all
    document.querySelectorAll('.faq-item').forEach(i=>{
      i.classList.remove('open');
      i.querySelector('.faq-a').classList.remove('open');
      i.querySelector('.faq-a').style.display='';
    });
    if(!isOpen){
      item.classList.add('open');
      answerEl.style.display='block';
      answerEl.classList.add('open');
    }
  });
});


// ---- SMOOTH SCROLL (override native for offset) ----
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const id = a.getAttribute('href');
    if(id==='#') return;
    const target = document.querySelector(id);
    if(target){
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({top, behavior:'smooth'});
    }
  });
});


// ---- ACTIVE NAV LINK ----
const sections = document.querySelectorAll('section[id]');
const navAs = document.querySelectorAll('.nav-links a:not(.nav-cta)');
window.addEventListener('scroll',()=>{
  let cur='';
  sections.forEach(s=>{
    if(window.scrollY >= s.offsetTop - 160) cur=s.id;
  });
  navAs.forEach(a=>{
    a.classList.remove('active-link');
    if(a.getAttribute('href')==='#'+cur) a.classList.add('active-link');
  });
},{passive:true});


// ---- TILT 3D NOS CARDS ----
if(!isMobile()){
  const tiltEls = document.querySelectorAll('.a-card,.af-card,.dif-card,.step-card,.int-card');
  tiltEls.forEach(card=>{
    card.addEventListener('mousemove',e=>{
      const r=card.getBoundingClientRect();
      const x=e.clientX-r.left, y=e.clientY-r.top;
      const cx=r.width/2, cy=r.height/2;
      const rx=((y-cy)/cy)*4, ry=((x-cx)/cx)*-4;
      card.style.transform=`translateY(-5px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      card.style.transition='transform .08s ease';
    });
    card.addEventListener('mouseleave',()=>{
      card.style.transform='';
      card.style.transition='all .35s ease';
    });
  });
}


// ---- HERO PARTICLES ----
(function spawnParticles(){
  const hero = document.querySelector('.hero-bg');
  if(!hero) return;
  const style = document.createElement('style');
  style.textContent=`@keyframes fp{0%,100%{opacity:.3;transform:translateY(0) translateX(0)}50%{opacity:.7;transform:translateY(-24px) translateX(8px)}}`;
  document.head.appendChild(style);
  for(let i=0;i<16;i++){
    const p=document.createElement('div');
    const sz=Math.random()*3+1;
    p.style.cssText=`position:absolute;width:${sz}px;height:${sz}px;background:rgba(168,85,247,${Math.random()*.5+.2});border-radius:50%;top:${Math.random()*100}%;left:${Math.random()*100}%;animation:fp ${Math.random()*8+6}s ease-in-out ${Math.random()*4}s infinite;pointer-events:none;z-index:0`;
    hero.appendChild(p);
  }
})();
