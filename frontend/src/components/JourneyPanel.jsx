import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import { CHECKPOINTS } from "@/data/content";

export default function JourneyPanel({ onJump }) {
    const { scrollYProgress } = useScroll();
    const [p, setP] = useState(0);
    useMotionValueEvent(scrollYProgress, "change", setP);

    const trackHeight = useTransform(scrollYProgress, [0, 0.82], ["0%", "100%"]);
    const pathLength = useTransform(scrollYProgress, [0, 0.95], [0, 1]);

    // Active checkpoint based on progress
    const activeIdx = Math.min(
        CHECKPOINTS.length - 1,
        Math.floor((p / 0.82) * CHECKPOINTS.length)
    );

    return (
        <>
            {/* Desktop floating panel */}
            <motion.aside
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1, duration: 0.7 }}
                className="fixed right-6 top-1/2 z-40 hidden w-[230px] -translate-y-1/2 glass-strong rounded-2xl p-5 xl:block"
                data-testid="journey-panel"
            >
                <p className="font-display text-sm font-extrabold uppercase tracking-wide text-brand">
                    The Journey
                </p>
                <p className="text-[11px] uppercase tracking-[0.18em] text-white/50">
                    Choose your path
                </p>

                <div className="relative mt-5 pl-7">
                    {/* Track background */}
                    <span className="absolute left-[7px] top-1 bottom-1 w-0.5 rounded bg-white/12" />
                    {/* Track fill */}
                    <motion.span
                        className="absolute left-[7px] top-1 w-0.5 rounded bg-brand"
                        style={{ height: trackHeight }}
                    />

                    <ul className="space-y-3.5">
                        {CHECKPOINTS.map((cp, i) => {
                            const isActive = i === activeIdx;
                            const isPast = i < activeIdx;
                            return (
                                <li key={cp.n} className="relative">
                                    <button
                                        onClick={() => onJump(cp.anchor)}
                                        data-testid={`journey-nav-${cp.anchor}`}
                                        className="group flex w-full items-center gap-3 text-left"
                                    >
                                        {/* Flag — yellow ONLY when active, faded white otherwise */}
                                        <span
                                            className="absolute -left-7 top-1/2 grid -translate-y-1/2 place-items-center transition-all"
                                            style={{
                                                color: isActive
                                                    ? "var(--brand)"
                                                    : isPast
                                                    ? "rgba(255,255,255,0.55)"
                                                    : "rgba(255,255,255,0.28)",
                                            }}
                                        >
                                            <svg
                                                width="14"
                                                height="14"
                                                viewBox="0 0 24 24"
                                                fill="currentColor"
                                            >
                                                <path d="M5 3v18h1.6v-7.2l11.4.0-2.6-3.9L19 6H6.6V3z" />
                                            </svg>
                                        </span>
                                        <span
                                            className="text-[11px] font-bold uppercase leading-tight tracking-[0.16em] transition-colors"
                                            style={{
                                                color: isActive
                                                    ? "#fff"
                                                    : isPast
                                                    ? "rgba(255,255,255,0.65)"
                                                    : "rgba(255,255,255,0.4)",
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

                {/* Wireframe mountain map with filling yellow trail */}
                <div className="mt-5 border-t border-white/10 pt-4">
                    <svg viewBox="0 0 200 90" className="w-full">
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
                        <motion.circle r="2.6" fill="var(--brand)" cx="186" cy="56" style={{ opacity: pathLength }} />
                    </svg>
                    <p className="mt-1 text-center text-[10px] uppercase tracking-[0.25em] text-white/40">
                        {Math.round(Math.min(p / 0.82, 1) * 100)}% climbed
                    </p>
                </div>
            </motion.aside>

            {/* Mobile slim progress bar */}
            <div className="fixed inset-x-0 top-0 z-40 h-1 bg-white/10 xl:hidden">
                <motion.div
                    className="h-full bg-brand"
                    style={{ scaleX: scrollYProgress, transformOrigin: "left" }}
                />
            </div>
        </>
    );
}
