const express = require("express");
const router = express.Router();

router.get("/", (_, res) => {
  res.json({ message: "Hello world!" });
});


module.exports = router;
