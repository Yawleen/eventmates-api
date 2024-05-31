const EventGroup = require("../models/eventGroups");

const getCreatedGroupChat = async (req, res) => {
  const page = req.query.page ? req.query.page : 1;
  const limit = 10;

  try {
    const createdGroups = await EventGroup.find({
      creator: req.user._id,
    })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("event users");

    res.status(200).send({
      createdGroups,
      nbOfGroups: createdGroups.length,
      currentPage: page,
      totalPage: Math.ceil(createdGroups.length / limit),
    });
  } catch (error) {
    res.status(500).send({
      message: "Impossible de récupérer les groupes de chat que tu as créés.",
      error,
    });
  }
};

const getJoinedGroupChat = async (req, res) => {
  const page = req.query.page ? req.query.page : 1;
  const limit = 10;

  try {
    const joinedGroups = await EventGroup.find({
      creator: { $ne: req.user._id },
      users: req.user._id,
    })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("event users");

    res.status(200).send({
      joinedGroups,
      nbOfGroups: joinedGroups.length,
      currentPage: page,
      totalPage: Math.ceil(joinedGroups.length / limit),
    });
  } catch (error) {
    res.status(500).send({
      message:
        "Impossible de récupérer les groupes de chat que tu as rejoints.",
      error,
    });
  }
};

module.exports = { getCreatedGroupChat, getJoinedGroupChat };
