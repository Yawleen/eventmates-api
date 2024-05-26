const Message = require("../models/message");
const EventGroup = require("../models/eventGroups");

const getGroupMessages = async (req, res) => {
  const { eventGroupId } = req.query;

  if (eventGroupId) {
    EventGroup.findOne({
      _id: eventGroupId,
      users: req.user._id,
    })
      .then(() => {
        Message.find({ eventGroup: eventGroupId })
          .sort({ timestamp: 1, _id: -1 })
          .populate("sender", "username online")
          .exec()
          .then((messages) => {
            res.status(200).send({
              messages,
            });
          })
          .catch((error) => {
            res.status(500).send({
              message: "Erreur lors de la récupération des messages.",
              error,
            });
          });
      })
      .catch((error) => {
        res.status(500).send({
          message:
            "Tu ne peux pas accéder aux messages de ce groupe car tu n'en fais pas partie.",
          error,
        });
      });
  }
};

module.exports = { getGroupMessages };
