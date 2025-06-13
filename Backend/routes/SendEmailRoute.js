// routes/sendEmail.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const nodemailer = require('nodemailer');

const upload = multer();

router.post('/send-email', upload.single('file'), async (req, res) => {
  const { email, message } = req.body;
  const file = req.file;

  if (!email || !file) return res.status(400).json({ success: false, error: 'Email and file required' });

  // Configure transporter (use your SMTP details)
  const transporter = nodemailer.createTransport({
    service: 'gmail', // or your SMTP
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: 'Finance App Exported File',
      text: message || 'Please find the attached file.',
      attachments: [
        {
          filename: file.originalname,
          content: file.buffer,
        },
      ],
    });
    res.json({ success: true });
  } catch (err) {
    console.error('Email send error:', err);
    res.status(500).json({ success: false, error: 'Failed to send email' });
  }
});

module.exports = router;
