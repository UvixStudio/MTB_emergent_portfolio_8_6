import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { AlertTriangle, Boxes, Users, Check, ChevronsDown, Gauge } from "lucide-react";
import { useJourney } from "@/context/JourneyContext";

/* Station as a parallax downhill "run":
   - edge-bleeding clip (no frame) that melts into the dark
   - floating game-UI cards layered with parallax
   - collectable icon timed to the action → fills the HUD power-up slots
   Mobile: clip docked bottom, fading up. Desktop: clip docked right, fading left. */

const ICONS = { alert: AlertTriangle, systems: Boxes, leadership: Users };
const HEX   = "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)";
const CUT   = 12;
const ease  = [0.22, 1, 0.36, 1];
const SLOT_COLORS = ["#ef4444", "#22d3ee", "#facc15"];

const clip = (c) =>
    `polygon(0 0, calc(100% - ${c}px) 0, 100% ${c}px, 100% 100%, ${c}px 100%, 0 calc(100% - ${c}px))`;

function HudSlot({ color, filled, active }) {
    return (
        <div className="relative grid h-7 w-7 place-items-center">
            <motion.div
                className="absolute inset-0"
                style={{ clipPath: HEX, background: filled ? color : "rgba(255,255,255,0.12)" }}
                animate={filled ? { filter: [`drop-shadow(0 0 3px ${color})`, `drop-shadow(0 0 12px ${color})`, `drop-shadow(0 0 3px ${color})`] } : {}}
                transition={{ duration: 1.8, repeat: Infinity }}
            />
            <div className="absolute inset-[2px]" style={{ clipPath: HEX, background: filled ? "transparent" : "#0c0c0e" }} />
            {filled && <Check size={12} strokeWidth={3} className="relative text-black" />}
            {active && !filled && (
                <motion.div
                    className="absolute inset-0"
                    style={{ clipPath: HEX, border: `1px solid ${color}` }}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                />
            )}
        </div>
    );
}

export default function StationClip({ station, index = 0, total = 3 }) {
    const Icon = ICONS[station.icon] ?? AlertTriangle;
    const a = station.accent;
    const sectionRef = useRef(null);
    const videoRef   = useRef(null);
    const [collected, setCollected] = useState(false);
    const [playing, setPlaying]     = useState(false);
    const [revealed, setRevealed]   = useState(false);
    const { collect } = useJourney();

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"],
    });
    const yVideo = useTransform(scrollYProgress, [0, 1], [50, -50]);
    const yText  = useTransform(scrollYProgress, [0, 1], [40, -20]);
    const yCardA = useTransform(scrollYProgress, [0, 1], [110, -90]);
    const yCardB = useTransform(scrollYProgress, [0, 1], [150, -70]);

    /* Play once on enter; reset on leave so it can replay */
    useEffect(() => {
        const el = sectionRef.current;
        const v  = videoRef.current;
        if (!el || !v) return;
        const io = new IntersectionObserver(
            (entries) => entries.forEach((e) => {
                if (e.isIntersecting) {
                    setCollected(false);
                    setRevealed(false);
                    try { v.currentTime = 0; v.play(); setPlaying(true); } catch (_) {}
                } else {
                    v.pause();
                    setPlaying(false);
                }
            }),
            { threshold: 0.5 }
        );
        io.observe(el);
        return () => io.disconnect();
    }, []);

    /* Timed collect */
    useEffect(() => {
        const v = videoRef.current;
        if (!v) return;
        const onTime = () => {
            if (v.currentTime >= (station.collectAt ?? 1.4)) {
                setCollected(true);
                collect(station.id);
            }
        };
        const onEnd  = () => setPlaying(false);
        const onPlaying = () => setRevealed(true);
        v.addEventListener("timeupdate", onTime);
        v.addEventListener("ended", onEnd);
        v.addEventListener("playing", onPlaying);
        return () => {
            v.removeEventListener("timeupdate", onTime);
            v.removeEventListener("ended", onEnd);
            v.removeEventListener("playing", onPlaying);
        };
    }, [station.collectAt, station.id, collect]);

    const filledSlots = (i) => i < index || (i === index && collected);

    return (
        <section
            ref={sectionRef}
            id={`station-${station.id}`}
            data-testid={`station-${station.id}`}
            className="relative flex min-h-[92vh] items-center overflow-hidden bg-ink py-20"
        >
            {/* ── Parallax video layer (edge-bleeding) ── */}
            <motion.div style={{ y: yVideo }} className="absolute inset-0 z-0">
                <video
                    ref={videoRef}
                    src={station.clip}
                    muted
                    playsInline
                    preload="auto"
                    className="station-media absolute bottom-0 left-0 right-0 h-[64%] w-full object-cover lg:inset-y-0 lg:left-auto lg:right-0 lg:h-full lg:w-[66%]"
                    style={{
                        /* keep the rider/action centered in the visible
                           area despite the left-fade mask (mask hides 42% on lg) */
                        objectPosition: "60% center",
                        filter: "contrast(1.05) saturate(1.08)",
                        opacity: revealed ? 1 : 0,
                        transition: "opacity 0.55s ease",
                    }}
                />
                {/* theme tint pooling toward the content side */}
                <div className="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(90% 70% at 78% 50%, ${a}1c, transparent 60%)` }} />

                {/* timed collectable hexagon over the river */}
                <AnimatePresence>
                    {!collected ? (
                        <motion.div
                            key="hex"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 1.9, opacity: 0, y: -50 }}
                            transition={{ type: "spring", stiffness: 200, damping: 14 }}
                            className="absolute left-1/2 bottom-[30%] grid h-16 w-16 -translate-x-1/2 place-items-center lg:left-[60%] lg:top-[50%] lg:bottom-auto lg:-translate-y-1/2"
                        >
                            <motion.div
                                className="absolute inset-0"
                                style={{ clipPath: HEX, background: a }}
                                animate={{ filter: [`drop-shadow(0 0 8px ${a})`, `drop-shadow(0 0 22px ${a})`, `drop-shadow(0 0 8px ${a})`], scale: [1, 1.08, 1] }}
                                transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                            />
                            <div className="absolute inset-[3px] grid place-items-center" style={{ clipPath: HEX, background: "#0b0b0d" }}>
                                <Icon size={24} strokeWidth={2.3} style={{ color: a }} />
                            </div>
                            <div className="absolute top-full h-12 w-6 -translate-y-1" style={{ background: `linear-gradient(${a}, transparent)`, filter: "blur(6px)", opacity: 0.7 }} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="burst"
                            initial={{ scale: 0.4, opacity: 0 }}
                            animate={{ scale: [0.4, 1.5, 0], opacity: [1, 1, 0] }}
                            transition={{ duration: 0.7, ease }}
                            className="absolute left-1/2 bottom-[30%] h-20 w-20 -translate-x-1/2 rounded-full lg:left-[60%] lg:top-[50%] lg:bottom-auto lg:-translate-y-1/2"
                            style={{ border: `2px solid ${a}`, boxShadow: `0 0 30px ${a}` }}
                        />
                    )}
                </AnimatePresence>
            </motion.div>

            {/* ── Floating game-UI card: RUN + power-ups (desktop) ── */}
            <motion.div
                style={{ y: yCardA }}
                className="absolute right-[5%] top-[14%] z-20 hidden lg:block"
            >
                <div className="glass-strong px-5 py-4" style={{ clipPath: clip(CUT) }}>
                    <div className="flex items-center gap-2.5">
                        <ChevronsDown size={15} style={{ color: a }} />
                        <span className="font-display text-[10px] font-bold uppercase tracking-[0.25em] text-white/60">
                            Downhill Run · <span style={{ color: a }}>{station.n}</span>/0{total}
                        </span>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                        {Array.from({ length: total }).map((_, i) => (
                            <HudSlot key={i} color={SLOT_COLORS[i] ?? a} filled={filledSlots(i)} active={i === index} />
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* ── Floating stat chip (desktop, game feel) ── */}
            <motion.div
                style={{ y: yCardB }}
                className="absolute bottom-[16%] right-[40%] z-20 hidden lg:block"
            >
                <div className="glass flex items-center gap-2.5 px-4 py-2.5" style={{ clipPath: clip(10) }}>
                    <Gauge size={15} style={{ color: a }} />
                    <span className="font-display text-[10px] font-bold uppercase tracking-[0.18em] text-white/70">
                        {station.readout}
                    </span>
                    <span className="h-2 w-2 rounded-full" style={{ background: playing ? "#4ade80" : "rgba(255,255,255,0.3)" }} />
                </div>
            </motion.div>

            {/* ── Content (left) — anchored further left on desktop ── */}
            <motion.div
                style={{ y: yText }}
                className="relative z-10 mx-auto w-full max-w-6xl px-6 sm:px-8 lg:mx-0 lg:max-w-none lg:pl-[5vw]"
            >
                <div className="max-w-lg">
                    {/* mobile HUD row */}
                    <div className="mb-6 flex items-center justify-between lg:hidden">
                        <span className="font-display text-[10px] font-bold uppercase tracking-[0.22em] text-white/55">
                            Run <span style={{ color: a }}>{station.n}</span>/0{total}
                        </span>
                        <div className="flex items-center gap-2">
                            {Array.from({ length: total }).map((_, i) => (
                                <HudSlot key={i} color={SLOT_COLORS[i] ?? a} filled={filledSlots(i)} active={i === index} />
                            ))}
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 18 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, ease }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em]"
                        style={{ clipPath: clip(7), border: `1px solid ${a}66`, color: a, background: `${a}1f` }}
                    >
                        {station.kicker}
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 22 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, ease, delay: 0.05 }}
                        className="mt-4 font-display text-[2.6rem] font-black uppercase leading-[0.9] tracking-tight text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.7)] sm:text-6xl"
                    >
                        {station.title}
                    </motion.h2>

                    <motion.span
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, ease, delay: 0.2 }}
                        className="mt-5 block h-1 w-20 origin-left"
                        style={{ background: a, boxShadow: `0 0 12px ${a}` }}
                    />

                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, ease, delay: 0.1 }}
                        className="mt-6 max-w-md text-[15px] leading-relaxed text-white/75"
                    >
                        {station.intro}
                    </motion.p>

                    <ul className="mt-6 space-y-3.5">
                        {station.bullets.map((b, i) => (
                            <motion.li
                                key={i}
                                initial={{ opacity: 0, x: -16 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, ease, delay: 0.15 + i * 0.08 }}
                                className="flex items-start gap-3"
                            >
                                <span className="mt-2 h-1.5 w-1.5 flex-none rotate-45" style={{ background: a, boxShadow: `0 0 8px ${a}` }} />
                                <span className="text-[15px] leading-relaxed text-white/85">{b}</span>
                            </motion.li>
                        ))}
                    </ul>

                    {/* MTB-style hex badge under paragraph — fills when collected */}
                    <motion.div
                        initial={{ opacity: 0, y: 18 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.55, ease, delay: 0.35 }}
                        className="mt-9 inline-flex items-center gap-4"
                    >
                        <div className="relative h-16 w-16 sm:h-[68px] sm:w-[68px]">
                            {/* Outer hex — fills with accent when collected */}
                            <motion.div
                                className="absolute inset-0"
                                style={{
                                    clipPath: HEX,
                                    background: collected ? a : "rgba(255,255,255,0.10)",
                                }}
                                animate={
                                    collected
                                        ? {
                                              filter: [
                                                  `drop-shadow(0 0 4px ${a})`,
                                                  `drop-shadow(0 0 18px ${a})`,
                                                  `drop-shadow(0 0 4px ${a})`,
                                              ],
                                          }
                                        : {}
                                }
                                transition={{ duration: 1.8, repeat: Infinity }}
                            />
                            {/* Inner hex — dark core so icon stays legible */}
                            <div
                                className="absolute inset-[3px] grid place-items-center"
                                style={{
                                    clipPath: HEX,
                                    background: "#0b0b0d",
                                }}
                            >
                                <Icon
                                    size={26}
                                    strokeWidth={2.3}
                                    style={{
                                        color: collected ? a : "rgba(255,255,255,0.45)",
                                    }}
                                />
                            </div>
                        </div>
                        <div>
                            <span
                                className="font-display text-[10px] font-bold uppercase tracking-[0.28em]"
                                style={{
                                    color: collected ? a : "rgba(255,255,255,0.4)",
                                }}
                            >
                                {collected ? "Power-up collected" : "Power-up pending"}
                            </span>
                            <p
                                className="mt-1 font-display text-[13px] font-bold uppercase tracking-tight"
                                style={{
                                    color: collected ? "#fff" : "rgba(255,255,255,0.55)",
                                }}
                            >
                                {station.powerup}
                            </p>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
}
