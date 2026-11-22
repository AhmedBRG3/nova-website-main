// Checks that the PHP and JS rich-text parsers agree on every fixture in
// tests/rich-text-cases.json, and that the PHP HTML renderer escapes safely.
// Usage: npm run test:content
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { parseRichText } from '../src/lib/richText.js';

const root = fileURLToPath(new URL('..', import.meta.url));
const cases = JSON.parse(readFileSync(`${root}tests/rich-text-cases.json`, 'utf8'));

const php = (code) => execFileSync('php', ['-r', `require '${root}public/admin/richtext.php'; ${code}`], {
  input: JSON.stringify(cases.map((c) => c.in)),
  encoding: 'utf8',
});

const phpParsed = JSON.parse(php(
  `echo json_encode(array_map('rt_parse', json_decode(stream_get_contents(STDIN), true)), JSON_UNESCAPED_UNICODE);`,
));

let failed = 0;
cases.forEach((c, i) => {
  const want = JSON.stringify(c.out);
  for (const [name, got] of [['js', parseRichText(c.in)], ['php', phpParsed[i]]]) {
    if (JSON.stringify(got) !== want) {
      failed++;
      console.error(`✗ [${name}] ${c.in}\n   want ${want}\n   got  ${JSON.stringify(got)}`);
    }
  }
});

// HTML rendering must escape text and never emit an <a> for an invalid link.
const html = JSON.parse(php(
  `echo json_encode(array_map('rt_to_html', json_decode(stream_get_contents(STDIN), true)), JSON_UNESCAPED_UNICODE);`,
));
html.forEach((h, i) => {
  const tags = h.match(/<[^>]*>/g) || [];
  const badTag = tags.some((t) => !/^<a href="(https?:\/\/|mailto:|tel:|\/)[^"<>]*"( target="_blank" rel="noopener")?>$|^<\/a>$|^<br>$/.test(t));
  if (badTag) {
    failed++;
    console.error(`✗ [html] unsafe output for ${cases[i].in}: ${h}`);
  }
});

console.log(failed ? `${failed} failure(s)` : `✓ ${cases.length} rich-text cases agree (JS + PHP), HTML output safe`);
process.exit(failed ? 1 : 0);
