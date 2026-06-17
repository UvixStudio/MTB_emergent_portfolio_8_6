import { useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Mountain } from "lucide-react";
import { PROJECTS, PROJECT_CATEGORIES } from "@/data/content";
import { Reveal, TrailHeading } from "@/components/Primitives";
import ProjectModal from "@/components/ProjectModal";

const ease = [0.22, 1, 0.36, 1];
const clip = (c) =>
    `polygon(0 0, calc(100% - ${c}px) 0, 100% ${c}px, 100% 100%, ${c}px 100%, 0 calc(100% - ${c}px))`;

/* Per-slug altitude — drives the bento size and the altitude tag.
   Higher altitude = bigger card. Tuned so the hero pieces land at the
   ridge and the smaller experiments sit at the base. */
const LAYOUT = {
    "beit-hagefen":     { size: "hero", altitude: "2,840m" },
    "coderz":           { size: "wide", altitude: "2,610m" },
    "paymax":           { size: "tall", altitude: "2,420m" },
    "promee":           { size: "std",  altitude: "2,180m" },
    "digitel-tlv":      { size: "std",  altitude: "2,050m" },
    "bone-bash":        { size: "wide", altitude: "1,920m" },
    "ten-li-rocknroll": { size: "std",  altitude: "1,780m" },
    "baboon-of-jafa":   { size: "std",  altitude: "1,640m" },
};

/* Grid spans per size — drives the bento layout */
const SIZE_CLASS = {
    hero: "md:col-span-2 md:row-span-2",
    wide: "md:col-span-2",
    tall: "md:row-span-2",
    std:  "",
};
const ASPECT = {
    hero: "aspect-[5/4]",
    wide: "aspect-[16/8]",
    tall: "aspect-[4/5]",
    std:  "aspect-[4/3]",
};

/* ── A single bento card ───────────────────────────────────────── */
function PeakCard({ p, i, onOpen }) {
    const meta = LAYOUT[p.slug] || { size: "std", altitude: "1,500m" };
    return (
        <motion.button
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: (i % 3) * 0.06, ease }}
            onClick={() => onOpen(p)}
            data-testid={`peak-card-${p.slug}`}
            data-cursor="view"
            data-cursor-label="View Case"
            className={`group relative block w-full text-left ${SIZE_CLASS[meta.size]}`}
        >
            <div
                className="relative h-full w-full overflow-hidden bg-[#0e1a2b]/80 backdrop-blur-sm transition-transform duration-500 group-hover:-translate-y-1.5"
                style={{
                    clipPath: clip(14),
                    boxShadow: `0 26px 60px -28px #000, inset 0 0 0 1px ${p.accent}29`,
                }}
            >
                <div className={`relative w-full overflow-hidden ${ASPECT[meta.size]}`}>
                    {p.thumb ? (
                        <img
                            src={p.thumb}
                            alt={p.title}
                            loading="lazy"
                            className="absolute inset-0 h-full w-full object-cover transition-all duration-700 group-hover:scale-[1.06]"
                        />
                    ) : (
                        <div
                            className="grid h-full w-full place-items-center"
                            style={{
                                background:
                                    "linear-gradient(150deg,#1a2c41,#0b1422)",
                            }}
                        >
                            <Mountain
                                size={36}
                                strokeWidth={1.4}
                                style={{ color: `${p.accent}55` }}
                            />
                        </div>
                    )}

                    {/* duotone-style accent wash on hover */}
                    <div
                        className="absolute inset-0 opacity-0 mix-blend-color transition-opacity duration-500 group-hover:opacity-100"
                        style={{ background: `${p.accent}55` }}
                    />

                    {/* legibility gradient */}
                    <div
                        className="absolute inset-0"
                        style={{
                            background:
                                "linear-gradient(180deg, transparent 35%, rgba(6,11,19,0.55), rgba(6,11,19,0.95))",
                        }}
                    />

                    {/* altitude tag — top-left */}
                    <div
                        className="absolute left-3 top-3 inline-flex items-center gap-1.5 px-2.5 py-1 backdrop-blur-md"
                        style={{
                            clipPath: clip(5),
                            background: "rgba(6,11,19,0.7)",
                            border: `1px solid ${p.accent}55`,
                        }}
                    >
                        <svg
                            width="10"
                            height="10"
                            viewBox="0 0 10 10"
                            aria-hidden="true"
                        >
                            <path
                                d="M1 9 L5 1 L9 9 Z"
                                fill={p.accent}
                                fillOpacity="0.9"
                            />
                        </svg>
                        <span
                            className="font-display text-[10px] font-bold tracking-[0.14em]"
                            style={{ color: p.accent }}
                        >
                            {meta.altitude}
                        </span>
                    </div>

                    {/* category tag — top-right */}
                    <span
                        className="absolute right-3 top-3 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white/70 backdrop-blur-md"
                        style={{
                            clipPath: clip(5),
                            background: "rgba(6,11,19,0.7)",
                            border: "1px solid rgba(255,255,255,0.15)",
                        }}
                    >
                        {p.category}
                    </span>

                    {/* arrow corner — appears on hover */}
                    <span
                        className="absolute right-3 bottom-3 grid h-9 w-9 translate-y-3 place-items-center rounded-full bg-black/60 text-white opacity-0 backdrop-blur-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
                        style={{ border: `1px solid ${p.accent}77` }}
                    >
                        <ArrowUpRight size={16} strokeWidth={2.5} />
                    </span>

                    {/* meta — bottom-left */}
                    <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                        <span
                            className="text-[10px] font-bold uppercase tracking-[0.18em]"
                            style={{ color: p.accent }}
                        >
                            {p.role}
                        </span>
                        <h3
                            className="mt-1 font-display font-black uppercase leading-[0.95] tracking-tight text-white"
                            style={{
                                fontSize:
                                    meta.size === "hero"
                                        ? "clamp(1.5rem, 2.4vw, 2.25rem)"
                                        : "clamp(1.05rem, 1.4vw, 1.4rem)",
                            }}
                        >
                            {p.title}
                        </h3>
                        {meta.size === "hero" && (
                            <p className="mt-2 max-w-md text-[13px] leading-relaxed text-white/65">
                                {p.tagline}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </motion.button>
    );
}

/* ── SVG decorative layers ──────────────────────────────────────
   - Contour layer: 4 soft mountain-ridge curves running across the
     section, very low opacity. Gives the "topographic" feel.
   - Trail layer:   a single yellow dashed path that winds across
     the section, animated to draw on scroll. Anchored to the visual
     centerline. Hidden on mobile (rendered vertically instead).      */
function ContourLayer() {
    return (
        <svg
            viewBox="0 0 1200 700"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-0 h-full w-full"
            aria-hidden="true"
        >
            <defs>
                <linearGradient id="contour-fade" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="rgba(180,200,235,0)" />
                    <stop offset="50%" stopColor="rgba(180,200,235,0.18)" />
                    <stop offset="100%" stopColor="rgba(180,200,235,0)" />
                </linearGradient>
            </defs>
            {[
                "M-50,260 Q150,200 320,250 T620,200 T920,260 T1250,210",
                "M-50,340 Q150,300 320,340 T620,300 T920,340 T1250,300",
                "M-50,440 Q150,410 320,440 T620,410 T920,440 T1250,410",
                "M-50,540 Q150,520 320,540 T620,510 T920,540 T1250,510",
                "M-50,620 Q150,610 320,620 T620,600 T920,620 T1250,600",
            ].map((d, i) => (
                <path
                    key={i}
                    d={d}
                    fill="none"
                    stroke="url(#contour-fade)"
                    strokeWidth={i === 0 ? 1 : 0.6}
                    opacity={1 - i * 0.13}
                />
            ))}
        </svg>
    );
}

function TrailLine({ scrollYProgress }) {
    const length = useTransform(scrollYProgress, [0.1, 0.85], [0, 1]);
    return (
        <svg
            viewBox="0 0 1200 700"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-0 hidden h-full w-full md:block"
            aria-hidden="true"
        >
            {/* Soft underglow */}
            <motion.path
                d="M-30,230 C160,180 280,310 420,280 C560,250 640,150 800,210 C950,265 1020,350 1180,300"
                stroke="rgba(250,204,21,0.18)"
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
                style={{ pathLength: length }}
            />
            {/* Crisp dashed trail */}
            <motion.path
                d="M-30,230 C160,180 280,310 420,280 C560,250 640,150 800,210 C950,265 1020,350 1180,300"
                stroke="rgba(250,204,21,0.85)"
                strokeWidth="1.4"
                fill="none"
                strokeLinecap="round"
                strokeDasharray="3 5"
                style={{ pathLength: length }}
            />
        </svg>
    );
}

/* ── Main gallery component ────────────────────────────────────── */
export default function TopographicGallery() {
    const [cat, setCat] = useState("All");
    const [active, setActive] = useState(null);
    const sectionRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"],
    });

    const shown =
        cat === "All"
            ? PROJECTS
            : PROJECTS.filter((p) => p.category === cat);

    return (
        <section
            ref={sectionRef}
            id="works"
            className="relative overflow-hidden bg-ink py-24 sm:py-32"
            data-testid="topographic-gallery"
        >
            {/* Top-of-section ambient ridge glow */}
            <div
                className="pointer-events-none absolute inset-x-0 top-0 h-[60vh]"
                style={{
                    background:
                        "radial-gradient(70% 50% at 50% 0%, rgba(74,222,128,0.07), transparent 70%)",
                }}
            />

            {/* Topographic layers */}
            <ContourLayer />
            <TrailLine scrollYProgress={scrollYProgress} />

            {/* Mobile vertical trail line — replaces the winding desktop one */}
            <div className="pointer-events-none absolute left-6 top-24 bottom-24 z-0 w-px md:hidden">
                <div className="h-full w-full bg-gradient-to-b from-transparent via-brand/40 to-transparent" />
            </div>

            <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8">
                <Reveal>
                    <TrailHeading
                        n="04"
                        label="Selected Works"
                        color="var(--cp-projects)"
                    />
                </Reveal>
                <Reveal delay={0.08}>
                    <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-white/65">
                        Peaks on the map — a selection of projects where creativity,
                        strategy and cutting-edge technology converged on a real-world
                        brief. Each card opens its case study.
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
                                            ? "#0a1424"
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

                {/* Bento grid */}
                <div className="mt-12 grid auto-rows-[minmax(0,1fr)] grid-cols-1 gap-5 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
                    <AnimatePresence mode="popLayout">
                        {shown.map((p, i) => (
                            <PeakCard
                                key={p.slug}
                                p={p}
                                i={i}
                                onOpen={setActive}
                            />
                        ))}
                    </AnimatePresence>
                </div>

                {/* Footer rule + count */}
                <div className="mt-10 flex flex-wrap items-center justify-between gap-4 text-[11px] uppercase tracking-[0.18em] text-white/45">
                    <span className="inline-flex items-center gap-2">
                        <span className="inline-block h-1.5 w-6 rounded-full bg-brand/70" />
                        Trail of work
                    </span>
                    <span>{shown.length} peaks on this ridge</span>
                </div>

                {/* View all CTA */}
                <Reveal delay={0.1}>
                    <div className="mt-10 flex justify-center">
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
