// ─────────────────────────────────────────
//  Navbar
//  Fixed nav. Its fade/slide-in entrance after
//  the preloader lifts is driven entirely by
//  the `body.loaded nav{...}` rule in
//  GlobalStyles (see App.jsx for where that
//  class gets added) — turns to frosted glass
//  past 60px of scroll, has a magnetic CTA.
//  Nav links smooth-scroll when already on the
//  home page; from a case-study page they route
//  back to "/" and land on that section instead.
// ─────────────────────────────────────────
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useScrollEngine from '../hooks/useScrollEngine';
import useMagnet from '../hooks/useMagnet';
import NovaLogo from './NovaLogo';
import { NAV_LINKS } from '../data';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const ctaRef = useMagnet();
  const navigate = useNavigate();
  const location = useLocation();

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

  const handleClick = (e, href) => {
    e.preventDefault();
    setMenuOpen(false);
    if (location.pathname !== '/') {
      navigate(`/${href}`);
      return;
    }
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <nav aria-label="Main navigation" className={scrolled ? 'sc' : ''}>
        <Link to="/" aria-label="NOVA Home" className="nav-logo">
          <NovaLogo height={38} />
        </Link>

        <ul className="nav-links">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={href}>
              <a href={href} onClick={(e) => handleClick(e, href)}>
                {label}
              </a>
            </li>
          ))}
        </ul>

        <a
          ref={ctaRef}
          href="#contact"
          onClick={(e) => handleClick(e, '#contact')}
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
              <a href={href} onClick={(e) => handleClick(e, href)}>
                {label}
              </a>
            </li>
          ))}
        </ul>
        <a href="#contact" onClick={(e) => handleClick(e, '#contact')} className="nav-mobile-cta">
          Start a Project
        </a>
      </div>
    </>
  );
}
