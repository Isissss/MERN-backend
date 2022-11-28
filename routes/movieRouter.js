const express = require('express')

const router = express.Router();

let items = [
    {
        title: "marvel"
    },
    {
        title: "black widow"
    },
    {
        title: "endgame"
    }
]
router.get('/', (req, res) => {
    res.json(items)
    console.log('get')
})

router.get('/:id', (req, res) => {
    movie = items[req.params.id]
    if (movie) {
        res.send(movie)
    } else {
        res.send({ error: `No movie found with id ${req.params.id}` })
    }
    console.log('get')
})


router.post('/', (req, res) => {
    res.send('Hello World!')
    console.log('POST')
})

router.delete('/', (req, res) => {
    res.send('Hello World!')
    console.log('DELETE')
})


router.options('/', (req, res) => {
    //res.send('Hello World!')
    console.log('OPTIONS')
})

module.exports = router;