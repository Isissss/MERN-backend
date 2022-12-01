const express = require('express')

const router = express.Router();

const Card = require('../Schemas/cardModel')

const baseURI = process.env.BASE_URI
// Set accepted headers 
router.get('/', (req, res, next) => {
    if (req.header("accept") == "application/json") {
        next()
    } else {
        res.status(415).send()
    }
});

router.post('/', (req, res, next) => {
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

        let page
        let limit
        let totalPages

        let firstURI
        let lastURI
        let prevURI
        let nextURI

        if (req.query.limit) {
            limit = parseInt(req.query.limit) || totalCards

            totalPages = Math.ceil(totalCards / limit)

            page = parseInt(req.query.start) || 1

            firstURI = `${baseURI}?start=1&limit=${limit}`
            lastURI = `${baseURI}?start=${totalPages}&limit=${limit}`
            prevURI = `${baseURI}?start=${(page == 1) ? 1 : page - 1}&limit=${limit}`
            nextURI = `${baseURI}?start=${(page == totalPages) ? totalPages : page + 1}&limit=${limit}`

        } else {
            page = 1
            totalPages = 1
            limit = totalCards
        }

        let cards = await Card.find()
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec()

        let notesCollection = {
            items: cards,
            _links: {
                self: {
                    href: baseURI,
                }
            },
            pagination: {
                "currentPage": page,
                "currentItems": cards.length,
                "totalPages": totalPages,
                "totalItems": totalCards,
                "_links": {
                    "first": {
                        "page": 1,
                        "href": firstURI ?? baseURI
                    },
                    "last": {
                        "page": totalPages,
                        "href": lastURI ?? baseURI
                    },
                    "previous": {
                        "page": (page === 1) ? 1 : page - 1,
                        "href": prevURI ?? baseURI
                    },
                    "next": {
                        "page": (page === totalPages) ? totalPages : page + 1,
                        "href": nextURI ?? baseURI
                    }
                }
            }
        }
        res.json(notesCollection)
    } catch (error) {
        res.status(500).send()
        console.log(error)
    }
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
})


// Delete
router.delete('/:id', async (req, res) => {
    try {
        const card = await Card.findByIdAndDelete(req.params.id)

        if (!card) {
            return res.status(404).send({ error: 'Resource cannot be found' })
        }

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

        if (!card) {
            return res.status(404).send({ error: 'Resource cannot be found' })
        }

        res.status(200).json(card)

    } catch (e) {
        res.status(500).send(e.message)
        console.log(e)
    }

})

// Options collection and resource
router.options('/', (req, res) => {
    res.setHeader("Allow", "GET, POST, OPTIONS").send()
})

router.options('/:id', (req, res) => {
    res.setHeader("Allow", "GET, PUT, DELETE, OPTIONS").send()

})

module.exports = router;