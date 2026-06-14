// ═══════════════════════════════════════════════════
//  Al-Bayoumiyya Ahmadiyya — Backend Server
//  Node.js + Express + NeDB
// ═══════════════════════════════════════════════════
'use strict';

const express = require('express');
const cors    = require('cors');
const path    = require('path');
const fs      = require('fs');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ─────────────────────────────────────
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve frontend (static files)
app.use(express.static(path.join(__dirname, '../frontend')));

// ── Routes ─────────────────────────────────────────
app.use('/api/auth',     require('./routes/auth'));
app.use('/api/awrad',    require('./routes/awrad'));
app.use('/api/audio',    require('./routes/audio'));
app.use('/api/videos',   require('./routes/videos'));
app.use('/api/dalail',   require('./routes/dalail'));
app.use('/api/settings', require('./routes/settings'));

// ── SPA Fallback — all non-API routes → frontend ──
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
  } else {
    res.status(404).json({ error: 'Not found' });
  }
});

// ── Start ──────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`
  ╔═══════════════════════════════════════╗
  ║  البيومية الأحمدية — Server Running  ║
  ║  http://localhost:${PORT}                ║
  ║  Admin: http://localhost:${PORT}/admin   ║
  ╚═══════════════════════════════════════╝
  `);
});

module.exports = app;
