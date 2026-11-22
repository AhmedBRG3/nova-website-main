// ─────────────────────────────────────────
//  YBEBlock — "Your brand, everywhere at once."
//  2×2 grid of living illustrated scenes:
//  roadshow, retail activation, toll station,
//  in-store demo. Each card gets a subtle 3D
//  tilt on hover on top of its own internal
//  CSS-driven animation (spinning wheels,
//  rising barriers, pulsing screens...).
// ─────────────────────────────────────────
import { useRef } from 'react';
import useReveal from '../../hooks/useReveal';
import useScrollEngine from '../../hooks/useScrollEngine';
import { YBE_CARDS, HOME_TEXT } from '../../data';
import RichText from '../RichText';
import { ROADSHOW_SVG, RETAIL_SVG, TOLL_SVG, INSTORE_SVG } from './illustrations';

const SCENES = {
  roadshow: ROADSHOW_SVG,
  retail: RETAIL_SVG,
  toll: TOLL_SVG,
  instore: INSTORE_SVG,
};

function YBECard({ card, delay }) {
  const revealRef = useReveal();
  const cardRef = useRef(null);

  const setRefs = (el) => { revealRef.current = el; cardRef.current = el; };

  const onMove = (e) => {
    const el = cardRef.current;
    if (!el || window.matchMedia('(max-width:768px)').matches) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(1200px) rotateY(${x * 7}deg) rotateX(${-y * 6}deg) translateZ(6px)`;
  };
  const onLeave = () => {
    if (cardRef.current) cardRef.current.style.transform = 'perspective(1200px) rotateY(0) rotateX(0) translateZ(0)';
  };

  return (
    <div
      ref={setRefs}
      className="ybe-card rv tilt3d"
      style={{ transitionDelay: `${delay}s` }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <div className="ybe-card-top">
        <span className="ybe-card-num">{card.num}</span>
        <span className="ybe-card-tag">{card.tag}</span>
      </div>
      <div
        className="ybe-scene-wrap"
        dangerouslySetInnerHTML={{ __html: SCENES[card.scene] }}
      />
      <div className="ybe-card-info">
        <RichText className="ybe-card-desc" text={card.desc} />
      </div>
    </div>
  );
}

export default function YBEBlock() {
  const blockRef = useRef(null);
  const decoRef = useRef(null);
  const orb1Ref = useRef(null);
  const orb2Ref = useRef(null);
  const headRef = useReveal();

  useScrollEngine(() => {
    const block = blockRef.current;
    if (!block) return;
    const r = block.getBoundingClientRect();
    if (decoRef.current) decoRef.current.style.transform = `translate(-50%,-50%) translateY(${r.top * 0.06}px)`;
    if (orb1Ref.current) orb1Ref.current.style.transform = `translateY(${r.top * 0.09}px)`;
    if (orb2Ref.current) orb2Ref.current.style.transform = `translateY(${r.top * -0.06}px)`;
  });

  return (
    <div className="ybe-block" ref={blockRef}>
      <div className="ybe-orb ybe-orb1" ref={orb1Ref} />
      <div className="ybe-orb ybe-orb2" ref={orb2Ref} />
      <div className="story-deco" ref={decoRef} style={{ fontSize: '28vw' }}>04</div>

      <div className="ybe-content">
        <div className="ybe-headline rv" ref={headRef}>
          <p className="ybe-eyebrow">Brand Reach</p>
          <h2 className="ybe-h">Your brand,<br /><em className="ybe-h-em shimmer accent-serif">everywhere</em> at once.</h2>
          <RichText className="ybe-sub" text={HOME_TEXT.ybeSub} />
        </div>

        <div className="ybe-grid">
          {YBE_CARDS.map((card, i) => (
            <YBECard key={card.scene} card={card} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </div>
  );
}
