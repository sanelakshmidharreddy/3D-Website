/**
 * SRI MANIKANTA MEESEVA — PREMIUM CINEMATIC MOTION & SPATIAL CAMERA ENGINE
 * Award-Winning Scroll Storytelling: Continuous Camera Flight, Physical Momentum, Specular Light Sweeps & Dynamic Atmosphere
 * Single Master WebGL Architecture (100% Crash-Proof, 1 WebGL Context)
 */

(function () {
  "use strict";

  /* ================================================================
     1. HARDWARE CAPABILITIES & PERFORMANCE
     ================================================================ */
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
  const deviceDPR = isMobile ? Math.min(window.devicePixelRatio || 1, 1.25) : Math.min(window.devicePixelRatio || 1, 2);

  let webglAvailable = false;
  try {
    const testCanvas = document.createElement("canvas");
    webglAvailable = !!(window.WebGLRenderingContext && (testCanvas.getContext("webgl") || testCanvas.getContext("experimental-webgl")));
  } catch (e) {
    webglAvailable = false;
  }

  /* ================================================================
     2. GLOBAL LOADER & SMOOTH SCROLL PROGRESS
     ================================================================ */
  const loader = document.getElementById("loader");
  const progressBar = document.querySelector(".scroll-progress-bar");
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  function dismissLoader() {
    if (loader) {
      loader.classList.add("is-hidden");
      setTimeout(() => { if (loader.parentNode) loader.parentNode.removeChild(loader); }, 500);
    }
  }
  window.addEventListener("load", dismissLoader);
  setTimeout(dismissLoader, 1800);

  window.addEventListener("scroll", () => {
    if (!progressBar) return;
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const p = docH > 0 ? (window.scrollY / docH) * 100 : 0;
    progressBar.style.width = p + "%";
  }, { passive: true });

  /* ================================================================
     3. CUSTOM INTERACTION CURSOR
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
     4. NAVIGATION & MOBILE EXPANSION
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
     5. BRANDED HEADER AUDIO CONTROLLER (Single Source of Truth)
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
     6. INTERSECTION REVEALS & METRIC COUNTERS
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
      marqueeTrack.innerHTML = itemsHtml + itemsHtml;
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
     9. ULTRA-HD PROCEDURAL DOCUMENT TEXTURES (1024x1400 & 1024x640)
     Off-White Parchment, AP Lion Crest, MeeSeva Stamps & Golden Foils
     ================================================================ */
  const HDTextures = (() => {
    const cache = {};

    function getOrCreate(key, drawFn, w = 1024, h = 1400) {
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

    // 1. AP Official Certificate Document (ఆదాయ, కుల, నివాస, EWS)
    function certFront(title = "ఆదాయ ధృవీకరణ పత్రం", docId = "AP-INCOME-2026") {
      return getOrCreate(`cert_f_${title}_${docId}`, (ctx, w, h) => {
        const grad = ctx.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0, "#fdfcf7"); grad.addColorStop(0.5, "#f7f3e8"); grad.addColorStop(1, "#f2ebe0");
        ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h);

        ctx.strokeStyle = "#b45309"; ctx.lineWidth = 14; ctx.strokeRect(28, 28, w - 56, h - 56);
        ctx.strokeStyle = "#0284c7"; ctx.lineWidth = 4; ctx.strokeRect(44, 44, w - 88, h - 88);

        ctx.fillStyle = "#0f172a"; ctx.font = "bold 38px 'Noto Sans Telugu', sans-serif"; ctx.textAlign = "center";
        ctx.fillText("ఆంధ్రప్రదేశ్ ప్రభుత్వం", w / 2, 110);
        ctx.fillStyle = "#0369a1"; ctx.font = "bold 24px 'Space Grotesk', sans-serif";
        ctx.fillText("GOVERNMENT OF ANDHRA PRADESH", w / 2, 148);
        ctx.fillStyle = "#b45309"; ctx.font = "bold 20px 'Space Grotesk', sans-serif";
        ctx.fillText("REVENUE DEPARTMENT — MEESEVA CITIZEN SERVICES", w / 2, 178);

        ctx.fillStyle = "#f59e0b"; ctx.fillRect(100, 195, w - 200, 6);

        ctx.fillStyle = "#090d16"; ctx.font = "800 46px 'Noto Sans Telugu', sans-serif";
        ctx.fillText(title, w / 2, 280);

        ctx.fillStyle = "#ffffff"; ctx.strokeStyle = "#cbd5e1"; ctx.lineWidth = 2;
        ctx.fillRect(100, 320, w - 200, 480);
        ctx.strokeRect(100, 320, w - 200, 480);

        ctx.textAlign = "left"; ctx.fillStyle = "#334155"; ctx.font = "600 28px 'Noto Sans Telugu', sans-serif";
        ctx.fillText(`ధృవీకరణ సంఖ్య: ${docId}`, 130, 380);
        ctx.fillText("సేవా కేంద్రం: శ్రీ మణికంఠ మీ సేవ — వెల్దుర్తి", 130, 440);
        ctx.fillText("దరఖాస్తుదారు: శ్రీ లక్ష్మీధర్ రెడ్డి", 130, 500);
        ctx.fillText("మండలం: వెల్దుర్తి  |  జిల్లా: కర్నూలు", 130, 560);
        ctx.fillText("జారీ తేదీ: 21-08-2026", 130, 620);
        ctx.fillText("పరిశీలన స్థితి: డిజిటల్ సంతకంతో ఆమోదించబడింది ✓", 130, 680);

        // Holographic Seal
        ctx.save();
        ctx.translate(220, 880);
        const hg = ctx.createRadialGradient(0, 0, 10, 0, 0, 60);
        hg.addColorStop(0, "#fbbf24"); hg.addColorStop(0.5, "#38bdf8"); hg.addColorStop(1, "#a855f7");
        ctx.fillStyle = hg; ctx.beginPath(); ctx.arc(0, 0, 65, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 4; ctx.stroke();
        ctx.fillStyle = "#030712"; ctx.font = "bold 20px 'Space Grotesk', sans-serif"; ctx.textAlign = "center";
        ctx.fillText("GENUINE", 0, -6); ctx.fillText("MEESEVA", 0, 18);
        ctx.restore();

        // Violet MeeSeva Stamp
        ctx.save();
        ctx.translate(w - 240, 880); ctx.rotate(-0.1);
        ctx.strokeStyle = "#7c3aed"; ctx.lineWidth = 5;
        ctx.beginPath(); ctx.arc(0, 0, 70, 0, Math.PI * 2); ctx.stroke();
        ctx.fillStyle = "#7c3aed"; ctx.font = "bold 18px 'Noto Sans Telugu', sans-serif"; ctx.textAlign = "center";
        ctx.fillText("శ్రీ మణికంఠ మీ సేవ", 0, -20);
        ctx.fillText("వెల్దుర్తి సెంటర్", 0, 8);
        ctx.fillText("VERIFIED ✓", 0, 32);
        ctx.restore();
      }, 1024, 1400);
    }

    // 2. Document Reverse Back Face
    function certBack() {
      return getOrCreate("cert_back", (ctx, w, h) => {
        ctx.fillStyle = "#f8f6ee"; ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = "#cbd5e1"; ctx.lineWidth = 8; ctx.strokeRect(30, 30, w - 60, h - 60);
        ctx.fillStyle = "#475569"; ctx.font = "bold 28px 'Noto Sans Telugu', sans-serif"; ctx.textAlign = "center";
        ctx.fillText("ముఖ్యమైన నిబంధనలు & డిజిటల్ ధృవీకరణ", w / 2, 140);
        ctx.font = "22px 'Noto Sans Telugu', sans-serif"; ctx.textAlign = "left";
        const terms = [
          "1. ఈ డాక్యుమెంట్ మీ సేవ పోర్టల్ ద్వారా ఆన్‌లైన్‌లో జారీ చేయబడింది.",
          "2. దీని అధికారికతను meeseva.ap.gov.in లో తనిఖీ చేయవచ్చు.",
          "3. శ్రీ మణికంఠ మీ సేవ, రైల్వే స్టేషన్ రోడ్, వెల్దుర్తి.",
          "4. హెల్ప్‌లైన్: 8985 100 777"
        ];
        terms.forEach((t, i) => ctx.fillText(t, 100, 260 + i * 80));
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

        ctx.fillStyle = "#f8fafc"; ctx.font = "bold 32px 'Space Grotesk', sans-serif"; ctx.textAlign = "left";
        ctx.fillText("INCOME TAX DEPARTMENT", 40, 70);
        ctx.fillStyle = "#fbbf24"; ctx.font = "bold 22px 'Space Grotesk', sans-serif";
        ctx.fillText("GOVT. OF INDIA", w - 240, 70);

        ctx.fillStyle = "#f59e0b"; ctx.fillRect(60, 110, 110, 80);
        ctx.fillStyle = "#ffffff"; ctx.font = "bold 26px 'Space Grotesk', sans-serif";
        ctx.fillText("NAME: LAKSHMIDHAR REDDY", 200, 135);
        ctx.fillText("FATHER: RAMANJANEYA REDDY", 200, 175);
        ctx.fillText("DOB: 15/08/1996", 200, 215);

        ctx.fillStyle = "#38bdf8"; ctx.font = "800 48px 'Space Grotesk', sans-serif";
        ctx.fillText("ABCDE8985K", 60, 310);

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
        ctx.fillStyle = "#f97316"; ctx.fillRect(0, 0, w, 24);
        ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 24, w, 24);
        ctx.fillStyle = "#16a34a"; ctx.fillRect(0, 48, w, 24);

        ctx.fillStyle = "#0f172a"; ctx.font = "bold 32px 'Noto Sans Telugu', sans-serif"; ctx.textAlign = "center";
        ctx.fillText("భారత విశిష్ట గుర్తింపు ప్రాధికార సంస్థ", w / 2, 125);
        ctx.fillStyle = "#64748b"; ctx.font = "bold 20px 'Space Grotesk', sans-serif";
        ctx.fillText("Unique Identification Authority of India", w / 2, 160);

        ctx.fillStyle = "#e2e8f0"; ctx.fillRect(60, 200, 160, 190);
        ctx.textAlign = "left"; ctx.fillStyle = "#0f172a"; ctx.font = "bold 26px 'Noto Sans Telugu', sans-serif";
        ctx.fillText("పేరు: లక్ష్మీధర్ రెడ్డి", 260, 240);
        ctx.fillText("పుట్టిన తేదీ: 15/08/1996", 260, 290);
        ctx.fillText("లింగం: పురుషుడు / MALE", 260, 340);

        ctx.fillStyle = "#dc2626"; ctx.font = "800 52px 'Space Grotesk', sans-serif"; ctx.textAlign = "center";
        ctx.fillText("XXXX XXXX 8985", w / 2, 470);
        ctx.fillStyle = "#059669"; ctx.font = "bold 22px 'Noto Sans Telugu', sans-serif";
        ctx.fillText("ఆధార్ — సామాన్యుని హక్కు", w / 2, 530);
      }, 1024, 640);
    }

    // 5. AP Rice / Ration Card
    function riceCardFront() {
      return getOrCreate("rice_card_front", (ctx, w, h) => {
        const grad = ctx.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0, "#78350f"); grad.addColorStop(1, "#1e1b4b");
        ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = "#fbbf24"; ctx.lineWidth = 8; ctx.strokeRect(16, 16, w - 32, h - 32);

        ctx.fillStyle = "#ffffff"; ctx.font = "bold 34px 'Noto Sans Telugu', sans-serif"; ctx.textAlign = "center";
        ctx.fillText("ఆంధ్రప్రదేశ్ ప్రభుత్వం — ఆహార సరఫరాల శాఖ", w / 2, 75);
        ctx.fillStyle = "#fef08a"; ctx.font = "800 42px 'Noto Sans Telugu', sans-serif";
        ctx.fillText("రైస్ కార్డ్ (RICE CARD)", w / 2, 135);

        ctx.fillStyle = "#ffffff"; ctx.fillRect(60, 170, w - 120, 320);
        ctx.textAlign = "left"; ctx.fillStyle = "#0f172a"; ctx.font = "bold 26px 'Noto Sans Telugu', sans-serif";
        ctx.fillText("కుటుంబ పెద్ద: శ్రీ లక్ష్మీధర్ రెడ్డి", 90, 230);
        ctx.fillText("కార్డ్ నంబర్: WAP08985100777", 90, 290);
        ctx.fillText("మండలం: వెల్దుర్తి  |  గ్రామం: వెల్దుర్తి", 90, 350);

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
      }, 800, 1100);
    }

    return { certFront, certBack, panFront, aadhaarFront, riceCardFront, passbookCover };
  })();

  /* ================================================================
     10. 3D DIGITAL DOCUMENT MESH CREATION
     ================================================================ */
  const MeshFactory = (() => {
    function createDocument(frontTex, backTex = null, w = 2.8, h = 3.8, d = 0.03) {
      const geom = new THREE.BoxGeometry(w, h, d);
      const fMat = new THREE.MeshPhysicalMaterial({
        map: frontTex,
        roughness: 0.28,
        metalness: 0.05,
        clearcoat: 0.6,
        clearcoatRoughness: 0.2
      });
      const bMat = new THREE.MeshPhysicalMaterial({
        map: backTex || HDTextures.certBack(),
        roughness: 0.35,
        metalness: 0.05
      });
      const edgeMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.85, roughness: 0.2 });
      return new THREE.Mesh(geom, [edgeMat, edgeMat, edgeMat, edgeMat, fMat, bMat]);
    }

    function createCard(frontTex, backTex = null, w = 3.6, h = 2.2, d = 0.05) {
      const geom = new THREE.BoxGeometry(w, h, d);
      const fMat = new THREE.MeshPhysicalMaterial({
        map: frontTex,
        roughness: 0.16,
        metalness: 0.25,
        clearcoat: 0.8,
        clearcoatRoughness: 0.12
      });
      const bMat = new THREE.MeshPhysicalMaterial({
        map: backTex || frontTex,
        roughness: 0.22,
        metalness: 0.15
      });
      const sideMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.85, roughness: 0.15 });
      return new THREE.Mesh(geom, [sideMat, sideMat, sideMat, sideMat, fMat, bMat]);
    }

    return { createDocument, createCard };
  })();

  /* ================================================================
     11. MASTER CINEMATIC MOTION & SPATIAL CAMERA ENGINE
     Physical Momentum, Z-Depth Travel, Perspective Rotation & Light Sweeps
     ================================================================ */
  function initMasterDocumentEngine() {
    const canvas = document.getElementById("master3DCanvas");
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
      renderer.setScissorTest(true);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.4;
    } catch (err) {
      console.warn("WebGL initialization skipped:", err);
      return;
    }

    canvas.addEventListener("webglcontextlost", (e) => {
      e.preventDefault();
      console.warn("WebGL Context Lost — preserving stability.");
    });
    canvas.addEventListener("webglcontextrestored", () => {
      console.log("WebGL Context Restored — reinitializing engine.");
      initMasterDocumentEngine();
    });

    const registeredStages = [];

    // Studio 3-Point Lighting + Dynamic Moving Specular Sweep Light
    function setupDocumentLighting(scene) {
      scene.add(new THREE.AmbientLight(0x2a4365, 0.95));

      const kl = new THREE.PointLight(0x38bdf8, 3.8, 35);
      kl.position.set(4, 5, 6);
      scene.add(kl);

      const rl = new THREE.PointLight(0xfbbf24, 2.8, 30);
      rl.position.set(-5, -3, 5);
      scene.add(rl);

      const sweepLight = new THREE.PointLight(0xffffff, 2.2, 20);
      sweepLight.position.set(-3, 1, 4);
      scene.add(sweepLight);

      return { sweepLight };
    }

    // Dynamic Atmosphere Shifts
    const atmosphereThemes = [
      { top: "#0284c7", mid: "#b45309", bot: "#4338ca" },
      { top: "#0284c7", mid: "#059669", bot: "#38bdf8" },
      { top: "#059669", mid: "#b45309", bot: "#0284c7" },
      { top: "#0369a1", mid: "#b45309", bot: "#1e1b4b" },
      { top: "#d97706", mid: "#78350f", bot: "#0284c7" },
      { top: "#0f2942", mid: "#b45309", bot: "#0369a1" },
      { top: "#b45309", mid: "#0284c7", bot: "#0f2942" }
    ];

    function updateAtmosphere(scrollRatio) {
      const idx = Math.min(atmosphereThemes.length - 1, Math.floor(scrollRatio * atmosphereThemes.length));
      const th = atmosphereThemes[idx];
      document.documentElement.style.setProperty("--orb-color-1", th.top);
      document.documentElement.style.setProperty("--orb-color-2", th.mid);
      document.documentElement.style.setProperty("--orb-color-3", th.bot);
    }

    // ----------------------------------------------------
    // 1. HERO 3D DOCUMENT GALAXY STAGE
    // ----------------------------------------------------
    const heroEl = document.querySelector('[data-stage="hero"]');
    if (heroEl) {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(isMobile ? 48 : 40, 1, 0.1, 80);
      camera.position.set(0, 0, isMobile ? 12.5 : 10.5);
      const lights = setupDocumentLighting(scene);

      const heroGroup = new THREE.Group();
      scene.add(heroGroup);

      const mainDoc = MeshFactory.createDocument(HDTextures.certFront("శ్రీ మణికంఠ మీ సేవ", "MEESEVA-VELDURTHI-AP"), null, 3.2, 4.4, 0.04);
      heroGroup.add(mainDoc);

      const orbitItems = [];
      const oData = [
        { mesh: MeshFactory.createCard(HDTextures.panFront()), angle: 0, r: 4.8, y: 0.6 },
        { mesh: MeshFactory.createCard(HDTextures.aadhaarFront()), angle: (Math.PI * 2) / 4, r: 5.0, y: -0.5 },
        { mesh: MeshFactory.createCard(HDTextures.riceCardFront()), angle: (Math.PI * 4) / 4, r: 4.8, y: 0.4 },
        { mesh: MeshFactory.createDocument(HDTextures.certFront("కుల సర్టిఫికేట్", "AP-CASTE-2026"), null, 2.2, 3.0, 0.03), angle: (Math.PI * 6) / 4, r: 4.9, y: -0.3 }
      ];

      oData.forEach(od => {
        od.mesh.scale.set(0.72, 0.72, 0.72);
        heroGroup.add(od.mesh);
        orbitItems.push(od);
      });

      let targetRotX = 0, targetRotY = 0;
      let currentRotX = 0, currentRotY = 0;
      let isDragging = false, startX = 0, startY = 0;

      window.addEventListener("pointerdown", (e) => {
        if (window.scrollY > window.innerHeight) return;
        isDragging = true; startX = e.clientX; startY = e.clientY;
      });
      window.addEventListener("pointermove", (e) => {
        if (isDragging) {
          targetRotY += (e.clientX - startX) * 0.006;
          targetRotX += (e.clientY - startY) * 0.006;
          startX = e.clientX; startY = e.clientY;
        } else {
          const nx = (e.clientX / window.innerWidth - 0.5) * 2;
          const ny = (e.clientY / window.innerHeight - 0.5) * 2;
          targetRotY = nx * 0.35;
          targetRotX = -ny * 0.25;
        }
      });
      window.addEventListener("pointerup", () => { isDragging = false; });

      if (window.DeviceOrientationEvent && isMobile) {
        window.addEventListener("deviceorientation", (e) => {
          if (e.gamma !== null && e.beta !== null && !isDragging) {
            targetRotY = (Math.max(-30, Math.min(30, e.gamma)) / 30) * 0.4;
            targetRotX = (Math.max(-30, Math.min(30, e.beta - 45)) / 30) * 0.3;
          }
        }, { passive: true });
      }

      registeredStages.push({
        element: heroEl,
        scene,
        camera,
        update(t) {
          currentRotX += (targetRotX - currentRotX) * 0.08;
          currentRotY += (targetRotY - currentRotY) * 0.08;

          heroGroup.rotation.x = currentRotX + Math.sin(t * 0.4) * 0.04;
          heroGroup.rotation.y = currentRotY + t * 0.15;

          mainDoc.position.y = Math.sin(t * 0.8) * 0.15;
          mainDoc.rotation.y = Math.sin(t * 0.5) * 0.1;

          lights.sweepLight.position.x = Math.sin(t * 1.2) * 5.0;

          orbitItems.forEach((oc, i) => {
            const a = oc.angle + t * 0.3;
            const r = oc.r;
            oc.mesh.position.set(Math.cos(a) * r, oc.y + Math.sin(t * 1.2 + i) * 0.15, Math.sin(a) * r * 0.6);
            oc.mesh.rotation.y = -a + Math.PI / 2 + Math.sin(t * 0.6) * 0.15;
          });
        }
      });
    }

    // Helper: Register a Cinema Document Stage with Physical Momentum & Travel
    function registerDocumentStage(selector, createMeshFn, cameraDist = 6.2) {
      const el = document.querySelector(selector);
      if (!el) return;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 50);
      camera.position.set(0, 0, cameraDist);
      const lights = setupDocumentLighting(scene);

      const docMesh = createMeshFn();
      scene.add(docMesh);

      registeredStages.push({
        element: el,
        scene,
        camera,
        update(t, scrollProgress, momentum) {
          // Physical Momentum: Scroll progress with spring lag
          const p = Math.max(0, Math.min(1, scrollProgress));
          const targetZ = -4.0 + (p * 5.5) + (momentum * 0.003);
          docMesh.position.z += (targetZ - docMesh.position.z) * 0.09;

          // Realistic perspective rotation: -18deg -> 0deg -> 14deg -> -8deg
          const targetRotY = (-0.32 + p * 0.55) + Math.sin(t * 0.6) * 0.12;
          const targetRotX = (-0.06 + Math.sin(t * 0.8) * 0.07);
          docMesh.rotation.y += (targetRotY - docMesh.rotation.y) * 0.09;
          docMesh.rotation.x += (targetRotX - docMesh.rotation.x) * 0.09;

          // Idle vertical floating with weight
          docMesh.position.y = Math.sin(t * 1.0) * 0.12;

          // Dynamic light sweep travelling across document
          lights.sweepLight.position.x = -4.5 + (p * 9.0) + Math.sin(t * 1.5) * 1.5;
        }
      });
    }

    // ----------------------------------------------------
    // 2. XEROX & PRINTING DOCUMENT STAGE
    // ----------------------------------------------------
    registerDocumentStage('[data-stage="xerox"]', () => {
      const g = new THREE.Group();
      const doc = MeshFactory.createDocument(HDTextures.certFront("కలర్ జిరాక్స్ డాక్యుమెంట్", "AP-PRINT-2026"), null, 2.6, 3.6, 0.03);
      g.add(doc);

      const laser = new THREE.Mesh(
        new THREE.CylinderGeometry(0.02, 0.02, 2.8, 16),
        new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x38bdf8, emissiveIntensity: 3.0 })
      );
      laser.rotation.z = Math.PI / 2;
      laser.position.set(0, 0, 0.04);
      g.add(laser);
      g.userData.laser = laser;
      return g;
    });

    // ----------------------------------------------------
    // 3. THERMAL LAMINATION STAGE
    // ----------------------------------------------------
    registerDocumentStage('[data-stage="lamination"]', () => {
      return MeshFactory.createDocument(HDTextures.certFront("లామినేషన్ సర్టిఫికేట్", "AP-LAM-2026"), null, 2.6, 3.6, 0.03);
    });

    // ----------------------------------------------------
    // 4. SMART PVC CARD STAGE
    // ----------------------------------------------------
    registerDocumentStage('[data-stage="pvccard"]', () => {
      return MeshFactory.createCard(HDTextures.panFront(), null, 3.6, 2.2, 0.08);
    }, 5.5);

    // ----------------------------------------------------
    // 5. PASSPORT PHOTO STUDIO STAGE
    // ----------------------------------------------------
    registerDocumentStage('[data-stage="photo"]', () => {
      const g = new THREE.Group();
      for (let i = -1; i <= 1; i++) {
        const p = MeshFactory.createCard(HDTextures.panFront(), null, 1.8, 2.2, 0.03);
        p.position.set(i * 0.9, 0, -Math.abs(i) * 0.3);
        p.rotation.z = i * 0.12;
        g.add(p);
      }
      return g;
    }, 6.0);

    // ----------------------------------------------------
    // 6. AP GOVT CERTIFICATES CASCADING FAN
    // ----------------------------------------------------
    registerDocumentStage('[data-stage="certificate"]', () => {
      const g = new THREE.Group();
      const c1 = MeshFactory.createDocument(HDTextures.certFront("ఆదాయ సర్టిఫికేట్", "AP-INC-2026"), null, 2.2, 3.2, 0.02);
      const c2 = MeshFactory.createDocument(HDTextures.certFront("కుల సర్టిఫికేట్", "AP-CAS-2026"), null, 2.2, 3.2, 0.02);
      const c3 = MeshFactory.createDocument(HDTextures.certFront("OBC / EWS సర్టిఫికేట్", "AP-OBC-2026"), null, 2.2, 3.2, 0.02);
      c1.position.set(-0.9, 0, -0.2); c1.rotation.z = -0.12;
      c2.position.set(0, 0.2, 0);
      c3.position.set(0.9, 0, -0.2); c3.rotation.z = 0.12;
      g.add(c1); g.add(c2); g.add(c3);
      return g;
    }, 6.5);

    // ----------------------------------------------------
    // 7. OFFICIAL ID CARDS ORBITAL STAGE
    // ----------------------------------------------------
    registerDocumentStage('[data-stage="idcards"]', () => {
      const g = new THREE.Group();
      const pan = MeshFactory.createCard(HDTextures.panFront(), null, 3.2, 2.0, 0.06);
      const aadh = MeshFactory.createCard(HDTextures.aadhaarFront(), null, 3.2, 2.0, 0.06);
      pan.position.set(-0.8, 0.3, 0); pan.rotation.z = -0.08;
      aadh.position.set(0.8, -0.3, 0.2); aadh.rotation.z = 0.08;
      g.add(pan); g.add(aadh);
      return g;
    }, 6.0);

    // ----------------------------------------------------
    // 8. RATION CARD DOCUMENT STAGE
    // ----------------------------------------------------
    registerDocumentStage('[data-stage="ration"]', () => {
      return MeshFactory.createCard(HDTextures.riceCardFront(), null, 3.4, 2.1, 0.06);
    }, 5.8);

    // ----------------------------------------------------
    // 9. PATTADAR PASSBOOK 3D STAGE
    // ----------------------------------------------------
    registerDocumentStage('[data-stage="passbook"]', () => {
      return MeshFactory.createCard(HDTextures.passbookCover(), null, 2.6, 3.6, 0.15);
    }, 6.2);

    // ----------------------------------------------------
    // 10. SPECIAL CITIZEN SERVICES STAGE
    // ----------------------------------------------------
    registerDocumentStage('[data-stage="special"]', () => {
      return MeshFactory.createCard(HDTextures.aadhaarFront(), null, 3.2, 2.0, 0.06);
    }, 5.8);

    // ----------------------------------------------------
    // SCROLL PHYSICS & CONTINUOUS RENDER LOOP
    // ----------------------------------------------------
    let targetScroll = 0, currentScroll = 0, scrollVelocity = 0;
    window.addEventListener("scroll", () => {
      targetScroll = window.scrollY;
    }, { passive: true });

    function onResize() {
      const w = window.innerWidth, h = window.innerHeight;
      renderer.setSize(w, h);
    }
    window.addEventListener("resize", onResize);

    const clock = new THREE.Clock();
    let isTabVisible = true;
    document.addEventListener("visibilitychange", () => { isTabVisible = !document.hidden; });

    function animate() {
      requestAnimationFrame(animate);
      if (!isTabVisible) return;

      const time = clock.getElapsedTime();

      // Smooth scroll lerp for physical weight
      currentScroll += (targetScroll - currentScroll) * 0.08;
      scrollVelocity = targetScroll - currentScroll;

      const docH = document.documentElement.scrollHeight - window.innerHeight;
      const globalRatio = docH > 0 ? (currentScroll / docH) : 0;
      updateAtmosphere(globalRatio);

      // Clear full canvas buffer
      renderer.setScissorTest(false);
      renderer.clear();
      renderer.setScissorTest(true);

      const winH = window.innerHeight;

      // Render each visible stage portal
      registeredStages.forEach(st => {
        const rect = st.element.getBoundingClientRect();

        // Viewport culling (super fast on mobile!)
        if (rect.bottom < 0 || rect.top > winH) return;

        const left = Math.floor(rect.left);
        const bottom = Math.floor(winH - rect.bottom);
        const width = Math.floor(rect.width);
        const height = Math.floor(rect.height);

        if (width <= 0 || height <= 0) return;

        renderer.setViewport(left, bottom, width, height);
        renderer.setScissor(left, bottom, width, height);

        st.camera.aspect = width / height;
        st.camera.updateProjectionMatrix();

        const scrollP = (winH - rect.top) / (winH + rect.height);
        st.update(time, scrollP, scrollVelocity);

        if (st.scene.children[1] && st.scene.children[1].userData && st.scene.children[1].userData.laser) {
          st.scene.children[1].userData.laser.position.y = Math.sin(time * 2.2) * 1.5;
        }

        renderer.render(st.scene, st.camera);
      });
    }

    animate();
  }

  window.addEventListener("DOMContentLoaded", () => {
    initMasterDocumentEngine();
  });

})();