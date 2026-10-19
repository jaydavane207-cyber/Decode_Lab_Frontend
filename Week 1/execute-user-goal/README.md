# my first webpage, built slowly

**DecodeLabs · Frontend Development — Project 1: Static Webpage Design** · Batch 2026

**Live page:** _add your link here_

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
