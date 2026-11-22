// Serve dist/ with real Apache + PHP (Docker php:8.2-apache), using the real
// .htaccess files — the closest local match to GoDaddy cPanel hosting.
//   npm run build && npm run preview:apache      -> http://localhost:8090
//   npm run preview:apache -- stop
// Admin users/backups/logs live in .dev/apache-data (never inside dist/).
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, copyFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const NAME = 'nova-apache';
const PORT = process.env.PORT || 8090;
const docker = (...args) => spawnSync('docker', args, { encoding: 'utf8' });

docker('rm', '-f', NAME);
if (process.argv.includes('stop')) { console.log('Stopped.'); process.exit(0); }

if (docker('info').status !== 0) {
  console.error('Docker is not running. Start Docker Desktop, then run this again.');
  process.exit(1);
}
if (!existsSync(`${root}dist/seo.php`)) {
  console.error('dist/ not built yet. Run: npm run build');
  process.exit(1);
}

const data = `${root}.dev/apache-data`;
mkdirSync(data, { recursive: true });
if (!existsSync(`${data}/users.php`)) {
  if (existsSync(`${root}.dev/admin-data/users.php`)) copyFileSync(`${root}.dev/admin-data/users.php`, `${data}/users.php`);
  else console.log(execFileSync('php', [`${root}scripts/make-admin-user.php`, `--out=${data}/users.php`], { encoding: 'utf8' }));
}

const setup = [
  'a2enmod rewrite headers expires deflate >/dev/null',
  "sed -i 's/AllowOverride None/AllowOverride All/' /etc/apache2/apache2.conf",
  "echo 'SetEnv NOVA_ADMIN_DATA /srv/nova-admin-data' > /etc/apache2/conf-enabled/nova.conf",
  'chown -R www-data /srv/nova-admin-data /var/www/html/content',
  'exec apache2-foreground',
].join(' && ');

const r = docker('run', '-d', '--name', NAME, '-p', `${PORT}:80`,
  '-v', `${root}dist:/var/www/html`, '-v', `${data}:/srv/nova-admin-data`,
  'php:8.2-apache', 'bash', '-c', setup);
if (r.status !== 0) { console.error(r.stderr); process.exit(1); }
console.log(`Apache preview: http://localhost:${PORT}   admin: http://localhost:${PORT}/admin/`);
console.log('Logins are in .dev/admin-data (same as npm run dev). Stop with: npm run preview:apache -- stop');
