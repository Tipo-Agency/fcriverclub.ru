<?php
/**
 * PHP прокси ТОЛЬКО для отправки в Calltouch
 * Согласно документации: https://www.calltouch.ru/support/upravlenie-zayavkami-cherez-api/
 * API-метод: https://api.calltouch.ru/calls-service/RestAPI/requests/{site_id}/register/
 * API-токен НЕ требуется для создания заявок!
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
// Правильный URL согласно документации Calltouch
// URL: https://api.calltouch.ru/calls-service/RestAPI/requests/{site_id}/register/
$CALLTOUCH_API_URL = "https://api.calltouch.ru/calls-service/RestAPI/requests/{$CALLTOUCH_SITE_ID}/register/";

// Получаем тело запроса
$data = file_get_contents('php://input');
$payload = json_decode($data, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON']);
    exit;
}

// Формируем данные для Calltouch согласно документации
$name = $payload['name'] ?? '';
$lastName = $payload['last_name'] ?? '';
$phone = $payload['phone'] ?? '';
$email = $payload['email'] ?? '';
$comment = $payload['comment'] ?? 'Заявка с сайта';
$subject = $payload['subject'] ?? 'Заявка с сайта fcriverclub.ru';

// Объединяем имя и фамилию для Calltouch (параметр fio)
$fullName = trim($name . ' ' . $lastName);
if (empty($fullName)) {
    $fullName = $name;
}

// Получаем sessionId из payload (если есть)
$sessionId = $payload['sessionId'] ?? null;

// Формируем параметры для Calltouch согласно документации
// Параметры: subject, fio, phoneNumber, email, comment, targetRequest, sessionId (опционально)
$calltouchParams = [
    'subject' => $subject,
    'fio' => $fullName,
    'phoneNumber' => $phone,
    'email' => $email,
    'comment' => $comment,
    'targetRequest' => 'true',
];

// Добавляем sessionId если есть
if ($sessionId) {
    $calltouchParams['sessionId'] = $sessionId;
}

// Добавляем requestUrl (адрес страницы отправки формы)
if (isset($payload['requestUrl'])) {
    $calltouchParams['requestUrl'] = $payload['requestUrl'];
}

// Формируем POST данные в формате application/x-www-form-urlencoded
$postData = http_build_query($calltouchParams);

// Логируем URL для отладки (без чувствительных данных)
error_log("[Calltouch Proxy] URL: " . $CALLTOUCH_API_URL);
error_log("[Calltouch Proxy] Site ID: " . $CALLTOUCH_SITE_ID);
error_log("[Calltouch Proxy] Params: " . substr($postData, 0, 200));

// Отправляем POST запрос в Calltouch API
$ch = curl_init($CALLTOUCH_API_URL);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/x-www-form-urlencoded',
    'User-Agent: RiverClub/1.0'
]);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, false);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

// Парсим ответ Calltouch
$responseData = null;
if ($response) {
    $responseData = json_decode($response, true);
}

// Возвращаем результат
if ($curlError) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'CURL Error: ' . $curlError,
        'http_code' => $httpCode,
        'response' => $response
    ]);
} elseif ($httpCode >= 200 && $httpCode < 300) {
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'http_code' => $httpCode,
        'response' => $responseData ?: $response,
        'requestId' => $responseData['requestId'] ?? null
    ]);
} else {
    http_response_code($httpCode);
    echo json_encode([
        'success' => false,
        'http_code' => $httpCode,
        'error' => 'HTTP Error',
        'response' => $responseData ?: $response
    ]);
}
?>
