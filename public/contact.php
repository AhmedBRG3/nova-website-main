<?php
// NOVA contact form endpoint (cPanel / any PHP host).
// Receives the site's form as JSON and emails it to $TO.
// Change $TO if leads should go to a different inbox.
$TO = 'info@novaadv.com';

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

function fail($code, $msg) { http_response_code($code); echo json_encode(['ok' => false, 'error' => $msg]); exit; }

if ($_SERVER['REQUEST_METHOD'] !== 'POST') fail(405, 'POST only');

$data = json_decode(file_get_contents('php://input'), true);
if (!is_array($data)) fail(400, 'Bad request');

// Honeypot: real visitors never see or fill this field; bots do.
if (!empty($data['company'])) { echo json_encode(['ok' => true]); exit; }

$clean = function ($v, $max) {
    $v = trim((string)($v ?? ''));
    $v = str_replace(["\r", "\n"], ' ', $v);          // no header injection
    return mb_substr($v, 0, $max);
};
$name  = $clean($data['name'] ?? '', 120);
$email = $clean($data['email'] ?? '', 160);
$phone = $clean($data['phone'] ?? '', 40);
$message = mb_substr(trim((string)($data['message'] ?? '')), 0, 5000);

if ($name === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) fail(422, 'Invalid fields');

// Basic flood control: one message per IP every 30 seconds.
$ipFile = sys_get_temp_dir() . '/nova_cf_' . md5($_SERVER['REMOTE_ADDR'] ?? 'x');
if (file_exists($ipFile) && time() - filemtime($ipFile) < 30) fail(429, 'Please wait a moment and try again.');
@touch($ipFile);

$host = preg_replace('/^www\./', '', $_SERVER['HTTP_HOST'] ?? 'novaadv.com');
$subject = 'New project inquiry from ' . $name;
$body = "Name: $name\nEmail: $email\n" . ($phone !== '' ? "Phone: $phone\n" : '') . "\n$message\n\n--\nSent from the website contact form";
$headers = [
    'From: NOVA Website <no-reply@' . $host . '>',
    'Reply-To: ' . $name . ' <' . $email . '>',
    'Content-Type: text/plain; charset=UTF-8',
];

if (!mail($TO, '=?UTF-8?B?' . base64_encode($subject) . '?=', $body, implode("\r\n", $headers))) fail(500, 'Mail failed');
echo json_encode(['ok' => true]);
