const mongoose = require('mongoose')
const { Schema } = mongoose;
// Define schema


const ListSchema = new Schema({
  name: { type: String },
  cards: [{ type: Schema.Types.ObjectId, ref: 'Card' }]
});



// Compile model from schema
module.exports = mongoose.model("List", ListSchema);