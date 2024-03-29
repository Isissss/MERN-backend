require('dotenv').config()
const port = process.env.APP_PORT || 8000
const cookieParser = require('cookie-parser')
// Init express
const express = require('express')
const app = express()
const router = express.Router();
// Init db and connect to it
const connectDB = require('./config/db')
connectDB();

// For parsing body in json/encoded-form-data
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(cookieParser())

app.get('/', (req, res) => {
  res.send('PRG06 project Isis 1036029!')
})

// Import routes
const cardsRouter = require('./routes/cardRouter')
app.use('/cards/', cardsRouter);

const listRouter = require('./routes/listRouter')
app.use('/lists/', listRouter);

const boardRouter = require('./routes/boardRouter')
app.use('/boards/', boardRouter);

const loginRouter = require('./routes/authRouter');
app.use('/auth/', loginRouter);

const registerRouter = require('./routes/registerRouter');
app.use('/register/', registerRouter);

module.exports = router;

// Start app
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

