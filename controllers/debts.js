const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

const Debt = require('../models/Debt');

// @desc    Get all debts where user is debtor
// @route   GET /api/v1/debts/
// @access  Private
exports.getDebts = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.debtsResults);
});

// @desc    Get debt by id
// @route   GET /api/v1/debts/:id
// @access  Public
exports.getDebt = asyncHandler(async (req, res, next) => {
  const debt = await Debt.findById(req.params.id)
    .populate('category', 'name')
    .populate('users.debtor users.creditor')
    .populate('transactions');

  if (!debt) {
    return next(new ErrorResponse(`Debt ID ${req.params.id} not found.`, 404));
  }

  if (
    req.user.id != debt.users.debtor.id &&
    req.user.id != debt.users.creditor.id
  ) {
    return next(
      new ErrorResponse(
        `User is not debtor nor creditor of debt ID ${req.params.id}.`,
        403
      )
    );
  }

  res.status(200).json({ success: true, data: debt });
});

// @desc    Create new debt
// @route   POST /api/v1/debts/:id
// @access  Private
exports.createDebt = asyncHandler(async (req, res, next) => {
  req.body.users.creditor = req.user.id;
  const debt = await Debt.create(req.body);
  res.status(201).json({ success: true, data: debt });
});

// @desc    Update debt
// @route   PUT /api/v1/debts/:id
// @access  Private
exports.updateDebt = asyncHandler(async (req, res, next) => {
  let debt = await Debt.findById(req.params.id);

  if (!debt) {
    return next(new ErrorResponse(`Debt ID ${req.params.id} not found.`, 404));
  }

  if (req.user.id.toString() !== debt.users.creditor) {
    return next(
      new ErrorResponse(
        `User is not creditor of debt ID ${req.params.id}.`,
        403
      )
    );
  }

  debt = await Debt.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: debt });
});

// @desc    Delete debt
// @route   DELETE /api/v1/debts/:id
// @access  Private
exports.deleteDebt = asyncHandler(async (req, res, next) => {
  const debt = await Debt.findById(req.params.id);

  if (!debt) {
    return next(new ErrorResponse(`Debt ID ${req.params.id} not found.`, 404));
  }

  if (req.user.id.toString() !== debt.users.creditor) {
    return next(
      new ErrorResponse(
        `User is not creditor of debt ID ${req.params.id}.`,
        403
      )
    );
  }

  await debt.remove();

  res.status(200).json({ success: true, data: {} });
});
