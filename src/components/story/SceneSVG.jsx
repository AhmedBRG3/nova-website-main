// ─────────────────────────────────────────
//  SceneSVG
//  Thin wrapper that injects one of the raw
//  illustration SVG strings (factory, booth,
//  roadshow, retail, toll, in-store) and gives
//  it the hover lift/border treatment used on
//  every story-block scene card.
//
//  All the "living" animation — spinning wheels,
//  flickering windows, drifting smoke, rising
//  toll barriers, sweeping screen shine — lives
//  inside the SVG markup itself as CSS classes
//  (.ffw-win-flicker, .ybe-wheel, .ybe-barrier,
//  etc.) defined once in the global stylesheet,
//  so it runs for free with no JS per-frame cost.
// ─────────────────────────────────────────
export default function SceneSVG({ svg, style }) {
  return (
    <div
      className="ffw-scene-html"
      style={{
        border: '.5px solid rgba(255,255,255,.07)',
        borderRadius: 16,
        overflow: 'hidden',
        background: '#0A0808',
        position: 'relative',
        transition: 'border-color .5s, box-shadow .5s, transform .6s var(--e)',
        ...style,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(236,32,39,.28)';
        e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,.45), 0 0 40px rgba(236,32,39,.06)';
        e.currentTarget.style.transform = 'translateY(-4px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,.07)';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.transform = 'none';
      }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
