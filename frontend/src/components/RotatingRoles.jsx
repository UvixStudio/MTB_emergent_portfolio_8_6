import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PROFILE } from "@/data/content";

/**
 * Splits role text on "|" for two-line display.
 * Uses a typewriter effect — characters stream in like AI output,
 * then fade out as a block before the next role types in.
 */

const CHAR_DELAY   = 0.032; // seconds between each character
const HOLD_MS      = 1800;  // how long to hold the full text before exiting
const INTERVAL_MS  = 2800;  // total cycle time (must be > type-in + hold)

function TypewriterLine({ text }) {
    return (
        <>
            {text.split("").map((char, i) => (
                <motion.span
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * CHAR_DELAY, duration: 0.01 }}
                    style={{ display: char === " " ? "inline" : "inline-block" }}
                >
                    {char}
                </motion.span>
            ))}
        </>
    );
}

export default function RotatingRoles() {
    const roles  = PROFILE.roles;
    const [idx, setIdx] = useState(0);

    // Compute the longest role for each line to set a stable min-height
    const longestTotal = roles.reduce(
        (max, r) => (r.replace("|", "").length > max.replace("|", "").length ? r : max),
        ""
    );
    const longestParts = longestTotal.split("|");

    useEffect(() => {
        const t = setInterval(
            () => setIdx((p) => (p + 1) % roles.length),
            INTERVAL_MS
        );
        return () => clearInterval(t);
    }, [roles.length]);

    const parts    = roles[idx].split("|");
    const twoLines = parts.length > 1;

    return (
        /* Outer wrapper: fixed height = always 2 lines, no layout jump */
        <span
            className="relative block font-display text-4xl font-black uppercase tracking-tighter sm:text-5xl lg:text-6xl"
            style={{ minHeight: "2.0em", lineHeight: "0.95" }}
            aria-live="polite"
            aria-label={roles[idx].replace("|", " ")}
        >
            {/* Invisible ghost text holds the 2-line space always */}
            <span aria-hidden="true" className="invisible select-none block leading-[0.95]">
                {longestParts[0]}
                {longestParts[1] && <><br />{longestParts[1]}</>}
            </span>

            {/* Animated role — absolutely positioned over the ghost */}
            <AnimatePresence mode="wait">
                <motion.span
                    key={idx}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{
                        opacity: 0,
                        y: -10,
                        filter: "blur(4px)",
                        transition: { duration: 0.25, ease: "easeIn" },
                    }}
                    className="absolute inset-0 text-gradient-brand block leading-[0.95]"
                >
                    {twoLines ? (
                        <>
                            <TypewriterLine text={parts[0]} />
                            <br />
                            <TypewriterLine text={parts[1]} />
                        </>
                    ) : (
                        <TypewriterLine text={roles[idx]} />
                    )}
                </motion.span>
            </AnimatePresence>
        </span>
    );
}
