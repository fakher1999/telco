const express = require('express');
const router = express.Router();
const Permission = require('../Models/permission');

// Create Permission
router.post('/create', async (req, res) => {
  const permission = new Permission(req.body);
  await permission.save();
  res.send(permission);
});

// Get Permission by ID
router.get('/:id', async (req, res) => {
  const permission = await Permission.findById(req.params.id);
  res.send(permission);
});

module.exports = router;
