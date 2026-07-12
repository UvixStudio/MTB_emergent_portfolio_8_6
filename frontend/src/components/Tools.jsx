import Marquee from "react-fast-marquee";
import { Brain, Sparkles, Box } from "lucide-react";
import { TOOLS } from "@/data/content";
import { Reveal, TrailHeading } from "@/components/Primitives";
import TrailBand from "@/components/TrailBand";

/* Tool name in the marquee — no capsule, no border. Just letterforms in
   low-opacity white so the row reads like a list of brand wordmarks rather
   than chips. Hover lifts to full white. A subtle bullet acts as a divider. */
function ToolName({ label, isFirst }) {
    return (
        <span className="group inline-flex items-center">
            {!isFirst && (
                <span
                    aria-hidden="true"
                    className="mx-7 inline-block h-1 w-1 rounded-full bg-white/15"
                />
            )}
            <span className="font-display text-xl font-bold uppercase tracking-[-0.01em] text-white/40 transition-colors duration-300 group-hover:text-white sm:text-2xl">
                {label}
            </span>
        </span>
    );
}

const NODES = [
    { icon: Brain, label: "Generative AI" },
    { icon: Sparkles, label: "Hybrid Pipelines" },
    { icon: Box, label: "Realtime 3D" },
];

export default function Tools() {
    return (
        <TrailBand
            id="tools"
            src="/site%20assets/workshop-production.png"
            scrim="left"
            tint="rgba(6,12,16,0.55)"
            bgPosition="right center"
            minH="min-h-screen"
        >
            {/* cyan ambient glow */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cp-ai/10 blur-[130px]" />

            <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 py-28 sm:px-8">
                <Reveal>
                    <TrailHeading n="03" label="Yuval's Workshop" color="var(--cp-ai)" />
                </Reveal>
                <Reveal delay={0.08}>
                    <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-white/60">
                        “Every creative process needs its own recipe.” The craft lies in
                        designing the process itself — curating the perfect mix of tools,
                        timing and logic into original, production-ready results.
                    </p>
                </Reveal>

                {/* glowing crystal nodes */}
                <Reveal delay={0.12}>
                    <div className="mt-9 flex flex-wrap gap-4">
                        {NODES.map((n) => {
                            const Icon = n.icon;
                            return (
                                <div
                                    key={n.label}
                                    className="flex items-center gap-3 rounded-xl border border-cp-ai/25 bg-black/40 px-4 py-3 backdrop-blur-md"
                                >
                                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-cp-ai/10 text-cp-ai shadow-[0_0_18px_rgba(34,211,238,0.35)]">
                                        <Icon size={18} strokeWidth={2} />
                                    </span>
                                    <span className="font-display text-sm font-bold uppercase tracking-tight text-white">
                                        {n.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </Reveal>
            </div>

            {/* Wordmark marquees — full-bleed so they read as a flow of
                brand names against the dark backdrop, not a strip of pills. */}
            <div className="relative -mt-2 space-y-6 pb-24 edge-fade">
                <Marquee speed={32} gradient={false} pauseOnHover>
                    {TOOLS.row1.map((t, i) => (
                        <ToolName key={t} label={t} isFirst={i === 0} />
                    ))}
                </Marquee>
                <Marquee speed={32} direction="right" gradient={false} pauseOnHover>
                    {TOOLS.row2.map((t, i) => (
                        <ToolName key={t} label={t} isFirst={i === 0} />
                    ))}
                </Marquee>
            </div>
        </TrailBand>
    );
}
