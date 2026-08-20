# Sri Manikanta MeeSeva — 3D Interactive Digital Experience

A Telugu-first, cinematic, 3D-enabled citizen-services website delivering government services through scroll-driven storytelling and real-time WebGL visuals.

---

## Table of Contents

- [Live Website](#live-website)
- [GitHub Repository](#github-repository)
- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [How to Run Locally](#how-to-run-locally)
- [Services Offered](#services-offered)
- [Accessibility](#accessibility)
- [Performance](#performance)
- [Deployment](#deployment)
- [Contact](#contact)

---

## Live Website

**Production URL:**

[https://sri-manikanta-meeseva.netlify.app](https://sri-manikanta-meeseva.netlify.app)

---

## GitHub Repository

**Repository:**

[https://github.com/sanelakshmidharreddy/3D-Website](https://github.com/sanelakshmindharreddy/3D-Website)

**Author:** Sanelakshmidhar Reddy — [LinkedIn](https://www.linkedin.com/in/sanelakshmidhar-reddy-943b62318)

---

## Project Overview

Sri Manikanta MeeSeva is a citizen-services portal based in Veldurthi, Andhra Pradesh. This website transforms the traditional government service directory into an immersive, cinematic experience that guides Telugu-speaking citizens through available services using 3D visualizations, scroll-driven animations, and native Telugu voice narration.

The website was built from the ground up as a vanilla JavaScript, zero-framework application. Every interaction is driven by native browser APIs combined with Three.js for 3D rendering and GSAP for precise scroll orchestration.

The target audience includes Telugu-speaking citizens, especially rural users, so the UX prioritizes clarity, simple Telugu communication, large touch targets, and low-friction service discovery.

---

## Key Features

### Visual Experience

- **Cinematic 3D Hero** — Full-screen Three.js scene with orbital service cards, parallax camera, and custom cursor
- **Interactive Service Universe** — Service cards orbit in 3D space with real-time mouse tracking and depth parallax
- **Scroll-Driven Storytelling** — 8 seamless cinematic transitions orchestrated by GSAP ScrollTrigger
- **3D Document/Card Visualizations** — Physical property fly-throughs for each service category
- **Service-Specific Animations**
  - Xerox / Printing visual sequence with paper feed simulation
  - Lamination gloss layer with light sweep
  - PVC card extrusion and embossing transformation
  - Photo printing experience with floating prints
  - Certificate stack reveal with camera travel
  - PAN / Aadhaar / Driving Licence orbital card transition
  - Ration card convergence animation
  - Special citizen services ring visualization
- **3D How It Works Journey** — Interactive 4-step glow path with floating checkpoint cards
- **Trust Section** — 3D book and document models showcasing credibility
- **Community/Citizen Section** — Premium SVG figures representing Telugu-speaking citizens
- **Final CTA Ecosystem** — Service discovery grid with brand reveal
- **Brand Reveal** — IntersectionObserver-triggered animation as user scrolls into the footer

### Audio Experience

- **Telugu Voice-Over** — Native Telugu audio narration using HTML5 Audio
- **Automatic Playback** — Audio autoplays on site load with sessionStorage session guard
- **Floating Audio Control** — Single premium glassmorphism button to pause/resume voice-over without restarting
- **Keyboard Accessible** — Button supports Space/Enter key activation

### Mobile & Accessibility

- **Responsive Mobile Experience** — Optimized for 390×844, 430×932, 500×692 viewports
- **Reduced-Motion Support** — `prefers-reduced-motion: reduce` disables all animations
- **Safe Area Support** — CSS `env(safe-area-inset-*)` handles mobile browser UI and notch
- **WebGL Fallback** — Graceful degradation to themed CSS backgrounds when WebGL fails
- **Touch Targets** — Minimum 44px touch targets for one-handed use

---

## Technology Stack

| Category | Technology |
|----------|-----------|
| Markup | HTML5 (semantic, Telugu-first) |
| Styling | CSS3, CSS Variables, Glassmorphism, SVG |
| Scripting | JavaScript (Vanilla, ES6+, IIFE modules) |
| 3D Graphics | Three.js r128 (via CDN) |
| Animation | GSAP 3.12.5 (via CDN) |
| Scroll Engine | GSAP ScrollTrigger (via CDN) |
| Rendering | WebGL 1.0 via Canvas API |
| Audio | HTML5 Audio API |
| Hosting | Netlify |
| Version Control | Git / GitHub |

**No frameworks, build tools, or bundlers.** The entire site runs directly from static files.

---

## Architecture

```
User Scroller
     ↓
HTML Structure (Semantic Sections)
     ↓
CSS Design System (14-color palette, glassmorphism)
     ↓
Interaction Layer (Custom cursor, scroll progress, nav)
     ↓
GSAP + ScrollTrigger (8 cinematic transitions)
     ↓
Three.js / Canvas / WebGL (7 canvas scenes)
     ↓
Cinematic Service Scenes (Xerox → Lamination → PVC → Photo → ...)
     ↓
Telugu Voice Experience (HTML5 Audio with session guard)
     ↓
Final CTA Ecosystem + Brand Reveal
```

### JavaScript Modules

| Module | Location | Description |
|--------|----------|-------------|
| Utilities | `script.js:22-30` | Device detection, reduced-motion check, low-power tiering |
| Loader | `script.js:33-56` | Animated preloader with Telugu text |
| Cursor | `script.js:49-71` | Custom parallax cursor with hide-on-leave |
| Navigation | `script.js:95-110` | Scroll-state nav, mobile drawer toggle |
| Hero 3D Scene | `script.js:501-600` | Three.js orbital service universe |
| Cinematic Scenes | `script.js:655-960` | 8 cinema-canvas scene renderers with IntersectionObserver |
| Telugu Voice | `script.js:1210-1299` | Audio system with sessionStorage, autoplay fallback |
| Audio Toggle | `script.js:1315-1480` | Floating pause/resume control |
| Cinematic Transitions | `script.js:1480-2100+` | ScrollTrigger-driven transition engine |
| Journey Engine | `script.js:956-1095` | 3D How-It-Works path with Canvas 2D particles |
| CTA Ecosystem | `script.js:2370-2560+` | Final CTA with brand reveal animation |

---

## Project Structure

```text
3D-Website/
├── index.html                    # 529-line entry point (semantic HTML, schema.org JSON-LD)
├── styles.css                    # 977-line design system (CSS variables, glassmorphism, responsive)
├── script.js                     # 2,552-line interaction engine (no frameworks)
├── data.js                       # 14,524-byte content module (services, FAQ, testimonials, Telugu content)
├── audio/
│   └── sri-manikanta-meeseva-telugu.mp3   # 1.7 MB native Telugu voice-over
├── .gitignore
└── README.md
```

---

## How to Run Locally

```bash
git clone https://github.com/sanelakshmidharreddy/3D-Website.git
cd 3D-Website
python -m http.server 5500
```

Open `http://localhost:5500` in Chrome or Firefox for the full experience.

---

## Services Offered

### Xerox, Printing & Lamination
- Black & Color Xerox
- Photo Printing
- All Size Lamination
- PVC Card Printing
- Document Printing Services

### Government Certificate Services
- Income Certificate
- Caste Certificate
- OBC / EWS Certificate
- Agriculture Income Certificate
- Legal Heir Certificate
- Adangal / 1B
- Passbook Mutation
- E-Passbook Services

### PAN, Aadhaar & Licence Services
- New PAN Card Apply
- PAN Card Corrections
- Aadhaar Related Works
- Driving Licence Services

### Rice Card / Ration Card Services
- New Rice Card Apply
- Member Addition
- Member Deletion
- Splitting / Migration
- Rice Card Transfer
- Rice Card Surrender

### Special Citizen Services
- Senior Citizen Card
- UDID Card Apply
- Non-Judicial Stamp Papers
- E-Stamp Services

---

## Accessibility

- **Contrast Ratios:** 9:1 (primary text on background), 4.9:1 (secondary) — both pass WCAG AA
- **Keyboard Navigation:** Full tab order, skip links, `aria-expanded` on mobile menu
- **Reduced Motion:** `prefers-reduced-motion` disables all animations, parallax, and 3D transitions
- **Screen Readers:** Semantic HTML, `aria-hidden` on decorative canvases, `aria-label` on all controls
- **Cognitive Accessibility:** Simple Telugu UI, large service cards, clear service categories

---

## Performance

- **DOM Nodes:** ~738 (lean)
- **WebGL Contexts:** 7 canvases (hero, printer, trans, journey, how, cta + 8 cinema scenes sharing one renderer)
- **DPR Handling:** Clamped to 2× desktop / 1.5× low-power / 1.2× cinema / 1.8× how & CTA
- **Frame Rate:** 53–61 FPS (transitions), 19–32 FPS (CTA ecosystem) on software rendering
- **Textures:** Built lazily on first visibility (IntersectionObserver)
- **Audio Asset:** Single 1.7 MB MP3, preloaded via `audio.preload = "auto"`
- **Scroll Triggers:** 8 ScrollTriggers (no duplicates)
- **Animation Loops:** 5 perpetual rAF loops — each early-returns when element is off-screen
- **Device Tiering:** `isLowPower` flag reduces particle counts and geometry complexity on low-end devices

---

## Deployment

**Hosting:** Netlify  
**Build:** Static site — no build step required  
**CDN Dependencies:** Three.js, GSAP, ScrollTrigger (loaded from cdnjs)

The Netlify "Powered by" badge is positioned in the bottom-right corner. Website floating controls (WhatsApp button, back-to-top) are offset with `env(safe-area-inset-bottom)` to avoid overlap on mobile devices.

---

## Contact

**Sri Manikanta MeeSeva**  
Railway Station Road, Veldurthi  
Andhra Pradesh, India  
📞 8985 100 777  
💬 [WhatsApp](https://wa.me/918985100777)  
🌐 [sri-manikanta-meeseva.netlify.app](https://sri-manikanta-meeseva.netlify.app)

---

*Made with ❤️ for the citizens of Veldurthi and beyond.*
