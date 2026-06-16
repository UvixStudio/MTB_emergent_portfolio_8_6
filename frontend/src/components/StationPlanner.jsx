import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { Crosshair, ScanLine } from "lucide-react";
import { PLANNER } from "@/data/content";

/* "The Planner" — AR-glasses route-planning overview.
   A single still vista + a code-drawn AR HUD: a route that draws itself,
   waypoint nodes that pop with crisp labels, a scanning status line, and a
   subtle camera zoom. All text stays in our control. */

const HEX = "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)";

/* Smooth SVG path through the waypoints (Catmull-Rom → cubic Bézier) */
function smoothPath(pts) {
    if (pts.length < 2) return "";
    const p = pts.map((w) => ({ x: w.x, y: w.y }));
    let d = `M ${p[0].x} ${p[0].y}`;
    for (let i = 0; i < p.length - 1; i++) {
        const p0 = p[i - 1] || p[i];
        const p1 = p[i];
        const p2 = p[i + 1];
        const p3 = p[i + 2] || p2;
        const c1x = p1.x + (p2.x - p0.x) / 6;
        const c1y = p1.y + (p2.y - p0.y) / 6;
        const c2x = p2.x - (p3.x - p1.x) / 6;
        const c2y = p2.y - (p3.y - p1.y) / 6;
        d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`;
    }
    return d;
}

export default function StationPlanner() {
    const a = PLANNER.accent;
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-25%" });
    const [statusIdx, setStatusIdx] = useState(0);

    const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
    const zoom = useTransform(scrollYProgress, [0, 0.5, 1], [1.18, 1.06, 1.0]);
    const hudY = useTransform(scrollYProgress, [0, 1], [40, -40]);

    /* advance the scanning status line once in view */
    useEffect(() => {
        if (!inView) return;
        let i = 0;
        const t = setInterval(() => {
            i = Math.min(i + 1, PLANNER.statuses.length - 1);
            setStatusIdx(i);
            if (i >= PLANNER.statuses.length - 1) clearInterval(t);
        }, 900);
        return () => clearInterval(t);
    }, [inView]);

    const ready = statusIdx >= PLANNER.statuses.length - 1;
    const path = smoothPath(PLANNER.waypoints);

    return (
        <section
            ref={ref}
            id="planner"
            data-testid="station-planner"
            className="relative flex min-h-screen items-center overflow-hidden bg-ink"
        >
            {/* ── Vista (placeholder) with camera zoom ── */}
            <motion.div style={{ scale: zoom }} className="absolute inset-0 z-0">
                <img src={PLANNER.bg} alt="" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-ink/55" />
                <div className="absolute inset-0" style={{ background: `radial-gradient(120% 90% at 60% 45%, ${a}14, transparent 60%)` }} />
            </motion.div>

            {/* ── AR glasses frame (vignette + scanlines + corner brackets) ── */}
            <div className="pointer-events-none absolute inset-0 z-10">
                <div className="absolute inset-0" style={{ boxShadow: "inset 0 0 180px 40px rgba(0,0,0,0.85)" }} />
                <div
                    className="absolute inset-0 opacity-[0.07]"
                    style={{ backgroundImage: "repeating-linear-gradient(0deg, #fff 0 1px, transparent 1px 4px)" }}
                />
                {/* moving scan */}
                <motion.div
                    className="absolute inset-x-0 h-px"
                    style={{ background: `linear-gradient(90deg, transparent, ${a}, transparent)`, opacity: 0.6 }}
                    animate={{ top: ["12%", "88%", "12%"] }}
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                />
                {["left-6 top-6 border-l-2 border-t-2", "right-6 top-6 border-r-2 border-t-2", "left-6 bottom-6 border-l-2 border-b-2", "right-6 bottom-6 border-r-2 border-b-2"].map((pos) => (
                    <span key={pos} className={`absolute h-8 w-8 ${pos}`} style={{ borderColor: `${a}99` }} />
                ))}
                <Crosshair size={20} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ color: `${a}66` }} />
            </div>

            {/* ── Route + waypoints (SVG over the vista) ── */}
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 z-20 h-full w-full">
                <motion.path
                    d={path}
                    fill="none"
                    stroke={a}
                    strokeWidth="0.5"
                    strokeLinecap="round"
                    style={{ filter: `drop-shadow(0 0 1px ${a})` }}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={inView ? { pathLength: 1, opacity: 0.9 } : {}}
                    transition={{ duration: 1.6, ease: "easeInOut" }}
                />
            </svg>

            {/* waypoint nodes with crisp labels */}
            <div className="absolute inset-0 z-30">
                {PLANNER.waypoints.map((w, i) => (
                    <motion.div
                        key={w.label}
                        className="absolute"
                        style={{ left: `${w.x}%`, top: `${w.y}%`, transform: "translate(-50%,-50%)" }}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={inView ? { scale: 1, opacity: 1 } : {}}
                        transition={{ delay: 0.6 + i * 0.22, type: "spring", stiffness: 240, damping: 16 }}
                    >
                        <div className="relative grid place-items-center">
                            <motion.span
                                className="absolute h-7 w-7"
                                style={{ clipPath: HEX, background: a }}
                                animate={{ filter: [`drop-shadow(0 0 3px ${a})`, `drop-shadow(0 0 10px ${a})`, `drop-shadow(0 0 3px ${a})`] }}
                                transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                            />
                            <span className="absolute h-[22px] w-[22px]" style={{ clipPath: HEX, background: "#0b0b0d" }} />
                            <span className="relative font-display text-[9px] font-black" style={{ color: a }}>{i + 1}</span>
                            {/* label chip */}
                            <span
                                className="absolute left-1/2 top-[120%] -translate-x-1/2 whitespace-nowrap px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide"
                                style={{ clipPath: "polygon(0 0,calc(100% - 5px) 0,100% 5px,100% 100%,5px 100%,0 calc(100% - 5px))", background: "rgba(8,12,16,0.82)", border: `1px solid ${a}55`, color: "#dbeafe" }}
                            >
                                {w.label}
                            </span>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* ── Content + HUD status (parallax) ── */}
            <motion.div style={{ y: hudY }} className="relative z-40 mx-auto w-full max-w-6xl px-6 sm:px-8">
                <div className="max-w-md">
                    <span
                        className="inline-flex items-center gap-2 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em]"
                        style={{ clipPath: "polygon(0 0,calc(100% - 7px) 0,100% 7px,100% 100%,7px 100%,0 calc(100% - 7px))", border: `1px solid ${a}66`, color: a, background: `${a}1f` }}
                    >
                        {PLANNER.kicker}
                    </span>
                    <h2 className="mt-4 font-display text-[2.6rem] font-black uppercase leading-[0.9] tracking-tight text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.8)] sm:text-6xl">
                        {PLANNER.title}
                    </h2>
                    <span className="mt-5 block h-1 w-20" style={{ background: a, boxShadow: `0 0 12px ${a}` }} />
                    <p className="mt-6 text-[15px] leading-relaxed text-white/80 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                        {PLANNER.intro}
                    </p>

                    {/* scanning status / ready */}
                    <div className="mt-7 inline-flex items-center gap-2.5 px-4 py-2.5" style={{ clipPath: "polygon(0 0,calc(100% - 9px) 0,100% 9px,100% 100%,9px 100%,0 calc(100% - 9px))", background: ready ? `${a}22` : "rgba(8,12,16,0.8)", border: `1px solid ${a}66` }}>
                        {ready ? (
                            <span className="h-2 w-2 rounded-full" style={{ background: "#4ade80", boxShadow: "0 0 8px #4ade80" }} />
                        ) : (
                            <motion.span animate={{ rotate: 360 }} transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}>
                                <ScanLine size={14} style={{ color: a }} />
                            </motion.span>
                        )}
                        <span className="font-display text-[12px] font-bold uppercase tracking-[0.15em]" style={{ color: ready ? "#86efac" : "#dbeafe" }}>
                            {PLANNER.statuses[statusIdx]}
                        </span>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
