const User = require("../models/user");

const logout = async (req, res) => {
  User.updateOne({ _id: req.user._id }, { online: false })
    .then(() => {
      res.status(200).send({
        message: "Tu t'es déconnecté(e) avec succès.",
      });
    })
    .catch((error) => {
      res.status(500).send({
        message:
          "Erreur lors de la mise à jour de l'état hors ligne de l'utilisateur.",
        error,
      });
    });
};

module.exports = { logout };
