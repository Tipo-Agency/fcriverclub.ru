<?php
/**
 * PHP прокси для отправки лидов в 1C
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

$WEBHOOK_URL = 'https://cloud.1c.fitness/api/hs/lead/Webhook/9a93d939-e1e3-49b9-be61-0439957207f4';

// Получаем тело запроса
$data = file_get_contents('php://input');
$payload = json_decode($data, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON']);
    exit;
}

// Отправляем запрос к 1C
$ch = curl_init($WEBHOOK_URL);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Content-Length: ' . strlen($data)
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

if ($curlError) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to connect to 1C webhook']);
    exit;
}

http_response_code($httpCode);
echo json_encode(['success' => $httpCode >= 200 && $httpCode < 300, 'data' => $response]);
?>
