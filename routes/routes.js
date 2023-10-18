const express = require("express");
const router = express.Router();

// Définition d'une route GET
router.get("/", (_, res) => {
  res.json({ message: "Hello world!" });
});


module.exports = router;
