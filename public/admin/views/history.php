<?php
// Version history: every save keeps the previous file; restore is one click.
if (!defined('NOVA_ADMIN')) { http_response_code(404); exit; }

const FILE_LABELS = ['home.json' => 'Home page text', 'seo.json' => 'Home page SEO', 'work.json' => 'Case studies'];

function restore_backup(string $name): ?string {
    foreach (list_backups() as $bk) {
        if ($bk['name'] !== $name) continue;
        $data = json_decode((string)file_get_contents(DATA . '/backups/' . $name), true);
        if (!is_array($data)) return 'That backup is unreadable.';
        write_content($bk['file'], $data); // backs up the current version first
        audit("restored {$bk['file']} from $name");
        return null;
    }
    return 'Backup not found.';
}

function view_history(): string {
    $b = '<div class="card"><h2>History</h2><p class="hint">Each row is the version that was live <em>before</em> that save. '
       . 'Restoring replaces the live version (the current one is kept here too, so a restore can be undone).</p>'
       . '<table><tr><th>Saved over at</th><th>By</th><th>Content</th><th></th></tr>';
    $rows = list_backups();
    if (!$rows) $b .= '<tr><td colspan="4" class="hint">No saves yet.</td></tr>';
    foreach ($rows as $bk) {
        $b .= '<tr><td>' . e($bk['time'] ? $bk['time']->format('Y-m-d H:i') : '?') . '</td><td>' . e($bk['user']) . '</td><td>'
            . e(FILE_LABELS[$bk['file']] ?? $bk['file']) . '</td><td><form method="post" style="margin:0" onsubmit="return confirm(\'Restore this version? It goes live immediately.\')">'
            . csrf_field() . '<input type="hidden" name="action" value="restore"><input type="hidden" name="name" value="' . e($bk['name']) . '">'
            . '<button class="btn2 small">Restore</button></form></td></tr>';
    }
    return $b . '</table></div>';
}
