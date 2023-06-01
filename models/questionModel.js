const mongoose = require('mongoose');

const explanationSchema = new mongoose.Schema({
  type: { type: String, enum: ['text', 'image'], required: true },
  content: { type: String, required: true },
});

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  questionImg: { type: String, default: null },
  options: { type: [String], required: true },
  answer: { type: String, enum: this.options, required: true },
  explanation: { type: [Object], required: true },
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

module.exports = mongoose.model('questions', questionSchema);
