const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

// Envoi d'un token de réinitialisation
const sendEmail = async (req, res) => {
  const { email } = req.body;

  User.findOne({ email })
    .then((user) => {
      const token = jwt.sign(
        {
          userId: user._id,
          userEmail: user.email,
        },
        process.env.SECRET_KEY,
        { expiresIn: "1h" }
      );

      user.resetToken = token;

      user
        .save()
        .then(() => {
          const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
              user: process.env.GMAIL_EMAIL,
              pass: process.env.GMAIL_PASSWORD,
            },
          });

          const mailOptions = {
            from: process.env.GMAIL_EMAIL,
            to: user.email,
            subject: "Réinitialisation de mot de passe",
            text: `Hey ${user.firstName} ! \n\nTu as récemment fait une demande de réinitialisation de mot de passe, copie et colle le token suivant sur la page de réinitialisation du mot de passe afin de modifier ton mot de passe : \n\n${token}\n\nCe token est valide pendant 1h. Passé ce délai, tu devras refaire une demande de réinitialisation de mot de passe si tu n'as pu modifier ton mot de passe à temps.\n\nAmicalement,\n\nEventMates`,
          };

          transporter.sendMail(mailOptions, (error) => {
            if (error) {
              console.log(error);
              return;
            }

            res.status(200).send({
              message: "Un mail a bien été envoyé à l'adresse mail saisie.",
            });
          });
        })
        .catch((error) =>
          res.status(404).send({
            message:
              "Un problème s'est produit lors de la mise à jour du token de réinitialisation.",
            error,
          })
        );
    })
    .catch((error) => {
      res.status(404).send({
        message:
          "Le mail n'a pas pu être envoyé à l'adresse saisie.",
        error,
      });
    });
};

module.exports = { sendEmail };
