# NOVA — React Component Library v2
### (Fable 5 cinematic pass)

The full React breakdown of the upgraded NOVA landing page — preloader,
custom cursor, film grain, magnetic buttons, a continuously-interpolated
services sweep, and four hand-illustrated, living SVG story scenes.

## Content editing, SEO and hosting (GoDaddy cPanel)

Site copy is **not** in the JS bundle. It lives in `public/content/*.json` and is
edited live on the server through a login-gated admin at **`/admin`**:

| File | Edited in admin as | Used by |
|------|--------------------|---------|
| `content/home.json` | Home page text (hero H1, services, about, story blocks, clients, contact) | React + `seo.php` |
| `content/seo.json`  | Home page SEO (title, meta description, share image) | `seo.php` |
| `content/work.json` | Case studies (summary, SEO title/description, photo alt text) | React + `seo.php` + `sitemap.php` |
| `content/pages.json` | Section pages: the full pages behind the home page's buttons (`/about`, `/services`, `/philosophy`, `/how-we-think`, `/brand-reach`) | React + `seo.php` + `sitemap.php` |

- **Section pages ("Read more"):** each page is off by default. While off it is a draft: no button on the home page, no URL (404),
  not in the sitemap. The media buyer writes it in *Admin → Section pages* (headings, paragraphs, bullet lists, links), then ticks
  *Page is live*. Once About or Services is live, the menu's original *About* / *Services* tab (navbar, mobile menu and
  footer) opens that page instead of scrolling to the section (`src/hooks/useSectionNav.js`). Button text must be descriptive ("More about NOVA", not "Read more"). A page that other live content links to
  can't be switched off until those links are removed. Starter text ships in `public/defaults/pages.json`; the first save creates
  `content/pages.json`, and both are merged by slug, so a code update can add a page without touching live content.
- **Edit conflicts:** every editor form remembers the version it opened. If someone else (or another tab) saved in between,
  the save is refused instead of overwriting their work.

- **Links in text:** rich fields accept `[visible text](url)`. The admin has an *Insert link*
  button and a live preview. Allowed: `https://…`, `mailto:…`, `tel:…`, `/work/<slug>`, `/#about`,
  `/#services`, `/#portfolio`, `/#clients`, `/#contact`. Internal links are checked against real pages.
  Grammar: `public/admin/richtext.php` (PHP) and `src/lib/richText.js` (JS), kept in sync by `npm run test:content`.
- **SEO router:** `.htaccess` sends every page URL through `seo.php`, which returns `index.html`
  with that page's title, description, canonical, social tags, JSON-LD and a crawlable text copy
  (hidden from JS visitors). Unknown URLs return a real 404. `sitemap.xml` is generated live.
- **Roles:** `admin` can do everything. `mediabuyer` edits text/SEO/alt text and adds case studies,
  but can't change URLs (slugs) or delete.
- **Safety:** every save keeps the previous version. *Admin → History → Restore* undoes any change.
  Changes are logged in `admin/data/audit.log`.

### Local development

```bash
npm install
npm run dev            # site + real PHP admin at http://localhost:5173/admin/
```

`npm run dev` starts PHP's built-in server for `/admin`, `/contact.php` and `/sitemap.xml`
(requires PHP: `brew install php`). The first run prints local admin logins. They're stored in
`.dev/admin-data/` and never shipped. **Saving in the local admin edits `public/content/*.json`,**
so revert those files if you don't want to keep test edits.

### Preview exactly like GoDaddy (Apache + .htaccess)

```bash
npm run build
npm run preview:apache     # Docker php:8.2-apache → http://localhost:8090
npm run test:admin         # 40 end-to-end checks (redirects, 404s, admin, links, restore…)
npm run preview:apache -- stop
```

`npm run test:content` checks the PHP and JS link parsers agree.

### Deploy to GoDaddy cPanel

1. In cPanel → *MultiPHP Manager*, set the domain to **PHP 8.1 or newer** (7.4 minimum).
2. Create the real admin logins (once): `php scripts/make-admin-user.php`. Note the printed
   passwords. To choose your own: `--mediabuyer=YourLongPassword`.
3. `npm run package` builds the site and creates two zips in `deploy/`:
   - `first-install.zip` (**first upload only**) includes `content/`.
   - `site-update.zip` (**every later redeploy**) has no `content/` and no logins, so the media
     buyer's live edits are never overwritten.
4. cPanel → File Manager → `public_html` → Upload the zip → Extract. Then upload
   `public/admin/data/users.php` to `public_html/admin/data/` (first time, or when passwords change).
5. If the SSL certificate isn't active yet, delete the 3 "Force HTTPS" lines in `.htaccess`.
6. Optional live check: `BASE=https://novaadv.com npm run test:admin -- --read-only`.
7. Submit `https://novaadv.com/sitemap.xml` in Google Search Console.

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
