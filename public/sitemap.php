<?php
// Dynamic sitemap: always reflects the current case studies in /content/work.json.
$site = 'https://novaadv.com';
require __DIR__ . '/admin/shared.php';
$work = json_decode(@file_get_contents(__DIR__ . '/content/work.json'), true) ?: [];
$mtime = date('Y-m-d', @filemtime(__DIR__ . '/content/work.json') ?: time());
header('Content-Type: application/xml; charset=utf-8');
echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
echo "  <url><loc>$site/</loc><lastmod>$mtime</lastmod><priority>1.0</priority></url>\n";
// Section pages appear only while switched on.
foreach (nova_enabled_pages(__DIR__) as $p) {
    $slug = htmlspecialchars($p['slug'], ENT_XML1);
    $pm = date('Y-m-d', @filemtime(__DIR__ . '/content/pages.json') ?: @filemtime(__DIR__ . '/defaults/pages.json') ?: time());
    echo "  <url><loc>$site/$slug</loc><lastmod>$pm</lastmod><priority>0.8</priority></url>\n";
}
foreach ($work as $cs) {
    $slug = htmlspecialchars($cs['slug'], ENT_XML1);
    echo "  <url><loc>$site/work/$slug</loc><lastmod>$mtime</lastmod><priority>0.7</priority></url>\n";
}
echo "</urlset>\n";
