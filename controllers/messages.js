const Message = require("../models/message");
const EventGroup = require("../models/eventGroups");


const getGroupMessages = async (req, res) => {
  const page = req.query.page ? req.query.page : 1;
  const limit = 10;
  const eventGroupId = req.query.eventGroupId;

  if (eventGroupId) {
    EventGroup.findOne({
      _id: eventGroupId,
      users: "65c23d2a96ff5c00b6060792", // req.user._id
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
            message: "Tu ne peux pas accéder aux messages de ce groupe car tu n'en fais pas partie.",
            error,
          });
      });
    const count = await Message.countDocuments();
  }
};

module.exports = { getGroupMessages };
