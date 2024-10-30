const mongoose = require('mongoose');

const FinanceSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['paid', 'unpaid'], required: true },
  date: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Finance', FinanceSchema);