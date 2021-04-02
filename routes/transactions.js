const express = require('express');
const advancedResults = require('../middleware/advancedResults');

const { protect } = require('../middleware/auth');
const {
  getTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  approveTransaction,
  // approveDebtTransactions,
  // approveAllTransactions,
} = require('../controllers/transactions');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(protect, getTransactions)
  .post(protect, createTransaction);

// router.route('/approve').get(protect, approveDebtTransactions);

router
  .route('/:id')
  .get(protect, getTransaction)
  .put(protect, updateTransaction)
  .delete(protect, deleteTransaction);

router.get('/:id/approve', protect, approveTransaction);

module.exports = router;
