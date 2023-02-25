const User = require('../Schemas/userModel')
const Board = require('../Schemas/boardModel')

const verifyOwnership = async (req, res, next) => {
    const foundUser = await User.findOne({ "username": req.user })
    // return with unauthorized status if not found
    if (!foundUser) return res.status(401).send({ error: "Unauthorized" })

    const ownsBoard = await Board.findOne({ "owner_id": foundUser._id, "_id": req.params.id }).lean()

    // return with forbidden status if not found
    if (!ownsBoard) return res.status(403).send({ error: "Forbidden" })

    req.user = foundUser
    next()
}

module.exports = verifyOwnership