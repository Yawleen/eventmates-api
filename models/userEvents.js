const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require("./user");
require("./event");

const userEventsSchema = new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    unique: true,
  },
  events: [
    {
      type: Schema.Types.ObjectId,
      ref: "Events",
      unique: true,
    },
  ],
});

module.exports = mongoose.model("UsersEvents", userEventsSchema);
