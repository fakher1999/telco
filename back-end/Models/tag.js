const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  count: {
    type: Number,
    default: 1
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Tag = mongoose.model('Tag', tagSchema);
module.exports = Tag;
