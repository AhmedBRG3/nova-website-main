// ─────────────────────────────────────────
//  useSplitChars
//  Splits a string into an array of
//  { char, delay } so the hero headline can
//  cascade in character-by-character.
//  Pass a running `startIndex` ref/counter if
//  you want delays to continue across multiple
//  lines rather than resetting each line.
//
//  Usage:
//    const chars = useSplitChars("We Don't Just", 0);
//    {chars.map(({char, delay}, i) => (
//      <span key={i} className={`ch ${loaded ? 'show' : ''}`}
//            style={{ transitionDelay: `${0.55 + delay*0.028}s` }}>
//        {char === ' ' ? '\u00a0' : char}
//      </span>
//    ))}
// ─────────────────────────────────────────
export default function useSplitChars(text, startIndex = 0) {
  return text.split('').map((char, i) => ({
    char,
    delay: startIndex + i,
  }));
}
