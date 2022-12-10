const mongoose = require('mongoose')

// Define schema
const Schema = mongoose.Schema;

const CardSchema = new Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  author: { type: String, required: true },
  list_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'List'
  },
  category: { type: String, required: true },
  severity: { type: String, required: true },
  location: { type: String, required: true }
}, {
  toJSON: { virtuals: true },
  validationLevel: "moderate"
});

CardSchema.virtual('_links').get(function () {
  return {
    self: {
      href: `${process.env.BASE_URI}${this.id}`
    },
    collection: {
      href: `${process.env.BASE_URI}`
    },
  }
});

module.exports = mongoose.model("Card", CardSchema);