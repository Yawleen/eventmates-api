const Event = require("../models/event");
const Genre = require("../models/genre");

const getEvents = async (req, res) => {
  const page = req.query.page ? req.query.page : 1;
  const limit = 10;
  let search = {};

  if (req.query.eventName) {
    search = {
      name: new RegExp(
        ["^", req.query.eventName.trim().replace(/\s{2,}/g, " ")].join(""),
        "i"
      ),
    };
  }

  if (req.query.genres) {
    search = {
      ...search,
      genre: {
        $in: await Genre.find(
          {
            name: {
              $in: req.query.genres.split(","),
            },
          },
          "_id"
        ),
      },
    };
  }

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
        totalPage: Math.ceil(count / limit),
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
