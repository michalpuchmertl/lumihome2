const express = require('express');
const {
  getDebts,
  getDebt,
  createDebt,
  updateDebt,
  deleteDebt,
} = require('../controllers/debts');
const asyncHandler = require('../middleware/async');
const advancedResults = require('../middleware/advancedResults');
const debtsResults = require('../middleware/debtsResults');

const Debt = require('../models/Debt');

const transactionsRouter = require('./transactions');

const router = express.Router({ mergeParams: true });

const { protect } = require('../middleware/auth');

router.use('/:debtId/transactions', transactionsRouter);

router.post('/', createDebt);

// Getting all debts where logged user is debtor
router.get('/expenses', protect, debtsResults('debtor'), getDebts);

// Getting all debts where logged user is creditor
router.get('/incomes', protect, debtsResults('creditor'), getDebts);

router
  .route('/:id')
  .get(protect, getDebt)
  .put(protect, updateDebt)
  .delete(protect, deleteDebt);
module.exports = router;
