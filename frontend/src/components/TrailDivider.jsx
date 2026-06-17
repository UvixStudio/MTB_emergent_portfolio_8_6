import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/* TrailDivider — a section break that doubles as a narrative beat.
   - A faint horizontal trail line spans the section.
   - A tiny SVG rider silhouette traverses the line in sync with scroll.
   - A pill in the middle announces the upcoming stop: "▸ 02 · NEXT STOP".
   - On scroll, the line slowly fills with brand color from left to right. */

const ease = [0.22, 1, 0.36, 1];

/* Stylised low-poly rider — kept tiny and silhouette-y so it reads
   even at 28px wide */
function RiderGlyph({ color = "currentColor" }) {
    return (
        <svg
            width="28"
            height="20"
            viewBox="0 0 56 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            {/* wheels */}
            <circle cx="12" cy="32" r="6" stroke={color} strokeWidth="2" />
            <circle cx="44" cy="32" r="6" stroke={color} strokeWidth="2" />
            {/* frame */}
            <path
                d="M12 32 L26 32 L34 18 L44 32 M26 32 L34 18 L20 18 Z"
                stroke={color}
                strokeWidth="2"
                strokeLinejoin="round"
            />
            {/* rider body */}
            <path
                d="M20 18 L26 8 L34 12 L36 18"
                stroke={color}
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
            />
            {/* head */}
            <circle cx="26" cy="6" r="3" fill={color} />
        </svg>
    );
}

export default function TrailDivider({ n, label, accent = "var(--brand)" }) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });

    /* Rider travels from 4% → 96% of the line as the divider scrolls */
    const riderX = useTransform(scrollYProgress, [0, 1], ["3%", "97%"]);
    /* Line fills with brand color from left to right */
    const fillScale = useTransform(scrollYProgress, [0, 1], [0, 1]);
    /* Pill fades in around the middle */
    const pillOpacity = useTransform(
        scrollYProgress,
        [0, 0.3, 0.7, 1],
        [0, 1, 1, 0.6]
    );

    return (
        <div
            ref={ref}
            className="relative overflow-hidden py-16 sm:py-20"
            aria-hidden="true"
        >
            {/* Center horizontal track */}
            <div className="relative mx-auto h-px w-full max-w-7xl px-6 sm:px-8">
                <div className="relative h-px w-full">
                    {/* base line */}
                    <div className="absolute inset-0 bg-white/8" />
                    {/* yellow fill */}
                    <motion.div
                        className="absolute inset-0 origin-left"
                        style={{ scaleX: fillScale, background: accent }}
                    />
                </div>

                {/* Traveling rider — sits on top of the line */}
                <motion.div
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 text-white"
                    style={{ left: riderX, color: accent }}
                >
                    <RiderGlyph color={accent} />
                </motion.div>

                {/* Center pill — announces the next stop */}
                <motion.div
                    style={{ opacity: pillOpacity }}
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
                        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.6, ease, delay: 0.1 }}
                        className="inline-flex items-center gap-3 px-4 py-2 backdrop-blur-md"
                        style={{
                            clipPath:
                                "polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px)",
                            background: "rgba(6,11,19,0.85)",
                            border: `1px solid ${accent}55`,
                        }}
                    >
                        <span
                            className="font-display text-[10px] font-extrabold tracking-[0.3em]"
                            style={{ color: accent }}
                        >
                            NEXT STOP
                        </span>
                        <span className="h-3 w-px bg-white/20" />
                        <span
                            className="font-display text-[10px] font-extrabold tracking-[0.3em]"
                            style={{ color: accent }}
                        >
                            {n}
                        </span>
                        <span className="font-display text-[11px] font-bold uppercase tracking-[0.18em] text-white/85">
                            {label}
                        </span>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
