const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  zone: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  sex: {
    type: String,
    enum: ['Male', 'Female'],
    required: true,
  },
  telephone: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model('Customer', customerSchema);
