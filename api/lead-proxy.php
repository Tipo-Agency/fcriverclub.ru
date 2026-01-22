<?php
/**
 * PHP прокси для отправки лидов в 1C и Calltouch
 * Используется в production для обхода CORS
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Обработка OPTIONS запроса
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Проверка метода
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$WEBHOOK_URL_1C = 'https://cloud.1c.fitness/api/hs/lead/Webhook/9a93d939-e1e3-49b9-be61-0439957207f4';

// Calltouch API настройки
$CALLTOUCH_SITE_ID = '52898';
$CALLTOUCH_MOD_ID = 'r2kmsp7t';
$CALLTOUCH_API_TOKEN = getenv('VITE_CALLTOUCH_API_TOKEN') ?: '0b9ea4940475d676014768f9478f3b5062130d223af84';
$CALLTOUCH_API_URL = "https://api.calltouch.ru/calls-service/RestAPI/{$CALLTOUCH_SITE_ID}/register-lead-dict";

// Получаем тело запроса
$data = file_get_contents('php://input');
$payload = json_decode($data, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON']);
    exit;
}

// Отправляем запрос к 1C
$ch = curl_init($WEBHOOK_URL_1C);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Content-Length: ' . strlen($data)
]);

$response1C = curl_exec($ch);
$httpCode1C = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError1C = curl_error($ch);
curl_close($ch);

if ($curlError1C) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to connect to 1C webhook']);
    exit;
}

// Если 1C успешно получил заявку, отправляем в Calltouch
$calltouchSuccess = false;
if ($httpCode1C >= 200 && $httpCode1C < 300) {
    // Формируем данные для Calltouch
    $name = $payload['name'] ?? '';
    $lastName = $payload['last_name'] ?? '';
    $phone = $payload['phone'] ?? '';
    $email = $payload['email'] ?? '';
    $comment = $payload['comment'] ?? 'Заявка с сайта';
    
    // Формируем URL с параметрами для Calltouch
    $calltouchParams = http_build_query([
        'site_id' => $CALLTOUCH_SITE_ID,
        'mod_id' => $CALLTOUCH_MOD_ID,
        'access_token' => $CALLTOUCH_API_TOKEN,
        'name' => $name,
        'phone' => $phone,
        'email' => $email,
        'comment' => $comment,
        'targetRequest' => 'true',
    ]);
    
    // Отправляем GET запрос в Calltouch API
    $chCalltouch = curl_init($CALLTOUCH_API_URL . '?' . $calltouchParams);
    curl_setopt($chCalltouch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($chCalltouch, CURLOPT_HTTPGET, true);
    
    $responseCalltouch = curl_exec($chCalltouch);
    $httpCodeCalltouch = curl_getinfo($chCalltouch, CURLINFO_HTTP_CODE);
    $curlErrorCalltouch = curl_error($chCalltouch);
    curl_close($chCalltouch);
    
    if (!$curlErrorCalltouch && $httpCodeCalltouch >= 200 && $httpCodeCalltouch < 300) {
        $calltouchSuccess = true;
    }
}

http_response_code($httpCode1C);
echo json_encode([
    'success' => $httpCode1C >= 200 && $httpCode1C < 300,
    'data' => $response1C,
    'calltouch_sent' => $calltouchSuccess
]);
?>
