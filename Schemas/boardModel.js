const mongoose = require('mongoose')
const List = require('./listModel')
// Define schema
const Schema = mongoose.Schema;

const BoardSchema = new Schema({
    name: { type: String, required: true },
    owner_id: { type: Schema.Types.ObjectId, ref: 'User' },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, {
    toJSON: { virtuals: true },
    validationLevel: "moderate"
});

BoardSchema.virtual('_links').get(function () {
    return {
        self: {
            href: `http://localhost:8000/boards/${this.id}`
        }
    }
});

module.exports = mongoose.model("Board", BoardSchema);