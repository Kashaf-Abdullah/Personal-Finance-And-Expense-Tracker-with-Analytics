const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  description: { type: String },
  date: { type: Date, default: Date.now },
  category: { type: String, required: true },
  type: { type: String, enum: ['income', 'expense'], required: true },
  paymentMethod: { type: String, enum: ['cash', 'card', 'upi', 'other'], default: 'other' }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);