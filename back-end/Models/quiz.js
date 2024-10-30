const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  text: { type: String, required: true }
});

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  answers: [answerSchema],
});

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  questions: [questionSchema],
  createdBy: { type: String, required: true },  // User ID or username
});



module.exports = mongoose.model('Quiz', quizSchema);
