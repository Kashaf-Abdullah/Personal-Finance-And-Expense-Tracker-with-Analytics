const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');
// const { sendEmail } = require('../utils/sendEmail');
// const Email = require('../utils/sendEmail');
const { sendBudgetAlertEmail } = require('../utils/sendEmail');


// @desc    Get all budgets
// @route   GET /api/budgets
// @access  Private
exports.getBudgets = async (req, res, next) => {
  try {
    const budgets = await Budget.find({ userId: req.user._id });
    res.json({
      success: true,
      count: budgets.length,
      data: budgets
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get budget status
// @route   GET /api/budgets/status
// @access  Private
exports.getBudgetStatus = async (req, res, next) => {
  try {
    const budgets = await Budget.find({ userId: req.user._id });
    
    // Calculate utilization percentage and check alerts
    const budgetsWithStatus = budgets.map(budget => {
      const utilization = (budget.currentSpent / budget.limit) * 100;
      
      // Check if utilization exceeds 80% and send email alert
    //   if (utilization >= 80 && utilization < 100) {
    //     new Email(req.user).sendBudgetAlert(
    //       Math.round(utilization),
    //       budget.limit,
    //       budget.category
    //     );
    //   }

       // Send email alert if utilization >= 80%
      if (utilization >= 80) {
        sendBudgetAlertEmail(
          req.user, 
          Math.round(utilization), 
          budget.limit, 
          budget.category
        );
      }
      
      return {
        ...budget.toObject(),
        utilization: Math.round(utilization),
        status: utilization >= 100 ? 'Exceeded' : 
               utilization >= 80 ? 'Warning' : 'Good'
      };
    });

    res.json({
      success: true,
      data: budgetsWithStatus
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create budget
// @route   POST /api/budgets
// @access  Private
exports.createBudget = async (req, res, next) => {
  try {
    const { category, limit, period } = req.body;
    
    // Check if budget already exists for this category
    const existingBudget = await Budget.findOne({
      userId: req.user._id,
      category
    });

    if (existingBudget) {
      return res.status(400).json({
        success: false,
        error: 'Budget already exists for this category'
      });
    }

    // Calculate current spent from existing transactions
    const expenses = await Transaction.aggregate([
      {
        $match: {
          userId: req.user._id,
          category,
          type: 'expense'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    const currentSpent = expenses.length > 0 ? expenses[0].total : 0;

    const budget = await Budget.create({
      userId: req.user._id,
      category,
      limit,
      period: period || 'monthly',
      currentSpent
    });

    res.status(201).json({
      success: true,
      data: budget
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single budget
// @route   GET /api/budgets/:id
// @access  Private
exports.getBudget = async (req, res, next) => {
  try {
    const budget = await Budget.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!budget) {
      return res.status(404).json({
        success: false,
        error: 'Budget not found'
      });
    }

    res.json({
      success: true,
      data: budget
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update budget
// @route   PUT /api/budgets/:id
// @access  Private
exports.updateBudget = async (req, res, next) => {
  try {
    let budget = await Budget.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!budget) {
      return res.status(404).json({
        success: false,
        error: 'Budget not found'
      });
    }

    budget = await Budget.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      data: budget
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete budget
// @route   DELETE /api/budgets/:id
// @access  Private
exports.deleteBudget = async (req, res, next) => {
  try {
    const budget = await Budget.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!budget) {
      return res.status(404).json({
        success: false,
        error: 'Budget not found'
      });
    }

   await Budget.deleteOne({ _id: req.params.id, userId: req.user._id });


    res.json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};