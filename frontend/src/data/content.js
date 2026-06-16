// All real content pulled from Yuval Cohen's CV + portfolio deck.

export const PROFILE = {
    name: "Yuval Cohen",
    greeting: "Hi! I'm",
    roles: [
        "CREATIVE|TECHNOLOGIST",
        "CREATIVE|DIRECTOR",
        "PRODUCER",
        "AI & 3D|SPECIALIST",
        "MTB RIDER",
    ],
    taglineTop: "I DESIGN. I LEAD. I ELEVATE BRANDS.",
    taglineSub: "THROUGH CREATIVITY, STRATEGY & TECHNOLOGY.",
    location: "Tel Aviv, Israel",
    email: "yuval@uvixstudio.com",
    phone: "+972-51-2868309",
    linkedin: "https://linkedin.com/in/meet-yuval-cohen",
    tiktok: "https://www.tiktok.com/@uvixlabs",
    cv: "/Yuval-Cohen-CV.pdf",
};

export const ABOUT = {
    lead: "Multidisciplinary creative leader, Producer & Certified PM — with a passion for storytelling, design, and purposeful innovation.",
    body: "Creative Director and Technion-certified Product Manager with over 20 years of experience architecting hybrid production pipelines that bridge design intuition, realtime 3D workflows, and emerging technologies. I unblock complex creative productions by mastering technical constraints, building custom-coded tools, and structuring reliable workflows — translating ambitious concepts into stable, high-impact interactive systems and visual narratives.",
    quote: "Restrictions & limitations ignite my creativity. This is where I shine.",
    stats: [
        { value: 20, suffix: "+", label: "Years of experience" },
        { value: 100, suffix: "+", label: "Video productions led" },
        { value: 3, suffix: "x", label: "Global League finals" },
        { value: 5, suffix: "+", label: "EdTech awards won" },
    ],
};

// 01 ABOUT  02 CREATIVE DIRECTOR  03 AI & INNOVATION  04 PROJECTS
export const CHECKPOINTS = [
    {
        n: "01",
        label: "ABOUT ME",
        color: "var(--cp-about)",
        anchor: "about",
        teaser:
            "Over 20 years turning bold ideas into impactful, interactive experiences — where craft meets strategy and technology.",
        cta: "View the journey",
    },
    {
        n: "02",
        label: "CREATIVE DIRECTOR",
        color: "var(--cp-director)",
        anchor: "experience",
        teaser:
            "Leading creative teams and production pipelines for global brands — from concept to broadcast, rebrands to world-class experiences.",
        cta: "View experience",
    },
    {
        n: "03",
        label: "AI & INNOVATION",
        color: "var(--cp-ai)",
        anchor: "tools",
        teaser:
            "Designing the process itself — orchestrating AI, 3D and realtime pipelines into original, production-ready results.",
        cta: "Explore the toolkit",
    },
    {
        n: "04",
        label: "PROJECTS",
        color: "var(--cp-projects)",
        anchor: "works",
        teaser:
            "A selection of work that reflects creativity, strategy and cutting-edge technology in action.",
        cta: "See projects",
    },
];

export const CAPABILITIES = [
    {
        title: "Leadership",
        icon: "Compass",
        color: "var(--cp-about)",
        desc: "Creative direction, strategic thinking, mentoring & cross-team collaboration.",
    },
    {
        title: "Creative Direction",
        icon: "Palette",
        color: "var(--cp-director)",
        desc: "Brand & visual systems, storytelling and process architecture, end to end.",
    },
    {
        title: "AI Workflows",
        icon: "Sparkles",
        color: "var(--cp-ai)",
        desc: "Generative pipelines, JSON prompting, style consistency & hybrid AI systems.",
    },
    {
        title: "Technology · 3D / WebGL",
        icon: "Boxes",
        color: "var(--cp-projects)",
        desc: "Unity & WebGL, realtime 3D, AR experiences and immersive web engines.",
    },
    {
        title: "Tools & Systems",
        icon: "Wrench",
        color: "var(--cp-about)",
        desc: "Custom-coded tools, production management & scalable creative pipelines.",
    },
];

export const EXPERIENCE = [
    {
        company: "UVIX Studio",
        role: "Owner & Creative Director",
        period: "2023 — Present",
        color: "var(--cp-about)",
        copy: "Independent creative studio delivering customized workflows that merge concept design, cinematic video, custom AI architectures and immersive 3D production.",
        tags: ["AI Pipelines", "3D", "Cinematic", "Direction"],
    },
    {
        company: "CoderZ · Intelitek Group",
        role: "Creative Director · Producer · Unity & 3D/WebGL Systems",
        period: "2020 — 2023",
        color: "var(--cp-director)",
        copy: "Scaled a startup into an award-winning global EdTech leader. Led a full rebrand in under 6 months, expanded 5 → 11 courses, built pipelines across 15+ vendors and produced 100+ videos & three international League finals.",
        tags: ["Rebrand", "Broadcast", "Unity/WebGL", "Amazon · LEGO"],
    },
    {
        company: "Paymaxs LTD",
        role: "Senior Art Director · Unity/WebGL & AR Experiences",
        period: "2016 — 2019",
        color: "var(--cp-ai)",
        copy: "Led creative strategy & immersive product design for B2B/B2C lottery systems. Launched 5 realtime 3D / AR / WebGL experiences, including flagship deployments at ICE London and for the New York Lottery.",
        tags: ["AR", "WebGL", "New York Lottery", "ICE London"],
    },
    {
        company: "Gitam BBDO · GREY · Gorni",
        role: "Art Director & Senior Interactive Designer",
        period: "2003 — 2010",
        color: "var(--cp-projects)",
        copy: "Earlier agency years leading interactive & offline campaigns for L'Oréal, Bank Hapoalim and Cellcom — plus strategic work with Amdocs, Kaltura, Applicaster and more.",
        tags: ["Campaigns", "L'Oréal", "Team Lead", "UI/UX"],
    },
];

// ── Projects model (richer than WORKS) — real content from the deck. ──
// `category` powers a future filter. `caseStudy` (optional) drives the
// project-detail modal as a uniform Brief→Planning→Strategy→Build→Result story.
export const PROJECT_CATEGORIES = [
    "All",
    "Creative Direction",
    "Immersive / AR",
    "AI Video",
    "3D / Game",
];

export const PROJECTS = [
    {
        slug: "coderz",
        title: "CoderZ",
        role: "Creative Director & Producer",
        year: "2020 — 2023",
        category: "Creative Direction",
        accent: "var(--cp-director)",
        thumb: "/projects/coderz.jpeg",
        tagline:
            "Scaling a startup into an award-winning global EdTech leader through gamified 3D learning, a full rebrand & live broadcast production.",
        metrics: [
            { v: "100+", l: "videos & live broadcasts" },
            { v: "3×", l: "global league finals" },
            { v: "3×", l: "annual course output" },
        ],
    },
    {
        slug: "paymax",
        title: "Paymax",
        role: "Senior Art Director · Unity / WebGL & AR",
        year: "2016 — 2019",
        category: "Immersive / AR",
        accent: "var(--cp-ai)",
        thumb: "/projects/paymax.jpeg",
        tagline:
            "Leading immersive 3D lottery AR experiences (native & web) — including patent-backed 'Scan-to-Play' titles for the New York Lottery.",
    },
    {
        slug: "beit-hagefen",
        title: "Beit Ha'Gefen · Santa's Room",
        role: "Large-Scale Immersive Production",
        year: "2026",
        category: "Immersive / AR",
        accent: "var(--cp-ai)",
        thumb: null,
        tagline:
            "A four-wall immersive installation blending Christmas, Hanukkah & Ramadan — built on a structured AI architecture & large-format print pipeline.",
        // Flagship case study — folders map 1:1 to these stages.
        caseStudy: [
            {
                stage: "The Brief",
                body: "A walk-through 'Santa Room' for Beit Ha'Gefen, a Jewish-Arab cultural center in Haifa — one festive space weaving three holidays into a single spatial narrative. Four asymmetrical steel-frame PVC walls, up to 2.5m × 6m, with a 7-day turnaround.",
            },
            {
                stage: "Research & Planning",
                body: "The whole room was rebuilt as a spatial planning system from real measurements. A color-coded A/B/C/D wall system created a shared language between creative, client, print vendors and installation teams.",
            },
            {
                stage: "Creative Strategy",
                body: "Generating whole walls in one AI pass broke continuity — so continuity anchors (windows, arches, fireplaces, circular focal points) were planned first, then individual assets were generated separately and composited into unified environments.",
            },
            {
                stage: "Pipeline Architecture",
                body: "Composition-guided generation from color-zone sketches + a structured prompt architecture (GPT-assisted @img tagging and JSON-style prompts) pushed Nano Banana, Seedream & Flux on Freepik to their limits while holding precise cross-wall continuity.",
            },
            {
                stage: "Execution",
                body: "Four walls built modularly: Wall C (fireplace & window), Wall B (Santa's wall + hidden bedroom), Wall A (inner bedroom), Wall D (a massive circular stained-glass vitrage split into three holiday sections via up to 14 tagged references + Photoshop Harmonize blending).",
            },
            {
                stage: "Result & Impact",
                body: "Finalized at 1:10 ratio, ~400 DPI for large-format PVC. Hundreds of visitors through the season with live Santa interactions and constant social sharing — and a generative production methodology that still drives my workflows today.",
            },
        ],
    },
    {
        slug: "promee",
        title: "Promee",
        role: "AI-Assisted Promo Video",
        year: "2025",
        category: "AI Video",
        accent: "var(--cp-director)",
        thumb: "/projects/promee.jpeg",
        tagline:
            "An artistic tribute to iconic Israeli creators — my first end-to-end generative post-production pipeline (Freepik imagery + Kling video).",
    },
    {
        slug: "digitel-tlv",
        title: "Digitel TLV",
        role: "Social Video & 3D",
        year: "2025",
        category: "AI Video",
        accent: "var(--cp-about)",
        thumb: null,
        tagline:
            "A playful summer social campaign that solved controllable Hebrew typography inside generative 3D — Flux Kontext, local Hunyuan 3D, Adobe Dimension & Kling, finished in DaVinci Resolve.",
    },
    {
        slug: "bone-bash",
        title: "The Next Big Bang in 3D",
        role: "Talk · Ludo TLV · Bone Bash",
        year: "2025",
        category: "3D / Game",
        accent: "var(--cp-projects)",
        thumb: "/projects/bonebash.jpeg",
        tagline:
            "A full 2D-to-3D RPG production workflow presented as the Bone Bash game concept — ideation to web deployment, with a custom-trained style model for absolute consistency.",
    },
    {
        slug: "ten-li-rocknroll",
        title: "Ten Li Rock'n'Roll",
        role: "Tislam Tribute · Kan 11",
        year: "2025",
        category: "AI Video",
        accent: "var(--cp-director)",
        thumb: null,
        tagline:
            "Bringing an unfilmed rock memory to life with AI — character consistency, motion & cinematic lipsync compositing.",
    },
    {
        slug: "baboon-of-jafa",
        title: "Baboon of Jafa",
        role: "AI Remix",
        year: "2025",
        category: "AI Video",
        accent: "var(--cp-projects)",
        thumb: null,
        tagline:
            "Turning an Instagram story into a surreal biker legend through a generative character-swap video pipeline.",
    },
];

export const WORKS = [
    {
        title: "CoderZ",
        role: "Creative Director & Producer",
        desc: "Scaling a startup into an award-winning global EdTech leader through gamified 3D learning, rebranding & broadcast production.",
        tags: ["EdTech", "3D", "Branding", "Broadcast"],
        img: "/projects/coderz.jpeg",
        color: "var(--cp-director)",
        size: "hero",
    },
    {
        title: "Paymax",
        role: "Senior Art Director",
        desc: "Leading the creation of immersive 3D lottery AR experiences — native & web — for the New York Lottery.",
        tags: ["AR", "Unity", "3D"],
        img: "/projects/paymax.jpeg",
        color: "var(--cp-ai)",
        size: "tall",
    },
    {
        title: "The Next Big Bang in 3D",
        role: "Talk · Ludo TLV",
        desc: "A full 2D-to-3D RPG production workflow using AI tools, presented as the Bone Bash game concept.",
        tags: ["Speaking", "Game Dev", "AI"],
        img: "/projects/bonebash.jpeg",
        color: "var(--cp-projects)",
        size: "tall",
    },
    {
        title: "Promee",
        role: "AI-Assisted Promo Video",
        desc: "Music-tech, AI-assisted video pipeline generating localized cinematic content end-to-end.",
        tags: ["AI", "Video", "Brand"],
        img: "/projects/promee.jpeg",
        color: "var(--cp-director)",
        size: "wide",
    },
    {
        title: "Beit Ha'Gefen · Santa's Room",
        role: "Large-Scale Immersive Production",
        desc: "A 60sqm four-wall immersive installation built on a structured AI architecture & print pipeline.",
        tags: ["Immersive", "AI Pipeline", "Spatial"],
        img: null,
        color: "var(--cp-ai)",
        size: "std",
    },
    {
        title: "Digitel TLV",
        role: "Social Video & 3D",
        desc: "Summer social campaign solving controllable Hebrew typography inside generative 3D workflows.",
        tags: ["AI", "3D", "Typography"],
        img: null,
        color: "var(--cp-about)",
        size: "std",
    },
    {
        title: "Ten Li Rock'n'Roll",
        role: "Tislam Tribute · Kan 11",
        desc: "Bringing an unfilmed rock memory to life with AI — character consistency, motion & cinematic compositing.",
        tags: ["AI", "Cinematic", "Lipsync"],
        img: null,
        color: "var(--cp-director)",
        size: "std",
    },
    {
        title: "Baboon of Jafa",
        role: "AI Remix",
        desc: "Turning an Instagram story into a surreal biker legend through a generative video swap pipeline.",
        tags: ["AI", "Remix", "Character"],
        img: null,
        color: "var(--cp-projects)",
        size: "std",
    },
    {
        title: "Rock · Paper · Scissors · Lizard · Spock",
        role: "Vibe Coding R&D",
        desc: "An interactive Big Bang Theory tribute built through experimental 'vibe coding' with Claude.",
        tags: ["Creative Code", "Game", "Claude"],
        img: null,
        color: "var(--cp-ai)",
        size: "std",
    },
];

// Each waypoint defines a "slow zone": while scrolling between scrollStart
// and scrollEnd, the video creeps from timeStart → timeEnd (near-stop ~5%),
// giving the user time to read the card. Outside the zones the video plays
// fast (lots of video-seconds per scroll). Times are video seconds.
export const WAYPOINTS = [
    {
        id: "river",
        scrollStart: 0.18,
        scrollEnd: 0.66,
        timeStart: 9.0,  // 00:09
        timeEnd: 11.0,   // 00:11
        cardStart: 0.21,
        cardEnd: 0.63,
        accentColor: "#ef4444",
        label: "OBSTACLE 01",
        title: "ADAPTIVE\nTHINKING",
        subtitle: "River Crossing",
        bullets: [
            "Real projects hit unexpected obstacles — I spot them early",
            "Adapt fast, restructure the plan, keep the goal in sight",
            "Pivot decisively when needed — deliver what truly matters",
        ],
    },
];

// The opening "Planner / Big Picture" station — an AR-glasses route-planning
// overview. Waypoints are the creative-architect process, positioned along a
// trail map drawn in SVG. Background is a single still; HUD is all code.
export const PLANNER = {
    accent: "#22d3ee",
    bg: "/ride/ride_0002.webp", // placeholder vista — swap for the generated valley
    kicker: "Big Picture · Route Planning",
    title: "The Planner",
    intro: "Before the descent — I read the whole mountain. Every project starts on the cliff: mapping the route, the obstacles and the resources before the first pedal stroke.",
    statuses: ["Collecting data…", "Analyzing route…", "Mapping obstacles…", "Ready to go — game on!"],
    // normalized positions (% of the scene) along the planned trail
    waypoints: [
        { x: 20, y: 26, label: "Kickoff & Brief" },
        { x: 38, y: 36, label: "Research" },
        { x: 28, y: 49, label: "Creative Crack" },
        { x: 50, y: 55, label: "Gantt & Resources" },
        { x: 40, y: 68, label: "Production Plan" },
        { x: 62, y: 72, label: "Obstacles Mapped" },
        { x: 54, y: 84, label: "Build & Optimize" },
        { x: 74, y: 88, label: "Go-Live" },
    ],
};

// The three collectable power-ups, accumulated in the persistent HUD as the
// rider descends past each station.
export const POWERUPS = [
    { id: "adaptive",   label: "Adaptive Thinking",   color: "#ef4444", icon: "alert" },
    { id: "systems",    label: "Systems Builder",     color: "#22d3ee", icon: "systems" },
    { id: "leadership", label: "Empowered Leadership", color: "#facc15", icon: "leadership" },
];

// "Stations" — the gamified skill beats. Each is its own darkened, themed
// section: a shot of the rider + the skill topic + flag + collectable icon.
export const STATIONS = [
    {
        id: "adaptive",
        n: "01",
        kicker: "Obstacle 01 · River Crossing",
        title: "Adaptive Thinking",
        accent: "#ef4444",
        icon: "alert", // lucide map in Station.jsx
        frame: "/ride/ride_0240.webp",
        clip: "/stations/river.mp4",
        collectAt: 1.45, // seconds — when the rider hits the river
        readout: "River Crossing",
        intro: "Every real project hits the river — the obstacle you didn't plan for.",
        bullets: [
            "Spot obstacles early — read the trail before it breaks you",
            "Adapt fast: restructure the plan, keep the goal in sight",
            "Pivot decisively when needed — deliver what truly matters",
        ],
        powerup: "Adaptive Thinking",
    },
    {
        id: "systems",
        n: "02",
        kicker: "Obstacle 02 · The Bridge",
        title: "Systems Builder",
        accent: "#22d3ee",
        icon: "systems",
        clip: "/stations/systems.mp4",
        collectAt: 1.4,
        readout: "Building the Bridge",
        intro: "The gap others can't cross — I build the bridge while the wheels keep turning.",
        bullets: [
            "Design systems, pipelines and automations that scale",
            "Turn chaos into repeatable, reliable workflows",
            "Build custom tools where off-the-shelf falls short",
        ],
        powerup: "Systems Builder",
    },
    {
        id: "leadership",
        n: "03",
        kicker: "Obstacle 03 · The Group Ride",
        title: "Empowered Leadership",
        accent: "#facc15",
        icon: "leadership",
        clip: "/stations/leadership.mp4",
        collectAt: 1.4,
        readout: "Leading the Line",
        intro: "A trail is better ridden together — I lead the line and bring the crew home.",
        bullets: [
            "Connect people and align them around one vision",
            "Empower teams — share knowledge, grow others",
            "Direct from concept to delivery, end to end",
        ],
        powerup: "Empowered Leadership",
    },
];

export const TESTIMONIALS = [
    {
        name: "Meni Shukrun",
        role: "Full Stack Architect · Group Leader",
        rel: "Worked with Yuval on the same team · 2023",
        quote: "Together with the talented CoderZ team we crafted 3D virtual worlds where students practice coding and science. I came to appreciate Yuval's multi-disciplinary expertise — art, design, gaming, composition, UI, modeling, video editing and UX — with a strong grasp of both the theoretical and practical.",
    },
    {
        name: "Ronnie Noy",
        role: "Building products at Wix.com",
        rel: "Yuval's client · 2019",
        quote: "Yuval has a great combination of creativity and professionalism, with an ability to quickly grasp concepts and turn out exceptional visuals adjusting to many styles and needs. A true graphic artist with great product understanding and valuable inputs.",
    },
];

export const TOOLS = {
    row1: [
        "DaVinci Resolve",
        "After Effects",
        "Photoshop",
        "Figma",
        "Unity WebGL",
        "PlayCanvas",
        "Spline 3D",
        "Substance",
        "Mixamo",
        "Topaz AI",
    ],
    row2: [
        "Freepik",
        "Magnific",
        "Runway",
        "Flux",
        "Kling",
        "Sora",
        "Veo 3",
        "Nano Banana",
        "Hunyuan 3D",
        "Tripo · Rodin",
        "Claude",
        "GPT Image",
        "Cursor",
        "FAL · Replicate",
    ],
};
