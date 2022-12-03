const Card = require('../Schemas/cardModel')

const baseURI = process.env.BASE_URI

const getCards = async (req, res) => {
    try {
        const totalCards = await Card.count()
        const page = parseInt(req.query.start) || 1
        const limit = parseInt(req.query.limit) || totalCards 
        const totalPages = Math.ceil(totalCards / limit)

        let firstURI
        let lastURI
        let prevURI
        let nextURI

        if (req.query.limit) {
            firstURI = `${baseURI}?start=1&limit=${limit}`
            lastURI = `${baseURI}?start=${totalPages}&limit=${limit}`
            prevURI = `${baseURI}?start=${(page == 1) ? 1 : page - 1}&limit=${limit}`
            nextURI = `${baseURI}?start=${(page == totalPages) ? totalPages : page + 1}&limit=${limit}`
        }

        let cards = await Card.find()
            .limit(limit)
            .skip((page - 1) * limit)
            .exec()

        let cardsCollection = {
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
                        "page": (page == 1) ? 1 : page - 1,
                        "href": prevURI ?? baseURI
                    },
                    "next": {
                        "page": (page == totalPages) ? totalPages : page + 1,
                        "href": nextURI ?? baseURI
                    }
                }
            }
        }
        res.json(cardsCollection)
    } catch (error) {
        res.status(500).send()
        console.log(error)
    }
}

const createCard = async (req, res) => {
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
}

const showCard = async (req, res) => {
    try {
        let card = await Card.findById(req.params.id)

        if (!card) {
            return res.status(404).send({ error: 'Resource cannot be found' })
        }
        res.json(card)

    } catch (e) {
        res.status(500).send({ error: e.message })
    }
}

const deleteCard = async (req, res) => {
    try {
        const card = await Card.findByIdAndDelete(req.params.id)

        if (!card) {
            return res.status(404).send({ error: 'Resource cannot be found' })
        }

        res.status(204).send()

    } catch (e) {
        res.status(500).send({ error: e.message })
        console.log(e)
    }

}

const updateCard = async (req, res) => {
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

}


module.exports = {
    getCards,
    createCard,
    showCard,
    deleteCard,
    updateCard
}