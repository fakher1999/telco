const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  name: String, // e.g., "admin", "user"
  permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Permission' }],
});

module.exports = mongoose.model('Role', roleSchema);
