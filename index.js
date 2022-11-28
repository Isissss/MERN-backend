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