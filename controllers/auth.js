const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");

// Inscription d'un nouvel utilisateur
const register = async (req, res) => {
  const { username, firstName, lastName, email, password, birthdate, gender } =
    req.body;

  bcrypt
    .hash(password, 10)
    .then((hashedPassword) => {
      const user = new User({
        username,
        firstName,
        lastName,
        email,
        password: hashedPassword,
        birthdate,
        gender,
      });

      user
        .save()
        .then((user) => {
          const token = jwt.sign(
            {
              userId: user._id,
              userEmail: user.email,
            },
            process.env.SECRET_KEY,
            { expiresIn: "1h" }
          );

          res.status(200).send({
            message: "Ton compte a bien été créé.",
            token,
          });
        })
        .catch((error) => {
          res.status(500).send({
            message: "Ton compte n'a pas pu être créé. 😕",
            error,
          });
        });
    })
    .catch((error) => {
      res.status(500).send({
        message: "Le mot de passe n'a pas été haché avec succès.",
        error,
      });
    });
};

// Connexion d'un utilisateur existant
const login = async (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      bcrypt
        .compare(password, user.password)
        .then((passwordCheck) => {
          if (!passwordCheck) {
            return res.status(400).send({
              message: "Tes identifiants sont incorrects. 😕",
              error,
            });
          }

          const token = jwt.sign(
            {
              userId: user._id,
              userEmail: user.email,
            },
            process.env.SECRET_KEY,
            { expiresIn: "1h" }
          );

          res.status(200).send({
            message: "Tu t'es connecté(e) avec succès ! 🤘",
            token,
          });
        })
        .catch((error) => {
          res.status(400).send({
            message: "Tes identifiants sont incorrects. 😕",
            error,
          });
        });
    })
    .catch((error) => {
      res.status(404).send({
        message: "Aucun compte n'est associé à cette adresse mail. 😕",
        error,
      });
    });
};

module.exports = { register, login };
