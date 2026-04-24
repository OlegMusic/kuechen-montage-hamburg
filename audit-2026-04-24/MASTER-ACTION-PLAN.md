# SEO Audit — Master Action Plan (2026-04-24)

**Сайт:** kuechen-montage-hamburg.de (Küchenmontage, Hamburg, SAB)
**Метод:** claude-seo v1.9 + 4 параллельных субагента (GSC, Technical, Schema+Content, Local)

---

## 🚨 P0 — СДЕЛАТЬ В 24 ЧАСА

### 1. VERIFY: потеряна ли pos 4 на главной
**Симптом:** home в 28d avg pos = 15.5 (было pos 4 с FAQ-сниппетом). Надо сравнить 90d, иначе можем гоняться за тенями.
**Action:** запустить GSC comparison 90d vs 28d на `/`

### 2. Убрать streetAddress из LocalBusiness на главной
**Симптом:** `Bossardstr. 12` в JSON-LD на `/index.html` + в 5 футерах. Для SAB это нарушение — Google помечает как "misrepresentation".
**Action:** оставить только `addressLocality: Hamburg`, `postalCode: 21...` (primary service area PLZ); streetAddress держать только в Impressum.

### 3. Добавить AggregateRating в home JSON-LD (4.7★ CHECK24)
**Симптом:** 13+ видимых отзывов CHECK24 4.7★, но в JSON-LD на главной AggregateRating отсутствует (хотя на 27 других страницах есть 4.9/19). Это рассогласование + упускаем rich-snippet на главной.
**Action:** добавить `AggregateRating` в LocalBusiness-nod главной с актуальными числами, привязать через `@id`.

### 4. Убрать `www.` из canonical
**Симптом:** `/pages/services/wasserhahn-austauschen-hamburg.html` имеет `canonical=https://www...`, когда сайт apex.
**Action:** одна строка — замена www→apex.

### 5. Opening hours мismatch
**Симптом:** home = `Sa ... 16:00`, Stadtteile = `Sa ... 20:00`.
**Action:** выбрать одно время (рекомендую 16:00 как реалистичнее) и применить ко всем 22 stadtteile-шаблонам.

### 6. HTTPS Enforce
**Симптом:** `http://` не редиректит на HTTPS (setting off в GitHub Pages).
**Action:** GitHub → Settings → Pages → "Enforce HTTPS" (один клик). Требует ручного действия.

---

## 🔥 P1 — СДЕЛАТЬ ЗА 7 ДНЕЙ

### 7. Canonical strategy — 6 пар дублей (РЕШЕНИЕ ПОЛЬЗОВАТЕЛЯ)

| Пара | Google выбрал | Наш canonical |
|---|---|---|
| `/altona.html` vs `/pages/stadtteile/altona.html` | root | root (ok) |
| `/wandsbek.html` vs `/pages/stadtteile/wandsbek.html` | root | root (ok) |
| `/bergedorf.html` vs `/pages/stadtteile/bergedorf.html` | root | split |
| `/kuechenmontage-hamburg-mitte.html` vs `/pages/stadtteile/hamburg-mitte.html` | root | split |
| `/harburg.html` vs `/pages/stadtteile/harburg.html` | root | ⚠ `/harburg.html` это 11KB уникальный overview — не удалять |
| `/wasserhahn-harburg.html` vs `/pages/services/wasserhahn-austauschen-hamburg.html` | root | mismatch |

**Варианты (выбрать одно):**
- **A** — 301 редирект старых `/pages/` на root-короткие (нужен сервер с rewrite, GitHub Pages ❌)
- **B** — инвертировать canonical: short URL канонический, nested → `noindex,follow`. **RECOMMENDED** (GH-совместимо, минимум риска)
- **C** — оставить как есть (Google уже выбрал). Минус: отчёты расходятся.

### 8. Разрешить кannibalization "küchenmontage hamburg" — 8 URL конкурируют
**Урл-симптом:** main keyword pos 22.1 (91 impr, низко), потому что 8 URL делят intent. Нужен один явный hub + перелинковка от остальных.
**Action:** назначить `/pages/services/kuechenmontage-hamburg.html` как pillar hub, остальные 7 URL — внутренней ссылкой на него + слегка переписать H1/title чтобы не совпадали.

### 9. Title/Meta rewrite (5 URL с 0 CTR при pos 3-10)
- `/waschmaschine-hamburg-nord.html` — pos 3.3, 49 impr, 0 clicks
- `/pages/blog/check24-profis-erfahrungen-nachteile.html` — pos 10.4, 52 impr, 0 clicks
- `/pages/services/herd-anschliessen-hamburg.html`
- `/pages/blog/index.html`
- (5-й из GSC-ANALYSIS.md)

### 10. Fix Waschmaschine-hub каннибализация
**Симптом:** `/waschmaschine-hamburg-nord.html` vs `/pages/services/waschmaschine-anschliessen-hamburg.html` vs новый `/waschmaschine-anschliessen-hamburg/` — три URL на один intent.
**Decision needed:** какой основной? Рекомендация: `/waschmaschine-anschliessen-hamburg/` (короткий URL). Остальные → 301/canonical на него.

### 11. Add hero images к 3 коммерческим landing'ам без фото
- `/waschmaschine-anschliessen-hamburg/`
- `/kuechenspuele-montage-hamburg/`
- `/pages/services/ikea-kuechenmontage-hamburg.html`

### 12. Добавить `tel:` href рядом с `wa.me`
**Симптом:** 0 `tel:` на всём сайте — для SAB это нормально, но тоже даёт local signal + accessibility.

### 13. LocalBusiness consolidation через `@id`
27 страниц с AggregateRating 4.9/19 повторяют данные. Лучше: канонический `LocalBusiness` с `@id="https://kuechen-montage-hamburg.de/#business"` на главной, на остальных — ссылка через `@id`.

---

## 📋 P2 — 30 ДНЕЙ

### 14. HowTo rich results — per-step images
9 ратгебер имеют полный HowTo (steps + totalTime + supply + tool) но **ни один** не имеет `image` в шагах. Без картинки шага — нет HowTo rich result в SERP.

### 15. Meisterbetrieb/Handwerkskammer trust block site-wide
**Симптом:** 0 страниц упоминают "Meisterbetrieb", "Handwerkskammer" — только на 6 (blog + Impressum). Для Handwerk это критичный E-E-A-T сигнал.
**Action:** добавить footer-блок "Eingetragen in der Handwerkskammer Hamburg · Meisterbetrieb".

### 16. 10 новых Stadtteile (недостающие)
Rotherbaum, Altona-Altstadt, Hamm, Niendorf, Lokstedt, Volksdorf, Sasel, Lurup, Osdorf, Marienthal

### 17. Upgrade LocalBusiness → HomeAndConstructionBusiness
Более специфичный @type → Google лучше понимает вертикаль.

### 18. Internal linking: 13 ратгебер → money pages
Из каждой статьи `/montage-und-installation/*` CTA-блок на коммерческий landing.

### 19. /harburg.html longform extension
Это уже 11KB overview — можно нарастить до 2500+ слов (districts, Ikea Moorburg, конкретные проекты).

---

## 📊 Состояние сайта (на 24 апр 2026)

| Метрика | Значение |
|---|---|
| HTML-страниц | 109 |
| URL в sitemap | 96 |
| Проиндексировано (API real) | 45 |
| Google не знает (надо submit) | 47 |
| Canonical mismatch pairs | 6 |
| JSON-LD парс-ошибок | 0 |
| Страниц с LocalBusiness | 88 (все с reduced stub) |
| Страниц с FAQPage | 55 |
| Страниц с HowTo | 9 (без per-step images) |
| Уникальность Stadtteile | max Jaccard 0.05 — отличная |
| NAP-конфликтов | 0 |
| Telefon (+4915218547875) mention | 284 |
| Email mention | 278 (все info@) |
| GSC 28d: clicks / impr / CTR | 37 / 2357 / 1.57% |

---

## 🎯 Celebration — что работает

- **Top-3 результаты:** 33 запроса в pos 1–3 (нужно только починить snippet для CTR)
- **NAP consistency** — идеальная
- **Stadtteile content** — реально уникальные (не boilerplate)
- **Schema technical** — 0 parse ошибок
- **Brand dominance** — "Küchen-Montage Hamburg" 485× vs "Küchenmontage" 33× — consistent

---

## Детали по субаудитам

- `GSC-ANALYSIS.md` — query/page breakdown, cannibalization, quick wins
- `TECHNICAL-AUDIT.md` — canonicals (6 пар), HTTPS, headers, hreflang
- `SCHEMA-CONTENT-AUDIT.md` — JSON-LD по всем 109, E-E-A-T, images
- `LOCAL-SEO-AUDIT.md` — NAP, SAB violation, Stadtteile, GBP-readiness
- `schema-home.jsonld`, `schema-service-template.jsonld` — готовые шаблоны к вставке
