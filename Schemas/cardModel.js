const mongoose = require('mongoose')

// Define schema
const Schema = mongoose.Schema;

const CardSchema = new Schema({
  title: String,
  body: String,
  list_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'List'
}
});

// Compile model from schema
module.exports = mongoose.model("Card", CardSchema);