const express = require('express');
const router = express.Router();
const { exportTransactionsCSV, exportBudgetsCSV } = require('../controllers/exportController');
const  protect  = require('../middlewares/auth');

// Export all transactions as CSV
router.get('/transactions/csv', protect, exportTransactionsCSV);

// Export all budgets as CSV (if you have budgets)
router.get('/budgets/csv', protect, exportBudgetsCSV);

module.exports = router;
