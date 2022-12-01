const express = require('express')

const router = express.Router();

const Card = require('../Schemas/cardModel')
 
// Set accepted headers 
router.get('/', (req, res, next) => {
    if (req.header("accept") == "application/json") {
        next()
    } else {
        res.status(415).send()
    }
});

router.post('/', (req, res, next) => {
    console.log(req.headers)
    if (req.header("content-type") == "application/json" || req.header("content-type") == "application/x-www-form-urlencoded") {
        next()
    } else {
        res.status(415).send()
    }
});
// Get collection
router.get('/', async (req, res) => {
    try {
        const totalCards = await Card.count()
        
        const page = parseInt(req.query.page) 
        const limit = parseInt(req.query.limit) 
   

        let cards = await Card.find()
   
        console.log(totalCards / limit);
        let notesCollection = {
            items: cards,
            _links: {
                self: {
                    href: `${process.env.BASE_URI}`,
                }
            },
            pagination: {
                "currentPage": page,
                "currentItems": cards.length,
                "totalPages": Math.ceil(totalCards / limit),
                "totalItems": totalCards,
            }
        }
        res.json(notesCollection)
    } catch (error) {
        res.status(500).send()
        console.log(error)
    }
    console.log('get')
})

// Get resource
router.get('/:id', async (req, res) => {

    try {
        let card = await Card.findById(req.params.id)

        if (!card) {
            return res.status(404).send({ error: 'Resource cannot be found' })
        }

        res.json(card)
        
    } catch (e) {
        res.status(500).send({ error: e.message })
    }
 
})

 
// Post
router.post('/', async (req, res) => {

    if (!req.body.title || !req.body.body || !req.body.author) {
        return res.status(400).send('Missing fields')
    }

    const card = new Card({
        title: req.body.title,
        body: req.body.body,
        author: req.body.author
    })

    try {
        await card.save().then(res.status(201).json(card))

    } catch (e) {
        res.status(500).send({ error: e.message })
        console.log(error)
    }

    console.log('POST')
})

 

// Delete
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

// Put
router.put('/:id', async (req, res) => {
    if (!req.body.title || !req.body.body || !req.body.author) {
        return res.status(400).send('Missing fields')
    }

    try {
        const card = await Card.findByIdAndUpdate(req.params.id, req.body, { new: true })
        res.status(200).json(card)

    } catch (e) {
        res.status(400).send(e.message)
        console.log(e)
    }

})

// Options collection and resource
router.options('/', (req, res) => {
    res.setHeader("Allow", "GET, POST, OPTIONS").send()
})

router.options('/:id', (req, res) => {
    res.setHeader("Allow", "DELETE, GET, PUT, OPTIONS").send()

})


module.exports = router;