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

    const handoffStart = 0.006;
    const handoffEnd = 0.022;
    const heroOpacity = useTransform(scrollYProgress, [0, handoffStart, handoffEnd], [1, 0.45, 0]);
    const heroY = useTransform(scrollYProgress, [0, handoffEnd], [0, -64]);
    const heroScrimOpacity = useTransform(scrollYProgress, [0, 0.008, handoffEnd], [0, 0.5, 1]);

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
            </div>
        </section>
    );
}


