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
    maxlength: [50, "Le nom de groupe ne peut pas dépasser 50 caractères."],
    required: [true, "Saisis un nom de groupe"],
  },
  maxCapacity: {
    type: Number,
    validate: {
      validator: (value) => value >= 2 && value <= 8,
      message:
        "La capacité maximale de personnes doit être comprise entre 2 et 8.",
    },
    required: [true, "Sélectionne une capacité maximale."],
  },
  description: {
    type: String,
    maxlength: [280, "La description ne peut pas dépasser 280 caractères."],
    required: [true, "Saisis une description."],
  },
  users: [
    {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
  ],
});

module.exports = mongoose.model("EventsGroups", eventGroupsSchema);
