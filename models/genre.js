const mongoose = require("mongoose");

const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true
  },
  color: {
    type: String,
    unique: true
  },
});

module.exports = mongoose.model("Genres", genreSchema);
