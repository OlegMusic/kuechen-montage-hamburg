# Blog-Kommentare — Cloudflare Worker + D1

Anonyme Kommentare (Nick + Text) für den Blog, mit Herkunfts-Logging (IP/Land/Stadt)
und Moderation. Daten liegen in **deiner** Cloudflare-D1-DB (kein Drittanbieter).

## Einmal-Setup

```bash
# 1. Cloudflare CLI installieren (einmalig)
npm install -g wrangler

# 2. Einloggen (öffnet Browser)
wrangler login

cd "C:/Users/prusi/Desktop/3. Проекты/kuechen-montage-hamburg/comments-worker"

# 3. D1-Datenbank anlegen
wrangler d1 create kuechen-comments
#   → gibt eine database_id aus. Diese in wrangler.toml bei database_id einfügen.

# 4. Schema einspielen
wrangler d1 execute kuechen-comments --remote --file=schema.sql

# 5. Admin-Schlüssel setzen (Passwort für die Moderations-Seite)
wrangler secret put ADMIN_KEY
#   → ein langes Passwort eingeben und merken.

# 6. Deployen
wrangler deploy
#   → gibt die Worker-URL aus, z.B. https://kuechen-comments.DEINNAME.workers.dev
```

## Nach dem Deploy

1. Die Worker-URL kopieren.
2. In `pages/blog/index.html` die Konstante `COMMENTS_API` (oben im Kommentar-Script)
   auf diese URL setzen, committen + pushen.
3. Moderation öffnen: `https://kuechen-comments.DEINNAME.workers.dev/admin?key=DEIN_ADMIN_KEY`
   → Tabelle mit allen Kommentaren inkl. IP/Land/Stadt, je Zeile ein „löschen"-Button.

## API

| Methode | Pfad | Zweck |
|---|---|---|
| GET  | `/comments?page=<url>` | Sichtbare Kommentare (ohne IP) |
| POST | `/comments` | Neuen Kommentar speichern |
| GET  | `/admin?key=…` | Moderations-Tabelle (HTML) |
| POST | `/admin/delete?key=…` | Kommentar ausblenden |
| POST | `/admin/purge?key=…` | IPs > 60 Tage löschen (DSGVO) |

## Schutz
- **Honeypot** (`website`-Feld): Bots ausgefiltert.
- **Rate-Limit**: max. 5 Kommentare pro IP / Stunde.
- **Moderation**: Kommentare erscheinen sofort, können per Admin gelöscht werden (Status `hidden`).

## DSGVO
- IP/Land/Stadt werden zur Missbrauchs-Erkennung gespeichert.
- `/admin/purge` löscht IPs nach 60 Tagen (manuell oder per Cron-Trigger aufrufbar).
- Datenschutzerklärung enthält einen Passus zu Kommentar-Daten (siehe pages/datenschutz.html).
