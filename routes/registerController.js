
const express = require('express')
const router = express.Router()
const usersController = require('../controllers/userController')
const verifyJWT = require('../middleware/verifyJWT')



router.route('/')
    .post(usersController.registerUser)

module.exports = router