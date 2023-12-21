const Event = require("../models/event");

const getEvents = async (_, res) => {
  Event.find()
    .populate("genre")
    .exec()
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
      console.log(error)
    });
};

module.exports = { getEvents };
