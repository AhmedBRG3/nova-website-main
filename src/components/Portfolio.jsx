// ─────────────────────────────────────────
//  Portfolio
//  Masonry gallery of real project photography.
//  Every photo ships as a <picture> with WebP +
//  JPEG srcSet (see scripts/optimize-images.mjs)
//  so the browser only downloads a size that
//  matches the grid cell, not the 1600px original.
//  Clicking a photo opens its real case-study page
//  (see src/data/caseStudies.js + ProjectDetail.jsx)
//  instead of just a lightbox preview.
// ─────────────────────────────────────────
import { Link } from 'react-router-dom';
import useReveal from '../hooks/useReveal';
import IcosahedronCanvas from './IcosahedronCanvas';
import { WORK_PHOTOS } from '../data';
import { PHOTO_TO_CASE_STUDY, getCaseStudy } from '../data/caseStudies';

const GRID_SIZES = '(max-width:768px) 92vw, (max-width:1200px) 45vw, 380px';

function WorkPhoto({ photo, index }) {
  const revealRef = useReveal();
  const slug = PHOTO_TO_CASE_STUDY[photo.base];
  const study = slug && getCaseStudy(slug);

  return (
    <Link
      ref={revealRef}
      to={`/work/${slug}`}
      className="work-photo rv"
      style={{ transitionDelay: `${(index % 6) * 0.06}s` }}
      aria-label={study ? `View case study: ${study.project}` : `Open project photo ${index + 1}`}
    >
      <picture>
        <source type="image/webp" srcSet={photo.srcSetWebp} sizes={GRID_SIZES} />
        <img
          src={photo.fallback}
          srcSet={photo.srcSetJpg}
          sizes={GRID_SIZES}
          width={800}
          height={Math.round(800 / photo.aspect)}
          alt={(study && study.photoAlts[photo.base]) || (study ? `${study.project} — ${study.client}` : `NOVA project ${index + 1}`)}
          loading="lazy"
          decoding="async"
        />
      </picture>
      {study && (
        <span className="work-photo-label">
          <span className="work-photo-client">{study.client}</span>
          <span className="work-photo-cta">View Case Study →</span>
        </span>
      )}
    </Link>
  );
}

export default function Portfolio() {
  const headRef = useReveal();

  return (
    <section id="portfolio" aria-label="Our Work and Portfolio">
      <div ref={headRef} className="portfolio-header rv">
        <IcosahedronCanvas />
        <p className="section-eyebrow">Our Work</p>
        <h2 className="section-title">
          Campaigns that<br /><em className="shimmer">captivated</em> Egypt.
        </h2>
      </div>

      <div className="work-grid">
        {WORK_PHOTOS.map((photo, i) => (
          <WorkPhoto key={photo.base} photo={photo} index={i} />
        ))}
      </div>
    </section>
  );
}
