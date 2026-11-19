# NOVA — React Component Library v2
### (Fable 5 cinematic pass)

The full React breakdown of the upgraded NOVA landing page — preloader,
custom cursor, film grain, magnetic buttons, a continuously-interpolated
services sweep, and four hand-illustrated, living SVG story scenes.

## File Structure

```
src/
├── App.jsx                        ← Root — assembles every section
├── tokens.js                      ← Design tokens (colours, fonts, radii)
├── styles/
│   └── GlobalStyles.jsx           ← Every CSS var, class, and keyframe
│                                     animation (~40 of them) as one
│                                     injected <style> block
├── data/
│   └── index.js                   ← All static copy, lists, config
├── hooks/
│   ├── useScrollEngine.js         ← Shared lerped-scroll RAF loop
│   ├── useReveal.js               ← IntersectionObserver reveal (.rv classes)
│   ├── useTilt.js                 ← 3D magnetic tilt + specular shine
│   ├── useMagnet.js               ← Magnetic button pull effect
│   ├── useSplitChars.js           ← Hero headline char-cascade split
│   └── useCountUp.js              ← Scroll-triggered number count-up
└── components/
    ├── NovaLogo.jsx                ← SVG brand mark (reusable)
    ├── Preloader.jsx                ← 0→100% curtain-lift loading screen
    ├── Grain.jsx                    ← Film grain overlay
    ├── Cursor.jsx                   ← Custom cursor + "View" morph
    ├── ProgressBar.jsx              ← Top scroll progress bar
    ├── Navbar.jsx                   ← Fixed nav, glass on scroll
    ├── Hero.jsx                     ← Three.js scene + char-cascade headline
    ├── Stats.jsx                    ← Sticky pinned count-up stats
    ├── Services.jsx                 ← Continuously-interpolated card sweep
    ├── About.jsx                    ← Split layout + 3D tilt cards
    ├── Portfolio.jsx                ← 3D flip cards + cursor morph
    ├── Clients.jsx                  ← Dual-direction infinite ticker
    ├── Contact.jsx                  ← CTA section with pulsing glow
    ├── Footer.jsx                   ← Logo + nav links + copyright
    └── story/
        ├── IEIBlock.jsx             ← "Imagination. Energy. Impact."
        ├── SMSBlock.jsx             ← "Strategy meets Story." (scroll timeline)
        ├── FFWBlock.jsx             ← "Factory floor → world stage" (2 scenes)
        ├── YBEBlock.jsx             ← "Your brand, everywhere" (4 scenes)
        ├── SceneSVG.jsx             ← Shared illustration hover wrapper
        └── illustrations/
            ├── factory.js           ← Raw SVG string: the factory scene
            ├── booth.js              ← Raw SVG string: the booth scene
            ├── roadshow.js           ← Raw SVG string: branded van scene
            ├── retail.js             ← Raw SVG string: mall activation scene
            ├── toll.js                ← Raw SVG string: toll gantry scene
            └── instore.js             ← Raw SVG string: in-store demo scene
```

## Quick Start

```bash
npm create vite@latest nova-site -- --template react
cd nova-site
# copy all files from this folder into src/
npm install
npm run dev
```

Add to `index.html` `<head>`:
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Bodoni+Moda:ital,opsz,wght@1,6..96,500;1,6..96,600&display=swap" rel="stylesheet">
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
```

## What's new vs. v1

| Feature | How it works |
|---|---|
| **Preloader** | `Preloader.jsx` counts 0→100% then lifts away; calls `onDone()` which adds `body.loaded` — that single class flip choreographs the entire hero entrance via CSS (`body.loaded .hero-eyebrow{...}` etc. in GlobalStyles) |
| **Shared scroll engine** | `useScrollEngine.js` runs ONE `requestAnimationFrame` loop for the whole page and lerps raw `scrollY` into a smoothed value, so every parallax effect (ghost numbers, orbs, hero fade) reads buttery instead of jittery — instead of each component running its own loop |
| **Continuous services sweep** | `Services.jsx` computes each card's position as a continuous function of scroll progress (not stepped states), with its own internal lerp on top of the shared one, for a fluid glide instead of a snap |
| **Living illustrations** | The 6 SVG scenes (factory, booth, roadshow, retail, toll, in-store) are extracted as raw markup strings and rendered via `dangerouslySetInnerHTML` — hand-converting ~300 attributes to camelCase JSX per illustration wasn't worth the typo risk when the source is already pixel-tested. The animation (spinning wheels, rising barriers, drifting smoke, flickering windows) is pure CSS classes baked into the markup, so it runs on the compositor thread for free |
| **Magnetic buttons** | `useMagnet.js` — buttons drift toward the cursor while it's inside their bounds |
| **Custom cursor morph** | `Cursor.jsx` — dot + lagging ring; morphs into a solid red "View" badge over portfolio cards (`.pview` class) |
| **Film grain** | `Grain.jsx` — SVG turbulence noise stepping through 8 offset positions |
| **Character-cascade headline** | `useSplitChars.js` + `Hero.jsx` — the hero title splits into individual `<span>` chars that cascade up with staggered delay |

## Why GlobalStyles instead of CSS Modules / styled-components

This design leans on ~40 keyframe animations (shimmer text, spinning
wheels, rising toll barriers, drifting smoke, dot pulse, card-tilt
shine, the whole reveal system). Re-implementing all of that as
per-frame inline-style JS updates would be slower (main thread instead
of compositor) and much more error-prone to port. `GlobalStyles.jsx`
renders the exact CSS from the shipped page as one `<style>` block —
render it once near the top of `<App />` and every component below
just references the matching `className`.

## Customising

All copy lives in `src/data/index.js` — edit `SERVICES`, `PORTFOLIO_ITEMS`,
`YBE_CARDS`, `SMS_STEPS`, etc.

All colours live in `src/tokens.js` and as CSS vars at the top of
`GlobalStyles.jsx`:
```js
pulse: '#EC2027',   // brand red
hot:   '#FF3B41',   // lighter red (hover)
ember: '#FF6B4A',   // warm accent
void:  '#0A0808',   // page background
```
