const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { check } = require('express-validator');
const auth = require('../middlewares/auth');

router.post(
  '/register',
  [
    check('username', 'Username is required').notEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be 6+ characters').isLength({ min: 6 })
  ],
  authController.register
);

router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  authController.login
);


router.get('/me', auth, authController.getProfile);
router.put('/update', auth, authController.updateProfile);

module.exports = router;