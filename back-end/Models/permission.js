const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
  name: String, // e.g., "create_task", "delete_user"
  
});

module.exports = mongoose.model('Permission', permissionSchema);
