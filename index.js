require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const root = require("./routes/root");
const db = require("./services/db");

// Configuration de l'application
const app = express();
const port = process.env.PORT || 3000; // Port d'écoute par défaut

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Définition des routes de l'API
app.use("/", root); // Utilisation des routes API définies dans le fichier routes.js

// Gestion des erreurs
app.use((req, res, next) => {
  const erreur = new Error("Not Found");
  erreur.status = 404;
  next(erreur);
});

app.use((erreur, req, res, next) => {
  res.status(erreur.status || 500);
  res.json({
    message: erreur.message,
    erreur: erreur,
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
