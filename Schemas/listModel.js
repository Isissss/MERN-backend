const mongoose = require('mongoose')

// Define schema
const Schema = mongoose.Schema;

const ListSchema = new Schema({
  name: String,
});

// Compile model from schema
module.exports = mongoose.model("List", ListSchema);