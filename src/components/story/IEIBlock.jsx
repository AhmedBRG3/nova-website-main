// ─────────────────────────────────────────
//  IEIBlock — "Imagination. Energy. Impact."
//  Two-column: giant words with a rotateY
//  perspective slide-in on the left, three
//  tilt-responsive concept cards on the right.
//  A ghost "01" numeral parallaxes behind it all.
// ─────────────────────────────────────────
import useReveal from '../../hooks/useReveal';
import useTilt from '../../hooks/useTilt';
import useScrollEngine from '../../hooks/useScrollEngine';
import { useRef } from 'react';
import { IEI_CARDS } from '../../data';

const ICONS = {
  compass: <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />,
  bolt:    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />,
  chart:   <path d="M22 12h-4l-3 9L9 3l-3 9H2" />,
};

function IEICard({ card, delay }) {
  const revealRef = useReveal();
  const tiltRef = useTilt({ maxX: 14, maxY: 11 });

  // Merge the two refs onto the same node
  const setRefs = (el) => { revealRef.current = el; tiltRef.current = el; };

  return (
    <div ref={setRefs} className="iei-card rv tilt" style={{ transitionDelay: `${delay}s` }}>
      <div className="card-shine" />
      <div className="iei-card-icon">
        <svg viewBox="0 0 24 24">{ICONS[card.icon]}</svg>
      </div>
      <div>
        <div className="iei-card-label">{card.num}</div>
        <div className="iei-card-title">{card.title}</div>
        <div className="iei-card-desc">{card.desc}</div>
      </div>
    </div>
  );
}

export default function IEIBlock() {
  const leftRef = useReveal();
  const decoRef = useRef(null);
  const orb1Ref = useRef(null);
  const orb2Ref = useRef(null);
  const blockRef = useRef(null);

  useScrollEngine(() => {
    const block = blockRef.current;
    if (!block) return;
    const r = block.getBoundingClientRect();
    if (decoRef.current) decoRef.current.style.transform = `translate(-50%,-50%) translateY(${r.top * 0.07}px)`;
    if (orb1Ref.current) orb1Ref.current.style.transform = `translateY(${r.top * 0.12}px)`;
    if (orb2Ref.current) orb2Ref.current.style.transform = `translateY(${r.top * -0.08}px)`;
  });

  return (
    <div className="iei-block light-section" ref={blockRef}>
      <div className="iei-orb iei-orb1" ref={orb1Ref} />
      <div className="iei-orb iei-orb2" ref={orb2Ref} />
      <div className="iei-grid" />
      <div className="story-deco" ref={decoRef} style={{ fontSize: '30vw' }}>01</div>
      <div className="iei-rule iei-rule-top" />
      <div className="iei-rule iei-rule-bot" />
      <div className="iei-badge rv" ref={useReveal()}>Cairo, Egypt</div>

      <div className="iei-content">
        <div className="iei-left rv" ref={leftRef}>
          <p className="iei-eyebrow">Our Philosophy</p>
          <div className="iei-word-stack">
            <div className="iei-big-word iei-w1"><span className="iei-dot" />Imagination.</div>
            <div className="iei-big-word iei-w2"><span className="iei-dot" />Energy.</div>
            <div className="iei-big-word iei-w3 shimmer">
              <span className="iei-dot iei-dot-white" style={{ WebkitTextFillColor: 'initial' }} />Impact.
            </div>
          </div>
          <p className="iei-body">
            We transform briefs into brand moments that move people — literally and emotionally.
            Every project begins with vision and ends with results.
          </p>
        </div>

        <div className="iei-right">
          {IEI_CARDS.map((card, i) => (
            <IEICard key={card.title} card={card} delay={i * 0.12} />
          ))}
        </div>
      </div>
    </div>
  );
}
