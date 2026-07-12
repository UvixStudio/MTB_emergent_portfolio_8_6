import { motion } from "framer-motion";
import { Mail, Linkedin, MapPin, Music2, ArrowRight } from "lucide-react";
import { PROFILE } from "@/data/content";
import { Reveal } from "@/components/Primitives";
import TrailBand from "@/components/TrailBand";
import ChamferButton from "@/components/ChamferButton";

function Campfire() {
    return (
        <div className="relative grid place-items-center">
            <motion.div
                className="absolute h-28 w-28 rounded-full"
                style={{
                    background:
                        "radial-gradient(circle, rgba(250,204,21,0.4), transparent 70%)",
                }}
                animate={{ opacity: [0.5, 0.95, 0.5], scale: [1, 1.14, 1] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            />
            <svg width="78" height="78" viewBox="0 0 64 64" className="relative">
                <motion.path
                    d="M32 8 C26 18 38 22 32 30 C40 26 42 16 40 12 C46 20 48 34 40 44 C46 42 50 36 50 36 C52 46 44 56 32 56 C20 56 12 46 16 34 C18 40 22 42 24 42 C18 32 22 16 32 8 Z"
                    fill="url(#flame)"
                    animate={{ scaleY: [1, 1.08, 0.96, 1] }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                    style={{ transformOrigin: "32px 56px" }}
                />
                <g stroke="#7c5a3a" strokeWidth="3" strokeLinecap="round">
                    <line x1="16" y1="60" x2="48" y2="58" />
                    <line x1="18" y1="58" x2="46" y2="60" />
                </g>
                <defs>
                    <linearGradient id="flame" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#fde047" />
                        <stop offset="60%" stopColor="#facc15" />
                        <stop offset="100%" stopColor="#f97316" />
                    </linearGradient>
                </defs>
            </svg>
        </div>
    );
}

export default function Connect() {
    const openContact = () =>
        window.dispatchEvent(new CustomEvent("open-contact"));

    return (
        <TrailBand
            id="connect"
            src="/site%20assets/night-camp-footer.png"
            scrim="bottom"
            tint="linear-gradient(to bottom, rgba(8,6,4,0.97) 0%, rgba(8,6,4,0.82) 36%, rgba(8,6,4,0.16) 72%, rgba(8,6,4,0.42) 100%)"
            bgPosition="center bottom"
            bgScale={1.15}
            minH="min-h-screen"
        >
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[440px] w-[440px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/10 blur-[130px]" />

            <div className="relative mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 text-center sm:px-8">
                <Reveal>
                    <Campfire />
                </Reveal>
                <Reveal delay={0.1}>
                    <p className="mt-6 text-xs font-bold uppercase tracking-[0.3em] text-white/55">
                        The summit — let&apos;s connect
                    </p>
                </Reveal>
                <Reveal delay={0.16}>
                    <h2 className="mt-4 font-display text-4xl font-black uppercase leading-tight tracking-tighter text-white drop-shadow-[0_4px_14px_rgba(0,0,0,0.7)] sm:text-6xl">
                        Ready for the
                        <br />
                        <span className="text-gradient-brand">next trail?</span>
                    </h2>
                </Reveal>
                <Reveal delay={0.22}>
                    <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/70">
                        Whether it&apos;s creative direction, AI-driven production or a
                        wild 3D idea — bring it to the campfire. Let&apos;s build something
                        that makes an impact.
                    </p>
                </Reveal>

                <Reveal delay={0.28}>
                    <div className="mt-9 flex flex-wrap justify-center gap-4">
                        <ChamferButton
                            variant="solid"
                            onClick={openContact}
                            data-testid="connect-lets-talk"
                        >
                            Let&apos;s Talk
                            <ArrowRight size={17} strokeWidth={2.5} />
                        </ChamferButton>
                        <ChamferButton
                            as="a"
                            variant="ghost"
                            href={`mailto:${PROFILE.email}`}
                            data-testid="connect-email"
                        >
                            <Mail size={17} strokeWidth={2.5} />
                            {PROFILE.email}
                        </ChamferButton>
                    </div>
                </Reveal>

                <Reveal delay={0.34}>
                    <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-white/60">
                        <a
                            href={PROFILE.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 transition-colors hover:text-white"
                        >
                            <Linkedin size={16} /> LinkedIn
                        </a>
                        <a
                            href={PROFILE.tiktok}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 transition-colors hover:text-white"
                        >
                            <Music2 size={16} /> TikTok
                        </a>
                        <span className="inline-flex items-center gap-2">
                            <MapPin size={16} /> {PROFILE.location}
                        </span>
                    </div>
                </Reveal>

                <Reveal delay={0.4}>
                    <p className="mt-16 text-xs uppercase tracking-[0.2em] text-white/35">
                        © {new Date().getFullYear()} Yuval Cohen · The journey continues
                    </p>
                </Reveal>
            </div>
        </TrailBand>
    );
}
