const mongoose = require('mongoose');

const contactMessageSchema = new mongoose.Schema({
  queryType: String,
  email: String,
  message: String,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ContactMessage', contactMessageSchema);