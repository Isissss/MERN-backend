const express = require('express')
const router = express.Router();
const { getBoards, showBoard, createBoard, deleteBoard, updateBoard, boardsOptions, boardOptions, boardExists } = require('../controllers/boardController');

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
router.route('/').get(getBoards).post(createBoard).options(boardsOptions)

// Get resource
router.route('/:id').get(boardExists, showBoard).delete(boardExists, deleteBoard).put(boardExists, updateBoard).options(boardOptions)


module.exports = router; 