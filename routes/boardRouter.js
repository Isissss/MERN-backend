const express = require('express')
const router = express.Router();
const { getBoards, showBoard, createBoard, deleteBoard, updateBoard, boardsOptions, boardOptions, boardExists } = require('../controllers/boardController');
const verifyJWT = require('../middleware/verifyJWT');
const verifyOwnership = require('../middleware/verifyOwnership');
router.use('/', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", ["https://client-isissss.vercel.app"])
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


// Get collection
router.route('/').get(verifyJWT, getBoards).post(verifyJWT, createBoard).options(boardsOptions)

// Get resource
router.route('/:id').get(verifyJWT, boardExists, verifyOwnership, showBoard).delete(verifyJWT, boardExists, verifyOwnership, deleteBoard).put(boardExists, verifyOwnership, updateBoard).options(boardOptions)


module.exports = router; 