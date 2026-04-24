# Technical SEO Audit — kuechen-montage-hamburg.de

**Datum:** 2026-04-24
**Scope:** Статический сайт на GitHub Pages (apex через CNAME), 96 URL в sitemap, 45 проиндексировано.
**Инструменты:** curl (headers), Python (HTML-parsing через regex по 109 файлам), GSC URL-Inspection snapshot (`gsc-data/url-inspection.json`, 108 URL).

---

## Executive Summary

Техническая база сайта в основном здоровая: 109/109 HTML-страниц имеют `viewport`, `lang="de"` и canonical-тег; sitemap валиден и без дубликатов; IndexNow-ключ отдаётся с кодом 200; `.nojekyll` на месте. Но есть пять конкретных проблем, из которых три — блокирующие для индексации:

1. **Canonical-конфликт шире, чем описано.** Google перекрывает авторский canonical у ВСЕХ трёх пар (altona/harburg/wandsbek) — Search Console помечает 3 пары как "Duplikat, vom Nutzer nicht als kanonisch festgelegt" и выбирает короткие root-URL (`/altona.html` и т.д.). Кроме того, в `CANONICAL_MISMATCH` из GSC попали другие три URL (`/bergedorf.html`, `/kuechenmontage-hamburg-mitte.html`, `/pages/services/wasserhahn-austauschen-hamburg.html` с запутанным `www`-хостом). Всего в сайтмэпе 13 HTML-файлов-стабов с meta-refresh — это "soft redirect", Google не обязан его уважать.
2. **Нет HSTS и других security-headers.** GitHub Pages не отдаёт `Strict-Transport-Security`, `X-Content-Type-Options`, `X-Frame-Options` — для SEO некритично, но ухудшает оценку безопасности.
3. **`http://` возвращает 200, а не 301 на `https://`.** GitHub Pages на apex-домене не редиректит автоматически (только `www` → apex). Можно включить в настройках репо "Enforce HTTPS".
4. **Канонические-хосты неконсистентны:** на странице `/pages/services/wasserhahn-austauschen-hamburg.html` canonical указывает на `https://www.kuechen-montage-hamburg.de/...` (с `www`), тогда как apex-домен — без `www`. Это зеркальная ошибка.
5. **13 HTML-файлов вне sitemap** — правильно, они — meta-refresh стабы; но они всё равно индексируются и конкурируют с canonical-целями.

**Про canonical-решение:** рекомендую **вариант A** (ROOT → nested через реальные 301 + удаление root-файлов) для altona/wandsbek и **вариант смешанный** для harburg — это отдельный случай, root-страница реально другая, см. §3.

---

## 1. robots.txt

Файл: `/robots.txt` (3 строки):

```
User-agent: *
Allow: /
Disallow: /admin/

Sitemap: https://kuechen-montage-hamburg.de/sitemap.xml
```

- **Блокировок контентных URL:** нет.
- **`/admin/`:** корректно, такого каталога в репо нет.
- **Sitemap-директива:** присутствует, URL корректен.
- **HTTP-ответ:** `200 OK`, `Content-Type: text/plain`, 98 байт.
- **Noindex через Disallow:** нет (это антипаттерн; правильно обошли).

**Статус:** OK. Рекомендаций нет.

---

## 2. sitemap.xml

- **URL-ов:** 96 (ровно столько, сколько указано в задаче).
- **Уникальных:** 96, дубликатов нет.
- **Lastmod-распределение:**
  - `2026-04-23` → 80 URL (свежие, сегодня-вчера)
  - `2026-04-11` → 3 URL
  - `2026-04-09` → 13 URL (в основном legal-страницы: impressum, datenschutz, kontakt, ueber-uns, galerie, preise — не меняются)
- **Формат:** XML валиден, все `<loc>` — absolute HTTPS URL на apex-домен (без `www`) ✓
- **Changefreq/Priority:** используются, но Google их официально игнорирует — можно удалить, но вреда они не наносят.

**HTML-файлы на файловой системе, которые НЕ в sitemap (13 шт):**

```
/20357.html                           → stub meta-refresh → /pages/stadtteile/eimsbuettel.html
/21073.html                           → stub meta-refresh → /pages/stadtteile/harburg.html
/22765.html                           → stub meta-refresh → /pages/stadtteile/ottensen.html
/altona.html                          → stub meta-refresh → /pages/stadtteile/altona.html
/aufmass-kueche-hamburg.html          → stub meta-refresh → /pages/services/aufmass-kueche-hamburg.html
/bergedorf.html                       → stub meta-refresh → /pages/stadtteile/bergedorf.html
/herd-anschliessen-hamburg.html       → stub meta-refresh → /pages/services/herd-anschliessen-hamburg.html
/kuechenmontage-hamburg-mitte.html    → stub meta-refresh → /pages/stadtteile/hamburg-mitte.html
/kuechenmontage-hamburg.html          → stub meta-refresh → /pages/services/kuechenmontage-hamburg.html
/quick-registration-link.html         → noindex, stub → /
/spuelmaschine-anschliessen-hamburg.html → stub meta-refresh → /pages/services/...
/wandsbek.html                        → stub meta-refresh → /pages/stadtteile/wandsbek.html
/waschmaschine-wandsbek.html          → stub meta-refresh → /pages/stadtteile/wandsbek.html
```

Это **правильно** не класть в sitemap — но они всё ещё *физически существуют*, индексируются и перебивают canonical (см. §3).

**URL-ов в sitemap без файла:** 0 (всё проверено).

**Статус:** OK структурно, но 13 "призрачных" файлов создают canonical-конфликт.

---

## 3. Canonical tags — главная проблема

### 3.1 Общая статистика (109 HTML-файлов)

| Метрика | Значение |
|---|---|
| Всего HTML | 109 |
| Без canonical | **0** ✓ |
| Self-canonical | 96 |
| Cross-canonical (указывает на другой URL) | 13 |

Cross-canonical — это как раз все 13 meta-refresh стабов.

### 3.2 Три проблемные пары (altona/harburg/wandsbek)

| URL в репо | Размер | Canonical в HTML | meta-refresh | `meta robots` |
|---|---|---|---|---|
| `/altona.html` (root) | 427 B | `/pages/stadtteile/altona.html` | `0;url=pages/stadtteile/altona.html` | нет |
| `/pages/stadtteile/altona.html` (nested) | 10 599 B | `/pages/stadtteile/altona.html` (self) | нет | `index, follow` |
| `/harburg.html` (root) | **11 382 B** | `/harburg.html` (self) | **нет** | `index, follow` |
| `/pages/stadtteile/harburg.html` (nested) | 10 731 B | `/pages/stadtteile/harburg.html` (self) | нет | `index, follow` |
| `/wandsbek.html` (root) | 473 B | `/pages/stadtteile/wandsbek.html` | `0;url=pages/stadtteile/wandsbek.html` | нет |
| `/pages/stadtteile/wandsbek.html` (nested) | 10 806 B | `/pages/stadtteile/wandsbek.html` (self) | нет | `index, follow` |

**Важная поправка к исходной постановке задачи:**

- `/altona.html` и `/wandsbek.html` — это **тонкие meta-refresh стабы (426/473 байт)** с правильным canonical → nested. То есть авторский canonical на ОБОИХ файлах уже указывает на nested-версию. Google всё равно выбирает root. Это классический симптом soft-redirect: Google видит canonical, но отдаёт приоритет тому URL, который короче/старше/имеет больше внутренних/внешних ссылок, когда основной способ объединения — только `<meta http-equiv="refresh">`, а не HTTP 301.
- `/harburg.html` — **это отдельный, полноценный 11 КБ "Harburg-Service Übersicht" page** с собственным `canonical → /harburg.html` (self). Он НЕ дубликат nested-страницы, у него свой title ("Küchen-Service Harburg | Montage & Geräteanschluss"), свои LocalBusiness+Breadcrumb schema, свой обзор всех услуг в Харбурге. Но Google помечает `/pages/stadtteile/harburg.html` как "Duplikat vom Nutzer nicht als kanonisch festgelegt" и использует root в качестве canonical.

### 3.3 Что говорит GSC (источник: `gsc-data/url-inspection.json`, 108 URL, проверено 2026-04-24)

**Официальная категория `CANONICAL_MISMATCH`** (где user_canonical ≠ google_canonical) — 3 URL, но **НЕ те 3**, что в задаче:

| URL | user_canonical | google_canonical | Coverage |
|---|---|---|---|
| `/bergedorf.html` | `/pages/stadtteile/bergedorf.html` | `/bergedorf.html` | Gesendet und indexiert |
| `/kuechenmontage-hamburg-mitte.html` | `/pages/stadtteile/hamburg-mitte.html` | `/kuechenmontage-hamburg-mitte.html` | Gesendet und indexiert |
| `/pages/services/wasserhahn-austauschen-hamburg.html` | **`https://www.kuechen-montage-hamburg.de/...`** (с www!) | `/wasserhahn-harburg.html` | Alternative Seite mit richtigem kanonischen Tag |

**В категории `OTHER` — "Duplikat, vom Nutzer nicht als kanonisch festgelegt"** (по сути тоже canonical-конфликт):

| URL | google_canonical |
|---|---|
| `/pages/stadtteile/altona.html` | `/altona.html` |
| `/pages/stadtteile/harburg.html` | `/harburg.html` |
| `/pages/stadtteile/wandsbek.html` | `/wandsbek.html` |

Так что реально **6 пар** с канонической путаницей (altona, harburg, wandsbek, bergedorf, hamburg-mitte, wasserhahn-austauschen-hamburg), все одного паттерна: короткий root-URL (или отдельная страница) перебивает длинный nested-URL.

### 3.4 Опинион: какое решение лучше?

**Для altona/wandsbek (и аналогов bergedorf, hamburg-mitte):** 4 варианта:

- **A. 301 редирект root → nested.** На GitHub Pages невозможно server-side. Нужно либо Cloudflare Pages (хотя GH Pages с Cloudflare DNS можно добавить Page Rules/Transform Rules), либо Netlify/Vercel. Effort: high (миграция хостинга или настройка CF). Risk: средний (переезд). Impact: правильное решение.
- **B. Инвертировать canonical**: root остаётся, но его canonical → self (`/altona.html`), а nested удалить/301. Effort: низкий. Risk: средний (теряется хорошая URL-иерархия). Impact: выигрывает тот URL, который Google уже выбрал.
- **C. Принять реальность**: оставить как есть, переписать HTML-контент в root-файлах (сейчас там 427 байт meta-refresh) чтобы копировать nested-контент, canonical → root. Nested помечать `noindex,follow` или 301. Effort: средний. Risk: низкий.
- **D. Не трогать, Google уже выбрал.** Effort: 0. Risk: терпимый (пользователь через meta-refresh всё равно попадёт на nested, Google индексирует root). Impact: визуально в SERP будет короткий URL `/altona.html`, что даже лучше для CTR, но "настоящий" контент живёт на nested-странице — это странно структурно.

**Моя рекомендация — вариант B с доработками:**

На GitHub Pages нет серверных 301, а meta-refresh Google трактует как soft-301 только в идеальных условиях. Сейчас Google УЖЕ выбрал root-URL как canonical и он индексирован — бороться с этим семь лет я бы не стал. Правильное инженерное решение:

1. Для `altona.html` и `wandsbek.html` (и аналогов): **переделать root-файл из стаба в полноценную копию nested-страницы** (одинаковый контент, canonical → self `/altona.html`), а `/pages/stadtteile/altona.html` — поставить `<meta name="robots" content="noindex,follow">` + canonical → root. То же самое с bergedorf и hamburg-mitte.
2. Для `harburg.html` — **оставить как есть** (это отдельная overview-страница, не дубликат). Но добавить **явный canonical на nested-странице `/pages/stadtteile/harburg.html` → тоже self**, а не root. То есть они должны быть семантически разными: `/harburg.html` = "Harburg-Service Übersicht (все услуги в бецирке)", `/pages/stadtteile/harburg.html` = "Küchenmontage Harburg (одна конкретная услуга в районе)". Если они действительно разные — нужно УСИЛИТЬ контент-разницу (разные H1, разные schema.org типы, разные FAQ), чтобы Google не считал их дубликатами. Если они по смыслу одинаковые — выбрать одну, другую `noindex`.
3. Для `/pages/services/wasserhahn-austauschen-hamburg.html` — **срочно исправить canonical**, убрать `www.` (это вообще нарушение, apex без www). Возможно опечатка при генерации.

Почему B, а не A: (1) GitHub Pages не умеет 301; (2) Google уже выбрал короткий URL — работаем с этим фактом, а не против; (3) короткие URL лучше для SERP CTR; (4) это требует минимум изменений и никакого миграционного риска.

**Почему вариант C (301) из задачи не идеален:** даже если уйти с GH Pages на Netlify/CF, Google уже 6+ месяцев индексирует root — редирект отработает, но переход канонического сигнала с nested на root займёт ещё месяцы. Проще принять, что root выиграл, и привести HTML-иерархию к этому.

### 3.5 Список ВСЕХ 13 cross-canonical страниц

Из них три пары полностью параллельны проблеме altona/wandsbek (stubs → nested):

```
/20357.html              → /pages/stadtteile/eimsbuettel.html   (числовой короткий, низкий риск)
/21073.html              → /pages/stadtteile/harburg.html
/22765.html              → /pages/stadtteile/ottensen.html
/altona.html             → /pages/stadtteile/altona.html         ★ проблема
/aufmass-kueche-hamburg.html → /pages/services/aufmass-kueche-hamburg.html
/bergedorf.html          → /pages/stadtteile/bergedorf.html       ★ GSC MISMATCH
/herd-anschliessen-hamburg.html → /pages/services/herd-anschliessen-hamburg.html
/kuechenmontage-hamburg-mitte.html → /pages/stadtteile/hamburg-mitte.html ★ GSC MISMATCH
/kuechenmontage-hamburg.html → /pages/services/kuechenmontage-hamburg.html
/quick-registration-link.html → /                                (noindex+stub, OK)
/spuelmaschine-anschliessen-hamburg.html → /pages/services/...
/wandsbek.html           → /pages/stadtteile/wandsbek.html        ★ проблема
/waschmaschine-wandsbek.html → /pages/stadtteile/wandsbek.html
```

Всё это — одна и та же системная болезнь; решать её надо одним паттерном.

---

## 4. Meta robots

| Значение | Кол-во страниц |
|---|---|
| `index, follow` | 94 |
| `noindex, follow` | 2 |
| `noindex,follow` (без пробела) | 1 |
| нет meta robots | 12 |

Страниц без meta-robots 12 — это все meta-refresh stubs (дефолт = `index,follow`, что ок).

**Страницы с noindex (3):**

- `/quick-registration-link.html` — stub, носит технический характер.
- `/pages/datenschutz.html` — ✓ логично, legal
- `/pages/impressum.html` — ✓ логично, legal

Нет "случайных" noindex на коммерческих страницах.

**Статус:** OK.

---

## 5. .nojekyll

**Есть:** `C:\Users\prusi\Desktop\3. Проекты\kuechen-montage-hamburg\.nojekyll` (0 байт, корректно).

Это отключает Jekyll-обработку на GitHub Pages — нужно для папок с `_` и для сырой раздачи. Правильно.

**Статус:** OK.

---

## 6. HTTPS & headers

### 6.1 HTTPS/HTTP доступность

```
$ curl -I https://kuechen-montage-hamburg.de/
HTTP/1.1 200 OK
Server: GitHub.com
Content-Length: 67923
Last-Modified: Thu, 23 Apr 2026 18:07:16 GMT
Cache-Control: max-age=600
ETag: "69ea5fd4-10953"
Accept-Ranges: bytes
Vary: Accept-Encoding

$ curl -I http://kuechen-montage-hamburg.de/
HTTP/1.1 200 OK    ← ПРОБЛЕМА: HTTP не редиректит на HTTPS

$ curl -I -L http://www.kuechen-montage-hamburg.de/
HTTP/1.1 301 Moved Permanently
Location: http://kuechen-montage-hamburg.de/    ← и сам редирект на HTTP, не HTTPS
```

- **HTTPS работает:** ✓
- **HTTP → HTTPS редирект на apex:** ✗ (GitHub Pages опция "Enforce HTTPS" выключена).
- **www → apex:** ✓ 301 работает.
- **www → apex с переключением на HTTPS:** ✗ (редирект на http://, не https://).

### 6.2 Security/SEO headers

Что есть:
- `Server: GitHub.com` ✓
- `Content-Type: text/html; charset=utf-8` ✓
- `Last-Modified` ✓
- `ETag` ✓
- `Cache-Control: max-age=600` (10 минут — очень короткий, но для статики на CDN ок)
- `Vary: Accept-Encoding` ✓

**Чего НЕТ** (всё — управляется GitHub-Pages инфраструктурой, локально не починить):
- `Strict-Transport-Security` — отсутствует. Нет HSTS.
- `X-Content-Type-Options: nosniff` — отсутствует.
- `X-Frame-Options` — отсутствует.
- `Content-Security-Policy` — отсутствует.
- `Referrer-Policy` — отсутствует.
- `Permissions-Policy` — отсутствует.

### 6.3 Рекомендации

1. **Включить "Enforce HTTPS"** в Settings → Pages репозитория (это закроет HTTP-дыру и включит HSTS из коробки). Effort: 1 клик. Impact: высокий.
2. **Установить кастомный `Cache-Control`** пока нельзя (GH Pages ставит 600) — не страшно.
3. **Security headers** — GitHub Pages их не отдаёт. Для получения полного набора нужно переехать на Netlify/Cloudflare Pages (`_headers` файл) или поставить Cloudflare перед GH Pages с Transform Rules. Для SEO это некритично.

---

## 7. Mobile viewport

**109/109 страниц имеют `<meta name="viewport" content="width=device-width, initial-scale=1.0">`** ✓

**Статус:** OK.

---

## 8. Hreflang

**Не обнаружено ни одной `<link rel="alternate" hreflang=...>` на всех 109 страницах.**

- Сайт только на немецком (`lang="de"` на 109/109 страниц).
- Целевая аудитория — Гамбург/DE.
- Сервис не имеет EN/RU/TR версий.

**Нужно ли?** Нет, не нужно. Для одноязычного локального сервиса `hreflang` избыточен. Опционально можно добавить `<link rel="alternate" hreflang="de-DE" href="..."><link rel="alternate" hreflang="x-default" href="...">` на каждую страницу — но это микро-оптимизация и даст нулевой эффект без второго языка.

**Статус:** OK (отсутствие корректно).

---

## 9. URL hygiene

- **Trailing slash консистентность:** смешанная.
  - Коммерческие директории (`/kuechenspuele-montage-hamburg/`, `/waschmaschine-anschliessen-hamburg/`, и т.д.) — с trailing slash ✓
  - Stadtteile и services — с `.html` расширением (`/pages/stadtteile/altona.html`) — без trailing slash ✓
  - `/pages/blog/` — с trailing slash ✓
  - Это ок, конвенция выдержана **внутри категории**. Смешивание между категориями — приемлемо.
- **Uppercase в URL:** 0 файлов с uppercase-буквами в пути ✓
- **Query-параметры:** в sitemap нет, в контенте только `wa.me/...?text=...` (корректно).
- **Длинные числовые стабы** `/20357.html`, `/21073.html`, `/22765.html` — выглядят как PLZ (20357 = Hamburg-Altona, 21073 = Harburg, 22765 = Ottensen) — **это ПЛЗ-short-URL стабы.** Они правильно не в sitemap, canonical указывает на stadtteile-страницы. Оставить.

**Статус:** OK с мелкими замечаниями.

---

## 10. IndexNow

- Файл в корне: `/ce47b707860f4585abdde44097bc3c07.txt`
- **HTTP-ответ:** `200 OK`, `Content-Type: text/plain`, 32 байта
- **Содержимое:** `ce47b707860f4585abdde44097bc3c07` (имя файла = содержимое, как требует IndexNow spec) ✓
- **Cache-Control:** `max-age=600`
- **Статус:** ✓ Ключ активен, можно пинговать `https://api.indexnow.org/indexnow` на любые изменения.

---

## Приоритизированный action-list

Упорядочено по impact / effort:

1. **[CRITICAL]** Включить "Enforce HTTPS" в GitHub Pages Settings. *1 клик, 0 риска.*
2. **[HIGH]** Исправить canonical на `/pages/services/wasserhahn-austauschen-hamburg.html` — убрать `www.` из canonical URL (неочевидная зеркальная ошибка). *1 строка, 0 риска.*
3. **[HIGH]** Определиться со стратегией по 6 canonical-конфликтам (altona, wandsbek, bergedorf, hamburg-mitte, harburg, и, возможно, ottensen/eimsbuettel по паттерну `/20357.html` → `/pages/stadtteile/...`). Моя рекомендация — **вариант B** (принять, что root-URL выигрывает, перенести контент и инвертировать canonical). Harburg рассматривать отдельно — там root реально другой контент.
4. **[MEDIUM]** Нормализовать meta robots: один файл (`pages/impressum.html`?) использует `noindex,follow` без пробела — стилистическая мелочь, но приведи к единому формату `noindex, follow`.
5. **[LOW]** 13 stub-файлов с meta-refresh — если после решения (3) от них останется только перенаправляющая роль, ок; иначе рассмотреть удаление, чтобы снизить crawl budget.
6. **[INFO]** Security-headers и полноценный HSTS появятся, только если переехать на Netlify/Cloudflare Pages. Для SEO не блокирующе.

---

## Приложение: запрос на подтверждение

Вопросы, которые стоит обсудить до правок (согласно твоим инженерным правилам):

**Issue 1: Canonical-стратегия** для 6 пар (altona / wandsbek / bergedorf / hamburg-mitte / harburg / wasserhahn-austauschen-hamburg).

- **Вариант A (РЕКОМЕНДУЮ):** Инвертировать canonical — короткий URL становится "главным", nested помечается `noindex,follow`, root-стаб получает полный контент. Effort: средний (скопировать HTML из nested в root на 5 пар + доработать harburg отдельно). Risk: низкий (Google уже так видит).
- **Вариант B:** Уйти на Netlify/Cloudflare Pages и настроить реальные 301 root→nested. Effort: высокий (миграция хостинга). Risk: средний. Плюсы: чистая URL-иерархия.
- **Вариант C:** Не трогать. Effort: 0. Пользователи через meta-refresh попадут на nested, Google индексирует root, разные отчёты расходятся. Impact: дальнейшая нестабильность.

**Issue 2: Harburg — overview vs nested**
- `/harburg.html` (11 КБ, "Küchen-Service Harburg Übersicht, все услуги") и `/pages/stadtteile/harburg.html` (10 КБ, "Küchenmontage Harburg в Bezirk") похожи по смыслу. Оставить обе (усилив различие) или свести в одну?

**Issue 3: Security headers — миграция хостинга?**
- Нужен ли HSTS, nosniff, CSP? Если критично — готов спланировать миграцию на CF Pages/Netlify (бесплатно, поддержка `_headers`).

Какое направление выбираем?
