// End-to-end checks against the Apache preview (real .htaccess + PHP).
//   npm run build && npm run preview:apache && npm run test:admin
//   BASE=https://novaadv.com npm run test:admin -- --read-only   (live site, no logins/writes)
//
// Write tests use throwaway logins: this script rewrites .dev/apache-data/users.php
// (preview only) and prints the new passwords at the end. Content files in dist/
// are snapshotted first and restored afterwards.
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, readdirSync, rmSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const BASE = (process.env.BASE || 'http://localhost:8090').replace(/\/$/, '');
const READ_ONLY = process.argv.includes('--read-only');
const DATA = `${root}.dev/apache-data`;
const CONTENT = `${root}dist/content`;

let failures = 0;
const ok = (cond, msg, extra = '') => {
  console.log(`${cond ? '✓' : '✗'} ${msg}${!cond && extra ? `\n    ${extra}` : ''}`);
  if (!cond) failures++;
};
const unescape = (s) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/&amp;/g, '&');

let cookie = '';
async function req(path, { method = 'GET', form } = {}) {
  const res = await fetch(BASE + path, {
    method,
    redirect: 'manual',
    headers: { ...(cookie ? { cookie } : {}), ...(form ? { 'content-type': 'application/x-www-form-urlencoded' } : {}) },
    body: form ? new URLSearchParams(form).toString() : undefined,
  });
  const sc = res.headers.get('set-cookie');
  if (sc && sc.startsWith('nova_admin=')) cookie = sc.split(';')[0];
  return { status: res.status, location: res.headers.get('location') || '', text: await res.text() };
}
const csrfOf = (html) => (html.match(/name="csrf" value="([a-f0-9]+)"/) || [])[1];
/** All input/textarea name→value pairs of the first <form method="post"> containing `action`. */
function formFields(html) {
  const out = [];
  for (const m of html.matchAll(/<input type="(?:hidden|text|number)" name="([^"]+)"[^>]*?value="([^"]*)"/g)) out.push([unescape(m[1]), unescape(m[2])]);
  for (const m of html.matchAll(/<input type="text" name="([^"]+)" data-min[^>]*value="([^"]*)"/g)) out.push([unescape(m[1]), unescape(m[2])]);
  for (const m of html.matchAll(/<textarea name="([^"]+)"[^>]*>([\s\S]*?)<\/textarea>/g)) out.push([unescape(m[1]), unescape(m[2])]);
  return Object.fromEntries(out);
}

// ── public, read-only checks ────────────────────────────────
const home = await req('/');
ok(home.status === 200, `/ → 200 (no redirect loop)`, `got ${home.status} ${home.location}`);
ok(/<title>[^<]{10,}<\/title>/.test(home.text), '/ has a title');
ok(/<div class="ssr"><h1>/.test(home.text), '/ has crawlable H1 in .ssr');
ok(home.text.includes('application/ld+json') && home.text.includes('LocalBusiness'), '/ has LocalBusiness JSON-LD');
ok(home.text.includes(".js #root>.ssr{display:none}"), '/ hides crawler text when JS runs');

for (const [p, loc] of [['/index.html', '/'], ['/seo.php', '/']]) {
  const r = await req(p);
  ok(r.status === 301 && new URL(r.location, BASE).pathname === loc, `${p} → 301 ${loc}`, `got ${r.status} ${r.location}`);
}
const adminPage = await req('/admin/');
ok(adminPage.status === 200 && adminPage.text.includes('Log in'), '/admin/ shows login (not 403)', `got ${adminPage.status}`);

const work = JSON.parse((await req('/content/work.json')).text);
const cs = work[0];
const wp = await req(`/work/${cs.slug}`);
ok(wp.status === 200 && wp.text.includes(`<title>${cs.seoTitle.replace(/&/g, '&amp;')}`), `/work/${cs.slug} → 200 with its own title`);
const slash = await req(`/work/${cs.slug}/`);
ok(slash.status === 301 && slash.location.endsWith(`/work/${cs.slug}`), '/work/x/ → 301 /work/x', `got ${slash.status} ${slash.location}`);
for (const p of ['/work/does-not-exist', '/nothing-here']) ok((await req(p)).status === 404, `${p} → 404`);

const sm = await req('/sitemap.xml');
ok(sm.status === 200 && sm.text.includes('<urlset') && sm.text.includes(`/work/${cs.slug}`), '/sitemap.xml lists case studies');
ok((await req('/robots.txt')).text.includes('Sitemap:'), '/robots.txt references sitemap');
for (const p of ['/admin/data/users.php', '/admin/data/audit.log', '/admin/lib.php', '/admin/richtext.php', '/admin/views/home.php']) {
  const s = (await req(p)).status;
  ok(s === 403 || s === 404, `${p} is not served (${s})`);
}

if (READ_ONLY) finish();

// ── write tests (preview only) ───────────────────────────────
if (!BASE.includes('localhost') && !BASE.includes('127.0.0.1')) { console.error('Write tests only run against localhost.'); process.exit(1); }
const snapshot = Object.fromEntries(readdirSync(CONTENT).map((f) => [f, readFileSync(`${CONTENT}/${f}`)]));
const pass = { admin: `admin-${Math.random().toString(36).slice(2)}`, mediabuyer: `buyer-${Math.random().toString(36).slice(2)}` };
execFileSync('php', [`${root}scripts/make-admin-user.php`, `--out=${DATA}/users.php`, `--admin=${pass.admin}`, `--mediabuyer=${pass.mediabuyer}`]);
const clearThrottle = () => readdirSync(DATA).filter((f) => f.startsWith('fail-')).forEach((f) => rmSync(`${DATA}/${f}`));
clearThrottle();

try {
  const bad = await req('/admin/', { method: 'POST', form: { action: 'login', user: 'mediabuyer', pass: 'wrong-password' } });
  ok(bad.text.includes('Wrong username or password'), 'wrong password rejected');
  // Docker Desktop's bind mount can serve the old users.php for a moment
  // after it is rewritten, so retry briefly before calling it a failure.
  let login;
  for (let i = 0; i < 4; i++) {
    login = await req('/admin/', { method: 'POST', form: { action: 'login', user: 'mediabuyer', pass: pass.mediabuyer } });
    if (login.status === 302) break;
    clearThrottle();
    await new Promise((r) => setTimeout(r, 1500));
  }
  ok(login.status === 302, 'mediabuyer logs in');
  if (login.status !== 302) throw new Error('Cannot log in — skipping write tests');

  ok((await req('/admin/', { method: 'POST', form: { action: 'save_home' } })).status === 403, 'POST without CSRF → 403');

  // Home text with links
  const textPage = await req('/admin/?view=text');
  const fields = formFields(textPage.text);
  ok(Object.keys(fields).length > 40, `home text form has all fields (${Object.keys(fields).length})`);
  const linked = 'Brand activations and [exhibition stands](/#services) in Egypt, trusted by [Pfizer](https://www.pfizer.com).';
  let r = await req('/admin/', { method: 'POST', form: { ...fields, 'hero[sub]': linked } });
  ok(r.status === 302, 'home text with links saves', r.text.match(/<li>[^<]+/g)?.join(' '));
  const after = await req('/');
  ok(after.text.includes('<a href="/#services">exhibition stands</a>'), 'internal link in crawler HTML');
  ok(after.text.includes('<a href="https://www.pfizer.com" target="_blank" rel="noopener">Pfizer</a>'), 'external link in crawler HTML');
  ok(JSON.parse(readFileSync(`${CONTENT}/home.json`, 'utf8')).hero.sub === linked, 'home.json updated live');

  for (const [bad, why] of [['[x](javascript:alert(1)) text here long enough', 'javascript: rejected'],
                            ['See [missing](/work/not-a-case) text here long enough', 'broken internal link rejected'],
                            ['See [x](#nowhere) section text here long enough', 'unknown #anchor rejected']]) {
    const f2 = formFields((await req('/admin/?view=text')).text);
    r = await req('/admin/', { method: 'POST', form: { ...f2, 'hero[sub]': bad } });
    ok(r.status === 200 && r.text.includes('Not saved'), why);
  }
  ok(JSON.parse(readFileSync(`${CONTENT}/home.json`, 'utf8')).hero.sub === linked, 'rejected saves left content unchanged');

  // Preview endpoint
  const pv = JSON.parse((await req('/admin/', { method: 'POST', form: { action: 'preview', csrf: csrfOf(textPage.text), text: 'a [b](https://c.com) d', min: '0', max: '100' } })).text);
  ok(pv.html.includes('<a href="https://c.com"'), 'live preview renders links');

  // Case study: summary link + slug lock for the editor
  const edit = await req(`/admin/?view=edit&slug=${cs.slug}`);
  const ef = formFields(edit.text);
  const photos = cs.photos;
  const form = new URLSearchParams({ ...ef, slug: 'hacked-slug', summary: `${cs.summary} Built in [our factory](/#services).` });
  form.delete('photo_id[]'); form.delete('photo_alt[]');
  photos.forEach((p) => { form.append('photo_id[]', p.id); form.append('photo_alt[]', p.alt); });
  r = await req('/admin/', { method: 'POST', form });
  ok(r.status === 302, 'case study saves', r.text.match(/<li>[^<]+/g)?.join(' '));
  ok((await req('/work/hacked-slug')).status === 404, 'mediabuyer cannot change the slug');
  const wp2 = await req(`/work/${cs.slug}`);
  ok(wp2.text.includes('<a href="/#services">our factory</a>'), 'case-study summary link in crawler HTML');
  ok(!/<meta name="description" content="[^"]*\]\(/.test(wp2.text) && !/"description":"[^"]*\]\(/.test(wp2.text), 'meta + JSON-LD have no link markup');

  // History → restore the home text
  const hist = await req('/admin/?view=history');
  const name = (hist.text.match(/name="name" value="([^"]+__home\.json)"/) || [])[1];
  ok(!!name, 'history lists the home text backup');
  r = await req('/admin/', { method: 'POST', form: { action: 'restore', csrf: csrfOf(hist.text), name } });
  ok(r.status === 302, 'restore succeeds');
  ok(JSON.parse(readFileSync(`${CONTENT}/home.json`, 'utf8')).hero.sub === JSON.parse(snapshot['home.json']).hero.sub, 'restore brings back the previous text');

  // Login throttle (last, it locks this IP for 15 min)
  cookie = '';
  for (let i = 0; i < 5; i++) await req('/admin/', { method: 'POST', form: { action: 'login', user: 'x', pass: 'y' } });
  ok((await req('/admin/', { method: 'POST', form: { action: 'login', user: 'admin', pass: pass.admin } })).text.includes('Too many attempts'), 'login throttled after 5 failures');
} finally {
  clearThrottle();
  for (const [f, buf] of Object.entries(snapshot)) writeFileSync(`${CONTENT}/${f}`, buf);
  if (existsSync(`${DATA}/backups`)) rmSync(`${DATA}/backups`, { recursive: true, force: true });
  console.log(`\nPreview logins were reset for this run: admin / ${pass.admin}   mediabuyer / ${pass.mediabuyer}`);
}
finish();

function finish() {
  console.log(failures ? `\n${failures} check(s) failed` : '\nAll checks passed');
  process.exit(failures ? 1 : 0);
}
