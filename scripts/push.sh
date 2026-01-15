#!/bin/bash

# Добавляем все изменения
git add .

# Проверяем, есть ли изменения для коммита
if git diff --staged --quiet; then
  echo "No changes to commit"
else
  # Коммитим с временной меткой
  git commit -m "Update: $(date '+%Y-%m-%d %H:%M:%S')"
fi

# Получаем текущую ветку
BRANCH=$(git branch --show-current)

# Пытаемся запушить, автоматически устанавливая upstream при первом пуше
if git push --set-upstream origin "$BRANCH" 2>/dev/null; then
  echo "Pushed successfully with upstream set"
elif git push 2>/dev/null; then
  echo "Pushed successfully"
else
  echo "Push failed. Please check your git configuration."
  exit 1
fi
