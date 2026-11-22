<?php
// ─────────────────────────────────────────
//  Admin core: config, session, CSRF, login throttle, content IO
//  with automatic backups, audit log, and shared form helpers.
//  Included by admin/index.php only (direct requests are refused).
// ─────────────────────────────────────────
if (!defined('NOVA_ADMIN')) { http_response_code(404); exit; }

require __DIR__ . '/richtext.php';

define('ROOT', dirname(__DIR__));
// Local dev keeps users/backups/logs outside public/ (see vite.config.js).
define('DATA', getenv('NOVA_ADMIN_DATA') ?: __DIR__ . '/data');
const CONTENT_FILES = ['home.json', 'seo.json', 'work.json'];
const KEEP_BACKUPS = 40;

@mkdir(DATA . '/backups', 0750, true);

function start_session(): void {
    session_set_cookie_params([
        'httponly' => true, 'samesite' => 'Strict', 'path' => '/admin',
        'secure' => !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
    ]);
    session_name('nova_admin');
    session_start();
}

function e($s): string { return htmlspecialchars((string)$s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'); }
function len(string $s): int { return mb_strlen($s); }
function csrf(): string { return $_SESSION['csrf'] ??= bin2hex(random_bytes(16)); }
function csrf_field(): string { return '<input type="hidden" name="csrf" value="' . e(csrf()) . '">'; }
function current_user(): string { return (string)($_SESSION['user'] ?? '-'); }
function load_users(): array { return is_file(DATA . '/users.php') ? (require DATA . '/users.php') : []; }

function audit(string $msg): void {
    @file_put_contents(DATA . '/audit.log', date('c') . ' ' . current_user() . ' ' . $msg . "\n", FILE_APPEND | LOCK_EX);
}

// ---------- login throttle: 5 failures per IP per 15 minutes ----------
function fail_file(): string { return DATA . '/fail-' . md5($_SERVER['REMOTE_ADDR'] ?? 'x'); }
function fail_count(): int {
    $f = fail_file();
    return is_file($f) && time() - filemtime($f) < 900 ? (int)file_get_contents($f) : 0;
}
function throttled(): bool { return fail_count() >= 5; }
function record_failure(): void { file_put_contents(fail_file(), (string)(fail_count() + 1)); }

// ---------- content IO ----------
function read_content(string $f): array {
    return json_decode((string)@file_get_contents(ROOT . "/content/$f"), true) ?: [];
}

/** Atomic write; the previous version is kept in DATA/backups first. */
function write_content(string $f, array $data): void {
    if (!in_array($f, CONTENT_FILES, true)) throw new InvalidArgumentException("Not a content file: $f");
    $path = ROOT . "/content/$f";
    if (is_file($path)) {
        $user = preg_replace('/[^a-z0-9]/i', '', current_user()) ?: 'system';
        copy($path, DATA . '/backups/' . date('Ymd-His') . "__{$user}__$f");
        $old = glob(DATA . "/backups/*__$f") ?: [];
        sort($old);
        foreach (array_slice($old, 0, max(0, count($old) - KEEP_BACKUPS)) as $o) @unlink($o);
    }
    $tmp = $path . '.tmp';
    file_put_contents($tmp, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . "\n", LOCK_EX);
    rename($tmp, $path);
}

/** Backups newest first: [name, time, user, file]. */
function list_backups(): array {
    $out = [];
    foreach (glob(DATA . '/backups/*.json') ?: [] as $p) {
        $n = basename($p);
        if (preg_match('/^(\d{8}-\d{6})__([a-z0-9]+)__([a-z]+\.json)$/i', $n, $m)) {
            $out[] = ['name' => $n, 'time' => DateTime::createFromFormat('Ymd-His', $m[1]), 'user' => $m[2], 'file' => $m[3]];
        }
    }
    usort($out, function ($a, $b) { return strcmp($b['name'], $a['name']); });
    return $out;
}

/** Photo IDs that exist on disk (e.g. work-05), from the optimized /work images. */
function photo_ids(): array {
    $ids = [];
    foreach (glob(ROOT . '/work/work-*-420.jpg') ?: [] as $f) $ids[] = preg_replace('/-420\.jpg$/', '', basename($f));
    sort($ids, SORT_NATURAL);
    return $ids;
}

function case_slugs(): array { return array_column(read_content('work.json'), 'slug'); }

/** Normalise textarea input: unify line breaks, trim. */
function clean_text($v): string { return trim(str_replace(["\r\n", "\r"], "\n", (string)$v)); }

// ---------- form helpers ----------

/** Plain one-line (or $rows-line) text field with a live character counter. */
function plain_field(string $name, string $label, string $value, int $min, int $max, string $hint = '', int $rows = 1): string {
    $attrs = 'name="' . e($name) . '" data-min="' . $min . '" data-max="' . $max . '"';
    $input = $rows > 1
        ? '<textarea ' . $attrs . ' rows="' . $rows . '" style="min-height:0">' . e($value) . '</textarea>'
        : '<input type="text" ' . $attrs . ' value="' . e($value) . '">';
    return '<label>' . e($label) . '</label>' . $input . ($hint ? '<div class="hint">' . $hint . '</div>' : '');
}

/** Text field that may contain links: Insert-link button + live server-rendered preview. */
function rich_field(string $name, string $label, string $value, int $min, int $max, string $hint = ''): string {
    return '<label>' . e($label) . '</label>'
        . '<div class="rt-tools"><button type="button" class="btn2 small" data-insert-link>🔗 Insert link</button>'
        . '<span class="hint">Select words, then click. Links: https://…, /work/…, /#services, mailto:…, tel:…</span></div>'
        . '<textarea name="' . e($name) . '" data-rich data-min="' . $min . '" data-max="' . $max . '">' . e($value) . '</textarea>'
        . '<div class="rt-preview" aria-live="polite"></div>'
        . ($hint ? '<div class="hint">' . $hint . '</div>' : '');
}

function page(string $body, bool $authed = false): void {
    $nav = $authed
        ? e(current_user()) . ' <a href="/admin/">Home</a><a href="/admin/?view=history">History</a><a href="/admin/?logout=1">Log out</a>'
        : '';
    $csrf = $authed ? e(csrf()) : '';
    echo <<<HTML
<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow"><title>NOVA Content Manager</title><style>
body{font:15px/1.5 system-ui,sans-serif;background:#f5f3ef;color:#1b1814;margin:0}
header{background:#0B0906;color:#fff;padding:14px 24px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px}
header a{color:#e8c98a;text-decoration:none;margin-left:16px}
main{max-width:880px;margin:24px auto;padding:0 16px}
.card{background:#fff;border:1px solid #e4dfd6;border-radius:10px;padding:18px;margin-bottom:16px}
fieldset{border:1px solid #e4dfd6;border-radius:8px;padding:6px 14px 14px;margin:16px 0}legend{font-weight:700;padding:0 6px}
label{display:block;font-weight:600;margin:14px 0 4px}
input[type=text],input[type=number],input[type=password],textarea,select{width:100%;box-sizing:border-box;padding:9px;border:1px solid #cfc8bb;border-radius:6px;font:inherit}
textarea{min-height:90px}
.hint{color:#6d665a;font-size:13px}.count{font-size:12px;color:#6d665a;float:right;font-weight:400}.bad{color:#b3261e}
button,.btn{background:#0B0906;color:#fff;border:0;border-radius:6px;padding:10px 18px;font:inherit;cursor:pointer;text-decoration:none;display:inline-block}
.btn2{background:#fff;color:#1b1814;border:1px solid #cfc8bb}.small{padding:4px 10px;font-size:13px}.danger{background:#b3261e}
.rt-tools{display:flex;gap:10px;align-items:center;margin-bottom:6px;flex-wrap:wrap}
.rt-preview{background:#faf8f4;border:1px dashed #d8d0c2;border-radius:6px;padding:8px 10px;margin-top:6px;font-size:14px;min-height:1.5em}
.rt-preview:empty{display:none}.rt-preview a{color:#b3261e}.rt-preview .err{margin:6px 0 0}
.ok{background:#e6f4ea;border:1px solid #a8d5b5;padding:10px;border-radius:6px;margin-bottom:12px}
.err{background:#fdecea;border:1px solid #f2b8b5;padding:10px;border-radius:6px;margin-bottom:12px}
table{width:100%;border-collapse:collapse}td,th{text-align:left;padding:8px;border-bottom:1px solid #eee}
.photo{display:grid;grid-template-columns:190px 1fr;gap:10px;margin-bottom:10px}
.sticky-save{position:sticky;bottom:0;background:#fff;padding:12px 0;border-top:1px solid #eee}
</style></head><body data-csrf="$csrf"><header><strong>NOVA Content Manager</strong><span>$nav</span></header><main>$body</main>
<script>
(function(){
  var csrf=document.body.dataset.csrf;
  // Visible length: links count as their text only (server re-checks).
  function visible(v){return v.replace(/\[([^\[\]\\n]+)\]\(([\x21-\x27\x2A-\x7E]+)\)/g,'$1')}
  document.querySelectorAll('[data-min]').forEach(function(el){
    var c=document.createElement('span');c.className='count';
    var lab=el.previousElementSibling;while(lab&&lab.tagName!=='LABEL')lab=lab.previousElementSibling;
    if(lab)lab.appendChild(c);
    function u(){var n=visible(el.value).length;c.textContent=n+' chars (need '+el.dataset.min+'–'+el.dataset.max+')';
      c.className='count'+(n<+el.dataset.min||n>+el.dataset.max?' bad':'')}
    el.addEventListener('input',u);u();
  });
  document.querySelectorAll('[data-rich]').forEach(function(ta){
    var prev=ta.nextElementSibling,t;
    function refresh(){
      var fd=new FormData();fd.append('action','preview');fd.append('csrf',csrf);fd.append('text',ta.value);
      fd.append('min',ta.dataset.min);fd.append('max',ta.dataset.max);
      fetch('/admin/',{method:'POST',body:fd,credentials:'same-origin'}).then(function(r){return r.json()}).then(function(j){
        prev.innerHTML=j.links?'<strong style="font-size:12px;color:#6d665a">Preview:</strong> '+j.html:'';
        if(j.errors&&j.errors.length){j.errors.forEach(function(m){var d=document.createElement('div');d.className='err';d.textContent=m;prev.appendChild(d)})}
      }).catch(function(){});
    }
    ta.addEventListener('input',function(){clearTimeout(t);t=setTimeout(refresh,400)});refresh();
  });
  document.querySelectorAll('[data-insert-link]').forEach(function(btn){
    btn.addEventListener('click',function(){
      var ta=btn.parentNode.nextElementSibling,s=ta.selectionStart,e=ta.selectionEnd,sel=ta.value.slice(s,e);
      var text=sel||prompt('Link text (the words people will click):','');if(!text)return;
      var url=prompt('Link address — e.g. https://example.com, /work/project-slug, /#services, mailto:name@x.com','https://');
      if(!url||url==='https://')return;
      url=encodeURI(url.trim()).replace(/%25([0-9A-F]{2})/gi,'%$1').replace(/\(/g,'%28').replace(/\)/g,'%29');
      text=text.replace(/[\[\]]/g,'');
      ta.setRangeText('['+text+']('+url+')',s,e,'end');ta.focus();ta.dispatchEvent(new Event('input'));
    });
  });
})();
</script></body></html>
HTML;
    exit;
}
