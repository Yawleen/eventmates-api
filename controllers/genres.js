const Genre = require("../models/genre");

const getGenres = async (_, res) => {
  Genre.find()
    .then((genres) => {
      res.status(200).send({
        genres,
      });
    })
    .catch((error) => {
      res.status(500).send({
        message: "Erreur lors de la récupération des genres.",
        error,
      });
    });
};

module.exports = { getGenres };
