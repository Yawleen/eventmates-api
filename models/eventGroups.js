const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require("./user");
require("./event");

const eventGroupsSchema = new mongoose.Schema({
  event: {
    type: Schema.Types.ObjectId,
    ref: "Events",
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: "Users",
  },
  name: {
    type: String,
    maxlength: 50,
    unique: true,
    required: [true, "Saisis un nom de groupe"],
  },
  maxCapacity: {
    type: Number,
    validate: {
      validator: (value) => value <= 8,
      message: "La capacité maximale est de 8 personnes.",
    },
    required: [true, "Sélectionne une capacité maximale."],
  },
  description: {
    type: String,
    maxlength: 280,
    required: [true, "Saisis une description."],
  },
  users: [
    {
      type: Schema.Types.ObjectId,
      ref: "Users",
      unique: true,
    },
  ],
});

module.exports = mongoose.model("EventsGroups", eventGroupsSchema);
