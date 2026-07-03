require('dotenv').config();

const path = require('path');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const { initDb } = require('./db');
const contactRouter = require('./routes/contact');
const adminRouter = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(helmet({ contentSecurityPolicy: false })); // CSP off so the plain HTML/CSS/JS frontend needs no extra config
app.use(morgan('dev'));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// Serve the static site (index.html, about.html, courses.html, contact.html, style.css, script.js)
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Basic spam/abuse protection on the public form endpoint
const formLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, error: 'Too many submissions from this device. Please try again later.' },
});

app.use('/api/contact', formLimiter, contactRouter);
app.use('/api/admin', adminRouter);

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'nxtgen-academy-backend', time: new Date().toISOString() });
});

// 404 for unmatched API routes
app.use('/api', (req, res) => res.status(404).json({ ok: false, error: 'Not found' }));

// Central error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ ok: false, error: 'Something went wrong. Please try again.' });
});

async function start() {
  try {
    await initDb(); // connects to MongoDB — throws (and exits) if it can't connect
    app.listen(PORT, () => {
      console.log(`NXTGEN ACADEMY backend running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('[startup] Failed to connect to MongoDB:', err.message);
    console.error('Check MONGODB_URI in your .env file.');
    process.exit(1);
  }
}

start();