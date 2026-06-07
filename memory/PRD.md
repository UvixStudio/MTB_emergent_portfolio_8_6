# PRD — "Yuval's Journey" · Yuval Cohen Portfolio

## Original Problem Statement
Premium one-page portfolio for **Yuval Cohen — Creative Technologist, Creative Director & Producer (AI & 3D)**. Concept: a cinematic low-poly mountain-biking metaphor ("Yuval's Journey") where a 241-frame pre-rendered MTB ride is scrubbed to scroll, and each career milestone is a station along the trail. Tech: React + Tailwind + Framer Motion + Lenis. Gamified, smooth, low-poly mood (not hyper-real). Balanced palette: dark navy base + yellow brand accent + 4 checkpoint colors (yellow/purple/cyan/green).

## User Personas
- **Recruiters / hiring managers / brands** evaluating Yuval as a senior creative leader — need a "wow", professional, clear showcase of skills, experience and projects.

## Architecture (done)
- **Frontend-only** (React, no backend). Contact via modal that builds a `mailto:` to yuval@uvixstudio.com (popup-blocker safe). CV served as static `/Yuval-Cohen-CV.pdf`.
- 241 ride frames in `/public/ride/`, project images in `/public/projects/`, pedal/shoe icons in `/public/icons/`.
- Fonts: Unbounded (display) + Manrope (body). Design tokens in `index.css` + `tailwind.config.js`.

## Implemented (2026-06-07)
- **Cinematic Ride**: sticky canvas, 241 frames scrubbed across a 560vh scroll; hero overlay + 4 reveal checkpoint cards.
- **Hero**: "Hi! I'm Yuval Cohen", slot-machine rotating roles, tagline, **Download CV** + **Let's Talk** CTAs, animated "Let's Ride!" pedal SVG.
- **Floating Journey panel** (desktop) with flags, fill track + wireframe mountain progress; slim top progress bar on mobile.
- **About** (bio, quote, animated stat count-ups, 5 capability nodes), **Experience** (4 milestone stations on a trail line), **AI & Innovation / Tools** (dual marquees of real tools), **Selected Works** (asymmetric bento, 9 real projects, hover reveal), **Connect** (campfire CTA + contact modal).
- All content pulled from CV + portfolio deck (real roles, projects, tools, contact). Responsive desktop + mobile. Lint clean; testing agent: 100% of critical flows, no runtime/console errors.

## Backlog / Next
- **P1**: Replace placeholder project visuals (Beit Ha'Gefen, Digitel TLV, Ten Li Rock'n'Roll, Baboon of Jafa, RPSLS) with real assets when user shares them; add per-project detail/lightbox.
- **P1**: Real logo wall of collaborated companies/clients (Amazon, LEGO, New York Lottery, Playtech, Amdocs, Kaltura…).
- **P2**: Optional working contact form via backend/email (currently mailto). Add OG/meta + favicon, sitemap, analytics goals.
- **P2**: Further tune scroll-frame sync points and add subtle parallax/dust particles in hero.

## Notes
- Contact is **mailto-based (no backend email send)** by design choice.
