// ─────────────────────────────────────────
//  Hero
//  Full-viewport hero:
//    • Three.js scene — icosahedron + wireframe
//      shell, 3 orbital rings, additive glow
//      sprite, dual particle fields, fog depth,
//      mouse-driven camera drift and spotlight
//    • Headline splits into individual characters
//      that cascade up (see useSplitChars)
//    • "Moments." rendered in the shimmer
//      gradient class from GlobalStyles
//    • Hero content parallax-scales away and
//      the WebGL canvas fades out as you scroll
//    • Magnetic CTA buttons
// ─────────────────────────────────────────
import { useEffect, useRef } from 'react';
import useScrollEngine from '../hooks/useScrollEngine';
import useMagnet from '../hooks/useMagnet';
import useSplitChars from '../hooks/useSplitChars';
import initIcosahedronScene from '../three/icosahedronScene';
import { HOME_TEXT } from '../data';
import RichText from './RichText';

function SplitLine({ text, startIndex, shimmer }) {
  const chars = useSplitChars(text, startIndex);
  // Group chars into words so each word is a single non-breaking
  // unit (display:inline-block) \u2014 the line can still wrap between
  // words, it just can no longer split a word mid-letter.
  const words = [];
  let word = [];
  chars.forEach((c) => {
    if (c.char === ' ') { words.push(word); word = []; }
    else word.push(c);
  });
  words.push(word);

  return (
    <span className="ln">
      <span className={shimmer ? 'shimmer' : undefined}>
        {words.map((w, wi) => (
          <span key={wi}>
            {wi > 0 && ' '}
            <span className="word">
              {w.map(({ char, delay }, i) => (
                <span
                  key={i}
                  className="ch"
                  style={{ transitionDelay: `${0.55 + delay * 0.028}s` }}
                >
                  {char}
                </span>
              ))}
            </span>
          </span>
        ))}
      </span>
    </span>
  );
}

export default function Hero() {
  // Headline lines are CMS-editable (the page's H1); the trailing ' ' line
  // keeps the original shimmer slot.
  const LINES = [...HOME_TEXT.heroLines, ' '];
  const canvasRef = useRef(null);
  const contentRef = useRef(null);
  const controlRef = useRef(null);

  useEffect(() => {
    controlRef.current = initIcosahedronScene(canvasRef.current);
    return () => controlRef.current?.cleanup();
  }, []);

  // Scroll-driven fade / scale-out of hero content + canvas,
  // and pause the WebGL render loop once fully off-screen
  // (saves battery — no point rendering what nobody sees).
  useScrollEngine(({ sy }) => {
    const vh = window.innerHeight;
    const f = Math.max(0, 1 - sy / (vh * 0.85));
    if (canvasRef.current) canvasRef.current.style.opacity = f;
    if (contentRef.current) {
      contentRef.current.style.transform = `translateY(${sy * 0.32}px) scale(${1 - Math.min(sy / vh, 1) * 0.06})`;
      contentRef.current.style.opacity = f;
    }
    controlRef.current?.setRunning(sy < vh * 1.15);
  });

  const btnPRef = useMagnet();
  const btnGRef = useMagnet();

  const handleClick = (e, href) => {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  // Note: entrance choreography (fade/slide-up timing for the
  // eyebrow, headline chars, subtitle, buttons, scroll hint) is
  // driven entirely by the `body.loaded` CSS rules in GlobalStyles —
  // App.jsx adds that class once Preloader calls onDone(). No
  // inline style duplication needed here.
  return (
    <section id="hero" role="banner" aria-label="NOVA Marketing and Events">
      <canvas ref={canvasRef} id="three-canvas" />
      <div className="hero-vignette" />

      <div ref={contentRef} className="hero-content">
        <p className="hero-eyebrow">Cairo · Egypt</p>

        <h1 className="hero-title" style={{ perspective: 600 }}>
          {/* {' '} keeps a real space between lines for search engines / screen readers */}
          <SplitLine text={LINES[0]} startIndex={0} />{' '}
          <SplitLine text={LINES[1]} startIndex={LINES[0].length} />{' '}
          <SplitLine text={LINES[2]} startIndex={LINES[0].length + LINES[1].length} shimmer />
        </h1>

        <RichText className="hero-sub" text={HOME_TEXT.heroSub} />

        <div className="hero-btns">
          <a ref={btnPRef} href="#portfolio" className="btn-p" onClick={(e) => handleClick(e, '#portfolio')}>View Our Work</a>
          <a ref={btnGRef} href="#contact" className="btn-g" onClick={(e) => handleClick(e, '#contact')}>Let's Talk</a>
        </div>
      </div>

      <div className="scroll-ind" aria-hidden="true">
        <span>Scroll</span>
        <div className="scroll-line" />
      </div>
    </section>
  );
}
