<?php
// Home-page copy (/content/home.json). Lists keep a fixed length because
// icons, illustrations and numbering in the site are tied to each item.
if (!defined('NOVA_ADMIN')) { http_response_code(404); exit; }

/** Field schema: [path, label, type(plain|rich|title), min, max, section]. */
function home_schema(array $home): array {
    $f = [
        ['hero.line1', 'Headline line 1 (page H1)', 'plain', 5, 40, 'Hero (top of page)'],
        ['hero.line2', 'Headline line 2 (page H1)', 'plain', 5, 40, 'Hero (top of page)'],
        ['hero.sub', 'Subtitle under the headline', 'rich', 40, 220, 'Hero (top of page)'],
    ];
    foreach ($home['services'] ?? [] as $i => $_) {
        $n = $i + 1;
        $f[] = ["services.$i.title", "Service $n — title", 'title', 3, 40, 'Services'];
        $f[] = ["services.$i.desc", "Service $n — description", 'rich', 40, 260, 'Services'];
    }
    $f[] = ['about.body', 'About paragraph', 'rich', 60, 400, 'About'];
    foreach ($home['about']['values'] ?? [] as $i => $_) $f[] = ["about.values.$i", 'Value pill ' . ($i + 1), 'plain', 2, 30, 'About'];
    $f[] = ['iei.body', 'Philosophy paragraph', 'rich', 40, 300, 'Our Philosophy (Imagination · Energy · Impact)'];
    foreach ($home['iei']['cards'] ?? [] as $i => $_) $f[] = ["iei.cards.$i", 'Card ' . ($i + 1) . ' text', 'rich', 20, 160, 'Our Philosophy (Imagination · Energy · Impact)'];
    $f[] = ['sms.sub', 'Intro paragraph', 'rich', 30, 250, 'How We Think (Strategy meets Story)'];
    foreach ($home['sms']['steps'] ?? [] as $i => $_) {
        $f[] = ["sms.steps.$i.title", 'Step ' . ($i + 1) . ' — title', 'plain', 3, 40, 'How We Think (Strategy meets Story)'];
        $f[] = ["sms.steps.$i.desc", 'Step ' . ($i + 1) . ' — text', 'rich', 30, 220, 'How We Think (Strategy meets Story)'];
    }
    $f[] = ['ffw.sub', 'Intro paragraph', 'rich', 30, 250, 'In-House Production (Factory floor)'];
    $f[] = ['ybe.sub', 'Intro paragraph', 'rich', 30, 250, 'Brand Reach (Your brand, everywhere)'];
    foreach ($home['ybe']['cards'] ?? [] as $i => $_) $f[] = ["ybe.cards.$i", 'Card ' . ($i + 1) . ' text', 'rich', 30, 200, 'Brand Reach (Your brand, everywhere)'];
    foreach ($home['clients'] ?? [] as $i => $_) $f[] = ["clients.$i", 'Client ' . ($i + 1), 'plain', 2, 40, 'Client ticker'];
    $f[] = ['contact.body', 'Contact paragraph', 'rich', 30, 250, 'Contact'];
    return $f;
}

function path_get(array $a, string $path) {
    foreach (explode('.', $path) as $k) { if (!is_array($a) || !array_key_exists($k, $a)) return null; $a = $a[$k]; }
    return $a;
}
function path_set(array &$a, string $path, $value): void {
    $ref = &$a;
    foreach (explode('.', $path) as $k) { if (!isset($ref[$k]) || !is_array($ref[$k])) $ref[$k] = $ref[$k] ?? []; $ref = &$ref[$k]; }
    $ref = $value;
}
/** services.0.title -> services[0][title] */
function path_name(string $path): string {
    $p = explode('.', $path);
    return array_shift($p) . implode('', array_map(function ($k) { return "[$k]"; }, $p));
}

function save_home(array $in): array {
    $home = read_content('home.json');
    $slugs = case_slugs();
    $pages = page_slugs();
    $errors = [];
    foreach (home_schema($home) as [$path, $label, $type, $min, $max, $section]) {
        $v = clean_text(path_get($in, $path) ?? '');
        $name = "$section › $label";
        if ($type === 'rich') {
            $errors = array_merge($errors, rt_validate($v, $name, $min, $max, $slugs, $pages));
        } else {
            if ($type !== 'title' || substr_count($v, "\n") > 1) $v = str_replace("\n", ' ', $v);
            if (len($v) < $min || len($v) > $max) $errors[] = "$name: must be $min-$max characters (now " . len($v) . ').';
            if (strpos($v, '](') !== false) $errors[] = "$name: links aren't allowed in this field.";
        }
        path_set($home, $path, $v);
    }
    if ($ve = version_error('home.json', $in['base_version'] ?? null)) array_unshift($errors, $ve);
    if (!$errors) { write_content('home.json', $home); audit('saved home page text'); }
    return [$errors, $home];
}

function view_home(?array $draft): string {
    $home = $draft ?? read_content('home.json');
    $b = '<div class="card"><h2>Home page text</h2><p class="hint">Changes go live as soon as you save. '
       . 'Use links to point readers to related case studies (e.g. <code>/work/vyndamax-pfizer</code>), section pages that are switched on (e.g. <code>/about</code>) or home sections (<code>/#contact</code>). '
       . 'Good link text describes the destination ("our in-house factory"), not "click here".</p>'
       . '<form method="post">' . csrf_field() . version_field('home.json') . '<input type="hidden" name="action" value="save_home">';
    $section = null;
    foreach (home_schema($home) as [$path, $label, $type, $min, $max, $sec]) {
        if ($sec !== $section) { $b .= ($section !== null ? '</fieldset>' : '') . '<fieldset><legend>' . e($sec) . '</legend>'; $section = $sec; }
        $val = (string)(path_get($home, $path) ?? '');
        $name = path_name($path);
        if ($type === 'rich') $b .= rich_field($name, $label, $val, $min, $max);
        elseif ($type === 'title') $b .= plain_field($name, $label, $val, $min, $max, 'Press Enter once where the title should break onto a second line.', 2);
        else $b .= plain_field($name, $label, $val, $min, $max);
    }
    return $b . '</fieldset><p class="sticky-save"><button>Save &amp; publish</button> <a class="btn btn2" href="/" target="_blank">View site</a></p></form></div>';
}
