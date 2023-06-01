const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  subscriptionDueDate: { type: Date, required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('users', userSchema);
