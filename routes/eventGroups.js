const express = require("express");
const router = express.Router();

const { authenticate } = require("../middlewares/auth");
const {
  addEventGroup,
  getEventGroups,
  updateEventGroup,
  deleteEventGroup
} = require("../controllers/eventGroups");

router.post("/", authenticate, addEventGroup);
router.get("/", authenticate, getEventGroups);
router.put("/", authenticate, updateEventGroup);
router.delete("/", authenticate, deleteEventGroup);

module.exports = router;
