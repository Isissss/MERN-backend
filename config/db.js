// Import the mongoose module
const mongoose = require("mongoose");

// Set up default mongoose connection
const mongoDB = process.env.DATABASE_URL

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
