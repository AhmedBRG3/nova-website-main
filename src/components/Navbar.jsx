// ─────────────────────────────────────────
//  Navbar
//  Fixed nav. Its fade/slide-in entrance after
//  the preloader lifts is driven entirely by
//  the `body.loaded nav{...}` rule in
//  GlobalStyles (see App.jsx for where that
//  class gets added) — turns to frosted glass
//  past 60px of scroll, has a magnetic CTA.
//  Tabs (see useSectionNav): About / Services open
//  their full page once it is live in the admin;
//  otherwise they smooth-scroll to the section on
//  the home page (or route back to "/#section").
// ─────────────────────────────────────────
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import useScrollEngine from '../hooks/useScrollEngine';
import useMagnet from '../hooks/useMagnet';
import useSectionNav from '../hooks/useSectionNav';
import NovaLogo from './NovaLogo';
import { NAV_LINKS } from '../data';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const ctaRef = useMagnet();
  const location = useLocation();
  const nav = useSectionNav(() => setMenuOpen(false));

  useScrollEngine(({ sy }) => setScrolled(sy > 60));

  // Close the drawer on route change and stop body scroll while it's open.
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);
  useEffect(() => {
    document.body.classList.toggle('nav-open', menuOpen);
  }, [menuOpen]);
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  return (
    <>
      <nav aria-label="Main navigation" className={`site-nav${scrolled ? ' sc' : ''}`}>
        <Link to="/" aria-label="NOVA Home" className="nav-logo">
          <NovaLogo height={38} />
        </Link>

        <ul className="nav-links">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={href}>
              <a href={nav.href(href)} onClick={(e) => nav.go(e, href)} aria-current={nav.current(href)}>
                {label}
              </a>
            </li>
          ))}
        </ul>

        <a
          ref={ctaRef}
          href="/#contact"
          onClick={(e) => nav.go(e, '#contact')}
          className="nav-cta"
        >
          Start a Project
        </a>

        <button
          type="button"
          className={`nav-toggle${menuOpen ? ' open' : ''}`}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="nav-mobile-menu"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span /><span /><span />
        </button>
      </nav>

      {/* Rendered as a sibling of <nav>, not a child — nav.sc's backdrop-filter
          (applied past 60px of scroll) establishes a new containing block for
          fixed-position descendants, which would collapse this drawer down to
          nav's own ~70px box instead of the full viewport. */}
      <div id="nav-mobile-menu" className={`nav-mobile${menuOpen ? ' open' : ''}`}>
        <ul>
          {NAV_LINKS.map(({ label, href }) => (
            <li key={href}>
              <a href={nav.href(href)} onClick={(e) => nav.go(e, href)} aria-current={nav.current(href)}>
                {label}
              </a>
            </li>
          ))}
        </ul>
        <a href="/#contact" onClick={(e) => nav.go(e, '#contact')} className="nav-mobile-cta">
          Start a Project
        </a>
      </div>
    </>
  );
}
