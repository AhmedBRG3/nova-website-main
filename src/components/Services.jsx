// ─────────────────────────────────────────
//  Services
//  Apple-style sticky scroll (700vh driver,
//  100vh pinned stage). Unlike a stepped
//  carousel, card position is a CONTINUOUS
//  function of scroll progress — smoothed
//  with its own internal lerp — so cards glide
//  fluidly left/right instead of snapping
//  between fixed states. Direct DOM writes
//  inside the scroll-engine callback (not
//  React state) keep this at 60fps since it
//  updates every single frame.
// ─────────────────────────────────────────
import { useRef } from 'react';
import useScrollEngine from '../hooks/useScrollEngine';
import IcosahedronCanvas from './IcosahedronCanvas';
import { SERVICES } from '../data';

const ICONS = {
  home:          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>,
  zap:           <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>,
  globe:         <><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></>,
  monitor:       <><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></>,
  tool:          <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>,
  'trending-up': <><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></>,
  'shopping-bag':<><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></>,
};

export default function Services() {
  const wrapRef = useRef(null);
  const cardRefs = useRef([]);
  const infoRefs = useRef([]);
  const dotRefs = useRef([]);
  const barFillRef = useRef(null);
  const progressState = useRef({ smoothed: 0, activeIdx: -1 });

  const N = SERVICES.length;
  const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width:768px)').matches;

  useScrollEngine(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const r = wrap.getBoundingClientRect();
    const scrollable = wrap.offsetHeight - window.innerHeight;
    if (scrollable <= 0) return;

    const raw = Math.max(0, Math.min(1, -r.top / scrollable)) * (N - 1);
    const st = progressState.current;
    st.smoothed += (raw - st.smoothed) * 0.12; // internal lerp, on top of the global scroll lerp
    const p = st.smoothed;

    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      const d = i - p;
      let x, s, ry, op;
      if (d >= 0) {
        const dc = Math.min(d, 2.2);
        x = dc * 74; s = 1 - Math.min(d, 1.5) * 0.09; ry = -Math.min(d, 1.5) * 15;
        // On mobile the card stage sits close to the viewport edge, so the
        // next card peeking in reads as a clipped/broken box rather than a
        // carousel hint — fade it out much faster instead of letting its
        // full label/title bleed off-screen.
        op = isMobile
          ? Math.max(0, 1 - d * 4)
          : Math.max(0, 1 - d * 1.6);
      } else {
        const dn = Math.max(d, -1.4);
        x = dn * 112; s = 1 + dn * 0.045; ry = -dn * 10;
        op = Math.max(0, 1 + d * 1.25);
      }
      card.style.transform = `translateX(${x}%) scale(${s}) rotateY(${ry}deg)`;
      card.style.opacity = op;
      card.style.zIndex = String(100 - Math.round(Math.abs(d) * 10));
      card.classList.toggle('is-active', Math.abs(d) < 0.5);
      card.style.pointerEvents = Math.abs(d) < 0.5 ? 'auto' : 'none';
    });

    const idx = Math.round(p);
    if (idx !== st.activeIdx) {
      st.activeIdx = idx;
      infoRefs.current.forEach((el, i) => el?.classList.toggle('active', i === idx));
      dotRefs.current.forEach((el, i) => el?.classList.toggle('active', i === idx));
    }
    if (barFillRef.current) barFillRef.current.style.width = `${(p / (N - 1)) * 100}%`;
  });

  return (
    <section id="services" aria-label="Our Services">
      <div className="services-sticky-wrapper" ref={wrapRef}>
        <div className="services-sticky">
          <IcosahedronCanvas />

          {/* LEFT — copy + active info panel + progress dots */}
          <div className="services-left">
            <p className="svc-eyebrow">What We Do</p>
            <h2 className="svc-title">Full-spectrum<br />brand power.</h2>

            <div className="svc-info-panel">
              {SERVICES.map((svc, i) => (
                <div
                  key={svc.num}
                  ref={(el) => { infoRefs.current[i] = el; }}
                  className={`svc-info-item${i === 0 ? ' active' : ''}`}
                >
                  <div className="svc-info-num">{svc.num} / {String(N).padStart(2, '0')} Services</div>
                  <h3 className="svc-info-title">
                    {svc.title.split('\n').map((line, li) => (
                      <span key={li}>{line}{li === 0 && <br />}</span>
                    ))}
                  </h3>
                  <p className="svc-info-desc">{svc.desc}</p>
                </div>
              ))}
            </div>

            <div className="svc-nav">
              <div className="svc-dots">
                {SERVICES.map((svc, i) => (
                  <div
                    key={svc.num}
                    ref={(el) => { dotRefs.current[i] = el; }}
                    className={`svc-dot${i === 0 ? ' active' : ''}`}
                  />
                ))}
              </div>
              <div className="svc-bar"><div className="svc-bar-fill" ref={barFillRef} /></div>
            </div>
          </div>

          {/* RIGHT — the card stage itself */}
          <div className="services-right">
            <div className="svc-orb svc-orb-1" />
            <div className="svc-card-stage">
              {SERVICES.map((svc, i) => (
                <div
                  key={svc.num}
                  ref={(el) => { cardRefs.current[i] = el; }}
                  className={`svc-card${i === 0 ? ' is-active' : ''}`}
                >
                  <div className="svc-card-icon">
                    <svg viewBox="0 0 24 24">{ICONS[svc.icon]}</svg>
                  </div>
                  <div>
                    <div className="svc-card-label">{svc.num} — {svc.label}</div>
                    <div className="svc-card-name">
                      {svc.title.split('\n').map((line, li) => (
                        <span key={li}>{line}{li === 0 && <br />}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
