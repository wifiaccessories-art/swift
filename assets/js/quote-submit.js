// Quote modal open/close only (submission handled by FormSubmit redirect)
(function(){
  const modal = document.querySelector('#quoteModal');
  if(!modal) return;

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