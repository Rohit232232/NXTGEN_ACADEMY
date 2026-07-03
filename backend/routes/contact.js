const express = require('express');
const router = express.Router();
const Submission = require('../models/Submission');
const { sendNotification } = require('../mailer');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post('/', async (req, res, next) => {
  try {
    const { name, email, phone, message, website } = req.body || {};

    // Honeypot field: real users never fill this in (it's hidden via CSS).
    // Bots that auto-fill every field will trip it — we pretend to
    // succeed so they don't know they were caught.
    if (website) {
      return res.status(201).json({ ok: true });
    }

    if (!name || !name.trim()) {
      return res.status(400).json({ ok: false, error: 'Name is required.' });
    }
    if (!email || !EMAIL_RE.test(email)) {
      return res.status(400).json({ ok: false, error: 'A valid email is required.' });
    }
    if (name.length > 200 || email.length > 200 || (message || '').length > 4000) {
      return res.status(400).json({ ok: false, error: 'One of the fields is too long.' });
    }

    const submission = await Submission.create({
      type: 'contact',
      name: name.trim(),
      email: email.trim(),
      phone: (phone || '').trim(),
      message: (message || '').trim(),
    });

    // Fire-and-forget: don't make the visitor wait on SMTP, and don't
    // fail the request if the email step has a problem.
    sendNotification({ name, email, phone, message }).catch((err) =>
      console.error('[mailer] notification failed (non-fatal):', err.message)
    );

    res.status(201).json({
      ok: true,
      id: submission._id,
      message: "Thanks — we'll get back to you within 1–2 business days.",
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;