(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // Force dark theme (theme switch removed)
  document.documentElement.setAttribute('data-theme', 'dark');

  // -------------------------------------------------
  // Mobile menu toggle
  // -------------------------------------------------
  const navToggle = $('.nav-toggle');
  const navMenu = $('#navMenu');

  if (navToggle && navMenu) {
    // Overlay behind the drawer (improves behaviour on iOS / in-app browsers)
    let overlay = $('.nav-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'nav-overlay';
      document.body.appendChild(overlay);
    }

    const setNavOpen = (open) => {
      navMenu.classList.toggle('open', open);
      navToggle.classList.toggle('open', open);
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.classList.toggle('nav-open', open);
    };
    navToggle.addEventListener('click', () => {
      setNavOpen(!navMenu.classList.contains('open'));
    });

    overlay.addEventListener('click', () => setNavOpen(false));

    $$('#navMenu a').forEach((a) =>
      a.addEventListener('click', () => setNavOpen(false))
    );

    document.addEventListener('click', (e) => {
      if (window.innerWidth > 768) return;
      if (!navMenu.classList.contains('open')) return;
      const t = e.target;
      if (navMenu.contains(t) || navToggle.contains(t)) return;
      setNavOpen(false);
    });
  }

  // -------------------------------------------------
  // Quote modal (open/close)
  // -------------------------------------------------
  const quoteModal = $('#quoteModal');
  const openQuoteBtns = $$('[data-open-quote]');
  const closeQuoteBtns = $$('[data-close-quote]');

  const openQuote = () => {
    // If the mobile menu is open, close it first so the modal has full space
    // and no behind-the-menu artifacts show through.
    const navMenu = $('#navMenu');
    if (navMenu && navMenu.classList.contains('open')) {
      const navToggle = $('#navToggle');
      navMenu.classList.remove('open');
      if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('nav-open');
      document.body.style.overflow = '';
      const overlay = document.querySelector('.nav-overlay');
      if (overlay) overlay.remove();
    }
    if (!quoteModal) return;
    quoteModal.classList.add('open');
    document.body.classList.add('modal-open');
    const first = $('#quoteModal input, #quoteModal select, #quoteModal textarea');
    if (first) setTimeout(() => first.focus(), 50);
  };

  const closeQuote = () => {
    if (!quoteModal) return;
    quoteModal.classList.remove('open');
    document.body.classList.remove('modal-open');
  };

  // Direct bindings (for buttons that exist at load)
  openQuoteBtns.forEach((btn) => btn.addEventListener('click', (e) => { e.preventDefault(); openQuote(); }));
  closeQuoteBtns.forEach((btn) => btn.addEventListener('click', (e) => { e.preventDefault(); closeQuote(); }));

  // Event delegation (covers buttons added later / edge cases where binding didn't happen)
  document.addEventListener('click', (e) => {
    const openBtn = e.target.closest('[data-open-quote]');
    if (openBtn) { e.preventDefault(); openQuote(); return; }
    const closeBtn = e.target.closest('[data-close-quote]');
    if (closeBtn) { e.preventDefault(); closeQuote(); }
  });

  if (quoteModal) {
    quoteModal.addEventListener('click', (e) => {
      if (e.target === quoteModal) closeQuote();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && quoteModal.classList.contains('open')) closeQuote();
    });
  }

  // -------------------------------------------------
  // Reveal animations
  // -------------------------------------------------
  const revealEls = $$('.reveal');
  if (revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealEls.forEach((el) => io.observe(el));
  }

  // -------------------------------------------------
  // Ambient background canvas
  // -------------------------------------------------
  const canvas = $('#bgFx');
  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext('2d');
    const DPR = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const { innerWidth: w, innerHeight: h } = window;
      canvas.width = Math.floor(w * DPR);
      canvas.height = Math.floor(h * DPR);
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: 70 }).map(() => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: 1.2 + Math.random() * 1.8,
      a: 0.12 + Math.random() * 0.18,
    }));

    const lineColor = 'rgba(120, 190, 255, 0.08)';
    const dotColor = (a) => `rgba(180, 220, 255, ${a})`;

    const step = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      // dots
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -10) p.x = window.innerWidth + 10;
        if (p.x > window.innerWidth + 10) p.x = -10;
        if (p.y < -10) p.y = window.innerHeight + 10;
        if (p.y > window.innerHeight + 10) p.y = -10;

        ctx.beginPath();
        ctx.fillStyle = dotColor(p.a);
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // links
      ctx.strokeStyle = lineColor;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d < 140) {
            ctx.globalAlpha = 1 - d / 140;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;

      requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }

  // -------------------------------------------------
  // IMPORTANT:
  // We intentionally do NOT intercept form submission.
  // Forms should submit via standard POST to FormSubmit.
  // -------------------------------------------------
})();
