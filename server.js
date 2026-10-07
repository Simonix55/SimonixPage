// server.js - Simonix HQ Backend Server
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS aktivieren, damit das HTML-Frontend Anfragen senden darf
app.use(cors());
app.use(express.json());

// 1. Health-Check Endpunkt für den Browser-Verifizierer
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ONLINE',
    message: 'Simonix Node.js Server läuft einwandfrei!',
    uptime: Math.floor(process.uptime()) + 's',
    timestamp: new Date().toISOString(),
    channel: '@SimonixWad',
    version: '1.4.0'
  });
});

// 2. Test-Endpunkt für Kanal-Informationen
app.get('/api/stats', (req, res) => {
  res.json({
    channel: 'Simonix',
    subs: 100,
    status: 'Server aktiv & verifiziert'
  });
});

// Server starten
app.listen(PORT, () => {
  console.log(`🚀 Simonix Server läuft auf http://localhost:${PORT}`);
  console.log(`📡 Health-Check verfügbar unter: http://localhost:${PORT}/api/health`);
});