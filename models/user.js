const mongoose = require('mongoose');

// user schema
const userSchema = mongoose.Schema({
    name: {
        type: String,
    },
    username: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    verified: {
        type: Boolean,
        default: false
    },
    resetLink: {
        type: String,
        default: ''
    }

}, { timestamps: true })

const User = mongoose.model('user', userSchema)

module.exports = User