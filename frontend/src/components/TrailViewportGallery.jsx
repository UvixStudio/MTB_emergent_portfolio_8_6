import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { PROJECTS } from "@/data/content";

const BASE = "#0B1520";
const GOLD = "#E4C15A";
const GOLD_SOFT = "rgba(228,193,90,0.28)";
const INK = "#0D1624";
const BG_URL = "/site%20assets/mountain%20and%20map/good%20road3%204.jpg";
const SCENE_WIDTH = 1360;
const HEADER_X = 458;
const HEADER_Y = 76;
const CARD_X = 470;
const CARD_Y = 312;
const CARD_W = 720;
const CARD_H = 424;
const PROGRESS_W = 290;
const LABEL_X = 114;
const ROUTE_X = [84, 86, 79, 88, 82, 90, 80, 86];
const STOP_Y = [110, 420, 742, 1058, 1382, 1710, 2050, 2398];
const EASE = [0.22, 1, 0.36, 1];

const IMAGE_BY_SLUG = {
    coderz: "/projects/coderz.jpeg",
    paymax: "/projects/paymax.jpeg",
    "beit-hagefen": "/projects/Beit%20hagefen/final%20shots/Group%2023.png",
    promee: "/projects/promee.jpeg",
    "digitel-tlv": "/projects/talk.jpeg",
    "bone-bash": "/projects/bonebash.jpeg",
    "ten-li-rocknroll": "/projects/talk.jpeg",
    "baboon-of-jafa": "/projects/promee.jpeg",
};

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function chamferClip(cut = 18) {
    return `polygon(0 0, calc(100% - ${cut}px) 0, 100% ${cut}px, 100% 100%, ${cut}px 100%, 0 calc(100% - ${cut}px))`;
}

function buildTrailPath(points) {
    if (points.length < 2) return "";
    let d = `M ${points[0].x} ${points[0].y}`;

    for (let i = 0; i < points.length - 1; i += 1) {
        const current = points[i];
        const next = points[i + 1];
        const curve = Math.min(Math.abs(next.x - current.x) * 1.1 + 56, 128);
        d += ` C ${current.x + 6} ${current.y + curve}, ${next.x - 6} ${next.y - curve}, ${next.x} ${next.y}`;
    }

    return d;
}

function ChamferFrame({
    children,
    cut = 18,
    borderColor = GOLD_SOFT,
    background = "rgba(9,14,22,0.9)",
    style,
    className = "",
    padding = 1,
}) {
    return (
        <div
            className={className}
            style={{
                ...style,
                clipPath: chamferClip(cut),
                background: borderColor,
                padding,
            }}
        >
            <div
                style={{
                    clipPath: chamferClip(Math.max(8, cut - 1)),
                    background,
                    height: "100%",
                    width: "100%",
                }}
            >
                {children}
            </div>
        </div>
    );
}

function StopLabel({ project, active, x, y, onClick }) {
    return (
        <motion.button
            type="button"
            onClick={onClick}
            className="absolute text-left"
            style={{ left: x, top: y - 13, width: active ? 286 : 194 }}
            animate={{ opacity: active ? 1 : 0.7, x: active ? 0 : 4 }}
            transition={{ duration: 0.28, ease: EASE }}
            data-testid={`trail-stop-${project.slug}`}
        >
            <span className="relative inline-flex items-center">
                {active && (
                    <span
                        className="absolute inset-y-[-5px] left-[-12px] right-[-16px]"
                        style={{
                            background: GOLD,
                            clipPath: "polygon(12px 0, 100% 0, calc(100% - 12px) 50%, 100% 100%, 12px 100%, 0 50%)",
                            boxShadow: "0 0 20px rgba(228,193,90,0.14)",
                        }}
                    />
                )}
                <span
                    className="relative leading-none"
                    style={{
                        color: active ? INK : "rgba(255,255,255,0.7)",
                        fontWeight: active ? 700 : 500,
                        fontSize: active ? 15 : 13.5,
                        letterSpacing: 0,
                        whiteSpace: "nowrap",
                    }}
                >
                    {project.title}
                </span>
            </span>
        </motion.button>
    );
}

function ProjectGhost({ project, x, y, scale, rotate = 0, opacity = 0.2 }) {
    if (!project) return null;
    const imageSrc = IMAGE_BY_SLUG[project.slug] || project.thumb || "/projects/coderz.jpeg";

    return (
        <motion.div
            key={`${project.slug}-${x}-${y}`}
            className="pointer-events-none absolute overflow-hidden"
            style={{
                left: x,
                top: y,
                width: 520,
                height: 292,
                opacity,
                filter: "blur(5px)",
                transformOrigin: "center center",
                clipPath: chamferClip(20),
                border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(8,12,18,0.6)",
                zIndex: 1,
            }}
            initial={{ opacity: 0, scale: scale * 0.96, y: 32, rotate }}
            animate={{ opacity, scale, y: 0, rotate }}
            exit={{ opacity: 0, scale: scale * 0.96, y: -24, rotate }}
            transition={{ duration: 0.45, ease: EASE }}
        >
            <img src={imageSrc} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,12,18,0.18),rgba(8,12,18,0.82))]" />
        </motion.div>
    );
}

function SpotlightCard({ project }) {
    const [pointer, setPointer] = useState({ x: 50, y: 50, active: false });
    const imageSrc = IMAGE_BY_SLUG[project.slug] || project.thumb || "/projects/coderz.jpeg";
    const chips = (project.metrics || []).map((item) => item.l).slice(0, 3);

    return (
        <ChamferFrame
            cut={22}
            className="absolute z-[3]"
            style={{
                left: CARD_X,
                top: CARD_Y,
                width: CARD_W,
                minHeight: CARD_H,
                boxShadow: "0 20px 50px rgba(0,0,0,0.28)",
            }}
        >
            <div
                className="relative overflow-hidden"
                onPointerMove={(event) => {
                    const rect = event.currentTarget.getBoundingClientRect();
                    setPointer({ x: event.clientX - rect.left, y: event.clientY - rect.top, active: true });
                }}
                onPointerLeave={() => setPointer((prev) => ({ ...prev, active: false }))}
            >
                <div
                    className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-200"
                    style={{
                        opacity: pointer.active ? 1 : 0.72,
                        background: `radial-gradient(300px circle at ${pointer.x}px ${pointer.y}px, rgba(66,217,209,0.16), rgba(66,217,209,0.08) 22%, rgba(66,217,209,0) 60%)`,
                    }}
                />

                <AnimatePresence mode="popLayout" initial={false}>
                    <motion.div
                        key={project.slug}
                        initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                        transition={{ duration: 0.42, ease: EASE }}
                    >
                        <div className="relative h-[308px] overflow-hidden">
                            <img src={imageSrc} alt={project.title} className="h-full w-full object-cover" />
                            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.04),rgba(0,0,0,0.34))]" />
                        </div>

                        <div className="relative border-t border-white/6 bg-[rgba(8,12,18,0.93)] px-8 pb-7 pt-6">
                            <p className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: GOLD }}>
                                {project.category}
                            </p>
                            <h3 className="mt-3 font-display text-[2rem] font-black leading-[0.98] text-white">{project.title}</h3>
                            <p className="mt-3 text-[14px] leading-relaxed text-white/76">{project.role}</p>

                            {chips.length > 0 && (
                                <div className="mt-5 flex flex-wrap gap-2.5">
                                    {chips.map((chip) => (
                                        <span
                                            key={chip}
                                            className="rounded-full border px-3 py-1 text-[10px] font-medium text-white/60"
                                            style={{ borderColor: "rgba(255,255,255,0.12)" }}
                                        >
                                            {chip}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </ChamferFrame>
    );
}

function MobileSpotlightCard({ project }) {
    const imageSrc = IMAGE_BY_SLUG[project.slug] || project.thumb || "/projects/coderz.jpeg";
    const chips = (project.metrics || []).map((item) => item.l).slice(0, 3);

    return (
        <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
                key={project.slug}
                initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -16, filter: "blur(8px)" }}
                transition={{ duration: 0.38, ease: EASE }}
                style={{ width: "100%", aspectRatio: "3/4" }}
            >
                <div
                    style={{
                        clipPath: chamferClip(18),
                        background: GOLD_SOFT,
                        padding: 1,
                        width: "100%",
                        height: "100%",
                    }}
                >
                    <div
                        style={{
                            clipPath: chamferClip(17),
                            background: "rgba(9,14,22,0.9)",
                            height: "100%",
                            width: "100%",
                            position: "relative",
                            overflow: "hidden",
                        }}
                    >
                        <img src={imageSrc} alt={project.title} className="h-full w-full object-cover" />
                        <div
                            className="absolute inset-0"
                            style={{
                                background: "linear-gradient(to top, rgba(8,12,18,0.97) 0%, rgba(8,12,18,0.65) 32%, transparent 62%)",
                            }}
                        />
                        <div className="absolute bottom-0 left-0 right-0 px-5 pb-6">
                            <p className="text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: GOLD }}>
                                {project.category}
                            </p>
                            <h3 className="mt-2 font-display text-[1.55rem] font-black leading-[1.02] text-white">{project.title}</h3>
                            <p className="mt-1.5 text-[13px] leading-snug text-white/70">{project.role}</p>
                            {chips.length > 0 && (
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {chips.map((chip) => (
                                        <span
                                            key={chip}
                                            className="rounded-full border px-2.5 py-0.5 text-[9px] font-medium text-white/55"
                                            style={{ borderColor: "rgba(255,255,255,0.12)" }}
                                        >
                                            {chip}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}

function MobileProgress({ activeIdx, total, locations, onJump }) {
    return (
        <div className="mt-4 flex items-center gap-1.5">
            {locations.map((_, i) => (
                <button
                    key={i}
                    type="button"
                    onClick={() => onJump(i)}
                    className="h-1.5 rounded-full transition-all duration-300"
                    style={{
                        width: i === activeIdx ? 24 : 6,
                        minWidth: i === activeIdx ? 24 : 6,
                        background: i === activeIdx ? GOLD : "rgba(255,255,255,0.22)",
                    }}
                />
            ))}
            <span className="ml-auto font-display text-[11px]">
                <span style={{ color: GOLD }}>{String(activeIdx + 1).padStart(2, "0")}</span>
                <span className="text-white/24"> / </span>
                <span className="text-white/40">{String(total).padStart(2, "0")}</span>
            </span>
        </div>
    );
}

function ProgressStrip({ activeIndex, total, title }) {
    return (
        <ChamferFrame
            cut={14}
            borderColor="rgba(255,255,255,0.08)"
            background="rgba(8,12,18,0.9)"
            className="absolute z-[4]"
            style={{
                left: CARD_X + CARD_W - PROGRESS_W - 20,
                top: CARD_Y + CARD_H + 18,
                width: PROGRESS_W,
            }}
        >
            <div className="flex items-center justify-between gap-3 px-3.5 py-2.5">
                <div>
                    <div className="text-[8px] font-bold uppercase tracking-[0.18em] text-white/30">Trail progress</div>
                    <div className="mt-1 font-display text-[0.82rem] font-black text-white">
                        <span style={{ color: GOLD }}>{String(activeIndex + 1).padStart(2, "0")}</span>
                        <span className="text-white/24"> / </span>
                        <span className="text-white/42">{String(total).padStart(2, "0")}</span>
                    </div>
                </div>
                <div className="min-w-0 flex-1 truncate text-center text-[8px] font-bold uppercase tracking-[0.18em] text-white/36">
                    {title}
                </div>
                <ArrowRight size={12} strokeWidth={2.1} className="shrink-0 text-white/52" />
            </div>
        </ChamferFrame>
    );
}

export default function TrailViewportGallery() {
    const sectionRef = useRef(null);
    const [viewport, setViewport] = useState({ width: 0, height: 0 });
    const [activeIdx, setActiveIdx] = useState(0);
    const lastIndexRef = useRef(-1);

    const locations = useMemo(
        () =>
            PROJECTS.slice(0, ROUTE_X.length).map((project, index) => ({
                ...project,
                x: ROUTE_X[index],
                y: STOP_Y[index],
                order: index,
            })),
        []
    );

    const routePoints = useMemo(() => {
        const points = [{ x: 82, y: -220 }, ...locations.map(({ x, y }) => ({ x, y })), { x: 84, y: STOP_Y[STOP_Y.length - 1] + 420 }];
        return points;
    }, [locations]);

    const path = useMemo(() => buildTrailPath(routePoints), [routePoints]);

    useEffect(() => {
        const syncViewport = () => {
            setViewport({ width: window.innerWidth, height: window.innerHeight });
        };
        syncViewport();
        window.addEventListener("resize", syncViewport);
        return () => window.removeEventListener("resize", syncViewport);
    }, []);

    const routeTravel = STOP_Y[STOP_Y.length - 1] - STOP_Y[0];
    const sectionHeight = viewport.height ? viewport.height + routeTravel + 1320 : 5600;
    const focusY = STOP_Y[1];
    const maxTravel = Math.max(0, routeTravel + 360);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end end"],
    });

    const routeY = useTransform(scrollYProgress, [0, 1], [0, -maxTravel]);
    const backgroundShift = useTransform(scrollYProgress, [0, 1], ["0px", "-360px"]);

    useEffect(() => {
        if (!viewport.height || !locations.length) return undefined;
        lastIndexRef.current = -1;

        const unsubscribe = scrollYProgress.on("change", (value) => {
            const offset = -value * maxTravel;
            let nextIndex = 0;
            let bestDistance = Number.POSITIVE_INFINITY;

            locations.forEach((location, index) => {
                const distance = Math.abs(location.y + offset - focusY);
                if (distance < bestDistance) {
                    bestDistance = distance;
                    nextIndex = index;
                }
            });

            if (nextIndex !== lastIndexRef.current) {
                lastIndexRef.current = nextIndex;
                setActiveIdx(nextIndex);
            }
        });

        return () => unsubscribe();
    }, [focusY, locations, maxTravel, scrollYProgress, viewport.height]);

    const jumpToLocation = (index) => {
        if (!sectionRef.current || !viewport.height || maxTravel <= 0) {
            setActiveIdx(index);
            return;
        }

        const target = locations[index];
        const targetProgress = clamp((target.y - focusY) / maxTravel, 0, 1);
        const scrollTarget = sectionRef.current.offsetTop + targetProgress * (sectionRef.current.offsetHeight - viewport.height);

        if (window.__lenis) {
            window.__lenis.scrollTo(scrollTarget, { duration: 1.05 });
            return;
        }

        window.scrollTo({ top: scrollTarget, behavior: "smooth" });
    };

    const activeProject = locations[activeIdx] || locations[0];
    const prevProject = activeIdx > 0 ? locations[activeIdx - 1] : null;
    const nextProject = activeIdx < locations.length - 1 ? locations[activeIdx + 1] : null;
    const routeProgress = Math.max(0.14, (activeIdx + 1.18) / (locations.length + 1.4));
    const isMobile = viewport.width > 0 && viewport.width < 768;

    return (
        <section
            id="works"
            ref={sectionRef}
            data-testid="trail-locations-gallery"
            className="relative bg-ink"
            style={{ minHeight: sectionHeight }}
        >
            <div className="sticky top-0 h-screen overflow-hidden" style={{ background: BASE }}>
                <motion.div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `url(${BG_URL})`,
                        backgroundRepeat: "repeat-y",
                        backgroundSize: "100% auto",
                        backgroundPositionX: "center",
                        backgroundPositionY: backgroundShift,
                        filter: "brightness(0.58) saturate(0.85)",
                    }}
                />

                <div className="absolute inset-0 bg-[rgba(16,27,44,0.82)] mix-blend-overlay" />

                <div
                    className="pointer-events-none absolute inset-0 opacity-[0.12]"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(120,168,255,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(120,168,255,0.18) 1px, transparent 1px)",
                        backgroundSize: "56px 56px, 56px 56px",
                    }}
                />

                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(11,21,32,0.9)_0%,rgba(11,21,32,0.18)_16%,rgba(11,21,32,0.18)_84%,rgba(11,21,32,0.92)_100%)]" />

                {isMobile ? (
                    <div className="relative z-[2] flex h-full flex-col justify-center px-4 py-6">
                        <div className="mb-5 text-left">
                            <div className="flex items-center gap-2.5">
                                <span className="text-[11px] font-black uppercase tracking-[0.18em]" style={{ color: "#55E59C" }}>
                                    04
                                </span>
                                <span className="h-[5px] w-[5px] rounded-full" style={{ background: "#55E59C" }} />
                                <h2 className="font-display text-[26px] font-black uppercase leading-none text-white">Project Ridge</h2>
                            </div>
                            <p className="mt-2.5 text-[12px] leading-relaxed text-white/48">
                                Ride past the gallery on the mountain - a selection of projects where creativity, strategy and
                                cutting-edge technology meet.
                            </p>
                        </div>

                        <MobileSpotlightCard project={activeProject} />

                        <MobileProgress
                            activeIdx={activeIdx}
                            total={locations.length}
                            locations={locations}
                            onJump={jumpToLocation}
                        />
                    </div>
                ) : (
                <div className="absolute inset-0 overflow-hidden">
                    <div
                        className="absolute top-0"
                        style={{ left: "50%", width: `${SCENE_WIDTH}px`, marginLeft: `${-(SCENE_WIDTH / 2)}px`, height: "100%" }}
                    >
                        <div className="absolute z-[3]" style={{ left: HEADER_X, top: HEADER_Y, width: 760 }}>
                            <div className="flex items-center gap-3">
                                <span className="text-[13px] font-black uppercase tracking-[0.18em]" style={{ color: "#55E59C" }}>
                                    04
                                </span>
                                <span className="h-[6px] w-[6px] rounded-full" style={{ background: "#55E59C" }} />
                                <h2
                                    className="font-display font-black uppercase text-white"
                                    style={{ fontSize: 62, lineHeight: 0.94, whiteSpace: "nowrap", letterSpacing: 0 }}
                                >
                                    Project Ridge
                                </h2>
                            </div>
                            <p className="mt-5 max-w-[690px] text-[15px] leading-[1.42] text-white/52">
                                Ride past the gallery on the mountain - a selection of projects where creativity, strategy and cutting-edge technology meet.
                            </p>
                        </div>

                        <AnimatePresence initial={false}>
                            {prevProject && <ProjectGhost key={`prev-${prevProject.slug}-${activeIdx}`} project={prevProject} x={CARD_X + 428} y={CARD_Y - 88} scale={0.84} rotate={0.25} opacity={0.3} />}
                            {nextProject && <ProjectGhost key={`next-${nextProject.slug}-${activeIdx}`} project={nextProject} x={CARD_X + 36} y={CARD_Y + 252} scale={0.87} rotate={-0.25} opacity={0.32} />}
                        </AnimatePresence>

                        <SpotlightCard project={activeProject} />
                        <ProgressStrip activeIndex={activeIdx} total={locations.length} title={activeProject.title} />

                        <motion.div className="absolute left-0 top-0 z-[2]" style={{ y: routeY, width: 270, height: STOP_Y[STOP_Y.length - 1] + 480 }}>
                            <svg
                                viewBox={`0 0 270 ${STOP_Y[STOP_Y.length - 1] + 480}`}
                                preserveAspectRatio="none"
                                className="absolute inset-0 h-full w-full"
                            >
                                <path d={path} fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
                                <motion.path
                                    d={path}
                                    fill="none"
                                    stroke={GOLD}
                                    strokeWidth="2.35"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    initial={{ pathLength: 0.16 }}
                                    animate={{ pathLength: routeProgress }}
                                    transition={{ duration: 0.34, ease: EASE }}
                                />

                                {locations.map((stop, index) => {
                                    const active = index === activeIdx;
                                    return (
                                        <g key={stop.slug}>
                                            <circle
                                                cx={stop.x}
                                                cy={stop.y}
                                                r={active ? 8 : 6}
                                                fill={active ? GOLD : "rgba(255,255,255,0.06)"}
                                                stroke={active ? GOLD : "rgba(255,255,255,0.4)"}
                                                strokeWidth="1.3"
                                            />
                                            {active && (
                                                <circle
                                                    cx={stop.x}
                                                    cy={stop.y}
                                                    r="15"
                                                    fill="none"
                                                    stroke="rgba(228,193,90,0.3)"
                                                    strokeWidth="1"
                                                />
                                            )}
                                        </g>
                                    );
                                })}
                            </svg>

                            {locations.map((project, index) => (
                                <StopLabel
                                    key={project.slug}
                                    project={project}
                                    active={index === activeIdx}
                                    x={LABEL_X}
                                    y={project.y}
                                    onClick={() => jumpToLocation(index)}
                                />
                            ))}
                        </motion.div>
                    </div>
                </div>
                )}
            </div>
        </section>
    );
}
