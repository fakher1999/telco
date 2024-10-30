const express = require('express');
const router = express.Router();
const { Rapport, Task } = require('../Models/rapport'); // Adjust the path as needed
const User = require('../Models/user'); // Adjust the path as needed



// Create a new rapport
// router.post('/rapports', async (req, res) => {
//   try {
//     const { taskId, content } = req.body;
//     const rapport = new Rapport({
//       task: taskId,
//       user: req.body.user._id,
//       content
//     });
//     await rapport.save();
    
//     // Add rapport reference to the task
//     await Task.findByIdAndUpdate(taskId, { $push: { rapports: rapport._id } });
    
//     res.status(201).json(rapport);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// Create a new rapport
router.post('/' , async (req, res) => {
    try {
      const { taskId, content } = req.body;
  
      // Check if the task exists
      const task = await Task.findById(taskId);
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
      console.log(req.body)
      // Create new rapport
      const rapport = new Rapport({
        task: taskId,
        user: req.body.user._id,
        content: content,
        status: 'pending'
      });
  
      // Save the rapport
      await rapport.save();
    
  
      res.status(201).json(rapport);
    } catch (error) {
      console.error('Error creating rapport:', error);
      res.status(400).json({ message: error.message });
    }
  });

// Get rapports (filtered by role)
router.get('/',  async (req, res) => {
  try {
    let rapports;
    if (req.body.user.role === 'agent') {
      rapports = await Rapport.find().populate('task user');
    } else {
      rapports = await Rapport.find({ user: req.body.user._id }).populate('task');
      console.log("rapports", rapports)
    }
    res.json(rapports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a discussion to a rapport
router.post('/:id/discussions',  async (req, res) => {
  try {
    const { content } = req.body;
    const rapport = await Rapport.findById(req.params.id);
    
    if (!rapport) {
      return res.status(404).json({ message: 'Rapport not found' });
    }
    
    rapport.discussions.push({
      author: req.body.user._id,
      authorType: req.body.user.role === 'agent' ? 'Agent' : 'User',
      content
    });
    
    await rapport.save();
    res.status(201).json(rapport);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update rapport status (only for users)
router.patch('/:id/status',  async (req, res) => {
  try {
    const { status } = req.body;
    
    if (req.body.user.role === 'agent') {
      return res.status(403).json({ message: 'Only users can update rapport status' });
    }
    
    const rapport = await Rapport.findOneAndUpdate(
      { _id: req.params.id, user: req.body.user._id },
      { status },
      { new: true }
    );
    
    if (!rapport) {
      return res.status(404).json({ message: 'Rapport not found or unauthorized' });
    }
    
    res.json(rapport);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;