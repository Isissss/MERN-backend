// Import the mongoose module
const mongoose = require("mongoose");

// Set up default mongoose connection
const mongoDB = "mongodb://127.0.0.1/prg06";

const connectDB = async () => {
    try {
        mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log(`Database connected`)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

module.exports = connectDB
