const EventGroup = require("../models/eventGroups");

const addEventGroup = async (req, res) => {
  const { eventId, userId, name, description, maxCapacity } = req.query;

  if (userId && eventId && name && description && maxCapacity) {
    EventGroup.findOne({ event: eventId, creator: userId }).then((group) => {
      if (group) {
        res.status(500).send({
          success: false,
          message: "Tu as déjà créé un groupe pour cet événement.",
        });
        return;
      }

      EventGroup.findOne({
        event: eventId,
        users: userId,
      })
        .then((group) => {
          if (group) {
            res.status(500).send({
              success: false,
              message: "Tu fais déjà partie d'un groupe pour cet événement.",
            });
            return;
          }

          const newEventGroup = new EventGroup({
            event: eventId,
            creator: userId,
            name,
            maxCapacity,
            description,
            users: [userId],
          });

          newEventGroup
            .save()
            .then((createdGroup) => {
              res.status(200).send({
                success: true,
                message: `Ton groupe ${createdGroup.name} a bien été créé.`,
              });
            })
            .catch((error) => {
              res.status(500).send({
                success: false,
                message: "Ton groupe n'a pas pu être créé.",
                error,
              });
            });
        })
        .catch((error) => {
          res.status(500).send({
            success: false,
            message: "Une erreur est survenue.",
            error,
          });
        });
    });
    return;
  }

  res.status(500).send({
    success: false,
    message: "Ton groupe n'a pas pu être créé.",
  });
};

module.exports = { addEventGroup };