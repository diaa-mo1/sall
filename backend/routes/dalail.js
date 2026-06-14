'use strict';
const router = require('express').Router();
const multer = require('multer');
const path   = require('path');
const fs     = require('fs');
const db     = require('../database');
const auth   = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const d = path.join(__dirname, '../uploads/audio');
    fs.mkdirSync(d, { recursive: true });
    cb(null, d);
  },
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

router.get('/', async (req, res) => {
  try { res.json(await db.find('dalail', {}, { order: 1 })); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/:number', async (req, res) => {
  try {
    const item = await db.findOne('dalail', { number: parseInt(req.params.number) });
    if (!item) return res.status(404).json({ error: 'الحزب غير موجود' });
    res.json(item);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/:number', auth, upload.single('audioFile'), async (req, res) => {
  try {
    const num = parseInt(req.params.number);
    const u = { ...req.body, updatedAt: new Date().toISOString() };
    if (req.file) u.audioFile = `/uploads/audio/${req.file.filename}`;
    res.json(await db.update('dalail', { number: num }, u));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
