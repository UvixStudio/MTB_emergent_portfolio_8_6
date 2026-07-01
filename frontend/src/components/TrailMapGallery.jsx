import { useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Mountain } from "lucide-react";
import { PROJECTS, PROJECT_CATEGORIES } from "@/data/content";
import { Reveal, TrailHeading } from "@/components/Primitives";
import ProjectModal from "@/components/ProjectModal";

const MAP_SRC = "/projects/_scene/trail-map.png";
const ease = [0.22, 1, 0.36, 1];
const clip = (c) =>
    `polygon(0 0, calc(100% - ${c}px) 0, 100% ${c}px, 100% 100%, ${c}px 100%, 0 calc(100% - ${c}px))`;

/* Per-slug position on the map (% from top-left). Tuned to follow the
   winding trail from a low base on the left up to the ridge on the right. */
const MAP_POS = {
    "coderz":           { x: 14, y: 78 },
    "paymax":           { x: 26, y: 64 },
    "beit-hagefen":     { x: 38, y: 52 },
    "promee":           { x: 48, y: 38 },
    "digitel-tlv":      { x: 44, y: 22 },
    "bone-bash":        { x: 60, y: 30 },
    "ten-li-rocknroll": { x: 70, y: 48 },
    "baboon-of-jafa":   { x: 84, y: 32 },
};

/* SVG path that traces between the markers (viewBox 0..100, fluid) */
const TRAIL_D =
    "M 14 78 Q 22 70 26 64 T 38 52 T 48 38 T 44 22 T 60 30 T 70 48 T 84 32";

/* ── Desktop marker on the map ─────────────────────────────────── */
function Marker({ p, i, onOpen, hoveredSlug, setHoveredSlug }) {
    const pos = MAP_POS[p.slug] || { x: 50, y: 50 };
    const isActive = hoveredSlug === p.slug;
    const previewLeft = pos.x > 65; // flip preview to the left near the right edge
    const previewUp = pos.y > 55;   // flip preview upward when low on the map

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.4 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{
                delay: 0.25 + i * 0.07,
                duration: 0.55,
                ease: [0.34, 1.56, 0.64, 1],
            }}
            className="absolute"
            style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                transform: "translate(-50%, -50%)",
                zIndex: isActive ? 30 : 20,
            }}
            onMouseEnter={() => setHoveredSlug(p.slug)}
            onMouseLeave={() => setHoveredSlug(null)}
        >
            <button
                onClick={() => onOpen(p)}
                aria-label={`Open ${p.title}`}
                data-testid={`map-marker-${p.slug}`}
                className="group relative block"
            >
                {/* pulsing halo */}
                <motion.span
                    aria-hidden="true"
                    animate={{
                        scale: isActive ? [1, 1.6, 1] : [1, 1.35, 1],
                        opacity: isActive ? [0.55, 0, 0.55] : [0.4, 0, 0.4],
                    }}
                    transition={{
                        duration: isActive ? 1.2 : 2.4,
                        repeat: Infinity,
                        ease: "easeOut",
                        delay: i * 0.25,
                    }}
                    className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full"
                    style={{ background: `${p.accent}55` }}
                />
                {/* core dot */}
                <span
                    className="relative grid h-10 w-10 place-items-center rounded-full font-display text-[11px] font-black ring-2 ring-black/40 transition-transform duration-300 group-hover:scale-110"
                    style={{
                        background: p.accent,
                        color: "#0a0a0a",
                        boxShadow: `0 6px 18px ${p.accent}66, inset 0 0 0 2px rgba(255,255,255,0.18)`,
                    }}
                >
                    {String(i + 1).padStart(2, "0")}
                </span>
            </button>

            {/* preview card (positioned to avoid overflow) */}
            <AnimatePresence>
                {isActive && (
                    <motion.div
                        initial={{ opacity: 0, y: previewUp ? -8 : 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: previewUp ? -8 : 8, scale: 0.96 }}
                        transition={{ duration: 0.22, ease }}
                        className="pointer-events-none absolute w-56"
                        style={{
                            left: previewLeft ? "auto" : "calc(100% + 14px)",
                            right: previewLeft ? "calc(100% + 14px)" : "auto",
                            top: previewUp ? "auto" : "0",
                            bottom: previewUp ? "0" : "auto",
                        }}
                    >
                        <div
                            className="overflow-hidden bg-[#0c0c0e]/95 backdrop-blur-md"
                            style={{
                                clipPath: clip(10),
                                boxShadow: `0 18px 38px -16px #000, inset 0 0 0 1px ${p.accent}55`,
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
                                <div
                                    className="grid aspect-[16/10] w-full place-items-center"
                                    style={{
                                        background:
                                            "linear-gradient(140deg,#15151a,#0b0b0d)",
                                    }}
                                >
                                    <Mountain
                                        size={26}
                                        className="text-white/25"
                                        strokeWidth={1.5}
                                    />
                                </div>
                            )}
                            <div className="px-3 py-2.5">
                                <span
                                    className="text-[10px] font-bold uppercase tracking-[0.16em]"
                                    style={{ color: p.accent }}
                                >
                                    {p.role}
                                </span>
                                <h3 className="mt-0.5 font-display text-[13px] font-black uppercase leading-tight tracking-tight text-white">
                                    {p.title}
                                </h3>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

/* ── Mobile card (vertical list fallback) ─────────────────────── */
function MobileCard({ p, i, onOpen }) {
    return (
        <motion.button
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: i * 0.05, ease }}
            onClick={() => onOpen(p)}
            className="group relative block w-full text-left"
            data-testid={`mobile-project-${p.slug}`}
        >
            <div
                className="relative overflow-hidden bg-[#0c0c0e]"
                style={{
                    clipPath: clip(12),
                    boxShadow: `0 18px 36px -18px #000, inset 0 0 0 1px ${p.accent}33`,
                }}
            >
                <div className="relative aspect-[16/9] w-full overflow-hidden">
                    {p.thumb ? (
                        <img
                            src={p.thumb}
                            alt={p.title}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                    ) : (
                        <div
                            className="grid h-full w-full place-items-center"
                            style={{
                                background:
                                    "linear-gradient(150deg,#16161c,#0b0b0d)",
                            }}
                        >
                            <Mountain
                                size={28}
                                className="text-white/25"
                                strokeWidth={1.5}
                            />
                        </div>
                    )}
                    <div
                        className="absolute inset-0"
                        style={{
                            background:
                                "linear-gradient(180deg, transparent 38%, rgba(8,8,8,0.6), rgba(8,8,8,0.92))",
                        }}
                    />
                    <span
                        className="absolute left-3 top-3 grid h-7 w-7 place-items-center rounded-full font-display text-[10px] font-black"
                        style={{ background: p.accent, color: "#0a0a0a" }}
                    >
                        {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                        className="absolute right-3 top-3 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] backdrop-blur-md"
                        style={{
                            clipPath: clip(5),
                            background: "rgba(8,12,16,0.7)",
                            border: `1px solid ${p.accent}66`,
                            color: p.accent,
                        }}
                    >
                        {p.category}
                    </span>
                    <div className="absolute inset-x-0 bottom-0 p-4">
                        <span
                            className="text-[10px] font-bold uppercase tracking-[0.16em]"
                            style={{ color: p.accent }}
                        >
                            {p.role}
                        </span>
                        <h3 className="mt-0.5 font-display text-base font-black uppercase leading-tight tracking-tight text-white">
                            {p.title}
                        </h3>
                    </div>
                </div>
            </div>
        </motion.button>
    );
}

/* ── Main gallery component ────────────────────────────────────── */
export default function TrailMapGallery() {
    const [cat, setCat] = useState("All");
    const [active, setActive] = useState(null);
    const [hoveredSlug, setHoveredSlug] = useState(null);
    const sectionRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"],
    });
    const mapY = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"]);

    const shown =
        cat === "All"
            ? PROJECTS
            : PROJECTS.filter((p) => p.category === cat);

    return (
        <section
            ref={sectionRef}
            id="works"
            className="relative overflow-hidden bg-ink py-24 sm:py-32"
            data-testid="trail-map-gallery"
        >
            {/* very soft full-bleed map echo for depth */}
            <motion.div
                aria-hidden="true"
                style={{
                    y: mapY,
                    backgroundImage: `url(${MAP_SRC})`,
                }}
                className="pointer-events-none absolute inset-0 z-0 bg-cover bg-center opacity-[0.12]"
            />
            <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-ink via-transparent to-ink" />
            <div
                className="pointer-events-none absolute inset-0 z-0"
                style={{
                    background:
                        "radial-gradient(120% 80% at 50% 0%, rgba(74,222,128,0.06), transparent 60%)",
                }}
            />

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
                        Each project is a marker on the mountain — a stop along the
                        trail where creativity, strategy and cutting-edge technology
                        met a real-world brief. Hover a marker, tap to open the case.
                    </p>
                </Reveal>

                {/* Filter chips */}
                <Reveal delay={0.14}>
                    <div className="mt-8 flex flex-wrap gap-2.5">
                        {PROJECT_CATEGORIES.map((c) => {
                            const on = c === cat;
                            return (
                                <button
                                    key={c}
                                    onClick={() => setCat(c)}
                                    className="px-4 py-2 text-[11px] font-bold uppercase tracking-[0.12em] transition-all"
                                    style={{
                                        clipPath: clip(8),
                                        background: on
                                            ? "var(--brand)"
                                            : "rgba(255,255,255,0.05)",
                                        color: on
                                            ? "#0a0a0a"
                                            : "rgba(255,255,255,0.7)",
                                        border: on
                                            ? "none"
                                            : "1px solid rgba(255,255,255,0.12)",
                                    }}
                                >
                                    {c}
                                </button>
                            );
                        })}
                    </div>
                </Reveal>

                {/* DESKTOP: trail map with markers */}
                <Reveal delay={0.2}>
                    <div className="mt-12 hidden md:block">
                        <div
                            className="relative w-full overflow-hidden"
                            style={{
                                clipPath: clip(14),
                                boxShadow:
                                    "0 32px 80px -28px rgba(0,0,0,0.85), inset 0 0 0 1px rgba(255,255,255,0.06)",
                            }}
                        >
                            {/* base map */}
                            <div className="relative aspect-[16/9] w-full">
                                <img
                                    src={MAP_SRC}
                                    alt="Trail map of selected projects"
                                    className="absolute inset-0 h-full w-full object-cover"
                                />
                                {/* vignette so markers pop */}
                                <div
                                    className="absolute inset-0"
                                    style={{
                                        background:
                                            "radial-gradient(80% 60% at 50% 50%, rgba(10,10,10,0.05), rgba(10,10,10,0.55))",
                                    }}
                                />

                                {/* dashed trail path between markers */}
                                <svg
                                    viewBox="0 0 100 100"
                                    preserveAspectRatio="none"
                                    className="pointer-events-none absolute inset-0 h-full w-full"
                                    aria-hidden="true"
                                >
                                    <motion.path
                                        d={TRAIL_D}
                                        stroke="rgba(250,204,21,0.55)"
                                        strokeWidth="0.45"
                                        strokeLinecap="round"
                                        strokeDasharray="1 1.6"
                                        fill="none"
                                        initial={{ pathLength: 0 }}
                                        whileInView={{ pathLength: 1 }}
                                        viewport={{ once: true, margin: "-100px" }}
                                        transition={{
                                            duration: 1.8,
                                            ease: "easeInOut",
                                        }}
                                    />
                                </svg>

                                {/* markers */}
                                {shown.map((p, i) => (
                                    <Marker
                                        key={p.slug}
                                        p={p}
                                        i={i}
                                        onOpen={setActive}
                                        hoveredSlug={hoveredSlug}
                                        setHoveredSlug={setHoveredSlug}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* legend strip below the map */}
                        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 text-[11px] uppercase tracking-[0.18em] text-white/45">
                            <span className="inline-flex items-center gap-2">
                                <span className="inline-block h-1.5 w-6 rounded-full bg-brand/70" />
                                Trail of work
                            </span>
                            <span>{shown.length} projects on this trail</span>
                        </div>
                    </div>
                </Reveal>

                {/* MOBILE: vertical card list */}
                <div className="mt-10 grid gap-5 md:hidden">
                    <AnimatePresence mode="popLayout">
                        {shown.map((p, i) => (
                            <MobileCard
                                key={p.slug}
                                p={p}
                                i={i}
                                onOpen={setActive}
                            />
                        ))}
                    </AnimatePresence>
                </div>

                {/* View-all CTA */}
                <Reveal delay={0.1}>
                    <div className="mt-14 flex justify-center">
                        <button
                            className="btn-ghost-wrap"
                            onClick={() =>
                                window.dispatchEvent(
                                    new CustomEvent("open-contact")
                                )
                            }
                        >
                            <span className="btn-ghost-inner">
                                View all projects
                                <ArrowUpRight size={16} strokeWidth={2.5} />
                            </span>
                        </button>
                    </div>
                </Reveal>
            </div>

            <ProjectModal project={active} onClose={() => setActive(null)} />
        </section>
    );
}
