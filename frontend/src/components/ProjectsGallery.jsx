import { useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight, Mountain } from "lucide-react";
import { PROJECTS, PROJECT_CATEGORIES } from "@/data/content";
import { Reveal, TrailHeading } from "@/components/Primitives";
import ProjectModal from "@/components/ProjectModal";

const ease = [0.22, 1, 0.36, 1];
const clip = (c) =>
    `polygon(0 0, calc(100% - ${c}px) 0, 100% ${c}px, 100% 100%, ${c}px 100%, 0 calc(100% - ${c}px))`;

/* ── Floating, 3D-tilt project card ── */
function ProjectCard({ p, i, onOpen }) {
    const mx = useMotionValue(0);
    const my = useMotionValue(0);
    const rX = useSpring(useTransform(my, [-0.5, 0.5], [9, -9]), { stiffness: 200, damping: 18 });
    const rY = useSpring(useTransform(mx, [-0.5, 0.5], [-9, 9]), { stiffness: 200, damping: 18 });

    const onMove = (e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
    };
    const reset = () => { mx.set(0); my.set(0); };

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: (i % 2) * 0.08, ease }}
            className={`relative ${i % 2 === 1 ? "lg:mt-16" : ""}`}
        >
            {/* soft floating motion + ground shadow */}
            <motion.div
                animate={{ y: [0, -9, 0] }}
                transition={{ duration: 5 + (i % 3), repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
                style={{ perspective: 1000 }}
            >
                <motion.button
                    onMouseMove={onMove}
                    onMouseLeave={reset}
                    onClick={() => onOpen(p)}
                    style={{ rotateX: rX, rotateY: rY, transformStyle: "preserve-3d" }}
                    whileHover={{ scale: 1.035 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    data-testid={`project-card-${p.slug}`}
                    className="group relative block w-full text-left"
                >
                    <div
                        className="relative overflow-hidden bg-[#0c0c0e]"
                        style={{ clipPath: clip(14), boxShadow: `0 26px 50px -22px #000, inset 0 0 0 1px ${p.accent}33` }}
                    >
                        <div className="relative aspect-[16/10] w-full overflow-hidden">
                            {p.thumb ? (
                                <img src={p.thumb} alt={p.title} loading="lazy"
                                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                            ) : (
                                <div className="grid h-full w-full place-items-center" style={{ background: "linear-gradient(150deg,#16161c,#0b0b0d)" }}>
                                    <Mountain size={30} className="text-white/25" strokeWidth={1.5} />
                                </div>
                            )}
                            <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, transparent 40%, rgba(8,8,8,0.55), rgba(8,8,8,0.92))` }} />
                            {/* category pin */}
                            <span className="absolute left-3 top-3 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] backdrop-blur-md"
                                style={{ clipPath: clip(6), background: "rgba(8,12,16,0.7)", border: `1px solid ${p.accent}66`, color: p.accent }}>
                                {p.category}
                            </span>
                            <span className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-black/50 text-white opacity-0 backdrop-blur-md transition-opacity duration-300 group-hover:opacity-100">
                                <ArrowUpRight size={15} />
                            </span>

                            {/* text */}
                            <div className="absolute inset-x-0 bottom-0 p-5">
                                <span className="text-[11px] font-bold uppercase tracking-[0.16em]" style={{ color: p.accent }}>{p.role}</span>
                                <h3 className="mt-1 font-display text-xl font-black uppercase leading-[0.95] tracking-tight text-white">{p.title}</h3>
                                <p className="mt-1.5 max-h-0 overflow-hidden text-[13px] leading-relaxed text-white/65 opacity-0 transition-all duration-500 group-hover:max-h-24 group-hover:opacity-100">
                                    {p.tagline}
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.button>
            </motion.div>
        </motion.div>
    );
}

export default function ProjectsGallery() {
    const [cat, setCat] = useState("All");
    const [active, setActive] = useState(null);

    const shown = cat === "All" ? PROJECTS : PROJECTS.filter((p) => p.category === cat);

    return (
        <section id="works" className="relative overflow-hidden bg-ink py-24 sm:py-32">
            {/* Dark trail backdrop */}
            <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-ink via-ink/70 to-ink" />
            <div className="pointer-events-none absolute inset-0 z-0" style={{ background: "radial-gradient(100% 60% at 50% 0%, rgba(250,204,21,0.06), transparent 60%)" }} />

            <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8">
                <Reveal>
                    <TrailHeading n="04" label="Selected Works" color="var(--cp-projects)" />
                </Reveal>
                <Reveal delay={0.08}>
                    <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-white/60">
                        Markers along the mountain — a selection of projects where creativity, strategy and
                        cutting-edge technology meet. Tap a marker to open the trail.
                    </p>
                </Reveal>

                {/* Category filter */}
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
                                        background: on ? "var(--brand)" : "rgba(255,255,255,0.05)",
                                        color: on ? "#0a0a0a" : "rgba(255,255,255,0.7)",
                                        border: on ? "none" : "1px solid rgba(255,255,255,0.12)",
                                    }}
                                >
                                    {c}
                                </button>
                            );
                        })}
                    </div>
                </Reveal>

                {/* Floating cards */}
                <motion.div layout className="mt-12 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:gap-8">
                    <AnimatePresence mode="popLayout">
                        {shown.map((p, i) => (
                            <ProjectCard key={p.slug} p={p} i={i} onOpen={setActive} />
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* View all */}
                <Reveal delay={0.1}>
                    <div className="mt-14 flex justify-center">
                        <button
                            className="btn-ghost-wrap"
                            onClick={() => window.dispatchEvent(new CustomEvent("open-contact"))}
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
