const mongoose = require('mongoose');

const PowerRequestSchema = new mongoose.Schema({
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  farmerName: { type: String, required: true },
  area: { type: String, required: true },
  powerRequired: { type: Number, required: true },
  purpose: { type: String },
  requestType: {
    type: String,
    enum: ['standard', 'paid_topup'],
    default: 'standard'
  },
  ratePerUnit: { type: Number, default: 0 },
  estimatedAmount: { type: Number, default: 0 },
  paymentStatus: {
    type: String,
    enum: ['NotRequired', 'PendingPayment', 'Paid'],
    default: 'NotRequired'
  },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  requestDate: { type: Date, default: Date.now },
  approvedAt: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model('PowerRequest', PowerRequestSchema);
