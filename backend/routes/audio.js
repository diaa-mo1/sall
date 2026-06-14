'use strict';
const router = require('express').Router();
const multer = require('multer');
const path   = require('path');
const fs     = require('fs');
const db     = require('../database');
const auth   = require('../middleware/auth');

const mkDir = (sub) => { const d = path.join(__dirname, `../uploads/${sub}`); fs.mkdirSync(d, { recursive: true }); return d; };

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = file.fieldname === 'thumbnail' ? mkDir('images') : mkDir('audio');
    cb(null, dir);
  },
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage, limits: { fileSize: 500 * 1024 * 1024 } });
const fields = upload.fields([{ name: 'audioFile', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }]);

// GET /api/audio  — public
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const query = category && category !== 'كل' ? { category } : {};
    const items = await db.find('audio', query, { order: 1 });
    res.json(items);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET /api/audio/:slug  — public
router.get('/:slug', async (req, res) => {
  try {
    const item = await db.findOne('audio', { slug: req.params.slug });
    if (!item) return res.status(404).json({ error: 'المقطع غير موجود' });
    res.json(item);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// POST /api/audio  — admin
router.post('/', auth, fields, async (req, res) => {
  try {
    const count = await db.count('audio', {});
    const doc = {
      slug: req.body.slug, title: req.body.title,
      artist: req.body.artist, category: req.body.category,
      duration: req.body.duration, featured: req.body.featured === 'true',
      audioFile: req.files?.audioFile?.[0] ? `/uploads/audio/${req.files.audioFile[0].filename}` : null,
      thumbnail: req.files?.thumbnail?.[0]  ? `/uploads/images/${req.files.thumbnail[0].filename}` : null,
      order: count + 1, createdAt: new Date().toISOString()
    };
    const created = await db.insert('audio', doc);
    res.status(201).json(created);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// PUT /api/audio/:slug  — admin
router.put('/:slug', auth, fields, async (req, res) => {
  try {
    const existing = await db.findOne('audio', { slug: req.params.slug });
    if (!existing) return res.status(404).json({ error: 'المقطع غير موجود' });
    const updates = { ...req.body, updatedAt: new Date().toISOString() };
    if (req.files?.audioFile?.[0]) updates.audioFile = `/uploads/audio/${req.files.audioFile[0].filename}`;
    if (req.files?.thumbnail?.[0])  updates.thumbnail  = `/uploads/images/${req.files.thumbnail[0].filename}`;
    const updated = await db.update('audio', { slug: req.params.slug }, updates);
    res.json(updated);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// DELETE /api/audio/:slug  — admin
router.delete('/:slug', auth, async (req, res) => {
  try {
    const n = await db.remove('audio', { slug: req.params.slug });
    if (!n) return res.status(404).json({ error: 'المقطع غير موجود' });
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
