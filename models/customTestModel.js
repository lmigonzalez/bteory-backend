const mongoose = require('mongoose');


const customTestSchema = new mongoose.Schema({
  testName: { type: String, required: true },
  questionsId: { type: [String], required: true },
  explanation: { type: [Object] },
  category: {
    type: String,
    enum: ['practice', 'general', 'final'],
    required: true,
  },
  complexity: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true,
  },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('tests', customTestSchema);
