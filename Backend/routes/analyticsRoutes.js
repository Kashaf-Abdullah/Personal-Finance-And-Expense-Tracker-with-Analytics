const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const  auth  = require('../middlewares/auth');

// Get financial summary
router.get('/summary', auth, analyticsController.getSummary);

// Get category-wise analytics
router.get('/category', auth, analyticsController.getCategoryAnalytics);

// Get income vs expense trends
router.get('/trends', auth, analyticsController.getTrends);

// Get income vs expense comparison
router.get('/income-vs-expense', auth, analyticsController.getIncomeVsExpense);
// router.get('/test-transactions', auth,analyticsController.test)
module.exports = router;