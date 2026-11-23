// ─────────────────────────────────────────
//  Footer
//  Dimmed logo + nav links + section-page links + copyright.
//  Section links smooth-scroll on the home page; from any other
//  page they route back to "/#section" (same as the Navbar).
// ─────────────────────────────────────────
import { Link, useLocation, useNavigate } from 'react-router-dom';
import NovaLogo from './NovaLogo';
import { NAV_LINKS } from '../data';
import { enabledPages } from '../data/caseStudies';

export default function Footer() {
  const location = useLocation();
  const navigate = useNavigate();
  const pages = enabledPages();

  const handleClick = (e, href) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate(`/${href}`);
      return;
    }
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer role="contentinfo" className="light-section" aria-label="NOVA site footer">
      <NovaLogo height={30} dim dark />

      <div className="footer-links">
        {NAV_LINKS.map(({ label, href }) => (
          <a key={href} href={`/${href}`} onClick={(e) => handleClick(e, href)}>{label}</a>
        ))}
      </div>

      {pages.length > 0 && (
        <nav className="footer-links footer-pages" aria-label="Section pages">
          {pages.map((p) => (
            <Link key={p.slug} to={`/${p.slug}`}>{p.title}</Link>
          ))}
        </nav>
      )}

      <span className="footer-copy">© 2025 NOVA Marketing &amp; Events. All rights reserved.</span>
    </footer>
  );
}
