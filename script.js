/**
 * SRI MANIKANTA MEESEVA — ULTRA-LUXURY MASTER 3D ENGINE
 * Architecture: Single WebGL Renderer + Scroll Scene Director + Mobile Touch/Gyro Inertia
 * High-Definition Dual-Sided Procedural Document Textures (1024x1024)
 * Zero WebGL Context Exhaustion (Crash-Proof 1 Context for Entire Page)
 */

(function () {
  "use strict";

  /* ================================================================
     1. PERFORMANCE & CAPABILITY DETECTION
     ================================================================ */
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
  const deviceDPR = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2);

  let webglAvailable = false;
  try {
    const testCanvas = document.createElement("canvas");
    webglAvailable = !!(window.WebGLRenderingContext && (testCanvas.getContext("webgl") || testCanvas.getContext("experimental-webgl")));
  } catch (e) {
    webglAvailable = false;
  }

  /* ================================================================
     2. GLOBAL LOADER & PROGRESS BAR
     ================================================================ */
  const loader = document.getElementById("loader");
  const progressBar = document.querySelector(".scroll-progress-bar");
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  function dismissLoader() {
    if (loader) {
      loader.classList.add("is-hidden");
      setTimeout(() => loader.remove(), 600);
    }
  }
  window.addEventListener("load", dismissLoader);
  setTimeout(dismissLoader, 2500); // Safety fallback

  window.addEventListener("scroll", () => {
    if (!progressBar) return;
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const p = docH > 0 ? (window.scrollY / docH) * 100 : 0;
    progressBar.style.width = p + "%";
  }, { passive: true });

  /* ================================================================
     3. CUSTOM CURSOR
     ================================================================ */
  const cursor = document.getElementById("customCursor");
  if (cursor && !isMobile) {
    let cx = -100, cy = -100, mx = -100, my = -100;
    document.addEventListener("mousemove", (e) => {
      mx = e.clientX; my = e.clientY;
      cursor.style.opacity = "1";
    });
    document.addEventListener("mouseleave", () => { cursor.style.opacity = "0"; });

    function tickCursor() {
      cx += (mx - cx) * 0.2;
      cy += (my - cy) * 0.2;
      cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      requestAnimationFrame(tickCursor);
    }
    tickCursor();

    document.querySelectorAll("a, button, input, .service-card, .step-card, .cinema-stage-card").forEach(el => {
      el.addEventListener("mouseenter", () => cursor.classList.add("is-hover"));
      el.addEventListener("mouseleave", () => cursor.classList.remove("is-hover"));
    });
  }

  /* ================================================================
     4. NAVIGATION & MOBILE MENU
     ================================================================ */
  const siteNav = document.getElementById("siteNav");
  const navToggle = document.getElementById("navToggle");
  const navMobile = document.getElementById("navMobile");

  window.addEventListener("scroll", () => {
    if (!siteNav) return;
    if (window.scrollY > 40) siteNav.classList.add("is-scrolled");
    else siteNav.classList.remove("is-scrolled");
  }, { passive: true });

  if (navToggle && navMobile) {
    navToggle.addEventListener("click", () => {
      const open = navMobile.classList.toggle("is-open");
      navToggle.classList.toggle("is-active", open);
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    navMobile.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", () => {
        navMobile.classList.remove("is-open");
        navToggle.classList.remove("is-active");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ================================================================
     5. TELUGU VOICE-OVER AUDIO (Single Shared Instance)
     ================================================================ */
  const TeluguVoiceover = (() => {
    const audioBtn = document.getElementById("navAudioToggle");
    const audioSources = [
      "audio/sri-manikanta-meeseva-telugu.mp3",
      "sri-manikanta-meeseva-telugu - Copy.mp3",
      "sri-manikanta-meeseva-telugu.mp3"
    ];
    let audio = null;
    let isPlaying = false;
    let currentSrcIndex = 0;

    function createAudio() {
      if (audio) return audio;
      audio = new Audio();
      audio.preload = "none";
      audio.src = audioSources[currentSrcIndex];
      audio.addEventListener("ended", () => setPlayingState(false));
      audio.addEventListener("error", () => {
        if (currentSrcIndex < audioSources.length - 1) {
          currentSrcIndex++;
          audio.src = audioSources[currentSrcIndex];
          if (isPlaying) audio.play().catch(() => setPlayingState(false));
        } else {
          setPlayingState(false);
        }
      });
      return audio;
    }

    function setPlayingState(playing) {
      isPlaying = playing;
      if (audioBtn) {
        if (playing) {
          audioBtn.classList.add("playing");
          audioBtn.classList.remove("paused");
        } else {
          audioBtn.classList.remove("playing");
          audioBtn.classList.add("paused");
        }
      }
    }

    function toggle() {
      const a = createAudio();
      if (isPlaying) {
        a.pause();
        setPlayingState(false);
      } else {
        a.play().then(() => setPlayingState(true)).catch(() => setPlayingState(false));
      }
    }

    if (audioBtn) {
      audioBtn.addEventListener("click", (e) => {
        e.preventDefault();
        toggle();
      });
    }

    return { toggle, isPlaying: () => isPlaying };
  })();

  /* ================================================================
     6. INTERSECTION REVEALS & NUMBER COUNTERS
     ================================================================ */
  const revealElements = document.querySelectorAll(".reveal, .reveal-up, .reveal-word");
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          revealObserver.unobserve(e.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    revealElements.forEach(el => revealObserver.observe(el));

    const counterElements = document.querySelectorAll(".counter");
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const el = e.target;
          const target = parseInt(el.dataset.target, 10) || 0;
          let current = 0;
          const step = Math.max(1, Math.floor(target / 40));
          const timer = setInterval(() => {
            current += step;
            if (current >= target) {
              el.textContent = target;
              clearInterval(timer);
            } else {
              el.textContent = current;
            }
          }, 30);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.3 });
    counterElements.forEach(el => counterObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add("is-visible"));
  }

  /* ================================================================
     7. BACK TO TOP
     ================================================================ */
  const backToTop = document.getElementById("backToTop");
  if (backToTop) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 400) backToTop.classList.add("is-visible");
      else backToTop.classList.remove("is-visible");
    }, { passive: true });
  }

  /* ================================================================
     8. DATA POPULATION (Services, Marquee, Testimonials, FAQ)
     ================================================================ */
  function populateContent() {
    const D = window.MEESEVA_DATA;
    if (!D) return;

    // Marquee
    const marqueeTrack = document.getElementById("marqueeTrack");
    if (marqueeTrack && D.marqueeItems) {
      const itemsHtml = D.marqueeItems.map(item => `<div class="marquee-item">${item}</div>`).join("");
      marqueeTrack.innerHTML = itemsHtml + itemsHtml; // Double for infinite scroll
    }

    // Services
    const serviceGroups = document.getElementById("serviceGroups");
    if (serviceGroups && D.categories) {
      let html = "";
      D.categories.forEach(cat => {
        html += `
          <div class="service-group is-shown" data-category="${cat.id}">
            <div class="group-head">
              <div class="group-icon">${cat.icon || "📄"}</div>
              <h3>${cat.title}</h3>
            </div>
            <div class="service-cards">
              ${cat.services.map(s => `
                <div class="service-card" data-name="${s.name}" data-category="${cat.id}">
                  <strong class="sc-name">${s.name}</strong>
                  <span class="sc-badge">${s.badge || "లభ్యం"}</span>
                </div>
              `).join("")}
            </div>
          </div>
        `;
      });
      serviceGroups.innerHTML = html;
    }

    // Testimonials
    const testTrack = document.getElementById("testimonialTrack");
    if (testTrack && D.testimonials) {
      const tHtml = D.testimonials.map(t => `
        <div class="testimonial-card">
          <div class="testimonial-stars"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div>
          <p class="testimonial-text">"${t.text}"</p>
          <div class="testimonial-author">
            <div class="testimonial-avatar">${t.name.charAt(0)}</div>
            <div>
              <strong class="testimonial-name">${t.name}</strong>
              <span class="testimonial-loc">${t.location}</span>
            </div>
          </div>
        </div>
      `).join("");
      testTrack.innerHTML = tHtml + tHtml;
    }

    // FAQ
    const faqList = document.getElementById("faqList");
    if (faqList && D.faqs) {
      faqList.innerHTML = D.faqs.map(f => `
        <div class="faq-item">
          <button class="faq-question">
            <span>${f.q}</span>
            <svg class="faq-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
          </button>
          <div class="faq-answer">
            <div class="faq-answer-inner">${f.a}</div>
          </div>
        </div>
      `).join("");

      faqList.querySelectorAll(".faq-question").forEach(q => {
        q.addEventListener("click", () => {
          const item = q.parentElement;
          const open = item.classList.toggle("is-open");
          const ans = item.querySelector(".faq-answer");
          if (open) ans.style.maxHeight = ans.scrollHeight + "px";
          else ans.style.maxHeight = "0";
        });
      });
    }

    // Search & Filter
    const searchInput = document.getElementById("serviceSearch");
    const searchClear = document.getElementById("searchClear");
    const searchEmpty = document.getElementById("searchEmpty");
    const chipButtons = document.querySelectorAll(".chip");

    function filterServices() {
      const q = searchInput ? searchInput.value.toLowerCase().trim() : "";
      const activeChip = document.querySelector(".chip.is-active");
      const activeFilter = activeChip ? activeChip.dataset.filter : "all";

      if (searchClear) searchClear.hidden = q.length === 0;

      let anyVisible = false;
      document.querySelectorAll(".service-group").forEach(group => {
        const cat = group.dataset.category;
        const matchesCategory = activeFilter === "all" || activeFilter === cat;

        let visibleCountInGroup = 0;
        group.querySelectorAll(".service-card").forEach(card => {
          const name = card.dataset.name.toLowerCase();
          const matchesQuery = !q || name.includes(q);

          if (matchesCategory && matchesQuery) {
            card.classList.remove("is-hidden");
            visibleCountInGroup++;
            anyVisible = true;
          } else {
            card.classList.add("is-hidden");
          }
        });

        if (visibleCountInGroup > 0) group.classList.add("is-shown");
        else group.classList.remove("is-shown");
      });

      if (searchEmpty) searchEmpty.hidden = anyVisible;
    }

    if (searchInput) searchInput.addEventListener("input", filterServices);
    if (searchClear) {
      searchClear.addEventListener("click", () => {
        searchInput.value = "";
        filterServices();
      });
    }

    chipButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        chipButtons.forEach(b => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        filterServices();
      });
    });
  }

  populateContent();

  /* ================================================================
     9. ULTRA-HD PROCEDURAL TEXTURE GENERATOR (1024x1024 & 1024x640)
     Creates Authentic Andhra Pradesh Certificates & Smart Cards
     ================================================================ */
  const HDTextures = (() => {
    const cache = {};

    function getOrCreate(key, drawFn, w = 1024, h = 1024) {
      if (cache[key]) return cache[key];
      const canvas = document.createElement("canvas");
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext("2d");
      drawFn(ctx, w, h);
      if (typeof THREE !== "undefined") {
        const tex = new THREE.CanvasTexture(canvas);
        tex.anisotropy = 4;
        cache[key] = tex;
        return tex;
      }
      return null;
    }

    // 1. Official Andhra Pradesh Government Certificate (ఆదాయం, కులం, నివాస)
    function certFront(title = "ఆదాయ ధృవీకరణ పత్రం", docId = "AP-INCOME-2026") {
      return getOrCreate(`cert_f_${title}_${docId}`, (ctx, w, h) => {
        // Deep ivory/gold parchment background
        const grad = ctx.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0, "#fdfcf7");
        grad.addColorStop(0.5, "#f7f3e8");
        grad.addColorStop(1, "#f2ebe0");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        // Intricate guilloche security border
        ctx.strokeStyle = "#b45309";
        ctx.lineWidth = 14;
        ctx.strokeRect(28, 28, w - 56, h - 56);
        ctx.strokeStyle = "#0284c7";
        ctx.lineWidth = 4;
        ctx.strokeRect(44, 44, w - 88, h - 88);

        // Header: AP Govt Lion Crest & Title
        ctx.fillStyle = "#0f172a";
        ctx.font = "bold 38px 'Noto Sans Telugu', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("ఆంధ్రప్రదేశ్ ప్రభుత్వం", w / 2, 110);

        ctx.fillStyle = "#0369a1";
        ctx.font = "bold 24px 'Space Grotesk', sans-serif";
        ctx.fillText("GOVERNMENT OF ANDHRA PRADESH", w / 2, 148);

        ctx.fillStyle = "#b45309";
        ctx.font = "bold 20px 'Space Grotesk', sans-serif";
        ctx.fillText("REVENUE DEPARTMENT — MEESEVA CITIZEN SERVICES", w / 2, 178);

        // Golden Divider Ribbon
        ctx.fillStyle = "#f59e0b";
        ctx.fillRect(100, 195, w - 200, 6);

        // Certificate Name
        ctx.fillStyle = "#090d16";
        ctx.font = "800 46px 'Noto Sans Telugu', sans-serif";
        ctx.fillText(title, w / 2, 280);

        // Certificate Details Box
        ctx.fillStyle = "#ffffff";
        ctx.strokeStyle = "#cbd5e1";
        ctx.lineWidth = 2;
        ctx.fillRect(100, 320, w - 200, 480);
        ctx.strokeRect(100, 320, w - 200, 480);

        // Key Value Pairs
        ctx.textAlign = "left";
        ctx.fillStyle = "#334155";
        ctx.font = "600 28px 'Noto Sans Telugu', sans-serif";
        ctx.fillText(`ధృవీకరణ సంఖ్య: ${docId}`, 130, 380);
        ctx.fillText("సేవా కేంద్రం: శ్రీ మణికంఠ మీ సేవ — వెల్దుర్తి", 130, 440);
        ctx.fillText("దరఖాస్తుదారు: శ్రీ లక్ష్మీధర్ రెడ్డి", 130, 500);
        ctx.fillText("మండలం: వెల్దుర్తి  |  జిల్లా: కర్నూలు", 130, 560);
        ctx.fillText("జారీ తేదీ: 21-08-2026", 130, 620);
        ctx.fillText("పరిశీలన స్థితి: విజయవంతంగా ఆమోదించబడింది ✓", 130, 680);

        // Holographic Security Seal (Bottom Left)
        ctx.save();
        ctx.translate(220, 880);
        const holoGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, 60);
        holoGrad.addColorStop(0, "#fbbf24");
        holoGrad.addColorStop(0.5, "#38bdf8");
        holoGrad.addColorStop(1, "#a855f7");
        ctx.fillStyle = holoGrad;
        ctx.beginPath(); ctx.arc(0, 0, 65, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 4; ctx.stroke();
        ctx.fillStyle = "#030712"; ctx.font = "bold 20px 'Space Grotesk', sans-serif"; ctx.textAlign = "center";
        ctx.fillText("GENUINE", 0, -6);
        ctx.fillText("MEESEVA", 0, 18);
        ctx.restore();

        // Official Violet Stamp (Bottom Right)
        ctx.save();
        ctx.translate(w - 240, 880);
        ctx.rotate(-0.1);
        ctx.strokeStyle = "#7c3aed";
        ctx.lineWidth = 5;
        ctx.beginPath(); ctx.arc(0, 0, 70, 0, Math.PI * 2); ctx.stroke();
        ctx.fillStyle = "#7c3aed";
        ctx.font = "bold 18px 'Noto Sans Telugu', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("శ్రీ మణికంఠ మీ సేవ", 0, -20);
        ctx.fillText("వెల్దుర్తి సెంటర్", 0, 8);
        ctx.fillText("VERIFIED ✓", 0, 32);
        ctx.restore();
      }, 1024, 1400);
    }

    // 2. Dual-Sided Back Face for Certificate
    function certBack() {
      return getOrCreate("cert_back", (ctx, w, h) => {
        ctx.fillStyle = "#f8f6ee";
        ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = "#cbd5e1";
        ctx.lineWidth = 8;
        ctx.strokeRect(30, 30, w - 60, h - 60);

        ctx.fillStyle = "#475569";
        ctx.font = "bold 28px 'Noto Sans Telugu', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("ముఖ్యమైన నిబంధనలు & డిజిటల్ ధృవీకరణ", w / 2, 140);

        ctx.font = "22px 'Noto Sans Telugu', sans-serif";
        ctx.textAlign = "left";
        const terms = [
          "1. ఈ సర్టిఫికేట్ మీ సేవ పోర్టల్ ద్వారా ఆన్‌లైన్‌లో ధృవీకరించబడింది.",
          "2. దీని అధికారికతను meeseva.ap.gov.in లో తనిఖీ చేయవచ్చు.",
          "3. ఎటువంటి దిద్దుబాట్లు చెల్లవు.",
          "4. శ్రీ మణికంఠ మీ సేవ, రైల్వే స్టేషన్ రోడ్, వెల్దుర్తి.",
          "5. హెల్ప్‌లైన్: 8985 100 777"
        ];
        terms.forEach((t, i) => ctx.fillText(t, 100, 260 + i * 80));

        // Barcode ribbon
        ctx.fillStyle = "#0f172a";
        for (let x = 160; x < w - 160; x += 12) {
          const barW = (x % 24 === 0) ? 6 : 3;
          ctx.fillRect(x, 780, barW, 90);
        }
      }, 1024, 1400);
    }

    // 3. Official Smart PAN Card
    function panFront() {
      return getOrCreate("pan_front", (ctx, w, h) => {
        const grad = ctx.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0, "#0284c7"); grad.addColorStop(0.5, "#0b2740"); grad.addColorStop(1, "#030712");
        ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h);

        ctx.strokeStyle = "#38bdf8"; ctx.lineWidth = 6; ctx.strokeRect(16, 16, w - 32, h - 32);

        // Header
        ctx.fillStyle = "#f8fafc"; ctx.font = "bold 32px 'Space Grotesk', sans-serif"; ctx.textAlign = "left";
        ctx.fillText("INCOME TAX DEPARTMENT", 40, 70);
        ctx.fillStyle = "#fbbf24"; ctx.font = "bold 22px 'Space Grotesk', sans-serif";
        ctx.fillText("GOVT. OF INDIA", w - 240, 70);

        // Gold EMV Chip
        ctx.fillStyle = "#f59e0b"; ctx.fillRect(60, 110, 110, 80);
        ctx.strokeStyle = "#78350f"; ctx.lineWidth = 2; ctx.strokeRect(60, 110, 110, 80);

        // Applicant Details
        ctx.fillStyle = "#ffffff"; ctx.font = "bold 26px 'Space Grotesk', sans-serif";
        ctx.fillText("NAME: LAKSHMIDHAR REDDY", 200, 135);
        ctx.fillText("FATHER: RAMANJANEYA REDDY", 200, 175);
        ctx.fillText("DOB: 15/08/1996", 200, 215);

        // PAN Number Large
        ctx.fillStyle = "#38bdf8"; ctx.font = "800 48px 'Space Grotesk', sans-serif";
        ctx.fillText("ABCDE8985K", 60, 310);

        // Photo box & QR
        ctx.fillStyle = "#1e293b"; ctx.fillRect(w - 200, 105, 140, 160);
        ctx.strokeStyle = "#38bdf8"; ctx.lineWidth = 2; ctx.strokeRect(w - 200, 105, 140, 160);
        ctx.fillStyle = "#94a3b8"; ctx.font = "bold 18px sans-serif"; ctx.textAlign = "center";
        ctx.fillText("PHOTO", w - 130, 190);
      }, 1024, 640);
    }

    // 4. Official Aadhaar Card
    function aadhaarFront() {
      return getOrCreate("aadhaar_front", (ctx, w, h) => {
        ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, w, h);

        // Tricolor Header Ribbon
        ctx.fillStyle = "#f97316"; ctx.fillRect(0, 0, w, 24);
        ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 24, w, 24);
        ctx.fillStyle = "#16a34a"; ctx.fillRect(0, 48, w, 24);

        ctx.fillStyle = "#0f172a"; ctx.font = "bold 32px 'Noto Sans Telugu', sans-serif"; ctx.textAlign = "center";
        ctx.fillText("భారత విశిష్ట గుర్తింపు ప్రాధికార సంస్థ", w / 2, 125);
        ctx.fillStyle = "#64748b"; ctx.font = "bold 20px 'Space Grotesk', sans-serif";
        ctx.fillText("Unique Identification Authority of India", w / 2, 160);

        // Photo & Info
        ctx.fillStyle = "#e2e8f0"; ctx.fillRect(60, 200, 160, 190);
        ctx.strokeStyle = "#0284c7"; ctx.lineWidth = 2; ctx.strokeRect(60, 200, 160, 190);

        ctx.textAlign = "left"; ctx.fillStyle = "#0f172a"; ctx.font = "bold 26px 'Noto Sans Telugu', sans-serif";
        ctx.fillText("పేరు: లక్ష్మీధర్ రెడ్డి", 260, 240);
        ctx.fillText("పుట్టిన తేదీ: 15/08/1996", 260, 290);
        ctx.fillText("లింగం: పురుషుడు / MALE", 260, 340);

        // Red Aadhaar Number
        ctx.fillStyle = "#dc2626"; ctx.font = "800 52px 'Space Grotesk', sans-serif"; ctx.textAlign = "center";
        ctx.fillText("XXXX XXXX 8985", w / 2, 470);
        ctx.fillStyle = "#059669"; ctx.font = "bold 22px 'Noto Sans Telugu', sans-serif";
        ctx.fillText("ఆధార్ — సామాన్యుని హక్కు", w / 2, 530);
      }, 1024, 640);
    }

    // 5. AP Rice Card / Ration Card
    function riceCardFront() {
      return getOrCreate("rice_card_front", (ctx, w, h) => {
        const grad = ctx.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0, "#78350f"); grad.addColorStop(1, "#1e1b4b");
        ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h);

        ctx.strokeStyle = "#fbbf24"; ctx.lineWidth = 8; ctx.strokeRect(16, 16, w - 32, h - 32);

        ctx.fillStyle = "#ffffff"; ctx.font = "bold 34px 'Noto Sans Telugu', sans-serif"; ctx.textAlign = "center";
        ctx.fillText("ఆంధ్రప్రదేశ్ ప్రభుత్వం — ఆహార & పౌర సరఫరాల శాఖ", w / 2, 75);

        ctx.fillStyle = "#fef08a"; ctx.font = "800 42px 'Noto Sans Telugu', sans-serif";
        ctx.fillText("రైస్ కార్డ్ (RICE CARD)", w / 2, 135);

        ctx.fillStyle = "#ffffff"; ctx.fillRect(60, 170, w - 120, 320);
        ctx.strokeStyle = "#fbbf24"; ctx.lineWidth = 3; ctx.strokeRect(60, 170, w - 120, 320);

        ctx.textAlign = "left"; ctx.fillStyle = "#0f172a"; ctx.font = "bold 26px 'Noto Sans Telugu', sans-serif";
        ctx.fillText("కుటుంబ పెద్ద: శ్రీ లక్ష్మీధర్ రెడ్డి", 90, 230);
        ctx.fillText("కార్డ్ నంబర్: WAP08985100777", 90, 290);
        ctx.fillText("మండలం: వెల్దుర్తి  |  గ్రామం: వెల్దుర్తి", 90, 350);
        ctx.fillText("FP షాప్ నంబర్: 1204012", 90, 410);

        ctx.fillStyle = "#16a34a"; ctx.font = "800 32px 'Space Grotesk', sans-serif"; ctx.textAlign = "center";
        ctx.fillText("STATUS: ACTIVE ✓", w / 2, 560);
      }, 1024, 640);
    }

    // 6. Pattadar Passbook
    function passbookCover() {
      return getOrCreate("passbook_cover", (ctx, w, h) => {
        ctx.fillStyle = "#0f2942"; ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = "#fbbf24"; ctx.lineWidth = 12; ctx.strokeRect(24, 24, w - 48, h - 48);

        ctx.fillStyle = "#fbbf24"; ctx.font = "bold 36px 'Noto Sans Telugu', sans-serif"; ctx.textAlign = "center";
        ctx.fillText("ఆంధ్రప్రదేశ్ ప్రభుత్వం", w / 2, 140);
        ctx.font = "800 52px 'Noto Sans Telugu', sans-serif";
        ctx.fillText("పట్టాదారు పాస్‌బుక్", w / 2, 240);
        ctx.font = "bold 28px 'Space Grotesk', sans-serif";
        ctx.fillText("TITLE DEED CUM PASS BOOK", w / 2, 310);

        ctx.fillStyle = "#f8fafc"; ctx.font = "600 24px 'Noto Sans Telugu', sans-serif";
        ctx.fillText("రెవెన్యూ శాఖ — వెల్దుర్తి మండలం", w / 2, 420);
        ctx.fillText("శ్రీ మణికంఠ మీ సేవ ద్వారా డిజిటల్ సర్వీస్", w / 2, 480);
      }, 800, 1100);
    }

    return { certFront, certBack, panFront, aadhaarFront, riceCardFront, passbookCover };
  })();

  /* ================================================================
     10. 3D OBJECT MESH FACTORY
     ================================================================ */
  const MeshFactory = (() => {
    function createCard(frontTex, backTex = null, w = 3.6, h = 2.2, d = 0.04) {
      const g = new THREE.Group();
      const geom = new THREE.BoxGeometry(w, h, d);

      const fMat = new THREE.MeshPhysicalMaterial({
        map: frontTex,
        roughness: 0.25,
        metalness: 0.1,
        clearcoat: 0.6,
        clearcoatRoughness: 0.2
      });

      const bMat = new THREE.MeshPhysicalMaterial({
        map: backTex || frontTex,
        roughness: 0.3,
        metalness: 0.1
      });

      const sideMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.8, roughness: 0.2 });

      const mesh = new THREE.Mesh(geom, [sideMat, sideMat, sideMat, sideMat, fMat, bMat]);
      g.add(mesh);
      return g;
    }

    function createCertificate(title = "ఆదాయ సర్టిఫికేట్", docId = "AP-DOC-2026", w = 2.6, h = 3.6) {
      const g = new THREE.Group();
      const geom = new THREE.BoxGeometry(w, h, 0.02);

      const fMat = new THREE.MeshPhysicalMaterial({
        map: HDTextures.certFront(title, docId),
        roughness: 0.4,
        metalness: 0.05,
        clearcoat: 0.4
      });

      const bMat = new THREE.MeshStandardMaterial({
        map: HDTextures.certBack(),
        roughness: 0.5
      });

      const edgeMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.7, roughness: 0.3 });
      const mesh = new THREE.Mesh(geom, [edgeMat, edgeMat, edgeMat, edgeMat, fMat, bMat]);
      g.add(mesh);
      return g;
    }

    function createLaserScanner() {
      const g = new THREE.Group();
      // Base Machine Body
      const body = new THREE.Mesh(
        new THREE.BoxGeometry(3.2, 1.4, 2.4),
        new THREE.MeshPhysicalMaterial({ color: 0x0b2740, metalness: 0.6, roughness: 0.3, clearcoat: 0.5 })
      );
      g.add(body);

      // Glass Scan Bed
      const glass = new THREE.Mesh(
        new THREE.BoxGeometry(2.6, 0.08, 1.8),
        new THREE.MeshPhysicalMaterial({ color: 0x38bdf8, transmission: 0.85, opacity: 1, transparent: true, roughness: 0.1 })
      );
      glass.position.y = 0.72;
      g.add(glass);

      // Laser Scanner Beam
      const beam = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.04, 2.0, 16),
        new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x38bdf8, emissiveIntensity: 2.5 })
      );
      beam.rotation.z = Math.PI / 2;
      beam.position.set(0, 0.74, 0);
      g.add(beam);

      // Output Document
      const outDoc = createCertificate("కలర్ జిరాక్స్ ప్రింట్", "AP-PRINT-2026", 1.8, 2.4);
      outDoc.position.set(0, 0.85, 0.2);
      outDoc.rotation.x = -Math.PI / 2;
      g.add(outDoc);

      return { group: g, beam, outDoc };
    }

    return { createCard, createCertificate, createLaserScanner };
  })();

  /* ================================================================
     11. MASTER 3D SCENE DIRECTOR (Single Shared WebGL Canvas)
     ================================================================ */
  function initMasterEngine() {
    const canvas = document.getElementById("webglCanvas");
    if (!canvas || typeof THREE === "undefined" || !webglAvailable || prefersReducedMotion) return;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: !isMobile,
        powerPreference: "high-performance"
      });
      renderer.setPixelRatio(deviceDPR);
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.3;
    } catch (err) {
      console.warn("WebGL initialization skipped:", err);
      return;
    }

    // Context Loss Handlers
    canvas.addEventListener("webglcontextlost", (e) => {
      e.preventDefault();
      console.warn("WebGL Context Lost — preventing crash.");
    });
    canvas.addEventListener("webglcontextrestored", () => {
      console.log("WebGL Context Restored — reinitializing engine.");
      initMasterEngine();
    });

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(isMobile ? 48 : 40, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, isMobile ? 12.5 : 10.5);

    // Studio Lighting
    const ambient = new THREE.AmbientLight(0x2a4365, 0.9);
    scene.add(ambient);

    const keyLight = new THREE.PointLight(0x38bdf8, 4.0, 40);
    keyLight.position.set(5, 6, 8);
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(0xfbbf24, 3.2, 35);
    rimLight.position.set(-6, -4, 6);
    scene.add(rimLight);

    const fillLight = new THREE.PointLight(0x818cf8, 1.8, 30);
    fillLight.position.set(0, 5, -4);
    scene.add(fillLight);

    // ----------------------------------------------------
    // HERO 3D GALAXY (Floating Centerpiece & Orbiting Cards)
    // ----------------------------------------------------
    const heroGroup = new THREE.Group();
    scene.add(heroGroup);

    // 1. Centerpiece Royal Certificate
    const heroCert = MeshFactory.createCertificate("శ్రీ మణికంఠ మీ సేవ", "MEESEVA-VELDURTHI-AP", 3.0, 4.2);
    heroGroup.add(heroCert);

    // 2. Orbiting Service Documents
    const orbitCards = [];
    const orbitData = [
      { fn: () => MeshFactory.createCard(HDTextures.panFront()), angle: 0, r: 4.6, y: 0.6 },
      { fn: () => MeshFactory.createCard(HDTextures.aadhaarFront()), angle: (Math.PI * 2) / 4, r: 4.8, y: -0.5 },
      { fn: () => MeshFactory.createCard(HDTextures.riceCardFront()), angle: (Math.PI * 4) / 4, r: 4.6, y: 0.4 },
      { fn: () => MeshFactory.createCertificate("కుల సర్టిఫికేట్", "AP-CASTE-2026", 2.2, 3.0), angle: (Math.PI * 6) / 4, r: 4.7, y: -0.3 }
    ];

    orbitData.forEach(od => {
      const card = od.fn();
      card.scale.set(0.72, 0.72, 0.72);
      heroGroup.add(card);
      orbitCards.push({ mesh: card, data: od });
    });

    // ----------------------------------------------------
    // CINEMATIC SECTION SCENE GROUPS
    // ----------------------------------------------------
    const cinGroup = new THREE.Group();
    cinGroup.position.set(isMobile ? 0 : 2.5, 0, 0);
    cinGroup.visible = false;
    scene.add(cinGroup);

    // Scanner Object
    const scannerObj = MeshFactory.createLaserScanner();
    scannerObj.group.scale.set(0.75, 0.75, 0.75);
    cinGroup.add(scannerObj.group);

    // Lamination Card
    const lamCard = MeshFactory.createCertificate("లామినేషన్ సర్టిఫికేట్", "AP-LAM-2026", 2.6, 3.6);
    lamCard.visible = false;
    cinGroup.add(lamCard);

    // Smart PVC Card
    const pvcCard = MeshFactory.createCard(HDTextures.panFront(), null, 3.6, 2.2, 0.08);
    pvcCard.visible = false;
    cinGroup.add(pvcCard);

    // Passbook 3D Object
    const passbook = MeshFactory.createCard(HDTextures.passbookCover(), null, 2.8, 3.8, 0.15);
    passbook.visible = false;
    cinGroup.add(passbook);

    // ----------------------------------------------------
    // TOUCH-DRAG & GYROSCOPE INTERACTION
    // ----------------------------------------------------
    let targetRotX = 0, targetRotY = 0;
    let currentRotX = 0, currentRotY = 0;
    let isDragging = false, startX = 0, startY = 0;

    window.addEventListener("pointerdown", (e) => {
      if (window.scrollY > window.innerHeight) return;
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
    });

    window.addEventListener("pointermove", (e) => {
      if (isDragging) {
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        targetRotY += dx * 0.006;
        targetRotX += dy * 0.006;
        startX = e.clientX;
        startY = e.clientY;
      } else {
        const nx = (e.clientX / window.innerWidth - 0.5) * 2;
        const ny = (e.clientY / window.innerHeight - 0.5) * 2;
        targetRotY = nx * 0.35;
        targetRotX = -ny * 0.25;
      }
    });

    window.addEventListener("pointerup", () => { isDragging = false; });
    window.addEventListener("pointercancel", () => { isDragging = false; });

    // Mobile Gyroscope Parallax
    if (window.DeviceOrientationEvent && isMobile) {
      window.addEventListener("deviceorientation", (e) => {
        if (e.gamma !== null && e.beta !== null && !isDragging) {
          const g = Math.max(-30, Math.min(30, e.gamma));
          const b = Math.max(-30, Math.min(30, e.beta - 45));
          targetRotY = (g / 30) * 0.4;
          targetRotX = (b / 30) * 0.3;
        }
      }, { passive: true });
    }

    // ----------------------------------------------------
    // SCROLL-DIRECTOR ENGINE
    // ----------------------------------------------------
    function updateScrollDirector() {
      const scrollY = window.scrollY;
      const vh = window.innerHeight;

      // In Hero Section
      if (scrollY < vh * 1.2) {
        heroGroup.visible = true;
        cinGroup.visible = false;
        const fade = Math.max(0, 1 - scrollY / (vh * 0.85));
        heroGroup.scale.set(fade, fade, fade);
        camera.position.z = isMobile ? 12.5 + (1 - fade) * 4 : 10.5 + (1 - fade) * 4;
        return;
      }

      heroGroup.visible = false;

      // Check which Cinema Section is active
      const cinemaSections = [
        { id: "cin-xerox", type: "xerox" },
        { id: "cin-lam", type: "lam" },
        { id: "cin-pvc", type: "pvc" },
        { id: "cin-pass", type: "pass" },
        { id: "cin-cert", type: "cert" },
        { id: "cin-id", type: "id" },
        { id: "cin-ration", type: "ration" }
      ];

      let activeSection = null;
      cinemaSections.forEach(cs => {
        const el = document.getElementById(cs.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top < vh * 0.75 && rect.bottom > vh * 0.25) {
            activeSection = cs.type;
          }
        }
      });

      if (activeSection) {
        cinGroup.visible = true;
        scannerObj.group.visible = activeSection === "xerox";
        lamCard.visible = activeSection === "lam" || activeSection === "cert";
        pvcCard.visible = activeSection === "pvc" || activeSection === "id" || activeSection === "ration";
        passbook.visible = activeSection === "pass";
      } else {
        cinGroup.visible = false;
      }
    }

    window.addEventListener("scroll", updateScrollDirector, { passive: true });

    // ----------------------------------------------------
    // RESIZE & RENDER LOOP
    // ----------------------------------------------------
    function onResize() {
      const w = window.innerWidth, h = window.innerHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.fov = w < 768 ? 48 : 40;
      camera.position.z = w < 768 ? 12.5 : 10.5;
      camera.updateProjectionMatrix();
      cinGroup.position.x = w < 768 ? 0 : 2.5;
    }
    window.addEventListener("resize", onResize);

    const clock = new THREE.Clock();
    let isTabVisible = true;
    document.addEventListener("visibilitychange", () => { isTabVisible = !document.hidden; });

    function animate() {
      requestAnimationFrame(animate);
      if (!isTabVisible) return;

      const t = clock.getElapsedTime();

      // Smooth inertia rotation
      currentRotX += (targetRotX - currentRotX) * 0.08;
      currentRotY += (targetRotY - currentRotY) * 0.08;

      if (heroGroup.visible) {
        heroGroup.rotation.x = currentRotX + Math.sin(t * 0.4) * 0.04;
        heroGroup.rotation.y = currentRotY + t * 0.12;

        heroCert.position.y = Math.sin(t * 0.8) * 0.15;
        heroCert.rotation.y = Math.sin(t * 0.5) * 0.1;

        orbitCards.forEach((oc, i) => {
          const a = oc.data.angle + t * 0.25;
          const r = oc.data.r;
          oc.mesh.position.set(Math.cos(a) * r, oc.data.y + Math.sin(t * 1.2 + i) * 0.12, Math.sin(a) * r * 0.6);
          oc.mesh.rotation.y = -a + Math.PI / 2 + Math.sin(t * 0.6) * 0.15;
          oc.mesh.rotation.x = Math.sin(t * 0.5 + i) * 0.1;
        });
      }

      if (cinGroup.visible) {
        cinGroup.rotation.y = Math.sin(t * 0.6) * 0.25;
        cinGroup.rotation.x = currentRotX * 0.5;

        if (scannerObj.group.visible) {
          scannerObj.beam.position.z = Math.sin(t * 2.0) * 0.6;
          scannerObj.outDoc.position.y = 0.85 + Math.sin(t * 1.5) * 0.05;
        }
        if (pvcCard.visible) {
          pvcCard.rotation.y = t * 0.8;
        }
        if (lamCard.visible) {
          lamCard.rotation.y = Math.sin(t * 0.5) * 0.3;
        }
        if (passbook.visible) {
          passbook.rotation.y = -0.3 + Math.sin(t * 0.6) * 0.2;
        }
      }

      renderer.render(scene, camera);
    }

    animate();
    updateScrollDirector();
  }

  window.addEventListener("DOMContentLoaded", () => {
    initMasterEngine();
  });

})();