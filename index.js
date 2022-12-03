require('dotenv').config()

// Init express
const express = require('express')
const app = express()

// Init db and connect to it
const connectDB = require('./db')
connectDB();

// For parsing body in json/encoded-form-data
app.use(express.urlencoded({ extended: true }));
app.use(express.json())

app.get('/', (req, res) => {
  res.send('PRG06!')
})

const movieRouter = require('./routes/cardRouter')
app.use('/movies/', movieRouter);

// Start app
app.listen(8000, () => {
  console.log(`Example app listening on port 8000`)
})

