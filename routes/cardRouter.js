const express = require('express')
const Card = require('../Schemas/cardModel')
const router = express.Router();

const { getCards, showCard, createCard, deleteCard, updateCard, cardsOptions, cardOptions } = require('../controllers/cardController');
const { findById } = require('../Schemas/cardModel');



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


router.use('/:id', async (req, res, next) => {
    try {
        const card = await Card.findById(req.params.id)

        if (!card) {
            return res.status(404).send({ 'error': 'Resource cannot be not found' })
        }
        next()
    } catch (e) {
        res.status(400).json(e.message)
    }
});

// Get collection
router.route('/').get(getCards).post(createCard).options(cardsOptions)

// Get resource
router.route('/:id').get(showCard).delete(deleteCard).put(updateCard).options(cardOptions)


module.exports = router;