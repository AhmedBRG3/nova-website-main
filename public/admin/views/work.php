<?php
// Case studies (/content/work.json): list, edit/create, delete (admin only).
if (!defined('NOVA_ADMIN')) { http_response_code(404); exit; }

function save_work(array $in, bool $isAdmin): array {
    $work = read_content('work.json');
    $orig = (string)($in['orig_slug'] ?? '');
    $isNew = $orig === '';
    $slug = ($isNew || $isAdmin) ? clean_text($in['slug'] ?? '') : $orig;
    $f = function ($k) use ($in) { return clean_text($in[$k] ?? ''); };
    $cs = ['order' => (int)$f('order'), 'slug' => $slug, 'client' => $f('client'), 'project' => $f('project'), 'tag' => $f('tag'),
           'summary' => $f('summary'), 'seoTitle' => $f('seoTitle'), 'seoDescription' => $f('seoDescription'), 'photos' => []];
    $errors = [];
    if (!preg_match('/^[a-z0-9-]{3,80}$/', $slug)) $errors[] = 'Slug: 3–80 lowercase letters, numbers, hyphens.';
    foreach ($work as $c) if ($c['slug'] === $slug && $slug !== $orig) $errors[] = 'That slug already exists.';
    foreach (['client' => 'Client', 'project' => 'Project title', 'tag' => 'Tag'] as $k => $n) {
        if (len($cs[$k]) < 2 || len($cs[$k]) > 160) $errors[] = "$n must be 2–160 characters.";
    }
    $errors = array_merge($errors, rt_validate($cs['summary'], 'Summary', 20, 600, array_merge(array_column($work, 'slug'), [$slug])));
    if (len($cs['seoTitle']) < 30 || len($cs['seoTitle']) > 70) $errors[] = 'SEO title must be 30–70 characters.';
    if (len($cs['seoDescription']) < 70 || len($cs['seoDescription']) > 160) $errors[] = 'SEO description must be 70–160 characters.';
    if ($cs['order'] < 1 || $cs['order'] > 999) $errors[] = 'Order must be 1–999.';
    $valid = photo_ids();
    foreach ((array)($in['photo_id'] ?? []) as $i => $id) {
        $id = clean_text($id); if ($id === '') continue;
        $alt = clean_text($in['photo_alt'][$i] ?? '');
        if (!in_array($id, $valid, true)) $errors[] = "Unknown photo $id.";
        if (len($alt) < 20 || len($alt) > 125) $errors[] = "Alt text for $id must be 20–125 characters.";
        $cs['photos'][] = ['id' => $id, 'alt' => $alt];
    }
    if (!$cs['photos']) $errors[] = 'Add at least one photo.';
    if (!$errors) {
        $found = false;
        foreach ($work as $i => $c) if ($c['slug'] === $orig) { $work[$i] = $cs; $found = true; }
        if (!$found) $work[] = $cs;
        usort($work, function ($a, $b) { return $a['order'] <=> $b['order']; });
        write_content('work.json', $work);
        audit(($isNew ? 'created' : 'edited') . " case study $slug");
    }
    return [$errors, $cs];
}

function delete_work(string $slug): void {
    $work = read_content('work.json');
    write_content('work.json', array_values(array_filter($work, function ($c) use ($slug) { return $c['slug'] !== $slug; })));
    audit("deleted case study $slug");
}

function view_work_list(): string {
    $b = '<div class="card"><h2>Case studies</h2><p><a class="btn" href="/admin/?view=edit">+ New case study</a></p>'
       . '<table><tr><th>#</th><th>Project</th><th>Client</th><th></th></tr>';
    foreach (read_content('work.json') as $c) {
        $b .= '<tr><td>' . (int)$c['order'] . '</td><td>' . e($c['project']) . '</td><td>' . e($c['client'])
            . '</td><td><a href="/admin/?view=edit&slug=' . urlencode($c['slug']) . '">Edit</a> · <a href="/work/' . e($c['slug']) . '" target="_blank">View</a></td></tr>';
    }
    return $b . '</table></div>';
}

function view_work_edit(string $slug, ?array $draft, bool $isAdmin): string {
    $work = read_content('work.json');
    $cs = $draft;
    if (!$cs && $slug !== '') foreach ($work as $c) if ($c['slug'] === $slug) $cs = $c;
    $isNew = $slug === '';
    if (!$cs && !$isNew) return '<div class="err">Case study not found.</div>';
    $cs = $cs ?: ['order' => count($work) + 1, 'slug' => '', 'client' => '', 'project' => '', 'tag' => '', 'summary' => '',
                  'seoTitle' => '', 'seoDescription' => '', 'photos' => []];
    $b = '<div class="card"><h2>' . ($isNew ? 'New case study' : 'Edit: ' . e($cs['project'])) . '</h2><form method="post">' . csrf_field()
        . '<input type="hidden" name="action" value="save_work"><input type="hidden" name="orig_slug" value="' . e($isNew ? '' : $slug) . '">'
        . '<label>Order on site (1 = first)</label><input type="number" name="order" min="1" max="999" value="' . (int)$cs['order'] . '">'
        . '<label>URL slug</label><input type="text" name="slug" value="' . e($cs['slug']) . '"' . (!$isNew && !$isAdmin ? ' readonly' : '') . '><div class="hint">'
        . ($isNew ? 'Lowercase letters, numbers and hyphens, e.g. <code>pfizer-congress-booth-2026</code>. It cannot be changed later.'
                  : ($isAdmin ? 'Changing this breaks the old URL and any links to it.' : 'Locked — changing it would break the page URL.')) . '</div>'
        . plain_field('client', 'Client', $cs['client'], 2, 160)
        . plain_field('project', 'Project title (page H1)', $cs['project'], 2, 160)
        . plain_field('tag', 'Tag', $cs['tag'], 2, 160)
        . rich_field('summary', 'Summary (shown on the page)', $cs['summary'], 20, 600, 'Link to the client, related case studies, or <code>/#services</code>.')
        . plain_field('seoTitle', 'SEO title', $cs['seoTitle'], 30, 70)
        . plain_field('seoDescription', 'SEO description', $cs['seoDescription'], 70, 160, 'Plain text — no links.', 3)
        . '<label>Photos &amp; alt text</label><div class="hint">First photo is the main image. Describe what is visible (20–125 chars). Choose "— none —" to remove a photo.</div>';
    $ids = photo_ids();
    foreach (array_merge($cs['photos'], [['id' => '', 'alt' => ''], ['id' => '', 'alt' => '']]) as $p) {
        $b .= '<div class="photo"><div><select name="photo_id[]"><option value="">— none —</option>';
        foreach ($ids as $id) $b .= '<option' . ($id === $p['id'] ? ' selected' : '') . '>' . e($id) . '</option>';
        $b .= '</select>' . ($p['id'] ? '<img alt="" src="/work/' . e($p['id']) . '-420.jpg" style="width:100%;margin-top:6px;border-radius:6px">' : '')
            . '</div><textarea name="photo_alt[]" style="min-height:60px">' . e($p['alt']) . '</textarea></div>';
    }
    $b .= '<p class="sticky-save"><button>Save &amp; publish</button> <a class="btn btn2" href="/admin/?view=work">Cancel</a></p></form>';
    if ($isAdmin && !$isNew) {
        $b .= '<form method="post" onsubmit="return confirm(\'Delete this case study? Its URL will stop working.\')">' . csrf_field()
            . '<input type="hidden" name="action" value="delete_work"><input type="hidden" name="slug" value="' . e($slug) . '"><button class="danger">Delete</button></form>';
    }
    return $b . '</div>';
}
