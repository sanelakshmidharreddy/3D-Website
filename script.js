/**
 * SRI MANIKANTA MEESEVA — EXECUTIVE CIVIC SCRIPT
 * Big Standing Indian Flag with Air Flutter Wave Simulation
 * Background Parallax Engine (Monuments & Document Stream)
 * Single Audio Source, Live Service Search & Interactive Accordions
 */

(function () {
  "use strict";

  /* ================================================================
     1. PERFORMANCE & REDUCED MOTION DETECTION
     ================================================================ */
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;

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
      setTimeout(() => {
        if (loader.parentNode) loader.parentNode.removeChild(loader);
      }, 500);
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
  if (cursor && !isMobile && !prefersReducedMotion) {
    let cx = -100, cy = -100, mx = -100, my = -100;
    document.addEventListener("mousemove", (e) => {
      mx = e.clientX;
      my = e.clientY;
      cursor.style.opacity = "1";
    });
    document.addEventListener("mouseleave", () => {
      cursor.style.opacity = "0";
    });

    function tickCursor() {
      cx += (mx - cx) * 0.2;
      cy += (my - cy) * 0.2;
      cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      requestAnimationFrame(tickCursor);
    }
    tickCursor();

    document.querySelectorAll("a, button, input, .service-card, .step-card, .spotlight-card, .community-card, .contact-card").forEach(el => {
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
     6. REAL-TIME FLUID INDIAN FLAG AIR WAVING SIMULATION
     ================================================================ */
  function startFlagSimulation(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const bandHeight = height / 3;
    let t = 0;

    function render() {
      ctx.clearRect(0, 0, width, height);

      // Slice cloth horizontally to calculate air fluid waves
      const sliceW = 2;
      for (let x = 0; x < width; x += sliceW) {
        const normX = x / width; // 0 at mast, 1 at free fluttering tip
        
        // Multi-frequency air wind equations
        const wave = Math.sin(normX * 4.2 - t * 3.8) * 9 * Math.pow(normX, 1.15) +
                     Math.sin(normX * 8.0 - t * 5.2) * 3 * normX;
        const slope = Math.cos(normX * 4.2 - t * 3.8) * 0.4 * normX;

        // Top Band: Saffron (#ff671f)
        ctx.fillStyle = "#ff671f";
        ctx.fillRect(x, wave, sliceW, bandHeight);

        // Middle Band: White (#ffffff)
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(x, bandHeight + wave, sliceW, bandHeight);

        // Bottom Band: India Green (#046a38)
        ctx.fillStyle = "#046a38";
        ctx.fillRect(x, bandHeight * 2 + wave, sliceW, bandHeight);

        // Dynamic Wind Lighting & Shadow on Wave Slopes
        if (slope > 0.08) {
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(0.25, slope * 0.45)})`;
          ctx.fillRect(x, wave, sliceW, height);
        } else if (slope < -0.08) {
          ctx.fillStyle = `rgba(0, 0, 0, ${Math.min(0.3, -slope * 0.5)})`;
          ctx.fillRect(x, wave, sliceW, height);
        }
      }

      // Draw Central Ashoka Chakra on White Band
      const cx = width / 2;
      const normCenterX = cx / width;
      const centerWave = Math.sin(normCenterX * 4.2 - t * 3.8) * 9 * Math.pow(normCenterX, 1.15);
      const cy = bandHeight * 1.5 + centerWave;
      const chakraRadius = bandHeight * 0.42;

      ctx.save();
      ctx.strokeStyle = "#000080";
      ctx.fillStyle = "#000080";
      ctx.lineWidth = Math.max(1.5, width * 0.012);

      // Outer Ring & Hub
      ctx.beginPath();
      ctx.arc(cx, cy, chakraRadius, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy, chakraRadius * 0.2, 0, Math.PI * 2);
      ctx.fill();

      // 24 Ashoka Spokes
      for (let i = 0; i < 24; i++) {
        const angle = (i * Math.PI) / 12;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(angle) * chakraRadius, cy + Math.sin(angle) * chakraRadius);
        ctx.stroke();
      }
      ctx.restore();

      if (!prefersReducedMotion) {
        t += 0.035;
        requestAnimationFrame(render);
      }
    }

    render();
  }

  /* ================================================================
     7. BACKGROUND PARALLAX SCROLL ENGINE (Documents & Monuments)
     ================================================================ */
  function initParallaxEngine() {
    if (prefersReducedMotion) return;

    const streamDocs = document.querySelectorAll(".stream-doc");
    const monumentLayer = document.getElementById("monumentLayer");

    let latestKnownScrollY = 0;
    let ticking = false;

    function onScroll() {
      latestKnownScrollY = window.scrollY;
      if (!ticking) {
        requestAnimationFrame(() => {
          const sy = latestKnownScrollY;

          // Parallax for Background Monuments
          if (monumentLayer) {
            monumentLayer.style.transform = `translateY(${sy * 0.08}px)`;
          }

          // Parallax for Floating Document Stream
          streamDocs.forEach(doc => {
            const speed = parseFloat(doc.dataset.speed) || 0.15;
            doc.style.transform = `translateY(${sy * speed}px)`;
          });

          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ================================================================
     8. DATA POPULATION (Services, Marquee, Testimonials, FAQ)
     ================================================================ */
  function populateContent() {
    const D = window.MEESEVA_DATA;
    if (!D) return;

    // Marquee Ticker
    const marqueeTrack = document.getElementById("marqueeTrack");
    if (marqueeTrack && D.marqueeItems) {
      const itemsHtml = D.marqueeItems.map(item => `<div class="marquee-item">${item}</div>`).join("");
      marqueeTrack.innerHTML = itemsHtml + itemsHtml;
    }

    // Services Catalog
    const serviceGroups = document.getElementById("serviceGroups");
    if (serviceGroups && D.categories) {
      let html = "";
      D.categories.forEach(cat => {
        html += `
          <div class="service-group" data-category="${cat.id}">
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
      testTrack.innerHTML = D.testimonials.map(t => `
        <div class="testimonial-card">
          <div class="testimonial-stars">★★★★★</div>
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
    }

    // Interactive FAQ Accordion
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

    // Live Smart Search & Category Chips
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

        if (visibleCountInGroup > 0) group.classList.remove("is-hidden");
        else group.classList.add("is-hidden");
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

  /* ================================================================
     9. INTERSECTION REVEALS & METRIC COUNTERS
     ================================================================ */
  function initReveals() {
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
  }

  /* ================================================================
     10. BACK TO TOP
     ================================================================ */
  const backToTop = document.getElementById("backToTop");
  if (backToTop) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 400) backToTop.classList.add("is-visible");
      else backToTop.classList.remove("is-visible");
    }, { passive: true });
  }

  /* ================================================================
     11. INITIALIZATION
     ================================================================ */
  window.addEventListener("DOMContentLoaded", () => {
    populateContent();
    startFlagSimulation("bgFlagCanvas");
    startFlagSimulation("heroFlagCanvas");
    initParallaxEngine();
    initReveals();
  });

})();