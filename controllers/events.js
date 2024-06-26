const Event = require("../models/event");
const Genre = require("../models/genre");

const getEvents = async (req, res) => {
  const page = req.query.page ? req.query.page : 1;
  const limit = 10;
  const currentDate = new Date();
  let search = { "dates.start.dateTime": { $gte: currentDate } };
  let sort = { "priceRanges.min": 1, _id: 1 };

  if (req.query.eventName) {
    search = {
      ...search,
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

  if (req.query.date) {
    const selectedDate = new Date(req.query.date);
    search = {
      ...search,
      "dates.start.dateTime": {
        $gte: selectedDate.setHours(0, 0, 0, 0),
        $lte: selectedDate.setHours(23, 59, 59, 999),
      },
    };
  }

  if (req.query.sort) {
    switch (req.query.sort) {
      case "ascPrice":
        sort = { "priceRanges.min": 1, _id: 1 };
        break;

      case "descPrice":
        sort = { "priceRanges.min": -1, _id: -1 };
        break;

      case "ascStartDate":
        sort = { "dates.start.dateTime": 1, _id: -1 };
        break;

      case "descStartDate":
        sort = { "dates.start.dateTime": -1, _id: -1 };
        break;

      default:
        break;
    }
  }

  const count = await Event.countDocuments(search);

  Event.find(search)
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit)
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
    });
};

module.exports = { getEvents };
