'use strict';
const router = require('express').Router();
const multer = require('multer');
const path   = require('path');
const fs     = require('fs');
const db     = require('../database');
const auth   = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../uploads/audio');
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage, limits: { fileSize: 200 * 1024 * 1024 } });

// GET /api/awrad  — public
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const query = category && category !== 'كل' ? { category } : {};
    const items = await db.find('awrad', query, { order: 1 });
    res.json(items);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET /api/awrad/:slug  — public
router.get('/:slug', async (req, res) => {
  try {
    const item = await db.findOne('awrad', { slug: req.params.slug });
    if (!item) return res.status(404).json({ error: 'الورد غير موجود' });
    res.json(item);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// POST /api/awrad  — admin
router.post('/', auth, upload.single('audioFile'), async (req, res) => {
  try {
    const { slug, title, category, description, text, duration } = req.body;
    const count = await db.count('awrad', {});
    const doc = {
      slug, title, category, description, text, duration,
      audioFile: req.file ? `/uploads/audio/${req.file.filename}` : null,
      order: count + 1,
      createdAt: new Date().toISOString()
    };
    const created = await db.insert('awrad', doc);
    res.status(201).json(created);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// PUT /api/awrad/:slug  — admin
router.put('/:slug', auth, upload.single('audioFile'), async (req, res) => {
  try {
    const existing = await db.findOne('awrad', { slug: req.params.slug });
    if (!existing) return res.status(404).json({ error: 'الورد غير موجود' });
    const updates = { ...req.body, updatedAt: new Date().toISOString() };
    if (req.file) updates.audioFile = `/uploads/audio/${req.file.filename}`;
    const updated = await db.update('awrad', { slug: req.params.slug }, updates);
    res.json(updated);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// DELETE /api/awrad/:slug  — admin
router.delete('/:slug', auth, async (req, res) => {
  try {
    const n = await db.remove('awrad', { slug: req.params.slug });
    if (!n) return res.status(404).json({ error: 'الورد غير موجود' });
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
