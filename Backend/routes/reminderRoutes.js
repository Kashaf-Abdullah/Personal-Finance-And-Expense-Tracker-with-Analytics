// const express = require('express');
// const router = express.Router();
// const {
//   saveSubscription,
//   addReminder,
//   deleteReminder
// } = require('../controllers/reminderController');

// router.post('/subscribe', saveSubscription);
// router.post('/', addReminder);
// router.delete('/:id', deleteReminder);

// module.exports = router;


// const express = require('express');
// const router = express.Router();
// const auth = require('../middlewares/auth');
// const {
//   saveSubscription,
//   addReminder,
//   getReminders,
//   deleteReminder,
//   editReminder,
// } = require('../controllers/reminderController');
// const User = require('../models/User');

// // In your reminderRoutes.js
// router.post('/subscriptions/verify', auth, async (req, res) => {
//   try {
//     const { endpoint } = req.body;
//     const user = await User.findOne({
//       _id: req.user.id,
//       'pushSubscription.endpoint': endpoint
//     });
    
//     res.json({ valid: !!user });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // In your reminderRoutes.js
// router.post('/subscribe', auth, async (req, res) => {
//   try {
//     const { subscription } = req.body;
//     if (!subscription || !subscription.endpoint) {
//       return res.status(400).json({ error: 'Invalid subscription object' });
//     }

//     await User.findByIdAndUpdate(req.user._id, { pushSubscription: subscription });
//     res.json({ success: true });
//   } catch (error) {
//     console.error('Failed to save subscription:', error);
//     res.status(500).json({ error: 'Server error saving subscription' });
//   }
// });



// // router.post('/subscribe', auth, saveSubscription);
// router.post('/', auth, addReminder);
// router.get('/', auth, getReminders);
// router.delete('/:id', auth, deleteReminder);
// router.put('/:id', auth, editReminder);
// // Testing endpoint
// router.get('/test-notification', auth, async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id);
//     if (!user.pushSubscription) {
//       return res.status(400).json({ error: 'No subscription found' });
//     }
//     const payload = JSON.stringify({
//       title: 'Test Notification',
//       body: 'This is a test notification',
//       icon: '/logo192.png',
//     });
//     await webpush.sendNotification(user.pushSubscription, payload);
//     res.json({ success: true });
//   } catch (error) {
//     console.error('Notification send failed:', error);
//     res.status(500).json({ error: 'Failed to send notification' });
//   }
// });



// module.exports = router;

const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const {
  saveSubscription,
  addReminder,
  getReminders,
  deleteReminder,
  editReminder,
} = require('../controllers/reminderController');

router.post('/subscribe', auth, saveSubscription);

router.post('/', auth, addReminder);
router.get('/', auth, getReminders);
router.delete('/:id', auth, deleteReminder);
router.put('/:id', auth, editReminder);

module.exports = router;
