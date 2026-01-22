<?php
/**
 * PHP прокси ТОЛЬКО для отправки в Calltouch
 * Отдельный endpoint чтобы обойти проблемы с основным прокси
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

// Calltouch API настройки
$CALLTOUCH_SITE_ID = '52898';
$CALLTOUCH_MOD_ID = 'r2kmsp7t';
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

// Отправляем GET запрос в Calltouch API
$ch = curl_init($calltouchUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPGET, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);
curl_setopt($ch, CURLOPT_USERAGENT, 'RiverClub/1.0');

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

// Возвращаем результат
http_response_code(200);
echo json_encode([
    'success' => !$curlError && $httpCode >= 200 && $httpCode < 300,
    'http_code' => $httpCode,
    'error' => $curlError ?: null,
    'response' => $response,
    'url' => preg_replace('/access_token=[^&]*/', 'access_token=***', $calltouchUrl)
]);
?>
