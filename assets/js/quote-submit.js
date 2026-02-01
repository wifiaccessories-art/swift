// Quote modal open/close only (submission handled by FormSubmit redirect)
(function(){
  const modal = document.querySelector('#quoteModal');
  if(!modal) return;

  // FormSubmit requires an absolute URL for _next (redirect after POST).
  // GitHub Pages often serves under a repo sub-path, so compute the correct base.
  const nextInput = document.getElementById('nextUrl');
  if (nextInput) {
    const path = window.location.pathname;
    const dir = path.endsWith('/') ? path : path.slice(0, path.lastIndexOf('/') + 1);
    nextInput.value = window.location.origin + dir + 'thanks.html';
  }

  function openModal(){
    modal.setAttribute('aria-hidden','false');
    document.body.style.overflow='hidden';
  }
  function closeModal(){
    modal.setAttribute('aria-hidden','true');
    document.body.style.overflow='';
  }

  document.querySelectorAll('.quote-open').forEach(btn=>{
    btn.addEventListener('click', (e)=>{ e.preventDefault(); openModal(); });
  });

  modal.addEventListener('click', (e)=>{
    const t = e.target;
    if(t && t.dataset && t.dataset.close === 'true') closeModal();
  });
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') closeModal();
  });
})();