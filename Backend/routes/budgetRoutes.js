const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budgetController');
const  auth  = require('../middlewares/auth');
const { check } = require('express-validator');

// Get all budgets
router.get('/', auth, budgetController.getBudgets);

// Get budget status
router.get('/status', auth, budgetController.getBudgetStatus);

// Create new budget
router.post(
  '/',
  auth,
  [
    check('category', 'Category is required').notEmpty(),
    check('limit', 'Limit is required and must be positive').isFloat({ min: 0.01 }),
    check('period', 'Period must be weekly, monthly or yearly').optional().isIn(['weekly', 'monthly', 'yearly'])
  ],
  budgetController.createBudget
);

// Get single budget
router.get('/:id', auth, budgetController.getBudget);

// Update budget
router.put(
  '/:id',
  auth,
  [
    check('limit', 'Limit must be positive').optional().isFloat({ min: 0.01 }),
    check('period', 'Period must be weekly, monthly or yearly').optional().isIn(['weekly', 'monthly', 'yearly'])
  ],
  budgetController.updateBudget
);

// Delete budget
router.delete('/:id', auth, budgetController.deleteBudget);

module.exports = router;