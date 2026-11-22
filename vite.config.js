import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { spawn, spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const PHP_PORT = 8081;
const root = fileURLToPath(new URL('.', import.meta.url));
const devData = `${root}.dev/admin-data`;

// Vite doesn't run PHP. During `npm run dev` this starts PHP's built-in
// server on public/ and proxies the PHP endpoints to it, so /admin, the
// contact form and the sitemap work locally. Admin users, backups and logs
// go to .dev/admin-data (git-ignored) instead of public/, so nothing from
// local testing ends up in dist/.
function phpDevServer() {
  let php;
  return {
    name: 'nova-php-dev',
    apply: 'serve',
    configureServer(server) {
      if (spawnSync('php', ['-v']).status !== 0) {
        server.config.logger.warn('\n  ⚠ PHP not found — the site runs, but /admin and the contact form need PHP (brew install php).\n');
        return;
      }
      if (!existsSync(`${devData}/users.php`)) {
        const r = spawnSync('php', [`${root}scripts/make-admin-user.php`, `--out=${devData}/users.php`], { encoding: 'utf8' });
        server.config.logger.info(`\n  Local admin logins (dev only):\n${r.stdout.replace(/^/gm, '    ')}`);
      }
      php = spawn('php', ['-S', `127.0.0.1:${PHP_PORT}`, '-t', 'public'], {
        cwd: root,
        env: { ...process.env, NOVA_ADMIN_DATA: devData },
        stdio: 'ignore',
      });
      server.httpServer?.once('close', () => php?.kill());
      process.once('exit', () => php?.kill());
      server.config.logger.info(`  ➜  Admin:   http://localhost:${server.config.server.port}/admin/  (PHP on :${PHP_PORT})`);
    },
  };
}

export default defineConfig({
  plugins: [react(), phpDevServer()],
  server: {
    port: Number(process.env.PORT) || 5173,
    strictPort: false,
    proxy: {
      '/admin': `http://127.0.0.1:${PHP_PORT}`,
      '/contact.php': `http://127.0.0.1:${PHP_PORT}`,
      '/sitemap.xml': { target: `http://127.0.0.1:${PHP_PORT}`, rewrite: () => '/sitemap.php' },
    },
  },
});
