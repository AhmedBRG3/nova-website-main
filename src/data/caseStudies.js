// ─────────────────────────────────────────
//  Case studies for the Portfolio section.
//  Content lives in /content/work.json on the server and is
//  edited by the media buyer through /admin (public/admin/index.php),
//  so changes go live with no rebuild. loadContent() runs once
//  before React renders (see main.jsx) and fills the live bindings
//  below; every other module keeps importing the same names.
//  It also fetches /content/home.json and merges it into the
//  home-page copy in ./index.js (bundled defaults stay if it fails).
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

async function getJson(url) {
  // no-cache = always revalidate with the server, so admin edits show immediately.
  const res = await fetch(url, { cache: 'no-cache' });
  if (!res.ok) throw new Error(`${url} ${res.status}`);
  return res.json();
}

export async function loadContent() {
  const [seo, work, home] = await Promise.all([
    getJson('/content/seo.json').catch(() => null),
    getJson('/content/work.json').catch(() => []),
    getJson('/content/home.json').catch(() => null),
  ]);
  if (seo) SEO_CONTENT = seo;
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
