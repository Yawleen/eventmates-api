const mongoose = require("mongoose");

const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true
  },
  color: {
    type: String,
  },
});

module.exports = mongoose.model("Genres", genreSchema);
