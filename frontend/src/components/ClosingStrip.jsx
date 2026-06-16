import { motion } from "framer-motion";
import { ArrowRight, Download } from "lucide-react";
import { PROFILE } from "@/data/content";
import ChamferButton from "@/components/ChamferButton";

const ease = [0.22, 1, 0.36, 1];

/* Closing call-to-action strip — "The Journey Continues".
   The mountain ridge forms the hill at the bottom; the rider cutout (no sky)
   will drop into the reserved slot on the right once provided. */
export default function ClosingStrip() {
    const openContact = () => window.dispatchEvent(new CustomEvent("open-contact"));

    return (
        <section id="journey-continues" className="relative overflow-hidden bg-ink">
            {/* sky glow */}
            <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(120% 90% at 50% 120%, rgba(250,204,21,0.14), transparent 55%)" }} />


            <div className="relative mx-auto flex min-h-[78vh] max-w-6xl flex-col items-center justify-center px-6 py-28 text-center sm:px-8">
                <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease }}
                    className="text-xs font-bold uppercase tracking-[0.35em] text-brand"
                >
                    The journey continues
                </motion.p>

                <motion.h2
                    initial={{ opacity: 0, y: 26 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, ease, delay: 0.05 }}
                    className="mt-5 max-w-3xl font-display text-4xl font-black uppercase leading-[0.95] tracking-tighter text-white drop-shadow-[0_6px_20px_rgba(0,0,0,0.7)] sm:text-6xl"
                >
                    Let's take it to the<br />
                    <span className="text-gradient-brand">next level</span>
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease, delay: 0.12 }}
                    className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/75"
                >
                    Creative direction, AI-driven production or a wild 3D idea — bring it to the trail.
                    Let's build something that makes an impact.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease, delay: 0.2 }}
                    className="mt-9 flex flex-wrap items-center justify-center gap-4"
                >
                    <ChamferButton variant="solid" onClick={openContact}>
                        Join the journey
                        <ArrowRight size={16} strokeWidth={2.5} />
                    </ChamferButton>
                    <ChamferButton as="a" variant="ghost" href={PROFILE.cv} download>
                        <Download size={15} strokeWidth={2.5} />
                        Download CV
                    </ChamferButton>
                </motion.div>
            </div>
        </section>
    );
}
