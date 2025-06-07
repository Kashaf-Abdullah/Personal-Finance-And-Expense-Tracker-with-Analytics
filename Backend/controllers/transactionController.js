const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');
// const { sendEmail } = require('../utils/sendEmail');

// @desc    Get all transactions
// @route   GET /api/transactions
// @access  Private
exports.getTransactions = async (req, res, next) => {
  try {
    const { startDate, endDate, category, type, limit, page } = req.query;
    
    // Build query object
    const query = { userId: req.user._id };
    if (category) query.category = category;
    if (type) query.type = type;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    // Pagination
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    const transactions = await Transaction.find(query)
      .sort('-date')
      .skip(skip)
      .limit(limitNumber);

    const count = await Transaction.countDocuments(query);

    res.json({
      success: true,
      count,
      page: pageNumber,
      pages: Math.ceil(count / limitNumber),
      data: transactions
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get transaction categories
// @route   GET /api/transactions/categories
// @access  Private
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Transaction.distinct('category', { userId: req.user._id });
    res.json({
      success: true,
      data: categories.concat(['Food', 'Transport', 'Housing', 'Entertainment', 'Healthcare', 'Education', 'Other'])
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create transaction
// @route   POST /api/transactions
// @access  Private
exports.createTransaction = async (req, res, next) => {
  try {
    const { amount, description, date, category, type, paymentMethod } = req.body;
    
    const transaction = await Transaction.create({
      userId: req.user._id,
      amount,
      description,
      date: date || Date.now(),
      category,
      type,
      paymentMethod
    });

    // Update budget if expense
    if (type === 'expense') {
      await Budget.findOneAndUpdate(
        { userId: req.user._id, category },
        { $inc: { currentSpent: amount } },
        { new: true }
      );
    }

    res.status(201).json({
      success: true,
      data: transaction
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single transaction
// @route   GET /api/transactions/:id
// @access  Private
exports.getTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: 'Transaction not found'
      });
    }

    res.json({
      success: true,
      data: transaction
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update transaction
// @route   PUT /api/transactions/:id
// @access  Private
exports.updateTransaction = async (req, res, next) => {
  try {
    let transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: 'Transaction not found'
      });
    }

    // Store original amount for budget adjustment
    const originalAmount = transaction.amount;
    const originalType = transaction.type;
    const originalCategory = transaction.category;

    // Update transaction
    transaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    // Update budgets if amount or category changed
    if (req.body.amount || req.body.category || req.body.type) {
      // If it was expense before, subtract original amount
      if (originalType === 'expense') {
        await Budget.findOneAndUpdate(
          { userId: req.user._id, category: originalCategory },
          { $inc: { currentSpent: -originalAmount } }
        );
      }

      // If it's expense now, add new amount
      if (transaction.type === 'expense') {
        await Budget.findOneAndUpdate(
          { userId: req.user._id, category: transaction.category },
          { $inc: { currentSpent: transaction.amount } },
          { upsert: true }
        );
      }
    }

    res.json({
      success: true,
      data: transaction
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
// @access  Private
exports.deleteTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: 'Transaction not found'
      });
    }

    // If expense, subtract from budget
    if (transaction.type === 'expense') {
      await Budget.findOneAndUpdate(
        { userId: req.user._id, category: transaction.category },
        { $inc: { currentSpent: -transaction.amount } }
      );
    }

    await transaction.remove();

    res.json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};