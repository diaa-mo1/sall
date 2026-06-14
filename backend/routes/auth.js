'use strict';
const router  = require('express').Router();
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const db      = require('../database');
const auth    = require('../middleware/auth');
const SECRET  = process.env.JWT_SECRET || 'bayoumiyya-secret-2024';

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'بيانات ناقصة' });
    const admin = await db.findOne('admins', { username });
    if (!admin) return res.status(401).json({ error: 'بيانات غير صحيحة' });
    const ok = await bcrypt.compare(password, admin.password);
    if (!ok)  return res.status(401).json({ error: 'بيانات غير صحيحة' });
    const token = jwt.sign({ id: admin._id, username: admin.username, name: admin.name }, SECRET, { expiresIn: '7d' });
    res.json({ token, name: admin.name });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET /api/auth/me  (verify token)
router.get('/me', auth, (req, res) => res.json(req.admin));

// PUT /api/auth/password  (change password)
router.put('/password', auth, async (req, res) => {
  try {
    const { current, next: newPass } = req.body;
    const admin = await db.findOne('admins', { _id: req.admin.id });
    const ok = await bcrypt.compare(current, admin.password);
    if (!ok) return res.status(401).json({ error: 'كلمة المرور الحالية غير صحيحة' });
    const hash = await bcrypt.hash(newPass, 10);
    await db.update('admins', { _id: req.admin.id }, { password: hash });
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
