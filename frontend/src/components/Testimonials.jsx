import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { TESTIMONIALS } from "@/data/content";
import { Reveal, TrailHeading } from "@/components/Primitives";

const ease = [0.22, 1, 0.36, 1];
const clip = (c) =>
    `polygon(0 0, calc(100% - ${c}px) 0, 100% ${c}px, 100% 100%, ${c}px 100%, 0 calc(100% - ${c}px))`;

export default function Testimonials() {
    return (
        <section id="testimonials" className="relative overflow-hidden bg-ink py-24 sm:py-28">
            <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(90% 60% at 50% 0%, rgba(192,132,252,0.07), transparent 60%)" }} />

            <div className="relative mx-auto max-w-6xl px-6 sm:px-8">
                <Reveal>
                    <TrailHeading n="05" label="Trail Companions" color="var(--cp-director)" />
                </Reveal>
                <Reveal delay={0.08}>
                    <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-white/60">
                        People I've shared the ride with — leaders and clients I've built alongside.
                    </p>
                </Reveal>

                <div className="mt-12 grid gap-6 md:grid-cols-2">
                    {TESTIMONIALS.map((t, i) => (
                        <motion.figure
                            key={t.name}
                            initial={{ opacity: 0, y: 28 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-60px" }}
                            transition={{ duration: 0.6, delay: i * 0.1, ease }}
                            className="relative bg-[#0e0e12]/80 p-7 backdrop-blur-md sm:p-8"
                            style={{ clipPath: clip(16), border: "1px solid rgba(255,255,255,0.08)" }}
                        >
                            <Quote size={26} className="text-brand/70" strokeWidth={2} />
                            <blockquote className="mt-4 text-[15px] leading-relaxed text-white/80">
                                {t.quote}
                            </blockquote>
                            <figcaption className="mt-6 border-t border-white/10 pt-4">
                                <div className="font-display text-sm font-bold uppercase tracking-wide text-white">{t.name}</div>
                                <div className="mt-0.5 text-[13px] text-white/55">{t.role}</div>
                                <div className="mt-1 text-[11px] uppercase tracking-wide text-white/35">{t.rel}</div>
                            </figcaption>
                        </motion.figure>
                    ))}
                </div>
            </div>
        </section>
    );
}
