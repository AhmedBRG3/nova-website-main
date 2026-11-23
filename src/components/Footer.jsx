// ─────────────────────────────────────────
//  Footer
//  Dimmed logo + the same tabs as the Navbar + copyright.
//  Tabs behave like the Navbar (see useSectionNav): a section
//  with a live page (About → /about) opens it; otherwise they
//  scroll to the section, or route back to "/#section".
// ─────────────────────────────────────────
import NovaLogo from './NovaLogo';
import { NAV_LINKS } from '../data';
import useSectionNav from '../hooks/useSectionNav';

export default function Footer() {
  const nav = useSectionNav();

  return (
    <footer role="contentinfo" className="light-section" aria-label="NOVA site footer">
      <NovaLogo height={30} dim dark />

      <div className="footer-links">
        {NAV_LINKS.map(({ label, href }) => (
          <a key={href} href={nav.href(href)} onClick={(e) => nav.go(e, href)} aria-current={nav.current(href)}>{label}</a>
        ))}
      </div>

      <span className="footer-copy">© 2025 NOVA Marketing &amp; Events. All rights reserved.</span>
    </footer>
  );
}
