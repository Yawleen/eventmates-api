require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const root = require("./routes/root");
const auth = require("./routes/auth");
const logout = require("./routes/logout");
const forgotPassword = require("./routes/forgotPassword");
const resetPassword = require("./routes/resetPassword");
const events = require("./routes/events");
const genres = require("./routes/genres");
const userEvents = require("./routes/userEvents");
const isAnUserEvent = require("./routes/isAnUserEvent");
const eventGroups = require("./routes/eventGroups");
const isUserInGroup = require("./routes/isUserInGroup");
const kickUser = require("./routes/kickUser");
const eventGroup = require("./routes/eventGroup");
const banUser = require("./routes/banUser");
const joinGroup = require("./routes/joinGroup");
const db = require("./services/db");

// Configuration de l'application
const app = express();
const port = process.env.PORT || 3000; // Port d'écoute par défaut

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

// Définition des routes de l'API
app.use("/", root);
app.use("/auth", auth);
app.use("/logout", logout);
app.use("/forgot-password", forgotPassword);
app.use("/reset-password", resetPassword);
app.use("/events", events);
app.use("/genres", genres);
app.use("/user-events", userEvents);
app.use("/is-an-user-event", isAnUserEvent);
app.use("/event-groups", eventGroups);
app.use("/is-user-in-group", isUserInGroup);
app.use("/kick-user", kickUser);
app.use("/event-group", eventGroup);
app.use("/ban-user", banUser);
app.use("/join-group", joinGroup);

// Gestion des erreurs
app.use((req, res, next) => {
  const error = new Error("Ressource introuvable.");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    message: error.message,
    error,
  });
});

db.on("error", (err) => {
  console.error("Erreur de connexion à la base de données :", err);
});
db.once("open", () => {
  console.log("Connexion à la base de données établie");
  app.listen(port, () => {
    console.log(`Serveur écoutant sur le port ${port}`);
  });
});
