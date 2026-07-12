import { motion, useInView, useMotionValue, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const ease = [0.22, 1, 0.36, 1];

/* ── Fade-up reveal, in-view ──────────────────────────────────── */
export function Reveal({ children, delay = 0, y = 28, className }) {
    return (
        <motion.div
            initial={{ opacity: 0, y }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease, delay }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

/* ── Section label (legacy, used by older sections) ───────────── */
export function SectionLabel({ n, label, color = "var(--brand)" }) {
    return (
        <div className="flex items-center gap-4">
            <span
                className="font-display text-4xl font-black leading-none sm:text-5xl"
                style={{ color }}
            >
                {n}
            </span>
            <div>
                <span
                    className="block h-0.5 w-12"
                    style={{ background: color }}
                />
                <h2 className="mt-2 font-display text-2xl font-bold uppercase tracking-tight text-white sm:text-4xl">
                    {label}
                </h2>
            </div>
        </div>
    );
}

/* ── Animated number count-up ─────────────────────────────────── */
export function CountUp({ value, suffix = "", duration = 1.6 }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-60px" });
    const mv = useMotionValue(0);
    const [display, setDisplay] = useState(0);

    useEffect(() => {
        if (!inView) return;
        const controls = animate(mv, value, {
            duration,
            ease: "easeOut",
            onUpdate: (v) => setDisplay(Math.round(v)),
        });
        return controls.stop;
    }, [inView, value, duration, mv]);

    return (
        <span ref={ref}>
            {display}
            {suffix}
        </span>
    );
}

/* ── Word-by-word blur-in animation primitive ─────────────────── */
export function WordsReveal({
    text,
    as: As = "span",
    className = "",
    style,
    delay = 0,
    stagger = 0.06,
    y = 24,
    blur = 8,
}) {
    const words = String(text).split(" ");
    return (
        <As className={className} style={style} aria-label={text}>
            {words.map((w, i) => (
                <span
                    key={`${w}-${i}`}
                    aria-hidden="true"
                    style={{ display: "inline-block", overflow: "hidden", paddingBottom: "0.12em" }}
                >
                    <motion.span
                        initial={{ opacity: 0, y, filter: `blur(${blur}px)` }}
                        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{ duration: 0.7, ease, delay: delay + i * stagger }}
                        style={{ display: "inline-block", willChange: "transform, opacity, filter" }}
                    >
                        {w}
                    </motion.span>
                    {i < words.length - 1 && <span>&nbsp;</span>}
                </span>
            ))}
        </As>
    );
}

/* ── Editorial-scale section heading (the "wow" headline) ─────
   Renders a small kicker label + an enormous editorial heading
   with word-by-word blur-in reveal. Use sparingly — once per
   section, max — for the headlining moments.                      */
export function BigHeading({
    n,
    kicker,
    title,
    color = "var(--brand)",
    align = "left",
    className = "",
}) {
    const alignClass =
        align === "center"
            ? "items-center text-center"
            : "items-start text-left";
    return (
        <div className={`flex flex-col ${alignClass} ${className}`}>
            <Reveal>
                <div className="flex items-center gap-3">
                    {n && (
                        <span
                            className="font-display text-[11px] font-extrabold uppercase tracking-[0.3em]"
                            style={{ color }}
                        >
                            {n}
                        </span>
                    )}
                    {n && (
                        <span
                            className="h-1.5 w-1.5 rounded-full"
                            style={{ background: color }}
                        />
                    )}
                    {kicker && (
                        <span className="font-display text-[11px] font-bold uppercase tracking-[0.3em] text-white/55">
                            {kicker}
                        </span>
                    )}
                </div>
            </Reveal>
            <WordsReveal
                as="h2"
                text={title}
                delay={0.05}
                className="mt-4 font-display font-black uppercase text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.7)]"
                style={{
                    fontSize: "clamp(2.75rem, 9.5vw, 9rem)",
                    lineHeight: 0.88,
                    letterSpacing: "-0.035em",
                }}
            />
        </div>
    );
}

/* ── Smaller section heading, used inline with content ────────
   Typographic rhythm: the big heading is title-case (not shouted),
   while the small numeral keeps the uppercase HUD voice. This breaks
   the uniform-uppercase monotony across the page.                  */
export function TrailHeading({ n, label, color = "var(--brand)" }) {
    return (
        <div className="flex flex-wrap items-baseline gap-3">
            <span
                className="font-display text-sm font-extrabold tracking-widest"
                style={{ color }}
            >
                {n}
            </span>
            <span
                className="h-1.5 w-1.5 translate-y-[-0.35em] rounded-full"
                style={{ background: color }}
            />
            <WordsReveal
                as="h2"
                text={label}
                stagger={0.05}
                y={18}
                blur={5}
                className="font-display font-black text-white drop-shadow-[0_3px_10px_rgba(0,0,0,0.8)]"
                style={{
                    fontSize: "clamp(1.875rem, 5vw, 3.5rem)",
                    lineHeight: 0.98,
                    letterSpacing: "-0.02em",
                }}
            />
        </div>
    );
}
