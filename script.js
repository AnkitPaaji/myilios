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
window.addEventListener('pointermove',e=>{if(cursorGlow){cursorGlow.style.left=e.clientX+'px';cursorGlow.style.top=e.clientY+'px';}});
window.addEventListener('pointerleave',()=>{if(cursorGlow)cursorGlow.style.opacity='0';});
window.addEventListener('pointerenter',()=>{if(cursorGlow)cursorGlow.style.opacity='.75';});

const tiltItems=document.querySelectorAll('.premium-card,.product-card,.feature-copy');
tiltItems.forEach(el=>{
  el.addEventListener('pointermove',e=>{
    const r=el.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width-.5;
    const y=(e.clientY-r.top)/r.height-.5;
    el.style.transform=`perspective(900px) rotateX(${-y*5}deg) rotateY(${x*7}deg) translateY(-8px)`;
  });
  el.addEventListener('pointerleave',()=>{el.style.transform='';});
});

window.addEventListener('scroll',()=>{
  const y=window.scrollY;
  document.querySelectorAll('.hero-product img,.motion-shoe img').forEach((img,i)=>{
    img.style.translate=`0 ${Math.sin((y+i*120)/240)*10}px`;
  });
},{passive:true});

// Safety: never leave content hidden if browser blocks observers.
setTimeout(()=>revealEls.forEach(el=>el.classList.add('visible')),900);


// v5: add subtle scroll state and video-like parallax depth
const nav=document.querySelector('.nav');
window.addEventListener('scroll',()=>{ if(nav) nav.classList.toggle('scrolled', window.scrollY>24); },{passive:true});
const heroStage=document.querySelector('.hero-product.video-float-stage');
if(heroStage){
  heroStage.addEventListener('pointermove',e=>{
    const r=heroStage.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width-.5;
    const y=(e.clientY-r.top)/r.height-.5;
    heroStage.style.transform=`perspective(1100px) rotateX(${-y*4}deg) rotateY(${x*6}deg) translateY(-4px)`;
  });
  heroStage.addEventListener('pointerleave',()=>{heroStage.style.transform='';});
}
