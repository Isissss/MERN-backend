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
        let card = await Card.find({"_id": req.params.id}) 
        res.json(card)
    } catch (error) {
        res.send({Error: "Resource cannot be found"})
    }
    console.log('get')
})


router.post('/', async (req, res) => {
    let list = new List({
        name: req.params.name
    })

    try {
        await list.save()
        res.json(list)
    } catch {
        res.status(500).send()
        console.log(error)
    }

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