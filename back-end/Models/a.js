const mongoose = require('mongoose');


const Agent = mongoose.model('Agent', {
    email: {
        type: String
    },
    password: {
      type: String,
    },
    permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Permission' }],

})

module.exports = Agent ; 

const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  zone: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  sex: {
    type: String,
    enum: ['Male', 'Female'],
    required: true,
  },
  telephone: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model('Customer', customerSchema);

const mongoose = require('mongoose');

const FinanceSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['paid', 'unpaid'], required: true },
  date: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Finance', FinanceSchema);

const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
  name: String, // e.g., "create_task", "delete_user"
  
});

module.exports = mongoose.model('Permission', permissionSchema);

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

const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  name: String, // e.g., "admin", "user"
  permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Permission' }],
});

module.exports = mongoose.model('Role', roleSchema);

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    taskName: { type: String, required: true },
    taskType: { type: String, required: true },
    description: { type: String },
    target: {
        sex: { type: String },
        ageRange: { type: [Number] },
        zone: { type: String }
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

const mongoose = require('mongoose');


const User = mongoose.model('User', {
    companyname: {
        type: String
    },
    companyaddress: {
        type: String
    },
    vatnumber: {
        type: Number,
    },
    password: {
        type: String,
    },
    website: {
        type: String
    },
    primaryfocus: {
        type: String
    },
    about: {
        type: String
    },
    applicantinfo: {
        type: String
    },
    firstname: {
        type: String
    },
    lastname: {
        type: String
    },
    email: {
        type: String
    },
    title: {
        type: String
    },
    applicantnumber: {
        type:  Number
    },
    banned_date: {
        type: Number
    },
    activate_date: {
        type: Number
    },
    logo: {
        type: String
    },
    rne: {
        type: String
    },
    patente: {
        type: String
    },
    role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' },

    
})

module.exports = User ; 