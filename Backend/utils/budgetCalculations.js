const moment = require('moment-timezone');
const Transaction = require('../models/Transaction');

const getBudgetDateRange = (period = 'monthly', timezone = 'UTC', now = moment.tz(timezone)) => {
  const unit = period === 'weekly' ? 'isoWeek' : period === 'yearly' ? 'year' : 'month';
  const start = moment(now).tz(timezone).startOf(unit);

  return {
    $gte: start.toDate(),
    $lt: start.clone().add(1, unit).toDate()
  };
};

const getBudgetSpending = async (userId, category, period, timezone) => {
  const totals = await Transaction.aggregate([
    {
      $match: {
        userId,
        category,
        type: 'expense',
        date: getBudgetDateRange(period, timezone)
      }
    },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);

  return totals[0]?.total || 0;
};

const refreshBudgetSpending = async (budgets, timezone = 'UTC') => Promise.all(
  budgets.map(async budget => {
    budget.currentSpent = await getBudgetSpending(
      budget.userId,
      budget.category,
      budget.period,
      timezone
    );
    await budget.save();
    return budget;
  })
);

module.exports = {
  getBudgetDateRange,
  getBudgetSpending,
  refreshBudgetSpending
};
