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