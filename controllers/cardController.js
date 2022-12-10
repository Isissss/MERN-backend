const { mongoose } = require('mongoose')
const { createPagination } = require('../helpers/pagination')
const Card = require('../Schemas/cardModel')


const cardExists = async (req, res, next) => {

    try {
        const card = await Card.findById(req.params.id)

        if (!card) {
            return res.status(404).send({ error: "Resource can not be found" })
        }
        return next()
    } catch (e) {
        if (e.name == "CastError") {
            return res.status(404).send({ error: "Resource can not be found" })
        }

        res.status(500).send({ error: e.message })

    }
}


const getCards = async (req, res) => {

    try {
        const totalCards = await Card.count()
        const start = parseInt(req.query.start) || 1

        if (start > totalCards || start < 1) {
            return res.status(400).send({ error: "Start is out of range" })
        }

        const limit = parseInt(req.query.limit) || totalCards


        let cards = await Card.find()
            .limit(limit)
            .skip(start - 1)
            .exec()

        let cardsCollection = {
            items: cards,
            _links: {
                self: {
                    href: process.env.BASE_URI,
                }
            },
            pagination: createPagination(totalCards, start, limit)
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
        if (e instanceof mongoose.Error.ValidationError) {
            return res.status(400).send({ error: e.message })
        }

        res.status(500).send({ error: e.message })
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
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    res.setHeader("Allow", "GET, POST, OPTIONS").send()

}

const cardOptions = async (req, res) => {
    res.setHeader("Access-Control-Allow-Methods", "GET, PUT, DELETE, OPTIONS")
    res.setHeader("Allow", "GET, PUT, DELETE, OPTIONS").send()
}

module.exports = {
    getCards,
    createCard,
    showCard,
    deleteCard,
    updateCard,
    cardsOptions,
    cardOptions,
    cardExists
}