
const express = require('express')
const router = express.Router()
const usersController = require('../controllers/userController')


router.use('/', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", ["https://client-isissss.vercel.app"])
    res.header('Access-Control-Allow-Credentials', true)
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next()
})

router.route('/')
    .post(usersController.registerUser)

module.exports = router