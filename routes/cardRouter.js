const express = require('express')
const router = express.Router();
const { getCards, showCard, createCard, deleteCard, updateCard, cardsOptions, cardOptions, cardExists } = require('../controllers/cardController');

router.use('/', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next()
})

// Set accepted headers 
router.get('/', (req, res, next) => {
    if (req.header("accept") === "application/json") next()
    else res.status(415).send()

});

router.post('/', (req, res, next) => {
    if (["application/json", "application/x-www-form-urlencoded"].includes(req.headers['content-type'])) next()
    else res.status(415).send()
});


// Get collection
router.route('/').get(getCards).post(createCard).options(cardsOptions)

// Get resource
router.route('/:id').get(cardExists, showCard).delete(cardExists, deleteCard).put(cardExists, updateCard).options(cardOptions)


module.exports = router; 