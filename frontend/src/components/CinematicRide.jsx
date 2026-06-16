import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import Hero from "@/components/Hero";

/* ── Scroll-scrubbed cinematic intro ────────────────────────────
   The video time is driven directly by scroll position (scrubbing),
   so the user keeps full control and can scroll back up freely.
   No autoplay, no scroll-lock. A lerp smooths the seek.
────────────────────────────────────────────────────────────────── */
const VIDEO_SRC = "/ride.mp4";
const SECTION_H = "300vh";

export default function CinematicRide({ onJump }) {
    const sectionRef = useRef(null);
    const videoRef   = useRef(null);
    const targetTime = useRef(0);
    const rafRef     = useRef(null);
    const [ready, setReady] = useState(false);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end end"],
    });

    /* Hero fades out as the ride begins */
    const heroOpacity = useTransform(scrollYProgress, [0, 0.08, 0.16], [1, 1, 0]);
    const heroY       = useTransform(scrollYProgress, [0, 0.16], [0, -60]);

    /* Metadata / readiness */
    useEffect(() => {
        const v = videoRef.current;
        if (!v) return;
        const onMeta = () => {
            v.pause();
            v.currentTime = 0;
            setReady(true);
        };
        if (v.readyState >= 1) onMeta();
        else v.addEventListener("loadedmetadata", onMeta, { once: true });
        return () => v.removeEventListener("loadedmetadata", onMeta);
    }, []);

    /* Smooth lerp toward the scroll target time */
    useEffect(() => {
        const tick = () => {
            const v = videoRef.current;
            if (v && !Number.isNaN(v.duration)) {
                const cur  = v.currentTime;
                const next = cur + (targetTime.current - cur) * 0.2;
                if (Math.abs(next - cur) > 0.003) {
                    try { v.currentTime = next; } catch (_) {}
                }
            }
            rafRef.current = requestAnimationFrame(tick);
        };
        rafRef.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafRef.current);
    }, []);

    /* Scroll → target time (linear scrub across the section) */
    useMotionValueEvent(scrollYProgress, "change", (p) => {
        const v = videoRef.current;
        if (v && v.duration) {
            targetTime.current = Math.max(0, Math.min(v.duration, p * v.duration));
        }
    });

    return (
        <section
            ref={sectionRef}
            className="relative"
            style={{ height: SECTION_H }}
            data-testid="cinematic-ride"
        >
            <div className="sticky top-0 h-screen w-full overflow-hidden bg-ink">
                <video
                    ref={videoRef}
                    src={VIDEO_SRC}
                    muted
                    playsInline
                    preload="auto"
                    className="absolute inset-0 h-full w-full object-cover [filter:contrast(1.06)_saturate(1.08)] [object-position:72%_50%] [transform:scale(1.06)] [transform-origin:50%_100%] sm:[object-position:center] sm:[transform:none]"
                    style={{ opacity: ready ? 1 : 0, transition: "opacity 0.6s ease" }}
                />

                {!ready && (
                    <div className="absolute inset-0 grid place-items-center bg-ink">
                        <div className="flex flex-col items-center gap-4">
                            <div
                                data-spin
                                className="h-10 w-10 rounded-full border-2 border-white/15 border-t-brand"
                                style={{ animation: "pedal-spin 0.9s linear infinite" }}
                            />
                            <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                                Loading the trail…
                            </p>
                        </div>
                    </div>
                )}

                {/* Hero + scrims fade together on scroll */}
                <motion.div
                    style={{ opacity: heroOpacity, y: heroY }}
                    className="absolute inset-0"
                >
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/80 via-black/35 to-transparent" />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/25" />
                    <Hero onJump={onJump} />
                </motion.div>
            </div>
        </section>
    );
}
