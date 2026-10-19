# my first webpage, built slowly — then taught to pour

**DecodeLabs · Frontend Development — Batch 2026**
Project 1: Static Webpage Design → Project 2: Responsive Web Layout

**Live page:** _add your link here_

Two weeks, two pages, each in its own file:
- **Week 1** (`src/Project1.tsx`) — open with `?week=1`
- **Week 2** (`src/Project2.tsx`) — the default page

---

# Project 1 — my first webpage, built slowly

One static page that is both the project *and* the write-up of the project.
Project 1's rule sounded boring and turned out to be the whole job:
**structure first, styling second.** No animations for show, no shortcuts —
just a page that says what it means to browsers, screen readers, and whoever
reads it next.

## What it demonstrates (the flight checklist, on the page itself)

| Requirement | Where to see it |
|---|---|
| **IA** — sitemap drawn first | "What's taped above my desk" — the map vs. the vehicle (nav = 4 stops, no "misc") |
| **HTML** — semantic tags, exactly one `<h1>` | Field note #2: my div soup era, with the before/after toggle |
| **CSS** — one stylesheet, DRY classes, no styling by ID | Field note #4: `.button` defined once, `--primary` for the difference |
| **Layout** — Grid for the page, Flexbox inside components | The layout sandbox — flip between them and drag the gap slider |
| **Assets** — images with size + real alt text | Every photo ships `width`, `height` and a description; zero layout shift |
| **Validation** — checked before calling it done | The "quality gate" mini-audit on the page; real pass via W3C Validator + Lighthouse |
| **Dark mode** | The moon in the nav ("lights out") — saved choice, OS-aware, no flash |

## Run it locally

```bash
npm install     # once
npm run dev     # develop
npm run build   # production build → dist/
```

## How it's put together

- `src/App.tsx` — the whole page: hero, field notes, sitemap, sandbox, audit, checklist, sign-off
- `src/index.css` — the design system (glassmorphism, notebook paper, dark theme) — styles live in **one** place, per the CSS rule
- Built with React, Vite and Tailwind CSS; icons by Lucide

## What I actually learned

Draw the map before writing code. Name things honestly (`<div id="top-thing">`
helps no one). Write the style once and reuse it. Size the image before it
loads. Check before you ship. Small rules — they compound.

---
*Project 1 of the DecodeLabs Frontend Development track. Project 2 unlocks next week.*

---

# Project 2 — the page learned to pour

**Responsive Web Layout** — week 1's poster becomes water: one page, no fixed
shape, honest at 360px and comfortable at 1440px.

## What it demonstrates (the implementation checklist, on the page itself)

| Requirement | Where to see it |
|---|---|
| **Meta tag** `width=device-width` | Field note #1: the lie vs. the truth, in a phone you can flip |
| **Mobile-first** base CSS, `min-width` queries | Field note #2: the pyramid — tap a layer, read its media query |
| **Layout** — Grid (macro) & Flexbox (micro) | Field note #3: the rook, the king, and the house/furniture rule |
| **Fluid units** (%, rem, vw) + `clamp()` type | Field note #4: drag the pretend viewport, watch type breathe |
| **Hamburger / Popover** navigation | The viewport lab: squeeze under 560px and tap the menu |
| **Touch targets & zoom** | "A finger is not a mouse": thumb map, 24px vs 48px tap test, 500% zoom slider |

Plus: breakpoints as bridges (where content breaks, not device models), a
resizable viewport lab with live readouts, and container queries — components
that measure themselves.

## What I actually learned (week 2)

The small screen isn't the compromise — for most visitors it *is* the page,
so it gets designed first. Breakpoints go where the content breaks, not where
a phone launches. And a menu that used to need a framework now needs one
`popover` attribute.

---

*Two of a few. Same desk, same coffee, slightly wider horizons.*
