const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    trim: true,
    required: [true, "Saisis un pseudo."],
    unique: [true, "Le pseudo saisi existe déjà."],
  },
  firstName: {
    type: String,
    trim: true,
    required: [true, "Saisis ton prénom."],
  },
  lastName: {
    type: String,
    trim: true,
    required: [true, "Saisis ton nom de famille."],
  },
  email: {
    type: String,
    unique: [true, "L'adresse mail saisie existe déjà."],
    lowercase: true,
    trim: true,
    required: [true, "Saisis une adresse mail."],
  },
  password: {
    type: String,
    required: [true, "Saisis un mot de passe."],
  },
  birthdate: { type: Date, required: true },
  gender: { type: String, enum: ["h", "f", "n"], required: true },
  description: { type: String, maxlength: 200 },
  media: {
    mimeType: {
      type: String,
    },
    url: {
      type: String,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: { type: Date, default: Date.now },
  facebook: { type: String },
  instagram: { type: String },
  twitter: { type: String },
  online: { type: Boolean, default: false },
});

module.exports = mongoose.model("Users", userSchema);
