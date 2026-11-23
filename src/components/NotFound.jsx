// ─────────────────────────────────────────
//  NotFound
//  Shown for unknown URLs and for section pages that are
//  switched off. The server (seo.php) returns HTTP 404 for the
//  same URLs; this keeps the in-app view consistent.
// ─────────────────────────────────────────
import { Link, useLocation } from 'react-router-dom';
import useSeo from '../hooks/useSeo';

export default function NotFound() {
  const { pathname: path } = useLocation();
  useSeo({ title: 'Page not found | NOVA', description: '', path, noindex: true });
  return (
    <section className="case-study-notfound">
      <p className="section-eyebrow">404</p>
      <h1 className="section-title">Page not found</h1>
      <p className="section-body">This page doesn&apos;t exist, or it isn&apos;t published yet.</p>
      <Link to="/" className="btn-p">Back to the home page</Link>
    </section>
  );
}
