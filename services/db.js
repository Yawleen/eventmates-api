const mongoose = require("mongoose");

// Connexion à la base de données
mongoose.connect(
  `mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@${process.env.CLUSTER_NAME}.${process.env.SERVICE_ID}.mongodb.net/?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// Export de la connexion pour pouvoir l'utiliser ailleurs
module.exports = mongoose.connection;
