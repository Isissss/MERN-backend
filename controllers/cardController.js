const { mongoose } = require('mongoose')
const Card = require('../Schemas/cardModel')
const baseURI = process.env.BASE_URI

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
const getLastPageStart = (totalCards, limit) => { return ((Math.ceil(totalCards / limit) * limit) - limit) + 1 }

const getQueryString = (position, totalCards, start, limit) => {
    if (limit == totalCards) {
        return baseURI
    }

    switch (position) {
        case "first":
            startValue = 1
            break
        case "last":
            startValue = getLastPageStart(totalCards, limit)
            break
        case "previous":
            startValue = (start - limit < 1) ? 1 : start - limit
            break
        case "next":
            startValue = (start + limit > totalCards) ? getLastPageStart(totalCards, limit) : start + limit
            break
        default:
            return baseURI
    }
    return baseURI + `?start=${startValue}&limit=${limit}`
}
const getCurrentItems = (totalCards, start, limit) => { return (totalCards - start < limit) ? totalCards - start + 1 : limit }

const createPagination = (totalCards, start, limit) => {

    const page = Math.ceil(start / limit)
    const totalPages = Math.ceil(totalCards / limit)

    return {
        "currentPage": page,
        "currentItems": getCurrentItems(totalCards, start, limit),
        "totalPages": totalPages,
        "totalItems": totalCards,
        "_links": {
            "first": {
                "page": 1,
                "href": getQueryString("first", totalCards, start, limit)
            },
            "last": {
                "page": totalPages,
                "href": getQueryString("last", totalCards, start, limit)
            },
            "previous": {
                "page": (page <= 1) ? 1 : page - 1,
                "href": getQueryString("previous", totalCards, start, limit)
            },
            "next": {
                "page": (page >= totalPages) ? totalPages : page + 1,
                "href": getQueryString("next", totalCards, start, limit)
            }
        }

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
                    href: baseURI,
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