// ─────────────────────────────────────────
//  Illustration barrel export
//  Each of these is a raw SVG markup string
//  extracted from the master design. They're
//  rendered via dangerouslySetInnerHTML inside
//  <SceneSVG> because hand-converting ~300
//  SVG attributes to camelCase JSX props for
//  six illustrations isn't worth the risk of
//  a typo silently breaking a shape — the
//  source strings are already tested pixel by
//  pixel in the shipped page.
// ─────────────────────────────────────────
export { FACTORY_SVG }   from './factory';
export { BOOTH_SVG }     from './booth';
export { ROADSHOW_SVG }  from './roadshow';
export { RETAIL_SVG }    from './retail';
export { TOLL_SVG }      from './toll';
export { INSTORE_SVG }   from './instore';
