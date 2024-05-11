const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require("./user");
require("./event");

const userEventsSchema = new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "Users",
  },
  events: [
    {
      type: Schema.Types.ObjectId,
      ref: "Events",
    },
  ],
});

module.exports = mongoose.model("UsersEvents", userEventsSchema);
