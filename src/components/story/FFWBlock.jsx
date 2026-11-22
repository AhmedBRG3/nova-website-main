// ─────────────────────────────────────────
//  FFWBlock — "From factory floor to the
//  world stage."
//  Factory illustration → animated arrow →
//  booth illustration.
// ─────────────────────────────────────────
import { useRef } from 'react';
import useReveal from '../../hooks/useReveal';
import useScrollEngine from '../../hooks/useScrollEngine';
import SceneSVG from './SceneSVG';
import RichText from '../RichText';
import { HOME_TEXT } from '../../data';
import { FACTORY_SVG, BOOTH_SVG } from './illustrations';

export default function FFWBlock() {
  const blockRef = useRef(null);
  const decoRef = useRef(null);
  const orb1Ref = useRef(null);
  const orb2Ref = useRef(null);
  const headRef = useReveal();
  const factoryRef = useReveal({ threshold: 0.1 });
  const arrowRef = useReveal();
  const boothRef = useReveal({ threshold: 0.1 });

  useScrollEngine(() => {
    const block = blockRef.current;
    if (!block) return;
    const r = block.getBoundingClientRect();
    if (decoRef.current) decoRef.current.style.transform = `translate(-50%,-50%) translateY(${r.top * 0.06}px)`;
    if (orb1Ref.current) orb1Ref.current.style.transform = `translateY(${r.top * 0.1}px)`;
    if (orb2Ref.current) orb2Ref.current.style.transform = `translateY(${r.top * -0.07}px)`;
  });

  return (
    <div className="ffw-block light-section" ref={blockRef}>
      <div className="ffw-orb ffw-orb1" ref={orb1Ref} />
      <div className="ffw-orb ffw-orb2" ref={orb2Ref} />
      <div className="story-deco" ref={decoRef} style={{ fontSize: '28vw' }}>03</div>

      <div className="ffw-content">
        <div className="ffw-headline rv" ref={headRef}>
          <p className="ffw-eyebrow">In-House Production</p>
          <h2 className="ffw-h">
            From <em>factory floor</em><br />to the <span className="ffw-h-accent shimmer">world stage.</span>
          </h2>
          <RichText className="ffw-sub" text={HOME_TEXT.ffwSub} />
        </div>

        <div className="ffw-illustrations">
          <div className="ffw-ill-wrap rv-l" ref={factoryRef}>
            <div className="ffw-ill-label">
              <span className="ffw-ill-num">01</span>
              <span className="ffw-ill-title">The Factory</span>
              <span className="ffw-ill-sub">Nasr City, Cairo</span>
            </div>
            <SceneSVG svg={FACTORY_SVG} />
          </div>

          <div className="ffw-arrow-wrap rv" ref={arrowRef}>
            <div className="ffw-dash" />
            <div className="ffw-arrow-label">Crafted here</div>
            <svg width="32" height="32" viewBox="0 0 32 32" className="ffw-arrow-icon">
              <path d="M6 16h20M20 10l6 6-6 6" stroke="#EC2027" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="ffw-arrow-label2">Delivered here</div>
            <div className="ffw-dash" />
          </div>

          <div className="ffw-ill-wrap rv-r" ref={boothRef}>
            <div className="ffw-ill-label">
              <span className="ffw-ill-num">02</span>
              <span className="ffw-ill-title">The Booth</span>
              <span className="ffw-ill-sub">Exhibition · Activation · Event</span>
            </div>
            <SceneSVG svg={BOOTH_SVG} />
          </div>
        </div>
      </div>
    </div>
  );
}
