const UserEvents = require("../models/userEvents");
const User = require("../models/user");
const Event = require("../models/event");
const EventGroup = require("../models/eventGroups");

const addUserEvent = async (req, res) => {
  const { eventId } = req.body;

  if (eventId) {
    User.findOne({ _id: req.user._id })
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
  const { eventId } = req.query;

  if (eventId) {
    UserEvents.findOne({ user: req.user._id, events: eventId })
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
  const { eventId } = req.body;

  if (eventId) {
    UserEvents.findOne({ user: req.user._id, events: eventId })
      .then((user) => {
        if (!user) {
          res.status(500).send({
            success: false,
            message: "Tu ne participes pas à cet événement.",
          });
          return;
        }

        EventGroup.findOne({
          event: eventId,
          users: req.user._id,
        })
          .then((userGroup) => {
            if (userGroup) {
              if (req.user._id == userGroup.creator._id) {
                Event.findOneAndUpdate(
                  { _id: eventId },
                  { $inc: { createdGroupsTotal: -1 } }
                )
                  .then(() => {
                    EventGroup.deleteOne({
                      _id: userGroup._id,
                    })
                      .then(() => {
                        const updatedEvents = user.events.filter(
                          (event) => event.toString() !== eventId
                        );

                        user.events = updatedEvents;
                        user
                          .save()
                          .then(() =>
                            res.status(200).send({
                              success: true,
                              message: `Tu ne participes plus à cet événement et ton groupe ${userGroup.name} a été supprimé.`,
                            })
                          )
                          .catch((error) => {
                            res.status(500).send({
                              success: false,
                              message:
                                "Impossible de prendre en compte ta demande de suppression.",
                              error,
                            });
                          });
                      })
                      .catch((error) => {
                        res.status(500).send({
                          success: false,
                          message:
                            "Un problème s'est produit lors de la suppression du groupe.",
                          error,
                        });
                      });
                  })
                  .catch((error) => {
                    res.status(500).send({
                      success: false,
                      message:
                        "Un problème s'est produit lors de la suppression du groupe.",
                      error,
                    });
                  });
                return;
              }

              const updatedUsers = userGroup.users.filter(
                (user) => user.toString() !== req.user._id
              );

              userGroup.users = updatedUsers;
              userGroup
                .save()
                .then(() => {
                  const updatedEvents = user.events.filter(
                    (event) => event.toString() !== eventId
                  );

                  user.events = updatedEvents;
                  user
                    .save()
                    .then(() =>
                      res.status(200).send({
                        success: true,
                        message: `Tu ne participes plus à cet événement et tu ne fais plus partie du groupe ${userGroup.name}.`,
                      })
                    )
                    .catch((error) => {
                      res.status(500).send({
                        success: false,
                        message:
                          "Impossible de prendre en compte ta demande de suppression.",
                        error,
                      });
                    });
                })
                .catch((error) => {
                  res.status(500).send({
                    success: false,
                    message:
                      "Impossible de prendre en compte ta demande de suppression.",
                    error,
                  });
                });
              return;
            }

            const updatedEvents = user.events.filter(
              (event) => event.toString() !== eventId
            );

            user.events = updatedEvents;
            user
              .save()
              .then(() =>
                res.status(200).send({
                  success: true,
                  message: "Tu ne participes plus à cet événement.",
                })
              )
              .catch((error) => {
                res.status(500).send({
                  success: false,
                  message:
                    "Impossible de prendre en compte ta demande de suppression.",
                  error,
                });
              });
          })
          .catch((error) => {
            res.status(500).send({
              message: "Impossible de vérifier ton appartenance à un groupe.",
              error,
            });
          });
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
