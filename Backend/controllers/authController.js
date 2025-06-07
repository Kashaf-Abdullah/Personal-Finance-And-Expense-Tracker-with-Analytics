const User = require('../models/User');
const jwt = require('jsonwebtoken');
// const { sendEmail } = require('../utils/sendEmail');
const { sendWelcomeEmail } = require('../utils/sendEmail');
const createToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ username, email, password });
    const token = createToken(user._id);
await sendWelcomeEmail(user)
    // Send welcome email
    // await sendEmail({
    //   email: user.email,
    //   subject: 'Welcome to Finance Tracker',
    //   message: `Hi ${user.username}, welcome to our finance tracking app!`
    // });

    res.status(201).json({ 
      _id: user._id,
      username: user.username,
      email: user.email,
      token 
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = createToken(user._id);
    res.json({ 
      _id: user._id,
      username: user.username,
      email: user.email,
      token 
    });
  } catch (err) {
    next(err);
  }
};



exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      req.body,
      { new: true, runValidators: true }
    ).select('-password');
    
    res.json(user);
  } catch (err) {
    next(err);
  }
};