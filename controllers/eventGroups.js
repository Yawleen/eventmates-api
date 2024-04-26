const EventGroup = require("../models/eventGroups");

const addEventGroup = async (req, res) => {
  const { eventId, name, description, maxCapacity } = req.body;

  if (eventId && name && description && maxCapacity) {
    EventGroup.findOne({ event: eventId, creator: req.user._id }).then(
      (group) => {
        if (group) {
          res.status(500).send({
            success: false,
            message: "Tu as déjà créé un groupe pour cet événement.",
          });
          return;
        }

        EventGroup.findOne({
          event: eventId,
          users: req.user._id,
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
              creator: req.user._id,
              name,
              maxCapacity,
              description,
              users: [req.user._id],
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
      }
    );
    return;
  }

  res.status(500).send({
    success: false,
    message: "Ton groupe n'a pas pu être créé.",
  });
};

const isUserInGroup = async (req, res) => {
  const { eventId } = req.query;

  if (eventId) {
    EventGroup.findOne({
      event: eventId,
      users: req.user._id,
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

const getEventGroup = async (req, res) => {
  const { eventId } = req.query;

  if (eventId) {
    EventGroup.findOne({
      event: eventId,
      creator: req.user._id,
    })
      .populate("event creator users")
      .exec()
      .then((eventGroup) => {
        res.status(200).send({
          groupInfo: eventGroup,
        });
      })
      .catch((error) => {
        res.status(500).send({
          message:
            "Un problème s'est produit lors de la récupération des informations du groupe.",
          error,
        });
      });
    return;
  }

  res.status(500).send({
    message: "Impossible de récupérer les informations du groupe.",
  });
};

const getEventGroups = async (req, res) => {
  const page = req.query.page ? req.query.page : 1;
  const limit = 10;

  if (req.query.eventId) {
    const selectedEvent = {
      event: req.query.eventId,
    };

    const userGroup = await EventGroup.findOne({
      ...selectedEvent,
      creator: req.user._id,
    }).populate("event creator users");

    const count = await EventGroup.countDocuments(selectedEvent);

    const otherGroups = await EventGroup.find({
      ...selectedEvent,
      creator: { $ne: req.user._id },
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

const updateEventGroup = async (req, res) => {
  const { eventId, name, description, maxCapacity } = req.body;

  if (eventId && name && description && maxCapacity) {
    EventGroup.findOne({
      event: eventId,
      creator: req.user._id,
    })
      .then((group) => {
        if (maxCapacity >= group.users.length) {
          EventGroup.findOneAndUpdate(
            { event: eventId, creator: req.user._id },
            { name, description, maxCapacity },
            { new: true, runValidators: true }
          )
            .then((updatedGroup) => {
              res.status(200).send({
                success: true,
                updatedGroup,
                message: "Les informations du groupe ont bien été modifiées.",
              });
            })
            .catch((error) => {
              res.status(500).send({
                success: false,
                message:
                  "Un problème s'est produit lors de la mise à jour des informations du groupe.",
                error,
              });
            });

          return;
        }

        res.status(500).send({
          success: false,
          message: `La capacité maximale du groupe doit être supérieure ou égale à ${group.users.length}.`,
        });
      })
      .catch((error) => {
        res.status(500).send({
          success: false,
          message:
            "Un problème s'est produit lors de la mise à jour des informations du groupe.",
          error,
        });
      });
    return;
  }

  res.status(500).send({
    success: false,
    message:
      "Un problème s'est produit lors de la mise à jour des informations du groupe.",
  });
};

const deleteEventGroup = async (req, res) => {
  const { eventId } = req.body;

  if (eventId) {
    EventGroup.findOneAndDelete({
      event: eventId,
      creator: req.user._id,
    })
      .then((deletedGroup) => {
        res.status(500).send({
          success: true,
          message: `Ton groupe ${deletedGroup.name} a bien été supprimé.`,
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

  res.status(500).send({
    success: false,
    message: "Un problème s'est produit lors de la suppression du groupe.",
  });
};

const kickUser = async (req, res) => {
  const { eventId, userToKickId } = req.body;

  if (eventId && userToKickId) {
    EventGroup.findOneAndUpdate(
      { creator: req.user._id, event: eventId, users: userToKickId },
      { $pull: { users: userToKickId } }
    )
      .populate("users")
      .exec()
      .then((eventGroup) => {
        res.status(200).send({
          success: true,
          message: `${
            eventGroup.users.find((user) => user._id.toString() == userToKickId)
              .username
          } a bien été exclu(e) de ton groupe.`,
        });
      })
      .catch((error) => {
        res.status(500).send({
          success: false,
          message:
            "Une erreur est survenue lors de la tentative d'exclusion de l'utilisateur.",
          error,
        });
      });
    return;
  }

  res.status(500).send({
    success: false,
    message: "Impossible d'exclure l'utilisateur sélectionné.",
  });
};

module.exports = {
  addEventGroup,
  isUserInGroup,
  getEventGroups,
  updateEventGroup,
  deleteEventGroup,
  kickUser,
  getEventGroup,
};
