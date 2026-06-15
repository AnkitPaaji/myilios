const splashGate=document.getElementById('splashGate');
const splashEnter=document.getElementById('splashEnter');
function enterSite(){
  document.body.classList.remove('splash-active');
  document.body.classList.add('site-entered');
  if(splashGate){
    splashGate.classList.add('leaving');
    setTimeout(()=>splashGate.remove(),950);
  }
}
splashEnter?.addEventListener('click', enterSite);
splashEnter?.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();enterSite();}});
const isTouchLike=window.matchMedia('(hover: none), (pointer: coarse)').matches;
const menuToggle=document.querySelector('.menu-toggle');
const navLinks=document.querySelector('.nav-links');
menuToggle?.addEventListener('click',()=>navLinks.classList.toggle('open'));
document.querySelectorAll('.nav-links a').forEach(a=>a.addEventListener('click',()=>navLinks.classList.remove('open')));
const yearEl=document.getElementById('year');
if(yearEl) yearEl.textContent=new Date().getFullYear();
document.body.classList.add('motion-ready');
const revealEls=document.querySelectorAll('.reveal');
if('IntersectionObserver' in window){
  const io=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');io.unobserve(entry.target)}})},{threshold:.16});
  revealEls.forEach(el=>io.observe(el));
} else {
  revealEls.forEach(el=>el.classList.add('visible'));
}

// Premium interactive motion
const cursorGlow=document.querySelector('.cursor-glow');
if(!isTouchLike) window.addEventListener('pointermove',e=>{if(cursorGlow){cursorGlow.style.left=e.clientX+'px';cursorGlow.style.top=e.clientY+'px';}});
window.addEventListener('pointerleave',()=>{if(cursorGlow)cursorGlow.style.opacity='0';});
window.addEventListener('pointerenter',()=>{if(cursorGlow)cursorGlow.style.opacity='.75';});

const tiltItems=document.querySelectorAll('.premium-card,.product-card,.feature-copy');
if(!isTouchLike) tiltItems.forEach(el=>{
  el.addEventListener('pointermove',e=>{
    const r=el.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width-.5;
    const y=(e.clientY-r.top)/r.height-.5;
    el.style.transform=`perspective(900px) rotateX(${-y*5}deg) rotateY(${x*7}deg) translateY(-8px)`;
  });
  el.addEventListener('pointerleave',()=>{el.style.transform='';});
});

let scrollTick=false;
if(!isTouchLike) window.addEventListener('scroll',()=>{
  if(scrollTick) return;
  scrollTick=true;
  requestAnimationFrame(()=>{
    const y=window.scrollY;
    document.querySelectorAll('.hero-product img,.motion-shoe img').forEach((img,i)=>{
      img.style.translate=`0 ${Math.sin((y+i*120)/240)*10}px`;
    });
    scrollTick=false;
  });
},{passive:true});

// Safety: never leave content hidden if browser blocks observers.
setTimeout(()=>revealEls.forEach(el=>el.classList.add('visible')),900);


// v5: add subtle scroll state and video-like parallax depth
const nav=document.querySelector('.nav');
window.addEventListener('scroll',()=>{ if(nav) nav.classList.toggle('scrolled', window.scrollY>24); },{passive:true});
const heroStage=document.querySelector('.hero-product.video-float-stage');
if(heroStage && !isTouchLike){
  heroStage.addEventListener('pointermove',e=>{
    const r=heroStage.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width-.5;
    const y=(e.clientY-r.top)/r.height-.5;
    heroStage.style.transform=`perspective(1100px) rotateX(${-y*4}deg) rotateY(${x*6}deg) translateY(-4px)`;
  });
  heroStage.addEventListener('pointerleave',()=>{heroStage.style.transform='';});
}

// v10 cinematic intro particle field: lightweight, mobile-aware, stops after entry.
(() => {
  const canvas = document.getElementById('introParticles');
  const gate = document.getElementById('splashGate');
  if (!canvas || !gate) return;
  const ctx = canvas.getContext('2d', { alpha: true });
  const mobile = window.matchMedia('(max-width: 760px), (hover: none), (pointer: coarse)').matches;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let w = 0, h = 0, dpr = 1, raf = 0, running = !reduced;
  let particles = [];
  function resize(){
    dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.35 : 1.8);
    w = canvas.clientWidth || window.innerWidth;
    h = canvas.clientHeight || window.innerHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
    const count = mobile ? 58 : 125;
    particles = Array.from({length: count}, () => ({
      x: Math.random()*w,
      y: Math.random()*h,
      r: Math.random()*1.9 + .4,
      vx: (Math.random()-.5)*(mobile?.18:.34),
      vy: -(Math.random()*.32 + .05),
      a: Math.random()*.55 + .18,
      warm: Math.random()>.18
    }));
  }
  function draw(){
    if(!running) return;
    ctx.clearRect(0,0,w,h);
    const cx = w/2, cy = h*.44;
    for(const p of particles){
      p.x += p.vx + Math.sin((p.y + performance.now()*.02)*.01)*.05;
      p.y += p.vy;
      if(p.y < -20){ p.y = h + 20; p.x = Math.random()*w; }
      if(p.x < -20) p.x = w + 20;
      if(p.x > w + 20) p.x = -20;
      const dist = Math.hypot(p.x-cx,p.y-cy);
      const glow = Math.max(0, 1 - dist/(Math.max(w,h)*.62));
      ctx.beginPath();
      ctx.fillStyle = p.warm ? `rgba(244,189,24,${p.a + glow*.22})` : `rgba(255,255,255,${p.a*.62})`;
      ctx.shadowColor = p.warm ? 'rgba(244,189,24,.75)' : 'rgba(255,255,255,.45)';
      ctx.shadowBlur = p.warm ? 12 : 7;
      ctx.arc(p.x,p.y,p.r + glow*.8,0,Math.PI*2);
      ctx.fill();
    }
    raf = requestAnimationFrame(draw);
  }
  resize();
  if(!reduced) draw();
  window.addEventListener('resize', resize, {passive:true});
  const stop = () => { running = false; cancelAnimationFrame(raf); };
  document.getElementById('splashEnter')?.addEventListener('click', () => setTimeout(stop, 950), {once:true});
})();

// v16 ecommerce-style enquiry routing
(() => {
  const colourSelect = document.querySelector('select[name="colour"]');
  const messageBox = document.querySelector('textarea[name="message"]');
  document.querySelectorAll('.cart-cta').forEach(btn => {
    btn.addEventListener('click', () => {
      const colour = btn.getAttribute('data-colour');
      if (colour && colourSelect) colourSelect.value = colour;
      if (messageBox && !messageBox.value.trim()) {
        messageBox.value = 'I want to order Assert by ILIOS. Please confirm availability, price, size guidance and payment details.';
      }
      setTimeout(() => document.querySelector('#order input[name="name"]')?.focus({preventScroll:true}), 650);
    });
  });
})();
