import { useEffect, useRef, useCallback } from "react";
import Lenis from "lenis";
import CinematicRide from "@/components/CinematicRide";
import JourneyPanel from "@/components/JourneyPanel";
import StationClip from "@/components/StationClip";
import PowerupHUD from "@/components/PowerupHUD";
import { JourneyProvider } from "@/context/JourneyContext";
import { STATIONS } from "@/data/content";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Tools from "@/components/Tools";
import SelectedWorks from "@/components/SelectedWorks";
import Connect from "@/components/Connect";
import ContactModal from "@/components/ContactModal";

export default function Portfolio() {
    const lenisRef = useRef(null);

    useEffect(() => {
        const reduce = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;
        if (reduce) return;

        const lenis = new Lenis({
            duration: 1.15,
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 1.4,
        });
        lenisRef.current = lenis;
        window.__lenis = lenis; // exposed so CinematicRide can lock/unlock scroll

        let raf;
        const loop = (t) => {
            lenis.raf(t);
            raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);

        return () => {
            cancelAnimationFrame(raf);
            lenis.destroy();
            lenisRef.current = null;
            if (window.__lenis === lenis) delete window.__lenis;
        };
    }, []);

    const handleJump = useCallback((anchor) => {
        const el = document.getElementById(anchor);
        if (!el) return;
        if (lenisRef.current) {
            lenisRef.current.scrollTo(el, { offset: 0, duration: 1.4 });
        } else {
            el.scrollIntoView({ behavior: "smooth" });
        }
    }, []);

    return (
        <JourneyProvider>
            <main className="relative bg-ink">
                <JourneyPanel onJump={handleJump} />
                <PowerupHUD />
                <CinematicRide onJump={handleJump} />
                {STATIONS.map((s, i) => (
                    <StationClip key={s.id} station={s} index={i} total={STATIONS.length} />
                ))}
                <About />
                <Experience />
                <Tools />
                <SelectedWorks />
                <Connect />
                <ContactModal />
            </main>
        </JourneyProvider>
    );
}
