# MTB Portfolio — Action Plan & Checklist

Living checklist. Branch: `skills_sections`. Run: `cd frontend && yarn start` → http://localhost:3000
Legend: ✅ done · �'in progress · ⬜ todo · 💤 backlog (post-launch)

> **Goal:** ship a polished, immersive, desktop-first (mobile-aware) v1 that feels like a
> high-craft portfolio — not a generic AI site. Quick scan for the impatient, depth for the
> curious. Defer all real-3D / AR to post-launch.

---

## P0 — Main page "I can live with"
- ✅ Hero: scroll-scrubbed cinematic video (control + scroll-back)
- ✅ Skill stations: clip-on-enter + game HUD + timed collectable → persistent Power-up HUD
- ✅ Removed Emergent badge + PostHog tracking
- ✅ Mobile hero layout (texts / rider centered / CTA)
- ✅ Design tokens + ChamferButton + RotatingRoles typewriter
- ⬜ De-AI pass: kill leftover "AI-site" pills, tighten typography to the design system
- ⬜ Smooth the dark gaps / rhythm between skill stations
- ⬜ Section-reveal polish (consistent scroll-in "in chunks")
- ⬜ Mobile pass on stations + new sections

## P1 — Projects (the wow)
- ✅ Real PROJECTS data model from the deck (+ categories, Beit Hagefen full case study)
- ✅ Projects gallery: floating 3D-tilt cards over the mountain backdrop + category filter
- ✅ Project case-study MODAL (uniform Brief→…→Result), Beit Hagefen flagship
- ⬜ Real thumbnails for: Beit Hagefen, Digitel TLV, Ten Li Rock'n'Roll, Baboon (curate from staging)
- ⬜ "View all projects" → dedicated all-works page (currently opens contact as stub)
- ⬜ Per-project mini-trail "progress" motif (stages, not fake metrics)

## P2 — Closing flow
- ✅ Testimonials section (LinkedIn recs: Meni Shukrun, Ronnie Noy)
- ✅ Closing strip "The Journey Continues" + CTA
- ⬜ Drop Yuval's rider cutout (no sky) into the closing strip slot
- ⬜ Workshop: a main tile → inner gallery of code/MCP projects (MCP→Unity, DaVinci, invoices VAT tool, sprite-sheets)

## Assets
- ✅ Raw material moved OUT of repo → `…\dataset\#Dev\assets\projects\` (staging)
- ✅ `public/projects/` holds only curated thumbnails
- ✅ Mountain scene at `public/projects/_scene/` (mountain.png + mountain-wire.jpeg)
- ⬜ Curate real thumbnails from staging into `public/projects/`

## Backlog (post-launch) 💤
- 💤 3D mountain from the wireframe model → rider moves/rotates along the actual trail
- 💤 AR-glasses "Planner / Big Picture" station (deferred; maybe an internal skills section)
- 💤 Topaz upscale of the hero video → re-encode all-keyframe, swap `/ride.mp4`
- 💤 Per-station bespoke clips (river ready; bridge + group ride to come)
- 💤 Hover-to-play video on project cards

## Dev tooling
- ✅ DevViewport responsive preview (toolbar + Ctrl+0), auto-off in production
- Tools in use: framer-motion, ui-ux-pro-max, 21st.dev (magic), Freepik image MCP
