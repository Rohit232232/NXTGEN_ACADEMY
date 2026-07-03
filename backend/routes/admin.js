const express = require('express');
const router = express.Router();
const Submission = require('../models/Submission');

function checkKey(req, res, next) {
  const key = req.query.key || req.headers['x-admin-key'];
  if (!process.env.ADMIN_KEY || key !== process.env.ADMIN_KEY) {
    return res.status(401).json({ ok: false, error: 'Unauthorized.' });
  }
  next();
}

// GET /api/admin/submissions?key=YOUR_ADMIN_KEY
router.get('/submissions', checkKey, async (req, res, next) => {
  try {
    const rows = await Submission.find().sort({ createdAt: -1 });
    res.json({ ok: true, count: rows.length, submissions: rows });
  } catch (err) {
    next(err);
  }
});

module.exports = router;