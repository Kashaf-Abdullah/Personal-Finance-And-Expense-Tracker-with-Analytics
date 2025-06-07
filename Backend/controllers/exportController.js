const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');
const { Parser } = require('json2csv'); // npm install json2csv

// Export Transactions as CSV
exports.exportTransactionsCSV = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user._id }).lean();
    if (!transactions.length) return res.status(404).json({ message: 'No transactions found' });

    const fields = ['amount', 'type', 'category', 'date', 'description'];
    const parser = new Parser({ fields });
    const csv = parser.parse(transactions);

    res.header('Content-Type', 'text/csv');
    res.attachment('transactions.csv');
    return res.send(csv);
  } catch (err) {
    console.error('CSV export error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Export Budgets as CSV (if budgets exist)
exports.exportBudgetsCSV = async (req, res) => {
  try {
    const budgets = await Budget.find({ userId: req.user._id }).lean();
    if (!budgets.length) return res.status(404).json({ message: 'No budgets found' });

    const fields = ['category', 'amount', 'month'];
    const parser = new Parser({ fields });
    const csv = parser.parse(budgets);

    res.header('Content-Type', 'text/csv');
    res.attachment('budgets.csv');
    return res.send(csv);
  } catch (err) {
    console.error('CSV export error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
