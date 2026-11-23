// ─────────────────────────────────────────
//  RouteWipe
//  A black curtain with a red leading edge that
//  covers the screen the instant the route
//  changes, then sweeps away to the right —
//  revealing the new page like a scene cut.
//
//  Also owns scroll position across routes:
//    • new navigation (link click) → top of the new page,
//      unless the URL has a #section (HomePage scrolls to it)
//    • browser Back / Forward → the exact position the visitor
//      left that page at (e.g. back from /about lands on the
//      About section, not the top of the home page)
//  Positions are kept per history entry (location.key).
//  main.jsx sets history.scrollRestoration = 'manual', so the
//  browser doesn't fight this.
// ─────────────────────────────────────────
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

const positions = new Map(); // location.key -> scrollY

export default function RouteWipe() {
  const { pathname, hash, key } = useLocation();
  const navType = useNavigationType();
  const keyRef = useRef(key);
  const firstScroll = useRef(true);
  const firstWipe = useRef(true);
  const [wipe, setWipe] = useState(0);

  // Remember where the visitor is on the current history entry.
  useEffect(() => {
    const onScroll = () => positions.set(keyRef.current, window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Runs after the new page is in the DOM but before it is painted,
  // so a restored position never flashes the top of the page first.
  useLayoutEffect(() => {
    keyRef.current = key;
    if (firstScroll.current) { firstScroll.current = false; return; }
    if (navType === 'POP' && positions.has(key)) window.scrollTo(0, positions.get(key));
    else if (!hash) window.scrollTo(0, 0);
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (firstWipe.current) { firstWipe.current = false; return; }
    setWipe((k) => k + 1);
  }, [pathname]);

  if (!wipe) return null;
  return <div key={wipe} className="route-wipe" aria-hidden="true" onAnimationEnd={() => setWipe(0)} />;
}
