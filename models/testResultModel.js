const mongoose = require('mongoose');

const testResultSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  testId: { type: String, required: true },
  result: { type: [Object], required: true },
  category: { type: String, enum: ['practice', 'final'], required: true },
  complexity: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true,
  },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('testResults', testResultSchema);
