/* ================================================================
   SRI MANIKANTA MEESEVA — ULTRA-HD 3D INTERACTION & RENDERING ENGINE
   World-class 3D Web Experience by Senior 3D Full-Stack Developer
   ================================================================ */

(() => {
  "use strict";

  /* -------------------------------------------------------
     1. SYSTEM CONFIGURATION & DEVICE TIERS
  ------------------------------------------------------- */
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const isMobileScreen = window.innerWidth < 768;
  const deviceDPR = Math.min(window.devicePixelRatio || 1, 2);
  const isLowPower = (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);

  // WebGL availability check
  let webglAvailable = true;
  (() => {
    if (typeof THREE === "undefined") { webglAvailable = false; return; }
    try {
      const testCanvas = document.createElement("canvas");
      const gl = testCanvas.getContext("webgl2") || testCanvas.getContext("webgl") || testCanvas.getContext("experimental-webgl");
      webglAvailable = !!gl;
      testCanvas.remove();
    } catch (e) {
      webglAvailable = false;
    }
  })();

  // WebGL context loss protection
  document.querySelectorAll("canvas").forEach((cv) => {
    cv.addEventListener("webglcontextlost", (e) => {
      e.preventDefault();
      cv.classList.add("webgl-lost");
      cv.style.background = "radial-gradient(ellipse at center, #0b2740 0%, #030b16 100%)";
    }, false);
    cv.addEventListener("webglcontextrestored", () => {
      cv.classList.remove("webgl-lost");
    }, false);
  });

  /* -------------------------------------------------------
     2. LOADER & INITIALIZATION
  ------------------------------------------------------- */
  window.addEventListener("load", () => {
    const loader = document.getElementById("loader");
    setTimeout(() => {
      if (loader) loader.classList.add("is-hidden");
      initHeroTextReveal();
    }, 450);
  });
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* -------------------------------------------------------
     3. ULTRA-SMOOTH CUSTOM CURSOR
  ------------------------------------------------------- */
  const cursor = document.getElementById("customCursor");
  if (cursor && !isCoarsePointer && !prefersReducedMotion) {
    let cx = window.innerWidth / 2, cy = window.innerHeight / 2;
    let tx = cx, ty = cy;
    let isHovered = false;

    document.addEventListener("mousemove", (e) => {
      tx = e.clientX; ty = e.clientY;
      cursor.classList.remove("is-hidden");
    }, { passive: true });
    document.addEventListener("mouseleave", () => cursor.classList.add("is-hidden"));
    document.addEventListener("mouseenter", () => cursor.classList.remove("is-hidden"));

    const attachCursorHovers = () => {
      document.querySelectorAll("a, button, .service-card, .community-card, .step-card, .contact-card, .testimonial-card, .chip").forEach((el) => {
        el.addEventListener("mouseenter", () => { isHovered = true; cursor.classList.add("is-hover"); });
        el.addEventListener("mouseleave", () => { isHovered = false; cursor.classList.remove("is-hover"); });
      });
    };
    attachCursorHovers();

    function cursorLoop() {
      cx += (tx - cx) * 0.16;
      cy += (ty - cy) * 0.16;
      cursor.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      requestAnimationFrame(cursorLoop);
    }
    cursorLoop();
  }

  /* -------------------------------------------------------
     4. SCROLL PROGRESS BAR
  ------------------------------------------------------- */
  const progressBar = document.querySelector(".scroll-progress-bar");
  if (progressBar) {
    window.addEventListener("scroll", () => {
      const scrolled = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const pct = total > 0 ? (scrolled / total) * 100 : 0;
      progressBar.style.width = pct + "%";
    }, { passive: true });
  }

  /* -------------------------------------------------------
     5. BACK TO TOP
  ------------------------------------------------------- */
  const backToTop = document.getElementById("backToTop");
  if (backToTop) {
    window.addEventListener("scroll", () => {
      backToTop.classList.toggle("is-visible", window.scrollY > 500);
    }, { passive: true });
  }

  /* -------------------------------------------------------
     6. NAVIGATION SYSTEM
  ------------------------------------------------------- */
  const siteNav = document.getElementById("siteNav");
  const onScrollNav = () => siteNav && siteNav.classList.toggle("is-scrolled", window.scrollY > 30);
  onScrollNav();
  window.addEventListener("scroll", onScrollNav, { passive: true });

  const navToggle = document.getElementById("navToggle");
  const navMobile = document.getElementById("navMobile");
  if (navToggle && navMobile) {
    navToggle.addEventListener("click", () => {
      const open = navMobile.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.classList.toggle("is-active", open);
    });
    navMobile.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        navMobile.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.classList.remove("is-active");
      })
    );
  }

  /* -------------------------------------------------------
     7. HERO TEXT REVEAL & COUNTER ANIMATION
  ------------------------------------------------------- */
  function initHeroTextReveal() {
    const words = document.querySelectorAll(".reveal-word");
    words.forEach((w, i) => {
      setTimeout(() => w.classList.add("is-visible"), 200 + i * 160);
    });
    document.querySelectorAll(".reveal-up").forEach((el, i) => {
      setTimeout(() => el.classList.add("is-visible"), 600 + i * 140);
    });
  }

  const revealEls = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = Math.min((el.dataset.i || 0) * 70, 350);
          setTimeout(() => el.classList.add("is-visible"), delay);
          revealObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -5% 0px" }
  );
  const groupCounters = new Map();
  revealEls.forEach((el) => {
    const parent = el.parentElement;
    const n = groupCounters.get(parent) || 0;
    el.dataset.i = n;
    groupCounters.set(parent, n + 1);
    revealObserver.observe(el);
  });

  const counters = document.querySelectorAll(".counter");
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        animateCounter(el, target);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.4 });
  counters.forEach((c) => counterObserver.observe(c));

  function animateCounter(el, target) {
    const duration = 1800;
    const start = performance.now();
    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(update);
    }
    if (!prefersReducedMotion) requestAnimationFrame(update);
    else el.textContent = target;
  }

  /* -------------------------------------------------------
     8. SERVICES RENDER & SMART SEARCH
  ------------------------------------------------------- */
  const groupsWrap = document.getElementById("serviceGroups");
  const iconPaths = {
    printer: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 9V3h12v6M6 18H4a1 1 0 01-1-1v-5a1 1 0 011-1h16a1 1 0 011 1v5a1 1 0 01-1 1h-2"/><rect x="6" y="14" width="12" height="7" rx="1"/></svg>',
    certificate: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 20l2-2h4l2 2M9 9h6M9 12h4"/></svg>',
    idcard: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="5" width="20" height="14" rx="2"/><circle cx="8" cy="12" r="2"/><path d="M13 10h6M13 14h4"/></svg>',
    ration: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 3h12l1 6a7 7 0 11-14 0z"/><path d="M9 21h6"/></svg>',
    special: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2l2.6 5.4 6 .8-4.3 4.2 1 6-5.3-2.8-5.3 2.8 1-6L3.4 8.2l6-.8z"/></svg>'
  };

  function renderServices() {
    if (!groupsWrap || typeof SERVICE_CATEGORIES === "undefined") return;
    const html = SERVICE_CATEGORIES.map((cat) => `
      <div class="service-group is-shown" data-cat="${cat.id}">
        <div class="group-head">
          <span class="group-icon">${iconPaths[cat.icon] || ""}</span>
          <h3>${cat.title}</h3>
        </div>
        <div class="service-cards">
          ${cat.items.map((name) => `
            <div class="service-card" tabindex="0" data-name="${name.toLowerCase()}">
              <span class="sc-name">${name}</span>
              <div class="sc-badge">MeeSeva</div>
            </div>
          `).join("")}
        </div>
      </div>
    `).join("");
    groupsWrap.innerHTML = html;
    attachCardTilt();
  }
  renderServices();

  const searchInput = document.getElementById("serviceSearch");
  const searchClear = document.getElementById("searchClear");
  const searchEmpty = document.getElementById("searchEmpty");
  const chipRow = document.getElementById("chipRow");
  let activeFilter = "all";

  function normalize(s) { return (s || "").toLowerCase().trim(); }

  function applyFilters() {
    const q = normalize(searchInput.value);
    searchClear.hidden = q.length === 0;

    let impliedCategory = null;
    if (q && typeof SEARCH_SYNONYMS !== "undefined") {
      for (const key in SEARCH_SYNONYMS) {
        if (q.includes(key.toLowerCase())) { impliedCategory = SEARCH_SYNONYMS[key]; break; }
      }
    }

    let anyVisible = false;
    document.querySelectorAll(".service-group").forEach((group) => {
      const cat = group.dataset.cat;
      const catMatches = activeFilter === "all" || activeFilter === cat;
      let groupHasVisible = false;

      group.querySelectorAll(".service-card").forEach((card) => {
        const nameMatches = !q || card.dataset.name.includes(q);
        const categoryBoost = impliedCategory ? cat === impliedCategory : false;
        const visible = catMatches && (nameMatches || (q && categoryBoost));
        card.classList.toggle("is-hidden", !visible);
        if (visible) groupHasVisible = true;
      });

      group.classList.toggle("is-shown", groupHasVisible);
      if (groupHasVisible) anyVisible = true;
    });

    searchEmpty.hidden = anyVisible;
  }

  if (searchInput) {
    searchInput.addEventListener("input", applyFilters);
    searchClear.addEventListener("click", () => {
      searchInput.value = "";
      applyFilters();
      searchInput.focus();
    });
  }
  if (chipRow) {
    chipRow.addEventListener("click", (e) => {
      const chip = e.target.closest(".chip");
      if (!chip) return;
      chipRow.querySelectorAll(".chip").forEach((c) => c.classList.remove("is-active"));
      chip.classList.add("is-active");
      activeFilter = chip.dataset.filter;
      applyFilters();
    });
  }

  function renderMarquee() {
    const track = document.getElementById("marqueeTrack");
    if (!track || typeof MARQUEE_ITEMS === "undefined") return;
    const items = MARQUEE_ITEMS.map((text) => `<span class="marquee-item">${text}</span>`).join("");
    track.innerHTML = items + items;
  }
  renderMarquee();

  function renderTestimonials() {
    const track = document.getElementById("testimonialTrack");
    if (!track || typeof TESTIMONIALS === "undefined") return;
    const html = TESTIMONIALS.map((t) => {
      const stars = "★".repeat(t.stars);
      const initials = t.name.charAt(0);
      return `
        <div class="testimonial-card">
          <div class="testimonial-stars"><span>${stars}</span></div>
          <p class="testimonial-text">"${t.text}"</p>
          <div class="testimonial-author">
            <div class="testimonial-avatar">${initials}</div>
            <div>
              <div class="testimonial-name">${t.name}</div>
              <div class="testimonial-loc">${t.location}</div>
            </div>
          </div>
        </div>
      `;
    }).join("");
    track.innerHTML = html + html;
  }
  renderTestimonials();

  function renderFAQ() {
    const list = document.getElementById("faqList");
    if (!list || typeof FAQ_ITEMS === "undefined") return;
    const chevron = `<svg class="faq-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M6 9l6 6 6-6"/></svg>`;
    list.innerHTML = FAQ_ITEMS.map((item, i) => `
      <div class="faq-item" data-i="${i}">
        <button class="faq-question" aria-expanded="false">
          <span>${item.q}</span>
          ${chevron}
        </button>
        <div class="faq-answer">
          <div class="faq-answer-inner">${item.a}</div>
        </div>
      </div>
    `).join("");

    list.addEventListener("click", (e) => {
      const btn = e.target.closest(".faq-question");
      if (!btn) return;
      const item = btn.closest(".faq-item");
      const isOpen = item.classList.contains("is-open");

      list.querySelectorAll(".faq-item.is-open").forEach((openItem) => {
        openItem.classList.remove("is-open");
        openItem.querySelector(".faq-answer").style.maxHeight = "0";
        openItem.querySelector(".faq-question").setAttribute("aria-expanded", "false");
      });

      if (!isOpen) {
        item.classList.add("is-open");
        const answer = item.querySelector(".faq-answer");
        answer.style.maxHeight = answer.scrollHeight + "px";
        btn.setAttribute("aria-expanded", "true");
      }
    });
  }
  renderFAQ();

  if (!isCoarsePointer && !prefersReducedMotion) {
    document.querySelectorAll(".magnetic").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        el.style.transform = `translate3d(${x * 0.2}px, ${y * 0.28}px, 0)`;
      });
      el.addEventListener("mouseleave", () => { el.style.transform = ""; });
    });
  }

  function attachCardTilt() {
    if (isCoarsePointer || prefersReducedMotion) return;
    document.querySelectorAll(".service-card").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(700px) rotateX(${-py * 10}deg) rotateY(${px * 10}deg) translateY(-6px) translateZ(12px)`;
      });
      card.addEventListener("mouseleave", () => { card.style.transform = ""; });
    });
  }

  /* ================================================================
     9. ULTRA-HIGH-DEFINITION (HD) PROCEDURAL 3D TEXTURE ENGINE
     Generates authentic, crisp 1024x1024 / 1024x1400 canvas textures
     with official Andhra Pradesh emblems, golden seals, holograms,
     Telugu typography, biometric frames, barcodes, and watermarks.
     ================================================================ */
  const HDTextures = (() => {
    const cache = {};

    function makeCanvas(w, h) {
      const cv = document.createElement("canvas");
      cv.width = w; cv.height = h;
      const ctx = cv.getContext("2d");
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      return { cv, ctx };
    }

    function createTexture(cv) {
      if (typeof THREE === "undefined") return null;
      const tex = new THREE.CanvasTexture(cv);
      tex.anisotropy = 4;
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.generateMipmaps = false;
      return tex;
    }

    // Helper: Draw decorative corner brackets
    function drawCornerFiligree(ctx, x, y, size, angle) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.strokeStyle = "#c59b27";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, 0); ctx.lineTo(size, 0);
      ctx.moveTo(0, 0); ctx.lineTo(0, size);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(size * 0.4, size * 0.4, size * 0.25, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(197,155,39,0.3)";
      ctx.fill();
      ctx.restore();
    }

    // Helper: Draw guilloche background security wave
    function drawGuillochePattern(ctx, w, h, col) {
      ctx.save();
      ctx.strokeStyle = col || "rgba(53, 208, 240, 0.04)";
      ctx.lineWidth = 1;
      for (let y = 40; y < h - 40; y += 22) {
        ctx.beginPath();
        for (let x = 0; x < w; x += 15) {
          const cy = y + Math.sin(x * 0.04 + y * 0.1) * 8 + Math.cos(x * 0.02) * 5;
          if (x === 0) ctx.moveTo(x, cy); else ctx.lineTo(x, cy);
        }
        ctx.stroke();
      }
      ctx.restore();
    }

    // Helper: Draw Official AP Emblem / Lion Crest
    function drawEmblem(ctx, cx, cy, r, gold) {
      ctx.save();
      ctx.translate(cx, cy);
      // Outer radiant ring
      const grad = ctx.createRadialGradient(0, 0, r * 0.2, 0, 0, r);
      if (gold) {
        grad.addColorStop(0, "#fff5d0");
        grad.addColorStop(0.5, "#d4af37");
        grad.addColorStop(1, "#8a6d1b");
      } else {
        grad.addColorStop(0, "#7ee8ff");
        grad.addColorStop(0.6, "#1c6b90");
        grad.addColorStop(1, "#0a2d42");
      }
      ctx.strokeStyle = grad;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.stroke();

      // Inner disc
      ctx.fillStyle = gold ? "rgba(212,175,55,0.15)" : "rgba(53,208,240,0.12)";
      ctx.beginPath(); ctx.arc(0, 0, r * 0.88, 0, Math.PI * 2); ctx.fill();

      // Ashoka / Lion emblem silhouette
      ctx.fillStyle = gold ? "#c59b27" : "#35d0f0";
      ctx.beginPath();
      ctx.arc(0, -r * 0.35, r * 0.22, 0, Math.PI * 2);
      ctx.arc(-r * 0.28, -r * 0.28, r * 0.16, 0, Math.PI * 2);
      ctx.arc(r * 0.28, -r * 0.28, r * 0.16, 0, Math.PI * 2);
      ctx.fill();

      // Pillar base
      ctx.fillRect(-r * 0.45, -r * 0.05, r * 0.9, r * 0.15);
      ctx.fillRect(-r * 0.35, r * 0.15, r * 0.7, r * 0.35);
      ctx.fillRect(-r * 0.5, r * 0.5, r * 1.0, r * 0.14);

      // Dharma wheel
      ctx.strokeStyle = gold ? "#8a6d1b" : "#7ee8ff";
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(0, r * 0.3, r * 0.14, 0, Math.PI * 2); ctx.stroke();
      ctx.restore();
    }

    // Helper: Draw Hologram Sticker
    function drawHologram(ctx, x, y, w, h) {
      ctx.save();
      const holoGrad = ctx.createLinearGradient(x, y, x + w, y + h);
      holoGrad.addColorStop(0, "rgba(255, 120, 180, 0.75)");
      holoGrad.addColorStop(0.25, "rgba(255, 230, 100, 0.8)");
      holoGrad.addColorStop(0.5, "rgba(100, 255, 200, 0.85)");
      holoGrad.addColorStop(0.75, "rgba(80, 200, 255, 0.8)");
      holoGrad.addColorStop(1, "rgba(200, 120, 255, 0.75)");
      ctx.fillStyle = holoGrad;
      ctx.beginPath();
      ctx.roundRect ? ctx.roundRect(x, y, w, h, 6) : ctx.rect(x, y, w, h);
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.7)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 13px 'Space Grotesk', sans-serif";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("★ GENUINE ★", x + w / 2, y + h / 2 - 6);
      ctx.font = "bold 10px 'Noto Sans Telugu', sans-serif";
      ctx.fillText("మీ సేవ అధికారికం", x + w / 2, y + h / 2 + 8);
      ctx.restore();
    }

    // Helper: Draw QR Code graphic
    function drawQRCode(ctx, x, y, size) {
      ctx.save();
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(x, y, size, size);
      ctx.fillStyle = "#0c1e33";
      const s = size / 7;
      ctx.fillRect(x, y, s * 2, s * 2);
      ctx.clearRect(x + s * 0.4, y + s * 0.4, s * 1.2, s * 1.2);
      ctx.fillRect(x + s * 0.7, y + s * 0.7, s * 0.6, s * 0.6);

      ctx.fillRect(x + size - s * 2, y, s * 2, s * 2);
      ctx.clearRect(x + size - s * 1.6, y + s * 0.4, s * 1.2, s * 1.2);
      ctx.fillRect(x + size - s * 1.3, y + s * 0.7, s * 0.6, s * 0.6);

      ctx.fillRect(x, y + size - s * 2, s * 2, s * 2);
      ctx.clearRect(x + s * 0.4, y + size - s * 1.6, s * 1.2, s * 1.2);
      ctx.fillRect(x + s * 0.7, y + size - s * 1.3, s * 0.6, s * 0.6);

      for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 6; j++) {
          if ((i + j * 3) % 2 === 0) {
            ctx.fillRect(x + (i + 1) * s, y + (j + 1) * s, s * 0.75, s * 0.75);
          }
        }
      }
      ctx.restore();
    }

    // 1. HD OFFICIAL GOVERNMENT CERTIFICATE (Income / Caste / Agriculture / OBC)
    function certHD(titleText, subtitleText, certId) {
      const key = "cert_" + titleText;
      if (cache[key]) return cache[key];

      const { cv, ctx } = makeCanvas(1024, 1380);
      const W = 1024, H = 1380;

      const bgGrad = ctx.createLinearGradient(0, 0, W, H);
      bgGrad.addColorStop(0, "#fbf8ee");
      bgGrad.addColorStop(0.5, "#f6f1de");
      bgGrad.addColorStop(1, "#eee6ca");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W, H);

      drawGuillochePattern(ctx, W, H, "rgba(180, 145, 60, 0.08)");

      ctx.strokeStyle = "#c59b27";
      ctx.lineWidth = 8;
      ctx.strokeRect(24, 24, W - 48, H - 48);

      ctx.strokeStyle = "#0d2b45";
      ctx.lineWidth = 2;
      ctx.strokeRect(38, 38, W - 76, H - 76);

      ctx.strokeStyle = "rgba(197, 155, 39, 0.6)";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(46, 46, W - 92, H - 92);

      drawCornerFiligree(ctx, 46, 46, 40, 0);
      drawCornerFiligree(ctx, W - 46, 46, 40, Math.PI / 2);
      drawCornerFiligree(ctx, W - 46, H - 46, 40, Math.PI);
      drawCornerFiligree(ctx, 46, H - 46, 40, -Math.PI / 2);

      drawEmblem(ctx, W / 2, 140, 52, true);

      ctx.fillStyle = "#0c2338";
      ctx.textAlign = "center";
      ctx.font = "bold 32px 'Noto Sans Telugu', sans-serif";
      ctx.fillText("ఆంధ్రప్రదేశ్ ప్రభుత్వం", W / 2, 230);

      ctx.font = "600 20px 'Noto Sans Telugu', 'Space Grotesk', sans-serif";
      ctx.fillStyle = "#5c430e";
      ctx.fillText("GOVERNMENT OF ANDHRA PRADESH — REVENUE DEPARTMENT", W / 2, 264);

      ctx.fillStyle = "#c59b27";
      ctx.fillRect(W * 0.25, 285, W * 0.5, 3);

      ctx.fillStyle = "#0c2840";
      ctx.beginPath();
      ctx.roundRect ? ctx.roundRect(W * 0.15, 310, W * 0.7, 75, 14) : ctx.rect(W * 0.15, 310, W * 0.7, 75);
      ctx.fill();
      ctx.strokeStyle = "#d4af37";
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 38px 'Noto Sans Telugu', sans-serif";
      ctx.fillText(titleText || "ఆదాయ ధృవీకరణ పత్రం", W / 2, 362);

      ctx.fillStyle = "#4a3c1c";
      ctx.font = "600 20px 'Space Grotesk', 'Noto Sans Telugu', sans-serif";
      ctx.fillText(`APPLICATION NO: ${certId || "AP-MSV-2026-898510"} | DATE: 2026`, W / 2, 422);

      ctx.save();
      ctx.globalAlpha = 0.06;
      ctx.fillStyle = "#c59b27";
      ctx.font = "bold 110px 'Noto Sans Telugu', sans-serif";
      ctx.fillText("మీ సేవ", W / 2, H / 2 + 40);
      ctx.restore();

      ctx.textAlign = "left";
      ctx.fillStyle = "#1e293b";
      ctx.font = "500 22px 'Noto Sans Telugu', sans-serif";

      const lines = [
        "ఈ ద్వారా ధృవీకరించడమైనది ఏమనగా, దరఖాస్తుదారుని వివరాల ప్రకారం:",
        "పేరు: రమేష్ బాబు గారు (శ్రీ మణికంఠ మీ సేవ ధృవీకరణ)",
        "గ్రామము: వెల్దుర్తి, మండలము: వెల్దుర్తి, జిల్లా: కర్నూలు, ఆంధ్రప్రదేశ్.",
        "ఈ సర్టిఫికేట్ ప్రభుత్వ మరియు పౌర ప్రయోజనముల కొరకు జారీ చేయబడినది.",
        "అన్ని రికార్డులు పరిశీలించి ఆమోదించబడినవి. తనిఖీ పూర్తయినది."
      ];
      lines.forEach((l, i) => {
        ctx.fillText(l, 90, 480 + i * 44);
      });

      ctx.fillStyle = "rgba(197, 155, 39, 0.08)";
      ctx.beginPath();
      ctx.roundRect ? ctx.roundRect(90, 720, W - 180, 200, 10) : ctx.rect(90, 720, W - 180, 200);
      ctx.fill();
      ctx.strokeStyle = "rgba(197, 155, 39, 0.4)";
      ctx.stroke();

      ctx.fillStyle = "#0c2840";
      ctx.font = "bold 20px 'Noto Sans Telugu', 'Space Grotesk', sans-serif";
      ctx.fillText("సేవా కేంద్రం: శ్రీ మణికంఠ మీ సేవ — వెల్దుర్తి", 115, 765);
      ctx.font = "500 18px 'Space Grotesk', sans-serif";
      ctx.fillStyle = "#475569";
      ctx.fillText("CENTER CODE: AP-KRN-VEL-0777", 115, 805);
      ctx.fillText("HELPLINE: +91 8985 100 777 | PORTAL: meeSeva.ap.gov.in", 115, 845);
      ctx.fillText("STATUS: DIGITALLY SIGNED & VERIFIED ✓", 115, 885);

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(W - 270, 745, 140, 150);
      ctx.strokeStyle = "#c59b27"; ctx.lineWidth = 2;
      ctx.strokeRect(W - 270, 745, 140, 150);
      ctx.fillStyle = "#0284c7";
      ctx.beginPath(); ctx.arc(W - 200, 800, 30, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(W - 200, 875, 45, Math.PI, 0); ctx.fill();

      ctx.save();
      ctx.translate(220, 1060);
      ctx.rotate(-0.12);
      ctx.strokeStyle = "#4338ca";
      ctx.lineWidth = 3.5;
      ctx.beginPath(); ctx.arc(0, 0, 85, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(0, 0, 75, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = "#4338ca";
      ctx.textAlign = "center";
      ctx.font = "bold 16px 'Noto Sans Telugu', sans-serif";
      ctx.fillText("శ్రీ మణికంఠ మీ సేవ", 0, -32);
      ctx.font = "bold 20px 'Space Grotesk', sans-serif";
      ctx.fillText("VERIFIED", 0, 4);
      ctx.font = "bold 15px 'Noto Sans Telugu', sans-serif";
      ctx.fillText("వెల్దుర్తి - కర్నూలు", 0, 38);
      ctx.restore();

      drawHologram(ctx, W - 320, 1000, 210, 80);
      drawQRCode(ctx, W - 220, 1140, 120);

      ctx.fillStyle = "#0c1e33";
      for (let x = 90; x < 520; x += 6) {
        const barW = (x % 18 === 0) ? 4 : (x % 12 === 0) ? 3 : 1.5;
        ctx.fillRect(x, 1220, barW, 45);
      }
      ctx.font = "14px 'Space Grotesk', monospace";
      ctx.fillText("8985100777-AP-MEESEVA-2026", 90, 1285);

      const tex = createTexture(cv);
      cache[key] = tex;
      return tex;
    }

    // 2. HD PAN CARD
    function panHD() {
      if (cache["pan"]) return cache["pan"];
      const { cv, ctx } = makeCanvas(1024, 640);
      const W = 1024, H = 640;

      const bg = ctx.createLinearGradient(0, 0, W, H);
      bg.addColorStop(0, "#083358");
      bg.addColorStop(0.5, "#0b4d7c");
      bg.addColorStop(1, "#031d36");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      drawGuillochePattern(ctx, W, H, "rgba(53, 208, 240, 0.08)");

      ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
      ctx.fillRect(0, 0, W, 100);

      drawEmblem(ctx, 60, 50, 32, true);

      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "left";
      ctx.font = "bold 26px 'Noto Sans Telugu', 'Space Grotesk', sans-serif";
      ctx.fillText("ఆదాయపు పన్ను శాఖ / INCOME TAX DEPARTMENT", 110, 44);
      ctx.font = "600 18px 'Space Grotesk', sans-serif";
      ctx.fillStyle = "#f2b74d";
      ctx.fillText("GOVT. OF INDIA — PERMANENT ACCOUNT NUMBER CARD", 110, 78);

      ctx.fillStyle = "#e5b839";
      ctx.beginPath();
      ctx.roundRect ? ctx.roundRect(80, 140, 110, 85, 8) : ctx.rect(80, 140, 110, 85);
      ctx.fill();
      ctx.strokeStyle = "#8f6b10"; ctx.lineWidth = 2; ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(80, 182); ctx.lineTo(190, 182);
      ctx.moveTo(135, 140); ctx.lineTo(135, 225);
      ctx.stroke();

      drawHologram(ctx, 220, 140, 90, 85);

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(80, 270, 180, 220);
      ctx.strokeStyle = "#35d0f0"; ctx.lineWidth = 2; ctx.strokeRect(80, 270, 180, 220);
      ctx.fillStyle = "#0369a1";
      ctx.beginPath(); ctx.arc(170, 350, 42, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(170, 460, 68, Math.PI, 0); ctx.fill();

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 20px 'Space Grotesk', 'Noto Sans Telugu', sans-serif";
      ctx.fillText("పేరు / NAME:", 300, 170);
      ctx.font = "bold 28px 'Space Grotesk', sans-serif";
      ctx.fillStyle = "#7ee8ff";
      ctx.fillText("K. RAMESH BABU", 300, 208);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 18px 'Space Grotesk', 'Noto Sans Telugu', sans-serif";
      ctx.fillText("తండ్రి పేరు / FATHER'S NAME:", 300, 260);
      ctx.font = "bold 22px 'Space Grotesk', sans-serif";
      ctx.fillStyle = "#e2e8f0";
      ctx.fillText("K. VENKATAIAH", 300, 292);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 18px 'Space Grotesk', 'Noto Sans Telugu', sans-serif";
      ctx.fillText("పుట్టిన తేదీ / DATE OF BIRTH:", 300, 345);
      ctx.font = "bold 22px 'Space Grotesk', sans-serif";
      ctx.fillStyle = "#e2e8f0";
      ctx.fillText("15/08/1988", 300, 375);

      ctx.fillStyle = "#f2b74d";
      ctx.font = "bold 20px 'Space Grotesk', sans-serif";
      ctx.fillText("PAN NUMBER:", 300, 435);
      ctx.font = "bold 44px 'Space Grotesk', monospace";
      ctx.fillStyle = "#ffffff";
      ctx.fillText("ABCDE8985K", 300, 485);

      drawQRCode(ctx, W - 220, 270, 150);

      ctx.fillStyle = "rgba(255,255,255,0.85)";
      ctx.fillRect(300, 525, 280, 55);
      ctx.fillStyle = "#0c2338";
      ctx.font = "italic bold 24px 'Brush Script MT', cursive, sans-serif";
      ctx.fillText("Ramesh Babu", 340, 562);

      ctx.fillStyle = "rgba(53,208,240,0.6)";
      ctx.font = "bold 16px 'Noto Sans Telugu', sans-serif";
      ctx.fillText("శ్రీ మణికంఠ మీ సేవ — వెల్దుర్తి జారీ సేవ", W - 380, 595);

      const tex = createTexture(cv);
      cache["pan"] = tex;
      return tex;
    }

    // 3. HD AADHAAR CARD
    function aadhaarHD() {
      if (cache["aadhaar"]) return cache["aadhaar"];
      const { cv, ctx } = makeCanvas(1024, 640);
      const W = 1024, H = 640;

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, W, H);

      const topGrad = ctx.createLinearGradient(0, 0, W, 0);
      topGrad.addColorStop(0, "#ff9933");
      topGrad.addColorStop(0.5, "#ffffff");
      topGrad.addColorStop(1, "#138808");
      ctx.fillStyle = topGrad;
      ctx.fillRect(0, 0, W, 14);

      drawGuillochePattern(ctx, W, H, "rgba(255, 153, 51, 0.08)");

      drawEmblem(ctx, 70, 75, 38, false);

      ctx.fillStyle = "#b91c1c";
      ctx.textAlign = "center";
      ctx.font = "bold 26px 'Noto Sans Telugu', sans-serif";
      ctx.fillText("భారత విశిష్ట గుర్తింపు ప్రాధికార సంస్థ", W / 2 + 20, 54);
      ctx.font = "600 18px 'Space Grotesk', sans-serif";
      ctx.fillStyle = "#1e3a8a";
      ctx.fillText("UNIQUE IDENTIFICATION AUTHORITY OF INDIA", W / 2 + 20, 85);

      ctx.strokeStyle = "#e2e8f0";
      ctx.lineWidth = 2;
      ctx.strokeRect(30, 110, W - 60, H - 150);

      ctx.fillStyle = "#f8fafc";
      ctx.fillRect(65, 145, 190, 230);
      ctx.strokeStyle = "#94a3b8"; ctx.lineWidth = 2; ctx.strokeRect(65, 145, 190, 230);
      ctx.fillStyle = "#475569";
      ctx.beginPath(); ctx.arc(160, 230, 46, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(160, 345, 75, Math.PI, 0); ctx.fill();

      ctx.textAlign = "left";
      ctx.fillStyle = "#0f172a";
      ctx.font = "bold 26px 'Noto Sans Telugu', sans-serif";
      ctx.fillText("కె. రమేష్ బాబు", 290, 175);
      ctx.font = "bold 24px 'Space Grotesk', sans-serif";
      ctx.fillText("K. Ramesh Babu", 290, 215);

      ctx.fillStyle = "#475569";
      ctx.font = "500 20px 'Noto Sans Telugu', sans-serif";
      ctx.fillText("పుట్టిన తేదీ / DOB: 15/08/1988", 290, 265);
      ctx.fillText("లింగము / Gender: పురుషుడు / MALE", 290, 305);
      ctx.fillText("చిరునామా: రైల్వే స్టేషన్ రోడ్, వెల్దుర్తి, కర్నూలు.", 290, 345);

      drawQRCode(ctx, W - 220, 145, 150);

      ctx.fillStyle = "#0f172a";
      ctx.textAlign = "center";
      ctx.font = "bold 46px 'Space Grotesk', monospace";
      ctx.fillText("XXXX  XXXX  8985", W / 2, 455);

      ctx.fillStyle = "#dc2626";
      ctx.fillRect(30, 500, W - 60, 48);
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 22px 'Noto Sans Telugu', sans-serif";
      ctx.fillText("ఆధార్ — సామాన్యుడి హక్కు / శ్రీ మణికంఠ మీ సేవ వెల్దుర్తి", W / 2, 532);

      const tex = createTexture(cv);
      cache["aadhaar"] = tex;
      return tex;
    }

    // 4. HD RICE / RATION CARD
    function rationHD() {
      if (cache["ration"]) return cache["ration"];
      const { cv, ctx } = makeCanvas(1024, 640);
      const W = 1024, H = 640;

      const bg = ctx.createLinearGradient(0, 0, W, H);
      bg.addColorStop(0, "#4a2408");
      bg.addColorStop(0.5, "#783c10");
      bg.addColorStop(1, "#361803");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      drawGuillochePattern(ctx, W, H, "rgba(242, 183, 77, 0.1)");

      drawEmblem(ctx, 65, 55, 34, true);

      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "left";
      ctx.font = "bold 26px 'Noto Sans Telugu', sans-serif";
      ctx.fillText("ఆంధ్రప్రదేశ్ ప్రభుత్వం — పౌర సరఫరాల శాఖ", 115, 48);
      ctx.font = "600 18px 'Space Grotesk', sans-serif";
      ctx.fillStyle = "#fcd34d";
      ctx.fillText("PUBLIC DISTRIBUTION SYSTEM — AP RICE CARD", 115, 80);

      ctx.fillStyle = "rgba(0,0,0,0.4)";
      ctx.fillRect(40, 110, W - 80, 70);
      ctx.fillStyle = "#fef08a";
      ctx.font = "bold 22px 'Space Grotesk', sans-serif";
      ctx.fillText("RICE CARD NO:", 65, 152);
      ctx.font = "bold 34px 'Space Grotesk', monospace";
      ctx.fillStyle = "#ffffff";
      ctx.fillText("WAP138985100777", 250, 154);

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(65, 210, 160, 190);
      ctx.strokeStyle = "#f59e0b"; ctx.lineWidth = 2; ctx.strokeRect(65, 210, 160, 190);
      ctx.fillStyle = "#b45309";
      ctx.beginPath(); ctx.arc(145, 275, 38, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(145, 370, 58, Math.PI, 0); ctx.fill();

      ctx.font = "bold 22px 'Noto Sans Telugu', sans-serif";
      ctx.fillStyle = "#ffffff";
      ctx.fillText("కుటుంబ పెద్ద: లక్ష్మీ దేవి గారు", 260, 240);
      ctx.font = "500 19px 'Noto Sans Telugu', sans-serif";
      ctx.fillStyle = "#fef3c7";
      ctx.fillText("గ్రామము / వార్డు: వెల్దుర్తి", 260, 280);
      ctx.fillText("మండలము: వెల్దుర్తి, జిల్లా: కర్నూలు", 260, 320);
      ctx.fillText("FP షాప్ నంబర్: 1324008", 260, 360);

      const cols = ["#38bdf8", "#4ade80", "#fbbf24", "#a78bfa", "#f472b6"];
      const names = ["లక్ష్మి", "రమేష్", "సురేష్", "అనిత", "భవాని"];
      cols.forEach((col, i) => {
        ctx.fillStyle = col;
        ctx.beginPath();
        ctx.arc(300 + i * 90, 440, 26, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#0c2840";
        ctx.font = "bold 15px 'Noto Sans Telugu', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(names[i], 300 + i * 90, 445);
      });

      drawHologram(ctx, W - 260, 210, 190, 90);
      drawQRCode(ctx, W - 235, 330, 140);

      ctx.textAlign = "left";
      ctx.fillStyle = "rgba(255,255,255,0.15)";
      ctx.fillRect(0, H - 70, W, 70);
      ctx.fillStyle = "#fef08a";
      ctx.font = "bold 18px 'Noto Sans Telugu', sans-serif";
      ctx.fillText("శ్రీ మణికంఠ మీ సేవ — రేషన్ కార్డ్ కొత్త అప్లికేషన్ & సభ్యుల చేర్పు కేంద్రం (వెల్దుర్తి)", 45, H - 28);

      const tex = createTexture(cv);
      cache["ration"] = tex;
      return tex;
    }

    // 5. HD DRIVING LICENSE / SMART PVC CARD
    function licenseHD() {
      if (cache["license"]) return cache["license"];
      const { cv, ctx } = makeCanvas(1024, 640);
      const W = 1024, H = 640;

      const bg = ctx.createLinearGradient(0, 0, W, H);
      bg.addColorStop(0, "#064e3b");
      bg.addColorStop(0.5, "#065f46");
      bg.addColorStop(1, "#022c22");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      drawGuillochePattern(ctx, W, H, "rgba(52, 211, 153, 0.1)");

      drawEmblem(ctx, 65, 55, 34, true);

      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "left";
      ctx.font = "bold 26px 'Noto Sans Telugu', 'Space Grotesk', sans-serif";
      ctx.fillText("ఆంధ్రప్రదేశ్ రవాణా శాఖ / TRANSPORT DEPARTMENT", 115, 48);
      ctx.font = "600 18px 'Space Grotesk', sans-serif";
      ctx.fillStyle = "#6ee7b7";
      ctx.fillText("GOVERNMENT OF ANDHRA PRADESH — DRIVING LICENCE", 115, 80);

      ctx.fillStyle = "#e5b839";
      ctx.fillRect(75, 140, 100, 80);
      ctx.strokeStyle = "#78350f"; ctx.lineWidth = 2; ctx.strokeRect(75, 140, 100, 80);

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(75, 250, 170, 210);
      ctx.strokeStyle = "#34d399"; ctx.lineWidth = 2; ctx.strokeRect(75, 250, 170, 210);
      ctx.fillStyle = "#047857";
      ctx.beginPath(); ctx.arc(160, 325, 40, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(160, 430, 65, Math.PI, 0); ctx.fill();

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 20px 'Space Grotesk', sans-serif";
      ctx.fillText("DL NO:", 280, 160);
      ctx.font = "bold 32px 'Space Grotesk', monospace";
      ctx.fillStyle = "#fef08a";
      ctx.fillText("AP-21-2026-0089851", 370, 162);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 22px 'Space Grotesk', 'Noto Sans Telugu', sans-serif";
      ctx.fillText("NAME: K. RAMESH BABU", 280, 220);
      ctx.font = "500 18px 'Space Grotesk', sans-serif";
      ctx.fillStyle = "#d1fae5";
      ctx.fillText("DOB: 15/08/1988 | BLOOD GRP: O+ve", 280, 260);
      ctx.fillText("VEHICLE CLASS: LMV, MCWG (GEAR)", 280, 300);
      ctx.fillText("VALIDITY: 14/08/2046 | RTO: KURNOOL", 280, 340);

      ctx.fillStyle = "#059669";
      ctx.beginPath(); ctx.roundRect ? ctx.roundRect(280, 380, 110, 40, 8) : ctx.rect(280, 380, 110, 40); ctx.fill();
      ctx.fillStyle = "#ffffff"; ctx.font = "bold 16px 'Space Grotesk', sans-serif"; ctx.fillText("LMV NON-TR", 290, 406);

      ctx.fillStyle = "#0284c7";
      ctx.beginPath(); ctx.roundRect ? ctx.roundRect(410, 380, 90, 40, 8) : ctx.rect(410, 380, 90, 40); ctx.fill();
      ctx.fillStyle = "#ffffff"; ctx.fillText("MCWG", 430, 406);

      drawQRCode(ctx, W - 220, 180, 150);
      drawHologram(ctx, W - 220, 360, 150, 70);

      ctx.fillStyle = "rgba(255,255,255,0.12)";
      ctx.fillRect(0, H - 70, W, 70);
      ctx.fillStyle = "#a7f3d0";
      ctx.font = "bold 18px 'Noto Sans Telugu', sans-serif";
      ctx.fillText("శ్రీ మణికంఠ మీ సేవ — డ్రైవింగ్ లైసెన్స్ & లెర్నింగ్ సర్వీసెస్ (వెల్దుర్తి)", 45, H - 28);

      const tex = createTexture(cv);
      cache["license"] = tex;
      return tex;
    }

    // 6. HD REVERSE SIDE TEXTURE (For 3D 360° Rotations)
    function backHD(label) {
      const key = "back_" + (label || "card");
      if (cache[key]) return cache[key];
      const { cv, ctx } = makeCanvas(1024, 640);
      const W = 1024, H = 640;

      ctx.fillStyle = "#0b1f33";
      ctx.fillRect(0, 0, W, H);

      ctx.fillStyle = "#02070d";
      ctx.fillRect(0, 50, W, 100);

      ctx.fillStyle = "#f8fafc";
      ctx.fillRect(60, 190, W - 120, 75);
      ctx.fillStyle = "#0f172a";
      ctx.font = "italic bold 22px 'Brush Script MT', cursive, sans-serif";
      ctx.fillText("Authorized Signatory — Sri Manikanta MeeSeva Veldurthi", 80, 235);

      ctx.fillStyle = "#94a3b8";
      ctx.font = "14px 'Space Grotesk', 'Noto Sans Telugu', sans-serif";
      ctx.fillText("1. This document/card is valid throughout India for official citizen identification.", 60, 310);
      ctx.fillText("2. Issued through MeeSeva portal. If found, please return to Sri Manikanta MeeSeva, Railway Station Rd, Veldurthi.", 60, 345);
      ctx.fillText("3. 24x7 Customer Support & Verification WhatsApp: +91 8985 100 777", 60, 380);

      ctx.fillStyle = "#ffffff";
      for (let x = 60; x < W - 60; x += 5) {
        const bw = (x % 15 === 0) ? 3.5 : (x % 10 === 0) ? 2.5 : 1.2;
        ctx.fillRect(x, 430, bw, 65);
      }
      ctx.textAlign = "center";
      ctx.font = "bold 18px 'Space Grotesk', monospace";
      ctx.fillText("AP-MSV-KRN-VELDURTHI-8985100777", W / 2, 530);

      const tex = createTexture(cv);
      cache[key] = tex;
      return tex;
    }

    return { certHD, panHD, aadhaarHD, rationHD, licenseHD, backHD };
  })();

  /* ================================================================
     10. ULTRA-PREMIUM 3D OBJECT FACTORY (PBR Materials & Geometries)
     ================================================================ */
  const SF = (() => {
    function rrShape(w, h, r) {
      const s = new THREE.Shape();
      s.moveTo(-w / 2 + r, -h / 2);
      s.lineTo(w / 2 - r, -h / 2);
      s.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
      s.lineTo(w / 2, h / 2 - r);
      s.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
      s.lineTo(-w / 2 + r, h / 2);
      s.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
      s.lineTo(-w / 2, -h / 2 + r);
      s.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
      return s;
    }

    function smartCard(type) {
      const w = 3.6, h = 2.26, d = 0.08;
      const g = new THREE.Group();
      let frontTex;

      if (type === "pan") frontTex = HDTextures.panHD();
      else if (type === "aadhaar") frontTex = HDTextures.aadhaarHD();
      else if (type === "ration") frontTex = HDTextures.rationHD();
      else if (type === "license") frontTex = HDTextures.licenseHD();
      else frontTex = HDTextures.panHD();

      const backTex = HDTextures.backHD(type);

      const shape = rrShape(w, h, 0.12);
      const geo = new THREE.ExtrudeGeometry(shape, {
        depth: d,
        bevelEnabled: true,
        bevelThickness: 0.025,
        bevelSize: 0.025,
        bevelSegments: 3,
        curveSegments: 16
      });

      const frontMat = new THREE.MeshPhysicalMaterial({
        map: frontTex,
        metalness: 0.25,
        roughness: 0.25,
        clearcoat: 0.85,
        clearcoatRoughness: 0.12,
        reflectivity: 0.9,
        side: THREE.FrontSide
      });

      const backMat = new THREE.MeshPhysicalMaterial({
        map: backTex,
        metalness: 0.2,
        roughness: 0.35,
        clearcoat: 0.5,
        clearcoatRoughness: 0.2,
        side: THREE.BackSide
      });

      const rimMat = new THREE.MeshStandardMaterial({
        color: 0xf2b74d,
        metalness: 0.85,
        roughness: 0.2,
        emissive: 0x8a6d1b,
        emissiveIntensity: 0.2
      });

      const mesh = new THREE.Mesh(geo, [frontMat, rimMat]);
      mesh.position.z = -d / 2;
      g.add(mesh);

      const backPlate = new THREE.Mesh(new THREE.PlaneGeometry(w, h), backMat);
      backPlate.position.z = -d / 2 - 0.005;
      backPlate.rotation.y = Math.PI;
      g.add(backPlate);

      const edges = new THREE.LineSegments(
        new THREE.EdgesGeometry(geo),
        new THREE.LineBasicMaterial({ color: 0x7ee8ff, transparent: true, opacity: 0.4 })
      );
      edges.position.z = -d / 2;
      g.add(edges);

      return g;
    }

    function certificate3D(title, id) {
      const w = 4.2, h = 5.6, d = 0.04;
      const g = new THREE.Group();
      const frontTex = HDTextures.certHD(title || "ఆదాయ ధృవీకరణ పత్రం", "", id || "AP-MSV-2026-898510");

      const shape = rrShape(w, h, 0.08);
      const geo = new THREE.ExtrudeGeometry(shape, {
        depth: d,
        bevelEnabled: true,
        bevelThickness: 0.015,
        bevelSize: 0.015,
        bevelSegments: 2,
        curveSegments: 12
      });

      const certMat = new THREE.MeshPhysicalMaterial({
        map: frontTex,
        metalness: 0.1,
        roughness: 0.4,
        clearcoat: 0.6,
        clearcoatRoughness: 0.2,
        emissive: 0xffffff,
        emissiveIntensity: 0.05
      });

      const mesh = new THREE.Mesh(geo, certMat);
      mesh.position.z = -d / 2;
      g.add(mesh);

      const sealGeo = new THREE.CylinderGeometry(0.48, 0.48, 0.04, 32);
      const sealMat = new THREE.MeshStandardMaterial({
        color: 0xd4af37,
        metalness: 0.9,
        roughness: 0.15,
        emissive: 0x7a5a0c,
        emissiveIntensity: 0.35
      });
      const sealMesh = new THREE.Mesh(sealGeo, sealMat);
      sealMesh.rotation.x = Math.PI / 2;
      sealMesh.position.set(w * 0.28, -h * 0.28, d / 2 + 0.02);
      g.add(sealMesh);

      const ribGeo = new THREE.BoxGeometry(0.18, 0.8, 0.01);
      const ribMat = new THREE.MeshStandardMaterial({ color: 0xb91c1c, metalness: 0.4, roughness: 0.5 });
      const rib1 = new THREE.Mesh(ribGeo, ribMat);
      rib1.position.set(w * 0.23, -h * 0.34, d / 2 + 0.01);
      rib1.rotation.z = 0.3;
      const rib2 = new THREE.Mesh(ribGeo, ribMat);
      rib2.position.set(w * 0.33, -h * 0.34, d / 2 + 0.01);
      rib2.rotation.z = -0.3;
      g.add(rib1); g.add(rib2);

      return g;
    }

    function printer3D() {
      const g = new THREE.Group();
      const body = new THREE.Mesh(
        new THREE.BoxGeometry(3.6, 1.4, 2.4),
        new THREE.MeshPhysicalMaterial({ color: 0x0f172a, metalness: 0.5, roughness: 0.35, clearcoat: 0.4 })
      );
      body.position.y = 0.2; g.add(body);

      const topScanner = new THREE.Mesh(
        new THREE.BoxGeometry(3.6, 0.2, 2.4),
        new THREE.MeshPhysicalMaterial({ color: 0x1e293b, metalness: 0.6, roughness: 0.2, clearcoat: 0.8 })
      );
      topScanner.position.y = 0.95; g.add(topScanner);

      const glass = new THREE.Mesh(
        new THREE.BoxGeometry(2.8, 0.02, 1.8),
        new THREE.MeshPhysicalMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.6, roughness: 0.05, clearcoat: 1 })
      );
      glass.position.set(0, 1.05, 0); g.add(glass);

      const laserBar = new THREE.Mesh(
        new THREE.BoxGeometry(0.12, 0.04, 1.8),
        new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x38bdf8, emissiveIntensity: 2.5 })
      );
      laserBar.position.set(0, 1.07, 0); g.add(laserBar);

      const tray = new THREE.Mesh(
        new THREE.BoxGeometry(2.6, 0.08, 1.6),
        new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.3, roughness: 0.6 })
      );
      tray.position.set(0, -0.45, 0.8); g.add(tray);

      const led = new THREE.Mesh(
        new THREE.SphereGeometry(0.08, 16, 16),
        new THREE.MeshStandardMaterial({ color: 0x4ade80, emissive: 0x4ade80, emissiveIntensity: 1.5 })
      );
      led.position.set(1.4, 0.55, 1.22); g.add(led);

      return g;
    }

    function passbook3D() {
      const w = 2.8, h = 3.8, t = 0.35;
      const g = new THREE.Group();
      const geo = new THREE.BoxGeometry(w, h, t);
      const mat = new THREE.MeshPhysicalMaterial({
        color: 0x0f2942,
        metalness: 0.25,
        roughness: 0.45,
        clearcoat: 0.65,
        clearcoatRoughness: 0.2
      });
      g.add(new THREE.Mesh(geo, mat));

      const seal = new THREE.Mesh(
        new THREE.CircleGeometry(0.42, 32),
        new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.8, roughness: 0.2, emissive: 0xb45309, emissiveIntensity: 0.4 })
      );
      seal.position.set(0, 0.55, t / 2 + 0.01); g.add(seal);

      const title = new THREE.Mesh(
        new THREE.BoxGeometry(w * 0.7, 0.22, 0.01),
        new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.8, roughness: 0.2, emissive: 0xb45309, emissiveIntensity: 0.3 })
      );
      title.position.set(0, -0.35, t / 2 + 0.01); g.add(title);

      return g;
    }

    return { smartCard, certificate3D, printer3D, passbook3D, rrShape };
  })();

  /* ================================================================
     11. HERO 3D SCENE — INTERACTIVE CINEMATIC SERVICE UNIVERSE
     Centerpiece: Holographic Crystal Certificate + MeeSeva Emblem
     Orbiting Galaxy: High-Def Cards with Touch-Drag & Gyro Tilt
     ================================================================ */
  function initHeroScene() {
    const canvas = document.getElementById("heroCanvas");
    const heroSection = document.querySelector(".hero");
    if (!canvas || !heroSection || typeof THREE === "undefined" || !webglAvailable) return;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: !isLowPower, powerPreference: "high-performance" });
      renderer.setPixelRatio(deviceDPR);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.35;
    } catch (e) {
      canvas.style.background = "radial-gradient(ellipse at center, #0b2740 0%, #030b16 100%)";
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(isMobileScreen ? 48 : 40, 1, 0.1, 150);
    camera.position.set(0, 0, isMobileScreen ? 17 : 14);

    function resize() {
      const w = heroSection.clientWidth, h = heroSection.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.fov = w < 768 ? 48 : 40;
      camera.position.z = w < 768 ? 16.5 : 14;
      camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener("resize", resize);

    scene.add(new THREE.AmbientLight(0x2d4b68, 0.75));

    const keyLight = new THREE.PointLight(0x38bdf8, 4.5, 45);
    keyLight.position.set(6, 6, 9); scene.add(keyLight);

    const rimGoldLight = new THREE.PointLight(0xfbbf24, 3.2, 40);
    rimGoldLight.position.set(-7, -4, 7); scene.add(rimGoldLight);

    const fillVioletLight = new THREE.PointLight(0x818cf8, 1.8, 30);
    fillVioletLight.position.set(0, -7, 6); scene.add(fillVioletLight);

    const backCyanLight = new THREE.PointLight(0x7ee8ff, 1.5, 35);
    backCyanLight.position.set(0, 4, -9); scene.add(backCyanLight);

    const centerCert = SF.certificate3D("శ్రీ మణికంఠ మీ సేవ", "AP-MSV-2026-KURNOOL");
    centerCert.scale.set(1.05, 1.05, 1.05);
    scene.add(centerCert);

    const cardDefs = [
      { mk: () => SF.smartCard("pan"), ly: 1, name: "PAN" },
      { mk: () => SF.smartCard("aadhaar"), ly: 1, name: "AADHAAR" },
      { mk: () => SF.smartCard("ration"), ly: 1, name: "RATION" },
      { mk: () => SF.smartCard("license"), ly: 1, name: "LICENSE" },
      { mk: () => SF.certificate3D("కుల ధృవీకరణ పత్రం", "AP-CASTE-2026"), ly: 2, name: "CASTE" },
      { mk: () => SF.passbook3D(), ly: 2, name: "PASSBOOK" },
      { mk: () => SF.smartCard("pan"), ly: 3, name: "PVC" },
      { mk: () => SF.certificate3D("OBC / EWS సర్టిఫికేట్", "AP-EWS-2026"), ly: 3, name: "EWS" },
    ];

    const count = isLowPower ? 5 : cardDefs.length;
    const layerRadius = { 1: isMobileScreen ? 3.8 : 4.4, 2: isMobileScreen ? 5.8 : 6.8, 3: isMobileScreen ? 7.6 : 9.2 };
    const layerScale = { 1: 0.42, 2: 0.32, 3: 0.26 };
    const layerSpeed = { 1: 0.16, 2: 0.10, 3: 0.07 };
    const orbitingCards = [];

    for (let i = 0; i < count; i++) {
      const def = cardDefs[i];
      const obj = def.mk();
      const ly = def.ly;
      const sc = layerScale[ly];
      obj.scale.set(sc, sc, sc);

      const angle = (i / count) * Math.PI * 2 + (ly * 0.8);
      const rad = layerRadius[ly];
      const sp = layerSpeed[ly];

      obj.userData = { angle, rad, sp, ly, seed: i * 1.3 };
      scene.add(obj);
      orbitingCards.push(obj);
    }

    const orbitRings = [];
    [
      { r: layerRadius[1], c: 0x38bdf8, o: 0.18 },
      { r: layerRadius[2], c: 0x818cf8, o: 0.14 },
      { r: layerRadius[3], c: 0xfbbf24, o: 0.10 }
    ].forEach(({ r, c, o }) => {
      const torus = new THREE.Mesh(
        new THREE.TorusGeometry(r, 0.012, 12, 120),
        new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: o })
      );
      torus.rotation.x = Math.PI * 0.42;
      scene.add(torus);
      orbitRings.push(torus);
    });

    const pCount = isLowPower ? 70 : 220;
    const pPositions = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      pPositions[i * 3] = (Math.random() - 0.5) * 32;
      pPositions[i * 3 + 1] = (Math.random() - 0.5) * 22;
      pPositions[i * 3 + 2] = (Math.random() - 0.5) * 18 - 2;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPositions, 3));
    const starField = new THREE.Points(
      pGeo,
      new THREE.PointsMaterial({ color: 0x7ee8ff, size: 0.05, transparent: true, opacity: 0.5, sizeAttenuation: true })
    );
    scene.add(starField);

    const mouse = { x: 0, y: 0 };
    const smoothMouse = { x: 0, y: 0 };
    let isDragging = false;
    let dragStart = { x: 0, y: 0 };
    let dragRotation = { x: 0, y: 0 };
    let dragVelocity = { x: 0, y: 0 };

    function onPointerMove(e) {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      mouse.x = (clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(clientY / window.innerHeight) * 2 + 1;

      if (isDragging) {
        const dx = clientX - dragStart.x;
        const dy = clientY - dragStart.y;
        dragVelocity.x = dx * 0.005;
        dragVelocity.y = dy * 0.005;
        dragRotation.y += dragVelocity.x;
        dragRotation.x += dragVelocity.y;
        dragStart.x = clientX;
        dragStart.y = clientY;
      }
    }

    heroSection.addEventListener("mousedown", (e) => {
      isDragging = true;
      dragStart.x = e.clientX; dragStart.y = e.clientY;
    });
    heroSection.addEventListener("touchstart", (e) => {
      isDragging = true;
      dragStart.x = e.touches[0].clientX; dragStart.y = e.touches[0].clientY;
    }, { passive: true });

    window.addEventListener("mouseup", () => { isDragging = false; });
    window.addEventListener("touchend", () => { isDragging = false; });
    window.addEventListener("mousemove", onPointerMove, { passive: true });
    heroSection.addEventListener("touchmove", onPointerMove, { passive: true });

    if (window.DeviceOrientationEvent && isCoarsePointer) {
      window.addEventListener("deviceorientation", (e) => {
        if (e.gamma !== null && e.beta !== null) {
          mouse.x = Math.min(Math.max(e.gamma / 30, -1), 1);
          mouse.y = Math.min(Math.max((e.beta - 45) / 30, -1), 1);
        }
      }, { passive: true });
    }

    let scrollProgress = 0;
    function updateHeroScroll() {
      const rect = heroSection.getBoundingClientRect();
      scrollProgress = Math.min(Math.max(-rect.top / heroSection.offsetHeight, 0), 1);
    }
    window.addEventListener("scroll", updateHeroScroll, { passive: true });
    updateHeroScroll();

    let isHeroVisible = true;
    new IntersectionObserver((entries) => {
      isHeroVisible = entries[0].isIntersecting;
    }, { threshold: 0 }).observe(heroSection);

    const clock = new THREE.Clock();

    function renderHero() {
      requestAnimationFrame(renderHero);
      if (!isHeroVisible) return;

      const t = clock.getElapsedTime();
      smoothMouse.x += (mouse.x - smoothMouse.x) * 0.05;
      smoothMouse.y += (mouse.y - smoothMouse.y) * 0.05;

      if (!isDragging) {
        dragVelocity.x *= 0.92;
        dragVelocity.y *= 0.92;
        dragRotation.y += dragVelocity.x;
        dragRotation.x += dragVelocity.y;
      }

      centerCert.rotation.x = smoothMouse.y * 0.35 + dragRotation.x + Math.sin(t * 0.4) * 0.04;
      centerCert.rotation.y = smoothMouse.x * 0.45 + dragRotation.y + t * 0.09 + scrollProgress * 2.2;
      centerCert.position.y = Math.sin(t * 0.5) * 0.15;
      centerCert.position.z = -scrollProgress * 3.5;
      const cScale = (1.05 - scrollProgress * 0.3);
      centerCert.scale.set(cScale, cScale, cScale);

      keyLight.position.x = 6 + Math.sin(t * 0.6) * 2;
      rimGoldLight.position.y = -4 + Math.cos(t * 0.5) * 2;

      orbitingCards.forEach((o) => {
        const { angle, rad, sp, ly, seed } = o.userData;
        const spread = 1 + scrollProgress * 0.7;
        const curAngle = angle + t * sp + dragRotation.y * 0.5 + scrollProgress * (1.8 - ly * 0.3);
        const r = rad * spread;

        o.position.x = Math.cos(curAngle) * r;
        o.position.y = Math.sin(curAngle) * r * 0.45 + Math.sin(t * 0.7 + seed) * 0.25;
        o.position.z = Math.sin(curAngle * 0.5) * 1.8 - 2 - scrollProgress * (4.5 - ly);

        o.rotation.x = Math.sin(curAngle) * 0.3 + smoothMouse.y * 0.2;
        o.rotation.y = curAngle + Math.PI / 2 + t * 0.2;
        o.rotation.z = Math.sin(t * 0.5 + seed) * 0.1;
      });

      orbitRings.forEach((ring, idx) => {
        ring.rotation.z = t * (0.05 + idx * 0.015);
        ring.rotation.x = Math.PI * 0.42 + Math.sin(t * 0.15 + idx) * 0.04;
      });
      starField.rotation.y = t * 0.012;

      camera.position.z = (isMobileScreen ? 16.5 : 14) - scrollProgress * 4.2;
      camera.position.y = scrollProgress * 0.9;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    }
    renderHero();
  }

  function initPrinterScene() {
    const pc = document.getElementById("printerCanvas");
    if (!pc || typeof THREE === "undefined" || !webglAvailable) return;
    const parent = pc.parentElement;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: pc, alpha: true, antialias: !isLowPower });
      renderer.setPixelRatio(deviceDPR);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.3;
    } catch (e) {
      pc.style.background = "radial-gradient(ellipse at center, #0b2740 0%, #030b16 100%)";
      return;
    }
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 50);
    camera.position.set(0, 1.8, 6.8); camera.lookAt(0, 0, 0);

    function resize() {
      const w = parent.clientWidth, h = Math.min(320, w * 0.75);
      pc.style.height = h + "px";
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener("resize", resize);

    scene.add(new THREE.AmbientLight(0x38bdf8, 0.7));
    const kl = new THREE.PointLight(0x38bdf8, 3.5, 20); kl.position.set(3, 4, 5); scene.add(kl);
    const rl = new THREE.PointLight(0xfbbf24, 2, 18); rl.position.set(-3, -2, 4); scene.add(rl);

    const printer = SF.printer3D();
    printer.scale.set(0.85, 0.85, 0.85);
    scene.add(printer);

    const cert = SF.certificate3D("కలర్ జిరాక్స్", "AP-PRINT-2026");
    cert.scale.set(0.48, 0.48, 0.48);
    cert.position.set(0, -0.2, 0.6);
    scene.add(cert);

    let isVis = false;
    new IntersectionObserver((e) => { isVis = e[0].isIntersecting; }, { threshold: 0.1 }).observe(parent);

    const clock = new THREE.Clock();
    function animate() {
      requestAnimationFrame(animate);
      if (!isVis) return;
      const t = clock.getElapsedTime();
      printer.rotation.y = Math.sin(t * 0.4) * 0.12;
      cert.position.y = -0.2 + Math.sin(t * 0.8) * 0.05;
      cert.rotation.y = printer.rotation.y + Math.sin(t * 0.6) * 0.08;
      renderer.render(scene, camera);
    }
    animate();
  }

  if (!prefersReducedMotion && typeof THREE !== "undefined" && webglAvailable) {
    initHeroScene();
    initPrinterScene();
  }

  /* ================================================================
     12. CINEMATIC 3D SERVICE SHOWCASE STAGES
     ================================================================ */
  const CinScenes = (() => {
    const active = [];
    const sceneFns = {};

    function mkScene(canvas) {
      let r, s, c;
      try {
        r = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: !isLowPower, powerPreference: "high-performance" });
        r.setPixelRatio(deviceDPR);
        r.toneMapping = THREE.ACESFilmicToneMapping;
        r.toneMappingExposure = 1.3;
      } catch (e) {
        canvas.style.background = "radial-gradient(ellipse at center, #0b2740 0%, #030b16 100%)";
        return { r: null, s: null, c: null };
      }
      s = new THREE.Scene();
      c = new THREE.PerspectiveCamera(36, 1, 0.1, 80);
      c.position.set(0, 1.2, 8); c.lookAt(0, 0, 0);

      s.add(new THREE.AmbientLight(0x3a5a78, 0.75));
      const k = new THREE.PointLight(0x38bdf8, 3.8, 30); k.position.set(4, 4, 6); s.add(k);
      const ri = new THREE.PointLight(0xfbbf24, 2.4, 26); ri.position.set(-4, -3, 5); s.add(ri);
      const f = new THREE.PointLight(0x818cf8, 1.2, 20); f.position.set(0, -4, 4); s.add(f);

      return { r, s, c };
    }

    function fitRenderer(r, c, el) {
      if (!r || !c || !el) return;
      const w = el.clientWidth, h = el.clientHeight;
      r.setSize(w, h, false);
      c.aspect = w / h;
      c.updateProjectionMatrix();
    }

    sceneFns.xerox = (scene, cam) => {
      cam.position.set(0, 1.2, 7.5);
      const docOrig = SF.certificate3D("ఒరిజినల్ డాక్యుమెంట్", "DOC-001");
      docOrig.scale.set(0.65, 0.65, 0.65);
      docOrig.position.set(-1.8, 0.5, 0);
      scene.add(docOrig);

      const scanner = SF.printer3D();
      scanner.scale.set(0.7, 0.7, 0.7);
      scanner.position.set(0, -0.6, 0);
      scene.add(scanner);

      const docCopy = SF.certificate3D("కలర్ జిరాక్స్ కాపీ", "XEROX-002");
      docCopy.scale.set(0.65, 0.65, 0.65);
      docCopy.position.set(2.5, 0.2, 0);
      docCopy.visible = false;
      scene.add(docCopy);

      return {
        update(t, p) {
          const sp = Math.min(p * 2, 1);
          docOrig.position.x = -1.8 + sp * 1.8;
          docOrig.position.y = 0.5 - sp * 0.4;
          docOrig.rotation.y = Math.sin(t * 0.5) * 0.08;

          if (p > 0.4) {
            docCopy.visible = true;
            const cp = Math.min((p - 0.4) * 2.5, 1);
            docCopy.position.x = 0 + cp * 1.8;
            docCopy.position.y = -0.2 + cp * 0.6;
            docCopy.rotation.y = Math.sin(t * 0.4) * 0.1;
          }
          scanner.rotation.y = Math.sin(t * 0.3) * 0.06;
          cam.position.z = 7.5 - p * 1.4;
        }
      };
    };

    sceneFns.lamination = (scene, cam) => {
      cam.position.set(0, 1.2, 7.5);
      const cert = SF.certificate3D("లామినేషన్ సర్టిఫికేట్", "LAM-077");
      cert.scale.set(0.7, 0.7, 0.7);
      cert.position.set(-2, 0.4, 0);
      scene.add(cert);

      const glossPouch = new THREE.Mesh(
        new THREE.BoxGeometry(3.2, 4.2, 0.02),
        new THREE.MeshPhysicalMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.25,
          roughness: 0.05,
          clearcoat: 1,
          clearcoatRoughness: 0.05,
          reflectivity: 1
        })
      );
      glossPouch.position.set(2, 0.4, 0.05);
      scene.add(glossPouch);

      return {
        update(t, p) {
          if (p < 0.5) {
            const q = p / 0.5;
            cert.position.x = -2 + q * 2;
            glossPouch.position.x = 2 - q * 2;
          } else {
            cert.position.x = 0;
            glossPouch.position.x = 0;
            cert.rotation.y = (p - 0.5) * Math.PI * 1.5 + t * 0.15;
            glossPouch.rotation.y = cert.rotation.y;
          }
          cam.position.z = 7.5 - p * 1.2;
        }
      };
    };

    sceneFns.pvccard = (scene, cam) => {
      cam.position.set(0, 1.2, 7);
      const pvc = SF.smartCard("pan");
      pvc.scale.set(1.1, 1.1, 1.1);
      pvc.position.set(0, 0, 0);
      scene.add(pvc);

      return {
        update(t, p) {
          pvc.rotation.y = t * 0.4 + p * Math.PI * 2;
          pvc.rotation.x = Math.sin(t * 0.6) * 0.12;
          pvc.position.y = Math.sin(t * 0.5) * 0.1;
          cam.position.z = 7 - p * 1.2;
        }
      };
    };

    sceneFns.photo = (scene, cam) => {
      cam.position.set(0, 1.2, 7.5);
      const photoFan = [];
      for (let i = 0; i < 6; i++) {
        const photo = SF.smartCard("aadhaar");
        photo.scale.set(0.48, 0.48, 0.48);
        scene.add(photo);
        photoFan.push(photo);
      }

      return {
        update(t, p) {
          photoFan.forEach((ph, i) => {
            const a = (i - 2.5) * 0.28;
            const spread = Math.min(p * 2, 1);
            ph.position.set((i - 2.5) * 0.7 * spread, Math.sin(a) * 0.4 + Math.sin(t * 0.5 + i) * 0.08, (2 - Math.abs(i - 2.5)) * 0.3);
            ph.rotation.z = -a * spread * 0.6;
            ph.rotation.y = Math.sin(t * 0.3 + i) * 0.1;
          });
          cam.position.z = 7.5 - p * 1.4;
        }
      };
    };

    sceneFns.certificate = (scene, cam) => {
      cam.position.set(0, 1.2, 8.5);
      const titles = [
        "ఆదాయ ధృవీకరణ పత్రం",
        "కుల ధృవీకరణ పత్రం",
        "OBC / EWS సర్టిఫికేట్",
        "వ్యవసాయ ఆదాయ సర్టిఫికేట్"
      ];
      const certs = titles.map((ttl, i) => {
        const c = SF.certificate3D(ttl, `AP-MSV-2026-00${i + 1}`);
        c.scale.set(0.72, 0.72, 0.72);
        scene.add(c);
        return c;
      });

      return {
        update(t, p) {
          certs.forEach((c, i) => {
            const spread = Math.min(p * 2.2, 1);
            const a = (i - 1.5) * 0.25 * spread;
            c.position.set((i - 1.5) * 1.2 * spread, Math.sin(t * 0.4 + i) * 0.1, -i * 0.4 * spread);
            c.rotation.z = -a * 0.5;
            c.rotation.y = a + Math.sin(t * 0.3) * 0.06;
          });
          cam.position.z = 8.5 - p * 1.6;
        }
      };
    };

    sceneFns.idcards = (scene, cam) => {
      cam.position.set(0, 1.2, 8);
      const cards = [
        SF.smartCard("pan"),
        SF.smartCard("aadhaar"),
        SF.smartCard("license")
      ];
      cards.forEach((c) => {
        c.scale.set(0.85, 0.85, 0.85);
        scene.add(c);
      });

      return {
        update(t, p) {
          cards.forEach((c, i) => {
            const a = (i / 3) * Math.PI * 2 + t * 0.25 + p * Math.PI;
            c.position.set(Math.cos(a) * 2.6, Math.sin(a * 1.5) * 0.5, Math.sin(a) * 1.2);
            c.rotation.y = a + Math.PI / 2;
            c.rotation.x = Math.sin(t * 0.5 + i) * 0.1;
          });
          cam.position.z = 8 - p * 1.5;
        }
      };
    };

    sceneFns.ration = (scene, cam) => {
      cam.position.set(0, 1.2, 7.5);
      const rc = SF.smartCard("ration");
      rc.scale.set(0.95, 0.95, 0.95);
      scene.add(rc);

      const nodes = [];
      const cols = [0x38bdf8, 0x4ade80, 0xfbbf24, 0xa78bfa, 0xf472b6];
      cols.forEach((col, i) => {
        const mesh = new THREE.Mesh(
          new THREE.SphereGeometry(0.24, 20, 20),
          new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: 0.6 })
        );
        scene.add(mesh);
        nodes.push(mesh);
      });

      return {
        update(t, p) {
          rc.rotation.y = Math.sin(t * 0.3) * 0.1;
          nodes.forEach((n, i) => {
            const a = (i / 5) * Math.PI * 2 + t * 0.3;
            const r = 2.8 * Math.min(p * 2, 1);
            n.position.set(Math.cos(a) * r, Math.sin(a * 1.8) * Math.min(p * 2, 1), Math.sin(a * 2) * 0.5);
          });
          cam.position.z = 7.5 - p * 1.3;
        }
      };
    };

    sceneFns.passbook = (scene, cam) => {
      cam.position.set(0, 1.2, 7.5);
      const pb = SF.passbook3D();
      pb.scale.set(0.9, 0.9, 0.9);
      pb.position.set(-1.4, 0, 0);
      scene.add(pb);

      const stampCert = SF.certificate3D("ఈ-స్టాంప్ పేపర్", "E-STAMP-2026");
      stampCert.scale.set(0.65, 0.65, 0.65);
      stampCert.position.set(1.4, 0, 0);
      scene.add(stampCert);

      return {
        update(t, p) {
          pb.rotation.y = Math.sin(t * 0.4) * 0.15 + p * 0.4;
          stampCert.rotation.y = -Math.sin(t * 0.4) * 0.15 - p * 0.4;
          cam.position.z = 7.5 - p * 1.3;
        }
      };
    };

    sceneFns.special = (scene, cam) => {
      cam.position.set(0, 1.2, 7.5);
      const scCard = SF.smartCard("pan");
      scCard.scale.set(0.85, 0.85, 0.85);
      scCard.position.set(-1.3, 0, 0);
      scene.add(scCard);

      const udidCard = SF.smartCard("license");
      udidCard.scale.set(0.85, 0.85, 0.85);
      udidCard.position.set(1.3, 0, 0);
      scene.add(udidCard);

      const shieldRing = new THREE.Mesh(
        new THREE.TorusGeometry(2.4, 0.03, 12, 60),
        new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x38bdf8, emissiveIntensity: 0.8, transparent: true, opacity: 0.6 })
      );
      shieldRing.position.z = -0.5;
      scene.add(shieldRing);

      return {
        update(t, p) {
          scCard.rotation.y = t * 0.25;
          udidCard.rotation.y = -t * 0.25;
          shieldRing.rotation.z = t * 0.1;
          shieldRing.material.opacity = 0.3 + Math.sin(t * 2) * 0.2;
          cam.position.z = 7.5 - p * 1.2;
        }
      };
    };

    function init() {
      document.querySelectorAll(".cinema-canvas").forEach((canvas) => {
        const key = canvas.dataset.scene;
        if (!key || !sceneFns[key]) return;
        const { r, s, c } = mkScene(canvas);
        const section = canvas.closest(".cinema");
        const built = r ? sceneFns[key](s, c) : { update: () => {} };
        let isVis = false;
        const obs = new IntersectionObserver((entries) => {
          isVis = entries[0].isIntersecting;
        }, { threshold: 0.05 });
        obs.observe(section);

        active.push({ r, s, c, built, canvas, section, isVis: () => isVis });
        const ro = new ResizeObserver(() => fitRenderer(r, c, canvas));
        ro.observe(canvas.parentElement);
      });
      if (active.length > 0) tick();
    }

    let lastTime = 0;
    function tick() {
      requestAnimationFrame(tick);
      const now = performance.now();
      const dt = (now - lastTime) / 1000;
      lastTime = now;
      if (dt > 0.2) return;

      active.forEach(({ r, s, c, built, section, isVis }) => {
        if (!isVis() || !r) return;
        const rect = section.getBoundingClientRect();
        const rawProgress = Math.max(0, Math.min(1, 1 - rect.top / window.innerHeight));
        if (!built._p) built._p = rawProgress;
        built._p += (rawProgress - built._p) * Math.min(1, dt * 6);
        built.update(now * 0.001, built._p);
        r.render(s, c);
      });
    }

    return { init };
  })();

  if (!prefersReducedMotion && typeof THREE !== "undefined" && webglAvailable) {
    setTimeout(() => CinScenes.init(), 80);
  }

  /* ================================================================
     13. FULL-SCREEN 3D FLY-THROUGH TRANSITIONS
     ================================================================ */
  if (!prefersReducedMotion && typeof THREE !== "undefined" && webglAvailable) {
    const transCanvas = document.getElementById("transCanvas");
    if (transCanvas) {
      let renderer;
      try {
        renderer = new THREE.WebGLRenderer({ canvas: transCanvas, alpha: true, antialias: !isLowPower });
        renderer.setPixelRatio(deviceDPR);
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.3;
      } catch (e) {}

      if (renderer) {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 160);
        camera.position.set(0, 0, 10);

        scene.add(new THREE.AmbientLight(0x3a5a78, 0.75));
        const key = new THREE.PointLight(0x38bdf8, 3.5, 60); key.position.set(6, 6, 10); scene.add(key);
        const gold = new THREE.PointLight(0xfbbf24, 2.5, 50); gold.position.set(-6, -4, 8); scene.add(gold);

        function resizeTrans() {
          const w = window.innerWidth, h = window.innerHeight;
          renderer.setSize(w, h, false);
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
        }
        resizeTrans();
        window.addEventListener("resize", resizeTrans);

        const transitionRegistry = [];
        const transSections = document.querySelectorAll(".transition");

        transSections.forEach((sec) => {
          const group = new THREE.Group();
          scene.add(group);
          group.visible = false;

          const flyingDocs = [];
          for (let i = 0; i < (isLowPower ? 4 : 8); i++) {
            const card = SF.smartCard(i % 2 === 0 ? "pan" : "aadhaar");
            card.position.set((Math.random() - 0.5) * 14, (Math.random() - 0.5) * 8, -i * 3);
            group.add(card);
            flyingDocs.push(card);
          }

          const entry = {
            id: sec.id,
            sec,
            group,
            p: 0,
            vis: false,
            update(t, p) {
              flyingDocs.forEach((d, i) => {
                const flyZ = -12 + (p * 18 + i * 2) % 20;
                d.position.z = flyZ;
                d.rotation.y = t * 0.3 + i;
                d.rotation.x = Math.sin(t * 0.4 + i) * 0.2;
              });
              camera.position.z = 10 - p * 4;
            }
          };

          new IntersectionObserver((entries) => {
            entry.vis = entries[0].isIntersecting;
          }, { threshold: 0 }).observe(sec);

          if (window.ScrollTrigger) {
            ScrollTrigger.create({
              trigger: sec,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
              onUpdate: (st) => { entry.p = st.progress; }
            });
          }

          transitionRegistry.push(entry);
        });

        function renderTransitions(t) {
          requestAnimationFrame(renderTransitions);
          let activeEntry = null;
          transitionRegistry.forEach((z) => {
            if (!z.vis) { z.group.visible = false; return; }
            z.group.visible = true;
            activeEntry = z;
          });

          if (activeEntry) {
            transCanvas.style.opacity = "1";
            activeEntry.update(t * 0.001, activeEntry.p);
            renderer.render(scene, camera);
          } else {
            transCanvas.style.opacity = "0";
          }
        }
        requestAnimationFrame(renderTransitions);
      }
    }
  }

  /* ================================================================
     14. HOW IT WORKS — 3D GLOWING JOURNEY PATH
     ================================================================ */
  (function initHowJourney() {
    const cv = document.getElementById("howCanvas");
    const howSec = document.querySelector(".how");
    if (!cv || !howSec || typeof THREE === "undefined" || !webglAvailable) return;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: cv, alpha: true, antialias: !isLowPower });
      renderer.setPixelRatio(deviceDPR);
    } catch (e) { return; }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 60);
    camera.position.set(0, 3.5, 9); camera.lookAt(0, 0, 0);

    function resize() {
      const w = howSec.clientWidth, h = howSec.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener("resize", resize);

    scene.add(new THREE.AmbientLight(0x38bdf8, 0.6));
    const key = new THREE.PointLight(0x38bdf8, 3, 25); key.position.set(4, 5, 5); scene.add(key);

    const pathPts = [
      new THREE.Vector3(-4.5, 0.3, 0),
      new THREE.Vector3(-1.5, 0.3, 0.6),
      new THREE.Vector3(1.5, 0.3, -0.4),
      new THREE.Vector3(4.5, 0.3, 0)
    ];
    const curve = new THREE.CatmullRomCurve3(pathPts);
    const tube = new THREE.Mesh(
      new THREE.TubeGeometry(curve, 64, 0.04, 8, false),
      new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x38bdf8, emissiveIntensity: 0.8 })
    );
    scene.add(tube);

    const traveler = new THREE.Mesh(
      new THREE.SphereGeometry(0.18, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0x7ee8ff, emissiveIntensity: 2 })
    );
    scene.add(traveler);

    let isVis = false;
    new IntersectionObserver((e) => { isVis = e[0].isIntersecting; }, { threshold: 0.05 }).observe(howSec);

    const clock = new THREE.Clock();
    function animate() {
      requestAnimationFrame(animate);
      if (!isVis) return;
      const t = clock.getElapsedTime();
      const pos = curve.getPointAt((t * 0.15) % 1);
      traveler.position.copy(pos);
      renderer.render(scene, camera);
    }
    animate();
  })();

  /* ================================================================
     15. FINAL CTA — 3D GALAXY ECOSYSTEM & BRAND REVEAL
     ================================================================ */
  (function initCtaEcosystem() {
    const cv = document.getElementById("ctaCanvas");
    const ctaSec = document.querySelector(".final-cta");
    if (!cv || !ctaSec || typeof THREE === "undefined" || !webglAvailable) return;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: cv, alpha: true, antialias: !isLowPower });
      renderer.setPixelRatio(deviceDPR);
    } catch (e) { return; }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 80);
    camera.position.set(0, 0.5, 9.5);

    function resize() {
      const w = ctaSec.clientWidth, h = ctaSec.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener("resize", resize);

    scene.add(new THREE.AmbientLight(0x38bdf8, 0.7));
    const kL = new THREE.PointLight(0x38bdf8, 3.5, 40); kL.position.set(5, 5, 8); scene.add(kL);
    const rL = new THREE.PointLight(0xfbbf24, 2.5, 35); rL.position.set(-5, -4, 7); scene.add(rL);

    const galaxyCards = [];
    for (let i = 0; i < (isLowPower ? 4 : 8); i++) {
      const card = SF.smartCard(i % 2 === 0 ? "pan" : "ration");
      card.scale.set(0.65, 0.65, 0.65);
      scene.add(card);
      galaxyCards.push(card);
    }

    let isVis = false;
    new IntersectionObserver((e) => { isVis = e[0].isIntersecting; }, { threshold: 0.05 }).observe(ctaSec);

    const revealEl = ctaSec.querySelector(".cta-brand-reveal");
    if (revealEl) {
      new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) revealEl.classList.add("is-in");
      }, { threshold: 0.2 }).observe(revealEl);
    }

    const clock = new THREE.Clock();
    function animate() {
      requestAnimationFrame(animate);
      if (!isVis) return;
      const t = clock.getElapsedTime();
      galaxyCards.forEach((c, i) => {
        const a = (i / galaxyCards.length) * Math.PI * 2 + t * 0.15;
        c.position.set(Math.cos(a) * 3.6, Math.sin(a * 1.5) * 0.6, Math.sin(a) * 0.8);
        c.rotation.y = a + Math.PI / 2;
      });
      renderer.render(scene, camera);
    }
    animate();
  })();

  /* ================================================================
     16. TELUGU VOICE-OVER ENGINE & FLOATING GLASSMORPHIC PLAYER
     ================================================================ */
  const TeluguVoiceover = (() => {
    const SESSION_KEY = "smkv_played";
    let hasStarted = false;
    let audio = null;

    function createAudio() {
      const a = new Audio();
      a.preload = "auto";
      a.src = "audio/sri-manikanta-meeseva-telugu.mp3";
      a.addEventListener("error", () => {
        if (a.src.includes("audio/")) {
          a.src = "sri-manikanta-meeseva-telugu - Copy.mp3";
          a.load();
        }
      });
      a.volume = 1;
      a.loop = false;
      a.playsInline = true;
      return a;
    }

    function startAudio() {
      if (hasStarted || sessionStorage.getItem(SESSION_KEY)) return;
      hasStarted = true;
      sessionStorage.setItem(SESSION_KEY, "1");

      if (!audio) audio = createAudio();

      audio.play().catch(() => {
        hasStarted = false;
        sessionStorage.removeItem(SESSION_KEY);
      });
    }

    function init() {
      if (sessionStorage.getItem(SESSION_KEY)) return;
      audio = createAudio();

      const interactionEvents = ["click", "touchstart", "scroll", "keydown"];
      function onInteraction() {
        startAudio();
        interactionEvents.forEach((evt) => document.removeEventListener(evt, onInteraction, true));
      }
      interactionEvents.forEach((evt) => {
        document.addEventListener(evt, onInteraction, { passive: true, capture: true });
      });
    }

    return {
      init,
      getAudio: () => audio,
      isPlaying: () => !!(audio && !audio.paused && !audio.ended)
    };
  })();

  try { TeluguVoiceover.init(); } catch (e) {}

  (() => {
    let btn = null;

    function createButton() {
      if (btn) return btn;
      btn = document.createElement("button");
      btn.className = "smkv-audio-toggle paused";
      btn.setAttribute("aria-label", "Play / Pause Voiceover");
      btn.innerHTML = `
        <div class="smkv-eq">
          <span></span><span></span><span></span><span></span>
        </div>
        <span class="smkv-audio-label">వాయిస్ ఓవర్</span>
      `;
      document.body.appendChild(btn);

      btn.addEventListener("click", () => {
        let a = TeluguVoiceover.getAudio();
        if (!a) {
          TeluguVoiceover.init();
          a = TeluguVoiceover.getAudio();
        }
        if (a) {
          if (a.paused || a.ended) {
            a.play().catch(() => {});
          } else {
            a.pause();
          }
          updateState();
        }
      });

      return btn;
    }

    function updateState() {
      if (!btn) return;
      const a = TeluguVoiceover.getAudio();
      const playing = !!(a && !a.paused && !a.ended);
      btn.classList.toggle("playing", playing);
      btn.classList.toggle("paused", !playing);
    }

    window.addEventListener("DOMContentLoaded", () => {
      createButton();
      const a = TeluguVoiceover.getAudio();
      if (a) {
        ["play", "pause", "ended"].forEach((evt) => a.addEventListener(evt, updateState));
      }
    });
  })();

})();