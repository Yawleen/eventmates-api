const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authenticate = async (req, res, next) => {
  const token = await req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Authentification requise." });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findById(decodedToken.userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable." });
    }

    if (req.originalUrl === "/reset-password") {
      if (token !== user.resetToken) {
        return res
          .status(404)
          .json({ message: "Token de réinitialisation incorrect." });
      }
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token invalide.", error });
  }
};

module.exports = { authenticate };
