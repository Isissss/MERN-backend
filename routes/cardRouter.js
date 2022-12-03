const express = require('express')

const router = express.Router();
 
const { getCards, showCard, createCard, deleteCard, updateCard } = require('../controllers/cardController');
 
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
router.route('/').get(getCards).post(createCard)

// Get resource
router.route('/:id').get(showCard).delete(deleteCard).put(updateCard)


// Options collection and resource
router.options('/', (req, res) => {
    res.setHeader("Allow", "GET, POST, OPTIONS").send()
})

router.options('/:id', (req, res) => {
    res.setHeader("Allow", "GET, PUT, DELETE, OPTIONS").send()

})

module.exports = router;