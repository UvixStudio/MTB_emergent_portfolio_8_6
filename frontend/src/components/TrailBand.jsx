import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const pad = (n) => String(n).padStart(4, "0");

/**
 * TrailBand — a full-bleed section that keeps the continuous mountain-trail
 * visual language: a hand-picked ride frame as a parallax background, heavy
 * gradient scrims for legibility, an ambient tint, and content on top.
 */
export default function TrailBand({
    id,
    frame,
    src,
    scrim = "left",
    tint = "rgba(10,10,10,0.42)",
    children,
    className = "",
    minH = "min-h-screen",
    bgSize = "cover",
    bgPosition = "center",
    bgScale = 1.16,
}) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });
    const bgY = useTransform(scrollYProgress, [0, 1], ["-7%", "7%"]);

    const scrimClass =
        scrim === "left"
            ? "bg-gradient-to-r from-black/95 via-black/70 to-transparent"
            : scrim === "right"
            ? "bg-gradient-to-l from-black/95 via-black/70 to-transparent"
            : "bg-gradient-to-t from-black/95 via-black/60 to-black/30";

    return (
        <section
            id={id}
            ref={ref}
            className={`relative isolate overflow-hidden ${minH} ${className}`}
            data-testid={id ? `${id}-section` : undefined}
        >
            <motion.div
                aria-hidden
                className="absolute inset-0 -z-20"
                style={{ y: bgY }}
            >
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `url(${src || `/ride/ride_${pad(frame)}.webp`})`,
                        backgroundSize: bgSize,
                        backgroundPosition: bgPosition,
                        transform: `scale(${bgScale})`,
                    }}
                />
            </motion.div>
            <div
                aria-hidden
                className={`absolute inset-0 -z-10 ${scrimClass}`}
            />
            <div
                aria-hidden
                className="absolute inset-0 -z-10"
                style={{ background: tint }}
            />
            <div className="relative z-10">{children}</div>
        </section>
    );
}
