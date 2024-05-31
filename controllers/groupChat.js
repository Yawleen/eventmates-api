const EventGroup = require("../models/eventGroups");

const getCreatedGroupChat = async (req, res) => {
  const page = req.query.page ? req.query.page : 1;
  const limit = 10;

  const search = {
    creator: req.user._id,
  };

  try {
    const createdGroups = await EventGroup.find(search)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("event users");

    const count = await EventGroup.countDocuments(search);

    console.log(createdGroups.length, count);
    res.status(200).send({
      createdGroups,
      nbOfGroups: count,
      currentPage: page,
      totalPage: Math.ceil(count / limit),
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

  const search = { creator: { $ne: req.user._id }, users: req.user._id };

  try {
    const joinedGroups = await EventGroup.find(search)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("event users");

    const count = await EventGroup.countDocuments(search);

    res.status(200).send({
      joinedGroups,
      nbOfGroups: count,
      currentPage: page,
      totalPage: Math.ceil(count / limit),
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
