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
// ВАЖНО: API-токен для создания заявок НЕ ТРЕБУЕТСЯ согласно документации!
$CALLTOUCH_SITE_ID = '52898';
$CALLTOUCH_API_URL = "https://api.calltouch.ru/calls-service/RestAPI/requests/{$CALLTOUCH_SITE_ID}/register/";

// Получаем тело запроса
$data = file_get_contents('php://input');
$payload = json_decode($data, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON']);
    exit;
}

// Отправляем в 1C
$ch1C = curl_init($WEBHOOK_URL_1C);
curl_setopt($ch1C, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch1C, CURLOPT_POST, true);
curl_setopt($ch1C, CURLOPT_POSTFIELDS, $data);
curl_setopt($ch1C, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Content-Length: ' . strlen($data)
]);
curl_setopt($ch1C, CURLOPT_TIMEOUT, 10);

$response1C = curl_exec($ch1C);
$httpCode1C = curl_getinfo($ch1C, CURLINFO_HTTP_CODE);
$curlError1C = curl_error($ch1C);
curl_close($ch1C);

// Отправляем в Calltouch после отправки в 1C
$calltouchSuccess = false;
$calltouchError = null;
$calltouchResponse = null;
$calltouchHttpCode = null;

// Формируем данные для Calltouch согласно документации
$name = $payload['name'] ?? '';
$lastName = $payload['last_name'] ?? '';
$phone = $payload['phone'] ?? '';
$email = $payload['email'] ?? '';
$comment = $payload['comment'] ?? 'Заявка с сайта';
$subject = $payload['subject'] ?? 'Заявка с сайта fcriverclub.ru';

// Объединяем имя и фамилию для параметра fio
$fio = trim($name . ' ' . $lastName);
if (empty($fio)) {
    $fio = $name;
}

// Формируем POST данные согласно документации Calltouch
// ВАЖНО: Используем urlencode для всех параметров с кириллицей!
$postFields = [];
$postFields[] = 'fio=' . urlencode($fio);
$postFields[] = 'phoneNumber=' . urlencode($phone);
$postFields[] = 'email=' . urlencode($email);
$postFields[] = 'subject=' . urlencode($subject);
$postFields[] = 'comment=' . urlencode($comment);
$postFields[] = 'targetRequest=true';

// Добавляем sessionId если есть (из payload)
if (isset($payload['sessionId']) && !empty($payload['sessionId'])) {
    $postFields[] = 'sessionId=' . urlencode($payload['sessionId']);
}

// Добавляем requestUrl если есть
if (isset($payload['requestUrl']) && !empty($payload['requestUrl'])) {
    $postFields[] = 'requestUrl=' . urlencode($payload['requestUrl']);
}

$postData = implode('&', $postFields);

// Отправляем POST запрос в Calltouch API
$chCalltouch = curl_init($CALLTOUCH_API_URL);
curl_setopt($chCalltouch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($chCalltouch, CURLOPT_POST, true);
curl_setopt($chCalltouch, CURLOPT_POSTFIELDS, $postData);
curl_setopt($chCalltouch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/x-www-form-urlencoded;charset=utf-8',
    'User-Agent: RiverClub/1.0'
]);
curl_setopt($chCalltouch, CURLOPT_FOLLOWLOCATION, false);
curl_setopt($chCalltouch, CURLOPT_SSL_VERIFYPEER, true);
curl_setopt($chCalltouch, CURLOPT_TIMEOUT, 15);

$responseCalltouch = curl_exec($chCalltouch);
$calltouchHttpCode = curl_getinfo($chCalltouch, CURLINFO_HTTP_CODE);
$curlErrorCalltouch = curl_error($chCalltouch);
curl_close($chCalltouch);

if ($curlErrorCalltouch) {
    $calltouchError = 'CURL Error: ' . $curlErrorCalltouch;
} elseif ($calltouchHttpCode >= 200 && $calltouchHttpCode < 300) {
    $calltouchSuccess = true;
    $calltouchResponse = $responseCalltouch;
} else {
    $calltouchError = "HTTP {$calltouchHttpCode}: " . substr($responseCalltouch, 0, 200);
}

// Логируем для отладки
error_log("[Lead Proxy] 1C response: " . substr($response1C, 0, 200));
error_log("[Lead Proxy] 1C HTTP code: " . $httpCode1C);
error_log("[Lead Proxy] Calltouch success: " . ($calltouchSuccess ? 'yes' : 'no'));
error_log("[Lead Proxy] Calltouch HTTP code: " . $calltouchHttpCode);
error_log("[Lead Proxy] Calltouch error: " . ($calltouchError ?? 'none'));
error_log("[Lead Proxy] Calltouch response: " . substr($calltouchResponse ?? '', 0, 200));

// Возвращаем результат ВСЕГДА в формате JSON
http_response_code(200);
header('Content-Type: application/json; charset=utf-8');
$result = json_encode([
    'success' => $httpCode1C >= 200 && $httpCode1C < 300,
    'data' => $response1C ? substr($response1C, 0, 500) : 'ok',
    '1c_http_code' => $httpCode1C,
    'calltouch' => [
        'sent' => $calltouchSuccess,
        'http_code' => $calltouchHttpCode,
        'error' => $calltouchError,
        'response' => $calltouchResponse ? substr($calltouchResponse, 0, 500) : null,
        'debug' => [
            'url' => $CALLTOUCH_API_URL,
            'post_data_length' => strlen($postData),
            'curl_error' => $curlErrorCalltouch ?: null
        ]
    ]
], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

if ($result === false) {
    error_log("[Lead Proxy] JSON encode error: " . json_last_error_msg());
    $result = json_encode(['error' => 'JSON encoding failed', 'json_error' => json_last_error_msg()]);
}

echo $result;
?>
