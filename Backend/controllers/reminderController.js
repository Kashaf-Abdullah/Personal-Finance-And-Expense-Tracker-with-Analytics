
const Reminder = require('../models/Reminder');
const User = require('../models/User');

// Save push subscription
const saveSubscription = async (req, res) => {
  try {
    const { subscription } = req.body;
    if (!subscription || !subscription.endpoint) {
      return res.status(400).json({ error: 'Invalid subscription object' });
    }
    await User.findByIdAndUpdate(req.user._id, { pushSubscription: subscription });
    res.json({ success: true });
  } catch (error) {
    console.error('Subscription saving error:', error);
    res.status(500).json({ error: 'Failed to save subscription' });
  }
};

// 
// Add reminder
const addReminder = async (req, res) => {
  try {
    const { name, date } = req.body;
    if (!name || !date) return res.status(400).json({ error: 'Name and date required' });

    const reminder = new Reminder({ userId: req.user._id, name, date });
    await reminder.save();
    res.status(201).json({ success: true, reminder });
  } catch (error) {
    console.error('Add reminder error:', error);
    res.status(500).json({ error: 'Failed to add reminder' });
  }
};

// Get reminders
const getReminders = async (req, res) => {
  try {
    const reminders = await Reminder.find({ userId: req.user._id }).sort({ date: 1 });
    res.json(reminders);
  } catch (error) {
    console.error('Get reminders error:', error);
    res.status(500).json({ error: 'Failed to get reminders' });
  }
};

// Delete reminder
const deleteReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!reminder) return res.status(404).json({ error: 'Reminder not found' });
    res.json({ success: true });
  } catch (error) {
    console.error('Delete reminder error:', error);
    res.status(500).json({ error: 'Failed to delete reminder' });
  }
};

// Edit reminder
const editReminder = async (req, res) => {
  try {
    const { name, date } = req.body;
    const reminder = await Reminder.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { name, date },
      { new: true }
    );
    if (!reminder) return res.status(404).json({ error: 'Reminder not found' });
    res.json({ success: true, reminder });
  } catch (error) {
    console.error('Edit reminder error:', error);
    res.status(500).json({ error: 'Failed to edit reminder' });
  }
};

// Send reminders notifications (used in cron job)
const sendReminders = async (webpush) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const users = await User.find({ 'pushSubscription.endpoint': { $exists: true } });

    for (const user of users) {
      const reminders = await Reminder.find({
        userId: user._id,
        date: { $gte: today },
      });

      for (const reminder of reminders) {
        const dueDate = new Date(reminder.date);
        const daysLeft = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

        if (daysLeft <= 7) {
          const body = daysLeft === 0
            ? `${reminder.name} is due today!`
            : daysLeft === 1
              ? `${reminder.name} is due tomorrow!`
              : `${reminder.name} is due in ${daysLeft} days`;

        const payload = JSON.stringify({
  title: `Reminder: ${reminder.name || 'Reminder'}`,
  body: daysLeft === 0
    ? `${reminder.name} is due today!`
    : daysLeft === 1
    ? `${reminder.name} is due tomorrow!`
    : `${reminder.name} is due in ${daysLeft} days`,
  icon: '/logo192.png'
});

        try {
          await webpush.sendNotification(user.pushSubscription, payload);

  // await webpush.sendNotification(user.pushSubscription, JSON.stringify(payload));
  console.log(`Notification sent to ${user.email}`);
} catch (error) {
  console.error(`Failed to send notification to ${user.email}`, error);
  if (error.statusCode === 410 || error.statusCode === 404) {
    // Subscription expired or no longer valid, remove it
    await User.findByIdAndUpdate(user._id, { $unset: { pushSubscription: 1 } });
    console.log(`Removed expired subscription for ${user.email}`);
  }
}

        }
      }
    }
  } catch (error) {
    console.error('sendReminders error:', error);
  }
};

module.exports = {
  saveSubscription,
  addReminder,
  getReminders,
  deleteReminder,
  editReminder,
  sendReminders,
};
