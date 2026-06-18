import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Boxes, Users } from "lucide-react";
import { POWERUPS } from "@/data/content";
import { useJourney } from "@/context/JourneyContext";

/* Game HUD — the rider's collected power-ups.
   Only visible while the Stations zone is in view; otherwise it's noise
   that distracts from the rest of the site. */

const ICONS = { alert: AlertTriangle, systems: Boxes, leadership: Users };
const HEX   = "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)";

function Slot({ pu, filled }) {
    const Icon = ICONS[pu.icon] ?? AlertTriangle;
    return (
        <div className="relative grid h-9 w-9 place-items-center">
            <motion.div
                className="absolute inset-0"
                style={{ clipPath: HEX, background: filled ? pu.color : "rgba(255,255,255,0.10)" }}
                animate={filled ? { filter: [`drop-shadow(0 0 3px ${pu.color})`, `drop-shadow(0 0 14px ${pu.color})`, `drop-shadow(0 0 3px ${pu.color})`] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
            />
            <div className="absolute inset-[2px] grid place-items-center" style={{ clipPath: HEX, background: "#0b0b0d" }}>
                <Icon size={15} strokeWidth={2.3} style={{ color: filled ? pu.color : "rgba(255,255,255,0.25)" }} />
            </div>
            {/* collect pop */}
            <AnimatePresence>
                {filled && (
                    <motion.div
                        key="pop"
                        initial={{ scale: 0.6, opacity: 0.9 }}
                        animate={{ scale: 1.8, opacity: 0 }}
                        transition={{ duration: 0.6 }}
                        className="absolute inset-0"
                        style={{ clipPath: HEX, border: `2px solid ${pu.color}` }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

export default function PowerupHUD() {
    const { collected } = useJourney();
    const count = POWERUPS.filter((p) => collected[p.id]).length;
    const [visible, setVisible] = useState(false);

    /* Show only while the Stations zone is in the viewport.
       The zone is marked in Portfolio.jsx with [data-stations-zone]. */
    useEffect(() => {
        if (typeof IntersectionObserver === "undefined") return;
        const zone = document.querySelector("[data-stations-zone]");
        if (!zone) return;
        const observer = new IntersectionObserver(
            (entries) => {
                setVisible(entries.some((e) => e.isIntersecting));
            },
            { rootMargin: "0px 0px -10% 0px" }
        );
        observer.observe(zone);
        return () => observer.disconnect();
    }, []);

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    key="powerup-hud"
                    initial={{ opacity: 0, y: 16, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 16, scale: 0.95 }}
                    transition={{
                        duration: 0.4,
                        ease: [0.22, 1, 0.36, 1],
                    }}
                    className="pointer-events-none fixed bottom-6 left-6 z-40 hidden xl:block"
                >
                    <div className="glass-strong rounded-2xl px-4 py-3.5">
                        <div className="mb-2.5 flex items-center justify-between gap-6">
                            <span className="font-display text-[10px] font-extrabold uppercase tracking-[0.2em] text-white/70">
                                Power-ups
                            </span>
                            <span className="font-display text-[10px] font-bold uppercase tracking-wide text-brand">
                                {count}/{POWERUPS.length}
                            </span>
                        </div>
                        <div className="flex items-center gap-2.5">
                            {POWERUPS.map((pu) => (
                                <Slot
                                    key={pu.id}
                                    pu={pu}
                                    filled={!!collected[pu.id]}
                                />
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
