const Board = require('../Schemas/boardModel')
const Card = require('../Schemas/cardModel')
const List = require('../Schemas/listModel')
const User = require('../Schemas/userModel')
const mongoose = require('mongoose')

const boardExists = async (req, res, next) => {
    try {
        const board = await Board.findById(req.params.id).lean()

        if (!board) return res.status(404).send({ error: "Resource can not be found" })

        req.board = board
        return next()
    } catch (e) {
        if (e.name == "CastError") return res.status(404).send({ error: "Resource can not be found" })

        return res.status(500).send({ error: e.message })

    }
}


const getBoards = async (req, res) => {
    try {
        console.log(req?.user)
        const foundUser = await User.findOne({ "username": req.user })

        if (!foundUser) return res.status(401).send({ error: "No user found" })
        const boards = await Board.find({ "owner_id": foundUser._id })

        let boardsCollection = {
            items: boards,
            _links: {
                self: {
                    href: process.env.BASE_URI
                }
            },
        }
        return res.json(boardsCollection)
    } catch (error) {
        res.status(500).send({ error: error.message })
        console.log(error)
    }
}

const createBoard = async (req, res) => {
    const foundUser = await User.findOne({ "username": req.user })
    // return with unauthorized status if not found
    if (!foundUser) return res.status(401).send({ error: "Unauthorized" })


    const board = new Board({
        name: req.body.name,
        owner_id: foundUser._id
    })

    try {
        await board.save();
        res.status(201).json(board)
    } catch (e) {
        res.status(400).send({ error: e.message })
        console.log(e)
    }
}

const showBoard = async (req, res) => {

    try {
        const board = await Board.aggregate([
            {
                $match: { _id: mongoose.Types.ObjectId(req.board._id) }
            },
            {
                $lookup: {
                    from: "lists", localField: "_id", foreignField: "board_id", as: "lists", pipeline: [
                        {
                            $lookup: {
                                from: "cards", localField: "_id", foreignField: "list_id", as: "cards"
                            }
                        }
                    ]
                },
            }]).exec()


        res.json(board)

    } catch (e) {
        res.status(500).send({ error: e.message })
        console.log(e)
    }
}

const deleteBoard = async (req, res) => {
    try {
        await Board.deleteOne(req.board)

        const list = await List.deleteMany({ board_id: req.board._id })
        await Card.deleteMany({ list_id: list._id })
        res.status(204).send()

    } catch (e) {
        res.status(500).send({ error: e.message })
        console.log(e)
    }

}

const updateBoard = async (req, res) => {
    const values = {
        name: req.body.title
    }

    try {
        const board = await Board.findByIdAndUpdate(req.params.id, values, { new: true, runValidators: true })
        res.status(200).json(board)

    } catch (e) {
        res.status(400).json({ 'error': e.message })
    }
}

const boardsOptions = async (req, res) => {
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    res.setHeader("Allow", "GET, POST, OPTIONS").send()

}

const boardOptions = async (req, res) => {
    res.setHeader("Access-Control-Allow-Methods", "GET, PUT, DELETE, OPTIONS")
    res.setHeader("Allow", "GET, PUT, DELETE, OPTIONS").send()
}

module.exports = {
    getBoards,
    createBoard,
    showBoard,
    deleteBoard,
    updateBoard,
    boardsOptions,
    boardOptions,
    boardExists
}