/**
 * SRI MANIKANTA MEESEVA — EXECUTIVE 3D CINEMATIC WEBGL ENGINE
 * Large Standing Indian Flag with Realistic Air Flutter Dynamics
 * Three.js 3D World (Procedural Smart Cards, Parchment Certificates, Monuments & Stardust)
 * Single Audio Instance, Live Service Search & Interactive Accordions
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
     6. HIGH-RESOLUTION PROCEDURAL TEXTURE GENERATORS
     ================================================================ */
  function createFlagCanvasTexture() {
    const c = document.createElement("canvas");
    c.width = 2048; c.height = 1280;
    const ctx = c.getContext("2d");
    const h = c.height / 3;

    // Saffron, White, Green
    ctx.fillStyle = "#ff671f"; ctx.fillRect(0, 0, c.width, h);
    ctx.fillStyle = "#ffffff"; ctx.fillRect(0, h, c.width, h);
    ctx.fillStyle = "#046a38"; ctx.fillRect(0, h * 2, c.width, h);

    // Ashoka Chakra (High-Resolution with 24 Spokes)
    const cx = c.width / 2, cy = c.height / 2, r = h * 0.42;
    ctx.strokeStyle = "#000080"; ctx.fillStyle = "#000080"; ctx.lineWidth = 12;
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx, cy, r * 0.18, 0, Math.PI * 2); ctx.fill();
    for (let i = 0; i < 24; i++) {
      const a = (i * Math.PI) / 12;
      ctx.beginPath(); ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
      ctx.stroke();
    }
    return new THREE.CanvasTexture(c);
  }

  function createPANTexture() {
    const c = document.createElement("canvas");
    c.width = 1024; c.height = 640;
    const ctx = c.getContext("2d");

    const bg = ctx.createLinearGradient(0, 0, c.width, c.height);
    bg.addColorStop(0, "#0a2540"); bg.addColorStop(0.5, "#0d3b66"); bg.addColorStop(1, "#03172b");
    ctx.fillStyle = bg; ctx.fillRect(0, 0, c.width, c.height);

    ctx.strokeStyle = "rgba(56, 189, 248, 0.6)"; ctx.lineWidth = 8;
    ctx.strokeRect(16, 16, c.width - 32, c.height - 32);

    ctx.fillStyle = "#f59e0b"; ctx.font = "bold 32px sans-serif";
    ctx.fillText("INCOME TAX DEPARTMENT • GOVT. OF INDIA", 40, 70);

    const chip = ctx.createLinearGradient(40, 110, 160, 200);
    chip.addColorStop(0, "#fbbf24"); chip.addColorStop(0.5, "#d97706"); chip.addColorStop(1, "#f59e0b");
    ctx.fillStyle = chip; ctx.fillRect(40, 110, 120, 90);
    ctx.strokeStyle = "#78350f"; ctx.lineWidth = 3;
    ctx.strokeRect(40, 110, 120, 90);

    ctx.fillStyle = "rgba(56, 189, 248, 0.25)";
    ctx.fillRect(c.width - 240, 110, 180, 220);
    ctx.strokeStyle = "#38bdf8"; ctx.strokeRect(c.width - 240, 110, 180, 220);

    ctx.fillStyle = "#f8fafc"; ctx.font = "bold 44px monospace";
    ctx.fillText("ABCDE1234F", 40, 280);
    ctx.font = "28px sans-serif"; ctx.fillStyle = "#94a3b8";
    ctx.fillText("PERMANENT ACCOUNT NUMBER CARD", 40, 330);
    ctx.fillStyle = "#ffffff"; ctx.font = "bold 30px sans-serif";
    ctx.fillText("NAME: RESIDENT CITIZEN", 40, 400);
    ctx.fillText("FATHER'S NAME: CITIZEN GUARDIAN", 40, 460);
    ctx.fillText("DOB: 01/01/1990", 40, 520);

    ctx.strokeStyle = "rgba(245, 158, 11, 0.7)"; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(c.width - 150, c.height - 150, 60, 0, Math.PI * 2); ctx.stroke();
    return new THREE.CanvasTexture(c);
  }

  function createAadhaarTexture() {
    const c = document.createElement("canvas");
    c.width = 1024; c.height = 640;
    const ctx = c.getContext("2d");

    ctx.fillStyle = "#f8fafc"; ctx.fillRect(0, 0, c.width, c.height);

    ctx.fillStyle = "#ff671f"; ctx.fillRect(0, 0, c.width, 24);
    ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 24, c.width, 24);
    ctx.fillStyle = "#046a38"; ctx.fillRect(0, 48, c.width, 24);

    ctx.fillStyle = "#030712"; ctx.font = "bold 34px sans-serif";
    ctx.fillText("భారత విశిష్ట గుర్తింపు ప్రాధికార సంస్థ (UIDAI)", 40, 125);
    ctx.font = "22px sans-serif"; ctx.fillStyle = "#64748b";
    ctx.fillText("Unique Identification Authority of India", 40, 155);

    ctx.fillStyle = "#e2e8f0"; ctx.fillRect(40, 180, 180, 220);
    ctx.strokeStyle = "#94a3b8"; ctx.lineWidth = 3; ctx.strokeRect(40, 180, 180, 220);

    ctx.fillStyle = "#030712"; ctx.fillRect(c.width - 240, 180, 200, 200);
    ctx.fillStyle = "#ffffff";
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 6; j++) {
        if ((i + j) % 2 === 0) ctx.fillRect(c.width - 230 + i * 30, 190 + j * 30, 24, 24);
      }
    }

    ctx.fillStyle = "#030712"; ctx.font = "bold 30px sans-serif";
    ctx.fillText("పేరు / Name: పౌరుడు / Citizen", 250, 240);
    ctx.font = "26px sans-serif"; ctx.fillStyle = "#334155";
    ctx.fillText("పుట్టిన తేదీ / DOB: 01/01/1990", 250, 290);
    ctx.fillText("లింగం / Gender: పురుషుడు / MALE", 250, 340);

    ctx.fillStyle = "#b91c1c"; ctx.font = "bold 52px monospace";
    ctx.fillText("XXXX  XXXX  1234", 40, 480);

    ctx.fillStyle = "#046a38"; ctx.font = "bold 28px sans-serif";
    ctx.fillText("నా ఆధార్, నా గుర్తింపు — మేరా ఆధార్, మేరీ పెహచాన్", 40, 560);
    return new THREE.CanvasTexture(c);
  }

  function createCertificateTexture() {
    const c = document.createElement("canvas");
    c.width = 800; c.height = 1100;
    const ctx = c.getContext("2d");

    ctx.fillStyle = "#fefae0"; ctx.fillRect(0, 0, c.width, c.height);

    ctx.strokeStyle = "#d97706"; ctx.lineWidth = 14;
    ctx.strokeRect(24, 24, c.width - 48, c.height - 48);
    ctx.strokeStyle = "#b45309"; ctx.lineWidth = 4;
    ctx.strokeRect(40, 40, c.width - 80, c.height - 80);

    ctx.fillStyle = "#78350f"; ctx.font = "bold 38px sans-serif"; ctx.textAlign = "center";
    ctx.fillText("ఆంధ్రప్రదేశ్ ప్రభుత్వం", c.width / 2, 110);
    ctx.font = "bold 26px sans-serif";
    ctx.fillText("GOVERNMENT OF ANDHRA PRADESH", c.width / 2, 150);
    ctx.fillStyle = "#1e3a8a"; ctx.font = "bold 34px sans-serif";
    ctx.fillText("రెవెన్యూ శాఖ — ఆదాయ & కుల ధృవీకరణ పత్రం", c.width / 2, 220);

    ctx.textAlign = "left"; ctx.fillStyle = "#1f2937"; ctx.font = "24px sans-serif";
    ctx.fillText("సర్టిఫికేట్ సంఖ్య / Application No: CGC0123456789", 70, 320);
    ctx.fillText("ఈ క్రింది వివరాలు గల దరఖాస్తుదారునికి ధృవీకరించడమైనది:", 70, 380);

    ctx.fillStyle = "#4b5563"; ctx.font = "22px sans-serif";
    for (let y = 440; y <= 760; y += 45) {
      ctx.fillRect(70, y, c.width - 140, 3);
    }

    ctx.strokeStyle = "#d97706"; ctx.lineWidth = 6;
    ctx.beginPath(); ctx.arc(160, 920, 70, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = "rgba(245, 158, 11, 0.2)"; ctx.fill();
    ctx.fillStyle = "#78350f"; ctx.font = "bold 20px sans-serif"; ctx.textAlign = "center";
    ctx.fillText("అధికారిక ముద్ర", 160, 915);
    ctx.fillText("OFFICIAL SEAL", 160, 940);

    ctx.fillStyle = "#1e40af"; ctx.font = "bold 24px sans-serif";
    ctx.fillText("డిజిటల్ సంతకం చేయబడింది", c.width - 220, 915);
    ctx.font = "18px sans-serif";
    ctx.fillText("TAHSILDAR, VELDURTHI", c.width - 220, 945);

    return new THREE.CanvasTexture(c);
  }

  function createPassbookTexture() {
    const c = document.createElement("canvas");
    c.width = 800; c.height = 1100;
    const ctx = c.getContext("2d");

    ctx.fillStyle = "#0c2340"; ctx.fillRect(0, 0, c.width, c.height);
    ctx.strokeStyle = "#fbbf24"; ctx.lineWidth = 12;
    ctx.strokeRect(30, 30, c.width - 60, c.height - 60);

    ctx.fillStyle = "#fbbf24"; ctx.textAlign = "center";
    ctx.font = "bold 44px sans-serif";
    ctx.fillText("ఆంధ్రప్రదేశ్ ప్రభుత్వం", c.width / 2, 220);

    ctx.beginPath(); ctx.arc(c.width / 2, 420, 100, 0, Math.PI * 2);
    ctx.strokeStyle = "#fbbf24"; ctx.lineWidth = 8; ctx.stroke();
    ctx.font = "bold 32px sans-serif";
    ctx.fillText("రైతు భరోసా", c.width / 2, 430);

    ctx.font = "bold 38px sans-serif";
    ctx.fillText("పట్టాదారు పాస్‌బుక్", c.width / 2, 620);
    ctx.font = "26px sans-serif"; ctx.fillStyle = "#fef08a";
    ctx.fillText("మరియు వ్యవసాయ భూమి హక్కుల రికార్డు", c.width / 2, 670);

    ctx.fillStyle = "#93c5fd"; ctx.font = "bold 28px monospace";
    ctx.fillText("ఖాతా నం. / KHATA NO: 1248", c.width / 2, 850);
    ctx.fillText("వెల్దుర్తి మండలం, కర్నూలు జిల్లా", c.width / 2, 900);
    return new THREE.CanvasTexture(c);
  }

  function createRationTexture() {
    const c = document.createElement("canvas");
    c.width = 1024; c.height = 640;
    const ctx = c.getContext("2d");

    ctx.fillStyle = "#f8fafc"; ctx.fillRect(0, 0, c.width, c.height);
    ctx.fillStyle = "#046a38"; ctx.fillRect(0, 0, c.width, 100);

    ctx.fillStyle = "#ffffff"; ctx.font = "bold 38px sans-serif";
    ctx.fillText("ఆంధ్రప్రదేశ్ పౌర సరఫరాల శాఖ — రైస్ కార్డ్", 40, 65);

    ctx.strokeStyle = "#16a34a"; ctx.lineWidth = 6;
    ctx.strokeRect(16, 16, c.width - 32, c.height - 32);

    ctx.fillStyle = "#030712"; ctx.font = "bold 30px sans-serif";
    ctx.fillText("కార్డ్ నం. / RICE CARD NO: WAP123456789", 50, 180);
    ctx.font = "24px sans-serif"; ctx.fillStyle = "#334155";
    ctx.fillText("కుటుంబ పెద్ద / Head of Family: పౌరుడు", 50, 240);
    ctx.fillText("FP షాప్ నం: 0802012 (వెల్దుర్తి)", 50, 290);
    ctx.fillText("మొత్తం సభ్యుల సంఖ్య: 04", 50, 340);

    ctx.fillStyle = "#16a34a"; ctx.fillRect(50, 400, c.width - 100, 6);
    ctx.fillStyle = "#046a38"; ctx.font = "bold 26px sans-serif";
    ctx.fillText("ప్రజా పంపిణీ వ్యవస్థ — ఆంధ్రప్రదేశ్ ప్రభుత్వం", 50, 460);
    return new THREE.CanvasTexture(c);
  }

  function createLicenseTexture() {
    const c = document.createElement("canvas");
    c.width = 1024; c.height = 640;
    const ctx = c.getContext("2d");

    ctx.fillStyle = "#0b2545"; ctx.fillRect(0, 0, c.width, c.height);
    ctx.strokeStyle = "#38bdf8"; ctx.lineWidth = 8;
    ctx.strokeRect(16, 16, c.width - 32, c.height - 32);

    ctx.fillStyle = "#38bdf8"; ctx.font = "bold 32px sans-serif";
    ctx.fillText("TRANSPORT DEPARTMENT • GOVT. OF AP", 40, 70);

    ctx.fillStyle = "#fbbf24"; ctx.fillRect(40, 110, 110, 80);

    ctx.fillStyle = "#ffffff"; ctx.font = "bold 38px monospace";
    ctx.fillText("DL NO: AP21 20240012345", 40, 260);

    ctx.font = "28px sans-serif"; ctx.fillStyle = "#cbd5e1";
    ctx.fillText("NAME: DRIVER CITIZEN", 40, 330);
    ctx.fillText("VALIDITY: NON-TRANSPORT (20 YEARS)", 40, 390);
    ctx.fillText("CLASS: MCWG, LMV (MOTOR CYCLE & CAR)", 40, 450);

    ctx.fillStyle = "rgba(56, 189, 248, 0.3)";
    ctx.fillRect(c.width - 220, 110, 170, 210);
    ctx.strokeStyle = "#38bdf8"; ctx.strokeRect(c.width - 220, 110, 170, 210);
    return new THREE.CanvasTexture(c);
  }

  /* ================================================================
     7. 3D WEBGL ENGINE (THREE.JS CINEMATIC PRIDE WORLD)
     ================================================================ */
  function init3DWebGLWorld() {
    if (typeof THREE === "undefined") return;

    const canvas = document.getElementById("webglCanvas");
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030712, 0.02);

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 12);

    // Realistic Lighting System
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
    scene.add(ambientLight);

    const saffronSun = new THREE.DirectionalLight(0xff7700, 2.0);
    saffronSun.position.set(12, 14, 10);
    scene.add(saffronSun);

    const greenBounce = new THREE.DirectionalLight(0x16a34a, 1.6);
    greenBounce.position.set(-12, -14, 8);
    scene.add(greenBounce);

    const goldGlory = new THREE.PointLight(0xfbbf24, 2.4, 40);
    goldGlory.position.set(0, 3, 10);
    scene.add(goldGlory);

    const flagSunLight = new THREE.DirectionalLight(0xfff1d6, 2.0);
    flagSunLight.position.set(6, 6, 8);
    scene.add(flagSunLight);

    // 1. BIG STANDING 3D INDIAN NATIONAL FLAG ON TALL MAST
    const flagGroup = new THREE.Group();

    // Base Pedestal
    const baseGeo = new THREE.CylinderGeometry(0.45, 0.6, 0.35, 24);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.2 });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = -3.2;
    flagGroup.add(baseMesh);

    // Tall Mast / Flagpole
    const mastHeight = 8.8;
    const flagPoleGeo = new THREE.CylinderGeometry(0.08, 0.11, mastHeight, 24);
    const flagPoleMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.95, roughness: 0.1 });
    const flagPole = new THREE.Mesh(flagPoleGeo, flagPoleMat);
    flagPole.position.y = 1.0;
    flagGroup.add(flagPole);

    // Top Golden Finial Sphere
    const finialGeo = new THREE.SphereGeometry(0.24, 24, 24);
    const finialMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.98, roughness: 0.08 });
    const finial = new THREE.Mesh(finialGeo, finialMat);
    finial.position.y = 1.0 + mastHeight / 2 + 0.15;
    flagGroup.add(finial);

    // Big Size Waving Cloth Flag (Width 6.2, Height 4.0)
    const flagW = 6.2, flagH = 4.0;
    const flagGeo = new THREE.PlaneGeometry(flagW, flagH, 54, 36);
    const flagTex = createFlagCanvasTexture();
    const flagMat = new THREE.MeshStandardMaterial({
      map: flagTex,
      side: THREE.DoubleSide,
      roughness: 0.4,
      metalness: 0.08
    });
    const flagMesh = new THREE.Mesh(flagGeo, flagMat);
    flagMesh.position.set(flagW / 2 + 0.06, 3.2, 0);
    flagGroup.add(flagMesh);

    // Position Big Standing Flag in Upper 3D Space
    flagGroup.position.set(isMobile ? 1.5 : 3.8, isMobile ? 0.2 : 0.8, -2.5);
    scene.add(flagGroup);

    // 2. 3D Floating Documents Along Vertical Scroll Path
    const docMeshes = [];

    function add3DCard(texture, w, h, x, y, z, baseRot) {
      const geo = new THREE.BoxGeometry(w, h, 0.04);
      const frontMat = new THREE.MeshStandardMaterial({ map: texture, roughness: 0.2, metalness: 0.25 });
      const edgeMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.1, metalness: 0.9 });
      const backMat = new THREE.MeshStandardMaterial({ color: 0x06142a, roughness: 0.3, metalness: 0.5 });
      const materials = [edgeMat, edgeMat, edgeMat, edgeMat, frontMat, backMat];
      const mesh = new THREE.Mesh(geo, materials);
      mesh.position.set(x, y, z);
      mesh.rotation.set(baseRot.x || 0, baseRot.y || 0, baseRot.z || 0);
      mesh.userData = {
        baseX: x, baseY: y, baseZ: z,
        rotX: baseRot.x || 0, rotY: baseRot.y || 0, rotZ: baseRot.z || 0,
        speed: baseRot.speed || 1
      };
      scene.add(mesh);
      docMeshes.push(mesh);
      return mesh;
    }

    // PAN Card at y = -4.5
    add3DCard(createPANTexture(), 3.2, 2.0, isMobile ? 1.6 : 3.2, -4.5, 0, { x: 0.1, y: -0.25, z: 0.15, speed: 1.2 });
    // Aadhaar Card at y = -10.5
    add3DCard(createAadhaarTexture(), 3.2, 2.0, isMobile ? -1.6 : -3.2, -10.5, 0.5, { x: -0.12, y: 0.28, z: -0.1, speed: 1.1 });
    // AP Certificate at y = -16.5
    add3DCard(createCertificateTexture(), 2.5, 3.4, isMobile ? 1.5 : 3.0, -16.5, -0.5, { x: 0.15, y: -0.2, z: 0.08, speed: 1.3 });
    // Driving License at y = -22.5
    add3DCard(createLicenseTexture(), 3.2, 2.0, isMobile ? -1.5 : -3.0, -22.5, 0.2, { x: -0.1, y: 0.25, z: -0.15, speed: 1.0 });
    // Pattadar Passbook at y = -28.5
    add3DCard(createPassbookTexture(), 2.5, 3.4, isMobile ? 1.5 : 3.0, -28.5, -0.3, { x: 0.12, y: -0.22, z: 0.12, speed: 1.2 });
    // Rice Card at y = -34.5
    add3DCard(createRationTexture(), 3.2, 2.0, isMobile ? -1.5 : -2.8, -34.5, 0.4, { x: -0.15, y: 0.2, z: -0.08, speed: 1.1 });

    // 3. 3D Architectural Monuments in Deep 3D Space (z = -18 to -25)
    const parliamentGroup = new THREE.Group();
    const domeGeo = new THREE.SphereGeometry(2.2, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.5);
    const monMat = new THREE.MeshStandardMaterial({ color: 0x0c274c, wireframe: true, transparent: true, opacity: 0.45 });
    const dome = new THREE.Mesh(domeGeo, monMat);
    dome.position.y = 1.2;
    parliamentGroup.add(dome);

    const baseColGeo = new THREE.CylinderGeometry(4.2, 4.4, 1.8, 28);
    const baseCol = new THREE.Mesh(baseColGeo, monMat);
    parliamentGroup.add(baseCol);
    parliamentGroup.position.set(-6, -11, -18);
    scene.add(parliamentGroup);

    const fortGroup = new THREE.Group();
    const towerGeo = new THREE.CylinderGeometry(2.4, 2.8, 4.0, 16);
    const fortMat = new THREE.MeshStandardMaterial({ color: 0x1e3a5f, wireframe: true, transparent: true, opacity: 0.4 });
    const tower = new THREE.Mesh(towerGeo, fortMat);
    fortGroup.add(tower);
    fortGroup.position.set(6, -27, -18);
    scene.add(fortGroup);

    // 4. 3D Floating Golden Stardust & Tricolor Particles
    const particleCount = 500;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const cSaffron = new THREE.Color(0xff671f);
    const cWhite = new THREE.Color(0xffffff);
    const cGreen = new THREE.Color(0x16a34a);
    const cGold = new THREE.Color(0xfbbf24);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 26;
      positions[i * 3 + 1] = Math.random() * -45 + 5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 16;

      const r = Math.random();
      const col = r < 0.35 ? cSaffron : r < 0.65 ? cGold : r < 0.85 ? cGreen : cWhite;
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: isMobile ? 0.08 : 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // Scroll & Mouse Tracking
    let targetCameraY = 0;
    let mouseX = 0, mouseY = 0, targetMouseX = 0, targetMouseY = 0;
    let time = 0;

    window.addEventListener("scroll", () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
      targetCameraY = -progress * 38;
    }, { passive: true });

    if (!isMobile) {
      window.addEventListener("mousemove", (e) => {
        targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
      });
    }

    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // 60 FPS Render Loop with True Air Wind Flutter Physics
    function animate() {
      requestAnimationFrame(animate);

      if (!prefersReducedMotion) time += 0.032;

      // Smooth Camera Glide
      camera.position.y += (targetCameraY - camera.position.y) * 0.06;
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      camera.rotation.x = -mouseY * 0.06;
      camera.rotation.y = -mouseX * 0.08;

      // Big Flag True Air Wind Flutter Vertex Simulation
      const posAttr = flagGeo.attributes.position;
      for (let i = 0; i < posAttr.count; i++) {
        const vx = posAttr.getX(i);
        const vy = posAttr.getY(i);
        const normX = (vx + flagW / 2) / flagW; // 0 at mast, 1 at free tip
        const wave = Math.sin(normX * 3.2 - time * 3.6) * 0.44 * Math.pow(normX, 1.15) +
                     Math.cos(vy * 2.2 - time * 2.5) * 0.14 * normX +
                     Math.sin((normX + vy * 0.3) * 4.0 - time * 4.2) * 0.08 * normX;
        posAttr.setZ(i, wave);
      }
      posAttr.needsUpdate = true;
      flagGeo.computeVertexNormals();

      // 3D Floating Documents Sway & Float
      docMeshes.forEach((mesh, idx) => {
        const u = mesh.userData;
        const floatY = Math.sin(time * 1.2 + idx) * 0.15;
        mesh.position.y = u.baseY + floatY;
        mesh.rotation.x = u.rotX + Math.sin(time + idx) * 0.05 - mouseY * 0.1;
        mesh.rotation.y = u.rotY + Math.cos(time * 0.8 + idx) * 0.08 + mouseX * 0.15;
        mesh.rotation.z = u.rotZ + Math.sin(time * 0.6 + idx) * 0.04;
      });

      // Monuments Slow Rotation
      parliamentGroup.rotation.y = time * 0.1;
      fortGroup.rotation.y = -time * 0.08;

      // Stardust Drift
      particleSystem.rotation.y = time * 0.02;

      renderer.render(scene, camera);
    }

    animate();
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
    init3DWebGLWorld();
    initReveals();
  });

})();