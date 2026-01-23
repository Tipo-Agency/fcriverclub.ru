# Что нужно почистить на сервере

## 1. Удалить PHP прокси файлы (если есть)

```bash
# Зайти на сервер
ssh deploy@твой_сервер

# Удалить PHP файлы
rm /var/www/fcriverclub.ru/api/lead-proxy.php
rm /var/www/fcriverclub.ru/api/calltouch-proxy.php

# Удалить директорию api если она пустая
rmdir /var/www/fcriverclub.ru/api 2>/dev/null || echo "Директория не пустая или не существует"
```

## 2. Удалить nginx конфиги для прокси (если есть)

```bash
# Зайти под root
sudo su

# Удалить конфиги
rm /etc/nginx/includes/api-proxy.conf
rm /etc/nginx/includes/calltouch-proxy.conf

# Проверить основной конфиг nginx
nano /etc/nginx/sites-enabled/fcriverclub.ru
# или
nano /etc/nginx/sites-available/fcriverclub.ru

# Удалить строки (если есть):
#   include /etc/nginx/includes/api-proxy.conf;
#   include /etc/nginx/includes/calltouch-proxy.conf;

# Проверить конфигурацию
nginx -t

# Перезагрузить nginx
systemctl reload nginx
```

## 3. Проверить что сайт работает

```bash
# Проверить что сайт доступен
curl -I https://fcriverclub.ru

# Должен вернуть 200 OK, а не 403 Forbidden
```

## 4. Если 403 Forbidden

Возможные причины:
- Неправильные права на файлы
- Неправильный document_root в nginx
- Отсутствует index.html

Исправить:
```bash
# Проверить права на файлы
ls -la /var/www/fcriverclub.ru/

# Установить правильные права
chown -R www-data:www-data /var/www/fcriverclub.ru
chmod -R 755 /var/www/fcriverclub.ru

# Проверить что index.html существует
ls -la /var/www/fcriverclub.ru/index.html

# Перезагрузить nginx
systemctl reload nginx
```

## 5. Проверить логи nginx (если проблемы)

```bash
# Посмотреть ошибки
tail -f /var/log/nginx/error.log

# Посмотреть доступ
tail -f /var/log/nginx/access.log
```
