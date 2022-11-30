const express = require('express')

const app = express()
const port = 8000

const movieRouter = require('./routes/movieRouter')
app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.use('/movies/', movieRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

// Import the mongoose module
const mongoose = require("mongoose");

// Set up default mongoose connection
const mongoDB = "mongodb://127.0.0.1/prg06";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

// Get the default connection
const db = mongoose.connection;

// Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, "MongoDB connection error:"));