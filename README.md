# lite

Монорепозиторий приложения для заметок с Markdown-редактором, аутентификацией через Яндекс OAuth и встроенным стеком мониторинга.

## Структура

```
lite/
├── core/           # NestJS API (порт 3000)
├── client-auth/    # React SPA (порт 80)
├── monitoring/     # Конфиги Loki, Prometheus, Grafana
└── docker-compose.yml
```

## Быстрый старт

### Требования

- Docker + Docker Compose
- Зарегистрированное приложение в [Яндекс OAuth](https://oauth.yandex.ru)

### Переменные окружения

Скопируйте и заполните:

```bash
cp core/.env.example core/.env
```

Минимально необходимые переменные в `core/.env`:

```env
JWT_SECRET=
REFRESH_JWT_SECRET=

NOTES_YANDEX_ID=        # ID приложения Яндекс OAuth
NOTES_YANDEX_SECRET=    # Секрет приложения
NOTES_YANDEX_REDIRECT=  # http://<host>/api/v1/oauth/yandex/redirect
NOTES_TARGET_URL=       # URL фронтенда, куда редиректить после входа

EMAILS=user@example.com # Белый список email через запятую
```

Опциональные переменные окружения для docker-compose (можно задать в `.env` рядом с `docker-compose.yml`):

| Переменная | По умолчанию | Описание |
|---|---|---|
| `POSTGRES_USER` | `postgres` | Пользователь БД |
| `POSTGRES_PASSWORD` | `postgres` | Пароль БД |
| `POSTGRES_DB_TOOLS` | `notes-db` | Имя базы |
| `VITE_API_DOMAIN` | `http://localhost/api/v1` | API URL для сборки фронтенда |
| `VITE_TOKEN` | — | Client ID Яндекс OAuth для фронтенда |
| `GRAFANA_USER` | `admin` | Логин Grafana |
| `GRAFANA_PASSWORD` | `admin` | Пароль Grafana |
| `PGADMIN_EMAIL` | `admin@admin.com` | Логин pgAdmin |
| `PGADMIN_PASSWORD` | `admin` | Пароль pgAdmin |

### Запуск

```bash
docker compose up -d
```

| Сервис | URL |
|---|---|
| Приложение | http://localhost |
| API | http://localhost/api/v1 |
| Grafana | http://localhost:3001 |
| Prometheus | http://localhost:9090 |
| pgAdmin | http://localhost:5050 |

## Сервисы

- **postgres** — PostgreSQL 16, данные в named volume `postgres_data`
- **core** — NestJS API, зависит от postgres и loki
- **client** — nginx, отдаёт SPA и проксирует `/api` → core
- **loki** — хранилище логов (порт не проброшен наружу)
- **prometheus** — сбор метрик с `core:3000/metrics`
- **grafana** — дашборды для Prometheus и Loki, provisioning из `monitoring/grafana/`
- **pgadmin** — веб-интерфейс для PostgreSQL

## Локальная разработка

Запустите только инфраструктуру:

```bash
docker compose up -d postgres loki prometheus grafana pgadmin
```

Затем запустите core и client-auth локально — см. README в каждом пакете.
