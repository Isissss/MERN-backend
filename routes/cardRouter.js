const express = require('express')

const router = express.Router();

const Card = require('../Schemas/cardModel')
const List = require('../Schemas/listModel')

router.get('/', async (req, res) => {
    try {
        let cards = await Card.find().populate('list_id')
        res.json(cards)
    } catch (error) {
        res.status(500).send()
        console.log(error)
    }
    console.log('get')
})

router.get('/:id', async (req, res) => {

    try {
        const card = await Card.findById(req.params.id)

        if (!card) {
            return res.status(404).send({ error: 'Resource cannot be found' })
        }

        res.json(card)

    } catch (e) {
        res.status(500).send({ error: e.message })
    }

    console.log('get')
})


router.post('/', async (req, res) => {

    if (!req.body.title || !req.body.body || !req.body.author) {
        return res.status(400).send('Missing fields')
    }

    let list = new Card({
        title: req.body.title,
        body: req.body.body,
        author: req.body.author
    })

    try {
        await list.save().then(res.status(201).json(list))

    } catch (e) {
        res.status(400).send({ error: e.message })
        console.log(error)
    }

    console.log('POST')
})

router.delete('/:id', async (req, res) => {
    try {
        await Card.findByIdAndDelete(req.params.id)
        res.status(204).send()

    } catch (e) {
        res.status(400).send(e.message)
        console.log(e)
    }
    console.log('get')
})

router.patch('/:id', async (req, res) => {
    try {
        const card = await Card.findOneAndUpdate(req.params.id, req.body, { new: true })
        res.status(200).json(card)

    } catch (e) {
        res.status(400).send(e.message)
        console.log(e)
    }

})


router.options('/', (req, res) => {
    res.header("Allow", "GET, OPTIONS").send()
})

router.options('/:id', (req, res) => {
    res.header("Allow", "DELETE, GET, PATCH, OPTIONS").send()

})


module.exports = router;