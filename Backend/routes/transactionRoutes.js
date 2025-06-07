const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

const auth = require('../middlewares/auth');
const { check } = require('express-validator');

// Get all transactions with filters
router.get(
  '/',
  auth,
  [
    check('startDate', 'Invalid start date').optional().isDate(),
    check('endDate', 'Invalid end date').optional().isDate(),
    check('category', 'Invalid category').optional().isString(),
    check('type', 'Type must be income or expense').optional().isIn(['income', 'expense']),
    check('limit', 'Limit must be a number').optional().isInt(),
    check('page', 'Page must be a number').optional().isInt()
  ],
  transactionController.getTransactions  // Make sure this is a function
);
console.log('transactionController:', transactionController);


// Get transaction categories
router.get('/categories', auth, transactionController.getCategories);  // Make sure this is a function

// Create new transaction
router.post(
  '/',
  auth,
  [
    check('amount', 'Amount is required and must be positive').isFloat({ min: 0.01 }),
    check('category', 'Category is required').notEmpty(),
    check('type', 'Type must be income or expense').isIn(['income', 'expense']),
    check('date', 'Invalid date').optional().isDate()
  ],
  transactionController.createTransaction  // Make sure this is a function
);

// Get single transaction
router.get('/:id', auth, transactionController.getTransaction);  // Make sure this is a function

// Update transaction
router.put(
  '/:id',
  auth,
  [
    check('amount', 'Amount must be positive').optional().isFloat({ min: 0.01 }),
    check('category', 'Category cannot be empty').optional().notEmpty(),
    check('type', 'Type must be income or expense').optional().isIn(['income', 'expense']),
    check('date', 'Invalid date').optional().isDate()
  ],
  transactionController.updateTransaction  // Make sure this is a function
);

// Delete transaction
router.delete('/:id', auth, transactionController.deleteTransaction);  // Make sure this is a function

module.exports = router;