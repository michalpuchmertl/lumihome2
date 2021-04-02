const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

const Transaction = require('../models/Transaction');
const Debt = require('../models/Debt');

// @desc    Get all transactions in debt
// @route   GET /api/v1/debts/:debtId/transactions
// @access  Private
exports.getTransactions = asyncHandler(async (req, res, next) => {
  // Does debt exists
  if (!(await Debt.findById(req.params.debtId))) {
    return next(
      new ErrorResponse(`Debt id ${req.params.debtId} not found.`, 404)
    );
  }

  // Find all transactions with specific debtId
  const transactions = await Transaction.find({ debt: req.params.debtId });

  res
    .status(200)
    .json({ success: true, count: transactions.length, data: transactions });
});

// @desc    Get transaction by id
// @route   GET /api/v1/transactions/:id
// @access  Private
exports.getTransaction = asyncHandler(async (req, res, next) => {
  const transaction = await Transaction.findById(req.params.id);

  if (!transaction) {
    return next(
      new ErrorResponse(`Transaction id ${req.params.id} not found`, 404)
    );
  }

  res.status(200).json({ success: true, data: transaction });
});

// @desc    Create new transaction
// @route   POST /api/v1/debts/:debtId/transaction
// @access  Private
exports.createTransaction = asyncHandler(async (req, res, next) => {
  req.body.debt = req.params.debtId;
  const transaction = await Transaction.create(req.body);
  res.status(201).json({ success: true, data: transaction });
});

// @desc    Update transaction
// @route   PUT /api/v1/transaction/:id
// @access  Private
exports.updateTransaction = asyncHandler(async (req, res, next) => {
  let transaction = await Transaction.findById(req.params.id).populate('debt');

  if (!transaction) {
    return next(
      new ErrorResponse(`Transaction id ${req.params.id} not found`, 404)
    );
  }

  if (req.user.id !== transaction.debt.users.creditor.toString()) {
    return next(
      new ErrorResponse(
        `User id ${req.user.id} is not authorized to this action.`,
        401
      )
    );
  }

  transaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: transaction });
});

// @desc    Delete transaction
// @route   DELETE /api/v1/transaction/:id
// @access  Private
exports.deleteTransaction = asyncHandler(async (req, res, next) => {
  const transaction = Transaction.findById(req.params.id);

  if (!transaction) {
    return next(
      new ErrorResponse(`Transaction id ${req.params.id} not found`, 404)
    );
  }

  await transaction.remove();

  res.status(200).json({ success: true, data: {} });
});

// @desc    Approve single transaction
// @route   GET /api/v1/transactions/:id/approve
// @access  Private
exports.approveTransaction = asyncHandler(async (req, res, next) => {
  let transaction = await Transaction.findById(req.params.id).populate('debt');

  if (!transaction) {
    return next(
      new ErrorResponse(`Transaction id ${req.params.id} not found`, 404)
    );
  }

  if (req.user.id !== transaction.debt.users.creditor.toString()) {
    return next(
      new ErrorResponse(
        `User id ${req.user.id} is not authorized to this action.`,
        401
      )
    );
  }
  transaction = await Transaction.findByIdAndUpdate(
    req.params.id,
    { approved: true },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({ success: true, data: transaction });
});

// @desc    Approve all transactions within debt
// @route   GET /api/v1/debts/:debtId/transactions/approve
// @access  Private
// exports.approveDebtTransactions = asyncHandler(async (req, res, next) => {
//   if (req.params.debtId) {
//     const debt = await Debt.findById(req.params.debtId);

//     if (!debt) {
//       return next(
//         new ErrorResponse(`Transaction id ${req.params.id} not found`, 404)
//       );
//     }

//     if (req.user.id !== debt.users.creditor.toString()) {
//       return next(
//         new ErrorResponse(
//           `User id ${req.user.id} is not authorized to this action.`,
//           401
//         )
//       );
//     }

//     Transaction.updateMany(
//       { debt: req.params.debtId },
//       { $set: { approved: true } },
//       { multi: true }
//     );

//     return res.status(200).json({ success: true, data: {} });
//   }
// });
