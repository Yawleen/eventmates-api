const EventGroup = require("../models/eventGroups");
const Event = require("../models/event");

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

            Event.findOneAndUpdate(
              { _id: eventId },
              { $inc: { createdGroupsTotal: 1 } }
            )
              .then(() => {
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

        res.status(200).send({
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
  const { eventGroupId } = req.query;

  if (eventGroupId) {
    EventGroup.findOne({
      _id: eventGroupId,
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

    const otherGroups = await EventGroup.find({
      ...selectedEvent,
      creator: { $ne: req.user._id },
      bannedUsers: { $ne: req.user._id },
    })
      .limit(limit - 1)
      .skip((page - 1) * limit)
      .populate("event creator users");

    const availableGroups = otherGroups.filter(
      (group) => group.users.length < group.maxCapacity
    );

    const groups = userGroup
      ? [userGroup, ...availableGroups]
      : availableGroups;

    res.status(200).send({
      groups,
      nbOfGroups: groups.length,
      currentPage: page,
      totalPage: Math.ceil(groups.length / limit),
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
    Event.findOneAndUpdate(
      { _id: eventId },
      { $inc: { createdGroupsTotal: -1 } }
    )
      .then(() => {
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

const banUser = async (req, res) => {
  const { eventId, userToBanId } = req.body;

  if (eventId && userToBanId) {
    EventGroup.findOneAndUpdate(
      { creator: req.user._id, event: eventId, users: userToBanId },
      { $pull: { users: userToBanId }, $addToSet: { bannedUsers: userToBanId } }
    )
      .populate("users")
      .exec()
      .then((eventGroup) => {
        res.status(200).send({
          success: true,
          message: `${
            eventGroup.users.find((user) => user._id.toString() == userToBanId)
              .username
          } a bien été banni(e) de ton groupe.`,
        });
      })
      .catch((error) => {
        res.status(500).send({
          success: false,
          message:
            "Une erreur est survenue lors de la tentative de bannissement de l'utilisateur.",
          error,
        });
      });
    return;
  }

  res.status(500).send({
    success: false,
    message: "Impossible de bannir l'utilisateur sélectionné.",
  });
};

const joinEventGroup = async (req, res) => {
  const { eventGroupId, eventId } = req.body;

  if (eventGroupId && eventId) {
    EventGroup.findOne({
      event: eventId,
      users: req.user._id,
    })
      .populate("event")
      .exec()
      .then((userGroup) => {
        if (userGroup) {
          res.status(500).send({
            success: false,
            message: `Tu fais déjà partie du groupe ${userGroup.name} pour l'événement ${userGroup.event.name}.`,
          });
          return;
        }

        EventGroup.findOne({ _id: eventGroupId })
          .then((eventGroup) => {
            if (eventGroup.users.length + 1 > eventGroup.maxCapacity) {
              res.status(500).send({
                success: false,
                message: "Ce groupe a atteint sa capacité maximale.",
              });
              return;
            }

            const updatedUsers = [...eventGroup.users, req.user._id];

            eventGroup.users = updatedUsers;

            eventGroup
              .save()
              .then(() => {
                res.status(200).send({
                  success: true,
                  message: `Tu fais désormais partie du groupe ${eventGroup.name}.`,
                });
              })
              .catch((error) => {
                res.status(500).send({
                  success: false,
                  message:
                    "Un problème s'est produit lors de la tentative d'adhésion au groupe.",
                  error,
                });
              });
          })
          .catch((error) => {
            res.status(500).send({
              message: "Aucun groupe d'événement n'a été trouvé.",
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
    return;
  }

  res.status(500).send({
    success: false,
    message:
      "Un problème s'est produit lors de la tentative d'adhésion au groupe.",
  });
};

const leaveEventGroup = async (req, res) => {
  const { eventGroupId } = req.body;

  if (eventGroupId) {
    EventGroup.findOneAndUpdate(
      {
        _id: eventGroupId,
        creator: { $ne: req.user._id },
        users: req.user._id,
      },
      { $pull: { users: req.user._id } }
    )
      .then((eventGroup) => {
        res.status(200).send({
          success: true,
          message: `Tu as bien quitté le groupe ${eventGroup.name}.`,
        });
      })
      .catch((error) => {
        res.status(500).send({
          success: false,
          message:
            "Un problème est survenu lors de la tentative de sortie du groupe.",
          error,
        });
      });
    return;
  }

  res.status(500).send({
    success: false,
    message: "Impossible d'effectuer cette action.",
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
  banUser,
  joinEventGroup,
  leaveEventGroup,
};
