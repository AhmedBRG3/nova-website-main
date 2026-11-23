// ─────────────────────────────────────────
//  Case studies for the Portfolio section.
//  Content lives in /content/work.json on the server and is
//  edited by the media buyer through /admin (public/admin/index.php),
//  so changes go live with no rebuild. loadContent() runs once
//  before React renders (see main.jsx) and fills the live bindings
//  below; every other module keeps importing the same names.
//  It also fetches /content/home.json and merges it into the
//  home-page copy in ./index.js (bundled defaults stay if it fails),
//  and loads the "Read more" section pages: /defaults/pages.json
//  (shipped with the code) merged by slug with /content/pages.json
//  (written by the admin's first save; may not exist yet).
// ─────────────────────────────────────────
import { applyHomeContent } from './index';

export let CASE_STUDIES = [];
export let PHOTO_TO_CASE_STUDY = {};
export let SEO_CONTENT = {
  home: { title: 'NOVA — Brand Activations, Events & Exhibitions in Cairo, Egypt', description: '', ogImage: '/og-image.jpg' },
  workDefaultDescription: '',
};

export function getCaseStudy(slug) {
  return CASE_STUDIES.find((c) => c.slug === slug);
}

/** All section pages (enabled or not), defaults merged with live content. */
export let PAGES = [];

/** Live-content entries win field by field; pages only in the defaults are kept. */
export function mergePages(defaults, content) {
  const live = Object.fromEntries((Array.isArray(content) ? content : []).map((p) => [p.slug, p]));
  const merged = (Array.isArray(defaults) ? defaults : []).map((d) => ({ ...d, ...(live[d.slug] || {}) }));
  const known = new Set(merged.map((p) => p.slug));
  return [...merged, ...Object.values(live).filter((p) => !known.has(p.slug))];
}

/** A section page that is switched on, or undefined. */
export function getPage(slug) {
  return PAGES.find((p) => p.slug === slug && p.enabled);
}

export function enabledPages() {
  return PAGES.filter((p) => p.enabled);
}

/** The enabled page that expands a given home-page section anchor (e.g. 'about'). */
export function pageForSection(anchor) {
  return PAGES.find((p) => p.sectionAnchor === anchor && p.enabled);
}

/**
 * Where a menu tab for a home section ('#about') should go: the section's
 * live page ('/about') if it has one, otherwise the section on the home page ('/#about').
 */
export function sectionHref(hash) {
  const page = pageForSection(hash.replace(/^#/, ''));
  return page ? `/${page.slug}` : `/${hash}`;
}

async function getJson(url) {
  // no-cache = always revalidate with the server, so admin edits show immediately.
  const res = await fetch(url, { cache: 'no-cache' });
  if (!res.ok) throw new Error(`${url} ${res.status}`);
  return res.json();
}

export async function loadContent() {
  const [seo, work, home, pageDefaults, pageContent] = await Promise.all([
    getJson('/content/seo.json').catch(() => null),
    getJson('/content/work.json').catch(() => []),
    getJson('/content/home.json').catch(() => null),
    getJson('/defaults/pages.json').catch(() => []),
    getJson('/content/pages.json').catch(() => []),
  ]);
  if (seo) SEO_CONTENT = seo;
  PAGES = mergePages(pageDefaults, pageContent);
  applyHomeContent(home);
  CASE_STUDIES = work
    .map((cs) => ({
      ...cs,
      photoAlts: Object.fromEntries(cs.photos.map((p) => [p.id, p.alt])),
      photos: cs.photos.map((p) => p.id),
    }))
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  PHOTO_TO_CASE_STUDY = Object.fromEntries(
    CASE_STUDIES.flatMap((cs) => cs.photos.map((base) => [base, cs.slug])),
  );
}
