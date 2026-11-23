<?php
// ─────────────────────────────────────────
//  SEO router (all non-file URLs land here via .htaccess).
//  Serves the built React app (index.html) with each page's own
//  <title>, description, canonical, social tags and JSON-LD, plus a
//  crawlable text version of the page inside <div class="ssr">.
//  Visitors with JS never see that block (index.html hides it and
//  React replaces it); crawlers and link previews read it.
//  Content comes from /content/*.json (edited via /admin) — no rebuild.
//  Works on PHP 7.4+.
// ─────────────────────────────────────────
require __DIR__ . '/admin/richtext.php';
require __DIR__ . '/admin/shared.php';

$site = 'https://novaadv.com';
$html = @file_get_contents(__DIR__ . '/index.html');
if ($html === false) { http_response_code(500); exit('index.html missing'); }

$load = function ($f) { return json_decode((string)@file_get_contents(__DIR__ . "/content/$f"), true) ?: []; };
$seo  = $load('seo.json');
$work = $load('work.json');
$home = $load('home.json');
$pages = nova_enabled_pages(__DIR__);
$e = function ($s) { return htmlspecialchars((string)$s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'); };
$rich = function ($s) { return rt_to_html((string)$s); };

$path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
// One URL per page: /work/x/ -> /work/x (also handled in .htaccess).
if ($path !== '/' && substr($path, -1) === '/') {
    header('Location: ' . rtrim($path, '/'), true, 301);
    exit;
}

$h     = $seo['home'] ?? [];
$title = $h['title'] ?? 'NOVA';
$desc  = $h['description'] ?? '';
$image = $h['ogImage'] ?? '/og-image.jpg';
$body  = '';
$ld    = [];
$status = 200;

if ($path === '/') {
    $ld[] = [
        '@context' => 'https://schema.org', '@type' => ['Organization', 'LocalBusiness'],
        'name' => 'NOVA Marketing & Events', 'url' => $site . '/', 'logo' => $site . '/favicon.svg',
        'image' => $site . $image, 'email' => 'info@novaadv.com', 'telephone' => '+201299911031',
        'description' => $desc, 'openingHours' => 'Su-Th 09:00-18:00',
        'address' => ['@type' => 'PostalAddress', 'streetAddress' => '3/B, Masr El Taamir Buildings, Zahraa El Maadi',
                      'addressLocality' => 'Cairo', 'addressCountry' => 'EG'],
    ];
    $ld[] = ['@context' => 'https://schema.org', '@type' => 'WebSite', 'name' => 'NOVA Marketing & Events', 'url' => $site . '/'];

    $hero = $home['hero'] ?? [];
    $body .= '<h1>' . $e(trim(($hero['line1'] ?? '') . ' ' . ($hero['line2'] ?? '')) ?: $title) . '</h1>';
    if (!empty($hero['sub'])) $body .= '<p>' . $rich($hero['sub']) . '</p>';
    if (!empty($home['services'])) {
        $body .= '<section id="services"><h2>Services</h2>';
        foreach ($home['services'] as $s) {
            $body .= '<h3>' . $e(str_replace("\n", ' ', $s['title'] ?? '')) . '</h3><p>' . $rich($s['desc'] ?? '') . '</p>';
        }
        $body .= '</section>';
    }
    foreach ([['about', 'About NOVA', $home['about']['body'] ?? ''], ['ffw', 'In-House Production', $home['ffw']['sub'] ?? ''],
              ['ybe', 'Brand Reach', $home['ybe']['sub'] ?? '']] as [$id, $heading, $text]) {
        if ($text !== '') $body .= '<h2>' . $e($heading) . '</h2><p>' . $rich($text) . '</p>';
    }
    if ($work) {
        $body .= '<section id="portfolio"><h2>Our Work</h2><ul>';
        foreach ($work as $c) $body .= '<li><a href="/work/' . $e($c['slug']) . '">' . $e($c['project']) . ' — ' . $e($c['client']) . '</a></li>';
        $body .= '</ul></section>';
    }
    if ($pages) {
        $body .= '<nav><h2>More from NOVA</h2><ul>';
        foreach ($pages as $p) $body .= '<li><a href="/' . $e($p['slug']) . '">' . $e($p['readMoreLabel'] ?? $p['title']) . '</a></li>';
        $body .= '</ul></nav>';
    }
    if (!empty($home['contact']['body'])) $body .= '<h2>Contact</h2><p>' . $rich($home['contact']['body']) . '</p>';
} elseif (preg_match('#^/work/([a-z0-9-]+)$#', $path, $m)) {
    $cs = null;
    foreach ($work as $c) if (($c['slug'] ?? '') === $m[1]) { $cs = $c; break; }
    if ($cs) {
        $summary = rt_strip($cs['summary'] ?? '');
        $title = $cs['seoTitle'] ?? ($cs['project'] . ' | NOVA');
        $desc  = $cs['seoDescription'] ?? $summary;
        $first = $cs['photos'][0]['id'] ?? null;
        if ($first) { $imgs = glob(__DIR__ . "/work/$first-*.jpg") ?: []; rsort($imgs, SORT_NATURAL); if ($imgs) $image = '/work/' . basename($imgs[0]); }
        $ld[] = ['@context' => 'https://schema.org', '@type' => 'BreadcrumbList', 'itemListElement' => [
            ['@type' => 'ListItem', 'position' => 1, 'name' => 'Home', 'item' => $site . '/'],
            ['@type' => 'ListItem', 'position' => 2, 'name' => 'Our Work', 'item' => $site . '/#portfolio'],
            ['@type' => 'ListItem', 'position' => 3, 'name' => $cs['project'], 'item' => $site . $path]]];
        $ld[] = ['@context' => 'https://schema.org', '@type' => 'CreativeWork', 'name' => $cs['project'],
                 'description' => $desc, 'image' => $site . $image, 'url' => $site . $path,
                 'creator' => ['@type' => 'Organization', 'name' => 'NOVA Marketing & Events', 'url' => $site . '/'],
                 'about' => $cs['client']];
        $body = '<article><p><a href="/#portfolio">Our Work</a></p><h1>' . $e($cs['project']) . '</h1><p>' . $e($cs['client']) . ' — ' . $e($cs['tag'])
              . '</p><p>' . $rich($cs['summary'] ?? '') . '</p>';
        foreach ($cs['photos'] as $p) {
            $body .= '<img src="/work/' . $e($p['id']) . '-420.jpg" alt="' . $e($p['alt']) . '" width="420" loading="lazy">';
        }
        $body .= '</article>';
    } else {
        $status = 404; $title = 'Project not found | NOVA'; $desc = $seo['workDefaultDescription'] ?? '';
    }
} elseif (preg_match('#^/([a-z0-9-]+)$#', $path, $m) && ($pg = current(array_filter($pages, function ($p) use ($m) { return $p['slug'] === $m[1]; })))) {
    // Section page (/about, /services, …) — only reachable while switched on.
    $title = $pg['seoTitle'] ?? $pg['title'];
    $desc  = $pg['seoDescription'] ?? '';
    $ld[] = ['@context' => 'https://schema.org', '@type' => 'BreadcrumbList', 'itemListElement' => [
        ['@type' => 'ListItem', 'position' => 1, 'name' => 'Home', 'item' => $site . '/'],
        ['@type' => 'ListItem', 'position' => 2, 'name' => $pg['title'], 'item' => $site . $path]]];
    $ld[] = ['@context' => 'https://schema.org', '@type' => $pg['slug'] === 'about' ? 'AboutPage' : 'WebPage',
             'name' => $pg['title'], 'description' => $desc, 'url' => $site . $path,
             'isPartOf' => ['@type' => 'WebSite', 'name' => 'NOVA Marketing & Events', 'url' => $site . '/']];
    $body = '<article><p><a href="/#' . $e($pg['sectionAnchor'] ?? '') . '">Back to ' . $e($pg['section'] ?? 'home') . '</a></p>'
          . (!empty($pg['eyebrow']) ? '<p>' . $e($pg['eyebrow']) . '</p>' : '') . '<h1>' . $e($pg['title']) . '</h1>';
    foreach ($pg['blocks'] ?? [] as $bl) {
        $t = $bl['type'] ?? 'p';
        if ($t === 'h2' || $t === 'h3') $body .= "<$t>" . $e($bl['text'] ?? '') . "</$t>";
        elseif ($t === 'list') $body .= '<ul>' . implode('', array_map(function ($i) use ($rich) { return '<li>' . $rich($i) . '</li>'; }, $bl['items'] ?? [])) . '</ul>';
        else $body .= '<p>' . $rich($bl['text'] ?? '') . '</p>';
    }
    $others = array_filter($pages, function ($p) use ($pg) { return $p['slug'] !== $pg['slug']; });
    if ($others) {
        $body .= '<nav><h2>More from NOVA</h2><ul>';
        foreach ($others as $p) $body .= '<li><a href="/' . $e($p['slug']) . '">' . $e($p['title']) . '</a></li>';
        $body .= '</ul></nav>';
    }
    $body .= '<p><a href="/#contact">Start a project</a></p></article>';
} else {
    $status = 404; $title = 'Page not found | NOVA'; $desc = '';
}

$url = $site . $path;
$imgUrl = strncmp($image, 'http', 4) === 0 ? $image : $site . $image;
$robots = $status === 404 ? 'noindex,nofollow' : 'index,follow';

$meta = '<title>' . $e($title) . '</title>' . "\n"
  . '    <meta name="description" content="' . $e($desc) . '" />' . "\n"
  . '    <meta name="robots" content="' . $robots . '" />' . "\n"
  . '    <link rel="canonical" href="' . $e($url) . '" />' . "\n"
  . '    <meta property="og:type" content="website" />' . "\n"
  . '    <meta property="og:url" content="' . $e($url) . '" />' . "\n"
  . '    <meta property="og:site_name" content="NOVA Marketing &amp; Events" />' . "\n"
  . '    <meta property="og:title" content="' . $e($title) . '" />' . "\n"
  . '    <meta property="og:description" content="' . $e($desc) . '" />' . "\n"
  . '    <meta property="og:image" content="' . $e($imgUrl) . '" />' . "\n"
  . '    <meta name="twitter:card" content="summary_large_image" />' . "\n"
  . '    <meta name="twitter:title" content="' . $e($title) . '" />' . "\n"
  . '    <meta name="twitter:description" content="' . $e($desc) . '" />' . "\n"
  . '    <meta name="twitter:image" content="' . $e($imgUrl) . '" />' . "\n";
foreach ($ld as $obj) {
    $meta .= '    <script type="application/ld+json">' . json_encode($obj, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG) . '</script>' . "\n";
}

// Drop the static head tags index.html ships with, then insert ours.
// preg_replace_callback: the inserted text is used literally (no $1 / \1 parsing).
$html = preg_replace('#<title>.*?</title>#s', '', $html, 1);
$html = preg_replace('#\s*<meta\s+(?:name|property)="(?:description|robots|og:[a-z:]+|twitter:[a-z:]+)"[^>]*?/?>#s', '', $html);
$html = preg_replace('#\s*<link\s+rel="canonical"[^>]*?/?>#s', '', $html);
$html = preg_replace_callback('#<meta name="theme-color"[^>]*>#', function ($m) use ($meta) { return $m[0] . "\n    " . $meta; }, $html, 1);
$html = str_replace('<div id="root"></div>', '<div id="root"><div class="ssr">' . $body . '</div></div>', $html);

http_response_code($status);
header('Content-Type: text/html; charset=utf-8');
echo $html;
