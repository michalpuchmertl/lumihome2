const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: [true, 'Please fill in amount'],
  },
  approved: {
    type: Boolean,
    default: false,
  },
  debt: {
    type: mongoose.Schema.ObjectId,
    ref: 'Debt',
    required: true,
  },
});

// Update amountPaid to sum of transactions
TransactionSchema.statics.getPaidAmount = async function (debtId) {
  const obj = await this.aggregate([
    {
      $match: { debt: debtId },
    },
    {
      $group: {
        _id: '$debt',
        amountPaid: { $sum: '$amount' },
      },
    },
  ]);

  try {
    await this.model('Debt').findByIdAndUpdate(debtId, {
      amountPaid: obj[0].amountPaid,
    });
  } catch (err) {
    console.error(err);
  }
};

// If debt is paid, set debt.active = false
TransactionSchema.statics.isDebtPaid = async function (debtId) {
  const debt = await this.model('Debt').findById(debtId);
  console.log(debt.amount);
  console.log(debt.amountPaid);
  if (debt.amount === debt.amountPaid) {
    await this.model('Debt').findByIdAndUpdate(debtId, { active: false });
  }
};

// If any transaction is not approved, debt is not apporved
TransactionSchema.statics.isAnyTransactionNotApproved = async function (
  debtId
) {
  const transactions = await this.model('Transaction').find({
    approved: false,
  });
  if (transactions.length) {
    return await this.model('Debt').findByIdAndUpdate(debtId, {
      approved: false,
    });
  }
  await this.model('Debt').findByIdAndUpdate(debtId, { approved: true });
};

TransactionSchema.post('save', async function () {
  await this.constructor.getPaidAmount(this.debt);
  await this.constructor.isDebtPaid(this.debt);
  await this.constructor.isAnyTransactionNotApproved(this.debt);
});

module.exports = mongoose.model('Transaction', TransactionSchema);
