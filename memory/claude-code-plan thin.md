# Claude Code Analysis — MTB Site

> ניתוח ארכיטקטוני + עיצובי של הפורטפוליו, בכובע של Front-end Architect + Senior Web Designer.
> נשמר ב־2026-06-16 בענף `skills_sections`. הקובץ הזה הוא **תמונת מצב** — ה־PLAN.md הוא המסמך התפעולי החי, אל תערבב.

---

## 1. אישור סביבה

- תיקיית עבודה: `C:\Ai\Mtb_portfolio`
- ענף פעיל: `skills_sections`
- סטאק קיים: React 19 + CRA/Craco + Tailwind + Framer Motion 12 + Lenis + Radix/shadcn + lucide-react
- **אין** three.js, **אין** R3F, **אין** GSAP, **אין** shaders
- ההירו = `<video src="/ride.mp4">` עם scroll-scrub (`CinematicRide.jsx`)

## 2. סטטוס כלי AI/MCP זמינים בפרויקט

| כלי | סטטוס | תפקיד |
|---|---|---|
| `framer-motion@12.40.0` | ✅ מותקן | אנימציות |
| `lenis@1.3.23` | ✅ מותקן | smooth scroll |
| `mcp__magic__21st_magic_component_inspiration` | ✅ זמין | קטלוג רעיונות 21st.dev |
| `mcp__magic__21st_magic_component_builder` | ✅ זמין | יצירת רכיבי React production-ready |
| `mcp__magic__21st_magic_component_refiner` | ✅ זמין | refine לרכיבים קיימים |
| `mcp__magic__logo_search` | ✅ זמין | SVG logos ללוגו וול |
| `mcp__playwright__*` | ✅ זמין | בדיקה ויזואלית בדפדפן |
| `mcp__claude_ai_Magnific_Freepik_MCP__*` | ✅ זמין | יצירת/עריכת assets |
| `three`, `@react-three/fiber`, `@react-three/drei` | ❌ לא מותקן | יש להתקין לשכבה B |

## 3. מה עובד יפה (לא לפרק)

- **Design tokens** ב־`frontend/src/index.css`: brand, eases, durations, chamfer clip-path. בסיס תקין.
- **CinematicRide** — scroll-scrub אמיתי + lerp + reduced-motion מכובד. עבודה מעבדתית, אלגנטית.
- **StationClip + PowerupHUD** — הקונספט הגיימי קיים ועובד (3 stations: adaptive / systems / leadership).
- **Content layer** ב־`data/content.js` — עשיר, מדויק, מקושר ל־CV.
- **Chamfer button system** — חתימה ויזואלית טובה.

## 4. למה האתר מרגיש "AI-generated" ולא Awwwards

1. **אין WOW אמיתי אחרי ההירו.** ה־`ride.mp4` הוא הפיק היחיד; משם זה sections עם reveal-on-scroll סטנדרטי.
2. **גלריית הפרויקטים = grid 2 טורים עם 3D tilt** (`ProjectsGallery.jsx`). Tilt על card זה משנת 2020.
3. **אין three.js בכלל** — למרות שיש `public/projects/_scene/mountain.png + mountain-wire.jpeg` שיושבים שם בלי שימוש.
4. **חוסר ב־rhythm** — 8 סקשנים רצופים במבנה כמעט אחיד (scroll-reveal + center container).
5. **טיפוגרפיה לא מספיק קיצונית.** Unbounded + Manrope טוב, אבל ה־scale עדין מדי. Awwwards = headlines של 120–200px עם kerning שלילי.
6. **אין signature interaction** — לכל אתר Awwwards יש "tell": custom cursor, magnetic CTAs, page transitions. כאן יש רק hover `translateY(-2px)`.
7. **`App.js` עוטף `Portfolio` ישירות** — בלי loading screen, בלי intro animation.

## 5. חוב טכני שזיהיתי

- **BUG:** ב־`frontend/src/components/ProjectsGallery.jsx:16-17` משתמשים ב־`useTransform` בלי לייבא אותו (מייבאים רק `motion, AnimatePresence, useMotionValue, useSpring`). זה ייפול ב־runtime ברגע שמרנדרים `ProjectCard`. **לתקן ראשון**.
- DevViewport עוטף הכל גם בפרודקשן? לוודא שהוא `null` כש־`NODE_ENV === 'production'`.
- `WORKS` ו־`PROJECTS` שניהם ב־`content.js` — duplicate data. לאחד.

## 6. הוויז'ן — 3 שכבות מהזולה לעשירה

### שכבה A — "Polish & Cinematic" (1-2 שבועות)
מטרה: שהאתר ירגיש crafted, לא generated.
- Loading screen / intro עם שם בענק + פדל מסתובב + אחוז טעינה.
- Custom cursor עם magnetic על CTA + state-aware ("View case" על thumbnails).
- **Horizontal pinned scroll** ב־Selected Works (במקום grid 2-cols). זה ה־wow #1 של Awwwards 2024-26.
- Page/Modal transitions עם clip-path reveal (לא fade).
- **De-AI typography pass**: `clamp(72px, 12vw, 220px)`, tracking שלילי, word-by-word blur-in.
- Section dividers ייחודיים — marquee מתחלף עם רוכב SVG בודד שעובר.

### שכבה B — "Three.js Mountain Scene" (2-3 שבועות)
מטרה: להפוך את המטאפורה לאמיתית.
- R3F + drei: מודל low-poly של ההר (לבנות מ־wireframe ב־Spline/Blender, או מ־primitive geometry).
- Rider GLB נע על trail אמיתי (`CatmullRomCurve3`) — לא וידאו. חופש מצלמה מלא.
- Sections = stops על המסלול. גלילה ל־About → המצלמה מסתובבת לעבר השלט.
- Post-processing עדין: bloom על ה־HUD, DoF כשגוללים לאט.
- Fallback למובייל = הוידאו הקיים. אין רגרסיה.

### שכבה C — "Workshop / Inner gallery" (post-launch)
- Workshop tile עם פנים — gallery של MCP→Unity, DaVinci, VAT tool, sprite-sheets.
- All-works page עם horizontal infinite scroll + קטגוריות חיות.

## 7. טבלת פעולות מסודרת לפי impact/effort

| # | פעולה | Impact | Effort | כלי |
|---|---|---|---|---|
| 1 | תיקון bug `useTransform` ב־ProjectsGallery | קריטי | דקה | Edit |
| 2 | De-AI typography pass | גבוה | יום | framer-motion |
| 3 | Custom cursor + magnetic CTA | גבוה | חצי יום | framer-motion + 21st refiner |
| 4 | Horizontal Selected Works | גבוה מאוד | יומיים | 21st inspiration → builder |
| 5 | Intro / loading screen | בינוני-גבוה | יום | framer-motion |
| 6 | Logo wall (Amazon, LEGO, NY Lottery, Playtech, Amdocs, Kaltura) | בינוני | חצי יום | `logo_search` |
| 7 | Three.js mountain (R3F + GLB) | מטא | שבועיים | three + R3F + drei |
| 8 | Workshop inner gallery | בינוני | יום | 21st builder |
| 9 | Smooth transitions ל־ProjectModal | בינוני | חצי יום | framer-motion (LayoutGroup) |
| 10 | איחוד WORKS↔PROJECTS + ניקוי DevViewport prod | טכני | חצי יום | — |

## 8. שאלות פתוחות שצריך לסגור לפני התחלה

1. **דדליין?** מקבע איזה משכבות A/B/C ניקח עכשיו.
2. **3D מותר עכשיו?** אם כן — יש GLB של ההר/רוכב, או שאני בונה מ־primitives על בסיס ה־wireframe?
3. **`ride.mp4` נשאר** או פתוח להחליף ב־R3F?
4. **Mobile-first או desktop-first?** (PLAN אומר desktop-first/mobile-aware — אני אצמד.)
5. **לרוץ קודם רק שכבה A** ולאחר אישור ויזואלי לעבור ל־B? (זו ההמלצה.)

## 9. המלצת ארכיטקט

לעבוד על branch נפרד: **`awwwards-pass-01`**. שכבה A בלבד, בלוקים קטנים עם preview בין כל בלוק. אסור להתחיל ב־R3F (שכבה B) לפני שהוויב של שכבה A עומד בדפדפן ואושר.

**הראשון לפעולה:** פריט #1 (תיקון ה־bug) — לפני כל דבר אחר.

---

### Appendix — קבצי מפתח שנסרקו

- `PLAN.md` — מסמך תפעולי, ענף `skills_sections`
- `memory/PRD.md` — הקונספט "Yuval's Journey" + Redesign v2
- `design_guidelines.json` — Trail-band pattern, colors, components spec
- `frontend/package.json` — סטאק
- `frontend/src/App.js`, `pages/Portfolio.jsx`, `index.css`
- `frontend/src/components/CinematicRide.jsx`, `Hero.jsx`, `ProjectsGallery.jsx`
- `frontend/src/data/content.js` — PROFILE, STATIONS, PROJECTS, WORKS, TOOLS, TESTIMONIALS
