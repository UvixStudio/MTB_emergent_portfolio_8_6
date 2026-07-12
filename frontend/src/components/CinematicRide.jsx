import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import Hero from "@/components/Hero";

const VIDEO_SRC = "/ride.mp4";
const SECTION_H = "300vh";

export default function CinematicRide({ onJump }) {
    const sectionRef = useRef(null);
    const videoRef = useRef(null);
    const targetTime = useRef(0);
    const rafRef = useRef(null);
    const [ready, setReady] = useState(false);
    const [isHandoff, setIsHandoff] = useState(false);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end end"],
    });

    /* Softer handoff: the hero copy releases over ~18vh of scroll instead of
       vanishing almost immediately, so the ride "takes over" rather than the
       text popping out. */
    const handoffStart = 0.015;
    const handoffEnd = 0.06;
    const heroOpacity = useTransform(scrollYProgress, [0, handoffStart, handoffEnd], [1, 0.6, 0]);
    const heroY = useTransform(scrollYProgress, [0, handoffEnd], [0, -90]);
    const heroScrimOpacity = useTransform(scrollYProgress, [0, 0.025, handoffEnd], [0, 0.4, 1]);

    /* End-of-ride bridge: as the video runs out, a ridge silhouette and an
       ink gradient rise from the bottom so the ride melts into Station 01
       instead of hard-cutting to a dark section. */
    const bridgeOpacity = useTransform(scrollYProgress, [0.8, 0.97], [0, 1]);
    const bridgeY = useTransform(scrollYProgress, [0.8, 1], [60, 0]);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const onMeta = () => {
            video.currentTime = 0;
            setReady(true);
        };

        if (video.readyState >= 1) onMeta();
        else video.addEventListener("loadedmetadata", onMeta, { once: true });

        return () => video.removeEventListener("loadedmetadata", onMeta);
    }, []);

    useEffect(() => {
        const tick = () => {
            const video = videoRef.current;
            if (video && !Number.isNaN(video.duration)) {
                const current = video.currentTime;
                const next = current + (targetTime.current - current) * 0.2;
                if (Math.abs(next - current) > 0.003) {
                    try {
                        video.currentTime = next;
                    } catch (_) {}
                }
            }
            rafRef.current = requestAnimationFrame(tick);
        };

        rafRef.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafRef.current);
    }, []);

    useMotionValueEvent(scrollYProgress, "change", (progress) => {
        const video = videoRef.current;
        if (video && video.duration) {
            targetTime.current = Math.max(0, Math.min(video.duration, progress * video.duration));
        }
        setIsHandoff(progress > 0.004);
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
                                Loading the trail...
                            </p>
                        </div>
                    </div>
                )}

                <motion.div
                    style={{ opacity: heroOpacity, y: heroY }}
                    className="absolute inset-0"
                >
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/80 via-black/35 to-transparent" />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/25" />
                    <Hero onJump={onJump} hideDesktopTagline={isHandoff} freezeRoles={isHandoff} />
                    <motion.div
                        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/75 to-black/35"
                        style={{ opacity: heroScrimOpacity }}
                    />
                </motion.div>

                {/* ride → stations terrain bridge */}
                <motion.div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-[42vh]"
                    style={{ opacity: bridgeOpacity, y: bridgeY }}
                >
                    <div
                        className="absolute inset-0"
                        style={{
                            background:
                                "linear-gradient(to top, var(--ink) 8%, rgba(14,26,43,0.75) 40%, transparent)",
                        }}
                    />
                    <svg
                        className="absolute inset-x-0 bottom-0 h-[46%] w-full"
                        viewBox="0 0 1200 220"
                        preserveAspectRatio="none"
                    >
                        <path
                            d="M0 156 L95 116 L185 144 L305 98 L405 134 L525 90 L645 130 L765 96 L885 132 L1005 104 L1125 136 L1200 114 L1200 220 L0 220 Z"
                            fill="#182a3e"
                            opacity="0.85"
                        />
                        <path
                            d="M0 184 L120 148 L245 174 L385 136 L525 168 L665 134 L805 166 L945 140 L1085 170 L1200 150 L1200 220 L0 220 Z"
                            fill="var(--ink)"
                        />
                    </svg>
                </motion.div>
            </div>
        </section>
    );
}


