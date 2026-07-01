import { useRef, useState, useEffect, useMemo } from "react";
import { motion, useScroll } from "framer-motion";
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { PROJECTS } from "@/data/content";
import ProjectModal from "@/components/ProjectModal";

/* ── Config ────────────────────────────────────────────────────── */
const PROJECTS_SHOW = PROJECTS.slice(0, 8);
const TRAIL_LEN = PROJECTS_SHOW.length;
const ease = [0.22, 1, 0.36, 1];

/* S‑curve waypoints (x, z) — path snakes from mountain → foreground */
const WAYPOINTS = [
  { x: 0, z: -10 },   // mountain base
  { x: 5, z: -7 },    // right
  { x: -4, z: -4 },   // left
  { x: 4, z: -1 },    // right
  { x: -3, z: 2 },    // left
  { x: 3, z: 5 },     // right
  { x: 0, z: 7 },     // end
];

/* Where each project marker lives (interpolated along waypoints) */
function trailPos(t) {
  const idx = t * (WAYPOINTS.length - 1);
  const i = Math.floor(idx);
  const f = idx - i;
  const a = WAYPOINTS[Math.min(i, WAYPOINTS.length - 1)];
  const b = WAYPOINTS[Math.min(i + 1, WAYPOINTS.length - 1)];
  return { x: a.x + (b.x - a.x) * f, z: a.z + (b.z - a.z) * f };
}

/* ── Load FBX models ──────────────────────────────────────────── */
function loadFBX(loader, models) {
  return Promise.all(
    models.map(
      (m) =>
        new Promise((res, rej) => {
          loader.load(m.path, (obj) => res({ obj, ...m }), undefined, rej);
        })
    )
  );
}

/* ── Marker badge texture ─────────────────────────────────────── */
function badgeTexture(label, active) {
  const c = document.createElement("canvas");
  c.width = 256; c.height = 96;
  const ctx = c.getContext("2d");
  ctx.clearRect(0, 0, 256, 96);
  const cx = 128, cy = 32;
  const r = active ? 10 : 6;
  const color = active ? "#facc15" : "#4ade80";
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 50);
  g.addColorStop(0, active ? "rgba(250,204,21,0.35)" : "rgba(74,222,128,0.15)");
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 96);
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.font = "bold 22px 'Unbounded', sans-serif";
  ctx.fillStyle = active ? "#facc15" : "rgba(255,255,255,0.65)";
  ctx.fillText(label, cx, 48);
  return new THREE.CanvasTexture(c);
}

/* ── Create 3D marker (pole + badge sprite) ──────────────────── */
function createMarker(x, z, label, scene) {
  const g = new THREE.Group();
  const pole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04, 0.06, 2.5, 6),
    new THREE.MeshStandardMaterial({
      color: "#facc15",
      emissive: "#facc15",
      emissiveIntensity: 0.15,
    })
  );
  pole.position.y = 1.25;
  g.add(pole);

  const mat = new THREE.SpriteMaterial({
    map: badgeTexture(label, false),
    transparent: true,
    depthTest: false,
    sizeAttenuation: true,
  });
  const sprite = new THREE.Sprite(mat);
  sprite.position.y = 2.8;
  sprite.scale.set(1.8, 0.7, 1);
  g.add(sprite);

  g.position.set(x, 0.3, z);
  scene.add(g);
  return { group: g, sprite, mat, pole };
}

/* ── Hook: imperative Three.js ────────────────────────────────── */
function useThreeScene(containerRef, readyCb) {
  const [ready, setReady] = useState(false);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const markersRef = useRef([]);
  const scroll$ = useRef(0);
  const rafId = useRef(null);
  const mounted = useRef(false);

  const { scrollYProgress } = useScroll();
  useEffect(() => {
    const u = scrollYProgress.on("change", (v) => {
      scroll$.current = v;
    });
    return () => u();
  }, [scrollYProgress]);

  useEffect(() => {
    const c = containerRef.current;
    if (!c || mounted.current) return;
    mounted.current = true;

    const w = c.clientWidth,
      h = c.clientHeight;

    const r = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    r.setSize(w, h);
    r.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    r.shadowMap.enabled = true;
    r.toneMapping = THREE.ACESFilmicToneMapping;
    r.toneMappingExposure = 1.0;
    c.appendChild(r.domElement);
    rendererRef.current = r;

    const cam = new THREE.PerspectiveCamera(45, w / h, 0.3, 50);
    cam.position.set(0, 6, 10);
    cam.lookAt(0, 0, 0);
    cameraRef.current = cam;

    const sc = new THREE.Scene();
    sc.background = new THREE.Color("#0e1a2b");
    sc.fog = new THREE.Fog("#0e1a2b", 14, 28);
    sceneRef.current = sc;

    /* Lights */
    sc.add(new THREE.AmbientLight(0xffffff, 0.5));
    const d1 = new THREE.DirectionalLight(0xfacc15, 1.0);
    d1.position.set(10, 18, 5);
    d1.castShadow = true;
    d1.shadow.mapSize.set(1024, 1024);
    d1.shadow.camera.near = 0.5;
    d1.shadow.camera.far = 40;
    d1.shadow.camera.left = -15;
    d1.shadow.camera.right = 15;
    d1.shadow.camera.top = 15;
    d1.shadow.camera.bottom = -15;
    sc.add(d1);
    const d2 = new THREE.DirectionalLight(0x4ade80, 0.25);
    d2.position.set(-6, 10, -8);
    sc.add(d2);
    sc.add(new THREE.HemisphereLight(0xfacc15, 0x0e1a2b, 0.25));

    /* Ground plane (receives shadows) */
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(40, 30),
      new THREE.MeshStandardMaterial({ color: "#0a1424", roughness: 1 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.3;
    ground.receiveShadow = true;
    sc.add(ground);

    /* ── Load RPGPP LT models ───────────────────────────────── */
    const loader = new FBXLoader();
    const modelDefs = [
      { key: "mountain", path: "/rpg/rpgpp_lt_mountain_01.fbx" },
      { key: "pathA", path: "/rpg/rpgpp_lt_terrain_path_01a.fbx" },
      { key: "pathB", path: "/rpg/rpgpp_lt_terrain_path_01b.fbx" },
      { key: "hill1", path: "/rpg/rpgpp_lt_hill_small_01.fbx" },
      { key: "hill2", path: "/rpg/rpgpp_lt_hill_small_02.fbx" },
      { key: "treePine", path: "/rpg/rpgpp_lt_tree_pine_01.fbx" },
      { key: "tree", path: "/rpg/rpgpp_lt_tree_01.fbx" },
      { key: "rock", path: "/rpg/rpgpp_lt_rock_01.fbx" },
      { key: "bush", path: "/rpg/rpgpp_lt_bush_01.fbx" },
      { key: "banner", path: "/rpg/rpgpp_lt_banner_01a.fbx" },
      { key: "grass", path: "/rpg/rpgpp_lt_terrain_grass_01.fbx" },
    ];

    loadFBX(loader, modelDefs)
      .then((loaded) => {
        const models = {};
        loaded.forEach((m) => {
          models[m.key] = m.obj;
          m.obj.traverse((ch) => {
            if (ch.isMesh) {
              ch.castShadow = true;
              ch.receiveShadow = true;
              // Tweak FBX material
              if (ch.material) {
                ch.material.roughness = 0.8;
                ch.material.metalness = 0.0;
              }
            }
          });
        });

        /* Auto-scale: mountain ~5 units wide */
        const box = new THREE.Box3().setFromObject(models.mountain);
        const sz = box.getSize(new THREE.Vector3());
        const S = 4 / Math.max(sz.x, sz.y, sz.z);
        Object.values(models).forEach((m) => m.scale.setScalar(S));

        /* ── Build scene ──────────────────────────────────────── */

        // 1. Mountain — far end of trail
        models.mountain.position.set(0, -0.3, -11);
        sc.add(models.mountain);

        // 2. Grass terrain — scatter a few copies
        for (let i = 0; i < 4; i++) {
          const g = models.grass.clone();
          const angle = (i / 4) * Math.PI * 2;
          g.position.set(Math.cos(angle) * 7, -0.2, Math.sin(angle) * 7 - 3);
          g.rotation.y = angle;
          sc.add(g);
        }

        // 3. Hills — left/right edges
        const hillPositions = [
          { x: -7, z: -6 }, { x: 7, z: -4 },
          { x: -6, z: 0 }, { x: 6, z: 3 },
        ];
        hillPositions.forEach((p, i) => {
          const h = (i % 2 === 0 ? models.hill1 : models.hill2).clone();
          h.position.set(p.x, -0.2, p.z);
          h.rotation.y = Math.random() * Math.PI * 2;
          sc.add(h);
        });

        // 4. Winding path — clone path segments along waypoints
        for (let i = 0; i < WAYPOINTS.length - 1; i++) {
          const a = WAYPOINTS[i];
          const b = WAYPOINTS[i + 1];
          const mx = (a.x + b.x) / 2;
          const mz = (a.z + b.z) / 2;
          const angle = Math.atan2(b.x - a.x, b.z - a.z);
          const seg = (i % 2 === 0 ? models.pathA : models.pathB).clone();
          seg.position.set(mx, -0.15, mz);
          seg.rotation.y = angle;
          sc.add(seg);
        }

        // 5. Trees — cluster along edges of path
        const scatterPositions = [
          { x: 2.5, z: -8 }, { x: -2, z: -6.5 }, { x: 6.5, z: -5.5 },
          { x: -5.5, z: -3.5 }, { x: 5.5, z: -2.5 }, { x: -4.5, z: -1 },
          { x: -1.5, z: 0.5 }, { x: 5.5, z: 1.5 }, { x: 2.5, z: 3 },
          { x: -4, z: 4.5 }, { x: 1.5, z: 6 },
        ];
        scatterPositions.forEach((p, i) => {
          const isPine = i % 3 === 0;
          const t = (isPine ? models.treePine : models.tree).clone();
          t.position.set(p.x, -0.1, p.z);
          const s = 0.6 + Math.random() * 0.8;
          t.scale.setScalar(S * s);
          t.rotation.y = Math.random() * Math.PI * 2;
          sc.add(t);

          // Rocks & bushes near trees
          if (i % 2 === 0) {
            const r = models.rock.clone();
            r.position.set(p.x + (Math.random() - 0.5) * 1.5, -0.1, p.z + (Math.random() - 0.5) * 1.5);
            r.scale.setScalar(S * (0.4 + Math.random() * 0.5));
            r.rotation.y = Math.random() * Math.PI * 2;
            sc.add(r);
          }
          if (i % 3 === 1) {
            const b = models.bush.clone();
            b.position.set(p.x + (Math.random() - 0.5) * 1.2, -0.1, p.z + (Math.random() - 0.5) * 1.2);
            b.scale.setScalar(S * (0.5 + Math.random() * 0.5));
            b.rotation.y = Math.random() * Math.PI * 2;
            sc.add(b);
          }
        });

        // 6. Project markers along path (using poles, not banners)
        const markers = PROJECTS_SHOW.map((proj, i) => {
          const t = i / (PROJECTS_SHOW.length - 1 || 1);
          const pos = trailPos(t);
          return createMarker(pos.x, pos.z, proj.title, sc);
        });
        markersRef.current = markers;

        setReady(true);
        if (readyCb) readyCb(cam, r);
      })
      .catch((e) => console.error("FBX load error", e));

    /* ── Animation loop ─────────────────────────────────────── */
    function animate() {
      rafId.current = requestAnimationFrame(animate);
      const sp = scroll$.current;

      // Camera follows trail: overview at sp=0, ride along at sp=1
      const trail = trailPos(sp);
      const tx = trail.x;
      const tz = trail.z;

      // Y: start high (overview), descend to trail level
      const ty = 7 - sp * 5.5;
      // Z offset: behind the trail position (camera follows from behind-right)
      const cz = tz + 8 - sp * 3;
      const cx = tx + 3 - sp * 2;

      cam.position.x += (cx - cam.position.x) * 0.04;
      cam.position.y += (ty - cam.position.y) * 0.04;
      cam.position.z += (cz - cam.position.z) * 0.04;
      cam.lookAt(tx * 0.6, 0, tz * 0.6);

      r.render(sc, cam);
    }
    animate();

    const resize = () => {
      const cw = c.clientWidth,
        ch = c.clientHeight;
      cam.aspect = cw / ch;
      cam.updateProjectionMatrix();
      r.setSize(cw, ch);
    };
    addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(rafId.current);
      r.dispose();
      if (r.domElement.parentNode === c) c.removeChild(r.domElement);
      removeEventListener("resize", resize);
      mounted.current = false;
    };
  }, [containerRef, readyCb]);

  return { ready, cameraRef, sceneRef, markersRef, scroll$ };
}

/* ── Project 3D markers → 2D screen positions ────────────────── */
function MarkerProjector({ activeIdx, onSelect, onHover, cameraRef, containerRef }) {
  const [proj, setProj] = useState([]);
  const raf = useRef(null);

  const peaks = useMemo(
    () =>
      PROJECTS_SHOW.map((p, i) => {
        const t = i / (PROJECTS_SHOW.length - 1 || 1);
        const pos = trailPos(t);
        return { x: pos.x, z: pos.z, p };
      }),
    []
  );

  useEffect(() => {
    function tick() {
      if (!cameraRef.current || !containerRef.current) return;
      const cam = cameraRef.current;
      const rect = containerRef.current.getBoundingClientRect();
      const out = peaks.map((pt) => {
        const v = new THREE.Vector3(pt.x, 2.5, pt.z).project(cam);
        return {
          x: (v.x * 0.5 + 0.5) * rect.width,
          y: (-v.y * 0.5 + 0.5) * rect.height,
          visible: v.z <= 1,
          pt,
        };
      });
      setProj(out);
      raf.current = requestAnimationFrame(tick);
    }
    tick();
    return () => cancelAnimationFrame(raf.current);
  }, [peaks, cameraRef, containerRef]);

  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      {proj
        .filter((p) => p.visible)
        .map((p) => {
          const isOn = activeIdx === p.pt.p.idx;
          return (
            <button
              key={p.pt.p.slug}
              onClick={() => onSelect(p.pt.p)}
              onMouseEnter={() => onHover(p.pt.p.idx)}
              onMouseLeave={() => onHover(null)}
              className="pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2 text-center transition-all duration-300"
              style={{ left: p.x, top: p.y, opacity: isOn ? 1 : 0.5 }}
            >
              <div
                className="font-display text-[11px] font-black uppercase tracking-[0.12em] whitespace-nowrap drop-shadow-lg"
                style={{ color: isOn ? "#facc15" : "rgba(255,255,255,0.7)" }}
              >
                {p.pt.p.title}
              </div>
              <div
                className="mx-auto mt-1 h-2.5 w-2.5 rounded-full shadow-lg"
                style={{ backgroundColor: isOn ? "#facc15" : "#4ade80" }}
              />
            </button>
          );
        })}
    </div>
  );
}

/* ── ProjectCard ──────────────────────────────────────────────── */
function ProjectCard({ project, onOpen, onPrev, onNext, hasPrev, hasNext }) {
  if (!project) return null;
  return (
    <motion.div
      key={project.slug}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.35, ease }}
      className="w-full max-w-md"
    >
      <div
        className="overflow-hidden bg-[#0e1a2b]/90 backdrop-blur-md border border-white/10"
        style={{
          clipPath:
            "polygon(0 12px, 12px 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px))",
        }}
      >
        {project.thumb && (
          <div className="aspect-[16/9] w-full overflow-hidden">
            <img src={project.thumb} alt="" className="h-full w-full object-cover" />
          </div>
        )}
        <div className="p-4 sm:p-5">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em]">
            <span className="text-brand">{project.category}</span>
            <span className="h-1 w-1 rounded-full bg-white/20" />
            <span className="text-white/45">{project.year}</span>
          </div>
          <h3 className="mt-2 font-display text-lg font-black uppercase leading-tight tracking-tight text-white sm:text-xl">
            {project.title}
          </h3>
          <p className="mt-1 text-xs font-medium text-white/50">{project.role}</p>
          <p className="mt-2 text-sm leading-relaxed text-white/65 line-clamp-2">{project.tagline}</p>
          <button
            onClick={() => onOpen(project)}
            className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-brand transition-colors hover:text-white"
          >
            View case study →
          </button>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between px-1">
        <button
          onClick={onPrev}
          disabled={!hasPrev}
          className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 transition-colors hover:text-white disabled:opacity-20"
        >
          ← Prev
        </button>
        <button
          onClick={onNext}
          disabled={!hasNext}
          className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 transition-colors hover:text-white disabled:opacity-20"
        >
          Next →
        </button>
      </div>
    </motion.div>
  );
}

/* ── Main ─────────────────────────────────────────────────────── */
export default function ThreeTerrainGallery() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [hoverIdx, setHoverIdx] = useState(null);
  const [modalProject, setModalProject] = useState(null);
  const containerRef = useRef(null);

  /* Assign idx to projects so MarkerProjector can look up */
  const projectsIdxd = useMemo(
    () => PROJECTS_SHOW.map((p, i) => ({ ...p, idx: i })),
    []
  );

  const displayIdx = hoverIdx ?? activeIdx;
  const activeProject = projectsIdxd[displayIdx];

  const { ready, cameraRef } = useThreeScene(containerRef);

  return (
    <section id="works" className="relative bg-ink" style={{ height: "300vh" }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div ref={containerRef} className="absolute inset-0" />

        {!ready && (
          <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
            <p className="font-display text-xs font-bold uppercase tracking-[0.3em] text-white/30 animate-pulse">
              Loading trail…
            </p>
          </div>
        )}

        {ready && (
          <MarkerProjector
            activeIdx={displayIdx}
            onSelect={setModalProject}
            onHover={setHoverIdx}
            cameraRef={cameraRef}
            containerRef={containerRef}
          />
        )}

        {/* UI overlay */}
        <div className="pointer-events-none absolute inset-0 z-30">
          <div className="mx-auto max-w-7xl px-6 pt-8 sm:px-8 sm:pt-12">
            <div className="font-display text-[10px] font-extrabold uppercase tracking-[0.3em] text-white/35">
              04 · Selected Works
            </div>
            <h2 className="mt-2 font-display text-2xl font-black uppercase leading-none tracking-tight text-white sm:text-3xl">
              The <span className="text-brand">Trail</span>
            </h2>
          </div>

          <div className="pointer-events-auto absolute bottom-0 left-0 right-0 p-4 sm:p-8">
            <div className="mx-auto max-w-7xl">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 lg:max-w-lg">
                  <ProjectCard
                    project={activeProject}
                    onOpen={setModalProject}
                    onPrev={() => setActiveIdx((i) => Math.max(0, i - 1))}
                    onNext={() => setActiveIdx((i) => Math.min(projectsIdxd.length - 1, i + 1))}
                    hasPrev={activeIdx > 0}
                    hasNext={activeIdx < projectsIdxd.length - 1}
                  />
                </div>
                <div className="hidden items-end justify-end lg:flex">
                  <div className="font-display text-[11px] font-black tracking-[0.3em] text-white/25">
                    {String(displayIdx + 1).padStart(2, "0")} /{" "}
                    {String(projectsIdxd.length).padStart(2, "0")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ProjectModal project={modalProject} onClose={() => setModalProject(null)} />
    </section>
  );
}
