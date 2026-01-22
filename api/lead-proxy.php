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
// Пробуем получить токен из переменной окружения, если не установлена - используем fallback
$CALLTOUCH_API_TOKEN = getenv('VITE_CALLTOUCH_API_TOKEN') 
    ?: getenv('CALLTOUCH_API_TOKEN') 
    ?: '0b9ea4940475d676014768f9478f3b5062130d223af84';
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
$calltouchError = null;
$calltouchResponse = null;
$calltouchHttpCode = null;

if ($httpCode1C >= 200 && $httpCode1C < 300) {
    // Формируем данные для Calltouch
    $name = $payload['name'] ?? '';
    $lastName = $payload['last_name'] ?? '';
    $phone = $payload['phone'] ?? '';
    $email = $payload['email'] ?? '';
    $comment = $payload['comment'] ?? 'Заявка с сайта';
    
    // Объединяем имя и фамилию для Calltouch
    $fullName = trim($name . ' ' . $lastName);
    if (empty($fullName)) {
        $fullName = $name;
    }
    
    // Формируем URL с параметрами для Calltouch
    $calltouchParams = http_build_query([
        'site_id' => $CALLTOUCH_SITE_ID,
        'mod_id' => $CALLTOUCH_MOD_ID,
        'access_token' => $CALLTOUCH_API_TOKEN,
        'name' => $fullName,
        'phone' => $phone,
        'email' => $email,
        'comment' => $comment,
        'targetRequest' => 'true',
    ]);
    
    $calltouchUrl = $CALLTOUCH_API_URL . '?' . $calltouchParams;
    
    // Логируем параметры для отладки (без токена в логах)
    $debugParams = $calltouchParams;
    $debugParams = preg_replace('/access_token=[^&]*/', 'access_token=***', $debugParams);
    
    // Отправляем GET запрос в Calltouch API (согласно документации Calltouch)
    $chCalltouch = curl_init($calltouchUrl);
    curl_setopt($chCalltouch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($chCalltouch, CURLOPT_HTTPGET, true);
    curl_setopt($chCalltouch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($chCalltouch, CURLOPT_SSL_VERIFYPEER, true);
    curl_setopt($chCalltouch, CURLOPT_TIMEOUT, 10);
    curl_setopt($chCalltouch, CURLOPT_USERAGENT, 'RiverClub/1.0');
    
    $responseCalltouch = curl_exec($chCalltouch);
    $calltouchHttpCode = curl_getinfo($chCalltouch, CURLINFO_HTTP_CODE);
    $curlErrorCalltouch = curl_error($chCalltouch);
    $curlInfo = curl_getinfo($chCalltouch);
    curl_close($chCalltouch);
    
    if ($curlErrorCalltouch) {
        $calltouchError = 'CURL Error: ' . $curlErrorCalltouch;
    } elseif ($calltouchHttpCode >= 200 && $calltouchHttpCode < 300) {
        $calltouchSuccess = true;
        $calltouchResponse = $responseCalltouch;
    } else {
        $calltouchError = "HTTP {$calltouchHttpCode}: " . substr($responseCalltouch, 0, 200);
    }
    
    // Сохраняем информацию для логирования
    $calltouchDebug = [
        'url' => preg_replace('/access_token=[^&]*/', 'access_token=***', $calltouchUrl),
        'params' => $debugParams,
        'http_code' => $calltouchHttpCode,
        'response_length' => strlen($responseCalltouch),
        'curl_error' => $curlErrorCalltouch
    ];
}

http_response_code($httpCode1C);
echo json_encode([
    'success' => $httpCode1C >= 200 && $httpCode1C < 300,
    'data' => $response1C,
    'calltouch' => [
        'sent' => $calltouchSuccess,
        'http_code' => $calltouchHttpCode,
        'error' => $calltouchError,
        'response' => $calltouchResponse ? substr($calltouchResponse, 0, 500) : null,
        'debug' => isset($calltouchDebug) ? $calltouchDebug : null
    ]
]);
?>
