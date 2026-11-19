// ─────────────────────────────────────────
//  Footer
//  Dimmed logo + nav links + copyright line.
// ─────────────────────────────────────────
import NovaLogo from './NovaLogo';
import { NAV_LINKS } from '../data';

export default function Footer() {
  const handleClick = (e, href) => {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer role="contentinfo" className="light-section" aria-label="NOVA site footer">
      <NovaLogo height={30} dim dark />

      <div className="footer-links">
        {NAV_LINKS.map(({ label, href }) => (
          <a key={href} href={href} onClick={(e) => handleClick(e, href)}>{label}</a>
        ))}
      </div>

      <span className="footer-copy">© 2025 NOVA Marketing &amp; Events. All rights reserved.</span>
    </footer>
  );
}
