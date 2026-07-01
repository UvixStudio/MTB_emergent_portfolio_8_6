import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PROFILE } from "@/data/content";

const CHAR_DELAY = 0.032;
const INTERVAL_MS = 2800;

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

export default function RotatingRoles({ freeze = false }) {
    const roles = PROFILE.roles;
    const [idx, setIdx] = useState(0);

    const longestTotal = roles.reduce(
        (max, role) => (role.replace("|", "").length > max.replace("|", "").length ? role : max),
        ""
    );
    const longestParts = longestTotal.split("|");

    useEffect(() => {
        if (freeze) return undefined;

        const timer = setInterval(() => {
            setIdx((prev) => (prev + 1) % roles.length);
        }, INTERVAL_MS);

        return () => clearInterval(timer);
    }, [freeze, roles.length]);

    const parts = roles[idx].split("|");
    const twoLines = parts.length > 1;

    return (
        <span
            className="relative block font-display font-black uppercase"
            style={{
                fontSize: "clamp(2.5rem, 6.2vw, 5.25rem)",
                lineHeight: 0.92,
                letterSpacing: "-0.03em",
                minHeight: "2em",
            }}
            aria-live="polite"
            aria-label={roles[idx].replace("|", " ")}
        >
            <span aria-hidden="true" className="invisible block select-none leading-[0.88]">
                {longestParts[0]}
                {longestParts[1] && (
                    <>
                        <br />
                        {longestParts[1]}
                    </>
                )}
            </span>

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
                    className="absolute inset-0 block text-gradient-brand leading-[0.88]"
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
