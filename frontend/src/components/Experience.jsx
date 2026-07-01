import { motion } from "framer-motion";
import { EXPERIENCE } from "@/data/content";
import { Reveal, TrailHeading } from "@/components/Primitives";
import TrailBand from "@/components/TrailBand";

function Signpost({ e, i }) {
    const left = i % 2 === 0;
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-70px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative pl-12 sm:pl-0"
            data-testid={`experience-signpost-${i}`}
        >
            {/* node on the trail line */}
            <span
                className="absolute left-[14px] top-3 grid h-3.5 w-3.5 -translate-x-1/2 place-items-center rounded-full ring-4 ring-black/50 sm:left-1/2"
                style={{ background: e.color, boxShadow: `0 0 14px ${e.color}` }}
            />
            {/* horizontal branch to the line */}
            <span
                className={`absolute top-[18px] hidden h-px w-8 bg-white/25 sm:block ${
                    left ? "right-1/2 mr-2" : "left-1/2 ml-2"
                }`}
            />
            <div
                className={`sm:w-[47%] ${
                    left ? "sm:mr-auto sm:pr-10 sm:text-right" : "sm:ml-auto sm:pl-10"
                }`}
            >
                {/* wooden signpost panel */}
                <div
                    className="relative overflow-hidden rounded-md bg-[#100d0a]/85 p-5 backdrop-blur-md transition-transform duration-300 hover:-translate-y-1"
                    style={{
                        borderLeft: `4px solid ${e.color}`,
                        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06)",
                    }}
                >
                    {/* subtle wood grain */}
                    <div
                        className="pointer-events-none absolute inset-0 opacity-[0.06]"
                        style={{
                            backgroundImage:
                                "repeating-linear-gradient(95deg, rgba(255,255,255,0.5) 0 1px, transparent 1px 6px)",
                        }}
                    />
                    <span
                        className="relative text-[11px] font-bold uppercase tracking-[0.18em]"
                        style={{ color: e.color }}
                    >
                        {e.period}
                    </span>
                    <h3 className="relative mt-1.5 font-display text-lg font-bold text-white">
                        {e.company}
                    </h3>
                    <p className="relative mt-0.5 text-sm font-medium text-white/65">
                        {e.role}
                    </p>
                    <p className="relative mt-3 text-sm leading-relaxed text-white/55">
                        {e.copy}
                    </p>
                    <div
                        className={`relative mt-4 flex flex-wrap gap-2 ${
                            left ? "sm:justify-end" : ""
                        }`}
                    >
                        {e.tags.map((t) => (
                            <span
                                key={t}
                                className="rounded-full border border-white/12 bg-black/30 px-2.5 py-1 text-[11px] font-medium text-white/65"
                            >
                                {t}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default function Experience() {
    return (
        <TrailBand
            id="experience"
            src="/projects/_scene/trail-map.png"
            scrim="left"
            tint="rgba(14,26,43,0.55)"
            minH="min-h-screen"
            bgSize="cover"
            bgPosition="center"
            bgScale={1.05}
        >
            <div className="mx-auto max-w-7xl px-6 py-28 sm:px-8 sm:py-36">
                <Reveal>
                    <TrailHeading
                        n="02"
                        label="Creative Director"
                        color="var(--cp-director)"
                    />
                </Reveal>
                <Reveal delay={0.08}>
                    <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-white/60">
                        Milestone stations along the trail — leading creative teams and
                        production pipelines for global brands.
                    </p>
                </Reveal>

                <div className="relative mt-14">
                    <span className="absolute left-[14px] top-2 bottom-2 w-px bg-white/15 sm:left-1/2 sm:-translate-x-1/2" />
                    <div className="space-y-10">
                        {EXPERIENCE.map((e, i) => (
                            <Signpost key={e.company} e={e} i={i} />
                        ))}
                    </div>
                </div>
            </div>
        </TrailBand>
    );
}
