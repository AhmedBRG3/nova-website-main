// ─────────────────────────────────────────
//  RichText
//  Renders CMS-edited copy that may contain links written as
//  [visible text](url) — see src/lib/richText.js for the grammar.
//  Builds real React elements (never innerHTML): site links use
//  react-router <Link>, external links open in a new tab, and any
//  link with a disallowed address is shown as plain text.
//  Line breaks typed in the admin become <br />.
// ─────────────────────────────────────────
import { Link } from 'react-router-dom';
import { parseRichText } from '../lib/richText';

function withBreaks(str, key) {
  const lines = str.split('\n');
  return lines.flatMap((line, i) => (i === 0 ? [line] : [<br key={`${key}-${i}`} />, line]));
}

export default function RichText({ text, as: Tag = 'p', className, ...rest }) {
  const parts = parseRichText(text).flatMap((t, i) => {
    if (t.type === 'text' || t.kind === 'invalid') return withBreaks(t.text, i);
    if (t.kind === 'internal') {
      const to = t.href.startsWith('#') ? `/${t.href}` : t.href;
      return <Link key={i} to={to} className="rt-link">{t.text}</Link>;
    }
    if (t.kind === 'external') {
      return <a key={i} href={t.href} className="rt-link" target="_blank" rel="noopener">{t.text}</a>;
    }
    return <a key={i} href={t.href} className="rt-link">{t.text}</a>;
  });
  return <Tag className={className} {...rest}>{parts}</Tag>;
}
