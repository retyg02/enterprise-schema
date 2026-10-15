# Реестр доступов к предприятиям

Внутренняя веб-утилита для безопасного хранения доступов к предприятиям (VPN, SSH, Базы данных).

## Стек технологий
- Платформа: .NET 10.0 (ASP.NET Core Razor Pages)
- СУБД: MySQL 8.0
- ORM: Entity Framework Core 9.0

## Локальный запуск (Для разработчиков)

Для запуска проекта на локальной машине необходимы установленный **.NET Core SDK 10.0** и **Docker**.

1. Запустите Docker-контейнер локальной базы данных из корня проекта:
   ```bash
   docker compose -f docker-compose.dev.yml up -d
   ```
2. Выполните команду `dotnet run` из папки проекта.
3. Приложение автоматически накатит миграции и будет доступно по адресу: `http://localhost:7140`.



## Деплой на удаленный сервер

Запуск на сервере осуществляется полностью внутри изолированной Docker-экосистемы. Установка .NET SDK на сам сервер не требуется.

### Шаг 1. Подготовка сервера
1. Подключитесь к удаленному серверу по SSH (с защитой от обрыва сессии):
   ```bash
   ssh -o ServerAliveInterval=10 root@IP_СЕРВЕРА
   ```
2. Обновите системные репозитории Linux:
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

### Шаг 2. Проверка и установка системных зависимостей
Убедитесь, что на сервере установлены необходимые утилиты, проверив их версии:
```bash
git --version
docker --version
docker compose version
```
Если какая-либо из утилит выдает ошибку `Command not found`, установите её:
* **Установка Git:** `sudo apt install git -y`
* **Установка Docker:**
  ```bash
  sudo apt install docker.io -y
  sudo systemctl start docker
  sudo systemctl enable docker
  ```
* **Установка Docker Compose:** `sudo apt install docker-compose-v2 -y`

### Шаг 3. Клонирование и запуск
1. Перейдите в системную директорию для веб-приложений и склонируйте проект:
   ```bash
   cd /var/www
   sudo mkdir -p www
   cd www
   git clone -b bugfix/week2-3 https://github.com/retyg02/enterprise-schema
   cd EnterpriseSchema
   ```
2. Запустите сборку и старт веб-приложения с базой данных в фоновом режиме:
   ```bash
   sudo docker compose -f docker-compose.server.yml up -d --build
   ```
3. Приложение развернется в контейнерах, автоматически выполнит миграции базы данных и станет доступно по внешнему IP-адресу сервера на стандартном порту 80.