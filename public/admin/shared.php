<?php
// ─────────────────────────────────────────
//  Content readers shared by the admin, ../seo.php and ../sitemap.php.
//  Section pages: defaults/pages.json ships with the code; content/pages.json
//  is written by the admin's first save. Merged by slug — the live entry wins
//  field by field, and pages that only exist in the defaults are kept, so a
//  code update can add a page without touching live content.
//  The JS twin is mergePages() in src/data/caseStudies.js.
// ─────────────────────────────────────────

function nova_read_json(string $path): array {
    $data = json_decode((string)@file_get_contents($path), true);
    return is_array($data) ? $data : [];
}

function nova_load_pages(string $root): array {
    $live = [];
    foreach (nova_read_json("$root/content/pages.json") as $p) if (isset($p['slug'])) $live[$p['slug']] = $p;
    $out = [];
    foreach (nova_read_json("$root/defaults/pages.json") as $d) {
        if (!isset($d['slug'])) continue;
        $out[] = array_merge($d, $live[$d['slug']] ?? []);
        unset($live[$d['slug']]);
    }
    return array_merge($out, array_values($live));
}

function nova_enabled_pages(string $root): array {
    return array_values(array_filter(nova_load_pages($root), function ($p) { return !empty($p['enabled']); }));
}
