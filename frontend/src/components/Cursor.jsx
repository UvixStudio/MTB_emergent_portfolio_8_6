import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

/* Custom magnetic cursor.
   - A small core dot tracks the mouse exactly.
   - A larger ring lags behind via spring for that classic 'haunt' feel.
   - On hover over [data-cursor="view"], the ring expands and shows a label.
   - On hover over [data-cursor="link"] / buttons / links, the ring grows.
   - Hidden on touch / coarse pointers and respects prefers-reduced-motion.
   - The native cursor is hidden globally only while this component is active. */

const INTERACTIVE_SELECTOR =
    'a, button, [role="button"], [data-cursor], input, textarea, select, label';

export default function Cursor() {
    const [enabled, setEnabled] = useState(false);
    const [variant, setVariant] = useState("default"); // default | link | view
    const [label, setLabel] = useState("");

    const x = useMotionValue(-100);
    const y = useMotionValue(-100);

    const ringX = useSpring(x, { stiffness: 320, damping: 28, mass: 0.6 });
    const ringY = useSpring(y, { stiffness: 320, damping: 28, mass: 0.6 });

    const lastVariantTarget = useRef(null);

    /* Activate only on a real pointing device with motion enabled */
    useEffect(() => {
        const fine = window.matchMedia("(pointer: fine)").matches;
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (!fine || reduce) return;
        setEnabled(true);
        document.documentElement.classList.add("has-custom-cursor");
        return () => document.documentElement.classList.remove("has-custom-cursor");
    }, []);

    useEffect(() => {
        if (!enabled) return;

        const onMove = (e) => {
            x.set(e.clientX);
            y.set(e.clientY);
        };

        const onOver = (e) => {
            const t = e.target.closest(INTERACTIVE_SELECTOR);
            if (!t) {
                if (lastVariantTarget.current !== null) {
                    lastVariantTarget.current = null;
                    setVariant("default");
                    setLabel("");
                }
                return;
            }
            if (t === lastVariantTarget.current) return;
            lastVariantTarget.current = t;

            const explicit = t.getAttribute("data-cursor");
            if (explicit === "view") {
                setVariant("view");
                setLabel(t.getAttribute("data-cursor-label") || "View");
            } else {
                setVariant("link");
                setLabel("");
            }
        };

        const onLeave = () => {
            x.set(-100);
            y.set(-100);
        };

        window.addEventListener("pointermove", onMove, { passive: true });
        window.addEventListener("pointerover", onOver, { passive: true });
        window.addEventListener("pointerleave", onLeave);
        return () => {
            window.removeEventListener("pointermove", onMove);
            window.removeEventListener("pointerover", onOver);
            window.removeEventListener("pointerleave", onLeave);
        };
    }, [enabled, x, y]);

    if (!enabled) return null;

    const ringSize = variant === "view" ? 76 : variant === "link" ? 44 : 28;

    return (
        <>
            {/* Core dot — pixel-precise tracking */}
            <motion.div
                aria-hidden="true"
                className="pointer-events-none fixed left-0 top-0 z-[9999] h-2 w-2 rounded-full bg-brand mix-blend-difference"
                style={{
                    x,
                    y,
                    translateX: "-50%",
                    translateY: "-50%",
                }}
            />

            {/* Ring — lags behind, expands on interactive targets */}
            <motion.div
                aria-hidden="true"
                className="pointer-events-none fixed left-0 top-0 z-[9998] flex items-center justify-center rounded-full"
                style={{
                    x: ringX,
                    y: ringY,
                    translateX: "-50%",
                    translateY: "-50%",
                }}
                animate={{
                    width: ringSize,
                    height: ringSize,
                    backgroundColor:
                        variant === "view"
                            ? "rgba(250,204,21,0.92)"
                            : "rgba(250,204,21,0)",
                    borderColor:
                        variant === "default"
                            ? "rgba(255,255,255,0.55)"
                            : "rgba(250,204,21,0.95)",
                    borderWidth: variant === "view" ? 0 : 1.5,
                }}
                transition={{ type: "spring", stiffness: 320, damping: 26 }}
            >
                <AnimatePresence>
                    {variant === "view" && label && (
                        <motion.span
                            key={label}
                            initial={{ opacity: 0, scale: 0.7 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.7 }}
                            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                            className="font-display text-[10px] font-black uppercase tracking-[0.18em] text-[#0e1a2b]"
                        >
                            {label}
                        </motion.span>
                    )}
                </AnimatePresence>
            </motion.div>
        </>
    );
}
