/* ================================================================
   SRI MANIKANTA MEESEVA — INTERACTION ENGINE
   1. Utilities (reduced motion, device tier)
   2. Loader
   3. Custom cursor
   4. Scroll progress bar
   5. Back to top
   6. Nav (scroll state, mobile toggle)
   7. Hero 3D scene (Three.js)
   8. Hero text reveal
   9. Scroll reveal (IntersectionObserver)
   10. Counter animation
   11. Steps path draw + printer loop
   12. Services: render + smart search
   13. Marquee
   14. Testimonials render
   15. FAQ accordion
   16. Micro-interactions (magnetic, card tilt)
   17. GSAP scroll polish
   ================================================================ */

(() => {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const isSmallScreen = window.innerWidth < 760;
  const isLowPower = isSmallScreen || isCoarsePointer || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);

  /* -------------------------------------------------------
     1. LOADER
  ------------------------------------------------------- */
  window.addEventListener("load", () => {
    const loader = document.getElementById("loader");
    setTimeout(() => {
      if (loader) loader.classList.add("is-hidden");
      initHeroTextReveal();
    }, 500);
  });
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* -------------------------------------------------------
     2. CUSTOM CURSOR
  ------------------------------------------------------- */
  const cursor = document.getElementById("customCursor");
  if (cursor && !isCoarsePointer && !prefersReducedMotion) {
    let cx = 0, cy = 0, tx = 0, ty = 0;
    document.addEventListener("mousemove", (e) => { tx = e.clientX; ty = e.clientY; cursor.classList.remove("is-hidden"); });
    document.addEventListener("mouseleave", () => cursor.classList.add("is-hidden"));
    document.addEventListener("mouseenter", () => cursor.classList.remove("is-hidden"));

    const hoverEls = document.querySelectorAll("a, button, .service-card, .community-card, .step-card, .contact-card, .testimonial-card");
    hoverEls.forEach((el) => {
      el.addEventListener("mouseenter", () => cursor.classList.add("is-hover"));
      el.addEventListener("mouseleave", () => cursor.classList.remove("is-hover"));
    });

    function cursorLoop() {
      cx += (tx - cx) * 0.12;
      cy += (ty - cy) * 0.12;
      cursor.style.transform = `translate(${cx - 20}px, ${cy - 20}px)`;
      requestAnimationFrame(cursorLoop);
    }
    cursorLoop();
  }

  /* -------------------------------------------------------
     3. SCROLL PROGRESS BAR
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
     4. BACK TO TOP
  ------------------------------------------------------- */
  const backToTop = document.getElementById("backToTop");
  if (backToTop) {
    window.addEventListener("scroll", () => {
      backToTop.classList.toggle("is-visible", window.scrollY > 600);
    }, { passive: true });
  }

  /* -------------------------------------------------------
     5. NAV
  ------------------------------------------------------- */
  const siteNav = document.getElementById("siteNav");
  const onScrollNav = () => siteNav && siteNav.classList.toggle("is-scrolled", window.scrollY > 40);
  onScrollNav();
  window.addEventListener("scroll", onScrollNav, { passive: true });

  const navToggle = document.getElementById("navToggle");
  const navMobile = document.getElementById("navMobile");
  if (navToggle && navMobile) {
    navToggle.addEventListener("click", () => {
      const open = navMobile.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(open));
    });
    navMobile.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        navMobile.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      })
    );
  }

  /* -------------------------------------------------------
     6. HERO TEXT REVEAL
  ------------------------------------------------------- */
  function initHeroTextReveal() {
    const words = document.querySelectorAll(".reveal-word");
    words.forEach((w, i) => {
      setTimeout(() => w.classList.add("is-visible"), 300 + i * 200);
    });
    document.querySelectorAll(".reveal-up").forEach((el, i) => {
      setTimeout(() => el.classList.add("is-visible"), 800 + i * 150);
    });
  }

  /* -------------------------------------------------------
     7. SCROLL REVEAL
  ------------------------------------------------------- */
  const revealEls = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = Math.min((el.dataset.i || 0) * 80, 400);
          setTimeout(() => el.classList.add("is-visible"), delay);
          revealObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -6% 0px" }
  );
  const groupCounters = new Map();
  revealEls.forEach((el) => {
    const parent = el.parentElement;
    const n = groupCounters.get(parent) || 0;
    el.dataset.i = n;
    groupCounters.set(parent, n + 1);
    revealObserver.observe(el);
  });

  /* -------------------------------------------------------
     8. COUNTER ANIMATION
  ------------------------------------------------------- */
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
  }, { threshold: 0.5 });
  counters.forEach((c) => counterObserver.observe(c));

  function animateCounter(el, target) {
    const duration = 2000;
    const start = performance.now();
    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(update);
    }
    if (!prefersReducedMotion) {
      requestAnimationFrame(update);
    } else {
      el.textContent = target;
    }
  }

  /* -------------------------------------------------------
     9. STEPS PATH DRAW
  ------------------------------------------------------- */
  const stepsLine = document.querySelector(".steps-line");
  if (stepsLine) {
    stepsLine.style.display = "block";
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          stepsLine.classList.add("is-drawn");
          io.disconnect();
        }
      });
    }, { threshold: 0.4 });
    io.observe(stepsLine);
  }

  /* -------------------------------------------------------
     10. SERVICES: render + smart search
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

  /* -------------------------------------------------------
     11. MARQUEE
  ------------------------------------------------------- */
  function renderMarquee() {
    const track = document.getElementById("marqueeTrack");
    if (!track || typeof MARQUEE_ITEMS === "undefined") return;
    const items = MARQUEE_ITEMS.map((text) => `<span class="marquee-item">${text}</span>`).join("");
    track.innerHTML = items + items;
  }
  renderMarquee();

  /* -------------------------------------------------------
     12. TESTIMONIALS
  ------------------------------------------------------- */
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

  /* -------------------------------------------------------
     13. FAQ ACCORDION
  ------------------------------------------------------- */
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

  /* -------------------------------------------------------
     14. MICRO-INTERACTIONS
  ------------------------------------------------------- */
  if (!isCoarsePointer && !prefersReducedMotion) {
    document.querySelectorAll(".magnetic").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        el.style.transform = `translate(${x * 0.18}px, ${y * 0.28}px)`;
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
        card.style.transform = `perspective(600px) rotateX(${-py * 8}deg) rotateY(${px * 8}deg) translateY(-4px)`;
      });
      card.addEventListener("mouseleave", () => { card.style.transform = ""; });
    });
  }

  /* -------------------------------------------------------
     15. SERVICE OBJECT FACTORY — Reusable 3D primitives
  ------------------------------------------------------- */
  const SF = (() => {
    function rr(w, h, r) {
      const s = new THREE.Shape();
      s.moveTo(-w/2+r,-h/2); s.lineTo(w/2-r,-h/2);
      s.quadraticCurveTo(w/2,-h/2,w/2,-h/2+r); s.lineTo(w/2,h/2-r);
      s.quadraticCurveTo(w/2,h/2,w/2-r,h/2); s.lineTo(-w/2+r,h/2);
      s.quadraticCurveTo(-w/2,h/2,-w/2,h/2-r); s.lineTo(-w/2,-h/2+r);
      s.quadraticCurveTo(-w/2,-h/2,-w/2+r,-h/2);
      return s;
    }
    function card(cfg) {
      const w=cfg.w||3.4,h=cfg.h||2.1,col=cfg.color||0x0d3450,acc=cfg.accent||0x35d0f0,d=cfg.depth||0.12;
      const g=new THREE.Group();
      const geo=new THREE.ExtrudeGeometry(rr(w,h,0.18),{depth:d,bevelEnabled:true,bevelThickness:0.03,bevelSize:0.03,bevelSegments:2,curveSegments:10});
      g.add(new THREE.Mesh(geo,new THREE.MeshPhysicalMaterial({color:col,metalness:0.3,roughness:0.35,clearcoat:0.5,clearcoatRoughness:0.3,emissive:col,emissiveIntensity:0.15})));
      g.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo),new THREE.LineBasicMaterial({color:acc,transparent:true,opacity:0.35})));
      const stripe=new THREE.Mesh(new THREE.BoxGeometry(w-0.2,0.3,d+0.02),new THREE.MeshStandardMaterial({color:acc,emissive:acc,emissiveIntensity:0.3,metalness:0.4,roughness:0.3}));
      stripe.position.set(0,h/2-0.25,d/2); g.add(stripe);
      const lm=new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:0.18});
      for(let i=0;i<3;i++){const l=new THREE.Mesh(new THREE.BoxGeometry(w*(0.45-i*0.06),0.035,0.005),lm);l.position.set(-w*0.05,h/2-0.6-i*0.18,d+0.01);g.add(l);}
      const ph=new THREE.Mesh(new THREE.BoxGeometry(0.38,0.48,0.005),new THREE.MeshBasicMaterial({color:acc,transparent:true,opacity:0.22}));
      ph.position.set(w/2-0.52,-0.08,d+0.01); g.add(ph);
      return g;
    }
    function cert() {
      const w=4.2,h=3.2,g=new THREE.Group();
      g.add(new THREE.Mesh(new THREE.ExtrudeGeometry(rr(w,h,0.1),{depth:0.06,bevelEnabled:true,bevelThickness:0.02,bevelSize:0.02,bevelSegments:2}),new THREE.MeshPhysicalMaterial({color:0xf5f0e0,metalness:0.05,roughness:0.6,clearcoat:0.2,emissive:0xf5f0e0,emissiveIntensity:0.1})));
      const bs=rr(w-0.3,h-0.3,0.08),bh=rr(w-0.45,h-0.45,0.06);bs.holes.push(bh);
      const b=new THREE.Mesh(new THREE.ShapeGeometry(bs),new THREE.MeshBasicMaterial({color:0xc9a536,side:THREE.DoubleSide}));b.position.z=0.065;g.add(b);
      const seal=new THREE.Mesh(new THREE.CircleGeometry(0.35,24),new THREE.MeshStandardMaterial({color:0xc9a536,metalness:0.6,roughness:0.3,emissive:0x7a4b0f,emissiveIntensity:0.3}));
      seal.position.set(0,-0.8,0.07);g.add(seal);
      const tlm=new THREE.MeshBasicMaterial({color:0x2c3e50,transparent:true,opacity:0.22});
      [0.5,0.2,-0.1,-0.35].forEach((y,i)=>{const l=new THREE.Mesh(new THREE.BoxGeometry(i===0?w*0.6:w*(0.38+Math.random()*0.12),0.028,0.003),tlm);l.position.set(0,y,0.07);g.add(l);});
      return g;
    }
    function book(cfg) {
      const w=cfg.w||2.6,h=cfg.h||3.4,col=cfg.color||0x1a3355,acc=cfg.accent||0xf2b74d,t=cfg.thickness||0.3;
      const g=new THREE.Group();
      const geo=new THREE.BoxGeometry(w,h,t);
      g.add(new THREE.Mesh(geo,new THREE.MeshPhysicalMaterial({color:col,metalness:0.2,roughness:0.4,clearcoat:0.6,clearcoatRoughness:0.25,emissive:col,emissiveIntensity:0.15})));
      g.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo),new THREE.LineBasicMaterial({color:acc,transparent:true,opacity:0.3})));
      const em=new THREE.Mesh(new THREE.CircleGeometry(0.28,20),new THREE.MeshStandardMaterial({color:acc,metalness:0.5,roughness:0.3,emissive:acc,emissiveIntensity:0.3}));
      em.position.set(0,0.4,t/2+0.01);g.add(em);
      return g;
    }
    function printer3d() {
      const g=new THREE.Group();
      const body=new THREE.Mesh(new THREE.BoxGeometry(3.2,1.2,2),new THREE.MeshPhysicalMaterial({color:0xf0f0f0,metalness:0.1,roughness:0.4,clearcoat:0.3}));
      body.position.y=0.2;g.add(body);
      const top=new THREE.Mesh(new THREE.BoxGeometry(3.2,0.08,2),new THREE.MeshPhysicalMaterial({color:0x1a1a2e,metalness:0.2,roughness:0.35}));
      top.position.y=0.84;g.add(top);
      const tray=new THREE.Mesh(new THREE.BoxGeometry(2.2,0.06,1.6),new THREE.MeshStandardMaterial({color:0x2c3e50,metalness:0.2,roughness:0.5}));
      tray.position.set(0,-0.42,0);g.add(tray);
      const led=new THREE.Mesh(new THREE.SphereGeometry(0.06,12,12),new THREE.MeshStandardMaterial({color:0x35d0f0,emissive:0x35d0f0,emissiveIntensity:1}));
      led.position.set(1.3,0.5,1.01);g.add(led);
      return g;
    }
    function scanner3d() {
      const g=new THREE.Group();
      g.add(new THREE.Mesh(new THREE.BoxGeometry(3,0.35,2.2),new THREE.MeshPhysicalMaterial({color:0x1a1a2e,metalness:0.3,roughness:0.35,clearcoat:0.4})));
      const glass=new THREE.Mesh(new THREE.BoxGeometry(2.6,0.04,1.8),new THREE.MeshPhysicalMaterial({color:0x88ccdd,metalness:0.1,roughness:0.05,transparent:true,opacity:0.5}));
      glass.position.y=0.2;g.add(glass);
      const led=new THREE.Mesh(new THREE.BoxGeometry(2.6,0.02,0.05),new THREE.MeshStandardMaterial({color:0x35d0f0,emissive:0x35d0f0,emissiveIntensity:0.8}));
      led.position.set(0,0.22,-0.88);g.add(led);
      return g;
    }
    function photo3d() {
      const g=new THREE.Group();
      g.add(new THREE.Mesh(new THREE.BoxGeometry(1.2,1.5,0.04),new THREE.MeshPhysicalMaterial({color:0xffffff,metalness:0.05,roughness:0.5,clearcoat:0.2})));
      const img=new THREE.Mesh(new THREE.BoxGeometry(0.9,1.1,0.005),new THREE.MeshStandardMaterial({color:0x4a6fa5,metalness:0.1,roughness:0.5}));
      img.position.z=0.025;g.add(img);
      const head=new THREE.Mesh(new THREE.SphereGeometry(0.16,12,12),new THREE.MeshStandardMaterial({color:0x2c3e50,metalness:0.1,roughness:0.5}));
      head.position.set(0,0.15,0.035);g.add(head);
      const body=new THREE.Mesh(new THREE.CylinderGeometry(0.22,0.3,0.3,12),new THREE.MeshStandardMaterial({color:0x2c3e50,metalness:0.1,roughness:0.5}));
      body.position.set(0,-0.2,0.035);g.add(body);
      return g;
    }
    function stamp() {
      const w=3.6,h=4.6,g=new THREE.Group();
      g.add(new THREE.Mesh(new THREE.ExtrudeGeometry(rr(w,h,0.05),{depth:0.04,bevelEnabled:false}),new THREE.MeshPhysicalMaterial({color:0xf0e8c8,metalness:0.02,roughness:0.65,clearcoat:0.1,emissive:0xf0e8c8,emissiveIntensity:0.08})));
      const bs2=rr(w-0.25,h-0.25,0.04),bh2=rr(w-0.4,h-0.4,0.03);bs2.holes.push(bh2);
      const bd=new THREE.Mesh(new THREE.ShapeGeometry(bs2),new THREE.MeshBasicMaterial({color:0x8b0000,side:THREE.DoubleSide,transparent:true,opacity:0.35}));bd.position.z=0.045;g.add(bd);
      const st=new THREE.Mesh(new THREE.CircleGeometry(0.42,6),new THREE.MeshStandardMaterial({color:0x8b0000,emissive:0x8b0000,emissiveIntensity:0.2,metalness:0.3,roughness:0.5,transparent:true,opacity:0.65}));
      st.position.set(0.2,-0.3,0.05);g.add(st);
      return g;
    }
    return {rr,card,cert,book,printer3d,scanner3d,photo3d,stamp};
  })();

  /* -------------------------------------------------------
     15b. HERO 3D SCENE — CINEMATIC SERVICE UNIVERSE
  ------------------------------------------------------- */
  const canvas = document.getElementById("heroCanvas");
  const heroSection = document.querySelector(".hero");

  function initHeroScene() {
    if (!canvas || typeof THREE === "undefined") return;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({canvas,alpha:true,antielias:!isLowPower});
      renderer.setPixelRatio(Math.min(window.devicePixelRatio,isLowPower?1.5:2));
      renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.3;
    } catch (e) {
      canvas.style.background = "linear-gradient(145deg, #030b16 0%, #061428 50%, #0b2740 100%)";
      return;
    }
    const scene=new THREE.Scene();
    const camera=new THREE.PerspectiveCamera(42,1,0.1,120);
    camera.position.set(0,0,14);
    function resize(){const w=heroSection.clientWidth,h=heroSection.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();}
    resize();window.addEventListener("resize",resize);

    scene.add(new THREE.AmbientLight(0x2c5c78,0.6));
    const kL=new THREE.PointLight(0x35d0f0,4,40);kL.position.set(6,5,8);scene.add(kL);
    const rL=new THREE.PointLight(0xf2b74d,2.5,35);rL.position.set(-6,-4,6);scene.add(rL);
    const fL=new THREE.PointLight(0x9b8cf2,1.2,25);fL.position.set(0,-6,5);scene.add(fL);
    const bL=new THREE.PointLight(0x7ee8ff,1,30);bL.position.set(0,3,-8);scene.add(bL);

    const centerCert=SF.cert();centerCert.scale.set(1.1,1.1,1.1);scene.add(centerCert);

    const defs=[
      {mk:()=>SF.card({color:0x003366,accent:0xf2b74d}),ly:1},
      {mk:()=>SF.card({color:0x0e5c3a,accent:0xf2b74d}),ly:1},
      {mk:()=>SF.card({color:0x1a1a3a,accent:0x35d0f0}),ly:1},
      {mk:()=>SF.card({color:0x8b4513,accent:0xf2b74d}),ly:1},
      {mk:()=>SF.card({color:0x2c3e50,accent:0x35d0f0}),ly:2},
      {mk:()=>SF.card({color:0x6b3a6b,accent:0xf2b74d}),ly:2},
      {mk:()=>SF.card({color:0x1a4a6b,accent:0x6bd39c}),ly:2},
      {mk:()=>SF.book({color:0x1a3355,accent:0xf2b74d}),ly:2},
      {mk:()=>SF.book({color:0x1565c0,accent:0xf2b74d,w:2.4,h:3,thickness:0.25}),ly:3},
      {mk:()=>SF.stamp(),ly:3},
      {mk:()=>SF.printer3d(),ly:3},
      {mk:()=>SF.scanner3d(),ly:3},
      {mk:()=>SF.photo3d(),ly:3},
    ];
    const count=isLowPower?7:defs.length;
    const lR={1:4.2,2:6.5,3:9},lS={1:0.42,2:0.34,3:0.28},lSp={1:0.14,2:0.09,3:0.06},lT={1:0.5,2:0.35,3:0.25};
    const objs=[];
    for(let i=0;i<count;i++){
      const d=defs[i],o=d.mk(),ly=d.ly,sc=isLowPower?lS[ly]*1.15:lS[ly];
      o.scale.set(sc,sc,sc);
      const a=(i/count)*Math.PI*2+(ly*0.7),rad=lR[ly]+(Math.random()-0.5)*0.8,sp=lSp[ly]+(Math.random()-0.5)*0.02,bp=Math.random()*Math.PI*2;
      o.userData={a,rad,sp,bp,tilt:lT[ly],ly};
      scene.add(o);objs.push(o);
    }

    const pc=isLowPower?80:250,pp=new Float32Array(pc*3);
    for(let i=0;i<pc;i++){pp[i*3]=(Math.random()-0.5)*30;pp[i*3+1]=(Math.random()-0.5)*20;pp[i*3+2]=(Math.random()-0.5)*16-3;}
    const pGeo=new THREE.BufferGeometry();pGeo.setAttribute("position",new THREE.BufferAttribute(pp,3));
    const parts=new THREE.Points(pGeo,new THREE.PointsMaterial({color:0x7ee8ff,size:0.04,transparent:true,opacity:0.45,sizeAttenuation:true}));
    scene.add(parts);

    const ringMeshes=[];
    [{r:4.2,c:0x35d0f0,o:0.08},{r:6.5,c:0x9b8cf2,o:0.06},{r:9,c:0xf2b74d,o:0.04}].forEach(({r,c,o})=>{
      const m=new THREE.Mesh(new THREE.TorusGeometry(r,0.008,8,120),new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:o}));
      m.rotation.x=Math.PI*0.42;scene.add(m);ringMeshes.push(m);
    });

    const ptr={x:0,y:0},sm={x:0,y:0};
    if(!isCoarsePointer)window.addEventListener("mousemove",e=>{ptr.x=(e.clientX/window.innerWidth)*2-1;ptr.y=(e.clientY/window.innerHeight)*2-1;});

    let sP=0;
    function updScroll(){const r=heroSection.getBoundingClientRect();sP=Math.min(Math.max(-r.top/heroSection.offsetHeight,0),1);}
    window.addEventListener("scroll",updScroll,{passive:true});updScroll();

    let vis=true;
    new IntersectionObserver(e=>{vis=e[0].isIntersecting;},{threshold:0}).observe(heroSection);

    const clock=new THREE.Clock();
    (function animate(){
      requestAnimationFrame(animate);if(!vis)return;
      const t=clock.getElapsedTime();
      sm.x+=(ptr.x-sm.x)*0.03;sm.y+=(ptr.y-sm.y)*0.03;

      centerCert.rotation.x=sm.y*0.25+Math.sin(t*0.3)*0.03;
      centerCert.rotation.y=sm.x*0.35+t*0.08+sP*2;
      centerCert.position.y=Math.sin(t*0.4)*0.12;centerCert.position.z=-sP*3;
      const cs=1.1-sP*0.3;centerCert.scale.set(cs,cs,cs);

      objs.forEach(o=>{
        const{a,rad,sp,bp,tilt,ly}=o.userData;
        const spread=1+sP*0.8,ang=a+t*sp+sP*(1.5-ly*0.3),r=rad*spread;
        o.position.set(Math.cos(ang)*r,Math.sin(ang)*r*0.5+Math.sin(t*0.6+bp)*0.2,Math.sin(ang*0.5)*1.5-2-sP*(4-ly));
        o.rotation.x=Math.sin(ang)*tilt*sm.x*0.3+Math.sin(t*0.4+bp)*0.05;
        o.rotation.y=Math.cos(ang)*tilt*sm.y*0.3+t*0.15;
        o.lookAt(camera.position);
      });

      parts.rotation.y=t*0.01;parts.rotation.x=Math.sin(t*0.06)*0.02;
      ringMeshes.forEach((rm,i)=>{rm.rotation.z=t*(0.04+i*0.01);rm.rotation.x=Math.PI*0.42+Math.sin(t*0.1+i)*0.03;});
      camera.position.z=14-sP*4;camera.position.y=sP*0.8;camera.lookAt(0,0,0);
      renderer.render(scene,camera);
    })();
  }

  if(!prefersReducedMotion&&typeof THREE!=="undefined"){initHeroScene();}else if(canvas){canvas.style.display="none";}

  /* -------------------------------------------------------
     15c. PRINTER 3D SCENE — Printing section
  ------------------------------------------------------- */
  function initPrinterScene() {
    const pc=document.getElementById("printerCanvas");
    if(!pc||typeof THREE==="undefined")return;
    const parent=pc.parentElement;
    let renderer;
    try {
      renderer=new THREE.WebGLRenderer({canvas:pc,alpha:true,antielias:!isLowPower});
      renderer.setPixelRatio(Math.min(window.devicePixelRatio,isLowPower?1.5:2));
      renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.2;
    } catch(e) {
      pc.style.background="linear-gradient(145deg,#030b16 0%,#061428 50%,#0b2740 100%)";
      return;
    }
    const scene=new THREE.Scene();
    const camera=new THREE.PerspectiveCamera(35,1,0.1,50);
    camera.position.set(0,2,7);camera.lookAt(0,0,0);

    function resize(){const w=parent.clientWidth,h=Math.min(300,w*0.75);pc.style.height=h+"px";renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();}
    resize();window.addEventListener("resize",resize);

    scene.add(new THREE.AmbientLight(0x4a6a88,0.7));
    const kl=new THREE.PointLight(0x35d0f0,3,20);kl.position.set(3,4,5);scene.add(kl);
    const rl=new THREE.PointLight(0xf2b74d,1.5,18);rl.position.set(-3,-2,4);scene.add(rl);

    const printer=SF.printer3d();printer.scale.set(0.7,0.7,0.7);scene.add(printer);
    let printerLED=null;
    printer.traverse(c=>{if(c.geometry&&c.geometry.type==="SphereGeometry")printerLED=c;});

    const paperGeo=new THREE.BoxGeometry(1.3,0.01,0.9);
    const paperMat=new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:0.92});
    const paper=new THREE.Mesh(paperGeo,paperMat);
    paper.position.set(0,1.5,0);scene.add(paper);

    const docGeo=new THREE.BoxGeometry(1.1,0.008,0.75);
    const docMat=new THREE.MeshStandardMaterial({color:0xf5f0e0,metalness:0.05,roughness:0.5,emissive:0xf5f0e0,emissiveIntensity:0.1});
    const doc=new THREE.Mesh(docGeo,docMat);doc.position.set(0,-1.5,0);doc.visible=false;scene.add(doc);

    let vis=true;
    new IntersectionObserver(e=>{vis=e[0].isIntersecting;},{threshold:0}).observe(parent);

    const clock=new THREE.Clock();
    (function animate(){
      requestAnimationFrame(animate);if(!vis)return;
      const t=clock.getElapsedTime(),cycle=t%6;

      if(cycle<2){paper.visible=true;doc.visible=false;paper.position.y=1.5-cycle*0.6;paper.rotation.x=0;}
      else if(cycle<3){paper.visible=true;paper.position.y=0.3;paper.rotation.x=0;}
      else if(cycle<4){paper.visible=false;doc.visible=true;doc.position.y=0.3-(cycle-3)*0.5;doc.rotation.x=0;}
      else{doc.visible=true;doc.position.y=-0.2+Math.sin((cycle-4)*Math.PI)*0.6;doc.rotation.x=(cycle-4)*0.3;doc.rotation.y=(cycle-4)*0.4;}

      if(printerLED)printerLED.material.emissiveIntensity=0.5+Math.sin(t*4)*0.5;

      printer.rotation.y=Math.sin(t*0.3)*0.08;
      renderer.render(scene,camera);
    })();
  }
  if(!prefersReducedMotion&&typeof THREE!=="undefined"){initPrinterScene();}

  /* -------------------------------------------------------
     16. CINEMATIC SCENE SYSTEM — Scroll-driven 3D service animations
  ------------------------------------------------------- */
  const CinScenes = (() => {
    const active = [];
    const activeSet = new Set();
    const sceneFns = {};
    const mouseNDC = { x: 0, y: 0 };
    if (!isCoarsePointer) window.addEventListener("mousemove", e => {
      mouseNDC.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseNDC.y = (e.clientY / window.innerHeight) * 2 - 1;
    });

    function mkScene(canvas) {
      let r, s, c;
      try {
        r = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: !isLowPower });
        r.setPixelRatio(Math.min(window.devicePixelRatio, isLowPower ? 1.2 : 1.8));
        r.toneMapping = THREE.ACESFilmicToneMapping; r.toneMappingExposure = 1.2;
      } catch (e) {
        canvas.style.background = "linear-gradient(145deg, #061428 0%, #0b2740 50%, #030b16 100%)";
        canvas.style.border = "1px solid rgba(53,208,240,0.15)";
        canvas.style.backdropFilter = "blur(4px)";
        canvas.classList.add("webgl-fallback");
        return { r: null, s: null, c: null };
      }
      s = new THREE.Scene();
      c = new THREE.PerspectiveCamera(34, 1, 0.1, 80);
      c.position.set(0, 1.5, 8); c.lookAt(0, 0, 0);
      s.add(new THREE.AmbientLight(0x3a5a78, 0.65));
      const k = new THREE.PointLight(0x35d0f0, 3.2, 28); k.position.set(4, 4, 6); s.add(k);
      const ri = new THREE.PointLight(0xf2b74d, 1.8, 24); ri.position.set(-4, -3, 5); s.add(ri);
      const f = new THREE.PointLight(0x9b8cf2, 0.8, 18); f.position.set(0, -4, 4); s.add(f);
      return { r, s, c };
    }
    function fitRenderer(r, c, el) {
      if (!r || !c) return;
      const w = el.clientWidth, h = el.clientHeight;
      r.setSize(w, h, false); c.aspect = w / h; c.updateProjectionMatrix();
    }
    function mkDoc(w, h, col) {
      const g = new THREE.Group();
      g.add(new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.02), new THREE.MeshPhysicalMaterial({ color: col || 0xf0f4f8, metalness: 0.03, roughness: 0.55, clearcoat: 0.15 })));
      const lm = new THREE.MeshBasicMaterial({ color: 0x8899aa, transparent: true, opacity: 0.15 });
      for (let i = 0; i < 4; i++) { const l = new THREE.Mesh(new THREE.BoxGeometry(w * (0.55 - i * 0.05), 0.025, 0.003), lm); l.position.set(0, h * 0.25 - i * 0.16, 0.015); g.add(l); }
      return g;
    }
    function mkCard(w, h, col, acc) {
      const g = new THREE.Group();
      g.add(new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.06), new THREE.MeshPhysicalMaterial({ color: col, metalness: 0.25, roughness: 0.35, clearcoat: 0.5, clearcoatRoughness: 0.25, emissive: col, emissiveIntensity: 0.12 })));
      g.add(new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(w, h, 0.06)), new THREE.LineBasicMaterial({ color: acc || 0x35d0f0, transparent: true, opacity: 0.3 })));
      const stripe = new THREE.Mesh(new THREE.BoxGeometry(w - 0.15, h * 0.22, 0.07), new THREE.MeshStandardMaterial({ color: acc || 0x35d0f0, emissive: acc || 0x35d0f0, emissiveIntensity: 0.25, metalness: 0.35, roughness: 0.3 }));
      stripe.position.set(0, h * 0.35, 0); g.add(stripe);
      return g;
    }
    function mkScannerBar(w) {
      const g = new THREE.Group();
      g.add(new THREE.Mesh(new THREE.BoxGeometry(w, 0.04, 0.3), new THREE.MeshStandardMaterial({ color: 0x1a1a2e, metalness: 0.3, roughness: 0.4 })));
      const beam = new THREE.Mesh(new THREE.BoxGeometry(w, 0.015, 0.01), new THREE.MeshStandardMaterial({ color: 0x35d0f0, emissive: 0x35d0f0, emissiveIntensity: 1.5 }));
      beam.position.y = -0.03; g.add(beam);
      return g;
    }
    function mkFamilyCircle(col) {
      return new THREE.Mesh(new THREE.CircleGeometry(0.22, 20), new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: 0.3, metalness: 0.2, roughness: 0.4 }));
    }

    /* --- XEROX SCENE --- */
    sceneFns.xerox = (scene, cam) => {
      cam.position.set(0, 1, 7); cam.lookAt(0, 0, 0);
      const orig = mkDoc(2.2, 1.6); orig.position.set(-1.5, 0.5, 0); scene.add(orig);
      const scanner = mkScannerBar(2.6); scanner.position.set(0, 0, 0.15); scene.add(scanner);
      const copy1 = mkDoc(2.2, 1.6, 0xe8eef4); copy1.position.set(3, 0, 0); copy1.visible = false; scene.add(copy1);
      const copy2 = mkDoc(2.2, 1.6, 0xe8eef4); copy2.position.set(3, 0, 0); copy2.visible = false; scene.add(copy2);
      return {
        update(t, p) {
          const sp = Math.min(p * 2, 1);
          orig.position.x = -1.5 + sp * 1.5;
          scanner.position.y = 0.8 - Math.sin(t * 2.5) * 0.8 * sp;
          const beam = scanner.children[1];
          if (beam) beam.material.emissiveIntensity = 0.5 + Math.sin(t * 6) * 0.5;
          if (p > 0.35) { copy1.visible = true; copy1.position.x = 1.5 - Math.min((p - 0.35) * 4, 1) * 1.5; copy1.position.y = 0.5 - Math.min((p - 0.35) * 4, 1) * 0.5; }
          if (p > 0.6) { copy2.visible = true; copy2.position.x = 1.5 - Math.min((p - 0.6) * 4, 1) * 1.5; copy2.position.y = -0.1; }
          orig.rotation.y = Math.sin(t * 0.4) * 0.04;
          cam.position.z = 7 - p * 1.5; cam.lookAt(0, 0, 0);
        }
      };
    };

    /* --- LAMINATION SCENE --- */
    sceneFns.lamination = (scene, cam) => {
      cam.position.set(0, 1.5, 7); cam.lookAt(0, 0, 0);
      const doc = mkDoc(2, 1.5); doc.position.set(-2.5, 0.5, 0); scene.add(doc);
      const machine = new THREE.Group();
      machine.add(new THREE.Mesh(new THREE.BoxGeometry(2.8, 1.8, 1.8), new THREE.MeshPhysicalMaterial({ color: 0x1a2a3a, metalness: 0.35, roughness: 0.3, clearcoat: 0.4 })));
      const slot = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.08, 1.2), new THREE.MeshStandardMaterial({ color: 0x0a0a15 })); slot.position.y = 0.5; machine.add(slot);
      const indicator = new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 10), new THREE.MeshStandardMaterial({ color: 0x6bd39c, emissive: 0x6bd39c, emissiveIntensity: 1 })); indicator.position.set(1.1, 0.85, 0.91); machine.add(indicator);
      machine.position.set(0, -0.3, 0); scene.add(machine);
      const film = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.6, 0.005), new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.15, metalness: 0.1, roughness: 0.05, clearcoat: 1 })); film.position.set(2.5, 0.5, 0); film.visible = false; scene.add(film);
      const done = mkDoc(2, 1.5, 0xf5f0e0); done.position.set(3, 0.5, 0); done.visible = false; scene.add(done);
      return {
        update(t, p) {
          if (p < 0.25) { doc.position.x = -2.5 + p * 12; doc.visible = true; done.visible = false; film.visible = false; }
          else if (p < 0.5) { doc.visible = false; done.visible = false; film.visible = false; }
          else if (p < 0.75) { done.visible = true; done.position.x = 0 + (p - 0.5) * 8; done.position.y = 0.5; }
          else { done.visible = true; done.position.x = 2; done.rotation.y = (p - 0.75) * 4; done.rotation.x = Math.sin(t * 0.5) * 0.08; }
          const ind = machine.children[2]; if (ind) ind.material.emissiveIntensity = 0.5 + Math.sin(t * 5) * 0.5;
          cam.position.z = 7 - p * 1.5; cam.lookAt(0, 0, 0);
        }
      };
    };

    /* --- PVC CARD SCENE --- */
    sceneFns.pvccard = (scene, cam) => {
      cam.position.set(0, 1, 7); cam.lookAt(0, 0, 0);
      const photo = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1, 0.02), new THREE.MeshStandardMaterial({ color: 0x4a6fa5 })); photo.position.set(-2, 0.8, 0); scene.add(photo);
      const doc = mkDoc(1.8, 1.2); doc.position.set(-2, -0.5, 0); scene.add(doc);
      const card = mkCard(3.4, 2.1, 0x0d3450, 0xf2b74d); card.position.set(0, 0, 0); card.scale.set(0, 0, 0); scene.add(card);
      return {
        update(t, p) {
          if (p < 0.4) {
            photo.position.x = -2 + p * 5; photo.position.y = 0.8 - p * 0.8;
            doc.position.x = -2 + p * 5; doc.position.y = -0.5 + p * 0.5;
            photo.rotation.y = p * 2; doc.rotation.y = p * 1.5;
            card.scale.set(0, 0, 0);
          } else {
            const s = Math.min((p - 0.4) * 3, 1);
            card.scale.set(s, s, s); card.rotation.y = t * 0.25; card.position.y = Math.sin(t * 0.4) * 0.08;
            photo.position.x = 0; photo.visible = s < 0.3;
            doc.position.x = 0; doc.visible = s < 0.3;
          }
          cam.position.z = 7 - p * 1.2; cam.lookAt(0, 0, 0);
        }
      };
    };

    /* --- PHOTO SCENE --- */
    sceneFns.photo = (scene, cam) => {
      cam.position.set(0, 1, 7); cam.lookAt(0, 0, 0);
      const camBox = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.8, 0.8), new THREE.MeshPhysicalMaterial({ color: 0x2c3e50, metalness: 0.3, roughness: 0.35, clearcoat: 0.5 })); camBox.position.set(-2.5, 0.8, 0); scene.add(camBox);
      const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.25, 0.3, 16), new THREE.MeshStandardMaterial({ color: 0x1a1a2e })); lens.rotation.x = Math.PI / 2; lens.position.set(-2.5, 0.8, 0.55); scene.add(lens);
      const flash = new THREE.Mesh(new THREE.SphereGeometry(0.12, 10, 10), new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0 })); flash.position.set(-2.5, 1.3, 0.3); scene.add(flash);
      const portraits = []; for (let i = 0; i < 6; i++) { const p = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.75, 0.01), new THREE.MeshStandardMaterial({ color: 0x4a6fa5, roughness: 0.5 })); p.position.set(3, 1.5, 0); p.visible = false; scene.add(p); portraits.push(p); }
      return {
        update(t, p) {
          if (p < 0.3) { camBox.rotation.y = 0; flash.material.emissiveIntensity = 0; }
          else if (p < 0.4) { flash.material.emissiveIntensity = Math.sin((p - 0.3) * 30) * 2; camBox.rotation.y = 0; }
          else { flash.material.emissiveIntensity = 0; camBox.rotation.y = Math.sin(t * 0.3) * 0.05; }
          portraits.forEach((po, i) => {
            if (p > 0.45 + i * 0.07) { po.visible = true; const sp = Math.min((p - 0.45 - i * 0.07) * 5, 1); po.position.x = 2 - (i % 3) * 0.8; po.position.y = 0.8 - Math.floor(i / 3) * 0.9; po.position.z = 0; po.scale.set(sp, sp, sp); }
          });
          cam.position.z = 7 - p * 1.2; cam.lookAt(0, 0, 0);
        }
      };
    };

    /* --- CERTIFICATE SCENE --- */
    sceneFns.certificate = (scene, cam) => {
      cam.position.set(0, 1.5, 9); cam.lookAt(0, 0, 0);
      const cert = SF.cert(); cert.scale.set(0, 0, 0); scene.add(cert);
      const fans = []; for (let i = 0; i < 5; i++) { const f2 = SF.cert(); f2.scale.set(0, 0, 0); f2.position.z = -0.3 * (i + 1); f2.rotation.z = (i - 2) * 0.06; scene.add(f2); fans.push(f2); }
      return {
        update(t, p) {
          if (p < 0.5) {
            const s = Math.min(p * 2.5, 1); cert.scale.set(s * 1.1, s * 1.1, s * 1.1);
            cert.rotation.y = (1 - s) * Math.PI + t * 0.08;
            cert.position.y = Math.sin(t * 0.4) * 0.08;
            fans.forEach(f => f.scale.set(0, 0, 0));
          } else {
            cert.scale.set(1.1, 1.1, 1.1); cert.rotation.y = t * 0.08;
            cert.position.y = Math.sin(t * 0.4) * 0.08;
            fans.forEach((f, i) => { const s = Math.min((p - 0.5 - i * 0.06) * 5, 1); f.scale.set(s * 1.05, s * 1.05, s * 1.05); });
          }
          cam.position.z = 9 - p * 2; cam.lookAt(0, 0, 0);
        }
      };
    };

    /* --- ID CARDS SCENE --- */
    sceneFns.idcards = (scene, cam) => {
      cam.position.set(0, 1.5, 8); cam.lookAt(0, 0, 0);
      const cards = [
        { c: mkCard(3.2, 2, 0x003366, 0xf2b74d), delay: 0 },
        { c: mkCard(3.2, 2, 0x0e5c3a, 0xf2b74d), delay: 0.2 },
        { c: mkCard(3.2, 2, 0x2c3e50, 0x35d0f0), delay: 0.4 },
      ];
      const scanner = mkScannerBar(3.8); scanner.position.set(0, 0, 0.15); scene.add(scanner);
      cards.forEach(({ c }, i) => { c.position.set(0, 0, 0); c.scale.set(0, 0, 0); scene.add(c); });
      const positions = [[-2.2, 0, 0], [0, 0, -0.5], [2.2, 0, 0]];
      return {
        update(t, p) {
          cards.forEach(({ c, delay }, i) => {
            if (p > delay) {
              const sp = Math.min((p - delay) * 3, 1);
              c.scale.set(sp, sp, sp);
              if (sp >= 1) { c.position.x += (positions[i][0] - c.position.x) * 0.05; c.position.z += (positions[i][2] - c.position.z) * 0.05; }
              c.rotation.y = t * 0.2 + i * 0.5;
            }
          });
          const beam = scanner.children[1]; if (beam) beam.material.emissiveIntensity = 0.5 + Math.sin(t * 5) * 0.5;
          scanner.position.y = 1.2 - (p * 2 % 1) * 2.4;
          cam.position.z = 8 - p * 1.5; cam.lookAt(0, 0, 0);
        }
      };
    };

    /* --- RATION CARD SCENE --- */
    sceneFns.ration = (scene, cam) => {
      cam.position.set(0, 1.5, 7); cam.lookAt(0, 0, 0);
      const card = mkCard(3, 2, 0x8b4513, 0xf2b74d); card.position.set(0, 0, 0); scene.add(card);
      const familyCols = [0x35d0f0, 0x6bd39c, 0xf2b74d, 0x9b8cf2, 0x7ee8ff];
      const members = familyCols.map((col, i) => {
        const m = mkFamilyCircle(col); const a = (i / 5) * Math.PI * 2 - Math.PI / 2; m.position.set(Math.cos(a) * 2.8, Math.sin(a) * 2 + 0.2, 0); m.scale.set(0, 0, 0); scene.add(m); return m;
      });
      const lines = []; const lineMat = new THREE.LineBasicMaterial({ color: 0x35d0f0, transparent: true, opacity: 0 });
      members.forEach(m => { const geo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0.1), m.position.clone().multiplyScalar(0.3)]); const line = new THREE.Line(geo, lineMat.clone()); scene.add(line); lines.push(line); });
      return {
        update(t, p) {
          card.rotation.y = Math.sin(t * 0.3) * 0.06; card.position.y = Math.sin(t * 0.4) * 0.06;
          members.forEach((m, i) => {
            if (p > 0.25 + i * 0.1) { const s = Math.min((p - 0.25 - i * 0.1) * 4, 1); m.scale.set(s, s, s); }
            const bob = Math.sin(t * 0.5 + i) * 0.06; m.position.y += bob * 0.01;
          });
          lines.forEach((l, i) => { if (p > 0.5) l.material.opacity = Math.min((p - 0.5) * 4, 0.3); });
          cam.position.z = 7 - p * 1.2; cam.lookAt(0, 0, 0);
        }
      };
    };

    /* --- PASSBOOK + STAMP SCENE --- */
    sceneFns.passbook = (scene, cam) => {
      cam.position.set(0, 1.5, 7); cam.lookAt(0, 0, 0);
      const book = SF.book({ color: 0x1565c0, accent: 0xf2b74d, w: 2.2, h: 2.8, thickness: 0.3 }); book.position.set(-2, 0, 0); scene.add(book);
      const stamp = SF.stamp(); stamp.position.set(3, 0, 0); stamp.scale.set(0, 0, 0); scene.add(stamp);
      const glow = new THREE.Mesh(new THREE.PlaneGeometry(3, 2), new THREE.MeshBasicMaterial({ color: 0x35d0f0, transparent: true, opacity: 0 })); glow.position.set(0, 0, -0.2); scene.add(glow);
      return {
        update(t, p) {
          if (p < 0.5) {
            book.position.x = -2 + p * 4; book.rotation.y = p * 0.5;
            stamp.scale.set(0, 0, 0); glow.material.opacity = 0;
          } else {
            book.position.x = 0; book.rotation.y = Math.sin(t * 0.3) * 0.05;
            const sp = Math.min((p - 0.5) * 3, 1); stamp.scale.set(sp, sp, sp);
            stamp.rotation.y = t * 0.15; stamp.position.x = 2.5;
            glow.material.opacity = Math.sin(t * 0.8) * 0.06 + 0.06;
          }
          cam.position.z = 7 - p * 1.2; cam.lookAt(0, 0, 0);
        }
      };
    };

    /* --- SPECIAL (Senior Citizen / UDID) SCENE --- */
    sceneFns.special = (scene, cam) => {
      cam.position.set(0, 1.5, 7); cam.lookAt(0, 0, 0);
      const sc = mkCard(3, 2, 0x6b3a6b, 0xf2b74d); sc.position.set(-2, 0, 0); sc.scale.set(0, 0, 0); scene.add(sc);
      const ud = mkCard(3, 2, 0x1a4a6b, 0x6bd39c); ud.position.set(2, 0, 0); ud.scale.set(0, 0, 0); scene.add(ud);
      const shield = new THREE.Mesh(new THREE.TorusGeometry(2.2, 0.04, 8, 40), new THREE.MeshStandardMaterial({ color: 0x35d0f0, emissive: 0x35d0f0, emissiveIntensity: 0.4, transparent: true, opacity: 0 })); shield.position.z = -1; scene.add(shield);
      return {
        update(t, p) {
          if (p > 0.15) { const s = Math.min((p - 0.15) * 4, 1); sc.scale.set(s, s, s); sc.rotation.y = t * 0.15; }
          if (p > 0.3) { const s = Math.min((p - 0.3) * 4, 1); ud.scale.set(s, s, s); ud.rotation.y = t * 0.15 + 0.5; }
          if (p > 0.5) { shield.material.opacity = Math.min((p - 0.5) * 3, 0.2); shield.rotation.z = t * 0.08; }
          cam.position.z = 7 - p * 1.2; cam.lookAt(0, 0, 0);
        }
      };
    };

    function init() {
      document.querySelectorAll(".cinema-canvas").forEach(canvas => {
        const key = canvas.dataset.scene;
        if (!key || !sceneFns[key]) return;
        const { r, s, c } = mkScene(canvas);
        const section = canvas.closest(".cinema");
        const built = r ? sceneFns[key](s, c) : { _p: 0, update: function() {} };
        let vis = false;
        const obs = new IntersectionObserver(entries => { vis = entries[0].isIntersecting; }, { threshold: 0.05 });
        obs.observe(section);
        const entry = { r, s, c, built, canvas, section, vis: () => vis };
        active.push(entry);
        const ro2 = new ResizeObserver(() => fitRenderer(r, c, canvas));
        ro2.observe(canvas.parentElement);
      });
      if (active.length > 0) tick(performance.now());
    }

    let lastT = 0;
    function tick(now) {
      requestAnimationFrame(tick);
      const dt = (now - lastT) / 1000; lastT = now;
      if (dt > 0.2) return;
      active.forEach(({ r, s, c, built, canvas, section, vis }) => {
        if (!vis() || !r) return;
        const rect = section.getBoundingClientRect();
        const raw = Math.max(0, Math.min(1, 1 - rect.top / window.innerHeight));
        /* cinematic damping — ease progress so objects never jump */
        if (!built._p) built._p = raw;
        built._p += (raw - built._p) * Math.min(1, dt * 6);
        built.update(now * 0.001, built._p);
        r.render(s, c);
      });
    }

    return { init };
  })();

  if (!prefersReducedMotion && typeof THREE !== "undefined") {
    setTimeout(() => CinScenes.init(), 100);
  }

  /* -------------------------------------------------------
     17. JOURNEY ENGINE — one continuous cinematic world
     - Scroll-driven environment (background theme blending)
     - Ambient floating service particles (Canvas 2D)
     - Scroll velocity smoothing shared with 3D scenes
  ------------------------------------------------------- */
  const JourneyEngine = (() => {
    const THEMES = {
      hero:   { bg: [3, 11, 22],   glow: [53, 208, 240] },
      navy:   { bg: [6, 20, 40],   glow: [53, 208, 240] },
      cool:   { bg: [10, 28, 46],  glow: [126, 232, 255] },
      gold:   { bg: [12, 28, 42],  glow: [242, 183, 77] },
      warm:   { bg: [15, 26, 32],  glow: [250, 208, 128] },
      purple: { bg: [16, 15, 38],  glow: [155, 140, 242] },
    };
    const themeSections = () => Array.from(document.querySelectorAll("[data-theme]"));
    let currentTheme = { bg: [3, 11, 22], glow: [53, 208, 240] };
    let vel = 0, lastY = window.scrollY;

    /* Ambient particles */
    let canvas = null, ctx = null, particles = [];
    const isReduced = prefersReducedMotion;

    function buildParticles() {
      canvas = document.getElementById("journeyCanvas");
      if (!canvas) return;
      ctx = canvas.getContext("2d");
      const count = isLowPower ? 14 : isReduced ? 0 : 26;
      particles = [];
      for (let i = 0; i < count; i++) {
        const type = i % 4 === 0 ? "card" : i % 3 === 0 ? "dot" : "doc";
        const size = 8 + Math.random() * 26;
        particles.push({
          type, size,
          x: Math.random(), y: Math.random(),
          vx: (Math.random() - 0.5) * 0.00015,
          vy: -(0.00004 + Math.random() * 0.00012),
          depth: 0.25 + Math.random() * 0.75,
          rot: Math.random() * Math.PI * 2,
          vrot: (Math.random() - 0.5) * 0.0004,
          phase: Math.random() * Math.PI * 2,
        });
      }
      resize();
      window.addEventListener("resize", resize);
    }
    let W = 0, H = 0;
    function resize() {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      canvas.style.width = W + "px"; canvas.style.height = H + "px";
      ctx = canvas.getContext("2d"); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function drawParticles() {
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);
      const [gr, gg, gb] = currentTheme.glow;
      particles.forEach(p => {
        const px = p.x * W;
        const py = p.y * H + vel * p.depth * 14;
        const alpha = 0.1 + p.depth * 0.22;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(px, py);
        ctx.rotate(p.rot);
        if (p.type === "dot") {
          ctx.fillStyle = `rgba(${gr},${gg},${gb},0.7)`;
          ctx.beginPath(); ctx.arc(0, 0, p.size * 0.3, 0, Math.PI * 2); ctx.fill();
        } else {
          const w = p.type === "card" ? p.size : p.size * 1.3;
          const h = p.size * 0.66;
          ctx.fillStyle = p.type === "card"
            ? `rgba(242,183,77,0.16)`
            : `rgba(${gr},${gg},${gb},0.2)`;
          ctx.strokeStyle = p.type === "card"
            ? "rgba(242,183,77,0.3)"
            : `rgba(${gr},${gg},${gb},0.35)`;
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.roundRect ? ctx.roundRect(-w / 2, -h / 2, w, h, 3) : ctx.rect(-w / 2, -h / 2, w, h); ctx.fill(); ctx.stroke();
          if (p.type === "doc") {
            ctx.fillStyle = `rgba(${gr},${gg},${gb},0.4)`;
            ctx.fillRect(-w * 0.25, -h * 0.28, w * 0.5, 1.5);
            ctx.fillRect(-w * 0.2, -h * 0.12, w * 0.4, 1.5);
            ctx.fillRect(-w * 0.25, 0.04 * h, w * 0.5, 1.5);
          }
        }
        ctx.restore();
      });
    }
    function stepParticles(t) {
      particles.forEach(p => {
        p.x += p.vx + Math.sin(t * 0.0002 + p.phase) * 0.0001;
        p.y += p.vy;
        p.rot += p.vrot;
        if (p.y < -0.05) { p.y = 1.05; p.x = Math.random(); }
        if (p.x < -0.05) p.x = 1.05; if (p.x > 1.05) p.x = -0.05;
      });
    }

    /* Theme blending */
    function updateTheme() {
      const vh = window.innerHeight, center = vh * 0.5;
      const secs = themeSections();
      let best = null, bestDist = Infinity;
      secs.forEach(sec => {
        const r = sec.getBoundingClientRect();
        const mid = r.top + r.height / 2;
        const dist = Math.abs(mid - center);
        if (dist < bestDist) { bestDist = dist; best = sec; }
      });
      if (!best) return;
      const key = best.getAttribute("data-theme") || "hero";
      const target = THEMES[key] || THEMES.hero;
      for (let i = 0; i < 3; i++) {
        currentTheme.bg[i] += (target.bg[i] - currentTheme.bg[i]) * 0.08;
        currentTheme.glow[i] += (target.glow[i] - currentTheme.glow[i]) * 0.08;
      }
      const [r, g, b] = currentTheme.bg;
      document.body.style.backgroundColor = `rgb(${Math.round(r)},${Math.round(g)},${Math.round(b)})`;
    }

    /* Scroll velocity */
    function updateVel() {
      const y = window.scrollY;
      const dy = y - lastY; lastY = y;
      vel += (dy * 0.02 - vel) * 0.15;
    }

    function loop(t) {
      requestAnimationFrame(loop);
      if (isReduced) return;
      updateVel(); updateTheme(); stepParticles(t); drawParticles();
    }

    return {
      init() {
        buildParticles();
        if (!prefersReducedMotion) requestAnimationFrame(loop);
        else updateTheme();
      }
    };
  })();
  try {
    JourneyEngine.init();
  } catch (err) {
    console.warn("[JourneyEngine] init failed:", err);
  }

  /* -------------------------------------------------------
     18. CINEMATIC JOURNEY ENHANCEMENTS (GSAP + scroll)
     - How-it-works checkpoint journey
     - Trust shield cinematic move
     - Contact pin drop + final CTA assemble
  ------------------------------------------------------- */
  (function initJourneyFX() {
    try {
    /* Checkpoint journey */
    const stepCards = Array.from(document.querySelectorAll(".step-card"));
    if (stepCards.length && !prefersReducedMotion) {
      let ticking = false;
      function activateCheckpoint() {
        ticking = false;
        const vh = window.innerHeight, center = vh * 0.5;
        let best = null, bestDist = Infinity;
        stepCards.forEach(c => {
          const r = c.getBoundingClientRect();
          const mid = r.top + r.height / 2;
          const dist = Math.abs(mid - center);
          if (dist < bestDist) { bestDist = dist; best = c; }
        });
        stepCards.forEach(c => c.classList.toggle("is-active", c === best));
      }
      window.addEventListener("scroll", () => {
        if (!ticking) { ticking = true; requestAnimationFrame(activateCheckpoint); }
      }, { passive: true });
      activateCheckpoint();
    }

    /* Trust shield cinematic (scroll scrub) */
    if (window.gsap && window.ScrollTrigger && !prefersReducedMotion) {
      const shieldWrap = document.querySelector(".trust-visual");
      if (shieldWrap) {
        gsap.fromTo(shieldWrap,
          { scale: 0.94, rotateY: -14 },
          {
            scale: 1.06, rotateY: 14, ease: "none",
            scrollTrigger: { trigger: ".trust", start: "top 75%", end: "center center", scrub: 1 }
          }
        );
        gsap.fromTo(shieldWrap,
          { scale: 1.06, rotateY: 14 },
          {
            scale: 0.92, rotateY: 0, ease: "none",
            scrollTrigger: { trigger: ".trust", start: "center center", end: "bottom 20%", scrub: 1 }
          }
        );
      }
    }

    /* Contact pin drop */
    const contact = document.querySelector(".contact");
    if (contact) {
      const cio = new IntersectionObserver((e) => {
        if (e[0].isIntersecting) contact.classList.add("is-in");
      }, { threshold: 0.25 });
      cio.observe(contact);
    }

    /* Final CTA assemble */
    const fin = document.querySelector(".final-cta");
    if (fin) {
      const fio = new IntersectionObserver((e) => {
        if (e[0].isIntersecting) fin.classList.add("is-in");
      }, { threshold: 0.3 });
      fio.observe(fin);
    }
    } catch (err) {
      console.warn("[JourneyFX] init failed:", err);
    }
  })();

  /* -------------------------------------------------------
     19. GSAP SCROLL POLISH
  ------------------------------------------------------- */
  if (window.gsap && window.ScrollTrigger && !prefersReducedMotion) {
    try {
    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray(".community-card, .contact-card, .step-card").forEach((el) => {
      gsap.fromTo(el, { y: 28, opacity: 0 }, {
        y: 0, opacity: 1, ease: "power2.out", duration: 0.7,
        scrollTrigger: { trigger: el, start: "top 92%" }
      });
    });

    gsap.fromTo(".shield", { scale: 0.8, opacity: 0 }, {
      scale: 1, opacity: 1, ease: "back.out(1.4)", duration: 1,
      scrollTrigger: { trigger: ".shield", start: "top 80%" }
    });

    gsap.utils.toArray(".trust-list li").forEach((li, i) => {
      gsap.fromTo(li, { x: -20, opacity: 0 }, {
        x: 0, opacity: 1, ease: "power2.out", duration: 0.5,
        delay: i * 0.1,
        scrollTrigger: { trigger: li, start: "top 90%" }
      });
    });

    gsap.fromTo(".section-sub", { y: 16, opacity: 0 }, {
      y: 0, opacity: 1, ease: "power2.out", duration: 0.7,
      scrollTrigger: { trigger: ".section-sub", start: "top 88%" }
    });
    } catch (err) {
      console.warn("[GSAP polish] init failed:", err);
    }
  }

  /* -------------------------------------------------------
     17. TELUGU VOICE-OVER (HTML5 Audio)
     - Uses the actual MP3 file, not Web Speech API
     - Plays once per session (sessionStorage guard)
     - Autoplay on load → first-interaction fallback
     - No visible UI controls whatsoever
  ------------------------------------------------------- */
  const TeluguVoiceover = (() => {
    var SESSION_KEY = "smkv_played";
    var hasStarted = false;
    var audio = null;
    var interactionCleanup = null;

    function createAudio() {
      var a = new Audio();
      a.preload = "auto";
      a.src = "audio/sri-manikanta-meeseva-telugu.mp3";
      a.volume = 1;
      a.muted = false;
      a.loop = false;
      a.playsInline = true;
      return a;
    }

    function startAudio() {
      if (hasStarted || sessionStorage.getItem(SESSION_KEY)) return;
      hasStarted = true;
      sessionStorage.setItem(SESSION_KEY, "1");

      if (!audio) audio = createAudio();

      audio.play().then(function() {
        if (interactionCleanup) {
          interactionCleanup();
          interactionCleanup = null;
        }
      }).catch(function() {
        hasStarted = false;
        sessionStorage.removeItem(SESSION_KEY);
      });

      if (interactionCleanup) {
        interactionCleanup();
        interactionCleanup = null;
      }
    }

    function init() {
      if (sessionStorage.getItem(SESSION_KEY)) return;

      audio = createAudio();

      audio.addEventListener("canplaythrough", function onCanPlay() {
        audio.removeEventListener("canplaythrough", onCanPlay);
        audio.play().then(function() {
          hasStarted = true;
          sessionStorage.setItem(SESSION_KEY, "1");
          if (interactionCleanup) {
            interactionCleanup();
            interactionCleanup = null;
          }
        }).catch(function() {
          /* autoplay blocked — interaction listeners already attached */
        });
      });

      var interactionEvents = ["click", "touchstart", "scroll", "keydown"];
      function onInteraction() {
        startAudio();
        interactionEvents.forEach(function(evt) {
          document.removeEventListener(evt, onInteraction, true);
        });
      }
      interactionCleanup = function() {
        interactionEvents.forEach(function(evt) {
          document.removeEventListener(evt, onInteraction, true);
        });
      };
      interactionEvents.forEach(function(evt) {
        document.addEventListener(evt, onInteraction, { passive: true, capture: true });
      });

      document.addEventListener("visibilitychange", function() {
        if (!document.hidden && !hasStarted && !sessionStorage.getItem(SESSION_KEY)) {
          startAudio();
        }
      });
    }

    return { init: init, getAudio: () => audio, isPlaying: () => !!(audio && !audio.paused && !audio.ended) };
  })();

  /* -------------------------------------------------------
     18. INITIALIZE TELUGU VOICE-OVER
  ------------------------------------------------------- */
  try {
    TeluguVoiceover.init();
  } catch (err) {
    console.warn("[TeluguVoiceover] init failed:", err);
  }

  /* ================================================================
     18B. FLOATING AUDIO TOGGLE (manual control for voice-over)
     Reuses the EXISTING single Audio instance from TeluguVoiceover.
     No new Audio() objects. No new MP3. No new audio system.
     ================================================================ */
  (() => {
    var btn = null;
    var styleEl = null;

    function injectStyles() {
      if (styleEl) return;
      styleEl = document.createElement("style");
      styleEl.textContent = [
        ".smkv-audio-toggle {",
        "  position: fixed;",
        "  bottom: 1.5rem;",
        "  right: 1.5rem;",
        "  z-index: 9999;",
        "  width: 48px;",
        "  height: 48px;",
        "  border-radius: 50%;",
        "  background: rgba(3, 11, 22, 0.55);",
        "  border: 1px solid rgba(255, 255, 255, 0.18);",
        "  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(53, 208, 240, 0.25);",
        "  backdrop-filter: blur(12px) saturate(180%);",
        "  -webkit-backdrop-filter: blur(12px) saturate(180%);",
        "  display: flex;",
        "  align-items: center;",
        "  justify-content: center;",
        "  cursor: pointer;",
        "  outline: none;",
        "  transition: all 0.3s var(--ease);",
        "  transform: translateZ(0);",
        "}",
        ".smkv-audio-toggle:hover {",
        "  transform: scale(1.1) translateZ(0);",
        "  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.55), 0 0 20px rgba(53, 208, 240, 0.45);",
        "  border-color: rgba(53, 208, 240, 0.45);",
        "}",
        ".smkv-audio-toggle:active {",
        "  transform: scale(0.95) translateZ(0);",
        "}",
        "@media (max-width: 600px) {",
         "  .smkv-audio-toggle { width: 44px; height: 44px; top: calc(4rem + env(safe-area-inset-top, 0px) + 12px); left: 16px; bottom: auto; right: auto; }",
         "}",
        ".smkv-audio-icon {",
        "  width: 20px;",
        "  height: 20px;",
        "  display: block;",
        "}",
        ".smkv-audio-toggle.paused .smkv-audio-icon {",
        "  opacity: 0.6;",
        "}",
        ".smkv-audio-wave {",
        "  display: none;",
        "}",
        ".smkv-audio-toggle.playing .smkv-audio-wave {",
        "  display: block;",
        "  position: absolute;",
        "  width: 20px;",
        "  height: 20px;",
        "  animation: smkv-wave 1.6s ease-in-out infinite;",
        "}",
        "@media (prefers-reduced-motion: reduce) {",
        "  .smkv-audio-toggle { transition: none; }",
        "  .smkv-audio-toggle:hover { transform: none; }",
        "  .smkv-audio-toggle:active { transform: none; }",
        "  .smkv-audio-wave { animation: none; }",
        "}",
        "@keyframes smkv-wave {",
        "  0% { opacity: 0; transform: scale(0.8); }",
        "  50% { opacity: 0.7; transform: scale(1.6); }",
        "  100% { opacity: 0; transform: scale(0.8); }",
        "}"
      ].join("\n");
      document.head.appendChild(styleEl);
    }

    function createButton() {
      if (btn) return btn;
      injectStyles();
      btn = document.createElement("button");
      btn.className = "smkv-audio-toggle paused";
      btn.setAttribute("aria-label", "Resume voice-over");
      btn.setAttribute("aria-pressed", "false");
      btn.innerHTML = '<svg class="smkv-audio-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 11.5v1c0 .6.4 1 1 1h3.5l4.5 4.5V5.5L7.5 10H4c-.6 0-1 .4-1 1zM13 8v8m0-8l3 4-3 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"/></svg><span class="smkv-audio-wave" style="border-radius:50%; border: 1.5px solid #35d0f0;"></span>';
      document.body.appendChild(btn);
      return btn;
    }

    function updateButtonState() {
      if (!btn) return;
      var playing = false;
      try {
        var a = TeluguVoiceover.getAudio();
        playing = !!(a && !a.paused && !a.ended);
      } catch (e) {
        playing = false;
      }
      if (playing) {
        btn.classList.remove("paused");
        btn.classList.add("playing");
        btn.setAttribute("aria-label", "Pause voice-over");
        btn.setAttribute("aria-pressed", "true");
      } else {
        btn.classList.remove("playing");
        btn.classList.add("paused");
        btn.setAttribute("aria-label", "Resume voice-over");
        btn.setAttribute("aria-pressed", "false");
      }
    }

    function toggleAudio() {
      var a = null;
      try {
        a = TeluguVoiceover.getAudio();
      } catch (e) {
        a = null;
      }
      if (!a) {
        createButton();
        updateButtonState();
        return;
      }
      if (a.paused || a.ended) {
        a.play().catch(function() {});
      } else {
        a.pause();
      }
      updateButtonState();
    }

    function initToggle() {
      if (!document.createElement("button").animate) return;
      btn = createButton();
      btn.addEventListener("click", toggleAudio);
      btn.addEventListener("keydown", function(e) {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          toggleAudio();
        }
      });
      updateButtonState();
      var vo = null;
      try { vo = TeluguVoiceover; } catch (e) { vo = null; }
      if (vo && vo.getAudio) {
        var a = null;
        try { a = vo.getAudio(); } catch (e) { a = null; }
        if (a) {
          ["play", "pause", "ended"].forEach(function(evt) {
            a.addEventListener(evt, updateButtonState);
          });
        }
      }
    }

    document.addEventListener("DOMContentLoaded", initToggle);
  })();

  /* ================================================================
     PHASE 3A — CINEMATIC TRANSITION SYSTEM (modular extension)
     Reuses: THREE, SF, GSAP/ScrollTrigger, theme system, audio system
     Adds:   full-screen fly-through transition zones,
     How-it-works 3D journey,
             Final CTA service ecosystem + brand reveal,
             Premium citizen figures for the community section.
     No new audio. Respects reduced-motion + low-power tiers.
  ================================================================ */

  if (!prefersReducedMotion && typeof THREE !== "undefined") {

    /* ---------------- Shared cinematic helpers ---------------- */
    const CT = (() => {
      const el = document.getElementById("transCanvas");
      if (!el) return null;

      let renderer;
      try {
        renderer = new THREE.WebGLRenderer({ canvas: el, alpha: true, antialias: !isLowPower });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isLowPower ? 1.5 : 2));
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.25;
      } catch (e) {
        el.style.background = "linear-gradient(145deg, #030b16 0%, #061428 50%, #0b2740 100%)";
        return null;
      }
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 160);
      camera.position.set(0, 0, 10);

      scene.add(new THREE.AmbientLight(0x3a5a78, 0.7));
      const kL = new THREE.PointLight(0x35d0f0, 3.5, 60); kL.position.set(6, 6, 10); scene.add(kL);
      const rL = new THREE.PointLight(0xf2b74d, 2.2, 48); rL.position.set(-7, -5, 8); scene.add(rL);
      const fL = new THREE.PointLight(0x9b8cf2, 1.1, 32); fL.position.set(0, -6, 7); scene.add(fL);

      function resize() {
        const w = window.innerWidth, h = window.innerHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / h; camera.updateProjectionMatrix();
      }
      resize();
      window.addEventListener("resize", resize);

      function tex(w, h, draw) {
        const cv = document.createElement("canvas");
        cv.width = w; cv.height = h;
        draw(cv.getContext("2d"), w, h);
        const t = new THREE.CanvasTexture(cv);
        t.anisotropy = 1; t.minFilter = THREE.LinearFilter;
        return t;
      }
      const _glowCache = {};
      function glowTex(color) {
        if (_glowCache[color]) return _glowCache[color];
        _glowCache[color] = tex(128, 128, (g) => {
          const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
          gr.addColorStop(0, color);
          gr.addColorStop(1, "rgba(0,0,0,0)");
          g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
        });
        return _glowCache[color];
      }

      function plane(w, h, o) {
        o = o || {};
        return new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshPhysicalMaterial({
          map: o.map || null,
          color: o.color !== undefined ? o.color : 0xffffff,
          transparent: !!o.transparent,
          opacity: o.opacity !== undefined ? o.opacity : 1,
          side: o.side || THREE.DoubleSide,
          metalness: o.metalness !== undefined ? o.metalness : 0.05,
          roughness: o.roughness !== undefined ? o.roughness : 0.5,
          clearcoat: o.clearcoat !== undefined ? o.clearcoat : 0.2,
          emissive: o.emissive || 0x000000,
          emissiveIntensity: o.emissiveIntensity || 0
        }));
      }
      function rr(w, h, r) {
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
      function cardMesh(w, h, thick, o) {
        o = o || {};
        const geo = new THREE.ExtrudeGeometry(rr(w, h, o.r !== undefined ? o.r : 0.1), {
          depth: thick, bevelEnabled: o.bevel !== false,
          bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 2, curveSegments: 8
        });
        return new THREE.Mesh(geo, new THREE.MeshPhysicalMaterial({
          map: o.map || null,
          color: o.color !== undefined ? o.color : 0xffffff,
          metalness: 0.25, roughness: 0.32, clearcoat: 0.5, clearcoatRoughness: 0.2
        }));
      }
      function glowSprite(color, size) {
        const s = new THREE.Sprite(new THREE.SpriteMaterial({
          map: glowTex(color), transparent: true, opacity: 0.9,
          depthWrite: false, blending: THREE.AdditiveBlending
        }));
        s.scale.set(size, size, 1);
        return s;
      }
      function mkTrail(color, max) {
        const pts = new Array(max).fill(0).map(() => new THREE.Vector3(0, -999, 0));
        const geo = new THREE.BufferGeometry().setFromPoints(pts);
        const line = new THREE.Line(geo, new THREE.LineBasicMaterial({
          color: color, transparent: true, opacity: 0.28,
          blending: THREE.AdditiveBlending, depthWrite: false
        }));
        line.frustumCulled = false;
        return {
          line,
          add(p) {
            for (let i = max - 1; i > 0; i--) pts[i].copy(pts[i - 1]);
            pts[0].copy(p);
            geo.attributes.position.needsUpdate = true;
          }
        };
      }

      /* text label textures (abstract/generic — no real seals, QR or personal data) */
      function labelTex(w, h, accent, title, sub, bg) {
        return tex(w, h, (g, W, H) => {
          g.fillStyle = bg || "#f4f7fa";
          g.fillRect(0, 0, W, H);
          g.fillStyle = accent;
          g.fillRect(0, 0, W, H * 0.16);
          g.strokeStyle = accent; g.globalAlpha = 0.5; g.lineWidth = 3;
          g.strokeRect(12, 12, W - 24, H - 24); g.globalAlpha = 1;
          g.fillStyle = "#102a43";
          let lfs = Math.floor(W * 0.16);
          g.font = "700 " + lfs + "px 'Space Grotesk','Noto Sans Telugu',sans-serif";
          while (lfs > 14 && g.measureText(title).width > W - 30) { lfs -= 3; g.font = "700 " + lfs + "px 'Space Grotesk','Noto Sans Telugu',sans-serif"; }
          g.textAlign = "center"; g.textBaseline = "middle";
          g.fillText(title, W / 2, H * 0.5);
          if (sub) {
            g.fillStyle = "#486581";
            g.font = "500 " + Math.floor(W * 0.09) + "px 'Noto Sans Telugu',sans-serif";
            g.fillText(sub, W / 2, H * 0.82);
          }
          g.fillStyle = "#ffffff"; g.globalAlpha = 0.75;
          g.beginPath(); g.arc(W * 0.5, H * 0.2, W * 0.035, 0, Math.PI * 2); g.fill();
          g.globalAlpha = 1;
        });
      }
      function svcTex(label) {
        return tex(160, 200, (g, W, H) => {
          g.fillStyle = "#f7f8fa"; g.fillRect(0, 0, W, H);
          g.fillStyle = "#2f6f9f"; g.fillRect(0, 0, W, 10);
          g.strokeStyle = "rgba(47,111,159,0.4)"; g.lineWidth = 2;
          g.strokeRect(6, 14, W - 12, H - 20);
          g.fillStyle = "#1c3d5a";
          g.textAlign = "center"; g.textBaseline = "middle";
          let fs = 30;
          g.font = "600 " + fs + "px 'Noto Sans Telugu',sans-serif";
          while (fs > 12 && g.measureText(label).width > W - 22) { fs -= 2; g.font = "600 " + fs + "px 'Noto Sans Telugu',sans-serif"; }
          g.fillText(label, W / 2, H / 2);
          g.fillStyle = "#2f6f9f"; g.globalAlpha = 0.6;
          g.fillRect(W * 0.2, H * 0.78, W * 0.6, 3);
          g.globalAlpha = 1;
        });
      }
      function paperTex() {
        return tex(256, 320, (g, W, H) => {
          g.fillStyle = "#f7f4ec"; g.fillRect(0, 0, W, H);
          g.fillStyle = "#3b4a5a"; g.globalAlpha = 0.22;
          for (let i = 0; i < 7; i++) { g.fillRect(28, 46 + i * 34, 200 - (i % 3) * 26, 6); }
          g.globalAlpha = 0.12;
          for (let i = 0; i < 40; i++) {
            g.fillRect(Math.random() * W, Math.random() * H, 2, 2);
          }
          g.globalAlpha = 1;
        });
      }
      function printTex() {
        return tex(256, 320, (g, W, H) => {
          g.fillStyle = "#ffffff"; g.fillRect(0, 0, W, H);
          g.fillStyle = "#16283a"; g.globalAlpha = 0.85;
          for (let i = 0; i < 10; i++) { g.fillRect(30, 40 + i * 24, 190 - (i % 4) * 22, 5); }
          g.globalAlpha = 0.3;
          g.fillRect(30, 44 + 240, 60, 4); g.fillRect(110, 44 + 240, 90, 4);
          g.globalAlpha = 1;
        });
      }
      function photoTex() {
        return tex(200, 240, (g, W, H) => {
          const gr = g.createLinearGradient(0, 0, 0, H);
          gr.addColorStop(0, "#dfe8f2"); gr.addColorStop(1, "#9fb6cc");
          g.fillStyle = gr; g.fillRect(0, 0, W, H);
          g.fillStyle = "#16283a";
          g.beginPath(); g.arc(W / 2, H * 0.36, W * 0.16, 0, Math.PI * 2); g.fill();
          g.beginPath(); g.arc(W / 2, H * 0.82, W * 0.3, Math.PI, 0); g.fill();
        });
      }
      function certTex() {
        return tex(256, 320, (g, W, H) => {
          g.fillStyle = "#fbfcfe"; g.fillRect(0, 0, W, H);
          g.strokeStyle = "#2f6f9f"; g.lineWidth = 4;
          g.strokeRect(12, 12, W - 24, H - 24);
          g.fillStyle = "#2f6f9f"; g.globalAlpha = 0.85;
          g.font = "700 30px 'Noto Sans Telugu',sans-serif";
          g.textAlign = "center"; g.textBaseline = "middle";
          g.fillText("సర్టిఫికేట్", W / 2, H * 0.28);
          g.globalAlpha = 0.55;
          g.fillStyle = "#486581";
          g.fillRect(W * 0.25, H * 0.45, W * 0.5, 5);
          g.fillRect(W * 0.3, H * 0.56, W * 0.4, 5);
          g.fillRect(W * 0.25, H * 0.67, W * 0.5, 5);
          g.globalAlpha = 1;
          g.strokeStyle = "rgba(47,111,159,0.5)"; g.lineWidth = 3;
          for (let i = 0; i < 3; i++) { g.beginPath(); g.arc(W / 2, H * 0.88, 20 + i * 12, 0, Math.PI * 2); g.stroke(); }
        });
      }
      function rationTex() {
        return tex(256, 320, (g, W, H) => {
          g.fillStyle = "#f5e9d6"; g.fillRect(0, 0, W, H);
          g.fillStyle = "#8b4513"; g.fillRect(0, 0, W, H * 0.16);
          g.fillStyle = "#ffffff"; g.font = "700 30px 'Noto Sans Telugu',sans-serif";
          g.textAlign = "center"; g.textBaseline = "middle";
          g.fillText("రేషన్ కార్డ్", W / 2, H * 0.085);
          g.fillStyle = "#8b4513";
          g.font = "600 20px 'Space Grotesk','Noto Sans Telugu',sans-serif";
          g.fillText("RATION CARD", W / 2, H * 0.32);
          g.fillStyle = "rgba(139,69,19,0.7)";
          const cols = ["#35d0f0", "#6bd39c", "#f2b74d", "#9b8cf2", "#7ee8ff"];
          for (let i = 0; i < 5; i++) {
            const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
            g.fillStyle = cols[i];
            g.beginPath(); g.arc(W / 2 + Math.cos(a) * 46, H * 0.58 + Math.sin(a) * 40, 10, 0, Math.PI * 2); g.fill();
          }
        });
      }

      function makeParticles(n, spread, color) {
        const pos = new Float32Array(n * 3);
        for (let i = 0; i < n; i++) {
          pos[i * 3] = (Math.random() - 0.5) * spread;
          pos[i * 3 + 1] = (Math.random() - 0.5) * spread * 0.6;
          pos[i * 3 + 2] = (Math.random() - 0.5) * spread * 0.5 - 2;
        }
        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
        return new THREE.Points(geo, new THREE.PointsMaterial({
          color: color || 0x7ee8ff, size: 0.05, transparent: true, opacity: 0.5,
          depthWrite: false, blending: THREE.AdditiveBlending
        }));
      }

      return { renderer, scene, camera, tex, plane, cardMesh, glowSprite, mkTrail, labelTex, svcTex, paperTex, printTex, photoTex, certTex, rationTex, makeParticles };
    })();

    if (CT) {
      const { renderer, scene, camera } = CT;

      /* ---------------- Transition zone registry ---------------- */
      const zones = [];
      let loopRunning = false, lastT = 0, elOpacityOn = false;

      function startLoop() {
        if (loopRunning) return;
        loopRunning = true;
        requestAnimationFrame(tick);
      }
      function tick(t) {
        const dt = Math.min((t - lastT) / 1000, 0.1); lastT = t;
        let active = null, bestP = -1;
        zones.forEach((z) => {
          if (!z.vis) { z.g.visible = false; return; }
          if (!z.built) {
            try { z.built = z.cfg.build(scene); z.g.add(z.built.g); }
            catch (e) { console.warn("[CinTransitions] build failed:", e); z.vis = false; return; }
          }
          z.g.visible = true;
          if (z.p > bestP) { bestP = z.p; active = z; }
        });
        if (active) {
          try {
            active.built.update(t * 0.001, active.p, camera);
            renderer.render(scene, camera);
            if (!elOpacityOn) { elOpacityOn = true; document.getElementById("transCanvas").style.opacity = "1"; }
          } catch (e) {
            renderer.clear();
            if (elOpacityOn) { elOpacityOn = false; document.getElementById("transCanvas").style.opacity = "0"; }
          }
        } else {
          renderer.clear();
          if (elOpacityOn) { elOpacityOn = false; document.getElementById("transCanvas").style.opacity = "0"; }
          loopRunning = false;
          return;
        }
        requestAnimationFrame(tick);
      }

      function register(id, cfg) {
        const strip = document.getElementById(id);
        if (!strip) return;
        const g = new THREE.Group();
        scene.add(g); g.visible = false;
        const z = { id, strip, g, cfg, p: 0, vis: false, built: null };
        new IntersectionObserver((e) => {
          z.vis = e[0].isIntersecting;
          if (z.vis) startLoop();
        }, { threshold: 0 }).observe(strip);
        if (window.ScrollTrigger) {
          ScrollTrigger.create({
            trigger: strip, start: "top bottom", end: "bottom top", scrub: true,
            onUpdate: (st) => { z.p = st.progress; }
          });
        }
        zones.push(z);
        return z;
      }

      /* ============ 1. HERO -> PRINTING : flight through the document ============ */
      register("tr-heroPrint", {
        build: (scene) => {
          const g = new THREE.Group();
          const pt = CT.paperTex();
          const main = CT.cardMesh(4.6, 5.8, 0.06, { map: pt, color: 0xffffff });
          main.position.set(0, 0, -9);
          g.add(main);
          const flash = CT.plane(36, 36, { map: pt, color: 0xf7f4ec, transparent: true, opacity: 0 });
          flash.position.set(0, 0, 2); flash.visible = false; g.add(flash);
          const printer = SF.printer3d();
          printer.scale.set(0.8, 0.8, 0.8);
          printer.position.set(0, -0.5, -8);
          g.add(printer);
          const docs = [];
          const n = isLowPower ? 8 : 14;
          for (let i = 0; i < n; i++) {
            const d = CT.cardMesh(1 + Math.random() * 0.8, 1.4 + Math.random() * 1.2, 0.05, { color: 0xffffff, r: 0.04 });
            d.position.set((Math.random() - 0.5) * 16, (Math.random() - 0.5) * 8, -4 - Math.random() * 10);
            d.rotation.z = (Math.random() - 0.5) * 0.7;
            d.rotation.y = (Math.random() - 0.5) * 0.5;
            g.add(d); docs.push(d);
          }
          const sparks = CT.makeParticles(isLowPower ? 60 : 140, 22, 0x7ee8ff);
          g.add(sparks);
          return { g, update: (t, p, cam) => {
            /* phase A: the important document flies toward the camera (fast approach) */
            const fly = Math.min(p / 0.28, 1);
            const easeFly = 1 - Math.pow(1 - fly, 3);
            main.position.z = -9 + easeFly * 11;
            const ms = 0.7 + easeFly * 3.6;
            main.scale.set(ms, ms, ms);
            main.rotation.z = Math.sin(t * 0.6) * 0.05;
            /* paper passes the camera and exits — a brief wipe, not a lingering white-out */
            if (p > 0.34) {
              const out = Math.min((p - 0.34) / 0.14, 1);
              const eo = 1 - Math.pow(1 - out, 2);
              main.position.z -= eo * 4.5;
              main.position.x -= eo * 5;
              main.position.y -= eo * 1.2;
              main.rotation.z += eo * 0.35;
              main.rotation.y += eo * 0.5;
            }
            main.visible = p <= 0.5;
            /* floating documents drift toward camera, parallax */
            docs.forEach((d, i) => {
              d.position.z += p * 0.06 * (0.5 + (i % 3) * 0.25);
              if (d.position.z > 2) d.position.z = -12;
              d.rotation.x += p * 0.004;
            });
            /* soft paper flash as the wipe resolves into the printing world */
            if (p > 0.42 && p < 0.62) {
              flash.visible = true;
              const q = (p - 0.42) / 0.2;
              flash.material.opacity = Math.min(q < 0.5 ? q * 2 : (1 - q) * 2, 0.72);
              flash.position.z = 2 - q * 9;
            } else { flash.visible = false; }
            /* phase B: reveal the printing environment */
            if (p > 0.6) {
              const rp = (p - 0.6) / 0.4;
              printer.position.z = -8 + rp * 7;
              printer.position.y = -0.5 + rp * 0.6;
              const ps = 0.8 + rp * 1.1;
              printer.scale.set(ps, ps, ps);
              printer.rotation.y = Math.sin(t * 0.5) * 0.12;
            }
            sparks.rotation.y = t * 0.05;
            cam.position.z = 10 - p * 6;
            cam.position.y = Math.sin(t * 0.4) * 0.15;
            cam.lookAt(0, 0, 0);
          } };
        }
      });

      /* ============ 2. PRINTING -> LAMINATION : gloss layer + light sweep ============ */
      register("tr-xeroxLam", {
        build: (scene) => {
          const g = new THREE.Group();
          const doc = CT.cardMesh(4, 5, 0.06, { map: CT.printTex(), color: 0xffffff });
          doc.position.set(0, 0, -4);
          g.add(doc);
          const gloss = CT.plane(4.1, 5.1, { color: 0xffffff, transparent: true, opacity: 0, clearcoat: 1, roughness: 0.05 });
          gloss.position.set(0, 0, -3.7);
          g.add(gloss);
          const sweep = CT.plane(1.4, 6, { color: 0xffffff, transparent: true, opacity: 0, emissive: 0x9fd8ff, emissiveIntensity: 1, metalness: 0, roughness: 1 });
          sweep.position.set(-3, 0, -3.65);
          sweep.material.blending = THREE.AdditiveBlending;
          sweep.material.depthWrite = false;
          g.add(sweep);
          const shine = CT.glowSprite("rgba(255,255,255,0.9)", 6);
          shine.position.set(0, 0, -3.6); shine.material.opacity = 0;
          g.add(shine);
          return { g, update: (t, p, cam) => {
            doc.position.z = -4 + p * 5;
            doc.rotation.y = Math.sin(t * 0.4) * 0.06 + p * 0.3;
            doc.rotation.x = p * 0.15;
            const ds = 1 + p * 0.6;
            doc.scale.set(ds, ds, ds);
            /* glossy lamination layer slides over */
            if (p > 0.18 && p < 0.55) {
              const q = (p - 0.18) / 0.37;
              gloss.visible = true;
              gloss.material.opacity = Math.min(q * 0.55, 0.55);
              gloss.position.y = -3 + q * 6;
            } else { gloss.visible = false; }
            /* repeated light sweep */
            if (p > 0.3 && p < 0.85) {
              sweep.visible = true;
              const sp = (p - 0.3) / 0.55;
              sweep.position.x = -3.5 + ((t * 2 + sp * 7) % 7);
              sweep.material.opacity = 0.5;
              shine.material.opacity = 0.35;
            } else {
              sweep.visible = false; shine.material.opacity = 0;
            }
            shine.position.x = sweep.position.x;
            cam.position.z = 8 - p * 3.5;
            cam.position.x = Math.sin(p * 1.4) * 0.8;
            cam.position.y = Math.sin(t * 0.5) * 0.2;
            cam.lookAt(0, 0, 0);
          } };
        }
      });

      /* ============ 3. LAMINATION -> PVC CARD : compress, sharpen, orbit ============ */
      register("tr-lamPvc", {
        build: (scene) => {
          const g = new THREE.Group();
          const lam = CT.cardMesh(4, 5, 0.08, { map: CT.paperTex(), color: 0xf5f0e0, r: 0.2 });
          lam.position.set(0, 0, 0);
          g.add(lam);
          const card = CT.cardMesh(3.6, 2.3, 0.22, { map: CT.labelTex(360, 230, "#f2b74d", "PVC", "కార్డ్"), color: 0x0d3450, r: 0.06 });
          card.scale.set(0, 0, 0);
          card.position.set(0, 0, 0);
          g.add(card);
          const edge = new THREE.LineSegments(new THREE.EdgesGeometry(card.geometry), new THREE.LineBasicMaterial({ color: 0xf2b74d, transparent: true, opacity: 0.4 }));
          card.add(edge);
          const halo = CT.glowSprite("rgba(53,208,240,0.8)", 8);
          halo.material.opacity = 0; g.add(halo);
          return { g, update: (t, p, cam) => {
            if (p < 0.35) {
              /* document compresses vertically, corners sharpen */
              const q = p / 0.35;
              lam.scale.set(1 + q * 0.1, 1 - q * 0.55, 1);
              lam.rotation.z = q * 0.15;
              card.scale.set(0, 0, 0);
            } else if (p < 0.65) {
              /* card emerges, rotates in 3D */
              lam.scale.set(1.1, 0.45, 1);
              const q = (p - 0.35) / 0.3;
              const s = 1 - Math.pow(1 - q, 3);
              card.scale.set(s, s, s);
              card.rotation.y = q * Math.PI * 2.2;
              card.rotation.x = Math.sin(t * 0.6) * 0.15;
              halo.material.opacity = q * 0.4;
            } else {
              /* camera moves around the card — card is the hero object */
              const q = (p - 0.65) / 0.35;
              card.scale.set(1, 1, 1);
              card.rotation.y = t * 0.35;
              card.rotation.x = Math.sin(t * 0.4) * 0.1;
              halo.material.opacity = 0.4 + Math.sin(t * 1.2) * 0.15;
              lam.visible = false;
              cam.position.x = Math.sin(q * Math.PI * 1.4) * 5.2;
              cam.position.z = Math.cos(q * Math.PI * 1.4) * 5.2;
              cam.position.y = 1.2;
              cam.lookAt(0, 0, 0);
              return;
            }
            cam.position.set(0, 1, 7 - p * 2.5);
            cam.lookAt(0, 0, 0);
          } };
        }
      });

      /* ============ 4. PVC CARD -> PHOTO : rotate, flash, floating photos ============ */
      register("tr-pvcPhoto", {
        build: (scene) => {
          const g = new THREE.Group();
          const card = CT.cardMesh(3.4, 2.2, 0.2, { map: CT.labelTex(340, 220, "#f2b74d", "PVC", "కార్డ్"), color: 0x0d3450, r: 0.06 });
          card.position.set(0, 0, 0);
          g.add(card);
          const photo = CT.cardMesh(3.6, 2.4, 0.06, { map: CT.photoTex(), color: 0xffffff, r: 0.05 });
          photo.visible = false; photo.position.set(0, 0, 0);
          g.add(photo);
          const flash = CT.glowSprite("rgba(255,255,255,1)", 18);
          flash.material.opacity = 0; g.add(flash);
          const photos = [];
          const n = isLowPower ? 4 : 7;
          for (let i = 0; i < n; i++) {
            const p = CT.cardMesh(1.1 + (i % 3) * 0.3, 1.4 + (i % 2) * 0.35, 0.04, { map: CT.photoTex(), color: 0xffffff, r: 0.04 });
            p.visible = false;
            g.add(p); photos.push(p);
          }
          return { g, update: (t, p, cam) => {
            /* card rotates to face the camera */
            card.rotation.y = (1 - Math.min(p / 0.3, 1)) * 0.9;
            card.rotation.x = Math.sin(t * 0.5) * 0.08;
            if (p > 0.3) {
              card.visible = false;
              photo.visible = true;
              const s = 0.8 + Math.min((p - 0.3) * 2, 1) * 0.8;
              photo.scale.set(s, s, s);
              photo.rotation.y = Math.sin(t * 0.4) * 0.04;
            }
            /* camera flash */
            if (p > 0.45 && p < 0.7) {
              const q = (p - 0.45) / 0.25;
              flash.material.opacity = q < 0.3 ? q * 3.3 : (1 - q) * 1.4;
            } else flash.material.opacity = 0;
            /* floating photographs in depth layers */
            photos.forEach((ph, i) => {
              if (p > 0.6) {
                ph.visible = true;
                const q = Math.min((p - 0.6) * 3, 1);
                const a = (i / photos.length) * Math.PI * 2 + t * 0.1;
                ph.position.set(Math.cos(a) * (3 + (i % 2) * 1.2), Math.sin(a * 1.3) * 1.6, -1.5 - (i % 3) * 0.8);
                ph.rotation.y = t * 0.15 + (i % 2 ? 1 : -1) * 0.4;
                ph.rotation.z = Math.sin(t * 0.3 + i) * 0.08;
                const fs = 0.3 + q * 0.7;
                ph.scale.set(fs, fs, fs);
              }
            });
            cam.position.z = 7 - p * 3;
            cam.position.y = Math.sin(t * 0.4) * 0.2;
            cam.lookAt(0, 0, 0);
          } };
        }
      });

      /* ============ 5. PHOTO -> CERTIFICATES : camera travels between papers ============ */
      register("tr-photoCert", {
        build: (scene) => {
          const g = new THREE.Group();
          const photo = CT.cardMesh(3.4, 2.4, 0.06, { map: CT.photoTex(), color: 0xffffff, r: 0.04 });
          photo.position.set(0, 0, 1.5);
          g.add(photo);
          const certs = [];
          for (let i = 0; i < 4; i++) {
            const c = CT.cardMesh(4, 5, 0.05, { map: CT.certTex(), color: 0xffffff, r: 0.02 });
            c.position.set(0, 0, -2 - i * 1.6);
            c.rotation.z = (Math.random() - 0.5) * 0.04;
            g.add(c); certs.push(c);
          }
          const floatCerts = [];
          const n = isLowPower ? 3 : 5;
          for (let i = 0; i < n; i++) {
            const c = CT.cardMesh(2.8, 3.6, 0.04, { map: CT.certTex(), color: 0xffffff, r: 0.02 });
            c.visible = false;
            g.add(c); floatCerts.push(c);
          }
          const sparks = CT.makeParticles(isLowPower ? 50 : 110, 16, 0x9fb6cc);
          g.add(sparks);
          return { g, update: (t, p, cam) => {
            /* photo moves into the document stack */
            if (p < 0.4) {
              const q = p / 0.4;
              photo.position.z = 1.5 - q * 3.4;
              photo.position.y = q * 0.4;
              photo.rotation.x = q * 0.3;
            } else photo.visible = false;
            /* camera travels between the papers */
            if (p > 0.35 && p < 0.7) {
              const q = (p - 0.35) / 0.35;
              cam.position.z = 6 - q * 4.5;
              cam.position.x = Math.sin(q * Math.PI) * 0.6;
              cam.position.y = 0.5 + Math.sin(q * Math.PI) * 0.4;
              cam.lookAt(0, 0, -2);
            }
            /* certificates separate and float around the camera */
            floatCerts.forEach((c, i) => {
              if (p > 0.6) {
                c.visible = true;
                const q = Math.min((p - 0.6) * 2.5, 1);
                const a = (i / floatCerts.length) * Math.PI * 2 + t * 0.08;
                c.position.set(Math.cos(a) * (4 + i * 0.6), Math.sin(a) * 1.8, Math.sin(a * 1.4) * 2);
                c.rotation.y = a + t * 0.1;
                c.rotation.z = Math.sin(t * 0.4 + i) * 0.1;
                const fs = 0.3 + q * 0.8;
                c.scale.set(fs, fs, fs);
              }
            });
            sparks.rotation.y = t * 0.04;
            if (p < 0.35) { cam.position.set(0, 0.6, 7 - p * 2); cam.lookAt(0, 0, 0); }
            if (p > 0.7) { cam.position.set(0, 1.5 - (p - 0.7), 2.5); cam.lookAt(0, 0, 0); }
          } };
        }
      });

      /* ============ 6. CERTIFICATES -> PAN / AADHAAR / LICENCE + CARD ORBITAL ============ */
      register("tr-certId", {
        build: (scene) => {
          const g = new THREE.Group();
          const defs = [
            { tex: CT.labelTex(360, 230, "#f2b74d", "PAN", "పాన్ కార్డ్"), col: 0x0d3450, rad: 4.4, sp: 0.5, tilt: 0.6 },
            { tex: CT.labelTex(360, 230, "#35d0f0", "AADHAAR", "ఆధార్"), col: 0x0e5c3a, rad: 6.2, sp: -0.4, tilt: 0.5 },
            { tex: CT.labelTex(360, 230, "#6bd39c", "DRIVING LICENCE", "డ్రైవింగ్ లైసెన్స్"), col: 0x1a1a3a, rad: 5.2, sp: 0.7, tilt: 0.7 }
          ];
          const cards = defs.map((d) => {
            const c = CT.cardMesh(3.6, 2.3, 0.16, { map: d.tex, color: d.col, r: 0.05 });
            c.position.set(0, 0, 0); c.scale.set(0, 0, 0);
            g.add(c);
            return { mesh: c, ...d };
          });
          const trails = cards.map(() => CT.mkTrail(0x35d0f0, 26));
          trails.forEach(tr => g.add(tr.line));
          const particles = CT.makeParticles(isLowPower ? 60 : 150, 20, 0x35d0f0);
          g.add(particles);
          const orbitGlow = CT.glowSprite("rgba(53,208,240,0.55)", 14);
          orbitGlow.material.opacity = 0; g.add(orbitGlow);
          return { g, update: (t, p, cam) => {
            const phase = p < 0.3 ? 0 : p < 1 ? 1 : 1;
            if (phase === 0) {
              /* cards appear and rotate in place */
              cards.forEach((c, i) => {
                const s = Math.min((p + 0.1 - i * 0.05) * 4, 1);
                c.mesh.scale.set(s, s, s);
                c.mesh.rotation.y = t * 0.4 + i * 0.6;
                c.mesh.position.y = Math.sin(t * 0.5 + i) * 0.1;
              });
              trails.forEach(tr => { tr.line.visible = false; });
              orbitGlow.material.opacity = 0;
              cam.position.set(0, 1, 8 - p * 2.5);
              cam.lookAt(0, 0, 0);
            } else {
              /* orbital environment — cards travel curved orbital paths around camera */
              const q = p;
              cards.forEach((c, i) => {
                const a = t * c.sp * 0.6 + (i / cards.length) * Math.PI * 2;
                const r = c.rad * (1 + q * 0.3);
                c.mesh.scale.set(1, 1, 1);
                c.mesh.position.set(Math.cos(a) * r, Math.sin(a * 1.6) * r * 0.42, Math.sin(a) * 2.2 - 1);
                c.mesh.rotation.y = a;
                c.mesh.rotation.x = Math.sin(a) * c.tilt;
                trails[i].line.visible = true;
                trails[i].add(c.mesh.position);
              });
              orbitGlow.material.opacity = 0.35 + Math.sin(t * 1.4) * 0.12;
              particles.rotation.y = t * 0.03;
              cam.position.x = Math.sin(t * 0.4) * 1.2;
              cam.position.y = 1 + Math.sin(t * 0.35) * 0.6;
              cam.position.z = 6.5 - q * 1.5;
              cam.lookAt(0, 0, -1);
            }
          } };
        }
      });

      /* ============ 7. CARDS -> RATION CARD : approach + transform ============ */
      register("tr-idRation", {
        build: (scene) => {
          const g = new THREE.Group();
          const cards = [
            { mesh: CT.cardMesh(3.6, 2.3, 0.16, { map: CT.labelTex(360, 230, "#f2b74d", "PAN", "పాన్ కార్డ్"), color: 0x0d3450, r: 0.05 }), a: 0.3, r: 5 },
            { mesh: CT.cardMesh(3.6, 2.3, 0.16, { map: CT.labelTex(360, 230, "#35d0f0", "AADHAAR", "ఆధార్"), color: 0x0e5c3a, r: 0.05 }), a: 2.4, r: 6 },
            { mesh: CT.cardMesh(3.6, 2.3, 0.16, { map: CT.labelTex(360, 230, "#6bd39c", "DRIVING LICENCE", "డ్రైవింగ్ లైసెన్స్"), color: 0x1a1a3a, r: 0.05 }), a: 4.3, r: 5.6 }
          ];
          cards.forEach((c, i) => { c.mesh.position.set(Math.cos(c.a) * c.r, Math.sin(c.a * 1.4) * c.r * 0.4, Math.sin(c.a) * 2); g.add(c.mesh); });
          const ration = CT.cardMesh(3.8, 2.5, 0.2, { map: CT.rationTex(), color: 0x8b4513, r: 0.05 });
          ration.scale.set(0, 0, 0);
          g.add(ration);
          const glow = CT.glowSprite("rgba(242,183,77,0.8)", 9);
          glow.material.opacity = 0; g.add(glow);
          return { g, update: (t, p, cam) => {
            /* orbiting cards converge toward the camera */
            cards.forEach((c, i) => {
              const q = Math.min(p / 0.35, 1);
              const ease = 1 - Math.pow(1 - q, 3);
              c.mesh.position.x = Math.cos(c.a) * c.r * (1 - ease * 0.8);
              c.mesh.position.y = Math.sin(c.a * 1.4) * c.r * 0.4 * (1 - ease * 0.8);
              c.mesh.position.z = (Math.sin(c.a) * 2) * (1 - ease * 0.8) + ease * 0.5;
              c.mesh.scale.set(1 - ease * 0.3, 1 - ease * 0.3, 1);
              c.mesh.rotation.y = t * 0.3 + i;
            });
            /* one card expands toward camera and transforms into the ration card */
            if (p > 0.3) {
              const q = (p - 0.3) / 0.4;
              const ease = 1 - Math.pow(1 - q, 3);
              ration.scale.set(ease, ease, ease);
              ration.position.z = ease * 1.4;
              ration.rotation.y = t * 0.25 + (1 - ease) * 0.8;
              ration.position.y = Math.sin(t * 0.4) * 0.08;
              glow.material.opacity = 0.4 + ease * 0.3;
              cards.forEach(c => { c.mesh.scale.set(1 - ease, 1 - ease, 1); });
            }
            if (p > 0.7) {
              ration.position.z = 1.4 - (p - 0.7) * 3;
              ration.scale.set(1 - (p - 0.7), 1 - (p - 0.7), 1);
            }
            cam.position.z = 7 - p * 3.5;
            cam.position.y = Math.sin(t * 0.4) * 0.15;
            cam.lookAt(0, 0, 0);
          } };
        }
      });

      /* ============ 8. RATION CARD -> CITIZEN SERVICES : organized service explosion ============ */
      register("tr-rationCitizen", {
        build: (scene) => {
          const g = new THREE.Group();
          const labels = [
            "ఆదాయ సర్టిఫికేట్", "కుల సర్టిఫికేట్", "OBC / EWS", "వ్యవసాయ ఆదాయం",
            "వారసత్వ సర్టిఫికేట్", "అడంగల్ / 1B", "పాస్‌బుక్ మ్యూటేషన్", "E-Passbook",
            "సీనియర్ సిటిజన్", "UDID", "E-Stamp"
          ];
          const docs = labels.map((label, i) => {
            const d = CT.cardMesh(1.3, 1.7, 0.04, { map: CT.svcTex(label), color: 0xffffff, r: 0.04 });
            const a = (i / labels.length) * Math.PI * 2;
            d.position.set(0, 0, 0); d.scale.set(0, 0, 0);
            g.add(d);
            return { mesh: d, a, r: isLowPower ? 3.6 : 4.6, tilt: (Math.random() - 0.5) * 0.4 };
          });
          const ration = CT.cardMesh(3.6, 2.4, 0.18, { map: CT.rationTex(), color: 0x8b4513, r: 0.05 });
          g.add(ration);
          const sparks = CT.makeParticles(isLowPower ? 50 : 120, 18, 0xf2b74d);
          g.add(sparks);
          const halo = CT.glowSprite("rgba(242,183,77,0.7)", 10);
          halo.material.opacity = 0; g.add(halo);
          return { g, update: (t, p, cam) => {
            const boom = p < 0.3 ? 0 : Math.min((p - 0.3) / 0.25, 1);
            const ease = 1 - Math.pow(1 - boom, 3);
            ration.scale.set(1 - boom * 0.4, 1 - boom * 0.4, 1);
            ration.rotation.y = t * 0.3 * (1 - boom);
            halo.material.opacity = 0.3 + Math.sin(t * 1.5) * 0.15;
            docs.forEach((d, i) => {
              if (boom > 0) {
                d.mesh.visible = true;
                const ra = d.r * ease;
                const y = Math.sin(d.a * 1.5) * 0.5 * ease + (i % 2 ? 0.5 : -0.4) * ease;
                d.mesh.position.set(Math.cos(d.a) * ra, y, Math.sin(d.a) * 1.2 * ease - 0.5);
                d.mesh.rotation.y = t * 0.12 + d.a;
                d.mesh.rotation.z = d.tilt;
                const s = Math.max(ease * 0.9, 0.01);
                d.mesh.scale.set(s, s, s);
              } else d.mesh.visible = false;
            });
            sparks.rotation.y = t * 0.04;
            if (boom >= 1) {
              /* organized circular ecosystem, camera pulls back gently */
              cam.position.z = 6 - (p - 0.55) * 1.6;
              cam.position.y = 0.6;
            } else {
              cam.position.z = 7 - p * 1.5;
              cam.position.y = Math.sin(t * 0.4) * 0.2;
            }
            cam.lookAt(0, 0, 0);
          } };
        }
      });

      if (window.gsap && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
    }

    /* ================================================================
       HOW IT WORKS — 3D GLOWING JOURNEY PATH
    ================================================================ */
    (function initHowJourney() {
      const cv = document.getElementById("howCanvas");
      if (!cv || typeof THREE === "undefined") return;
      const howSec = document.querySelector(".how");
      if (!howSec) return;
      let renderer;
      try {
        renderer = new THREE.WebGLRenderer({ canvas: cv, alpha: true, antialias: !isLowPower });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isLowPower ? 1.5 : 2));
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.15;
      } catch (e) {
        cv.style.background = "linear-gradient(145deg, #030b16 0%, #061428 50%, #0b2740 100%)";
        return;
      }
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 60);
      camera.position.set(0, 4.4, 9.5);

      function resize() {
        const w = howSec.clientWidth, h = howSec.clientHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / h; camera.updateProjectionMatrix();
      }
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(howSec);

      scene.add(new THREE.AmbientLight(0x3a5a78, 0.6));
      const key = new THREE.PointLight(0x35d0f0, 3, 30); key.position.set(4, 6, 6); scene.add(key);
      const gold = new THREE.PointLight(0xf2b74d, 1.6, 26); gold.position.set(-5, -3, 5); scene.add(gold);

      const nodeX = [-4.2, -1.4, 1.4, 4.2];
      const nodes = nodeX.map((x, i) => {
        const glow = new THREE.Mesh(
          new THREE.SphereGeometry(0.22, 16, 16),
          new THREE.MeshStandardMaterial({ color: 0x35d0f0, emissive: 0x35d0f0, emissiveIntensity: 0.7 })
        );
        glow.position.set(x, 0.4, i % 2 ? 0.6 : 0);
        scene.add(glow);
        const halo = new THREE.Sprite(new THREE.SpriteMaterial({
          map: (function () {
            const c = document.createElement("canvas"); c.width = 128; c.height = 128;
            const g = c.getContext("2d");
            const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
            gr.addColorStop(0, "rgba(53,208,240,0.9)"); gr.addColorStop(1, "rgba(53,208,240,0)");
            g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
            return new THREE.CanvasTexture(c);
          })(),
          transparent: true, depthWrite: false, blending: THREE.AdditiveBlending
        }));
        halo.scale.set(2.4, 2.4, 1);
        halo.position.copy(glow.position);
        scene.add(halo);
        return { glow, halo, active: false };
      });

      const pathPts = nodeX.map((x, i) => new THREE.Vector3(x, 0.4, i % 2 ? 0.6 : 0));
      const curve = new THREE.CatmullRomCurve3(pathPts);
      const tube = new THREE.Mesh(
        new THREE.TubeGeometry(curve, 64, 0.035, 8, false),
        new THREE.MeshStandardMaterial({ color: 0x35d0f0, emissive: 0x35d0f0, emissiveIntensity: 0.55, transparent: true, opacity: 0.85 })
      );
      scene.add(tube);

      const traveler = new THREE.Mesh(
        new THREE.SphereGeometry(0.16, 14, 14),
        new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0x9fd8ff, emissiveIntensity: 1.4 })
      );
      scene.add(traveler);
      const tHalo = new THREE.Sprite(new THREE.SpriteMaterial({
        map: (function () {
          const c = document.createElement("canvas"); c.width = 128; c.height = 128;
          const g = c.getContext("2d");
          const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
          gr.addColorStop(0, "rgba(159,216,255,0.95)"); gr.addColorStop(1, "rgba(159,216,255,0)");
          g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
          return new THREE.CanvasTexture(c);
        })(),
        transparent: true, depthWrite: false, blending: THREE.AdditiveBlending
      }));
      tHalo.scale.set(3, 3, 1);
      scene.add(tHalo);

      const trail = (function () {
        const pts = new Array(24).fill(0).map(() => new THREE.Vector3(0, -50, 0));
        const geo = new THREE.BufferGeometry().setFromPoints(pts);
        const line = new THREE.Line(geo, new THREE.LineBasicMaterial({ color: 0x7ee8ff, transparent: true, opacity: 0.4, blending: THREE.AdditiveBlending, depthWrite: false }));
        line.frustumCulled = false;
        scene.add(line);
        return { line, pts };
      })();

      let vis = false;
      new IntersectionObserver((e) => { vis = e[0].isIntersecting; }, { threshold: 0.05 }).observe(howSec);
      let jp = 0;
      if (window.ScrollTrigger) {
        ScrollTrigger.create({ trigger: ".steps-path", start: "top 80%", end: "bottom 20%", scrub: 1, onUpdate: (st) => { jp = st.progress; } });
      }

      const clock = new THREE.Clock();
      (function animate() {
        requestAnimationFrame(animate);
        if (!vis) return;
        const t = clock.getElapsedTime();
        const tp = Math.min(Math.max(jp, 0), 1);
        const pos = curve.getPointAt(tp);
        traveler.position.copy(pos);
        tHalo.position.copy(pos);
        trail.pts.pop();
        trail.pts.unshift(pos.clone());
        trail.line.geometry.attributes.position.needsUpdate = true;

        nodes.forEach((nd, i) => {
          const active = tp > (i + 0.45) / 4;
          if (active && !nd.active) { nd.active = true; }
          const pulse = nd.active ? 1 + Math.sin(t * 3 + i) * 0.15 : 1;
          nd.glow.scale.set(pulse, pulse, pulse);
          nd.glow.material.emissiveIntensity = nd.active ? 1.3 : 0.7;
          nd.halo.material.opacity = nd.active ? 0.85 : 0.35;
        });

        camera.position.x = Math.sin(tp * Math.PI * 2) * 0.5;
        camera.position.y = 4.4 + Math.sin(tp * Math.PI) * 0.5;
        camera.position.z = 9.5 - tp * 0.6;
        camera.lookAt(0, 0.4, 0.3);

        renderer.render(scene, camera);
      })();
    })();

    /* ================================================================
       FINAL CTA — SERVICE ECOSYSTEM + BRAND REVEAL
    ================================================================ */
    (function initCtaEcosystem() {
      const cv = document.getElementById("ctaCanvas");
      if (!cv || typeof THREE === "undefined") return;
      const ctaSec = document.querySelector(".final-cta");
      if (!ctaSec) return;
      const revealEl = ctaSec.querySelector(".cta-brand-reveal");
      let renderer;
      try {
        renderer = new THREE.WebGLRenderer({ canvas: cv, alpha: true, antielias: !isLowPower });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isLowPower ? 1.5 : 2));
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.2;
      } catch (e) {
        cv.style.background = "linear-gradient(145deg, #030b16 0%, #061428 50%, #0b2740 100%)";
        return;
      }
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 80);
      camera.position.set(0, 0.6, 9.5);

      function resize() {
        const w = ctaSec.clientWidth, h = ctaSec.clientHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / h; camera.updateProjectionMatrix();
      }
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(ctaSec);

      scene.add(new THREE.AmbientLight(0x3a5a78, 0.7));
      const kL = new THREE.PointLight(0x35d0f0, 3.2, 40); kL.position.set(5, 6, 8); scene.add(kL);
      const rL = new THREE.PointLight(0xf2b74d, 2, 34); rL.position.set(-6, -4, 7); scene.add(rL);

      const specs = [
        { mk: () => CT.cardMesh(2.6, 1.7, 0.14, { map: CT.labelTex(260, 170, "#f2b74d", "PAN", "పాన్ కార్డ్"), color: 0x0d3450, r: 0.05 }) },
        { mk: () => CT.cardMesh(2.6, 1.7, 0.14, { map: CT.labelTex(260, 170, "#35d0f0", "AADHAAR", "ఆధార్"), color: 0x0e5c3a, r: 0.05 }) },
        { mk: () => CT.cardMesh(2.6, 1.7, 0.14, { map: CT.labelTex(260, 170, "#6bd39c", "LICENCE", "లైసెన్స్"), color: 0x1a1a3a, r: 0.05 }) },
        { mk: () => CT.cardMesh(2.4, 1.6, 0.04, { map: CT.certTex(), color: 0xffffff, r: 0.03 }) },
        { mk: () => CT.cardMesh(2.2, 1.5, 0.05, { map: CT.photoTex(), color: 0xffffff, r: 0.04 }) },
        { mk: () => CT.cardMesh(2.6, 1.8, 0.16, { map: CT.rationTex(), color: 0x8b4513, r: 0.05 }) },
        { mk: () => { const b = SF.book({ w: 1.6, h: 2, thickness: 0.2 }); b.scale.set(0.7, 0.7, 0.7); return b; } },
        { mk: () => { const s = SF.stamp(); s.scale.set(0.5, 0.5, 0.5); return s; } },
        { mk: () => CT.cardMesh(2.2, 1.6, 0.04, { map: CT.svcTex("సీనియర్ సిటిజన్"), color: 0xffffff, r: 0.04 }) },
        { mk: () => CT.cardMesh(2.2, 1.6, 0.04, { map: CT.svcTex("E-Stamp"), color: 0xffffff, r: 0.04 }) }
      ];
      const objects = specs.map((s, i) => {
        const m = s.mk();
        const a = Math.random() * Math.PI * 2;
        const r = 8 + Math.random() * 7;
        m.position.set(Math.cos(a) * r, (Math.random() - 0.5) * 4, (Math.random() - 0.5) * 5 - 2);
        m.rotation.set((Math.random() - 0.5), (Math.random() - 0.5), (Math.random() - 0.5) * 2);
        scene.add(m);
        return { mesh: m, i, a, r, ringR: 2.3 + (i % 3) * 0.55 };
      });
      const particles = CT.makeParticles(isLowPower ? 60 : 140, 20, 0x7ee8ff);
      scene.add(particles);
      const centerGlow = CT.glowSprite("rgba(53,208,240,0.6)", 10);
      centerGlow.material.opacity = 0; scene.add(centerGlow);

      let vis = false;
      new IntersectionObserver((e) => { vis = e[0].isIntersecting; }, { threshold: 0.05 }).observe(ctaSec);
      let cp = 0;
      if (window.ScrollTrigger) {
        ScrollTrigger.create({ trigger: ".final-cta", start: "top 80%", end: "bottom 30%", scrub: 1, onUpdate: (st) => { cp = st.progress; } });
      }
      /* robust brand reveal — triggers on intersection regardless of viewport height */
      if (revealEl) {
        const rObserver = new IntersectionObserver((entries) => {
          entries.forEach((en) => { if (en.isIntersecting) { revealEl.classList.add("is-in"); rObserver.disconnect(); } });
        }, { threshold: 0.25 });
        rObserver.observe(revealEl);
      }

      const clock = new THREE.Clock();
      (function animate() {
        requestAnimationFrame(animate);
        if (!vis) return;
        const t = clock.getElapsedTime();
        const ease = 1 - Math.pow(1 - Math.min(cp, 1), 2.4);
        objects.forEach((o) => {
          const targetA = (o.i / objects.length) * Math.PI * 2;
          const ringA = targetA + t * 0.08;
          const rr = o.ringR;
          const x = (1 - ease) * o.mesh.position.x + ease * Math.cos(ringA) * rr;
          const y = (1 - ease) * o.mesh.position.y + ease * (Math.sin(ringA * 1.5) * 0.5);
          const z = (1 - ease) * o.mesh.position.z + ease * (Math.sin(ringA) * 0.6);
          o.mesh.position.set(x, y, z);
          o.mesh.rotation.x += 0.003;
          o.mesh.rotation.y += 0.006;
        });
        particles.rotation.y = t * 0.04;
        centerGlow.material.opacity = ease * (0.4 + Math.sin(t * 1.3) * 0.1);
        camera.position.z = 9.5 + ease * 3;
        camera.position.y = 0.6 + ease * 0.5;
        camera.lookAt(0, 0, 0);
        renderer.render(scene, camera);
      })();
    })();

  }

  /* ================================================================
     COMMUNITY — PREMIUM CITIZEN FIGURES (respectful abstract scenes)
  ================================================================ */
  (function initCommunityFigures() {
    const figures = [
      {
        key: "farmer",
        caption: "పంటకు అండగా సేవలు",
          svg: '<svg viewBox="0 0 80 80" fill="none" aria-hidden="true"><circle cx="40" cy="40" r="34" fill="#0b2740" opacity="0.35"/><circle cx="56" cy="22" r="6" fill="#f2b74d" opacity="0.85"/><path d="M14 58 q5 -5 10 0 t10 0 t10 0 t10 0" stroke="#6bd39c" stroke-width="3" stroke-linecap="round" opacity="0.8"/><path d="M16 50 q5 -5 10 0 t10 0 t10 0 t10 0" stroke="#6bd39c" stroke-width="3" stroke-linecap="round" opacity="0.5"/><circle cx="36" cy="30" r="6.5" fill="#35d0f0" opacity="0.9"/><path d="M29 48 q0 -11 7 -11 q7 0 7 11 z" fill="#35d0f0" opacity="0.85"/><path d="M27 26 h18 v3 h-18 z" fill="#f2b74d"/></svg>'
        },
        {
          key: "senior",
          caption: "వృద్ధాప్యంలోనూ సులభం",
          svg: '<svg viewBox="0 0 80 80" fill="none" aria-hidden="true"><circle cx="40" cy="40" r="34" fill="#0b2740" opacity="0.35"/><circle cx="42" cy="28" r="6" fill="#7ee8ff" opacity="0.9"/><path d="M35 46 q0 -12 7 -12 q7 0 7 12 z" fill="#7ee8ff" opacity="0.85"/><path d="M34 58 l-6 -14" stroke="#f2b74d" stroke-width="3" stroke-linecap="round"/><path d="M38 50 l-8 2" stroke="#f2b74d" stroke-width="3" stroke-linecap="round"/><path d="M54 28 q-4 4 0 8 q4 -4 0 -8 z" fill="#f2b74d" opacity="0.8"/></svg>'
        },
        {
          key: "student",
          caption: "చదువుకు తోడు సేవలు",
          svg: '<svg viewBox="0 0 80 80" fill="none" aria-hidden="true"><circle cx="40" cy="40" r="34" fill="#0b2740" opacity="0.35"/><path d="M22 34 h34 v6 h-34 z" fill="#9b8cf2"/><path d="M18 36 l22 -10 l22 10 l-22 10 z" fill="#35d0f0" opacity="0.85"/><circle cx="39" cy="26" r="5" fill="#9b8cf2" opacity="0.9"/><rect x="34" y="34" width="10" height="16" rx="2" fill="#f2b74d" opacity="0.85"/><path d="M32 52 q7 -4 14 0" stroke="#9b8cf2" stroke-width="3" stroke-linecap="round"/></svg>'
        },
        {
          key: "family",
          caption: "కుటుంబమంతా ఒకే చోట",
          svg: '<svg viewBox="0 0 80 80" fill="none" aria-hidden="true"><circle cx="40" cy="40" r="34" fill="#0b2740" opacity="0.35"/><path d="M22 28 q0 -6 5 -6 q5 0 5 6 v20 h-10 z" fill="#35d0f0" opacity="0.9"/><circle cx="29" cy="22" r="5" fill="#35d0f0" opacity="0.9"/><path d="M48 26 q0 -7 6 -7 q6 0 6 7 v18 h-12 z" fill="#6bd39c" opacity="0.9"/><circle cx="54" cy="19" r="5.5" fill="#6bd39c" opacity="0.9"/><path d="M38 66 q0 -14 10 -14 q10 0 10 14 z" fill="#f2b74d" opacity="0.9"/><circle cx="58" cy="48" r="5" fill="#f2b74d" opacity="0.9"/></svg>'
        },
        {
          key: "business",
          caption: "వ్యాపారానికి సహాయం",
          svg: '<svg viewBox="0 0 80 80" fill="none" aria-hidden="true"><circle cx="40" cy="40" r="34" fill="#0b2740" opacity="0.35"/><path d="M20 34 h40 v4 h-40 z" fill="#f2b74d"/><path d="M24 30 q2 -6 8 -6 q6 0 8 6 z" fill="#9b8cf2"/><rect x="28" y="38" width="24" height="14" fill="#2f6f9f" opacity="0.8"/><path d="M36 52 v6" stroke="#35d0f0" stroke-width="2"/><circle cx="32" cy="42" r="2.5" fill="#7ee8ff"/><circle cx="48" cy="42" r="2.5" fill="#7ee8ff"/><path d="M30 60 h20" stroke="#6bd39c" stroke-width="2" stroke-linecap="round"/></svg>'
        }
      ];
      document.querySelectorAll(".community-card").forEach((card) => {
        const icon = card.querySelector(".community-icon");
        const h3 = card.querySelector("h3");
        if (!icon) return;
        const idx = Array.prototype.indexOf.call(card.parentElement.children, card);
        const fig = figures[idx % figures.length] || figures[0];
        icon.innerHTML = fig.svg;
        if (h3 && !card.querySelector(".community-caption")) {
          const cap = document.createElement("p");
          cap.className = "community-caption";
          cap.textContent = fig.caption;
          h3.insertAdjacentElement("afterend", cap);
        }
      });
    })();

})();
