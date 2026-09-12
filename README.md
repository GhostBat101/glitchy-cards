# Glitchy Cards — Experimental Laboratory

[![Deploy to GitHub Pages](https://github.com/GhostBat101/glitchy-cards/actions/workflows/deploy.yml/badge.svg)](https://github.com/GhostBat101/glitchy-cards/actions/workflows/deploy.yml)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![GSAP](https://img.shields.io/badge/GSAP-3.12-88CE02?logo=greensock&logoColor=white)](https://greensock.com/gsap/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

An experimental frontend laboratory showcasing high-fidelity, interactive, and visually striking glitch card components built with modern web technologies: React, Tailwind CSS, and GreenSock (GSAP).

---

## ⚡ Live Showcase

Experience the interactive cards directly in your browser:  
👉 **[https://ghostbat101.github.io/glitchy-cards/](https://ghostbat101.github.io/glitchy-cards/)**

---

## 🎴 The Card Deck

The showcase features a unified deck architecture allowing instant switching between distinct retro-futuristic and digital decay aesthetics:

### 1. Corrupted AI Core // Optical CD Artifact *(Active)*
A physical and digital hybrid merging an iridescent optical compact disc with a cybernetic neural singularity:
* **Optical Rainbow Diffraction:** A 9-stop spectral gradient (`#ff007f`, `#00f6ff`, `#39ff14`, `#ffb703`, `#a855f7`) rendered via CSS conical gradients and `mix-blend-mode: color-dodge` to simulate physical thin-film optical wave interference.
* **Real-time Azimuth Vector Tracking:** Specular reflections dynamically recalculate light angles from pointer coordinates relative to the disc hub.
* **Concentric Data Micro-Grooves:** High-density repeating radial patterns demarcating lead-in, data track, and clamping ring zones.
* **Pulsing Neural Core:** Central hub featuring dual counter-rotating servo collars, biometric SVG ring animations, and a synchronized quantum photon emitter.
* **GSAP 3D Spring Physics:** Perspective card tilt powered by `gsap.quickTo` for smooth 60fps tracking without pointer lag.
* **Laser-Jump Servo Crash:** Triggered via hover, click, or manual dock command:
  * 7-cycle displacement shake with neon strobe flare.
  * Mechanical spindle recoil (`±180deg`) with elastic spring physics.
  * Triple horizontal slice tear masks (`clip-path: polygon(...)`) with RGB channel separation.
  * Live 60ms hex register scramble and progressive data integrity degradation.

### 2. Cyberpunk HUD Matrix *(Upcoming in Phase 2)*
Tactical cybernetic interface with chamfered geometry, real-time binary/hex stream decoders, and matrix rain slice offsets.

### 3. Retro CRT // VHS Decay *(Upcoming in Phase 3)*
Analog phosphor television decay featuring magnetic tube barrel distortion, horizontal tracking noise bursts, and V-hold vertical roll artifacts.

---

## 🕹️ Interactive Controls

The floating glass dock at the base of the viewport allows real-time manipulation of the active card:
* **Style Switcher:** Seamlessly navigate between the cards in the deck.
* **Glitch Intensity Dial:** Modulate error severity (`Low`, `Med`, `Critical`).
* **Spindle Drive Toggle:** Pause or spin the optical disc drive mechanism.
* **`[ FORCE READ ERROR ]`:** Manually fire the laser-jump crash sequence and trigger hardware telemetry degradation.

---

## 📐 Strict Architectural Principles

This codebase is crafted under rigid human-readability and maintainability guidelines:
1. **Zero In-Code Comments Policy:** The code body is completely free of inline (`//`) and multi-line (`/* */`) comments. A single concise header comment at the top of each file documents its role and external communication targets.
2. **Strict Vertical Hierarchy:** State hooks, refs, and constants are strictly grouped at the top of the component scope immediately following imports. No declarations are scattered.
3. **Hardware Accelerated Motion:** GSAP `quickTo` and CSS transforms animate exclusively on composited GPU layers for sustained 60fps performance.

---

## 🚀 Getting Started

### Prerequisites
* **Node.js**: `v18.0.0` or later
* **npm**: `v9.0.0` or later

### Installation
```bash
# Clone the repository
git clone https://github.com/GhostBat101/glitchy-cards.git

# Navigate to project directory
cd glitchy-cards

# Install dependencies
npm install
```

### Development
Start the local development server with Hot Module Replacement (HMR):
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
Compile and bundle the project for production:
```bash
npm run build
```
Preview the production build locally:
```bash
npm run preview
```

---

## 🛠️ Tech Stack

* **Core:** [React 18](https://react.dev/), [Vite](https://vitejs.dev/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/), [PostCSS](https://postcss.org/), [Autoprefixer](https://github.com/postcss/autoprefixer)
* **Animation & Motion:** [GSAP 3](https://greensock.com/gsap/) (`quickTo`, timelines, elastic easing)
* **Iconography:** [Lucide React](https://lucide.dev/)
* **Deployment:** [GitHub Pages](https://pages.github.com/) via [GitHub Actions](https://github.com/features/actions)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
