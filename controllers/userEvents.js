const UserEvents = require("../models/userEvents");
const User = require("../models/user");
const Event = require("../models/event");

const addUserEvent = async (req, res) => {
  const { userId, eventId } = req.body;

  if (userId && eventId) {
    User.findOne({ _id: userId })
      .then((user) => {
        Event.findOne({ _id: eventId })
          .then((event) => {
            UserEvents.findOneAndUpdate(
              { user: user },
              { $addToSet: { events: event } },
              { upsert: true, new: true }
            )
              .then(() => {
                res.status(200).send({
                  success: true,
                  message: "Tu participes désormais à cet événement.",
                });
              })
              .catch((error) => {
                res.status(500).send({
                  success: false,
                  message: "Impossible de prendre en compte ta participation.",
                  error,
                });
              });
          })
          .catch((error) => {
            res.status(500).send({
              message: "Aucun événement n'a été trouvé.",
              error,
            });
          });
      })
      .catch((error) => {
        res.status(400).send({
          message: "Aucun utilisateur n'a été retrouvé.",
          error,
        });
      });
    return;
  }

  res.status(500).send({
    success: false,
    message: "Impossible de prendre en compte ta participation.",
  });
};

module.exports = { addUserEvent };
