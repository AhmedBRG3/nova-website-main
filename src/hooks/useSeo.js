// ─────────────────────────────────────────
//  useSeo
//  Sets the per-route <title>, description, canonical,
//  and Open Graph / X card tags. Values come from the
//  CMS-editable files in /content. Googlebot renders JS,
//  and the prerender step (see plan) bakes these into
//  static HTML for other crawlers and link previews.
// ─────────────────────────────────────────
import { useEffect } from 'react';

const SITE = 'https://novaadv.com';

function setMeta(attr, key, value) {
  if (!value) return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', value);
}

export default function useSeo({ title, description, path = '/', image = '/og-image.jpg', noindex = false }) {
  useEffect(() => {
    const url = SITE + path;
    const img = image.startsWith('http') ? image : SITE + image;
    if (title) document.title = title;
    setMeta('name', 'description', description);
    setMeta('name', 'robots', noindex ? 'noindex,nofollow' : 'index,follow');
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:image', img);
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', img);

    let link = document.head.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = url;
  }, [title, description, path, image, noindex]);
}
