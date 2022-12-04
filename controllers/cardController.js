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
        res.status(500).send(error.message)
        console.log(error)
    }
}

const createCard = async (req, res) => {
    const card = new Card({
        title: req.body.title,
        body: req.body.body,
        author: req.body.author
    })

    try {
        await card.save()
        res.status(201).json(card)

    } catch (e) {
        res.status(400).send({ error: e.message })
        console.log(e)
    }
}

const showCard = async (req, res) => {
    try {
        const card = await Card.findById(req.params.id)
        res.json(card)

    } catch (e) {
        res.status(500).send({ error: e.message })
        console.log(e)
    }
}

const deleteCard = async (req, res) => {
    try {
        await Card.findByIdAndDelete(req.params.id)
        res.status(204).send()

    } catch (e) {
        res.status(500).send({ error: e.message })
        console.log(e)
    }

}

const updateCard = async (req, res) => {
    try {
        const card = await Card.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        res.status(200).json(card)

    } catch (e) {
        res.status(400).json({ 'error': e.message })
        console.log(e)
    }

}

const cardsOptions = async (req, res) => {
    res.setHeader("Allow", "GET, POST, OPTIONS").send()
}

const cardOptions = async (req, res) => {
    res.setHeader("Allow", "GET, PUT, DELETE, OPTIONS").send()
}

module.exports = {
    getCards,
    createCard,
    showCard,
    deleteCard,
    updateCard,
    cardsOptions,
    cardOptions
}