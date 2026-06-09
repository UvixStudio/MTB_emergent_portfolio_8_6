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
