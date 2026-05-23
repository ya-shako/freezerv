# Используем официальный образ Python
FROM python:3.11-slim

# Рабочая директория внутри контейнера
WORKDIR /app

# Скопировать только requirements и установить зависимости для кеширования слоёв
COPY requirements.txt .

# Рекомендуется --no-cache-dir чтобы не хранить кэш pip в образе
RUN pip install --no-cache-dir -r requirements.txt

# Скопировать весь код приложения
COPY . .

# (Опционально) выставить переменные окружения, если нужно
ENV PYTHONUNBUFFERED=1

# Открыть порт (если приложение слушает порт, например Flask на 5000)
EXPOSE 5000

# Команда по умолчанию — запуск вашего скрипта main.py
CMD ["python", "main.py"]
