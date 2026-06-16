import { motion, AnimatePresence } from "framer-motion";

/* ── Card geometry ── */
const W   = 560;
const H   = 340;
const CUT = 16;

const POINTS = [
    `${CUT},0`,
    `${W - CUT},0`,
    `${W},${CUT}`,
    `${W},${H}`,
    `${CUT},${H}`,
    `0,${H - CUT}`,
].join(" ");

/* Perimeter for the racing-stroke animation */
const DIAG      = CUT * Math.SQRT2;
const PERIMETER = (W - 2 * CUT) + DIAG + (H - CUT) + (W - CUT) + DIAG + (H - 2 * CUT);
const HIGHLIGHT = 110;

function RacingBorder({ color }) {
    return (
        <svg
            viewBox={`0 0 ${W} ${H}`}
            width={W}
            height={H}
            className="pointer-events-none absolute inset-0 overflow-visible"
        >
            {/* dim base outline */}
            <polygon
                points={POINTS}
                fill="none"
                stroke={color}
                strokeWidth="1"
                strokeOpacity="0.22"
            />
            {/* racing highlight */}
            <motion.polygon
                points={POINTS}
                fill="none"
                stroke={color}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray={`${HIGHLIGHT} ${PERIMETER - HIGHLIGHT}`}
                animate={{ strokeDashoffset: [0, -PERIMETER] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: "linear" }}
                style={{
                    filter: `drop-shadow(0 0 7px ${color}) drop-shadow(0 0 14px ${color}60)`,
                }}
            />
        </svg>
    );
}

export default function WaypointCard({ waypoint, visible }) {
    return (
        <AnimatePresence>
            {visible && waypoint && (
                <motion.div
                    key={waypoint.id}
                    initial={{ opacity: 0, x: -56, scale: 0.94 }}
                    animate={{ opacity: 1, x: 0,   scale: 1    }}
                    exit={{    opacity: 0, x: -56, scale: 0.94 }}
                    transition={{ type: "spring", stiffness: 210, damping: 26 }}
                    className="absolute left-6 top-1/2 -translate-y-1/2 z-20 sm:left-10"
                    style={{ width: W, maxWidth: "calc(100vw - 3rem)" }}
                >
                    <RacingBorder color={waypoint.accentColor} />

                    {/* Interior */}
                    <div
                        className="relative px-10 py-9"
                        style={{
                            background: "rgba(6, 12, 34, 0.91)",
                            clipPath: `polygon(
                                ${CUT}px 0,
                                calc(100% - ${CUT}px) 0,
                                100% ${CUT}px,
                                100% 100%,
                                ${CUT}px 100%,
                                0 calc(100% - ${CUT}px)
                            )`,
                            backdropFilter: "blur(16px)",
                            WebkitBackdropFilter: "blur(16px)",
                        }}
                    >
                        {/* label chip */}
                        <div className="mb-4 flex items-center gap-3">
                            <span
                                className="font-display text-[10px] font-bold uppercase tracking-[0.18em] px-2.5 py-1"
                                style={{
                                    color: waypoint.accentColor,
                                    background: `${waypoint.accentColor}18`,
                                    clipPath: `polygon(4px 0,calc(100% - 4px) 0,100% 4px,100% 100%,4px 100%,0 calc(100% - 4px))`,
                                }}
                            >
                                {waypoint.label}
                            </span>
                            <span className="text-[11px] uppercase tracking-[0.15em] text-white/40 font-display">
                                {waypoint.subtitle}
                            </span>
                        </div>

                        {/* title */}
                        <h3 className="font-display text-[34px] font-black uppercase leading-[0.9] tracking-tight text-white mb-4">
                            {waypoint.title.split("\n").map((line, i) => (
                                <span key={i} className="block">{line}</span>
                            ))}
                        </h3>

                        {/* accent rule */}
                        <div
                            className="mb-5 h-[2px] w-10 rounded-full"
                            style={{ background: waypoint.accentColor }}
                        />

                        {/* bullets */}
                        <ul className="space-y-2.5">
                            {waypoint.bullets.map((text, i) => (
                                <motion.li
                                    key={i}
                                    initial={{ opacity: 0, x: 12 }}
                                    animate={{ opacity: 1, x: 0  }}
                                    transition={{ delay: 0.18 + i * 0.09, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                    className="flex items-start gap-3"
                                >
                                    <span
                                        className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full"
                                        style={{ background: waypoint.accentColor }}
                                    />
                                    <span className="text-[14px] leading-[1.6] text-white/72">
                                        {text}
                                    </span>
                                </motion.li>
                            ))}
                        </ul>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
