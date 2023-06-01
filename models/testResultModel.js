const mongoose = require('mongoose');

const testResultSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  questionsId: { type: [String], required: true },
  category: { type: String, enum: ['practice', 'final'], required: true },
  complexity: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true,
  },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('testResults', testResultSchema);
