const EventGroup = require("../models/eventGroups");

const addEventGroup = async (req, res) => {
  const { eventId, userId, name, description, maxCapacity } = req.body;

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

const isUserInGroup = async (req, res) => {
  const { userId, eventId } = req.query;

  if (userId && eventId) {
    EventGroup.findOne({
      event: eventId,
      users: userId,
    })
      .then((userGroup) => {
        if (userGroup) {
          res.status(200).send({
            isMember: true,
          });
          return;
        }

        res.status(500).send({
          isMember: false,
        });
      })
      .catch((error) => {
        res.status(500).send({
          message: "Impossible de vérifier ton appartenance à un groupe.",
          error,
        });
      });
    return;
  }

  res.status(500).send({
    message: "Impossible de vérifier ton appartenance à un groupe.",
  });
};

const getEventGroups = async (req, res) => {
  const page = req.query.page ? req.query.page : 1;
  const limit = 10;

  if (req.query.eventId && req.query.userId) {
    const selectedEvent = {
      event: req.query.eventId,
    };
    const userId = req.query.userId;

    const userGroup = await EventGroup.findOne({
      ...selectedEvent,
      creator: userId,
    }).populate("event creator users");

    const count = await EventGroup.countDocuments(selectedEvent);

    const otherGroups = await EventGroup.find({
      ...selectedEvent,
      creator: { $ne: userId },
    })
      .limit(limit - 1)
      .skip((page - 1) * limit)
      .populate("event creator users");

    const groups = userGroup ? [userGroup, ...otherGroups] : otherGroups;

    res.status(200).send({
      groups,
      nbOfGroups: count,
      currentPage: page,
      totalPage: Math.ceil(count / limit),
    });
    return;
  }

  res.status(500).send({
    message: "Impossible de récupérer les groupes créés pour cet événement.",
  });
};

module.exports = { addEventGroup, isUserInGroup, getEventGroups };
