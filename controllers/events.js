const Event = require("../models/event");

const getEvents = async (req, res) => {
  const page = req.query.page ? req.query.page : 1;
  const limit = 10;
  const search = req.query.eventName ? { name: new RegExp(["^", req.query.eventName.trim().replace(/\s{2,}/g, " ")].join(""), "i") } : {};

  const count = await Event.countDocuments(search);
  
  Event.find(search)
    .limit(limit)
    .skip((page - 1) * limit)
    .populate("genre")
    .exec()
    .then((events) => {
      res.status(200).send({
        events,
        nbOfEvents: count,
        currentPage: page,
        totalPage: Math.ceil(count / limit)
      });
    })
    .catch((error) => {
      res.status(500).send({
        message: "Erreur lors de la récupération des événements.",
        error,
      });
      console.log(error);
    });
};

module.exports = { getEvents };
