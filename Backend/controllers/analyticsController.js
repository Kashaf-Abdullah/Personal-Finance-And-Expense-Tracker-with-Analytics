const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');
const moment = require('moment-timezone');

// Helper function to create ObjectId
const getObjectId = (id) => new mongoose.Types.ObjectId(id);

// @desc    Get financial summary
// @route   GET /api/analytics/summary
// @access  Private
const getSummary = async (req, res) => {
  try {
    const currentMonthStart = moment().startOf('month').utc().toDate();
    const currentMonthEnd = moment().endOf('month').utc().toDate();
    const lastMonthStart = moment().subtract(1, 'month').startOf('month').utc().toDate();
    const lastMonthEnd = moment().subtract(1, 'month').endOf('month').utc().toDate();
    const userId = new mongoose.Types.ObjectId(req.user._id);

    const [currentMonthData, lastMonthData] = await Promise.all([
      Transaction.aggregate([
        { $match: { userId, date: { $gte: currentMonthStart, $lte: currentMonthEnd } } },
        { $group: { _id: '$type', total: { $sum: '$amount' } } }
      ]),
      Transaction.aggregate([
        { $match: { userId, date: { $gte: lastMonthStart, $lte: lastMonthEnd } } },
        { $group: { _id: '$type', total: { $sum: '$amount' } } }
      ])
    ]);

    const currentIncome = currentMonthData.find(d => d._id === 'income')?.total || 0;
    const currentExpense = currentMonthData.find(d => d._id === 'expense')?.total || 0;
    const lastIncome = lastMonthData.find(d => d._id === 'income')?.total || 0;
    const lastExpense = lastMonthData.find(d => d._id === 'expense')?.total || 0;

    const incomeTrend = lastIncome > 0 
      ? ((currentIncome - lastIncome) / lastIncome) * 100 
      : currentIncome > 0 ? 100 : 0;
    const expenseTrend = lastExpense > 0 
      ? ((currentExpense - lastExpense) / lastExpense) * 100 
      : currentExpense > 0 ? 100 : 0;

    const currentBalance = currentIncome - currentExpense;
    const lastBalance = lastIncome - lastExpense;
    const balanceTrend = lastBalance !== 0 
      ? ((currentBalance - lastBalance) / Math.abs(lastBalance)) * 100 
      : currentBalance !== 0 ? (currentBalance > 0 ? 100 : -100) : 0;

    res.json({
      success: true,
      data: {
        totalIncome: currentIncome,
        totalExpense: currentExpense,
        balance: currentBalance,
        incomeTrend: Math.round(incomeTrend),
        expenseTrend: Math.round(expenseTrend),
        balanceTrend: Math.round(balanceTrend)
      }
    });
  } catch (err) {
    console.error('Summary error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};


// @desc    Get category-wise analytics
// @route   GET /api/analytics/category
// @access  Private
const getCategoryAnalytics = async (req, res, next) => {
  try {
    const timezone = req.user.timezone || 'UTC';
    const currentMonthStart = moment().tz(timezone).startOf('month').toDate();
    const currentMonthEnd = moment().tz(timezone).endOf('month').toDate();
    const userId = getObjectId(req.user._id);

    const categoryData = await Transaction.aggregate([
      { 
        $match: { 
          userId, 
          type: 'expense',
          date: { $gte: currentMonthStart, $lte: currentMonthEnd } 
        } 
      },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
      { $sort: { total: -1 } },
      { $limit: 10 } // Limit to top 10 categories
    ]);

    // Add other categories with 0 if they exist in budgets but no transactions
    const budgetCategories = await Budget.distinct('category', { userId });
    const existingCategories = categoryData.map(d => d._id);
    
    const missingCategories = budgetCategories.filter(
      cat => !existingCategories.includes(cat)
    ).map(cat => ({ _id: cat, total: 0 }));

    const allCategories = [...categoryData, ...missingCategories];

    res.json({
      success: true,
      data: {
        labels: allCategories.map(d => d._id),
        values: allCategories.map(d => d.total)
      }
    });
  } catch (err) {
    console.error('Category analytics error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// @desc    Get income vs expense trends
// @route   GET /api/analytics/trends
// @access  Private
const getTrends = async (req, res, next) => {
  try {
    const timezone = req.user.timezone || 'UTC';
    const sixMonthsAgo = moment().tz(timezone).subtract(5, 'months').startOf('month').toDate();
    const now = moment().tz(timezone).endOf('month').toDate();
    const userId = getObjectId(req.user._id);

    const monthlyData = await Transaction.aggregate([
      { 
        $match: { 
          userId, 
          date: { $gte: sixMonthsAgo, $lte: now } 
        } 
      },
      { 
        $group: { 
          _id: {
            month: { $month: '$date' },
            year: { $year: '$date' },
            type: '$type'
          },
          total: { $sum: '$amount' } 
        } 
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const months = [];
    const incomeData = [];
    const expenseData = [];

    for (let i = 0; i < 6; i++) {
      const date = moment().tz(timezone).subtract(5 - i, 'months');
      months.push(date.format('MMM YYYY'));

      const month = date.month() + 1;
      const year = date.year();

      const income = monthlyData.find(d => 
        d._id.month === month && d._id.year === year && d._id.type === 'income'
      )?.total || 0;
      
      const expense = monthlyData.find(d => 
        d._id.month === month && d._id.year === year && d._id.type === 'expense'
      )?.total || 0;

      incomeData.push(income);
      expenseData.push(expense);
    }

    res.json({
      success: true,
      data: {
        labels: months,
        income: incomeData,
        expense: expenseData
      }
    });
  } catch (err) {
    console.error('Trends error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// @desc    Get income vs expense comparison
// @route   GET /api/analytics/income-vs-expense
// @access  Private
const getIncomeVsExpense = async (req, res, next) => {
  try {
    const timezone = req.user.timezone || 'UTC';
    const currentYearStart = moment().tz(timezone).startOf('year').toDate();
    const currentYearEnd = moment().tz(timezone).endOf('year').toDate();
    const userId = getObjectId(req.user._id);

    const yearlyData = await Transaction.aggregate([
      { 
        $match: { 
          userId, 
          date: { $gte: currentYearStart, $lte: currentYearEnd } 
        } 
      },
      { $group: { _id: '$type', total: { $sum: '$amount' } } }
    ]);

    const income = yearlyData.find(d => d._id === 'income')?.total || 0;
    const expense = yearlyData.find(d => d._id === 'expense')?.total || 0;
    const savings = income - expense;
    const savingsPercentage = income > 0 ? Math.round((savings / income) * 100) : 0;

    res.json({
      success: true,
      data: {
        income,
        expense,
        savings,
        savingsPercentage,
        expensePercentage: income > 0 ? Math.round((expense / income) * 100) : 0
      }
    });
  } catch (err) {
    console.error('Income vs expense error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

module.exports = {
  getSummary,
  getCategoryAnalytics,
  getTrends,
  getIncomeVsExpense
};