# GSC-Baseline — Cluster Küchenfronten / IKEA / Kühlschrank

**Snapshot-Datum:** 2026-06-22 (Tag des Deploys der Cluster-Verstärkung).
**Zweck:** Baseline VOR Wirkung der Inhalts-/Link-Verstärkung. In 2–4 Wochen mit denselben Queries vergleichen.
**Datenfenster:** GSC Search Analytics, Ende 2026-06-20 (GSC-Lag ~2–3 Tage).
**Quelle:** Service-Account `~/.gcp/kuechen-montage-gsc.json`, `sc-domain:kuechen-montage-hamburg.de`.

## Seiten-Totale

| Seite | 28 Tage | 90 Tage |
|---|---|---|
| `/kuechenfronten-austauschen-hamburg/` | 12 impr · 1 clk · **Pos 11.2** | 12 impr · 1 clk · Pos 11.2 |
| `/pages/services/ikea-kuechenmontage-hamburg.html` | 389 impr · 7 clk · **Pos 18.0** | 472 impr · 10 clk · Pos 19.7 |
| `/kuehlschrank-austauschen-hamburg/` | 18 impr · 0 clk · **Pos 7.7** | 18 impr · 0 clk · Pos 7.7 |

## Top-Queries pro Seite (28 Tage)

### IKEA-Küchenmontage (Haupt-Hebel) — Pos 18.0, 0 Conversions trotz Reichweite
| Query | impr | clk | Pos |
|---|---:|---:|---:|
| ikea küchenmontage hamburg | 43 | 0 | **14.8** |
| küchenmontage hamburg | 43 | 0 | 32.9 |
| ikea montage hamburg | 9 | 0 | 10.9 |
| ikea montageservice hamburg | 9 | 0 | 17.4 |
| ikea aufbauservice hamburg | 4 | 0 | 32.0 |
| ikea zuschnitt service | 4 | 0 | 23.8 |
| ikea küche montage preis | 3 | 0 | 20.3 |
| was kostet die montage von ikea-holz-arbeitsplatten? | 2 | 0 | 11.0 |

### Küchenfronten austauschen — Pos 11.2 (geringe Nachfrage)
| Query | impr | clk | Pos |
|---|---:|---:|---:|
| küchenfronten erneuern in der nähe | 3 | 0 | 3.7 |
| was kosten neue küchenfronten | 1 | 0 | 65.0 |

### Einbaukühlschrank austauschen — Pos 7.7 (bereits Top-10)
| Query | impr | clk | Pos |
|---|---:|---:|---:|
| einbaukühlschrank tauschen | 3 | 0 | 9.0 |

## Cluster-Präsenz gesamt (90 Tage, Referenz)
fronten=5 impr · ikea=413 impr · kühlschrank=14 impr · garantie=0 · scharnier/tür=0 · arbeitsplatte=103 · brands(Nobilia/Nolte/Häcker)=1.

## Ziel-Queries für „Nachher"-Vergleich (jetzt ~0)
`ikea faktum garantie fronten`, `ikea faktum fronten nachkaufen`, `metod garantie`, `küchenfronten austauschen`, `was kostet küchenmontage ikea`, `kühlschrank front austauschen`, `einbaukühlschrank austauschen`.

## Wichtigster Hebel
`ikea küchenmontage hamburg` = **43 impr, Pos 14.8, 0 Klicks** → von Seite 2 in die Top-8 schieben = erste echte Klicks. Maßnahme: interne Links (Homepage + Cluster) mit Anker „IKEA Küchenmontage Hamburg", frischer Content (heute deployed), Reindex anfordern.
