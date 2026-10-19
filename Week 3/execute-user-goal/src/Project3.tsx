import { useEffect, useState } from "react";
import {
  ArrowDown, ArrowRight, ArrowUpRight, BadgeCheck, Check, Copy, Globe, Lock,
  Mail, MapPin, Moon, Phone, Sun
} from "lucide-react";

/* ————— same desk, third week. the helpers come along again. ————— */
function Tape({ className = "" }: { className?: string }) {
  return <span aria-hidden="true" className={`tape ${className}`} />;
}

function Sticky({ tone = "yellow", children, className = "" }: { tone?: "yellow" | "pink" | "mint" | "sky"; children: React.ReactNode; className?: string }) {
  const tones = {
    yellow: "bg-[#fdf0a6]/85 dark:bg-[#8a6d23]/80",
    pink: "bg-[#ffd9cf]/85 dark:bg-[#8a4638]/80",
    mint: "bg-[#cfe7d2]/85 dark:bg-[#3f5a3c]/80",
    sky: "bg-[#d6d2f7]/85 dark:bg-[#3d3870]/80",
  }[tone];
  return (
    <div className={`${tones} backdrop-blur-sm px-4 pt-5 pb-4 shadow-[0_10px_24px_rgba(84,70,40,.16)] dark:shadow-[0_10px_24px_rgba(0,0,0,.45)] relative transition-colors duration-500 ${className}`}>
      <Tape className="absolute -top-3 left-1/2 -translate-x-1/2 -rotate-3 !w-16 !h-[20px]" />
      <div className="font-hand text-[19px] leading-[1.15] text-[#3d382c] dark:text-[#f7efdb]">{children}</div>
    </div>
  );
}

const NAV = [
  { label: "notes", href: "#notes" },
  { label: "the lab", href: "#lab" },
  { label: "case study", href: "#case" },
  { label: "checklist", href: "#checklist" },
];

const TREE = [
  { tag: "<html>", depth: 0, role: "the root", note: "Everything lives in here. The browser reads the document once and grows this tree in memory — then rebuilds it from scratch on every reload. Volatile: close the tab, it's gone." },
  { tag: "<head>", depth: 1, role: "the ID card", note: "Title, meta, week 2's viewport line. Not rendered — but nothing works properly without it." },
  { tag: "<body>", depth: 1, role: "the stage", note: "Everything you will ever see hangs off this node. JavaScript's favourite neighbourhood." },
  { tag: "<header>", depth: 2, role: "landmark", note: "Week 1's semantic landmark, still on duty. Semantic tags aren't decoration — they're how the tree introduces itself." },
  { tag: "<main>", depth: 2, role: "landmark", note: "The actual point of the page. One per document, same rule as the <h1> inside it." },
  { tag: "<h1>", depth: 3, role: "the topic", note: "Still exactly one. This week it reads 'then the page woke up.' The words under it are its children:" },
  { tag: "<button>", depth: 3, role: "the protagonist", note: "This week's main character. On its own it does nothing — wire an event listener to it and it becomes an input device for the whole IPO loop." },
  { tag: "#text", depth: 4, role: "leaf node", note: "Not an element at all — actual words. The DOM counts text as nodes too, which is how textContent can reach in and change what a paragraph says." },
];

const CHECKS = [
  { tag: "req. one", title: "Buttons or toggles", note: "The kit's first ask. There's a lamp switch, a hamburger, and a theme toggle on this page — all wired, all live. Poke each one in the lab." },
  { tag: "req. two", title: "Basic user interaction", note: "Clicks, hovers, key presses, window resizes — the receptor wall in Wednesday's note has been logging yours since you arrived." },
  { tag: "req. three", title: "Dynamic content updates", note: "The counter re-renders, the gallery swaps nodes, the shout box echoes. Content that changes without a page reload is the whole point of the week." },
  { tag: "state", title: "State in variables, UI follows", note: "count, isLit, isOpen, isDarkMode. Change the variable and the interface reflects it — never the other way round." },
  { tag: "safety", title: "Safe mutations only", note: "User text goes in as text, never as markup — try HTML in the shout box. Visual changes ride on classes; CSS keeps the paintbrush." },
  { tag: "standards", title: "Decoupled: js- hooks, is- states", note: "Logic hooks and visual states get different names, so restyling the page can't break the behaviour. Fragile is a choice; so is robust." },
];

const GALLERY = [
  { src: "https://images.pexels.com/photos/34803986/pexels-photo-34803986.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200", alt: "The desk on day three of week one, laptop open on code", cap: "node 1 — the desk where this notebook started." },
  { src: "https://images.pexels.com/photos/3262423/pexels-photo-3262423.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200", alt: "Laptop, tablet and phone together on one desk", cap: "node 2 — the audience. unimpressed by breakpoints." },
  { src: "https://images.pexels.com/photos/34803997/pexels-photo-34803997.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200", alt: "A laptop beside a mug that reads Make It Happen", cap: "node 3 — fuel. also, technically, a node." },
];

export default function Project3() {
  /* theme — same switch as weeks 1–2. (it's also this week's case study. more below.) */
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"));
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    try { localStorage.setItem("dl-theme", dark ? "dark" : "light"); } catch { /* private mode — fine */ }
  }, [dark]);

  /* the receptor wall */
  const [log, setLog] = useState<string[]>(["page loaded — a system trigger. it counts as an event.", "listening… go on, poke something."]);
  const pushLog = (m: string) => setLog(prev => [m, ...prev.filter(x => x !== m)].slice(0, 5));
  const [lastKey, setLastKey] = useState("—");
  const [winW, setWinW] = useState(() => window.innerWidth);
  const [resizes, setResizes] = useState(0);
  useEffect(() => {
    const onR = () => {
      setWinW(window.innerWidth);
      setResizes(r => r + 1);
      setLog(prev => [`↔ the window resized to ${window.innerWidth}px — nobody clicked. system triggers are events too.`, ...prev.filter(p => !p.startsWith("↔"))].slice(0, 5));
    };
    window.addEventListener("resize", onR);
    return () => window.removeEventListener("resize", onR);
  }, []);

  /* notes demos */
  const [treeSel, setTreeSel] = useState(6);
  const [varKind, setVarKind] = useState<"const" | "let" | "var">("const");
  const [constMsg, setConstMsg] = useState("const theme = document.querySelector(...) — a reference that never gets reassigned.");
  const [letN, setLetN] = useState(0);
  const [varMsg, setVarMsg] = useState("press run. watch it be weird.");
  const [shout, setShout] = useState("");

  /* the lab */
  const [isLit, setIsLit] = useState(true);
  const [count, setCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [photo, setPhoto] = useState(0);
  const [labLog, setLabLog] = useState("the lab is idle. every machine below is one IPO loop wearing a different hat.");

  /* case study mini */
  const [miniDark, setMiniDark] = useState(false);

  /* checklist */
  const [checked, setChecked] = useState([true, true, true, false, false, false]);
  const done = checked.filter(Boolean).length;
  const pct = Math.round((done / CHECKS.length) * 100);
  const unlocked = done === CHECKS.length;

  /* submission note machine, week 3 */
  const [subName, setSubName] = useState("");
  const [subDemo, setSubDemo] = useState("");
  const [subRepo, setSubRepo] = useState("");
  const [subLearned, setSubLearned] = useState("");
  const [noteCopied, setNoteCopied] = useState(false);
  const note = [
    "Hi team — submitting Project 3: Interactive Web Elements.",
    "",
    `Name: ${subName || "…"} · Batch 2026, Frontend Development`,
    `Live page: ${subDemo || "…"}`,
    `Code: ${subRepo || "…"}`,
    "",
    "What I built: a page that reacts — event listeners for clicks, keys, hovers and resizes; state held in variables (const by default, let when it moves) with the UI re-rendering from it; the DOM updated safely as text, never injected markup; and visual state changes handed to CSS classes. Buttons, toggles and dynamic content throughout, hand-wired.",
    `One thing I learned: ${subLearned || "every interaction is an IPO loop — an event comes in, logic decides, the DOM shows it."}`,
    `Checklist: ${done}/6 verified${unlocked ? " ✓" : ""} · Same repo as Projects 1–2; this is the week-3 commit.`,
  ].join("\n");
  const copyNote = async () => {
    try { await navigator.clipboard.writeText(note); } catch { /* fine */ }
    setNoteCopied(true); setTimeout(() => setNoteCopied(false), 1600);
  };
  const inputCls = "mt-1 w-full rounded-2xl bg-white/60 dark:bg-white/10 border border-white/80 dark:border-white/15 px-4 py-2.5 text-[14px] placeholder:text-[#9a927c] dark:placeholder:text-[#7d7663] focus:outline-none focus:ring-2 focus:ring-[#5b54a6]/50 dark:focus:ring-[#a8a3e8]/40 transition-shadow";

  return (
    <div className="relative min-h-screen overflow-x-clip text-[#26241f] dark:text-[#f2ecdc] transition-colors duration-500">
      {/* colour washes — this week, a little more electric */}
      <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-32 -left-32 w-[34rem] h-[34rem] rounded-full bg-[#c9c3f2] dark:bg-[#35306e] opacity-60 blur-3xl transition-colors duration-700" />
        <div className="absolute top-[22%] -right-40 w-[38rem] h-[38rem] rounded-full bg-[#b9dcbc] dark:bg-[#2f4a2c] opacity-55 blur-3xl transition-colors duration-700" />
        <div className="absolute top-[55%] -left-48 w-[36rem] h-[36rem] rounded-full bg-[#f6cf9f] dark:bg-[#5f4220] opacity-50 blur-3xl transition-colors duration-700" />
        <div className="absolute -bottom-40 right-[8%] w-[32rem] h-[32rem] rounded-full bg-[#f2c4b8] dark:bg-[#5a3226] opacity-50 dark:opacity-50 blur-3xl transition-colors duration-700" />
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
          <button onClick={() => { setDark(v => !v); pushLog("the theme toggle — that click was an INPUT. somewhere below, it gets a whole case study."); }} aria-pressed={dark} aria-label={dark ? "Switch to light mode" : "Switch to dark mode"} title={dark ? "lights on" : "lights out"} className="glass-soft shrink-0 inline-flex items-center gap-1.5 rounded-full px-2.5 sm:pr-3.5 py-2 hover:-translate-y-px transition-transform">
            {dark ? <Sun className="w-4 h-4 text-[#e8a06a]" /> : <Moon className="w-4 h-4 text-[#5b54a6]" />}
            <span className="font-hand text-[17px] leading-none hidden sm:block">{dark ? "lights on" : "lights out"}</span>
          </button>
          <span className={`hidden sm:inline-flex items-center gap-1.5 shrink-0 text-[12px] font-medium rounded-full pl-2.5 pr-3 py-1.5 transition-colors ${unlocked ? "bg-[#5b7553] dark:bg-[#46603f] text-white" : "bg-white/60 dark:bg-white/10 border border-white/80 dark:border-white/15"}`}>
            {unlocked ? <BadgeCheck className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
            {unlocked ? "badge no. 3" : `${done}/6 checks`}
          </span>
          <a href="?week=2" className="shrink-0 bg-[#26241f] dark:bg-[#f2ecdc] text-white dark:text-[#26241f] text-[13px] font-medium rounded-full px-4 py-2 hover:bg-[#5b54a6] dark:hover:bg-[#a8a3e8] hover:text-white dark:hover:text-[#26241f] transition-colors">← week 2</a>
        </div>
      </header>

      <main id="main">
        {/* ————————— hero ————————— */}
        <section id="top" className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-32 sm:pt-40 pb-16 sm:pb-24">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-6 items-start">
            <div className="lg:col-span-7 relative">
              <p className="font-hand text-[24px] text-[#5b54a6] dark:text-[#a8a3e8] -rotate-2 inline-block">week three — project 3: interactive web elements</p>
              <h1 className="font-display font-semibold leading-[1.02] tracking-tight text-[clamp(2.7rem,6.5vw,4.9rem)] mt-2">
                then the page<br />
                <em className="hl not-italic font-semibold">woke up</em>.
              </h1>
              <p className="mt-6 text-[16.5px] leading-relaxed text-[#4c473c] dark:text-[#cfc8b6] max-w-xl">
                Week 1 gave the page bones — HTML, the scaffolding. Week 2 gave it skin that
                pours into any screen. This week it grew a <strong className="text-[#26241f] dark:text-[#f2ecdc] font-semibold">nervous system</strong>:
                JavaScript, listening for clicks, keys and hovers, keeping state in its head,
                and moving the page in response. Not decoration — reaction.
              </p>
              <p className="mt-4 text-[16.5px] leading-relaxed text-[#4c473c] dark:text-[#cfc8b6] max-w-xl">
                Fair warning: this page has been listening since you arrived. It noticed the
                theme toggle. It will notice the scrolling, too — politely.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a href="#lab" className="inline-flex items-center gap-2 bg-[#26241f] dark:bg-[#f2ecdc] text-white dark:text-[#26241f] rounded-full pl-6 pr-5 py-3.5 text-[14.5px] font-medium shadow-[0_12px_28px_rgba(38,36,31,.25)] dark:shadow-[0_12px_28px_rgba(0,0,0,.5)] hover:bg-[#5b54a6] dark:hover:bg-[#a8a3e8] hover:text-white dark:hover:text-[#26241f] hover:-translate-y-0.5 transition-all">
                  Poke the machines <ArrowDown className="w-4 h-4" />
                </a>
                <a href="#notes" className="glass inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-[14.5px] font-medium hover:-translate-y-0.5 transition-transform">
                  Read the week's notes
                </a>
              </div>

              <dl className="mt-10 flex flex-wrap gap-2.5">
                {[["IPO", "input → process → output, always"], ["∞", "patience of an event listener"], ["0", "innerHTML with your words in it"]].map(([v, l]) => (
                  <div key={l} className="glass-soft rounded-2xl px-4 py-3 flex items-baseline gap-2">
                    <dt className="sr-only">{l}</dt>
                    <dd className="font-display font-semibold text-[20px] leading-none">{v}</dd>
                    <dd className="text-[12px] text-[#6f6a5e] dark:text-[#a89f8b]">{l}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-9 glass-soft rounded-2xl px-5 py-4 max-w-md rotate-[-0.4deg]">
                <p className="font-hand text-[19px] text-[#6f6a5e] dark:text-[#a89f8b]">the anatomy, as the kit tells it —</p>
                <ul className="mt-2.5 space-y-1.5 text-[13.5px]">
                  <li><strong className="font-display font-semibold">HTML — the bones.</strong> <span className="text-[#4c473c] dark:text-[#cfc8b6]">week 1: structure that means something.</span></li>
                  <li><strong className="font-display font-semibold">CSS — the skin.</strong> <span className="text-[#4c473c] dark:text-[#cfc8b6]">week 2: presentation that adapts.</span></li>
                  <li><strong className="font-display font-semibold">JavaScript — the nerves.</strong> <span className="text-[#4c473c] dark:text-[#cfc8b6]">this week: signals in, decisions made, movement out.</span></li>
                </ul>
              </div>
            </div>

            {/* polaroids */}
            <div className="lg:col-span-5 relative mx-auto w-full max-w-md lg:max-w-none pt-4">
              <figure className="polaroid relative rotate-2 rounded-[4px] p-3 pb-4 z-10">
                <Tape className="absolute -top-3 left-1/2 -translate-x-1/2 -rotate-2 z-20" />
                <img
                  src="https://images.pexels.com/photos/34803994/pexels-photo-34803994.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200"
                  width={1200} height={627}
                  alt="The desk late at night, laptop glowing with code — where the first event listener got attached"
                  className="w-full aspect-[1200/627] object-cover rounded-[2px] dark:brightness-[0.94]"
                />
                <figcaption className="font-hand text-[21px] text-[#4c473c] pt-3 px-1 flex items-end justify-between gap-3">
                  <span>the desk, 11pm. something just clicked. literally.</span>
                  <span className="font-mono text-[9.5px] text-[#9a927c] whitespace-nowrap pb-1">1200 × 627 · webp</span>
                </figcaption>
              </figure>

              <figure className="polaroid absolute -bottom-16 -left-2 sm:-left-8 w-40 sm:w-48 -rotate-6 rounded-[4px] p-2 pb-2.5 z-20 hidden sm:block">
                <img
                  src="https://images.pexels.com/photos/34803997/pexels-photo-34803997.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200"
                  width={1200} height={627} loading="lazy"
                  alt="A laptop with a mug beside it that reads Make It Happen"
                  className="w-full aspect-[4/3] object-cover rounded-[2px] dark:brightness-[0.94]"
                />
                <figcaption className="font-hand text-[17px] leading-none text-[#4c473c] pt-2 px-0.5">the mug. it knew all along.</figcaption>
              </figure>

              <Sticky tone="sky" className="absolute -bottom-10 right-0 sm:-right-3 w-52 rotate-3 z-30">
                every click on this page runs the same tiny loop: <span className="underline decoration-wavy decoration-[#5b54a6] dark:decoration-[#a8a3e8] underline-offset-2">in → decide → show.</span> once you see it, you can't unsee it.
              </Sticky>
            </div>
          </div>
        </section>

        {/* ————————— field notes, week 3 ————————— */}
        <section id="notes" aria-labelledby="notes-title" className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-20 sm:pt-28 pb-8 scroll-mt-28">
          <p className="font-hand text-[24px] text-[#5b7553] dark:text-[#a7c69b] rotate-[-1.5deg] inline-block">field notes, week three</p>
          <h2 id="notes-title" className="font-display font-semibold tracking-tight leading-[1.05] text-[clamp(2rem,4.5vw,3.2rem)] mt-1.5">
            Five days of teaching<br className="hidden sm:block" /> a page to listen
          </h2>

          <div className="relative mt-12">
            <span className="absolute left-[7px] sm:left-[9px] top-2 bottom-2 border-l-2 border-dashed border-[#26241f]/20 dark:border-white/15" aria-hidden="true" />

            {/* MON — the DOM tree */}
            <article className="relative pl-10 sm:pl-14 pb-12">
              <span className="absolute left-0 top-2 w-[15px] h-[15px] sm:w-[19px] sm:h-[19px] rounded-full bg-[#f7f2e7] dark:bg-[#171410] border-[3px] border-[#5b54a6] dark:border-[#a8a3e8] transition-colors duration-500" aria-hidden="true" />
              <p className="font-mono text-[11px] tracking-wide text-[#6f6a5e] dark:text-[#a89f8b]">MON — the page, as the browser keeps it</p>
              <div className="glass rounded-[1.6rem] rounded-tl-md p-6 sm:p-8 mt-3 max-w-3xl -rotate-[0.4deg]">
                <h3 className="font-display font-semibold text-[24px] leading-snug">The DOM: a family tree that forgets.</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-[#4c473c] dark:text-[#cfc8b6]">
                  The browser doesn't keep your HTML file lying around. It translates it into a
                  living tree of objects — the Document Object Model — and JavaScript talks to
                  the <em>tree</em>, not the text. It lives entirely in memory: reload the page
                  and it's rebuilt from scratch. Click a relative:
                </p>
                <div className="mt-5 space-y-1.5">
                  {TREE.map((n, i) => (
                    <button key={n.tag} onClick={() => { setTreeSel(i); pushLog(`you clicked ${n.tag} in the tree — same reflex the lab machines use.`); }} aria-pressed={treeSel === i} style={{ marginLeft: n.depth * 20 }} className={`block text-left rounded-xl px-3.5 py-2 transition-all ${treeSel === i ? "bg-[#5b54a6] dark:bg-[#a8a3e8] text-white dark:text-[#26241f] shadow-[0_8px_20px_rgba(91,84,166,.35)]" : "glass-soft hover:-translate-y-px"}`}>
                      <code className="font-mono text-[12.5px] font-medium">{n.tag}</code>
                      <span className={`font-hand text-[16px] ml-2 ${treeSel === i ? "text-white/75 dark:text-[#26241f]/60" : "text-[#9a927c] dark:text-[#8f8672]"}`}>{n.role}</span>
                    </button>
                  ))}
                </div>
                <p className="text-[14px] leading-relaxed text-[#4c473c] dark:text-[#cfc8b6] mt-4" aria-live="polite">
                  <strong className="text-[#26241f] dark:text-[#f2ecdc]">{TREE[treeSel].tag}</strong> — {TREE[treeSel].note}
                </p>
                <p className="font-hand text-[20px] text-[#5b54a6] dark:text-[#a8a3e8] mt-3 rotate-[-1deg] inline-block">querySelector is just asking the tree for directions.</p>
              </div>
            </article>

            {/* TUE — receptors */}
            <article className="relative pl-10 sm:pl-14 pb-12">
              <span className="absolute left-0 top-2 w-[15px] h-[15px] sm:w-[19px] sm:h-[19px] rounded-full bg-[#f7f2e7] dark:bg-[#171410] border-[3px] border-[#c05a3a] dark:border-[#e08a6a] transition-colors duration-500" aria-hidden="true" />
              <p className="font-mono text-[11px] tracking-wide text-[#6f6a5e] dark:text-[#a89f8b]">TUE — phase 1: sensory receptors</p>
              <div className="glass rounded-[1.6rem] rounded-tl-md p-6 sm:p-8 mt-3 max-w-3xl rotate-[0.5deg] sm:ml-10">
                <h3 className="font-display font-semibold text-[24px] leading-snug">The browser never stops watching.</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-[#4c473c] dark:text-[#cfc8b6]">
                  Constant vigilance is the job description. Three kinds of stimuli pour in —
                  and this panel is wired to all of them, live:
                </p>
                <div className="grid sm:grid-cols-3 gap-3 mt-6">
                  <div
                    role="button" tabIndex={0} aria-label="Pointer playground. Hover, click or double-click it."
                    onMouseEnter={() => pushLog("hover — you didn't even click. still an event; the pad felt it.")}
                    onClick={() => pushLog("click — the classic. down, up, one event. the lab runs on these.")}
                    onDoubleClick={() => pushLog("double-click — two clicks wearing a trench coat. the browser counts it separately.")}
                    className="glass-soft rounded-2xl p-4 cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c05a3a]"
                  >
                    <p className="font-display font-semibold text-[15.5px]">🖱 your hand</p>
                    <p className="text-[12px] text-[#6f6a5e] dark:text-[#a89f8b] leading-relaxed mt-1">hover, click, double-click this pad. it's very sensitive.</p>
                    <p className="font-mono text-[9.5px] text-[#9a927c] dark:text-[#8f8672] mt-2.5">mouseenter · click · dblclick</p>
                  </div>
                  <div
                    role="button" tabIndex={0} aria-label="Keyboard playground. Click to focus, then type."
                    onFocus={() => pushLog("focus — the keyboard pad has the floor. type something.")}
                    onBlur={() => pushLog("blur — focus left the pad. focus and blur are a pair.")}
                    onKeyDown={e => { if (e.key === " ") e.preventDefault(); setLastKey(e.key); pushLog(`keydown: “${e.key}” — every keypress is an event with a name tag.`); }}
                    className="glass-soft rounded-2xl p-4 cursor-text select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c05a3a]"
                  >
                    <p className="font-display font-semibold text-[15.5px]">⌨ your keyboard</p>
                    <p className="text-[12px] text-[#6f6a5e] dark:text-[#a89f8b] leading-relaxed mt-1">click here, then type. last key seen:</p>
                    <p className="font-mono text-[15px] font-medium mt-1.5" aria-live="polite">{lastKey}</p>
                    <p className="font-mono text-[9.5px] text-[#9a927c] dark:text-[#8f8672] mt-2">focus · blur · keydown</p>
                  </div>
                  <div className="glass-soft rounded-2xl p-4">
                    <p className="font-display font-semibold text-[15.5px]">⚙ the system itself</p>
                    <p className="text-[12px] text-[#6f6a5e] dark:text-[#a89f8b] leading-relaxed mt-1">no hands required. this window is currently <strong className="text-[#26241f] dark:text-[#f2ecdc]">{winW}px</strong> wide, and you've resized it <strong className="text-[#26241f] dark:text-[#f2ecdc]">{resizes}×</strong> since arriving.</p>
                    <p className="font-mono text-[9.5px] text-[#9a927c] dark:text-[#8f8672] mt-2.5">load · resize · error</p>
                  </div>
                </div>
                <div className="glass-dark rounded-2xl mt-5 p-4 sm:p-5">
                  <p className="font-hand text-[18px] text-[#ffb08a]">the nerve log — latest first</p>
                  <ul className="mt-2 space-y-1.5" aria-live="polite">
                    {log.map((l, i) => (
                      <li key={l} className={`font-mono text-[11px] leading-relaxed ${i === 0 ? "text-[#cfe3c8]" : "text-white/45"}`}>{i === 0 ? "▸ " : "· "}{l}</li>
                    ))}
                  </ul>
                </div>
                <p className="text-[13.5px] text-[#6f6a5e] dark:text-[#a89f8b] leading-relaxed mt-4">Wiring one up is three moves: <strong className="text-[#26241f] dark:text-[#f2ecdc]">find the node</strong>, <strong className="text-[#26241f] dark:text-[#f2ecdc]">name the action</strong>, <strong className="text-[#26241f] dark:text-[#f2ecdc]">attach the function</strong>.</p>
                <pre className="glass-dark text-[#cfe3c8] rounded-2xl mt-3 p-4 font-mono text-[11px] leading-relaxed overflow-x-auto whitespace-pre">{`const pad = document.querySelector('.js-pad');  // 1 · target the node
pad.addEventListener('click', celebrate);          // 2 · listen for the action
function celebrate() { /* 3 · runs when it happens */ }`}</pre>
              </div>
            </article>

            {/* WED — variables */}
            <article className="relative pl-10 sm:pl-14 pb-12">
              <span className="absolute left-0 top-2 w-[15px] h-[15px] sm:w-[19px] sm:h-[19px] rounded-full bg-[#f7f2e7] dark:bg-[#171410] border-[3px] border-[#4a7ca8] dark:border-[#8fc0ea] transition-colors duration-500" aria-hidden="true" />
              <p className="font-mono text-[11px] tracking-wide text-[#6f6a5e] dark:text-[#a89f8b]">WED — phase 2 needs memory, memory needs manners</p>
              <div className="glass ruled rounded-[1.6rem] rounded-tl-md p-6 sm:p-8 mt-3 max-w-3xl -rotate-[0.3deg]">
                <h3 className="font-display font-semibold text-[24px] leading-snug">const by default. let when it moves. var, politely, no.</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-[#4c473c] dark:text-[#cfc8b6]">
                  State — the data that decides what the user sees — lives in variables. Which
                  word you declare them with is a promise. Pick a promise and try to break it:
                </p>
                <div className="flex flex-wrap gap-2 mt-5" role="group" aria-label="Variable declarations">
                  {(["const", "let", "var"] as const).map(k => (
                    <button key={k} onClick={() => setVarKind(k)} aria-pressed={varKind === k} className={`rounded-full px-4 py-2 font-mono text-[13px] transition-colors ${varKind === k ? "bg-[#26241f] dark:bg-[#f2ecdc] text-white dark:text-[#26241f]" : "glass-soft hover:bg-white/80 dark:hover:bg-white/15"}`}>{k}</button>
                  ))}
                </div>
                <div className="mt-4" aria-live="polite">
                  {varKind === "const" && (
                    <div className="glass-soft rounded-2xl p-4">
                      <p className="font-mono text-[12px] leading-relaxed">const themeBtn = pick('.js-theme'); <span className="text-[#6f6a5e] dark:text-[#a89f8b]">// will never point elsewhere</span></p>
                      <button onClick={() => setConstMsg("✗ TypeError: Assignment to constant variable. const keeps its word — that's not a bug, it's the feature. use const unless something must change.")} className="mt-3 rounded-full bg-[#b3546e] text-white px-4 py-2 text-[12.5px] font-medium hover:opacity-90 transition-opacity">themeBtn = somethingElse</button>
                      <p className="text-[13px] leading-relaxed text-[#4c473c] dark:text-[#cfc8b6] mt-3">{constMsg}</p>
                    </div>
                  )}
                  {varKind === "let" && (
                    <div className="glass-soft rounded-2xl p-4">
                      <p className="font-mono text-[12px] leading-relaxed">let taps = <span className="font-semibold">{letN}</span>; <span className="text-[#6f6a5e] dark:text-[#a89f8b]">// declared knowing it will move</span></p>
                      <button onClick={() => setLetN(n => n + 1)} className="mt-3 rounded-full bg-[#4a7ca8] text-white px-4 py-2 text-[12.5px] font-medium hover:opacity-90 transition-opacity">taps++</button>
                      <span className="font-hand text-[18px] text-[#6f6a5e] dark:text-[#a89f8b] ml-3">✓ reassigned happily. counters, scores, loop indexes — let territory.</span>
                    </div>
                  )}
                  {varKind === "var" && (
                    <div className="glass-soft rounded-2xl p-4">
                      <p className="font-mono text-[12px] leading-relaxed">var score = 10; <span className="text-[#6f6a5e] dark:text-[#a89f8b]">// legacy. function-scoped. hoisted.</span></p>
                      <button onClick={() => setVarMsg("run it in your head: before that line even executes, 'score' already exists (hoisted) — as undefined. it also leaks out of blocks and pollutes the global scope. it works, mostly, which is the worst kind of broken. we don't.")} className="mt-3 rounded-full glass-soft px-4 py-2 text-[12.5px] font-medium hover:bg-white/80 dark:hover:bg-white/15 transition-colors">run the var demo</button>
                      <p className="text-[13px] leading-relaxed text-[#4c473c] dark:text-[#cfc8b6] mt-3">{varMsg}</p>
                    </div>
                  )}
                </div>
                <div className="mt-5 overflow-x-auto">
                  <table className="w-full text-left text-[12.5px] min-w-[420px]">
                    <caption className="sr-only">const, let and var compared: reassignment, scope, and modern usage</caption>
                    <thead>
                      <tr className="font-mono text-[10.5px] uppercase tracking-wide text-[#6f6a5e] dark:text-[#a89f8b]">
                        <th scope="col" className="py-2 pr-3 font-medium">declaration</th><th scope="col" className="py-2 pr-3 font-medium">reassign?</th><th scope="col" className="py-2 pr-3 font-medium">scope</th><th scope="col" className="py-2 font-medium">use it?</th>
                      </tr>
                    </thead>
                    <tbody className="[&_td]:py-2 [&_td]:pr-3 [&_tr]:border-t [&_tr]:border-dashed [&_tr]:border-[#26241f]/15 dark:[&_tr]:border-white/10">
                      <tr><td className="font-mono font-medium">const</td><td>no</td><td>block</td><td>✓ default</td></tr>
                      <tr><td className="font-mono font-medium">let</td><td>yes</td><td>block</td><td>✓ when it moves</td></tr>
                      <tr><td className="font-mono font-medium">var</td><td>yes</td><td>function</td><td>✗ avoid</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </article>

            {/* THU — mutation safety */}
            <article className="relative pl-10 sm:pl-14 pb-12">
              <span className="absolute left-0 top-2 w-[15px] h-[15px] sm:w-[19px] sm:h-[19px] rounded-full bg-[#f7f2e7] dark:bg-[#171410] border-[3px] border-[#5b7553] dark:border-[#a7c69b] transition-colors duration-500" aria-hidden="true" />
              <p className="font-mono text-[11px] tracking-wide text-[#6f6a5e] dark:text-[#a89f8b]">THU — phase 3: putting words back into the page, safely</p>
              <div className="glass rounded-[1.6rem] rounded-tl-md p-6 sm:p-8 mt-3 max-w-3xl rotate-[0.4deg] sm:ml-6">
                <h3 className="font-display font-semibold text-[24px] leading-snug">Your input is data. It never becomes code.</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-[#4c473c] dark:text-[#cfc8b6]">
                  The dangerous shortcut is <code className="font-mono text-[13px] bg-white/70 dark:bg-white/10 px-1.5 py-0.5 rounded">innerHTML</code>:
                  hand it a stranger's text and it will <em>run</em> parts of it — that's how
                  cross-site scripting happens. The professional habit is{" "}
                  <code className="font-mono text-[13px] bg-white/70 dark:bg-white/10 px-1.5 py-0.5 rounded">textContent</code>:
                  words go in as words. Try to break this box:
                </p>
                <label className="block mt-5">
                  <span className="font-hand text-[18px] leading-none text-[#6f6a5e] dark:text-[#a89f8b]">type something rude, like &lt;b&gt;hello&lt;/b&gt;</span>
                  <input value={shout} onChange={e => setShout(e.target.value)} placeholder="go on. be HTML at me." className="mt-1.5 w-full rounded-2xl bg-white/60 dark:bg-white/10 border border-white/80 dark:border-white/15 px-4 py-3 text-[14.5px] placeholder:text-[#9a927c] dark:placeholder:text-[#7d7663] focus:outline-none focus:ring-2 focus:ring-[#5b7553]/50 dark:focus:ring-[#a7c69b]/40 transition-shadow" aria-describedby="shout-note" />
                </label>
                <div className="glass-soft rounded-2xl px-5 py-4 mt-4 min-h-[64px] flex items-center">
                  <p className="font-display font-semibold text-[20px] leading-snug break-words" aria-live="polite">{shout || <span className="text-[#9a927c] dark:text-[#8f8672] font-hand font-medium text-[20px]">the page will repeat you here, exactly as words…</span>}</p>
                </div>
                <p id="shout-note" className="text-[13px] text-[#6f6a5e] dark:text-[#a89f8b] leading-relaxed mt-3">See the tags sitting there, inert? That's the whole trick — what's typed is <em>data</em>. Under the hood: <code className="font-mono text-[12px] bg-white/70 dark:bg-white/10 px-1.5 py-0.5 rounded">display.textContent = yourWords</code>. Boring, and that's why it works.</p>
              </div>
            </article>

            {/* FRI — functions */}
            <article className="relative pl-10 sm:pl-14">
              <span className="absolute left-0 top-2 w-[15px] h-[15px] sm:w-[19px] sm:h-[19px] rounded-full bg-[#f7f2e7] dark:bg-[#171410] border-[3px] border-[#b3546e] dark:border-[#e08ca4] transition-colors duration-500" aria-hidden="true" />
              <p className="font-mono text-[11px] tracking-wide text-[#6f6a5e] dark:text-[#a89f8b]">FRI — the gear in the middle</p>
              <div className="glass rounded-[1.6rem] rounded-tl-md p-6 sm:p-8 mt-3 max-w-3xl -rotate-[0.3deg]">
                <h3 className="font-display font-semibold text-[24px] leading-snug">A function is a decision with a name.</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-[#4c473c] dark:text-[#cfc8b6]">
                  Everything in the lab below is the same three beats: an event <em>triggers</em>,
                  the listener <em>invokes</em> a function, the function reads state, decides,
                  and <em>actuates</em> — changes the DOM. The house rule from the kit: keep them
                  small and single-purpose. One gear, one job.
                </p>
                <ol className="flex flex-wrap items-center gap-2 mt-5 text-[13px] font-medium">
                  {["trigger", "invocation", "actuation"].map((s, i) => (
                    <li key={s} className="flex items-center gap-2">
                      <span className="glass-soft rounded-full px-4 py-2 capitalize">{i + 1}. {s}</span>
                      {i < 2 && <ArrowRight className="w-4 h-4 text-[#9a927c] dark:text-[#8f8672]" aria-hidden="true" />}
                    </li>
                  ))}
                </ol>
                <p className="font-hand text-[20px] text-[#b3546e] dark:text-[#e08ca4] mt-4 rotate-[-1deg] inline-block">the lab is just functions with a GUI. ↓</p>
              </div>
            </article>
          </div>
        </section>

        {/* ————————— THE LAB ————————— */}
        <section id="lab" aria-labelledby="lab-title" className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-20 sm:pt-24 pb-8 scroll-mt-28">
          <p className="font-hand text-[24px] text-[#5b54a6] dark:text-[#a8a3e8] rotate-[-1.5deg] inline-block">four small machines</p>
          <h2 id="lab-title" className="font-display font-semibold tracking-tight leading-[1.05] text-[clamp(2rem,4.5vw,3.2rem)] mt-1.5">The nerve lab</h2>
          <p className="mt-4 text-[15.5px] leading-relaxed text-[#4c473c] dark:text-[#cfc8b6] max-w-2xl">
            The kit's three asks — buttons or toggles, basic interaction, dynamic content —
            as four machines you can run. Every one of them is the IPO loop; the ticker keeps
            the receipts.
          </p>

          <div className="glass-dark rounded-full mt-8 px-5 py-3.5 flex items-center gap-3 overflow-hidden">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" aria-hidden="true" />
            <p className="font-mono text-[11.5px] text-[#cfe3c8] truncate" aria-live="polite">{labLog}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-6 items-start">
            {/* machine 1 — the lamp */}
            <article className="glass rounded-[1.8rem] p-6 sm:p-7 -rotate-[0.3deg]">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-display font-semibold text-[19px] leading-snug">Machine 1 · the lamp</h3>
                <span className="font-mono text-[9.5px] text-[#9a927c] dark:text-[#8f8672] shrink-0 pt-1">js-lamp · click</span>
              </div>
              <div className={`rounded-2xl mt-4 h-40 relative overflow-hidden transition-all duration-500 ${isLit ? "bg-gradient-to-b from-[#fdf3d0] to-[#f7e3a1] dark:from-[#6d5b1e] dark:to-[#574714]" : "bg-gradient-to-b from-[#2c3242] to-[#1c2029]"}`} role="img" aria-label={isLit ? "A warmly lit little room" : "The little room, lights off"}>
                <span className={`absolute left-1/2 top-5 -translate-x-1/2 w-14 h-14 rounded-full transition-all duration-500 ${isLit ? "bg-[#ffd94d] shadow-[0_0_50px_18px_rgba(255,210,80,.65)]" : "bg-[#454c5e] shadow-none"}`} aria-hidden="true" />
                <span className="absolute left-1/2 top-0 -translate-x-1/2 w-px h-5 bg-[#26241f]/30 dark:bg-white/30" aria-hidden="true" />
                <span className="absolute bottom-0 inset-x-0 h-8 bg-[#26241f]/10 dark:bg-black/30" aria-hidden="true" />
                <span className={`absolute bottom-9 inset-x-0 text-center font-hand text-[19px] transition-colors duration-500 ${isLit ? "text-[#7a5b12]" : "text-white/60"}`} aria-live="polite">{isLit ? "the room is lit." : "the room is dark. cosier, honestly."}</span>
              </div>
              <div className="flex items-center gap-3 mt-4 flex-wrap">
                <button role="switch" aria-checked={isLit} onClick={() => { setIsLit(v => !v); setLabLog(`INPUT: the lamp switch → PROCESS: isLit flips to ${!isLit} → OUTPUT: the room repaints (CSS does the painting).`); }} className={`relative w-14 h-8 rounded-full transition-colors duration-300 shrink-0 ${isLit ? "bg-[#e8a33d]" : "bg-[#4c473c] dark:bg-white/20"}`} aria-label="Toggle the lamp">
                  <span className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow transition-all duration-300 ${isLit ? "left-7" : "left-1"}`} aria-hidden="true" />
                </button>
                <p className="font-mono text-[10.5px] text-[#6f6a5e] dark:text-[#a89f8b]">room.classList.toggle(<span className="text-[#5b54a6] dark:text-[#a8a3e8]">'is-lit'</span>)</p>
              </div>
              <p className="text-[13px] text-[#6f6a5e] dark:text-[#a89f8b] leading-relaxed mt-3">JavaScript doesn't paint the room. It flips the state and toggles the class — CSS handles the visuals, including the fade. Behaviour and looks, separate jobs.</p>
            </article>

            {/* machine 2 — the counter */}
            <article className="glass rounded-[1.8rem] p-6 sm:p-7 rotate-[0.3deg]">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-display font-semibold text-[19px] leading-snug">Machine 2 · the counter</h3>
                <span className="font-mono text-[9.5px] text-[#9a927c] dark:text-[#8f8672] shrink-0 pt-1">js-count · click</span>
              </div>
              <div className="flex items-center gap-5 mt-5">
                <span className="font-display font-semibold leading-none text-[76px] w-[2.2ch] text-center" aria-live="polite">{count}</span>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <button onClick={() => { setCount(c => c + 1); setLabLog(`INPUT: “+1” clicked → PROCESS: count ${count} → ${count + 1}${count + 1 >= 10 ? " — the ≥ 10 branch wakes up" : ""} → OUTPUT: the number re-renders.`); }} className="w-12 h-12 rounded-full bg-[#26241f] dark:bg-[#f2ecdc] text-white dark:text-[#26241f] text-xl font-medium hover:bg-[#5b54a6] dark:hover:bg-[#a8a3e8] hover:text-white dark:hover:text-[#26241f] transition-colors" aria-label="Add one">+</button>
                    <button onClick={() => { setCount(c => Math.max(0, c - 1)); setLabLog(`INPUT: “−1” clicked → PROCESS: count ${count} → ${Math.max(0, count - 1)} (never below zero — a guard rail) → OUTPUT: re-render.`); }} className="w-12 h-12 rounded-full glass-soft text-xl font-medium hover:bg-white/80 dark:hover:bg-white/15 transition-colors" aria-label="Subtract one">−</button>
                    <button onClick={() => { setCount(0); setLabLog("INPUT: reset → PROCESS: count returns to 0 → OUTPUT: the loop starts over, unbothered."); }} className="h-12 rounded-full glass-soft px-4 text-[13px] font-medium hover:bg-white/80 dark:hover:bg-white/15 transition-colors">reset</button>
                  </div>
                  <p className="text-[12.5px] text-[#6f6a5e] dark:text-[#a89f8b]" aria-live="polite">{count >= 10 ? "≥ 10 — the branch from the kit's diagram. same gear, other road." : count === 0 ? "state: let count = 0. the gear is waiting." : `count is ${count} — still the quiet branch (< 10).`}</p>
                </div>
              </div>
              <p className="glass-dark text-[#cfe3c8] rounded-full mt-5 px-4 py-2.5 font-mono text-[10.5px] overflow-x-auto whitespace-nowrap">scoreDisplay.textContent = count; <span className="text-white/40">// the kit's example, verbatim in spirit</span></p>
              <p className="text-[13px] text-[#6f6a5e] dark:text-[#a89f8b] leading-relaxed mt-3">Note what didn't happen: no reload, no new page. One variable changed and exactly one number on screen followed it. That's state management with the training wheels visible.</p>
            </article>

            {/* machine 3 — the hamburger */}
            <article className="glass rounded-[1.8rem] p-6 sm:p-7 rotate-[0.3deg]">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-display font-semibold text-[19px] leading-snug">Machine 3 · the shapeshifter</h3>
                <span className="font-mono text-[9.5px] text-[#9a927c] dark:text-[#8f8672] shrink-0 pt-1">js-menu · click</span>
              </div>
              <div className="flex items-start gap-5 mt-5">
                <button onClick={() => { setMenuOpen(v => !v); setLabLog(`INPUT: the menu button → PROCESS: isOpen flips → OUTPUT: 'is-open' ${!menuOpen ? "added" : "removed"} — watch the icon morph; JS only flipped a class.`); }} aria-expanded={menuOpen} aria-label="Toggle the demo menu" className="w-14 h-14 shrink-0 rounded-2xl glass-soft grid place-items-center hover:bg-white/80 dark:hover:bg-white/15 transition-colors">
                  <span className="relative block w-6 h-4" aria-hidden="true">
                    <span className={`absolute left-0 w-6 h-[2.5px] rounded bg-current transition-all duration-300 ${menuOpen ? "top-[7px] rotate-45" : "top-0"}`} />
                    <span className={`absolute left-0 top-[7px] w-6 h-[2.5px] rounded bg-current transition-all duration-300 ${menuOpen ? "opacity-0 -translate-x-2" : ""}`} />
                    <span className={`absolute left-0 w-6 h-[2.5px] rounded bg-current transition-all duration-300 ${menuOpen ? "top-[7px] -rotate-45" : "top-[14px]"}`} />
                  </span>
                </button>
                <div className="min-w-0 flex-1">
                  <div className={`overflow-hidden transition-all duration-300 ${menuOpen ? "max-h-44 opacity-100" : "max-h-0 opacity-0"}`} aria-hidden={!menuOpen}>
                    <ul className="space-y-1 text-[14px] font-medium pb-1">
                      {["notes", "the lab", "case study", "checklist"].map(l => <li key={l}><span className="block rounded-xl px-3 py-2 glass-soft">{l}</span></li>)}
                    </ul>
                  </div>
                  {!menuOpen && <p className="text-[13px] text-[#6f6a5e] dark:text-[#a89f8b] leading-relaxed">closed. the icon is three lines and a promise.</p>}
                  <p className="font-mono text-[10.5px] text-[#6f6a5e] dark:text-[#a89f8b] mt-3">menu.classList.toggle(<span className="text-[#5b54a6] dark:text-[#a8a3e8]">'is-open'</span>)</p>
                </div>
              </div>
              <p className="text-[13px] text-[#6f6a5e] dark:text-[#a89f8b] leading-relaxed mt-3">From the kit's own slide: the hamburger and the X are the same element. One class changes; CSS transitions do the shapeshifting. Week 2's navigation grew up.</p>
            </article>

            {/* machine 4 — the gallery */}
            <article className="glass rounded-[1.8rem] p-6 sm:p-7 -rotate-[0.3deg]">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-display font-semibold text-[19px] leading-snug">Machine 4 · the gallery</h3>
                <span className="font-mono text-[9.5px] text-[#9a927c] dark:text-[#8f8672] shrink-0 pt-1">js-gallery · click</span>
              </div>
              <figure className="mt-4">
                <div className="rounded-2xl overflow-hidden border border-white/70 dark:border-white/15">
                  <img key={photo} src={GALLERY[photo].src} width={1200} height={627} loading="lazy" alt={GALLERY[photo].alt} className="w-full aspect-[16/8] object-cover dark:brightness-[0.94]" />
                </div>
                <figcaption className="flex items-baseline justify-between gap-3 mt-2.5">
                  <span className="font-hand text-[19px] text-[#6f6a5e] dark:text-[#a89f8b]" aria-live="polite">{GALLERY[photo].cap}</span>
                  <span className="font-mono text-[10px] text-[#9a927c] dark:text-[#8f8672] shrink-0">{photo + 1} / 3 in the DOM</span>
                </figcaption>
              </figure>
              <div className="flex items-center gap-2 mt-3.5" role="group" aria-label="Choose a photo">
                {GALLERY.map((g, i) => (
                  <button key={g.cap} onClick={() => { setPhoto(i); setLabLog(`INPUT: thumbnail ${i + 1} → PROCESS: index → ${i} → OUTPUT: a new <img> node takes the frame; the old one retires.`); }} aria-pressed={photo === i} aria-label={`Show photo ${i + 1}`} className={`flex-1 rounded-xl overflow-hidden border-2 transition-all ${photo === i ? "border-[#5b54a6] dark:border-[#a8a3e8] -translate-y-0.5" : "border-transparent opacity-60 hover:opacity-100"}`}>
                    <img src={g.src} width={1200} height={627} loading="lazy" alt="" className="w-full aspect-[16/7] object-cover" />
                  </button>
                ))}
              </div>
              <p className="text-[13px] text-[#6f6a5e] dark:text-[#a89f8b] leading-relaxed mt-3.5">In vanilla JS this is <code className="font-mono text-[12px] bg-white/70 dark:bg-white/10 px-1.5 py-0.5 rounded">document.createElement('img')</code> + <code className="font-mono text-[12px] bg-white/70 dark:bg-white/10 px-1.5 py-0.5 rounded">appendChild()</code>: build a node, attach it, retire the old. Data-driven interfaces are just this, at scale.</p>
            </article>
          </div>
        </section>

        {/* ————————— case study ————————— */}
        <section id="case" aria-labelledby="case-title" className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-20 sm:pt-24 pb-8 scroll-mt-28">
          <div className="grid lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-5">
              <p className="font-hand text-[24px] text-[#5b54a6] dark:text-[#a8a3e8] rotate-[-1.5deg] inline-block">case study — you've been using it for weeks</p>
              <h2 id="case-title" className="font-display font-semibold tracking-tight leading-[1.08] text-[clamp(2rem,4.5vw,3rem)] mt-1.5">
                The dark mode toggle, formally introduced
              </h2>
              <p className="mt-4 text-[15.5px] leading-relaxed text-[#4c473c] dark:text-[#cfc8b6]">
                The kit ends the week with the exact switch sitting in this page's nav. So
                here's its paperwork — the same three phases from the notes:
              </p>
              <ol className="mt-6 space-y-4">
                {[
                  ["INPUT", "#c05a3a", "You click the moon. An event fires on one specific node — the button — because a listener was attached to it back in week… well, the week you asked for dark mode."],
                  ["PROCESS", "#5b54a6", "The handler reads state (is it dark?), flips it, and writes the choice to localStorage — which is why your preference survived between last week and this one."],
                  ["OUTPUT", "#5b7553", "A class toggles on the root element. JavaScript paints nothing; ~200 CSS rules keyed off that one class repaint the entire page."],
                ].map(([t, c, d]) => (
                  <li key={t} className="flex gap-4">
                    <span className="font-mono text-[10px] font-bold tracking-widest text-white rounded-full px-2.5 py-1 h-fit shrink-0 mt-0.5" style={{ backgroundColor: c }}>{t}</span>
                    <p className="text-[14px] leading-relaxed text-[#4c473c] dark:text-[#cfc8b6]"><strong className="text-[#26241f] dark:text-[#f2ecdc]">{t === "INPUT" ? "The click." : t === "PROCESS" ? "The decision." : "The repaint."}</strong> {d}</p>
                  </li>
                ))}
              </ol>
              <p className="font-hand text-[20px] text-[#6f6a5e] dark:text-[#a89f8b] mt-6 rotate-[-1deg] inline-block">go on, flip the real one in the nav. you've earned the paperwork.</p>
            </div>

            <div className="lg:col-span-7 space-y-6">
              {/* mini live toggle */}
              <div className="glass rounded-[1.8rem] p-6 sm:p-7 rotate-[0.3deg] relative">
                <Tape className="absolute -top-3 left-10 -rotate-3" />
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <h3 className="font-display font-semibold text-[19px]">The toggle, in miniature</h3>
                  <span className="font-mono text-[9.5px] text-[#9a927c] dark:text-[#8f8672]">this one only flips its own card</span>
                </div>
                <div className={`rounded-2xl mt-4 p-5 transition-colors duration-500 ${miniDark ? "bg-[#1d1a26] text-[#ece8f7]" : "bg-[#fffdf6] text-[#33302a] border border-[#26241f]/10"}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-display font-semibold text-[15px]">a tiny page</span>
                    <button onClick={() => setMiniDark(v => !v)} aria-pressed={miniDark} aria-label="Flip the tiny page's theme" className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors ${miniDark ? "bg-white/15 text-white" : "bg-[#26241f] text-white"}`}>
                      {miniDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />} {miniDark ? "lights" : "dark"}
                    </button>
                  </div>
                  <p className={`text-[13px] leading-relaxed mt-3 transition-colors duration-500 ${miniDark ? "text-white/65" : "text-[#6f6a5e]"}`}>Same words. Same layout. One class flipped on the container, and every colour inside followed. Scale this card up to a whole website and you have this site's nav switch.</p>
                  <div className="flex gap-2 mt-4" aria-hidden="true">
                    <span className={`h-8 flex-1 rounded-lg transition-colors duration-500 ${miniDark ? "bg-[#35306e]" : "bg-[#d6d2f7]"}`} /><span className={`h-8 flex-1 rounded-lg transition-colors duration-500 ${miniDark ? "bg-[#3f5a3c]" : "bg-[#cfe7d2]"}`} /><span className={`h-8 flex-1 rounded-lg transition-colors duration-500 ${miniDark ? "bg-[#574714]" : "bg-[#fdf0a6]"}`} />
                  </div>
                </div>
                <p className="font-mono text-[10.5px] text-[#6f6a5e] dark:text-[#a89f8b] mt-4 overflow-x-auto whitespace-nowrap">document.documentElement.classList.toggle('dark'); localStorage.setItem('dl-theme', …)</p>
              </div>

              {/* decoupling */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="glass-soft rounded-[1.6rem] p-5 -rotate-[0.4deg]">
                  <p className="font-hand text-[19px] text-[#b3546e] dark:text-[#e08ca4]">fragile ✗</p>
                  <p className="font-mono text-[11px] bg-white/60 dark:bg-white/10 rounded-xl px-3 py-2.5 mt-2 overflow-x-auto whitespace-nowrap">&lt;button class="submit-btn active"&gt;</p>
                  <p className="text-[12.5px] text-[#6f6a5e] dark:text-[#a89f8b] leading-relaxed mt-2.5">One class doing two jobs — looks <em>and</em> logic. Rename it in a redesign and the JavaScript silently stops finding the button.</p>
                </div>
                <div className="glass-soft rounded-[1.6rem] p-5 rotate-[0.4deg]">
                  <p className="font-hand text-[19px] text-[#5b7553] dark:text-[#a7c69b]">robust ✓</p>
                  <p className="font-mono text-[11px] bg-white/60 dark:bg-white/10 rounded-xl px-3 py-2.5 mt-2 overflow-x-auto whitespace-nowrap">&lt;button class="btn-primary js-checkout is-loading"&gt;</p>
                  <p className="text-[12.5px] text-[#6f6a5e] dark:text-[#a89f8b] leading-relaxed mt-2.5"><code className="font-mono text-[11px]">btn-primary</code> styles it. <code className="font-mono text-[11px]">js-</code> is logic's hook, never styled. <code className="font-mono text-[11px]">is-</code> names the state. Three names, three contracts.</p>
                </div>
              </div>

              <p className="glass-soft rounded-2xl px-5 py-4 text-[13.5px] leading-relaxed text-[#4c473c] dark:text-[#cfc8b6] rotate-[-0.3deg]">
                <strong className="text-[#26241f] dark:text-[#f2ecdc]">Full honesty:</strong> this page is written in React, so you won't find raw <code className="font-mono text-[12px] bg-white/70 dark:bg-white/10 px-1 py-0.5 rounded">addEventListener</code> in it. React is the <em>declarative</em> sequel to this week — you describe what the UI should look like for a given state, and it updates the DOM for you. Every <code className="font-mono text-[12px] bg-white/70 dark:bg-white/10 px-1 py-0.5 rounded">useState</code> above is Phase 2, grown up. The loop you learned by hand is still the loop — it's just wearing a framework now.
              </p>
            </div>
          </div>
        </section>

        {/* ————————— checklist ————————— */}
        <section id="checklist" aria-labelledby="checklist-title" className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-20 sm:pt-24 pb-24 scroll-mt-28">
          <div className="text-center max-w-2xl mx-auto">
            <p className="font-hand text-[24px] text-[#5b54a6] dark:text-[#a8a3e8] rotate-[-1.5deg] inline-block">task 3 · the requirements</p>
            <h2 id="checklist-title" className="font-display font-semibold tracking-tight leading-[1.05] text-[clamp(2.1rem,5vw,3.4rem)] mt-1.5">
              Six checks before<br />calling it alive
            </h2>
            <p className="mt-4 text-[15.5px] leading-relaxed text-[#4c473c] dark:text-[#cfc8b6]">
              The kit's three asks are already true of this page — they're ticked, but verify
              them by poking. The bottom three are craftsmanship; judge them like a mentor would.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 mt-12 items-start max-w-5xl mx-auto">
            <fieldset className="lg:col-span-8 glass rounded-[1.8rem] p-6 sm:p-8 -rotate-[0.3deg]">
              <legend className="sr-only">Project 3 requirements checklist</legend>
              <ul>
                {CHECKS.map((c, i) => (
                  <li key={c.tag} className={i > 0 ? "border-t border-dashed border-[#26241f]/15 dark:border-white/10" : ""}>
                    <label className="flex gap-4 py-4 cursor-pointer group">
                      <input type="checkbox" checked={checked[i]} onChange={() => setChecked(prev => prev.map((v, j) => (j === i ? !v : v)))} className="sr-only" aria-describedby={`p3note-${i}`} />
                      <span aria-hidden="true" className={`w-6 h-6 rounded-[7px] shrink-0 mt-0.5 grid place-items-center border-2 transition-all ${checked[i] ? "bg-[#5b54a6] dark:bg-[#3d3870] border-[#5b54a6] dark:border-[#3d3870] text-white rotate-[-4deg]" : "border-[#26241f]/35 dark:border-white/30 bg-white/60 dark:bg-white/10 group-hover:border-[#5b54a6] dark:group-hover:border-[#a8a3e8]"}`}>
                        {checked[i] && <Check className="w-4 h-4" strokeWidth={3} />}
                      </span>
                      <span className="flex-1">
                        <span className="flex items-baseline gap-2.5 flex-wrap">
                          <strong className={`font-display font-semibold text-[17px] ${checked[i] ? "line-through decoration-[#5b54a6] dark:decoration-[#a8a3e8] decoration-2 text-[#6f6a5e] dark:text-[#a89f8b]" : ""}`}>{c.title}</strong>
                          <span className="font-hand text-[17px] text-[#9a927c] dark:text-[#8f8672]">{c.tag}</span>
                        </span>
                        <span id={`p3note-${i}`} className="block text-[13.5px] text-[#6f6a5e] dark:text-[#a89f8b] leading-relaxed mt-0.5">{c.note}</span>
                      </span>
                      <span className={`font-hand text-[18px] shrink-0 ${checked[i] ? "text-[#5b54a6] dark:text-[#a8a3e8]" : "text-[#b6ad97] dark:text-[#7d7663]"}`} aria-hidden="true">{checked[i] ? "done" : "pending"}</span>
                    </label>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap items-center gap-3 mt-5">
                <div className="flex-1 min-w-[180px]">
                  <div className="flex justify-between text-[12px] text-[#6f6a5e] dark:text-[#a89f8b]"><span>progress</span><span aria-live="polite">{done} of 6 · {pct}%</span></div>
                  <div className="h-2.5 rounded-full bg-white/70 dark:bg-white/10 border border-white/80 dark:border-white/15 mt-1.5 overflow-hidden" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Checklist progress">
                    <div className={`h-full rounded-full transition-all duration-500 ${unlocked ? "bg-[#5b7553] dark:bg-[#7ba06f]" : "bg-[#5b54a6] dark:bg-[#8f89cc]"}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
                <button onClick={() => setChecked(Array(6).fill(true))} className="text-[13px] font-medium bg-[#26241f] dark:bg-[#f2ecdc] text-white dark:text-[#26241f] rounded-full px-4 py-2 hover:bg-[#5b54a6] dark:hover:bg-[#a8a3e8] hover:text-white dark:hover:text-[#26241f] transition-colors">tick all</button>
                <button onClick={() => setChecked(Array(6).fill(false))} className="text-[13px] font-medium glass-soft rounded-full px-4 py-2 hover:bg-white/80 dark:hover:bg-white/15 transition-colors">start over</button>
              </div>
            </fieldset>

            <div className="lg:col-span-4 relative">
              <Sticky tone={unlocked ? "mint" : "sky"} className="rotate-2 lg:mt-6">
                {unlocked ? (
                  <>badge no. 3 earned. the definitive milestone, per the kit — <strong>the domain is yours. project 4 unlocks next week.</strong></>
                ) : (
                  <>badge no. 3 at six of six. the kit calls this one the definitive milestone — no pressure, but, you know. pressure.</>
                )}
              </Sticky>
              <div className={`glass rounded-[1.6rem] p-6 mt-8 -rotate-[0.6deg] text-center transition-all ${unlocked ? "ring-2 ring-[#5b54a6]/50 dark:ring-[#a8a3e8]/40" : ""}`}>
                <span className={`w-20 h-20 mx-auto rounded-full grid place-items-center transition-colors ${unlocked ? "bg-[#5b54a6] dark:bg-[#3d3870] text-white" : "glass-soft text-[#b6ad97] dark:text-[#7d7663]"}`}>
                  {unlocked ? <BadgeCheck className="w-9 h-9" /> : <Lock className="w-7 h-7" />}
                </span>
                <p className="font-display font-semibold text-[21px] mt-4 leading-snug">{unlocked ? "Badge No. 3. Alive." : "Badge No. 3 is in this box"}</p>
                <p className="text-[13.5px] text-[#6f6a5e] dark:text-[#a89f8b] leading-relaxed mt-1.5">
                  {unlocked ? "Listeners wired, state protected, DOM mutated safely, logic decoupled. Certified reactive." : "Six of six unlocks it. The sticky note keeps score; the page keeps listening."}
                </p>
                {unlocked && <a href="#submit" className="inline-flex items-center gap-2 mt-4 bg-[#26241f] dark:bg-[#f2ecdc] text-white dark:text-[#26241f] rounded-full px-5 py-2.5 text-[13.5px] font-medium hover:bg-[#5b54a6] dark:hover:bg-[#a8a3e8] hover:text-white dark:hover:text-[#26241f] transition-colors">Now: hand it in <ArrowRight className="w-4 h-4" /></a>}
              </div>
            </div>
          </div>
        </section>

        {/* ————————— hand it in ————————— */}
        <section id="submit" aria-labelledby="submit-title" className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-4 pb-24 scroll-mt-28">
          <div className="max-w-2xl">
            <p className="font-hand text-[24px] text-[#5b7553] dark:text-[#a7c69b] rotate-[-1.5deg] inline-block">you know the drill by now</p>
            <h2 id="submit-title" className="font-display font-semibold tracking-tight leading-[1.05] text-[clamp(2.1rem,5vw,3.4rem)] mt-1.5">Ready to hand it in</h2>
            <p className="mt-4 text-[15.5px] leading-relaxed text-[#4c473c] dark:text-[#cfc8b6]">
              Third verse, same as the first — except this time the page can fight back during
              inspection, so inspection gets more interesting.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-10 lg:gap-8 mt-12 items-start">
            <ol className="lg:col-span-5 space-y-7 lg:pt-2">
              {[
                ["Try to break it first", "Click everything. Double-click things. Tab through with the keyboard and actually watch where focus goes. Type <script>alert(1)</script> into Thursday's shout box — it should sit there as harmless words. Drag the window narrower and wider and read the nerve log judging you."],
                ["Then the judges, again", "W3C for the markup, Lighthouse for the rest — and one new habit: open DevTools' console and reload. A clean page greets you with silence, not a wall of red. Zero uncaught anythings."],
                ["Same repo, third commit", "The portfolio is a series now. Three commits, three weeks, one story arc:"],
                ["Write the note", "Machine on the right, fourth verse. It still pulls your checklist score live — finish the six above first if you want the ✓ in the text."],
                ["Send it where weeks 1–2 went", "The kit calls Project 3 the definitive milestone for mastering the domain — completing it unlocks what comes next. Whatever comes next is going to be fun."],
              ].map(([t, d], i) => (
                <li key={t} className="flex gap-4">
                  <span className="font-hand text-[28px] leading-none text-[#5b54a6] dark:text-[#a8a3e8] w-7 shrink-0" aria-hidden="true">{i + 1}.</span>
                  <div className="min-w-0">
                    <h3 className="font-display font-semibold text-[17.5px] leading-snug">{t}</h3>
                    <p className="text-[14px] text-[#4c473c] dark:text-[#cfc8b6] leading-relaxed mt-1">{d}</p>
                    {i === 1 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        <a href="https://validator.w3.org/nu/" target="_blank" rel="noreferrer" className="glass-soft inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12.5px] font-medium hover:bg-white/80 dark:hover:bg-white/15 transition-colors">W3C Validator <ArrowUpRight className="w-3.5 h-3.5" /></a>
                        <a href="https://developer.chrome.com/docs/lighthouse/overview/" target="_blank" rel="noreferrer" className="glass-soft inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12.5px] font-medium hover:bg-white/80 dark:hover:bg-white/15 transition-colors">Lighthouse guide <ArrowUpRight className="w-3.5 h-3.5" /></a>
                      </div>
                    )}
                    {i === 2 && (
                      <pre className="glass-dark text-[#cfe3c8] rounded-2xl mt-3 p-4 font-mono text-[11.5px] leading-relaxed overflow-x-auto"><code>{`git add -A\ngit commit -m "week 3: the page woke up"\ngit push`}</code></pre>
                    )}
                  </div>
                </li>
              ))}
              <li>
                <Sticky tone="mint" className="w-60 rotate-[-1.5deg] ml-11">
                  an error you understand beats a page that merely works. <strong>read the red text; it's a teacher.</strong>
                </Sticky>
              </li>
            </ol>

            <div className="lg:col-span-7">
              <div className="glass rounded-[1.8rem] p-6 sm:p-8 rotate-[0.3deg] relative">
                <Tape className="absolute -top-3 right-10 rotate-2" />
                <h3 className="font-display font-semibold text-[20px]">The submission note, week 3</h3>
                <p className="text-[13.5px] text-[#6f6a5e] dark:text-[#a89f8b] mt-1.5">Four fields, same as ever. Watch the checklist line at the bottom keep score.</p>

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
                    <input value={subRepo} onChange={e => setSubRepo(e.target.value)} placeholder="https://github.com/you/decodelabs-projects" className={inputCls} inputMode="url" />
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
                  <p className="font-hand text-[19px] text-[#6f6a5e] dark:text-[#a89f8b] mt-3 rotate-[-0.8deg] inline-block">paste, push, breathe out. week three, alive and submitted.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ————————— sign-off ————————— */}
        <section aria-labelledby="letter3-title" className="relative max-w-3xl mx-auto px-5 sm:px-8 pb-24">
          <figure className="text-center">
            <blockquote className="font-display font-medium italic leading-[1.25] tracking-tight text-[clamp(1.6rem,4vw,2.5rem)] text-[#33302a] dark:text-[#ece5d3]">
              “You are no longer just designing static documents; you are engineering living systems.”
            </blockquote>
            <figcaption className="font-hand text-[20px] text-[#6f6a5e] dark:text-[#a89f8b] mt-4">— the kit, promoting me. it's pinned next to the other two quotes. the wall is filling up.</figcaption>
          </figure>

          <article className="glass ruled rounded-[1.8rem] p-7 sm:p-10 mt-12 rotate-[-0.3deg] relative">
            <Tape className="absolute -top-3 left-1/2 -translate-x-1/2 rotate-2" />
            <h2 id="letter3-title" className="font-display font-semibold text-[22px]">A short letter, third of the series</h2>
            <div className="mt-4 space-y-4 text-[15px] leading-[1.75] text-[#4c473c] dark:text-[#cfc8b6]">
              <p>
                Bones, then skin, now nerves. The page doesn't just sit there being correct
                anymore — it <span className="hl-mint">notices things</span>, remembers them as state, and
                answers. Every interaction, I've learned, is the same small loop wearing
                different clothes: something comes in, a function decides, the DOM shows the
                result. Input, process, output — week 1's debugging model turned out to be the
                whole architecture.
              </p>
              <p>
                I also met my first <code className="font-mono text-[13px] bg-white/70 dark:bg-white/10 px-1.5 py-0.5 rounded">Uncaught ReferenceError</code> this
                week, at 11pm, and the kit was right about those too: it taught me more in four
                minutes than a smooth afternoon would have. It was a typo. It is always a typo.
                But now I <em>read</em> the red text instead of fearing it.
              </p>
              <p>
                Project 3 of a few. The kit calls this the definitive milestone, and for once
                the brochure undersells it: the page is alive, and I know exactly which wires
                made it so.
              </p>
            </div>
            <p className="font-hand text-[26px] text-[#26241f] dark:text-[#f2ecdc] mt-7 rotate-[-1.5deg] inline-block">— thanks for poking everything. see you in project 4.</p>
          </article>

          <div className="mt-10 text-center">
            <p className="font-hand text-[21px] text-[#6f6a5e] dark:text-[#a89f8b]">when the console turns red (it will) —</p>
            <div className="flex flex-wrap justify-center gap-2.5 mt-4">
              {[["MDN: addEventListener", "https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener"], ["MDN: the DOM, introduced", "https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction"], ["javascript.info", "https://javascript.info"], ["Can I Use", "https://caniuse.com"]].map(([l, h]) => (
                <a key={l} href={h} target="_blank" rel="noreferrer" className="glass-soft inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-medium hover:bg-white/80 dark:hover:bg-white/15 transition-colors">{l} <ArrowUpRight className="w-3.5 h-3.5" /></a>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* ————————— footer ————————— */}
      <footer className="relative max-w-6xl mx-auto px-5 sm:px-8 pb-10">
        <div className="glass rounded-[1.8rem] px-7 sm:px-10 py-9">
          <div className="flex flex-col md:flex-row md:items-start gap-8 justify-between">
            <div className="max-w-xs">
              <p className="font-display font-semibold text-[26px] leading-tight">Thank <em className="text-[#5b7553] dark:text-[#a7c69b]">you</em>, once more.</p>
              <p className="text-[13.5px] text-[#6f6a5e] dark:text-[#a89f8b] leading-relaxed mt-2">Project 3 · Interactive Web Elements. It listens now — written by a person, at the same desk, where the mug has seen things.</p>
              <nav aria-label="Footer" className="mt-4">
                <ul className="flex flex-wrap gap-x-4 gap-y-1.5">
                  {[...NAV, { label: "hand it in", href: "#submit" }, { label: "week 2", href: "?week=2" }, { label: "week 1", href: "?week=1" }].map(n => <li key={n.label}><a href={n.href} className="text-[13px] text-[#4c473c] dark:text-[#cfc8b6] underline decoration-[#c9bfa5] dark:decoration-[#5c564a] underline-offset-4 hover:decoration-[#5b54a6] dark:hover:decoration-[#a8a3e8] hover:text-[#26241f] dark:hover:text-white">{n.label}</a></li>)}
                </ul>
              </nav>
            </div>
            <address className="not-italic">
              <p className="font-hand text-[21px] text-[#5b7553] dark:text-[#a7c69b]">say hello — decodelabs</p>
              <ul className="mt-3 space-y-2.5 text-[14px]">
                <li><a href="tel:+918933006408" className="flex items-center gap-2.5 hover:text-[#5b7553] dark:hover:text-[#a7c69b] transition-colors"><Phone className="w-4 h-4 text-[#5b54a6] dark:text-[#a8a3e8]" /> +91 89330 06408</a></li>
                <li><a href="mailto:decodelabs.tech@gmail.com" className="flex items-center gap-2.5 hover:text-[#5b7553] dark:hover:text-[#a7c69b] transition-colors"><Mail className="w-4 h-4 text-[#5b54a6] dark:text-[#a8a3e8]" /> decodelabs.tech@gmail.com</a></li>
                <li><a href="https://www.decodelabs.tech" target="_blank" rel="noreferrer" className="flex items-center gap-2.5 hover:text-[#5b7553] dark:hover:text-[#a7c69b] transition-colors"><Globe className="w-4 h-4 text-[#5b54a6] dark:text-[#a8a3e8]" /> www.decodelabs.tech <ArrowUpRight className="w-3.5 h-3.5" /></a></li>
                <li className="flex items-center gap-2.5 text-[#6f6a5e] dark:text-[#a89f8b]"><MapPin className="w-4 h-4 text-[#5b54a6] dark:text-[#a8a3e8]" /> Greater Lucknow, India</li>
              </ul>
            </address>
            <div className="font-hand text-[20px] leading-snug text-[#6f6a5e] dark:text-[#a89f8b] rotate-[-1.5deg] max-w-[11rem]">
              bones. skin. nerves. it moves now.
            </div>
          </div>
          <div className="mt-8 pt-5 border-t border-[#26241f]/10 dark:border-white/10 flex flex-col sm:flex-row justify-between gap-2 text-[12px] text-[#9a927c] dark:text-[#8f8672]">
            <span>© 2026 DecodeLabs · Frontend Development — Batch 2026</span>
            <span>input → process → output. ship it.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
