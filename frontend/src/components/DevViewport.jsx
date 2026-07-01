import { useEffect, useState } from "react";
import { Monitor, Tablet, Smartphone } from "lucide-react";

/* Dev-only responsive preview. Wraps the app; a floating toolbar switches
   between Desktop / Tablet / Mobile. Tablet & Mobile render the app inside an
   <iframe> at a fixed width so the REAL CSS breakpoints fire (not just a
   squished desktop). Ctrl+0 hides/shows the toolbar; 1/2/3 switch sizes.
   Auto-disabled in production and inside the preview iframe. */

const SIZES = { desktop: null, tablet: 834, mobile: 390 };
const ICONS = [
    ["desktop", Monitor],
    ["tablet", Tablet],
    ["mobile", Smartphone],
];

export default function DevViewport({ children }) {
    const isProd = process.env.NODE_ENV === "production";
    const isPreview =
        typeof window !== "undefined" &&
        new URLSearchParams(window.location.search).has("preview");

    const [mode, setMode] = useState("desktop");
    const [hidden, setHidden] = useState(false);

    useEffect(() => {
        if (isProd || isPreview) return;
        const onKey = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "0") {
                e.preventDefault();
                setHidden((h) => !h);
            } else if (!e.ctrlKey && !e.metaKey && !e.altKey) {
                if (e.key === "1") setMode("desktop");
                if (e.key === "2") setMode("tablet");
                if (e.key === "3") setMode("mobile");
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [isProd, isPreview]);

    // Production OR the inner preview frame → render the app as-is.
    if (isProd || isPreview) return children;
    // Toolbar hidden → normal app (Ctrl+0 brings the toolbar back).
    if (hidden) return children;

    const width = SIZES[mode];
    const previewUrl = `${window.location.pathname}?preview=1`;

    return (
        <>
            {/* Floating toolbar */}
            <div className="fixed left-1/2 top-3 z-[2000] flex -translate-x-1/2 items-center gap-1 rounded-full border border-white/15 bg-black/70 px-2 py-1.5 backdrop-blur-md">
                {ICONS.map(([m, Icon]) => (
                    <button
                        key={m}
                        onClick={() => setMode(m)}
                        title={`${m} (${m === "desktop" ? 1 : m === "tablet" ? 2 : 3})`}
                        className={`grid h-8 w-8 place-items-center rounded-full transition ${
                            mode === m ? "bg-white text-black" : "text-white/80 hover:bg-white/15"
                        }`}
                    >
                        <Icon size={16} />
                    </button>
                ))}
                <span className="mx-1 h-5 w-px bg-white/15" />
                <span className="select-none pr-1 text-[10px] uppercase tracking-wider text-white/40">
                    {width ? `${width}px` : "full"} · ctrl+0
                </span>
            </div>

            {/* App (desktop) or device-framed iframe (tablet/mobile) */}
            {mode === "desktop" ? (
                children
            ) : (
                <div className="fixed inset-0 z-[1000] flex items-start justify-center overflow-auto bg-neutral-900 pb-8 pt-16">
                    <iframe
                        title="responsive-preview"
                        src={previewUrl}
                        style={{ width, height: "calc(100vh - 6rem)" }}
                        className="rounded-[1.4rem] border-[6px] border-black bg-black shadow-[0_20px_80px_-10px_rgba(0,0,0,0.8)]"
                    />
                </div>
            )}
        </>
    );
}
