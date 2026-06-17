import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Mountain } from "lucide-react";
import { PROJECTS } from "@/data/content";
import { Reveal, TrailHeading } from "@/components/Primitives";
import ProjectModal from "@/components/ProjectModal";

/* ── ProjectScrollGallery ──────────────────────────────────────────
   Big stacked project tiles. The tile in the viewport center is in
   full color; the others fade to grayscale + dim. On desktop, a small
   sticky elevation chart on the right highlights the current peak.
   No real timeline / years — the narrative is "scrolling up the trail". */

const ease = [0.22, 1, 0.36, 1];

const FILTERS = [
    "All",
    "Creative Direction",
    "Immersive / AR",
    "AI Video",
    "3D / Game",
];

/* Per-slug impact score (1–10). Drives the order AND the elevation
   silhouette in the sticky mini-chart. */
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

/* Chamfer clip-path (same shape as ChamferButton) — used for all tiles */
const chamfer = (c) =>
    `polygon(0 ${c}px, ${c}px 0, calc(100% - ${c}px) 0, 100% ${c}px, 100% calc(100% - ${c}px), calc(100% - ${c}px) 100%, ${c}px 100%, 0 calc(100% - ${c}px))`;

/* Order projects to build a narrative arc: smallest → largest scope.
   Last project on the page = highest peak. */
function orderProjects(list) {
    return [...list].sort((a, b) => {
        const ai = META[a.slug]?.impact ?? 5;
        const bi = META[b.slug]?.impact ?? 5;
        return ai - bi;
    });
}

/* ── A single big project tile ─────────────────────────────────── */
function ProjectTile({ p, i, total, isActive, onOpen }) {
    return (
        <motion.button
            onClick={() => onOpen(p)}
            data-cursor="view"
            data-cursor-label="View Case"
            data-testid={`scroll-tile-${p.slug}`}
            className="group relative block w-full text-left"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease }}
            style={{ perspective: 1200 }}
        >
            <motion.div
                animate={{
                    scale: isActive ? 1 : 0.93,
                }}
                transition={{ duration: 0.55, ease }}
                style={{
                    filter: isActive
                        ? "grayscale(0) brightness(1)"
                        : "grayscale(0.85) brightness(0.55)",
                    transition:
                        "filter 0.55s cubic-bezier(0.22, 1, 0.36, 1)",
                }}
                className="relative w-full"
            >
                {/* Shell */}
                <div
                    className="relative w-full overflow-hidden bg-ink-2"
                    style={{
                        clipPath: chamfer(16),
                    }}
                >
                    {/* Outer glow shell — only when active */}
                    <motion.div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0"
                        animate={{
                            opacity: isActive ? 1 : 0,
                        }}
                        transition={{ duration: 0.55, ease }}
                        style={{
                            boxShadow:
                                "inset 0 0 0 1px rgba(250,204,21,0.30), 0 30px 70px -30px rgba(250,204,21,0.30)",
                            clipPath: chamfer(16),
                        }}
                    />

                    {/* Image */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden lg:aspect-[16/9]">
                        {p.thumb ? (
                            <img
                                src={p.thumb}
                                alt={p.title}
                                loading="lazy"
                                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                            />
                        ) : (
                            <div className="grid h-full w-full place-items-center bg-gradient-to-br from-[#17293B] to-[#0a1424]">
                                <Mountain
                                    size={56}
                                    strokeWidth={1.2}
                                    className="text-white/15"
                                />
                            </div>
                        )}

                        {/* gradient mask — bottom-up for legibility */}
                        <div
                            aria-hidden="true"
                            className="absolute inset-0"
                            style={{
                                background:
                                    "linear-gradient(180deg, transparent 38%, rgba(6,11,19,0.55) 70%, rgba(6,11,19,0.97) 100%)",
                            }}
                        />

                        {/* index counter top-left */}
                        <div className="absolute left-6 top-6 flex items-center gap-2.5 sm:left-8 sm:top-8">
                            <span className="font-display text-[11px] font-extrabold tracking-[0.3em] text-brand">
                                {String(i + 1).padStart(2, "0")}
                            </span>
                            <span className="block h-px w-7 bg-brand/55" />
                            <span className="font-display text-[11px] font-extrabold tracking-[0.3em] text-white/40">
                                {String(total).padStart(2, "0")}
                            </span>
                        </div>

                        {/* category — top-right */}
                        <span className="absolute right-6 top-6 text-[10px] font-bold uppercase tracking-[0.2em] text-white/55 sm:right-8 sm:top-8">
                            {p.category}
                        </span>

                        {/* meta — bottom */}
                        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10">
                            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/55">
                                {p.role}
                            </span>
                            <h3
                                className="mt-2 font-display font-black uppercase leading-[0.92] tracking-tight text-white"
                                style={{
                                    fontSize:
                                        "clamp(1.875rem, 3.6vw, 3.25rem)",
                                    letterSpacing: "-0.025em",
                                }}
                            >
                                {p.title}
                            </h3>
                            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/72 sm:mt-4 sm:text-base">
                                {p.tagline}
                            </p>
                        </div>

                        {/* arrow corner — yellow when active */}
                        <motion.span
                            aria-hidden="true"
                            className="absolute right-6 bottom-6 grid h-12 w-12 place-items-center rounded-full sm:right-8 sm:bottom-8"
                            animate={{
                                background: isActive
                                    ? "rgba(250,204,21,1)"
                                    : "rgba(8,12,18,0.6)",
                                color: isActive ? "#0e1a2b" : "rgba(255,255,255,0.7)",
                                scale: isActive ? 1 : 0.92,
                            }}
                            transition={{ duration: 0.45, ease }}
                            style={{
                                border: isActive
                                    ? "none"
                                    : "1px solid rgba(255,255,255,0.18)",
                            }}
                        >
                            <ArrowUpRight size={18} strokeWidth={2.5} />
                        </motion.span>
                    </div>
                </div>

                {/* horizontal connector to mini-chart (desktop only) */}
                <motion.div
                    aria-hidden="true"
                    className="pointer-events-none absolute top-1/2 right-0 hidden h-px -translate-y-1/2 translate-x-full lg:block"
                    animate={{
                        opacity: isActive ? 1 : 0,
                        width: isActive ? 96 : 0,
                    }}
                    transition={{ duration: 0.45, ease }}
                    style={{
                        background:
                            "linear-gradient(90deg, rgba(250,204,21,0.85), rgba(250,204,21,0))",
                    }}
                />
            </motion.div>
        </motion.button>
    );
}

/* ── Sticky mini-elevation chart (desktop only) ────────────────── */
function MiniElevation({ projects, activeIdx }) {
    if (projects.length < 2) return null;

    const W = 200;
    const H = 360;
    const PAD = { top: 24, right: 12, bottom: 32, left: 12 };

    const points = projects.map((p, i) => {
        const xRange = W - PAD.left - PAD.right;
        const yRange = H - PAD.top - PAD.bottom;
        const x =
            PAD.left + (i / Math.max(1, projects.length - 1)) * xRange;
        const impact = META[p.slug]?.impact ?? 5;
        const y = PAD.top + ((10 - impact) / 10) * yRange;
        return { x, y, impact };
    });

    /* Smooth Catmull-Rom through the points */
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

    const activePoint = points[activeIdx];

    return (
        <div className="hidden lg:block">
            <div className="sticky top-[18vh]">
                <div className="mb-3 flex items-baseline justify-between">
                    <span className="font-display text-[10px] font-extrabold uppercase tracking-[0.28em] text-white/55">
                        Trail
                    </span>
                    <span className="font-display text-[10px] font-extrabold tracking-[0.18em] text-brand">
                        {String(activeIdx + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
                    </span>
                </div>

                <svg
                    viewBox={`0 0 ${W} ${H}`}
                    className="block w-full"
                    style={{
                        background: "rgba(255,255,255,0.02)",
                        border: "1px solid rgba(255,255,255,0.06)",
                        clipPath: chamfer(10),
                    }}
                >
                    <defs>
                        <linearGradient id="mini-fill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="rgba(250,204,21,0.3)" />
                            <stop offset="100%" stopColor="rgba(250,204,21,0)" />
                        </linearGradient>
                    </defs>

                    {/* baseline */}
                    <line
                        x1={PAD.left}
                        y1={baseY}
                        x2={W - PAD.right}
                        y2={baseY}
                        stroke="rgba(255,255,255,0.12)"
                        strokeWidth="1"
                    />

                    {/* area fill */}
                    <path d={areaPath} fill="url(#mini-fill)" />
                    {/* line */}
                    <path
                        d={linePath}
                        fill="none"
                        stroke="rgba(250,204,21,0.85)"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    {/* dim markers for all projects */}
                    {points.map((pt, i) => (
                        <circle
                            key={i}
                            cx={pt.x}
                            cy={pt.y}
                            r={i === activeIdx ? 4.5 : 2.4}
                            fill={
                                i === activeIdx ? "var(--brand)" : "rgba(255,255,255,0.35)"
                            }
                            stroke={
                                i === activeIdx ? "rgba(250,204,21,0.4)" : "none"
                            }
                            strokeWidth={i === activeIdx ? 6 : 0}
                        />
                    ))}

                    {/* vertical guide on the active peak */}
                    {activePoint && (
                        <line
                            x1={activePoint.x}
                            y1={activePoint.y + 8}
                            x2={activePoint.x}
                            y2={baseY}
                            stroke="rgba(250,204,21,0.35)"
                            strokeWidth="0.8"
                            strokeDasharray="2 3"
                        />
                    )}
                </svg>

                {/* legend */}
                <div className="mt-3 space-y-1 text-[10px] uppercase tracking-[0.18em] text-white/40">
                    <div className="flex items-center justify-between">
                        <span>Now</span>
                        <span className="text-white/65">
                            {projects[activeIdx]?.title}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ── Main component ────────────────────────────────────────────── */
export default function ProjectScrollGallery() {
    const [cat, setCat] = useState("All");
    const [active, setActive] = useState(null);
    const [activeIdx, setActiveIdx] = useState(0);
    const tilesRef = useRef([]);

    const filtered =
        cat === "All"
            ? PROJECTS
            : PROJECTS.filter((p) => p.category === cat);
    const shown = orderProjects(filtered);

    /* Reset refs when the visible list changes */
    useEffect(() => {
        tilesRef.current = tilesRef.current.slice(0, shown.length);
        setActiveIdx(0);
    }, [shown.length, cat]);

    /* Track which tile is in the viewport's middle band */
    useEffect(() => {
        if (typeof IntersectionObserver === "undefined") return;
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const idx = Number(entry.target.dataset.idx);
                        if (!Number.isNaN(idx)) setActiveIdx(idx);
                    }
                });
            },
            {
                rootMargin: "-40% 0px -40% 0px",
                threshold: 0,
            }
        );
        tilesRef.current.forEach((el) => el && observer.observe(el));
        return () => observer.disconnect();
    }, [shown.length]);

    return (
        <section
            id="works"
            className="relative overflow-hidden bg-ink py-24 sm:py-32"
            data-testid="project-scroll-gallery"
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
                        id="scroll-grid"
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
                <rect width="100%" height="100%" fill="url(#scroll-grid)" />
            </svg>

            <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8">
                {/* Header */}
                <Reveal>
                    <TrailHeading
                        n="04"
                        label="Selected Works"
                        color="var(--cp-projects)"
                    />
                </Reveal>
                <Reveal delay={0.08}>
                    <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-white/60">
                        Scroll to climb. The piece you're on lights up — the rest
                        rest in the shadow until you arrive.
                    </p>
                </Reveal>

                {/* Filter tabs (Komoot-style underlined) */}
                <Reveal delay={0.14}>
                    <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-2 border-b border-white/8 pb-1">
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
                                            layoutId="scroll-tab-underline"
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

                {/* Tile stack + sticky mini-chart */}
                <div className="mt-14 grid grid-cols-1 gap-x-10 gap-y-20 lg:grid-cols-[minmax(0,1fr)_220px] lg:gap-y-32">
                    {/* tiles column */}
                    <div className="space-y-20 sm:space-y-28">
                        {shown.map((p, i) => (
                            <div
                                key={p.slug}
                                ref={(el) => {
                                    tilesRef.current[i] = el;
                                }}
                                data-idx={i}
                            >
                                <ProjectTile
                                    p={p}
                                    i={i}
                                    total={shown.length}
                                    isActive={activeIdx === i}
                                    onOpen={setActive}
                                />
                            </div>
                        ))}
                    </div>

                    {/* sticky elevation indicator (desktop only) */}
                    <MiniElevation projects={shown} activeIdx={activeIdx} />
                </div>
            </div>

            <ProjectModal project={active} onClose={() => setActive(null)} />
        </section>
    );
}
