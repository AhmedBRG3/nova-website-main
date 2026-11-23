// ─────────────────────────────────────────
//  useSectionNav
//  Shared click logic for the Navbar and Footer menu tabs.
//  A tab whose section has a live page (About → /about) opens
//  that page; otherwise it smooth-scrolls to the section on the
//  home page, or routes back to "/#section" from any other page.
//  Ctrl/Cmd/Shift-click keeps the browser's open-in-new-tab.
// ─────────────────────────────────────────
import { useLocation, useNavigate } from 'react-router-dom';
import { sectionHref } from '../data/caseStudies';

export default function useSectionNav(onNavigate) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const go = (e, hash) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button > 0) return;
    e.preventDefault();
    onNavigate?.();
    const to = sectionHref(hash);
    if (to === pathname) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (to.startsWith('/#') && pathname === '/') {
      document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(to);
    }
  };

  return {
    href: sectionHref,
    go,
    current: (hash) => (sectionHref(hash) === pathname ? 'page' : undefined),
  };
}
