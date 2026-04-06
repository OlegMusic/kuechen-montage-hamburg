const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3001;
const DATA_DIR = path.join(__dirname, 'data');
const SIGNUPS_FILE = path.join(DATA_DIR, 'signups.json');
const VOTES_FILE = path.join(DATA_DIR, 'votes.json');
const STORIES_FILE = path.join(DATA_DIR, 'stories.json');

// Init data files
if (!fs.existsSync(SIGNUPS_FILE)) fs.writeFileSync(SIGNUPS_FILE, '[]');
if (!fs.existsSync(VOTES_FILE)) fs.writeFileSync(VOTES_FILE, '{"ja":47,"nein":3}');
if (!fs.existsSync(STORIES_FILE)) fs.writeFileSync(STORIES_FILE, '[]');

function readJSON(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function json(res, data, status) {
  cors(res);
  res.writeHead(status || 200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

function parseBody(req) {
  return new Promise(function(resolve) {
    var body = '';
    req.on('data', function(chunk) { body += chunk; });
    req.on('end', function() {
      try { resolve(JSON.parse(body)); }
      catch(e) { resolve({}); }
    });
  });
}

const server = http.createServer(async function(req, res) {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    cors(res);
    res.writeHead(204);
    res.end();
    return;
  }

  var url = req.url;

  // === GET /api/stats ===
  if (url === '/api/stats' && req.method === 'GET') {
    var signups = readJSON(SIGNUPS_FILE);
    var votes = readJSON(VOTES_FILE);
    var stories = readJSON(STORIES_FILE);
    var total = votes.ja + votes.nein;
    return json(res, {
      signups: signups.length,
      votes: votes,
      voteTotal: total,
      votePct: total > 0 ? Math.round(votes.ja / total * 100) : 0,
      stories: stories.length
    });
  }

  // === POST /api/signup ===
  if (url === '/api/signup' && req.method === 'POST') {
    var data = await parseBody(req);
    if (!data.email) return json(res, { error: 'Email fehlt' }, 400);

    var signups = readJSON(SIGNUPS_FILE);

    // Check duplicate
    var exists = signups.some(function(s) { return s.email === data.email; });
    if (exists) return json(res, { error: 'Email bereits registriert', count: signups.length }, 409);

    signups.push({
      email: data.email,
      role: data.role || '',
      trade: data.trade || '',
      city: data.city || '',
      date: new Date().toISOString()
    });
    writeJSON(SIGNUPS_FILE, signups);

    console.log('[SIGNUP]', data.email, data.role, data.city);
    return json(res, { success: true, count: signups.length });
  }

  // === POST /api/vote ===
  if (url === '/api/vote' && req.method === 'POST') {
    var data = await parseBody(req);
    if (data.choice !== 'ja' && data.choice !== 'nein') {
      return json(res, { error: 'Ungültige Stimme' }, 400);
    }

    var votes = readJSON(VOTES_FILE);
    votes[data.choice]++;
    writeJSON(VOTES_FILE, votes);

    var total = votes.ja + votes.nein;
    console.log('[VOTE]', data.choice, '| Ja:', votes.ja, 'Nein:', votes.nein);
    return json(res, {
      success: true,
      votes: votes,
      total: total,
      pct: Math.round(votes.ja / total * 100)
    });
  }

  // === POST /api/story ===
  if (url === '/api/story' && req.method === 'POST') {
    var data = await parseBody(req);
    if (!data.text) return json(res, { error: 'Text fehlt' }, 400);

    var stories = readJSON(STORIES_FILE);
    stories.push({
      text: data.text.substring(0, 2000),
      portal: data.portal || '',
      trade: data.trade || '',
      date: new Date().toISOString()
    });
    writeJSON(STORIES_FILE, stories);

    console.log('[STORY]', data.portal, '|', data.text.substring(0, 60) + '...');
    return json(res, { success: true, count: stories.length });
  }

  // === GET /api/stories ===
  if (url === '/api/stories' && req.method === 'GET') {
    var stories = readJSON(STORIES_FILE);
    // Return last 20, newest first
    var recent = stories.slice(-20).reverse();
    return json(res, recent);
  }

  // === GET /api/export (admin) ===
  if (url === '/api/export' && req.method === 'GET') {
    var signups = readJSON(SIGNUPS_FILE);
    var csv = 'Email;Rolle;Gewerk;Stadt;Datum\n';
    signups.forEach(function(s) {
      csv += [s.email, s.role, s.trade, s.city, s.date].join(';') + '\n';
    });
    cors(res);
    res.writeHead(200, {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename=signups.csv'
    });
    res.end(csv);
    return;
  }

  // 404
  json(res, { error: 'Not found' }, 404);
});

server.listen(PORT, function() {
  console.log('');
  console.log('=================================');
  console.log('  Backend läuft auf Port ' + PORT);
  console.log('  http://localhost:' + PORT);
  console.log('=================================');
  console.log('');
  console.log('Endpoints:');
  console.log('  POST /api/signup   — Neue Anmeldung');
  console.log('  POST /api/vote     — Stimme abgeben');
  console.log('  POST /api/story    — Geschichte teilen');
  console.log('  GET  /api/stats    — Statistiken');
  console.log('  GET  /api/stories  — Geschichten lesen');
  console.log('  GET  /api/export   — CSV Export');
  console.log('');
});
