// A model for Mongoose

const mongoose = require("mongoose");

// const bookSchema = new mongoose.Schema({
//   title: String,
//   release: Number,
// });

const schema = new mongoose.Schema({
  word: {
    type: String,
    lowercase: true,
    required: true,
    unique: true
  },
  tweeted: {
    type: Number,
    default: 0,
    min: 0
  }
});

const Normal = mongoose.model("Normal", schema);

module.exports = Normal;
