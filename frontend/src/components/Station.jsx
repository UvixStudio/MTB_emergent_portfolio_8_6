import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Boxes, Users, Check } from "lucide-react";

/* Skill "station" — a darkened, theme-coloured beat with a gaming-HUD frame.
   Rider shot + rotating-stroke hexagon collectable + corner HUD metadata +
   power-up progress + mouse-follow glow. Driven by the `station` data object.
   `index` / `total` power the HUD progress (collectables gathered so far). */

const ICONS = { alert: AlertTriangle, systems: Boxes, leadership: Users };
const HEX   = "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)";
const CUT   = 16;
const ease  = [0.22, 1, 0.36, 1];

const clip = (c) =>
    `polygon(0 0, calc(100% - ${c}px) 0, 100% ${c}px, 100% 100%, ${c}px 100%, 0 calc(100% - ${c}px))`;

export default function Station({ station, index = 0, total = 3 }) {
    const Icon = ICONS[station.icon] ?? AlertTriangle;
    const a = station.accent;
    const [glow, setGlow] = useState({ x: "70%", y: "28%" });

    const onMove = (e) => {
        const r = e.currentTarget.getBoundingClientRect();
        setGlow({ x: `${e.clientX - r.left}px`, y: `${e.clientY - r.top}px` });
    };

    return (
        <section
            id={`station-${station.id}`}
            data-testid={`station-${station.id}`}
            onMouseMove={onMove}
            className="relative overflow-hidden bg-ink py-24 sm:py-32"
        >
            {/* Mouse-follow + ambient theme glow */}
            <div
                className="pointer-events-none absolute inset-0 transition-[background] duration-300"
                style={{ background: `radial-gradient(540px at ${glow.x} ${glow.y}, ${a}20, transparent 70%)` }}
            />
            <div
                className="pointer-events-none absolute inset-0"
                style={{ background: `radial-gradient(120% 80% at 68% 24%, ${a}14, transparent 62%)` }}
            />
            {/* faint grid texture */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.04]"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(255,255,255,.7) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.7) 1px,transparent 1px)",
                    backgroundSize: "46px 46px",
                }}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink via-transparent to-ink" />

            <div className="relative mx-auto max-w-6xl px-6 sm:px-8">
                {/* ── HUD top bar ── */}
                <motion.div
                    initial={{ opacity: 0, y: -12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease }}
                    className="mb-10 flex items-center justify-between border-b border-white/10 pb-4"
                >
                    <span className="font-display text-[11px] font-bold uppercase tracking-[0.25em] text-white/50">
                        Skill <span style={{ color: a }}>{station.n}</span> / 0{total}
                    </span>
                    {/* power-up progress dots */}
                    <div className="flex items-center gap-1.5">
                        {Array.from({ length: total }).map((_, i) => (
                            <span
                                key={i}
                                className="h-1.5 rounded-full transition-all"
                                style={{
                                    width: i === index ? 26 : 10,
                                    background: i <= index ? a : "rgba(255,255,255,0.18)",
                                    boxShadow: i <= index ? `0 0 8px ${a}` : "none",
                                }}
                            />
                        ))}
                    </div>
                </motion.div>

                <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
                    {/* ── Rider shot with HUD corner brackets ── */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.7, ease }}
                        className="relative"
                    >
                        {/* corner brackets */}
                        {[
                            "left-0 top-0 border-l-2 border-t-2",
                            "right-0 top-0 border-r-2 border-t-2",
                            "left-0 bottom-0 border-l-2 border-b-2",
                            "right-0 bottom-0 border-r-2 border-b-2",
                        ].map((pos) => (
                            <span
                                key={pos}
                                className={`pointer-events-none absolute z-20 h-6 w-6 ${pos}`}
                                style={{ borderColor: a }}
                            />
                        ))}

                        <div className="relative" style={{ clipPath: clip(CUT) }}>
                            <img
                                src={station.frame}
                                alt={station.title}
                                loading="lazy"
                                className="aspect-[4/3] w-full object-cover"
                            />
                            <div
                                className="absolute inset-0"
                                style={{ background: `linear-gradient(180deg, transparent 36%, ${a}1f, rgba(8,8,8,0.88))` }}
                            />
                            <div
                                className="absolute inset-0"
                                style={{ clipPath: clip(CUT), boxShadow: `inset 0 0 0 1.5px ${a}88, 0 0 50px -10px ${a}` }}
                            />
                            {/* scan sweep */}
                            <motion.div
                                className="absolute inset-x-0 h-px"
                                style={{ background: `linear-gradient(90deg, transparent, ${a}, transparent)` }}
                                animate={{ top: ["8%", "92%", "8%"] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                            />
                        </div>

                        {/* Hexagon collectable with rotating stroke */}
                        <div className="absolute -top-7 left-6 grid h-[84px] w-[84px] place-items-center">
                            {/* rotating sweep ring */}
                            <motion.div
                                className="absolute inset-0"
                                style={{
                                    clipPath: HEX,
                                    background: `conic-gradient(from 0deg, transparent 0deg, ${a} 70deg, #fff 90deg, ${a} 110deg, transparent 180deg, transparent 360deg)`,
                                }}
                                animate={{ rotate: 360 }}
                                transition={{ duration: 3.2, repeat: Infinity, ease: "linear" }}
                            />
                            {/* dim base border */}
                            <div className="absolute inset-0" style={{ clipPath: HEX, background: `${a}55` }} />
                            {/* inner */}
                            <motion.div
                                className="absolute inset-[3px] grid place-items-center"
                                style={{ clipPath: HEX, background: "#0b0b0d" }}
                                animate={{ filter: [`drop-shadow(0 0 6px ${a}88)`, `drop-shadow(0 0 16px ${a})`, `drop-shadow(0 0 6px ${a}88)`] }}
                                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <Icon size={28} strokeWidth={2.2} style={{ color: a }} />
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* ── Text ── */}
                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, ease }}
                            className="inline-flex items-center gap-2 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em]"
                            style={{ clipPath: clip(7), border: `1px solid ${a}66`, color: a, background: `${a}14` }}
                        >
                            {station.kicker}
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, ease, delay: 0.05 }}
                            className="mt-4 font-display text-[2.5rem] font-black uppercase leading-[0.92] tracking-tight text-white sm:text-6xl"
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
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, ease, delay: 0.1 }}
                            className="mt-6 max-w-md text-[15px] leading-relaxed text-white/65"
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
                                    <span className="text-[15px] leading-relaxed text-white/80">{b}</span>
                                </motion.li>
                            ))}
                        </ul>

                        {/* Power-up collected pill */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, ease, delay: 0.5 }}
                            className="mt-8 inline-flex items-center gap-2.5 py-2 pl-2 pr-4"
                            style={{ clipPath: clip(9), background: `${a}1a`, border: `1px solid ${a}55` }}
                        >
                            <span className="grid h-5 w-5 place-items-center rounded-full" style={{ background: a }}>
                                <Check size={13} strokeWidth={3} className="text-black" />
                            </span>
                            <span className="text-[12px] font-bold uppercase tracking-wide" style={{ color: a }}>
                                Power-up collected · {station.powerup}
                            </span>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
