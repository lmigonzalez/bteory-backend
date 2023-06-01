const mongoose = require('mongoose');

const explanationSchema = new mongoose.Schema({
  type: { type: String, enum: ['text', 'image'], required: true },
  content: { type: String, required: true },
});

const subjectSchema = new mongoose.Schema({
  subjectName: { type: String, required: true },
  questionsId: { type: [String], required: true },
  explanation: { type: [explanationSchema] },
  category: {
    type: String,
    enum: ['practice', 'general', 'final'],
    required: true,
  },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('subjects', subjectSchema);
