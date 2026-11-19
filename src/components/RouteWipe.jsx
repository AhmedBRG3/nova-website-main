// ─────────────────────────────────────────
//  RouteWipe
//  A black curtain with a red leading edge that
//  covers the screen the instant the route
//  changes, then sweeps away to the right —
//  revealing the new page like a scene cut.
//  Also resets scroll to the top of the new page.
// ─────────────────────────────────────────
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function RouteWipe() {
  const { pathname, hash } = useLocation();
  const first = useRef(true);
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (!hash) window.scrollTo(0, 0);
    setKey((k) => k + 1);
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!key) return null;
  return <div key={key} className="route-wipe" aria-hidden="true" onAnimationEnd={() => setKey(0)} />;
}
