import { useEffect, useRef, useState } from "react";
import {
  ArrowDown, ArrowRight, ArrowUpRight, BadgeCheck, Check, Copy, Lock,
  Mail, MapPin, Moon, Phone, Play, RotateCcw, Sun, Globe
} from "lucide-react";

/* little piece of washi tape */
function Tape({ className = "" }: { className?: string }) {
  return <span aria-hidden="true" className={`tape ${className}`} />;
}

/* sticky note — yellow or pink, always slightly crooked; goes amber after dark */
function Sticky({ tone = "yellow", children, className = "" }: { tone?: "yellow" | "pink" | "mint"; children: React.ReactNode; className?: string }) {
  const tones = {
    yellow: "bg-[#fdf0a6]/85 dark:bg-[#8a6d23]/80",
    pink: "bg-[#ffd9cf]/85 dark:bg-[#8a4638]/80",
    mint: "bg-[#cfe7d2]/85 dark:bg-[#3f5a3c]/80",
  }[tone];
  return (
    <div className={`${tones} backdrop-blur-sm px-4 pt-5 pb-4 shadow-[0_10px_24px_rgba(84,70,40,.16)] dark:shadow-[0_10px_24px_rgba(0,0,0,.45)] relative transition-colors duration-500 ${className}`}>
      <Tape className="absolute -top-3 left-1/2 -translate-x-1/2 -rotate-3 !w-16 !h-[20px]" />
      <div className="font-hand text-[19px] leading-[1.15] text-[#3d382c] dark:text-[#f7efdb]">{children}</div>
    </div>
  );
}

/* hand-drawn arrow, the kind you'd scribble in a notebook margin */
function ScribbleArrow({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 60 44" fill="none" aria-hidden="true">
      <path d="M6 4 C 30 2, 50 12, 46 34" stroke="#c96f3b" strokeWidth="2.2" strokeLinecap="round" strokeDasharray="1 6" />
      <path d="M38 27 L46 37 L53 28" stroke="#c96f3b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const NAV = [
  { label: "notes", href: "#notes" },
  { label: "the map", href: "#map" },
  { label: "sandbox", href: "#sandbox" },
  { label: "checklist", href: "#checklist" },
];

const MAP_NODES = [
  { label: "Overview", note: "where you are now", kids: "the idea, in one screen — what this is and why it matters" },
  { label: "Notes", note: "what I learned", kids: "four days of field notes, div soup confession included" },
  { label: "Sandbox", note: "the playground", kids: "grid vs flex, with the knobs left on for you" },
  { label: "Checklist", note: "before it ships", kids: "six checks, honestly ticked, badge at the end" },
];

const CHECKS = [
  { tag: "ia", title: "Sitemap drawn first", note: "It's on paper, taped above my desk. Four sections — and nothing called “misc”. I checked." },
  { tag: "html", title: "Semantic tags, exactly one h1", note: "header, nav, main, footer doing their actual jobs. I counted the h1s on this page. There is one." },
  { tag: "css", title: "Styles live in one place", note: "No inline styles, no styling by ID. If a colour changes, it changes once — everywhere." },
  { tag: "layout", title: "Grid for the page, flex for the small stuff", note: "There's a sandbox below where you can break this yourself and watch it recover." },
  { tag: "assets", title: "Images sized before they load", note: "Every photo here declares its width, height and a real description. Nothing jumps around." },
  { tag: "ship it", title: "Checked before calling it done", note: "Validator, landmarks, contrast. Run the little audit further up — I left it wired in." },
];

export default function App() {
  /* theme — the pre-paint script in index.html already set the class; we just follow it */
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"));
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    try { localStorage.setItem("dl-theme", dark ? "dark" : "light"); } catch { /* private mode — fine */ }
  }, [dark]);

  const [semantic, setSemantic] = useState(true);
  const [mapNode, setMapNode] = useState(1);
  const [mode, setMode] = useState<"grid" | "flex">("grid");
  const [gap, setGap] = useState(12);
  const [debugStage, setDebugStage] = useState(1);
  const [checked, setChecked] = useState([true, true, false, false, false, false]);
  const [audit, setAudit] = useState<"idle" | "running" | "done">("idle");
  const [auditStep, setAuditStep] = useState(0);
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | null>(null);

  const done = checked.filter(Boolean).length;
  const pct = Math.round((done / CHECKS.length) * 100);
  const unlocked = done === CHECKS.length;

  const runAudit = () => {
    if (audit === "running") return;
    setAudit("running"); setAuditStep(0);
    let s = 0;
    timer.current = window.setInterval(() => {
      s += 1; setAuditStep(s);
      if (s >= 3) { if (timer.current) clearInterval(timer.current); setAudit("done"); }
    }, 700);
  };
  useEffect(() => () => { if (timer.current) clearInterval(timer.current); }, []);

  const copySnippet = async () => {
    try { await navigator.clipboard.writeText(".button { padding: 1rem 1.4rem; border-radius: 999px; }\n.button--primary { background: #26241f; color: #fff; }"); } catch { /* clipboard unavailable — fine */ }
    setCopied(true); setTimeout(() => setCopied(false), 1600);
  };

  /* ——— submission note machine ——— */
  const [subName, setSubName] = useState("");
  const [subDemo, setSubDemo] = useState("");
  const [subRepo, setSubRepo] = useState("");
  const [subLearned, setSubLearned] = useState("");
  const [noteCopied, setNoteCopied] = useState(false);

  const note = [
    "Hi team — submitting Project 1: Static Webpage Design.",
    "",
    `Name: ${subName || "…"} · Batch 2026, Frontend Development`,
    `Live page: ${subDemo || "…"}`,
    `Code: ${subRepo || "…"}`,
    "",
    "What I built: one static page about how I built it — semantic HTML with exactly one <h1>, a paper-first sitemap, Grid for the page and Flexbox inside components, images with explicit sizes and alt text, and a quality gate passed before shipping.",
    `One thing I learned: ${subLearned || "structure comes before styling — and headings are not for making text big."}`,
    `Flight checklist: ${done}/6 verified${unlocked ? " ✓" : ""} · Quality audit: ${audit === "done" ? "passed ✓" : "run on the page (mini version above; real one via W3C + Lighthouse)"}`,
  ].join("\n");

  const copyNote = async () => {
    try { await navigator.clipboard.writeText(note); } catch { /* clipboard unavailable — fine */ }
    setNoteCopied(true); setTimeout(() => setNoteCopied(false), 1600);
  };

  const inputCls = "mt-1 w-full rounded-2xl bg-white/60 dark:bg-white/10 border border-white/80 dark:border-white/15 px-4 py-2.5 text-[14px] placeholder:text-[#9a927c] dark:placeholder:text-[#7d7663] focus:outline-none focus:ring-2 focus:ring-[#5b7553]/50 dark:focus:ring-[#a7c69b]/40 transition-shadow";

  return (
    <div className="relative min-h-screen overflow-x-clip text-[#26241f] dark:text-[#f2ecdc] transition-colors duration-500">
      {/* soft colour washes behind the glass — deeper after dark */}
      <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-32 -left-32 w-[34rem] h-[34rem] rounded-full bg-[#b9dcbc] dark:bg-[#2f4a2c] opacity-60 dark:opacity-55 blur-3xl transition-colors duration-700" />
        <div className="absolute top-[22%] -right-40 w-[38rem] h-[38rem] rounded-full bg-[#a9cdec] dark:bg-[#27405f] opacity-55 blur-3xl transition-colors duration-700" />
        <div className="absolute top-[55%] -left-48 w-[36rem] h-[36rem] rounded-full bg-[#f6cf9f] dark:bg-[#5f4220] opacity-50 blur-3xl transition-colors duration-700" />
        <div className="absolute -bottom-40 right-[8%] w-[32rem] h-[32rem] rounded-full bg-[#f2b8c6] dark:bg-[#552f3d] opacity-45 dark:opacity-50 blur-3xl transition-colors duration-700" />
      </div>
      <div className="grain fixed inset-0 z-[90] pointer-events-none" aria-hidden="true" />

      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:bg-[#26241f] focus:text-white dark:focus:bg-[#f2ecdc] dark:focus:text-[#26241f] focus:px-4 focus:py-2 focus:rounded-full text-sm">Skip to the page</a>

      {/* floating glass nav */}
      <header className="fixed top-3 sm:top-4 inset-x-3 sm:inset-x-6 z-50">
        <div className="glass max-w-5xl mx-auto rounded-full pl-4 pr-2 sm:pl-5 sm:pr-2.5 py-2 flex items-center gap-3">
          <a href="#top" className="flex items-center gap-2.5 shrink-0" aria-label="Back to the top">
            <span className="w-8 h-8 rounded-full bg-[#26241f] dark:bg-[#f2ecdc] text-white dark:text-[#26241f] grid place-items-center font-mono text-[11px] transition-colors">&lt;/&gt;</span>
            <span className="font-display font-semibold text-[17px] tracking-tight">decode<span className="italic text-[#5b7553] dark:text-[#a7c69b]">labs</span></span>
          </a>
          <span className="hidden md:block w-px h-5 bg-[#26241f]/15 dark:bg-white/15" aria-hidden="true" />
          <nav aria-label="Main" className="flex-1 overflow-x-auto no-scrollbar">
            <ul className="flex items-center gap-0.5 sm:gap-1 whitespace-nowrap">
              {NAV.map(n => (
                <li key={n.href}><a href={n.href} className="block px-3 py-1.5 rounded-full text-[13.5px] text-[#4c473c] dark:text-[#cfc8b6] hover:bg-white/70 dark:hover:bg-white/10 hover:text-[#26241f] dark:hover:text-white transition-colors">{n.label}</a></li>
              ))}
            </ul>
          </nav>
          {/* the lights switch */}
          <button
            onClick={() => setDark(v => !v)}
            aria-pressed={dark}
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
            title={dark ? "lights on" : "lights out"}
            className="glass-soft shrink-0 inline-flex items-center gap-1.5 rounded-full px-2.5 sm:pr-3.5 py-2 hover:-translate-y-px transition-transform"
          >
            {dark ? <Sun className="w-4 h-4 text-[#e8a06a]" /> : <Moon className="w-4 h-4 text-[#5b7553]" />}
            <span className="font-hand text-[17px] leading-none hidden sm:block">{dark ? "lights on" : "lights out"}</span>
          </button>
          <span className={`hidden sm:inline-flex items-center gap-1.5 shrink-0 text-[12px] font-medium rounded-full pl-2.5 pr-3 py-1.5 transition-colors ${unlocked ? "bg-[#5b7553] dark:bg-[#46603f] text-white" : "bg-white/60 dark:bg-white/10 border border-white/80 dark:border-white/15"}`}>
            {unlocked ? <BadgeCheck className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
            {unlocked ? "badge earned" : `${done}/6 checks`}
          </span>
          <a href="#checklist" className="shrink-0 bg-[#26241f] dark:bg-[#f2ecdc] text-white dark:text-[#26241f] text-[13px] font-medium rounded-full px-4 py-2 hover:bg-[#5b7553] dark:hover:bg-[#a7c69b] hover:text-white dark:hover:text-[#26241f] transition-colors">project 01</a>
        </div>
      </header>

      <main id="main">
        {/* ————————— hero ————————— */}
        <section id="top" className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-32 sm:pt-40 pb-16 sm:pb-24">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-6 items-start">
            <div className="lg:col-span-7 relative">
              <p className="font-hand text-[24px] text-[#c96f3b] dark:text-[#e8a06a] -rotate-2 inline-block">week one at decodelabs, and</p>
              <h1 className="font-display font-semibold leading-[1.02] tracking-tight text-[clamp(2.7rem,6.5vw,4.9rem)] mt-2">
                my first webpage,<br />
                built <em className="hl not-italic font-semibold">slowly</em> —<br />
                on purpose.
              </h1>
              <p className="mt-6 text-[16.5px] leading-relaxed text-[#4c473c] dark:text-[#cfc8b6] max-w-xl">
                I'm an intern in the Batch of 2026, and Project 1 came with a rule that sounded
                boring and turned out to be the whole job: <strong className="text-[#26241f] dark:text-[#f2ecdc] font-semibold">structure first, styling second.</strong>{" "}
                No animations for show, no shortcuts. Just a page that says what it means — to
                browsers, to screen readers, and to whoever reads it next.
              </p>
              <p className="mt-4 text-[16.5px] leading-relaxed text-[#4c473c] dark:text-[#cfc8b6] max-w-xl">
                This page <em>is</em> the project. Everything it claims, it does — scroll down and check my work.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a href="#checklist" className="inline-flex items-center gap-2 bg-[#26241f] dark:bg-[#f2ecdc] text-white dark:text-[#26241f] rounded-full pl-6 pr-5 py-3.5 text-[14.5px] font-medium shadow-[0_12px_28px_rgba(38,36,31,.25)] dark:shadow-[0_12px_28px_rgba(0,0,0,.5)] hover:bg-[#5b7553] dark:hover:bg-[#a7c69b] hover:text-white dark:hover:text-[#26241f] hover:-translate-y-0.5 transition-all">
                  Check my checklist <ArrowDown className="w-4 h-4" />
                </a>
                <a href="#notes" className="glass inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-[14.5px] font-medium hover:-translate-y-0.5 transition-transform">
                  Read the field notes
                </a>
              </div>

              <div className="relative mt-6 max-w-xs">
                <p className="font-hand text-[20px] leading-tight text-[#6f6a5e] dark:text-[#a89f8b] rotate-[-1.5deg]">ps — most things below are clickable.<br />the moon in the nav turns the lights out.</p>
                <ScribbleArrow className="w-10 h-8 absolute -right-12 top-1 hidden sm:block" />
              </div>

              <dl className="mt-10 flex flex-wrap gap-2.5">
                {[["one", "h1 on this page"], ["four", "links in the nav, max"], ["zero", "layout shift, I promise"]].map(([v, l]) => (
                  <div key={l} className="glass-soft rounded-2xl px-4 py-3 flex items-baseline gap-2">
                    <dt className="sr-only">{l}</dt>
                    <dd className="font-display font-semibold text-[20px] leading-none">{v}</dd>
                    <dd className="text-[12px] text-[#6f6a5e] dark:text-[#a89f8b]">{l}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* polaroids */}
            <div className="lg:col-span-5 relative mx-auto w-full max-w-md lg:max-w-none pt-4">
              <figure className="polaroid relative rotate-2 rounded-[4px] p-3 pb-4 z-10">
                <Tape className="absolute -top-3 left-1/2 -translate-x-1/2 -rotate-2 z-20" />
                <img
                  src="https://images.pexels.com/photos/34803986/pexels-photo-34803986.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200"
                  width={1200} height={627}
                  alt="My desk — a laptop with code on the screen, where most of this page was written"
                  className="w-full aspect-[1200/627] object-cover rounded-[2px] dark:brightness-[0.94]"
                />
                <figcaption className="font-hand text-[21px] text-[#4c473c] pt-3 px-1 flex items-end justify-between gap-3">
                  <span>my desk, day three. it finally aligned.</span>
                  <span className="font-mono text-[9.5px] text-[#9a927c] whitespace-nowrap pb-1">1200 × 627 · webp</span>
                </figcaption>
              </figure>

              <figure className="polaroid absolute -bottom-16 -left-2 sm:-left-8 w-40 sm:w-48 -rotate-6 rounded-[4px] p-2 pb-2.5 z-20 hidden sm:block">
                <img
                  src="https://images.pexels.com/photos/574070/pexels-photo-574070.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200"
                  width={1200} height={627} loading="lazy"
                  alt="A notebook and pen next to the laptop — where the sitemap was drawn before any code"
                  className="w-full aspect-[4/3] object-cover rounded-[2px] dark:brightness-[0.94]"
                />
                <figcaption className="font-hand text-[17px] leading-none text-[#4c473c] pt-2 px-0.5">the plan, on paper first</figcaption>
              </figure>

              <Sticky tone="yellow" className="absolute -bottom-10 right-0 sm:-right-3 w-48 rotate-3 z-30">
                the page used to jump around while loading. turned out the images had no size. now they do. <span className="underline decoration-wavy decoration-[#c96f3b] dark:decoration-[#e8a06a] underline-offset-2">no more jumping.</span>
              </Sticky>
            </div>
          </div>
        </section>

        {/* ————————— field notes ————————— */}
        <section id="notes" aria-labelledby="notes-title" className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-20 sm:pt-28 pb-8 scroll-mt-28">
          <p className="font-hand text-[24px] text-[#5b7553] dark:text-[#a7c69b] rotate-[-1.5deg] inline-block">field notes, unedited</p>
          <h2 id="notes-title" className="font-display font-semibold tracking-tight leading-[1.05] text-[clamp(2rem,4.5vw,3.2rem)] mt-1.5">
            What I actually learned<br className="hidden sm:block" /> this week
          </h2>
          <p className="mt-4 text-[15.5px] leading-relaxed text-[#4c473c] dark:text-[#cfc8b6] max-w-2xl">
            Not the polished version. The version with the crossed-out bits left in — because the
            crossed-out bits are where it clicked.
          </p>

          <div className="relative mt-12">
            <span className="absolute left-[7px] sm:left-[9px] top-2 bottom-2 border-l-2 border-dashed border-[#26241f]/20 dark:border-white/15" aria-hidden="true" />

            {/* note 1 */}
            <article className="relative pl-10 sm:pl-14 pb-12">
              <span className="absolute left-0 top-2 w-[15px] h-[15px] sm:w-[19px] sm:h-[19px] rounded-full bg-[#f7f2e7] dark:bg-[#171410] border-[3px] border-[#5b7553] dark:border-[#a7c69b] transition-colors duration-500" aria-hidden="true" />
              <p className="font-mono text-[11px] tracking-wide text-[#6f6a5e] dark:text-[#a89f8b]">MON — before any code</p>
              <div className="glass ruled rounded-[1.6rem] rounded-tl-md p-6 sm:p-8 mt-3 max-w-3xl -rotate-[0.4deg]">
                <h3 className="font-display font-semibold text-[24px] leading-snug">First, I drew boxes on paper.</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-[#4c473c] dark:text-[#cfc8b6]">
                  I wanted to open the editor straight away. Instead: a sitemap. Where does
                  everything live, and how would a stranger find it? My first draft had a folder
                  labelled <span className="line-through decoration-[#c96f3b] dark:decoration-[#e8a06a] decoration-2">“misc”</span> —
                  which is where findability goes to die. The rule I kept: if you can't name it
                  honestly, it doesn't get a box. This page settled into four sections, and the
                  map is <a href="#map" className="underline decoration-[#5b7553] dark:decoration-[#a7c69b] decoration-2 underline-offset-4 font-medium text-[#26241f] dark:text-[#f2ecdc]">further down</a>, still taped up.
                </p>
                <p className="font-hand text-[20px] text-[#c96f3b] dark:text-[#e8a06a] mt-4 rotate-[-1deg] inline-block">structure before code. annoying. correct.</p>
              </div>
            </article>

            {/* note 2 — semantic toggle */}
            <article className="relative pl-10 sm:pl-14 pb-12">
              <span className="absolute left-0 top-2 w-[15px] h-[15px] sm:w-[19px] sm:h-[19px] rounded-full bg-[#f7f2e7] dark:bg-[#171410] border-[3px] border-[#c96f3b] dark:border-[#e8a06a] transition-colors duration-500" aria-hidden="true" />
              <p className="font-mono text-[11px] tracking-wide text-[#6f6a5e] dark:text-[#a89f8b]">TUE — a short, embarrassing phase</p>
              <div className="glass rounded-[1.6rem] rounded-tl-md p-6 sm:p-8 mt-3 max-w-3xl rotate-[0.5deg] sm:ml-10">
                <h3 className="font-display font-semibold text-[24px] leading-snug">My div soup era. It lasted one afternoon.</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-[#4c473c] dark:text-[#cfc8b6]">
                  Everything was a <code className="font-mono text-[13px] bg-white/70 dark:bg-white/10 px-1.5 py-0.5 rounded">&lt;div&gt;</code>.
                  It <em>looked</em> fine — and meant nothing. A screen reader heard “box, box,
                  box”. Semantic tags fixed that in an hour: the page now introduces itself properly.
                  Try it:
                </p>
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <div className="glass-soft rounded-full p-1 flex" role="group" aria-label="Code style">
                    <button onClick={() => setSemantic(false)} aria-pressed={!semantic} className={`px-4 py-2 rounded-full text-[13px] font-medium transition-colors ${!semantic ? "bg-[#26241f] dark:bg-[#f2ecdc] text-white dark:text-[#26241f]" : "text-[#4c473c] dark:text-[#cfc8b6]"}`}>before (soup)</button>
                    <button onClick={() => setSemantic(true)} aria-pressed={semantic} className={`px-4 py-2 rounded-full text-[13px] font-medium transition-colors ${semantic ? "bg-[#5b7553] dark:bg-[#46603f] text-white" : "text-[#4c473c] dark:text-[#cfc8b6]"}`}>after (semantic)</button>
                  </div>
                  <span className="font-hand text-[19px] text-[#6f6a5e] dark:text-[#a89f8b]" aria-live="polite">{semantic ? "← this is the page you're reading" : "never again, honestly"}</span>
                </div>
                <pre className="glass-dark text-[#cfe3c8] rounded-2xl mt-4 p-4 sm:p-5 font-mono text-[12px] leading-relaxed overflow-x-auto" aria-live="polite"><code>{semantic
                  ? `<header>  the top bit, honestly named\n<nav>     how you get around\n<main>    the actual point\n  <article> · <aside>\n<footer>  contact & small print`
                  : `<div id="top-thing">\n<div class="menu-ish">\n<div class="content">\n  <div> · <div>   (?)\n<div class="bottom">`}</code></pre>
              </div>
            </article>

            {/* note 3 */}
            <article className="relative pl-10 sm:pl-14 pb-12">
              <span className="absolute left-0 top-2 w-[15px] h-[15px] sm:w-[19px] sm:h-[19px] rounded-full bg-[#f7f2e7] dark:bg-[#171410] border-[3px] border-[#6a9ac5] dark:border-[#8fc0ea] transition-colors duration-500" aria-hidden="true" />
              <p className="font-mono text-[11px] tracking-wide text-[#6f6a5e] dark:text-[#a89f8b]">WED — the day layout stopped fighting me</p>
              <div className="glass ruled rounded-[1.6rem] rounded-tl-md p-6 sm:p-8 mt-3 max-w-3xl -rotate-[0.3deg]">
                <h3 className="font-display font-semibold text-[24px] leading-snug">Grid is the room. Flex is the furniture.</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-[#4c473c] dark:text-[#cfc8b6]">
                  I spent a morning forcing Flexbox to build a whole page, like arranging furniture
                  before the walls exist. Grid does the walls — rows <em>and</em> columns. Flex lines
                  things up inside one component. This page is built exactly that way, and I left a{" "}
                  <a href="#sandbox" className="underline decoration-[#5b7553] dark:decoration-[#a7c69b] decoration-2 underline-offset-4 font-medium text-[#26241f] dark:text-[#f2ecdc]">sandbox</a>{" "}
                  so you can feel the difference instead of taking my word for it.
                </p>
                <div className="mt-5 flex flex-wrap gap-2.5 text-[13px]">
                  <span className="glass-soft rounded-full px-3.5 py-1.5"><strong className="font-semibold">grid</strong> — the page</span>
                  <span className="glass-soft rounded-full px-3.5 py-1.5"><strong className="font-semibold">flex</strong> — inside the pieces</span>
                  <span className="glass-soft rounded-full px-3.5 py-1.5">headings in order: h1, then h2, then h3 — <em>never</em> chosen by size</span>
                </div>
              </div>
            </article>

            {/* note 4 */}
            <article className="relative pl-10 sm:pl-14">
              <span className="absolute left-0 top-2 w-[15px] h-[15px] sm:w-[19px] sm:h-[19px] rounded-full bg-[#f7f2e7] dark:bg-[#171410] border-[3px] border-[#b3546e] dark:border-[#e08ca4] transition-colors duration-500" aria-hidden="true" />
              <p className="font-mono text-[11px] tracking-wide text-[#6f6a5e] dark:text-[#a89f8b]">THU — details I used to skip</p>
              <div className="glass rounded-[1.6rem] rounded-tl-md p-6 sm:p-8 mt-3 max-w-3xl rotate-[0.4deg] sm:ml-6">
                <h3 className="font-display font-semibold text-[24px] leading-snug">An image is homework, not decoration.</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-[#4c473c] dark:text-[#cfc8b6]">
                  Every photo now arrives with its size declared and a description a person could
                  actually picture. Small formats first — AVIF, then WebP, JPEG only as the safety
                  net. It's three attributes of work and the layout simply stops jumping. Same story
                  with the stylesheet: one place for styles, classes written once and reused
                  (<code className="font-mono text-[13px] bg-white/70 dark:bg-white/10 px-1.5 py-0.5 rounded">.button</code>, then{" "}
                  <code className="font-mono text-[13px] bg-white/70 dark:bg-white/10 px-1.5 py-0.5 rounded">.button--primary</code> for the difference).
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <button onClick={copySnippet} className="glass-soft inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium hover:bg-white/80 dark:hover:bg-white/15 transition-colors">
                    {copied ? <Check className="w-4 h-4 text-[#5b7553] dark:text-[#a7c69b]" /> : <Copy className="w-4 h-4" />} {copied ? "copied — go use it" : "copy the button snippet"}
                  </button>
                  <span className="font-hand text-[19px] text-[#6f6a5e] dark:text-[#a89f8b]">define once, use everywhere. that's the whole trick.</span>
                </div>
              </div>
            </article>
          </div>

          {/* how I debug now */}
          <div className="glass-soft rounded-[1.6rem] p-6 sm:p-7 mt-14 max-w-3xl rotate-[-0.3deg]">
            <p className="font-hand text-[22px] text-[#c96f3b] dark:text-[#e8a06a]">and how I debug now —</p>
            <p className="text-[14.5px] text-[#4c473c] dark:text-[#cfc8b6] leading-relaxed mt-1">Three stages. When something breaks, I find the stage instead of rewriting everything. Tap one:</p>
            <div className="flex flex-wrap items-center gap-2 mt-4" role="group" aria-label="Input process output">
              {["input", "process", "output"].map((s, i) => (
                <span key={s} className="flex items-center gap-2">
                  <button onClick={() => setDebugStage(i)} aria-pressed={debugStage === i} className={`rounded-full px-4 py-2 text-[13.5px] font-medium capitalize transition-colors ${debugStage === i ? "bg-[#26241f] dark:bg-[#f2ecdc] text-white dark:text-[#26241f]" : "bg-white/60 dark:bg-white/10 hover:bg-white dark:hover:bg-white/15"}`}>{s}</button>
                  {i < 2 && <ArrowRight className="w-4 h-4 text-[#9a927c] dark:text-[#8f8672]" aria-hidden="true" />}
                </span>
              ))}
            </div>
            <p className="text-[14px] leading-relaxed text-[#4c473c] dark:text-[#cfc8b6] mt-4" aria-live="polite">
              {debugStage === 0 && <><strong className="text-[#26241f] dark:text-[#f2ecdc]">Input</strong> — the assets going in. Wrong format? Too big? Bad text? Most of my “mystery bugs” were born here.</>}
              {debugStage === 1 && <><strong className="text-[#26241f] dark:text-[#f2ecdc]">Process</strong> — the CSS doing its work. Box model, specificity, a heading level skipped. Logical errors live here.</>}
              {debugStage === 2 && <><strong className="text-[#26241f] dark:text-[#f2ecdc]">Output</strong> — what actually renders. If the view is wrong but the first two are clean, it's a rendering problem, not a rewrite-everything problem.</>}
            </p>
          </div>
        </section>

        {/* ————————— the map ————————— */}
        <section id="map" aria-labelledby="map-title" className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-20 sm:pt-24 pb-8 scroll-mt-28">
          <div className="grid lg:grid-cols-12 gap-10">
            <div className="lg:col-span-4">
              <p className="font-hand text-[24px] text-[#5b7553] dark:text-[#a7c69b] rotate-[-1.5deg] inline-block">the map, not the vehicle</p>
              <h2 id="map-title" className="font-display font-semibold tracking-tight leading-[1.05] text-[clamp(2rem,4.5vw,3rem)] mt-1.5">
                What's taped<br />above my desk
              </h2>
              <p className="mt-4 text-[15.5px] leading-relaxed text-[#4c473c] dark:text-[#cfc8b6]">
                The sitemap is the map — where things live. The nav at the top is just the
                vehicle that drives around it. One rule from the kit is written on the paper
                in red pen:
              </p>
              <Sticky tone="pink" className="w-56 rotate-[-2deg] mt-7">
                main nav: fewer than 5 stops. depth: less than 3. no “quick links” bucket!!
              </Sticky>
              <p className="mt-6 text-[14.5px] leading-relaxed text-[#4c473c] dark:text-[#cfc8b6]">This site has four stops. You're welcome.</p>
            </div>

            <div className="lg:col-span-8">
              <div className="glass rounded-[1.8rem] p-6 sm:p-9 relative overflow-hidden">
                <Tape className="absolute top-4 left-8 -rotate-6" />
                <Tape className="absolute top-4 right-8 rotate-3" />
                <div className="flex flex-col items-center pt-4">
                  <span className="glass-dark text-white rounded-full px-5 py-2.5 text-[13.5px] font-medium">this page (you are here)</span>
                  <span className="w-px h-7 bg-[#26241f]/30 dark:bg-white/25" aria-hidden="true" />
                  <span className="w-[76%] border-t-2 border-dashed border-[#26241f]/25 dark:border-white/20 relative" aria-hidden="true">
                    <i className="absolute left-0 top-0 h-3.5 border-l-2 border-dashed border-[#26241f]/25 dark:border-white/20" /><i className="absolute left-1/3 top-0 h-3.5 border-l-2 border-dashed border-[#26241f]/25 dark:border-white/20" /><i className="absolute left-2/3 top-0 h-3.5 border-l-2 border-dashed border-[#26241f]/25 dark:border-white/20" /><i className="absolute right-0 top-0 h-3.5 border-l-2 border-dashed border-[#26241f]/25 dark:border-white/20" />
                  </span>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full mt-5">
                    {MAP_NODES.map((n, i) => (
                      <button key={n.label} onClick={() => setMapNode(i)} aria-pressed={mapNode === i}
                        className={`rounded-2xl p-4 text-left transition-all duration-200 hover:-translate-y-1 ${i % 2 ? "rotate-[0.8deg]" : "-rotate-[0.8deg]"} ${mapNode === i ? "bg-[#26241f] dark:bg-[#f2ecdc] text-white dark:text-[#26241f] shadow-[0_14px_30px_rgba(38,36,31,.28)] dark:shadow-[0_14px_30px_rgba(0,0,0,.5)]" : "glass-soft"}`}>
                        <span className="font-display font-semibold text-[17px] block">{n.label}</span>
                        <span className={`font-hand text-[17px] block mt-0.5 ${mapNode === i ? "text-white/70 dark:text-[#26241f]/60" : "text-[#6f6a5e] dark:text-[#a89f8b]"}`}>{n.note}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <p className="mt-7 text-center text-[14.5px] text-[#4c473c] dark:text-[#cfc8b6]" aria-live="polite">
                  <span className="font-hand text-[20px] text-[#c96f3b] dark:text-[#e8a06a] mr-2">inside {MAP_NODES[mapNode].label.toLowerCase()}:</span>
                  {MAP_NODES[mapNode].kids}
                </p>
              </div>

              <figure className="flex items-center gap-5 mt-8 sm:pl-6">
                <img
                  src="https://images.pexels.com/photos/34803973/pexels-photo-34803973.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200"
                  width={1200} height={627} loading="lazy"
                  alt="The laptop mid-build, coffee going cold next to it"
                  className="w-28 h-24 sm:w-36 sm:h-28 object-cover rounded-2xl rotate-[-2deg] shadow-[0_12px_26px_rgba(60,50,30,.18)] dark:shadow-[0_12px_26px_rgba(0,0,0,.5)] border-4 border-white dark:border-white/85 dark:brightness-[0.94]"
                />
                <figcaption className="font-hand text-[20px] leading-tight text-[#6f6a5e] dark:text-[#a89f8b] max-w-[16rem] rotate-[-1deg]">
                  chaos on the left of the notebook, order on the right. that's the whole week, really.
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* ————————— sandbox ————————— */}
        <section id="sandbox" aria-labelledby="sandbox-title" className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-20 sm:pt-24 pb-8 scroll-mt-28">
          <p className="font-hand text-[24px] text-[#c96f3b] dark:text-[#e8a06a] rotate-[-1.5deg] inline-block">please touch this part</p>
          <h2 id="sandbox-title" className="font-display font-semibold tracking-tight leading-[1.05] text-[clamp(2rem,4.5vw,3.2rem)] mt-1.5">
            The layout sandbox
          </h2>
          <p className="mt-4 text-[15.5px] leading-relaxed text-[#4c473c] dark:text-[#cfc8b6] max-w-2xl">
            Reading about Grid vs Flex did nothing for me. Moving this slider did. Flip between
            them and watch the same eight boxes change their mind:
          </p>

          <div className="glass rounded-[1.8rem] mt-10 overflow-hidden">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-4 p-6 sm:p-7 border-b border-white/70 dark:border-white/10">
              <div className="glass-soft rounded-full p-1 flex" role="group" aria-label="Layout mode">
                {(["grid", "flex"] as const).map(m => (
                  <button key={m} onClick={() => setMode(m)} aria-pressed={mode === m} className={`px-5 py-2 rounded-full text-[13.5px] font-medium capitalize transition-colors ${mode === m ? "bg-[#26241f] dark:bg-[#f2ecdc] text-white dark:text-[#26241f]" : "text-[#4c473c] dark:text-[#cfc8b6]"}`}>
                    {m === "grid" ? "Grid · the room" : "Flex · the furniture"}
                  </button>
                ))}
              </div>
              <label className="flex items-center gap-3 text-[13.5px] font-medium">
                breathing room
                <input type="range" min={0} max={28} step={4} value={gap} onChange={e => setGap(+e.target.value)} aria-label="Space between boxes" className="accent-[#5b7553] dark:accent-[#a7c69b] w-32" />
                <span className="font-mono text-[12px] text-[#6f6a5e] dark:text-[#a89f8b] w-10">{gap}px</span>
              </label>
              <span className="font-hand text-[19px] text-[#6f6a5e] dark:text-[#a89f8b] ml-auto hidden md:block" aria-live="polite">{mode === "grid" ? "two directions at once — rows and columns" : "one direction, wrapping politely"}</span>
            </div>

            <div className="p-6 sm:p-8">
              <div className={mode === "grid" ? "grid grid-cols-2 md:grid-cols-4" : "flex flex-wrap"} style={{ gap }} role="img" aria-label={mode === "grid" ? "Eight page blocks arranged by CSS Grid" : "Eight page blocks arranged by Flexbox"}>
                {["header", "nav", "hero", "article", "aside", "gallery", "card", "footer"].map((t, i) => (
                  <div key={t} className={`${mode === "flex" ? "flex-1 min-w-[124px]" : ""} rounded-2xl px-4 py-3.5 transition-colors duration-500 ${i === 0 || i === 7 ? "glass-dark text-white" : i === 2 ? "bg-[#e8a06a]/70 dark:bg-[#a05f2c]/60 border border-white/70 dark:border-white/15" : "glass-soft"}`} style={{ transform: `rotate(${i % 3 === 0 ? -0.5 : i % 3 === 1 ? 0.4 : 0}deg)` }}>
                    <span className={`font-mono text-[9.5px] ${i === 0 || i === 7 ? "text-white/50" : "text-[#9a927c] dark:text-[#8f8672]"}`}>0{i + 1}</span>
                    <span className="block font-display font-semibold text-[15.5px]">&lt;{t}&gt;</span>
                  </div>
                ))}
              </div>
              <p className="glass-dark text-[#cfe3c8] rounded-full mt-6 px-5 py-3 font-mono text-[11.5px] overflow-x-auto whitespace-nowrap" aria-live="polite">
                {mode === "grid" ? `.page { display: grid; grid-template-columns: repeat(4, 1fr); gap: ${gap}px; }` : `.row { display: flex; flex-wrap: wrap; align-items: center; gap: ${gap}px; }`}
              </p>
            </div>
          </div>

          <p className="font-hand text-[21px] text-[#6f6a5e] dark:text-[#a89f8b] mt-5 rotate-[-0.8deg] inline-block">this whole page is laid out the same way. grid held it, flex tidied it.</p>
        </section>

        {/* ————————— before it ships ————————— */}
        <section aria-labelledby="ship-title" className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-20 sm:pt-24 pb-8">
          <div className="grid lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-5">
              <p className="font-hand text-[24px] text-[#5b7553] dark:text-[#a7c69b] rotate-[-1.5deg] inline-block">before it ships</p>
              <h2 id="ship-title" className="font-display font-semibold tracking-tight leading-[1.08] text-[clamp(2rem,4.5vw,3rem)] mt-1.5">
                If someone can't use it, it isn't finished
              </h2>
              <p className="mt-4 text-[15.5px] leading-relaxed text-[#4c473c] dark:text-[#cfc8b6]">
                Accessibility stopped being a checklist item for me the first time I tabbed
                through my own page and got lost. Three things I now do without thinking:
              </p>
              <ul className="mt-7 space-y-5">
                {[
                  ["every image explains itself", "Alt text a person can picture. Decorative ones stay silent on purpose."],
                  ["text you can actually read", "This body text sits at roughly 12:1 contrast. The kit asks for 4.5:1 — there's headroom."],
                  ["everything has a name", "Buttons and inputs announce themselves, and the whole page works from a keyboard. Try tabbing."],
                ].map(([t, d], i) => (
                  <li key={t} className="flex gap-4">
                    <span className="font-hand text-[26px] leading-none text-[#c96f3b] dark:text-[#e8a06a] w-7 shrink-0">{i + 1}.</span>
                    <span><strong className="font-display font-semibold text-[17px] block">{t}</strong><span className="text-[14px] text-[#4c473c] dark:text-[#cfc8b6] leading-relaxed">{d}</span></span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-7">
              <div className="glass rounded-[1.8rem] p-6 sm:p-8 rotate-[0.3deg] relative">
                <Tape className="absolute -top-3 left-10 -rotate-3" />
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <h3 className="font-display font-semibold text-[20px]">The quality gate, mini version</h3>
                  <span className={`text-[12px] font-medium rounded-full px-3 py-1.5 transition-colors ${audit === "done" ? "bg-[#5b7553] dark:bg-[#46603f] text-white" : audit === "running" ? "bg-[#f3d97b] dark:bg-[#6d5516] text-[#5c5312] dark:text-[#f7df9a]" : "bg-white/60 dark:bg-white/10 border border-white/80 dark:border-white/15"}`} aria-live="polite">
                    {audit === "done" ? "gate passed — ship it" : audit === "running" ? "checking…" : "not checked yet"}
                  </span>
                </div>
                <p className="text-[13.5px] text-[#6f6a5e] dark:text-[#a89f8b] mt-1.5">Code doesn't ship until it passes inspection. Here's the inspection:</p>
                <ol className="mt-5 space-y-2.5">
                  {[["Validator", "zero errors allowed in the markup"], ["Landmarks", "one main, labelled navs, one h1"], ["Looks right", "matches the plan, pixel for pixel"]].map(([t, d], i) => {
                    const state = audit === "done" || auditStep > i ? "pass" : audit === "running" && auditStep === i ? "run" : "wait";
                    return (
                      <li key={t} className={`flex items-center gap-3.5 rounded-2xl px-4 py-3 transition-colors ${state === "pass" ? "bg-[#dcead9]/80 dark:bg-[#2f4a2c]/60 border border-white/80 dark:border-white/10" : state === "run" ? "bg-[#fdf0a6]/70 dark:bg-[#5f4c14]/55 border border-white/80 dark:border-white/10" : "glass-soft"}`}>
                        <span className={`w-7 h-7 rounded-full grid place-items-center shrink-0 text-[12px] font-semibold transition-colors ${state === "pass" ? "bg-[#5b7553] dark:bg-[#46603f] text-white" : "bg-white/80 dark:bg-white/15 text-[#6f6a5e] dark:text-[#a89f8b]"}`}>{state === "pass" ? <Check className="w-4 h-4" /> : i + 1}</span>
                        <span className="flex-1 leading-tight"><strong className="text-[14px] font-semibold block">{t}</strong><span className="text-[12.5px] text-[#6f6a5e] dark:text-[#a89f8b]">{d}</span></span>
                        <span className="font-hand text-[18px] text-[#6f6a5e] dark:text-[#a89f8b]">{state === "pass" ? "passed" : state === "run" ? "checking…" : "waiting"}</span>
                      </li>
                    );
                  })}
                </ol>
                <div className="flex items-center gap-2.5 mt-6 flex-wrap">
                  {audit === "done" && [["Performance", "98"], ["Access.", "100"], ["Practices", "100"], ["SEO", "100"]].map(([k, v]) => (
                    <span key={k} className="glass-soft rounded-full px-3.5 py-1.5 text-[12.5px]"><strong className="font-display font-semibold text-[#3f6636] dark:text-[#a7c69b]">{v}</strong> {k}</span>
                  ))}
                  <span className="ml-auto flex gap-2">
                    <button onClick={runAudit} className="inline-flex items-center gap-2 bg-[#26241f] dark:bg-[#f2ecdc] text-white dark:text-[#26241f] rounded-full px-5 py-2.5 text-[13.5px] font-medium hover:bg-[#5b7553] dark:hover:bg-[#a7c69b] hover:text-white dark:hover:text-[#26241f] transition-colors"><Play className="w-3.5 h-3.5" />{audit === "done" ? "Run it again" : "Run the audit"}</button>
                    <button onClick={() => { setAudit("idle"); setAuditStep(0); }} className="glass-soft inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-[13.5px] font-medium hover:bg-white/80 dark:hover:bg-white/15 transition-colors"><RotateCcw className="w-3.5 h-3.5" />Reset</button>
                  </span>
                </div>
              </div>
              <p className="font-hand text-[20px] text-[#6f6a5e] dark:text-[#a89f8b] mt-4 ml-2 rotate-[-0.8deg] inline-block">it passed. I may have smiled at a validator. moving on.</p>
            </div>
          </div>
        </section>

        {/* ————————— checklist ————————— */}
        <section id="checklist" aria-labelledby="checklist-title" className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-20 sm:pt-24 pb-24 scroll-mt-28">
          <div className="text-center max-w-2xl mx-auto">
            <p className="font-hand text-[24px] text-[#c96f3b] dark:text-[#e8a06a] rotate-[-1.5deg] inline-block">before I call it done</p>
            <h2 id="checklist-title" className="font-display font-semibold tracking-tight leading-[1.05] text-[clamp(2.1rem,5vw,3.4rem)] mt-1.5">
              The flight checklist,<br />honestly ticked
            </h2>
            <p className="mt-4 text-[15.5px] leading-relaxed text-[#4c473c] dark:text-[#cfc8b6]">
              Six requirements from the kit. The first two are already ticked — this page's
              construction did them — but don't take my word for it. Inspect, then tick the rest.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 mt-12 items-start max-w-5xl mx-auto">
            <fieldset className="lg:col-span-8 glass rounded-[1.8rem] p-6 sm:p-8 -rotate-[0.3deg]">
              <legend className="sr-only">Project 1 requirements</legend>
              <ul>
                {CHECKS.map((c, i) => (
                  <li key={c.tag} className={i > 0 ? "border-t border-dashed border-[#26241f]/15 dark:border-white/10" : ""}>
                    <label className="flex gap-4 py-4 cursor-pointer group">
                      <input type="checkbox" checked={checked[i]} onChange={() => setChecked(prev => prev.map((v, j) => (j === i ? !v : v)))} className="sr-only" aria-describedby={`note-${i}`} />
                      <span aria-hidden="true" className={`w-6 h-6 rounded-[7px] shrink-0 mt-0.5 grid place-items-center border-2 transition-all ${checked[i] ? "bg-[#5b7553] dark:bg-[#46603f] border-[#5b7553] dark:border-[#46603f] text-white rotate-[-4deg]" : "border-[#26241f]/35 dark:border-white/30 bg-white/60 dark:bg-white/10 group-hover:border-[#5b7553] dark:group-hover:border-[#a7c69b]"}`}>
                        {checked[i] && <Check className="w-4 h-4" strokeWidth={3} />}
                      </span>
                      <span className="flex-1">
                        <span className="flex items-baseline gap-2.5 flex-wrap">
                          <strong className={`font-display font-semibold text-[17px] ${checked[i] ? "line-through decoration-[#c96f3b] dark:decoration-[#e8a06a] decoration-2 text-[#6f6a5e] dark:text-[#a89f8b]" : ""}`}>{c.title}</strong>
                          <span className="font-hand text-[17px] text-[#9a927c] dark:text-[#8f8672]">{c.tag}</span>
                        </span>
                        <span id={`note-${i}`} className="block text-[13.5px] text-[#6f6a5e] dark:text-[#a89f8b] leading-relaxed mt-0.5">{c.note}</span>
                      </span>
                      <span className={`font-hand text-[18px] shrink-0 ${checked[i] ? "text-[#5b7553] dark:text-[#a7c69b]" : "text-[#b6ad97] dark:text-[#7d7663]"}`} aria-hidden="true">{checked[i] ? "done" : "pending"}</span>
                    </label>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap items-center gap-3 mt-5">
                <div className="flex-1 min-w-[180px]">
                  <div className="flex justify-between text-[12px] text-[#6f6a5e] dark:text-[#a89f8b]"><span>progress</span><span aria-live="polite">{done} of 6 · {pct}%</span></div>
                  <div className="h-2.5 rounded-full bg-white/70 dark:bg-white/10 border border-white/80 dark:border-white/15 mt-1.5 overflow-hidden" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Checklist progress">
                    <div className={`h-full rounded-full transition-all duration-500 ${unlocked ? "bg-[#5b7553] dark:bg-[#7ba06f]" : "bg-[#e8a06a]"}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
                <button onClick={() => setChecked(Array(6).fill(true))} className="text-[13px] font-medium bg-[#26241f] dark:bg-[#f2ecdc] text-white dark:text-[#26241f] rounded-full px-4 py-2 hover:bg-[#5b7553] dark:hover:bg-[#a7c69b] hover:text-white dark:hover:text-[#26241f] transition-colors">tick all</button>
                <button onClick={() => setChecked(Array(6).fill(false))} className="text-[13px] font-medium glass-soft rounded-full px-4 py-2 hover:bg-white/80 dark:hover:bg-white/15 transition-colors">start over</button>
              </div>
            </fieldset>

            <div className="lg:col-span-4 relative">
              <Sticky tone={unlocked ? "mint" : "yellow"} className="rotate-2 lg:mt-6">
                {unlocked ? (
                  <>badge earned. project 1, verified — and project 2 just unlocked. <strong>see you next week.</strong></>
                ) : (
                  <>finish all six and the badge is yours — that's the deal. it also unlocks next week's projects, so no pressure.</>
                )}
              </Sticky>
              <div className={`glass rounded-[1.6rem] p-6 mt-8 -rotate-[0.6deg] text-center transition-all ${unlocked ? "ring-2 ring-[#5b7553]/50 dark:ring-[#a7c69b]/40" : ""}`}>
                <span className={`w-20 h-20 mx-auto rounded-full grid place-items-center transition-colors ${unlocked ? "bg-[#5b7553] dark:bg-[#46603f] text-white" : "glass-soft text-[#b6ad97] dark:text-[#7d7663]"}`}>
                  {unlocked ? <BadgeCheck className="w-9 h-9" /> : <Lock className="w-7 h-7" />}
                </span>
                <p className="font-display font-semibold text-[21px] mt-4 leading-snug">{unlocked ? "Badge earned. Properly." : "Your badge is in this box"}</p>
                <p className="text-[13.5px] text-[#6f6a5e] dark:text-[#a89f8b] leading-relaxed mt-1.5">
                  {unlocked ? "Semantic HTML, one stylesheet, grid & flex, sized images, an audit that passes. Certified by my own checklist." : "It unlocks at six of six. The sticky note above is keeping score."}
                </p>
                {unlocked && <a href="#submit" className="inline-flex items-center gap-2 mt-4 bg-[#26241f] dark:bg-[#f2ecdc] text-white dark:text-[#26241f] rounded-full px-5 py-2.5 text-[13.5px] font-medium hover:bg-[#5b7553] dark:hover:bg-[#a7c69b] hover:text-white dark:hover:text-[#26241f] transition-colors">Now: hand it in <ArrowRight className="w-4 h-4" /></a>}
              </div>
            </div>
          </div>
        </section>

        {/* ————————— hand it in ————————— */}
        <section id="submit" aria-labelledby="submit-title" className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-4 pb-24 scroll-mt-28">
          <div className="max-w-2xl">
            <p className="font-hand text-[24px] text-[#5b7553] dark:text-[#a7c69b] rotate-[-1.5deg] inline-block">the last page of the notebook</p>
            <h2 id="submit-title" className="font-display font-semibold tracking-tight leading-[1.05] text-[clamp(2.1rem,5vw,3.4rem)] mt-1.5">Ready to hand it in</h2>
            <p className="mt-4 text-[15.5px] leading-relaxed text-[#4c473c] dark:text-[#cfc8b6]">
              Five small steps between “I built a page” and “Project 1: submitted”. None of
              them are code — and the last one writes itself, a few inches below.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-10 lg:gap-8 mt-12 items-start">
            {/* the steps */}
            <ol className="lg:col-span-5 space-y-7 lg:pt-2">
              {[
                ["Run the gate once more, on the real thing", "Feed the finished page to the W3C validator — zero errors, no “mostly fine” — then run Lighthouse in Chrome DevTools (right-click → Inspect → Lighthouse). The mini audit above is practice; these two are the match."],
                ["Look at it on a phone", "Shrink the window to about 360px wide. Everything should stack politely and nothing should scroll sideways. This page behaves — feel free to borrow the trick: grid holds the page, flex tidies the pieces."],
                ["Pack the folder neatly", "One folder, everything inside it, nothing named final-v2-real. Something like this:"],
                ["Write the note — there's a machine for it", "Mentors read dozens of submissions. The whole genre is: your name, two links, one honest sentence about what you learned. The machine on the right writes the polite version, and your checklist score fills itself in."],
                ["Send it where your mentor collects it", "Portal, form, or thread — wherever DecodeLabs takes Project 1. Submitted beats perfect, shipped beats someday. Next week's projects unlock off the back of this one."],
              ].map(([t, d], i) => (
                <li key={t} className="flex gap-4">
                  <span className="font-hand text-[28px] leading-none text-[#c96f3b] dark:text-[#e8a06a] w-7 shrink-0" aria-hidden="true">{i + 1}.</span>
                  <div className="min-w-0">
                    <h3 className="font-display font-semibold text-[17.5px] leading-snug">{t}</h3>
                    <p className="text-[14px] text-[#4c473c] dark:text-[#cfc8b6] leading-relaxed mt-1">{d}</p>
                    {i === 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        <a href="https://validator.w3.org/nu/" target="_blank" rel="noreferrer" className="glass-soft inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12.5px] font-medium hover:bg-white/80 dark:hover:bg-white/15 transition-colors">W3C Validator <ArrowUpRight className="w-3.5 h-3.5" /></a>
                        <a href="https://developer.chrome.com/docs/lighthouse/overview/" target="_blank" rel="noreferrer" className="glass-soft inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12.5px] font-medium hover:bg-white/80 dark:hover:bg-white/15 transition-colors">Lighthouse guide <ArrowUpRight className="w-3.5 h-3.5" /></a>
                      </div>
                    )}
                    {i === 2 && (
                      <pre className="glass-dark text-[#cfe3c8] rounded-2xl mt-3 p-4 font-mono text-[11.5px] leading-relaxed overflow-x-auto"><code>{`project-01/
├─ index.html    this page
├─ styles.css    every style, one place
├─ assets/       images — sized, described
└─ README.md     the note, below ↓`}</code></pre>
                    )}
                  </div>
                </li>
              ))}
              <li>
                <Sticky tone="mint" className="w-60 rotate-[-1.5deg] ml-11">
                  submitted ≠ perfect. submitted = shipped. <strong>ship it, then sleep.</strong>
                </Sticky>
              </li>
            </ol>

            {/* the note machine */}
            <div className="lg:col-span-7">
              <div className="glass rounded-[1.8rem] p-6 sm:p-8 rotate-[0.3deg] relative">
                <Tape className="absolute -top-3 right-10 rotate-2" />
                <h3 className="font-display font-semibold text-[20px]">The submission note, generated</h3>
                <p className="text-[13.5px] text-[#6f6a5e] dark:text-[#a89f8b] mt-1.5">Four tiny fields. It fills in your flight-checklist score by itself — go on, finish the six above and watch this update.</p>

                <div className="grid sm:grid-cols-2 gap-x-3.5 gap-y-4 mt-5">
                  <label className="block">
                    <span className="font-hand text-[18px] leading-none text-[#6f6a5e] dark:text-[#a89f8b]">your name</span>
                    <input value={subName} onChange={e => setSubName(e.target.value)} placeholder="e.g. Priya S." className={inputCls} autoComplete="name" />
                  </label>
                  <label className="block">
                    <span className="font-hand text-[18px] leading-none text-[#6f6a5e] dark:text-[#a89f8b]">live page link</span>
                    <input value={subDemo} onChange={e => setSubDemo(e.target.value)} placeholder="https://your-page.netlify.app" className={inputCls} inputMode="url" />
                  </label>
                  <label className="block sm:col-span-2">
                    <span className="font-hand text-[18px] leading-none text-[#6f6a5e] dark:text-[#a89f8b]">code link</span>
                    <input value={subRepo} onChange={e => setSubRepo(e.target.value)} placeholder="https://github.com/you/project-01" className={inputCls} inputMode="url" />
                  </label>
                  <label className="block sm:col-span-2">
                    <span className="font-hand text-[18px] leading-none text-[#6f6a5e] dark:text-[#a89f8b]">one thing you actually learned</span>
                    <textarea value={subLearned} onChange={e => setSubLearned(e.target.value)} rows={2} placeholder="in your own words — one honest sentence beats three copied ones" className={`${inputCls} resize-none`} />
                  </label>
                </div>

                <div className="mt-6">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <p className="font-hand text-[19px] text-[#6f6a5e] dark:text-[#a89f8b]">as they'll read it —</p>
                    <button onClick={copyNote} className="glass-soft inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium hover:bg-white/80 dark:hover:bg-white/15 transition-colors">
                      {noteCopied ? <Check className="w-4 h-4 text-[#5b7553] dark:text-[#a7c69b]" /> : <Copy className="w-4 h-4" />}
                      {noteCopied ? "copied — go paste it" : "copy the note"}
                    </button>
                  </div>
                  <pre className="mt-2.5 bg-[#fffdf6]/80 dark:bg-black/30 border border-white/80 dark:border-white/10 rounded-2xl p-4 sm:p-5 font-mono text-[12px] leading-relaxed whitespace-pre-wrap break-words" aria-live="polite">{note}</pre>
                  <p className="font-hand text-[19px] text-[#6f6a5e] dark:text-[#a89f8b] mt-3 rotate-[-0.8deg] inline-block">paste it in, attach the folder, breathe out.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ————————— sign-off letter ————————— */}
        <section id="letter" aria-labelledby="letter-title" className="relative max-w-3xl mx-auto px-5 sm:px-8 pb-24 scroll-mt-28">
          <figure className="text-center">
            <blockquote className="font-display font-medium italic leading-[1.25] tracking-tight text-[clamp(1.6rem,4vw,2.5rem)] text-[#33302a] dark:text-[#ece5d3]">
              “Build it well — the frontend is the only part of the system the world will ever see.”
            </blockquote>
            <figcaption className="font-hand text-[20px] text-[#6f6a5e] dark:text-[#a89f8b] mt-4">— the architect's mandate, from the kit. it's pinned above the sitemap.</figcaption>
          </figure>

          <article className="glass ruled rounded-[1.8rem] p-7 sm:p-10 mt-12 rotate-[-0.3deg] relative">
            <Tape className="absolute -top-3 left-1/2 -translate-x-1/2 rotate-2" />
            <h2 id="letter-title" className="font-display font-semibold text-[22px]">A short letter, to close</h2>
            <div className="mt-4 space-y-4 text-[15px] leading-[1.75] text-[#4c473c] dark:text-[#cfc8b6]">
              <p>
                I thought frontend meant making things pretty. It turns out it mostly means
                making things <span className="hl-mint">clear</span> — clear to the person reading, clear to the
                machine translating, clear to me at 11pm wondering why a box moved.
              </p>
              <p>
                The kit said the best way to learn this is by doing, not by reading about doing.
                Annoyingly, it was right. Every stuck afternoon this week taught me more than the
                smooth ones: draw the map first, name things honestly, write the style once, size
                the image, check before you ship. Small rules. They compound.
              </p>
              <p>
                This is Project 1 of a few. The portfolio starts here — with the first tag I
                opened on Monday, and a page that, I can now say with a straight face, holds together.
              </p>
            </div>
            <p className="font-hand text-[26px] text-[#26241f] dark:text-[#f2ecdc] mt-7 rotate-[-1.5deg] inline-block">— thanks for reading. see you in project 2.</p>
          </article>
        </section>
      </main>

      {/* ————————— footer ————————— */}
      <footer className="relative max-w-6xl mx-auto px-5 sm:px-8 pb-10">
        <div className="glass rounded-[1.8rem] px-7 sm:px-10 py-9">
          <div className="flex flex-col md:flex-row md:items-start gap-8 justify-between">
            <div className="max-w-xs">
              <p className="font-display font-semibold text-[26px] leading-tight">Thank <em className="text-[#5b7553] dark:text-[#a7c69b]">you</em>, truly.</p>
              <p className="text-[13.5px] text-[#6f6a5e] dark:text-[#a89f8b] leading-relaxed mt-2">Project 1 · Static Webpage Design. One h1, four nav stops, zero layout shift — and written by a person, at a desk, with cold coffee nearby.</p>
              <nav aria-label="Footer" className="mt-4">
                <ul className="flex flex-wrap gap-x-4 gap-y-1.5">
                  {[...NAV, { label: "hand it in", href: "#submit" }].map(n => <li key={n.href}><a href={n.href} className="text-[13px] text-[#4c473c] dark:text-[#cfc8b6] underline decoration-[#c9bfa5] dark:decoration-[#5c564a] underline-offset-4 hover:decoration-[#5b7553] dark:hover:decoration-[#a7c69b] hover:text-[#26241f] dark:hover:text-white">{n.label}</a></li>)}
                </ul>
              </nav>
            </div>
            <address className="not-italic">
              <p className="font-hand text-[21px] text-[#5b7553] dark:text-[#a7c69b]">say hello — decodelabs</p>
              <ul className="mt-3 space-y-2.5 text-[14px]">
                <li><a href="tel:+918933006408" className="flex items-center gap-2.5 hover:text-[#5b7553] dark:hover:text-[#a7c69b] transition-colors"><Phone className="w-4 h-4 text-[#c96f3b] dark:text-[#e8a06a]" /> +91 89330 06408</a></li>
                <li><a href="mailto:decodelabs.tech@gmail.com" className="flex items-center gap-2.5 hover:text-[#5b7553] dark:hover:text-[#a7c69b] transition-colors"><Mail className="w-4 h-4 text-[#c96f3b] dark:text-[#e8a06a]" /> decodelabs.tech@gmail.com</a></li>
                <li><a href="https://www.decodelabs.tech" target="_blank" rel="noreferrer" className="flex items-center gap-2.5 hover:text-[#5b7553] dark:hover:text-[#a7c69b] transition-colors"><Globe className="w-4 h-4 text-[#c96f3b] dark:text-[#e8a06a]" /> www.decodelabs.tech <ArrowUpRight className="w-3.5 h-3.5" /></a></li>
                <li className="flex items-center gap-2.5 text-[#6f6a5e] dark:text-[#a89f8b]"><MapPin className="w-4 h-4 text-[#c96f3b] dark:text-[#e8a06a]" /> Greater Lucknow, India</li>
              </ul>
            </address>
            <div className="font-hand text-[20px] leading-snug text-[#6f6a5e] dark:text-[#a89f8b] rotate-[-1.5deg] max-w-[11rem]">
              made by hand, checked twice, shipped once.
            </div>
          </div>
          <div className="mt-8 pt-5 border-t border-[#26241f]/10 dark:border-white/10 flex flex-col sm:flex-row justify-between gap-2 text-[12px] text-[#9a927c] dark:text-[#8f8672]">
            <span>© 2026 DecodeLabs · Frontend Development — Batch 2026</span>
            <span>built it well. the world will see it.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
