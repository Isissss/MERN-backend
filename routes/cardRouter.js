const express = require('express')
const Card = require('../Schemas/cardModel')
const router = express.Router();

const { getCards, showCard, createCard, deleteCard, updateCard, cardsOptions, cardOptions } = require('../controllers/cardController');

// Set accepted headers 
router.get('/', (req, res, next) => {
    if (req.header("accept") == "application/json") {
        next()
    } else {
        res.status(415).send()
    }
});


router.post('/', (req, res, next) => {
    if (["application/json", "application/x-www-form-urlencoded"].includes(req.headers['content-type'])) {
        next()
    } else {
        res.status(415).send()
    }
});


router.use('/:id', async (req, res, next) => {
    if (req.method == "POST") {
        return next();
    }

    try {
        const card = await Card.findById(req.params.id)

        if (!card) {
            return res.status(404).send({ 'error': 'Resource cannot be not found' })
        }
        next()
    } catch (e) {
        if (e.name == "CastError") {
            return res.status(400).send({ error: e.message })
        }

        res.status(500).send({ error: e.message })

    }
});

// Get collection
router.route('/').get(getCards).post(createCard).options(cardsOptions)

// Get resource
router.route('/:id').get(showCard).delete(deleteCard).put(updateCard).options(cardOptions)


module.exports = router;