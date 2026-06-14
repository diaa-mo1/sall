'use strict';
const router = require('express').Router();
const db     = require('../database');
const auth   = require('../middleware/auth');

// GET /api/settings/daily-wird  — public
router.get('/daily-wird', async (req, res) => {
  try {
    const setting = await db.findOne('settings', { key: 'daily_wird_id' });
    if (!setting?.value) return res.json(null);
    const wird = await db.findOne('awrad', { slug: setting.value });
    res.json(wird);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// PUT /api/settings/daily-wird  — admin
router.put('/daily-wird', auth, async (req, res) => {
  try {
    const { wirdSlug } = req.body;
    await db.update('settings', { key: 'daily_wird_id' }, { value: wirdSlug });
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET /api/settings/stats  — admin
router.get('/stats', auth, async (req, res) => {
  try {
    const [awrad, audio, videos, dalail] = await Promise.all([
      db.count('awrad', {}),
      db.count('audio', {}),
      db.count('videos', {}),
      db.count('dalail', {}),
    ]);
    res.json({ awrad, audio, videos, dalail });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
