const bcrypt = require("bcrypt");
const User = require("../models/user");

// Réinitialisation d'un mot de passe
const resetPassword = async (req, res) => {
  const { newPassword } = req.body;

  if (newPassword.length < 8) {
    res.status(400).send({
      message: "Le mot de passe doit contenir au moins 8 caractères.",
    });
    return;
  }

  bcrypt
    .hash(newPassword, 10)
    .then((hashedPassword) => {
      User.updateOne({ _id: req.user._id }, { password: hashedPassword })
        .then(() => {
          res.status(200).send({
            message: "Ton mot de passe a été mis à jour avec succès.",
          });
        })
        .catch((error) => {
          res.status(500).send({
            message:
              "Un problème s'est produit lors de la mise à jour du mot de passe.",
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

module.exports = { resetPassword };
