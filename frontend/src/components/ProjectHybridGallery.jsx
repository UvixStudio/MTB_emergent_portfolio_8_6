import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Mountain } from "lucide-react";
import { PROJECTS } from "@/data/content";
import { Reveal, TrailHeading } from "@/components/Primitives";
import ProjectModal from "@/components/ProjectModal";

/* ── ProjectHybridGallery ────────────────────────────────────────
   Hybrid layout:
   - Top: Netflix-style row of portrait cards. Hover/focus on one
     expands it and reveals tagline + CTA; the others compress.
   - Bottom: an elevation silhouette chart showing the "climb" — the
     peak that matches the hovered card pulses yellow.
   Full-screen by design (min-h-screen) so the section reads as one
   immersive product moment.                                          */

const ease = [0.22, 1, 0.36, 1];

const FILTERS = [
    "All",
    "Creative Direction",
    "Immersive / AR",
    "AI Video",
    "3D / Game",
];

/* Per-slug impact score (1–10) drives:
   - card order (smaller impact first, climax last)
   - peak height in the elevation chart                              */
const META = {
    "paymax":           { impact: 6 },
    "coderz":           { impact: 8 },
    "promee":           { impact: 5 },
    "digitel-tlv":      { impact: 6 },
    "bone-bash":        { impact: 7 },
    "ten-li-rocknroll": { impact: 4 },
    "baboon-of-jafa":   { impact: 4 },
    "beit-hagefen":     { impact: 10 },
};

const chamfer = (c) =>
    `polygon(0 ${c}px, ${c}px 0, calc(100% - ${c}px) 0, 100% ${c}px, 100% calc(100% - ${c}px), calc(100% - ${c}px) 100%, ${c}px 100%, 0 calc(100% - ${c}px))`;

function orderProjects(list) {
    return [...list].sort((a, b) => {
        const ai = META[a.slug]?.impact ?? 5;
        const bi = META[b.slug]?.impact ?? 5;
        return ai - bi;
    });
}

/* ── Portrait card — flex-expands when active ──────────────────
   Active card sequence (avoids text jump):
     1. flex-grow + scale + opacity rise   (0–550ms)
     2. meta text fades in                 (delayed 380ms, 320ms duration)
   Reverse on leave: text fades out first, card shrinks after. */
function NetflixCard({ p, isActive, isDimmed, onHover, onLeave, onClick }) {
    /* Flex weights tuned so the active card dominates the row.
       active=5.5 + 7 others×0.55 ≈ active takes ~58% of the width.
       Dimmed cards get strong opacity drop + slight scale-down so the
       hierarchy reads as "one project at a time", not eight competing tiles. */
    const flexWeight = isActive ? 5.5 : 0.55;

    return (
        <motion.button
            onMouseEnter={onHover}
            onFocus={onHover}
            onMouseLeave={onLeave}
            onBlur={onLeave}
            onClick={onClick}
            data-cursor="view"
            data-cursor-label="View"
            data-testid={`hybrid-card-${p.slug}`}
            className="group relative block h-full flex-1 cursor-pointer text-left outline-none"
            style={{ clipPath: chamfer(12) }}
            animate={{
                flexGrow: flexWeight,
                opacity: isDimmed ? 0.32 : 1,
                scale: isActive ? 1.02 : 0.94,
            }}
            transition={{ duration: 0.55, ease }}
        >
            {/* Image */}
            {p.thumb ? (
                <img
                    src={p.thumb}
                    alt={p.title}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
            ) : (
                <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-[#17293B] to-[#0a1424]">
                    <Mountain
                        size={44}
                        strokeWidth={1.2}
                        className="text-white/15"
                    />
                </div>
            )}

            {/* gradient mask bottom-up for legibility */}
            <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                    background:
                        "linear-gradient(180deg, transparent 35%, rgba(6,11,19,0.65) 70%, rgba(6,11,19,0.97))",
                }}
            />

            {/* Edge glow when active — NO stroke border, just radiant glow on edges */}
            <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                animate={{
                    opacity: isActive ? 1 : 0,
                }}
                transition={{ duration: 0.55, ease }}
                style={{
                    boxShadow:
                        "inset 0 0 40px 4px rgba(250,204,21,0.22), 0 0 36px 6px rgba(250,204,21,0.32)",
                    clipPath: chamfer(12),
                }}
            />

            {/* Pulsing inner glow accent — gentle breathing */}
            {isActive && (
                <motion.div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.4, 0.8, 0.4] }}
                    transition={{
                        duration: 2.6,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    style={{
                        boxShadow:
                            "inset 0 0 60px 6px rgba(250,204,21,0.18)",
                        clipPath: chamfer(12),
                    }}
                />
            )}

            {/* Category ribbon — diagonal top-right (chamfered for slash look) */}
            <div
                className="pointer-events-none absolute right-0 top-0 z-10"
                style={{
                    clipPath:
                        "polygon(20px 0, 100% 0, 100% 100%, 0 100%)",
                    background: "rgba(6,11,19,0.92)",
                    backdropFilter: "blur(4px)",
                    WebkitBackdropFilter: "blur(4px)",
                }}
            >
                <span
                    className="block py-1.5 pl-6 pr-4 text-[9px] font-bold uppercase tracking-[0.2em]"
                    style={{ color: "var(--brand)" }}
                >
                    {p.category}
                </span>
            </div>

            {/* Title — always visible at bottom (smaller, refined) */}
            <div className="absolute inset-x-0 bottom-0 p-3.5 sm:p-4">
                <h3
                    className="font-display font-black uppercase leading-[1.02] tracking-tight text-white"
                    style={{
                        fontSize: "clamp(0.78rem, 0.85vw, 1rem)",
                        letterSpacing: "-0.015em",
                    }}
                >
                    {p.title}
                </h3>

                {/* Expanded content — 2-phase reveal: flex grows first,
                    THEN text fades in (delay 0.38s). On exit, text fades
                    out fast (0.18s, no delay) before the flex shrinks. */}
                <AnimatePresence initial={false}>
                    {isActive && (
                        <motion.div
                            key="meta"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{
                                opacity: {
                                    duration: 0.32,
                                    delay: 0.38,
                                    ease,
                                },
                                height: {
                                    duration: 0.32,
                                    delay: 0.38,
                                    ease,
                                },
                            }}
                            style={{
                                /* On exit, override the delay so text leaves first */
                                transitionDelay: "0s",
                            }}
                            className="overflow-hidden"
                        >
                            <p className="mt-1.5 text-[9px] font-bold uppercase tracking-[0.18em] text-brand">
                                {p.role}
                            </p>
                            <p className="mt-1.5 line-clamp-3 text-[11px] leading-relaxed text-white/75 sm:text-[12px]">
                                {p.tagline}
                            </p>
                            <span className="mt-2 inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-[0.18em] text-brand">
                                View case
                                <ArrowUpRight size={10} strokeWidth={2.5} />
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.button>
    );
}

/* ── Horizontal elevation silhouette below the cards ──────────── */
function ElevationStrip({ projects, hoveredSlug, onHover, onLeave }) {
    if (projects.length < 2) return null;

    const W = 1000;
    const H = 180;
    const PAD = { top: 38, right: 56, bottom: 40, left: 56 };

    const points = useMemo(
        () =>
            projects.map((p, i) => {
                const xRange = W - PAD.left - PAD.right;
                const yRange = H - PAD.top - PAD.bottom;
                const x =
                    PAD.left +
                    (i / Math.max(1, projects.length - 1)) * xRange;
                const impact = META[p.slug]?.impact ?? 5;
                const y = PAD.top + ((10 - impact) / 10) * yRange;
                return { x, y, slug: p.slug, title: p.title, impact };
            }),
        [projects]
    );

    /* Summit = the peak with the highest impact */
    const summitIdx = points.reduce(
        (mi, p, i) => (p.impact > points[mi].impact ? i : mi),
        0
    );
    const summit = points[summitIdx];
    const startP = points[0];

    /* Catmull-Rom smooth curve */
    let linePath = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[i - 1] || points[i];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = points[i + 2] || points[i + 1];
        const cp1x = p1.x + (p2.x - p0.x) / 6;
        const cp1y = p1.y + (p2.y - p0.y) / 6;
        const cp2x = p2.x - (p3.x - p1.x) / 6;
        const cp2y = p2.y - (p3.y - p1.y) / 6;
        linePath += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }

    const baseY = H - PAD.bottom;
    const last = points[points.length - 1];
    const first = points[0];
    const areaPath = `${linePath} L ${last.x} ${baseY} L ${first.x} ${baseY} Z`;

    const hoveredP = hoveredSlug
        ? points.find((p) => p.slug === hoveredSlug)
        : null;

    return (
        <div className="relative w-full">
            {/* contextual readout row */}
            <div className="mb-3 flex items-center justify-between gap-4 text-[10px] font-bold uppercase tracking-[0.22em] text-white/40">
                <span>Trail · Project Elevation</span>
                <span className="text-white/65">
                    {hoveredP
                        ? `▲ ${hoveredP.title}`
                        : `Summit · ${summit.title}`}
                </span>
                <span>
                    {points.length} stops · max scope {summit.impact}/10
                </span>
            </div>

            <svg
                viewBox={`0 0 ${W} ${H}`}
                preserveAspectRatio="none"
                className="block w-full"
                style={{ height: "auto", aspectRatio: `${W} / ${H}` }}
            >
                <defs>
                    <linearGradient
                        id="strip-fill"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                    >
                        <stop offset="0%" stopColor="rgba(250,204,21,0.38)" />
                        <stop offset="100%" stopColor="rgba(250,204,21,0)" />
                    </linearGradient>
                    {/* diagonal hatching → terrain feel, not generic chart */}
                    <pattern
                        id="terrain-hatch"
                        x="0"
                        y="0"
                        width="6"
                        height="6"
                        patternUnits="userSpaceOnUse"
                        patternTransform="rotate(38)"
                    >
                        <line
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="6"
                            stroke="rgba(250,204,21,0.13)"
                            strokeWidth="1"
                        />
                    </pattern>
                </defs>

                {/* baseline (ground) */}
                <line
                    x1={PAD.left}
                    y1={baseY}
                    x2={W - PAD.right}
                    y2={baseY}
                    stroke="rgba(255,255,255,0.18)"
                    strokeWidth="1"
                />

                {/* area fill + terrain hatching */}
                <motion.path
                    d={areaPath}
                    fill="url(#strip-fill)"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 1.1, ease }}
                />
                <motion.path
                    d={areaPath}
                    fill="url(#terrain-hatch)"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 0.7 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 1.1, ease }}
                />
                {/* ridge silhouette */}
                <motion.path
                    d={linePath}
                    fill="none"
                    stroke="rgba(250,204,21,0.9)"
                    strokeWidth={1.6}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 1.4, ease }}
                />

                {/* START flag — white, planted at ground level */}
                <g transform={`translate(${startP.x} ${baseY})`}>
                    <line
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="-18"
                        stroke="rgba(255,255,255,0.6)"
                        strokeWidth="1.4"
                    />
                    <path
                        d="M0 -18 L11 -15 L0 -12 Z"
                        fill="rgba(255,255,255,0.65)"
                    />
                </g>
                <text
                    x={startP.x - 4}
                    y={H - 8}
                    textAnchor="end"
                    fontFamily="Unbounded, sans-serif"
                    fontSize="8"
                    fontWeight="700"
                    letterSpacing="0.2em"
                    fill="rgba(255,255,255,0.45)"
                >
                    START
                </text>

                {/* SUMMIT flag — brand color, planted on top of the peak */}
                <g transform={`translate(${summit.x} ${summit.y})`}>
                    <line
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="-22"
                        stroke="var(--brand)"
                        strokeWidth="1.5"
                    />
                    <path
                        d="M0 -22 L14 -18 L0 -14 Z"
                        fill="var(--brand)"
                    />
                </g>
                <text
                    x={summit.x}
                    y={summit.y - 28}
                    textAnchor="middle"
                    fontFamily="Unbounded, sans-serif"
                    fontSize="8"
                    fontWeight="800"
                    letterSpacing="0.22em"
                    fill="var(--brand)"
                >
                    SUMMIT
                </text>

                {/* peak markers — interactive */}
                {points.map((pt, idx) => {
                    const on = pt.slug === hoveredSlug;
                    const isSummit = idx === summitIdx;
                    /* Skip the summit point's basic dot — its flag already marks it */
                    if (isSummit && !on) return null;
                    return (
                        <g
                            key={pt.slug}
                            onMouseEnter={() => onHover(pt.slug)}
                            onMouseLeave={() => onLeave()}
                            style={{ cursor: "pointer" }}
                        >
                            {on && (
                                <motion.circle
                                    cx={pt.x}
                                    cy={pt.y}
                                    fill="rgba(250,204,21,0.2)"
                                    initial={{ r: 8, opacity: 0.6 }}
                                    animate={{
                                        r: [8, 16, 8],
                                        opacity: [0.6, 0, 0.6],
                                    }}
                                    transition={{
                                        duration: 1.3,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    }}
                                />
                            )}
                            <circle
                                cx={pt.x}
                                cy={pt.y}
                                r={on ? 5 : 3}
                                fill={
                                    on
                                        ? "var(--brand)"
                                        : "rgba(255,255,255,0.4)"
                                }
                                stroke={
                                    on
                                        ? "rgba(250,204,21,0.5)"
                                        : "none"
                                }
                                strokeWidth={on ? 6 : 0}
                            />
                            {/* invisible larger hit target */}
                            <circle
                                cx={pt.x}
                                cy={pt.y}
                                r={14}
                                fill="transparent"
                            />
                        </g>
                    );
                })}
            </svg>

            {/* Optional contextual hint below — kept very minimal */}
            <div className="mt-2 flex items-center justify-center gap-2 text-[9px] font-bold uppercase tracking-[0.22em] text-white/30">
                <span className="inline-block h-px w-6 bg-white/15" />
                <span>Career arc · low → high scope</span>
                <span className="inline-block h-px w-6 bg-white/15" />
            </div>
        </div>
    );
}

/* ── Main hybrid gallery ───────────────────────────────────────── */
const AUTO_INTERVAL = 3500;     // ms between auto-rotations
const RESUME_DELAY = 2200;      // ms after mouseleave before auto resumes

export default function ProjectHybridGallery() {
    const [cat, setCat] = useState("All");
    const [active, setActive] = useState(null);
    const [hoveredSlug, setHoveredSlug] = useState(null);
    const [autoIdx, setAutoIdx] = useState(0);
    const [autoPaused, setAutoPaused] = useState(false);
    const resumeTimerRef = useRef(null);

    const shown = useMemo(() => {
        const filtered =
            cat === "All"
                ? PROJECTS
                : PROJECTS.filter((p) => p.category === cat);
        return orderProjects(filtered);
    }, [cat]);

    /* Reset auto pointer when the list changes */
    useEffect(() => {
        setAutoIdx(0);
    }, [shown.length, cat]);

    /* Auto-rotate the active card while idle */
    useEffect(() => {
        if (autoPaused || shown.length < 2) return;
        const t = setInterval(() => {
            setAutoIdx((i) => (i + 1) % shown.length);
        }, AUTO_INTERVAL);
        return () => clearInterval(t);
    }, [autoPaused, shown.length]);

    /* Pause when the user hovers a card; resume after a short grace period */
    const handleHover = (slug) => {
        if (resumeTimerRef.current) {
            clearTimeout(resumeTimerRef.current);
            resumeTimerRef.current = null;
        }
        setHoveredSlug(slug);
        setAutoPaused(true);
    };
    const handleLeave = () => {
        setHoveredSlug(null);
        if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
        resumeTimerRef.current = setTimeout(() => {
            setAutoPaused(false);
        }, RESUME_DELAY);
    };

    /* The currently-featured slug: explicit hover wins, otherwise auto */
    const currentSlug =
        hoveredSlug || shown[Math.min(autoIdx, shown.length - 1)]?.slug || null;

    return (
        <section
            id="works"
            className="relative flex min-h-screen flex-col overflow-hidden bg-ink py-16 sm:py-20 lg:h-screen lg:min-h-[860px] lg:py-20"
            data-testid="project-hybrid-gallery"
        >
            {/* topographic grid backdrop */}
            <svg
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 h-full w-full opacity-40"
                width="100%"
                height="100%"
            >
                <defs>
                    <pattern
                        id="hybrid-grid"
                        width="56"
                        height="56"
                        patternUnits="userSpaceOnUse"
                    >
                        <path
                            d="M 56 0 L 0 0 0 56"
                            fill="none"
                            stroke="rgba(255,255,255,0.04)"
                            strokeWidth="1"
                        />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#hybrid-grid)" />
            </svg>

            <div className="relative z-10 flex w-full flex-1 flex-col">
                {/* Header — boxed */}
                <div className="mx-auto w-full max-w-7xl px-6 sm:px-8">
                    <Reveal>
                        <TrailHeading
                            n="04"
                            label="Selected Works"
                            color="var(--cp-projects)"
                        />
                    </Reveal>
                    <Reveal delay={0.08}>
                        <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-white/60">
                            Hover a card to climb its peak — the silhouette below
                            marks where it sits on the trail.
                        </p>
                    </Reveal>

                    {/* Filter tabs */}
                    <Reveal delay={0.14}>
                        <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-2 border-b border-white/8 pb-1">
                            {FILTERS.map((f) => {
                                const on = f === cat;
                                return (
                                    <button
                                        key={f}
                                        onClick={() => setCat(f)}
                                        className="relative pb-3 font-display text-[12px] font-bold uppercase tracking-[0.16em] transition-colors"
                                        style={{
                                            color: on
                                                ? "#ffffff"
                                                : "rgba(255,255,255,0.5)",
                                        }}
                                        data-cursor="link"
                                    >
                                        {f}
                                        {on && (
                                            <motion.span
                                                layoutId="hybrid-tab-underline"
                                                className="absolute -bottom-px left-0 right-0 h-0.5 bg-brand"
                                                transition={{
                                                    type: "spring",
                                                    stiffness: 380,
                                                    damping: 30,
                                                }}
                                            />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </Reveal>
                </div>

                {/* Netflix-style row — full-bleed; narrow edge fades stay
                    out of the way of the active card */}
                <Reveal delay={0.22} className="relative mt-6 flex-1 lg:flex lg:min-h-0 lg:flex-col">
                    <div className="relative w-full flex-1 lg:flex lg:min-h-0 lg:flex-col">
                        {/* Left fade — narrow, only the bg color */}
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute left-0 top-0 bottom-0 z-20 w-10 sm:w-14"
                            style={{
                                background:
                                    "linear-gradient(to right, var(--ink), transparent)",
                            }}
                        />
                        {/* Right fade */}
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute right-0 top-0 bottom-0 z-20 w-10 sm:w-14"
                            style={{
                                background:
                                    "linear-gradient(to left, var(--ink), transparent)",
                            }}
                        />

                        {/* Cards row */}
                        <div
                            className="flex h-[55vh] min-h-[420px] w-full gap-2 px-3 sm:gap-2.5 sm:px-4 lg:h-full lg:min-h-0 lg:flex-1 lg:px-6"
                            onMouseLeave={handleLeave}
                        >
                            {shown.map((p) => (
                                <NetflixCard
                                    key={p.slug}
                                    p={p}
                                    isActive={currentSlug === p.slug}
                                    isDimmed={
                                        currentSlug !== null &&
                                        currentSlug !== p.slug
                                    }
                                    onHover={() => handleHover(p.slug)}
                                    onLeave={handleLeave}
                                    onClick={() => setActive(p)}
                                />
                            ))}
                        </div>
                    </div>
                </Reveal>

                {/* Elevation chart below — boxed */}
                <Reveal
                    delay={0.32}
                    className="mx-auto mt-6 w-full max-w-7xl shrink-0 px-6 sm:mt-8 sm:px-8"
                >
                    <ElevationStrip
                        projects={shown}
                        hoveredSlug={currentSlug}
                        onHover={handleHover}
                        onLeave={handleLeave}
                    />
                </Reveal>
            </div>

            <ProjectModal project={active} onClose={() => setActive(null)} />
        </section>
    );
}
