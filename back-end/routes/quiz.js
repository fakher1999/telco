// routes/quiz.js
const express = require('express');
const router = express.Router();
const Quiz = require('../Models/quiz');
const Task = require('../Models/task');
const User = require('../Models/user');
const Agent = require('../Models/agent');
    const bcrypt = require('bcrypt');

// Create Quiz
router.post('/', async (req, res) => {
    try {
        const { title, questions, taskId, password, userId } = req.body;
        // Verify password
        const user = await User.findById(userId);
        const agent = await Agent.findById(userId);
        if(!agent || agent.password != password) {
          if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid password' });
          }
        }

    
        const newQuiz = new Quiz({
          title,
          questions,
          createdBy: userId
        });
    
        const savedQuiz = await newQuiz.save();
    
        // Update the associated task
        await Task.findByIdAndUpdate(taskId, { quizId: savedQuiz._id });
    
        res.status(201).json(savedQuiz);
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get all Quizzes
router.get('/', async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch quizzes' });
  }
});

router.get('/:id' , async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) {
          return res.status(404).json({ message: 'Quiz not found' });
        }
        res.json(quiz);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
})

// Update Quiz
router.put('/:id', async (req, res) => {
    try {
        const { title, questions, password , userId} = req.body;
    
        // Verify password
        const user = await User.findById(userId);
        
        if (!user || !(await bcrypt.compare(password, user.password))) {
          return res.status(401).json({ message: 'Invalid password' });
        }
    
        // Find the old quiz
        const oldQuiz = await Quiz.findById(req.params.id);
        if (!oldQuiz) {
          return res.status(404).json({ message: 'Quiz not found' });
        }
    
        // Create a new quiz with updated data
        const newQuiz = new Quiz({
          title,
          questions,
          createdBy: userId
        });
    
        const savedQuiz = await newQuiz.save();
    
        // Update the associated task
        await Task.findOneAndUpdate({ quizId: oldQuiz._id }, { quizId: savedQuiz._id });
    
        // Delete the old quiz
        await Quiz.findByIdAndDelete(oldQuiz._id);
    
        res.json(savedQuiz);
      } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
      }
});

// Delete Quiz
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    const quiz = await Quiz.findById(id);
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }


    await quiz.remove();
    res.json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete quiz' });
  }
});



module.exports = router;
