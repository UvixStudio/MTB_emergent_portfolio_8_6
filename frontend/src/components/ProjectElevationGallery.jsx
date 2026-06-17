import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Mountain } from "lucide-react";
import { PROJECTS } from "@/data/content";
import { Reveal, TrailHeading } from "@/components/Primitives";
import ProjectModal from "@/components/ProjectModal";

/* Project Elevation Gallery
   Komoot-style elevation profile where projects sit as peaks along a
   career timeline. x = year, y = scope/impact. Tabs filter the data.
   Minimal by design — the chart carries the story, the cards explain it. */

const ease = [0.22, 1, 0.36, 1];

/* Per-slug timeline + impact (1=base, 10=summit).
   Decimal "year" places projects within the year (0.0=Jan, 0.9=Dec) so
   multiple 2025 pieces don't collapse onto a single x. The displayed
   year is the integer part. */
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

/* Chart viewBox space (SVG units, not pixels) */
const W = 1000;
const H = 340;
const PAD = { top: 38, right: 30, bottom: 56, left: 30 };

const FILTERS = [
    "All",
    "Creative Direction",
    "Immersive / AR",
    "AI Video",
    "3D / Game",
];

/* Position a project in the chart viewBox */
function positionOf(p) {
    const m = META[p.slug] || { year: 2020, impact: 4 };
    const xRange = W - PAD.left - PAD.right;
    const yRange = H - PAD.top - PAD.bottom;
    const x = PAD.left + ((m.year - YEAR_MIN) / (YEAR_MAX - YEAR_MIN)) * xRange;
    const y = PAD.top + ((10 - m.impact) / 10) * yRange;
    return { x, y, year: Math.floor(m.year), impact: m.impact };
}

/* Smooth Catmull-Rom curve through an ordered set of points */
function smoothPath(points) {
    if (points.length < 2) return "";
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[i - 1] || points[i];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = points[i + 2] || points[i + 1];
        const cp1x = p1.x + (p2.x - p0.x) / 6;
        const cp1y = p1.y + (p2.y - p0.y) / 6;
        const cp2x = p2.x - (p3.x - p1.x) / 6;
        const cp2y = p2.y - (p3.y - p1.y) / 6;
        d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return d;
}

/* ── Single marker on the elevation line ───────────────────────── */
function PeakMarker({ p, pos, i, hovered, setHovered, onOpen }) {
    const isOn = hovered === p.slug;
    return (
        <g
            transform={`translate(${pos.x} ${pos.y})`}
            style={{ cursor: "pointer" }}
            onMouseEnter={() => setHovered(p.slug)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => onOpen(p)}
            data-cursor="view"
            data-cursor-label="View"
            data-testid={`elev-peak-${p.slug}`}
        >
            {/* outer halo */}
            <motion.circle
                r={isOn ? 14 : 9}
                fill="rgba(250,204,21,0.18)"
                animate={{
                    r: isOn ? [9, 16, 9] : 9,
                    opacity: isOn ? 1 : 0.6,
                }}
                transition={{
                    duration: 1.4,
                    repeat: isOn ? Infinity : 0,
                    ease: "easeInOut",
                }}
            />
            {/* ring */}
            <circle
                r={5.5}
                fill="none"
                stroke="rgba(250,204,21,0.9)"
                strokeWidth={1.4}
            />
            {/* core dot */}
            <circle r={2.6} fill="var(--brand)" />
            {/* upright stem connecting marker to baseline (subtle) */}
            <line
                x1={0}
                y1={6}
                x2={0}
                y2={H - PAD.bottom - pos.y - 4}
                stroke="rgba(250,204,21,0.18)"
                strokeWidth={0.6}
                strokeDasharray="2 3"
            />
        </g>
    );
}

/* ── Floating preview card that follows the hovered marker ─────── */
function PreviewCard({ p, pos, chartRect }) {
    if (!p || !pos || !chartRect) return null;
    /* Convert chart viewBox coords → pixel coords inside the chart wrapper */
    const sx = chartRect.width / W;
    const sy = chartRect.height / H;
    const left = pos.x * sx;
    const top = pos.y * sy;
    /* Flip card if it would overflow right edge */
    const flip = left > chartRect.width * 0.65;
    return (
        <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.18, ease }}
            className="pointer-events-none absolute z-30 w-52"
            style={{
                left: flip ? "auto" : left + 16,
                right: flip ? chartRect.width - left + 16 : "auto",
                top: top - 90,
            }}
        >
            <div
                className="overflow-hidden bg-[#0e1a2b]/95 backdrop-blur-md"
                style={{
                    border: `1px solid rgba(250,204,21,0.35)`,
                    boxShadow: "0 18px 38px -16px rgba(0,0,0,0.7)",
                }}
            >
                {p.thumb ? (
                    <div className="aspect-[16/10] w-full overflow-hidden">
                        <img
                            src={p.thumb}
                            alt={p.title}
                            className="h-full w-full object-cover"
                        />
                    </div>
                ) : (
                    <div className="grid aspect-[16/10] w-full place-items-center bg-gradient-to-br from-[#17293b] to-[#0a1424]">
                        <Mountain
                            size={26}
                            strokeWidth={1.5}
                            className="text-white/25"
                        />
                    </div>
                )}
                <div className="px-3 py-2.5">
                    <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-brand">
                        {p.role}
                    </span>
                    <h3 className="mt-0.5 font-display text-[13px] font-black uppercase leading-tight tracking-tight text-white">
                        {p.title}
                    </h3>
                </div>
            </div>
        </motion.div>
    );
}

/* ── Stat card (matches Komoot Uphill/Downhill cells) ──────────── */
function StatCell({ label, value, sub }) {
    return (
        <div className="border-t border-white/8 pt-4">
            <div className="font-display text-2xl font-black text-white sm:text-3xl">
                {value}
            </div>
            <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">
                {label}
            </div>
            {sub && (
                <div className="mt-0.5 text-[11px] text-white/55">{sub}</div>
            )}
        </div>
    );
}

/* ── Main component ────────────────────────────────────────────── */
export default function ProjectElevationGallery() {
    const [cat, setCat] = useState("All");
    const [active, setActive] = useState(null);
    const [hovered, setHovered] = useState(null);
    const [chartRect, setChartRect] = useState(null);

    /* Filter + sort + position the projects */
    const positioned = useMemo(() => {
        const filtered =
            cat === "All"
                ? PROJECTS
                : PROJECTS.filter((p) => p.category === cat);
        return filtered
            .map((p) => ({ ...p, pos: positionOf(p) }))
            .sort((a, b) => a.pos.x - b.pos.x);
    }, [cat]);

    /* Build the silhouette + area-fill paths */
    const { linePath, areaPath } = useMemo(() => {
        if (positioned.length < 2) {
            return { linePath: "", areaPath: "" };
        }
        const line = smoothPath(positioned.map((p) => p.pos));
        const first = positioned[0].pos;
        const last = positioned[positioned.length - 1].pos;
        const baseY = H - PAD.bottom;
        const area = `${line} L ${last.x} ${baseY} L ${first.x} ${baseY} Z`;
        return { linePath: line, areaPath: area };
    }, [positioned]);

    /* Derived stats */
    const stats = useMemo(() => {
        const years = positioned.map((p) => p.pos.year);
        const cats = new Set(positioned.map((p) => p.category));
        return {
            yearsRange:
                years.length > 0
                    ? `${Math.min(...years)}–${Math.max(...years)}`
                    : "—",
            count: positioned.length,
            categories: cats.size,
            highest:
                positioned.length > 0
                    ? positioned.reduce((a, b) =>
                          a.pos.impact > b.pos.impact ? a : b
                      ).title
                    : "—",
        };
    }, [positioned]);

    const hoveredP = positioned.find((p) => p.slug === hovered);

    /* Measure chart wrapper for preview positioning — ResizeObserver so the
       preview keeps tracking the SVG when the viewport changes, without an
       update loop. */
    const chartRef = useRef(null);
    useEffect(() => {
        const node = chartRef.current;
        if (!node || typeof ResizeObserver === "undefined") return;
        const update = () => {
            const r = node.getBoundingClientRect();
            setChartRect((prev) => {
                if (prev && prev.width === r.width && prev.height === r.height) {
                    return prev;
                }
                return { width: r.width, height: r.height };
            });
        };
        update();
        const ro = new ResizeObserver(update);
        ro.observe(node);
        return () => ro.disconnect();
    }, []);

    return (
        <section
            id="works"
            className="relative overflow-hidden bg-ink py-24 sm:py-32"
            data-testid="project-elevation-gallery"
        >
            {/* faint topographic grid backdrop */}
            <svg
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 h-full w-full opacity-40"
                width="100%"
                height="100%"
            >
                <defs>
                    <pattern
                        id="elev-grid"
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
                <rect width="100%" height="100%" fill="url(#elev-grid)" />
            </svg>

            <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8">
                <Reveal>
                    <TrailHeading
                        n="04"
                        label="Selected Works"
                        color="var(--cp-projects)"
                    />
                </Reveal>
                <Reveal delay={0.08}>
                    <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-white/60">
                        A career as an elevation profile. Each peak is a project — the
                        higher the peak, the deeper the scope. Tap a marker to open
                        its case.
                    </p>
                </Reveal>

                {/* Filter tabs (Komoot Route|Elevation|Speed style) */}
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
                                            layoutId="elev-tab-underline"
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

                {/* Chart title row */}
                <Reveal delay={0.18}>
                    <div className="mt-8 flex items-end justify-between">
                        <div>
                            <h3 className="font-display text-2xl font-black uppercase tracking-tight text-white sm:text-3xl">
                                Project Elevation
                            </h3>
                            <p className="mt-1 text-[12px] uppercase tracking-[0.18em] text-white/40">
                                {cat === "All"
                                    ? "Whole trail"
                                    : `Filtered · ${cat}`}
                            </p>
                        </div>
                        <div className="hidden text-right text-[10px] uppercase tracking-[0.22em] text-white/40 sm:block">
                            ▲ peak = larger scope
                        </div>
                    </div>
                </Reveal>

                {/* The chart */}
                <Reveal delay={0.24}>
                    <div ref={chartRef} className="relative mt-6 w-full">
                        <svg
                            viewBox={`0 0 ${W} ${H}`}
                            preserveAspectRatio="none"
                            className="block w-full"
                            style={{ height: "auto", aspectRatio: `${W} / ${H}` }}
                        >
                            <defs>
                                <linearGradient
                                    id="elev-fill"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop
                                        offset="0%"
                                        stopColor="rgba(250,204,21,0.35)"
                                    />
                                    <stop
                                        offset="60%"
                                        stopColor="rgba(250,204,21,0.10)"
                                    />
                                    <stop
                                        offset="100%"
                                        stopColor="rgba(250,204,21,0)"
                                    />
                                </linearGradient>
                            </defs>

                            {/* horizontal reference lines */}
                            {[0.25, 0.5, 0.75].map((r, i) => (
                                <line
                                    key={i}
                                    x1={PAD.left}
                                    y1={PAD.top + r * (H - PAD.top - PAD.bottom)}
                                    x2={W - PAD.right}
                                    y2={PAD.top + r * (H - PAD.top - PAD.bottom)}
                                    stroke="rgba(255,255,255,0.05)"
                                    strokeDasharray="2 4"
                                />
                            ))}

                            {/* baseline */}
                            <line
                                x1={PAD.left}
                                y1={H - PAD.bottom}
                                x2={W - PAD.right}
                                y2={H - PAD.bottom}
                                stroke="rgba(255,255,255,0.15)"
                            />

                            {/* timeline x-axis tick marks */}
                            {TICKS.map((y) => {
                                const xRange = W - PAD.left - PAD.right;
                                const x =
                                    PAD.left +
                                    ((y - YEAR_MIN) /
                                        (YEAR_MAX - YEAR_MIN)) *
                                        xRange;
                                return (
                                    <g key={y}>
                                        <line
                                            x1={x}
                                            y1={H - PAD.bottom}
                                            x2={x}
                                            y2={H - PAD.bottom + 4}
                                            stroke="rgba(255,255,255,0.25)"
                                        />
                                        <text
                                            x={x}
                                            y={H - PAD.bottom + 18}
                                            textAnchor="middle"
                                            fontFamily="Unbounded, sans-serif"
                                            fontSize="9"
                                            fontWeight="700"
                                            letterSpacing="0.18em"
                                            fill="rgba(255,255,255,0.32)"
                                        >
                                            {y}
                                        </text>
                                    </g>
                                );
                            })}

                            {/* Area fill */}
                            <motion.path
                                d={areaPath}
                                fill="url(#elev-fill)"
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 1.1, ease }}
                            />

                            {/* Silhouette line */}
                            <motion.path
                                d={linePath}
                                fill="none"
                                stroke="rgba(250,204,21,0.95)"
                                strokeWidth={1.7}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                initial={{ pathLength: 0 }}
                                whileInView={{ pathLength: 1 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 1.4, ease }}
                            />

                            {/* Markers */}
                            {positioned.map((p, i) => (
                                <PeakMarker
                                    key={p.slug}
                                    p={p}
                                    pos={p.pos}
                                    i={i}
                                    hovered={hovered}
                                    setHovered={setHovered}
                                    onOpen={setActive}
                                />
                            ))}

                            {/* Start/finish glyphs */}
                            {positioned.length > 0 && (
                                <>
                                    <g
                                        transform={`translate(${
                                            positioned[0].pos.x - 22
                                        } ${H - PAD.bottom - 8})`}
                                    >
                                        <circle
                                            r={8}
                                            fill="rgba(255,255,255,0.06)"
                                            stroke="rgba(255,255,255,0.25)"
                                            strokeWidth={0.8}
                                        />
                                        <polygon
                                            points="-2,-3 3,0 -2,3"
                                            fill="rgba(255,255,255,0.55)"
                                        />
                                    </g>
                                    <g
                                        transform={`translate(${
                                            positioned[positioned.length - 1]
                                                .pos.x + 22
                                        } ${H - PAD.bottom - 8})`}
                                    >
                                        <circle
                                            r={8}
                                            fill="rgba(250,204,21,0.18)"
                                            stroke="rgba(250,204,21,0.7)"
                                            strokeWidth={0.8}
                                        />
                                        <path
                                            d="M-2,-3 L-2,3 L3,1 L-2,-1 Z"
                                            fill="var(--brand)"
                                        />
                                    </g>
                                </>
                            )}
                        </svg>

                        {/* preview card (HTML overlay, positioned in pixel space) */}
                        <AnimatePresence>
                            {hoveredP && (
                                <PreviewCard
                                    key={hoveredP.slug}
                                    p={hoveredP}
                                    pos={hoveredP.pos}
                                    chartRect={chartRect}
                                />
                            )}
                        </AnimatePresence>
                    </div>
                </Reveal>

                {/* Stat cells (Komoot Uphill/Downhill/Highest/Lowest analog) */}
                <Reveal delay={0.3}>
                    <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-4">
                        <StatCell label="Years" value={stats.yearsRange} />
                        <StatCell
                            label="Peaks"
                            value={stats.count}
                            sub="on this trail"
                        />
                        <StatCell label="Disciplines" value={stats.categories} />
                        <StatCell
                            label="Summit"
                            value="▲"
                            sub={stats.highest}
                        />
                    </div>
                </Reveal>

                {/* Project chips — quick scrubber */}
                <Reveal delay={0.36}>
                    <div className="mt-12 flex flex-wrap gap-2.5">
                        {positioned.map((p) => (
                            <button
                                key={p.slug}
                                onMouseEnter={() => setHovered(p.slug)}
                                onMouseLeave={() => setHovered(null)}
                                onClick={() => setActive(p)}
                                className="group inline-flex items-center gap-2 border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-white/65 transition hover:border-brand/60 hover:text-white"
                                style={{
                                    background:
                                        hovered === p.slug
                                            ? "rgba(250,204,21,0.10)"
                                            : "rgba(255,255,255,0.03)",
                                    borderColor:
                                        hovered === p.slug
                                            ? "rgba(250,204,21,0.5)"
                                            : "rgba(255,255,255,0.10)",
                                }}
                                data-cursor="view"
                                data-cursor-label="Open"
                                data-testid={`elev-chip-${p.slug}`}
                            >
                                <span
                                    className="inline-block h-1.5 w-1.5 rounded-full"
                                    style={{ background: "var(--brand)" }}
                                />
                                {p.title}
                                <ArrowUpRight
                                    size={11}
                                    strokeWidth={2.5}
                                    className="opacity-50 transition-opacity group-hover:opacity-100"
                                />
                            </button>
                        ))}
                    </div>
                </Reveal>
            </div>

            <ProjectModal project={active} onClose={() => setActive(null)} />
        </section>
    );
}
