# Sri Manikanta MeeSeva — 3D Interactive Digital Experience

**A Telugu-first, cinematic, 3D-enabled citizen-services website designed for Sri Manikanta MeeSeva.** A modern, scroll-driven web experience that transforms government service delivery into an engaging, accessible, and visually polished journey for Telugu-speaking citizens—including rural users.

---

## Table of Contents

1. [Live Website](#live-website)
2. [GitHub Repository](#github-repository)
3. [Key Features](#key-features)
4. [Technology Stack](#technology-stack)
5. [Architecture](#architecture)
6. [Project Structure](#project-structure)
7. [How to Run Locally](#how-to-run-locally)
8. [Services Offered](#services-offered)
9. [Accessibility](#accessibility)
10. [Performance](#performance)
11. [Deployment](#deployment)

---

## Live Website

**Production URL:**

[https://sri-manikanta-meeseva.netlify.app](https://sri-manikanta-meeseva.netlify.app)

---

## GitHub Repository

**Repository:**

[https://github.com/sanelakshmidharreddy/3D-Website](https://github.com/sanelakshmidharreddy/3D-Website)

**Author:** Sanelakshmidhar Reddy — [LinkedIn](https://www.linkedin.com/in/sanelakshmidhar-reddy-943b62318)

---

## Key Features

- **Cinematic 3D Hero Experience** — Full-screen Three.js scene with orbital service cards, parallax camera, and custom cursor
- **Interactive Service Universe** — Animated service cards orbiting in 3D space with real-time mouse tracking
- **Scroll-Driven Storytelling** — GSAP ScrollTrigger orchestrates 8 seamless cinematic transitions
- **3D Document & Card Visualizations** — Physical property fly-throughs for each service category
  - Xerox / Printing / Lamination visual sequence
  - PVC card transformation animation
  - Photo printing experience
  - Certificate stack transition
  - PAN / Aadhaar / Driving Licence orbital scene
  - Ration card convergence transition
  - Special citizen services visualization
- **3D How It Works Journey** — Interactive 4-step checkpoint animation with floating 3D cards
- **Trust Section** — 3D book and document models showcasing credibility
- **Community/Citizen Section** — Premium SVG figures representing Telugu-speaking citizens
- **Final CTA Ecosystem** — Brand reveal, service discovery, and WhatsApp integration
- **Telugu Voice-Over** — Native Telugu audio narration with automatic playback
- **Floating Audio Toggle** — Single premium glassmorphism button to pause/resume voice-over
- **Responsive Mobile Experience** — Adapts to 390×844, 430×932, 500×692 viewports
- **Reduced-Motion Support** — Full `prefers-reduced-motion` compliance
- **Performance-Conscious WebGL** — DPR clamping, low-power device detection, lazy rendering
- **Telugu-First UX** — Natural, simple Telugu communication optimized for rural users

---

## Technology Stack

| Category | Technology |
|----------|-----------|
| Markup | HTML5 |
| Styling | CSS3 (CSS Variables, Glassmorphism, SVG) |
| Scripting | JavaScript (Vanilla, ES6+) |
| 3D Graphics | Three.js r128 |
| Animation | GSAP 3.12.5 |
| Scroll Control | GSAP ScrollTrigger |
| Canvas | HTML5 Canvas API |
| Audio | HTML5 Audio API |
| Hosting | Netlify |
| Version Control | Git / GitHub |
| CDN | cdnjs |

**Notable:** This is a zero-framework, dependency-light application. All logic is written in vanilla JavaScript with no build step, bundler, or transpiler required.

---

## Architecture

```
User
  ↓
HTML Structure (Semantic, Telugu-first)
  ↓
CSS Design System (14-color palette, CSS variables)
  ↓
Interaction Layer
  ↓
GSAP + ScrollTrigger
  ↓
Three.js / Canvas / WebGL
  ↓
Cinematic Service Scenes (8 transitions)
  ↓
Telugu Voice Experience
  ↓
Final CTA + Brand Reveal
```

### Core Systems

| System | Description |
|--------|-------------|
| **Utilities** (`script.js:22-30`) | Reduced-motion detection, device tiering (coarse pointer, low-power) |
| **Loader** | Animated "సిద్ధమవుతోంది..." preloader with spinner and Telugu glyph |
| **Custom Cursor** | Parallax cursor following mouse with magnetic hover effects |
| **Scroll Progress** | Top-bar scroll progress indicator |
| **Navigation** | Responsive nav with mobile toggle, scroll-state detection |
| **Hero 3D Scene** (`script.js:501+`) | Three.js scene with orbital service cards, raycasting, parallax |
| **Service Search** (`script.js:215+`) | Real-time filtering with smart Telugu search |
| **Step-by-Step Journey** | 4-step animated service flow with SVG path drawing |
| **Cinematic Transitions** (`script.js:1310+`) | 8 scroll-driven 3D transition scenes |
| **Audio System** (`script.js:1210+`) | HTML5 Audio with sessionStorage, hover-resume, floating toggle |
| **Intersection Observers** | Scroll-triggered reveals for sections |

---

## Project Structure

```text
3D-Website/
├── index.html                     # Main HTML document (529 lines)
├── styles.css                     # Design system + component styles (977 lines)
├── script.js                      # Interaction engine (2,512 lines)
├── data.js                        # Content data (services, FAQ, testimonials)
├── audio/
│   └── sri-manikanta-meeseva-telugu.mp3   # Telugu voice-over (1.7 MB)
├── .gitignore
└── README.md
```

---

## How to Run Locally

```bash
# Navigate to project directory
cd 3D-Website

# Serve locally (Python)
python -m http.server 5500

# Or with Node.js
npx serve .

# Open in browser
http://localhost:5500
```

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

- **WCAG 2.1 AA Compliant** — Contrast ratios: 9:1 (text-mid on bg-2), 4.9:1 (text-low on bg-0)
- **Keyboard Navigation** — Full tab navigation, skip links, aria-expanded for mobile menu
- **Reduced Motion** — `prefers-reduced-motion: reduce` disables all 3D animations, parallax, and transitions
- **ARIA Labels** — All interactive elements (nav toggle, back-to-top, WhatsApp, audio toggle)
- **Screen Reader Support** — Semantic HTML, aria-hidden on decorative canvases
- **Cognitive Accessibility** — Simple, clear Telugu UI for rural users

---

## Performance

- **DOM Nodes:** ~738 (lean, optimized)
- **WebGL Context:** Single Three.js renderer (no duplicate contexts)
- **DPR:** Clamped to 2× (1.5× on low-power devices)
- **Frame Rate:** 53–61 FPS (transitions), 19–32 FPS (CTA ecosystem) — hardware dependent
- **Textures:** Built on first strip visibility (lazy)
- **Animation Loop:** 5 perpetual rAF loops — each early-returns when element is off-screen
- **Audio Asset:** Single 1.7 MB MP3, preloaded via `audio.preload = "auto"`
- **Scroll Triggers:** 8 ScrollTriggers for cinematic transitions (verified, no duplicates)

---

## Deployment

This project is deployed on **Netlify** at:  
[https://sri-manikanta-meeseva.netlify.app](https://sri-manikanta-meeseva.netlify.app)

To deploy:

1. Connect the GitHub repository to Netlify
2. Set the build command to: (none required — static site)
3. Set the publish directory to: `/`

No build step is needed. The site is pure static HTML/CSS/JS.

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
