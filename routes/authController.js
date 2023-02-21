const express = require('express');
const { handleLogin } = require('../controllers/authController');
const router = express.Router();
const { registerUser } = require('../controllers/userController');

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

router.post('/', handleLogin);

module.exports = router;