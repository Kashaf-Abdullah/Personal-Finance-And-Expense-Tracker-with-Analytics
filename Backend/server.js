require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const exportRoutes = require('./routes/exportRoutes');
const noteRoutes = require('./routes/noteRoutes');
const sendEmail = require('./routes/SendEmailRoute');
//reminder
const path=require('path')
const bodyParser = require('body-parser');
const cron = require('node-cron');
const webpush = require('web-push');
const reminderRoutes = require('./routes/reminderRoutes');
const { sendReminders } = require('./controllers/reminderController');


// const { errorHandler } = require('./middlewares/error');

const app = express();

// Middlewares

app.use(cors());
app.use(express.json());

// Routes

app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/user',sendEmail)

//reminder

app.use('/api/reminders', reminderRoutes);

// VAPID keys (generate with web-push CLI or online)
const vapidKeys = {
  publicKey: process.env.VAPID_PUBLIC_KEY,
  privateKey: process.env.VAPID_PRIVATE_KEY,
};

webpush.setVapidDetails(
  'mailto:your-email@example.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

app.locals.webpush = webpush;

// Cron job runs daily at 4 PM to send reminders
cron.schedule('18 0 * * *', async () => {
  console.log('Running reminder notifications...');
  try {
    await sendReminders(app.locals.webpush);
  } catch (error) {
    console.error('Cron job error:', error);
  }
});




// Database Connection

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('MongoDB connection error:', err));