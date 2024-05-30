const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");

// Inscription d'un nouvel utilisateur
const register = async (req, res) => {
  const { username, firstName, lastName, email, password, birthdate, gender } =
    req.body;

  if (password.length < 8) {
    res.status(400).send({
      message: "Le mot de passe doit contenir au moins 8 caractères.",
    });
    return;
  }

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
        online: true,
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
          if (error.code === 11000) {
            switch (Object.keys(error.keyPattern)[0]) {
              case "username":
                res.status(500).send({
                  message: "Le pseudo saisi existe déjà.",
                  error,
                });
                break;

              case "email":
                res.status(500).send({
                  message: "L'adresse mail saisie existe déjà.",
                  error,
                });
                break;

              default:
                res.status(500).send({
                  message: "Ton compte n'a pas pu être créé.",
                  error,
                });
                break;
            }
          } else {
            res.status(500).send({
              message: "Ton compte n'a pas pu être créé.",
              error,
            });
          }
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
              message: "Tes identifiants sont incorrects.",
              error,
            });
          }

          user.online = true;

          const token = jwt.sign(
            {
              userId: user._id,
              userEmail: user.email,
            },
            process.env.SECRET_KEY,
            { expiresIn: "1h" }
          );

          user
            .save()
            .then(() => {
              res.status(200).send({
                message: "Tu t'es connecté(e) avec succès.",
                token,
              });
            })
            .catch((error) => {
              res.status(500).send({
                message: "Erreur lors de la mise à jour de l'état en ligne.",
                error,
              });
            });
        })
        .catch((error) => {
          res.status(400).send({
            message: "Tes identifiants sont incorrects.",
            error,
          });
        });
    })
    .catch((error) => {
      res.status(404).send({
        message: "Aucun compte n'est associé à cette adresse mail.",
        error,
      });
    });
};

const isUserOnline = async (req, res) => {
  const { userId } = req.body;

  User.findOne({ _id: userId, online: true })
    .then((user) => {
      if (user) {
        res.status(200).send({
          isOnline: true,
        });
        return;
      }

      res.status(200).send({
        isOnline: false,
      });
    })
    .catch((error) => {
      res.status(404).send({
        isOnline: false,
        message: "Impossible de vérifier si l'utilisateur est en ligne",
        error,
      });
    });
};

module.exports = { register, login, isUserOnline };
