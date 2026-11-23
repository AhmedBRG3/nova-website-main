// ─────────────────────────────────────────
//  InfoPage
//  Full "section page" opened from a home-page Read-more button
//  (/about, /services, /philosophy, /how-we-think, /brand-reach).
//  Content is written by the media buyer in /admin → Section pages
//  and loaded at runtime (see loadContent() in data/caseStudies.js).
//  Blocks: h2 / h3 headings (plain text), paragraphs and bullet
//  lists (may contain [text](url) links, rendered by <RichText />).
//  The H1 takes focus on arrival so keyboard and screen-reader
//  users start at the new page instead of the vanished link.
// ─────────────────────────────────────────
import { useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { enabledPages, getPage } from '../data/caseStudies';
import useSeo from '../hooks/useSeo';
import RichText from './RichText';
import NotFound from './NotFound';

function Block({ block }) {
  switch (block.type) {
    case 'h2': return <h2 className="info-h2">{block.text}</h2>;
    case 'h3': return <h3 className="info-h3">{block.text}</h3>;
    case 'list':
      return (
        <ul className="info-list">
          {(block.items || []).map((item, i) => <RichText key={i} as="li" text={item} />)}
        </ul>
      );
    default: return <RichText className="info-p" text={block.text || ''} />;
  }
}

export default function InfoPage() {
  const { pageSlug } = useParams();
  const page = getPage(pageSlug);
  const titleRef = useRef(null);

  useSeo({
    title: page ? page.seoTitle : 'Page not found | NOVA',
    description: page ? page.seoDescription : '',
    path: `/${pageSlug}`,
    noindex: !page,
  });

  useEffect(() => {
    titleRef.current?.focus({ preventScroll: true });
  }, [pageSlug]);

  if (!page) return <NotFound />;
  const others = enabledPages().filter((p) => p.slug !== page.slug);

  return (
    <article className="case-study info-page" aria-labelledby="info-title">
      <div className="case-study-head">
        <Link to={`/#${page.sectionAnchor}`} className="case-study-back">← Back to {page.section}</Link>
        {page.eyebrow && <p className="section-eyebrow">{page.eyebrow}</p>}
        <h1 id="info-title" ref={titleRef} tabIndex={-1} className="case-study-title">{page.title}</h1>
      </div>

      <div className="info-body">
        {(page.blocks || []).map((block, i) => <Block key={i} block={block} />)}
      </div>

      <div className="info-cta">
        <p className="info-cta-text">Have a brief in mind?</p>
        <Link to="/#contact" className="btn-p">Start a project</Link>
      </div>

      {others.length > 0 && (
        <nav className="case-study-nav info-related" aria-label="More from NOVA">
          {others.map((p) => (
            <Link key={p.slug} to={`/${p.slug}`} className="case-study-nav-link">
              <span>{p.eyebrow || p.section}</span>
              <strong>{p.title}</strong>
            </Link>
          ))}
        </nav>
      )}
    </article>
  );
}
