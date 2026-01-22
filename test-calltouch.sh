#!/bin/bash
# Скрипт для проверки связи с Calltouch API

SITE_ID="52898"
MOD_ID="r2kmsp7t"
ACCESS_TOKEN="0b9ea4940475d676014768f9478f3b5062130d223af84"
API_URL="https://api.calltouch.ru/calls-service/RestAPI/${SITE_ID}/register-lead-dict"

# Тестовые данные
NAME="Тест"
PHONE="79242231931"
EMAIL="test@example.com"
COMMENT="Тестовая заявка из терминала"

# Формируем URL с параметрами
URL="${API_URL}?site_id=${SITE_ID}&mod_id=${MOD_ID}&access_token=${ACCESS_TOKEN}&name=${NAME}&phone=${PHONE}&email=${EMAIL}&comment=${COMMENT}&targetRequest=true"

echo "🔍 Проверка связи с Calltouch API..."
echo "URL: ${API_URL}"
echo "Параметры: site_id=${SITE_ID}, mod_id=${MOD_ID}, name=${NAME}, phone=${PHONE}"
echo ""
echo "Отправка POST запроса (Calltouch может требовать POST)..."
echo ""

# Отправляем POST запрос
curl -v -X POST "${API_URL}" \
  -H "User-Agent: RiverClub-Test/1.0" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -H "Accept: application/json" \
  -d "site_id=${SITE_ID}&mod_id=${MOD_ID}&access_token=${ACCESS_TOKEN}&name=${NAME}&phone=${PHONE}&email=${EMAIL}&comment=${COMMENT}&targetRequest=true" \
  --max-time 10 \
  -L  # Следовать редиректам для диагностики

echo ""
echo ""
echo "✅ Если получили ответ (даже ошибку) - значит связь есть"
echo "❌ Если timeout или connection refused - проблема с сетью/доступом"
