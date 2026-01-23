# Инструкция по интеграции Calltouch для других клубов

## Контекст
Мы интегрировали Calltouch API для отправки заявок с сайта. Calltouch автоматически отправляет заявки в 1C через настроенный вебхук, поэтому прямую отправку в 1C убрали.

## Что нужно сделать

### 1. Найти файл `services/leadService.ts`

### 2. Изменить только `calltouchSiteId`

Найти строку:
```typescript
const calltouchSiteId = '52898'; // ← ЗДЕСЬ ЗАМЕНИТЬ НА НОВЫЙ SITE_ID
```

Заменить `'52898'` на site_id нового клуба.

### 3. Проверить `calltouchModId` (обычно не меняется)

Строка:
```typescript
const calltouchModId = 'r2kmsp7t'; // ← Проверить, обычно одинаковый для всех клубов
```

Если mod_id отличается для нового клуба - заменить.

### 4. Проверить скрипт Calltouch в `index.html`

Убедиться что в `index.html` есть скрипт Calltouch с правильным mod_id:
```html
<!-- calltouch -->
<script>
(function(w,d,n,c){w.CalltouchDataObject=n;w[n]=function(){w[n]["callbacks"].push(arguments)};if(!w[n]["callbacks"]){w[n]["callbacks"]=[]}w[n]["loaded"]=false;if(typeof c!=="object"){c=[c]}w[n]["counters"]=c;for(var i=0;i<c.length;i+=1){p(c[i])}function p(cId){var a=d.getElementsByTagName("script")[0],s=d.createElement("script"),i=function(){a.parentNode.insertBefore(s,a)},m=typeof Array.prototype.find === 'function',n=m?"init-min.js":"init.js";s.async=true;s.src="https://mod.calltouch.ru/"+n+"?id="+cId;if(w.opera=="[object Opera]"){d.addEventListener("DOMContentLoaded",i,false)}else{i()}}})(window,document,"ct","r2kmsp7t"); // ← Проверить mod_id здесь
</script>
<!-- calltouch -->
```

## Что НЕ нужно делать

- ❌ НЕ нужно настраивать прокси
- ❌ НЕ нужно настраивать PHP файлы
- ❌ НЕ нужно настраивать nginx для Calltouch
- ❌ НЕ нужно отправлять в 1C напрямую (Calltouch сам отправит через вебхук)

## Как это работает

1. Пользователь заполняет форму на сайте
2. Форма отправляется в Calltouch API напрямую с клиента
3. Calltouch получает заявку и автоматически отправляет её в 1C через настроенный вебхук
4. Всё работает без прокси и без серверных манипуляций

## Проверка

После изменений:
1. Открыть сайт в браузере
2. Открыть консоль разработчика (F12)
3. Отправить тестовую заявку
4. Проверить в консоли:
   - Должно быть: `[LeadService] Calltouch: заявка успешно отправлена`
   - НЕ должно быть ошибок CORS
5. Проверить в личном кабинете Calltouch - заявка должна появиться
6. Проверить в 1C - заявка должна появиться автоматически (через вебхук Calltouch)

## Документация Calltouch

API метод: https://api.calltouch.ru/calls-service/RestAPI/requests/{site_id}/register/

Документация: https://www.calltouch.ru/support/upravlenie-zayavkami-cherez-api/

## Важно

- Site ID можно найти в личном кабинете Calltouch: Интеграции / Отправка данных во внешние системы / API / ID личного кабинета
- Mod ID можно найти там же: Интеграции / Отправка данных во внешние системы / API / ID счетчика
- Убедиться что в Calltouch настроен вебхук для отправки в 1C (иначе заявки не попадут в 1C)
