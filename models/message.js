const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require("./user");
require("./eventGroups");

const messageSchema = new mongoose.Schema({
  eventGroup: {
    type: Schema.Types.ObjectId,
    ref: "EventsGroups",
    required: true,
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Messages", messageSchema);
