const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// New Rapport model
const rapportSchema = new Schema({
    task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    status: { type: String, enum: ['pending', 'solved'], default: 'pending' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Discussion schema (for nested discussions in Rapport)
const discussionSchema = new Schema({
    author: { type: mongoose.Schema.Types.ObjectId, refPath: 'authorType' },
    authorType: { type: String, enum: ['User', 'Agent'] },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

// Add discussions to Rapport model
rapportSchema.add({
    discussions: [discussionSchema]
});

// Update Task model to include rapports
const taskSchema = new Schema({
    // ... (existing fields)
    rapports: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Rapport' }]
});

const Rapport = mongoose.model('Rapport', rapportSchema);
const Task = mongoose.model('Task', taskSchema);

module.exports = { Rapport, Task };