// ─────────────────────────────────────────
//  SMSBlock — "Strategy meets Story."
//  Right column is a 4-step process timeline
//  whose progress line fills as you scroll
//  through the block, lighting each step's
//  number badge on the way down.
// ─────────────────────────────────────────
import { useRef } from 'react';
import useReveal from '../../hooks/useReveal';
import useScrollEngine from '../../hooks/useScrollEngine';
import IcosahedronCanvas from '../IcosahedronCanvas';
import { SMS_STEPS, HOME_TEXT } from '../../data';
import RichText from '../RichText';

export default function SMSBlock() {
  const blockRef = useRef(null);
  const decoRef = useRef(null);
  const orb1Ref = useRef(null);
  const orb2Ref = useRef(null);
  const fillRef = useRef(null);
  const stepRefs = useRef([]);
  const leftRef = useReveal();

  useScrollEngine(() => {
    const block = blockRef.current;
    if (!block) return;
    const r = block.getBoundingClientRect();

    if (decoRef.current) decoRef.current.style.transform = `translate(-50%,-50%) translateY(${r.top * 0.08}px)`;
    if (orb1Ref.current) orb1Ref.current.style.transform = `translateY(${r.top * 0.1}px)`;
    if (orb2Ref.current) orb2Ref.current.style.transform = `translateY(${r.top * -0.06}px)`;

    // Timeline fill progress, driven by how far the block has scrolled past
    const t = Math.max(0, Math.min(1, (window.innerHeight * 0.75 - r.top) / (r.height * 0.85)));
    if (fillRef.current) fillRef.current.style.transform = `scaleY(${t})`;
    stepRefs.current.forEach((el, i) => {
      if (el) el.classList.toggle('on', t > (i + 0.35) / SMS_STEPS.length);
    });
  });

  return (
    <div className="sms-block" ref={blockRef}>
      <IcosahedronCanvas />
      <div className="sms-orb sms-orb1" ref={orb1Ref} />
      <div className="sms-orb sms-orb2" ref={orb2Ref} />
      <div className="story-deco" ref={decoRef} style={{ fontSize: '28vw' }}>02</div>

      <div className="sms-content">
        <div className="sms-left rv" ref={leftRef}>
          <p className="sms-eyebrow">How We Think</p>
          <h2 className="sms-headline">
            <span className="sms-h-plain">Strategy</span>
            <span className="sms-h-plain sms-h-sm">meets</span>
            <span className="sms-h-italic shimmer accent-serif">Story.</span>
          </h2>
          <RichText className="sms-sub" text={HOME_TEXT.smsSub} />
          <div className="sms-quote">
            <div className="sms-quote-bar" />
            <p className="sms-quote-text">"We don't sell space. We architect emotion."</p>
            <span className="sms-quote-attr">— NOVA Creative Direction</span>
          </div>
        </div>

        <div className="sms-right">
          <div className="sms-track"><div className="sms-track-fill" ref={fillRef} /></div>
          {SMS_STEPS.map((step, i) => (
            <div
              key={step.num}
              className="sms-step"
              ref={(el) => { stepRefs.current[i] = el; }}
            >
              <div className="sms-step-num">{step.num}</div>
              <div className="sms-step-body">
                <div className="sms-step-title">{step.title}</div>
                <RichText as="div" className="sms-step-desc" text={step.desc} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
