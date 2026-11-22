// ─────────────────────────────────────────
//  ProjectDetail
//  Real case-study page for a single project —
//  linked to from every photo in <Portfolio />.
//  Shows every photo verified as belonging to
//  that build, plus client/project context.
// ─────────────────────────────────────────
import { Link, useParams } from 'react-router-dom';
import { CASE_STUDIES, SEO_CONTENT as seo, getCaseStudy } from '../data/caseStudies';
import { WORK_PHOTO_BY_BASE } from '../data';
import useSeo from '../hooks/useSeo';
import RichText from './RichText';
import { stripRichText } from '../lib/richText';


const GRID_SIZES = '(max-width:768px) 92vw, (max-width:900px) 80vw, 760px';

export default function ProjectDetail() {
  const { slug } = useParams();
  const study = getCaseStudy(slug);
  const heroPhoto = study && WORK_PHOTO_BY_BASE[study.photos[0]];
  useSeo({
    title: study ? study.seoTitle || `${study.project} | NOVA` : 'Project not found | NOVA',
    description: study ? study.seoDescription || stripRichText(study.summary) : seo.workDefaultDescription,
    path: `/work/${slug}`,
    image: heroPhoto ? heroPhoto.fallback : undefined,
    noindex: !study,
  });

  if (!study) {
    return (
      <section className="case-study-notfound">
        <p className="section-eyebrow">Our Work</p>
        <h1 className="section-title">Project not found</h1>
        <p className="section-body">That case study doesn't exist — it may have been renamed.</p>
        <Link to="/#portfolio" className="btn-p">Back to Our Work</Link>
      </section>
    );
  }

  const idx = CASE_STUDIES.findIndex((c) => c.slug === slug);
  const prev = CASE_STUDIES[(idx - 1 + CASE_STUDIES.length) % CASE_STUDIES.length];
  const next = CASE_STUDIES[(idx + 1) % CASE_STUDIES.length];
  const [heroBase, ...restBases] = study.photos;
  const hero = WORK_PHOTO_BY_BASE[heroBase];

  return (
    <article className="case-study" aria-label={`${study.project} case study`}>
      <div className="case-study-head">
        <Link to="/#portfolio" className="case-study-back">← Our Work</Link>
        <p className="section-eyebrow">{study.tag}</p>
        <h1 className="case-study-title">{study.project}</h1>
        <p className="case-study-client">{study.client}</p>
        <RichText className="case-study-summary" text={study.summary} />
      </div>

      {hero && (
        <div className="case-study-hero">
          <picture>
            <source type="image/webp" srcSet={hero.srcSetWebp} sizes="90vw" />
            <img
              src={hero.fallback}
              srcSet={hero.srcSetJpg}
              sizes="90vw"
              width={1400}
              height={Math.round(1400 / hero.aspect)}
              alt={study.photoAlts[heroBase] || `${study.project} — main view`}
            />
          </picture>
        </div>
      )}

      {restBases.length > 0 && (
        <div className="case-study-grid">
          {restBases.map((base) => {
            const photo = WORK_PHOTO_BY_BASE[base];
            if (!photo) return null;
            return (
              <picture key={base}>
                <source type="image/webp" srcSet={photo.srcSetWebp} sizes={GRID_SIZES} />
                <img
                  src={photo.fallback}
                  srcSet={photo.srcSetJpg}
                  sizes={GRID_SIZES}
                  width={800}
                  height={Math.round(800 / photo.aspect)}
                  alt={study.photoAlts[base] || `${study.project} — additional view`}
                  loading="lazy"
                  decoding="async"
                />
              </picture>
            );
          })}
        </div>
      )}

      <div className="case-study-nav" role="navigation" aria-label="Other projects">
        <Link to={`/work/${prev.slug}`} className="case-study-nav-link">
          <span>← Previous</span>
          <strong>{prev.project}</strong>
        </Link>
        <Link to={`/work/${next.slug}`} className="case-study-nav-link case-study-nav-next">
          <span>Next →</span>
          <strong>{next.project}</strong>
        </Link>
      </div>
    </article>
  );
}
