// ─────────────────────────────────────────
//  Case studies for the Portfolio section.
//  Content now lives in /content/work/<slug>.json so the
//  media buyer can edit it through the CMS at /admin
//  (see public/admin/config.yml). This module just loads
//  those files and keeps the same exports as before.
//  Each file groups the real project photos that belong
//  to the same booth/build, with per-photo alt text.
// ─────────────────────────────────────────
const files = import.meta.glob('../../content/work/*.json', { eager: true, import: 'default' });

export const CASE_STUDIES = Object.values(files)
  .map((cs) => ({
    ...cs,
    photoAlts: Object.fromEntries(cs.photos.map((p) => [p.id, p.alt])),
    photos: cs.photos.map((p) => p.id),
  }))
  .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

export function getCaseStudy(slug) {
  return CASE_STUDIES.find((c) => c.slug === slug);
}

// Reverse lookup so the gallery grid can link each photo straight to the
// case study it belongs to, e.g. PHOTO_TO_CASE_STUDY['work-05'] === 'vyndamax-pfizer'.
export const PHOTO_TO_CASE_STUDY = Object.fromEntries(
  CASE_STUDIES.flatMap((cs) => cs.photos.map((base) => [base, cs.slug])),
);
