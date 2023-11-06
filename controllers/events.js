const Event = require("../models/event");

const getEvents = async (req, res) => {
  Event.find()
    .then((events) => {
      res.status(200).send({
        events,
      });
    })
    .catch((error) => {
      res.status(500).send({
        message: "Erreur lors de la récupération des événements.",
        error,
      });
    });
};

module.exports = { getEvents };
