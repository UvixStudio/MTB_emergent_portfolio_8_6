import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { useMemo, useState } from "react";
import { CHECKPOINTS } from "@/data/content";

const PANEL_CLIP = "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))";

export default function JourneyPanel({ onJump }) {
    const { scrollYProgress } = useScroll();
    const [p, setP] = useState(0);
    useMotionValueEvent(scrollYProgress, "change", setP);

    const visibleCheckpoints = useMemo(
        () => CHECKPOINTS.filter((cp) => cp.anchor !== "experience"),
        []
    );

    const progressValue = Math.min(p / 0.9, 1);
    const trackHeight = useTransform(scrollYProgress, [0, 0.9], ["0%", "100%"]);
    const pathLength = useTransform(scrollYProgress, [0, 0.95], [0, 1]);
    const activeIdx = Math.min(
        visibleCheckpoints.length - 1,
        Math.floor(progressValue * visibleCheckpoints.length)
    );

    return (
        <>
            <motion.aside
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.7 }}
                className="fixed bottom-6 right-6 z-40 hidden w-[188px] xl:block"
                data-testid="journey-panel"
                style={{
                    clipPath: PANEL_CLIP,
                    background: "rgba(8, 14, 22, 0.56)",
                    backdropFilter: "blur(18px)",
                    WebkitBackdropFilter: "blur(18px)",
                    boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08), 0 20px 48px rgba(0,0,0,0.26)",
                }}
            >
                <div className="px-4 py-4">
                    <p className="font-display text-[11px] font-extrabold uppercase tracking-[0.12em] text-brand">
                        The Journey
                    </p>
                    <p className="text-[10px] uppercase tracking-[0.18em] text-white/42">
                        Choose your path
                    </p>

                    <div className="relative mt-4 pl-6">
                        <span className="absolute bottom-1 left-[6px] top-1 w-px rounded bg-white/10" />
                        <motion.span
                            className="absolute left-[6px] top-1 w-px rounded bg-brand"
                            style={{ height: trackHeight }}
                        />

                        <ul className="space-y-3">
                            {visibleCheckpoints.map((cp, i) => {
                                const isActive = i === activeIdx;
                                const isPast = i < activeIdx;

                                return (
                                    <li key={cp.anchor} className="relative">
                                        <button
                                            onClick={() => onJump(cp.anchor)}
                                            data-testid={`journey-nav-${cp.anchor}`}
                                            className="group flex w-full items-center gap-2.5 text-left"
                                        >
                                            <span
                                                className="absolute -left-6 top-1/2 grid -translate-y-1/2 place-items-center transition-all"
                                                style={{
                                                    color: isActive
                                                        ? "var(--brand)"
                                                        : isPast
                                                        ? "rgba(255,255,255,0.5)"
                                                        : "rgba(255,255,255,0.24)",
                                                }}
                                            >
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M5 3v18h1.6v-7.2h11.4l-2.6-3.9L19 6H6.6V3z" />
                                                </svg>
                                            </span>
                                            <span
                                                className="text-[10px] font-bold uppercase leading-tight tracking-[0.14em] transition-colors"
                                                style={{
                                                    color: isActive
                                                        ? "#fff"
                                                        : isPast
                                                        ? "rgba(255,255,255,0.64)"
                                                        : "rgba(255,255,255,0.35)",
                                                }}
                                            >
                                                {cp.label}
                                            </span>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    <div className="mt-4 border-t border-white/8 pt-3">
                        <svg viewBox="0 0 200 90" className="w-full opacity-90">
                            <g stroke="rgba(255,255,255,0.14)" strokeWidth="0.6" fill="none">
                                <path d="M0 80 L40 40 L70 58 L100 18 L140 50 L170 30 L200 70" />
                                <path d="M0 80 L200 80" />
                                <path d="M40 40 L70 80 M100 18 L100 80 M140 50 L140 80 M170 30 L170 80" />
                                <path d="M20 60 L60 65 L110 55 L150 66 L190 58" />
                            </g>
                            <motion.path
                                d="M14 78 C40 70 50 50 72 52 C96 54 100 30 120 34 C146 39 150 60 186 56"
                                fill="none"
                                stroke="var(--brand)"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                style={{ pathLength }}
                            />
                            <motion.circle r="2.4" fill="var(--brand)" cx="186" cy="56" style={{ opacity: pathLength }} />
                        </svg>
                        <p className="mt-1 text-center text-[9px] uppercase tracking-[0.22em] text-white/36">
                            {Math.round(progressValue * 100)}% climbed
                        </p>
                    </div>
                </div>
            </motion.aside>

            <div className="fixed inset-x-0 top-0 z-40 h-1 bg-white/10 xl:hidden">
                <motion.div
                    className="h-full bg-brand"
                    style={{ scaleX: scrollYProgress, transformOrigin: "left" }}
                />
            </div>
        </>
    );
}
