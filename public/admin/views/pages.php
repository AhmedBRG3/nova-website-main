<?php
// ─────────────────────────────────────────
//  Section pages (/about, /services, /philosophy, /how-we-think, /brand-reach):
//  the full pages behind the home page's Read-more buttons.
//  Fixed set (no create/rename/delete — URLs stay stable). Each page can be
//  switched on/off; while off it is a draft: hidden from the site, the
//  sitemap and the Read-more button. Content is a list of blocks:
//  h2 / h3 (plain), p (rich: links allowed), list (one item per line, rich).
// ─────────────────────────────────────────
if (!defined('NOVA_ADMIN')) { http_response_code(404); exit; }

const BLOCK_TYPES = ['h2' => 'Heading', 'h3' => 'Subheading', 'p' => 'Paragraph', 'list' => 'Bullet list'];
const GENERIC_LABELS = ['read more', 'more', 'click here', 'learn more', 'read', 'details', 'see more', 'here', 'more info', 'continue'];
const MAX_BLOCKS = 40;
const THIN_WORDS = 300;
// Menu tabs (keep in sync with NAV_LINKS in src/data/index.js). When a live page's
// sectionAnchor matches one, that tab in the navbar/footer opens the page instead of scrolling.
const MENU_TABS = ['about' => 'About', 'services' => 'Services', 'portfolio' => 'Portfolio', 'contact' => 'Contact'];

/** Where a live page is linked from on the site, e.g. 'button in “About” + “About” menu tab'. */
function page_entry_points(array $p): string {
    $where = 'button in “' . ($p['section'] ?? '') . '”';
    $tab = MENU_TABS[$p['sectionAnchor'] ?? ''] ?? null;
    return $tab ? $where . ' + “' . $tab . '” menu tab' : $where;
}

function find_page(array $pages, string $slug): ?array {
    foreach ($pages as $p) if ($p['slug'] === $slug) return $p;
    return null;
}

/** Visible words on a page (links count as their text). */
function page_words(array $page): int {
    $text = '';
    foreach ($page['blocks'] ?? [] as $b) $text .= ' ' . rt_strip($b['type'] === 'list' ? implode(' ', $b['items'] ?? []) : (string)($b['text'] ?? ''));
    $w = preg_split('/\s+/u', trim($text), -1, PREG_SPLIT_NO_EMPTY);
    return $w ? count($w) : 0;
}

/** Where other live content links to /$slug (so switching it off would break those links). */
function links_to_page(string $slug, array $pages): array {
    $needle = '#\]\(/' . preg_quote($slug, '#') . '[)\#]#';
    $hits = [];
    if (preg_match($needle, json_encode(read_content('home.json'), JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE))) $hits[] = 'Home page text';
    foreach (read_content('work.json') as $c) if (preg_match($needle, (string)($c['summary'] ?? ''))) $hits[] = 'Case study: ' . $c['project'];
    foreach ($pages as $p) {
        if ($p['slug'] === $slug || empty($p['enabled'])) continue;
        if (preg_match($needle, json_encode($p['blocks'] ?? [], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE))) $hits[] = 'Page: ' . $p['title'];
    }
    return $hits;
}

function save_page(array $in): array {
    $pages = load_pages();
    $slug = (string)($in['slug'] ?? '');
    $orig = find_page($pages, $slug);
    if (!$orig) return [['Unknown page.'], null];

    $enabled = !empty($in['enabled']);
    $page = $orig; // slug, section and sectionAnchor are fixed
    foreach (['eyebrow', 'title', 'readMoreLabel', 'seoTitle', 'seoDescription'] as $k) $page[$k] = str_replace("\n", ' ', clean_text($in[$k] ?? ''));
    $page['enabled'] = $enabled;

    $errors = [];
    $caseSlugs = case_slugs();
    $liveSlugs = array_values(array_unique(array_merge(page_slugs(), $enabled ? [$slug] : [])));
    $blocks = [];
    $types = (array)($in['block_type'] ?? []);
    $texts = (array)($in['block_text'] ?? []);
    foreach ($types as $i => $type) {
        $type = (string)$type;
        $text = clean_text($texts[$i] ?? '');
        $n = count($blocks) + 1;
        if ($text === '') continue; // empty blocks are dropped
        if (!isset(BLOCK_TYPES[$type])) { $errors[] = "Block $n: unknown type."; continue; }
        $label = "Block $n (" . BLOCK_TYPES[$type] . ')';
        if ($type === 'h2' || $type === 'h3') {
            $text = str_replace("\n", ' ', $text);
            if (len($text) < 3 || len($text) > 120) $errors[] = "$label: must be 3–120 characters.";
            if (strpos($text, '](') !== false) $errors[] = "$label: headings can't contain links.";
            $blocks[] = ['type' => $type, 'text' => $text];
        } elseif ($type === 'p') {
            $errors = array_merge($errors, rt_validate($text, $label, 1, 1500, $caseSlugs, $liveSlugs));
            $blocks[] = ['type' => 'p', 'text' => $text];
        } else {
            $items = array_values(array_filter(array_map('trim', explode("\n", $text)), 'strlen'));
            if (count($items) > 15) $errors[] = "$label: at most 15 items (one per line).";
            foreach ($items as $j => $item) $errors = array_merge($errors, rt_validate($item, "$label item " . ($j + 1), 2, 250, $caseSlugs, $liveSlugs));
            $blocks[] = ['type' => 'list', 'items' => $items];
        }
    }
    $page['blocks'] = $blocks;
    if (count($blocks) > MAX_BLOCKS) $errors[] = 'At most ' . MAX_BLOCKS . ' blocks per page.';

    if (len($page['eyebrow']) > 40) $errors[] = 'Small label above the title: max 40 characters.';
    if (len($page['title']) < 3 || len($page['title']) > 80) $errors[] = 'Page title (H1) must be 3–80 characters.';
    $lbl = $page['readMoreLabel'];
    if (len($lbl) < 3 || len($lbl) > 40) $errors[] = 'Button text must be 3–40 characters.';
    $norm = trim(preg_replace('/[^\p{L}\p{N} ]+/u', '', mb_strtolower($lbl)));
    if (in_array($norm, GENERIC_LABELS, true)) $errors[] = 'Button text must say where it leads (e.g. "More about NOVA"), not just "' . $lbl . '". Search engines and screen readers rely on it.';

    // Drafts may be incomplete; a page can only go live once it is complete.
    if ($enabled) {
        if (len($page['seoTitle']) < 30 || len($page['seoTitle']) > 70) $errors[] = 'SEO title must be 30–70 characters to switch the page on.';
        if (len($page['seoDescription']) < 70 || len($page['seoDescription']) > 160) $errors[] = 'SEO description must be 70–160 characters to switch the page on.';
        if (count($blocks) < 2) $errors[] = 'Add at least 2 blocks before switching the page on.';
    } else {
        if (len($page['seoTitle']) > 70) $errors[] = 'SEO title: max 70 characters.';
        if (len($page['seoDescription']) > 160) $errors[] = 'SEO description: max 160 characters.';
        if (!empty($orig['enabled']) && ($refs = links_to_page($slug, $pages))) {
            $errors[] = "Can't switch this page off: other live content links to /$slug (" . implode('; ', $refs) . '). Remove those links first.';
        }
    }

    if ($ve = version_error('pages.json', $in['base_version'] ?? null)) array_unshift($errors, $ve);
    if (!$errors) {
        foreach ($pages as $i => $p) if ($p['slug'] === $slug) $pages[$i] = $page;
        write_content('pages.json', $pages);
        audit("saved section page $slug" . ($enabled ? ' (live)' : ' (draft)'));
    }
    return [$errors, $page];
}

function view_pages_list(): string {
    $b = '<div class="card"><h2>Section pages</h2><p class="hint">Full pages opened by the home page\'s buttons. '
       . 'When About or Services is live, its menu tab opens the page too. '
       . 'A page stays hidden (no button, no URL, not in Google) until you switch it on. Aim for at least ' . THIN_WORDS . ' words of original text — '
       . 'pages that only repeat the home page rank poorly.</p><table><tr><th>Page</th><th>Status</th><th>Words</th><th></th></tr>';
    foreach (load_pages() as $p) {
        $w = page_words($p);
        $b .= '<tr><td><strong>' . e($p['title']) . '</strong><br><span class="hint">/' . e($p['slug']) . ' · ' . e(page_entry_points($p)) . '</span></td>'
            . '<td>' . (!empty($p['enabled']) ? '<span style="color:#1e7d3a">● Live</span>' : '<span class="hint">○ Hidden (draft)</span>') . '</td>'
            . '<td' . ($w < THIN_WORDS ? ' class="bad"' : '') . '>' . $w . '</td>'
            . '<td><a href="/admin/?view=page&slug=' . urlencode($p['slug']) . '">Edit</a>'
            . (!empty($p['enabled']) ? ' · <a href="/' . e($p['slug']) . '" target="_blank">View</a>' : '') . '</td></tr>';
    }
    return $b . '</table></div>';
}

function block_html(string $type, string $text): string {
    $opts = '';
    foreach (BLOCK_TYPES as $k => $label) $opts .= '<option value="' . $k . '"' . ($k === $type ? ' selected' : '') . '>' . $label . '</option>';
    return '<div class="block" data-block data-type="' . e($type) . '">'
        . '<div class="block-bar"><select name="block_type[]" data-block-type aria-label="Block type">' . $opts . '</select>'
        . '<span class="block-btns"><button type="button" class="btn2 small" data-move="-1" aria-label="Move up">↑</button>'
        . '<button type="button" class="btn2 small" data-move="1" aria-label="Move down">↓</button>'
        . '<button type="button" class="btn2 small" data-remove aria-label="Delete block">✕</button></span></div>'
        . '<label class="block-label">Text</label>'
        . '<div class="rt-tools"><button type="button" class="btn2 small" data-insert-link>🔗 Insert link</button>'
        . '<span class="hint" data-hint></span></div>'
        . '<textarea name="block_text[]" data-rich>' . e($text) . '</textarea><div class="rt-preview" aria-live="polite"></div></div>';
}

function render_page_preview(array $p): string {
    $h = '<p class="hint" style="margin:0">' . e($p['eyebrow'] ?? '') . '</p><h1 style="margin:.2em 0 .6em;font-family:Georgia,serif;font-weight:400">' . e($p['title'] ?? '') . '</h1>';
    foreach ($p['blocks'] ?? [] as $bl) {
        if ($bl['type'] === 'h2' || $bl['type'] === 'h3') $h .= '<' . $bl['type'] . '>' . e($bl['text']) . '</' . $bl['type'] . '>';
        elseif ($bl['type'] === 'list') $h .= '<ul>' . implode('', array_map(function ($i) { return '<li>' . rt_to_html($i) . '</li>'; }, $bl['items'] ?? [])) . '</ul>';
        else $h .= '<p>' . rt_to_html((string)$bl['text']) . '</p>';
    }
    return $h;
}

function view_page_edit(string $slug, ?array $draft): string {
    $saved = find_page(load_pages(), $slug);
    if (!$saved) return '<div class="err">Page not found.</div>';
    $p = $draft ?? $saved;
    $w = page_words($p);
    $b = '<div class="card"><p><a href="/admin/?view=pages">← All section pages</a></p><h2>Edit: ' . e($saved['title']) . ' <span class="hint">/' . e($slug) . '</span></h2>'
       . '<form method="post" id="page-form">' . csrf_field() . version_field('pages.json')
       . '<input type="hidden" name="action" value="save_page"><input type="hidden" name="slug" value="' . e($slug) . '">'
       . '<label style="display:flex;gap:8px;align-items:center;font-size:16px"><input type="checkbox" name="enabled" value="1"' . (!empty($p['enabled']) ? ' checked' : '') . '> '
       . 'Page is live (publishes /' . e($slug) . ' and links it from the ' . e(page_entry_points($saved)) . ')</label>'
       . '<div class="hint">' . $w . ' words' . ($w < THIN_WORDS ? ' — <span class="bad">pages under ' . THIN_WORDS . ' words of original text may rank poorly.</span>' : '') . '</div>'
       . plain_field('eyebrow', 'Small label above the title', (string)($p['eyebrow'] ?? ''), 0, 40)
       . plain_field('title', 'Page title (H1)', (string)($p['title'] ?? ''), 3, 80)
       . plain_field('readMoreLabel', 'Button text on the home page', (string)($p['readMoreLabel'] ?? ''), 3, 40, 'Say where it leads, e.g. "More about NOVA" — not just "Read more".')
       . plain_field('seoTitle', 'SEO title', (string)($p['seoTitle'] ?? ''), 30, 70)
       . plain_field('seoDescription', 'SEO description', (string)($p['seoDescription'] ?? ''), 70, 160, 'Plain text, no links.', 3)
       . '<h3 style="margin-top:28px">Page content</h3><p class="hint">Headings can\'t contain links. For a bullet list, put one item per line. '
       . 'Links may point to case studies (<code>/work/…</code>), home sections (<code>/#contact</code>) or section pages that are live.</p>'
       . '<div id="blocks">';
    foreach ($p['blocks'] ?? [] as $bl) $b .= block_html($bl['type'], $bl['type'] === 'list' ? implode("\n", $bl['items'] ?? []) : (string)($bl['text'] ?? ''));
    $b .= '</div><p class="add-blocks">Add: ';
    foreach (BLOCK_TYPES as $k => $label) $b .= '<button type="button" class="btn2 small" data-add="' . $k . '">+ ' . $label . '</button> ';
    $b .= '</p><template id="block-template">' . block_html('p', '') . '</template>'
        . '<p class="sticky-save"><button>Save</button> <span class="hint">Saving with “Page is live” unticked keeps it as a hidden draft.</span></p></form>'
        . '<h3>Preview (last saved version)</h3><div class="card" style="background:#faf8f4">' . render_page_preview($saved) . '</div></div>';
    $b .= <<<'HTML'
<style>
.block{border:1px solid #e4dfd6;border-radius:8px;padding:10px 12px;margin:12px 0;background:#fdfcfa}
.block-bar{display:flex;justify-content:space-between;gap:8px;align-items:center}
.block-bar select{width:auto}.block-label{margin-top:8px}
.block[data-type=h2] textarea,.block[data-type=h3] textarea{min-height:0;height:46px}
.block[data-type=h2] .rt-tools button,.block[data-type=h3] .rt-tools button{display:none}
</style>
<script>
(function(){
  var box=document.getElementById('blocks'),tpl=document.getElementById('block-template');
  var hints={h2:'Main section heading (H2). Plain text.',h3:'Smaller heading (H3). Plain text.',p:'Paragraph. Links allowed.',list:'One bullet per line. Links allowed.'};
  var limits={h2:[3,120],h3:[3,120],p:[1,1500],list:[0,0]};
  function setType(block,type){
    block.dataset.type=type;
    var ta=block.querySelector('textarea');
    block.querySelector('[data-hint]').textContent=hints[type];
    if(limits[type][1]){ta.dataset.min=limits[type][0];ta.dataset.max=limits[type][1];}
    else{delete ta.dataset.min;delete ta.dataset.max;if(ta._count)ta._count.textContent='';}
    window.novaInitFields(block);window.novaRefreshField(ta);
  }
  box.querySelectorAll('[data-block]').forEach(function(b){setType(b,b.dataset.type)});
  box.addEventListener('change',function(e){if(e.target.matches('[data-block-type]'))setType(e.target.closest('[data-block]'),e.target.value)});
  box.addEventListener('click',function(e){
    var b=e.target.closest('[data-block]');if(!b)return;
    if(e.target.matches('[data-remove]')){if(b.querySelector('textarea').value.trim()===''||confirm('Delete this block?'))b.remove();}
    var m=e.target.getAttribute('data-move');
    if(m==='-1'&&b.previousElementSibling)box.insertBefore(b,b.previousElementSibling);
    if(m==='1'&&b.nextElementSibling)box.insertBefore(b.nextElementSibling,b);
  });
  document.querySelectorAll('[data-add]').forEach(function(btn){btn.addEventListener('click',function(){
    var b=tpl.content.firstElementChild.cloneNode(true);box.appendChild(b);
    b.querySelector('select').value=btn.dataset.add;setType(b,btn.dataset.add);b.querySelector('textarea').focus();
  })});
})();
</script>
HTML;
    return $b;
}
