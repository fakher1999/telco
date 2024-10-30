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