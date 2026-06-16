import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mountain, ArrowUpRight } from "lucide-react";

/* Project detail as a full-screen modal. If the project has a `caseStudy`,
   it renders a uniform Brief→…→Result story; otherwise a compact overview.
   Text stays fully in our control (no baked images of text). */

const ease = [0.22, 1, 0.36, 1];
const clip = (c) =>
    `polygon(0 0, calc(100% - ${c}px) 0, 100% ${c}px, 100% 100%, ${c}px 100%, 0 calc(100% - ${c}px))`;

function Thumb({ p }) {
    if (p.thumb) {
        return <img src={p.thumb} alt={p.title} className="h-full w-full object-cover" />;
    }
    return (
        <div className="grid h-full w-full place-items-center" style={{ background: "linear-gradient(150deg,#15151a,#0b0b0d)" }}>
            <Mountain size={34} className="text-white/30" strokeWidth={1.5} />
        </div>
    );
}

export default function ProjectModal({ project, onClose }) {
    useEffect(() => {
        const onKey = (e) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKey);
        document.body.style.overflow = "hidden";
        return () => {
            window.removeEventListener("keydown", onKey);
            document.body.style.overflow = "";
        };
    }, [onClose]);

    return (
        <AnimatePresence>
            {project && (
                <motion.div
                    className="fixed inset-0 z-[1500] flex justify-center overflow-y-auto bg-black/80 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 40, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 30, scale: 0.98 }}
                        transition={{ duration: 0.5, ease }}
                        onClick={(e) => e.stopPropagation()}
                        className="relative my-10 w-full max-w-3xl bg-[#0c0c0e]"
                        style={{ clipPath: clip(18), border: `1px solid ${project.accent}44` }}
                    >
                        {/* close */}
                        <button
                            onClick={onClose}
                            aria-label="Close"
                            className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-black/50 text-white/80 backdrop-blur-md transition hover:bg-black/70 hover:text-white"
                        >
                            <X size={18} />
                        </button>

                        {/* hero image */}
                        <div className="relative aspect-[16/9] w-full overflow-hidden">
                            <Thumb p={project} />
                            <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, transparent 35%, rgba(8,8,8,0.5), #0c0c0e)` }} />
                            <div className="absolute inset-0" style={{ background: `radial-gradient(80% 60% at 70% 30%, ${project.accent}22, transparent 60%)` }} />
                        </div>

                        {/* header */}
                        <div className="px-7 pb-8 pt-6 sm:px-10">
                            <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: project.accent }}>
                                <span>{project.category}</span>
                                <span className="h-1 w-1 rounded-full bg-current opacity-60" />
                                <span className="text-white/45">{project.year}</span>
                            </div>
                            <h2 className="mt-3 font-display text-3xl font-black uppercase leading-[0.95] tracking-tight text-white sm:text-4xl">
                                {project.title}
                            </h2>
                            <p className="mt-1.5 text-sm font-medium text-white/60">{project.role}</p>
                            <span className="mt-4 block h-1 w-16" style={{ background: project.accent }} />
                            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-white/75">{project.tagline}</p>

                            {/* metrics */}
                            {project.metrics && (
                                <div className="mt-7 grid grid-cols-3 gap-4 border-y border-white/10 py-5">
                                    {project.metrics.map((m) => (
                                        <div key={m.l}>
                                            <div className="font-display text-2xl font-black text-white sm:text-3xl">{m.v}</div>
                                            <p className="mt-1 text-[10px] uppercase leading-tight tracking-wide text-white/45">{m.l}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* case study stages */}
                            {project.caseStudy && (
                                <div className="mt-8 space-y-7">
                                    <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/40">The Trail</p>
                                    {project.caseStudy.map((s, i) => (
                                        <motion.div
                                            key={s.stage}
                                            initial={{ opacity: 0, x: -14 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.2 + i * 0.08, duration: 0.5, ease }}
                                            className="relative pl-9"
                                        >
                                            <span className="absolute left-0 top-0 font-display text-sm font-black" style={{ color: project.accent }}>
                                                0{i + 1}
                                            </span>
                                            <span className="absolute left-[7px] top-6 bottom-[-22px] w-px bg-white/10 last:hidden" />
                                            <h3 className="font-display text-base font-bold uppercase tracking-wide text-white">{s.stage}</h3>
                                            <p className="mt-1.5 text-[14px] leading-relaxed text-white/65">{s.body}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            )}

                            {!project.caseStudy && (
                                <p className="mt-8 inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-wide text-white/40">
                                    <ArrowUpRight size={14} style={{ color: project.accent }} />
                                    Full case study coming soon
                                </p>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
