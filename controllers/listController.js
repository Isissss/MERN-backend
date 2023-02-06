const { createPagination } = require('../helpers/pagination')
const List = require('../Schemas/listModel')
const Card = require('../Schemas/cardModel')
const listExists = async (req, res, next) => {

    try {
        const list = await List.findById(req.params.id)

        if (!list) return res.status(404).send({ error: "Resource can not be found" })

        return next()
    } catch (e) {
        if (e.name == "CastError") return res.status(404).send({ error: "Resource can not be found" })

        return res.status(500).send({ error: e.message })

    }
}


const getLists = async (req, res) => {

    try {
        const totalLists = await List.count()
        const start = parseInt(req.query.start) || 1

        if (start > totalLists || start < 1) return res.status(400).send({ error: "Start is out of range" })


        const limit = parseInt(req.query.limit) || totalLists
        const pipeline = [
            {
                $lookup: { from: "cards", localField: "_id", foreignField: "list_id", as: "cards" }
            }
        ]

        let lists = await List.aggregate(pipeline).limit(limit).skip(start - 1).exec()

        let currentItems = lists.length

        let listsCollection = {
            items: lists,
            _links: {
                self: {
                    href: process.env.BASE_URI
                }
            },
            pagination: createPagination(totalLists, currentItems, start, limit)
        }
        return res.json(listsCollection)
    } catch (error) {
        res.status(500).send({ error: error.message })
        console.log(error)
    }
}

const createList = async (req, res) => {
    const list = new List({
        name: req.body.name,
        board_id: req.body.board_id
    })

    try {
        await list.save();
        res.status(201).json(list)
    } catch (e) {
        res.status(400).send({ error: e.message })
        console.log(e)
    }
}

const showList = async (req, res) => {
    try {
        const list = await List.findById(req.params.id)
        res.json(list)

    } catch (e) {
        res.status(500).send({ error: e.message })
        console.log(e)
    }
}

const deleteList = async (req, res) => {
    try {
        await List.findByIdAndDelete(req.params.id)

        await Card.deleteMany({ list_id: req.params.id })
        res.status(204).send()

    } catch (e) {
        res.status(500).send({ error: e.message })
        console.log(e)
    }

}

const updateList = async (req, res) => {
    const values = {
        name: req.body.title
    }

    try {
        const list = await List.findByIdAndUpdate(req.params.id, values, { new: true, runValidators: true })
        res.status(200).json(list)

    } catch (e) {
        res.status(400).json({ 'error': e.message })
    }
}

const listsOptions = async (req, res) => {
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    res.setHeader("Allow", "GET, POST, OPTIONS").send()

}

const listOptions = async (req, res) => {
    res.setHeader("Access-Control-Allow-Methods", "GET, PUT, DELETE, OPTIONS")
    res.setHeader("Allow", "GET, PUT, DELETE, OPTIONS").send()
}

module.exports = {
    getLists,
    createList,
    showList,
    deleteList,
    updateList,
    listsOptions,
    listOptions,
    listExists
}