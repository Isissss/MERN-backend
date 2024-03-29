const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController')

router.use('/', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", ["https://kanban-isissss.vercel.app"])
    res.header('Access-Control-Allow-Credentials', true)
    res.header("Access-Control-Allow-Headers", "Authorization, Origin, X-Requested-With, Content-Type, Accept")
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

router.route('/')
    .post(authController.login)


router.route('/refresh')
    .get(authController.refresh)

router.route('/logout')
    .get(authController.logout)

module.exports = router
