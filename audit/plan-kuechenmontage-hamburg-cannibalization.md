# План: устранить каннибализацию «küchenmontage hamburg» (14 URL)

Данные GSC (18.05–14.06): запрос «küchenmontage hamburg» = 1021 показ, расщеплён на 14 URL.

## Диагноз
| URL | Поз | Показы | Клики | Роль |
|---|---|---|---|---|
| **`/` (главная)** | **6.9** | 221 | **3** | ✅ ЕДИНСТВЕННЫЙ победитель |
| /kuechenmontage-hamburg-mitte.html | 45 | 89 | 0 | дилютор |
| /wandsbek.html | 82 | 87 | 0 | дилютор |
| /pages/stadtteile/ | 82 | 87 | 0 | дилютор |
| /pages/stadtteile/lurup.html | 82 | 84 | 0 | дилютор |
| /harburg.html | 92 | 83 | 0 | дилютор |
| /bergedorf.html | 59 | 81 | 0 | дилютор |
| /altona.html | 80 | 80 | 0 | дилютор |
| /pages/stadtteile/rahlstedt.html | 94 | 74 | 0 | дилютор |
| /pages/galerie.html | 45 | 46 | 0 | дилютор |
| /pages/stadtteile/sasel.html | 35 | 45 | 0 | дилютор |
| /pages/services/ikea-kuechenmontage-hamburg.html | 25 | 19 | 0 | (свой ключ — IKEA) |
| /20357.html | 97 | 13 | 0 | дилютор |
| /pages/services/kuechenmontage-hamburg.html | 4 | 2 | 0 | дилютор (конкурент главной) |

**Критично:** районные НЕ ранжируются по «küchenmontage [район]» — только за head «hamburg» (плохо, p80+, 0 кликов). Значит у них **нет позиции, которую можно потерять** → правки безопасны.

**Принцип фикса:** главная эксклюзивно владеет «küchenmontage hamburg»; районные перенацелить строго на «Küchenmontage [Район]» (убрать из Title/H1 голый «Küchenmontage Hamburg»). Тонкие пустышки — приглушить.

---

## ЭТАП 1 — Районные root-страницы (де-оптимизация head-термина) [низкий риск]
Поменять Title/H1: убрать «Küchenmontage Hamburg», вести с района. Примеры:
| Файл | Было (Title) | Станет |
|---|---|---|
| altona.html | Küchenmontage Altona Hamburg \| Küchenmontage & Geräteanschluss | **Küchenmontage Altona — Monteur vor Ort \| Ottensen & Bahrenfeld** |
| bergedorf.html | Küchenmonteur Bergedorf — Service vor Ort \| Sachsentor | (уже ок — район в начале, оставить/чуть усилить) |
| eimsbuettel.html | Küchenmonteur Eimsbüttel — Service vor Ort \| … | (ок) |
| harburg.html | Küchenmonteur Harburg — alle Leistungen auf einer Seite | (ок) |
| wandsbek.html | Küchenmontage Wandsbek Hamburg \| Küchenmontage & Geräteanschluss | **Küchenmontage Wandsbek — Monteur vor Ort \| Marienthal & Rahlstedt** |
| kuechenmontage-hamburg-mitte.html | Küchenmonteur Hamburg-Mitte — Altbau, Neubau, Büros | (ок, но H1/контент проверить на «Küchenmontage Hamburg») |
+ H1 и первый абзац: вести с «[Район]», head-термин «Hamburg» оставить 1× в подзаголовке, не доминировать.

## ЭТАП 2 — Тонкие stadtteile-страницы (index-bloat, 0 кликов) [решение нужно]
`pages/stadtteile/*` (lurup, rahlstedt, sasel, ottensen, barmbek, volksdorf, eimsbuettel, …): 0 кликов, p35–94, многие 0 показов.
**Опции (выбрать):**
- **A. Де-оптимизировать Title** как Этап 1 (вести с района) — мягко, оставляем индексируемыми.
- **B. noindex слабых** (0 кликов, p80+) — решительно убирает дилюцию; но у части есть показы (не 0/0), формально против прежнего «только 0/0».
- **C. Гибрид:** де-оптимизировать те, что с показами; noindex те, что 0/0.

## ЭТАП 3 — Сервис-страница `pages/services/kuechenmontage-hamburg.html` [низкий риск]
Тоже бьётся за «Küchenmontage Hamburg ⭐ Ab 170€» (конкурент главной). Перенацелить на «Küchenmontage **Kosten/Preise/Ablauf** Hamburg» ИЛИ canonical → главная по head-термину. 2 показа → терять нечего.

## ЭТАП 4 — Технический дубль www vs non-www [проверить] 🔴
GSC показывает ОБА: `www.kuechen-montage-hamburg.de/...` (p15.6) И `kuechen-montage-hamburg.de/...` (p4.0) для одной страницы. Это **дубликат хоста** — надо проверить, редиректит ли www→non-www. Если нет — отдельная техническая проблема (canonical везде non-www, но хост-редирект на GitHub Pages/Cloudflare настроить). Это может сильно мешать.

---

## Безопасность (guardrail «не потерять позиции»)
- Главная (единственная с кликами) — НЕ трогаем, она и так p6.9.
- Районные/stadtteile меняем только Title/H1/первый абзац — у них 0 кликов, терять нечего, плюс шанс выиграть «[район]».
- ikea-страница (свой ключ IKEA) — НЕ трогаем.
- Эффект — через переобход Google (дни-недели).

## Рекомендация
Этап 1 + Этап 3 + Этап 4(проверка) сразу (низкий риск). Этап 2 — по варианту **C** (гибрид).
