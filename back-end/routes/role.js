const express = require('express');
const router = express.Router();
const Role = require('../Models/role');

// Create Role
router.post('/create', async (req, res) => {
  const role = new Role(req.body);
  await role.save();
  res.send(role);
});

// Get Role by ID
router.get('/:id', async (req, res) => {
  const role = await Role.findById(req.params.id).populate('permissions');
  res.send(role);
});

// Add Permission to Role
router.post('/:id/permission', async (req, res) => {
  const role = await Role.findById(req.params.id);
  role.permissions.push(req.body.permissionId);
  await role.save();
  res.send(role);
});

module.exports = router;
