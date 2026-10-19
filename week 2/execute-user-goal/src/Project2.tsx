import { useEffect, useState } from "react";
import {
  ArrowDown, ArrowRight, ArrowUpRight, BadgeCheck, Check, Copy, Globe, Lock,
  Mail, MapPin, Menu, Moon, Phone, Sun, X
} from "lucide-react";

/* ————— same desk, second week. these little helpers come along. ————— */
function Tape({ className = "" }: { className?: string }) {
  return <span aria-hidden="true" className={`tape ${className}`} />;
}

function Sticky({ tone = "yellow", children, className = "" }: { tone?: "yellow" | "pink" | "mint" | "sky"; children: React.ReactNode; className?: string }) {
  const tones = {
    yellow: "bg-[#fdf0a6]/85 dark:bg-[#8a6d23]/80",
    pink: "bg-[#ffd9cf]/85 dark:bg-[#8a4638]/80",
    mint: "bg-[#cfe7d2]/85 dark:bg-[#3f5a3c]/80",
    sky: "bg-[#cfe3f7]/85 dark:bg-[#33506e]/80",
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
  { label: "thumbs", href: "#thumbs" },
  { label: "checklist", href: "#checklist" },
];

const CHECKS = [
  { tag: "the key", title: "Viewport meta tag in the head", note: "width=device-width, initial-scale=1. It's line 5 of this very site — the browser now tells the truth about its size." },
  { tag: "strategy", title: "Mobile-first base CSS", note: "The small screen is the default stylesheet here. Bigger screens only add — they never have to rescue." },
  { tag: "layout", title: "Grid holds the house, flex the furniture", note: "Same rule as week 1, now with weather to withstand. The lab below is built exactly this way." },
  { tag: "units", title: "Fluid units — %, rem, vw", note: "Almost nothing on this page is a fixed pixel. It pours. Resize the window and watch the headlines breathe." },
  { tag: "nav", title: "Hamburger / popover navigation", note: "Shrink the lab under 560px and tap the menu. In raw HTML that whole pattern is one popover attribute, zero JS." },
  { tag: "thumbs", title: "44px targets & zoom that stays on", note: "Nothing here is smaller than a fingertip, and the page is perfectly happy at 500% zoom. Try both, below." },
];

const PYRAMID = [
  {
    name: "Mobile core", sub: "the base — no media query at all", w: "100%",
    code: "/* written first, for the smallest screen */\n.page { display: grid; gap: 1rem; }",
    text: "One column. Content in priority order. Big, honest tap targets. If it works here, it works anywhere — everything after this is decoration.",
  },
  {
    name: "Tablet", sub: "@media (min-width: 768px)", w: "74%",
    code: "@media (min-width: 768px) {\n  /* room appeared — spend it */\n  .page { grid-template-columns: 1fr 1fr; }\n}",
    text: "Space shows up, so we spend it: a second column, the nav unfolds, margins start to breathe. Nothing gets redesigned — it gets enhanced.",
  },
  {
    name: "Desktop", sub: "@media (min-width: 1024px)", w: "48%",
    code: "@media (min-width: 1024px) {\n  /* cap the line, bring the good furniture */\n  .page { max-width: 72rem; margin-inline: auto; }\n}",
    text: "Cap the line length so eyes don't commute. High-res images, extra columns, the fancy hover states. Complexity increases with space — never before it.",
  },
];

export default function Project2() {
  /* theme — same switch as week 1, same saved choice */
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"));
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    try { localStorage.setItem("dl-theme", dark ? "dark" : "light"); } catch { /* private mode — fine */ }
  }, [dark]);

  const [tagOn, setTagOn] = useState(true);
  const [pyr, setPyr] = useState(0);
  const [flexDir, setFlexDir] = useState<"row" | "column">("row");
  const [typeW, setTypeW] = useState(640);
  const [labW, setLabW] = useState(390);
  const [menuOpen, setMenuOpen] = useState(false);
  const [zoom, setZoom] = useState(200);
  const [tapMsg, setTapMsg] = useState("go on — try tapping both.");
  const [checked, setChecked] = useState([true, false, false, true, false, false]);

  const typePx = Math.min(44, Math.max(20, Math.round(14 + typeW * 0.022)));
  const heroPx = Math.min(34, Math.max(19, Math.round(12 + labW * 0.024)));
  const cols = Math.max(1, Math.min(4, Math.floor((labW - 40 + 10) / 160)));
  const zone = labW < 480 ? "small phone — one column, no mercy" : labW < 768 ? "phone — still stacking, still fine" : labW < 1024 ? "tablet — room to breathe" : "desktop — spread out, line capped";
  const needle = ((labW - 320) / (1080 - 320)) * 100;

  const done = checked.filter(Boolean).length;
  const pct = Math.round((done / CHECKS.length) * 100);
  const unlocked = done === CHECKS.length;

  /* ——— submission note machine, week 2 edition ——— */
  const [subName, setSubName] = useState("");
  const [subDemo, setSubDemo] = useState("");
  const [subRepo, setSubRepo] = useState("");
  const [subLearned, setSubLearned] = useState("");
  const [noteCopied, setNoteCopied] = useState(false);
  const note = [
    "Hi team — submitting Project 2: Responsive Web Layout.",
    "",
    `Name: ${subName || "…"} · Batch 2026, Frontend Development`,
    `Live page: ${subDemo || "…"}`,
    `Code: ${subRepo || "…"}`,
    "",
    "What I built: one page that pours itself into any screen — mobile-first CSS with min-width breakpoints where the content breaks (not where a new phone launches), clamp() fluid type, an auto-fit grid, popover-style navigation, 44px touch targets, and zoom that stays on up to 500%.",
    `One thing I learned: ${subLearned || "breakpoints belong where the content breaks, not where a device happens to launch."}`,
    `Implementation checklist: ${done}/6 verified${unlocked ? " ✓" : ""} · Same repo as Project 1, this is the week-2 commit.`,
  ].join("\n");
  const copyNote = async () => {
    try { await navigator.clipboard.writeText(note); } catch { /* fine */ }
    setNoteCopied(true); setTimeout(() => setNoteCopied(false), 1600);
  };
  const inputCls = "mt-1 w-full rounded-2xl bg-white/60 dark:bg-white/10 border border-white/80 dark:border-white/15 px-4 py-2.5 text-[14px] placeholder:text-[#9a927c] dark:placeholder:text-[#7d7663] focus:outline-none focus:ring-2 focus:ring-[#5b7553]/50 dark:focus:ring-[#a7c69b]/40 transition-shadow";

  return (
    <div className="relative min-h-screen overflow-x-clip text-[#26241f] dark:text-[#f2ecdc] transition-colors duration-500">
      {/* colour washes — this week's skew a little more river-blue */}
      <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-32 -left-32 w-[34rem] h-[34rem] rounded-full bg-[#a9cdec] dark:bg-[#27405f] opacity-60 blur-3xl transition-colors duration-700" />
        <div className="absolute top-[22%] -right-40 w-[38rem] h-[38rem] rounded-full bg-[#b9dcbc] dark:bg-[#2f4a2c] opacity-55 dark:opacity-55 blur-3xl transition-colors duration-700" />
        <div className="absolute top-[55%] -left-48 w-[36rem] h-[36rem] rounded-full bg-[#f6cf9f] dark:bg-[#5f4220] opacity-50 blur-3xl transition-colors duration-700" />
        <div className="absolute -bottom-40 right-[8%] w-[32rem] h-[32rem] rounded-full bg-[#c3d9f2] dark:bg-[#33506e] opacity-50 dark:opacity-50 blur-3xl transition-colors duration-700" />
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
          <button onClick={() => setDark(v => !v)} aria-pressed={dark} aria-label={dark ? "Switch to light mode" : "Switch to dark mode"} title={dark ? "lights on" : "lights out"} className="glass-soft shrink-0 inline-flex items-center gap-1.5 rounded-full px-2.5 sm:pr-3.5 py-2 hover:-translate-y-px transition-transform">
            {dark ? <Sun className="w-4 h-4 text-[#e8a06a]" /> : <Moon className="w-4 h-4 text-[#5b7553]" />}
            <span className="font-hand text-[17px] leading-none hidden sm:block">{dark ? "lights on" : "lights out"}</span>
          </button>
          <span className={`hidden sm:inline-flex items-center gap-1.5 shrink-0 text-[12px] font-medium rounded-full pl-2.5 pr-3 py-1.5 transition-colors ${unlocked ? "bg-[#5b7553] dark:bg-[#46603f] text-white" : "bg-white/60 dark:bg-white/10 border border-white/80 dark:border-white/15"}`}>
            {unlocked ? <BadgeCheck className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
            {unlocked ? "badge no. 2" : `${done}/6 checks`}
          </span>
          <a href="?week=1" className="shrink-0 bg-[#26241f] dark:bg-[#f2ecdc] text-white dark:text-[#26241f] text-[13px] font-medium rounded-full px-4 py-2 hover:bg-[#5b7553] dark:hover:bg-[#a7c69b] hover:text-white dark:hover:text-[#26241f] transition-colors">← week 1</a>
        </div>
      </header>

      <main id="main">
        {/* ————————— hero ————————— */}
        <section id="top" className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-32 sm:pt-40 pb-16 sm:pb-24">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-6 items-start">
            <div className="lg:col-span-7 relative">
              <p className="font-hand text-[24px] text-[#4a7ca8] dark:text-[#8fc0ea] -rotate-2 inline-block">week two — project 2: responsive web layout</p>
              <h1 className="font-display font-semibold leading-[1.02] tracking-tight text-[clamp(2.7rem,6.5vw,4.9rem)] mt-2">
                the page learned<br />
                to <em className="hl not-italic font-semibold">pour</em>.
              </h1>
              <p className="mt-6 text-[16.5px] leading-relaxed text-[#4c473c] dark:text-[#cfc8b6] max-w-xl">
                Week 1's page was a poster: correct, semantic, and quietly assuming a nice big
                monitor. This week it had to survive the real world — someone's phone on a bus,
                a cracked tablet, a monitor the size of a door. The fix wasn't more versions of
                the page. It was one page with no fixed shape: <strong className="text-[#26241f] dark:text-[#f2ecdc] font-semibold">content like water</strong>,
                taking the shape of whatever holds it.
              </p>
              <p className="mt-4 text-[16.5px] leading-relaxed text-[#4c473c] dark:text-[#cfc8b6] max-w-xl">
                Everything below is touchable, and the best way to read this page is to resize
                your browser while you do. Go on — it can take it now.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a href="#lab" className="inline-flex items-center gap-2 bg-[#26241f] dark:bg-[#f2ecdc] text-white dark:text-[#26241f] rounded-full pl-6 pr-5 py-3.5 text-[14.5px] font-medium shadow-[0_12px_28px_rgba(38,36,31,.25)] dark:shadow-[0_12px_28px_rgba(0,0,0,.5)] hover:bg-[#4a7ca8] dark:hover:bg-[#8fc0ea] hover:text-white dark:hover:text-[#26241f] hover:-translate-y-0.5 transition-all">
                  Squeeze the page <ArrowDown className="w-4 h-4" />
                </a>
                <a href="#notes" className="glass inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-[14.5px] font-medium hover:-translate-y-0.5 transition-transform">
                  Read the week's notes
                </a>
              </div>

              <dl className="mt-10 flex flex-wrap gap-2.5">
                {[["62.73%", "of web traffic is a phone"], ["44px", "smallest polite tap target"], ["500%", "zoom, allowed, always"]].map(([v, l]) => (
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
                  src="https://images.pexels.com/photos/3262423/pexels-photo-3262423.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200"
                  width={1200} height={627}
                  alt="The audience in one photo: a laptop, a tablet and a smartphone sharing one desk"
                  className="w-full aspect-[1200/627] object-cover rounded-[2px] dark:brightness-[0.94]"
                />
                <figcaption className="font-hand text-[21px] text-[#4c473c] pt-3 px-1 flex items-end justify-between gap-3">
                  <span>the audience: all three, at once, always.</span>
                  <span className="font-mono text-[9.5px] text-[#9a927c] whitespace-nowrap pb-1">1200 × 627 · webp</span>
                </figcaption>
              </figure>

              <figure className="polaroid absolute -bottom-16 -left-2 sm:-left-8 w-40 sm:w-48 -rotate-6 rounded-[4px] p-2 pb-2.5 z-20 hidden sm:block">
                <img
                  src="https://images.pexels.com/photos/3184343/pexels-photo-3184343.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200"
                  width={1200} height={627} loading="lazy"
                  alt="A tablet flat-lay workspace — device number two on the testing pile"
                  className="w-full aspect-[4/3] object-cover rounded-[2px] dark:brightness-[0.94]"
                />
                <figcaption className="font-hand text-[17px] leading-none text-[#4c473c] pt-2 px-0.5">test on everything you own</figcaption>
              </figure>

              <Sticky tone="sky" className="absolute -bottom-10 right-0 sm:-right-3 w-52 rotate-3 z-30">
                “you put water into a cup, it becomes the cup.” — bruce lee. the kit quoted him first; <span className="underline decoration-wavy decoration-[#4a7ca8] dark:decoration-[#8fc0ea] underline-offset-2">my css is just trying to keep up.</span>
              </Sticky>
            </div>
          </div>
        </section>

        {/* ————————— field notes, week 2 ————————— */}
        <section id="notes" aria-labelledby="notes-title" className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-20 sm:pt-28 pb-8 scroll-mt-28">
          <p className="font-hand text-[24px] text-[#5b7553] dark:text-[#a7c69b] rotate-[-1.5deg] inline-block">field notes, week two</p>
          <h2 id="notes-title" className="font-display font-semibold tracking-tight leading-[1.05] text-[clamp(2rem,4.5vw,3.2rem)] mt-1.5">
            Five days of bending<br className="hidden sm:block" /> without breaking
          </h2>

          <div className="relative mt-12">
            <span className="absolute left-[7px] sm:left-[9px] top-2 bottom-2 border-l-2 border-dashed border-[#26241f]/20 dark:border-white/15" aria-hidden="true" />

            {/* MON — the viewport key */}
            <article className="relative pl-10 sm:pl-14 pb-12">
              <span className="absolute left-0 top-2 w-[15px] h-[15px] sm:w-[19px] sm:h-[19px] rounded-full bg-[#f7f2e7] dark:bg-[#171410] border-[3px] border-[#4a7ca8] dark:border-[#8fc0ea] transition-colors duration-500" aria-hidden="true" />
              <p className="font-mono text-[11px] tracking-wide text-[#6f6a5e] dark:text-[#a89f8b]">MON — the key to the kingdom</p>
              <div className="glass rounded-[1.6rem] rounded-tl-md p-6 sm:p-8 mt-3 max-w-3xl -rotate-[0.4deg]">
                <h3 className="font-display font-semibold text-[24px] leading-snug">One line of HTML was lying to me.</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-[#4c473c] dark:text-[#cfc8b6]">
                  Without the viewport tag, a phone pretends to be 980px wide, lays the page out
                  for a desktop, then shrink-wraps the whole thing. Everything I designed,
                  miniaturised. With the tag, the browser admits its real width and the CSS can
                  actually respond. Flip it and watch the same page:
                </p>
                <div className="mt-6 flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                  <div className="w-[280px] shrink-0 rounded-[1.9rem] border-[6px] border-[#26241f] dark:border-[#3a352b] bg-white dark:bg-[#201c15] overflow-hidden shadow-[0_16px_36px_rgba(60,50,30,.22)] dark:shadow-[0_16px_36px_rgba(0,0,0,.5)]">
                    <div className="flex justify-center pt-2 pb-1" aria-hidden="true"><span className="w-14 h-1.5 rounded-full bg-[#26241f]/15 dark:bg-white/20" /></div>
                    <div className="h-[280px] overflow-hidden relative" aria-live="polite">
                      {tagOn ? (
                        <div className="p-4">
                          <p className="font-display font-semibold text-[19px] leading-tight">a page, at its real size</p>
                          <p className="text-[11.5px] text-[#6f6a5e] dark:text-[#a89f8b] leading-relaxed mt-1.5">text you can read without pinching. a button your thumb can actually land on.</p>
                          <div className="space-y-2 mt-3">
                            <div className="h-9 rounded-lg bg-[#dcead9] dark:bg-[#2f4a2c]" /><div className="h-9 rounded-lg bg-[#f6e3c2] dark:bg-[#4d3a1c]" /><div className="h-9 rounded-lg bg-[#d7e6f5] dark:bg-[#2b405a]" />
                          </div>
                          <span className="block h-11 leading-[2.75rem] text-center rounded-full bg-[#26241f] dark:bg-[#f2ecdc] text-white dark:text-[#26241f] text-[12px] font-medium mt-3">a 44px-tall button</span>
                        </div>
                      ) : (
                        <div>
                          <div style={{ width: 760, transform: "scale(0.335)", transformOrigin: "top left" }} className="p-6">
                            <p className="font-display font-bold text-[34px] leading-none">a desktop page, shrink-wrapped</p>
                            <p className="text-[15px] text-[#6f6a5e] mt-3 w-[520px]">nine hundred and eighty pixels of layout, folded into a phone. the text is all here — it's just been printed for ants.</p>
                            <div className="flex gap-4 mt-5">
                              <div className="h-24 flex-1 rounded bg-[#dcead9]" /><div className="h-24 flex-1 rounded bg-[#f6e3c2]" /><div className="h-24 flex-1 rounded bg-[#d7e6f5]" />
                            </div>
                            <span className="inline-block px-6 py-3 rounded bg-[#26241f] text-white text-[14px] mt-5">a button, technically</span>
                          </div>
                          <p className="absolute bottom-2 inset-x-0 text-center font-hand text-[18px] text-[#b3546e] dark:text-[#e08ca4]">pinching is not a design.</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex-1 w-full">
                    <div className="glass-soft rounded-full p-1 flex w-fit" role="group" aria-label="Viewport meta tag">
                      <button onClick={() => setTagOn(false)} aria-pressed={!tagOn} className={`px-4 py-2 rounded-full text-[13px] font-medium transition-colors ${!tagOn ? "bg-[#b3546e] text-white" : "text-[#4c473c] dark:text-[#cfc8b6]"}`}>tag off — the lie</button>
                      <button onClick={() => setTagOn(true)} aria-pressed={tagOn} className={`px-4 py-2 rounded-full text-[13px] font-medium transition-colors ${tagOn ? "bg-[#4a7ca8] text-white" : "text-[#4c473c] dark:text-[#cfc8b6]"}`}>tag on — the truth</button>
                    </div>
                    <p className="glass-dark text-[#cfe3c8] rounded-2xl mt-4 px-4 py-3 font-mono text-[11px] leading-relaxed overflow-x-auto whitespace-nowrap">&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;</p>
                    <p className="text-[13.5px] text-[#6f6a5e] dark:text-[#a89f8b] leading-relaxed mt-3">That line is already sitting in this site's <code className="font-mono text-[12px] bg-white/70 dark:bg-white/10 px-1.5 py-0.5 rounded">index.html</code>, line 5. Everything else this week stands on it.</p>
                    <p className="font-hand text-[20px] text-[#4a7ca8] dark:text-[#8fc0ea] mt-3 rotate-[-1deg] inline-block">the key to the kingdom is one &lt;meta&gt; tag. anticlimactic. essential.</p>
                  </div>
                </div>
              </div>
            </article>

            {/* TUE — mobile first pyramid */}
            <article className="relative pl-10 sm:pl-14 pb-12">
              <span className="absolute left-0 top-2 w-[15px] h-[15px] sm:w-[19px] sm:h-[19px] rounded-full bg-[#f7f2e7] dark:bg-[#171410] border-[3px] border-[#5b7553] dark:border-[#a7c69b] transition-colors duration-500" aria-hidden="true" />
              <p className="font-mono text-[11px] tracking-wide text-[#6f6a5e] dark:text-[#a89f8b]">TUE — start small, add when there's room</p>
              <div className="glass ruled rounded-[1.6rem] rounded-tl-md p-6 sm:p-8 mt-3 max-w-3xl rotate-[0.5deg] sm:ml-10">
                <h3 className="font-display font-semibold text-[24px] leading-snug">Mobile-first: the pyramid I finally get.</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-[#4c473c] dark:text-[#cfc8b6]">
                  Last week I designed the desktop and shrank it. This week the base styles are
                  the phone — and wider screens only <em>add</em>, through <code className="font-mono text-[13px] bg-white/70 dark:bg-white/10 px-1.5 py-0.5 rounded">min-width</code> queries.
                  Tap a layer:
                </p>
                <div className="mt-6 flex flex-col items-center gap-1.5">
                  {[...PYRAMID].reverse().map((l) => {
                    const i = PYRAMID.indexOf(l);
                    return (
                      <button key={l.name} onClick={() => setPyr(i)} aria-pressed={pyr === i} style={{ width: l.w }} className={`rounded-xl px-4 py-2.5 text-[13px] font-medium transition-all ${pyr === i ? "bg-[#26241f] dark:bg-[#f2ecdc] text-white dark:text-[#26241f] shadow-[0_10px_24px_rgba(38,36,31,.25)]" : "glass-soft hover:-translate-y-0.5"}`}>
                        {l.name} <span className={`font-mono text-[10px] ${pyr === i ? "text-white/60 dark:text-[#26241f]/60" : "text-[#9a927c] dark:text-[#8f8672]"}`}>{i === 0 ? "base" : i === 1 ? "768px+" : "1024px+"}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="mt-5" aria-live="polite">
                  <p className="text-[14.5px] leading-relaxed text-[#4c473c] dark:text-[#cfc8b6]"><strong className="text-[#26241f] dark:text-[#f2ecdc]">{PYRAMID[pyr].name}.</strong> {PYRAMID[pyr].text}</p>
                  <pre className="glass-dark text-[#cfe3c8] rounded-2xl mt-3 p-4 font-mono text-[11px] leading-relaxed overflow-x-auto whitespace-pre">{PYRAMID[pyr].code}</pre>
                </div>
                <p className="font-hand text-[20px] text-[#c96f3b] dark:text-[#e8a06a] mt-4 rotate-[-1deg] inline-block">complexity increases with space. like a good suitcase.</p>
              </div>
            </article>

            {/* WED — chess: flex vs grid */}
            <article className="relative pl-10 sm:pl-14 pb-12">
              <span className="absolute left-0 top-2 w-[15px] h-[15px] sm:w-[19px] sm:h-[19px] rounded-full bg-[#f7f2e7] dark:bg-[#171410] border-[3px] border-[#c96f3b] dark:border-[#e8a06a] transition-colors duration-500" aria-hidden="true" />
              <p className="font-mono text-[11px] tracking-wide text-[#6f6a5e] dark:text-[#a89f8b]">WED — a chess lesson</p>
              <div className="glass rounded-[1.6rem] rounded-tl-md p-6 sm:p-8 mt-3 max-w-3xl -rotate-[0.3deg]">
                <h3 className="font-display font-semibold text-[24px] leading-snug">The rook moves in lines. The king goes anywhere.</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-[#4c473c] dark:text-[#cfc8b6]">
                  The kit's metaphor, and it's a good one: <strong className="text-[#26241f] dark:text-[#f2ecdc]">Flexbox is the rook</strong> — one
                  dimension, a row <em>or</em> a column. <strong className="text-[#26241f] dark:text-[#f2ecdc]">Grid is the king</strong> — both
                  dimensions at once. Neither is better; they have different jobs.
                </p>
                <div className="grid sm:grid-cols-2 gap-4 mt-6">
                  <div className="glass-soft rounded-2xl p-4">
                    <p className="flex items-center justify-between"><span className="font-display font-semibold text-[16px]">♜ flexbox</span><span className="font-hand text-[17px] text-[#6f6a5e] dark:text-[#a89f8b]">one direction</span></p>
                    <div className="glass-soft rounded-full p-1 flex w-fit mt-3" role="group" aria-label="Flex direction">
                      {(["row", "column"] as const).map(d => (
                        <button key={d} onClick={() => setFlexDir(d)} aria-pressed={flexDir === d} className={`px-3.5 py-1.5 rounded-full text-[12px] font-medium capitalize transition-colors ${flexDir === d ? "bg-[#26241f] dark:bg-[#f2ecdc] text-white dark:text-[#26241f]" : "text-[#4c473c] dark:text-[#cfc8b6]"}`}>{d}</button>
                      ))}
                    </div>
                    <div className="flex gap-2 mt-4 transition-all" style={{ flexDirection: flexDir }} aria-hidden="true">
                      {["a", "b", "c"].map(t => <span key={t} className="rounded-lg bg-[#4a7ca8]/70 dark:bg-[#33506e] text-white font-mono text-[11px] px-3 py-2">{t}</span>)}
                    </div>
                    <p className="font-mono text-[10.5px] text-[#6f6a5e] dark:text-[#a89f8b] mt-3">display: flex; flex-direction: {flexDir};</p>
                  </div>
                  <div className="glass-soft rounded-2xl p-4">
                    <p className="flex items-center justify-between"><span className="font-display font-semibold text-[16px]">♔ grid</span><span className="font-hand text-[17px] text-[#6f6a5e] dark:text-[#a89f8b]">every direction</span></p>
                    <div className="grid gap-2 mt-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(58px, 1fr))" }} aria-hidden="true">
                      {[1, 2, 3, 4, 5, 6].map(n => <span key={n} className="rounded-lg bg-[#5b7553]/70 dark:bg-[#3f5a3c] text-white font-mono text-[11px] px-2 py-2 text-center">{n}</span>)}
                    </div>
                    <p className="font-mono text-[10.5px] text-[#6f6a5e] dark:text-[#a89f8b] mt-3 leading-relaxed">repeat(auto-fit, minmax(250px, 1fr)) — columns that count themselves.</p>
                  </div>
                </div>
                {/* harmony house */}
                <div className="mt-5 rounded-2xl border-2 border-dashed border-[#26241f]/25 dark:border-white/20 p-3.5" role="img" aria-label="Diagram: CSS Grid forms the page layout — header, sidebar, main, footer — while Flexbox arranges cards inside the main area">
                  <div className="rounded-md bg-[#26241f] dark:bg-[#f2ecdc] text-white dark:text-[#26241f] text-center font-mono text-[10px] py-1.5">header</div>
                  <div className="flex gap-2 mt-2">
                    <div className="w-[26%] rounded-md bg-[#9db8d2]/70 dark:bg-[#33506e] text-center font-mono text-[10px] py-4">sidebar</div>
                    <div className="flex-1 rounded-md border border-[#26241f]/20 dark:border-white/20 p-2">
                      <div className="flex gap-1.5">
                        {[1, 2, 3].map(n => <span key={n} className="flex-1 rounded bg-[#e8a06a]/70 dark:bg-[#7a4b22] font-mono text-[9px] text-center py-2">card</span>)}
                      </div>
                      <p className="font-mono text-[9px] text-center text-[#6f6a5e] dark:text-[#a89f8b] mt-1.5">↑ flex lives in here</p>
                    </div>
                  </div>
                  <div className="rounded-md bg-[#26241f]/70 dark:bg-[#f2ecdc]/80 text-white dark:text-[#26241f] text-center font-mono text-[10px] py-1.5 mt-2">footer</div>
                </div>
                <p className="text-[13.5px] text-[#6f6a5e] dark:text-[#a89f8b] mt-3 text-center"><strong className="text-[#26241f] dark:text-[#f2ecdc]">grid is the house. flex is the furniture.</strong> week 1's rule, now load-bearing.</p>
              </div>
            </article>

            {/* THU — fluid type */}
            <article className="relative pl-10 sm:pl-14 pb-12">
              <span className="absolute left-0 top-2 w-[15px] h-[15px] sm:w-[19px] sm:h-[19px] rounded-full bg-[#f7f2e7] dark:bg-[#171410] border-[3px] border-[#6a9ac5] dark:border-[#8fc0ea] transition-colors duration-500" aria-hidden="true" />
              <p className="font-mono text-[11px] tracking-wide text-[#6f6a5e] dark:text-[#a89f8b]">THU — type that breathes</p>
              <div className="glass ruled rounded-[1.6rem] rounded-tl-md p-6 sm:p-8 mt-3 max-w-3xl rotate-[0.4deg] sm:ml-6">
                <h3 className="font-display font-semibold text-[24px] leading-snug">No more staircases. A slope instead.</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-[#4c473c] dark:text-[#cfc8b6]">
                  Old way: the headline jumps size at every breakpoint — 20px, suddenly 28, suddenly
                  36. <code className="font-mono text-[13px] bg-white/70 dark:bg-white/10 px-1.5 py-0.5 rounded">clamp()</code> gives
                  it a floor, a ceiling, and a smooth slope between. Drag the pretend viewport:
                </p>
                <p className="font-display font-semibold leading-tight mt-6 transition-[font-size] duration-150" style={{ fontSize: typePx }} aria-hidden="true">type, breathing.</p>
                <div className="flex items-center gap-3 mt-5 flex-wrap">
                  <input type="range" min={320} max={1100} step={10} value={typeW} onChange={e => setTypeW(+e.target.value)} aria-label="Pretend viewport width for the headline" className="accent-[#4a7ca8] dark:accent-[#8fc0ea] flex-1 min-w-[160px]" />
                  <span className="font-mono text-[12px] text-[#6f6a5e] dark:text-[#a89f8b]">{typeW}px wide → <strong className="text-[#26241f] dark:text-[#f2ecdc]">{typePx}px</strong> type</span>
                </div>
                <p className="glass-dark text-[#cfe3c8] rounded-full mt-4 px-4 py-2.5 font-mono text-[11px] overflow-x-auto whitespace-nowrap">font-size: clamp(1.25rem, 0.9rem + 2.2vw, 2.75rem);</p>
                <p className="text-[13.5px] text-[#6f6a5e] dark:text-[#a89f8b] mt-3">The headlines on this page are already set this way. Shrink the browser window — slowly — and watch the big title at the top inhale.</p>
              </div>
            </article>

            {/* FRI — breakpoints */}
            <article className="relative pl-10 sm:pl-14">
              <span className="absolute left-0 top-2 w-[15px] h-[15px] sm:w-[19px] sm:h-[19px] rounded-full bg-[#f7f2e7] dark:bg-[#171410] border-[3px] border-[#b3546e] dark:border-[#e08ca4] transition-colors duration-500" aria-hidden="true" />
              <p className="font-mono text-[11px] tracking-wide text-[#6f6a5e] dark:text-[#a89f8b]">FRI — where to put the fences (bridges)</p>
              <div className="glass rounded-[1.6rem] rounded-tl-md p-6 sm:p-8 mt-3 max-w-3xl -rotate-[0.3deg]">
                <h3 className="font-display font-semibold text-[24px] leading-snug">Breakpoints are bridges, not fences.</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-[#4c473c] dark:text-[#cfc8b6]">
                  My first instinct was a breakpoint per device: this phone, that tablet. The kit
                  talks you out of it — devices multiply faster than you'll ever chase them. Instead:
                  stretch your own layout until it <em>breaks</em>, and put the bridge exactly there.
                  Rough neighbourhoods, not addresses:
                </p>
                <div className="relative mt-8 mb-2 mx-1" aria-hidden="true">
                  <div className="h-2.5 rounded-full bg-gradient-to-r from-[#4a7ca8] via-[#7ba7c9] to-[#b9dcbc] dark:from-[#33506e] dark:via-[#3d5a78] dark:to-[#2f4a2c]" />
                  {[["0", "0%"], ["480", "30%"], ["768", "58%"], ["1024", "84%"], ["∞", "99%"]].map(([v, l]) => (
                    <span key={v} className="absolute -top-1.5 -translate-x-1/2" style={{ left: l }}><span className="block w-[3px] h-5 rounded bg-[#26241f] dark:bg-[#f2ecdc] mx-auto" /><span className="block font-mono text-[9.5px] text-[#6f6a5e] dark:text-[#a89f8b] mt-1 -translate-x-[8%]">{v}px</span></span>
                  ))}
                </div>
                <p className="text-[13.5px] text-[#6f6a5e] dark:text-[#a89f8b] mt-7">Under 480 the page is one honest column; around 768 it can afford company; past 1024 it spreads out and caps its line length. The lab below lets you drive across all of it.</p>
                <p className="font-hand text-[20px] text-[#b3546e] dark:text-[#e08ca4] mt-3 rotate-[-1deg] inline-block">design for content breakage, not device models.</p>
              </div>
            </article>
          </div>
        </section>

        {/* ————————— THE LAB ————————— */}
        <section id="lab" aria-labelledby="lab-title" className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-20 sm:pt-24 pb-8 scroll-mt-28">
          <p className="font-hand text-[24px] text-[#4a7ca8] dark:text-[#8fc0ea] rotate-[-1.5deg] inline-block">the part where you squeeze it</p>
          <h2 id="lab-title" className="font-display font-semibold tracking-tight leading-[1.05] text-[clamp(2rem,4.5vw,3.2rem)] mt-1.5">The viewport lab</h2>
          <p className="mt-4 text-[15.5px] leading-relaxed text-[#4c473c] dark:text-[#cfc8b6] max-w-2xl">
            A tiny page inside this page, with its own weather. Drag the width and watch: the
            nav folds into a menu under 560px, the cards re-count themselves, the headline
            grows on its clamp() slope. This is the whole week in one toy.
          </p>

          <div className="glass rounded-[1.8rem] mt-10 overflow-hidden">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-4 p-6 sm:p-7 border-b border-white/70 dark:border-white/10">
              <div className="flex items-center gap-2 flex-wrap" role="group" aria-label="Preset widths">
                {([[360, "phone"], [768, "tablet"], [1024, "laptop"]] as [number, string][]).map(([w, l]) => (
                  <button key={l} onClick={() => { setLabW(w); setMenuOpen(false); }} aria-pressed={labW === w} className={`rounded-full px-4 py-2 text-[13px] font-medium transition-colors ${labW === w ? "bg-[#26241f] dark:bg-[#f2ecdc] text-white dark:text-[#26241f]" : "glass-soft hover:bg-white/80 dark:hover:bg-white/15"}`}>{l} · {w}</button>
                ))}
              </div>
              <label className="flex items-center gap-3 text-[13.5px] font-medium flex-1 min-w-[200px]">
                squeeze
                <input type="range" min={320} max={1080} step={4} value={labW} onChange={e => { setLabW(+e.target.value); if (+e.target.value >= 560) setMenuOpen(false); }} aria-label="Width of the demo viewport in pixels" className="accent-[#4a7ca8] dark:accent-[#8fc0ea] flex-1" />
                <span className="font-mono text-[12px] text-[#6f6a5e] dark:text-[#a89f8b] w-14">{labW}px</span>
              </label>
            </div>

            <div className="p-5 sm:p-8">
              {/* the little browser */}
              <div className="mx-auto transition-[width] duration-200 ease-out" style={{ width: `min(${labW}px, 100%)` }}>
                <div className="rounded-[1.4rem] border border-white/80 dark:border-white/15 shadow-[0_20px_44px_rgba(60,50,30,.18)] dark:shadow-[0_20px_44px_rgba(0,0,0,.5)] overflow-hidden bg-white/85 dark:bg-[#221e17] backdrop-blur">
                  <div className="flex items-center gap-2 px-4 py-2.5 bg-white/70 dark:bg-white/[0.06] border-b border-[#26241f]/8 dark:border-white/10">
                    <span className="flex gap-1.5" aria-hidden="true"><i className="w-2.5 h-2.5 rounded-full bg-[#e08ca4] block" /><i className="w-2.5 h-2.5 rounded-full bg-[#f3d97b] block" /><i className="w-2.5 h-2.5 rounded-full bg-[#a9d6ae] block" /></span>
                    <span className="mx-auto font-mono text-[10px] text-[#6f6a5e] dark:text-[#a89f8b] bg-white/80 dark:bg-white/10 rounded-full px-3 py-1">fluid.page — {labW}px</span>
                    <span className="w-10" aria-hidden="true" />
                  </div>
                  <div className="relative h-[348px] overflow-hidden">
                    {/* mini nav */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-[#26241f]/8 dark:border-white/10 relative z-20 bg-white/60 dark:bg-white/[0.04]">
                      <span className="flex items-center gap-2"><span className="w-6 h-6 rounded-lg bg-[#4a7ca8] grid place-items-center text-white font-mono text-[9px]">~</span><span className="font-display font-semibold text-[14px]">fluid.page</span></span>
                      {labW >= 560 ? (
                        <span className="flex gap-3 text-[11.5px] font-medium text-[#4c473c] dark:text-[#cfc8b6]" aria-hidden="true"><span>notes</span><span>map</span><span>grid</span><span className="text-[#4a7ca8] dark:text-[#8fc0ea]">ship it</span></span>
                      ) : (
                        <button onClick={() => setMenuOpen(v => !v)} aria-expanded={menuOpen} aria-label="Toggle the demo menu" className="w-10 h-10 grid place-items-center rounded-full glass-soft">
                          {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                        </button>
                      )}
                    </div>
                    {/* popover, with its ::backdrop */}
                    {labW < 560 && menuOpen && (
                      <div className="absolute inset-0 z-10">
                        <button aria-label="Close the demo menu" onClick={() => setMenuOpen(false)} className="absolute inset-0 bg-[#1d2733]/45 backdrop-blur-[1.5px] w-full cursor-default" />
                        <div className="absolute right-0 top-0 h-full w-[64%] glass p-5 pt-16 shadow-2xl">
                          <p className="font-hand text-[19px] text-[#6f6a5e] dark:text-[#a89f8b]">where to?</p>
                          <ul className="mt-3 space-y-1 text-[14px] font-medium">
                            {["notes", "the map", "the lab", "checklist"].map(l => <li key={l}><span className="block rounded-xl px-3 py-2.5 hover:bg-white/70 dark:hover:bg-white/10 cursor-pointer">{l}</span></li>)}
                          </ul>
                          <p className="font-mono text-[9px] text-[#9a927c] dark:text-[#8f8672] mt-5 leading-relaxed">this dimmed area is the ::backdrop. Esc closes it. focus behaves. zero javascript, in raw html.</p>
                        </div>
                      </div>
                    )}
                    {/* mini body */}
                    <div className="p-4">
                      <p className="font-display font-semibold leading-[1.08]" style={{ fontSize: heroPx }}>headlines that<br />pour, too.</p>
                      <p className="text-[11px] text-[#6f6a5e] dark:text-[#a89f8b] mt-1.5">clamp() is sizing this right now: <span className="font-mono">{heroPx}px</span> at {labW}px wide.</p>
                      <div className="grid gap-2.5 mt-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))" }}>
                        {[["notes", "#dcead9", "#2f4a2c"], ["the map", "#f6e3c2", "#4d3a1c"], ["the grid", "#d7e6f5", "#2b405a"], ["ship it", "#f3d3dc", "#552f3d"]].map(([t, bg, dbg]) => (
                          <div key={t} className="rounded-xl p-3 border border-white/70 dark:border-white/10" style={{ backgroundColor: dark ? dbg : bg }}>
                            <p className="font-display font-semibold text-[13px]">{t}</p>
                            <p className="font-mono text-[8.5px] opacity-60 mt-0.5">auto-fit · minmax(150px, 1fr)</p>
                            <span className="inline-block mt-2 rounded-full bg-[#26241f] dark:bg-[#f2ecdc] text-white dark:text-[#26241f] text-[9px] font-medium px-2.5 py-1.5 min-h-[24px]">open</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* readouts */}
              <dl className="flex flex-wrap gap-2.5 mt-6 justify-center" aria-live="polite">
                {[[`${labW}px`, "viewport"], [zone.split(" — ")[0], zone.split(" — ")[1] || ""], [labW >= 560 ? "full nav" : "hamburger", "navigation"], [`${cols} col${cols > 1 ? "s" : ""}`, "card grid"], [`${heroPx}px`, "headline"]].map(([v, l]) => (
                  <div key={l} className="glass-soft rounded-2xl px-3.5 py-2.5 text-center">
                    <dd className="font-display font-semibold text-[16px] leading-none">{v}</dd>
                    <dt className="text-[10.5px] text-[#6f6a5e] dark:text-[#a89f8b] mt-1">{l}</dt>
                  </div>
                ))}
              </dl>

              {/* breakpoint ruler */}
              <div className="relative mt-9 mx-2" aria-hidden="true">
                <div className="h-2 rounded-full bg-gradient-to-r from-[#4a7ca8] via-[#7ba7c9] to-[#b9dcbc] dark:from-[#33506e] dark:via-[#3d5a78] dark:to-[#2f4a2c]" />
                <span className="absolute -top-[7px] -translate-x-1/2 transition-[left] duration-200" style={{ left: `${needle}%` }}><span className="block w-[3px] h-[22px] rounded bg-[#c96f3b] mx-auto" /><span className="block w-2.5 h-2.5 rounded-full bg-[#c96f3b] mx-auto -mt-[26px] ring-2 ring-[#f7f2e7] dark:ring-[#16130e]" /></span>
                {[["480", 21], ["768", 59], ["1024", 92.6]].map(([v, l]) => (
                  <span key={v} className="absolute -top-1 -translate-x-1/2" style={{ left: `${l}%` }}><span className="block w-[2px] h-4 rounded bg-[#26241f]/50 dark:bg-white/50 mx-auto" /><span className="block font-mono text-[9px] text-[#6f6a5e] dark:text-[#a89f8b] mt-1">{v}</span></span>
                ))}
              </div>
              <p className="text-center font-hand text-[20px] text-[#6f6a5e] dark:text-[#a89f8b] mt-8">the orange needle is you, dragging. the ticks are just neighbourhoods.</p>
            </div>
          </div>

          <div className="glass-soft rounded-2xl mt-6 p-5 sm:p-6 flex flex-col sm:flex-row gap-4 items-start rotate-[-0.3deg] max-w-3xl">
            <p className="font-mono text-[11px] leading-relaxed bg-[#26241f] dark:bg-black/50 text-[#cfe3c8] rounded-xl px-4 py-3 shrink-0 overflow-x-auto whitespace-nowrap">&lt;button popovertarget="menu"&gt;…&lt;/button&gt;<br />&lt;nav id="menu" popover&gt;…&lt;/nav&gt;</p>
            <p className="text-[14px] leading-relaxed text-[#4c473c] dark:text-[#cfc8b6]">In raw HTML, the menu you just opened needs <strong className="text-[#26241f] dark:text-[#f2ecdc]">no JavaScript at all</strong> — the <code className="font-mono text-[12.5px] bg-white/70 dark:bg-white/10 px-1.5 py-0.5 rounded">popover</code> attribute brings the backdrop, the Esc key, and the focus manners for free. The kit calls it the Popover API; I call it the first free lunch of the course.</p>
          </div>
        </section>

        {/* ————————— thumbs & eyes ————————— */}
        <section id="thumbs" aria-labelledby="thumbs-title" className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-20 sm:pt-24 pb-8 scroll-mt-28">
          <p className="font-hand text-[24px] text-[#5b7553] dark:text-[#a7c69b] rotate-[-1.5deg] inline-block">designed for thumbs, checked by eyes</p>
          <h2 id="thumbs-title" className="font-display font-semibold tracking-tight leading-[1.05] text-[clamp(2rem,4.5vw,3.2rem)] mt-1.5">
            A finger is not a mouse
          </h2>
          <p className="mt-4 text-[15.5px] leading-relaxed text-[#4c473c] dark:text-[#cfc8b6] max-w-2xl">
            Precision: mouse &gt; finger. So mobile targets get bigger, live where thumbs
            already rest, and zoom is never, ever confiscated.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mt-10 items-start">
            {/* thumb zone + tap test */}
            <article className="glass rounded-[1.8rem] p-6 sm:p-7 -rotate-[0.3deg]">
              <h3 className="font-display font-semibold text-[20px]">The thumb map</h3>
              <div className="flex gap-5 mt-5 items-start">
                <div className="w-[118px] h-[218px] shrink-0 rounded-[1.5rem] border-[5px] border-[#26241f] dark:border-[#3a352b] relative overflow-hidden" role="img" aria-label="Phone diagram: the top of the screen is hard to reach, the middle is a stretch, the bottom is easy thumb territory"
                  style={{ background: "radial-gradient(120% 55% at 50% 108%, rgba(91,140,80,.85) 0%, rgba(91,140,80,0) 60%), radial-gradient(110% 50% at 50% 55%, rgba(243,201,90,.75) 0%, rgba(243,201,90,0) 62%), radial-gradient(120% 52% at 50% -6%, rgba(198,84,80,.8) 0%, rgba(198,84,80,0) 60%), #f3ecdb" }}>
                  <span className="absolute top-2.5 inset-x-0 text-center font-mono text-[8.5px] font-semibold text-[#7a2e26]">hard reach</span>
                  <span className="absolute top-[46%] inset-x-0 text-center font-mono text-[8.5px] font-semibold text-[#7a5b12]">a stretch</span>
                  <span className="absolute bottom-2.5 inset-x-0 text-center font-mono text-[8.5px] font-semibold text-[#2f5230]">easy ✓</span>
                </div>
                <div className="min-w-0">
                  <p className="text-[14px] leading-relaxed text-[#4c473c] dark:text-[#cfc8b6]">Most people hold the phone in one hand and drive with a thumb. Important things belong at the bottom; the destructive stuff can live up top, where it takes effort. Fair trade.</p>
                  <p className="text-[14px] leading-relaxed text-[#4c473c] dark:text-[#cfc8b6] mt-3">And every target gets at least <strong className="text-[#26241f] dark:text-[#f2ecdc]">44 × 44px</strong> (WCAG). Feel the difference:</p>
                  <div className="flex items-end gap-5 mt-4">
                    <span className="text-center">
                      <button onClick={() => setTapMsg("24px: doable. on a bus? good luck.")} aria-label="Try tapping the 24 pixel target" className="w-6 h-6 rounded-full bg-[#b3546e] text-white grid place-items-center mx-auto"><Check className="w-3 h-3" /></button>
                      <span className="block font-mono text-[9.5px] text-[#6f6a5e] dark:text-[#a89f8b] mt-1.5">24px ✕</span>
                    </span>
                    <span className="text-center">
                      <button onClick={() => setTapMsg("48px: landed it first try, didn't you.")} aria-label="Try tapping the 48 pixel target" className="w-12 h-12 rounded-full bg-[#5b7553] dark:bg-[#46603f] text-white grid place-items-center mx-auto"><Check className="w-5 h-5" /></button>
                      <span className="block font-mono text-[9.5px] text-[#6f6a5e] dark:text-[#a89f8b] mt-1.5">48px ✓</span>
                    </span>
                  </div>
                  <p className="font-hand text-[19px] text-[#6f6a5e] dark:text-[#a89f8b] mt-3" aria-live="polite">{tapMsg}</p>
                </div>
              </div>
            </article>

            {/* zoom + container queries */}
            <div className="space-y-6">
              <article className="glass rounded-[1.8rem] p-6 sm:p-7 rotate-[0.3deg]">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <h3 className="font-display font-semibold text-[20px]">Zoom is a right, not a setting</h3>
                  <span className="font-mono text-[11px] text-[#9a927c] dark:text-[#8f8672] line-through decoration-[#b3546e] decoration-2">user-scalable=no</span>
                </div>
                <p className="text-[14px] leading-relaxed text-[#4c473c] dark:text-[#cfc8b6] mt-2">Some sites confiscate pinch-zoom to look “app-like”. WCAG says allow magnification — up to <strong className="text-[#26241f] dark:text-[#f2ecdc]">500%</strong>. This paragraph is inside the phone. Take it there:</p>
                <div className="rounded-[1.3rem] border-[5px] border-[#26241f] dark:border-[#3a352b] bg-white dark:bg-[#201c15] h-[168px] overflow-auto p-4 mt-4">
                  <p className="leading-relaxed transition-[font-size] duration-150" style={{ fontSize: 13 * (zoom / 100) }}>Still reading me at {zoom}%? Good. Text should survive being big — reflow, don't riot.</p>
                  <p className="leading-relaxed mt-2 text-[#6f6a5e] dark:text-[#a89f8b] transition-[font-size] duration-150" style={{ fontSize: 11 * (zoom / 100) }}>this page never disables zoom. neither will yours, now.</p>
                </div>
                <label className="flex items-center gap-3 text-[13px] font-medium mt-4">
                  magnification
                  <input type="range" min={100} max={500} step={25} value={zoom} onChange={e => setZoom(+e.target.value)} aria-label="Magnification, 100 to 500 percent" className="accent-[#4a7ca8] dark:accent-[#8fc0ea] flex-1" />
                  <span className="font-mono text-[12px] w-12">{zoom}%</span>
                </label>
              </article>

              <article className="glass-soft rounded-[1.8rem] p-6 sm:p-7 -rotate-[0.3deg]">
                <h3 className="font-display font-semibold text-[18px]">One last trick — components that measure <em>themselves</em></h3>
                <p className="text-[13.5px] leading-relaxed text-[#4c473c] dark:text-[#cfc8b6] mt-2">Container queries: the same card, twice. It rearranges by its <em>own</em> width, never asking the viewport. “Coding for the device that hasn't been invented yet.”</p>
                <div className="flex flex-wrap gap-4 mt-4 items-start">
                  <div className="w-[190px] shrink-0">
                    <div className="@container glass rounded-2xl p-3">
                      <div className="flex flex-col @min-[300px]:flex-row gap-2.5 @min-[300px]:items-center">
                        <span className="w-9 h-9 rounded-xl bg-[#4a7ca8] shrink-0 grid place-items-center text-white font-mono text-[10px]">cq</span>
                        <span><strong className="block text-[13px] leading-tight">the card</strong><span className="block text-[11px] text-[#6f6a5e] dark:text-[#a89f8b] leading-snug">narrow home → stacked</span></span>
                      </div>
                    </div>
                    <p className="font-mono text-[9px] text-center text-[#9a927c] dark:text-[#8f8672] mt-1.5">190px wide</p>
                  </div>
                  <div className="flex-1 min-w-[240px]">
                    <div className="@container glass rounded-2xl p-3">
                      <div className="flex flex-col @min-[300px]:flex-row gap-2.5 @min-[300px]:items-center">
                        <span className="w-9 h-9 rounded-xl bg-[#4a7ca8] shrink-0 grid place-items-center text-white font-mono text-[10px]">cq</span>
                        <span><strong className="block text-[13px] leading-tight">the same card</strong><span className="block text-[11px] text-[#6f6a5e] dark:text-[#a89f8b] leading-snug">wide home → spreads out, all by itself</span></span>
                      </div>
                    </div>
                    <p className="font-mono text-[9px] text-center text-[#9a927c] dark:text-[#8f8672] mt-1.5">wide — same code, no viewport involved</p>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* ————————— checklist ————————— */}
        <section id="checklist" aria-labelledby="checklist-title" className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-20 sm:pt-24 pb-24 scroll-mt-28">
          <div className="text-center max-w-2xl mx-auto">
            <p className="font-hand text-[24px] text-[#4a7ca8] dark:text-[#8fc0ea] rotate-[-1.5deg] inline-block">project 2 · implementation checklist</p>
            <h2 id="checklist-title" className="font-display font-semibold tracking-tight leading-[1.05] text-[clamp(2.1rem,5vw,3.4rem)] mt-1.5">
              Six checks before<br />it meets a stranger's phone
            </h2>
            <p className="mt-4 text-[15.5px] leading-relaxed text-[#4c473c] dark:text-[#cfc8b6]">
              Straight from the kit. Two are already ticked by this page's construction — verify
              them like you mean it, then earn the other four.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 mt-12 items-start max-w-5xl mx-auto">
            <fieldset className="lg:col-span-8 glass rounded-[1.8rem] p-6 sm:p-8 -rotate-[0.3deg]">
              <legend className="sr-only">Project 2 implementation checklist</legend>
              <ul>
                {CHECKS.map((c, i) => (
                  <li key={c.tag} className={i > 0 ? "border-t border-dashed border-[#26241f]/15 dark:border-white/10" : ""}>
                    <label className="flex gap-4 py-4 cursor-pointer group">
                      <input type="checkbox" checked={checked[i]} onChange={() => setChecked(prev => prev.map((v, j) => (j === i ? !v : v)))} className="sr-only" aria-describedby={`p2note-${i}`} />
                      <span aria-hidden="true" className={`w-6 h-6 rounded-[7px] shrink-0 mt-0.5 grid place-items-center border-2 transition-all ${checked[i] ? "bg-[#4a7ca8] dark:bg-[#33506e] border-[#4a7ca8] dark:border-[#33506e] text-white rotate-[-4deg]" : "border-[#26241f]/35 dark:border-white/30 bg-white/60 dark:bg-white/10 group-hover:border-[#4a7ca8] dark:group-hover:border-[#8fc0ea]"}`}>
                        {checked[i] && <Check className="w-4 h-4" strokeWidth={3} />}
                      </span>
                      <span className="flex-1">
                        <span className="flex items-baseline gap-2.5 flex-wrap">
                          <strong className={`font-display font-semibold text-[17px] ${checked[i] ? "line-through decoration-[#4a7ca8] dark:decoration-[#8fc0ea] decoration-2 text-[#6f6a5e] dark:text-[#a89f8b]" : ""}`}>{c.title}</strong>
                          <span className="font-hand text-[17px] text-[#9a927c] dark:text-[#8f8672]">{c.tag}</span>
                        </span>
                        <span id={`p2note-${i}`} className="block text-[13.5px] text-[#6f6a5e] dark:text-[#a89f8b] leading-relaxed mt-0.5">{c.note}</span>
                      </span>
                      <span className={`font-hand text-[18px] shrink-0 ${checked[i] ? "text-[#4a7ca8] dark:text-[#8fc0ea]" : "text-[#b6ad97] dark:text-[#7d7663]"}`} aria-hidden="true">{checked[i] ? "done" : "pending"}</span>
                    </label>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap items-center gap-3 mt-5">
                <div className="flex-1 min-w-[180px]">
                  <div className="flex justify-between text-[12px] text-[#6f6a5e] dark:text-[#a89f8b]"><span>progress</span><span aria-live="polite">{done} of 6 · {pct}%</span></div>
                  <div className="h-2.5 rounded-full bg-white/70 dark:bg-white/10 border border-white/80 dark:border-white/15 mt-1.5 overflow-hidden" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Checklist progress">
                    <div className={`h-full rounded-full transition-all duration-500 ${unlocked ? "bg-[#5b7553] dark:bg-[#7ba06f]" : "bg-[#4a7ca8] dark:bg-[#7ba7c9]"}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
                <button onClick={() => setChecked(Array(6).fill(true))} className="text-[13px] font-medium bg-[#26241f] dark:bg-[#f2ecdc] text-white dark:text-[#26241f] rounded-full px-4 py-2 hover:bg-[#4a7ca8] dark:hover:bg-[#8fc0ea] hover:text-white dark:hover:text-[#26241f] transition-colors">tick all</button>
                <button onClick={() => setChecked(Array(6).fill(false))} className="text-[13px] font-medium glass-soft rounded-full px-4 py-2 hover:bg-white/80 dark:hover:bg-white/15 transition-colors">start over</button>
              </div>
            </fieldset>

            <div className="lg:col-span-4 relative">
              <Sticky tone={unlocked ? "mint" : "sky"} className="rotate-2 lg:mt-6">
                {unlocked ? (
                  <>badge no. 2 earned. the page survives pockets now — <strong>project 3 unlocks next week.</strong></>
                ) : (
                  <>six checks and badge no. 2 is yours. it stacks with last week's — literally, they're both in this notebook.</>
                )}
              </Sticky>
              <div className={`glass rounded-[1.6rem] p-6 mt-8 -rotate-[0.6deg] text-center transition-all ${unlocked ? "ring-2 ring-[#4a7ca8]/50 dark:ring-[#8fc0ea]/40" : ""}`}>
                <span className={`w-20 h-20 mx-auto rounded-full grid place-items-center transition-colors ${unlocked ? "bg-[#4a7ca8] dark:bg-[#33506e] text-white" : "glass-soft text-[#b6ad97] dark:text-[#7d7663]"}`}>
                  {unlocked ? <BadgeCheck className="w-9 h-9" /> : <Lock className="w-7 h-7" />}
                </span>
                <p className="font-display font-semibold text-[21px] mt-4 leading-snug">{unlocked ? "Badge No. 2. Fluid." : "Badge No. 2 is in this box"}</p>
                <p className="text-[13.5px] text-[#6f6a5e] dark:text-[#a89f8b] leading-relaxed mt-1.5">
                  {unlocked ? "Viewport set, mobile-first, fluid units, popover nav, thumbs respected. Certified poured." : "Six of six unlocks it. The sticky note is keeping score, same as last week."}
                </p>
                {unlocked && <a href="#submit" className="inline-flex items-center gap-2 mt-4 bg-[#26241f] dark:bg-[#f2ecdc] text-white dark:text-[#26241f] rounded-full px-5 py-2.5 text-[13.5px] font-medium hover:bg-[#4a7ca8] dark:hover:bg-[#8fc0ea] hover:text-white dark:hover:text-[#26241f] transition-colors">Now: hand it in <ArrowRight className="w-4 h-4" /></a>}
              </div>
            </div>
          </div>
        </section>

        {/* ————————— hand it in ————————— */}
        <section id="submit" aria-labelledby="submit-title" className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-4 pb-24 scroll-mt-28">
          <div className="max-w-2xl">
            <p className="font-hand text-[24px] text-[#5b7553] dark:text-[#a7c69b] rotate-[-1.5deg] inline-block">same drill as week one — easier now</p>
            <h2 id="submit-title" className="font-display font-semibold tracking-tight leading-[1.05] text-[clamp(2.1rem,5vw,3.4rem)] mt-1.5">Ready to hand it in</h2>
            <p className="mt-4 text-[15.5px] leading-relaxed text-[#4c473c] dark:text-[#cfc8b6]">
              The machine from last week returns, slightly wiser. The repo already exists this
              time — that's the whole point of having set it up properly.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-10 lg:gap-8 mt-12 items-start">
            <ol className="lg:col-span-5 space-y-7 lg:pt-2">
              {[
                ["Break it on purpose first", "Drag the lab slider through every width. Then do it for real: Chrome DevTools device toolbar (the little phone icon) at 360px, 768px, and full width. Hunting for: sideways scrollbars, tap targets having a shy day, text escaping its box."],
                ["Then the real judges", "W3C validator again — zero errors. Lighthouse again, but this time read the Mobile score first. Most of your visitors are the mobile score."],
                ["Same repo, second commit", "No new setup — last week's repo takes a second commit and your portfolio quietly becomes a series:"],
                ["Write the note", "Machine on the right. New links if they changed, one honest sentence, and the checklist score fills itself in again."],
                ["Send it where week 1 went", "Same place, same drill. Two projects down, and the page now survives pockets. Onward."],
              ].map(([t, d], i) => (
                <li key={t} className="flex gap-4">
                  <span className="font-hand text-[28px] leading-none text-[#4a7ca8] dark:text-[#8fc0ea] w-7 shrink-0" aria-hidden="true">{i + 1}.</span>
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
                      <pre className="glass-dark text-[#cfe3c8] rounded-2xl mt-3 p-4 font-mono text-[11.5px] leading-relaxed overflow-x-auto"><code>{`git add -A\ngit commit -m "week 2: the page learned to pour"\ngit push`}</code></pre>
                    )}
                  </div>
                </li>
              ))}
              <li>
                <Sticky tone="mint" className="w-60 rotate-[-1.5deg] ml-11">
                  if it works at 360px on a bus, it works anywhere. <strong>ship the small screen first.</strong>
                </Sticky>
              </li>
            </ol>

            <div className="lg:col-span-7">
              <div className="glass rounded-[1.8rem] p-6 sm:p-8 rotate-[0.3deg] relative">
                <Tape className="absolute -top-3 right-10 rotate-2" />
                <h3 className="font-display font-semibold text-[20px]">The submission note, week 2</h3>
                <p className="text-[13.5px] text-[#6f6a5e] dark:text-[#a89f8b] mt-1.5">Same four fields. It pulls your checklist score live — finish the six above and watch.</p>

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
                  <p className="font-hand text-[19px] text-[#6f6a5e] dark:text-[#a89f8b] mt-3 rotate-[-0.8deg] inline-block">paste, push, breathe out. week two, done.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ————————— sign-off ————————— */}
        <section aria-labelledby="letter2-title" className="relative max-w-3xl mx-auto px-5 sm:px-8 pb-24">
          <figure className="text-center">
            <blockquote className="font-display font-medium italic leading-[1.25] tracking-tight text-[clamp(1.6rem,4vw,2.5rem)] text-[#33302a] dark:text-[#ece5d3]">
              “Coding for the device that hasn't been invented yet.”
            </blockquote>
            <figcaption className="font-hand text-[20px] text-[#6f6a5e] dark:text-[#a89f8b] mt-4">— the kit, on future-proofing. it's under the sitemap now, next to last week's quote.</figcaption>
          </figure>

          <article className="glass ruled rounded-[1.8rem] p-7 sm:p-10 mt-12 rotate-[-0.3deg] relative">
            <Tape className="absolute -top-3 left-1/2 -translate-x-1/2 rotate-2" />
            <h2 id="letter2-title" className="font-display font-semibold text-[22px]">A short letter, again</h2>
            <div className="mt-4 space-y-4 text-[15px] leading-[1.75] text-[#4c473c] dark:text-[#cfc8b6]">
              <p>
                Last week's page was a poster — right, but rigid. This week it became
                something closer to <span className="hl-mint">water</span>: same content, honest at 360px,
                comfortable at 1440px, and unbothered by everything in between. Nobody maintains
                five versions of a page. You build one that doesn't need them.
              </p>
              <p>
                The things that stuck: the small screen isn't the compromise version — for most
                visitors it <em>is</em> the version, so it gets designed first. Breakpoints go
                where the content breaks, not where a phone launches. And a menu that used to
                need a JavaScript framework now needs one attribute. The web grew up a bit while
                I wasn't looking.
              </p>
              <p>
                Project 2 of a few. The portfolio is becoming a series — same desk, same coffee,
                slightly wider horizons.
              </p>
            </div>
            <p className="font-hand text-[26px] text-[#26241f] dark:text-[#f2ecdc] mt-7 rotate-[-1.5deg] inline-block">— thanks for squeezing the page. see you in project 3.</p>
          </article>

          <div className="mt-10 text-center">
            <p className="font-hand text-[21px] text-[#6f6a5e] dark:text-[#a89f8b]">when you get stuck (you will) —</p>
            <div className="flex flex-wrap justify-center gap-2.5 mt-4">
              {[["MDN Web Docs", "https://developer.mozilla.org"], ["CSS-Tricks", "https://css-tricks.com"], ["Can I Use", "https://caniuse.com"], ["Fluid type calculator", "https://utopia.fyi/type/calculator/"]].map(([l, h]) => (
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
              <p className="font-display font-semibold text-[26px] leading-tight">Thank <em className="text-[#5b7553] dark:text-[#a7c69b]">you</em>, again.</p>
              <p className="text-[13.5px] text-[#6f6a5e] dark:text-[#a89f8b] leading-relaxed mt-2">Project 2 · Responsive Web Layout. One page, every screen — poured by a person, at the same desk, coffee upgraded to a bigger mug.</p>
              <nav aria-label="Footer" className="mt-4">
                <ul className="flex flex-wrap gap-x-4 gap-y-1.5">
                  {[...NAV, { label: "hand it in", href: "#submit" }, { label: "week 1", href: "?week=1" }].map(n => <li key={n.label}><a href={n.href} className="text-[13px] text-[#4c473c] dark:text-[#cfc8b6] underline decoration-[#c9bfa5] dark:decoration-[#5c564a] underline-offset-4 hover:decoration-[#4a7ca8] dark:hover:decoration-[#8fc0ea] hover:text-[#26241f] dark:hover:text-white">{n.label}</a></li>)}
                </ul>
              </nav>
            </div>
            <address className="not-italic">
              <p className="font-hand text-[21px] text-[#5b7553] dark:text-[#a7c69b]">say hello — decodelabs</p>
              <ul className="mt-3 space-y-2.5 text-[14px]">
                <li><a href="tel:+918933006408" className="flex items-center gap-2.5 hover:text-[#5b7553] dark:hover:text-[#a7c69b] transition-colors"><Phone className="w-4 h-4 text-[#4a7ca8] dark:text-[#8fc0ea]" /> +91 89330 06408</a></li>
                <li><a href="mailto:decodelabs.tech@gmail.com" className="flex items-center gap-2.5 hover:text-[#5b7553] dark:hover:text-[#a7c69b] transition-colors"><Mail className="w-4 h-4 text-[#4a7ca8] dark:text-[#8fc0ea]" /> decodelabs.tech@gmail.com</a></li>
                <li><a href="https://www.decodelabs.tech" target="_blank" rel="noreferrer" className="flex items-center gap-2.5 hover:text-[#5b7553] dark:hover:text-[#a7c69b] transition-colors"><Globe className="w-4 h-4 text-[#4a7ca8] dark:text-[#8fc0ea]" /> www.decodelabs.tech <ArrowUpRight className="w-3.5 h-3.5" /></a></li>
                <li className="flex items-center gap-2.5 text-[#6f6a5e] dark:text-[#a89f8b]"><MapPin className="w-4 h-4 text-[#4a7ca8] dark:text-[#8fc0ea]" /> Greater Lucknow, India</li>
              </ul>
            </address>
            <div className="font-hand text-[20px] leading-snug text-[#6f6a5e] dark:text-[#a89f8b] rotate-[-1.5deg] max-w-[11rem]">
              built once. fits everything. checked twice.
            </div>
          </div>
          <div className="mt-8 pt-5 border-t border-[#26241f]/10 dark:border-white/10 flex flex-col sm:flex-row justify-between gap-2 text-[12px] text-[#9a927c] dark:text-[#8f8672]">
            <span>© 2026 DecodeLabs · Frontend Development — Batch 2026</span>
            <span>be water. ship it.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
