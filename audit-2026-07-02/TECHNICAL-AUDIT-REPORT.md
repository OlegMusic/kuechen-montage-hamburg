# Технический SEO-аудит — kuechen-montage-hamburg.de

**Дата:** 2026-07-02
**Метод:** полный live-crawl (140 URL), Lighthouse 13.4 (mobile, 4 шаблона), Google Search Console URL Inspection API (все 118 URL sitemap, данные на 02.07.2026), Search Analytics 28 дней.
**Сырые данные:** `crawl-results.json`, `gsc-inspect-fresh.json`, `lh-*.json` (в этой папке).

---

## Executive Summary

Техническая база сайта в отличном состоянии — 0 битых ссылок, 0 цепочек редиректов, максимальная глубина 3 клика, Lighthouse 88–99/100, корректные HTTPS/HSTS/canonical — но **30 из 118 URL sitemap (25%) не в индексе Google**, включая новые «денежные» страницы после миграции 22.06 (`/arbeitsplatte-austauschen-hamburg/`, `/backofen-anschliessen-hamburg/`, `/kueche-fertigstellen-lassen-hamburg/`). Главные утечки: 94 внутренние ссылки из блога всё ещё ведут на старые noindex-страницы `/pages/services/`, 6 страниц sitemap — полные сироты без единой внутренней ссылки, а 22 URL Google вообще ещё не обнаружил. Все приоритетные фиксы — правки ссылок в шаблонах и batch-отправка в IndexNow — выполнимы за 1–2 дня и способны вернуть в индекс до 20 страниц в течение месяца.

---

## 1. Структура сайта и crawl

| Метрика | Значение | Оценка |
|---|---|---|
| Просканировано URL | 140 (118 sitemap + 22 обнаружено) | — |
| HTTP-ошибки (4xx/5xx) | 0 | ✅ |
| Цепочки редиректов | 0 | ✅ |
| Макс. глубина от главной | 3 клика (80 страниц на глубине 1) | ✅ |
| Сироты в sitemap (0 внутренних ссылок) | **6** | ⚠️ |
| Недостижимы от главной по ссылкам | **15** (вкл. noindex-legacy) | ⚠️ |

**Сироты (в sitemap, ни одной внутренней ссылки, проверено по live-HTML):**

| URL | Статус в Google (02.07) |
|---|---|
| `/eckventil-austauschen-hamburg/` | URL is unknown to Google |
| `/kuechenaufbau-hamburg/` | индексирован (пока) |
| `/22765.html` (PLZ Ottensen) | Crawled — currently not indexed |
| `/waschmaschine-anschliessen-altona.html` | Crawled — currently not indexed |
| `/waschmaschine-anschliessen-barmbek.html` | индексирован |
| `/wasserhahn-eimsbuettel.html` | индексирован |

**Слабо связанные важные страницы:** `/pages/ueber-uns.html` и `/pages/garantie-und-service.html` (по 1 ссылке, недостижимы от главной) — это trust-страницы, важные для E-E-A-T. Три статьи блога (`kueche-selbst-aufbauen-oder-lassen`, `kueche-kaufen-und-aufbauen-lassen`, `ikea-aufbauservice-handwerker-erfahrung`) **не выведены в листинг `/pages/blog/`** (проверено grep по live-HTML) — одна уже выпала из индекса.

---

## 2. Core Web Vitals (Lighthouse 13.4, mobile, лабораторные)

| Шаблон | URL | Perf | LCP | TBT | CLS |
|---|---|---|---|---|---|
| Главная | `/` | 94 | 2.4 s | 90 ms | 0 |
| Сервисная | `/geschirrspueler-anschliessen-hamburg/` | 98 | 1.9 s | 0 ms | 0 |
| Stadtteil | `/wandsbek.html` | 88→99* | 1.8 s | 0 ms | **0.227→0*** |
| Ratgeber | `/pages/ratgeber/kuechenmontage-kosten.html` | 99 | 1.8 s | 0 ms | 0 |

Best Practices и SEO — 100/100 на всех четырёх шаблонах.

\* **Нестабильная находка (подтверждена в 1 из 2 прогонов):** CLS 0.227 на шаблоне Stadtteil, виновник — анимированный декоративный элемент `.hero::after` (`css/style.css:214`, круг 700×700 с keyframes `heroGlow` translate+scale). Когда браузер не композитит анимацию, она засчитывается как layout shift. Дешёвая страховка: добавить `will-change: transform` в правило `.hero::after` (затрагивает 5 stadtteile-страниц на `style.css`). Полевые данные CrUX недоступны (нет API-ключа; сайт, вероятно, ниже порога трафика CrUX).

---

## 3. Индексируемость (GSC URL Inspection, все 118 URL sitemap, 02.07.2026)

| Статус | Кол-во |
|---|---|
| Submitted and indexed | **88 (74.6%)** |
| URL is unknown to Google | **22** |
| Crawled — currently not indexed | **7** |
| Page with redirect | 1 |

**«Unknown to Google» — Google ещё ни разу не видел URL.** Критичные среди 22:

- `/arbeitsplatte-austauschen-hamburg/`, `/backofen-anschliessen-hamburg/`, `/kueche-fertigstellen-lassen-hamburg/` — **новые короткие URL после миграции 22.06**, 10 дней без обнаружения;
- `/eckventil-austauschen-hamburg/` — сирота (см. §1), запросы «eckventil austauschen» дают 118+ показов/28д на другую страницу — потенциал не реализован;
- 12 страниц `/pages/stadtteile/*.html` (barmbek, winterhude, eppendorf, bramfeld, blankenese, ottensen, stellingen, uhlenhorst, billstedt, jenfeld, farmsen, horn, wilhelmsburg) — в sitemap, index+follow, 4–15 внутренних ссылок, но не обнаружены;
- `/umkehrosmose-wasserfilter-hamburg/`, `/pages/ratgeber/kuechenmontage-kosten.html`, `/pages/services/silikonfugen-…`, `/pages/services/sockelleisten-…`, `/pages/services/video-beratung.html`.

**«Crawled — currently not indexed» (7)** — Google видел, но счёл недостаточно ценными: `wer-zahlt-kuechenspuele-mietwohnung/`, `wasserhahn-harburg.html`, `20357.html`, `22765.html`, `waschmaschine-anschliessen-altona.html`, `blog/ikea-aufbauservice-…`, `ratgeber/abfluss-verstopft-…`. Это микро-локальные вариации — нужна дифференциация контента, **не удаление** (страницы могут ранжироваться за пределами 28-дневного окна GSC).

**Гигиена sitemap:** `lastmod` главной — 2026-04-23 при фактическом обновлении 02.07 (расхождение снижает доверие Google к lastmod всего файла). `robots.txt` корректен, канонический хост один (все варианты http/www → 301 в один hop на `https://kuechen-montage-hamburg.de/`). Noindex-страниц в sitemap нет ✅.

---

## 4. Структурированные данные

Покрытие отличное: JSON-LD на 138 из 140 страниц, **0 синтаксических ошибок**. BreadcrumbList — 120 стр., LocalBusiness — 85, FAQPage — 79, Service+Offer — 51, Product+AggregateRating+Review — 36, HowTo — 17, VideoObject — 3.

- ✅ `AggregateRating` везде вложен в `Product` (не в `Service`) — критическая ошибка Google исключена (проверено парсингом вложенности на live-страницах).
- ⚠️ **Мониторить:** паттерн «Product-обёртка для услуги» Google допускает, но он под пристальным вниманием политики Merchant listings — следить за разделом Rich Results в GSC; при появлении предупреждений — план Б: снять Product, оставить рейтинг только на LocalBusiness главной.
- Без JSON-LD только 2 meta-refresh заглушки (`/pages/services/backofen-…`, `/pages/services/kueche-fertigstellen-…`) — им и не нужно.
- Пробелы по типам страниц: статьи блога — только 2 из ~20 имеют `BlogPosting` (остальные `Article` или без типа статьи); у страниц с YouTube-видео `VideoObject` есть лишь на 3 — можно расширить.

---

## 5. Внутренняя перелинковка

**Утечки ссылочного веса (проверено по live-HTML):**

1. **94 ссылки из шаблона блога ведут на noindex-legacy:** `/pages/services/kuechenmontage-hamburg.html` (52 ссылки) и `/pages/services/herd-anschliessen-hamburg.html` (42) — обе noindex+canonical на новые URL. Ссылки должны вести сразу на `/` и `/herd-anschliessen-hamburg/`.
2. **Главная и harburg.html ссылаются на meta-refresh заглушки** вместо новых URL: `/pages/services/backofen-anschliessen-hamburg.html` (4 ссылки) и `…/kueche-fertigstellen-lassen-hamburg.html` (2).
3. **101 ссылка на `index.html` и 103 на `/pages/blog/index.html`** вместо канонических `/` и `/pages/blog/` — Google склеивает через canonical, но это лишний дубль-сигнал; фикс — замена в шаблонах.
4. Всего **431 внутренняя ссылка указывает на noindex-страницы** (из них 270 — impressum/datenschutz, это норма).

**Концентраторы (норм для nav):** `/pages/preise.html` (135 входящих), `/pages/kontakt.html` (112). **Недосвязаны:** сироты из §1 + PLZ-страницы `20357/21073/22765` (по 0–1 ссылке) + 3 статьи блога.

---

## 6. Мобильность и HTTPS/безопасность

- ✅ Viewport на всех индексируемых страницах; Google краулит как MOBILE; шрифты/тап-таргеты — SEO 100/100.
- ✅ HTTP→HTTPS и www→non-www: единый 301 без цепочек; HSTS `max-age=31556952`; смешанного контента 0; 404 отдаёт корректный код; `llms.txt` присутствует.
- ⚠️ **`/backend/data/*.json` публично доступны** (`signups.json`, `stories.json`, `votes.json` отдают 200). Сейчас там только тестовая запись, но файлы отслеживаются git (попали в коммит до добавления в `.gitignore`) — если серверный процесс когда-либо запишет реальные email, они опубликуются на GitHub Pages (DSGVO-риск). Фикс: `git rm --cached backend/data/*.json` + вынести `backend/` из корня Pages.
- ℹ️ Платформенное ограничение GitHub Pages: нельзя задать CSP/X-Frame-Options на уровне заголовков — приемлемо для статического сайта-визитки.

---

## Приоритизированный список фиксов (impact × effort)

| # | Фикс | Impact | Effort | Срок |
|---|---|---|---|---|
| 1 | Заменить в шаблоне блога 94 ссылки на legacy → новые URL (`/`, `/herd-anschliessen-hamburg/`) | 🔴 High | 🟢 Low (find/replace в шаблоне) | День 1 |
| 2 | Batch-отправить 22 «unknown» URL в IndexNow (`backend/indexnow-submit.exe` уже есть) + ручной Request Indexing в GSC для 4 денежных страниц | 🔴 High | 🟢 Low | День 1 |
| 3 | Де-сиротить 6 страниц: ссылки с хабов (`/pages/stadtteile/`, блок Leistungen главной, блог-листинг) + добавить 3 статьи в `/pages/blog/` | 🔴 High | 🟡 Med | Неделя 1 |
| 4 | Главная/harburg: ссылки на заглушки → прямые URL (`/backofen-anschliessen-hamburg/`, `/kueche-fertigstellen-lassen-hamburg/`) | 🟠 Med | 🟢 Low | День 1 |
| 5 | `git rm --cached backend/data/*.json`, вынести backend из Pages-корня | 🟠 Med (риск DSGVO) | 🟢 Low | Неделя 1 |
| 6 | Шаблоны: `href="index.html"` → `/`, `pages/blog/index.html` → `pages/blog/` | 🟡 Low-Med | 🟢 Low | Неделя 1 |
| 7 | `will-change: transform` для `.hero::after` (css/style.css:214) — страховка CLS | 🟡 Low-Med | 🟢 Low | Неделя 1 |
| 8 | Актуализировать `lastmod` в sitemap (главная: 2026-04-23 → факт) | 🟡 Low | 🟢 Low | Неделя 1 |
| 9 | Дифференцировать контент 7 «Crawled — not indexed» страниц (уникальные локальные блоки: PLZ-детали, кейсы района) | 🟠 Med | 🔴 High | Недели 2–4 |
| 10 | Усилить ссылки на `/pages/ueber-uns.html` и `/pages/garantie-und-service.html` (футер сайтвайд) | 🟡 Low-Med | 🟢 Low | Неделя 2 |
| 11 | `BlogPosting`-схема на все статьи блога | 🟡 Low | 🟡 Med | Недели 3–4 |
| 12 | Решить судьбу `/pages/stadtteile/hamburg-mitte.html` (индексируема, 1 ссылка, нет в sitemap): добавить в sitemap или canonical на `/kuechenmontage-hamburg-mitte.html` | 🟡 Low | 🟢 Low | Неделя 2 |

## 30-дневный roadmap

**Неделя 1 — Quick wins (фиксы 1, 2, 4–8):** правки шаблонов ссылок, IndexNow-батч, безопасность backend, CLS-страховка, sitemap-гигиена. Ожидание: Google начинает обнаруживать 22 unknown-URL.

**Неделя 2 — Перелинковка (фиксы 3, 10, 12):** де-сиротение, блог-листинг, trust-страницы в футер. Контрольная точка: повторная URL-инспекция 22 unknown → цель ≥50% перешли в Discovered/Crawled.

**Недели 3–4 — Контент и схема (фиксы 9, 11):** уникализация 7 «crawled — not indexed» страниц (по 2–3 в неделю), BlogPosting-разметка. День 30: полный повторный прогон инспекции по sitemap; цель — **≥100/118 в индексе** (сейчас 88), и отчёт-сравнение до/после.

---

## Верификация топ-5 находок (по требованию — против live-сайта)

1. **94 legacy-ссылки из блога** — подтверждено: `curl` живой страницы `myhammer-erfahrungen.html` показывает `href="../services/kuechenmontage-hamburg.html"` и `…herd-anschliessen-hamburg.html`. ✅
2. **6 сирот sitemap** — подтверждено дважды: live-crawl (0 входящих) + grep по локальному репозиторию (0 `href`). ✅
3. **22 URL unknown to Google** — подтверждено свежей URL Inspection API от 02.07.2026 (не кэш; `last_crawl_time=None`). ✅
4. **Публичный доступ к `/backend/data/*.json`** — подтверждено live (HTTP 200, содержимое получено; сейчас только тестовая запись). ✅
5. **CLS 0.227 на Stadtteil-шаблоне — НЕ подтверждено стабильно:** воспроизвелось в 1 из 2 прогонов Lighthouse (второй прогон CLS = 0). Оставлено в отчёте как нестабильная находка с дешёвой страховкой (#7); полевых данных CrUX для окончательного вердикта нет. ⚠️

*Не удалось проверить:* реальные полевые CWV (нет CrUX API-ключа и, вероятно, порога трафика), причину статуса «Page with redirect» у `waschmaschine-anschliessen-wandsbek.html` (данные Google от 07.04, сейчас страница отдаёт 200 — вероятно, устаревший вердикт, обновится после переобхода).
