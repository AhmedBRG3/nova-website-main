<?php
// Create the admin logins (hashed). Prints the passwords ONCE — store them safely.
//
//   php scripts/make-admin-user.php                      -> public/admin/data/users.php (production)
//   php scripts/make-admin-user.php --out=.dev/admin-data/users.php
//   php scripts/make-admin-user.php --mediabuyer=MyOwnPass123   (choose a password instead of a random one)
//
//   admin       role admin:  everything, incl. changing slugs and deleting case studies
//   mediabuyer  role editor: edit text, SEO fields, alt text, add case studies
$opts = getopt('', ['out::', 'admin::', 'mediabuyer::']);
$file = $opts['out'] ?? __DIR__ . '/../public/admin/data/users.php';
@mkdir(dirname($file), 0750, true);

$random = function () { return rtrim(strtr(base64_encode(random_bytes(12)), '+/', 'xy'), '='); };
$users = [];
foreach (['admin' => 'admin', 'mediabuyer' => 'editor'] as $name => $role) {
    $plain = $opts[$name] ?? $random();
    if (strlen($plain) < 10) { fwrite(STDERR, "Password for $name must be at least 10 characters.\n"); exit(1); }
    $users[$name] = ['hash' => password_hash($plain, PASSWORD_DEFAULT), 'role' => $role];
    echo str_pad($name, 12) . $plain . "\n";
}
file_put_contents($file, "<?php\nreturn " . var_export($users, true) . ";\n");
echo "\nSaved " . realpath($file) . "\n";
