import { motion } from "framer-motion";
import { Download, MessageSquare } from "lucide-react";
import { PROFILE } from "@/data/content";
import RotatingRoles from "@/components/RotatingRoles";
import LetsRide from "@/components/LetsRide";

const ease = [0.22, 1, 0.36, 1];

export default function Hero({ onJump }) {
    const openContact = () =>
        window.dispatchEvent(new CustomEvent("open-contact"));

    return (
        <div className="relative h-full w-full">
            <div className="mx-auto flex h-full max-w-7xl flex-col justify-center px-6 sm:px-8">
                {/* Top tagline (right on desktop) */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="absolute right-8 top-28 hidden text-right lg:block"
                >
                    <p className="font-display text-sm font-bold uppercase tracking-[0.12em] text-white">
                        {PROFILE.taglineTop}
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-white/55">
                        {PROFILE.taglineSub}
                    </p>
                    <span className="mt-3 ml-auto block h-0.5 w-16 bg-brand" />
                </motion.div>

                <div className="max-w-3xl">
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease }}
                        className="font-display text-2xl font-medium text-white sm:text-3xl"
                    >
                        {PROFILE.greeting}{" "}
                        <span className="text-gradient-brand font-extrabold">
                            {PROFILE.name}
                        </span>
                    </motion.p>

                    <motion.h1
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease, delay: 0.1 }}
                        className="mt-2 font-display text-3xl font-black uppercase leading-[0.95] tracking-tighter text-white sm:text-5xl lg:text-6xl"
                    >
                        <RotatingRoles />
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease, delay: 0.25 }}
                        className="mt-6 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg"
                    >
                        I design ideas. I build systems. I turn complex ideas into
                        experiences that make an impact.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease, delay: 0.4 }}
                        className="mt-8 flex flex-wrap items-center gap-4"
                    >
                        <a
                            data-testid="download-cv-button"
                            href={PROFILE.cv}
                            download
                            className="group inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3.5 font-display text-sm font-bold uppercase tracking-wide text-ink transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-8px_rgba(250,204,21,0.6)]"
                        >
                            <Download size={17} strokeWidth={2.5} />
                            Download CV
                        </a>
                        <button
                            data-testid="lets-talk-button"
                            onClick={openContact}
                            className="group inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-7 py-3.5 font-display text-sm font-bold uppercase tracking-wide text-white backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-brand hover:text-brand"
                        >
                            <MessageSquare size={17} strokeWidth={2.5} />
                            Let&apos;s Talk
                        </button>
                    </motion.div>
                </div>
            </div>

            {/* Center-bottom Let's Ride */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.8 }}
                className="absolute inset-x-0 bottom-8 flex justify-center"
            >
                <LetsRide onClick={() => onJump("about")} />
            </motion.div>
        </div>
    );
}
