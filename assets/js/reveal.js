// Reveal animations: ensure content is visible even if IntersectionObserver not available
(function(){
  const els = Array.from(document.querySelectorAll('.reveal'));
  if(!els.length) return;

  function show(el){ el.classList.add('in'); }

  // Always show everything after a short delay (failsafe)
  setTimeout(()=>els.forEach(show), 400);

  // Prefer smooth reveal when supported
  if('IntersectionObserver' in window){
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        if(e.isIntersecting){
          show(e.target);
          io.unobserve(e.target);
        }
      });
    }, {threshold: 0.12});
    els.forEach(el=>io.observe(el));
  } else {
    els.forEach(show);
  }
})();