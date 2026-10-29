#!/bin/bash

URL="http://127.0.0" 
BOT_TOKEN="9047856250:AAEmU1xdgDuyaRVVRUl3OkL7z4P2FzJCtkY"
CHAT_ID="-5243390742"
INTERVAL=30
TIMEOUT=5

IS_DOWN=false

echo "Мониторинг запущен для URL: $URL..."

while true; do
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time $TIMEOUT "$URL")

    if [ "$HTTP_CODE" != "200" ] && [ "$HTTP_CODE" != "302" ]; then
        if [ "$IS_DOWN" = false ]; then
            MESSAGE="Сервер не отвечает. Код ответа: $HTTP_CODE"
            curl -s -X POST "https://telegram.org" \
                -d "chat_id=$CHAT_ID" \
                -d "text=$MESSAGE" > /dev/null
            IS_DOWN=true
            echo "$(date): Уведомление отправлено."
        fi
    else
        if [ "$IS_DOWN" = true ]; then
            MESSAGE="Сервер ожил. Код ответа: $HTTP_CODE"
            curl -s -X POST "https://telegram.org" \
                -d "chat_id=$CHAT_ID" \
                -d "text=$MESSAGE" > /dev/null
            IS_DOWN=false
            echo "$(date): Сервер восстановился."
        fi
    fi

    sleep $INTERVAL
done