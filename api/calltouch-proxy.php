<?php
/**
 * PHP прокси для отправки заявок в Calltouch API
 * Документация: https://www.calltouch.ru/support/upravlenie-zayavkami-cherez-api/
 * 
 * API-метод: https://api.calltouch.ru/calls-service/RestAPI/requests/{site_id}/register/
 * API-токен НЕ требуется для создания заявок!
 */

// Устанавливаем заголовки CORS
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Обработка OPTIONS запроса (CORS preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Проверка метода - только POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed. Only POST is supported.']);
    exit;
}

// Calltouch API настройки
$CALLTOUCH_SITE_ID = '52898';
$CALLTOUCH_API_URL = "https://api.calltouch.ru/calls-service/RestAPI/requests/{$CALLTOUCH_SITE_ID}/register/";

// Получаем тело запроса
$rawData = file_get_contents('php://input');
if (empty($rawData)) {
    http_response_code(400);
    echo json_encode(['error' => 'Empty request body']);
    exit;
}

// Парсим JSON
$payload = json_decode($rawData, true);
if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON: ' . json_last_error_msg()]);
    exit;
}

// Извлекаем данные из payload
$name = isset($payload['name']) ? trim($payload['name']) : '';
$lastName = isset($payload['last_name']) ? trim($payload['last_name']) : '';
$phone = isset($payload['phone']) ? trim($payload['phone']) : '';
$email = isset($payload['email']) ? trim($payload['email']) : '';
$comment = isset($payload['comment']) ? trim($payload['comment']) : 'Заявка с сайта';
$subject = isset($payload['subject']) ? trim($payload['subject']) : 'Заявка с сайта fcriverclub.ru';
$sessionId = isset($payload['sessionId']) ? trim($payload['sessionId']) : '';
$requestUrl = isset($payload['requestUrl']) ? trim($payload['requestUrl']) : '';

// Объединяем имя и фамилию для параметра fio
$fio = trim($name . ' ' . $lastName);
if (empty($fio)) {
    $fio = $name;
}

// Проверяем что есть хотя бы одно обязательное поле (fio, phoneNumber или email)
if (empty($fio) && empty($phone) && empty($email)) {
    http_response_code(400);
    echo json_encode(['error' => 'At least one of the following fields is required: name, phone, or email']);
    exit;
}

// Формируем POST данные согласно документации Calltouch
// ВАЖНО: Используем urlencode для всех параметров с кириллицей!
// Формат: application/x-www-form-urlencoded;charset=utf-8
$postFields = [];
$postFields[] = 'fio=' . urlencode($fio);
$postFields[] = 'phoneNumber=' . urlencode($phone);
$postFields[] = 'email=' . urlencode($email);
$postFields[] = 'subject=' . urlencode($subject);
$postFields[] = 'comment=' . urlencode($comment);
$postFields[] = 'targetRequest=true';

// Добавляем sessionId если есть (опционально, но рекомендуется)
if (!empty($sessionId)) {
    $postFields[] = 'sessionId=' . urlencode($sessionId);
}

// Добавляем requestUrl если есть (опционально)
if (!empty($requestUrl)) {
    $postFields[] = 'requestUrl=' . urlencode($requestUrl);
}

$postData = implode('&', $postFields);

// Логируем для отладки
error_log("[Calltouch Proxy] Request received");
error_log("[Calltouch Proxy] URL: " . $CALLTOUCH_API_URL);
error_log("[Calltouch Proxy] POST data length: " . strlen($postData));

// Отправляем POST запрос в Calltouch API
$ch = curl_init($CALLTOUCH_API_URL);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/x-www-form-urlencoded;charset=utf-8',
    'User-Agent: RiverClub/1.0'
]);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, false);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);
curl_setopt($ch, CURLOPT_TIMEOUT, 15);
curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
$curlInfo = curl_getinfo($ch);
curl_close($ch);

// Логируем результат
error_log("[Calltouch Proxy] HTTP Code: " . $httpCode);
if ($curlError) {
    error_log("[Calltouch Proxy] CURL Error: " . $curlError);
}
if ($response) {
    error_log("[Calltouch Proxy] Response length: " . strlen($response));
}

// Парсим ответ Calltouch
$responseData = null;
if ($response) {
    $responseData = json_decode($response, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        error_log("[Calltouch Proxy] JSON parse error: " . json_last_error_msg());
    }
}

// Формируем ответ клиенту
if ($curlError) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'CURL Error: ' . $curlError,
        'http_code' => $httpCode
    ], JSON_UNESCAPED_UNICODE);
} elseif ($httpCode >= 200 && $httpCode < 300) {
    // Успешный ответ от Calltouch
    http_response_code(200);
    $result = [
        'success' => true,
        'http_code' => $httpCode
    ];
    
    if ($responseData) {
        $result['requestId'] = isset($responseData['requestId']) ? $responseData['requestId'] : null;
        $result['response'] = $responseData;
    } else {
        $result['response'] = $response;
    }
    
    echo json_encode($result, JSON_UNESCAPED_UNICODE);
} else {
    // Ошибка от Calltouch API
    http_response_code($httpCode);
    echo json_encode([
        'success' => false,
        'http_code' => $httpCode,
        'error' => 'Calltouch API error',
        'response' => $responseData ?: substr($response, 0, 500)
    ], JSON_UNESCAPED_UNICODE);
}
?>
