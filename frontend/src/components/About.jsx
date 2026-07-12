import { Compass, Palette, Sparkles, Boxes, Wrench } from "lucide-react";
import { motion } from "framer-motion";
import { ABOUT, CAPABILITIES } from "@/data/content";
import {
    Reveal,
    TrailHeading,
    CountUp,
    WordsReveal,
} from "@/components/Primitives";

const ICONS = { Compass, Palette, Sparkles, Boxes, Wrench };
const HEX =
    "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)";
const ease = [0.22, 1, 0.36, 1];

/* ── A capability hexagon — appears in the bottom row ─────────── */
function HexBadge({ cap, i }) {
    const Icon = ICONS[cap.icon];
    return (
        <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, delay: i * 0.08, ease }}
            className="group relative flex w-full max-w-[160px] flex-col items-center text-center"
            data-testid={`about-capability-hexagon-${i}`}
        >
            <div className="relative aspect-[0.88] w-[120px] transition-transform duration-300 group-hover:-translate-y-2 sm:w-[140px]">
                {/* hex border layer */}
                <div
                    className="absolute inset-0 bg-white/15 transition-colors duration-300 group-hover:bg-brand"
                    style={{ clipPath: HEX }}
                />
                {/* hex inner */}
                <div
                    className="absolute inset-[2px] flex flex-col items-center justify-center gap-2 bg-[#0b1422]/95 backdrop-blur-md transition-colors duration-300 group-hover:bg-[#15243a]/95"
                    style={{ clipPath: HEX }}
                >
                    <Icon
                        size={28}
                        strokeWidth={2}
                        className="text-white transition-colors duration-300 group-hover:text-brand"
                    />
                    <span className="px-2 text-center font-display text-[10px] font-bold uppercase leading-tight tracking-tight text-white">
                        {cap.title.split("·")[0]}
                    </span>
                </div>
            </div>
            <p className="mt-3 max-w-[140px] text-[11px] leading-snug text-white/55">
                {cap.desc.split(".")[0]}.
            </p>
        </motion.div>
    );
}

/* ── About — split layout (bio left, portrait right, hexagons bottom) ── */
export default function About() {
    return (
        <section
            id="about"
            className="relative overflow-hidden bg-ink py-24 sm:py-32"
            data-testid="about-section"
        >
            {/* Topographic mountain wireframe as backdrop — establishes
                the trail atmosphere without competing with content */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
            >
                <img
                    src="/site%20assets/cliff-mtb-route.png"
                    alt=""
                    className="h-full w-full object-cover opacity-[0.22]"
                    style={{ objectPosition: "center 40%" }}
                />
                {/* vignette so center has breathing room and edges fade to ink */}
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            "radial-gradient(110% 80% at 50% 50%, transparent, rgba(14,26,43,0.85) 80%)",
                    }}
                />
                {/* top + bottom fade into adjacent sections */}
                <div
                    className="absolute inset-x-0 top-0 h-32"
                    style={{
                        background:
                            "linear-gradient(to bottom, var(--ink), transparent)",
                    }}
                />
                <div
                    className="absolute inset-x-0 bottom-0 h-32"
                    style={{
                        background:
                            "linear-gradient(to top, var(--ink), transparent)",
                    }}
                />
            </div>

            {/* faint grid overlay — keeps the topographic feel */}
            <svg
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 h-full w-full opacity-30"
                width="100%"
                height="100%"
            >
                <defs>
                    <pattern
                        id="about-grid"
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
                <rect width="100%" height="100%" fill="url(#about-grid)" />
            </svg>

            {/* warm pool of light behind the portrait */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute right-[8%] top-[20%] hidden h-[420px] w-[420px] rounded-full lg:block"
                style={{
                    background:
                        "radial-gradient(circle, rgba(250,204,21,0.13), transparent 70%)",
                    filter: "blur(40px)",
                }}
            />

            <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8">
                <Reveal>
                    <TrailHeading
                        n="01"
                        label="Rider Profile"
                        color="var(--cp-about)"
                    />
                </Reveal>

                {/* Top row: bio + portrait, side by side on desktop */}
                <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-16">
                    {/* LEFT — bio, quote, stats */}
                    <div className="lg:col-span-7 lg:max-w-2xl">
                        {/* big lead with word-by-word reveal */}
                        <WordsReveal
                            as="p"
                            text={ABOUT.lead}
                            className="font-display font-medium leading-[1.15] text-white"
                            stagger={0.04}
                            y={20}
                            blur={6}
                            style={{
                                fontSize:
                                    "clamp(1.4rem, 2.3vw, 2.2rem)",
                                letterSpacing: "-0.015em",
                            }}
                        />

                        {/* body — fades in lower so it reads as a second beat */}
                        <Reveal delay={0.4}>
                            <p className="mt-7 max-w-xl text-[15px] leading-relaxed text-white/65">
                                {ABOUT.body}
                            </p>
                        </Reveal>

                        {/* quote */}
                        <Reveal delay={0.55}>
                            <blockquote className="mt-8 border-l-2 border-brand pl-5">
                                <p className="font-display text-lg font-medium italic leading-snug text-brand sm:text-xl">
                                    &ldquo;{ABOUT.quote}&rdquo;
                                </p>
                            </blockquote>
                        </Reveal>

                        {/* stat cells */}
                        <Reveal delay={0.7}>
                            <div className="mt-10 grid max-w-md grid-cols-4 gap-x-5 gap-y-3">
                                {ABOUT.stats.map((s) => (
                                    <div key={s.label}>
                                        <div className="font-display text-2xl font-black text-white sm:text-[2rem]">
                                            <CountUp
                                                value={s.value}
                                                suffix={s.suffix}
                                            />
                                        </div>
                                        <p className="mt-1.5 text-[10px] uppercase leading-tight tracking-[0.18em] text-white/50">
                                            {s.label}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </Reveal>
                    </div>

                    {/* RIGHT — real portrait photo */}
                    <div className="lg:col-span-5">
                        <motion.div
                            initial={{ opacity: 0, y: 30, scale: 0.97 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.9, ease }}
                            className="relative mx-auto max-w-[420px] lg:mx-0 lg:ml-auto lg:max-w-none"
                        >
                            {/* frame glow */}
                            <div
                                aria-hidden="true"
                                className="pointer-events-none absolute -inset-3 -z-10 rounded-md"
                                style={{
                                    background:
                                        "radial-gradient(60% 60% at 50% 50%, rgba(250,204,21,0.18), transparent 70%)",
                                    filter: "blur(20px)",
                                }}
                            />

                            <div
                                className="relative overflow-hidden bg-ink-2"
                                style={{
                                    clipPath:
                                        "polygon(0 18px, 18px 0, calc(100% - 18px) 0, 100% 18px, 100% calc(100% - 18px), calc(100% - 18px) 100%, 18px 100%, 0 calc(100% - 18px))",
                                }}
                            >
                                <img
                                    src="/profile.jpg"
                                    alt="Yuval Cohen — Creative Director"
                                    loading="lazy"
                                    className="block aspect-[4/5] w-full object-cover"
                                    style={{ objectPosition: "center 22%" }}
                                />
                                {/* subtle bottom gradient for label */}
                                <div
                                    aria-hidden="true"
                                    className="absolute inset-0"
                                    style={{
                                        background:
                                            "linear-gradient(180deg, transparent 65%, rgba(14,26,43,0.92))",
                                    }}
                                />
                                <div className="absolute inset-x-0 bottom-0 px-5 py-4">
                                    <span className="font-display text-[10px] font-bold uppercase tracking-[0.28em] text-brand">
                                        Tel Aviv · Israel
                                    </span>
                                    <p className="mt-1 font-display text-base font-bold uppercase tracking-tight text-white">
                                        Yuval Cohen
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Bottom row: capabilities — full width, centered */}
                <div className="mt-24 sm:mt-28">
                    <Reveal>
                        <p className="text-center text-[11px] font-bold uppercase tracking-[0.3em] text-white/45">
                            Capabilities along the trail
                        </p>
                    </Reveal>
                    <div className="relative mt-10">
                        {/* dashed connector line */}
                        <div className="pointer-events-none absolute left-0 right-0 top-[60px] hidden h-px md:block">
                            <svg width="100%" height="2">
                                <line
                                    x1="0"
                                    y1="1"
                                    x2="100%"
                                    y2="1"
                                    stroke="var(--brand)"
                                    strokeWidth="1.5"
                                    strokeDasharray="2 7"
                                    opacity="0.35"
                                />
                            </svg>
                        </div>
                        <div className="relative flex flex-wrap items-start justify-center gap-x-8 gap-y-10 md:justify-between md:gap-x-4">
                            {CAPABILITIES.map((cap, i) => (
                                <HexBadge key={cap.title} cap={cap} i={i} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
