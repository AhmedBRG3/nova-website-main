// Builds upload-ready zips for GoDaddy cPanel (File Manager → Upload → Extract).
//   deploy/site-update.zip   code only. Use for every redeploy: it does NOT
//                            contain content/ or admin/data/, so the media
//                            buyer's live edits and logins are never overwritten.
//   deploy/first-install.zip everything incl. content/ — first upload only.
// Run after `npm run build`.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
if (!existsSync(`${root}dist/seo.php`)) { console.error('Run npm run build first.'); process.exit(1); }
mkdirSync(`${root}deploy`, { recursive: true });
for (const f of ['site-update.zip', 'first-install.zip']) rmSync(`${root}deploy/${f}`, { force: true });

const zip = (name, excludes) => execFileSync('zip', ['-qr', `../deploy/${name}`, '.', '-x', ...excludes], { cwd: `${root}dist` });
const always = ['admin/data/users.php', 'admin/data/backups/*', 'admin/data/audit.log', 'admin/data/fail-*', '*.DS_Store'];
zip('site-update.zip', [...always, 'content/*']);
zip('first-install.zip', always);
console.log('deploy/site-update.zip    → every redeploy (keeps live content + logins)');
console.log('deploy/first-install.zip  → first upload only (includes content/)');
