
document.addEventListener('DOMContentLoaded',()=>{
  const observer=new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('reveal'); observer.unobserve(e.target);} });
  },{threshold:0.1});
  document.querySelectorAll('.reveal-on-scroll').forEach(el=>observer.observe(el));
  // auto-dismiss alerts
  setTimeout(()=>{ document.querySelectorAll('.alert-auto').forEach(a=>a.style.display='none'); },5000);
});
