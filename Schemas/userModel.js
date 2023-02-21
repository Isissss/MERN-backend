const mongoose = require('mongoose')
const { Schema } = mongoose;
// Define schema


const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },
    refreshToken: String
});

// Compile model from schema
module.exports = mongoose.model("User", userSchema);