const express = require('express')
const router = express.Router();
const verifyJWT = require('../middleware/verifyJWT');
const { getLists, showList, createList, deleteList, updateList, listsOptions, listOptions, listExists } = require('../controllers/listController');

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
router.route('/').get(verifyJWT, getLists).post(createList).options(listsOptions)

// Get resource
router.route('/:id').get(listExists, showList).delete(listExists, deleteList).put(listExists, updateList).options(listOptions)


module.exports = router;