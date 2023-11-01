const mongoose = require("mongoose");
const validator = require("validator");
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    trim: true,
    required: [true, "Saisis un pseudo."],
    unique: [true, "Le pseudo saisi existe déjà."],
  },
  firstName: {
    type: String,
    validate: {
      validator: (value) => /^[a-zA-Z]{2,}$/.test(value),
      message: "Le prénom doit contenir au moins 2 caractères alphabétiques.",
    },
    trim: true,
    required: [true, "Saisis ton prénom."],
  },
  lastName: {
    type: String,
    validate: {
      validator: (value) => /^[a-zA-Z]{2,}$/.test(value),
      message:
        "Le nom de famille doit contenir au moins 2 caractères alphabétiques.",
    },
    trim: true,
    required: [true, "Saisis ton nom de famille."],
  },
  email: {
    type: String,
    unique: [true, "L'adresse mail saisie existe déjà."],
    lowercase: true,
    validate: {
      validator: (value) => validator.isEmail(value),
      message: "L'adresse mail saisie est invalide.",
    },
    trim: true,
    required: [true, "Saisis une adresse mail."],
  },
  password: {
    type: String,
    required: [true, "Saisis un mot de passe."],
  },
  birthdate: { type: Date, required: true },
  gender: { type: String, enum: ["h", "f", "n"], required: true },
  description: { type: String, maxlength: 200, default: null },
  media: {
    type: Schema.Types.ObjectId,
    ref: "Media",
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: { type: Date, default: Date.now },
  facebook: { type: String, default: null },
  instagram: { type: String, default: null },
  twitter: { type: String, default: null },
  online: { type: Boolean, default: false },
  resetToken: { type: String },
});

module.exports = mongoose.model("Users", userSchema);
