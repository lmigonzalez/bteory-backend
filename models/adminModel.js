const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  level: {
    type: String,
    enum: ['questions', 'users', 'both', 'top'],
    required: true,
  },
  password: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('admins', adminSchema);
