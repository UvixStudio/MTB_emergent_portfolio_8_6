import { useEffect, useRef } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";
import * as THREE from "three";

const WGL_CSS = `
:root {
    --wgl-brand: #facc15;
    --wgl-ink: #0a1422;
    --wgl-chamfer: polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px));
}
#wgl-root .scrim { position: absolute; inset: 0; z-index: 4; pointer-events: none; }
#wgl-root .scrim::before {
    content: ""; position: absolute; inset: 0 0 auto 0; height: 34vh;
    background: linear-gradient(to bottom, rgba(4,8,15,0.92) 0%, rgba(4,8,15,0.55) 40%, transparent 100%);
}
#wgl-root .scrim::after {
    content: ""; position: absolute; inset: auto 0 0 0; height: 22vh;
    background: linear-gradient(to top, rgba(4,8,15,0.85) 0%, transparent 100%);
}
#wgl-root .hud { position: absolute; z-index: 10; color: #e6edf5; pointer-events: none; }
#wgl-root .hud-title { top: 44px; left: 48px; max-width: 640px; display: flex; gap: 18px; align-items: flex-start; }
#wgl-root .title-badge {
    flex: none; width: 64px; height: 64px; display: grid; place-items: center;
    background: rgba(0,0,0,0.35); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
    border: 1px solid rgba(250,204,21,0.35); clip-path: var(--wgl-chamfer);
    opacity: 0; transform: scale(0.4) rotate(-8deg);
    transition: opacity 0.45s ease, transform 0.65s cubic-bezier(0.34,1.56,0.64,1);
}
#wgl-root .title-badge.in { opacity: 1; transform: none; }
#wgl-root .title-badge svg { width: 40px; height: 40px; }
#wgl-root .hud-title .kicker {
    font-size: 11px; letter-spacing: 0.34em; text-transform: uppercase; color: #fff; font-weight: 700;
    opacity: 0; transform: translateY(14px);
    transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.22,1,0.36,1);
}
#wgl-root .hud-title .kicker.in { opacity: 1; transform: none; }
#wgl-root .hud-title h1 {
    font-family: "Sora", sans-serif; font-size: clamp(28px, 3.2vw, 44px);
    font-weight: 800; letter-spacing: -0.03em; margin-top: 8px; line-height: 1.04; color: var(--wgl-brand);
}
#wgl-root .hud-title h1 .ch {
    display: inline-block; opacity: 0; transform: translateY(26px) rotate(4deg);
    transition: opacity 0.45s ease, transform 0.55s cubic-bezier(0.22,1,0.36,1);
}
#wgl-root .hud-title h1 .ch.in { opacity: 1; transform: none; }
#wgl-root .hud-title p {
    margin-top: 12px; font-family: "Sora", sans-serif; font-weight: 300;
    font-size: 18px; line-height: 1.5; color: rgba(230,237,245,0.72); max-width: 520px; min-height: 3em;
}
#wgl-root .hud-title p.typing::after { content: "▌"; color: var(--wgl-brand); animation: wgl-caret-blink 0.8s steps(1) infinite; }
@keyframes wgl-caret-blink { 50% { opacity: 0; } }
#wgl-root .hud-hint {
    bottom: 30px; left: 50%; transform: translateX(-50%);
    font-size: 11px; letter-spacing: 0.28em; text-transform: uppercase; color: rgba(230,237,245,0.5);
    animation: wgl-hint-pulse 2.4s ease-in-out infinite;
}
@keyframes wgl-hint-pulse { 0%,100% { opacity: 0.4; } 50% { opacity: 1; } }
#wgl-root .compass { position: absolute; right: 34px; bottom: 34px; z-index: 10; width: 96px; height: 96px; pointer-events: none; }
#wgl-root .compass svg { width: 100%; height: 100%; }
#wgl-root .compass-readout {
    position: absolute; right: 34px; bottom: 136px; z-index: 10;
    font-size: 10px; letter-spacing: 0.24em; color: rgba(250,204,21,0.85);
    text-transform: uppercase; text-align: center; width: 96px; font-variant-numeric: tabular-nums;
}
#wgl-root .rail {
    position: absolute; left: 48px; top: 50%; transform: translateY(-50%);
    z-index: 10; width: 2px; height: 200px; background: rgba(255,255,255,0.10);
}
#wgl-root .rail-fill { width: 100%; height: 0%; background: var(--wgl-brand); box-shadow: 0 0 10px rgba(250,204,21,0.7); }
#wgl-root .proj-card {
    position: absolute; z-index: 8;
    clip-path: polygon(0 0, calc(100% - 22px) 0, 100% 22px, 100% 100%, 0 100%);
    opacity: 0; transform: translateY(46px);
    transition: opacity 0.5s cubic-bezier(0.22,1,0.36,1), transform 0.6s cubic-bezier(0.22,1,0.36,1);
    pointer-events: none; overflow: hidden; perspective: 750px;
}
#wgl-root .proj-card.on { opacity: 1; transform: translateY(0); pointer-events: auto; }
#wgl-root .proj-card.on:hover, #wgl-root .proj-card.on.touch-open { opacity: 1 !important; }
#wgl-root .card-float { width: 100%; animation: wgl-card-idle 6s ease-in-out infinite; }
@keyframes wgl-card-idle { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-9px); } }
#wgl-root .card-3d { width: 100%; transform-style: preserve-3d; transition: transform 0.18s ease-out; will-change: transform; }
#wgl-root .card-edge {
    position: absolute; inset: 0; z-index: 10; pointer-events: none;
    clip-path: polygon(0 0, calc(100% - 22px) 0, 100% 22px, 100% 100%, 0 100%);
    padding: 3px;
    background: radial-gradient(400px circle at var(--gx,50%) var(--gy,50%), rgba(250,204,21,1), rgba(56,214,255,0.75) 48%, transparent 74%);
    -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
    -webkit-mask-composite: xor; mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
    mask-composite: exclude; opacity: 0; transition: opacity 0.3s ease;
}
#wgl-root .proj-card:hover .card-edge, #wgl-root .proj-card.touch-open .card-edge { opacity: 1; }
#wgl-root .proj-card .media { height: var(--media-h, 264px); overflow: hidden; position: relative; }
#wgl-root .proj-card .media img {
    width: 100%; height: 100%; object-fit: cover; display: block; position: relative; z-index: 1;
    transform: scale(1.0);
    transition: transform 0.7s cubic-bezier(0.22,1,0.36,1), object-position 0.18s ease-out, opacity 0.5s ease 0.25s;
}
#wgl-root .proj-card:hover .media img, #wgl-root .proj-card.touch-open .media img { transform: scale(1.08); }
#wgl-root .proj-card .media.playing img { opacity: 0; }
#wgl-root .proj-card .media video {
    position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;
    pointer-events: none; opacity: 0; transition: opacity 0.45s ease 0.15s;
}
#wgl-root .proj-card .media.playing video { opacity: 1; }
#wgl-root .vid-ui {
    position: absolute; left: 0; right: 0; top: 0; z-index: 3;
    opacity: 0; transition: opacity 0.3s ease; pointer-events: none;
}
#wgl-root .vu-row { display: flex; align-items: center; gap: 10px; padding: 4px 12px 0; }
#wgl-root .vu-row .vu-mute { margin-left: auto; }
#wgl-root .proj-card.has-video .panel { transition: padding-top 0.35s cubic-bezier(0.22,1,0.36,1); }
#wgl-root .proj-card.has-video .media.playing ~ .panel { padding-top: 46px; }
#wgl-root .proj-card .media.playing ~ .panel .vid-ui { opacity: 1; pointer-events: auto; }
#wgl-root .proj-card .media.playing ~ .panel .vid-ui.vu-idle { opacity: 0; pointer-events: none; }
#wgl-root .proj-card .media:fullscreen .vid-ui { top: auto; bottom: 0; opacity: 1; pointer-events: auto; background: rgba(4,8,15,0.82); padding-bottom: 8px; }
#wgl-root .proj-card .media:fullscreen { background: #000; }
#wgl-root .proj-card .media:fullscreen video { object-fit: contain; opacity: 1 !important; }
#wgl-root .proj-card .media:fullscreen img { display: none; }
#wgl-root .vid-ui button { background: none; border: 0; padding: 0; cursor: pointer; width: 28px; height: 28px; flex: none; display: grid; place-items: center; }
#wgl-root .vid-ui button svg { width: 17px; height: 17px; fill: #fff; }
#wgl-root .vid-ui button:hover svg { fill: var(--wgl-brand); }
#wgl-root .vid-ui .vu-mute svg { width: 19px; height: 19px; }
#wgl-root .vu-track { width: 100%; height: 4px; position: relative; cursor: pointer; background: rgba(255,255,255,0.18); }
#wgl-root .vu-track:hover { height: 6px; }
#wgl-root .vu-fill { height: 100%; width: 0%; background: var(--wgl-brand); box-shadow: 0 0 8px rgba(250,204,21,0.6); }
#wgl-root .vu-time { font-size: 10px; color: #fff; letter-spacing: 0.08em; font-variant-numeric: tabular-nums; flex: none; }
#wgl-root .proj-card .panel {
    position: relative; z-index: 2; padding: 14px 22px 16px;
    background: rgba(0,0,0,0.3); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
}
#wgl-root .proj-card .panel h3 { font-family: "Sora", sans-serif; font-size: 19px; font-weight: 700; color: var(--wgl-brand); letter-spacing: -0.01em; transition: transform 0.18s ease-out; }
#wgl-root .proj-card .panel .sub { display: block; margin-top: 4px; font-size: 12px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #eef3f8; transition: transform 0.18s ease-out; }
#wgl-root .proj-card .more { max-height: 0; opacity: 0; overflow: hidden; transition: max-height 0.55s cubic-bezier(0.22,1,0.36,1), opacity 0.4s ease 0.1s; }
#wgl-root .proj-card:hover .more, #wgl-root .proj-card.touch-open .more { max-height: 260px; opacity: 1; }
#wgl-root .proj-card .more p { margin-top: 10px; font-size: 12.5px; line-height: 1.35; color: rgba(230,237,245,0.75); }
#wgl-root .proj-card .tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 12px; }
#wgl-root .proj-card .tags span { font-size: 9.5px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: rgba(250,204,21,0.9); border: 1px solid rgba(250,204,21,0.3); padding: 4px 9px; }
#wgl-root .proj-card .corner { position: absolute; top: 0; left: 0; width: 26px; height: 26px; z-index: 3; clip-path: polygon(0 0, 100% 0, 0 100%); background: var(--wgl-brand); display: block; text-decoration: none; }
#wgl-root .proj-card .corner svg { display: none; }
#wgl-root .proj-card.hexing { cursor: none; }
#wgl-root .proj-card.hexing .vid-ui { cursor: auto; }
#wgl-root .proj-card.touch-open .media video { pointer-events: auto; }
#wgl-root #cursorHex {
    position: fixed; z-index: 60; width: 90px; height: 104px; left: 0; top: 0; pointer-events: none;
    clip-path: polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%);
    background: var(--wgl-brand); display: grid; place-items: center;
    opacity: 0; transform: translate(-50%,-50%) scale(0.4);
    transition: opacity 0.22s ease, transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
}
#wgl-root #cursorHex.show { opacity: 1; transform: translate(-50%,-50%) scale(1); }
#wgl-root #cursorHex .hx { text-align: center; font-family: "Sora", sans-serif; font-weight: 800; font-size: 11px; line-height: 1.25; letter-spacing: 0.08em; color: #0a1422; text-transform: uppercase; }
#wgl-root #cursorHex .hx svg { display: block; width: 18px; height: 18px; margin: 5px auto 0; }
`;

export default function WebGLGallery() {
    const sectionRef = useRef(null);
    const canvasRef = useRef(null);
    const scrollProgressRef = useRef(0);
    const railFillRef = useRef(null);
    const roseRef = useRef(null);
    const readoutRef = useRef(null);
    const cursorHexRef = useRef(null);
    const badgeRef = useRef(null);
    const kickerRef = useRef(null);
    const h1Ref = useRef(null);
    const paraRef = useRef(null);
    const cardsRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end end"],
    });

    useMotionValueEvent(scrollYProgress, "change", (v) => {
        scrollProgressRef.current = v;
    });

    useEffect(() => {
        const canvas = canvasRef.current;
        const cardsContainer = cardsRef.current;
        if (!canvas || !cardsContainer) return;

        // ── simplex noise ──
        const F2 = 0.5 * (Math.sqrt(3) - 1), G2 = (3 - Math.sqrt(3)) / 6;
        const grad2 = [[1,1],[-1,1],[1,-1],[-1,-1],[1,0],[-1,0],[0,1],[0,-1]];
        const perm = new Uint8Array(512);
        (() => {
            const p = new Uint8Array(256);
            for (let i = 0; i < 256; i++) p[i] = i;
            let seed = 1337;
            const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
            for (let i = 255; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [p[i], p[j]] = [p[j], p[i]]; }
            for (let i = 0; i < 512; i++) perm[i] = p[i & 255];
        })();
        function snoise(x, y) {
            let n0 = 0, n1 = 0, n2 = 0;
            const s = (x + y) * F2, i = Math.floor(x + s), j = Math.floor(y + s);
            const tg = (i + j) * G2, x0 = x - (i - tg), y0 = y - (j - tg);
            const i1 = x0 > y0 ? 1 : 0, j1 = x0 > y0 ? 0 : 1;
            const x1 = x0 - i1 + G2, y1 = y0 - j1 + G2;
            const x2 = x0 - 1 + 2 * G2, y2 = y0 - 1 + 2 * G2;
            const ii = i & 255, jj = j & 255;
            let t0 = 0.5 - x0*x0 - y0*y0;
            if (t0 >= 0) { const g = grad2[perm[ii + perm[jj]] % 8]; t0 *= t0; n0 = t0 * t0 * (g[0]*x0 + g[1]*y0); }
            let t1 = 0.5 - x1*x1 - y1*y1;
            if (t1 >= 0) { const g = grad2[perm[ii + i1 + perm[jj + j1]] % 8]; t1 *= t1; n1 = t1 * t1 * (g[0]*x1 + g[1]*y1); }
            let t2 = 0.5 - x2*x2 - y2*y2;
            if (t2 >= 0) { const g = grad2[perm[ii + 1 + perm[jj + 1]] % 8]; t2 *= t2; n2 = t2 * t2 * (g[0]*x2 + g[1]*y2); }
            return 70 * (n0 + n1 + n2);
        }
        function fbm(x, y) {
            let v = 0, a = 0.5, f = 1;
            for (let o = 0; o < 5; o++) { v += a * snoise(x * f, y * f); a *= 0.5; f *= 2.05; }
            return v;
        }
        function ridged(x, y) {
            let v = 0, a = 0.55, f = 1;
            for (let o = 0; o < 3; o++) { v += a * (1 - Math.abs(snoise(x * f, y * f))); a *= 0.5; f *= 2.1; }
            return v;
        }

        // ── trail route ──
        const WAYPOINTS = [
            [-40, 300], [70, 210], [-90, 150], [55, 80], [-70, 0],
            [90, -70], [-50, -140], [80, -220], [-30, -300]
        ];
        function distToRoute(x, z) {
            let d = Infinity;
            for (let i = 0; i < WAYPOINTS.length - 1; i++) {
                const [ax, az] = WAYPOINTS[i], [bx, bz] = WAYPOINTS[i + 1];
                const dx = bx - ax, dz = bz - az;
                const tl = Math.max(0, Math.min(1, ((x - ax) * dx + (z - az) * dz) / (dx*dx + dz*dz)));
                d = Math.min(d, Math.hypot(x - (ax + tl * dx), z - (az + tl * dz)));
            }
            return d;
        }
        const H_SCALE = 64;
        function terrainHeight(x, z) {
            const nx = x * 0.0048, nz = z * 0.0048;
            let h = ridged(nx, nz) * 0.5 + (fbm(nx * 1.5, nz * 1.5) * 0.5 + 0.5) * 0.5;
            h = Math.pow(Math.max(0, h), 1.45) * H_SCALE;
            const d = distToRoute(x, z);
            const corridor = Math.min(1, d / 30);
            const ease = corridor * corridor * (3 - 2 * corridor);
            return h * (0.24 + 0.76 * ease);
        }

        // ── renderer / scene ──
        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(window.innerWidth, window.innerHeight);
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x04080f);
        scene.fog = new THREE.FogExp2(0x04080f, 0.0021);
        const camera = new THREE.PerspectiveCamera(56, window.innerWidth / window.innerHeight, 0.5, 1400);

        // ── terrain ──
        const SIZE = 780, SEG = 150;
        let geo = new THREE.PlaneGeometry(SIZE, SIZE, SEG, SEG);
        geo.rotateX(-Math.PI / 2);
        { const pos = geo.attributes.position; for (let i = 0; i < pos.count; i++) pos.setY(i, terrainHeight(pos.getX(i), pos.getZ(i))); }
        geo = geo.toNonIndexed();
        geo.computeVertexNormals();
        const terrainMat = new THREE.ShaderMaterial({
            fog: true,
            uniforms: THREE.UniformsUtils.merge([THREE.UniformsLib.fog, {
                uBase:  { value: new THREE.Color(0x2e5178) },
                uDeep:  { value: new THREE.Color(0x142944) },
                uGold:  { value: new THREE.Color(0xfacc15) },
                uSnow:  { value: new THREE.Color(0x8fb2d4) },
                uLight: { value: new THREE.Vector3(0.45, 0.75, 0.42).normalize() },
            }]),
            vertexShader: `
                varying float vH; varying vec3 vNorm;
                #include <fog_pars_vertex>
                void main() {
                    vH = position.y; vNorm = normalize(normalMatrix * normal);
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_Position = projectionMatrix * mvPosition;
                    #include <fog_vertex>
                }`,
            fragmentShader: `
                varying float vH; varying vec3 vNorm;
                uniform vec3 uBase, uDeep, uGold, uSnow, uLight;
                #include <fog_pars_fragment>
                void main() {
                    float lambert = clamp(dot(normalize(vNorm), uLight), 0.0, 1.0);
                    float hMix = clamp(vH / 64.0, 0.0, 1.0);
                    vec3 col = mix(uDeep, uBase, 0.28 + 0.72 * hMix);
                    col = mix(col, uSnow, smoothstep(0.72, 0.98, hMix) * 0.55);
                    col *= 1.02 + 0.62 * lambert;
                    float freq = 0.10; float f = fract(vH * freq); float w = fwidth(vH * freq);
                    float line = 1.0 - smoothstep(w * 1.0, w * 2.2, min(f, 1.0 - f));
                    col = mix(col, uGold, line * (0.05 + 0.16 * hMix));
                    gl_FragColor = vec4(col, 1.0);
                    #include <fog_fragment>
                }`,
        });
        scene.add(new THREE.Mesh(geo, terrainMat));

        // ── trail curve ──
        function routeCurve() {
            const pts3 = WAYPOINTS.map(([x, z]) => new THREE.Vector3(x, terrainHeight(x, z) + 0.8, z));
            const path = new THREE.CurvePath();
            const R = 14;
            let prevEnd = pts3[0];
            for (let i = 1; i < pts3.length - 1; i++) {
                const a = prevEnd, b = pts3[i], c = pts3[i + 1];
                const inDir = b.clone().sub(a).normalize();
                const outDir = c.clone().sub(b).normalize();
                const cornerIn = b.clone().sub(inDir.clone().multiplyScalar(R));
                const cornerOut = b.clone().add(outDir.clone().multiplyScalar(R));
                path.add(new THREE.LineCurve3(a, cornerIn));
                path.add(new THREE.QuadraticBezierCurve3(cornerIn, b, cornerOut));
                prevEnd = cornerOut;
            }
            path.add(new THREE.LineCurve3(prevEnd, pts3[pts3.length - 1]));
            return path;
        }
        const route = routeCurve();
        const SAMPLES = 600;
        const trailPts = [];
        for (let i = 0; i <= SAMPLES; i++) {
            const p = route.getPointAt(i / SAMPLES);
            p.y = terrainHeight(p.x, p.z) + 0.8;
            trailPts.push(p);
        }
        const trailCurve = new THREE.CatmullRomCurve3(trailPts);
        trailCurve.curveType = 'centripetal';

        const uProgress = { value: 0 };
        function trailMaterial(opacityRidden, opacityAhead, glow) {
            return new THREE.ShaderMaterial({
                transparent: true, depthWrite: false,
                blending: glow ? THREE.AdditiveBlending : THREE.NormalBlending,
                uniforms: {
                    uProg: uProgress,
                    uGold: { value: new THREE.Color(0xfacc15) },
                    uPale: { value: new THREE.Color(0x9fd8e8) },
                    uORidden: { value: opacityRidden },
                    uOAhead: { value: opacityAhead },
                },
                vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
                fragmentShader: `
                    varying vec2 vUv; uniform float uProg,uORidden,uOAhead; uniform vec3 uGold,uPale;
                    void main() {
                        float edge = smoothstep(uProg-0.003, uProg+0.003, vUv.x);
                        gl_FragColor = vec4(mix(uGold,uPale,edge), mix(uORidden,uOAhead,edge));
                    }`,
            });
        }
        scene.add(new THREE.Mesh(new THREE.TubeGeometry(trailCurve, 900, 0.10, 6, false), trailMaterial(1.0, 0.42, false)));
        scene.add(new THREE.Mesh(new THREE.TubeGeometry(trailCurve, 900, 0.38, 6, false), trailMaterial(0.12, 0.035, true)));

        // ── textures ──
        const glowTex = (() => {
            const c = document.createElement('canvas'); c.width = c.height = 128;
            const g = c.getContext('2d');
            const grad = g.createRadialGradient(64,64,0,64,64,64);
            grad.addColorStop(0,'rgba(250,204,21,0.9)'); grad.addColorStop(0.35,'rgba(250,204,21,0.28)'); grad.addColorStop(1,'rgba(250,204,21,0)');
            g.fillStyle = grad; g.fillRect(0,0,128,128);
            return new THREE.CanvasTexture(c);
        })();
        function labelTex(text) {
            const c = document.createElement('canvas'); c.width=256; c.height=128;
            const g = c.getContext('2d'); g.font='700 72px Manrope,sans-serif'; g.textAlign='center'; g.textBaseline='middle'; g.fillStyle='#facc15'; g.fillText(text,128,68);
            return new THREE.CanvasTexture(c);
        }
        function nameTex(text) {
            const c = document.createElement('canvas'); c.width=1024; c.height=160;
            const g = c.getContext('2d'); g.font='700 60px Manrope,sans-serif'; g.textAlign='center'; g.textBaseline='middle';
            g.shadowColor='rgba(4,8,15,0.9)'; g.shadowBlur=16; g.fillStyle='rgba(238,243,248,0.92)'; g.fillText(text.toUpperCase(),512,84);
            return new THREE.CanvasTexture(c);
        }

        // ── locations ──
        const IMG = '/projects/thumbs/';
        const LOCATIONS = [
            { t:0.10, name:'Bone Bash', sub:'3D / Game · Ludo TLV Talk', aspect:'16:9',
              video:'/projects/BoneBash/bonebash_web.mp4', img:IMG+'magnific__3d-a-male-skeleton-warrior-with-a-staff-and-two-ch__23379.png',
              desc:'A full 2D-to-3D RPG production workflow — ideation to web deployment, with a custom-trained style model for consistency.', tags:['3D','Game','AI Pipeline'], card:true },
            { t:0.22, name:'Baboon of Jafa', sub:'AI Video · Remix', aspect:'9:16',
              video:'/projects/Baboon/baboon_web.mp4', img:IMG+'baboon.jpeg',
              desc:'An Instagram story turned surreal biker legend — generative character-swap video pipeline.', tags:['AI Video','Character Swap','R&D'], card:true },
            { t:0.33, name:'Digitel TLV', sub:'AI Video & 3D · Social', aspect:'16:9',
              img:IMG+'magnific__photo-a-swimming-pool-with-inflatable-letters-spel__23382.jpg',
              desc:'A summer social campaign that solved Hebrew typography in generative 3D — custom Hunyuan 3D pipeline, 72-hour turnaround.', tags:['AI Video','3D','Campaign'], card:true },
            { t:0.44, name:'Promee', sub:'AI Video · Brand Film', aspect:'16:9',
              img:IMG+'magnific__photo-a-30yearold-white-woman-with-dark-hair-and-b__23384.png',
              desc:'A 2.5-minute brand film for a music-tech platform — ~80% AI-generated visuals through a bespoke Flux + Kling ecosystem.', tags:['AI Video','Brand','Music'], card:true },
            { t:0.55, name:"Ten Li Rock'n'Roll", sub:'AI Video · Tislam Tribute', aspect:'16:9',
              img:IMG+'tenli.jpg',
              desc:'An unfilmed rock memory brought to life with AI — character consistency, motion and cinematic lipsync compositing.', tags:['AI Video','Tribute','Kan 11'], card:true },
            { t:0.66, name:"Beit Ha'Gefen", sub:'Immersive Installation', aspect:'16:9',
              img:IMG+'beit-hagefen.png',
              desc:'A 60sqm four-wall installation uniting Christmas, Hanukkah & Ramadan — structured AI workflow to large-format print.', tags:['Immersive','AI Pipeline','Print'], card:true },
            { t:0.78, name:'CoderZ', sub:'Creative Director & Producer', aspect:'16:9',
              img:IMG+'magnific__photo-a-45yearold-white-man-with-short-brown-hair-__23381.jpg',
              desc:'Scaling an EdTech startup into an award-winning global platform — full rebrand, gamified 3D learning and live league broadcasts.', tags:['EdTech','Rebrand','Broadcast'], card:true },
            { t:0.90, name:'Paymax', sub:'AR & Immersive · Art Director', aspect:'16:9',
              img:IMG+'paymax.jpeg',
              desc:"Immersive 3D lottery AR experiences — patent-backed 'Scan-to-Play' titles for the New York Lottery.", tags:['AR','Unity','WebGL'], card:true },
        ];

        function attachTilt(card) {
            const inner = card.querySelector('.card-3d');
            const img   = card.querySelector('.media img');
            const title = card.querySelector('.panel h3');
            const sub   = card.querySelector('.panel .sub');
            card.addEventListener('mousemove', e => {
                const r = card.getBoundingClientRect();
                const dx = (e.clientX - r.left) / r.width - 0.5;
                const dy = (e.clientY - r.top)  / r.height - 0.5;
                if (card.querySelector('.media.playing')) {
                    inner.style.transform='rotateX(0deg) rotateY(0deg)'; img.style.objectPosition='50% 50%';
                    card.style.setProperty('--gx',`${((dx+0.5)*100).toFixed(1)}%`);
                    card.style.setProperty('--gy',`${((dy+0.5)*100).toFixed(1)}%`); return;
                }
                inner.style.transform=`rotateX(${(-dy*22).toFixed(2)}deg) rotateY(${(dx*30).toFixed(2)}deg)`;
                card.style.setProperty('--gx',`${((dx+0.5)*100).toFixed(1)}%`);
                card.style.setProperty('--gy',`${((dy+0.5)*100).toFixed(1)}%`);
                img.style.objectPosition=`${(50+dx*22).toFixed(1)}% ${(50+dy*22).toFixed(1)}%`;
                title.style.transform=`translate(${(dx*14).toFixed(1)}px,${(dy*14).toFixed(1)}px)`;
                sub.style.transform=`translate(${(dx*9).toFixed(1)}px,${(dy*9).toFixed(1)}px)`;
                card.style.filter=`drop-shadow(${(-dx*26).toFixed(1)}px ${(-dy*26).toFixed(1)}px 32px rgba(0,0,0,0.7))`;
            });
            card.addEventListener('mouseleave', () => {
                inner.style.transform=''; img.style.objectPosition='50% 50%';
                title.style.transform=''; sub.style.transform=''; card.style.filter='';
            });
        }

        const IS_TOUCH = matchMedia('(hover: none)').matches;
        const fsListeners = [];
        const cursorHex = cursorHexRef.current;

        function buildCard(loc) {
            const el = document.createElement('div');
            el.className = loc.video ? 'proj-card has-video' : 'proj-card';
            const [aw, ah] = (loc.aspect || '16:9').split(':').map(Number);
            const vertical = ah > aw;
            const cardW = vertical ? 330 : 660;
            const mediaH = Math.min(Math.round(cardW * ah / aw), 520);
            el.style.width = cardW + 'px';
            el.style.setProperty('--media-h', mediaH + 'px');
            el.innerHTML = `
                <div class="card-float"><div class="card-3d">
                    <a class="corner" href="${loc.href || '#'}" aria-label="Open project">
                        <svg viewBox="0 0 24 24" fill="none"><path d="M7 17L17 7M17 7H9M17 7v8" stroke="#0a1422" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </a>
                    <div class="card-edge"></div>
                    <div class="media"><img src="${loc.img}" alt="${loc.name}" /></div>
                    <div class="panel">
                        <h3>${loc.name}</h3><span class="sub">${loc.sub || ''}</span>
                        <div class="more"><p>${loc.desc || ''}</p>
                        <div class="tags">${(loc.tags||[]).map(tg=>`<span>${tg}</span>`).join('')}</div></div>
                    </div>
                </div></div>`;
            cardsContainer.appendChild(el);
            attachTilt(el);

            if (loc.video) {
                const media = el.querySelector('.media');
                const vid = document.createElement('video');
                vid.src=loc.video; vid.muted=true; vid.loop=true; vid.playsInline=true; vid.preload='auto';
                vid.load();
                media.appendChild(vid);
                const ICONS = {
                    play:'<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>',
                    pause:'<svg viewBox="0 0 24 24"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>',
                    muted:'<svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm18.5 3l-2.3-2.3-1.4 1.4 2.3 2.3-2.3 2.3 1.4 1.4 2.3-2.3 2.3 2.3 1.4-1.4-2.3-2.3 2.3-2.3-1.4-1.4-2.3 2.3z" transform="translate(-4 0)"/></svg>',
                    sound:'<svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.8-1-3.3-2.5-4v8c1.5-.7 2.5-2.2 2.5-4zM14 3.2v2.1c2.9.9 5 3.5 5 6.7s-2.1 5.8-5 6.7v2.1c4-.9 7-4.5 7-8.8s-3-7.9-7-8.8z"/></svg>',
                    expand:'<svg viewBox="0 0 24 24"><path d="M4 4h6v2H6v4H4V4zm10 0h6v6h-2V6h-4V4zM4 14h2v4h4v2H4v-6zm14 0h2v6h-6v-2h4v-4z"/></svg>',
                    compress:'<svg viewBox="0 0 24 24"><path d="M10 4v6H4V8h4V4h2zm4 0h2v4h4v2h-6V4zM4 14h6v6H8v-4H4v-2zm10 0h6v2h-4v4h-2v-6z"/></svg>',
                };
                const fmt = s => `${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`;
                const ui = document.createElement('div'); ui.className='vid-ui';
                ui.innerHTML=`<div class="vu-track"><div class="vu-fill"></div></div><div class="vu-row"><button class="vu-play">${ICONS.pause}</button><span class="vu-time">0:00</span><button class="vu-mute">${ICONS.muted}</button><button class="vu-fs">${ICONS.expand}</button></div>`;
                const panel = el.querySelector('.panel');
                panel.insertBefore(ui, panel.firstChild);
                const playBtn=ui.querySelector('.vu-play'), sndBtn=ui.querySelector('.vu-mute');
                const track=ui.querySelector('.vu-track'), fill=ui.querySelector('.vu-fill'), time=ui.querySelector('.vu-time');
                playBtn.addEventListener('click',e=>{e.stopPropagation(); if(vid.paused)vid.play();else vid.pause(); playBtn.innerHTML=vid.paused?ICONS.play:ICONS.pause;});
                sndBtn.addEventListener('click',e=>{e.stopPropagation(); vid.muted=!vid.muted; sndBtn.innerHTML=vid.muted?ICONS.muted:ICONS.sound;});
                const fsBtn=ui.querySelector('.vu-fs');
                fsBtn.addEventListener('click',e=>{e.stopPropagation(); if(document.fullscreenElement)document.exitFullscreen();else media.requestFullscreen();});
                const onFSChange=()=>{
                    const inFS = document.fullscreenElement===media;
                    fsBtn.innerHTML = inFS?ICONS.compress:ICONS.expand;
                    if(inFS) media.appendChild(ui);
                    else {
                        panel.insertBefore(ui, panel.firstChild);
                        if(!el.matches(':hover')){ media.classList.remove('playing'); vid.pause(); }
                    }
                };
                document.addEventListener('fullscreenchange',onFSChange); fsListeners.push(onFSChange);
                track.addEventListener('click',e=>{e.stopPropagation(); const r=track.getBoundingClientRect(); if(vid.duration)vid.currentTime=((e.clientX-r.left)/r.width)*vid.duration;});
                vid.addEventListener('timeupdate',()=>{if(!vid.duration)return; fill.style.width=(vid.currentTime/vid.duration*100).toFixed(1)+'%'; time.textContent=fmt(vid.currentTime);});
                let hoverActive=false;
                vid.addEventListener('playing',()=>{ if(hoverActive||document.fullscreenElement===media) media.classList.add('playing'); });
                el.addEventListener('mouseenter',()=>{
                    hoverActive=true;
                    vid.play().catch(()=>{});
                    if(vid.readyState>=3) media.classList.add('playing');
                    playBtn.innerHTML=ICONS.pause;
                });
                el.addEventListener('mouseleave',()=>{
                    hoverActive=false;
                    if(document.fullscreenElement===media) return;
                    media.classList.remove('playing');
                    setTimeout(()=>{if(!media.classList.contains('playing')&&document.fullscreenElement!==media)vid.pause();},500);
                });
            }

            if (IS_TOUCH) {
                let idleTimer;
                const media = el.querySelector('.media');
                const flash = () => { const u=el.querySelector('.vid-ui'); if(!u)return; u.classList.remove('vu-idle'); clearTimeout(idleTimer); idleTimer=setTimeout(()=>u.classList.add('vu-idle'),2000); };
                el.addEventListener('click',e=>{
                    if(e.target.closest('.vid-ui')||e.target.closest('.corner')||document.fullscreenElement)return;
                    if(!el.classList.contains('touch-open')){e.preventDefault();el.classList.add('touch-open');if(loc.video){const m=el.querySelector('.media');m.classList.add('playing');const v=m.querySelector('video');if(v)v.play().catch(()=>{});flash();}return;}
                    const ve=e.target.closest('video'); if(ve){e.preventDefault();if(ve.paused)ve.play();else ve.pause();flash();return;}
                    if(loc.href&&loc.href!=='#')window.open(loc.href,'_blank');
                });
                return el;
            }

            el.addEventListener('mousemove',e=>{
                const overUi=e.target.closest('.vid-ui'); const playing=el.querySelector('.media.playing');
                const active=!overUi&&!document.fullscreenElement&&(loc.video?!!playing:true);
                el.classList.toggle('hexing',active); if(cursorHex)cursorHex.classList.toggle('show',active);
                if(active&&cursorHex){cursorHex.style.left=e.clientX+'px'; cursorHex.style.top=e.clientY+'px';}
            });
            el.addEventListener('mouseleave',()=>{el.classList.remove('hexing'); if(cursorHex)cursorHex.classList.remove('show');});
            el.addEventListener('click',e=>{if(e.target.closest('.vid-ui')||e.target.closest('.corner')||document.fullscreenElement)return; if(loc.href&&loc.href!=='#')window.open(loc.href,'_blank');});
            return el;
        }

        // ── markers ──
        const markers = [];
        LOCATIONS.forEach((loc, idx) => {
            const p = trailCurve.getPointAt(loc.t);
            const STEM_H = 11;
            const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.06,0.06,STEM_H,4), new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:0.7}));
            stem.position.set(p.x, p.y+STEM_H/2, p.z); scene.add(stem);
            const flagMat = new THREE.ShaderMaterial({
                uniforms:{uTime:{value:0}},
                vertexShader:`uniform float uTime; void main(){vec3 pos=position; float amt=(pos.x/3.4+0.5); pos.y+=sin(pos.x*2.4+uTime*3.6)*amt*0.38; pos.z+=sin(pos.x*1.7+uTime*2.9)*amt*0.22; gl_Position=projectionMatrix*modelViewMatrix*vec4(pos,1.0);}`,
                fragmentShader:`void main(){gl_FragColor=vec4(0.980,0.800,0.082,1.0);}`,
                side:THREE.DoubleSide,
            });
            const flag = new THREE.Mesh(new THREE.PlaneGeometry(3.4,2.1,12,6),flagMat);
            flag.position.set(p.x+1.7, p.y+STEM_H-1.0, p.z); scene.add(flag);
            const dot = new THREE.Mesh(new THREE.CircleGeometry(0.85,20), new THREE.MeshBasicMaterial({color:0xfacc15,side:THREE.DoubleSide}));
            dot.rotation.x=-Math.PI/2; dot.position.set(p.x,p.y+0.3,p.z); dot.renderOrder=4; scene.add(dot);
            const ringMat1 = new THREE.MeshBasicMaterial({color:0xfacc15,transparent:true,opacity:0.9,side:THREE.DoubleSide,depthWrite:false});
            const ringMat2 = ringMat1.clone();
            const ring1 = new THREE.Mesh(new THREE.RingGeometry(0.45,0.625,28),ringMat1);
            const ring2 = new THREE.Mesh(new THREE.RingGeometry(0.45,0.625,28),ringMat2);
            [ring1,ring2].forEach(r=>{r.rotation.x=-Math.PI/2; r.position.set(p.x,p.y+0.28,p.z); r.renderOrder=3; scene.add(r);});
            const num = new THREE.Sprite(new THREE.SpriteMaterial({map:labelTex('0'+(idx+1)),transparent:true,depthTest:false}));
            num.renderOrder=5; num.scale.set(4.4,2.2,1); num.position.set(p.x,p.y+STEM_H+3.2,p.z); scene.add(num);
            const nameSprite = new THREE.Sprite(new THREE.SpriteMaterial({map:nameTex(loc.name),transparent:true,depthTest:false,opacity:0.95}));
            nameSprite.renderOrder=5; nameSprite.scale.set(13.5,1.8,1); nameSprite.position.set(p.x,p.y+STEM_H+5.2,p.z); scene.add(nameSprite);
            const sprite = new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex,transparent:true,opacity:0.7,blending:THREE.AdditiveBlending,depthWrite:false}));
            sprite.scale.set(9,9,1); sprite.position.set(p.x,p.y+STEM_H-1.0,p.z); scene.add(sprite);
            markers.push({ flag, flagMat, ring1, ring2, ringMat1, ringMat2, sprite, loc, t:loc.t, world:new THREE.Vector3(p.x,p.y+STEM_H,p.z), card:loc.card?buildCard(loc):null });
        });

        // ── clouds ──
        const cloudMat = new THREE.MeshBasicMaterial({color:0x2a4058,transparent:true,opacity:0.3});
        const clouds = [];
        for (let i = 0; i < 10; i++) {
            const cg = new THREE.IcosahedronGeometry(8+Math.random()*10,0);
            cg.scale(1.9,0.5,1.2);
            const m = new THREE.Mesh(cg,cloudMat);
            m.position.set((Math.random()-0.5)*640, 72+Math.random()*26, (Math.random()-0.5)*640);
            m.rotation.y=Math.random()*Math.PI; m.userData.speed=0.6+Math.random()*0.9;
            scene.add(m); clouds.push(m);
        }

        // ── camera rig ──
        const UP = new THREE.Vector3(0,1,0);
        const camPos = new THREE.Vector3(), camTarget = new THREE.Vector3();
        const smoothPos = new THREE.Vector3(0,70,360), smoothTarget = new THREE.Vector3(0,0,0);
        const projV = new THREE.Vector3();
        let altHeld=false, userYaw=0, userPitch=0, heightOffset=0;

        const onKeyDown = e => {
            if(e.key==='Alt'){altHeld=true;e.preventDefault();}
            if(e.shiftKey&&e.key==='ArrowUp'){heightOffset=Math.min(heightOffset+4,70);e.preventDefault();}
            if(e.shiftKey&&e.key==='ArrowDown'){heightOffset=Math.max(heightOffset-4,-14);e.preventDefault();}
            if(e.shiftKey&&e.code==='Space'){heightOffset=0;userYaw=0;userPitch=0;e.preventDefault();}
        };
        const onKeyUp = e => { if(e.key==='Alt')altHeld=false; };
        const onBlur = () => { altHeld=false; };
        const onMouseMove = e => { if(!altHeld)return; userYaw=Math.max(-1.2,Math.min(1.2,userYaw-e.movementX*0.0032)); userPitch=Math.max(-0.6,Math.min(0.6,userPitch-e.movementY*0.0022)); };
        window.addEventListener('keydown',onKeyDown);
        window.addEventListener('keyup',onKeyUp);
        window.addEventListener('blur',onBlur);
        window.addEventListener('mousemove',onMouseMove);

        const railFill = railFillRef.current;
        const rose = roseRef.current;
        const readout = readoutRef.current;

        function updateCamera(dt) {
            const scrollProgress = scrollProgressRef.current;
            const t = scrollProgress * 0.96;
            uProgress.value = t;
            const p = trailCurve.getPointAt(t);
            const ahead = trailCurve.getPointAt(Math.min(0.999, t+0.035));
            const back = p.clone().sub(ahead).setY(0).normalize();
            camPos.copy(p).addScaledVector(back,38);
            camPos.y = Math.max(p.y,terrainHeight(camPos.x,camPos.z))+24+heightOffset;
            camTarget.copy(ahead).setY(ahead.y+2);
            const fwd = ahead.clone().sub(p).setY(0).normalize();
            camTarget.addScaledVector(new THREE.Vector3().crossVectors(fwd,UP).normalize(),26);
            const k = 1-Math.pow(0.001,dt);
            smoothPos.lerp(camPos,k); smoothTarget.lerp(camTarget,k);
            camera.position.copy(smoothPos);
            if(!altHeld){const decay=Math.pow(0.03,dt); userYaw*=decay; userPitch*=decay;}
            const lookDir = smoothTarget.clone().sub(smoothPos);
            lookDir.applyAxisAngle(UP,userYaw);
            lookDir.applyAxisAngle(new THREE.Vector3().crossVectors(lookDir,UP).normalize(),userPitch);
            camera.lookAt(smoothPos.clone().add(lookDir));
            const dir = new THREE.Vector3(); camera.getWorldDirection(dir);
            const deg = ((Math.atan2(dir.x,-dir.z)*180/Math.PI)+360)%360;
            if(rose) rose.style.transform=`rotate(${-deg}deg)`;
            if(readout) readout.textContent=String(Math.round(deg)).padStart(3,'0')+'°';
            if(railFill) railFill.style.height=(scrollProgress*100).toFixed(1)+'%';
            markers.forEach(m => {
                if(!m.card)return;
                const delta=t-m.t;
                projV.copy(m.world).setY(m.world.y+4); projV.project(camera);
                const behind=projV.z>1;
                let vis=0;
                if(delta>-0.035&&delta<0.09) vis=delta<=0.02?1:Math.max(0,1-(delta-0.02)/0.07);
                const on=vis>0;
                m.card.classList.toggle('on',on);
                if(!on){m.card._cx=undefined;m.card.style.opacity='';return;}
                m.card.style.opacity=vis;
                if(!behind){
                    const W=m.card.offsetWidth||560, cardH=m.card.offsetHeight||460;
                    const zoneL=window.innerWidth*0.44, zoneR=window.innerWidth-60;
                    const zoneT=90, zoneB=window.innerHeight-90;
                    const tx=zoneL+(zoneR-zoneL-W)/2;
                    const ty=Math.max(zoneT,zoneT+(zoneB-zoneT-cardH)/2);
                    if(m.card._cx===undefined){m.card._cx=tx;m.card._cy=ty;}
                    const ck=1-Math.pow(0.02,dt);
                    m.card._cx+=(tx-m.card._cx)*ck; m.card._cy+=(ty-m.card._cy)*ck;
                }
                m.card.style.left=m.card._cx+'px'; m.card.style.top=m.card._cy+'px';
            });
        }

        // ── render loop ──
        const clock = new THREE.Clock();
        let rafHandle;
        function frame() {
            const dt = Math.min(clock.getDelta(),0.05);
            const el = clock.elapsedTime;
            markers.forEach(({flagMat,ring1,ring2,ringMat1,ringMat2,sprite},i)=>{
                flagMat.uniforms.uTime.value=el+i*1.7;
                const DUR=1.9;
                const t1=((el+i*0.43)%DUR)/DUR, t2=((el+i*0.43+DUR/2)%DUR)/DUR;
                ring1.scale.setScalar(1+t1*2.6); ringMat1.opacity=(1-t1)*0.8;
                ring2.scale.setScalar(1+t2*2.6); ringMat2.opacity=(1-t2)*0.8;
                sprite.material.opacity=0.5+Math.sin(el*2+i*1.3)*0.15;
            });
            clouds.forEach(c=>{c.position.x+=c.userData.speed*dt*2.4; if(c.position.x>350)c.position.x=-350;});
            updateCamera(dt);
            renderer.render(scene,camera);
            rafHandle=requestAnimationFrame(frame);
        }
        frame();

        const onResize = () => {
            camera.aspect=window.innerWidth/window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth,window.innerHeight);
        };
        window.addEventListener('resize',onResize);

        // ── HUD intro ──
        const H1_TEXT = "My Creative Journey";
        const PARA_TEXT = "A selection of projects that reflect my passion for creative direction, digital experiences and storytelling. Each mark is a waypoint — scroll to ride between them.";
        const introTimeouts = [];
        const badge=badgeRef.current, kicker=kickerRef.current, h1=h1Ref.current, para=paraRef.current;
        if(h1){
            const words=H1_TEXT.split(' ');
            h1.textContent='';
            const chars=[];
            words.forEach((w,wi)=>{
                const wrap=document.createElement('span'); wrap.style.display='inline-block'; wrap.style.whiteSpace='nowrap';
                [...w].forEach(c=>{const s=document.createElement('span');s.className='ch';s.textContent=c;wrap.appendChild(s);chars.push(s);});
                h1.appendChild(wrap);
                if(wi<words.length-1)h1.appendChild(document.createTextNode(' '));
            });
            if(para)para.textContent='';
            introTimeouts.push(setTimeout(()=>badge&&badge.classList.add('in'),150));
            introTimeouts.push(setTimeout(()=>kicker&&kicker.classList.add('in'),520));
            chars.forEach((s,i)=>introTimeouts.push(setTimeout(()=>s.classList.add('in'),760+i*34)));
            const typeStart=760+chars.length*34+250;
            introTimeouts.push(setTimeout(()=>{
                if(!para)return; para.classList.add('typing'); let i=0;
                const tick=()=>{para.textContent=PARA_TEXT.slice(0,++i); if(i<PARA_TEXT.length)introTimeouts.push(setTimeout(tick,13));else para.classList.remove('typing');};
                tick();
            },typeStart));
        }

        return () => {
            cancelAnimationFrame(rafHandle);
            window.removeEventListener('resize',onResize);
            window.removeEventListener('keydown',onKeyDown);
            window.removeEventListener('keyup',onKeyUp);
            window.removeEventListener('blur',onBlur);
            window.removeEventListener('mousemove',onMouseMove);
            fsListeners.forEach(fn=>document.removeEventListener('fullscreenchange',fn));
            introTimeouts.forEach(clearTimeout);
            renderer.dispose();
            cardsContainer.innerHTML = '';
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <section ref={sectionRef} style={{ position: "relative", height: "800vh" }}>
            <style dangerouslySetInnerHTML={{ __html: WGL_CSS }} />
            <div id="wgl-root" style={{ position: "sticky", top: 0, height: "100vh", width: "100%" }}>
                <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
                <div className="scrim" />
                <div className="hud hud-title">
                    <div ref={badgeRef} className="title-badge">
                        <svg viewBox="0 0 40 40" fill="none" stroke="#facc15" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 36 C 12 30, 8 24, 16 20 S 22 12, 21 7" strokeDasharray="3 3" opacity="0.85"/>
                            <path d="M21 7 V 2.5"/>
                            <path d="M21 2.5 h 12 l -3.5 4 l 3.5 4 h -12 z" fill="rgba(250,204,21,0.15)"/>
                        </svg>
                    </div>
                    <div className="title-text">
                        <div ref={kickerRef} className="kicker">Portfolio · Ride the Trail</div>
                        <h1 ref={h1Ref}>My Creative Journey</h1>
                        <p ref={paraRef}>A selection of projects that reflect my passion for creative direction, digital experiences and storytelling. Each mark is a waypoint — scroll to ride between them.</p>
                    </div>
                </div>
                <div className="hud hud-hint">Scroll to ride the trail</div>
                <div className="rail"><div ref={railFillRef} className="rail-fill" /></div>
                <div ref={readoutRef} className="compass-readout">000°</div>
                <div className="compass">
                    <svg viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="46" fill="rgba(4,8,15,0.72)" stroke="rgba(250,204,21,0.35)" strokeWidth="1.5"/>
                        <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="1"/>
                        <g ref={roseRef} style={{ transformOrigin: "50% 50%" }}>
                            <polygon points="50,14 54,50 50,58 46,50" fill="#facc15"/>
                            <polygon points="50,86 54,50 50,42 46,50" fill="rgba(230,237,245,0.35)"/>
                            <text x="50" y="11" textAnchor="middle" fontSize="9" fill="#facc15" fontFamily="Manrope" fontWeight="700">N</text>
                        </g>
                        <circle cx="50" cy="50" r="3" fill="#facc15"/>
                    </svg>
                </div>
                <div ref={cardsRef} />
                <div ref={cursorHexRef} id="cursorHex">
                    <div className="hx">View<br />Project
                        <svg viewBox="0 0 24 24" fill="none"><path d="M7 17L17 7M17 7H9M17 7v8" stroke="#0a1422" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                </div>
            </div>
        </section>
    );
}
