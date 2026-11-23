// ─────────────────────────────────────────
//  ReadMore
//  Button under a home-page section that opens its full
//  "section page" (e.g. About → /about). The label comes from
//  the admin (Section pages) and is always descriptive, never a
//  bare "Read more". Renders nothing while the page is switched
//  off, so unfinished pages stay invisible.
// ─────────────────────────────────────────
import { Link } from 'react-router-dom';
import { pageForSection } from '../data/caseStudies';

export default function ReadMore({ section }) {
  const page = pageForSection(section);
  if (!page) return null;
  return (
    <p className="read-more">
      <Link to={`/${page.slug}`} className="btn-g">{page.readMoreLabel} <span aria-hidden="true">→</span></Link>
    </p>
  );
}
