import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Mountain, ChevronLeft, ChevronRight } from "lucide-react";
import { PROJECTS } from "@/data/content";
import { Reveal, TrailHeading } from "@/components/Primitives";
import ProjectModal from "@/components/ProjectModal";

/* ── Project Elevation Gallery ──────────────────────────────────
   Komoot/Strava-style elevation profile as main navigation.
   Projects = peaks on a mountain ridge. x = years, y = scope.
   Mountain background with parallax depth.
   Mobile: chart collapses to thin strip, cards stack.          */

const ease = [0.22, 1, 0.36, 1];

const META = {
    "paymax":           { year: 2018.5, impact: 6 },
    "coderz":           { year: 2022.6, impact: 8 },
    "promee":           { year: 2025.1, impact: 5 },
    "digitel-tlv":      { year: 2025.3, impact: 6 },
    "bone-bash":        { year: 2025.5, impact: 7 },
    "ten-li-rocknroll": { year: 2025.7, impact: 4 },
    "baboon-of-jafa":   { year: 2025.9, impact: 4 },
    "beit-hagefen":     { year: 2026.4, impact: 10 },
};

const YEAR_MIN = 2010;
const YEAR_MAX = 2026;
const TICKS = [2010, 2014, 2018, 2022, 2026];
const W = 1200;
const H = 400;
const PAD = { top: 48, right: 40, bottom: 64, left: 40 };
const FILTERS = ["All", "Creative Direction", "Immersive / AR", "AI Video", "3D / Game"];

const chamfer = (c) =>
    `polygon(0 ${c}px, ${c}px 0, calc(100% - ${c}px) 0, 100% ${c}px, 100% calc(100% - ${c}px), calc(100% - ${c}px) 100%, ${c}px 100%, 0 calc(100% - ${c}px))`;

function pos(p) {
    const m = META[p.slug] || { year: 2020, impact: 4 };
    const xR = W - PAD.left - PAD.right;
    const yR = H - PAD.top - PAD.bottom;
    return {
        x: PAD.left + ((m.year - YEAR_MIN) / (YEAR_MAX - YEAR_MIN)) * xR,
        y: PAD.top + ((10 - m.impact) / 10) * yR,
        year: Math.floor(m.year),
        impact: m.impact,
    };
}

function smooth(points) {
    if (points.length < 2) return "";
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[i - 1] || points[i];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = points[i + 2] || points[i + 1];
        d += ` C ${p1.x + (p2.x - p0.x) / 6} ${p1.y + (p2.y - p0.y) / 6}, ${p2.x - (p3.x - p1.x) / 6} ${p2.y - (p3.y - p1.y) / 6}, ${p2.x} ${p2.y}`;
    }
    return d;
}

/* ── Peak marker ─────────────────────────────────────────────── */
function PeakDot({ p, pt, idx, active, onSelect, onPreview }) {
    const isOn = active === idx;
    return (
        <g
            transform={`translate(${pt.x} ${pt.y})`}
            style={{ cursor: "pointer" }}
            onClick={() => onSelect(p)}
            onMouseEnter={() => onPreview(idx)}
            onMouseLeave={() => onPreview(null)}
            data-cursor="view"
            data-cursor-label="View"
        >
            {/* Pulse ring */}
            {isOn && (
                <motion.circle
                    r={6}
                    fill="none"
                    stroke="rgba(250,204,21,0.3)"
                    strokeWidth={2}
                    initial={{ r: 6, opacity: 0.8 }}
                    animate={{ r: [6, 18, 6], opacity: [0.8, 0, 0.8] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
            )}
            {/* Hover glow */}
            <motion.circle
                r={isOn ? 16 : 10}
                fill={isOn ? "rgba(250,204,21,0.2)" : "rgba(250,204,21,0)"}
                animate={{ r: isOn ? 16 : 10 }}
                transition={{ duration: 0.3, ease }}
            />
            {/* Core */}
            <circle r={isOn ? 6 : 4} fill={isOn ? "var(--brand)" : "rgba(255,255,255,0.35)"} />
            <circle r={isOn ? 8 : 5} fill="none" stroke={isOn ? "var(--brand)" : "rgba(255,255,255,0.15)"} strokeWidth={isOn ? 1.5 : 1} />
            {/* Invisible touch area */}
            <circle r={18} fill="transparent" />
        </g>
    );
}

/* ── Main ─────────────────────────────────────────────────────── */
export default function ProjectElevationGallery() {
    const [cat, setCat] = useState("All");
    const [activeIdx, setActiveIdx] = useState(0);
    const [previewIdx, setPreviewIdx] = useState(null);
    const [modalProject, setModalProject] = useState(null);
    const chartRef = useRef(null);
    const sectionRef = useRef(null);

    /* Parallax */
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"],
    });
    const bgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
    const mountainY = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

    const filtered = useMemo(() => {
        const f = cat === "All" ? PROJECTS : PROJECTS.filter((p) => p.category === cat);
        return f.map((p) => ({ ...p, pos: pos(p) })).sort((a, b) => a.pos.x - b.pos.x);
    }, [cat]);

    const { linePath, areaPath } = useMemo(() => {
        if (filtered.length < 2) return { linePath: "", areaPath: "" };
        const line = smooth(filtered.map((p) => p.pos));
        const first = filtered[0].pos;
        const last = filtered[filtered.length - 1].pos;
        const baseY = H - PAD.bottom;
        return { linePath: line, areaPath: `${line} L ${last.x} ${baseY} L ${first.x} ${baseY} Z` };
    }, [filtered]);

    const activeProject = filtered[activeIdx];
    const hoveredProject = previewIdx !== null ? filtered[previewIdx] : activeProject;

    /* Nav arrows */
    const goPrev = () => setActiveIdx((i) => Math.max(0, i - 1));
    const goNext = () => setActiveIdx((i) => Math.min(filtered.length - 1, i + 1));

    return (
        <section
            id="works"
            ref={sectionRef}
            className="relative overflow-hidden bg-ink"
            data-testid="project-elevation-gallery"
        >
            {/* ── Mountain parallax background ── */}
            <motion.div
                className="pointer-events-none absolute inset-0 overflow-hidden"
                style={{ y: bgY }}
            >
                <motion.div
                    className="absolute inset-0 bg-cover bg-center opacity-[0.07]"
                    style={{
                        backgroundImage: "url('/projects/_scene/mountain.png')",
                        y: mountainY,
                    }}
                />
                {/* Topographic grid overlay */}
                <svg
                    aria-hidden="true"
                    className="absolute inset-0 h-full w-full opacity-[0.03]"
                    width="100%"
                    height="100%"
                >
                    <defs>
                        <pattern id="elev-contour" width="80" height="80" patternUnits="userSpaceOnUse">
                            <path d="M 80 0 L 0 0 0 80" fill="none" stroke="rgba(250,204,21,0.5)" strokeWidth="0.5" />
                            <circle cx="40" cy="40" r="20" fill="none" stroke="rgba(250,204,21,0.3)" strokeWidth="0.5" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#elev-contour)" />
                </svg>
            </motion.div>

            {/* ── Dark gradient overlay for readability ── */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                    background: "linear-gradient(180deg, var(--ink) 0%, transparent 15%, transparent 85%, var(--ink) 100%)",
                }}
            />

            {/* ── Content ── */}
            <div className="relative z-10 mx-auto max-w-7xl px-6 py-24 sm:px-8 sm:py-32">
                {/* Header */}
                <Reveal>
                    <TrailHeading n="04" label="Selected Works" color="var(--cp-projects)" />
                </Reveal>
                <Reveal delay={0.08}>
                    <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-white/60">
                        A career as an elevation profile. Each peak is a project — the higher the summit, the deeper the scope. Scroll, hover peaks, or tap to open a case.
                    </p>
                </Reveal>

                {/* Filter tabs */}
                <Reveal delay={0.14}>
                    <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-2 border-b border-white/8 pb-1">
                        {FILTERS.map((f) => {
                            const on = f === cat;
                            return (
                                <button key={f} onClick={() => { setCat(f); setActiveIdx(0); }}
                                    className="relative pb-3 font-display text-[12px] font-bold uppercase tracking-[0.16em] transition-colors"
                                    style={{ color: on ? "#ffffff" : "rgba(255,255,255,0.5)" }}
                                    data-cursor="link"
                                >
                                    {f}
                                    {on && (
                                        <motion.span layoutId="elev-tab-line"
                                            className="absolute -bottom-px left-0 right-0 h-0.5 bg-brand"
                                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </Reveal>

                {/* ── Main: Chart + Active Card side by side ── */}
                <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-5">
                    {/* Chart — takes 3/5 on desktop */}
                    <div className="relative lg:col-span-3">
                        <Reveal delay={0.18}>
                            <div className="relative">
                                {/* Elevation SVG — fills width */}
                                <svg
                                    viewBox={`0 0 ${W} ${H}`}
                                    preserveAspectRatio="none"
                                    className="block w-full"
                                    style={{ height: "auto", aspectRatio: `${W} / ${H}` }}
                                >
                                    <defs>
                                        <linearGradient id="elev-fill" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="rgba(250,204,21,0.3)" />
                                            <stop offset="100%" stopColor="rgba(250,204,21,0)" />
                                        </linearGradient>
                                    </defs>

                                    {/* Grid lines */}
                                    {[0.25, 0.5, 0.75].map((r, i) => (
                                        <line key={i}
                                            x1={PAD.left} y1={PAD.top + r * (H - PAD.top - PAD.bottom)}
                                            x2={W - PAD.right} y2={PAD.top + r * (H - PAD.top - PAD.bottom)}
                                            stroke="rgba(255,255,255,0.04)" strokeDasharray="2 6" />
                                    ))}

                                    {/* Baseline */}
                                    <line x1={PAD.left} y1={H - PAD.bottom}
                                        x2={W - PAD.right} y2={H - PAD.bottom}
                                        stroke="rgba(255,255,255,0.12)" />

                                    {/* Year ticks */}
                                    {TICKS.map((y) => {
                                        const x = PAD.left + ((y - YEAR_MIN) / (YEAR_MAX - YEAR_MIN)) * (W - PAD.left - PAD.right);
                                        return (
                                            <g key={y}>
                                                <line x1={x} y1={H - PAD.bottom} x2={x} y2={H - PAD.bottom + 6} stroke="rgba(255,255,255,0.2)" />
                                                <text x={x} y={H - PAD.bottom + 20}
                                                    textAnchor="middle" fontFamily="Unbounded, sans-serif"
                                                    fontSize="9" fontWeight="700" letterSpacing="0.18em"
                                                    fill="rgba(255,255,255,0.3)">
                                                    {y}
                                                </text>
                                            </g>
                                        );
                                    })}

                                    {/* Area fill */}
                                    <motion.path d={areaPath} fill="url(#elev-fill)"
                                        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
                                        viewport={{ once: true }} transition={{ duration: 1, ease }} />

                                    {/* Trail line */}
                                    <motion.path d={linePath} fill="none"
                                        stroke="rgba(250,204,21,0.9)" strokeWidth={2}
                                        strokeLinecap="round" strokeLinejoin="round"
                                        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
                                        viewport={{ once: true }} transition={{ duration: 1.4, ease }} />

                                    {/* Peaks as dots */}
                                    {filtered.map((p, i) => (
                                        <PeakDot key={p.slug} p={p} pt={p.pos} idx={i}
                                            active={previewIdx ?? activeIdx}
                                            onSelect={setModalProject}
                                            onPreview={setPreviewIdx} />
                                    ))}

                                    {/* Start / Finish flags */}
                                    {filtered.length > 1 && (
                                        <>
                                            <g transform={`translate(${filtered[0].pos.x} ${H - PAD.bottom})`}>
                                                <polygon points="-4,-14 6,-10 -4,-6" fill="rgba(255,255,255,0.4)" />
                                                <text x={filtered[0].pos.x - 14} y={H - PAD.bottom + 18}
                                                    textAnchor="end" fontFamily="Unbounded, sans-serif"
                                                    fontSize="8" fontWeight="800" letterSpacing="0.2em"
                                                    fill="rgba(255,255,255,0.3)">START</text>
                                            </g>
                                            <g transform={`translate(${filtered[filtered.length - 1].pos.x} ${H - PAD.bottom})`}>
                                                <path d="M-4,-14 L2,-10 L-4,-6 Z" fill="var(--brand)" />
                                                <text x={filtered[filtered.length - 1].pos.x + 14} y={H - PAD.bottom + 18}
                                                    textAnchor="start" fontFamily="Unbounded, sans-serif"
                                                    fontSize="8" fontWeight="800" letterSpacing="0.2em"
                                                    fill="var(--brand)">FINISH</text>
                                            </g>
                                        </>
                                    )}
                                </svg>

                                {/* Peak name label below chart */}
                                <div className="mt-2 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.2em]">
                                    <span className="text-white/30">{filtered.length} peaks · {cat}</span>
                                    {hoveredProject && (
                                        <motion.span key={hoveredProject.slug}
                                            initial={{ opacity: 0, y: 4 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-brand">
                                            ▲ {hoveredProject.title}
                                        </motion.span>
                                    )}
                                </div>
                            </div>
                        </Reveal>
                    </div>

                    {/* ── Active project card — 2/5 on desktop ── */}
                    <div className="lg:col-span-2">
                        <AnimatePresence mode="wait">
                            {hoveredProject && (
                                <motion.div key={hoveredProject.slug}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.35, ease }}
                                    className="group"
                                >
                                    {/* Image */}
                                    <div
                                        className="relative w-full overflow-hidden bg-ink-2"
                                        style={{ clipPath: chamfer(14) }}
                                    >
                                        {hoveredProject.thumb ? (
                                            <img src={hoveredProject.thumb} alt={hoveredProject.title}
                                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                                                style={{ aspectRatio: "16/10" }} />
                                        ) : (
                                            <div className="grid h-full w-full place-items-center bg-gradient-to-br from-[#17293B] to-[#0a1424]"
                                                style={{ aspectRatio: "16/10" }}>
                                                <Mountain size={48} strokeWidth={1.2} className="text-white/15" />
                                            </div>
                                        )}
                                        <div aria-hidden="true" className="absolute inset-0"
                                            style={{
                                                background: "linear-gradient(180deg, transparent 35%, rgba(6,11,19,0.55) 70%, rgba(6,11,19,0.97))",
                                            }}
                                        />
                                        {/* Brand glow edge */}
                                        <motion.div aria-hidden="true"
                                            className="pointer-events-none absolute inset-0"
                                            style={{ boxShadow: "inset 0 0 40px 4px rgba(250,204,21,0.15)", clipPath: chamfer(14) }}
                                        />

                                        {/* Cat + Year */}
                                        <div className="absolute left-5 top-5 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em]">
                                            <span className="text-brand">{hoveredProject.category}</span>
                                            <span className="h-1 w-1 rounded-full bg-white/30" />
                                            <span className="text-white/50">{hoveredProject.year}</span>
                                        </div>

                                        {/* Title + CTA */}
                                        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                                            <h3 className="font-display text-xl font-black uppercase leading-[0.95] tracking-tight text-white sm:text-2xl">
                                                {hoveredProject.title}
                                            </h3>
                                            <p className="mt-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white/55">
                                                {hoveredProject.role}
                                            </p>
                                            <p className="mt-2 max-w-md text-sm leading-relaxed text-white/70 line-clamp-2">
                                                {hoveredProject.tagline}
                                            </p>
                                            <button onClick={() => setModalProject(hoveredProject)}
                                                className="mt-4 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-brand transition-colors hover:text-white">
                                                View case study
                                                <ArrowUpRight size={12} strokeWidth={2.5} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Nav arrows */}
                                    <div className="mt-4 flex items-center justify-between">
                                        <button onClick={goPrev} disabled={activeIdx === 0}
                                            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 transition-colors hover:text-white disabled:opacity-20"
                                            data-cursor="link">
                                            <ChevronLeft size={14} />
                                            Previous
                                        </button>
                                        <span className="font-display text-xs font-black tracking-[0.3em] text-white/30">
                                            {String(activeIdx + 1).padStart(2, "0")}/{String(filtered.length).padStart(2, "0")}
                                        </span>
                                        <button onClick={goNext} disabled={activeIdx >= filtered.length - 1}
                                            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 transition-colors hover:text-white disabled:opacity-20"
                                            data-cursor="link">
                                            Next
                                            <ChevronRight size={14} />
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* ── Project chips (quick scrub) ── */}
                <Reveal delay={0.3}>
                    <div className="mt-12 flex flex-wrap gap-2.5">
                        {filtered.map((p, i) => {
                            const isOn = (previewIdx ?? activeIdx) === i;
                            return (
                                <button key={p.slug}
                                    onClick={() => { setActiveIdx(i); setPreviewIdx(null); }}
                                    onMouseEnter={() => setPreviewIdx(i)}
                                    onMouseLeave={() => setPreviewIdx(null)}
                                    className="group inline-flex items-center gap-2 border px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-white/65 transition-all hover:text-white"
                                    style={{
                                        borderColor: isOn ? "rgba(250,204,21,0.5)" : "rgba(255,255,255,0.1)",
                                        background: isOn ? "rgba(250,204,21,0.1)" : "rgba(255,255,255,0.03)",
                                    }}
                                    data-cursor="link"
                                >
                                    <span className="inline-block h-1.5 w-1.5 rounded-full"
                                        style={{ background: isOn ? "var(--brand)" : "rgba(255,255,255,0.3)" }}
                                    />
                                    {p.title}
                                </button>
                            );
                        })}
                    </div>
                </Reveal>
            </div>

            <ProjectModal project={modalProject} onClose={() => setModalProject(null)} />
        </section>
    );
}
