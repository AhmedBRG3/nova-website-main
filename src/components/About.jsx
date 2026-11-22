// ─────────────────────────────────────────
//  About
//  Two-column section: copy + value pills on
//  the left, floating colour orbs behind a
//  2×2 grid of 3D-tilt stat cards on the right.
// ─────────────────────────────────────────
import useReveal from '../hooks/useReveal';
import useTilt from '../hooks/useTilt';
import { ABOUT_CARDS, ABOUT_VALUES, HOME_TEXT } from '../data';
import RichText from './RichText';

function TiltCard({ card }) {
  const tiltRef = useTilt({ maxX: 14, maxY: 11 });
  return (
    <div ref={tiltRef} className="about-card">
      <div className="card-shine" />
      <div className="about-card-label">{card.label}</div>
      <div className="about-card-val">{card.value}</div>
      <div className="about-card-desc">{card.desc}</div>
    </div>
  );
}

export default function About() {
  const leftRef = useReveal();
  const gridRef = useReveal();

  return (
    <section id="about" className="light-section" aria-label="About NOVA">
      <div ref={leftRef} className="rv">
        <p className="section-eyebrow">Who We Are</p>
        <h2 className="section-title">Where Strategy<br />Meets Story.</h2>
        <RichText className="section-body" text={HOME_TEXT.aboutBody} />
        <div className="about-values">
          {ABOUT_VALUES.map((v) => (
            <span key={v} className="value-pill">{v}</span>
          ))}
        </div>
      </div>

      <div className="about-visual">
        <div className="about-orb orb-1" />
        <div className="about-orb orb-2" />
        <div ref={gridRef} className="about-card-grid rv">
          {ABOUT_CARDS.map((card) => (
            <TiltCard key={card.label} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}
