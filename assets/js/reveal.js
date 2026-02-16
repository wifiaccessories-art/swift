// Scroll reveal + stagger (Option 1 + Option 2)
// - Sections fade/slide up as they enter the viewport
// - Cards inside grids appear one-by-one with a small delay
(function () {
  const els = Array.from(document.querySelectorAll('.reveal'));
  if (!els.length) return;

  const prefersReduced =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const show = (el) => el.classList.add('in');

  // Apply stagger delays to common card/grid groups.
  // Uses CSS var --d (already supported in style.css).
  const applyStagger = () => {
    const groups = [
      // Home page feature list
      { container: '.feature-list', item: '.feature.reveal', step: 90 },
      // About page + common card grids
      { container: '.cards.reasons-grid', item: '.card.reveal', step: 90 },
      { container: '.cards.mini-cards', item: '.card.reveal', step: 90 },
      // Services page blocks sometimes include cards/images; keep it subtle
      { container: '.services-grid', item: '.card.reveal', step: 90 },
      // Any generic cards group
      { container: '.cards', item: '.card.reveal', step: 80 },
    ];

    groups.forEach((g) => {
      document.querySelectorAll(g.container).forEach((wrap) => {
        const items = Array.from(wrap.querySelectorAll(g.item));
        items.forEach((el, i) => {
          // Cap the delay so later items don't feel "slow".
          const delay = Math.min(i, 8) * g.step;
          el.style.setProperty('--d', `${delay}ms`);
        });
      });
    });
  };

  applyStagger();

  // If reduced motion is preferred, or IntersectionObserver isn't available,
  // show everything immediately.
  if (prefersReduced || !('IntersectionObserver' in window)) {
    els.forEach(show);
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          show(e.target);
          io.unobserve(e.target);
        }
      });
    },
    {
      threshold: 0.12,
      // Start revealing slightly before the element is fully in view.
      rootMargin: '0px 0px -10% 0px',
    }
  );

  els.forEach((el) => io.observe(el));
})();