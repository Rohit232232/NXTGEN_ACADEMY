const nodemailer = require('nodemailer');

// Email notifications are optional. If SMTP env vars aren't set, the app
// still works fine — submissions are just stored in the database and
// this function becomes a no-op (logged to console instead).
let transporter = null;
if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

async function sendNotification({ name, email, phone, message }) {
  if (!transporter || !process.env.NOTIFY_EMAIL) {
    console.log('[mailer] SMTP not configured — skipping email notification.');
    return;
  }

  await transporter.sendMail({
    from: `"NXTGEN ACADEMY Website" <${process.env.SMTP_USER}>`,
    to: process.env.NOTIFY_EMAIL,
    replyTo: email,
    subject: `New enquiry from ${name}`,
    text: [
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${phone || '—'}`,
      '',
      'Message:',
      message || '—',
    ].join('\n'),
  });
}

module.exports = { sendNotification };