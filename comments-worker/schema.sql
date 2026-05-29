-- D1 schema for blog comments (Handwerkerportal-Erfahrungen)
CREATE TABLE IF NOT EXISTS comments (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  nick        TEXT NOT NULL,
  text        TEXT NOT NULL,
  platform    TEXT,                                   -- MyHammer / CHECK24 Profis / Blauarbeit / Kleinanzeigen / Sonstige
  page        TEXT,                                   -- URL the comment was posted from
  ip          TEXT,                                   -- commenter IP (DSGVO: retention-limited, see worker)
  country     TEXT,                                   -- cf.country
  city        TEXT,                                   -- cf.city
  user_agent  TEXT,
  created_at  TEXT DEFAULT (datetime('now')),
  status      TEXT DEFAULT 'visible'                  -- visible | hidden
);
CREATE INDEX IF NOT EXISTS idx_comments_created ON comments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_ip_time ON comments(ip, created_at);
