const Message = require("../models/message");
const EventGroup = require("../models/eventGroups");

const getGroupMessages = async (req, res) => {
  const page = req.query.page ? req.query.page : 1;
  const limit = 10;
  const eventGroupId = req.query.eventGroupId;

  if (eventGroupId) {
    const count = await Message.countDocuments({ eventGroup: eventGroupId });

    EventGroup.findOne({
      _id: eventGroupId,
      users: req.user._id,
    })
      .then(() => {
        Message.find({ eventGroup: eventGroupId })
          .sort({ timestamp: 1, _id: -1 })
          .skip((page - 1) * limit)
          .limit(limit)
          .populate("sender")
          .exec()
          .then((messages) => {
            res.status(200).send({
              messages,
              nbOfMessages: count,
              currentPage: page,
              totalPage: Math.ceil(count / limit),
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
