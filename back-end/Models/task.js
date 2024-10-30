const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    taskName: { type: String, required: true },
    taskType: { type: String, required: true },
    description: { type: String },
    target: {
        sex: { type: String },
        ageRange: { type: [Number] },
        zones: [{ type: String }],
        subRegions: [{ type: String }]
    },
    numberOfEligibleUsers: { type: Number },
    price: { type: Number },
    confirmed: { type: Boolean, default: false },
    quizId: { type: Number, default: null },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' }

});

module.exports = mongoose.model('task', taskSchema);
