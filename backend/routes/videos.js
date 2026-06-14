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
    cb(null, file.fieldname === 'thumbnail' ? mkDir('images') : mkDir('video'));
  },
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage, limits: { fileSize: 2000 * 1024 * 1024 } });
const fields = upload.fields([{ name: 'videoFile', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }]);

router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const q = category && category !== 'كل' ? { category } : {};
    res.json(await db.find('videos', q, { order: 1 }));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/:slug', async (req, res) => {
  try {
    const item = await db.findOne('videos', { slug: req.params.slug });
    if (!item) return res.status(404).json({ error: 'الفيديو غير موجود' });
    res.json(item);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/', auth, fields, async (req, res) => {
  try {
    const count = await db.count('videos', {});
    const doc = {
      slug: req.body.slug, title: req.body.title,
      description: req.body.description, category: req.body.category,
      duration: req.body.duration, youtubeId: req.body.youtubeId || null,
      featured: req.body.featured === 'true',
      videoFile: req.files?.videoFile?.[0] ? `/uploads/video/${req.files.videoFile[0].filename}` : null,
      thumbnail: req.files?.thumbnail?.[0]  ? `/uploads/images/${req.files.thumbnail[0].filename}` : null,
      order: count + 1, createdAt: new Date().toISOString()
    };
    res.status(201).json(await db.insert('videos', doc));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/:slug', auth, fields, async (req, res) => {
  try {
    if (!await db.findOne('videos', { slug: req.params.slug })) return res.status(404).json({ error: 'الفيديو غير موجود' });
    const u = { ...req.body, updatedAt: new Date().toISOString() };
    if (req.files?.videoFile?.[0]) u.videoFile = `/uploads/video/${req.files.videoFile[0].filename}`;
    if (req.files?.thumbnail?.[0])  u.thumbnail  = `/uploads/images/${req.files.thumbnail[0].filename}`;
    res.json(await db.update('videos', { slug: req.params.slug }, u));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/:slug', auth, async (req, res) => {
  try {
    const n = await db.remove('videos', { slug: req.params.slug });
    if (!n) return res.status(404).json({ error: 'الفيديو غير موجود' });
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
