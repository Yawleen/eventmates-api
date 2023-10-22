const mongoose = require("mongoose");

const mediaSchema = new mongoose.Schema({
  url: {
    type: String,
  },
});

module.exports = mongoose.model("Media", mediaSchema);
