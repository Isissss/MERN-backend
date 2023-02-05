const mongoose = require('mongoose')
const { Schema } = mongoose;
// Define schema


const ListSchema = new Schema({
  name: { type: String }
});



// Compile model from schema
module.exports = mongoose.model("List", ListSchema);