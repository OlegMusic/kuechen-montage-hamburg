# SEO-вставки (точный немецкий) — kuechen-montage-hamburg.de

Рабочий файл для ревью. Здесь готовые немецкие тексты для всех 10 страниц аудита
+ план статей для форумов. **Ничего ещё не вставлено в HTML** — после твоего «Y/N»
по каждому блоку вношу в файлы.

Правила, по которым всё написано:
- Тон: формальный **Sie**, минимум эмодзи, прозрачность по Festpreis.
- **Без «Meisterbetrieb»** в self-описании (юр-риск). Вместо: 18 Jahre Erfahrung / Fachmann / Monteur / Profi.
- Title ≤58, Meta description ≤155 символов (разделитель `·`).
- Синонимы — естественно в прозе/FAQ/заголовках, **ключ страницы остаётся доминирующим** (без переспама).
- Цены — по эталону главной (1A): Waschmaschine ab 60€, Geschirrspüler/Spülmaschine ab 139€,
  Herd/Backofen ab 89€, Dunstabzugshaube ab 89€, Spüle ab 149€, Wasseranschluss ab 149€. Küchenmontage ab 350€ (районы) не трогаем.

> ⚠️ **Дубликаты страниц.** Районные есть в 2 версиях: корневые (`/altona.html` и т.д. — на них ссылался аудит)
> и `pages/stadtteile/*.html` (другие title/desc). Цены и FAQ применять к **обеим** версиям,
> иначе будет расхождение. (Отдельно стоит проверить canonical между ними — потенциальный duplicate content, вне этой задачи.)

---

## C0 — Банк синонимов по услугам (вплетать в прозу/FAQ/H2, не списком-стаффингом)

- **Waschmaschine:** Waschmaschine anschließen lassen Hamburg · Waschmaschinenanschluss · Waschmaschine aufstellen und anschließen · Aquastop-, Zulauf- & Ablaufschlauch montieren.
- **Spülmaschine / Geschirrspüler:** Geschirrspüler anschließen Hamburg · Spülmaschine anschließen lassen · Geschirrspüler installieren / einbauen · Aquastop-Schlauch.
- **Herd / Kochfeld:** Herd anschließen · Elektroherd anschließen · Ceranfeld / Induktionskochfeld anschließen · Starkstrom-/400V-Anschluss · Klemmenbelegung.
- **Dunstabzugshaube** (стандартный термин; «Durchzughaube» — только как тег/синоним): Dunstabzugshaube anschließen / montieren Hamburg · Abzugshaube installieren · Umluft-/Ablufthaube · Dunstabzug austauschen.
- **Wasserhahn / Armatur:** Wasserhahn austauschen · Küchenarmatur wechseln · Spültischarmatur montieren · Nieder-/Hochdruck-Armatur · Mischbatterie.
- **Küchenspüle:** Küchenspüle montieren / einbauen · Spüle austauschen · Einbau-/Unterbauspüle · Spülenmontage · Ausschnitt & Abdichtung.
- **IKEA / Küche:** IKEA Küchenmontage Hamburg · METOD / ENHET aufbauen lassen · IKEA Küche montieren · Küchenzeile aufbauen.

---

## C1 — Title A/B-кандидаты ≤58 (ключ в начале; менять ТОЛЬКО после замера в GSC)

| Страница | Сейчас (длина) | A/B-кандидат ≤58 (длина) |
|---|---|---|
| index | 74 | `Küchenmontage Hamburg ab 60€ · Same-Day vom Profi` (49) |
| pages/stadtteile/ | 80 | `Küchenmontage Hamburg · alle Stadtteile & Bezirke` (49) |
| pages/ratgeber/ | 87 | `Küche & Sanitär selbst anschließen · DIY-Ratgeber` (49) |
| pages/blog/ | 83 | **оставить** (брендовый/сравнительный хук) |
| altona.html | 75 (дубль «Küchenmontage») | `Küchenmontage Altona · Geräteanschluss ab 60€` (45) |
| eimsbuettel.html | 78 | `Küchenmonteur Eimsbüttel · Altbau & Geräteanschluss` (51) |
| wandsbek.html | 75 (дубль) | `Küchenmontage Wandsbek · Geräteanschluss ab 60€` (47) |
| bergedorf.html | 53 ✓ | опц. `Küchenmontage Bergedorf · Geräteanschluss ab 60€` (49) |
| harburg.html | 55 ✓ | опц. `Küchenmontage Harburg · Geräteanschluss & Festpreis` (51) |
| kuechenspuele-montage-hamburg/ | 70 | **оставить** (сильный) / опц. `Küchenspüle Hamburg ab 149€ · Einbau & Austausch` (48) |

---

## C2 — Meta description ≤155 (готовые строки на замену)

**index.html** *(было 161)*
```
Küchenmontage Hamburg ab 170€: IKEA-Aufbau, Spülmaschine ab 139€, Waschmaschine ab 60€, Herd ab 89€. Festpreis, Same-Day, 18 Jahre Erfahrung.
```

**pages/stadtteile/index.html** *(было 174)*
```
Küchenmontage & Geräteanschluss in allen Hamburger Stadtteilen — Altona, Eimsbüttel, Wandsbek, Bergedorf, Harburg u. v. m. Festpreis, Same-Day.
```

**pages/ratgeber/index.html** *(было 179)*
```
Ratgeber für Küche & Sanitär: Waschmaschine & Spülmaschine anschließen, Eckventil & Spüle wechseln, Abfluss frei, Küchenmontage-Kosten erklärt.
```

**pages/blog/index.html** *(было 200)*
```
Handwerkerportale 2026 ehrlich verglichen: CHECK24, MyHammer, Blauarbeit & Kleinanzeigen — Kosten und was sich für Kunden in Hamburg lohnt.
```

**eimsbuettel.html** *(было 171)*
```
Küchenmonteur Eimsbüttel: Altbau-Küchen, Geräteanschluss & Reparatur rund um die Osterstraße. Festpreis ab 60€, Same-Day-Service in Hamburg.
```

**altona.html** *(было 149, чистим «Tel: WhatsApp:»)*
```
Küchenmontage & Geräteanschluss in Hamburg-Altona — Ottensen, Große Bergstraße, Altona-Nord. Waschmaschine ab 60€, Festpreis, Same-Day.
```

**wandsbek.html** *(было 133, добавляем цену+триггер)*
```
Küchenmontage & Geräteanschluss in Hamburg-Wandsbek rund um Marktstraße & Quarree. Festpreis ab 60€, Same-Day-Service vom Fachmann.
```

**bergedorf.html** *(было 147, ок — лёгкая шлифовка)*
```
Küchenmonteur in Hamburg-Bergedorf — Sachsentor bis Neuallermöhe. Einbau, Geräteanschluss, Reparatur. Festpreis ab 60€, Same-Day-Service.
```

**harburg.html** *(148 — под лимитом, можно оставить как есть)*

**kuechenspuele-montage-hamburg/** *(158 — чуть выше 155, лёгкая обрезка)*
```
Küchenspüle montieren & austauschen in Hamburg ab 149€ Festpreis. Silgranit oder Edelstahl, alle Stadtteile, Same-Day, 5 Jahre Garantie.
```

> Перед вставкой каждую строку прогоню через подсчёт символов (цель ≤155).

---

## C3 — FAQ-блоки для районных (altona, eimsbuettel, wandsbek, bergedorf)

Разметка переиспользует существующий CSS `details.q` (`css/leistung-redesign.css`).
Под каждым FAQ — `FAQPage` JSON-LD (шаблон в конце C3).

### Altona
```html
<section class="faq" aria-label="Häufige Fragen Küchenmontage Altona">
  <h2>Häufige Fragen — Küchenmontage & Geräteanschluss in Altona</h2>

  <details class="q">
    <summary>Was kostet die Küchenmontage in Altona?<span class="plus"></span></summary>
    <div class="a">Eine einfache Küchenzeile montieren wir ab 350€ Festpreis. Einzelne
    Geräte sind günstiger: Waschmaschine anschließen ab 60€, Geschirrspüler ab 139€,
    Herd ab 89€. Die Anfahrt innerhalb Altonas ist im Festpreis enthalten.</div>
  </details>

  <details class="q">
    <summary>Gibt es Aufpreis für Altbauwohnungen in Ottensen?<span class="plus"></span></summary>
    <div class="a">Nein. Auch bei schiefen Wänden, engen Treppenhäusern und schmalen
    Altbauküchen rund um die Große Bergstraße gilt der vereinbarte Festpreis.
    Möglichen Mehraufwand klären wir vorher transparent.</div>
  </details>

  <details class="q">
    <summary>Kommen Sie auch nach Altona-Nord und Bahrenfeld?<span class="plus"></span></summary>
    <div class="a">Ja. Wir sind in ganz Altona unterwegs — von Ottensen über
    Altona-Altstadt bis Altona-Nord und Bahrenfeld, ohne Aufpreis je Lage.</div>
  </details>

  <details class="q">
    <summary>Ist ein Same-Day-Termin in Altona möglich?<span class="plus"></span></summary>
    <div class="a">Häufig ja. Wer vormittags per WhatsApp anfragt, bekommt den
    Geräteanschluss oder kleinere Montagen oft noch am selben Tag.</div>
  </details>
</section>
```

### Eimsbüttel
```html
<section class="faq" aria-label="Häufige Fragen Eimsbüttel">
  <h2>Häufige Fragen — Küchenmonteur in Eimsbüttel</h2>

  <details class="q">
    <summary>Was kostet der Geräteanschluss in Eimsbüttel?<span class="plus"></span></summary>
    <div class="a">Waschmaschine anschließen ab 60€, Geschirrspüler ab 139€, Herd ab 89€,
    Dunstabzugshaube ab 89€ — jeweils Festpreis inkl. Anfahrt rund um Osterstraße
    und Eimsbütteler Chaussee.</div>
  </details>

  <details class="q">
    <summary>Arbeiten Sie auch in Altbauten ohne gerade Wände?<span class="plus"></span></summary>
    <div class="a">Ja, das ist in Eimsbüttel unser Alltag. In den Altbauten rund um
    Osterstraße und Hoheluft gleichen wir schiefe Wände millimetergenau aus —
    der Festpreis bleibt.</div>
  </details>

  <details class="q">
    <summary>Kommen Sie auch ohne Aufzug in höhere Etagen?<span class="plus"></span></summary>
    <div class="a">Ja. Wir tragen Küche und Geräte auch ohne Aufzug in die Altbau-Etagen
    rund um Lutterothstraße und Stellingen.</div>
  </details>

  <details class="q">
    <summary>Ist Same-Day-Service in Eimsbüttel möglich?<span class="plus"></span></summary>
    <div class="a">Bei früher WhatsApp-Anfrage meist machbar — besonders für
    Waschmaschine, Spülmaschine oder einen Armaturenwechsel.</div>
  </details>
</section>
```

### Wandsbek
```html
<section class="faq" aria-label="Häufige Fragen Wandsbek">
  <h2>Häufige Fragen — Küchenmontage in Wandsbek</h2>

  <details class="q">
    <summary>Was kostet Küchenmontage in Wandsbek?<span class="plus"></span></summary>
    <div class="a">Eine einfache Küchenzeile ab 350€, Geräte einzeln günstiger:
    Waschmaschine ab 60€, Geschirrspüler ab 139€, Herd ab 89€. Festpreis inkl. Anfahrt
    rund um die Wandsbeker Marktstraße.</div>
  </details>

  <details class="q">
    <summary>Montieren Sie in Altbau und Neubau?<span class="plus"></span></summary>
    <div class="a">Ja. Wandsbek mischt Altbau und Neubau — beides ist für uns Routine,
    vom Quarree bis zu den Wohnanlagen am Eichtalpark.</div>
  </details>

  <details class="q">
    <summary>Bedienen Sie den ganzen Bezirk Wandsbek?<span class="plus"></span></summary>
    <div class="a">Ja, den kompletten Bezirk — ohne Aufpreis je Lage.</div>
  </details>

  <details class="q">
    <summary>Same-Day-Termin in Wandsbek möglich?<span class="plus"></span></summary>
    <div class="a">Oft ja: WhatsApp-Anfrage am Vormittag, Termin am selben Tag.</div>
  </details>
</section>
```

### Bergedorf
```html
<section class="faq" aria-label="Häufige Fragen Bergedorf">
  <h2>Häufige Fragen — Küchenmonteur in Bergedorf</h2>

  <details class="q">
    <summary>Was kostet die Montage in Bergedorf?<span class="plus"></span></summary>
    <div class="a">Einfache Küchenzeile ab 350€, Waschmaschine anschließen ab 60€,
    Geschirrspüler ab 139€, Herd ab 89€ — Festpreis inkl. Anfahrt vom Sachsentor
    bis Neuallermöhe.</div>
  </details>

  <details class="q">
    <summary>Kommen Sie auch nach Allermöhe und Lohbrügge?<span class="plus"></span></summary>
    <div class="a">Ja. Wir sind in ganz Bergedorf unterwegs — Sachsentor, Lohbrügge,
    Allermöhe und Neuallermöhe, ohne Aufpreis je Lage.</div>
  </details>

  <details class="q">
    <summary>Montieren Sie große Familienküchen mit Kochinsel?<span class="plus"></span></summary>
    <div class="a">Ja. In den Reihen- und Familienhäusern rund um Bergedorf bauen wir
    regelmäßig größere Küchen mit Kochinsel und Hauswirtschaftsraum.</div>
  </details>

  <details class="q">
    <summary>Ist die Anfahrt inklusive?<span class="plus"></span></summary>
    <div class="a">Ja, die Anfahrt innerhalb Bergedorfs ist im Festpreis enthalten.</div>
  </details>
</section>
```

### FAQPage JSON-LD — шаблон (заполнить вопросами/ответами той же страницы)
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "ВОПРОС",
      "acceptedAnswer": { "@type": "Answer", "text": "ОТВЕТ (тот же текст, что в <details>)" }
    }
  ]
}
</script>
```
> Для **harburg.html** FAQ-текст уже есть — нужен только этот JSON-LD по существующим вопросам.

---

## C4 — Блок «Was ist im Festpreis enthalten?» (главная + районные, где нет)

```html
<section aria-label="Leistungsumfang Festpreis">
  <h2>Was ist im Festpreis enthalten?</h2>
  <ul>
    <li>Anfahrt innerhalb Hamburgs</li>
    <li>Fachgerechte Montage oder Anschluss</li>
    <li>Dichtigkeits- und Funktionsprüfung</li>
    <li>Kurze Einweisung nach Abschluss</li>
    <li>Sauberes Arbeiten ohne versteckte Zusatzkosten</li>
  </ul>
</section>
```

---

## C5 — Internal links в теле (altona/eimsbuettel/wandsbek/bergedorf — сейчас только футер)

Вставить 2–3 контекстные ссылки в существующий текст. Образцы предложений:

```html
<p>Am häufigsten gefragt sind bei uns der
<a href="/waschmaschine-anschliessen-hamburg/">Waschmaschinenanschluss in Hamburg</a>,
das <a href="/geschirrspueler-anschliessen-hamburg/">Anschließen des Geschirrspülers</a>
sowie die <a href="/kuechenspuele-montage-hamburg/">Küchenspülen-Montage</a>.</p>

<p>Planen Sie eine neue Küche, übernehmen wir auch die komplette
<a href="/">IKEA Küchenmontage</a> und den
<a href="/dunstabzugshaube-austauschen-hamburg/">Anschluss der Dunstabzugshaube</a>.</p>
```
> Анкоры подбирать под смысл района (Altbau → Wasseranschluss/Eckventil; Familienhäuser → Komplettmontage).

---

## C6 — Блок «Beliebte Leistungen» для pages/stadtteile/

```html
<section aria-label="Beliebte Leistungen in allen Stadtteilen">
  <h2>Beliebte Leistungen in allen Hamburger Stadtteilen</h2>
  <ul>
    <li><a href="/waschmaschine-anschliessen-hamburg/">Waschmaschine anschließen</a></li>
    <li><a href="/geschirrspueler-anschliessen-hamburg/">Spülmaschine anschließen</a></li>
    <li><a href="/elektroherd-anschliessen-hamburg/">Herd anschließen</a></li>
    <li><a href="/">IKEA Küchenmontage</a></li>
    <li><a href="/armatur-austauschen-hamburg/">Wasserhahn austauschen</a></li>
    <li><a href="/kuechenspuele-montage-hamburg/">Küchenspüle montieren</a></li>
    <li><a href="/dunstabzugshaube-austauschen-hamburg/">Dunstabzugshaube anschließen</a></li>
  </ul>
</section>
```

---

## D — План статей для форумов (ключ → тема → целевая страница → анкор)

| # | Ключ | Тема статьи (DE) | Целевая страница | Анкор (варьировать!) |
|---|---|---|---|---|
| 1 | Waschmaschine anschließen Anleitung | Schritt-für-Schritt + wann Profi nötig | `/waschmaschine-anschliessen-hamburg/` | «Waschmaschine anschließen in Hamburg» / голый URL |
| 2 | Spülmaschine anschließen Kosten | Was kostet, was wird gebraucht (Aquastop) | `/geschirrspueler-anschliessen-hamburg/` | бренд + partial («Geschirrspüler anschließen») |
| 3 | Eckventil austauschen | DIY + Risiken, Hanf vs Teflon | `/y-stueck-wasserzulauf-installieren-hamburg/` | «Eckventil & Wasserzulauf» |
| 4 | Welche Küchenspüle (Edelstahl/Silgranit/Keramik) | Material-Vergleich + Einbau | `/kuechenspuele-montage-hamburg/` | «Küchenspüle montieren lassen» |
| 5 | Dunstabzugshaube Abluft vs Umluft | Vergleich + Anschluss/Austausch | `/pages/services/dunstabzugshaube-austauschen-hamburg.html` | «Dunstabzugshaube anschließen» |
| 6 | IKEA Küche selbst aufbauen oder montieren lassen? | Entscheidungshilfe, METOD/ENHET | `/` (IKEA-Sektion) | бренд («Küchenmontage Hamburg») |
| 7 | Herd anschließen Starkstrom 400V | Sicherheit, wann Elektriker Pflicht | `/elektroherd-anschliessen-hamburg/` | partial («Elektroherd anschließen») |
| 8 | Küchenmontage Kosten Hamburg | Preisübersicht + Rechner | `/` (Kostenrechner) | бренд |

**Стратегия линкбилдинга (риски):**
- Форумные ссылки часто `nofollow` и легко скатываются в спам → пиши посты с **реальной пользой**, ссылка как «вот так делал/проверял», не как реклама.
- **Варьируй анкоры:** брендовый + голый URL + partial-match. НЕ повторять exact-match на всех форумах (footprint).
- Релевантные DE-площадки: gutefrage.net, haustechnikdialog.de, hausgarten.net, wer-weiss-was.de, IKEA-Fans, Reddit r/de_EDV нет — лучше r/Hamburg / r/Heimwerken.
- Каждая статья пусть **полезна сама по себе** (DIY-польза), ссылка на сервис — в контексте «когда лучше позвать профи в Гамбурге».

---

## E — Тех-фиксы (низкий риск)
1. `"@context":"https://schema.org"` в JSON-LD: `wandsbek.html`, `bergedorf.html`, `harburg.html` (+ их `pages/stadtteile/` версии — проверить).
2. Убрать дубль `Küchenmontage` в футере: `altona`, `wandsbek`, `bergedorf` — один линк перенаправить на иную услугу (напр. «Geräteanschluss»).
3. `FAQPage` JSON-LD на `harburg.html` (FAQ-текст уже есть).
