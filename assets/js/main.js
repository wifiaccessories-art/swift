(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // ------------------------------
  // ------------------------------
  const rootEl = document.documentElement;
  }

    if (!btn) return;
    if (icon) icon.textContent = isLight ? "☀" : "☾";
  };

    btn.addEventListener("click", () => {
      const next = cur === "dark" ? "light" : "dark";
    });
  });

  // ------------------------------
  // Mobile menu
  // ------------------------------
  const navToggle = $(".nav-toggle");
  const navMenu = $("#navMenu");
  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const open = navMenu.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });

    $$(".nav-link", navMenu).forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Open menu");
      });
    });
  }

  // ------------------------------
  // Quote modal
  // ------------------------------
  const modal = $("#quoteModal");
  const openBtns = $$(".quote-open");

  const closeModal = () => {
    if (!modal) return;
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  const openModal = () => {
    if (!modal) return;
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    const first = $("input,select,textarea,button", modal);
    if (first) setTimeout(() => first.focus(), 0);
  };

  openBtns.forEach((b) => b.addEventListener("click", openModal));

  if (modal) {
    modal.addEventListener("click", (e) => {
      const target = e.target;
      if (target && target.dataset && target.dataset.close === "true") closeModal();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.getAttribute("aria-hidden") === "false") closeModal();
    });
  }

  // ------------------------------
  // Quote form -> mailto
  // ------------------------------
  const quoteForm = $("#quoteForm");
  if (quoteForm) {
    quoteForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(quoteForm);
      const lines = [
        `Name: ${data.get("name") || ""}`,
        `Email: ${data.get("email") || ""}`,
        `Service: ${data.get("service") || ""}`,
        `Origin: ${data.get("origin") || ""}`,
        `Destination: ${data.get("destination") || ""}`,
        `Cargo: ${data.get("cargo") || ""}`,
        `Ready date: ${data.get("ready") || ""}`,
        ``,
        `Notes:`,
        `${data.get("notes") || ""}`,
      ];
      const subject = encodeURIComponent(`Quote Request — ${data.get("service") || "Freight"}`);
      const body = encodeURIComponent(lines.join("\n"));
      closeModal();
      quoteForm.reset();
    });
  }

  // ------------------------------
  // Contact form -> mailto
  // ------------------------------
  const contactForm = $("#contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(contactForm);
      const subjectText = data.get("subject") || "Website inquiry";
      const lines = [`Name: ${data.get("name") || ""}`, `Email: ${data.get("email") || ""}`, ``, `${data.get("message") || ""}`];
      const subject = encodeURIComponent(subjectText);
      const body = encodeURIComponent(lines.join("\n"));
      contactForm.reset();
    });
  }

  // ------------------------------
  // Reveal animations (smooth + staggered)
  // ------------------------------
  const revealEls = $$(".reveal");
  const staggerGroups = [".services-grid", ".steps", ".reasons-grid", ".mini-cards", ".cards"];

  // Apply auto-stagger within common grids
  staggerGroups.forEach((sel) => {
    $$(sel).forEach((group) => {
      const items = $$(".reveal", group);
      items.forEach((el, i) => {
        if (!el.style.getPropertyValue("--d")) {
          el.style.setProperty("--d", `${i * 70}ms`);
        }
      });
    });
  });

  if (revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  }

  // ------------------------------
  // Ambient particles canvas (AI vibe)
  // ------------------------------
  const fx = document.getElementById("fxCanvas");
  if (fx) {
    const ctx = fx.getContext("2d");
    const prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const state = {
      w: 0,
      h: 0,
      dpr: Math.max(1, Math.min(2, window.devicePixelRatio || 1)),
      particles: [],
      count: 46,
      t: 0,
      raf: 0,
    };

    const resize = () => {
      state.w = fx.clientWidth || window.innerWidth;
      state.h = fx.clientHeight || window.innerHeight;
      fx.width = Math.floor(state.w * state.dpr);
      fx.height = Math.floor(state.h * state.dpr);
      ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
    };

    const rand = (min, max) => min + Math.random() * (max - min);

    const seed = () => {
      state.particles = Array.from({ length: state.count }).map(() => ({
        x: rand(0, state.w),
        y: rand(0, state.h),
        r: rand(1.2, 2.6),
        vx: rand(-0.18, 0.18),
        vy: rand(-0.12, 0.12),
        a: rand(0.18, 0.46),
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, state.w, state.h);

      ctx.globalCompositeOperation = "lighter";

      // points
      for (const p of state.particles) {
        p.x += p.vx;
        p.y += p.vy;

        // gentle drift
        if (p.x < -10) p.x = state.w + 10;
        if (p.x > state.w + 10) p.x = -10;
        if (p.y < -10) p.y = state.h + 10;
        if (p.y > state.h + 10) p.y = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = isLight ? `rgba(40,60,120,${p.a})` : `rgba(140,220,255,${p.a})`;
        ctx.fill();
      }

      // lines (nearby)
      ctx.globalAlpha = isLight ? 0.18 : 0.22;
      for (let i = 0; i < state.particles.length; i++) {
        for (let j = i + 1; j < state.particles.length; j++) {
          const a = state.particles[i];
          const b = state.particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            const strength = (1 - dist / 140) * (isLight ? 0.35 : 0.55);
            ctx.strokeStyle = isLight ? `rgba(60,80,140,${strength})` : `rgba(124,58,237,${strength})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    };

    const tick = () => {
      draw();
      state.raf = window.requestAnimationFrame(tick);
    };

    resize();
    seed();

    window.addEventListener("resize", () => {
      resize();
      seed();
    });

    if (!prefersReduced) tick();
  }

  // ------------------------------
  // Back to top
  // ------------------------------
  const toTop = $("#toTop");
  const onScroll = () => {
    const y = window.scrollY || document.documentElement.scrollTop;
    if (!toTop) return;
    if (y > 600) toTop.classList.add("show");
    else toTop.classList.remove("show");
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  if (toTop) {
    toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }
})();