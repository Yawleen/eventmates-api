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
          message: "Aucun utilisateur n'a été trouvé.",
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

const isAnUserEvent = async (req, res) => {
  const { userId, eventId } = req.query;

  if (userId && eventId) {
    UserEvents.findOne({ user: userId, events: eventId })
      .exec()
      .then((userEvent) => {
        if (userEvent) {
          res.status(200).send({
            isParticipant: true,
          });
          return;
        }

        res.status(500).send({
          isParticipant: false,
        });
      })
      .catch((error) => {
        res.status(500).send({
          message: "Impossible de vérifier ta participation à l'événement.",
          error,
        });
      });
    return;
  }

  res.status(500).send({
    message: "Impossible de vérifier ta participation à l'événement.",
  });
};

const deleteUserEvent = async (req, res) => {
  const { userId, eventId } = req.body;

  if (userId && eventId) {
    UserEvents.findOne({ user: userId })
      .then((user) => {
        if (!user) {
          res.status(500).send({
            success: false,
            message: "Aucun utilisateur n'a été trouvé.",
          });
          return;
        }

        const updatedEvents = user.events.filter(
          (event) => event.toString() !== eventId
        );

        user.events = updatedEvents;
        user.save().then(() =>
          res.status(200).send({
            success: true,
            message: "Tu ne participes plus à cet événement.",
          })
        );
      })
      .catch((error) => {
        res.status(500).send({
          success: false,
          message: "Impossible de prendre en compte ta demande de suppression.",
          error,
        });
      });
    return;
  }

  res.status(500).send({
    success: false,
    message: "Impossible de prendre en compte ta demande de suppression.",
  });
};

module.exports = { addUserEvent, isAnUserEvent, deleteUserEvent };
