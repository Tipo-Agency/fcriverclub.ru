#!/bin/bash
# Скрипт для настройки nginx прокси для /api/lead-proxy

# Ищем активный конфиг nginx
NGINX_CONF=$(ls /etc/nginx/sites-enabled/*.conf 2>/dev/null | head -1)
if [ -z "$NGINX_CONF" ]; then
  NGINX_CONF="/etc/nginx/sites-available/default"
fi

# Проверяем, есть ли уже конфигурация
if grep -q 'location /api/lead-proxy' "$NGINX_CONF" 2>/dev/null; then
  echo "Nginx config for /api/lead-proxy already exists"
  exit 0
fi

# Читаем конфигурацию прокси
PROXY_CONFIG=$(cat <<'EOF'
    location /api/lead-proxy {
        if ($request_method = 'OPTIONS') {
            add_header 'Access-Control-Allow-Origin' '*' always;
            add_header 'Access-Control-Allow-Methods' 'POST, OPTIONS' always;
            add_header 'Access-Control-Allow-Headers' 'Content-Type' always;
            add_header 'Access-Control-Max-Age' 1728000;
            add_header 'Content-Type' 'text/plain; charset=utf-8';
            add_header 'Content-Length' 0;
            return 204;
        }
        
        proxy_pass https://cloud.1c.fitness/api/hs/lead/Webhook/9a93d939-e1e3-49b9-be61-0439957207f4;
        proxy_set_header Host cloud.1c.fitness;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_ssl_server_name on;
        proxy_ssl_verify off;
        
        add_header 'Access-Control-Allow-Origin' '*' always;
        add_header 'Access-Control-Allow-Methods' 'POST, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'Content-Type' always;
    }
EOF
)

# Добавляем конфигурацию перед закрывающей скобкой server блока
# Используем Python для более надежной вставки
python3 <<PYTHON_SCRIPT
import re

with open("$NGINX_CONF", "r") as f:
    content = f.read()

# Ищем server блок и добавляем конфигурацию перед последней закрывающей скобкой
pattern = r'(server\s*\{[^}]*)(\n\s*\})'
replacement = r'\1\n$PROXY_CONFIG\2'

new_content = re.sub(
    r'(server\s*\{.*?)(\n\s*\})',
    lambda m: m.group(1) + '\n' + '''$PROXY_CONFIG''' + m.group(2),
    content,
    flags=re.DOTALL
)

with open("$NGINX_CONF", "w") as f:
    f.write(new_content)
PYTHON_SCRIPT

# Если Python не сработал, используем простой способ - добавляем в конец server блока
if ! grep -q 'location /api/lead-proxy' "$NGINX_CONF" 2>/dev/null; then
  # Простой способ: добавляем перед последней закрывающей скобкой
  sed -i '$ {
    /^[[:space:]]*}/ i\
'"$PROXY_CONFIG"'
  }' "$NGINX_CONF"
fi

# Проверяем и перезагружаем nginx
if nginx -t 2>/dev/null; then
  systemctl reload nginx 2>/dev/null || service nginx reload 2>/dev/null
  echo "✅ Nginx configured successfully"
else
  echo "❌ Nginx config test failed"
  exit 1
fi
