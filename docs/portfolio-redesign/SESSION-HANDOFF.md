# Session Handoff — MTB Portfolio Facelift

Purpose: paste this file's path into a new session's first message so work continues without replaying full history.

## Repo / Ports
- Repo: `C:\Ai\Mtb_portfolio` (git remote: `UvixStudio/MTB_emergent_portfolio_8_6.git`)
- Current branch: `route_gallery`
- Other branches: `mtb-gallery` (local+remote), `codex/project-trail-gallery-lab` (remote)
- Production: branch `main` → auto-deploys Vercel → https://mtb-emergent-portfolio-8-6.vercel.app
- Local dev: port **3002** (current, live, "AI slop" baseline to compare against)
- Plan: new port **3003** on a new branch for the facelift attempt (not created yet)
- Run: `cd frontend && PORT=3002 yarn start` (or 3003)

## Source-of-truth docs (already written, DO NOT duplicate)
- `docs/portfolio-redesign/facelift redesign/homepage-v1-full-implementation-prd.en.md` — **canonical PRD**, 824 lines, full section specs + copy + phases + acceptance criteria
- `docs/portfolio-redesign/facelift redesign/homepage-v1-improvement-prd.en.md` — near-duplicate/earlier draft, candidate for archiving
- `docs/portfolio-redesign/facelift redesign/reference-assets-inventory.en.md` — reference folder map + candidate project thumbnails
- `docs/portfolio-redesign/mtb-portfolio-design-prd.he.md` — earlier Hebrew PRD (superseded by the English full PRD but still useful context)
- `docs/portfolio-redesign/visual-reference-analysis.he.md` — visual DNA notes from Magnific drafts
- `docs/portfolio-redesign/site-copy/*.md` — real copy extraction per section (hero, journey-panel, stations, about, tools, gallery-projects, testimonials-connect)
- `docs/portfolio-redesign/reference-previews/` — curated reference images (subfolders: gallery/magnific facelift [strongest gallery refs], projects [candidate thumbnails], about me, Innovation_workshop section, bottom footer section, 3d env style, mtb biker_me)

## Vision (one paragraph)
Not a portfolio site — a personal world. Visitor rides through Yuval's career instead of browsing pages. Every project = destination, every milestone = checkpoint, every section = part of the trail. Premium stylized low-poly 3D game-world feel (not photorealistic, not cartoon), playful-not-childish, professional-not-corporate, immersive-not-distracting. Full English vision text (the "atoms_ai" brief) is in `docs/portfolio-redesign/atoms_ai_pasted-text.txt`.

## Gap-check done on `route_gallery` (as of this session)
Current `Portfolio.jsx` order: JourneyPanel → PowerupHUD → CinematicRide/Hero → StationClip×3 (river/bridge/group-ride) → TrailDivider "About Me" → About → TrailDivider "AI & Innovation" → Tools → TrailDivider "Selected Works" → TrailViewportGallery → Testimonials → Connect → ContactModal.

| PRD Phase | Status |
|---|---|
| 1A World Continuity (`AmbientAtmosphere`/`TerrainDivider`/`ParallaxTerrain`) | ❌ Not built. Only `CinematicRide.jsx` has a hero→station handoff (`isHandoff`/scrim) already implemented. There's an unrelated `ThreeTerrainGallery.jsx` file — role unchecked. |
| 1B Section Reframing | ⚠️ Partial — `TrailDivider` still says "About Me" / "AI & Innovation" / "Selected Works", not "Rider Profile" / "Yuval's Workshop" / "Project Ridge" |
| 1C Gallery (`TrailViewportGallery.jsx`, 488 lines) | ⚠️ Substantial but unreviewed in detail this session |
| Project thumbnails in `content.js` | ❌ 4/8 still `null`: Beit Ha'Gefen, Digitel TLV, Ten Li Rock'n'Roll, Baboon of Jafa. Candidates exist in `reference-previews/projects/` (baboon.jpeg, pool/promee-like, phone/digitel-like, skeleton/bonebash-style) — need visual confirmation before wiring, per `reference-assets-inventory.en.md` |

## Agreed plan (5 moves, in priority order)
1. Real thumbnails for all 8 projects (confirm candidates → copy into `public/projects/` → wire in `content.js`)
2. Color-temperature zones per section (cold summit → warm valley → night) instead of uniform blue
3. `TerrainDivider` + `ParallaxTerrain` between sections (replace black gaps)
4. Section reveal rhythm + typographic variation (kill uniform-uppercase "AI slop" feel)
5. Gallery: route axis + single active viewpoint + prev/next depth (biggest, do last), per `reference-previews/gallery/magnific facelift/`

Tools available: Freepik/Magnific MCP (connected, costs credits — always state model/size/prompt/cost before generating), 21st.dev "magic" MCP (component inspiration/builder), hallmark anti-slop skill (`.codex/skills/hallmark/references`), framer-motion, ui-ux-pro-max skill.

## Working rules established this session
- Caveman mode active (terse replies) — user is token-constrained
- **No code line without explicit user approval** — propose, wait for "yes", then edit
- Show progress via screenshots (playwright) after each meaningful change, not just describe
- Don't touch `main`/Vercel until user explicitly approves push
- Don't duplicate existing PRDs — the full PRD above is canonical, extend/reference it, don't rewrite
- Reply in Hebrew when user writes Hebrew

## Immediate next step (was about to start when session ended)
User asked to see a fast, clearly-better homepage direction. Agreed approach: new branch off `route_gallery` (or `mtb-gallery`) → port 3003 → implement moves 2+3+4 first (continuity/atmosphere/rhythm, cheaper) → screenshot comparison vs 3002 → then move 1 (thumbnails) and move 5 (gallery, biggest) after approval.

## Session 2026-07-05 — Reference deep-dive conclusions (all reference folders scanned)

### Approved strategy: "skeleton pass" — one full-page visual pass, NOT section-by-section
User approved: branch `facelift-v1` off `route_gallery`, port 3003. One pass over the whole page (moves 2+3+4: color-temperature zones, TerrainDivider/parallax between sections, typographic rhythm). Hero video scrubbing STAYS — only fix the rotating hero texts that stay stuck/overlapping during scroll, and add hero→station-01 visual bridge. Gallery + thumbnails NOT in this pass (after skeleton approval). Use hallmark skill (anti-slop) as framework + ui-ux-pro-max for type/color decisions.

### Gallery concept — CONFIRMED understanding (Figma node 130-349 = `inifiate map camera route.png`)
NOT cards with a decorative route line. It is ONE huge continuous topographic map (contour lines + glowing yellow zigzag route) with a "camera" that pans/zooms along the route in sync with scroll. Each project = a different crop/viewpoint of the SAME map, pin + call-out card (index/year + name) + "FOR MORE PROJECTS" CTA. Neighbor projects visible as smaller thumbnails on the same map (user's Hebrew annotation on the artboard says exactly this: paste-inside canvas, camera moves, active project enlarged, others small).
Key refs in `reference-previews/gallery/magnific facelift/route/`:
- `magnific__a-premium-ui-design...93804.png` (Digitel tlv) — STRONGEST: one map, multiple numbered hex waypoints visible simultaneously, active #2 enlarged, left card w/ real screenshots, compass, dot-rail.
- `ry section not bad _02.png` (Ride Beyond) — left card structure: index, tags, title, desc, 3 support thumbnails, tool-tags, VIEW PROJECT, bottom "03/08" progress dashes (8 = matches real project count).
- `more projects.png` — gallery end-state screen: straight route + ticks + chamfered "FOR MORE PROJECTS" + HUD chrome ("[04]", crosshairs, THANK YOU FOR SCROLLING).
- Simpler fallback pattern exists in `recent home pages refs/magnific_a-highfidelity-vertical...` — staggered cards joined by thin zigzag line (cheaper to build, less wow).
Decision: rebuild `TrailViewportGallery` around 93804 pattern (#5) + card structure from _02 (#3). Not patching current version.
- `current site referemce.png` = stacked repeated "SELECTED WORKS" blocks + photoreal rider — REJECTED direction, kept only as anti-pattern.

### Visual style anchors
- `mtb biker_me/me fixed 03.png` — CHARACTER SHEET (front/back/¾) of stylized low-poly Yuval rider avatar: blue helmet, purple visor glasses, black floral/smiley jersey, yellow shoes, blue hydration pack. This is THE character for hero/stations/rider-profile. NOT the photoreal rider.
- `3d env style/cliff mtb route.png` — trail with colored checkpoint flags (yellow/green/cyan/purple) = maps 1:1 to existing accent tokens.
- `3d env style/` topdown winding trail images — terrain DNA for gallery map + parallax layers.
- `Innovation_workshop section/` (2 ChatGPT images + magnific) — workshop = stylized garage: bike on stand, BIKE UPGRADE WORKFLOW before/after screens, AI PIPELINE nodes (Research→Generate→Refine→Upscale→Deliver), real tool logos on shelves (Magnific, Topaz, Hunyuan 3D, Figma, DaVinci, Unity, Adobe CC, Claude Code easter egg). Confirms PRD 10.5.
- `recent home pages refs/magnific_a-highfidelity-vertical...` — has literal "01 RIDER PROFILE" section labeling (confirms About reframe) + skills bars + stats row.

### Project thumbnail mapping (move 1) — candidates in `reference-previews/projects/`
| Project | File | Confidence |
|---|---|---|
| Baboon of Jafa | `baboon.jpeg` (baboon in leather jacket on motorcycle) | exact |
| Ten Li Rock'n'Roll | `23383` (illustrated guitarist on cliff) | exact |
| Promee | `23384` (woman singing + PROmee logo) | exact |
| Bone Bash / Next Big Bang in 3D | `23379` (Bone Bash key art) | exact |
| Digitel TLV | `23382` (pool with inflatable Hebrew letters) | strong |
| CoderZ | `23381` (Yuval in CoderZ League broadcast studio) | strong |
| Paymax | `23380` (hand holding phone, AR football game) | plausible |
| Beit Ha'Gefen | — NO candidate. Need real installation photo from user or approved generation | missing |
(Beit Hagefen villa-with-pool thumb in recent home pages ref = WRONG project, do not use.)

### NEXT SESSION — build PortfolioV2 (APPROVED, start immediately)
Restyling old components FAILED (still reads as old site). Build a NEW page `PortfolioV2.jsx` on separate route, from scratch, per the Magnific "new versions" language (user's mockup #3 dark-continuous-route = master blueprint; #4 = workshop/works spec — user must save them to `magnific-pulls/`):
1. Hero — original CinematicRide untouched. 2. Skills Journey — full-bleed overlapping scenes per user's storyboard "THE JOURNEY IS THE STORY" (9 shots: valley overlook → singletrack → red collectible/water crossing → blue collectible/bridge build → team/yellow leadership); use existing video frames/storyboard stills as scrubbing placeholders. 3. Workshop — `magnific-pulls/workshop-production.png` + terminal strip showing real POC thumbnails in code. 4. Gallery — map canvas + VERTICAL cards (mobile), camera-pan concept, clear route-line draw. 5. Night Camp — `magnific-pulls/night-camp-footer.png` (baked title at top — crop/scrim it). Sections OVERLAP (negative margins, scenes bleed under next content). Chamfered UI everywhere, NO rounded pills. Zero new generations needed — all assets on disk.
Session 2026-07-05 outcome: skeleton pass (AmbientAtmosphere/TerrainDivider) built then AmbientAtmosphere REMOVED from Portfolio.jsx (user: color overlay muddied everything). TerrainDividers still wired. Connect got night-camp bg + ChamferButtons; Tools got workshop bg. Assets pulled from user's Magnific space (`a2286e4e-0190-4730-88d0-f4434552ad3a`, panel "new versioins" is newer than my dump) into `docs/portfolio-redesign/magnific-pulls/` + copied to `frontend/public/site assets/` (URL-encode spaces in CSS url()!). User: only gpt-2 model good (Recraft=trash); ~7.97 Freepik credits left — be frugal; gpt-2 1:2 medium=130cr, high=350cr, 16:9 1k=15cr.

### Token-burn mitigation rule
Update this handoff file at the end of EVERY session with decisions + discoveries, so each new session starts by reading this file only — no re-sync cost.

## Session 2026-07-07 — WEBGL 3D TERRAIN GALLERY (NEW DIRECTION, user is thrilled — "אני עף על הכיוון הזה")

### What happened
Static mockup gallery (mockup.html, SVG trail over terrain image) evolved into a REAL Three.js 3D topographic world. Two standalone prototypes at repo root, served via `python -m http.server 3010` from repo root:
- `webgl-gallery.html` — Prototype 01 (keep untouched, reference baseline)
- `webgl-gallery-v2.html` — Prototype 02, ACTIVE FILE. Flat-shaded low-poly navy terrain (procedural simplex, NO textures), gold contour shader, carved trail corridor, Waze-style trail (ridden=gold / ahead=pale-cyan via uProgress shader on TubeGeometry uv.x), scroll-driven camera riding the route (lookAt tangent), live compass (reads camera azimuth), clouds+fog, waypoint hexagons, DOM project cards projected 3D→2D beside waypoints, top/bottom scrims for text legibility, header copy "My Creative Journey" (user loves this copy — replaces "Selected Works").

### Approved feature set (user requests, status)
| Feature | Status |
|---|---|
| Softer low-poly mountains (flat-shaded facets, mobile-game style) | ✅ done |
| Waze trail: ridden gold / ahead pale — sharp transition (`smoothstep ±0.003`) | ✅ done |
| Thin trail: solid radius 0.10, glow radius 0.38 | ✅ done |
| Hexagon as coin (`rotateX(π/2)`) on thin white vertical stem, spinning on Y axis ("dreidel") | ✅ done |
| Project-name labels floating at waypoints (city-name style, gold, depthTest:false); hidden when card open | ✅ done |
| LOCATIONS master component — single object per project drives 3D marker + DOM card + fade | ✅ done |
| 5 projects in LOCATIONS: Bone Bash (right), Baboon of Jafa (left), Digitel TLV (right), Promee (left), CoderZ (right) | ✅ done |
| Card side locked to `loc.side` field (no more side-flicker) | ✅ done |
| Card fade: approaching→100%, passed→freeze at 20%, hover on passed card→revive to 100% | ✅ done |
| Card position freezes when project is behind camera (no flying off screen) | ✅ done |
| Card safe zone: never overlaps top-left title block (480×330px); minY=330 left/90 right | ✅ done |
| Header "My Creative Journey" left-aligned | ✅ done |
| Camera: Alt+mouse free-look (spring back), Shift+↑/↓ height, Shift+Space reset | ✅ done (handlers + updateCamera all wired) |
| Card design: image top, yellow title, white sub, navy fade bottom; hover = image shrinks+zooms, desc+tags reveal; yellow corner triangle ↗ link; ONE chamfered corner top-right | ✅ CSS+HTML+position wired |
| Bird's-eye intro → dive through clouds down to trail | Phase 3, approved, not started |
| Trail can be loop/non-linear for many projects | agreed possible, later |
| Nature pack (cgtrader low-poly trees/rocks) | later phase; prefer GLB over OBJ; recolor materials to navy/gold in code |
| Card 3D tilt effect on hover (codepen pjdzaG style perspective transform) | later phase |
| Stacked visited-cards strip (thumbnails of past projects accumulate at bottom) | later phase |
| prefers-reduced-motion fallback | noted (ui-ux-pro-max), integration phase |

### Key refs for this direction
- `reference-previews/gallery/magnific facelift/magnific__an-expansive-website-portfolio-section-dark-navy-b__93803.png` — THE look: 3D navy terrain, gold contours, glowing trail, floating project-name labels
- `reference-previews/gallery/magnific facelift/my creative journey ref.png` — layout: alternating cards, numbered waypoints, header copy
- `reference-previews/3d env style/3d world/uploads_files_2010290_LowPoly/` — facet style anchor (OBJ/FBX available for props later)
- Card interaction ref: https://codepen.io/csanchezriballo/pen/pjdzaG

### Technical notes (save re-derivation cost)
- Terrain: `terrainHeight(x,z)` = ridged+fbm simplex, pow 1.45, H_SCALE 64, corridor carve `d/30`, floor 0.24. SIZE 780, SEG 150, `toNonIndexed()` for facets.
- Colors: bg/fog `#04080f`, uDeep `#142944`, uBase `#2e5178`, uSnow `#8fb2d4`, brand `#facc15`. Lambert multiplier `0.9+0.6*NdotL`.
- Trail: solid TubeGeometry r=0.10, glow r=0.38. Shader: `smoothstep(uProg-0.003, uProg+0.003, vUv.x)` → gold (#facc15) ridden / pale-cyan (#a8d8ea) ahead.
- Hex marker: `CylinderGeometry(1.7,1.7,0.6,6)` + `geo.rotateX(Math.PI/2)` → coin face toward viewer. Yellow stem: `CylinderGeometry(0.04,0.04,stemH,4)`. Spins on Y via `hex.rotation.y += dt*1.2`.
- Camera rig: `t = scrollProgress*0.96`, pos = point − tangent*38, +24 up, lerp factor `1−0.001^dt`. Free-look: `userYaw/userPitch` via Alt+mousemove; spring-back `Math.pow(0.03, dt)`. Height: `heightOffset` ±1 per Shift+↑/↓, reset Shift+Space.
- Cards: `projV.copy(marker.world).project(camera)` → screen px. Side locked to `loc.side`. Safe zone: `if (cx<480 && cy<330) cy=330`. Fade delta = `scrollProgress*0.96 - loc.t`. Visibility: `delta>-0.075 && delta<0.22` → lerp to 1 (approaching) or clamp 0.2 (passed). Frozen pos when behind camera.
- LOCATIONS array drives everything — add/edit/remove projects here only.
- three@0.160 via unpkg importmap. DPR capped 2. Body height 800vh.
- Serve from repo root: `python -m http.server 3010` then open `http://localhost:3010/webgl-gallery-v2.html`

### Immediate next step (start of NEXT session)

#### PRIORITY 1 — 3D card tilt (from codepen.io/csanchezriballo/pen/pjdzaG, full source at `docs/portfolio-redesign/reference-previews/map bg/3d-perspective-card-xy/3d-perspective-card-xy/dist/`)
Card changes required — all in `webgl-gallery-v2.html`:

**CSS:**
- `width: 392px` → `width: 470px` (+20%)
- `.media` height: `280px` → `352px` (4:3 ratio: 470 × 0.75)
- `.proj-card:hover .media` height: `220px` → `276px`
- Add `.card-3d { width:100%; transform-style:preserve-3d; transition:transform 0.18s ease-out; will-change:transform; }`
- Add `.card-shine { position:absolute; inset:0; pointer-events:none; z-index:10; border-radius:inherit; }`
- Add `perspective: 1200px` to `.proj-card`
- `.head h3`, `.head .sub`: add `transition: transform 0.18s ease-out`

**HTML in `buildCard()`** — wrap all inner content in `.card-3d`, add `.card-shine` overlay:
```html
<div class="card-3d">
  <a class="corner">...</a>
  <div class="card-shine"></div>
  <div class="media"><img /></div>
  <div class="head">...</div>
  <div class="more">...</div>
</div>
```

**JS — `attachTilt(card)` function, call at end of `buildCard()`:**
```js
function attachTilt(card) {
    const inner = card.querySelector('.card-3d');
    const img   = card.querySelector('.media img');
    const title = card.querySelector('.head h3');
    const sub   = card.querySelector('.head .sub');
    const shine = card.querySelector('.card-shine');

    card.addEventListener('mousemove', e => {
        const r  = card.getBoundingClientRect();
        const dx = (e.clientX - r.left)  / r.width  - 0.5;  // -0.5 → 0.5
        const dy = (e.clientY - r.top)   / r.height - 0.5;
        const rotY =  dx * 20;
        const rotX = -dy * 14;
        const angle = Math.atan2(dy, dx) * 180 / Math.PI - 90;
        const shineOp = Math.max(0, (0.5 + dy) * 0.55).toFixed(2);
        const shadowX = (-dx * 18).toFixed(1);
        const shadowY = (-dy * 18).toFixed(1);

        inner.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
        shine.style.background = `linear-gradient(${angle}deg, rgba(255,255,255,${shineOp}) 0%, rgba(255,255,255,0) 75%)`;
        img.style.objectPosition = `${50 + dx*14}% ${50 + dy*14}%`;
        title.style.transform = `translateX(${(dx*9).toFixed(1)}px) translateY(${(dy*9).toFixed(1)}px)`;
        sub.style.transform   = `translateX(${(dx*6).toFixed(1)}px) translateY(${(dy*6).toFixed(1)}px)`;
        card.style.filter = `drop-shadow(${shadowX}px ${shadowY}px 28px rgba(0,0,0,0.7))`;
    });

    card.addEventListener('mouseleave', () => {
        inner.style.transform = '';
        shine.style.background = '';
        img.style.objectPosition = '50% 50%';
        title.style.transform = '';
        sub.style.transform = '';
        card.style.filter = '';
    });
}
```
Call `attachTilt(el)` at the end of `buildCard()` before `return el`.

#### PRIORITY 1b — Card size + thumbnails (do alongside tilt)
- Card width: 392 → 470px. Default image aspect: **16:9** (`height = width * 9/16 = 264px`). Exception: Baboon of Jafa → **9:16 vertical** (add `aspect:'9:16'` field to LOCATIONS entry).
- Fix thumbnails: change `const IMG = '/projects/'` → `'/projects/thumbs/'` AND restore full original filenames (they exist in `frontend/public/projects/thumbs/` with original Magnific names). Also copy thumbs folder to `frontend/public/projects/thumbs/` if not already there.
- Per-card aspect in LOCATIONS: add `aspect: '16:9'` (default) or `'9:16'` (vertical). `buildCard()` reads it and sets `.media` height accordingly.

#### PRIORITY 1c — Camera shift (trail left, cards right)
- Trail should sit on the **RIGHT** side of screen (under main titles area). Cards appear on the **LEFT** with more room.
- Implementation: offset `lookAt` target perpendicular-left to tangent direction. In `updateCamera`, compute `right = tangent × [0,1,0]` (normalized), then `lookAtTarget = point + tangent*5 - right * LATERAL_OFFSET` where `LATERAL_OFFSET ≈ 30–50` (tune visually). Camera stays on trail but view shifts trail rightward.
- Card safe-zone update accordingly (left cards get more horizontal space).

#### PRIORITY 1d — Card timing fix
- Card appears too early. Change `delta > -0.075` → `delta > -0.035` in the visibility block. Card fades in just before the yellow waypoint.

#### PRIORITY 1e — Waypoint marker redesign
**Replace spinning hex with:**
1. **Pulsing dot** on the trail point itself: `RingGeometry` + `MeshBasicMaterial`, scale grows 1→3 + opacity 1→0 in loop (~1.8s). Stack 2 rings with 0.9s offset for continuous pulse (Waze alert style).
2. **Waving flag** above dot (replaces hex+stem): procedural Three.js — `PlaneGeometry(3,2,8,6)` + vertex shader sine wave:
```glsl
// vertex shader snippet
float wave = sin(position.x * 2.5 + uTime * 3.0) * (position.x / 3.0) * 0.4;
newPos.y += wave;
newPos.z += wave * 0.3;
```
Flag material: `MeshBasicMaterial({ color: 0xfacc15, side: THREE.DoubleSide })`. Thin white flagpole: `CylinderGeometry(0.05,0.05,stemH,4)`.

#### PRIORITY 1f — Altitude label
Add `alt` field to each LOCATIONS entry (realistic MTB altitude in meters, e.g. 1240). Name sprite renders `"Bone Bash · 1240m"` — same `nameTex()` function, just append ` · ${loc.alt}m` to the string.

#### PRIORITY 2 — Project modal (click on card)
**Trigger:** click anywhere on `.proj-card` (not the corner ↗ link — that goes to project page).
**Animation:** shared-element expand — card's bounding rect → near-fullscreen overlay (300ms ease-out `transform: scale()`). Overlay: `position:fixed; inset:20px; z-index:100; background:rgba(4,8,15,0.96); backdrop-filter:blur(20px); border:1px solid rgba(250,204,21,0.25)`.
**Content inside modal:**
- If `loc.video` exists → VideoPlayer component (see below). Else → large `<img>`.
- Project title (Unbounded 28px), subtitle, full description, tags.
- `×` close button top-right (44×44px touch target). Escape key closes.
- Optional: additional images grid below (add `loc.gallery: ['img1.jpg','img2.jpg']` to LOCATIONS).

#### PRIORITY 2b — VideoPlayer component
Used inside modal. Spec:
- Border: `1px solid rgba(250,204,21,0.35)`
- Controls bar: `rgba(4,8,15,0.82)` + `backdrop-filter:blur(12px)`, white SVG icons
- Progress bar: yellow `#facc15` played / `rgba(255,255,255,0.3)` buffered / dark track
- Controls: ▶/⏸ · timestamp · volume slider (yellow accent) · fullscreen · share
- Share: `navigator.clipboard.writeText(loc.href)` → toast "Link copied ✓" (3s auto-dismiss)
- Keyboard: `Space`=play/pause, `←/→`=±5s seek, `M`=mute, `F`=fullscreen, `Esc`=close modal
- LOCATIONS field: `video: '/vids/project-name.mp4'` (served from `frontend/public/vids/`)
- Video hosting: **Vercel `frontend/public/vids/`** — 96.7 GB free bandwidth remaining on Hobby plan, no external service needed for portfolio-scale traffic.

#### PRIORITY 3 — Bird's-eye intro (Phase 3)
Camera starts high above terrain (~y=180, far back z), scrolling t=0→0.05 triggers dive through polygon clouds, lands on trail at t=0.05. Separate lerp target for intro phase; transition to normal trail-follow after.

#### PRIORITY 4 — Playwright verify
Full feature set: thumbnails, trail, flag+pulse, name+altitude labels, card timing, card aspect ratios, 3D tilt, modal open/close, video player, camera offset.

#### PRIORITY 5 — Remaining projects + React
- Add 3 more to LOCATIONS: Ten Li Rock'n'Roll (`thumbs/magnific__digital...23383.jpg`), Paymax (`thumbs/magnific__photo...23380.jpg`), Beit Ha'Gefen (needs real image from user).
- After approval → React integration into `PortfolioV2.jsx` (Three.js canvas + `useEffect`/`window.scrollY` scroll sync).

## Session 2026-07-08 — MASTER CARD COMPONENT (approved rules, implemented in webgl-gallery-v2.html)

Two variants of one master card, driven per-project by the LOCATIONS entry:
- **Horizontal** (default, `aspect:'16:9'`): card 660px wide, media height by aspect.
- **Mobile/vertical** (`aspect:'9:16'`, e.g. Baboon): card 380px wide, media up to 620px tall.

Shared rules (ALL cards):
- Image full-bleed on top; text strip flows BELOW image — black rgba(0,0,0,0.3) + backdrop-blur(10px), site 3D map visible through it. Hover expands `.more` (desc+tags) inside same strip.
- Corner triangle top-left: 26px, decorative, NO arrow.
- Edge glow `.card-edge`: yellow→cyan radial border glow follows cursor (3px thick), on hover.
- Hexagon cursor `#cursorHex`: regular hexagon 90×104 (pointy top/bottom), yellow, navy "VIEW PROJECT" + ↗ 18px below text; replaces system cursor; click opens `loc.href` (case-study page) in new tab. Excluded over `.vid-ui` and `.corner`.
- Idle float: translateY ±9px, 6s ease-in-out loop (`.card-float`).
- Cards center in right-side zone: x from 44% viewport to −60px, y 64px..−60px, centered by actual card height, lerped smooth.
- Card visible window: delta −0.035..+0.09, fades fully out after pass (no ghost).

Video cards (`video:` field, currently Baboon + Bone Bash):
- Hover: still image cross-fades (0.45s) into muted looping `<video>`; leave → fade back + pause.
- Themed controls bar `.vid-ui`: dark blur strip, white icons (hover=yellow), yellow glow progress (click-to-seek, thickens on hover), timestamp, YouTube-style mute/unmute speaker icon with 46×40 hit zone.
- 3D tilt DISABLED while playing (buttons stay under cursor); edge glow still tracks.
- Hex cursor only while playing.
- Videos live in `frontend/public/projects/<Name>/` — Baboon: `Baboon/Baboon_for_topaz_dancer_GPT_settings04.mp4`, BoneBash: `BoneBash/binebash_sora_clean.mp4`. Paths in LOCATIONS are root-server-relative (`frontend/public/...`); switch to `/projects/...` at React port.

Non-video cards:
- 3D tilt ACTIVE (rotY dx*30 / rotX dy*22, perspective 750, image objectPosition pan, title parallax, drop-shadow) + hex cursor on hover.
- YouTube `yt:` fallback path exists in code (chromeless embed, 140% crop) — unused currently, embed was blocked for Bone Bash.

HUD (this session): kicker white, H1 yellow Sora 800, paragraph Sora 300 18px; staged intro — badge pop (chamfered, stroked flag+trail SVG) → kicker → per-letter H1 cascade → paragraph typewriter w/ yellow caret. Waypoint labels: hi-res canvas textures, world-scale sprites (sizeAttenuation revert), altitude text removed, always visible. Pulse rings halved (r=0.45). OPEN: user reported "scroll feels inverted" — clarify before flipping direction.

### Hexagon "VIEW PROJECT" cursor (added this session)
`#cursorHex` — regular hexagon 90×104 (pointy top/bottom), yellow fill, navy "VIEW PROJECT" text + 18px ↗ arrow below. Replaces system cursor (`.proj-card.hexing { cursor:none }`) while active; follows mouse via `mousemove` → `cursorHex.style.left/top`. Active whenever hovering a card AND (non-video card, always) OR (video card AND video is playing) AND not over `.vid-ui` AND not fullscreen. Click on card body (excluding `.vid-ui`/`.corner`) → `window.open(loc.href, '_blank')` — `loc.href` still needs real case-study URLs per project.

### Video card polish (added this session)
- Fullscreen button (⛶/⛶-compress icons) in `.vid-ui`, right of mute — `media.requestFullscreen()` / `exitFullscreen()`. CSS `:fullscreen` rule: video `object-fit:contain`, still image hidden, black backdrop. Hex cursor + card click disabled while fullscreen.
- Compressed source videos via ffmpeg (H.264, CRF24, preset slow, AAC 96k, `+faststart`): `Baboon_for_topaz_dancer_GPT_settings04.mp4` 121MB→`baboon_web.mp4` 7.2MB (630×1080); `binebash_sora_clean.mp4` 67MB→`bonebash_web.mp4` 24MB (native 1920×1056). LOCATIONS `video:` fields point to the `_web.mp4` versions. Originals stay local only — added to root `.gitignore` (over Vercel's 100MB/file limit, no reason to bloat git history).
- Vertical card (Baboon, 9:16) size reduced 380→330px, media cap 620→520px — was touching viewport edges. Card zone vertical padding increased 64/innerHeight-60 → 90/innerHeight-90 on both axes.

### Vercel path fixes (this session — REQUIRED before every future sync)
Root `webgl-gallery-v2.html` uses local-server-relative paths for iteration (`frontend/public/projects/...`, `docs/portfolio-redesign/reference-previews/projects/...` for thumbs) — these do NOT resolve on Vercel. The copy at `frontend/public/webgl-gallery-v2.html` (the one Vercel actually serves) must have:
- `video:`/img paths rewritten `frontend/public/projects/` → `/projects/`
- `const IMG` rewritten to `/projects/thumbs/`
Do this rewrite (not a byte-identical copy) every time before pushing. Sync command used this session:
```
sed -e "s|frontend/public/projects/|/projects/|g" -e "s|docs/portfolio-redesign/reference-previews/projects/|/projects/thumbs/|" webgl-gallery-v2.html > frontend/public/webgl-gallery-v2.html
```

## To resume in a new session
Paste: "Read `C:\Ai\Mtb_portfolio\docs\portfolio-redesign\SESSION-HANDOFF.md`, then continue from the LAST session section's 'Immediate next step'." Also worth loading `/caveman` mode again if it doesn't persist automatically.
