import { motion } from "framer-motion";
import { Download, MessageSquare } from "lucide-react";
import { PROFILE } from "@/data/content";
import RotatingRoles from "@/components/RotatingRoles";
import ChamferButton from "@/components/ChamferButton";

const ease = [0.22, 1, 0.36, 1];

export default function Hero({ onJump }) {
    const openContact = () =>
        window.dispatchEvent(new CustomEvent("open-contact"));

    return (
        <div className="relative h-full w-full">
            {/* Mobile-only bottom scrim — keeps text legible over the rock */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-black/90 via-black/55 to-transparent sm:hidden" />

            <div className="mx-auto flex h-full max-w-7xl flex-col justify-end pb-32 px-6 sm:justify-center sm:pb-0 sm:px-8">

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
                    {/* Greeting line — name bold, rest regular; clean break on mobile */}
                    <motion.p
                        initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        transition={{ duration: 0.8, ease, delay: 0.15 }}
                        className="font-display text-xl font-semibold text-white sm:text-2xl"
                    >
                        Hi! I&apos;m{" "}
                        <span className="text-gradient-brand font-extrabold">
                            {PROFILE.name}
                        </span>
                        <span className="hidden sm:inline"> — MTB Rider and a</span>
                        <span className="mt-1 block text-base font-medium text-white/85 sm:hidden">
                            MTB Rider and a
                        </span>
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

                    {/* Body copy — hidden on mobile to keep the sky clean */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease, delay: 0.25 }}
                        className="mt-6 hidden max-w-xl text-base leading-relaxed text-white/75 sm:block sm:text-lg"
                    >
                        I design ideas. I build systems. I turn complex ideas into
                        experiences that make an impact.
                    </motion.p>

                    {/* CTA buttons — inline on desktop (sm+) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease, delay: 0.4 }}
                        className="mt-8 hidden flex-wrap items-center gap-4 sm:flex"
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

                {/* CTA buttons — pinned to the bottom on mobile, compact & side by side */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease, delay: 0.4 }}
                    className="absolute inset-x-6 bottom-7 flex origin-bottom scale-[0.92] items-center justify-center gap-3 sm:hidden"
                >
                    <ChamferButton
                        as="a"
                        variant="solid"
                        href={PROFILE.cv}
                        download
                    >
                        <Download size={15} strokeWidth={2.5} />
                        Download CV
                    </ChamferButton>

                    <ChamferButton variant="ghost" onClick={openContact}>
                        <MessageSquare size={15} strokeWidth={2.5} />
                        Let&apos;s Talk
                    </ChamferButton>
                </motion.div>
            </div>
        </div>
    );
}
