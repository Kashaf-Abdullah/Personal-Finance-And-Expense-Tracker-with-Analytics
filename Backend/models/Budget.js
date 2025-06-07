const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  limit: {
    type: Number,
    required: true,
    min: 1
  },
  currentSpent: {
    type: Number,
    default: 0,
    min: 0
  },
  month: {
    type: Number,
    default: new Date().getMonth() + 1 // Current month (1-12)
  },
  year: {
    type: Number,
    default: new Date().getFullYear() // Current year
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure one budget per category per user per month
budgetSchema.index(
  { userId: 1, category: 1, month: 1, year: 1 },
  { unique: true }
);

// Method to update spent amount
budgetSchema.statics.updateSpent = async function(userId, category, amount) {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  
  await this.findOneAndUpdate(
    { 
      userId, 
      category, 
      month: currentMonth, 
      year: currentYear 
    },
    { $inc: { currentSpent: amount } },
    { upsert: true, new: true }
  );
};

const Budget = mongoose.model('Budget', budgetSchema);

module.exports = Budget;