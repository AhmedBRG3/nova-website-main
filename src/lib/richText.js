// ─────────────────────────────────────────
//  Rich-text grammar for CMS-edited copy:  [visible text](url)
//  JS twin of public/admin/richtext.php — tests/rich-text-cases.json
//  is run against both (npm run test:content) so they never drift.
// ─────────────────────────────────────────

// URL part = printable ASCII except spaces and parentheses (same class in PHP).
const LINK_RE = /\[([^[\]\n]+)\]\(([\x21-\x27\x2A-\x7E]+)\)/gu;

const KINDS = [
  ['external', /^https?:\/\/[A-Za-z0-9.-]+\.[A-Za-z]{2,}(:[0-9]{1,5})?([/?#][A-Za-z0-9\-._~:/?#[\]@!$&'*+,;=%]*)?$/],
  ['mailto', /^mailto:[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/],
  ['tel', /^tel:\+?[0-9][0-9.-]{4,20}$/],
  ['internal', /^(\/((work\/)?[a-z0-9-]+)?(#[a-z0-9-]+)?|#[a-z0-9-]+)$/],
];

export function linkKind(href) {
  const hit = KINDS.find(([, re]) => re.test(href));
  return hit ? hit[0] : 'invalid';
}

/** Split text into {type:'text',text} and {type:'link',text,href,kind} tokens. */
export function parseRichText(s = '') {
  const out = [];
  let pos = 0;
  for (const m of s.matchAll(LINK_RE)) {
    if (m.index > pos) out.push({ type: 'text', text: s.slice(pos, m.index) });
    out.push({ type: 'link', text: m[1], href: m[2], kind: linkKind(m[2]) });
    pos = m.index + m[0].length;
  }
  if (pos < s.length) out.push({ type: 'text', text: s.slice(pos) });
  return out;
}

/** Plain visible text, e.g. for meta descriptions and aria labels. */
export function stripRichText(s = '') {
  return parseRichText(s).map((t) => t.text).join('');
}
