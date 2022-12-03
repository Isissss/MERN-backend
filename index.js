require('dotenv').config()
const port = process.env.APP_PORT || 8000

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
  res.send('PRG06 project Isis 1036029!')
})

const movieRouter = require('./routes/cardRouter')
app.use('/movies/', movieRouter);

// Start app
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

