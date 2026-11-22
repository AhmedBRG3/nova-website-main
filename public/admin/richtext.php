<?php
// ─────────────────────────────────────────
//  Rich-text grammar shared by the admin (validation + preview)
//  and seo.php (crawler HTML). The only markup is a link:
//
//      [visible text](url)
//
//  Allowed urls: https://… http://… mailto:… tel:… / /work/<slug> #anchor /#anchor
//  The JS twin is src/lib/richText.js; tests/rich-text-cases.json
//  is run against both (npm run test:content) so they never drift.
// ─────────────────────────────────────────

// URL part = printable ASCII except spaces and parentheses (same class in JS).
const RT_LINK_RE = '/\[([^\[\]\n]+)\]\(([\x21-\x27\x2A-\x7E]+)\)/u';
const RT_ANCHORS = ['about', 'services', 'portfolio', 'clients', 'contact'];
const RT_MAX_LINKS = 10;

function rt_kind(string $href): string {
    if (preg_match('~^https?://[A-Za-z0-9.-]+\.[A-Za-z]{2,}(:[0-9]{1,5})?([/?#][A-Za-z0-9\-._\x7E:/?#\[\]@!$&\'*+,;=%]*)?$~', $href)) return 'external';
    if (preg_match('~^mailto:[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$~', $href)) return 'mailto';
    if (preg_match('~^tel:\+?[0-9][0-9.-]{4,20}$~', $href)) return 'tel';
    if (preg_match('~^(/(work/[a-z0-9-]+)?(#[a-z0-9-]+)?|#[a-z0-9-]+)$~', $href)) return 'internal';
    return 'invalid';
}

/** Split text into ['type'=>'text','text'] and ['type'=>'link','text','href','kind'] tokens. */
function rt_parse(string $s): array {
    $out = [];
    $pos = 0;
    if (preg_match_all(RT_LINK_RE, $s, $m, PREG_SET_ORDER | PREG_OFFSET_CAPTURE)) {
        foreach ($m as $hit) {
            [$whole, $start] = $hit[0];
            if ($start > $pos) $out[] = ['type' => 'text', 'text' => substr($s, $pos, $start - $pos)];
            $href = $hit[2][0];
            $out[] = ['type' => 'link', 'text' => $hit[1][0], 'href' => $href, 'kind' => rt_kind($href)];
            $pos = $start + strlen($whole);
        }
    }
    if ($pos < strlen($s)) $out[] = ['type' => 'text', 'text' => substr($s, $pos)];
    return $out;
}

/** Plain visible text (for meta tags, JSON-LD and length limits). */
function rt_strip(string $s): string {
    return implode('', array_map(fn($t) => $t['text'], rt_parse($s)));
}

/** "#services" and "/#services" both mean the home-page section. */
function rt_internal_href(string $href): string {
    return $href[0] === '#' ? '/' . $href : $href;
}

/** Safe HTML: text is escaped, only validated links become <a>. */
function rt_to_html(string $s): string {
    $h = fn($v) => htmlspecialchars($v, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    $html = '';
    foreach (rt_parse($s) as $t) {
        if ($t['type'] === 'text' || $t['kind'] === 'invalid') { $html .= str_replace("\n", '<br>', $h($t['text'])); continue; }
        if ($t['kind'] === 'external') {
            $html .= '<a href="' . $h($t['href']) . '" target="_blank" rel="noopener">' . $h($t['text']) . '</a>';
        } else {
            $href = $t['kind'] === 'internal' ? rt_internal_href($t['href']) : $t['href'];
            $html .= '<a href="' . $h($href) . '">' . $h($t['text']) . '</a>';
        }
    }
    return $html;
}

/**
 * Validate a rich field. $slugs = existing case-study slugs (for internal links).
 * Returns a list of human-readable errors (empty = OK).
 */
function rt_validate(string $s, string $label, int $min, int $max, array $slugs): array {
    $errors = [];
    $tokens = rt_parse($s);
    $len = mb_strlen(rt_strip($s));
    if ($len < $min || $len > $max) $errors[] = "$label: visible text must be $min–$max characters (now $len).";
    $links = array_values(array_filter($tokens, fn($t) => $t['type'] === 'link'));
    if (count($links) > RT_MAX_LINKS) $errors[] = "$label: at most " . RT_MAX_LINKS . ' links.';
    foreach ($tokens as $t) {
        if ($t['type'] === 'text' && strpos($t['text'], '](') !== false) {
            $errors[] = "$label: a link is written incorrectly. Use the Insert link button, or the form [text](https://address) with no spaces in the address.";
            break;
        }
    }
    foreach ($links as $l) {
        $tl = mb_strlen(trim($l['text']));
        if ($tl < 1 || $tl > 100) $errors[] = "$label: link text \"{$l['text']}\" must be 1–100 characters.";
        if ($l['kind'] === 'invalid') {
            $errors[] = "$label: \"{$l['href']}\" is not an allowed address. Use https://…, mailto:…, tel:…, or a page on this site such as /work/… or /#services.";
        } elseif ($l['kind'] === 'internal') {
            $href = rt_internal_href($l['href']);
            $path = strtok($href, '#');
            $hash = strpos($href, '#') !== false ? substr($href, strpos($href, '#') + 1) : '';
            if ($path === false || $path === '') $path = '/';
            if ($path === '/' && $hash !== '' && !in_array($hash, RT_ANCHORS, true)) {
                $errors[] = "$label: \"#$hash\" is not a section on the home page. Use one of: #" . implode(', #', RT_ANCHORS) . '.';
            } elseif ($path !== '/') {
                $slug = substr($path, strlen('/work/'));
                if (!in_array($slug, $slugs, true)) $errors[] = "$label: \"{$l['href']}\" doesn't match any case study.";
            }
        }
    }
    return $errors;
}
