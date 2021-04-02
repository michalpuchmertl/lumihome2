const mongoose = require('mongoose');

const DebtSchema = new mongoose.Schema(
  {
    users: {
      creditor: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
      },
      debtor: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
      },
    },
    amount: {
      type: Number,
      required: [true, 'Please enter a price'],
    },
    amountPaid: {
      type: Number,
      default: 0,
    },
    goods: {
      type: String,
      required: [true, 'Please enter goods'],
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: 'Category',
      required: true,
    },
    receipt: String,
    boughtOn: {
      type: Date,
      default: Date.now,
    },
    approved: {
      type: Boolean,
      default: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

DebtSchema.virtual('transactions', {
  ref: 'Transaction',
  localField: '_id',
  foreignField: 'debt',
  justOne: false,
});

module.exports = mongoose.model('Debt', DebtSchema);
