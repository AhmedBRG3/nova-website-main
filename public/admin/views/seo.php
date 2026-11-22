<?php
// Home-page SEO: <title>, meta description, share image.
if (!defined('NOVA_ADMIN')) { http_response_code(404); exit; }

function save_seo(array $in): array {
    $t = clean_text($in['title'] ?? ''); $d = clean_text($in['description'] ?? '');
    $img = clean_text($in['ogImage'] ?? ''); $wd = clean_text($in['workDefaultDescription'] ?? '');
    $errors = [];
    if (len($t) < 30 || len($t) > 70) $errors[] = 'Title must be 30–70 characters.';
    if (len($d) < 70 || len($d) > 160) $errors[] = 'Description must be 70–160 characters.';
    if (!preg_match('#^/[\w./-]+\.(jpg|jpeg|png|webp)$#i', $img) || !is_file(ROOT . $img)) $errors[] = 'Share image must be an existing image path like /og-image.jpg.';
    if (len($wd) > 160) $errors[] = 'Default work description: max 160 characters.';
    if (!$errors) {
        write_content('seo.json', ['home' => ['title' => $t, 'description' => $d, 'ogImage' => $img], 'workDefaultDescription' => $wd]);
        audit('saved home SEO');
    }
    return $errors;
}

function view_seo(array $post): string {
    $s = read_content('seo.json'); $h = $s['home'] ?? [];
    $v = function ($k, $def) use ($post) { return $post[$k] ?? $def; };
    return '<div class="card"><h2>Home page SEO</h2><p class="hint">What Google shows in search results and what WhatsApp/LinkedIn show when the link is shared.</p>'
        . '<form method="post">' . csrf_field() . '<input type="hidden" name="action" value="save_seo">'
        . plain_field('title', 'Title', $v('title', $h['title'] ?? ''), 30, 70, 'Put the main keyword first, e.g. "Brand Activations & Exhibitions in Cairo | NOVA".')
        . plain_field('description', 'Meta description', $v('description', $h['description'] ?? ''), 70, 160, 'One or two sentences that make people click. Plain text, no links.', 3)
        . plain_field('ogImage', 'Social share image path', $v('ogImage', $h['ogImage'] ?? '/og-image.jpg'), 5, 120, '1200×630 image already on the server, e.g. /og-image.jpg')
        . plain_field('workDefaultDescription', 'Fallback description for case-study pages', $v('workDefaultDescription', $s['workDefaultDescription'] ?? ''), 0, 160, '', 2)
        . '<p class="sticky-save"><button>Save &amp; publish</button></p></form></div>';
}
