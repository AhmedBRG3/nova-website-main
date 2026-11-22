<?php
// ─────────────────────────────────────────
//  NOVA content admin (router).
//  Login-gated editor for the media buyer. Edits /content/*.json
//  directly, so changes are live immediately (no rebuild). Every save
//  keeps a backup (History → Restore) and a line in the audit log.
//    lib.php        session, CSRF, IO, backups, form helpers
//    richtext.php   [text](url) link grammar (shared with ../seo.php)
//    views/*.php    one file per screen
//  Roles: admin = everything; editor (mediabuyer) = no slug changes, no deletes.
// ─────────────────────────────────────────
declare(strict_types=1);
define('NOVA_ADMIN', true);
require __DIR__ . '/lib.php';
require __DIR__ . '/views/seo.php';
require __DIR__ . '/views/home.php';
require __DIR__ . '/views/work.php';
require __DIR__ . '/views/history.php';

start_session();
header('X-Frame-Options: DENY');
header("Content-Security-Policy: default-src 'self'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; img-src 'self' data:; connect-src 'self'");
header('Cache-Control: no-store');

$users  = load_users();
$isPost = ($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'POST';
$action = $isPost ? (string)($_POST['action'] ?? '') : '';
$errors = [];

// ---------- auth ----------
if ($action === 'login') {
    $u = (string)($_POST['user'] ?? ''); $p = (string)($_POST['pass'] ?? '');
    if (throttled()) {
        $errors[] = 'Too many attempts. Try again in 15 minutes.';
    } elseif (isset($users[$u]) && password_verify($p, $users[$u]['hash'])) {
        session_regenerate_id(true);
        $_SESSION['user'] = $u; $_SESSION['role'] = $users[$u]['role']; csrf();
        audit('login');
        header('Location: /admin/'); exit;
    } else {
        record_failure(); audit('failed login for ' . preg_replace('/[^a-z0-9_-]/i', '', $u));
        $errors[] = 'Wrong username or password.';
    }
}
if (isset($_GET['logout'])) { audit('logout'); session_destroy(); header('Location: /admin/'); exit; }

$authed  = isset($_SESSION['user'], $users[$_SESSION['user']]);
$isAdmin = $authed && ($_SESSION['role'] ?? '') === 'admin';

if (!$authed) {
    if ($action === 'preview') { http_response_code(401); header('Content-Type: application/json'); echo '{"error":"login"}'; exit; }
    $b = '<div class="card" style="max-width:380px;margin:60px auto"><h2>Log in</h2>';
    if (!$users) $b .= '<div class="err">No users configured. Run <code>php scripts/make-admin-user.php</code> and upload <code>admin/data/users.php</code>.</div>';
    foreach ($errors as $er) $b .= '<div class="err">' . e($er) . '</div>';
    $b .= '<form method="post"><input type="hidden" name="action" value="login"><label>Username</label><input type="text" name="user" autocomplete="username" required>'
        . '<label>Password</label><input type="password" name="pass" autocomplete="current-password" required><p><button>Log in</button></p></form></div>';
    page($b);
}

// ---------- every POST after login needs the CSRF token ----------
if ($isPost && !hash_equals(csrf(), (string)($_POST['csrf'] ?? ''))) {
    http_response_code(403);
    page('<div class="err">Session expired. Go back and reload the page.</div>', true);
}

// ---------- live preview for rich fields (JSON) ----------
if ($action === 'preview') {
    $text = clean_text($_POST['text'] ?? '');
    $min = max(0, (int)($_POST['min'] ?? 0)); $max = max($min, (int)($_POST['max'] ?? 10000));
    $links = count(array_filter(rt_parse($text), function ($t) { return $t['type'] === 'link'; }));
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['html' => rt_to_html($text), 'links' => $links, 'errors' => $links || strpos($text, '](') !== false
        ? array_values(array_filter(rt_validate($text, 'Field', $min, $max, case_slugs()), function ($m) { return strpos($m, 'visible text') === false; }))
        : []], JSON_UNESCAPED_UNICODE);
    exit;
}

// ---------- actions ----------
$view = (string)($_GET['view'] ?? 'home');
$slug = (string)($_GET['slug'] ?? '');
$draft = null;
$notice = isset($_GET['done']) ? ($_GET['done'] === 'deleted' ? 'Deleted.' : ($_GET['done'] === 'restored' ? 'Restored — live now.' : 'Saved — live now.')) : '';

switch ($action) {
    case 'save_seo':
        $errors = save_seo($_POST);
        $view = 'seo';
        if (!$errors) { header('Location: /admin/?view=seo&done=1'); exit; }
        $draft = $_POST;
        break;
    case 'save_home':
        [$errors, $draft] = save_home($_POST);
        $view = 'text';
        if (!$errors) { header('Location: /admin/?view=text&done=1'); exit; }
        break;
    case 'save_work':
        [$errors, $draft] = save_work($_POST, $isAdmin);
        $saved = $draft['slug'];
        if (!$errors) { header('Location: /admin/?view=edit&slug=' . urlencode($saved) . '&done=1'); exit; }
        $view = 'edit'; $slug = (string)($_POST['orig_slug'] ?? '');
        break;
    case 'delete_work':
        if (!$isAdmin) { $errors[] = 'Only an admin can delete case studies.'; break; }
        delete_work((string)($_POST['slug'] ?? ''));
        header('Location: /admin/?view=work&done=deleted'); exit;
    case 'restore':
        $err = restore_backup((string)($_POST['name'] ?? ''));
        if ($err === null) { header('Location: /admin/?view=history&done=restored'); exit; }
        $errors[] = $err; $view = 'history';
        break;
}

// ---------- render ----------
$b = '';
if ($notice) {
    $b .= '<div class="ok">' . e($notice);
    if ($view === 'edit' && $slug !== '') $b .= ' <a href="/work/' . e($slug) . '" target="_blank">View page</a>';
    if ($view === 'text' || $view === 'seo') $b .= ' <a href="/" target="_blank">View site</a>';
    $b .= '</div>';
}
if ($errors) $b .= '<div class="err"><strong>Not saved — please fix:</strong><ul>' . implode('', array_map(function ($m) { return '<li>' . e($m) . '</li>'; }, $errors)) . '</ul></div>';

switch ($view) {
    case 'seo':     $b .= view_seo($draft ?? []); break;
    case 'text':    $b .= view_home($draft); break;
    case 'work':    $b .= view_work_list(); break;
    case 'edit':    $b .= view_work_edit($slug, $draft, $isAdmin); break;
    case 'history': $b .= view_history(); break;
    default:
        $b .= '<div class="card"><h2>What do you want to edit?</h2><p>'
            . '<a class="btn" href="/admin/?view=text">Home page text</a> '
            . '<a class="btn" href="/admin/?view=seo">Home page SEO</a> '
            . '<a class="btn" href="/admin/?view=work">Case studies</a></p>'
            . '<p class="hint">Changes go live as soon as you save. Made a mistake? <a href="/admin/?view=history">History</a> restores any earlier version.</p></div>';
}
page($b, true);
