import { motion } from "framer-motion";
import { Download, MessageSquare } from "lucide-react";
import { PROFILE } from "@/data/content";
import RotatingRoles from "@/components/RotatingRoles";
import LetsRide from "@/components/LetsRide";
import ChamferButton from "@/components/ChamferButton";

const ease = [0.22, 1, 0.36, 1];

export default function Hero({ onJump }) {
    const openContact = () =>
        window.dispatchEvent(new CustomEvent("open-contact"));

    return (
        <div className="relative h-full w-full">
            <div className="mx-auto flex h-full max-w-7xl flex-col justify-center px-6 sm:px-8">

                {/* Top-right tagline (desktop only) */}
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
                    {/* Greeting line — name bold, rest regular */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease }}
                        className="font-display text-xl font-medium text-white sm:text-2xl"
                    >
                        Hi! I&apos;m{" "}
                        <span className="text-gradient-brand font-extrabold">
                            {PROFILE.name}
                        </span>
                        {" "}— MTB Rider and a
                    </motion.p>

                    {/* Rotating role title — fixed 2-line height */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease, delay: 0.1 }}
                        className="mt-3"
                    >
                        <RotatingRoles />
                    </motion.div>

                    {/* Body copy */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease, delay: 0.25 }}
                        className="mt-6 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg"
                    >
                        I design ideas. I build systems. I turn complex ideas into
                        experiences that make an impact.
                    </motion.p>

                    {/* CTA buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease, delay: 0.4 }}
                        className="mt-8 flex flex-wrap items-center gap-4"
                    >
                        <ChamferButton
                            as="a"
                            variant="solid"
                            href={PROFILE.cv}
                            download
                            data-testid="download-cv-button"
                        >
                            <Download size={16} strokeWidth={2.5} />
                            Download CV
                        </ChamferButton>

                        <ChamferButton
                            variant="ghost"
                            onClick={openContact}
                            data-testid="lets-talk-button"
                        >
                            <MessageSquare size={16} strokeWidth={2.5} />
                            Let&apos;s Talk
                        </ChamferButton>
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
