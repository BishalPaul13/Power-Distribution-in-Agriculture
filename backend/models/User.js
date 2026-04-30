const mongoose = require('mongoose');

const ElectricityTransactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['subsidy', 'usage', 'paid_topup'],
    required: true
  },
  units: { type: Number, required: true },
  amount: { type: Number, default: 0 },
  purpose: { type: String, default: '' },
  note: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
}, { _id: true });

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['farmer', 'admin'], default: 'farmer' },
  electricityAccount: {
    subsidizedUnits: { type: Number, default: 0 },
    purchasedUnits: { type: Number, default: 0 },
    totalSubsidyGranted: { type: Number, default: 0 },
    totalUnitsConsumed: { type: Number, default: 0 },
    totalPaidUnitsPurchased: { type: Number, default: 0 },
    totalAmountSpent: { type: Number, default: 0 },
    lastSubsidyAt: { type: Date, default: null }
  },
  electricityTransactions: {
    type: [ElectricityTransactionSchema],
    default: []
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
